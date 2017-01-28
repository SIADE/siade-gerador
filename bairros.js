const Parse = require('parse/node')
const faker = require("faker")
const rwc = require("random-weighted-choice")
const util = require("util")
const utils = require("./utils")

const bairros_nomes = [
    'Aarão Reis', 'Acaba Mundo', 'Acaiaca', 'Ademar Maldonado', 'Aeroporto', 'Aguas Claras', 'Alípio De Melo',
    'Alpes',
    'Alta Tensão 1ª Seção', 'Alta Tensão 2ª Seção', 'Alto Caiçaras', 'Alto Das Antenas', 'Alto Dos Pinheiros',
    'Alto Vera Cruz',
    'Álvaro Camargos', 'Ambrosina', 'Andiroba', 'Antonio Ribeiro De Abreu 1ª Seção', 'Aparecida 7ª Seção', 'Ápia',
    'Apolonia', 'Araguaia', 'Atila De Paiva', 'Bacurau', 'Bairro Das Indústrias Ii', 'Baleia',
    'Barão Homem De Melo 1ª Seção', 'Barão Homem De Melo 2ª Seção', 'Barão Homem De Melo 3ª Seção',
    'Barreiro', 'Beija Flor', 'Beira Linha', 'Bela Vitoria', 'Belmonte', 'Bernadete', 'Betânia', 'Biquinhas',
    'Boa Esperança', 'Boa União 1ª Seção', 'Boa União 2ª Seção', 'Boa Viagem', 'Boa Vista', 'Bom Jesus', 'Bonfim',
    'Bonsucesso', 'Brasil Industrial', 'Braúnas', 'Buraco Quente', 'Cabana Do Pai Tomás',
    'Cachoeirinha', 'Caetano Furquim', 'Caiçara - Adelaide', 'Calafate', 'Califórnia', 'Camargos', 'Campo Alegre',
    'Camponesa 1ª Seção', 'Camponesa 2ª Seção', 'Canaa', 'Canadá', 'Candelaria', 'Capitão Eduardo', 'Cardoso',
    'Casa Branca', 'Castanheira', 'Cdi Jatoba', 'Cenaculo', 'Céu Azul', 'Chácara Leonina',
    'Cidade Jardim Taquaril', 'Cinquentenário', 'Colégio Batista', 'Comiteco', 'Concórdia',
    'Cônego Pinheiro 1ª Seção',
    'Cônego Pinheiro 2ª Seção', 'Confisco', 'Conjunto Bonsucesso', 'Conjunto Califórnia I',
    'Conjunto Califórnia Ii',
    'Conjunto Capitão Eduardo', 'Conjunto Celso Machado', 'Conjunto Floramar',
    'Conjunto Jardim Filadélfia', 'Conjunto Jatoba', 'Conjunto Lagoa', 'Conjunto Minas Caixa',
    'Conjunto Novo Dom Bosco', 'Conjunto Paulo Vi', 'Conjunto Providencia', 'Conjunto Santa Maria',
    'Conjunto São Francisco De Assis', 'Conjunto Serra Verde', 'Conjunto Taquaril', 'Copacabana', 'Coqueiros',
    'Corumbiara',
    'Custodinha', 'Das Industrias I', 'Delta', 'Diamante', 'Distrito Industrial Do Jatoba', 'Dom Bosco',
    'Dom Cabral',
    'Dom Joaquim', 'Dom Silverio', 'Dona Clara', 'Embaúbas', 'Engenho Nogueira', 'Ermelinda', 'Ernesto Nascimento',
    'Esperança', 'Estrela', 'Estrela Do Oriente', 'Etelvina Carneiro', 'Europa',
    'Eymard', 'Fazendinha', 'Flamengo', 'Flavio De Oliveira', 'Flavio Marques Lisboa', 'Floramar', 'Frei Leopoldo',
    'Gameleira', 'Garças', 'Glória', 'Goiania', 'Graça', 'Granja De Freitas', 'Granja Werneck', 'Grota', 'Grotinha',
    'Guarani', 'Guaratã', 'Havaí', 'Heliopolis', 'Horto Florestal', 'Inconfidência',
    'Indaiá', 'Independência', 'Ipe', 'Itapoa', 'Itatiaia', 'Jaqueline', 'Jaraguá', 'Jardim Alvorada',
    'Jardim Atlântico', 'Jardim Do Vale', 'Jardim Dos Comerciarios', 'Jardim Felicidade', 'Jardim Guanabara',
    'Jardim Leblon', 'Jardim Montanhês', 'Jardim São José', 'Jardim Vitoria', 'Jardinópolis', 'Jatobá',
    'João Alfredo', 'João Paulo Ii', 'Jonas Veiga', 'Juliana', 'Lagoa', 'Lagoinha', 'Lagoinha Leblon', 'Lajedo',
    'Laranjeiras', 'Leonina', 'Leticia', 'Liberdade', 'Lindéia', 'Lorena', 'Madre Gertrudes', 'Madri',
    'Mala E Cuia',
    'Manacas', 'Mangueiras', 'Mantiqueira', 'Marajó', 'Maravilha', 'Marçola', 'Maria Goretti',
    'Maria Helena', 'Maria Tereza', 'Maria Virgínia', 'Mariano De Abreu', 'Marieta 1ª Seção', 'Marieta 2ª Seção',
    'Marieta 3ª Seção', 'Marilandia', 'Mariquinhas', 'Marmiteiros', 'Milionario', 'Minas Brasil', 'Minas Caixa',
    'Minaslandia', 'Mineirão', 'Miramar', 'Mirante', 'Mirtes', 'Monsenhor Messias', 'Monte Azul',
    'Monte São José', 'Morro Dos Macacos', 'Nazare', 'Nossa Senhora Aparecida', 'Nossa Senhora Da Aparecida',
    'Nossa Senhora Da Conceição', 'Nossa Senhora De Fátima', 'Nossa Senhora Do Rosário', 'Nova America',
    'Nova Cachoeirinha', 'Nova Cintra', 'Nova Esperança', 'Nova Floresta', 'Nova Gameleira', 'Nova Pampulha',
    'Novo Aarão Reis', 'Novo Das Industrias', 'Novo Glória', 'Novo Santa Cecilia', 'Novo Tupi', 'Oeste', 'Olaria',
    "Olhos D'água", 'Ouro Minas', 'Pantanal', 'Paquetá', 'Paraíso', 'Parque São José', 'Parque São Pedro',
    'Paulo Vi',
    'Pedreira Padro Lopes', 'Penha', 'Petropolis', 'Pilar', 'Pindorama', 'Pindura Saia',
    'Piraja', 'Piratininga', 'Pirineus', 'Pompéia', 'Pongelupe', 'Pousada Santo Antonio', 'Primeiro De Maio',
    'Providencia', 'Ribeiro De Abreu', 'Rio Branco', 'Salgado Filho', 'Santa Amelia', 'Santa Branca',
    'Santa Cecilia',
    'Santa Cruz', 'Santa Helena', 'Santa Inês', 'Santa Isabel', 'Santa Margarida', 'Santa Maria',
    'Santa Rita', 'Santa Rita De Cássia', 'Santa Sofia', 'Santa Terezinha', 'Santana Do Cafezal', 'Santo André',
    'São Benedito', 'São Bernardo', 'São Cristóvão', 'São Damião', 'São Francisco', 'São Francisco Das Chagas',
    'São Gabriel', 'São Geraldo', 'São Gonçalo', 'São João', 'São João Batista', 'São Jorge 1ª Seção',
    'São Jorge 2ª Seção', 'São Jorge 3ª Seção', 'São José', 'São Marcos', 'São Paulo', 'São Salvador',
    'São Sebastião',
    'São Tomaz', 'São Vicente', 'Satelite', 'Saudade', 'Senhor Dos Passos', 'Serra Do Curral', 'Serra Verde',
    'Serrano',
    'Solar Do Barreiro', 'Solimoes', 'Sport Club', 'Suzana', 'Taquaril',
    'Teixeira Dias', 'Tiradentes', 'Tirol', 'Tres Marias', 'Trevo', 'Túnel De Ibirité', 'Tupi A', 'Tupi B', 'União',
    'Unidas', 'Universitário', 'Universo', 'Urca', 'Vale Do Jatoba', 'Varzea Da Palma', 'Venda Nova', 'Ventosa',
    'Vera Cruz', 'Vila Aeroporto', 'Vila Aeroporto Jaraguá', 'Vila Antena', 'Vila Antena Montanhês',
    'Vila Atila De Paiva', 'Vila Bandeirantes', 'Vila Barragem Santa Lúcia', 'Vila Batik', 'Vila Betânia',
    'Vila Boa Vista', 'Vila Calafate', 'Vila Califórnia', 'Vila Canto Do Sabiá', 'Vila Cemig', 'Vila Cloris',
    'Vila Copacabana', 'Vila Copasa', 'Vila Coqueiral', 'Vila Da Amizade', 'Vila Da Ária', 'Vila Da Luz',
    'Vila Da Paz', 'Vila Das Oliveiras', 'Vila Do Pombal', 'Vila Dos Anjos', 'Vila Ecológica',
    'Vila Engenho Nogueira',
    'Vila Esplanada', 'Vila Formosa', 'Vila Fumec', 'Vila Havaí', 'Vila Independencia 1ª Seção',
    'Vila Independencia 2ª Seção', 'Vila Independencia 3ª Seção', 'Vila Inestan', 'Vila Ipiranga',
    'Vila Jardim Alvorada', 'Vila Jardim Leblon', 'Vila Jardim São José', 'Vila Madre Gertrudes 1ª Seção',
    'Vila Madre Gertrudes 2ª Seção', 'Vila Madre Gertrudes 3ª Seção', 'Vila Madre Gertrudes 4ª Seção',
    'Vila Maloca',
    'Vila Mangueiras', 'Vila Mantiqueira', 'Vila Maria', 'Vila Minaslandia', 'Vila Nossa Senhora Do Rosário',
    'Vila Nova', 'Vila Nova Cachoeirinha 1ª Seção', 'Vila Nova Cachoeirinha 2ª Seção',
    'Vila Nova Cachoeirinha 3ª Seção', 'Vila Nova Dos Milionarios', 'Vila Nova Gameleira 1ª Seção',
    'Vila Nova Gameleira 2ª Seção', 'Vila Nova Gameleira 3ª Seção', 'Vila Nova Paraíso', 'Vila Novo São Lucas',
    'Vila Oeste', "Vila Olhos D'água",
    'Vila Ouro Minas', 'Vila Paquetá', 'Vila Paraíso', 'Vila Petropolis', 'Vila Pilar', 'Vila Pinho',
    'Vila Piratininga', 'Vila Piratininga Venda Nova', 'Vila Primeiro De Maio', 'Vila Puc', 'Vila Real 1ª Seção',
    'Vila Real 2ª Seção', 'Vila Rica', 'Vila Santa Monica 1ª Seção', 'Vila Santa Monica 2ª Seção',
    'Vila Santa Rosa',
    'Vila Santo Antônio', 'Vila Santo Antônio Barroquinha', 'Vila São Dimas', 'Vila São Francisco',
    'Vila São Gabriel',
    'Vila São Gabriel Jacui', 'Vila São Geraldo', 'Vila São João Batista', 'Vila São Paulo', 'Vila São Rafael',
    'Vila Satélite', 'Vila Sesc', 'Vila Sumaré', 'Vila Suzana Primeira Seção', 'Vila Suzana Segunda Seção',
    'Vila Tirol', 'Vila Trinta E Um De Março', 'Vila União', 'Vila Vista Alegre', 'Virgínia', 'Vista Alegre',
    'Vista Do Sol', 'Vitoria', 'Vitoria Da Conquista', 'Xangri-Lá', 'Xodo-Marize', 'Zilah Sposito', 'Outro',
    'Novo São Lucas', 'Esplanada', 'Estoril', 'Novo Ouro Preto', 'Ouro Preto', 'Padre Eustáquio', 'Palmares',
    'Palmeiras', 'Vila De Sá', 'Floresta', 'Anchieta', 'Aparecida', 'Grajaú', 'Planalto', 'Bandeirantes',
    'Gutierrez',
    'Jardim América', 'Renascença', 'Barro Preto', 'Barroca', 'Sagrada Família', 'Ipiranga', 'Belvedere',
    'Santa Efigênia', 'Santa Lúcia', 'Santa Monica', 'Vila Jardim Montanhes', 'Santa Rosa', 'Santa Tereza',
    'Buritis', 'Vila Paris', 'Santo Agostinho', 'Santo Antônio', 'Caiçaras', 'São Bento', 'Prado', 'Lourdes',
    'Fernão Dias', 'Carlos Prates', 'Carmo', 'Luxemburgo', 'São Lucas', 'São Luiz', 'Mangabeiras', 'São Pedro',
    'Horto',
    'Cidade Jardim', 'Castelo', 'Cidade Nova', 'Savassi', 'Serra', 'Silveira', 'Sion', 'Centro',
    'Alto Barroca', 'Nova Vista', 'Coração De Jesus', 'Coração Eucarístico', 'Funcionários', 'Cruzeiro',
    'João Pinheiro', 'Nova Granada', 'Nova Suíça', 'Itaipu'
]

var Bairro = Parse.Object.extend("Bairro")
var Logradouro = Parse.Object.extend("Logradouro")
var Quadra = Parse.Object.extend("Quadra")
var Lado = Parse.Object.extend("Lado")
var Imovel = Parse.Object.extend("Imovel")

function random_bairro_nome() {
    return bairros_nomes[(Math.random() * bairros_nomes.length).toFixed(0)]
}

function gerar_dados(config) {
    if(!config.ativo) {
        console.log("Não gerar bairros")
        return Parse.Promise.resolve()
    }
    console.log("Gerando %d Bairros", config.qtd)
    return limpar_dados().then(function() {    
        return gerar_bairros(config)
    }).then(function(){
        console.log("Concluído.\n")
    })
}

function limpar_dados() {
    console.log("Apagando dados antigos...")
    classes = [Bairro, Logradouro, Quadra, Lado, Imovel]
    promises = classes.map(function(cls) {
        return utils.deleteAll(new Parse.Query(cls))
    })
    return Parse.Promise.when(promises)
}

function gerar_bairros(config) {
    promise = Parse.Promise.as()
    var tam_lat, tam_lon
    for(var i = 0; i < config.qtd; i++) {
        promise = promise.then(function() {
            tam_lat = utils.random_number(config.tam_lat.min, config.tam_lat.max)
            tam_lon = utils.random_number(config.tam_lon.min, config.tam_lon.max)
            return gerar_bairro(tam_lat, tam_lon)
        })
    }
    return promise
}

function gerar_bairro(tam_lat, tam_lon) {
    var nome = random_bairro_nome()
    console.log("* Bairro: %s (%d x %d)", nome, tam_lat, tam_lon)
    bairro = new Bairro()
    bairro.set("nome", nome)
    return bairro.save().then(function(bairro) {
        return gerar_quadras(bairro, tam_lat, tam_lon)
    })
}

function gerar_quadras(bairro, qtd_x, qtd_y) {
    numero_quadra = 1
    var ruaCima, ruaBaixo, ruaEsquerda, ruaDireira
    // fileiras de quadras
    promise = Parse.Promise.as()
    for(var x = 0; x < qtd_x; x++) {
        if(x > 0) {
            ruaCima = ruaBaixo
        } else {
            ruaCima = gerar_rua()
        }
        ruaBaixo = gerar_rua()
        // quadras da fileira
        for(var y = 0; y < qtd_y; y++) {
            if(y > 0) {
                ruaEsquerda = ruaDireira
            } else {
                ruaEsquerda = gerar_rua()
            }
            ruaDireira = gerar_rua()
            promise = promise.then(function() {
                altura = utils.random_number(6, 20)
                largura = utils.random_number(4, 40)
                return gerar_quadra_com_lados(bairro, numero_quadra++, [
                    {logradouro: ruaEsquerda, numeros: utils.range(x * altura + 2, (x + 1) * altura + 2, 2)},
                    {logradouro: ruaCima, numeros: utils.range(y * largura + 1, (y + 1) * largura + 1, 2)},
                    {logradouro: ruaDireira, numeros: utils.range(x * altura + 1, (x + 1) * altura + 1, 2)},
                    {logradouro: ruaBaixo, numeros: utils.range(y * largura + 2, (y + 1) * largura + 2, 2)}
                ])
            })
        }
    }
    return promise
}

function gerar_rua() {
    rua = new Logradouro()
    rua.set("nome", faker.address.streetName())
    return rua
}

function gerar_quadra_com_lados(bairro, numero, lados) {
    total_imoveis = lados.reduce(function(prev, curr, idx, arr) {
        return prev + curr.numeros.length
    }, 0)
    console.log("  Quadra %d (%d imoveis)", numero, total_imoveis)

    promise = gerar_quadra(bairro, numero, 4, total_imoveis)
    lados.forEach(function(item, idx) {
        promise = promise.then(function() {
            return item.logradouro.save()
        }).then(function(logradouro) {
            return gerar_lado(quadra, Number(idx)+1, logradouro, item.numeros.length)
        }).then(function(lado) {
            subPromise = Parse.Promise.as()
            item.numeros.forEach(function(value, idx) {
                subPromise = subPromise.then(function() {
                    return gerar_imovel(lado, value, Number(idx[0])+1)
                })
            })
            return subPromise
        }).then(function(){
            console.log("")
        })
    })
    return promise
}

function gerar_quadra(bairro, numero, total_lados, total_imoveis) {
    quadra = new Quadra()
    quadra.set("bairro", bairro)
    quadra.set("numero", numero)
    quadra.set("total_lados", total_lados)
    quadra.set("total_imoveis", total_imoveis)
    return quadra.save()
}

function gerar_lado(quadra, numero, logradouro, total_imoveis) {
    process.stdout.write(util.format("    Lado %d, %s, %s ",
                         numero, logradouro.get("nome"), total_imoveis))
    lado = new Lado()
    lado.set("quadra", quadra)
    lado.set("numero", numero)
    lado.set("logradouro", logradouro)
    return lado.save()
}

function gerar_imovel(lado, numero, ordem) {
    process.stdout.write(".")
    imovel = new Imovel()
    imovel.set("quadra", lado.get("quadra"))
    imovel.set("lado", lado)
    imovel.set("numero", numero)
    imovel.set("ordem", ordem)
    imovel.set("tipo", utils.weighted_choice([0, 3, 3, 1, 2]))
    imovel.set("habitantes", utils.weighted_choice([1, 2, 3, 3, 2, 1]))
    imovel.set("caes", utils.weighted_choice([2, 3, 1, 1]))
    imovel.set("gatos", utils.weighted_choice([2, 3, 1, 1]))
    if(imovel.get("tipo") == 3) {
        imovel.set("habitantes", 0)
    }
    return imovel.save()
}

module.exports = {
    gerar_dados: gerar_dados
}
