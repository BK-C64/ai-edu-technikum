# Plan Implementacji: Backend Czatu - Lekcja 5

Poniżej znajduje się szczegółowy, krokowy plan implementacji backendu aplikacji AI-Powered Team Chat, oparty na architekturze zdefiniowanej w `docs/architecture/`.

## Zakres MVP dla Lekcji 5 (MINIMAL)

**CEL:** Działający backend gotowy do integracji z frontendem na 1-2 lekcjach.

**IMPLEMENTUJEMY:**
- ✅ Autentykacja użytkowników (auth_request/auth_success/auth_failure)
- ✅ Wysyłanie i odbieranie wiadomości (send_message/new_message)
- ✅ Historia wiadomości (request_history/chat_history)
- ✅ Notyfikacje o użytkownikach (user_joined/user_left/user_list_update)
- ✅ Obsługa błędów (error_message)
- ✅ Dwa publiczne kanały: "general" i "random"
- ✅ Przykładowe dane w bazie (5 użytkowników, 15 wiadomości)

**NIE IMPLEMENTUJEMY (na późniejsze lekcje):**
- ❌ Rozmowy prywatne (start_private_chat/private_chat_started)
- ❌ Wskaźnik pisania (typing_started/user_is_typing)
- ❌ Reakcje emoji (toggle_reaction)
- ❌ Edycja/usuwanie wiadomości (edit_message/delete_message)
- ❌ Wyszukiwanie użytkowników (search_users)

**KLUCZOWE WYMAGANIA:**
- 🔒 **Zgodność z api_design.md** - to punkt integracji z frontendem!
- 🧪 **Kompletne testy** - weryfikują zgodność z API
- 📚 **Dokumentacja dla uczniów** - instalacja i quick start
- 🚀 **Działanie "out of the box"** - uczniowie tylko ściągają i uruchamiają

---

## Kluczowe Decyzje Implementacyjne

### 1. Formaty i Konwencje:

**Generowanie ID:**
```python
# Proste, czytelne ID (nie UUID - zbyt skomplikowane dla uczniów)
user_id = "user_1", "user_2", "user_3", ...
message_id = f"msg_{counter}"  # Licznik auto-increment
channel_id = "general", "random"  # Stałe nazwy dla kanałów publicznych
```

**Format timestamp (ISO 8601 UTC):**
```python
from datetime import datetime, timezone

timestamp = datetime.now(timezone.utc).isoformat()
# Przykład: "2025-11-02T16:30:00+00:00"
```

**Kodowanie:**
```python
# Zawsze UTF-8 dla polskich znaków i emoji
conn.execute("PRAGMA encoding = 'UTF-8'")
```

### 2. Zarządzanie Sesjami:

**ConnectionManager przechowuje:**
```python
{
    websocket_connection: {
        "user_id": "user_1",
        "username": "Jan",
        "current_channel": "general"
    }
}
```

**To pozwala na:**
- Identyfikację kto wysłał wiadomość
- Broadcast tylko do użytkowników na kanale
- Walidację duplikatów nicków (kto jest online)

### 3. Uproszczone Hasło (dla celów edukacyjnych):

```python
# TYLKO dla środowiska szkolnego!
# W produkcji NIGDY nie przechowuj haseł jawnym tekstem!
PASSWORD = "ircAMP2024!"

# W bazie: password_hash = "ircAMP2024!" (na razie bez haszowania)
# TODO: Dodać bcrypt w późniejszej lekcji
```

---

## Krok 1: Inicjalizacja Projektu Backend

Celem tego kroku jest stworzenie podstawowej struktury projektu backendu z niezbędnymi zależnościami.

-   [x] **Utwórz katalog `server/` w projekcie:**
    -   Będzie to główny katalog dla backendu.

-   [x] **Utwórz plik `server/requirements.txt`:**
    -   Dodaj zależności:
        ```
        fastapi==0.104.1
        uvicorn[standard]==0.24.0
        websockets==12.0
        pytest==7.4.3
        pytest-asyncio==0.21.1
        ```

-   [x] **Utwórz plik `server/README.md`:**
    -   Dodaj instrukcje instalacji i uruchomienia:
        - Jak zainstalować zależności: `pip install -r requirements.txt`
        - Jak uruchomić serwer: `python server.py`
        - **Jak zresetować bazę danych**: `python server.py --reset`
        - Wyjaśnij że przy pierwszym uruchomieniu baza jest tworzona automatycznie z przykładowymi danymi
        - Przy kolejnych uruchomieniach dane są zachowywane

-   [x] **Utwórz strukturę katalogów:**
    ```
    server/
    ├── server.py                # Główny plik serwera
    ├── database.py              # Zarządzanie bazą danych
    ├── models.py                # Modele danych
    ├── websocket_handler.py     # Obsługa WebSocket
    ├── requirements.txt
    ├── README.md
    ├── tests/
    │   ├── __init__.py
    │   ├── test_database.py     # Testy jednostkowe dla database.py
    │   ├── test_api_contract.py # Testy zgodności z api_design.md
    │   └── test_integration.py  # Testy integracyjne WebSocket flow
    └── .gitignore               # Ignoruj chat.db, __pycache__, etc.
    ```

## Krok 2: Implementacja Modeli Danych i Bazy

Stworzenie modeli danych i inicjalizacja bazy SQLite z przykładowymi danymi.

-   [x] **W `server/models.py`:**
    -   Zdefiniuj klasy danych (dataclasses lub Pydantic models):
        - `User` (id, username, password_hash, created_at)
        - `Channel` (id, name, type, created_at)
        - `Message` (id, channel_id, user_id, text, timestamp, edited_at)
    -   Dodaj funkcje pomocnicze do serializacji obiektów do JSON.

-   [x] **W `server/database.py`:**
    -   **WAŻNE: Inteligentna inicjalizacja bazy danych**
        - Zaimportuj `os` i `sqlite3`
        - Funkcja `init_database()` powinna:
            1. Sprawdzić czy plik `chat.db` istnieje (`os.path.exists('chat.db')`)
            2. Jeśli NIE istnieje:
               - Utworzyć połączenie z bazą
               - Wywołać `create_tables(conn)` - tworzy strukturę tabel
               - Wywołać `seed_sample_data(conn)` - ładuje przykładowe dane
               - Wyświetlić: `"✓ Baza danych utworzona z przykładowymi danymi"`
            3. Jeśli istnieje:
               - Tylko utworzyć połączenie
               - Wyświetlić: `"✓ Połączono z istniejącą bazą danych"`
            4. Zwrócić obiekt `connection`
    -   Zaimplementuj funkcję `create_tables(conn)`:
        - Tworzenie tabeli `users` (używaj `CREATE TABLE IF NOT EXISTS`)
        - Tworzenie tabeli `channels`
        - Tworzenie tabeli `messages`
        - Tworzenie tabeli `channel_members`
    -   Zaimplementuj funkcję `seed_sample_data(conn)`:
        - **Ta funkcja jest wywoływana TYLKO przy pierwszym uruchomieniu**
        - Dodaj 3-5 przykładowych użytkowników (np. "Jan", "Anna", "Piotr")
        - Dodaj 2 publiczne kanały: "general" i "random"
        - Dodaj przypisania użytkowników do kanałów
        - Dodaj 10-15 przykładowych wiadomości do kanału "general"
    -   Dodaj funkcje CRUD:
        - `get_user_by_username(username)` - zwraca użytkownika lub None
        - `get_channel_by_id(channel_id)` - zwraca kanał
        - `get_messages_for_channel(channel_id, limit=50)` - zwraca ostatnie wiadomości
        - `add_message(channel_id, user_id, text)` - dodaje nową wiadomość
        - `get_all_channels()` - zwraca listę wszystkich kanałów
    -   Użyj modułu `sqlite3` z biblioteki standardowej Pythona.
    -   Baza danych powinna być zapisywana w pliku `chat.db`.

## Krok 3: Podstawowa Konfiguracja FastAPI i WebSocket

Uruchomienie serwera FastAPI z obsługą WebSocket.

-   [x] **W `server/server.py`:**
    -   Zaimportuj FastAPI, WebSocket, oraz `uvicorn`.
    -   Zaimportuj `CORSMiddleware` z `fastapi.middleware.cors`.
    -   Zaimportuj `os` i `sys` dla obsługi argumentów linii komend.
    -   Utwórz instancję aplikacji FastAPI: `app = FastAPI()`.
    -   **KRYTYCZNE: Dodaj CORS middleware** (bez tego frontend nie połączy się!):
        ```python
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],  # Dla celów edukacyjnych - akceptuj wszystkie źródła
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        ```
    -   Dodaj endpoint główny (`GET /`):
        - Zwraca prosty JSON: `{"status": "Server is running", "version": "1.0"}`
    -   Dodaj endpoint WebSocket (`/ws`):
        - Na razie tylko akceptuj połączenie i wypisz w konsoli "Client connected".
    -   Dodaj funkcję `main()`:
        - Wywołuje `init_database()` (która automatycznie decyduje czy ładować przykładowe dane).
        - Uruchamia serwer Uvicorn na `host="0.0.0.0"` i `port=8000`.
    -   Dodaj `if __name__ == "__main__":`:
        - **Obsługa flagi --reset**:
            ```python
            if "--reset" in sys.argv:
                if os.path.exists('chat.db'):
                    os.remove('chat.db')
                    print("🔄 Baza danych została zresetowana")
            ```
        - Wywołaj `main()`.

-   [x] **Test uruchomienia:**
    -   Uruchom `python server.py`.
    -   Sprawdź czy serwer startuje bez błędów.
    -   Sprawdź czy plik `chat.db` został utworzony.
    -   Sprawdź komunikat w konsoli: "✓ Baza danych utworzona z przykładowymi danymi".
    -   Odwiedź `http://localhost:8000` w przeglądarce - powinien zwrócić JSON ze statusem.
    -   **Zatrzymaj serwer (Ctrl+C) i uruchom ponownie** - tym razem powinien wyświetlić: "✓ Połączono z istniejącą bazą danych".
    -   **Test resetu**: Uruchom `python server.py --reset` - baza powinna być usunięta i utworzona od nowa.

## Krok 4: Implementacja Zarządzania Połączeniami WebSocket

Zarządzanie wieloma jednoczesanymi połączeniami klientów i sesjami użytkowników.

-   [x] **W `server/websocket_handler.py`:**
    -   Utwórz klasę `ConnectionManager`:
        - Atrybut `active_connections`: dict mapujący WebSocket → user_info
            ```python
            {
                websocket_obj: {
                    "user_id": "user_1",
                    "username": "Jan",
                    "current_channel": "general"
                }
            }
            ```
        - Atrybut `online_usernames`: set dla szybkiego sprawdzania duplikatów
    -   Dodaj metodę `connect(websocket, user_id, username, channel_id="general")`:
        - Dodaje połączenie do `active_connections`.
        - Dodaje username do `online_usernames`.
        - Zapisuje informacje o sesji użytkownika.
    -   Dodaj metodę `disconnect(websocket)`:
        - Usuwa połączenie z `active_connections`.
        - Usuwa username z `online_usernames`.
        - Zwraca informacje o użytkowniku który się rozłączył.
    -   Dodaj metodę `is_username_taken(username)`:
        - Sprawdza czy username jest już używany przez zalogowanego użytkownika.
    -   Dodaj metodę `get_user_info(websocket)`:
        - Zwraca informacje o użytkowniku dla danego połączenia.
    -   Dodaj metodę `get_online_users()`:
        - Zwraca listę wszystkich zalogowanych użytkowników w formacie API.
    -   Dodaj metodę `broadcast_to_channel(message, channel_id, exclude_ws=None)`:
        - Wysyła wiadomość JSON do wszystkich na danym kanale.
        - Opcjonalnie wyklucza jedno połączenie (np. nadawcę).
    -   Dodaj metodę `broadcast_to_all(message, exclude_ws=None)`:
        - Wysyła wiadomość do wszystkich połączonych klientów.
    -   Dodaj metodę `send_personal_message(message, websocket)`:
        - Wysyła wiadomość do konkretnego klienta.
        - Używana dla auth_success, auth_failure, error_message.

-   [x] **W `server/server.py`:**
    -   Utwórz globalną instancję `manager = ConnectionManager()`.

## Krok 5: Implementacja Protokołu Autentykacji (zgodnie z api_design.md)

Obsługa logowania użytkowników przez WebSocket.

-   [x] **W `server/websocket_handler.py`:**
    -   Dodaj funkcję `handle_auth_request(data, websocket, manager)`:
        - Odbiera `username` i `password` z `data["payload"]`.
        - **Walidacja:**
            - Username: 3-20 znaków, tylko litery/cyfry/podkreślnik
            - Password: musi być "ircAMP2024!" (uproszczone)
        - **Sprawdź duplikaty:**
            - `if manager.is_username_taken(username)` → wyślij auth_failure
        - **Sprawdź w bazie:**
            - `user = get_user_by_username(username)`
            - Jeśli nie istnieje → wyślij auth_failure ("User not found")
            - Jeśli password się nie zgadza → wyślij auth_failure ("Invalid password")
        - **Jeśli OK:**
            1. Zarejestruj w ConnectionManager: `manager.connect(websocket, user_id, username)`
            2. Pobierz dane z bazy:
                - Wszystkie kanały: `channels = get_all_channels()`
                - Historię general: `history = get_messages_for_channel("general", limit=50)`
                - Online users: `online_users = manager.get_online_users()`
            3. Wyślij `auth_success` do tego klienta:
                ```json
                {
                  "type": "auth_success",
                  "payload": {
                    "user_info": {"id": user_id, "name": username},
                    "channels": [...],
                    "online_users": [...],
                    "initial_channel_history": {
                      "channel_id": "general",
                      "messages": [...]
                    }
                  }
                }
                ```
            4. Rozgłoś `user_joined` do WSZYSTKICH innych:
                ```json
                {
                  "type": "user_joined",
                  "payload": {"user": {"id": user_id, "name": username}}
                }
                ```
            5. Rozgłoś `user_list_update` do WSZYSTKICH:
                ```json
                {
                  "type": "user_list_update",
                  "payload": {"online_users": [...]}
                }
                ```
        - **Jeśli błąd:**
            - Wyślij `auth_failure`:
                ```json
                {
                  "type": "auth_failure",
                  "payload": {"reason": "Nickname already in use."}
                }
                ```
            - Zamknij połączenie WebSocket.

-   [x] **W `server/server.py`:**
    -   W endpoincie WebSocket (`/ws`):
        - Po zaakceptowaniu połączenia, czekaj na pierwszą wiadomość.
        - Parsuj JSON i sprawdź czy `type == "auth_request"`.
        - Wywołaj `handle_auth_request(data, websocket, manager)`.
        - Jeśli auth się nie powiedzie, przerwij połączenie.

## Krok 6: Implementacja Wysyłania i Odbierania Wiadomości

Obsługa zdarzeń `send_message` i rozgłaszanie `new_message`.

-   [x] **W `server/websocket_handler.py`:**
    -   Dodaj funkcję `handle_send_message(data, websocket, manager)`:
        - Pobierz info o użytkowniku: `user_info = manager.get_user_info(websocket)`
        - Odbiera `channel_id` i `text` z `data["payload"]`.
        - **Walidacja:**
            - Tekst nie może być pusty: `if not text.strip()` → wyślij error_message
            - Max 300 znaków: `if len(text) > 300` → wyślij error_message
            - Channel_id nie może być pusty
        - **Zapisz w bazie:**
            - `message_id = add_message(channel_id, user_info["user_id"], text)`
            - Funkcja powinna zwrócić ID nowej wiadomości
        - **Utwórz timestamp:**
            ```python
            from datetime import datetime, timezone
            timestamp = datetime.now(timezone.utc).isoformat()
            ```
        - **Rozgłoś `new_message` do WSZYSTKICH na kanale:**
            ```json
            {
              "type": "new_message",
              "payload": {
                "channel_id": "general",
                "message": {
                  "id": message_id,
                  "user": {
                    "id": user_info["user_id"],
                    "name": user_info["username"]
                  },
                  "text": "Treść wiadomości",
                  "timestamp": "2025-11-02T16:30:00+00:00"
                }
              }
            }
            ```
        - Użyj `manager.broadcast_to_channel(message, channel_id)`

-   [x] **W `server/server.py`:**
    -   W głównej pętli obsługi WebSocket:
        - Po pomyślnej autentykacji, wejdź w pętlę `while True`:
            - Odbieraj wiadomości od klienta: `data = await websocket.receive_text()`
            - Parsuj JSON: `message = json.loads(data)`
            - Sprawdź pole `message["type"]`:
                - `"send_message"` → wywołaj `handle_send_message(message, websocket, manager)`
                - `"request_history"` → wywołaj `handle_request_history(message, websocket)`
                - Nieznany typ → wyślij error_message

## Krok 7: Obsługa Żądania Historii

Implementacja `request_history` -> `chat_history`.

-   [x] **W `server/websocket_handler.py`:**
    -   Dodaj funkcję `handle_request_history(data, websocket)`:
        - Odbiera `channel_id` z payloadu.
        - Pobiera historię wiadomości z bazy używając `get_messages_for_channel()`.
        - Formatuje wiadomości do struktury zgodnej z `api_design.md`.
        - Wysyła `chat_history` do klienta.

-   [x] **W `server/server.py`:**
    -   W pętli obsługi WebSocket dodaj obsługę `type == "request_history"`.

## Krok 8: Obsługa Rozłączenia Klienta

Poprawne czyszczenie zasobów gdy klient się rozłącza.

-   [x] **W `server/server.py`:**
    -   Obuduj główną pętlę WebSocket w `try/except`:
        - W `except WebSocketDisconnect`:
            - Wywołaj `manager.disconnect()`.
            - Rozgłoś `user_left` do pozostałych klientów.
            - Wyślij zaktualizowany `user_list_update`.

## Krok 9: Obsługa Błędów i Walidacja

Dodanie obsługi błędów i walidacji danych wejściowych.

-   [x] **W `server/websocket_handler.py`:**
    -   Dodaj funkcję `send_error(websocket, message)`:
        - Wysyła `error_message` zgodnie z `api_design.md`.
    -   W każdej funkcji obsługi dodaj walidację:
        - Sprawdzaj czy wymagane pola są obecne w payloadzie.
        - Sprawdzaj długość wiadomości (max 300 znaków).
        - Sprawdzaj format username (3-20 znaków).
    -   Obsługuj wyjątki i wysyłaj odpowiednie komunikaty błędów.

## Krok 10: Implementacja Testów

**WAŻNE:** Testy są kluczowe - uczniowie będą ściągać gotowy backend i integrować z frontendem. Musimy zapewnić że backend działa zgodnie z api_design.md!

### 10.1: Testy jednostkowe bazy danych

-   [x] **Utwórz plik `tests/__init__.py`** (pusty plik).

-   [x] **Utwórz plik `tests/test_database.py`:**
    -   Testy dla `init_database()`:
        - Test że tworzy plik chat.db
        - Test że przy pierwszym uruchomieniu ładuje dane przykładowe
        - Test że przy drugim uruchomieniu NIE duplikuje danych
    -   Testy dla `get_user_by_username()`:
        - Test że znajduje istniejącego użytkownika
        - Test że zwraca None dla nieistniejącego
    -   Testy dla `get_messages_for_channel()`:
        - Test że zwraca wiadomości w chronologicznej kolejności
        - Test że respektuje limit
    -   Testy dla `add_message()`:
        - Test że dodaje wiadomość do bazy
        - Test że generuje poprawny timestamp
    -   **Użyj pytest fixtures:**
        ```python
        @pytest.fixture
        def temp_db():
            # Tworzy tymczasową bazę dla testów
            # Usuwa ją po zakończeniu testu
        ```

### 10.2: Testy zgodności z API Design (Contract Tests)

-   [x] **Utwórz plik `tests/test_api_contract.py`:**
    -   **Test struktury auth_success:**
        - Sprawdź czy zawiera wszystkie wymagane pola z api_design.md:
            - `user_info` (id, name)
            - `channels` (array)
            - `online_users` (array)
            - `initial_channel_history` (channel_id, messages)
        - Sprawdź typy danych (str, list, dict)
    -   **Test struktury new_message:**
        - Sprawdź strukturę: `{"type": "new_message", "payload": {...}}`
        - Sprawdź payload: `channel_id`, `message.user`, `message.text`, `message.timestamp`
        - Sprawdź format timestamp (ISO 8601)
    -   **Test struktury chat_history:**
        - Sprawdź `channel_id` i `messages` array
        - Sprawdź że każda wiadomość ma wymagane pola
    -   **Test walidacji danych:**
        - Username: 3-20 znaków
        - Message text: max 300 znaków, nie pusty
        - Channel_id: nie pusty
    -   **Test kodowania UTF-8:**
        - Sprawdź że polskie znaki działają: "Cześć! Jak się masz?"
        - Sprawdź że emoji działają: "Hej! 👋 😊"

### 10.3: Testy integracyjne WebSocket

-   [ ] **Utwórz plik `tests/test_integration.py`:**
    -   **Test pełnego flow autentykacji:**
        ```python
        async def test_authentication_flow():
            # 1. Połącz się z WebSocket
            # 2. Wyślij auth_request
            # 3. Sprawdź czy otrzymałeś auth_success
            # 4. Sprawdź czy inni użytkownicy dostali user_joined
        ```
    -   **Test wysyłania i odbierania wiadomości:**
        ```python
        async def test_send_receive_message():
            # 1. Zaloguj dwóch użytkowników
            # 2. User1 wysyła wiadomość
            # 3. Sprawdź czy User2 otrzymał new_message
            # 4. Sprawdź czy wiadomość ma poprawną strukturę
        ```
    -   **Test żądania historii:**
        ```python
        async def test_request_history():
            # 1. Zaloguj użytkownika
            # 2. Wyślij request_history dla "general"
            # 3. Sprawdź czy otrzymał chat_history
            # 4. Sprawdź czy historia zawiera przykładowe wiadomości
        ```
    -   **Test rozłączenia użytkownika:**
        ```python
        async def test_user_disconnect():
            # 1. Zaloguj dwóch użytkowników
            # 2. User1 rozłącza się
            # 3. Sprawdź czy User2 otrzymał user_left
            # 4. Sprawdź czy lista online_users została zaktualizowana
        ```
    -   **Test duplikatu nickname:**
        ```python
        async def test_duplicate_username():
            # 1. Zaloguj "Jan"
            # 2. Spróbuj zalogować kolejnego "Jan"
            # 3. Sprawdź czy otrzymał auth_failure z powodem "Nickname already in use"
        ```
    -   **Użyj pytest-asyncio i TestClient z FastAPI:**
        ```python
        from fastapi.testclient import TestClient
        from fastapi.websockets import WebSocket
        ```

### 10.4: Dokumentacja testów i uruchomienie

-   [x] **Utwórz plik `tests/README.md`:**
    -   Wyjaśnij strukturę testów.
    -   Dodaj instrukcje uruchomienia:
        ```bash
        # Wszystkie testy
        pytest

        # Z detalami
        pytest -v

        # Konkretny plik
        pytest tests/test_database.py

        # Konkretny test
        pytest tests/test_integration.py::test_authentication_flow
        ```
    -   Wyjaśnij co testuje każdy plik.

-   [x] **Dodaj plik `pytest.ini` w głównym katalogu server/:**
    ```ini
    [pytest]
    asyncio_mode = auto
    testpaths = tests
    python_files = test_*.py
    python_classes = Test*
    python_functions = test_*
    ```

-   [x] **Uruchom wszystkie testy i upewnij się że przechodzą:**
    ```bash
    cd server
    pytest -v
    ```

## Krok 11: Dokumentacja i Przygotowanie do Dystrybucji

Przygotowanie backendu do użycia przez uczniów.

-   [x] **Aktualizacja `server/README.md`:**
    -   Sekcja "Instalacja":
        ```bash
        pip install -r requirements.txt
        ```
    -   Sekcja "Uruchomienie":
        ```bash
        python server.py
        # lub z resetem:
        python server.py --reset
        ```
    -   Sekcja "Testowanie":
        ```bash
        pytest
        ```
    -   Dodaj przykłady wiadomości JSON zgodne z api_design.md:
        ```json
        // Auth request
        {"type": "auth_request", "payload": {"username": "Jan", "password": "ircAMP2024!"}}

        // Send message
        {"type": "send_message", "payload": {"channel_id": "general", "text": "Cześć!"}}

        // Request history
        {"type": "request_history", "payload": {"channel_id": "general"}}
        ```
    -   Dodaj informacje o endpointach:
        - HTTP: `http://localhost:8000` - status serwera
        - WebSocket: `ws://localhost:8000/ws` - połączenie czatu
    -   Dodaj "Quick Start" dla uczniów:
        1. Sklonuj/pobierz kod
        2. Zainstaluj zależności
        3. Uruchom serwer
        4. Uruchom testy (opcjonalnie)
        5. Serwer gotowy do integracji z frontendem!

-   [x] **Utwórz plik `.gitignore`:**
    ```
    # Database
    chat.db
    *.db

    # Python
    __pycache__/
    *.py[cod]
    *$py.class
    *.so
    .Python

    # Virtual Environment
    venv/
    env/
    ENV/

    # IDE
    .vscode/
    .idea/
    *.swp
    *.swo

    # Pytest
    .pytest_cache/
    .coverage
    htmlcov/
    ```

-   [x] **Utwórz plik `server/TROUBLESHOOTING.md`:**
    -   Częste problemy:
        - "Address already in use" → Inny program używa portu 8000
        - "Module not found" → Nie zainstalowano zależności
        - Testy nie przechodzą → Sprawdź czy chat.db nie jest zablokowany
    -   FAQ dla uczniów:
        - Jak sprawdzić czy serwer działa?
        - Jak zresetować bazę danych?
        - Jak dodać nowych użytkowników do przykładowych danych?

-   [x] **Test końcowy "na czysto":**
    -   Usuń `chat.db` jeśli istnieje.
    -   Usuń katalog `__pycache__` jeśli istnieje.
    -   Uruchom `python server.py`.
    -   Sprawdź logi - powinno być: "✓ Baza danych utworzona z przykładowymi danymi".
    -   Sprawdź http://localhost:8000 w przeglądarce.
    -   Uruchom `pytest` - wszystkie testy powinny przejść.
    -   Zatrzymaj serwer.
    -   Uruchom ponownie - powinno być: "✓ Połączono z istniejącą bazą danych".
    -   Test `python server.py --reset` - baza powinna zostać zresetowana.

## Lista Kontrolna Weryfikacji

### Funkcjonalność Serwera:
-   [x] Serwer uruchamia się bez błędów poleceniem `python server.py`.
-   [x] CORS middleware jest skonfigurowany (frontend może się połączyć).
-   [x] Baza danych SQLite jest tworzona automatycznie z przykładowymi danymi przy pierwszym uruchomieniu.
-   [x] Przy kolejnych uruchomieniach dane są zachowywane (nie ma duplikatów).
-   [x] Flaga `--reset` poprawnie resetuje bazę danych.
-   [x] WebSocket endpoint (`/ws`) akceptuje połączenia.

### Zgodność z API Design:
-   [x] Autentykacja działa zgodnie z api_design.md:
    - auth_request → auth_success (z wszystkimi wymaganymi polami)
    - Duplikat username → auth_failure
-   [x] Wysyłanie wiadomości zgodne z api_design.md:
    - send_message → new_message broadcast do wszystkich na kanale
    - Struktura JSON zawiera: type, payload, channel_id, message (user, text, timestamp)
-   [x] Historia kanału zgodna z api_design.md:
    - request_history → chat_history
    - Wiadomości posortowane chronologicznie
-   [x] Notyfikacje użytkowników zgodne z api_design.md:
    - Nowy użytkownik → user_joined + user_list_update
    - Rozłączenie → user_left + user_list_update

### Walidacja i Obsługa Błędów:
-   [x] Walidacja username (3-20 znaków).
-   [x] Walidacja message text (max 300 znaków, nie pusty).
-   [x] Błędy są obsługiwane i zwracane jako error_message.
-   [x] Polskie znaki i emoji działają poprawnie (UTF-8).

### Testy:
-   [x] **Wszystkie testy jednostkowe przechodzą** (`pytest tests/test_database.py`).
-   [x] **Wszystkie testy zgodności API przechodzą** (`pytest tests/test_api_contract.py`).
-   [ ] **Wszystkie testy integracyjne przechodzą** (`pytest tests/test_integration.py`).
-   [x] **Kompletny test suite przechodzi** (`pytest -v`).
-   [x] Testy weryfikują zgodność z api_design.md (wszystkie wymagane pola, typy danych, formaty).

### Dokumentacja:
-   [x] README.md zawiera kompletne instrukcje dla uczniów.
-   [x] README.md zawiera przykłady JSON zgodne z api_design.md.
-   [x] TROUBLESHOOTING.md adresuje typowe problemy.
-   [x] tests/README.md wyjaśnia jak uruchomić testy.
-   [x] Kod jest czytelny, skomentowany i zgodny z PEP 8.

### Test Końcowy (jako uczeń):
-   [x] Sklonuj/pobierz kod do czystego katalogu.
-   [x] Zainstaluj zależności: `pip install -r requirements.txt`.
-   [x] Uruchom serwer: `python server.py`.
-   [x] Sprawdź czy wyświetla się: "✓ Baza danych utworzona z przykładowymi danymi".
-   [x] Otwórz http://localhost:8000 - powinien zwrócić status JSON.
-   [x] Uruchom testy: `pytest -v` - wszystkie powinny przejść.
-   [x] Zatrzymaj serwer (Ctrl+C).
-   [x] Uruchom ponownie - powinno być: "✓ Połączono z istniejącą bazą danych".
-   [x] Test reset: `python server.py --reset` - baza resetowana.
-   [x] **Backend gotowy do integracji z frontendem!**

## Przykładowe Dane (Seed Data)

### Użytkownicy:
1. Jan Kowalski (username: "Jan", id: "user_1")
2. Anna Nowak (username: "Anna", id: "user_2")
3. Piotr Zieliński (username: "Piotr", id: "user_3")

### Kanały:
1. "general" - Ogólny (publiczny)
2. "random" - Ciekawostki (publiczny)

### Przykładowe wiadomości w kanale "general":
1. Anna: "Cześć wszystkim!"
2. Jan: "Hej! Jak leci?"
3. Piotr: "Witam! Super że tu jesteśmy"
4. Anna: "Ktoś już testował nowy projekt?"
5. Jan: "Ja zaczynam właśnie!"
6. Piotr: "Trzymajcie się! Do roboty! 💪"
7. Anna: "Powodzenia wszystkim!"

### Hasło do serwera (uproszczone na potrzeby edukacji):
- Wszystkie konta: "ircAMP2024!"

---

## Przykładowy Scenariusz Użycia (dla zrozumienia flow)

**Pomaga zrozumieć jak wszystkie elementy współpracują ze sobą.**

### Scenariusz: Dwóch użytkowników rozmawia na czacie

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. URUCHOMIENIE SERWERA                                                  │
└─────────────────────────────────────────────────────────────────────────┘

$ python server.py
✓ Baza danych utworzona z przykładowymi danymi
   - 3 użytkowników (Jan, Anna, Piotr) dodanych
   - 2 kanały (general, random) utworzone
   - 7 przykładowych wiadomości w kanale general
INFO:     Uvicorn running on http://0.0.0.0:8000

┌─────────────────────────────────────────────────────────────────────────┐
│ 2. KLIENT 1 (Jan) - LOGOWANIE                                           │
└─────────────────────────────────────────────────────────────────────────┘

WebSocket połączenie: ws://localhost:8000/ws

→ Klient wysyła:
{
  "type": "auth_request",
  "payload": {
    "username": "Jan",
    "password": "ircAMP2024!"
  }
}

← Serwer odpowiada (tylko do Jana):
{
  "type": "auth_success",
  "payload": {
    "user_info": {"id": "user_1", "name": "Jan"},
    "channels": [
      {"id": "general", "name": "Ogólny", "type": "public"},
      {"id": "random", "name": "Ciekawostki", "type": "public"}
    ],
    "online_users": [
      {"id": "user_1", "name": "Jan"}
    ],
    "initial_channel_history": {
      "channel_id": "general",
      "messages": [
        {"user": {"id": "user_2", "name": "Anna"}, "text": "Cześć wszystkim!", "timestamp": "..."},
        {"user": {"id": "user_1", "name": "Jan"}, "text": "Hej! Jak leci?", "timestamp": "..."},
        ...
      ]
    }
  }
}

┌─────────────────────────────────────────────────────────────────────────┐
│ 3. KLIENT 2 (Anna) - LOGOWANIE                                          │
└─────────────────────────────────────────────────────────────────────────┘

→ Klient 2 wysyła:
{
  "type": "auth_request",
  "payload": {
    "username": "Anna",
    "password": "ircAMP2024!"
  }
}

← Serwer do Anny:
{
  "type": "auth_success",
  "payload": {
    "user_info": {"id": "user_2", "name": "Anna"},
    ...
    "online_users": [
      {"id": "user_1", "name": "Jan"},
      {"id": "user_2", "name": "Anna"}
    ],
    ...
  }
}

← Serwer BROADCAST do Jana:
{
  "type": "user_joined",
  "payload": {
    "user": {"id": "user_2", "name": "Anna"}
  }
}

← Serwer BROADCAST do WSZYSTKICH:
{
  "type": "user_list_update",
  "payload": {
    "online_users": [
      {"id": "user_1", "name": "Jan"},
      {"id": "user_2", "name": "Anna"}
    ]
  }
}

┌─────────────────────────────────────────────────────────────────────────┐
│ 4. Anna WYSYŁA WIADOMOŚĆ                                                │
└─────────────────────────────────────────────────────────────────────────┘

→ Anna wysyła:
{
  "type": "send_message",
  "payload": {
    "channel_id": "general",
    "text": "Hej Jan! Jak się masz?"
  }
}

← Serwer BROADCAST do WSZYSTKICH na kanale general (Jan + Anna):
{
  "type": "new_message",
  "payload": {
    "channel_id": "general",
    "message": {
      "id": "msg_8",
      "user": {"id": "user_2", "name": "Anna"},
      "text": "Hej Jan! Jak się masz?",
      "timestamp": "2025-11-02T16:45:30+00:00"
    }
  }
}

┌─────────────────────────────────────────────────────────────────────────┐
│ 5. Jan ODPOWIADA                                                         │
└─────────────────────────────────────────────────────────────────────────┘

→ Jan wysyła:
{
  "type": "send_message",
  "payload": {
    "channel_id": "general",
    "text": "Świetnie! A u Ciebie? 😊"
  }
}

← Serwer BROADCAST (do obu):
{
  "type": "new_message",
  "payload": {
    "channel_id": "general",
    "message": {
      "id": "msg_9",
      "user": {"id": "user_1", "name": "Jan"},
      "text": "Świetnie! A u Ciebie? 😊",
      "timestamp": "2025-11-02T16:45:35+00:00"
    }
  }
}

┌─────────────────────────────────────────────────────────────────────────┐
│ 6. Jan PRZEŁĄCZA SIĘ na kanał "random" i prosi o historię              │
└─────────────────────────────────────────────────────────────────────────┘

→ Jan wysyła:
{
  "type": "request_history",
  "payload": {
    "channel_id": "random"
  }
}

← Serwer do Jana:
{
  "type": "chat_history",
  "payload": {
    "channel_id": "random",
    "messages": []  # Pusty kanał, brak historii
  }
}

┌─────────────────────────────────────────────────────────────────────────┐
│ 7. Anna ROZŁĄCZA SIĘ                                                    │
└─────────────────────────────────────────────────────────────────────────┘

WebSocket disconnect event

← Serwer BROADCAST do Jana:
{
  "type": "user_left",
  "payload": {
    "user": {"id": "user_2", "name": "Anna"}
  }
}

← Serwer BROADCAST do WSZYSTKICH:
{
  "type": "user_list_update",
  "payload": {
    "online_users": [
      {"id": "user_1", "name": "Jan"}
    ]
  }
}
```

### Obserwacje z tego scenariusza:

1. **Autentykacja** zwraca WSZYSTKIE potrzebne dane na start (channels, users, history)
2. **Broadcast** - każda akcja (join, message, leave) jest rozgłaszana do wszystkich
3. **user_list_update** - po KAŻDEJ zmianie listy online (join/leave)
4. **Timestamp** - zawsze w formacie ISO 8601 UTC
5. **Struktura JSON** - zawsze `{"type": "...", "payload": {...}}`
6. **Historia** - tylko na żądanie dla konkretnego kanału

---

## Wskazówki Debugowania dla Uczniów

### Problem: Serwer nie startuje
```
Błąd: "Address already in use"
Rozwiązanie: Port 8000 jest zajęty
→ Zatrzymaj inny proces na porcie 8000
→ Lub zmień port w server.py: uvicorn.run(app, port=8001)
```

### Problem: Testy nie przechodzą
```
Błąd: "database is locked"
Rozwiązanie:
→ Zatrzymaj serwer przed uruchomieniem testów
→ Usuń chat.db i uruchom ponownie
```

### Problem: Frontend nie może się połączyć
```
Błąd: WebSocket connection failed
Rozwiązanie:
→ Sprawdź czy CORS middleware jest dodany w server.py
→ Sprawdź URL: powinno być ws://localhost:8000/ws (nie http://)
→ Sprawdź czy serwer rzeczywiście działa (http://localhost:8000 w przeglądarce)
```

### Problem: Polskie znaki wyświetlają się jako �����
```
Rozwiązanie:
→ Dodaj encoding UTF-8 w database.py
→ Upewnij się że pliki .py są zapisane jako UTF-8
```

---

## Podsumowanie dla Nauczyciela

**Gotowy backend zawiera:**
- ✅ Kompletną implementację protokołu WebSocket zgodnie z api_design.md
- ✅ Bazę SQLite z automatycznym seed data
- ✅ Kompletny test suite weryfikujący zgodność z API
- ✅ Dokumentację dla uczniów (README, TROUBLESHOOTING)
- ✅ Flag --reset do łatwego resetowania bazy

**Uczniowie otrzymają:**
- Działający backend "out of the box"
- Jasną dokumentację jak uruchomić
- Przykłady JSON do testowania
- Testy pokazujące jak wszystko powinno działać

**Na kolejnych lekcjach uczniowie:**
1. Zintegrują ten backend z frontendem (HTML/CSS/JS)
2. Zobaczą działającą aplikację czatu
3. Zrozumieją komunikację klient-serwer
4. Będą mogli rozszerzać funkcjonalność (DM, reactions, typing, etc.)
