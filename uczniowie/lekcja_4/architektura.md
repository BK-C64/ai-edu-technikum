# Architektura i Organizacja Kodu Prototypu

Dokument ten opisuje proponowaną strukturę plików, podział odpowiedzialności poszczególnych komponentów oraz przepływ danych w aplikacji.

## 1. Struktura Plików i Folderów

Aby zachować porządek i separację warstw (struktura, styl, logika), proponuję następującą organizację plików:

```
project/
└── lekcja_4/
    ├── index.html          // Główny plik HTML, szkielet aplikacji
    ├── css/
    │   └── style.css       // Wszystkie style dla aplikacji
    └── js/
        ├── state.js        // "Fałszywy" stan aplikacji (dane)
        ├── ui.js           // Funkcje do manipulacji interfejsem (rysowanie)
        └── main.js         // Główny plik, logika i obsługa zdarzeń
```

## 2. Podział Odpowiedzialności (Co gdzie się znajduje?)

### `index.html`
-   **Cel:** Zdefiniowanie struktury aplikacji.
-   **Zawartość:** Będzie zawierał "puste" kontenery (np. `<div class="servers-list"></div>`, `<div class="chat-messages"></div>`), które następnie będą wypełniane dynamicznie przez JavaScript. Znajdą się tu też linki do plików CSS i JS.

### `css/style.css`
-   **Cel:** Wygląd i rozmieszczenie elementów.
-   **Zawartość:** Wszystkie reguły CSS. Będziemy używać klas do stylowania poszczególnych komponentów (np. `.message`, `.user-avatar`, `.channel-button`). Do stworzenia głównego, trójkolumnowego layoutu idealnie nada się `CSS Flexbox` lub `CSS Grid`.

### `js/state.js`
-   **Cel:** Symulowanie bazy danych i stanu aplikacji.
-   **Zawartość:** Będzie to plik zawierający obiekty JavaScript z naszymi danymi. Przykładowo:
    -   Lista serwerów i ich ikon.
    -   Lista kanałów dla każdego serwera.
    -   Lista użytkowników.
    -   Zestaw "startowych" wiadomości dla każdego kanału.
    -   Zmienna przechowująca informację, który kanał jest aktualnie aktywny.

### `js/ui.js`
-   **Cel:** Odseparowanie logiki renderowania od głównej logiki aplikacji.
-   **Zawartość:** Zestaw funkcji, których jedynym zadaniem jest modyfikacja HTML (DOM). Przykładowe funkcje:
    -   `renderServers(servers)`: Rysuje listę serwerów na podstawie danych ze `state.js`.
    -   `renderChannels(channels)`: Rysuje listę kanałów.
    -   `renderMessages(messages)`: Wyświetla wiadomości w oknie czatu.
    -   `addMessage(message)`: Dodaje pojedynczą nową wiadomość do okna czatu.

### `js/main.js`
-   **Cel:** "Mózg" aplikacji.
-   **Zawartość:** Ten plik będzie odpowiedzialny za:
    -   Inicjalizację aplikacji po załadowaniu strony (pierwsze wywołanie funkcji z `ui.js`, aby narysować domyślny widok).
    -   Dodawanie nasłuchiwania na zdarzenia (`event listeners`), np. na kliknięcia w przyciski kanałów czy wysłanie formularza z nową wiadomością.
    -   Orkiestrację przepływu: po wykryciu akcji użytkownika (np. kliknięcie), `main.js` zaktualizuje stan w `state.js`, a następnie wywoła odpowiednią funkcję z `ui.js`, aby odświeżyć widok.

## 3. Przepływ Danych (Jak to będzie działać?)

Cykl życia interakcji użytkownika będzie wyglądał następująco:

1.  **Akcja Użytkownika:** Użytkownik klika na nazwę kanału.
2.  **Obsługa Zdarzenia:** `main.js` przechwytuje to kliknięcie.
3.  **Aktualizacja Stanu:** `main.js` zmienia wartość w `state.js`, np. `state.activeChannel = 'ogolny'`.
4.  **Renderowanie Widoku:** `main.js` wywołuje funkcję z `ui.js`, np. `ui.renderMessages(state.messages['ogolny'])`, przekazując jej potrzebne dane ze stanu.
5.  **Aktualizacja UI:** `ui.js` czyści aktualną listę wiadomości i rysuje w jej miejsce nowe, pobrane ze stanu.
