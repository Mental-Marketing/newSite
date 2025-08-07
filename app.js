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
        console.error(`Erro: Variável de ambiente ${varName} é requerida mas não foi localizada.`);
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

// Função para detectar idioma preferido do usuário
function detectUserLanguage(acceptLanguageHeader, availableLocales) {
    if (!acceptLanguageHeader) {
        return 'pt-BR'; // Fallback para português
    }

    // Parse do header Accept-Language
    const languages = acceptLanguageHeader
        .split(',')
        .map(lang => {
            const [language, quality = '1'] = lang.trim().split(';q=');
            return {
                language: language.split('-')[0], // Pega apenas o código principal (pt, en, es, etc.)
                quality: parseFloat(quality)
            };
        })
        .sort((a, b) => b.quality - a.quality);

    // Mapeia códigos de idioma para locales disponíveis
    const languageToLocaleMap = {
        'pt': 'pt-BR',
        'en': 'en',
        'es': 'es',
        'zh': 'zh-Hans'
    };

    // Procura o primeiro idioma disponível
    for (const lang of languages) {
        const mappedLocale = languageToLocaleMap[lang.language];
        if (mappedLocale && availableLocales.includes(mappedLocale)) {
            return mappedLocale;
        }
    }

    return 'pt-BR'; // Fallback para português
}

// Função para obter dados localizados
function getLocalizedData(homeData, locale) {
    if (locale === 'pt-BR') {
        return {
            tagLine: homeData.data.tagLine,
            catchFrase: homeData.data.catchFrase,
            faleCom: homeData.data.faleCom,
            geralNumbahs: homeData.data.geralNumbahs,
            totalHTML_txt: homeData.data.totalHTML_txt,
            totalEmails_txt: homeData.data.totalEmails_txt,
            totalLanding_txt: homeData.data.totalLanding_txt,
            closeFrase: homeData.data.closeFrase
        };
    }

    const localization = homeData.data.localizations.find(loc => loc.locale === locale);
    if (localization) {
        return {
            tagLine: localization.tagLine,
            catchFrase: localization.catchFrase,
            faleCom: localization.faleCom,
            geralNumbahs: localization.geralNumbahs,
            totalHTML_txt: localization.totalHTML_txt,
            totalEmails_txt: localization.totalEmails_txt,
            totalLanding_txt: localization.totalLanding_txt,
            closeFrase: localization.closeFrase
        };
    }

    // Fallback para português se localização não encontrada
    return {
        tagLine: homeData.data.tagLine,
        catchFrase: homeData.data.catchFrase,
        faleCom: homeData.data.faleCom,
        geralNumbahs: homeData.data.geralNumbahs,
        totalHTML_txt: homeData.data.totalHTML_txt,
        totalEmails_txt: homeData.data.totalEmails_txt,
        totalLanding_txt: homeData.data.totalLanding_txt,
        closeFrase: homeData.data.closeFrase
    };
}

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/home-page?populate=*`);
        
        const homeData = response.data;

        const logoMental = homeData.data.logoMental.url;

        const localizations = homeData.data.localizations.map(localization => localization);

        // Detecta idioma preferido do usuário
        const availableLocales = ['pt-BR', ...localizations.map(loc => loc.locale)];
        const userLocale = detectUserLanguage(req.headers['accept-language'], availableLocales);
        
        // Obtém dados localizados para as meta tags
        const localizedData = getLocalizedData(homeData, userLocale);

        res.render('pages/index', { 
            homeData: homeData, 
            logoMental: logoMental,
            localizations: localizations, 
            BASE_URL: BASE_URL,
            localizedData: localizedData,
            userLocale: userLocale
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error ao obter dados.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}.`);
});