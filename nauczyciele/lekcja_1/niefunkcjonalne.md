# Wymagania Niefunkcjonalne dla Gier Webowych (Szablon)

Dokument ten zawiera standardowe wymagania niefunkcjonalne dla projektów gier tworzonych w technologiach webowych (HTML5, CSS3, JavaScript) w oparciu o serwer Node.js oraz ekosystem pakietów npm.

## 1. Technologie i Platforma

### Stack Technologiczny
-   **Node.js:** Środowisko uruchomieniowe backendu (wbudowany moduł `http` lub lekki framework typu `express`), serwer aplikacji i assetów gry
-   **Pakiety Node.js / npm:** Zarządzanie zależnościami (np. pakiety pomocnicze, WebSocket / ws, ewentualnie Express)
-   **JavaScript (ES6+):** Logika klienta oraz serwera gry
-   **HTML5:** Struktura aplikacji oraz **Canvas API / WebGL** (np. Three.js) do renderowania grafiki 2D/3D
-   **CSS3:** Stylizacja interfejsu gry, HUD, menu (Flexbox/Grid, animacje CSS)

### Środowisko Uruchomieniowe
-   **Typ aplikacji:** Aplikacja klient-serwer (serwer Node.js + klient w przeglądarce)
-   **Zarządzanie zależnościami:** Plik `package.json` z zadeklarowanymi pakietami npm
-   **Uruchamianie:** Za pomocą skryptów npm (np. `npm start` lub `npm run dev`), serwer dostępny pod adresem lokalnym (np. `http://localhost:3000`)
-   **Przechowywanie danych:** Pamięć serwera Node.js (stan gry w czasie rzeczywistym), pliki konfiguracyjne/JSON, opcjonalnie LocalStorage po stronie klienta (np. zapisy lokalne, ustawienia)

## 2. Kompatybilność


### Responsywność
-   Aplikacja powinna być zoptymalizowana pod minimum rozdzielczość 1280x720 pikseli
-   UI powinien adaptować się do większych rozdzielczości
-   (Opcjonalnie) Wsparcie dla urządzeń mobilnych, jeśli projekt tego wymaga

## 3. Wydajność

### Szybkość Ładowania
-   Aplikacja powinna ładować się w przeglądarce w czasie krótszym niż **2 sekundy**
-   Wszystkie zasoby (CSS, JS, obrazy) powinny być zoptymalizowane pod kątem rozmiaru

### Płynność Działania
-   Wszystkie animacje i interakcje powinny działać płynnie (minimum **30 FPS**, preferowane **60 FPS**)
-   Reakcja na akcje użytkownika (kliknięcia, wpisywanie tekstu) powinna być natychmiastowa (opóźnienie < 100ms)
-   Brak zauważalnych "zawieszek" podczas normalnego użytkowania

### Optymalizacja Zasobów
-   Unikanie niepotrzebnych operacji w pętlach renderowania
-   Efektywne zarządzanie pamięcią (brak wycieków pamięci)
-   Minimalizacja liczby manipulacji DOM w krótkim czasie

## 4. Użyteczność (Usability)

### Intuicyjność
-   Interfejs powinien być zrozumiały bez potrzeby czytania instrukcji
-   Elementy interaktywne (przyciski, pola) powinny być łatwo rozpoznawalne
-   Nawigacja powinna być logiczna i przewidywalna

### Dostępność Wizualna
-   **Czytelność:** Odpowiedni kontrast między tekstem a tłem (minimum 4.5:1 dla tekstu normalnego)
-   **Rozmiar czcionki:** Minimum 14px dla treści, 12px dla elementów pomocniczych
-   **Kolory:** Użycie kolorów nie powinno być jedynym sposobem przekazywania informacji

### Feedback dla Użytkownika
-   Każda akcja użytkownika powinna mieć wizualną odpowiedź (hover, active states)
-   Komunikaty o błędach lub sukcesie powinny być jasne i zrozumiałe
-   Stan ładowania/przetwarzania powinien być widoczny dla użytkownika

### Sterowanie
-   (Jeśli dotyczy) Sterowanie klawiaturą powinno być intuicyjne i zgodne z konwencjami:
    -   WASD lub strzałki do poruszania się
    -   Spacja do akcji głównej (skok, interakcja)
    -   ESC do powrotu/anulowania
-   (Jeśli dotyczy) Sterowanie myszą powinno wykorzystywać standardowe wzorce (LPM - akcja, PPM - kontekst)

## 5. Jakość i Utrzymywalność Kodu

### Separacja Warstw
Kod musi być jasno podzielony na odpowiedzialne warstwy:
-   **HTML:** Tylko struktura i semantyka, zero logiki
-   **CSS:** Tylko stylizacja, zero logiki biznesowej
-   **JavaScript:** Logika i interaktywność

### Struktura Projektu
Projekt powinien zachowywać spójną strukturę folderów z podziałem na serwer Node.js oraz klienta:

```text
project/
└── lekcja_X/
    ├── package.json            # Zależności i skrypty npm (npm start, npm run dev)
    ├── package-lock.json
    ├── server/                 # Kod serwera Node.js
    │   ├── server.js           # Główny punkt wejścia serwera (np. Express / WebSockets)
    │   ├── gameState.js        # Stan gry na serwerze (dla trybów sieciowych/multiplayer)
    │   └── ...                 # Moduły serwerowe
    ├── public/                 # Klient gry (serwowany przez serwer Node.js)
    │   ├── index.html          # Główny plik HTML gry i kontener Canvas
    │   ├── css/
    │   │   └── style.css       # Style gry, menu i HUD
    │   ├── js/
    │   │   ├── config.js       # Stałe i konfiguracja gry
    │   │   ├── state.js        # Stan klienta gry
    │   │   ├── input.js        # Obsługa wejścia (klawiatura, mysz)
    │   │   ├── physics.js      # Detekcja kolizji i fizyka
    │   │   ├── renderer.js     # Renderowanie Canvas / WebGL
    │   │   ├── game.js         # Pętla gry (Game Loop)
    │   │   └── main.js         # Inicjalizacja i start klienta
    │   └── assets/             # Tekstury, grafiki, dźwięki
    └── README.md               # Instrukcja instalacji (npm install) i uruchomienia (npm start)
```

### Architektura Kodu JavaScript

#### Podział na Moduły
Kod JavaScript powinien być podzielony na logiczne moduły, każdy z jasno zdefiniowaną odpowiedzialnością:

-   **config.js:** Stałe, parametry konfiguracyjne (rozmiary, prędkości, kolory)
-   **state.js:** Dane aplikacji i stan (dla UI-heavy apps) lub klasa zarządzająca stanem
-   **[logika].js:** Moduły z logiką biznesową (np. `player.js`, `world.js`, `physics.js`)
-   **ui.js / renderer.js:** Warstwa renderowania - tylko funkcje manipulujące DOM lub canvas
-   **input.js:** (jeśli dotyczy) Obsługa wejścia od użytkownika (klawiatura, mysz)
-   **main.js:** Punkt wejścia - inicjalizacja, game loop, orkiestracja

#### Przepływ Danych
Aplikacja powinna stosować jednokierunkowy przepływ danych:

```
Akcja użytkownika → Aktualizacja stanu → Renderowanie UI
```

#### Konwencje Nazewnictwa
-   **Zmienne i funkcje:** camelCase (np. `playerSpeed`, `updatePosition()`)
-   **Stałe:** UPPER_SNAKE_CASE (np. `MAX_VELOCITY`, `CANVAS_WIDTH`)
-   **Klasy:** PascalCase (np. `Player`, `WorldManager`)
-   **Pliki:** lowercase z myślnikami (np. `input-handler.js`) lub camelCase

### Czytelność Kodu

-   **Komentarze:** Kod powinien zawierać komentarze wyjaśniające "dlaczego", nie "co"
-   **Funkcje:** Powinny być krótkie i robić jedną rzecz (max 30-50 linii)
-   **Nazwy:** Powinny być opisowe i wyrażać intencję (unikać skrótów typu `x`, `tmp`)
-   **Formatowanie:** Spójne wcięcia (2 lub 4 spacje), odstępy między sekcjami

### CSS - Organizacja Stylów

#### Struktura Pliku CSS
Plik `style.css` powinien być podzielony na logiczne sekcje:

```css
/* =========================
   1. Reset i zmienne globalne
   ========================= */

/* =========================
   2. Layout główny
   ========================= */

/* =========================
   3. Komponenty UI
   ========================= */

/* =========================
   4. Stany i animacje
   ========================= */

/* =========================
   5. Media queries (opcjonalnie)
   ========================= */
```

#### Konwencje Nazewnictwa CSS
-   Używać klas, unikać ID do stylizacji
-   Nazwy klas po angielsku, kebab-case: `.game-hud`, `.score-board`, `.menu-overlay`
-   Stosować konwencję BEM dla złożonych komponentów UI gry:
    -   `.block__element--modifier`
    -   Przykład: `.player-health__bar--critical`, `.menu-overlay__button--active`

## 6. Niezawodność

### Obsługa Błędów
-   Aplikacja nie powinna się "zawieszać" ani wyświetlać pustego ekranu w przypadku błędu
-   Błędy krytyczne powinny być wyświetlane użytkownikowi w zrozumiały sposób
-   Błędy w konsoli przeglądarki powinny być minimalne (zero błędów w normalnym użytkowaniu)

### Stabilność
-   Prototyp powinien działać stabilnie przez minimum 30 minut ciągłego użytkowania
-   Brak wycieków pamięci przy długotrwałym działaniu
-   (Jeśli dotyczy) Game loop nie powinien zwalniać z czasem

### Walidacja Danych
-   Wszystkie dane wprowadzane przez użytkownika powinny być walidowane
-   Aplikacja powinna zabezpieczać się przed nieprawidłowymi wartościami

## 7. Bezpieczeństwo (dla prototypów z danymi użytkownika)

### Przechowywanie Danych
-   **Hasła:** Nigdy nie przechowywać w plain text (nawet w prototypie - używać prostego hashowania lub symulacji)
-   **LocalStorage:** Pamiętać, że dane są widoczne dla użytkownika
-   **Brak wrażliwych danych:** Prototyp nie powinien zachęcać do wpisywania prawdziwych danych osobowych

### Podstawowe Zabezpieczenia
-   Sanitizacja wprowadzanych danych tekstowych (unikanie XSS)
-   Walidacja danych po stronie klienta oraz walidacja pakietów/żądań po stronie serwera Node.js

## 8. Dokumentacja

### README.md (opcjonalnie)
Jeśli projekt jest bardziej złożony, dodać plik `README.md` z:
-   Krótkim opisem projektu
-   Instrukcją uruchomienia
-   Opisem użytych technologii
-   Znanymi ograniczeniami

### Komentarze w Kodzie
-   Każdy moduł JavaScript powinien mieć komentarz nagłówkowy opisujący jego cel
-   Skomplikowane algorytmy powinny mieć komentarze krok po kroku
-   Funkcje publiczne powinny mieć krótki opis parametrów i zwracanej wartości

## 9. Testowanie

### Testy Manualne
Przed uznaniem prototypu za gotowy, należy przeprowadzić następujące testy:

-   ✅ Projekt instaluje się poprawnie za pomocą `npm install`
-   ✅ Serwer Node.js uruchamia się bez błędów (`npm start`)
-   ✅ Aplikacja uruchamia się w przeglądarce bez błędów w konsoli
-   ✅ Wszystkie funkcjonalności działają zgodnie z wymaganiami
-   ✅ Interfejs wyświetla się poprawnie w różnych przeglądarkach
-   ✅ Nie występują wycieki pamięci (sprawdzić w DevTools)
-   ✅ Wszystkie animacje są płynne
-   ✅ Aplikacja reaguje poprawnie na nieprawidłowe dane wejściowe

### Edge Cases
Przetestować nietypowe scenariusze:
-   Bardzo długie teksty w polach input
-   Klikanie/interakcja w szybkim tempie
-   Używanie aplikacji przez dłuższy czas (>15 minut)

## 10. Dodatkowe Wytyczne Specyficzne dla Typu Projektu

### Dla Gier (Canvas-based)
-   **FPS Counter:** (opcjonalnie) Dodać licznik FPS do monitorowania wydajności
-   **Pause/Resume:** Możliwość zatrzymania i wznowienia gry
-   **Delta Time:** Używać delta time w game loop dla spójnego działania na różnych urządzeniach

### Dla Aplikacji UI-Heavy
-   **Loading States:** Symulować stan ładowania dla akcji asynchronicznych
-   **Empty States:** Pokazywać odpowiednie komunikaty, gdy brak danych (np. "Brak wiadomości")
-   **Transitions:** Płynne przejścia między stanami UI (CSS transitions/animations)

### Dla Symulacji/Wizualizacji
-   **Kontrola Prędkości:** Możliwość zmiany prędkości symulacji
-   **Reset:** Przycisk resetowania do stanu początkowego
-   **Wizualizacja Danych:** Czytelne oznaczenia, legendy, jednostki miar

---

## Podsumowanie - Checklist

Przed uznaniem prototypu za ukończony, upewnij się że:

- [ ] Skonfigurowano `package.json` z niezbędnymi pakietami Node.js
- [ ] Serwer Node.js uruchamia się bezbłędnie poleceniem `npm start`
- [ ] Kod jest podzielony na serwer (Node.js) i klienta (HTML, CSS, JS)
- [ ] Struktura folderów jest logiczna i uporządkowana
- [ ] Aplikacja działa we wszystkich głównych przeglądarkach
- [ ] Nie ma błędów w konsoli przeglądarki
- [ ] Wszystkie animacje są płynne (≥30 FPS)
- [ ] Interfejs jest intuicyjny i responsywny
- [ ] Kod jest czytelny i dobrze skomentowany
- [ ] Wszystkie funkcjonalności z `funkcjonalne.md` są zaimplementowane
- [ ] Aplikacja jest stabilna i nie zawiesza się
- [ ] Dane użytkownika są walidowane
- [ ] Projekt zawiera wszystkie niezbędne pliki do uruchomienia

---

**Nota:** Ten szablon należy dostosować do konkretnego projektu, rozszerzając lub modyfikując sekcje zgodnie z wymaganiami opisanymi w pliku `funkcjonalne.md`.
