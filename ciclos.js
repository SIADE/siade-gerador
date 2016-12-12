const Parse = require('parse/node')
const math = require('mathjs')
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
    console.log("Apagando dados antigos...")
    return limpar_dados().then(function() {    
        return gerar_ciclos(config)
    }).then(function(){
        console.log("Concluído.\n")
    })
}

function limpar_dados() {
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
    promise = Parse.Promise.as()
    math.range(0, config.qtd).forEach(function(i) {
        data_fim = new Date(data_inicio).add({days: utils.random_number(50, 70)})
        promise = promise.then(function() {
            return gerar_ciclo(Number(i)+1, config.ano_base, new Date(data_inicio), new Date(data_fim))
        }).then(function(ciclo){
            return gerar_trabalhos_ciclo(ciclo)
        })
        data_inicio = new Date(data_fim).add({days: utils.random_number(1, 7)})
        data_fim = new Date(data_inicio).add({days: utils.random_number(30, 60)})
    })
    return promise
}

function gerar_ciclo(numero, ano_base, data_inicio) {
    console.log("Ciclo %d/%d (%s a %s)", numero, ano_base,
                data_inicio.toFormat("DD/MM/YYYY"), data_fim.toFormat("DD/MM/YYYY"))
    ciclo = new Ciclo()
    ciclo.set("numero", numero)
    ciclo.set("ano_base", ano_base)
    ciclo.set("data_inicio", data_inicio)
    ciclo.set("data_fim", data_fim)
    ciclo.set("fechado_em", data_fim)
    ciclo.set("atividade", 3)
    return ciclo.save()
}

function gerar_trabalhos_ciclo(ciclo) {
    var quadras_por_agente, total_quadras
    var quadra_skip = 0
    promise = Parse.Promise.as()
    promise = promise.then(function() {
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
    return promise
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
            return gerar_trabalho(ciclo, agente, quadras).then(function(){
                return result
            })
        }).then(function(result) {
            return gerar_visitas_quadras(ciclo, agente, quadras)
        })
    })
    return promise
}

function gerar_trabalho(ciclo, agente, quadras) {
    console.log(" Trabalho agente %s", agente.get("nome"))
    trabalho = new Trabalho()
    trabalho.set("ciclo", ciclo)
    trabalho.set("agente", agente)
    trabalho.quadras = trabalho.relation("quadras")
    trabalho.quadras.add(quadras)
    return trabalho.save()
}

function gerar_visitas_quadras(ciclo, agente, quadras) {
    console.log(" Visitas agente %s ", agente.get("nome"))
    query = new Parse.Query("Imovel").containedIn("quadra", quadras)
    return query.count().then(function(total) {
        promise = Parse.Promise.as()
        math.range(0, Math.ceil(total / 100)).forEach(function(page) {
            promise = promise.then(function() {
                skip = page * 100
                limit = (total - skip) > 100 ? 100 : (total - skip)
                return query.limit(limit).skip(skip).find()
            }).then(function(imoveis) {
                subPromise = Parse.Promise.as()
                imoveis.forEach(function(imovel) {
                    subPromise = subPromise.then(function() {
                        return gerar_visita(ciclo, agente, imovel)
                    })
                })
                return subPromise
            })
        })
        return promise
    }).then(function(){
        console.log("")
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
    visita.set("pendencia", 0)
    return visita.save()
}

module.exports = {
    gerar_dados: gerar_dados
}
