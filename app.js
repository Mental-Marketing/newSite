// Com actions!

const express = require('express');
const axios = require('axios');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const app = express();

require('dotenv').config();

const PORT = 4682;

const requiredEnvVars = ['BOTPRESS_CHAT_URL'];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`Erro: Variável de ambiente ${varName} é requerida mas não foi localizada`);
        process.exit(1);
    }
});

const BASE_URL = 'https://mentalmarketing.com.br/strapi';

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 100 
});

const sendDataRouter = require('./routes/sendData');
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/send-data', limiter);
app.use('/', sendDataRouter);

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/home-page?populate=*`);
        
        const homeData = response.data;

        const logoMental = homeData.data.logoMental.url;

        const localizations = homeData.data.localizations.map(localization => localization);

        res.render('pages/index', { 
            homeData: homeData, 
            logoMental: logoMental,
            localizations: localizations, 
            BASE_URL: BASE_URL
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error ao obter dados');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});