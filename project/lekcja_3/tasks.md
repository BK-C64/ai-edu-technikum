# Plan Implementacji: Prototyp Gry 2D Minecraft

Poniżej znajduje się szczegółowy, krokowy plan implementacji prototypu gry, oparty na dokumencie `design.md`.

## Krok 1: Inicjalizacja Projektu i Struktura Plików

Celem tego kroku jest stworzenie podstawowej struktury projektu, która będzie gotowa na implementację logiki gry.

-   [x] **Utwórz plik `index.html`:**
    -   Dodaj podstawową strukturę HTML5.
    -   W `<body>` umieść element `<canvas>` z identyfikatorem `gameCanvas`.
    -   Podłącz plik `style.css`.
    -   Podłącz wszystkie pliki JavaScript (`config.js`, `world.js`, `player.js`, `renderer.js`, `input.js`, `main.js`) w odpowiedniej kolejności na końcu `<body>`.
-   [x] **Utwórz plik `css/style.css`:**
    -   Dodaj podstawowe style, aby wycentrować canvas i nadać stronie tło (np. czarne lub szare).
    -   Upewnij się, że canvas nie ma domyślnych marginesów.
-   [x] **Utwórz puste pliki JavaScript w katalogu `js/`:**
    -   `main.js`
    -   `config.js`
    -   `world.js`
    -   `player.js`
    -   `renderer.js`
    -   `input.js`

## Krok 2: Podstawy Renderowania i Pętla Gry

Celem jest uruchomienie pętli gry i narysowanie czegokolwiek na ekranie, aby potwierdzić, że podstawy działają.

-   [x] **W `js/config.js`:**
    -   Zdefiniuj podstawowe stałe: `CANVAS_WIDTH`, `CANVAS_HEIGHT`, `BLOCK_SIZE`.
-   [x] **W `js/renderer.js`:**
    -   Stwórz klasę lub obiekt `Renderer`.
    -   Dodaj metodę `constructor`, która przyjmuje `canvas` jako argument i pobiera jego kontekst 2D.
    -   Dodaj metodę `clear()` do czyszczenia canvasu.
-   [x] **W `js/main.js`:**
    -   Napisz kod, który uruchomi się po załadowaniu DOM.
    -   Pobierz element canvas i utwórz instancję `Renderer`.
    -   Zaimplementuj funkcję `gameLoop()`.
    -   Wewnątrz `gameLoop()`:
        -   Wywołaj `renderer.clear()`.
        -   (Tymczasowo) Narysuj prostokąt, aby sprawdzić, czy pętla działa.
        -   Użyj `requestAnimationFrame(gameLoop)` do ciągłego wywoływania pętli.
    -   Uruchom `gameLoop()` po raz pierwszy.

## Krok 3: Implementacja Świata Gry

Teraz stworzymy logikę świata gry i będziemy w stanie go wyświetlić.

-   [x] **W `js/world.js`:**
    -   Stwórz klasę `World`.
    -   W `constructor` zainicjuj dwuwymiarową tablicę (`grid`) do przechowywania bloków.
    -   Zaimplementuj metodę `generateWorld()`, która wypełni `grid` prostym, płaskim terenem (np. warstwa kamienia, ziemi i trawy).
    -   Dodaj metody `getBlock(x, y)` i `setBlock(x, y, type)`.
-   [x] **W `js/renderer.js`:**
    -   Dodaj metodę `drawWorld(world)`, która iteruje po `world.grid` i rysuje prostokąty w różnych kolorach w zależności od typu bloku.
-   [x] **W `js/main.js`:**
    -   Utwórz instancję `World` i wywołaj `world.generateWorld()`.
    -   W `gameLoop()` wywołaj `renderer.drawWorld(world)`.

## Krok 4: Implementacja Gracza i Podstawowego Ruchu

Dodajemy postać gracza i umożliwiamy jej poruszanie się.

-   [x] **W `js/player.js`:**
    -   Stwórz klasę `Player`.
    -   W `constructor` ustaw początkową pozycję (`x`, `y`) i prędkość (`vx`, `vy`).
    -   Zaimplementuj metodę `update(deltaTime, world)`, która na razie będzie tylko aktualizować pozycję na podstawie prędkości.
    -   Dodaj metody `move(direction)` i `jump()`, które będą modyfikować prędkość gracza.
-   [x] **W `js/input.js`:**
    -   Stwórz klasę lub obiekt `InputHandler`.
    -   Dodaj nasłuchiwanie na zdarzenia `keydown` i `keyup`.
    -   Przechowuj stan wciśniętych klawiszy w obiekcie (np. `this.keys = {}`).
-   [x] **W `js/renderer.js`:**
    -   Dodaj metodę `drawPlayer(player)`, która rysuje prostokąt w miejscu pozycji gracza.
-   [x] **W `js/main.js`:**
    -   Utwórz instancje `Player` i `InputHandler`.
    -   W `gameLoop()`:
        -   Sprawdzaj stan klawiszy w `inputHandler` i wywołuj odpowiednie metody gracza (`player.move()`, `player.jump()`).
        -   Wywołaj `player.update()`.
        -   Wywołaj `renderer.drawPlayer(player)`.

## Krok 5: Fizyka i Kolizje

Ulepszamy logikę gracza o grawitację i interakcję ze światem.

-   [x] **W `js/player.js`:**
    -   W metodzie `update()`:
        -   Dodaj stałą grawitacji do prędkości pionowej (`vy`).
        -   Zaimplementuj prostą detekcję kolizji z blokami w `world`.
        -   Zapobiegaj przechodzeniu gracza przez bloki.
        -   Zatrzymaj opadanie, gdy gracz stoi na bloku.

## Krok 6: Interakcja - Niszczenie i Budowanie

Ostatni krok to dodanie kluczowych mechanik gry.

-   [x] **W `js/input.js`:**
    -   Dodaj nasłuchiwanie na zdarzenie `mousedown`.
    -   Przechowuj pozycję kliknięcia myszy.
-   [x] **W `js/world.js`:**
    -   Dodaj metodę `removeBlock(gridX, gridY)`.
-   [x] **W `js/main.js`:**
    -   W `gameLoop()` lub w obsłudze zdarzeń w `InputHandler`:
        -   Po kliknięciu lewym przyciskiem myszy, przelicz koordynaty myszy na koordynaty siatki świata.
        -   Wywołaj `world.removeBlock()` na odpowiednich koordynatach.
        -   Po kliknięciu prawym przyciskiem myszy, wywołaj `world.setBlock()` (na razie z jednym, domyślnym typem bloku).

## Lista Kontrolna Weryfikacji

-   [x] Aplikacja uruchamia się bez błędów w konsoli.
-   [x] Świat gry jest generowany i wyświetlany poprawnie.
-   [x] Gracz może poruszać się w lewo i w prawo za pomocą klawiatury.
-   [x] Gracz może skakać.
-   [x] Gracz podlega grawitacji i koliduje z blokami.
-   [x] Kliknięcie lewym przyciskiem myszy usuwa blok.
-   [x] Kliknięcie prawym przyciskiem myszy dodaje blok.