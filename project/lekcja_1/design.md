# Projekt Techniczny dla Lekcji 1: Interfejs i Połączenie

Dokument ten stanowi techniczny plan implementacji dla wymagań zdefiniowanych w `requirements.md`, koncentrując się na aplikacji klienckiej.

## 1. Cel Techniczny

Celem jest stworzenie minimalnej, ale w pełni funkcjonalnej struktury aplikacji klienckiej, która realizuje dwa kluczowe zadania:
1.  Renderuje statyczny interfejs użytkownika, oparty na gotowych makietach, z poprawnym stanem początkowym (widoczny tylko ekran logowania).
2.  Nawiązuje i utrzymuje stabilne połączenie WebSocket z serwerem.

## 2. Projekt Frontendu

### 2.1. Struktura Plików i Katalogów

Należy stworzyć następującą strukturę w katalogu `project/client/`:

```
project/client/
├── index.html
├── style.css
└── js/
    ├── main.js
    ├── api.js
    ├── ui.js
    └── state.js
```

### 2.2. Adaptacja Prototypów UX

Należy połączyć prototypy z `docs/product/design_ux/` w jedną, spójną aplikację.

1.  **Stwórz plik `project/client/index.html`**: Skopiuj do niego całą zawartość z `docs/product/design_ux/index.html`. Następnie, wewnątrz `<body>`, nad kontenerem `<div id="app-wrapper">`, wklej całą strukturę ekranu logowania z `docs/product/design_ux/login.html`.
2.  **Modyfikacja `index.html`**:
    -   Do kontenera ekranu logowania (np. `<div id="login-screen">`) dodaj atrybut `data-view="login"`.
    -   Do głównego kontenera aplikacji (`<div id="app-wrapper">`) dodaj atrybut `data-view="app"` oraz klasę `hidden`.
3.  **Stwórz plik `project/client/style.css`**: Skopiuj do niego całą zawartość z `docs/product/design_ux/style.css`. Następnie doklej na końcu zawartość z `docs/product/design_ux/login.css`. Dodaj styl dla klasy `.hidden`, aby skutecznie ukrywała elementy (`display: none;`).
4.  **Podłączenie skryptu**: W `index.html`, na końcu sekcji `<body>`, dodaj tag `<script>` z atrybutem `type="module"`:
    ```html
    <script type="module" src="js/main.js"></script>
    ```

### 2.3. Implementacja Modułów JavaScript

#### `js/state.js`
Przechowuje flagę połączenia.
```javascript
// project/client/js/state.js
export const state = {
    isConnected: false,
};
```

#### `js/ui.js`
Zarządza widocznością komponentów.
```javascript
// project/client/js/ui.js

// Przechowujemy referencje do głównych "widoków" aplikacji
const views = {
    login: document.querySelector('[data-view="login"]'),
    app: document.querySelector('[data-view="app"]'),
};

/**
 * Pokazuje wybrany widok i ukrywa pozostałe.
 * @param {('login'|'app')} viewName - Nazwa widoku do pokazania.
 */
export function showView(viewName) {
    // Ukryj wszystkie widoki
    for (const key in views) {
        views[key].classList.add('hidden');
    }
    // Pokaż wybrany widok
    if (views[viewName]) {
        views[viewName].classList.remove('hidden');
    }
}
```

#### `js/api.js`
Odpowiada za logikę WebSocket.
```javascript
// project/client/js/api.js
import { state } from './state.js';

let socket;

export function connectWebSocket() {
    // Zapobiegaj tworzeniu wielu połączeń
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("Połączenie WebSocket jest już aktywne.");
        return;
    }

    socket = new WebSocket("ws://localhost:8000/ws");

    socket.onopen = (event) => {
        console.log("Połączenie WebSocket nawiązane pomyślnie.");
        state.isConnected = true;
    };

    socket.onclose = (event) => {
        console.log("Połączenie WebSocket zostało zamknięte.");
        state.isConnected = false;
    };

    socket.onerror = (error) => {
        console.error("Wystąpił błąd WebSocket:", error);
    };

    socket.onmessage = (event) => {
        console.log("Otrzymano wiadomość od serwera:", event.data);
        // Na razie tylko logujemy - obsługa wiadomości w kolejnych lekcjach
    };
}
```

#### `js/main.js`
Punkt startowy aplikacji.
```javascript
// project/client/js/main.js
import { connectWebSocket } from './api.js';
import { showView } from './ui.js';

// Funkcja inicjalizująca aplikację
function initialize() {
    // Ustaw widok początkowy na ekran logowania
    showView('login');

    // Nawiąż połączenie z serwerem WebSocket
    connectWebSocket();
}

// Uruchom aplikację po załadowaniu całego drzewa DOM
document.addEventListener('DOMContentLoaded', initialize);
```
