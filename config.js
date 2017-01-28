module.exports = {
    parse: {    
        appId: "siade",
        apiKey: "",
        masterKey: "master",
        serverURL: "http://localhost:8080/parse",
    },
    username: "admin",
    password: "admin",
    gerador: {
        agentes: {
            ativo: true,
            qtd: 10
        },
        bairros: {
            ativo: true,
            qtd: 2,
            tam_lat: { min: 4, max: 9 },
            tam_lon: { min: 3, max: 7 }
        },
        ciclos: {
            ativo: true,
            ano_base: 2016,
            qtd: 1
        }
    }
}
