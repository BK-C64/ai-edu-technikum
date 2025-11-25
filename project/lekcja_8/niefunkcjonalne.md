# Wymagania Niefunkcjonalne - Prototypy Serwisów Internetowych (Lekcja 8)

Celem tej lekcji jest stworzenie **atrakcyjnych wizualnie** i **interaktywnych** prototypów serwisów internetowych. Aplikacje działają w modelu "Serverless HTML" (logika w 100% po stronie klienta).

## 1. Estetyka i User Experience (UX) - PRIORYTET
To jest najważniejsza sekcja w tym ćwiczeniu. Prototyp ma "sprzedawać" pomysł jakością wykonania i przemyślanym UX. Oczekuje się rozwiązań na poziomie zbliżonym do komercyjnych aplikacji.

*   **Nowoczesny Design:**
    *   Wykorzystanie nowoczesnych układów (CSS Grid / Flexbox).
    *   Spójna paleta kolorów (maksymalnie 3 kolory główne + odcienie, z uwzględnieniem kontrastu).
    *   Zastosowanie "whitespace" (oddechu) między elementami – unikanie ścisku, poprawa czytelności.
    *   Estetyczna typografia (użycie Google Fonts lub nowoczesnych fontów systemowych) z zachowaniem hierarchii (nagłówki, treść, etykiety).
    *   **Zasoby Graficzne:** W celu zwiększenia atrakcyjności wizualnej projektu, dozwolone jest wykorzystanie zewnętrznych, **darmowych lub odpowiednio licencjonowanych** zasobów graficznych (np. ikony SVG, zdjęcia stockowe, tekstury, customowe fonty z Google Fonts). Powinny być one spójne z ogólnym designem i optymalizowane pod kątem wydajności.
*   **Mikrointerakcje i Feedback Wizualny:**
    *   Każda akcja użytkownika (kliknięcie, najazd, wpisanie tekstu, zatwierdzenie formularza) musi generować **natychmiastowy i zrozumiały feedback wizualny**.
    *   Płynne animacje (CSS Transitions / Animations) o czasie 0.2s - 0.4s powinny towarzyszyć zmianom stanu (np. `.task-item` dodanie/usunięcie, `.btn` `hover`/`active`).
    *   Użycie ikon (najlepiej SVG) dla akcji, które są uniwersalnie rozpoznawalne.
*   **Hierarchia Wizualna i Czytelność:**
    *   Ważne elementy (nagłówki, przyciski akcji, kluczowe dane) muszą być wyraźnie wyróżnione i łatwo skanowalne.
    *   Rozmiary czcionek, wagi, kolory i odstępy muszą wspierać intuicyjną nawigację po interfejsie.
    *   Brak przeładowania informacjami – skupienie na kluczowych danych.
*   **Dostępność (Accessibility - podstawy):**
    *   Zapewnienie odpowiedniego kontrastu tekstu do tła (min. WCAG AA).
    *   Wszystkie elementy interaktywne muszą być dostępne i nawigowalne za pomocą klawiatury (poprawna kolejność tabulacji, widoczne stany `:focus`).
    *   Użycie semantycznego HTML5 (np. `<button>`, `<label>`, `<input>`).
*   **Stany Puste (Empty States):**
    *   Zaprojektowanie estetycznych i użytecznych ekranów lub komunikatów, gdy nie ma danych do wyświetlenia (np. "Brak zadań", "Brak odblokowanych osiągnięć"). Powinny one zachęcać użytkownika do podjęcia akcji.
*   **Spójność i "Mini Design System":**
    *   Stosowanie zmiennych CSS do zarządzania kolorami, fontami, odstępami i rozmiarami, aby zapewnić globalną spójność i łatwość modyfikacji.
    *   Powtarzalne komponenty UI (np. przyciski, karty, pola input) powinny zachowywać identyczny styl i zachowanie w całej aplikacji.
*   **Interaktywność ("Klikalność"):**
    *   Wszystkie elementy interaktywne (przyciski, linki, karty) muszą posiadać stany:
        *   `:hover` (najazd myszką) - np. zmiana koloru, cienia, delikatna animacja.
        *   `:active` (kliknięcie) - np. efekt wciśnięcia).
        *   `:focus` (nawigacja klawiaturą).
    *   Płynne przejścia (CSS Transitions) przy zmianach stanów (np. 0.2s - 0.3s).
*   **Responsywność (RWD):**
    *   Interfejs musi wyglądać dobrze na Desktopie oraz na urządzeniach mobilnych (symulacja w przeglądarce).
    *   Brak poziomego paska przewijania na mniejszych ekranach.

## 2. Architektura i Technologia (Serverless Client-Side)
Aplikacja udaje działanie pełnoprawnego serwisu backendowego.

*   **Stack Technologiczny:**
    *   Czysty HTML5 (semantyczne znaczniki: `<nav>`, `<header>`, `<main>`, `<section>`, `<footer>`).
    *   CSS3 (z wykorzystaniem Zmiennych CSS `--variable` do zarządzania kolorami/wymiarami).
    *   Vanilla JavaScript (ES6+) - bez frameworków typu React/Vue (chyba że wskazano inaczej w zadaniu).
    *   **Brak zagadnień CORS:** Ponieważ aplikacja działa w pełni po stronie klienta (serverless HTML), nie występują problemy z CORS (Cross-Origin Resource Sharing), gdyż nie ma komunikacji z zewnętrznym serwerem API.
*   **Symulacja Backend-u:**
    *   Wszelkie dane (np. lista produktów, posty, użytkownicy) muszą być przechowywane w strukturach JSON w plikach JS lub stałych.
    *   Symulacja asynchroniczności: Operacje "pobierania" lub "zapisywania" danych powinny mieć sztuczne opóźnienie (np. `setTimeout` 500ms-1000ms) i pokazywać **spinner/loader**.
    *   Dane powinny być tymczasowo zapamiętywane (opcjonalnie wykorzystanie `localStorage` przeglądarki, aby stan przetrwał odświeżenie strony).

## 3. Jakość Kodu i Struktura Projektu
*   **Separacja warstw:**
    *   Oddzielne pliki dla struktury (`index.html`), wyglądu (`style.css`) i logiki (`app.js` / `main.js`).
*   **Czystość kodu:**
    *   Zrozumiałe nazewnictwo klas CSS (np. konwencja BEM lub opisowe nazwy po angielsku).
    *   Kod JS podzielony na małe, odpowiedzialne za jedną rzecz funkcje.
*   **Struktura Kodu JavaScript (Bez Modułów):**
    *   **Zakaz `import`/`export`:** Aby zapewnić działanie prototypu bez serwera (z `file:///`), **nie wolno używać** składni modułów ES6 (`import` i `export`) ani `<script type="module">`.
    *   **Wiele Plików `<script>`:** Kod JavaScript powinien być podzielony na logiczne pliki (np. `data.js`, `tasks.js`, `main.js`).
    *   **Kolejność w HTML:** Pliki te muszą być wczytane w `index.html` za pomocą oddzielnych tagów `<script>` w **prawidłowej kolejności** – od plików, które nie mają zależności, do tych, które z nich korzystają (np. `data.js` -> `tasks.js` -> `main.js`). Skrypty umieszczamy na końcu `<body>`.

## 4. Obsługa Błędów (Symulacja)
*   Formularze powinny posiadać walidację po stronie klienta (np. sprawdzenie czy email ma @, czy hasło jest wystarczająco długie) przed "wysłaniem".
*   Wyświetlanie estetycznych komunikatów o sukcesie (np. "Zapisano zmiany") lub błędzie ("Wypełnij wszystkie pola").
