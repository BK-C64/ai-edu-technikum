import { state } from './state.js';

const elements = {
    loginSection: document.getElementById('loginSection'),
    chatSection: document.getElementById('chatSection'),
    chatBox: document.getElementById('chatBox'),
    userListUl: document.querySelector('#userList ul'),
    status: document.getElementById('status'),
    messageInput: document.getElementById('messageInput'),
    connectButton: document.getElementById('connectButton'),
    userCount: document.getElementById('userCount')
};

export function showStatus(message, type = 'info') {
    elements.status.textContent = message;
    elements.status.className = `status-${type}`;
}

export function hideLogin() {
    elements.loginSection.classList.add('hidden');
    elements.chatSection.classList.remove('hidden');
    elements.messageInput.focus();
}

export function showLogin() {
    elements.loginSection.classList.remove('hidden');
    elements.chatSection.classList.add('hidden');
}

export function renderUserList() {
    elements.userListUl.innerHTML = '';
    state.onlineUsers.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        if (user === state.currentUser) {
            li.style.fontWeight = 'bold';
            li.style.color = 'var(--accent-color)';
        }
        elements.userListUl.appendChild(li);
    });
    if (elements.userCount) elements.userCount.textContent = state.onlineUsers.length;
}

export function renderMessages() {
    elements.chatBox.innerHTML = '';
    state.messages.forEach(msg => appendToChat(msg));
}

export function appendToChat(msg, isEvent = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    if (isEvent) {
        messageElement.classList.add('user-event');
        messageElement.textContent = msg.text;
    } else {
        const isMe = msg.username === state.currentUser;
        messageElement.classList.add(isMe ? 'my-message' : 'server-message');
        
        const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageElement.innerHTML = `
            <span class="username">${escapeHtml(msg.username)}</span>
            <div class="message-text">${escapeHtml(msg.text)}</div>
            <span class="timestamp">${timeStr}</span>
        `;
    }

    elements.chatBox.appendChild(messageElement);
    elements.chatBox.scrollTop = elements.chatBox.scrollHeight;
}

export function clearInput() {
    elements.messageInput.value = '';
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
