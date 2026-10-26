import { state } from './state.js';
import * as api from './api.js';
import * as ui from './ui.js';

const serverAddressInput = document.getElementById('serverAddress');
const serverPasswordInput = document.getElementById('serverPassword');
const usernameInput = document.getElementById('username');
const connectButton = document.getElementById('connectButton');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

function init() {
    connectButton.addEventListener('click', () => {
        const url = serverAddressInput.value.trim();
        const password = serverPasswordInput.value;
        const username = usernameInput.value.trim();

        if (!url || !password || !username) {
            ui.showStatus('All fields are required.', 'error');
            return;
        }

        state.currentUser = username;
        api.connect(url, password, username, 
            () => ui.showStatus('Connecting and Authenticating...', 'info'),
            () => {
                ui.showStatus('Connection error.', 'error');
                connectButton.disabled = false;
            },
            () => {
                ui.showStatus('Disconnected.', 'info');
                ui.showLogin();
                connectButton.disabled = false;
            }
        );
        connectButton.disabled = true;
    });

    sendButton.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    api.setOnMessageCallback((data) => {
        switch (data.type) {
            case 'auth_error':
                ui.showStatus(`Auth Error: ${data.payload.reason}`, 'error');
                connectButton.disabled = false;
                break;
            case 'chat_history':
                ui.showStatus('Connected!', 'success');
                ui.hideLogin();
                ui.renderMessages();
                break;
            case 'user_list':
                ui.renderUserList();
                break;
            case 'new_message':
                ui.appendToChat(data.payload);
                break;
            case 'user_joined':
                ui.appendToChat({ text: `${data.payload.username} joined.` }, true);
                break;
            case 'user_left':
                ui.appendToChat({ text: `${data.payload.username} left.` }, true);
                break;
            case 'error':
                ui.showStatus(`Server Error: ${data.payload.message}`, 'error');
                break;
        }
    });

    // Set defaults
    serverAddressInput.value = state.serverUrl;
    serverPasswordInput.value = 'ircAMP2024!';
    usernameInput.value = '';
}

function handleSendMessage() {
    const text = messageInput.value.trim();
    if (text) {
        api.sendMessage(text);
        ui.clearInput();
    }
}

document.addEventListener('DOMContentLoaded', init);
