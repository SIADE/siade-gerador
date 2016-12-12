const Parse = require('parse/node')
const util = require('util')
const CPF = require("gerador-validador-cpf")
const faker = require("faker")

var Agente = Parse.User

function gerar_agentes(config) {
    if(!config.ativo) {
        console.log("Não gerar agentes")
        return Parse.Promise.resolve()
    }
    console.log("Gerando %d agentes", config.qtd)
    all_agentes = []
    for(var i = 0; i < config.qtd; i++) {       
        var nome = faker.name.findName()
        var cpf = CPF.generate("digits")
        console.log("* Agente: %s (CPF %s)", nome, cpf)
        agente = new Agente()
        agente.set("nome", nome)
        agente.set("username", cpf)
        agente.set("password", "")
        agente.set("tipo", 0)
        all_agentes.push(agente)
    }
    return Parse.Object.saveAll(all_agentes)
}

module.exports = {
    gerar_agentes: gerar_agentes
}
