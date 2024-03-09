const express = require('express');
const bodyParser = require('body-parser');
const mongoDB = require('mongodb');
ObjectId = require('mongodb').ObjectId

const app = express()

//Configura o middleware body-parser para analisar corpos de solicitações URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));

//Configura o middleware body-parser para analisar corpos de solicitações JSON
app.use(bodyParser.json())

const port = 8080;

app.listen(port); // Inicia o servidor para escutar na porta especificada



// Cria uma nova instância do objeto Db, que representa um banco de dados no MongoDB
const DB = new mongoDB.Db( 
    'instagram', // O nome do banco de dados
    new mongoDB.Server('localhost', 27017, {}), // A configuração do servidor MongoDB. Neste caso, o servidor está rodando localmente na porta 27017
    {} // Opções adicionais para o objeto Db
)

console.log(`Servidor HTTP: porta ${port}`)

app.get('/', (req, res) => {
    const resposta = { msg: 'ola' };
    res.send(resposta)
})


// Define uma rota POST para '/api'
app.post('/api', (req, res) => {

    const dados = req.body; // Extrai os dados do corpo da solicitação

    DB.open((err, mongoclient) => { // Abre uma conexão com o banco de dados
        mongoclient.collection('postagens', (err, collection) => { // Acessa a coleção 'postagens' no banco de dados
            collection.insert(dados, (err, records) => { // Insere os dados recebidos na coleção 'postagens'
                if (err) { // Se houver um erro durante a inserção
                    res.json(err) // Envia o erro como resposta
                } else { // Se a inserção for bem-sucedida
                    res.json(records) // Envia os registros inseridos como resposta
                }
                mongoclient.close() // Fecha a conexão com o banco de dados
            })
        })
    })
})


// Define uma rota GET para '/api'
app.get('/api', (req, res) => {
    DB.open((err, mongoclient) => {
        mongoclient.collection('postagens', (err, collection) => {
            collection.find().toArray((err, result) => {
                if (err) {
                    res.json(err);
                } else {
                    res.status().json(result);
                }
                mongoclient.close()
            })
        })
    })
})

// Define uma rota GET por ID para '/api'
app.get('/api/:id', (req, res) => {
    DB.open((err, mongoclient) => {
        mongoclient.collection('postagens', (err, collection) => {
            collection.find(ObjectId(req.params.id)).toArray((err, result) => {
                if (err) {
                    res.json(err);
                } else {
                    res.json(result);
                }
                mongoclient.close()
            })
        })
    })
});

//PUT by ID(update)
app.put('/api/:id', (req, res) => {
    DB.open((err, mongoclient) => {
        mongoclient.collection('postagens', (err, collection) => {
            collection.update(
                { _id: ObjectId(req.params.id) },
                { $set: { titulo: req.body.titulo } },
                {},
                (err, records) => {
                    if (err) {
                        res.json(err)
                    } else {
                        res.json(records)
                    }
                    mongoclient.close();
                }
            )
        })
    })
})


//DELETE BY ID
app.delete('/api/:id', (req, res) => {
    DB.open((err, mongoclient) => {
        mongoclient.collection('postagens', (err, collection) => {
            collection.remove({ _id: ObjectId(req.params.id) }, (err, records)=>{
                if (err) {
                    res.json(err)
                } else {
                    res.json(records)
                }
                mongoclient.close();
            })
        })
    })
})