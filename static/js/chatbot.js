function startChatBot() {
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    chatContainer.style.position = 'fixed';
    chatContainer.style.top = '50%';
    chatContainer.style.left = '50%';
    chatContainer.style.width = '75%';
    chatContainer.style.height = '90%';
    chatContainer.style.backgroundColor = '#cfd2d6';
    chatContainer.style.zIndex = '1000';
    chatContainer.style.overflow = 'hidden';
    chatContainer.style.display = 'flex';
    chatContainer.style.flexDirection = 'column';
    chatContainer.style.transform = 'translate(-50%, -50%)';
    chatContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

    chatContainer.innerHTML = `
    <div class="chat-header bg-primary text-white p-3 d-flex justify-content-center align-items-center position-relative">
        <h5 class="mb-0 text-center w-100">Chat with Ayati</h5>
        <button id="close-chat-btn" class="btn btn-danger btn-sm position-absolute" style="right: 10px;">close</button>
    </div>
    <div id="chat-box" class="chat-box flex-grow-1 p-3" style="overflow-y: auto; background-color: #ffffff;"></div>
    <div class="chat-input-container p-3 bg-light">
        <div class="input-group">
            <input id="chat-input" type="text" class="form-control" placeholder="Type your message here...">
            <button id="send-btn" class="btn btn-primary">Send</button>
        </div>
    </div>
    `;

    document.body.appendChild(chatContainer);

    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');

    const converter = new showdown.Converter();

    closeChatBtn.addEventListener('click', () => {
        document.body.removeChild(chatContainer);
    });

    sendBtn.addEventListener('click', async () => {
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            chatBox.innerHTML += `<div class="text-end mb-2"><span class="badge bg-primary">${studentName}</span> <span>${userMessage}</span></div>`;
            chatInput.value = '';

            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: userMessage,
                        quizResponses: answers.responses, 
                    }),
                });

                const result = await response.json();

                const formattedResponse = converter.makeHtml(result.reply);
                chatBox.innerHTML += `<div class="text-start mb-2"><span class="badge bg-secondary">Ayati:</span> <div>${formattedResponse}</div></div>`;
                chatBox.scrollTop = chatBox.scrollHeight;
            } catch (error) {
                console.error('Error:', error);
                chatBox.innerHTML += `<div class="text-start mb-2 text-danger" style="color: rgb(13,110,253);"><strong>Ayati:</strong> An error occurred. Please try again.</div>`;
            }
        }
    });
}
