module.exports = {
    parse: {    
        appId: "myAppId",
        apiKey: "",
        masterKey: "master",
        serverURL: "http://localhost:1337/parse",
    },
    username: "admin",
    password: "admin",
    gerador: {
        agentes: {
            ativo: true,
            qtd: 12
        },
        bairros: {
            ativo: true,
            qtd: 3,
            tam_lat: { min: 4, max: 9 },
            tam_lon: { min: 3, max: 7 }
        },
        ciclos: {
            ativo: true,
            ano_base: 2016,
            qtd: 4
        }
    }
}
