const express = require('express');
const axios = require('axios');
const router = express.Router();
const lodash = require('lodash');
const dotenv = require('dotenv');
const sanitize = require('sanitize-html');
const { marked } = require('marked');

dotenv.config();

// Constantes para URLs da API
const BOTPRESS_CHAT_URL = process.env.BOTPRESS_CHAT_URL;
// console.log("Nome do webhook:", BOTPRESS_CHAT_URL);

// Configura segurança do marked
marked.setOptions({
    headerIds: false,
    mangle: false
});

// Função para gerar IDs aleatórios
function generateRandomID(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Função para criar um usuário
async function createUser(userKey) {
  try {
    const response = await axios.post(`${BOTPRESS_CHAT_URL}/users`, { id: userKey });
    // console.log("Usuário criado:", response.data.key);
    return response.data.key;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

// Função para criar uma conversa
async function createConversation(conversationId, userKey) {
  try {
    // console.log('Chegou no create:', userKey);
    const response = await axios.post(`${BOTPRESS_CHAT_URL}/conversations`, { id: conversationId }, { headers: { 'x-user-key': userKey } });
    // console.log("Conversa criada:", response.data);
    return response;
  } catch (error) {
    console.error('Erro ao criar conversa:', error);
    throw error;
  }
}

// Função para enviar uma mensagem
async function createMessage(conversationId, userKey, text) {
  try {
    const response = await axios.post(`${BOTPRESS_CHAT_URL}/messages`, {
      payload: { type: 'text', text: text },
      conversationId: conversationId
    }, { headers: { 'x-user-key': userKey } });
    // console.log("Mensagem enviada:", response.data);
    return response;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
}

// Função para obter a resposta do bot
async function getBotResponse(conversationId, userKey) {
  try {
    const response = await axios.get(`${BOTPRESS_CHAT_URL}/conversations/${conversationId}/messages`, { headers: { 'x-user-key': userKey } });
    const messages = response.data.messages;
    
    console.log('Todas as menssagens:', JSON.stringify(messages, null, 2));
    
    const botMessages = messages.filter(m => m.userId.startsWith('user_'));
    // console.log('Bot messages:', JSON.stringify(botMessages, null, 2));
    
    if (botMessages.length > 0) {
      const rawText = botMessages[0].payload.text;
      // Convert markdown to HTML and sanitize
      const htmlContent = sanitize(marked(rawText), {
        allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'code', 'pre', 'ul', 'ol', 'li', 'p', 'br' ],
        allowedAttributes: {
          'a': [ 'href' ]
        }
      });
      // console.log('Selected bot message:', htmlContent);
      return htmlContent;
    }
    
    console.log('No bot messages found');
    return "Nenhuma resposta do bot";
  } catch (error) {
    console.error('Erro ao obter resposta do bot:', error);
    console.error('Response data:', error.response?.data);
    throw error;
  }
}

const MAX_RETRIES = 4;
const INITIAL_WAIT = 1000;

async function getBotResponseWithRetry(conversationId, userKey) {
    let lastError = null;
    
    for (let i = 0; i < MAX_RETRIES; i++) {
        console.log(`Tentativa ${i + 1} de ${MAX_RETRIES}`);
        
        // Progressive delay: 3s, 6s, 9s, 12s
        const waitTime = INITIAL_WAIT * (i + 1);
        console.log(`Esperando ${waitTime}ms antes de nova tentiva`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        try {
            const response = await getBotResponse(conversationId, userKey);
            if (response && response !== "Nenhuma resposta do bot") {
                // console.log('Resposta válida recebida:', response);
                return response;
            }
            console.log('Sem resposta válida ainda, tentarei novamente');
        } catch (error) {
            console.error(`Tentativa ${i + 1} falhou:`, error);
            lastError = error;
        }
    }
    
    console.error('Todas as tentivas falharam. Fim da linha.:', lastError);
    return "Desculpe, não obtive resposta do bot no momento";
}

// Rota para enviar dados
router.post('/send-data', async (req, res) => {
  try {
    const texto = sanitize(req.body.textUser, {
      allowedTags: [],
      allowedAttributes: {}
    });

    // Checa se já existe registro de uma sessão anterior
    let userKey = req.body.userKey;
    let conversationId = req.body.conversationId;

    // Se não existe, crian novas credenciais
    if (!userKey || !conversationId) {
      conversationId = generateRandomID();
      const initialUserKey = generateRandomID();
      userKey = await createUser(initialUserKey);
      await createConversation(conversationId, userKey);
    }

    // Valida o conteúdo da requisição
    if (!texto || !texto.trim()) {
      return res.status(400).json({ error: 'O campo de mensagem não pode estar vazio' });
    }

    await createMessage(conversationId, userKey, texto);

    // Espera um pouco antes de buscar a resposta
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // console.log('ConversaBP:', conversationId);
    // console.log('ChaveUsuárioBP', userKey);
    const botResponse = await getBotResponseWithRetry(conversationId, userKey);

    res.json({ 
      respostaBot: botResponse,
      conversationId: conversationId,
      userKey: userKey 
    });

  } catch (error) {
    console.error('Erro ao processar as requisições:', error);
    // Mensagens de erro específicas para debug
    if (error.response) {
      res.status(error.response.status).json({ 
        error: 'Erro na comunicação com a Botpress CLoud',
        details: error.response.data 
      });
    } else if (error.request) {
      res.status(503).json({ 
        error: 'Serviço Botpress indisponível' 
      });
    } else {
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }
});

module.exports = router;