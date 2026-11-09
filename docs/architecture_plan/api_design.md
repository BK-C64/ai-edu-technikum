# Projekt API WebSocket

Dokument ten definiuje protokół komunikacji w czasie rzeczywistym między klientem (przeglądarką) a serwerem, oparty na technologii WebSocket.

## 1. Zasady Ogólne

-   **Format Komunikacji:** Wszystkie wiadomości przesyłane przez WebSocket są w formacie JSON.
-   **Struktura Wiadomości:** Każda wiadomość, zarówno od klienta do serwera (C2S), jak i od serwera do klienta (S2C), ma następującą strukturę:
    ```json
    {
      "type": "nazwa_zdarzenia",
      "payload": {
        "parametr1": "wartosc1",
        "parametr2": "wartosc2"
      }
    }
    ```
-   **Identyfikator Kanału (`channel_id`):** Wszystkie zdarzenia związane z konkretną rozmową (wysyłanie/odbieranie wiadomości, historia, wskaźnik pisania) muszą zawierać `channel_id`. Jest to klucz do obsługi wielu kanałów publicznych i rozmów prywatnych w przyszłości.

---

## 2. Format Danych i Walidacja

Aby zapewnić spójność i uniknąć błędów, poniżej zdefiniowano formaty i ograniczenia dla kluczowych pól danych. Zarówno klient, jak i serwer powinny przestrzegać tych zasad.

-   **`user.id`**
    -   **Typ:** `String`
    -   **Format:** Unikalny identyfikator generowany przez serwer (np. UUID).
    -   **Przykład:** `"user_a4f8-12b"`

-   **`user.name` / `username`**
    -   **Typ:** `String`
    -   **Ograniczenia:** Musi mieć od 3 do 20 znaków. Może zawierać litery, cyfry i podkreślenia.
    -   **Przykład:** `"Jan_Kowalski_1"`

-   **`channel.id`**
    -   **Typ:** `String`
    -   **Format:** Krótki, czytelny identyfikator. Dla rozmów prywatnych może być złożeniem ID dwóch użytkowników.
    -   **Przykład:** `"general"`, `"dm_user1_user2"`

-   **`message.id`**
    -   **Typ:** `String`
    -   **Format:** Unikalny identyfikator wiadomości generowany przez serwer (np. UUID lub prefiks z timestampem).
    -   **Przykład:** `"msg_1a2b3c-4d5e"`

-   **`message.text`**
    -   **Typ:** `String`
    -   **Ograniczenia:** Nie może być pusty. Maksymalna długość to 300 znaków.
    -   **Walidacja:** Serwer odrzuci zbyt długie wiadomości i poinformuje klienta.

-   **`timestamp`**
    -   **Typ:** `String`
    -   **Format:** ISO 8601 UTC. Zapewnia to jednoznaczność strefy czasowej.
    -   **Przykład:** `"2025-09-28T10:01:00Z"`

---

## 3. Przepływ Komunikacji (wg User Stories)

### Moduły 2 & 4: Pierwsze Uruchomienie i Uwierzytelnienie (Auth)

#### User Story: Logowanie

> **Jako nowy użytkownik,** chcę zobaczyć ekran logowania, na którym mogę podać swój nick i hasło do serwera, aby rozpocząć korzystanie z aplikacji.

-   **(C2S) `auth_request`**: Klient wysyła prośbę o uwierzytelnienie.
    ```json
    {
      "type": "auth_request",
      "payload": {
        "username": "JanKowalski",
        "password": "haslo_uzytkownika"
      }
    }
    ```
-   **(S2C) `auth_success`**: Serwer potwierdza pomyślne zalogowanie i przesyła **pełny początkowy stan aplikacji**, w tym historię domyślnego kanału.
    ```json
    {
      "type": "auth_success",
      "payload": {
        "user_info": { "id": "user123", "name": "JanKowalski" },
        "channels": [
          { "id": "general", "name": "Ogólny", "type": "public" },
          { "id": "random", "name": "Ciekawostki", "type": "public" }
        ],
        "online_users": [
          { "id": "user123", "name": "JanKowalski" },
          { "id": "user456", "name": "AnnaNowak" }
        ],
        "initial_channel_history": {
          "channel_id": "general",
          "messages": [
            { "id": "msg_001", "user": { "id": "user456", "name": "AnnaNowak" }, "text": "Cześć wszystkim!", "timestamp": "2025-09-28T10:00:00Z" },
            { "id": "msg_002", "user": { "id": "user123", "name": "JanKowalski" }, "text": "Hej!", "timestamp": "2025-09-28T10:01:00Z" }
          ]
        }
      }
    }
    ```
-   **(S2C) `auth_failure`**: Serwer odrzuca próbę logowania.
    ```json
    {
      "type": "auth_failure",
      "payload": {
        "reason": "Nickname already in use." // lub "Invalid password."
      }
    }
    ```

-   **Założenia:**
    -   **Rejestracja i logowanie:** Model uproszczony (auto-rejestracja) – jeśli użytkownik o podanym `username` nie istnieje w bazie SQLite, serwer tworzy nowe konto i haszuje przekazane hasło. Jeśli użytkownik istnieje, serwer weryfikuje podane hasło z hashem. Jeśli użytkownik o tym nicku jest aktualnie połączony (sesja aktywna), serwer zwraca `auth_failure` z powodem `"Nickname already in use."`.
    -   Serwer zawsze wysyła historię dla domyślnego, głównego kanału (np. "general").
    -   Lista `online_users` zawiera wszystkich użytkowników połączonych z serwerem, niezależnie od kanału.
    -   Jeśli uwierzytelnianie się nie powiedzie, połączenie WebSocket jest zamykane przez serwer.

#### User Story: Wyświetlanie historii i listy użytkowników

> **Jako zalogowany użytkownik,** chcę, aby aplikacja automatycznie wyświetliła mi historię rozmów oraz listę osób online.

-   **(Uwaga)**: Zgodnie z nowym podejściem, historia domyślnego kanału i lista użytkowników są dostarczane od razu w `auth_success`. Klient musi wysłać `request_history` tylko przy **przełączaniu się** na inny kanał.
-   **(C2S) `request_history`**: Klient prosi o historię wiadomości dla **konkretnego kanału** (innego niż domyślny).
    ```json
    {
      "type": "request_history",
      "payload": {
        "channel_id": "general"
      }
    }
    ```
-   **(S2C) `chat_history`**: Serwer wysyła historię wiadomości dla danego kanału.
    ```json
    {
      "type": "chat_history",
      "payload": {
        "channel_id": "general",
        "messages": [
          { "id": "msg_001", "user": { "id": "user456", "name": "AnnaNowak" }, "text": "Cześć wszystkim!", "timestamp": "2025-09-28T10:00:00Z" },
          { "id": "msg_002", "user": { "id": "user123", "name": "JanKowalski" }, "text": "Hej!", "timestamp": "2025-09-28T10:01:00Z" }
        ]
      }
    }
    ```

-   **Założenia:**
    -   Serwer przechowuje w pamięci ograniczoną liczbę ostatnich wiadomości dla każdego kanału (np. 50-100 wiadomości).
    -   Wiadomości w odpowiedzi (`chat_history`) są zawsze posortowane chronologicznie, od najstarszej do najnowszej.
-   *(Uwaga: Początkowa lista użytkowników jest dostarczana w `auth_success`)*.

---

### Moduły 5 & 6: Aktywny Udział w Dyskusji i Zarządzanie Obecnością (Presence)

#### User Story: Wysyłanie i odbieranie wiadomości

> **Jako uczestnik czatu,** chcę móc wysłać wiadomość i widzieć nowe wiadomości od innych w czasie rzeczywistym.

-   **(C2S) `send_message`**: Klient wysyła nową wiadomość na określony kanał.
    ```json
    {
      "type": "send_message",
      "payload": {
        "channel_id": "general",
        "text": "Jak mija dzień?"
      }
    }
    ```
-   **(S2C) `new_message`**: Serwer rozgłasza nową wiadomość do wszystkich na kanale.
    ```json
    {
      "type": "new_message",
      "payload": {
        "channel_id": "general",
        "message": {
          "id": "msg_003",
          "user": { "id": "user123", "name": "JanKowalski" },
          "text": "Jak mija dzień?",
          "timestamp": "2025-09-28T10:05:00Z"
        }
      }
    }
    ```

-   **Założenia:**
    -   Wysłana wiadomość jest natychmiast dodawana do historii na serwerze.
    -   Serwer rozgłasza (`broadcast`) wiadomość `new_message` do wszystkich użytkowników subskrybujących dany `channel_id`.
    -   Wiadomość zawiera pełny obiekt `user`, aby klient mógł łatwo zidentyfikować nadawcę (np. w celu odróżnienia własnych wiadomości).

#### User Story: Powiadomienia o dołączeniu/opuszczeniu czatu

> **Jako użytkownik,** chcę widzieć informację, gdy ktoś dołącza do czatu lub go opuszcza.

-   **(S2C) `user_joined`**: Serwer informuje o nowym użytkowniku.
    ```json
    {
      "type": "user_joined",
      "payload": { "user": { "id": "user789", "name": "PiotrZieliński" } }
    }
    ```
-   **(S2C) `user_left`**: Serwer informuje o wyjściu użytkownika.
    ```json
    {
      "type": "user_left",
      "payload": { "user": { "id": "user456", "name": "AnnaNowak" } }
    }
    ```
-   **(S2C) `user_list_update`**: Po dołączeniu/wyjściu użytkownika, serwer wysyła zaktualizowaną listę osób online.
    ```json
    {
      "type": "user_list_update",
      "payload": {
        "online_users": [ /*... nowa lista ...*/ ]
      }
    }
    ```

-   **Założenia:**
    -   Zdarzenia `user_joined` i `user_left` są rozgłaszane do wszystkich podłączonych użytkowników.
    -   Po każdym takim zdarzeniu serwer wysyła zaktualizowaną listę `user_list_update`, aby wszyscy klienci mieli spójny stan.

---

### Moduł 7: Nawigacja i Wielokanałowość (Pokoje i DM)

#### User Story: Tworzenie i przełączanie kanałów oraz rozmowy prywatne

> **Jako użytkownik,** chcę mieć możliwość stworzenia nowego kanału tematycznego, przełączania się między kanałami oraz rozpoczynania rozmów prywatnych.

-   **(C2S) `create_channel`**: Klient wysyła prośbę o utworzenie nowego kanału publicznego.
    ```json
    {
      "type": "create_channel",
      "payload": {
        "name": "nauka-pythona"
      }
    }
    ```
-   **(S2C) `channel_created`**: Serwer tworzy kanał w bazie danych i rozgłasza informację do wszystkich podłączonych klientów.
    ```json
    {
      "type": "channel_created",
      "payload": {
        "channel": {
          "id": "nauka-pythona",
          "name": "nauka-pythona",
          "type": "public"
        }
      }
    }
    ```

-   **Założenia:**
    -   Nazwa kanału musi mieć od 2 do 30 znaków, bez spacji (zamieniane na myślniki) i być unikalna.
    -   Po utworzeniu kanału serwer powiadamia wszystkich użytkowników komunikatem `channel_created`, aby nowy kanał pojawił się na ich listach kanałów.


> **Jako użytkownik,** chcę przełączać się między kanałami i rozpoczynać rozmowy prywatne.

-   **Przełączanie kanałów**: Realizowane jest po stronie klienta. Po zmianie kanału w UI, klient wysyła `request_history` (zdefiniowane wyżej) dla nowego `channel_id`.
-   **(C2S) `start_private_chat`**: Klient wysyła prośbę o utworzenie (lub dołączenie do) prywatnej rozmowy z innym użytkownikiem.
    ```json
    {
      "type": "start_private_chat",
      "payload": {
        "target_user_id": "user456"
      }
    }
    ```
-   **(S2C) `private_chat_started`**: Serwer odsyła informację o kanale prywatnym. Klient może wtedy wysłać `request_history` dla tego nowego kanału.
    ```json
    {
      "type": "private_chat_started",
      "payload": {
        "channel": {
          "id": "dm_user123_user456", // Unikalny ID dla tej konwersacji
          "name": "AnnaNowak" // Nazwa kanału to nick drugiej osoby
        }
      }
    }
    ```

-   **Założenia:**
    -   Serwer jest odpowiedzialny za stworzenie unikalnego, stałego `channel_id` dla każdej pary użytkowników. Jeśli kanał już istnieje, serwer po prostu zwróci jego ID.
    -   Obaj użytkownicy (inicjujący i docelowy) otrzymują zdarzenie `private_chat_started`, aby ich interfejsy mogły zostać zaktualizowane o nowy kanał prywatny.
    -   Nazwa kanału prywatnego w obiekcie `channel` to zawsze nazwa tego "drugiego" użytkownika.

---

### Moduł 8: Interakcje Zaawansowane i Rozszerzenia

#### User Story: Wskaźnik "ktoś pisze..."

> **Jako rozmówca,** chcę widzieć informację, gdy mój rozmówca jest w trakcie tworzenia odpowiedzi.

-   **(C2S) `typing_started`**: Klient informuje serwer, że użytkownik zaczął pisać na danym kanale.
    ```json
    {
      "type": "typing_started",
      "payload": {
        "channel_id": "general"
      }
    }
    ```
-   **(S2C) `user_is_typing`**: Serwer rozgłasza informację o pisaniu do innych na kanale. (Klient powinien ukryć wskaźnik po kilku sekundach braku aktywności).
    ```json
    {
      "type": "user_is_typing",
      "payload": {
        "channel_id": "general",
        "user": { "id": "user456", "name": "AnnaNowak" }
      }
    }
    ```

-   **Założenia:**
    -   Klient wysyła `typing_started` tylko raz, gdy użytkownik zaczyna pisać. Nie wysyła tego zdarzenia przy każdym naciśnięciu klawisza.
    -   Serwer rozgłasza `user_is_typing` do wszystkich na kanale, z wyjątkiem autora.
    -   Klient jest odpowiedzialny za logikę ukrywania wskaźnika "pisania", np. po 3-5 sekundach od otrzymania ostatniego zdarzenia `user_is_typing` lub po otrzymaniu nowej wiadomości od tego użytkownika.

#### User Story: Reakcje emoji na wiadomości

> **Jako użytkownik,** chcę mieć możliwość dodawania prostych reakcji (np. 👍, ❤️) do postów innych.

-   **(C2S) `toggle_reaction`**: Klient wysyła, gdy użytkownik dodaje lub usuwa reakcję z wiadomości.
    ```json
    {
      "type": "toggle_reaction",
      "payload": {
        "message_id": "msg_abc123",
        "emoji": "👍"
      }
    }
    ```
-   **(S2C) `message_reactions_update`**: Serwer rozgłasza zaktualizowany, pełny stan reakcji dla danej wiadomości.
    ```json
    {
      "type": "message_reactions_update",
      "payload": {
        "message_id": "msg_abc123",
        "reactions": [
          {
            "emoji": "👍",
            "users": ["user123", "user456"],
            "count": 2
          },
          {
            "emoji": "❤️",
            "users": ["user789"],
            "count": 1
          }
        ]
      }
    }
    ```
-   **Założenia:**
    -   Serwer jest źródłem prawdy. Po każdej zmianie rozgłasza kompletny, aktualny stan reakcji dla wiadomości, co upraszcza logikę klienta.
    -   Klient, po otrzymaniu tego zdarzenia, całkowicie zastępuje stan reakcji dla danej wiadomości w swoim lokalnym stanie (`state.js`).

#### User Story: Edycja i usuwanie własnych wiadomości

> **Jako autor wiadomości,** chcę mieć możliwość edytowania lub usuwania swoich wypowiedzi.

-   **(C2S) `edit_message`**: Klient wysyła prośbę o edycję wiadomości.
    ```json
    {
      "type": "edit_message",
      "payload": {
        "message_id": "msg_abc123",
        "new_text": "Miałem na myśli, czy bilety są jeszcze dostępne?"
      }
    }
    ```
-   **(S2C) `message_updated`**: Serwer rozgłasza zaktualizowaną treść wiadomości.
    ```json
    {
      "type": "message_updated",
      "payload": {
        "channel_id": "general",
        "message": {
          "id": "msg_abc123",
          "user": { "id": "user123", "name": "JanKowalski" },
          "text": "Miałem na myśli, czy bilety są jeszcze dostępne?",
          "timestamp": "2025-09-28T10:05:00Z",
          "edited_at": "2025-09-28T10:06:00Z"
        }
      }
    }
    ```
-   **(C2S) `delete_message`**: Klient wysyła prośbę o usunięcie wiadomości.
    ```json
    {
      "type": "delete_message",
      "payload": {
        "message_id": "msg_abc123"
      }
    }
    ```
-   **(S2C) `message_deleted`**: Serwer informuje o usunięciu wiadomości.
    ```json
    {
      "type": "message_deleted",
      "payload": {
        "channel_id": "general",
        "message_id": "msg_abc123"
      }
    }
    ```
-   **Założenia:**
    -   Serwer weryfikuje, czy użytkownik wysyłający prośbę jest autorem wiadomości.
    -   W odpowiedzi na `edit_message`, serwer wysyła pełny, zaktualizowany obiekt wiadomości.
    -   W odpowiedzi na `delete_message`, serwer wysyła tylko ID usuniętej wiadomości, aby klient mógł ją usunąć z widoku.

#### User Story: Wyszukiwanie użytkowników

> **Jako użytkownik,** chcę mieć proste pole wyszukiwania nad listą osób online, abym mógł szybko znaleźć konkretną osobę.

-   **(C2S) `search_users`**: Klient wysyła zapytanie wyszukiwania użytkowników.
    ```json
    {
      "type": "search_users",
      "payload": {
        "query": "Ann"
      }
    }
    ```
-   **(S2C) `search_results`**: Serwer zwraca wyniki wyszukiwania.
    ```json
    {
      "type": "search_results",
      "payload": {
        "query": "Ann",
        "users": [
          { "id": "user456", "name": "AnnaNowak" },
          { "id": "user789", "name": "AnnaKowalska" }
        ]
      }
    }
    ```

-   **Założenia:**
    -   Wyszukiwanie odbywa się na serwerze i obejmuje wszystkich zarejestrowanych użytkowników, nie tylko tych online.
    -   Zapytanie `query` jest dopasowywane do początkowych fragmentów nazw użytkowników (case-insensitive).
    -   Wyniki są ograniczone do rozsądnej liczby (np. 10), aby nie przeciążać odpowiedzi.

### Zdarzenia Ogólne

-   **(S2C) `error_message`**: Generyczna wiadomość o błędzie od serwera.
    ```json
    {
      "type": "error_message",
      "payload": {
        "message": "Message too long."
      }
    }
    ```

---

## 3.1. Endpointy HTTP REST (Backend FastAPI)

Poza protokołem WebSocket serwer FastAPI udostępnia kluczowe endpointy HTTP:

1. **`GET /health`**
   - **Cel:** Diagnostyka i automatyczne testy integracyjne serwera.
   - **Odpowiedź (200 OK):**
     ```json
     {
       "status": "ok",
       "app": "MyDiscord Server",
       "version": "1.0.0"
     }
     ```

2. **`GET /` oraz pliki statyczne (`/static/...`)**
   - **Cel:** Serwowanie frontendu (HTML, CSS, JS) bezpośrednio przez FastAPI za pomocą `fastapi.staticfiles.StaticFiles`.
   - `GET /` serwuje główny plik aplikacji (`index.html` / `channel_view.html`).


---

## 4. Słowniczek Pojęć

-   **API (Application Programming Interface)**: Zestaw reguł i protokołów, który określa, jak różne aplikacje (w naszym przypadku klient i serwer) mogą się ze sobą komunikować. Nasze API definiuje, jakie wiadomości i w jakim formacie można wysyłać.

-   **WebSocket**: Technologia komunikacji, która pozwala na dwukierunkową, interaktywną rozmowę między przeglądarką użytkownika a serwerem w czasie rzeczywistym. W przeciwieństwie do tradycyjnego HTTP, gdzie klient musi pytać o nowe dane, WebSocket utrzymuje otwarte połączenie, dzięki czemu serwer może "pchać" nowe informacje (np. nowe wiadomości na czacie) do klienta, gdy tylko się pojawią.

-   **JSON (JavaScript Object Notation)**: Lekki format wymiany danych, czytelny dla człowieka i łatwy do przetworzenia przez maszyny. Używamy go do strukturyzacji wszystkich wiadomości przesyłanych przez WebSocket. Wygląda jak obiekty w JavaScript, z parami klucz-wartość.
    -   *Przykład*: `{"klucz": "wartość", "inny_klucz": 123}`

-   **Klient (Client)**: Aplikacja, z której korzysta użytkownik. W naszym projekcie jest to strona internetowa działająca w przeglądarce (frontend).

-   **Serwer (Server)**: Aplikacja działająca w tle (backend), która zarządza logiką, danymi i komunikacją między wszystkimi podłączonymi klientami.

-   **C2S (Client-to-Server)**: Oznacza wiadomość wysyłaną **od Klienta do Serwera**. Na przykład, gdy użytkownik wysyła wiadomość na czacie.

-   **S2C (Server-to-Client)**: Oznacza wiadomość wysyłaną **od Serwera do Klienta**. Na przykład, gdy serwer rozgłasza nową wiadomość do wszystkich uczestników czatu.

-   **`type`**: Klucz w naszej wiadomości JSON, który określa **rodzaj zdarzenia** lub intencję wiadomości. Na przykład ` "type": "send_message"` informuje serwer, że klient chce wysłać nową wiadomość.

-   **`payload`**: Klucz w naszej wiadomości JSON, który zawiera **właściwe dane** związane z danym zdarzeniem. To jak "ładunek" lub "przesyłka" wiadomości. Dla zdarzenia `send_message` payloadem będzie tekst wiadomości i ID kanału.

-   **`auth` (Authentication)**: Proces uwierzytelniania, czyli weryfikacji tożsamości użytkownika. W naszym przypadku polega na sprawdzeniu, czy podane hasło do serwera jest poprawne i czy wybrany nick nie jest już zajęty.

-   **`channel_id`**: Unikalny identyfikator kanału rozmowy. Używamy go, aby serwer wiedział, do której "pokoju" (rozmowy) przypisać daną wiadomość.

-   **`timestamp`**: Znacznik czasu. Zapis dokładnej daty i godziny, kiedy zdarzenie miało miejsce (np. wysłanie wiadomości). Pozwala na sortowanie wiadomości w porządku chronologicznym.
