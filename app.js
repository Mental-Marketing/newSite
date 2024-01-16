const express = require('express');
const ejs = require('ejs');
const app = express();

require('dotenv').config();
console.log(process.env.TESTE_ENV);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', function(req, res) {
    res.render('pages/index');
});
app.listen(4682, () => {
    console.log('Rodando suave na porta 4682');
});
