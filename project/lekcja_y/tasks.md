# Plan Implementacji (Checklista) dla Lekcji 1

Poniższa lista zadań jest przeznaczona dla Dewelopera. Należy wykonywać zadania w podanej kolejności, odhaczając je po ukończeniu.

## Etap 1: Przygotowanie Struktury Projektu

- [ ] 1.1. W katalogu `project/` stwórz nową strukturę katalogów: `client/js`.
- [ ] 1.2. W `project/client/js/` stwórz cztery puste pliki: `main.js`, `api.js`, `ui.js`, `state.js`.

## Etap 2: Implementacja Warstwy Wizualnej (HTML i CSS)

- [ ] 2.1. Stwórz plik `project/client/index.html`.
- [ ] 2.2. Skopiuj całą zawartość z `docs/product/design_ux/index.html` i wklej ją do `project/client/index.html`.
- [ ] 2.3. W `project/client/index.html`, znajdź sekcję `<body>` i tuż nad `<div id="app-wrapper">` wklej kod HTML dla ekranu logowania z pliku `docs/product/design_ux/login.html`.
- [ ] 2.4. Zmodyfikuj atrybuty w `project/client/index.html` zgodnie z projektem technicznym:
    - [ ] Dodaj `data-view="login"` do kontenera ekranu logowania (np. `<div id="login-screen">`).
    - [ ] Dodaj `data-view="app"` oraz klasę `hidden` do głównego kontenera aplikacji (`<div id="app-wrapper">`).
- [ ] 2.5. Na końcu sekcji `<body>` w `index.html` dodaj linię dołączającą główny skrypt: `<script type="module" src="js/main.js"></script>`.
- [ ] 2.6. Stwórz plik `project/client/style.css`.
- [ ] 2.7. Skopiuj całą zawartość z `docs/product/design_ux/style.css` i wklej ją do `project/client/style.css`.
- [ ] 2.8. Skopiuj całą zawartość z `docs/product/design_ux/login.css` i wklej ją na końcu pliku `project/client/style.css`.
- [ ] 2.9. **Weryfikacja wizualna**: Otwórz plik `project/client/index.html` w przeglądarce. Sprawdź, czy widoczny jest **tylko i wyłącznie** ekran logowania i czy wygląda on poprawnie.

## Etap 3: Implementacja Logiki Aplikacji (JavaScript)

- [ ] 3.1. W pliku `project/client/js/state.js` wklej kod modułu `state` z `design.md`.
- [ ] 3.2. W pliku `project/client/js/ui.js` wklej kod modułu `ui` z `design.md`.
- [ ] 3.3. W pliku `project/client/js/api.js` wklej kod modułu `api` z `design.md`.
- [ ] 3.4. W pliku `project/client/js/main.js` wklej kod modułu `main` z `design.md`.

## Etap 4: Weryfikacja Końcowa (zgodnie z Kryteriami Akceptacji)

- [ ] 4.1. Upewnij się, że serwer backendowy jest uruchomiony.
- [ ] 4.2. Otwórz plik `project/client/index.html` w przeglądarce.
- [ ] 4.3. Otwórz narzędzia deweloperskie (klawisz F12).
- [ ] 4.4. **Sprawdź checklistę:**
    - [ ] **Wygląd:** Czy strona wyświetla poprawnie ostylowany ekran logowania?
    - [ ] **Ukrycie interfejsu:** Czy główny interfejs aplikacji jest niewidoczny?
    - [ ] **Konsola JS:** Czy w konsoli widać log "Połączenie WebSocket nawiązane pomyślnie."?
    - [ ] **Sieć (Network):** Czy w zakładce "Network" (z filtrem "WS") widać połączenie WebSocket ze statusem `101 Switching Protocols`?
    - [ ] **Logi serwera:** Czy w terminalu, w którym działa serwer, widać log o nowym połączeniu klienta?
- [ ] 4.5. Jeśli wszystkie powyższe punkty są spełnione, zadania na Lekcję 1 zostały ukończone.
