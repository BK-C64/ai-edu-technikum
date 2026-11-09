# Architektura Aplikacji Frontendowej (Wersja Prototypowa)

Ten dokument opisuje uproszczoną architekturę klienta IRC, dostosowaną do aktualnych możliwości serwera (jeden wspólny kanał, dwuetapowe logowanie).

## 1. Główne Zasady

-   **Modularność (Cel)**: Mimo prostoty, kod powinien być dzielony na logiczne części (Stan, API, UI).
-   **Single Source of Truth**: Wszystkie dane (wiadomości, użytkownicy) są przechowywane w centralnym obiekcie `state`.
-   **Vanilla JavaScript**: Brak zewnętrznych bibliotek i frameworków.

## 2. Proponowana Struktura Plików

```
project/client/
├── index.html          # Struktura (Login, Chat, Lista Użytkowników)
├── style.css           # Wygląd (układ 2-kolumnowy)
└── js/
    ├── state.js        # Obiekt przechowujący historię i listę osób
    ├── api.js          # Obsługa WebSocket (auth_password, auth_username)
    ├── ui.js           # Funkcje renderujące (appendMessage, updateUserList)
    └── main.js         # Inicjalizacja i obsługa zdarzeń
```

## 3. Zarządzanie Stanem (`state.js`)

W wersji prototypowej stan jest ograniczony do:
-   `currentUser`: Nazwa zalogowanego użytkownika (string).
-   `messages`: Tablica obiektów `{username, text, timestamp}`.
-   `onlineUsers`: Tablica nazw użytkowników (string[]).
-   `isAuthenticated`: Flaga określająca postęp logowania.

---

## 4. Przepływ Danych (Data Flow)

### Logowanie (Dwuetapowe)
1.  **User**: Wpisuje hasło i nick -> Klik `Połącz`.
2.  **api.js**: Otwiera WebSocket.
3.  **api.js**: Po `onopen` wysyła `{type: "auth_password", ...}`.
4.  **api.js**: Następnie wysyła `{type: "auth_username", ...}`.
5.  **api.js**: Odbiera `chat_history` i `user_list` -> Aktualizuje `state.js`.
6.  **ui.js**: Ukrywa ekran logowania, pokazuje czat.

### Wysyłanie Wiadomości
1.  **User**: Wpisuje tekst -> Enter.
2.  **api.js**: Wysyła `{type: "new_message", payload: {text: "..."}}`.
3.  **Server**: Rozsyła `new_message` do wszystkich.
4.  **api.js (u wszystkich)**: Odbiera wiadomość -> Dodaje do `state.messages`.
5.  **ui.js**: Renderuje nową wiadomość w oknie czatu.

---

## 5. Układ Interfejsu (Layout)

Aktualny układ to uproszczona wersja 2-kolumnowa:

```
┌─────────────────────────────────────────────────────────┐
│                    IRC Client Header                    │
├───────────────────────────────────────┬─────────────────┤
│                                       │                 │
│             Chat Window               │    User List    │
│       (Historia wiadomości)           │    (Online)     │
│                                       │                 │
│───────────────────────────────────────┤                 │
│        Message Input Field            │                 │
└───────────────────────────────────────┴─────────────────┘
```

### Kluczowe Funkcje UI:
-   `showLoginScreen() / hideLoginScreen()`: Przełączanie widoczności między formularzem a czatem.
-   `appendMessage(user, text, time)`: Dodawanie nowej bańki wiadomości.
-   `updateUserList(users)`: Odświeżanie listy osób online po każdej zmianie.
-   `renderHistory(messages)`: Wyświetlenie starych wiadomości po zalogowaniu.

---

## 6. Obsługa Zdarzeń WebSocket

Moduł `api.js` musi reagować na następujące typy wiadomości:
-   `chat_history`: Inicjalizacja okna czatu.
-   `user_list`: Aktualizacja bocznego panelu.
-   `new_message`: Nowa treść od kogoś.
-   `user_joined` / `user_left`: Powiadomienia systemowe na czacie.
-   `auth_error` / `error`: Wyświetlanie błędów w statusie.
