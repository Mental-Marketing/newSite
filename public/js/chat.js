// public/js/chat.js
document.addEventListener("DOMContentLoaded", function() {
    if (performance.navigation.type === 1) {
        localStorage.clear();
        // console.log('O localStorage foi limpo');
    }

    const form = document.querySelector("form");
    const submitButton = form.querySelector("button[type=submit]");
    const messagesContainer = document.querySelector(".messages-container");

    // Function to add message to chat
    function addMessage(text, isBot) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
        if (isBot) {
            messageDiv.innerHTML = text; // Usanddo innerHTML para as menssagens do robô (markdown/HTML)
        } else {
            messageDiv.textContent = text; // Usand textContent para as mensagens do usuário (texto simples)
        }
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messageDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function createTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'wave';
        typingIndicator.innerHTML = `
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        `;
        return typingIndicator;
    }

    function showTypingIndicator() {
        // Remove outras indicações de "teclando"
        const existingIndicator = document.getElementById('wave');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Cria e insere novo indicador
        const typingIndicator = createTypingIndicator();
        messagesContainer.appendChild(typingIndicator);
        
        // Aparece e scrolla
        typingIndicator.style.display = 'block';
        typingIndicator.scrollIntoView({ behavior: 'smooth' });
    }

    function hideTypingIndicator() {
        const wave = document.getElementById('wave');
        if (wave) {
            wave.remove();
        }
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        
        // Remove the following lines to keep the button enabled and text unchanged
        // submitButton.disabled = true;
        // submitButton.innerHTML = 'Enviando...';
        
        const textUser = document.getElementById('textUser').value;
        
        // Add user message to chat
        addMessage(textUser, false);
        
        // Clear input field
        document.getElementById('textUser').value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        const existingUserKey = localStorage.getItem('userKey');
        const existingConversationId = localStorage.getItem('conversationId');

        const requestBody = {
            textUser: textUser,
            userKey: existingUserKey,
            conversationId: existingConversationId
        };

        fetch("/send-data", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            //console.log("Dados recebidos:", data);
            
            // Hide typing indicator
            hideTypingIndicator();
            
            // Handle multiple bot messages
            if (Array.isArray(data.respostaBot)) {
                data.respostaBot.forEach(message => {
                    addMessage(message, true);
                });
            } else if (data.respostaBot) {
                // Handle single message for backward compatibility
                addMessage(data.respostaBot, true);
            }
            
            if (!existingUserKey) {
                localStorage.setItem('userKey', data.userKey);
            }
            if (!existingConversationId) {
                localStorage.setItem('conversationId', data.conversationId);
            }
        })
        .catch(error => {
            hideTypingIndicator();
            console.error("Erro ao enviar mensagem:", error);
            alert(`Erro ao enviar mensagem: ${error.message}`);
        })
        .finally(() => {
            // Remove the following lines to keep the button enabled and text unchanged
            // submitButton.disabled = false;
            // submitButton.innerHTML = 'Enviar';
        });
    });
});