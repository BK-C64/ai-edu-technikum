# Do Zrobienia (Całościowa Lista TODO Projektu)

Plik ten przedstawia całościowy stan zadań do wykonania w projekcie komunikatora **MyDiscord**, z podziałem na etapy inżynieryjne i moduły dydaktyczne. Każda faza zawiera precyzyjnie zdefiniowane zadania, oczekiwany rezultat końcowy (*Co działa po tym etapie*) oraz opis powiązania z kolejnym krokiem.

---

## Legenda Statusu
- `[x]` – Zrobione i zweryfikowane
- `[ ]` – Do zrobienia
- `[/]` – W trakcie realizacji

---

## Faza 0: Fundamenty i Dokumentacja Projektowa
### Zadania:
- [x] Wstępny plan API WebSocket i endpointów HTTP REST (`docs/architecture_plan/api_design.md`)
- [x] Propozycja architektury technicznej i bazy SQLite (`docs/architecture_plan/basic_choices.md`, `database_schema.md`)
- [x] Konfiguracja i definicje ról agentów AI (`.pi/agents/`) oraz skilli in-line (`.pi/skills/`)
- [x] Główny plan dydaktyczno-techniczny (`docs/produkt.md`)
- [ ] Stworzenie środowiska wirtualnego Python (`venv`) i pliku `requirements.txt`
- [ ] Utworzenie struktury katalogów projektu (`backend/`, `frontend/`, `tests/`)

### Co działa po tym etapie (Definition of Done):
- Skonfigurowane i gotowe repozytorium z pełną dokumentacją architektoniczną.
- Aktywne środowisko wirtualne Pythona z zainstalowanymi zależnościami (`fastapi`, `uvicorn`, `websockets`, `pytest`, `pytest-asyncio`, `httpx`).
- Przygotowany szkielet katalogów: `backend/`, `frontend/`, `tests/`.

### Spójność z kolejnym etapem:
- Posiadając zainstalowane pakiety i strukturę katalogów, Faza 1 może natychmiast wystartować z implementacją serwera FastAPI i uruchomieniem pierwszego testu `pytest`.

### Weryfikacja:
- PowerShell/CMD: `python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt`
- Sprawdzenie struktury: `dir /b`

---

## Faza 1: Backend Scaffolding i Pierwsze Testy (Moduł 0)
### Zadania:
- [ ] Inicjalizacja instancji FastAPI w `backend/main.py`
- [ ] Implementacja endpointu diagnostycznego `GET /health` zwracającego status `{"status": "ok"}`
- [ ] Konfiguracja serwowania plików statycznych (`fastapi.staticfiles.StaticFiles`) podpinająca katalog `frontend/`
- [ ] Napisanie i uruchomienie pierwszego testu `pytest` w `tests/test_health.py`

### Co działa po tym etapie (Definition of Done):
- Serwer HTTP FastAPI uruchamia się bezbłędnie pod adresem `http://localhost:8000`.
- Endpoint `GET /health` zwraca status HTTP 200 z poprawnym JSON.
- Działa automatyczna dokumentacja Swagger UI pod `http://localhost:8000/docs`.
- Serwer potrafi serwować pliki z folderu `frontend/`.
- Pierwszy test automatyczny w projekcie przechodzi na 100%.

### Spójność z kolejnym etapem:
- Mamy działający szkielet serwera, ale brakuje warstwy danych. W Fazie 2 budujemy niezależny moduł bazy danych SQLite, który dostarczy trwały magazyn danych dla użytkowników, kanałów i wiadomości.

### Weryfikacja:
- Test: `pytest tests/test_health.py -q --tb=short`
- Serwer: `uvicorn backend.main:app --reload` i wejście na `http://localhost:8000/health` oraz `/docs`.

---

## Faza 2: Baza Danych SQLite i Operacje CRUD (Moduł 1)
### Zadania:
- [ ] Moduł bazy danych `backend/database.py` (zarządzanie połączeniem `chat.db`)
- [ ] Inicjalizacja tabel SQLite (`users`, `channels`, `messages`, `channel_members`, `message_reactions`) zgodnie z `docs/architecture_plan/database_schema.md`
- [ ] Skrypt / funkcja seedująca domyślny kanał publiczny `#general`
- [ ] Funkcje pomocnicze: tworzenie użytkownika, haszowanie i weryfikacja haseł (`hashlib` / salt), pobieranie historii wiadomości
- [ ] Testy automatyczne bazy danych w `tests/test_database.py`

### Co działa po tym etapie (Definition of Done):
- W pełni funkcjonalna warstwa bazodanowa w pliku `chat.db`.
- Tabele tworzą się automatycznie przy starcie, a domyślny kanał `#general` jest natychmiast dostępny.
- Przetestowane operacje: rejestracja użytkownika, bezpieczna weryfikacja hasła, zapis i odczyt historii wiadomości.
- Test `tests/test_database.py` przechodzi w 100%.

### Spójność z kolejnym etapem:
- Mamy działający serwer (Faza 1) oraz bazę danych (Faza 2). W Fazie 3 łączymy je w jeden spójny system: endpoint WebSocket z Fazy 1 zaczyna korzystać z logiki uwierzytelniania i pobierania danych z bazy z Fazy 2.

### Weryfikacja:
- Test: `pytest tests/test_database.py -q --tb=short`

---

## Faza 3: Protokół WebSocket i Autoryzacja – Backend Core (Moduł 2)
### Zadania:
- [ ] Klasa `ConnectionManager` w `backend/connection_manager.py` (rejestracja socketów, kojarzenie z użytkownikiem, broadcast)
- [ ] Endpoint `@app.websocket("/ws")` w `backend/main.py`
- [ ] Obsługa ramki C2S `auth_request` (auto-rejestracja i logowanie z walidacją hasła w bazie SQLite)
- [ ] Emisja ramki S2C `auth_success` z pełnym początkowym stanem (profil, kanały, online, historia `#general` z bazy)
- [ ] Emisja ramki S2C `auth_failure` i bezpieczne zamknięcie połączenia przy błędnym haśle lub konflikcie
- [ ] Testy automatyczne WebSocket w `tests/test_websocket_auth.py`

### Co działa po tym etapie (Definition of Done):
- **KOMPLETNY SYSTEM BACKENDOWY Z BAZĄ DANYCH**:
  - Serwer obsługuje połączenia w czasie rzeczywistym na `ws://localhost:8000/ws`.
  - Posiada w pełni zintegrowaną bazę danych SQLite oraz zarządzanie sesjami w pamięci.
  - Klient WebSocket może połączyć się, przesłać ramkę logowania i otrzymać kompletny stan początkowy czatu lub komunikat o błędzie.
  - Wykrywane są próby podwójnego logowania tym samym nickiem oraz błędne hasła.
- Wszystkie scenariusze autoryzacji są zweryfikowane automatycznymi testami asynchronicznymi.

### Spójność z kolejnym etapem:
- Backend jest w 100% gotowy i przetestowany. W Fazie 4 nie musimy niczego mockować – możemy zacząć budować frontend, który od pierwszego dnia łączy się z prawdziwym, działającym serwerem.

### Weryfikacja:
- Test: `pytest tests/test_websocket_auth.py -q --tb=short`

---

## Faza 4: Statyczny Frontend i Nawiązanie Połączenia WebSocket (Moduł 3)
### Zadania:
- [ ] Przeniesienie i integracja makiet z `docs/product/design_ux/` do `frontend/`
- [ ] Przygotowanie `frontend/index.html` (widok logowania z możliwością płynnego przełączenia na kontener czatu)
- [ ] Stylowanie `frontend/style.css` (nowoczesny ciemny motyw Discorda, flexbox layout)
- [ ] Implementacja `frontend/app.js`: automatyczne nawiązanie połączenia z `ws://localhost:8000/ws`
- [ ] Obsługa zdarzeń `onopen`, `onmessage`, `onerror`, `onclose` z wizualnym wskaźnikiem statusu połączenia (dioda)

### Co działa po tym etapie (Definition of Done):
- Po otwarciu `http://localhost:8000` przeglądarka wyświetla responsywny, ciemny interfejs komunikatora.
- Skrypt `frontend/app.js` automatycznie wykonuje handshake WebSocket z backendem.
- Na ekranie zapala się zielony wskaźnik ("Połączono z serwerem czatu").
- W DevTools (zakładka Network -> WS) widoczne jest aktywne połączenie o statusie 101 Switching Protocols.

### Spójność z kolejnym etapem:
- Frontend ma aktywne gniazdo sieciowe z serwerem. W Fazie 5 podpinamy pod nie formularz logowania, aby przesłać do backendu ramkę `auth_request` i zainicjalizować widok czatu.

### Weryfikacja:
- Uruchomienie serwera: `uvicorn backend.main:app --reload`
- Otwarcie w przeglądarce: `http://localhost:8000` i inspekcja konsoli DevTools (F12).

---

## Faza 5: Autentykacja i Inicjalizacja Stanu UI – End-to-End (Moduł 4)
### Zadania:
- [ ] Podpięcie formularza logowania w `frontend/index.html` pod wysłanie ramki `auth_request`
- [ ] Obsługa `auth_success`: płynne ukrycie karty logowania i odsłonięcie trójkolumnowego widoku Discorda
- [ ] Renderowanie początkowego stanu aplikacji:
  - Lewy panel: wyrenderowanie listy kanałów (w tym `#general`),
  - Prawy panel: wyrenderowanie listy użytkowników online (z bieżącym użytkownikiem),
  - Okno główne: wyrenderowanie historii ostatnich wiadomości pobranych z SQLite,
  - Stopka profilu: wyświetlenie nicka zalogowanego użytkownika.
- [ ] Obsługa i wyświetlenie błędu przy `auth_failure` (np. błędne hasło) bez zrywania widoku logowania

### Co działa po tym etapie (Definition of Done):
- **PIERWSZY PEŁNY PRZEPŁYW END-TO-END (Klient <-> Serwer <-> Baza)**:
  - Użytkownik wchodzi na stronę, podaje nick oraz hasło i klika "Dołącz do czatu".
  - Backend weryfikuje dane w SQLite i odsyła pełen pakiet danych startowych.
  - Ekran logowania znika, a przed użytkownikiem pojawia się gotowy do rozmowy Discord z załadowaną historią i listą obecnych.
  - Błędne hasło skutkuje natychmiastowym, czytelnym komunikatem błędu na formularzu.

### Spójność z kolejnym etapem:
- Mamy zalogowanego użytkownika w interfejsie czatu. W Fazie 6 ożywiamy pole wpisywania wiadomości i przycisk "Wyślij", umożliwiając rzeczywistą rozmowę w czasie rzeczywistym.

### Weryfikacja:
- Ręczny test w dwóch oknach przeglądarki (np. normalnym i incognito) z poprawnymi i błędnymi danymi logowania.

---

## Faza 6: Dwukierunkowa Komunikacja w Czasie Rzeczywistym (Moduł 5)
### Zadania:
- [ ] Wysyłanie wiadomości z pola tekstowego (C2S `send_message`) po naciśnięciu `Enter` lub kliknięciu "Wyślij"
- [ ] Walidacja wiadomości na backendzie (długość 1-300 znaków, brak pustych białych znaków)
- [ ] Zapis wiadomości do bazy SQLite z generowaniem unikalnego ID (`msg_...`) i znacznika czasu ISO
- [ ] Rozgłaszanie wiadomości do wszystkich klientów (S2C `new_message`) przez `ConnectionManager`
- [ ] Dynamiczne renderowanie wiadomości w DOM (rozróżnienie własnych i obcych, format daty `HH:MM`, auto-scroll w dół)
- [ ] Test automatyczny komunikacji wieloklientowej w `tests/test_messaging.py`

### Co działa po tym etapie (Definition of Done):
- **DZIAŁAJĄCY CZAT WIELOOSOBOWY NA ŻYWO**:
  - Użytkownicy otwierają czat w oddzielnych oknach przeglądarki.
  - Każda wysłana wiadomość pojawia się u wszystkich rozmówców w ułamku sekundy bez odświeżania strony.
  - Wszystkie wiadomości są trwale zachowywane w bazie danych `chat.db` (odświeżenie strony nie gubi historii).
  - Test integracyjny `tests/test_messaging.py` weryfikuje asynchroniczny broadcast do wielu klientów jednocześnie.

### Spójność z kolejnym etapem:
- Wiadomości działają, ale lista użytkowników online jest jeszcze statyczna po zalogowaniu. W Fazie 7 dodajemy dynamiczne śledzenie obecności (Presence), aby lista online odzwierciedlała dołączanie i opuszczanie czatu na żywo.

### Weryfikacja:
- Test automatyczny: `pytest tests/test_messaging.py -q --tb=short`
- Test manualny: rozmowa pomiędzy dwoma oknami przeglądarki.

---

## Faza 7: Zarządzanie Obecnością – Presence (Moduł 6)
### Zadania:
- [ ] Backend: rozsyłanie S2C `user_joined` oraz `user_list_update` po pomyślnym zalogowaniu nowego klienta
- [ ] Backend: obsługa zdarzenia `WebSocketDisconnect` i rozsyłanie S2C `user_left` oraz `user_list_update`
- [ ] Frontend: dynamiczna aktualizacja listy obecnych w prawym panelu (dodawanie i usuwanie kafelka użytkownika)
- [ ] Frontend: powiadomienie systemowe na osi czatu (*"Użytkownik X dołączył do rozmowy"* / *"Użytkownik X opuścił czat"*)
- [ ] Test automatyczny cyklu życia sesji w `tests/test_presence.py`

### Co działa po tym etapie (Definition of Done):
- **DYNAMICZNY SYSTEM OBECNOŚCI (ONLINE / OFFLINE)**:
  - Gdy nowa osoba loguje się do czatu, pozostali użytkownicy natychmiast widzą ją na liście online.
  - Gdy użytkownik zamyka kartę lub traci połączenie, jego awatar natychmiast znika z listy obecnych u wszystkich innych.
  - Zabezpieczenie przed wiszącymi sesjami w pamięci serwera.
  - Test `tests/test_presence.py` potwierdza poprawną emisję zdarzeń przy rozłączeniu gniazda.

### Spójność z kolejnym etapem:
- Użytkownicy widzą się nawzajem i rozmawiają na jednym kanale `#general`. W Fazie 8 dodajemy obsługę wielu pokoi rozmów (kanałów tematycznych) z izolacją wiadomości i historii.

### Weryfikacja:
- Test: `pytest tests/test_presence.py -q --tb=short`
- Test manualny: zamknięcie karty jednego z użytkowników i obserwacja prawego panelu w drugim oknie.

---

## Faza 8: Wielokanałowość – Pokoje Rozmów (Moduł 7)
### Zadania:
- [ ] Obsługa tworzenia nowego kanału publicznego (C2S `create_channel` -> walidacja nazwy -> zapis do SQLite -> S2C `channel_created`)
- [ ] Obsługa przełączania aktywnego kanału w UI i pobierania historii (C2S `request_history` -> S2C `chat_history`)
- [ ] Izolacja komunikatów na backendzie: wiadomości trafiają wyłącznie do subskrybentów danego `channel_id`
- [ ] Frontend: modal / prompt tworzenia kanału pod przyciskiem `+` na lewym pasku
- [ ] Test automatyczny wielokanałowości w `tests/test_channels.py`

### Co działa po tym etapie (Definition of Done):
- **PEŁNY SYSTEM KANAŁÓW TEMATYCZNYCH (DISCORD STYLE)**:
  - Użytkownik może utworzyć nowy kanał (np. `#gry`, `#programowanie`), który natychmiast pojawia się na liście kanałów u wszystkich.
  - Przełączenie kanału w lewym menu natychmiast czyści ekran rozmowy i ładuje dedykowaną historię wiadomości dla tego pokoju.
  - Rozmowy w kanale `#gry` nie mieszają się z wiadomościami z kanału `#general`.
  - Test `tests/test_channels.py` weryfikuje izolację rozgłaszania między pokojami.

### Spójność z kolejnym etapem:
- Pokoje i komunikacja działają w pełni. W Fazie 9 wzbogacamy aplikację o zaawansowane interakcje społecznościowe: wskaźnik pisania, prywatne wiadomości DM, reakcje emoji i edycję wiadomości.

### Weryfikacja:
- Test: `pytest tests/test_channels.py -q --tb=short`
- Test manualny: utworzenie kanału, przełączenie pokoju i wymiana wiadomości.

---

## Faza 9: Zaawansowane Interakcje Społecznościowe (Moduł 8)
### Zadania:
- [ ] Wskaźnik pisania na żywo: C2S `typing_started` -> S2C `user_is_typing` z automatycznym ukrywaniem w UI po 3-4 s
- [ ] Prywatne rozmowy 1-na-1 (DM): kliknięcie użytkownika na liście -> C2S `start_private_chat` -> S2C `private_chat_started`
- [ ] Reakcje emoji: C2S `toggle_reaction` -> zapis w `message_reactions` -> rozgłaszanie S2C `message_reactions_update` z licznikami
- [ ] Edycja i usuwanie wiadomości: C2S `edit_message` -> S2C `message_updated`, C2S `delete_message` -> S2C `message_deleted` (ze ścisłą weryfikacją autorstwa)
- [ ] Wyszukiwanie użytkowników: C2S `search_users` -> zapytanie do bazy SQLite -> S2C `search_results`
- [ ] Test automatyczny poufności wiadomości prywatnych w `tests/test_direct_messages.py`
- [ ] Testy automatyczne reakcji, edycji i uprawnień w `tests/test_reactions_and_edits.py`

### Co działa po tym etapie (Definition of Done):
- **BOGATY INTERFEJS SPOŁECZNOŚCIOWY**:
  - Użytkownicy widzą w czasie rzeczywistym powiadomienie *"Ktoś pisze..."*.
  - Możliwość prowadzenia poufnej rozmowy prywatnej 1-na-1, której treści nie widzą inni uczestnicy.
  - Pod wiadomościami można klikać reakcje emoji (np. 👍, ❤️, 🔥), a liczniki aktualizują się na żywo u wszystkich.
  - Autor wiadomości może poprawić literówkę (pojawia się oznaczenie `(edytowano)`) lub usunąć własny post. Próby edycji cudzych wiadomości są odrzucane.
  - Wyszukiwarka pozwala szybko odnaleźć zarejestrowane osoby w bazie.

### Spójność z kolejnym etapem:
- Wszystkie funkcje aplikacyjne są zaimplementowane. W Fazie 10 skupiamy się na audycie bezpieczeństwa, konteneryzacji w Dockerze oraz metodyce dydaktycznej dla uczniów.

### Weryfikacja:
- Testy:
  - `pytest tests/test_direct_messages.py -q --tb=short`
  - `pytest tests/test_reactions_and_edits.py -q --tb=short`

---

## Faza 10: Metodyka Dydaktyczna, Bezpieczeństwo i Wdrożenie (Moduł 9)
### Zadania:
- [ ] Audyt bezpieczeństwa: sanityzacja HTML przeciwko atakom XSS przy wstawianiu wiadomości do DOM oraz weryfikacja zapytań SQL
- [ ] Konteneryzacja aplikacji: plik `Dockerfile` oraz `docker-compose.yml` dla środowiska produkcyjnego / pracowni szkolnej
- [ ] Scenariusze lekcyjne i zadania sprawdzające dla uczniów w pracowni (miniprojekty rozszerzające)
- [ ] Aktualizacja rejestru wykonanych prac w `docs/zrobione.md`

### Co działa po tym etapie (Definition of Done):
- **GOTOWY PRODUKT EDUKACYJNY I PAKIET WDROŻENIOWY**:
  - Bezpieczna, odporna na podstawowe ataki webowe aplikacja czatu.
  - Jedno polecenie `docker compose up` uruchamia cały komunikator w dowolnym środowisku bez instalowania zależności na maszynie hosta.
  - Nauczyciel posiada gotowy konspekt lekcji, bazę pytań kontrolnych oraz zadania rozszerzające dla uczniów technikum.

### Weryfikacja:
- Uruchomienie kontenera: `docker compose up --build`
- Sprawdzenie odporności na XSS (próba wysłania `<script>alert(1)</script>`).
