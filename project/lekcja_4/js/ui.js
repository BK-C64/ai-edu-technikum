// Plik na funkcje manipulujące interfejsem (renderowanie)

const ui = {
    // === Selektory elementów DOM ===
    serversList: document.querySelector('.servers-column'),
    serverName: document.querySelector('.server-header h3'),
    channelsList: document.querySelector('.channels-list'),
    channelName: document.querySelector('.chat-header h4'),
    messagesArea: document.querySelector('.messages-area'),
    usersList: document.querySelector('.users-area'),
    messageInput: document.querySelector('.chat-input-area input'),
    userPanel: document.querySelector('.user-panel'),

    // === Funkcje renderujące ===

    renderServers: (servers, activeServerId) => {
        ui.serversList.innerHTML = servers.map(server => `
            <div class="server-icon ${server.id === activeServerId ? 'active' : ''}" data-server-id="${server.id}">
                ${server.icon}
            </div>
        `).join('');
    },

    renderChannels: (channels, activeChannelId) => {
        if (!channels) {
            ui.channelsList.innerHTML = '';
            return;
        }
        ui.channelsList.innerHTML = channels.map(channel => `
            <div class="channel ${channel.id === activeChannelId ? 'active' : ''}" data-channel-id="${channel.id}">
                # ${channel.name}
            </div>
        `).join('');
    },

    renderMessages: (messages, users) => {
        if (!messages) {
            ui.messagesArea.innerHTML = '';
            return;
        }
        ui.messagesArea.innerHTML = messages.map(msg => {
            const user = users.find(u => u.id === msg.userId);
            return `
                <div class="message">
                    <div class="avatar">${user.name.charAt(0)}</div>
                    <div class="message-content">
                        <div class="message-author">${user.name}</div>
                        <div class="message-text">${msg.text}</div>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    renderUsers: (users) => {
        ui.usersList.innerHTML = '<h4>Użytkownicy</h4>' + users.map(user => `
            <div class="user">${user.name}</div>
        `).join('');
    },

    // Funkcja do aktualizacji całego interfejsu na podstawie stanu
    renderAll: (state) => {
        const activeServer = state.servers.find(s => s.id === state.activeServer);
        const channelsForActiveServer = state.channels[state.activeServer];
        const usersForActiveServer = state.users[state.activeServer];
        const messagesForActiveChannel = state.messages[state.activeChannel];

        ui.serverName.textContent = activeServer.name;
        ui.channelName.textContent = `# ${channelsForActiveServer.find(c => c.id === state.activeChannel).name}`;
        
        ui.renderServers(state.servers, state.activeServer);
        ui.renderChannels(channelsForActiveServer, state.activeChannel);
        ui.renderMessages(messagesForActiveChannel, usersForActiveServer);
        ui.renderUsers(usersForActiveServer);
    }
};
