document.addEventListener("DOMContentLoaded", function() {
    if (performance.navigation.type === 1) {
        localStorage.clear();
    }

    const form = document.querySelector("form");
    const submitButton = form.querySelector("button[type=submit]");
    const messagesContainer = document.querySelector(".messages-container");
    function addMessage(text, isBot) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
        if (isBot) {
            messageDiv.innerHTML = text; 
        } else {
            messageDiv.textContent = text; 
        }
        messagesContainer.appendChild(messageDiv);
        
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
        const existingIndicator = document.getElementById('wave');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        const typingIndicator = createTypingIndicator();
        messagesContainer.appendChild(typingIndicator);
        
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
        
        const textUser = document.getElementById('textUser').value;
        
        addMessage(textUser, false);
        
        document.getElementById('textUser').value = '';
        
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
            hideTypingIndicator();

            if (Array.isArray(data.respostaBot)) {
                data.respostaBot.forEach(message => {
                    addMessage(message, true);
                });
            } else if (data.respostaBot) {
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
        });
    });
});