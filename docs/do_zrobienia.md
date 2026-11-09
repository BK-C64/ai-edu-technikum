# Do Zrobienia (Całościowa Lista TODO Projektu)

Plik ten przedstawia całościowy stan zadań do wykonania w projekcie komunikatora **MyDiscord**, z podziałem na etapy inżynieryjne i moduły dydaktyczne.

---

## Legenda Statusu
- `[x]` – Zrobione i zweryfikowane
- `[ ]` – Do zrobienia
- `[/]` – W trakcie realizacji

---

## Faza 0: Fundamenty i Dokumentacja Projektowa
- [x] Wstępny plan API WebSocket i endpointów HTTP REST (`docs/architecture_plan/api_design.md`)
- [x] Propozycja architektury technicznej i bazy SQLite (`docs/architecture_plan/basic_choices.md`, `database_schema.md`)
- [x] Konfiguracja i definicje ról agentów AI (`.pi/agents/`)
- [x] Główny plan dydaktyczno-techniczny (`docs/produkt.md`)
- [ ] Stworzenie środowiska wirtualnego Python (`venv`) i pliku `requirements.txt`
- [ ] Utworzenie struktury katalogów projektu (`backend/`, `frontend/`, `tests/`)

---

## Faza 1: Backend Scaffolding i Pierwsze Testy (Moduł 0)
- [ ] Inicjalizacja instancji FastAPI w `backend/main.py`
- [ ] Implementacja endpointu diagnostycznego `GET /health`
- [ ] Konfiguracja serwowania plików statycznych (`fastapi.staticfiles.StaticFiles`)
- [ ] Napisanie i uruchomienie pierwszego testu `pytest` w `tests/test_health.py`

---

## Faza 2: Baza Danych SQLite i Operacje CRUD (Moduł 1)
- [ ] Moduł bazy danych `backend/database.py` (zarządzanie połączeniem `chat.db`)
- [ ] Inicjalizacja tabel SQLite (`users`, `channels`, `messages`, `channel_members`)
- [ ] Skrypt / funkcja seedująca domyślny kanał publiczny `#general`
- [ ] Funkcje pomocnicze: tworzenie użytkownika, haszowanie i weryfikacja haseł
- [ ] Testy automatyczne bazy danych w `tests/test_database.py`

---

## Faza 3: Protokół WebSocket i Autoryzacja (Moduł 2)
- [ ] Klasa `ConnectionManager` w `backend/connection_manager.py` (rejestracja socketów, broadcast)
- [ ] Endpoint `@app.websocket("/ws")` w `backend/main.py`
- [ ] Obsługa ramki C2S `auth_request` (auto-rejestracja / weryfikacja hasła)
- [ ] Emisja ramki S2C `auth_success` z pełnym początkowym stanem (kanały, online, historia)
- [ ] Emisja ramki S2C `auth_failure` i bezpieczne zamknięcie połączenia
- [ ] Testy automatyczne WebSocket w `tests/test_websocket_auth.py`

---

## Faza 4: Statyczny Frontend i Połączenie WebSocket (Moduł 3)
- [ ] Przeniesienie i integracja makiet z `docs/product/design_ux/` do `frontend/`
- [ ] Przygotowanie `frontend/index.html` (widok logowania + kontener czatu) oraz `frontend/style.css`
- [ ] Implementacja `frontend/app.js`: nawiązanie połączenia z `ws://localhost:8000/ws`
- [ ] Obsługa zdarzeń `onopen`, `onmessage`, `onerror`, `onclose` z wizualnym wskaźnikiem statusu połączenia

---

## Faza 5: Autentykacja i Inicjalizacja Stanu UI (Moduł 4)
- [ ] Podpięcie formularza logowania w `frontend/index.html` pod wysłanie `auth_request`
- [ ] Obsługa `auth_success`: płynne przejście z ekranu logowania do trójkolumnowego widoku Discorda
- [ ] Renderowanie początkowego stanu: lista kanałów, lista użytkowników online, historia kanału `#general`
- [ ] Obsługa i wyświetlenie błędu przy `auth_failure`

---

## Faza 6: Dwukierunkowa Komunikacja w Czasie Rzeczywistym (Moduł 5)
- [ ] Wysyłanie wiadomości z pola tekstowego (C2S `send_message`) po Enter / kliknięciu przycisku
- [ ] Walidacja wiadomości na backendzie (długość 1-300 znaków, niepusta)
- [ ] Zapis wiadomości do bazy SQLite z generowaniem `message.id` (`msg_...`)
- [ ] Rozgłaszanie wiadomości do klientów (S2C `new_message`)
- [ ] Dynamiczne renderowanie wiadomości w DOM (rozróżnienie własnych i obcych, format daty `HH:MM`, auto-scroll)
- [ ] Test automatyczny komunikacji wieloklientowej w `tests/test_messaging.py`

---

## Faza 7: Zarządzanie Obecnością – Presence (Moduł 6)
- [ ] Backend: rozsyłanie S2C `user_joined` oraz `user_list_update` po pomyślnym zalogowaniu
- [ ] Backend: rozsyłanie S2C `user_left` oraz `user_list_update` po rozłączeniu gniazda (`WebSocketDisconnect`)
- [ ] Frontend: dynamiczna aktualizacja listy obecnych w prawym panelu
- [ ] Test automatyczny cyklu życia sesji w `tests/test_presence.py`

---

## Faza 8: Wielokanałowość – Pokoje Rozmów (Moduł 7)
- [ ] Obsługa tworzenia nowego kanału publicznego (C2S `create_channel` -> zapis do SQLite -> S2C `channel_created`)
- [ ] Obsługa przełączania kanału w UI i pobierania historii (C2S `request_history` -> S2C `chat_history`)
- [ ] Filtrowanie wiadomości tak, aby trafiały tylko do osób na aktywnym kanale
- [ ] Test automatyczny wielokanałowości w `tests/test_channels.py`

---

## Faza 9: Zaawansowane Interakcje (Moduł 8)
- [ ] Wskaźnik pisania na żywo: C2S `typing_started` -> S2C `user_is_typing` z automatycznym ukrywaniem w UI po 3-4 s
- [ ] Prywatne rozmowy 1-na-1 (DM): C2S `start_private_chat` -> S2C `private_chat_started`
- [ ] Test automatyczny poufności wiadomości prywatnych w `tests/test_direct_messages.py`

---

## Faza 10: Metodyka, Bezpieczeństwo i Wdrożenie (Moduł 9)
- [ ] Audyt bezpieczeństwa (sanityzacja HTML przeciwko XSS, parametryzowane zapytania SQL)
- [ ] Konteneryzacja aplikacji (`Dockerfile`, `docker-compose.yml`)
- [ ] Zestaw pytań kontrolnych i mini-zadań warsztatowych dla nauczycieli
