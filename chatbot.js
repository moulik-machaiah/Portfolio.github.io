class AdvancedAIChatbox {
    constructor() {
        this.isTyping = false;
        this.injectStyles();
        this.renderChatbox();
        this.init();
    }

    // ========== INIT ==========
    init() {
        const sendButton = document.getElementById('chatbox-send');
        const input = document.getElementById('chatbox-input');

        sendButton.addEventListener('click', () => this.handleSendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendMessage();
        });
    }

    // ========== MESSAGE FLOW ==========
    async sendMessage(message) {
        this.addMessage(message, 'user');
        this.showTypingIndicator();

        const response = await this.generateIntelligentResponse(message);

        this.hideTypingIndicator();
        this.addMessage(response, 'bot');
    }

    // 🔹 AI CALL → Netlify Function
    async generateIntelligentResponse(message) {
        try {
            const response = await fetch("/.netlify/functions/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            return data.reply || "⚠️ Sorry, I couldn’t generate a response.";
        } catch (error) {
            console.error("Chatbot API Error:", error);
            return "⚠️ Error connecting to AI service.";
        }
    }

    // ========== RENDERING ==========
    addMessage(content, type) {
        const messagesContainer = document.getElementById('chatbox-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = content;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        if (this.isTyping) return;
        this.isTyping = true;

        const messagesContainer = document.getElementById('chatbox-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) typingDiv.remove();
    }

    handleSendMessage() {
        const input = document.getElementById('chatbox-input');
        const message = input.value;
        if (!message.trim()) return;

        this.sendMessage(message);
        input.value = '';
    }

    // ========== UI CREATION ==========
    renderChatbox() {
        const chatboxHTML = `
            <div id="chatbox-container">
                <div id="chatbox-header">
                    <span>AI Portfolio Assistant</span>
                    <button id="chatbox-close">×</button>
                </div>
                <div id="chatbox-messages"></div>
                <div id="chatbox-input-area">
                    <input type="text" id="chatbox-input" placeholder="Ask me about Moulik..." />
                    <button id="chatbox-send"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            <button id="chatbox-toggle"><i class="fas fa-comments"></i></button>
        `;
        document.body.insertAdjacentHTML('beforeend', chatboxHTML);

        // Toggle button
        const toggleBtn = document.getElementById('chatbox-toggle');
        const container = document.getElementById('chatbox-container');
        const closeBtn = document.getElementById('chatbox-close');

        toggleBtn.addEventListener('click', () => {
            container.style.display = 'flex';
            toggleBtn.style.display = 'none';
        });

        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
            toggleBtn.style.display = 'block';
        });
    }

    // ========== CSS ==========
    injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            #chatbox-container {
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 320px;
                height: 400px;
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
                font-family: Arial, sans-serif;
                z-index: 1000;
            }
            #chatbox-header {
                background: #4a90e2;
                color: white;
                padding: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            #chatbox-header button {
                background: transparent;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
            }
            #chatbox-messages {
                flex: 1;
                padding: 10px;
                overflow-y: auto;
                background: #f9f9f9;
            }
            .message {
                display: flex;
                margin-bottom: 10px;
            }
            .message.user {
                justify-content: flex-end;
            }
            .message.bot {
                justify-content: flex-start;
            }
            .message-avatar {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: #ddd;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 8px;
                font-size: 14px;
            }
            .message.user .message-avatar {
                background: #4a90e2;
                color: white;
                margin-right: 0;
                margin-left: 8px;
            }
            .message-content {
                max-width: 200px;
                padding: 8px 12px;
                border-radius: 10px;
                background: #eaeaea;
                font-size: 14px;
            }
            .message.user .message-content {
                background: #4a90e2;
                color: white;
            }
            #chatbox-input-area {
                display: flex;
                border-top: 1px solid #ddd;
            }
            #chatbox-input {
                flex: 1;
                border: none;
                padding: 10px;
                font-size: 14px;
            }
            #chatbox-send {
                background: #4a90e2;
                border: none;
                color: white;
                padding: 10px 15px;
                cursor: pointer;
            }
            #chatbox-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #4a90e2;
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 22px;
                cursor: pointer;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                z-index: 1000;
            }
            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 3px;
                padding: 5px 10px;
            }
            .typing-dot {
                width: 6px;
                height: 6px;
                background: #aaa;
                border-radius: 50%;
                animation: blink 1.4s infinite both;
            }
            .typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }
            .typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }
            @keyframes blink {
                0% { opacity: 0.2; }
                20% { opacity: 1; }
                100% { opacity: 0.2; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedAIChatbox();
});
