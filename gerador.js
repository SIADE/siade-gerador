const Parse = require("parse/node")
const utils = require("./utils")
const config = require("./config")
const agentes = require("./agentes")
const bairros = require("./bairros")
const ciclos = require("./ciclos")

Parse.initialize(config.parse.appId, config.parse.apiKey)
Parse.serverURL = config.parse.serverURL
Parse.masterKey = config.parse.masterKey

Parse.User.logIn(config.username, config.password).then(function() {
    console.log("Usuario logado")
}).catch(function(error) {
    // usuário não existe, criar usuário
    if(error.code == 101) {
        return agentes.gerar_admin(config.username, config.password).then(u => {
            console.log("Usuario criado")
        })
    } else {
        console.log("Error: ", error)
    }
}).then(function() {
    return gerar_dados()
}).catch(function(error) {
    // Show the error message somewhere and let the user try again.
    console.log("Error: ", error)
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
