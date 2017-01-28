const Parse = require('parse/node')
const faker = require("faker")
const utils = require("./utils")
require('date-utils').language("pt-BR")

var Ciclo = Parse.Object.extend("Ciclo")
var Trabalho = Parse.Object.extend("Trabalho")
var Visita = Parse.Object.extend("Visita")

function gerar_dados(config) {
    if(!config.ativo) {
        console.log("Não gerar ciclos")
        return Parse.Promise.resolve()
    }
    console.log("Gerar %d ciclos", config.qtd)
    return limpar_dados().then(function() {    
        return gerar_ciclos(config)
    }).then(function(){
        console.log("Concluído.\n")
    })
}

function limpar_dados() {
    console.log("Apagando dados antigos...")
    classes = [Ciclo, Trabalho, Visita]
    promises = classes.map(function(cls) {
        return utils.deleteAll(new Parse.Query(cls))
    })
    return Parse.Promise.when(promises)
}

function gerar_ciclos(config) {
    console.log("Gerando %d ciclos (ano base %d)", config.qtd, config.ano_base)
    data_inicio = new Date(config.ano_base, 0, 5).add({days: utils.random_number(1, 7)})
    data_fim = new Date(data_inicio).add({days: utils.random_number(30, 60)})
    ciclos = utils.range(0, config.qtd).map(function(it, i, arr) {
        data_fim = new Date(data_inicio).add({days: utils.random_number(50, 70)})
        ciclo = [it+1, config.ano_base, data_inicio, data_fim, (i < arr.length-1)]
        data_inicio = new Date(data_fim).add({days: utils.random_number(1, 7)})
        return ciclo
    })
    promise = Parse.Promise.as()
    ciclos.forEach(function(it){
        promise = promise.then(function() {
            return gerar_ciclo.apply(this, it)
        }).then(function(ciclo){
            return gerar_trabalhos_ciclo(ciclo)
        })
    })
    return promise
}

function gerar_ciclo(numero, ano_base, data_inicio, data_fim, fechado) {
    console.log("Ciclo %d/%d (%s a %s) %s", numero, ano_base,
                data_inicio.toFormat("DD/MM/YYYY"), data_fim.toFormat("DD/MM/YYYY"),
                fechado?"fechado":"")
    ciclo = new Ciclo()
    ciclo.set("numero", numero)
    ciclo.set("ano_base", ano_base)
    ciclo.set("data_inicio", data_inicio)
    ciclo.set("data_fim", data_fim)
    ciclo.set("fechado", fechado)
    ciclo.set("atividade", 3)
    return ciclo.save()
}

function gerar_trabalhos_ciclo(ciclo) {
    var total_quadras
    var quadra_skip = 0
    return Parse.Promise.as().then(function() {
        // contar total de quadras
        return new Parse.Query("Quadra").select().count()
    }).then(function(count){
        total_quadras = count
        // obter contar todos os agentes
        return new Parse.Query(Parse.User).select("nome").limit(1000)
                                          .equalTo("tipo", 0).find()
    }).then(function(agentes) {
        return gerar_trabalhos_agentes(ciclo, agentes, total_quadras)
    })
}

function gerar_trabalhos_agentes(ciclo, agentes, total_quadras) {
    quadras_por_agente = Math.floor(total_quadras / agentes.length)
    console.log("Quadras por agente: %d", quadras_por_agente)
    promise = Parse.Promise.as()
    agentes.forEach(function(agente, idx) {
        var quadras
        promise = promise.then(function() {
            query = new Parse.Query("Quadra").select().skip(quadras_por_agente*idx)
                                             .limit(quadras_por_agente)
            return query.find()
        }).then(function(result){
            quadras = result
            return gerar_trabalho(ciclo, agente, quadras)
        }).then(function(trabalho) {
            return gerar_visitas_quadras(trabalho)
        })
    })
    return promise
}

function gerar_trabalho(ciclo, agente, quadras) {
    console.log(" Trabalho agente %s", agente.get("nome"))
    trabalho = new Trabalho()
    trabalho.set("ciclo", ciclo)
    trabalho.set("agente", agente)
    trabalho.relation("quadras").add(quadras)
    trabalho.quadras = quadras
    trabalho.percentual = (ciclo.get("fechado")) ? 100 : utils.random_number(50, 90)
    return trabalho.save()
}

function gerar_visitas_quadras(trabalho) {
    agente = trabalho.get("agente")
    console.log(" Visitas agente %s ", agente.get("nome"))
    ciclo = trabalho.get("ciclo")
    total_imoveis = 0
    total_visitas = 0
    query = new Parse.Query("Imovel").containedIn("quadra", trabalho.quadras)
    return query.count().then(function(total) {
        promise = Parse.Promise.as()
        utils.range(0, Math.ceil(total / 100)).forEach(function(page) {
            promise = promise.then(function() {
                skip = page * 100
                limit = (total - skip) > 100 ? 100 : (total - skip)
                return query.limit(limit).skip(skip).find()
            }).then(function(imoveis) {
                subPromise = Parse.Promise.as()
                count = Math.round(imoveis.length * trabalho.percentual / 100)
                total_imoveis += imoveis.length
                imoveis.slice(0, count).forEach(function(imovel) {
                    subPromise = subPromise.then(function() {
                        total_visitas += 1
                        return gerar_visita(ciclo, agente, imovel)
                    })
                })
                return subPromise
            })
        })
        return promise
    }).then(function(){
        console.log(" %d / %d (%s%)", total_visitas, total_imoveis, trabalho.percentual)
        trabalho.set("total_imoveis", total_imoveis)
        trabalho.set("total_visitas", total_visitas)
        return trabalho.save()
    })
}

function gerar_visita(ciclo, agente, imovel) {
    process.stdout.write(".")
    data_visita = faker.date.between(ciclo.get("data_inicio"), ciclo.get("data_fim"))
    visita = new Visita()
    visita.set("ciclo", ciclo)
    visita.set("agente", agente)
    visita.set("imovel", imovel)
    visita.set("data_hora", data_visita)
    visita.set("tipo", 0)
    pendencia = utils.weighted_choice([7, 2, 1])
    visita.set("pendencia", pendencia)
    visita.set("imovel_inspecionado", (!pendencia)?true:false)

    // tratamento
    depositos_tratados = utils.random_number(0, 5)
    visita.set("depositos_tratados", depositos_tratados)
    if(depositos_tratados > 0) {
        visita.set("imovel_tratado", true)
    } else {
        visita.set("imovel_tratado", false)
    }
    ["depositos_eliminados", "caixa_agua_elevada", "caixa_agua_baixa",
    "pequenos_depositos_moveis", "depositos_fixos",
    "pneus", "lixo", "depositos_naturais"].forEach(function(it) {
        visita.set(it, utils.random_number(0, 5))
    })

    return visita.save()
}

module.exports = {
    gerar_dados: gerar_dados
}
