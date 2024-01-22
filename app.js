const express = require('express');
const axios = require('axios');
const ejs = require('ejs');
const app = express();

require('dotenv').config();
console.log(process.env.TESTE_ENV);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

// app.get('/', function(req, res) {
//     res.render('pages/index');
// });

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://mentalmarketing.com.br/strapi/api/home-page?populate=deep');
        const data = response.data;
        res.render('pages/index', { data: data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error ao obter dados');
    }
});

app.listen(4682, () => {
    console.log('Rodando suave na porta 4682');
});
