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

        // Validação: Verificar se o novo item já está na collection
        const existe = await collection.findOne({ nome: novoItem.nome });

        if (existe) {
        return res.status(409).send('Esse item já existe na lista.');
        }

        // Adicionar o valor da propriedade na collection
        await collection.insertOne(novoItem) 

        res.status(201).send(novoItem)
        // console.log(lista)
    })

    // Endpoint Update: [PUT] /personagem
    // Requisição PUT: http://localhost:3000/personagem/1
    app.put('/personagem/:id', async function (req, res) {

        // Acessar o parâmetro id
        const id = req.params.id 

        // Validação: Checar se o item na requisição está na lista
        if (!ObjectId.isValid(id)) {
            return res.status(400).send('Item não encontrado.');
        }

        // Acessar o corpo da requisição
        const novoItem = req.body 

        // Validação: Verificar se a palavra "nome" está no corpo da requisição
        if (!novoItem || !novoItem.nome) {
            return res.status(400).send('O corpo da requisição tem que conter a propriedade "nome".')
        }

        // Validação: Verificar se o novo item já está na collection
        const existe = await collection.findOne({ nome: novoItem.nome });

        if (existe) {
            return res.status(409).send('Esse item já existe na lista.');
        }

        // Atualizar na collection o novo item pelo id - 1
        await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: novoItem}
        )

        res.status(201).send(novoItem)
    })

    // Endpoint Delete: [DELETE] /personagem/:id
    // Requisição DELETE: http://localhost:3000/personagem/id
    app.delete('/personagem/:id', async function (req, res) {

        // Acessar o parâmetro id
        const id = req.params.id

        // Validação: Chegar se o item na requisição está na lista
        if (!ObjectId.isValid(id)) {
            return res.status(400).send('Item não encontrado.');
        }

        // Remover o item da collection usando id - 1
        await collection.deleteOne({ _id: new ObjectId(id) }) 

        res.send('Item removido com sucesso: ' + id)
    })
}

app.listen(3000)

// Executa a função main() para conectar o Banco de Dados.
main()