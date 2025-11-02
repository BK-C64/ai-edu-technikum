// W przyszłości tutaj znajdzie się logika aplikacji, np. obsługa zdarzeń,
// komunikacja z serwerem, dynamiczne ładowanie treści itp.

document.addEventListener('DOMContentLoaded', () => {
    // Symulacja przełączania serwerów
    const serverIcons = document.querySelectorAll('.servers-list .server-icon:not(.add-server)');
    serverIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            document.querySelector('.servers-list .server-icon.active').classList.remove('active');
            icon.classList.add('active');
        });
    });

    // Symulacja przełączania kanałów
    const channels = document.querySelectorAll('.channels-list .channel');
    const chatHeader = document.querySelector('.chat-header h3');
    channels.forEach(channel => {
        channel.addEventListener('click', () => {
            document.querySelector('.channels-list .channel.active').classList.remove('active');
            channel.classList.add('active');
            chatHeader.textContent = channel.textContent.trim();
        });
    });

    // Symulacja wysyłania wiadomości
    const chatInput = document.querySelector('.chat-input input');
    const chatMessages = document.querySelector('.chat-messages');

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatInput.value.trim() !== '') {
            const messageText = chatInput.value.trim();
            chatInput.value = '';

            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.innerHTML = `
                <div class="avatar"></div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="username">Użytkownik</span>
                        <span class="timestamp">${new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div class="message-text">${messageText}</div>
                </div>
            `;

            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the bottom
        }
    });
});
