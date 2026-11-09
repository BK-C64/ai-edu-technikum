# Plan Rozwoju Aplikacji MyDiscord: Od Scaffoldingu Backend do Pełnego Klienta (Kurs dla Nauczycieli)

Poniższy plan przeznaczony jest do nauki budowy nowoczesnej aplikacji webowej w architekturze klient-serwer (Full-Stack). Każdy moduł zawiera cele edukacyjne, zakres techniczny (backend + frontend), historyjki użytkownika / kryteria akceptacji oraz **sposób weryfikacji i testowania** (w tym automatyczne testy API).

---

## Przegląd Modułów / Lekcji

- **Moduł 0: Scaffolding projektu, FastAPI i pierwsze testy integracyjne**
- **Moduł 1: Baza danych SQLite, modele i obsługa danych**
- **Moduł 2: Protokół WebSocket i autoryzacja (Backend Core)**
- **Moduł 3: Statyczny frontend i nawiązanie połączenia WebSocket**
- **Moduł 4: Autentykacja, inicjalizacja stanu i historia czatu**
- **Moduł 5: Dwukierunkowa komunikacja w czasie rzeczywistym (Wysyłanie i Broadcast)**
- **Moduł 6: Zarządzanie obecnością (Presence: dołączenia, wyjścia, lista online)**
- **Moduł 7: Wielokanałowość – tworzenie i przełączanie kanałów**
- **Moduł 8: Interakcje zaawansowane (Typing indicator, rozmowy prywatne DM)**
- **Moduł 9: Dobre praktyki dydaktyczne, przegląd kodu i wdrożenie**

---

### Moduł 0: Scaffolding projektu, FastAPI i pierwsze testy integracyjne

- **Cel edukacyjny:** Zrozumienie struktury projektu Full-Stack, środowiska wirtualnego Pythona (`venv`), frameworka FastAPI oraz uruchomienia serwera ASGI (Uvicorn). Poznanie podstaw automatycznego testowania API za pomocą `pytest` i `httpx`.
- **Zakres backend:**
  - Utworzenie struktury katalogów: `backend/`, `frontend/`, `tests/`.
  - Konfiguracja pliku `requirements.txt` (`fastapi`, `uvicorn`, `websockets`, `pytest`, `httpx`).
  - Implementacja punktu startowego `backend/main.py`: inicjalizacja instancji FastAPI, montowanie plików statycznych (`/static`), endpoint diagnostyczny `GET /health`.
- **Weryfikacja i testy:**
  - Test jednostkowy/integracyjny `tests/test_health.py` weryfikujący kod 200 i strukturę JSON odpowiedzi `GET /health`.
  - Uruchomienie aplikacji: `uvicorn backend.main:app --reload` i weryfikacja Swagger UI pod `http://localhost:8000/docs`.

---

### Moduł 1: Baza danych SQLite, modele i obsługa danych

- **Cel edukacyjny:** Zrozumienie relacyjnych baz danych, schematów tabel i operacji CRUD w SQLite bez konieczności instalowania zewnętrznych serwerów bazodanowych.
- **Zakres backend:**
  - Implementacja modułu bazy danych `backend/database.py` (połączenie z plikiem `chat.db`).
  - Inicjalizacja schematu zgodnie z `docs/architecture_plan/database_schema.md`:
    - Tabela `users` (`id`, `username`, `password_hash`, `created_at`),
    - Tabela `channels` (`id`, `name`, `type`, `created_at`),
    - Tabela `messages` (`id`, `channel_id`, `user_id`, `text`, `created_at`, `edited_at`),
    - Tabela `channel_members` (`user_id`, `channel_id`).
  - Funkcja seedująca domyślny kanał `#general`.
  - Bezpieczne haszowanie haseł (np. SHA-256 z solą lub `bcrypt`/`hashlib`).
- **Weryfikacja i testy:**
  - Test automatyczny `tests/test_database.py`: tworzenie użytkownika, weryfikacja hasha, tworzenie wiadomości i pobieranie historii kanału.

---

### Moduł 2: Protokół WebSocket i autoryzacja (Backend Core)

- **Cel edukacyjny:** Zrozumienie różnicy między protokołem HTTP a WebSocket. Zarządzanie pulą połączeń (Connection Manager), walidacja komunikatów JSON wg zdefiniowanego kontraktu API.
- **Zakres backend:**
  - Endpoint WebSocket: `@app.websocket("/ws")`.
  - Klasa `ConnectionManager`: rejestracja socketów, kojarzenie połączenia z `user_id`, broadcast do aktywnych klientów.
  - Obsługa ramki `auth_request` (auto-rejestracja i logowanie):
    - Weryfikacja formatu JSON (`type`, `payload`).
    - Poprawne dane -> odpowiedź `auth_success` z pełnym stanem (profil, kanały, online_users, historia `#general`).
    - Błędne dane / nick zajęty w aktywnej sesji -> odpowiedź `auth_failure` i bezpieczne zamknięcie połączenia.
- **Weryfikacja i testy:**
  - Test `tests/test_websocket_auth.py` symulujący klienta WebSocket (`TestClient.websocket_connect`):
    - Test 1: Błędne hasło dla istniejącego usera -> `auth_failure`.
    - Test 2: Poprawne logowanie -> otrzymanie `auth_success` z listą kanałów i użytkowników.
    - Test 3: Próba podwójnego logowania tym samym nickiem -> błąd zajętości nicka.

---

### Moduł 3: Statyczny frontend i nawiązanie połączenia WebSocket

- **Cel edukacyjny:** Organizacja warstwy klienta w czystym HTML/CSS/JS (Vanilla JS). Obsługa obiektu `new WebSocket()` w przeglądarce i stanów połączenia.
- **Zakres frontend:**
  - Integracja makiet z `docs/product/design_ux/` do katalogu `frontend/`:
    - `index.html` (widok logowania z możliwością przejścia do czatu),
    - `channel_view.html` / komponent czatu,
    - `style.css` (ciemny motyw Discorda).
  - Skrypt `frontend/app.js`: nawiązanie połączenia z `ws://localhost:8000/ws`, obsługa zdarzeń `onopen`, `onmessage`, `onerror`, `onclose`.
  - Wizualny wskaźnik stanu połączenia (np. zielona/czerwona dioda połączenia).
- **User Story:**
  - *Jako użytkownik chcę widzieć estetyczny ekran logowania i mieć pewność, że moja przeglądarka połączyła się z serwerem czatu.*
- **Weryfikacja i testy:**
  - Otwarcie strony w przeglądarce, sprawdzenie w konsoli deweloperskiej (F12 -> zakładka Network -> WS) pomyślnego handshake WebSocket (status 101 Switching Protocols).

---

### Moduł 4: Autentykacja, inicjalizacja stanu i historia czatu

- **Cel edukacyjny:** Zarządzanie stanem po stronie klienta (Client State Management) oraz dynamiczne modyfikowanie drzewa DOM po otrzymaniu danych w czasie rzeczywistym.
- **Zakres frontend & backend:**
  - Po kliknięciu "Dołącz do czatu" frontend wysyła ramkę `auth_request`.
  - Po odebraniu `auth_success`:
    - Płynne ukrycie ekranu logowania i odsłonięcie głównego trójkolumnowego interfejsu Discorda.
    - Wyrenderowanie listy kanałów (lewy panel).
    - Wyrenderowanie listy obecnych użytkowników (prawy panel).
    - Wyrenderowanie historii wiadomości w oknie głównym z poprawnym rozróżnieniem autora i daty (`HH:MM`).
- **User Stories:**
  - *Jako nowy użytkownik chcę podać swój nick i hasło, aby zalogować się do czatu.*
  - *Jako zalogowany użytkownik chcę od razu po wejściu widzieć historię ostatnich rozmów na kanale głównym oraz listę osób dostępnych online.*
- **Weryfikacja i testy:**
  - Ręczne logowanie dwóch różnych użytkowników w dwóch oknach przeglądarki (np. zwykłe i incognito).

---

### Moduł 5: Dwukierunkowa komunikacja w czasie rzeczywistym (Wysyłanie i Broadcast)

- **Cel edukacyjny:** Zrozumienie wzorca Pub/Sub (Publish/Subscribe) i rozgłaszania wiadomości do wielu odbiorców. Integracja zapisu do bazy danych z asynchronicznym powiadamianiem klientów.
- **Zakres backend & frontend:**
  - Frontend: obsługa pola tekstowego i wysyłanie ramki `send_message` po naciśnięciu `Enter` lub przycisku "Wyślij".
  - Backend:
    - Odbiór `send_message`, walidacja długości (max 300 znaków, niepusty tekst).
    - Zapis wiadomości do tabeli `messages` w SQLite (generowanie `id`: `msg_...`).
    - Rozgłoszenie ramki `new_message` do wszystkich klientów subskrybujących dany kanał.
  - Frontend: odbiór `new_message`, utworzenie nowego elementu DOM wiadomości, automatyczne przewinięcie okna czatu na sam dół (auto-scroll).
- **User Story:**
  - *Jako uczestnik czatu chcę wpisać wiadomość i wysłać ją, a także widzieć wiadomości innych osób natychmiast, bez konieczności odświeżania strony.*
- **Weryfikacja i testy:**
  - Test automatyczny WebSocket `tests/test_messaging.py`: dwóch połączonych klientów, klient A wysyła wiadomość, weryfikacja czy klient B odebrał `new_message` z identycznym tekstem i poprawnym `message.id`.
  - Sprawdzenie w bazie danych, czy wiadomość została trwale zapisana w tabeli `messages`.

---

### Moduł 6: Zarządzanie obecnością (Presence: dołączenia, wyjścia, lista online)

- **Cel edukacyjny:** Śledzenie cyklu życia połączeń sieciowych, obsługa nagłych rozłączeń (np. zamknięcie karty) i synchronizacja stanu pomiędzy wszystkimi węzłami.
- **Zakres backend & frontend:**
  - Backend:
    - Przy udanym `auth_success` serwer rozsyła do pozostałych zdarzenie `user_joined` oraz zaktualizowaną listę `user_list_update`.
    - Po przerwaniu połączenia (`WebSocketDisconnect`) serwer usuwa klienta z listy aktywnych sesji i rozsyła `user_left` oraz `user_list_update`.
  - Frontend:
    - Dynamiczne odświeżanie prawego paska użytkowników online bez przeładowania strony.
    - Opcjonalne subtelne powiadomienie w oknie czatu (np. *"Jan dołączył do czatu"*).
- **User Story:**
  - *Jako użytkownik chcę widzieć na żywo, kto w danej chwili jest online i otrzymywać informację, gdy ktoś wchodzi na czat lub go opuszcza.*
- **Weryfikacja i testy:**
  - Test automatyczny `tests/test_presence.py`: weryfikacja emisji `user_joined` i `user_left` po rozłączeniu klienta.

---

### Moduł 7: Wielokanałowość – tworzenie i przełączanie kanałów

- **Cel edukacyjny:** Modelowanie relacji danych wiele-do-wielu, obsługa kontekstu i filtracji danych po `channel_id`.
- **Zakres backend & frontend:**
  - Backend:
    - Obsługa C2S `create_channel` (walidacja nazwy, zapis w tabeli `channels`, broadcast S2C `channel_created`).
    - Obsługa C2S `request_history` (pobranie z SQLite ostatnich 50 wiadomości dla danego `channel_id` i odesłanie S2C `chat_history`).
  - Frontend:
    - Obsługa kliknięcia przycisku `+` przy liście kanałów (modal / prompt z nazwą kanału).
    - Kliknięcie w kanał na liście: aktualizacja zmiennej `currentChannelId`, wyczyszczenie okna czatu, wysłanie `request_history`, renderowanie pobranych wiadomości.
- **User Stories:**
  - *Jako użytkownik chcę stworzyć nowy kanał tematyczny, aby rozmawiać na konkretny temat.*
  - *Jako użytkownik chcę przełączać się między kanałami i widzieć tylko rozmowy z aktywnego pokoju.*
- **Weryfikacja i testy:**
  - Test `tests/test_channels.py`: utworzenie kanału, przełączenie, wysłanie wiadomości na kanał B i upewnienie się, że nie pojawia się ona na kanale `#general`.

---

### Moduł 8: Interakcje zaawansowane (Typing indicator, rozmowy prywatne DM)

- **Cel edukacyjny:** Przesyłanie zdarzeń efemerycznych (nietrwałych) w czasie rzeczywistym oraz obsługa prywatnych kanałów komunikacji 1-na-1.
- **Zakres backend & frontend:**
  - **Wskaźnik pisania:**
    - C2S `typing_started` z `channel_id`.
    - Serwer rozsyła S2C `user_is_typing` do pozostałych użytkowników na tym kanale.
    - Frontend wyświetla dyskretny komunikat *"Anna pisze..."* i automatycznie ukrywa go po 3-4 sekundach.
  - **Rozmowy prywatne (DM):**
    - Kliknięcie w nick na liście użytkowników online -> wysłanie C2S `start_private_chat`.
    - Serwer wyszukuje lub tworzy wirtualny kanał `dm_user1_user2` i odsyła S2C `private_chat_started`.
    - Wiadomości na kanale DM docierają wyłącznie do dwóch zainteresowanych osób.
- **User Stories:**
  - *Jako rozmówca chcę widzieć informację "ktoś pisze...", abym wiedział, że za chwilę otrzymam odpowiedź.*
  - *Jako użytkownik chcę kliknąć na konkretną osobę i prowadzić z nią poufną rozmowę 1-na-1.*
- **Weryfikacja i testy:**
  - Test `tests/test_direct_messages.py`: upewnienie się, że wiadomości prywatne pomiędzy Użytkownikiem A i B nie wyciekają do Użytkownika C.

---

### Moduł 9: Dobre praktyki dydaktyczne, przegląd kodu i wdrożenie

- **Cel edukacyjny:** Metodyka nauczania informatyki przy asyście AI: jak prowadzić przeglądy kodu (Code Review) z uczniami, jak weryfikować poprawność kodu generowanego przez LLM oraz jak przygotować aplikację do uruchomienia (np. konteneryzacja w Dockerze).
- **Zakres:**
  - Przegląd całości kodu pod kątem bezpieczeństwa (SQL Injection, XSS przy wstawianiu wiadomości do DOM).
  - Przygotowanie pliku `Dockerfile` oraz `docker-compose.yml` dla ułatwienia dystrybucji środowiska w szkole.
  - Opracowanie mini-zadań i pytań kontrolnych dla uczniów (np. *"dodaj limit 50 znaków dla nazwy kanału"*, *"dodaj licznik nieprzeczytanych wiadomości"*).
