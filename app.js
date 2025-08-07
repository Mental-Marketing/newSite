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
    // Verifica se homeData e homeData.data existem
    if (!homeData || !homeData.data) {
        return {
            tagLine: 'Mental Marketing',
            catchFrase: 'Marketing Digital Inteligente',
            faleCom: 'Fale Conosco',
            geralNumbahs: 'Números Gerais',
            totalHTML_txt: 'HTML',
            totalEmails_txt: 'Emails',
            totalLanding_txt: 'Landing Pages',
            closeFrase: 'Frase de Fechamento'
        };
    }

    if (locale === 'pt-BR') {
        return {
            tagLine: homeData.data.tagLine || 'Mental Marketing',
            catchFrase: homeData.data.catchFrase || 'Marketing Digital Inteligente',
            faleCom: homeData.data.faleCom || 'Fale Conosco',
            geralNumbahs: homeData.data.geralNumbahs || 'Números Gerais',
            totalHTML_txt: homeData.data.totalHTML_txt || 'HTML',
            totalEmails_txt: homeData.data.totalEmails_txt || 'Emails',
            totalLanding_txt: homeData.data.totalLanding_txt || 'Landing Pages',
            closeFrase: homeData.data.closeFrase || 'Frase de Fechamento'
        };
    }

    const localization = homeData.data.localizations && homeData.data.localizations.find(loc => loc.locale === locale);
    if (localization) {
        return {
            tagLine: localization.tagLine || homeData.data.tagLine || 'Mental Marketing',
            catchFrase: localization.catchFrase || homeData.data.catchFrase || 'Marketing Digital Inteligente',
            faleCom: localization.faleCom || homeData.data.faleCom || 'Fale Conosco',
            geralNumbahs: localization.geralNumbahs || homeData.data.geralNumbahs || 'Números Gerais',
            totalHTML_txt: localization.totalHTML_txt || homeData.data.totalHTML_txt || 'HTML',
            totalEmails_txt: localization.totalEmails_txt || homeData.data.totalEmails_txt || 'Emails',
            totalLanding_txt: localization.totalLanding_txt || homeData.data.totalLanding_txt || 'Landing Pages',
            closeFrase: localization.closeFrase || homeData.data.closeFrase || 'Frase de Fechamento'
        };
    }

    // Fallback para português se localização não encontrada
    return {
        tagLine: homeData.data.tagLine || 'Mental Marketing',
        catchFrase: homeData.data.catchFrase || 'Marketing Digital Inteligente',
        faleCom: homeData.data.faleCom || 'Fale Conosco',
        geralNumbahs: homeData.data.geralNumbahs || 'Números Gerais',
        totalHTML_txt: homeData.data.totalHTML_txt || 'HTML',
        totalEmails_txt: homeData.data.totalEmails_txt || 'Emails',
        totalLanding_txt: homeData.data.totalLanding_txt || 'Landing Pages',
        closeFrase: homeData.data.closeFrase || 'Frase de Fechamento'
    };
}

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/home-page?populate=*`);
        
        const homeData = response.data;

        // Verifica se os dados necessários existem
        if (!homeData || !homeData.data) {
            console.error('Dados da API estão vazios ou malformados');
            return res.status(500).send('Erro ao carregar dados da página.');
        }

        const logoMental = homeData.data.logoMental && homeData.data.logoMental.url ? homeData.data.logoMental.url : null;

        const localizations = homeData.data.localizations && Array.isArray(homeData.data.localizations) 
            ? homeData.data.localizations.map(localization => localization)
            : [];

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
        console.error('Erro ao obter dados da API:', error);
        res.status(500).send('Erro ao obter dados.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}.`);
});