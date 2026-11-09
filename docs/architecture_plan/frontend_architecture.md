# Architektura Aplikacji Frontendowej (MyDiscord Client)

Dokument ten opisuje strukturę i organizację kodu po stronie klienta (frontend) komunikatora **MyDiscord**, opartego na czystym HTML5, CSS3 i Vanilla JavaScript (ES6+), bez skomplikowanych frameworków i narzędzi do budowania.

---

## 1. Główne Założenia i Zasady

- **Brak Narzędzi Build (No Bundler)**: Aplikacja działa bezpośrednio w przeglądarce, serwowana jako pliki statyczne przez FastAPI (`StaticFiles`).
- **Modułowość i Czytelność**: Logika podzielona jest na przejrzyste warstwy: zarządzanie stanem (State), obsługa sieci WebSocket (API/Network) oraz manipulacja drzewem DOM (UI).
- **Single Source of Truth**: Wszystkie dane (aktywny kanał, lista kanałów, historia wiadomości per kanał, lista obecności) przechowywane są w jednym centralnym obiekcie stanu (`state`).
- **Architektura Czystego JavaScriptu (Vanilla JS)**: Bezpośrednie korzystanie z natywnego API przeglądarki (`WebSocket`, `document.querySelector`, `addEventListener`).

---

## 2. Struktura Katalogów i Plików Frontendu

Docelowa struktura w katalogu `frontend/`:

```
frontend/
├── index.html          # Główny szablon (ekran logowania + trójkolumnowy kontener czatu)
├── style.css           # Ciemny motyw w stylu Discorda (Grid/Flexbox)
└── js/
    ├── state.js        # Centralny obiekt stanu aplikacji
    ├── api.js          # Klient WebSocket (połączenie, wysyłanie ramek JSON, obsługa zdarzeń)
    ├── ui.js           # Renderowanie komponentów DOM (kanały, wiadomości, obecność)
    └── app.js          # Punkt wejścia (inicjalizacja, nasłuchiwanie zdarzeń DOM)
```
*(Uwaga dydaktyczna: W pierwszych modułach warsztatowych dopuszczalne jest połączenie logiki JS w pojedynczym pliku `frontend/app.js` i późniejsze rozbicie na moduły `js/*`).*

---

## 3. Centralne Zarządzanie Stanem (`state.js`)

Obiekt stanu przechowuje reaktywne dane sesji użytkownika:

```javascript
export const state = {
  // Dane zalogowanego użytkownika
  currentUser: null,       // { id: "user_...", name: "JanKowalski" }
  isAuthenticated: false,

  // Kontekst aktywnego widoku
  currentChannelId: "general",

  // Kolekcje danych
  channels: [],            // [ { id: "general", name: "Ogólny", type: "public" }, ... ]
  onlineUsers: [],         // [ { id: "user_...", name: "JanKowalski" }, ... ]
  
  // Wiadomości indeksowane po channel_id: { "general": [...], "random": [...] }
  messagesByChannel: {},

  // Użytkownicy aktualnie piszący na poszczególnych kanałach: { "general": Set("Anna") }
  typingUsersByChannel: {}
};
```

---

## 4. Przepływy Danych (Data Flow)

### 4.1. Jednoetapowe Logowanie i Inicjalizacja Stanu
1. **Użytkownik**: Wpisuje nazwę użytkownika oraz hasło w formularzu logowania -> klika *„Dołącz do czatu”*.
2. **`api.js`**:
   - Inicjalizuje połączenie: `new WebSocket("ws://localhost:8000/ws")`.
   - W zdarzeniu `onopen` wysyła ramkę autoryzacyjną:
     ```json
     {
       "type": "auth_request",
       "payload": {
         "username": "JanKowalski",
         "password": "haslo"
       }
     }
     ```
3. **Serwer**:
   - Przy sukcesie odsyła ramkę `auth_success` z profilem użytkownika, listą kanałów, użytkowników online oraz historią kanału `#general`.
4. **`app.js` / `ui.js`**:
   - Aktualizuje `state.currentUser`, `state.channels`, `state.onlineUsers`, `state.messagesByChannel["general"]`.
   - Ukrywa formularz logowania (`#login-screen`), odsłania interfejs komunikatora (`#app-wrapper`).
   - Renderuje listę kanałów, użytkowników online oraz wiadomości z domyślnego pokoju.
5. **Obsługa Błędu**: Jeśli serwer odeśle `auth_failure`, `ui.js` wyświetla komunikat błędu na ekranie logowania i zamyka gniazdo.

---

### 4.2. Wysyłanie i Odbieranie Wiadomości (Czas Rzeczywisty)
1. **Użytkownik**: Wpisuje tekst wiadomości w oknie aktywnego kanału -> naciska `Enter` lub klika przycisk wysyłki.
2. **`api.js`**: Wysyła do serwera ramkę:
   ```json
   {
     "type": "send_message",
     "payload": {
       "channel_id": state.currentChannelId,
       "text": "Cześć wszystkim!"
     }
   }
   ```
3. **Serwer**: Waliduje, zapisuje wiadomość w SQLite z `id: "msg_..."` i rozgłasza do klientów ramkę S2C `new_message`.
4. **`api.js` (u wszystkich odbiorców)**:
   - Dodaje wiadomość do `state.messagesByChannel[payload.channel_id]`.
   - Jeśli odebrana wiadomość dotyczy aktualnie otwartego kanału (`state.currentChannelId`), `ui.js` dokłada element wiadomości do kontenera DOM i wykonuje auto-scroll na sam dół.

---

### 4.3. Przełączanie Kanałów i Pobieranie Historii
1. **Użytkownik**: Klika inny kanał na liście (np. `#random`).
2. **`ui.js`**: Oznacza kanał jako aktywny w menu, aktualizuje `state.currentChannelId` i czyści okno czatu.
3. **`api.js`**:
   - Jeśli historia dla tego kanału nie była jeszcze załadowana w `state`, wysyła do serwera:
     ```json
     {
       "type": "request_history",
       "payload": { "channel_id": "random" }
     }
     ```
4. **Serwer**: Odsyła `chat_history`.
5. **`ui.js`**: Zapisuje historię w `state` i renderuje wiadomości w oknie rozmowy.

---

## 5. Układ Interfejsu (Trójkolumnowy Discord Layout)

Interfejs zorganizowany jest w klasyczny trójkolumnowy układ z elastycznym pozycjonowaniem (CSS Grid / Flexbox):

```
┌─────────────────┬──────────────────────────────────────────┬─────────────────┐
│ LEWY PANEL      │          ŚRODEK: OKNO CZATU              │ PRAWY PANEL     │
│ (Kanały i DM)   │                                          │ (Obecność)      │
├─────────────────┼──────────────────────────────────────────┼─────────────────┤
│ • Nazwa serwera │ • Nagłówek kanału (#general)             │ • Użytkownicy   │
│ • Kanały (#...) │ • Lista wiadomości (scrollable):         │   online        │
│   [+ Nowy kanał]│   - Autor, data (HH:MM), treść           │   - JanKowalski │
│ • Wiadomości    │   - Reakcje emoji i akcje wiadomości     │   - AnnaNowak   │
│   prywatne (DM) │ • Wskaźnik pisania ("Anna pisze...")     │                 │
│                 │──────────────────────────────────────────│                 │
│ • Profil usera  │ • Pole tekstowe [Napisz wiadomość...]    │                 │
└─────────────────┴──────────────────────────────────────────┴─────────────────┘
```

### Kluczowe Komponenty i Funkcje UI:
- `toggleView(isLoggedIn)`: Płynne przełączanie między ekranem wejściowym a głównym panelem komunikatora.
- `renderChannels(channels, activeId)`: Generowanie listy kanałów publicznych i prywatnych.
- `renderMessages(messages)`: Generowanie klocków wiadomości z rozróżnieniem wiadomości własnych i obcych.
- `renderUserList(users)`: Dynamiczna aktualizacja listy obecności online.
- `showTypingIndicator(user)` / `hideTypingIndicator()`: Prezentacja animacji pisania wiadomości.

---

## 6. Słownik Zdarzeń WebSocket w Kliencie

| Typ Zdarzenia | Kierunek | Rola w Aplikacji Klienta |
| --- | --- | --- |
| `auth_request` | C2S | Przesłanie nicka i hasła do serwera. |
| `auth_success` | S2C | Potwierdzenie logowania, załadowanie stanu początkowego, przejście do czatu. |
| `auth_failure` | S2C | Wyświetlenie komunikatu o błędzie logowania (zły nick/hasło). |
| `send_message` | C2S | Wysłanie nowej wiadomości na aktywny kanał. |
| `new_message` | S2C | Odebranie nowej wiadomości i dodanie jej do widoku. |
| `request_history` | C2S | Zapytanie o historię wiadomości przy przełączeniu kanału. |
| `chat_history` | S2C | Otrzymanie historii wiadomości dla wybranego pokoju. |
| `create_channel` | C2S | Żądanie utworzenia nowego kanału publicznego. |
| `channel_created` | S2C | Powiadomienie o utworzeniu kanału i dodanie go do lewego paska. |
| `user_joined` / `user_left` | S2C | Powiadomienie o wejściu/wyjściu użytkownika. |
| `user_list_update` | S2C | Pełna synchronizacja listy użytkowników online. |
| `typing_started` / `user_is_typing` | C2S / S2C | Przesłanie i obsługa powiadomienia o pisaniu na żywo. |
| `start_private_chat` / `private_chat_started` | C2S / S2C | Inicjalizacja rozmowy 1-na-1 (Direct Message). |
| `toggle_reaction` / `message_reactions_update` | C2S / S2C | *(Rozszerzenie)* Dodanie/usunięcie reakcji emoji pod wiadomością. |
| `edit_message` / `message_updated` | C2S / S2C | *(Rozszerzenie)* Edycja treści wiadomości przez autora. |
| `delete_message` / `message_deleted` | C2S / S2C | *(Rozszerzenie)* Usunięcie wiadomości przez autora. |
