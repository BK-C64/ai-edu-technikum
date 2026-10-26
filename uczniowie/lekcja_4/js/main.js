// Główny plik aplikacji (logika, obsługa zdarzeń)

function initialize() {
    // Na starcie nie renderujemy aplikacji, czekamy na "zalogowanie"
    setupEventListeners();
}

function showApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.querySelector('.app-container').style.display = 'flex';
    // Dopiero po zalogowaniu renderujemy główny interfejs
    ui.renderAll(appState);
}

function setupEventListeners() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Zapobiegamy przeładowaniu strony
        showApp();
    });

    // Kliknięcie na serwer
    ui.serversList.addEventListener('click', (event) => {
        const serverIcon = event.target.closest('.server-icon');
        if (serverIcon) {
            const serverId = serverIcon.dataset.serverId;
            
            // Aktualizacja stanu
            appState.activeServer = serverId;
            // Ustawienie pierwszego kanału z listy jako aktywny
            appState.activeChannel = appState.channels[serverId][0].id; 
            
            // Przerenderowanie UI
            ui.renderAll(appState);
        }
    });

    // Kliknięcie na kanał
    ui.channelsList.addEventListener('click', (event) => {
        const channel = event.target.closest('.channel');
        if (channel) {
            const channelId = channel.dataset.channelId;

            // Aktualizacja stanu
            appState.activeChannel = channelId;

            // Przerenderowanie UI
            ui.renderAll(appState);
        }
    });

    // Wysłanie wiadomości
    ui.messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && ui.messageInput.value.trim() !== '') {
            const newMessage = {
                userId: appState.currentUser.id,
                text: ui.messageInput.value.trim()
            };

            // Aktualizacja stanu
            if (!appState.messages[appState.activeChannel]) {
                appState.messages[appState.activeChannel] = [];
            }
            appState.messages[appState.activeChannel].push(newMessage);

            // Czyszczenie pola input
            ui.messageInput.value = '';

            // Przerenderowanie UI
            ui.renderAll(appState);

            // Przewinięcie do najnowszej wiadomości
            ui.messagesArea.scrollTop = ui.messagesArea.scrollHeight;
        }
    });
}

// Uruchomienie aplikacji po załadowaniu całego DOM
document.addEventListener('DOMContentLoaded', initialize);
