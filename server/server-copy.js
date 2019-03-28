const express = require('express');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();
const port = 3000;

const mongoUrl = 'mongodb://localhost:27017/scriptioner';

app.use(cors());

MongoClient.connect(mongoUrl, {useNewUrlParser: true}, (err, client) => {
    const database = client.db('scriptioner');
    app.get('/api', (req, res) => {
        console.log('Data accessed!');
        database.collection('questions')
            .find()
            .toArray()
            .then((data) => {
                res.send(data);
        });
    });
    app.listen(port, () => console.log(`Running on port ${port}`));
});

app.use(express.static(__dirname + '/dist/scriptioner'));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname));
});