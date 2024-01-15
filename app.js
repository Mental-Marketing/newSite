const express = require('express');
const ejs = require('ejs');
const app = express();

require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', function(req, res) {
    res.render('pages/index');
});
app.listen(4682, () => {
    console.log('Rodando muito fino na porta 4682');
});
