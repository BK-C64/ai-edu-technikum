import { state } from './state.js';

let socket = null;
let onMessageCallback = null;

export function setOnMessageCallback(callback) {
    onMessageCallback = callback;
}

export function connect(url, password, username, onOpen, onError, onClose) {
    socket = new WebSocket(url);

    socket.onopen = () => {
        console.log("Connected to server. Starting auth flow.");
        // Step 1: Password
        send('auth_password', { password });
        // Step 2: Username
        send('auth_username', { username });
        if (onOpen) onOpen();
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleMessage(data);
        if (onMessageCallback) onMessageCallback(data);
    };

    socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
        if (onError) onError(error);
    };

    socket.onclose = () => {
        state.isAuthenticated = false;
        if (onClose) onClose();
    };
}

export function sendMessage(text) {
    send('new_message', { text });
}

function send(type, payload) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type, payload }));
    }
}

function handleMessage(data) {
    const { type, payload } = data;
    switch (type) {
        case 'chat_history':
            state.messages = payload.messages;
            state.isAuthenticated = true;
            break;
        case 'user_list':
            state.onlineUsers = payload.users;
            break;
        case 'new_message':
            state.messages.push(payload);
            break;
        case 'user_joined':
            // Logic handled by user_list update usually, but can log here
            break;
        case 'user_left':
            // Logic handled by user_list update usually
            break;
    }
}
