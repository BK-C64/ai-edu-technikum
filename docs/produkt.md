# Plan Rozwoju Aplikacji MyDiscord: Od Scaffoldingu Backend do Pełnego Klienta (Kurs dla Nauczycieli)

Poniższy plan przeznaczony jest do nauki budowy nowoczesnej aplikacji webowej w architekturze klient-serwer (Full-Stack). Każdy moduł zawiera cele edukacyjne, zakres techniczny (backend + frontend), historyjki użytkownika / kryteria akceptacji, **podsumowanie co dokładnie działa po danym etapie**, **sposób połączenia z kolejnym modułem** oraz procedurę weryfikacji i testowania.

---

## Przegląd Modułów / Lekcji

- **Moduł 0: Scaffolding projektu, FastAPI i pierwsze testy integracyjne**
- **Moduł 1: Baza danych SQLite, modele i obsługa danych**
- **Moduł 2: Protokół WebSocket i autoryzacja (Backend Core)**
- **Moduł 3: Statyczny frontend i nawiązanie połączenia WebSocket**
- **Moduł 4: Autentykacja, inicjalizacja stanu i historia czatu (End-to-End)**
- **Moduł 5: Dwukierunkowa komunikacja w czasie rzeczywistym (Wysyłanie i Broadcast)**
- **Moduł 6: Zarządzanie obecnością (Presence: dołączenia, wyjścia, lista online)**
- **Moduł 7: Wielokanałowość – tworzenie i przełączanie kanałów**
- **Moduł 8: Interakcje zaawansowane i rozszerzenia (Typing indicator, DM, reakcje emoji, edycja i wyszukiwanie)**
- **Moduł 9: Dobre praktyki dydaktyczne, przegląd kodu i wdrożenie**

---

### Moduł 0: Scaffolding projektu, FastAPI i pierwsze testy integracyjne

- **Cel edukacyjny:** Zrozumienie struktury projektu Full-Stack, środowiska wirtualnego Pythona (`venv`), frameworka FastAPI oraz uruchomienia serwera ASGI (Uvicorn). Wdrożenie automatycznego testowania API za pomocą `pytest` i `httpx`.
- **Zakres backend:**
  - Utworzenie struktury katalogów: `backend/`, `frontend/`, `tests/`.
  - Konfiguracja pliku `requirements.txt` (`fastapi`, `uvicorn`, `websockets`, `pytest`, `pytest-asyncio`, `httpx`).
  - Implementacja punktu startowego `backend/main.py`: inicjalizacja instancji FastAPI, montowanie plików statycznych (`/static`), endpoint diagnostyczny `GET /health`.
- **Co działa po tym module (Oczekiwany rezultat):**
  - Serwer FastAPI uruchamia się lokalnie pod adresem `http://localhost:8000`.
  - Endpoint `GET /health` zwraca kod HTTP 200 z odpowiedzią `{"status": "ok"}`.
  - Dostępna jest automatyczna dokumentacja Swagger UI pod `http://localhost:8000/docs`.
  - Serwer jest skonfigurowany do serwowania plików z katalogu `frontend/`.
  - Pierwszy automatyczny test API przechodzi na zielono.
- **Spójność z kolejnym modułem:**
  - Posiadamy działający, przetestowany szkielet serwera HTTP. W Module 1 tworzymy niezależną warstwę trwałego składowania danych w SQLite, z której serwer skorzysta w kolejnych krokach.
- **Weryfikacja i testy:**
  - Test jednostkowy/integracyjny `tests/test_health.py`: `pytest tests/test_health.py -q --tb=short`.
  - Uruchomienie aplikacji: `uvicorn backend.main:app --reload` i wejście na `http://localhost:8000/docs`.

---

### Moduł 1: Baza danych SQLite, modele i obsługa danych

- **Cel edukacyjny:** Zrozumienie relacyjnych baz danych, schematów tabel i operacji CRUD w SQLite bez konieczności instalowania zewnętrznych serwerów bazodanowych.
- **Zakres backend:**
  - Implementacja modułu bazy danych `backend/database.py` (połączenie z plikiem `chat.db`).
  - Inicjalizacja schematu zgodnie z `docs/architecture_plan/database_schema.md`:
    - Tabela `users` (`id`, `username`, `password_hash`, `created_at`),
    - Tabela `channels` (`id`, `name`, `type`, `created_at`),
    - Tabela `messages` (`id`, `channel_id`, `user_id`, `text`, `created_at`, `edited_at`),
    - Tabela `channel_members` (`user_id`, `channel_id`),
    - Tabela `message_reactions` (`message_id`, `user_id`, `emoji`, `created_at`).
  - Funkcja seedująca domyślny kanał `#general`.
  - Bezpieczne haszowanie haseł (np. SHA-256 z solą lub `bcrypt`/`hashlib`).
- **Co działa po tym module (Oczekiwany rezultat):**
  - Autonomiczny, w pełni sprawny moduł bazodanowy operujący na pliku `chat.db`.
  - Tabele są automatycznie inicjalizowane przy pierwszym uruchomieniu, a kanał `#general` istnieje w bazie.
  - Funkcje CRUD: tworzenie konta, weryfikacja poprawności hasła, zapisywanie wiadomości oraz pobieranie historii.
  - Testy bazy danych w 100% potwierdzają poprawność relacji i szyfrowania haseł.
- **Spójność z kolejnym modułem:**
  - Zbudowaliśmy fundament składowania danych (Moduł 1) oraz serwer HTTP (Moduł 0). W Module 2 spinamy je: do serwera dodajemy gniazdo WebSocket, a cała autoryzacja oraz pobieranie stanu początkowego zaczynają czerpać z bazy SQLite.
- **Weryfikacja i testy:**
  - Test automatyczny bazy danych: `pytest tests/test_database.py -q --tb=short`.

---

### Moduł 2: Protokół WebSocket i autoryzacja (Backend Core)

- **Cel edukacyjny:** Zrozumienie różnicy między bezstanowym protokołem HTTP a ciągłym połączeniem WebSocket. Zarządzanie pulą aktywnych sesji (`ConnectionManager`), walidacja kontraktu JSON C2S/S2C oraz integracja bazy danych z asynchronicznym gniazdem sieciowym.
- **Zakres backend:**
  - Endpoint WebSocket: `@app.websocket("/ws")` w `backend/main.py`.
  - Klasa `ConnectionManager`: rejestracja socketów, kojarzenie połączenia z `user_id`, broadcast do aktywnych klientów.
  - Obsługa ramki `auth_request` (auto-rejestracja i logowanie):
    - Weryfikacja formatu JSON (`type`, `payload`).
    - Poprawne dane -> weryfikacja w bazie z Modułu 1 -> odpowiedź `auth_success` z pełnym stanem (profil, kanały, online_users, historia `#general`).
    - Błędne dane / nick zajęty w aktywnej sesji -> odpowiedź `auth_failure` i bezpieczne zamknięcie połączenia.
- **Co działa po tym module (Oczekiwany rezultat):**
  - **KOMPLETNY, W PEŁNI FUNKCJONALNY BACKEND CORE Z BAZĄ DANYCH**:
    - Serwer przyjmuje połączenia na `ws://localhost:8000/ws`.
    - Po odebraniu `auth_request` weryfikuje hasło w SQLite i odsyła kompletny stan początkowy (użytkownik, kanały, obecni, historia) w `auth_success`.
    - W przypadku błędnego hasła lub konfliktu nicków serwer odsyła `auth_failure` i zamyka gniazdo.
    - Całość przetestowana asynchronicznie za pomocą `pytest`.
- **Spójność z kolejnym modułem:**
  - Backend jest w 100% samowystarczalny i gotowy do obsługi klientów. W Module 3 rozpoczynamy budowę warstwy wizualnej (frontend), która natychmiast połączy się z tym prawdziwym serwerem.
- **Weryfikacja i testy:**
  - Test integracyjny WebSocket: `pytest tests/test_websocket_auth.py -q --tb=short`.

---

### Moduł 3: Statyczny frontend i nawiązanie połączenia WebSocket

- **Cel edukacyjny:** Organizacja warstwy klienta w czystym HTML5/CSS3/Vanilla JS (bez frameworków i bundlerów). Obsługa obiektu `new WebSocket()` w przeglądarce i śledzenie stanów połączenia.
- **Zakres frontend:**
  - Integracja makiet z `docs/product/design_ux/` do katalogu `frontend/`:
    - `index.html` (widok logowania z kontenerem czatu),
    - `style.css` (ciemny motyw Discorda, flexbox, CSS variables).
  - Skrypt `frontend/app.js`: nawiązanie połączenia z `ws://localhost:8000/ws`, obsługa zdarzeń `onopen`, `onmessage`, `onerror`, `onclose`.
  - Wizualny wskaźnik stanu połączenia (np. zielona dioda "Połączono").
- **User Story:**
  - *Jako użytkownik chcę widzieć estetyczny ekran logowania i mieć pewność, że moja przeglądarka nawiązała aktywne połączenie z serwerem czatu.*
- **Co działa po tym module (Oczekiwany rezultat):**
  - Pod adresem `http://localhost:8000` wyświetla się dopracowany graficznie ciemny interfejs.
  - Przeglądarka automatycznie nawiązuje połączenie WebSocket z backendem (zielona dioda statusu).
  - W konsoli przeglądarki (F12) oraz w zakładce Network -> WS widać aktywny status 101 Switching Protocols.
- **Spójność z kolejnym modułem:**
  - Mamy otwarty kanał komunikacyjny z backendem. W Module 4 podpinamy pod niego formularz logowania, aby wysłać dane użytkownika do backendu z Modułu 2.
- **Weryfikacja i testy:**
  - Uruchomienie `uvicorn backend.main:app --reload` i wejście na `http://localhost:8000`.

---

### Moduł 4: Autentykacja, inicjalizacja stanu i historia czatu (End-to-End)

- **Cel edukacyjny:** Zarządzanie stanem po stronie klienta (Client State Management) oraz dynamiczne modyfikowanie drzewa DOM po otrzymaniu danych w czasie rzeczywistym. Integracja pełnego cyklu żądanie-odpowiedź pomiędzy frontendem a backendem.
- **Zakres frontend & backend:**
  - Formularz logowania wysyła ramkę `auth_request` przez otwarte gniazdo.
  - Po odebraniu `auth_success`:
    - Płynne ukrycie ekranu logowania i odsłonięcie głównego trójkolumnowego interfejsu Discorda.
    - Wyrenderowanie listy kanałów (lewy panel).
    - Wyrenderowanie listy obecnych użytkowników (prawy panel).
    - Wyrenderowanie pobranej z bazy historii wiadomości w oknie głównym z rozróżnieniem autora i czasu (`HH:MM`).
  - W przypadku `auth_failure`: wyświetlenie czytelnego komunikatu o błędzie na formularzu logowania.
- **User Stories:**
  - *Jako nowy użytkownik chcę podać swój nick i hasło, aby zalogować się do czatu.*
  - *Jako zalogowany użytkownik chcę od razu po wejściu widzieć historię rozmów na kanale głównym oraz listę osób dostępnych online.*
- **Co działa po tym module (Oczekiwany rezultat):**
  - **DZIAŁAJĄCY PRZEPŁYW END-TO-END (Przeglądarka -> WebSocket -> SQLite -> Przeglądarka)**:
    - Logowanie użytkownika w interfejsie graficznym.
    - Błędne hasło pozostawia użytkownika na ekranie logowania z komunikatem błędu.
    - Poprawne logowanie przełącza ekran na pełny Discord ze wszystkimi danymi wczytanymi z bazy danych.
- **Spójność z kolejnym modułem:**
  - Użytkownik widzi interfejs i historię, ale nie może jeszcze pisać. W Module 5 aktywujemy pole wprowadzania tekstu i rozgłaszanie nowych wiadomości na żywo.
- **Weryfikacja i testy:**
  - Test manualny: logowanie dwóch użytkowników w oknie zwykłym i incognito.

---

### Moduł 5: Dwukierunkowa komunikacja w czasie rzeczywistym (Wysyłanie i Broadcast)

- **Cel edukacyjny:** Zrozumienie wzorca Pub/Sub (Publish/Subscribe) i rozgłaszania wiadomości do wielu odbiorców. Integracja trwałego zapisu do bazy danych z asynchronicznym powiadamianiem klientów.
- **Zakres backend & frontend:**
  - Frontend: obsługa pola tekstowego i wysyłanie ramki `send_message` po naciśnięciu `Enter` lub przycisku "Wyślij".
  - Backend:
    - Odbiór `send_message`, walidacja długości (max 300 znaków, niepusty tekst).
    - Zapis wiadomości do tabeli `messages` w SQLite (generowanie `id`: `msg_...`).
    - Rozgłoszenie ramki `new_message` do wszystkich klientów subskrybujących dany kanał.
  - Frontend: odbiór `new_message`, utworzenie nowego elementu DOM wiadomości, automatyczne przewinięcie okna czatu na sam dół (auto-scroll).
- **User Story:**
  - *Jako uczestnik czatu chcę wpisać wiadomość i wysłać ją, a także widzieć wiadomości innych osób natychmiast, bez konieczności odświeżania strony.*
- **Co działa po tym module (Oczekiwany rezultat):**
  - **PRAWDZIWY CZAT WIELOOSOBOWY W CZASIE RZECZYWISTYM**:
    - Użytkownik A wysyła wiadomość -> pojawia się ona natychmiast u Użytkownika B w drugim oknie.
    - Każda wiadomość jest trwale zapisana w bazie SQLite (po odświeżeniu strony historia jest zachowana).
    - Działa auto-scroll i formatowanie daty.
- **Spójność z kolejnym modułem:**
  - Rozmowa działa, ale lista użytkowników online jest statyczna. W Module 6 wprowadzamy śledzenie obecności (Presence), aby lista online reagowała na wchodzenie i wychodzenie rozmówców na bieżąco.
- **Weryfikacja i testy:**
  - Test automatyczny WebSocket: `pytest tests/test_messaging.py -q --tb=short`.

---

### Moduł 6: Zarządzanie obecnością (Presence: dołączenia, wyjścia, lista online)

- **Cel edukacyjny:** Śledzenie cyklu życia połączeń sieciowych, obsługa nagłych rozłączeń (np. zamknięcie karty przeglądarki) i synchronizacja stanu pomiędzy wszystkimi węzłami.
- **Zakres backend & frontend:**
  - Backend:
    - Przy udanym `auth_success` serwer rozsyła do pozostałych zdarzenie `user_joined` oraz zaktualizowaną listę `user_list_update`.
    - Po przerwaniu połączenia (`WebSocketDisconnect`) serwer usuwa klienta z listy aktywnych sesji i rozsyła `user_left` oraz `user_list_update`.
  - Frontend:
    - Dynamiczne odświeżanie prawego paska użytkowników online bez przeładowania strony.
    - Subtelny komunikat systemowy w oknie czatu (*"Użytkownik X dołączył do czatu"* / *"Użytkownik X opuścił czat"*).
- **User Story:**
  - *Jako użytkownik chcę widzieć na żywo, kto w danej chwili jest online i otrzymywać informację, gdy ktoś wchodzi na czat lub go opuszcza.*
- **Co działa po tym module (Oczekiwany rezultat):**
  - **DYNAMICZNA LISTA OBECNOŚCI NA ŻYWO**:
    - Zalogowanie nowego rozmówcy natychmiast dodaje go na listę u wszystkich innych.
    - Zamknięcie przeglądarki natychmiast usuwa awatar użytkownika z listy online u pozostałych osób.
    - Brak "martwych" sesji po stronie backendu.
- **Spójność z kolejnym modułem:**
  - Wszyscy użytkownicy rozmawiają w jednym kanale `#general`. W Module 7 wprowadzamy podział na niezależne pokoje rozmów (wielokanałowość).
- **Weryfikacja i testy:**
  - Test automatyczny sesji: `pytest tests/test_presence.py -q --tb=short`.

---

### Moduł 7: Wielokanałowość – tworzenie i przełączanie kanałów

- **Cel edukacyjny:** Modelowanie relacji danych wiele-do-wielu, obsługa kontekstu pokoju i dynamiczna filtracja komunikatów po `channel_id`.
- **Zakres backend & frontend:**
  - Backend:
    - Obsługa C2S `create_channel` (walidacja nazwy, zapis w tabeli `channels`, broadcast S2C `channel_created`).
    - Obsługa C2S `request_history` (pobranie z SQLite ostatnich 50 wiadomości dla danego `channel_id` i odesłanie S2C `chat_history`).
    - Filtrowanie `new_message`: wiadomości trafiają wyłącznie do klientów będących na danym kanale.
  - Frontend:
    - Przycisk `+` przy liście kanałów otwierający okienko tworzenia nowego pokoju.
    - Kliknięcie w kanał na liście: przełączenie `currentChannelId`, wyczyszczenie okna rozmowy, pobranie i wyświetlenie dedykowanej historii dla wybranego pokoju.
- **User Stories:**
  - *Jako użytkownik chcę stworzyć nowy kanał tematyczny, aby rozmawiać na konkretny temat.*
  - *Jako użytkownik chcę przełączać się między kanałami i widzieć tylko rozmowy z aktywnego pokoju.*
- **Co działa po tym module (Oczekiwany rezultat):**
  - **KOMPLETNA WIELOKANAŁOWOŚĆ**:
    - Możliwość tworzenia nowych kanałów, które natychmiast pojawiają się na listach wszystkich użytkowników.
    - Pokoje są odizolowane – wiadomości z kanału `#gry` nie pojawiają się na kanale `#general`.
    - Przełączenie kanału wczytuje właściwą historię z bazy danych.
- **Spójność z kolejnym modułem:**
  - Kanały i komunikacja grupowa są kompletne. W Module 8 dodajemy bogate interakcje znane z nowoczesnych aplikacji: rozmowy 1-na-1 (DM), wskaźnik pisania, reakcje emoji oraz edycję postów.
- **Weryfikacja i testy:**
  - Test automatyczny wielokanałowości: `pytest tests/test_channels.py -q --tb=short`.

---

### Moduł 8: Interakcje zaawansowane i rozszerzenia (Typing indicator, DM, reakcje emoji, edycja i wyszukiwanie)

- **Cel edukacyjny:** Przesyłanie zdarzeń efemerycznych (nietrwałych) w czasie rzeczywistym, obsługa prywatnych kanałów komunikacji 1-na-1 oraz implementacja bogatych interakcji społecznościowych (reakcje emoji, edycja/usuwanie wiadomości, filtrowanie danych).
- **Zakres backend & frontend:**
  - **Wskaźnik pisania:** C2S `typing_started` -> S2C `user_is_typing` z automatycznym ukrywaniem w UI po 3-4 s.
  - **Rozmowy prywatne (DM):** kliknięcie w nick na liście użytkowników -> C2S `start_private_chat` -> utworzenie/otwarcie kanału prywatnego `dm_user1_user2` i emisja S2C `private_chat_started`.
  - **Reakcje Emoji:** C2S `toggle_reaction` -> aktualizacja w `message_reactions` -> broadcast S2C `message_reactions_update` z licznikami.
  - **Edycja i usuwanie wiadomości:** C2S `edit_message` oraz `delete_message` ze ścisłą weryfikacją autorstwa na backendzie -> S2C `message_updated` / `message_deleted`.
  - **Wyszukiwarka użytkowników:** C2S `search_users` -> zapytanie SQL `LIKE` -> S2C `search_results`.
- **User Stories:**
  - *Jako rozmówca chcę widzieć informację "ktoś pisze...", abym wiedział, że za chwilę otrzymam odpowiedź.*
  - *Jako użytkownik chcę kliknąć na konkretną osobę i prowadzić z nią poufną rozmowę 1-na-1.*
  - *Jako użytkownik chcę zareagować emoji na wiadomość kolegi, aby wyrazić emocje bez pisania nowego posta.*
  - *Jako autor chcę móc poprawić literówkę lub usunąć omyłkowo wysłaną wiadomość.*
- **Co działa po tym module (Oczekiwany rezultat):**
  - **ZAAWANSOWANA, NOWOCZESNA APLIKACJA SPOŁECZNOŚCIOWA**:
    - Działa wskaźnik pisania na żywo.
    - Działają prywatne wiadomości DM, których nie widzą osoby trzecie.
    - Działa dodawanie i odejmowanie reakcji emoji z licznikami na żywo.
    - Autorzy mogą edytować i kasować swoje wiadomości (z oznaczeniem `(edytowano)`).
    - Wyszukiwarka pozwala błyskawicznie filtrować użytkowników w bazie.
- **Spójność z kolejnym modułem:**
  - Całość funkcjonalna aplikacji jest kompletna. W Module 9 podsumowujemy projekt, przeprowadzamy audyt bezpieczeństwa i przygotowujemy kontener Docker do łatwego uruchomienia w pracowni szkolnej.
- **Weryfikacja i testy:**
  - Test prywatnych wiadomości: `pytest tests/test_direct_messages.py -q --tb=short`.
  - Test reakcji i edycji: `pytest tests/test_reactions_and_edits.py -q --tb=short`.

---

### Moduł 9: Dobre praktyki dydaktyczne, przegląd kodu i wdrożenie

- **Cel edukacyjny:** Metodyka nauczania informatyki przy asyście AI: jak prowadzić przeglądy kodu (Code Review) z uczniami, jak weryfikować poprawność kodu generowanego przez LLM oraz jak przygotować aplikację do uruchomienia (konteneryzacja w Dockerze).
- **Zakres:**
  - Przegląd całości kodu pod kątem bezpieczeństwa (SQL Injection, sanityzacja XSS przy wstawianiu wiadomości do DOM).
  - Przygotowanie pliku `Dockerfile` oraz `docker-compose.yml` dla ułatwienia dystrybucji środowiska w szkole.
  - Opracowanie mini-zadań i pytań kontrolnych dla uczniów (np. *"dodaj limit 50 znaków dla nazwy kanału"*, *"dodaj licznik nieprzeczytanych wiadomości"*).
- **Co działa po tym module (Oczekiwany rezultat):**
  - **PRODUKCYJNA APLIKACJA Z PAKIETEM SZKOLENIOWYM**:
    - Komunikator zabezpieczony przed atakami webowymi.
    - Jedno polecenie `docker compose up` stawia całe środowisko na dowolnym komputerze.
    - Gotowe materiały dydaktyczne dla nauczycieli do prowadzenia zajęć z uczniami.
- **Weryfikacja i testy:**
  - Uruchomienie kontenera: `docker compose up --build`.
  - Próba wstrzyknięcia tagu `<script>` w treści wiadomości.
