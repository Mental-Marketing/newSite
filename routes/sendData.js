const express = require('express');
const axios = require('axios');
const router = express.Router();
const lodash = require('lodash');
const dotenv = require('dotenv');
const sanitize = require('sanitize-html');
const { marked } = require('marked');

dotenv.config();

const BOTPRESS_CHAT_URL = process.env.BOTPRESS_CHAT_URL;

marked.setOptions({
    headerIds: false,
    mangle: false
});

const processedMessageIds = new Set();

function generateRandomID(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function createUser(userKey) {
  try {
    const response = await axios.post(`${BOTPRESS_CHAT_URL}/users`, { id: userKey });
    return response.data.key;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

async function createConversation(conversationId, userKey) {
  try {
    const response = await axios.post(`${BOTPRESS_CHAT_URL}/conversations`, { id: conversationId }, { headers: { 'x-user-key': userKey } });
    return response;
  } catch (error) {
    console.error('Erro ao criar conversa:', error);
    throw error;
  }
}

async function createMessage(conversationId, userKey, text) {
  try {
    const response = await axios.post(`${BOTPRESS_CHAT_URL}/messages`, {
      payload: { type: 'text', text: text },
      conversationId: conversationId
    }, { headers: { 'x-user-key': userKey } });
    return response;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
}

async function getBotResponse(conversationId, userKey) {
  try {
    const response = await axios.get(`${BOTPRESS_CHAT_URL}/conversations/${conversationId}/messages`, { headers: { 'x-user-key': userKey } });
    const messages = response.data.messages;
    
    console.log('Todas as menssagens até agora:', JSON.stringify(messages, null, 2));
    
    const botMessages = messages
      .filter(m => m.userId.startsWith('user_'))
      .filter(m => !processedMessageIds.has(m.id))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (botMessages.length > 0) {
      botMessages.forEach(msg => processedMessageIds.add(msg.id));
      
      const processedMessages = botMessages.map(msg => {
        return sanitize(marked(msg.payload.text), {
          allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'code', 'pre', 'ul', 'ol', 'li', 'p', 'br' ],
          allowedAttributes: {
            'a': [ 'href' ]
          }
        });
      });
      
      return processedMessages;
    }
    
    console.log('No new bot messages found');
    return null;
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
    let hasReceivedResponse = false;
    
    for (let i = 0; i < MAX_RETRIES; i++) {
        console.log(`Tentativa ${i + 1} de ${MAX_RETRIES}`);
        
        const waitTime = INITIAL_WAIT * (i + 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        try {
            const response = await getBotResponse(conversationId, userKey);
            if (response) {
                hasReceivedResponse = true;
                return response;
            }
            console.log('Sem resposta nova ainda, tentarei novamente');
        } catch (error) {
            console.error(`Tentativa ${i + 1} falhou:`, error);
            lastError = error;
        }
    }
    
    if (!hasReceivedResponse) {
        console.error('Todas as tentivas falharam:', lastError);
        return "Desculpe, não obtive resposta do bot no momento";
    }
    
    return null;
}

router.post('/send-data', async (req, res) => {
  try {
    const texto = sanitize(req.body.textUser, {
      allowedTags: [],
      allowedAttributes: {}
    });

    let userKey = req.body.userKey;
    let conversationId = req.body.conversationId;

    if (!userKey || !conversationId) {
      conversationId = generateRandomID();
      const initialUserKey = generateRandomID();
      userKey = await createUser(initialUserKey);
      await createConversation(conversationId, userKey);
    }

    if (!req.body.conversationId) {
      processedMessageIds.clear();
    }

    if (!texto || !texto.trim()) {
      return res.status(400).json({ error: 'O campo de mensagem não pode estar vazio' });
    }

    await createMessage(conversationId, userKey, texto);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const botResponse = await getBotResponseWithRetry(conversationId, userKey);

    res.json({ 
      respostaBot: botResponse,
      conversationId: conversationId,
      userKey: userKey 
    });

  } catch (error) {
    console.error('Erro ao processar as requisições:', error);
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