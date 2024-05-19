const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
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
    app.get('/personagem', async function (req, res) {

        // Acessar a lista de itens na coleção no MongoDB
        const itens = await collection.find().toArray()

        // Enviar a lista como resultado
        res.send(itens)
    })

    // Endpoint Read by ID: [GET] /personagem/:id
    // Requisição GET: http://localhost:3000/personagem/id
    app.get('/personagem/:id', async function (req, res) {

        // Acessar o parâmetro id
        const id = req.params.id

        // Acessar o item da collection
        const item = await collection.findOne({_id: new ObjectId(id)}) 

        if (!item) {
            return res.status(404).send('Item não encontrado.')
        }

        res.send(item)
    })

    // Endpoint Create: [POST] /personagem
    // Escrever o corpo da requisição
    // Requisição POST: http://localhost:3000/personagem
    app.post('/personagem', async function (req, res) {

        // Acessar o corpo da requisição
        const novoItem = req.body 
        // console.log(body)

        // Validação: Verificar se a palavra "nome" está no corpo da requisição
        if (!novoItem || !novoItem.nome) {
            return res.status(400).send('O corpo da requisição tem que conter a propriedade "nome".')
        }

        // Validação: Verificar se o novo item já está na lista
        // if (lista.includes(novoItem)) {
        //     return res.status(409).send('Esse item já existe na lista.')
        // }

        // Adicionar o valor da propriedade na collection
        await collection.insertOne(novoItem) 

        res.status(201).send(novoItem)
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