const Parse = require("parse/node")
const config = require("./config")
const agentes = require("./agentes")
const bairros = require("./bairros")
const ciclos = require("./ciclos")

Parse.initialize(config.parse.appId, config.parse.apiKey)
Parse.serverURL = config.parse.serverURL

Parse.User.logIn(config.username, config.password).then(function() {
    console.log("Usuario logado")
    return gerar_dados()
}).catch(function(error) {
    // Show the error message somewhere and let the user try again.
    console.log("Error: ", error);
})

function gerar_dados() {
    return Parse.Promise.as().then(function(){
        return agentes.gerar_agentes(config.gerador.agentes)
    }).then(function(){
        return bairros.gerar_dados(config.gerador.bairros)
    }).then(function() {
        return ciclos.gerar_dados(config.gerador.ciclos)
    })
}
