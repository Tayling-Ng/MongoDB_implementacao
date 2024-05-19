const express = require('express')
const { MongoClient } = require('mongodb')
const app = express()

// Receber o corpo da requisição em json
app.use(express.json())

const dbUrl = 'mongodb+srv://admin:1a23456789@clusteraula.f3ld0ox.mongodb.net'
const dbName = 'MongoDB_implementacao'

// Declarar a função de conxeção com o Banco de dados
async function main() {
    const client = new MongoClient(dbUrl)
    // console.log('Conectando ao banco de dados...')
    await client.connect()
    // console.log('Banco de dados conectado com sucesso!')

    // Estabelecer a conexão com o Banco de dados
    const db = client.db(dbName)
    const collection = db.collection('personagem')

    // Requisição GET: http://localhost:3000
    app.get('/', function (req, res) {
        res.send('Hi Folks!')
    })

    const lista = ['Java', 'Kotlin', 'Android']

    // Endpoint Read All: [GET] /personagem
    // Requisição GET: http://localhost:3000/personagem
    app.get('/personagem', function (req, res) {
        res.send(lista)
    })

    // Endpoint Read by ID: [GET] /personagem/:id
    // Requisição GET: http://localhost:3000/personagem/id
    app.get('/personagem/:id', function (req, res) {

        const id = req.params.id // Acessar o parâmetro id

        const item = lista[id - 1] // Acessar o item da lista usando id - 1

        if (!item) {
            return res.status(404).send('Item não encontrado.')
        }

        res.send(item)
    })

    // Endpoint Create: [POST] /personagem
    // Escrever o corpo da requisição
    // Requisição POST: http://localhost:3000/personagem
    app.post('/personagem', function (req, res) {

        const body = req.body // Acessar o corpo da requisição
        // console.log(body)

        const novoItem = body.nome // Acessar a propriedade nome no corpo da requisião

        // Validação: Verificar se a palavra "nome" está no corpo da requisição
        if (!novoItem) {
            return res.status(400).send('O corpo da requisição tem que conter a propriedade "nome".')
        }

        // Validação: Verificar se o novo item já está na lista
        if (lista.includes(novoItem)) {
            return res.status(409).send('Esse item já existe na lista.')
        }

        lista.push(novoItem) // Adicionar o valor da propriedade na lista

        res.status(201).send('Item adicionado com sucesso!: ' + novoItem)
        // console.log(lista)
    })

    // Endpoint Update: [PUT] /personagem
    // Requisição PUT: http://localhost:3000/personagem/1
    app.put('/personagem/:id', function (req, res) {

        const id = req.params.id // Acessar o parâmetro id

        // Validação: Chegar se o item na requisição está na lista
        if (!lista[id - 1]) {
            return res.status(404).send('Item não encontrado.')
        }

        const body = req.body // Acessar o corpo da requisição

        const novoItem = body.nome // Acessar a propriedade nome no corpo da requisião

        // Validação: Verificar se a palavra "nome" está no corpo da requisição
        if (!novoItem) {
            return res.status(400).send('O corpo da requisição tem que conter a propriedade "nome".')
        }

        // Validação: Verificar se o novo item já está na lista
        if (lista.includes(novoItem)) {
            return res.status(409).send('Esse item já existe na lista.')
        }

        lista[id - 1] = novoItem // Atualizar na lista o novo item pelo id - 1

        res.status(201).send('Item atualizado com sucesso!: ' + novoItem)
    })

    // Endpoint Delete: [DELETE] /personagem/:id
    // Requisição DELETE: http://localhost:3000/personagem/id
    app.delete('/personagem/:id', function (req, res) {

        const id = req.params.id // Acessar o parâmetro id

        // Validação: Chegar se o item na requisição está na lista
        if (!lista[id - 1]) {
            return res.status(404).send('Item não encontrado.')
        }

        delete lista[id - 1] // Remover o item da lista usando id - 1

        res.send('Item removido com sucesso!')
    })
}

app.listen(3000)

// Executa a função main() para conectar o Banco de Dados.
main()