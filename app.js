const express = require('express');
const axios = require('axios');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const app = express();

require('dotenv').config();
console.log(process.env.TESTE_ENV);

const PORT = 4682;

const requiredEnvVars = ['BOTPRESS_CHAT_URL'];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`Erro: Variável de ambiente ${varName} é requerida mas não foi localizada`);
        process.exit(1);
    }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://mentalmarketing.com.br/strapi/api/home-page?populate=deep');
        const homeData = response.data;
        res.render('pages/index', { homeData: homeData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error ao obter dados');
    }
});

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 100 // limita cada IP em 100 requisições durante 10 minutos
});

app.use('/send-data', limiter);
const sendDataRouter = require('./routes/sendData');
app.use('/', sendDataRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

