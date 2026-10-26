# Plan Implementacji: Space Invaders

Dokument przygotowany przez **Tech Leada** dla **Software Developera**.
Plan dekomponuje architekturę techniczną (`space_inv/architecture.md`) oraz wymagania projektowe (`space_inv/requirements.md`) na uporządkowany ciąg zadań realizowanych przyrostowo.

---

## Przegląd Postępu Prac

- [ ] **Faza 0:** Setup środowiska i serwera Node.js
- [ ] **Faza 1:** Baza klienta i Game Loop
- [ ] **Faza 2:** Gracz i obsługa wejścia
- [ ] **Faza 3:** System strzelania gracza
- [ ] **Faza 4:** Formacja najeźdźców i detekcja kolizji
- [ ] **Faza 5:** Ostrzał wroga, osłony i obrażenia gracza
- [ ] **Faza 6:** Stan gry i progresja fal
- [ ] **Faza 7:** Interfejs (HUD, ekrany) i restart
- [ ] **Faza 8:** Końcowa weryfikacja i testy akceptacyjne (US-01 do US-07)

---

## Faza 0: Setup Środowiska i Serwera Node.js

Cel: Przygotowanie struktury katalogów projektu oraz uruchomienie lekkiego serwera HTTP w czystym Node.js (bez zewnętrznych bibliotek npm), serwującego pliki statyczne z katalogu `public/`.

- [ ] **Zadanie 0.1: Konfiguracja manifestu projektu `package.json`**
  - **Plik do utworzenia:** `space_inv/package.json`
  - **Zakres prac:**
    - Zdefiniowanie podstawowych metadanych projektu (nazwa: `space-invaders`, wersja, opis edukacyjny).
    - Ustawienie typu modułów na `"type": "module"` (umożliwienie importów ES Modules).
    - Dodanie skryptu startowego: `"scripts": { "start": "node server.js" }`.
    - Utrzymanie zerowej listy zależności zewnętrznych (`dependencies: {}`).
  - **Kryterium walidacji:**
    - Plik jest poprawnym dokumentem JSON (`npm pkg get` lub parser JSON nie zgłasza błędów składniowych).

- [ ] **Zadanie 0.2: Implementacja serwera plików statycznych `server.js`**
  - **Plik do utworzenia:** `space_inv/server.js`
  - **Zależności:** Wbudowane moduły Node.js: `http`, `fs`, `path`.
  - **Zakres prac:**
    - Utworzenie serwera HTTP nasłuchującego na porcie zdefiniowanym przez `process.env.PORT` lub domyślnie `3000`.
    - Zdefiniowanie mapy typów MIME dla rozszerzeń: `.html` (`text/html`), `.css` (`text/css`), `.js` (`application/javascript`), `.json` (`application/json`), `.png` (`image/png`).
    - Mapowanie żądań: ścieżka główna `/` powinna zwracać plik `/index.html` z katalogu `public/`.
    - Bezpieczne rozwiązywanie ścieżek za pomocą `path.join` i `path.normalize`, zapobiegające wychodzeniu poza katalog `public/`.
    - Obsługa kodów odpowiedzi: kod `200` przy sukcesie, kod `404 Not Found` dla nieistniejących plików, kod `500 Internal Server Error` przy błędach odczytu systemu plików.
    - Wypisanie informacji w konsoli po pomyślnym uruchomieniu serwera (np. `Serwer Space Invaders uruchomiony na http://localhost:3000`).
  - **Kryterium walidacji:**
    - Uruchomienie polecenia `npm start` lub `node server.js` w katalogu `space_inv/`.
    - Serwer nie rzuca wyjątków i nasłuchuje na wskazanym porcie.

- [ ] **Zadanie 0.3: Przygotowanie szkieletu katalogów klienta**
  - **Katalogi do utworzenia:**
    - `space_inv/public/`
    - `space_inv/public/css/`
    - `space_inv/public/js/`
  - **Zakres prac:**
    - Utworzenie fizycznej struktury folderów pod statyczne zasoby przeglądarki zgodnie z architekturą modułową.
  - **Kryterium walidacji:**
    - Struktura katalogów istnieje na dysku i jest widoczna dla serwera `server.js`.

---

## Faza 1: Baza Klienta i Game Loop

Cel: Uruchomienie wycentrowanego Canvasu HTML5 o stałej rozdzielczości 800x600 px oraz pętli gry `requestAnimationFrame` z precyzyjnym obliczaniem czasu klatki (`deltaTime`).

- [ ] **Zadanie 1.1: Struktura strony głównej `index.html`**
  - **Plik do utworzenia:** `space_inv/public/index.html`
  - **Zakres prac:**
    - Semantyczny dokument HTML5 z poprawnym kodowaniem UTF-8 oraz tytułem "Space Invaders - Retro Arcade".
    - Dołączenie arkusza stylów `css/style.css`.
    - Kontener `#game-container` zawierający element `<canvas id="gameCanvas" width="800" height="600"></canvas>`.
    - Import skryptu głównego jako modułu ES6: `<script type="module" src="js/main.js"></script>`.
  - **Kryterium walidacji:**
    - Zapytanie `curl -I http://localhost:3000/` zwraca nagłówek `Content-Type: text/html`.
    - W inspektorze przeglądarki element `<canvas>` ma atrybuty `width="800"` i `height="600"`.

- [ ] **Zadanie 1.2: Stylizacja retro-arcade `style.css`**
  - **Plik do utworzenia:** `space_inv/public/css/style.css`
  - **Zakres prac:**
    - Reset marginesów i dopełnień (`margin: 0`, `padding: 0`, `box-sizing: border-box`).
    - Tło strony: głęboka retro czerń (`#000` / `#050505`).
    - Wycentrowanie kontenera gry w oknie przeglądarki w pionie i poziomie (np. Flexbox / Grid, wysokość `100vh`).
    - Stylizacja elementu `<canvas>`: wyraźna, subtelna ramka retro (np. 2px w kolorze zielonym `#00ff00` lub szarym `#333`), zapobieganie rozmywaniu pikseli (`image-rendering: pixelated`).
    - Dobór czytelnej czcionki monospace/retro (np. `'Courier New', monospace`).
  - **Kryterium walidacji:**
    - Otwarcie strony w oknie przeglądarki o dowolnym rozmiarze prezentuje wycentrowaną, czarną ramkę o wymiarach 800x600 px bez poziomych i pionowych pasków przewijania strony.

- [ ] **Zadanie 1.3: Centralny moduł konfiguracji `config.js`**
  - **Plik do utworzenia:** `space_inv/public/js/config.js`
  - **Kontrakt API:** Eksport stałego obiektu `CONFIG` (zabezpieczonego `Object.freeze`):
    - `CANVAS`: `{ WIDTH: 800, HEIGHT: 600 }`
    - `PLAYER`: `{ WIDTH: 48, HEIGHT: 24, SPEED: 300, LIVES: 3, INVULNERABLE_TIME: 2.0, MAX_BULLETS: 3, Y_OFFSET: 40 }`
    - `INVADERS`: `{ ROWS: 5, COLS: 11, WIDTH: 32, HEIGHT: 24, PADDING_X: 16, PADDING_Y: 16, START_X: 60, START_Y: 80, BASE_SPEED_X: 40, DROP_Y: 20, SPEED_INCREASE_PER_WAVE: 0.10, SHOOT_INTERVAL: 1.5, POINTS_PER_KILL: 10 }`
    - `BULLET`: `{ WIDTH: 4, HEIGHT: 12, PLAYER_SPEED: 450, ENEMY_SPEED: 250 }`
    - `SHIELD`: `{ COUNT: 4, MAX_HEALTH: 3, WIDTH: 64, HEIGHT: 40, Y_POS: 460 }`
    - `COLORS`: definicje barw retro dla tła, gracza, obcych (różne odcienie dla rzędów), pocisków, osłon w różnych stadiach i tekstu HUD.
  - **Kryterium walidacji:**
    - Moduł importuje się poprawnie w konsoli przeglądarki; próba modyfikacji właściwości obiektu `CONFIG` rzuca błąd lub nie odnosi skutku.

- [ ] **Zadanie 1.4: Szkielet pętli gry w `main.js`**
  - **Plik do utworzenia:** `space_inv/public/js/main.js`
  - **Zależności:** `config.js`.
  - **Zakres prac:**
    - Nasłuchiwanie na zdarzenie `DOMContentLoaded`.
    - Pobranie referencji do elementu `<canvas>` i kontekstu 2D (`getContext('2d')`).
    - Inicjalizacja zmiennej przechowującej znacznik czasu poprzedniej klatki (`lastTime = performance.now()`).
    - Implementacja pętli opartej o `requestAnimationFrame(gameLoop)`.
    - Obliczanie przyrostu czasu `dt = (currentTime - lastTime) / 1000` z zabezpieczeniem przed tzw. "spiralą śmierci" (np. ograniczenie `Math.min(dt, 0.1)`).
    - Metody fazowe: funkcja `update(dt)` oraz `render(ctx)`.
    - W fazie `render(ctx)`: czyszczenie ekranu za pomocą `ctx.clearRect(0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT)` oraz wypełnienie tła kolorem retro.
  - **Kryterium walidacji:**
    - W konsoli brak błędów JS. Canvas renderuje jednolite tło retro.
    - Zalogowanie `dt` wykazuje stabilne wartości w okolicach ~0.016 s przy 60 FPS.

---

## Faza 2: Gracz i Obsługa Wejścia

Cel: Umożliwienie graczowi płynnego sterowania działem obronnym w osi poziomej za pomocą klawiatury z bezwzględnym poszanowaniem granic ekranu.

- [ ] **Zadanie 2.1: Moduł obsługi klawiatury `input.js`**
  - **Plik do utworzenia:** `space_inv/public/js/input.js`
  - **Kontrakt API:**
    - `init()`: rejestracja listenerów zdarzeń `keydown` i `keyup` na obiekcie `window`.
    - `isLeftPressed()`: zwraca `true`, gdy aktywny jest klawisz `ArrowLeft` lub `KeyA`.
    - `isRightPressed()`: zwraca `true`, gdy aktywny jest klawisz `ArrowRight` lub `KeyD`.
    - `isShootPressed()`: zwraca `true` dokładnie raz na naciśnięcie spacji (`Space`), implementując mechanizm konsumpcji zdarzenia (zapobiega ciągłemu strzelaniu z autofire przy przytrzymaniu klawisza).
    - `isRestartPressed()`: zwraca `true` przy naciśnięciu klawisza `KeyR`.
    - Prewencja domyślnych akcji przeglądarki (`e.preventDefault()`) dla klawiszy strzałek i spacji, aby zapobiec przewijaniu okna.
  - **Kryterium walidacji:**
    - Test wciśnięć klawiszy w konsoli: przytrzymanie `ArrowLeft` zwraca ciągłe `true` z `isLeftPressed()`, natomiast `isShootPressed()` zwraca `true` tylko w pierwszej klatce po wciśnięciu Spacji.

- [ ] **Zadanie 2.2: Klasa statku gracza `player.js`**
  - **Plik do utworzenia:** `space_inv/public/js/player.js`
  - **Zależności:** `config.js`.
  - **Kontrakt API:**
    - Pola stanu: `x`, `y`, `width`, `height`, `speed`, `invulnerableTimer`.
    - `reset()`: ustawienie gracza na środku dolnej krawędzi (`x = (CANVAS.WIDTH - width) / 2`, `y = CANVAS.HEIGHT - Y_OFFSET`) oraz wyzerowanie licznika nietykalności.
    - `moveLeft(dt)`: przesunięcie `x -= speed * dt`, z ograniczeniem `Math.max(0, x)`.
    - `moveRight(dt)`: przesunięcie `x += speed * dt`, z ograniczeniem `Math.min(CANVAS.WIDTH - width, x)`.
    - `update(dt)`: dekrementacja `invulnerableTimer` (jeśli `invulnerableTimer > 0`).
    - `render(ctx)`: rysowanie klasycznego działa (statek złożony z geometrycznych kształtów retro). Jeśli gracz jest nietykalny (`invulnerableTimer > 0`), zastosowanie efektu migotania klatek (naprzemienne rysowanie / pomijanie co ~100 ms).
    - `getBounds()`: zwraca `{ x, y, width, height }`.
  - **Kryterium walidacji:**
    - Wywołanie `moveLeft` i `moveRight` przy skrajnych pozycjach nie pozwala wyjechać współrzędnej `x` poniżej `0` ani powyżej `CANVAS.WIDTH - width`.

- [ ] **Zadanie 2.3: Integracja gracza i wejścia w `main.js`**
  - **Plik do modyfikacji:** `space_inv/public/js/main.js`
  - **Zależności:** `input.js`, `player.js`.
  - **Zakres prac:**
    - Inicjalizacja `input.init()` przy starcie.
    - Utworzenie instancji gracza i wywołanie `player.reset()`.
    - W fazie `update(dt)`: odpytanie `input.isLeftPressed()` i `input.isRightPressed()`, wywołanie odpowiednio `player.moveLeft(dt)` lub `player.moveRight(dt)` oraz `player.update(dt)`.
    - W fazie `render(ctx)`: wywołanie `player.render(ctx)`.
  - **Kryterium walidacji:**
    - Gracz płynnie porusza się w lewo i w prawo po naciśnięciu `A`/`D` oraz strzałek.
    - Statek zatrzymuje się sztywno na lewej i prawej krawędzi Canvasu.

---

## Faza 3: System Strzelania Gracza

Cel: Zaimplementowanie pocisków wystrzeliwanych przez gracza w górę z ograniczeniem do maksymalnie 3 pocisków jednocześnie na ekranie.

- [ ] **Zadanie 3.1: Klasa uniwersalnego pocisku `bullet.js`**
  - **Plik do utworzenia:** `space_inv/public/js/bullet.js`
  - **Zależności:** `config.js`.
  - **Kontrakt API:**
    - Konstruktor: `constructor(x, y, vy, isPlayerBullet)`.
    - Pola: `x`, `y`, `vy` (prędkość w osi Y: ujemna dla gracza, dodatnia dla wroga), `width`, `height`, `isPlayerBullet`.
    - `update(dt)`: aktualizacja pozycji `y += vy * dt`.
    - `isOutOfBounds(canvasHeight)`: zwraca `true`, gdy `y + height < 0` (dla pocisku gracza) lub `y > canvasHeight` (dla pocisku wroga).
    - `render(ctx)`: rysowanie pionowego promienia laserowego (kolor zależy od `isPlayerBullet`).
    - `getBounds()`: zwraca `{ x, y, width, height }`.
  - **Kryterium walidacji:**
    - Utworzony pocisk z ujemną prędkością zmniejsza swoją pozycję `y` po każdym wywołaniu `update(dt)`.
    - Metoda `isOutOfBounds(600)` zwraca `true`, gdy `y < -height`.

- [ ] **Zadanie 3.2: Metoda wystrzału gracza `player.tryShoot()`**
  - **Plik do modyfikacji:** `space_inv/public/js/player.js`
  - **Zależności:** `bullet.js`.
  - **Kontrakt API:**
    - `tryShoot(activePlayerBulletsCount)`:
      - Sprawdza warunek: jeśli `activePlayerBulletsCount >= CONFIG.PLAYER.MAX_BULLETS` (wartość 3), zwraca `null`.
      - W przeciwnym razie oblicza współrzędną wylotu lufy (`bulletX = x + width / 2 - bulletWidth / 2`, `bulletY = y - bulletHeight`) i tworzy nowy obiekt `Bullet` z prędkością `-CONFIG.BULLET.PLAYER_SPEED`.
  - **Kryterium walidacji:**
    - Wywołanie `tryShoot(0)`, `tryShoot(1)`, `tryShoot(2)` zwraca instancję `Bullet`.
    - Wywołanie `tryShoot(3)` zwraca `null`.

- [ ] **Zadanie 3.3: Zarządzanie pociskami gracza w pętli głównej `main.js`**
  - **Plik do modyfikacji:** `space_inv/public/js/main.js`
  - **Zakres prac:**
    - Przechowywanie tablicy aktywnych pocisków gracza `playerBullets = []`.
    - W fazie `update(dt)`:
      - Jeśli `input.isShootPressed()`, wywołanie `player.tryShoot(playerBullets.length)`. Jeśli zwrócono pocisk, dodanie go do tablicy `playerBullets`.
      - Aktualizacja każdego pocisku: `bullet.update(dt)`.
      - Filtrowanie pocisków opuszczających górną krawędź ekranu: `bullet.isOutOfBounds(CONFIG.CANVAS.HEIGHT)`.
    - W fazie `render(ctx)`: wywołanie `bullet.render(ctx)` dla każdego aktywnego pocisku.
  - **Kryterium walidacji:**
    - Naciśnięcie Spacji generuje pocisk lecący w pionie w górę.
    - Szybkie wielokrotne naciskanie Spacji pozwala na pojawienie się dokładnie maksymalnie 3 pocisków na ekranie naraz.
    - Wylot pocisku poza górną krawędź natychmiast odblokowuje możliwość oddania kolejnego strzału.

---

## Faza 4: Formacja Najeźdźców i Detekcja Kolizji

Cel: Zbudowanie armii 55 najeźdźców (5 rzędów po 11 kolumn), ich zsynchronizowanego marszu ze schodzeniem w dół, przyspieszania w miarę eliminacji jednostek oraz kolizji pocisków gracza z najeźdźcami.

- [ ] **Zadanie 4.1: Klasa pojedynczego najeźdźcy `invader.js`**
  - **Plik do utworzenia:** `space_inv/public/js/invader.js`
  - **Zależności:** `config.js`.
  - **Kontrakt API:**
    - Konstruktor: `constructor(gridRow, gridCol, x, y)`.
    - Pola: `gridRow`, `gridCol`, `x`, `y`, `width`, `height`, `isAlive = true`.
    - `render(ctx)`: rysowanie geometrycznej sylwetki obcego (kolor uzależniony od rzędu: np. górny rząd – różowy/fioletowy, środkowe – żółte, dolne – zielone).
    - `getBounds()`: zwraca `{ x, y, width, height }`.
  - **Kryterium walidacji:**
    - Utworzenie obiektu `Invader` i wywołanie `getBounds()` zwraca prawidłowy prostokąt kolizyjny.

- [ ] **Zadanie 4.2: Moduł detekcji kolizji AABB `collision.js`**
  - **Plik do utworzenia:** `space_inv/public/js/collision.js`
  - **Kontrakt API:**
    - `checkAABB(boxA, boxB)`: czysta funkcja matematyczna testująca przecięcie dwóch prostokątów:
      `boxA.x < boxB.x + boxB.width && boxA.x + boxA.width > boxB.x && boxA.y < boxB.y + boxB.height && boxA.y + boxA.height > boxB.y`.
      Zwraca `true` w przypadku kolizji, w przeciwnym razie `false`.
  - **Kryterium walidacji:**
    - Testy jednostkowe weryfikujące: dwa nachodzące na siebie prostokąty zwracają `true`, stykające się lub rozłączne zwracają `false`.

- [ ] **Zadanie 4.3: Zarządzanie siatką obcych `formation.js`**
  - **Plik do utworzenia:** `space_inv/public/js/formation.js`
  - **Zależności:** `config.js`, `invader.js`.
  - **Kontrakt API:**
    - Pola: `invaders = []`, `direction = 1` (1 w prawo, -1 w lewo), `speedX`, `baseSpeedX`, `stepDownRequested = false`.
    - `init(wave)`:
      - Wyczyszczenie tablicy i wygenerowanie 55 obiektów `Invader` (5 rzędów po 11 kolumn) z odstępami `PADDING_X` i `PADDING_Y`.
      - Ustalenie prędkości początkowej ze skalowaniem fali: `baseSpeedX = CONFIG.INVADERS.BASE_SPEED_X * (1 + CONFIG.INVADERS.SPEED_INCREASE_PER_WAVE * (wave - 1))`.
      - `speedX = baseSpeedX`.
    - `update(dt, canvasWidth)`:
      - Przesunięcie wszystkich żywych obcych w osi X: `invader.x += speedX * direction * dt`.
      - Sprawdzenie kontaktu skrajnych żywych obcych z krawędziami: jeśli którykolwiek dotarł do lewej (`x <= 0`) lub prawej krawędzi (`x + width >= canvasWidth`):
        - Zmiana zwrotu: `direction *= -1`.
        - Obniżenie wszystkich najeźdźców o stały krok w dół: `invader.y += CONFIG.INVADERS.DROP_Y`.
    - `removeInvader(invader)`:
      - Oznaczenie `invader.isAlive = false`.
      - Dynamiczne przeliczenie tempa: wzrost `speedX` proporcjonalnie do ubytku obcych (np. `speedX = baseSpeedX * (1 + (totalInvaders - aliveCount) / totalInvaders)`).
    - `getAliveInvaders()`: zwraca tablicę tylko żywych najeźdźców (`isAlive === true`).
    - `isEmpty()`: zwraca `true`, gdy liczba żywych najeźdźców wynosi 0.
    - `render(ctx)`: wywołanie `render(ctx)` dla każdego żywego obcego.
  - **Kryterium walidacji:**
    - Inicjalizacja generuje dokładnie 55 obiektów `Invader`.
    - Formacja porusza się synchronicznie; dotknięcie prawej ściany powoduje natychmiastowe obniżenie formacji i ruch w lewo.
    - Eliminacja najeźdźców zauważalnie zwiększa tempo marszu pozostałych.

- [ ] **Zadanie 4.4: Kolizje pocisków gracza z najeźdźcami w `main.js`**
  - **Plik do modyfikacji:** `space_inv/public/js/main.js`
  - **Zależności:** `formation.js`, `collision.js`.
  - **Zakres prac:**
    - Integracja `formation.init(1)` w setupie gry.
    - Aktualizacja i renderowanie formacji w `update(dt)` oraz `render(ctx)`.
    - Pętla sprawdzania kolizji: dla każdego pocisku gracza i każdego żywego najeźdźcy wywołanie `collision.checkAABB(bullet.getBounds(), invader.getBounds())`:
      - Przy trafieniu: wywołanie `formation.removeInvader(invader)`, usunięcie pocisku z tablicy `playerBullets`.
  - **Kryterium walidacji:**
    - Wystrzelony pocisk gracza po zetknięciu z najeźdźcą usuwa go z planszy.
    - Pocisk natychmiast znika, zwalniając slot w limicie 3 pocisków.

---

## Faza 5: Ostrzał Wroga, Osłony i Obrażenia Gracza

Cel: Wdrożenie 4 bunkrów obronnych z 3-stopniową degradacją, ostrzału wroga z dolnych jednostek formacji oraz systemu obrażeń i nietykalności gracza.

- [ ] **Zadanie 5.1: Moduł bunkrów obronnych `shield.js`**
  - **Plik do utworzenia:** `space_inv/public/js/shield.js`
  - **Zależności:** `config.js`.
  - **Kontrakt API:**
    - Struktura obiektu osłony: `{ id, x, y, width, height, health: 3, isDestroyed: false }`.
    - `init()`: utworzenie 4 równomiernie i symetrycznie rozmieszczonych bunkrów w poprzek ekranu na wysokości `CONFIG.SHIELD.Y_POS`.
    - `takeHit(shieldIndex)`: zmniejszenie `health` o 1; jeśli `health <= 0`, ustawienie `isDestroyed = true`.
    - `getShields()`: zwraca tablicę wszystkich aktywnych osłon (`isDestroyed === false`).
    - `render(ctx)`: rysowanie osłon. Wygląd/kolor odzwierciedla stan wytrzymałości (np. 3 HP – pełny zielony blok, 2 HP – żółty/nadkruszony, 1 HP – czerwony/mocno uszkodzony).
  - **Kryterium walidacji:**
    - Wywołanie `init()` tworzy 4 osłony o równych odstępach.
    - Trzykrotne wywołanie `takeHit` na danej osłonie powoduje jej zniszczenie i usunięcie z listy aktywnych.

- [ ] **Zadanie 5.2: Ostrzał wrogów z dolnego rzędu kolumn w `formation.js`**
  - **Plik do modyfikacji:** `space_inv/public/js/formation.js`
  - **Zależności:** `bullet.js`.
  - **Kontrakt API:**
    - `getBottomInvaders()`: wewnętrzna metoda filtrująca – dla każdej z 11 kolumn znajduje najeźdźcę o najwyższej współrzędnej `gridRow` spośród wciąż żywych jednostek.
    - `tryShoot(dt)`:
      - Zliczanie czasu w wewnętrznym zegarze `shootTimer`.
      - Po upływie `CONFIG.INVADERS.SHOOT_INTERVAL`:
        - Reset zegara ze zmiennym losowym odchyleniem (jitter).
        - Pobranie listy dolnych strzelców przez `getBottomInvaders()`.
        - Jeśli lista nie jest pusta, wylosowanie jednego najeźdźcy i utworzenie pocisku wroga (`isPlayerBullet = false`, `vy = CONFIG.BULLET.ENEMY_SPEED`) wystrzelonego z dolnej krawędzi wroga.
        - Zwrócenie instancji `Bullet` (lub `null`, jeśli strzał nie nastąpił).
  - **Kryterium walidacji:**
    - Pociski wroga wylatują wyłącznie z najniższego żywego najeźdźcy w danej kolumnie (brak samopostrzałów obcych znajdujących się wyżej).
    - Pociski poruszają się w dół planszy.

- [ ] **Zadanie 5.3: Obrażenia gracza i nietykalność w `player.js`**
  - **Plik do modyfikacji:** `space_inv/public/js/player.js`
  - **Kontrakt API:**
    - `hit()`:
      - Jeśli `invulnerableTimer > 0`, zwraca `false` (gracz ignoruje trafienie).
      - W przeciwnym razie ustawia `invulnerableTimer = CONFIG.PLAYER.INVULNERABLE_TIME` (2.0 sekundy) i zwraca `true`.
    - `isInvulnerable()`: zwraca `invulnerableTimer > 0`.
  - **Kryterium walidacji:**
    - Pierwsze wywołanie `hit()` zwraca `true` i ustawia timer na 2.0 s.
    - Kolejne wywołanie `hit()` w przeciągu 2 sekund zwraca `false`.
    - Po upływie 2 sekund `hit()` ponownie zwraca `true`.

- [ ] **Zadanie 5.4: Kompleksowa detekcja kolizji w `main.js`**
  - **Plik do modyfikacji:** `space_inv/public/js/main.js`
  - **Zależności:** `shield.js`, `bullet.js`, `collision.js`.
  - **Zakres prac:**
    - Prowadzenie tablicy wrogich pocisków `enemyBullets = []`.
    - Aktualizacja i czyszczenie pocisków wroga wylatujących poza dolną krawędź (`y > CANVAS.HEIGHT`).
    - Implementacja kolizji:
      1. **Pociski gracza vs Osłony:** pocisk niszczy fragment osłony (`shield.takeHit(i)`), a sam pocisk ulega zniszczeniu.
      2. **Pociski wrogów vs Osłony:** pocisk niszczy fragment osłony (`shield.takeHit(i)`), a sam pocisk ulega zniszczeniu.
      3. **Pociski wrogów vs Gracz:** kolizja wywołuje `player.hit()`. Jeśli zwrócono `true`, następuje rejestracja obrażenia (odjęcie życia), a pocisk wroga ulega zniszczeniu. Jeśli gracz był nietykalny, pocisk przelatuje lub ulega zniszczeniu bez utraty życia.
  - **Kryterium walidacji:**
    - Strzał gracza w osłonę uszkadza ją i niszczy pocisk gracza.
    - Strzał wroga w osłonę uszkadza ją i niszczy wrogi pocisk.
    - Trafienie gracza pociskiem wroga aktywuje migotanie statku na 2 sekundy. Kolejne pociski wroga w tym czasie nie odbierają żyć.

---

## Faza 6: Stan Gry i Progresja Fal

Cel: Wdrożenie modułu zarządzania stanem rozgrywki (`game-state.js`), punktacji, automatycznego przejścia do kolejnej fali z szybszą formacją oraz weryfikacji warunków porażki (Game Over).

- [ ] **Zadanie 6.1: Moduł maszyny stanów i danych gry `game-state.js`**
  - **Plik do utworzenia:** `space_inv/public/js/game-state.js`
  - **Zależności:** `config.js`.
  - **Kontrakt API:**
    - Stany: `'START'`, `'PLAYING'`, `'WAVE_CLEARED'`, `'GAME_OVER'`.
    - Pola prywatne: `state`, `score`, `lives`, `wave`, `gameOverReason`.
    - `reset()`: ustawienie `state = 'START'`, `score = 0`, `lives = CONFIG.PLAYER.LIVES` (3), `wave = 1`, `gameOverReason = ''`.
    - `startNewGame()`: reset parametrów i przejście do `state = 'PLAYING'`.
    - `getState()` / `setState(newState)`.
    - `addScore(points)`: zwiększa wynik (np. +10 za każdego zestrzelonego obcego) i zwraca nową wartość.
    - `loseLife()`: zmniejsza liczbę żyć o 1; jeśli `lives <= 0`, przełącza stan na `'GAME_OVER'` z powodem `"Wszystkie życia utracone!"`.
    - `triggerInvasionDefeat()`: natychmiastowe przełączenie na `'GAME_OVER'` z powodem `"Najeźdźcy dotarli na Ziemię!"`.
    - `nextWave()`: inkrementuje numer fali `wave++`, zachowując zgromadzony wynik i liczbę pozostałych żyć.
    - `getData()`: zwraca niemutowalną kopię obiektu `{ score, lives, wave, state, gameOverReason }`.
  - **Kryterium walidacji:**
    - Wywołanie `loseLife()` przy 1 życiu zmienia stan na `GAME_OVER` i ustawia odpowiedni komunikat.
    - Wywołanie `nextWave()` zwiększa `wave` z 1 na 2 bez zerowania punktów i żyć.

- [ ] **Zadanie 6.2: Detekcja przełamania obrony przez formację w `formation.js`**
  - **Plik do modyfikacji:** `space_inv/public/js/formation.js`
  - **Kontrakt API:**
    - `hasInvadersReachedY(targetY)`: sprawdza, czy którykolwiek żywy najeźdźca osiągnął pozycję `invader.y + invader.height >= targetY`. Zwraca `boolean`.
  - **Kryterium walidacji:**
    - Zwraca `true`, gdy najniższy obcy dotknie linii poziomej gracza.

- [ ] **Zadanie 6.3: Integracja punktacji, fal i Game Over w `main.js`**
  - **Plik do modyfikacji:** `space_inv/public/js/main.js`
  - **Zależności:** `game-state.js`.
  - **Zakres prac:**
    - Zniszczenie najeźdźcy wywołuje `gameState.addScore(CONFIG.INVADERS.POINTS_PER_KILL)`.
    - Trafienie gracza wywołuje `gameState.loseLife()`.
    - Sprawdzanie przełamania: wywołanie `formation.hasInvadersReachedY(player.y)`. W razie spełnienia: `gameState.triggerInvasionDefeat()`.
    - Obsługa zwycięstwa fali: gdy `formation.isEmpty()`:
      - Przełączenie stanu na `'WAVE_CLEARED'`.
      - Odczekanie krótkiego interwału czasowego (np. 1.0 sekundy).
      - Wywołanie `gameState.nextWave()`.
      - Odnowienie osłon: `shield.init()`.
      - Wyczyszczenie aktywnych pocisków gracza i wroga.
      - Inicjalizacja nowej formacji: `formation.init(gameState.getData().wave)` z bazową prędkością wyższą o 10%.
      - Powrót do stanu `'PLAYING'`.
  - **Kryterium walidacji:**
    - Każde zestrzelenie obcego zwiększa wynik o 10 punktów.
    - Pokonanie wszystkich 55 obcych odnawia pełną formację z zauważalnie szybszym ruchem (+10%) oraz w pełni zregenerowane 4 osłony; punkty i życia nie resetują się.
    - Utrata 3 żyć lub zejście wroga na wysokość gracza natychmiast kończy rozgrywkę.

---

## Faza 7: Interfejs i Restart

Cel: Stworzenie graficznego interfejsu użytkownika w Canvasie (HUD, ekran powitalny, ekran Game Over) oraz obsługa natychmiastowego restartu gry do fali 1.

- [ ] **Zadanie 7.1: Moduł renderowania interfejsu `ui.js`**
  - **Plik do utworzenia:** `space_inv/public/js/ui.js`
  - **Zależności:** `config.js`.
  - **Kontrakt API:**
    - `renderHUD(ctx, stateData)`:
      - Rysuje na samej górze planszy (`y = 25`):
        - Po lewej: `SCORE: <score>`
        - Po środku: `WAVE: <wave>`
        - Po prawej: `LIVES: <lives>` (wraz z małymi ikonami statków lub tekstem).
    - `renderStartScreen(ctx)`:
      - Rysuje retro tytuł `SPACE INVADERS`.
      - Instrukcję sterowania: `A / D lub STRZAŁKI - RUCH`, `SPACJA - STRZAŁ`.
      - Pulsujący tekst zachęty: `NACIŚNIJ SPACJĘ, ABY ROZPOCZĄĆ`.
    - `renderGameOverScreen(ctx, stateData)`:
      - Rysuje czerwony napis `GAME OVER`.
      - Wyświetla powód porażki (`stateData.gameOverReason`).
      - Wyświetla podsumowanie: ostateczny wynik punktowy oraz osiągniętą falę.
      - Instrukcję restartu: `NACIŚNIJ KLAWISZ 'R', ABY ZAGRAĆ PONOWNIE`.
  - **Kryterium walidacji:**
    - Wszystkie teksty mieszczą się w oknie 800x600 px i są poprawnie wycentrowane.
    - Rysowanie ekranów nie generuje błędów w kontekście Canvas.

- [ ] **Zadanie 7.2: Obsługa przejść stanów i restartu w `main.js`**
  - **Plik do modyfikacji:** `space_inv/public/js/main.js`
  - **Zależności:** `ui.js`, `input.js`.
  - **Zakres prac:**
    - Dopasowanie pętli renderowania:
      - W stanie `'START'`: renderowanie `ui.renderStartScreen(ctx)`. Reakcja na `input.isShootPressed()` -> rozpoczęcie gry (`gameState.startNewGame()`).
      - W stanie `'PLAYING'`: renderowanie bytów gry oraz `ui.renderHUD(ctx, gameState.getData())`.
      - W stanie `'GAME_OVER'`: renderowanie zamrożonej planszy lub tła oraz nakładki `ui.renderGameOverScreen(ctx, gameState.getData())`. Reakcja na `input.isRestartPressed()` -> pełny restart partii.
    - Procedura restartu: wyzerowanie stanu w `gameState.startNewGame()`, reset pozycji gracza `player.reset()`, odnowienie osłon `shield.init()`, wyczyszczenie pocisków, inicjalizacja formacji `formation.init(1)`.
  - **Kryterium walidacji:**
    - Gra startuje w ekranie początkowym. Wciśnięcie Spacji rozpoczyna rozgrywkę.
    - Po przegranej (ekran Game Over), naciśnięcie klawisza `R` natychmiast resetuje rozgrywkę do Fali 1 z 3 życiami i 0 punktami.

---

## Faza 8: Końcowa Weryfikacja i Testy Zgodności z Wymaganiami

Cel: Kompleksowy audyt gry pod kątem spełnienia wszystkich User Stories (US-01 do US-07) oraz wymagań niefunkcjonalnych z `requirements.md`.

- [ ] **Test US-01: Sterowanie działem gracza**
  - Klawisze Lewo/Prawo oraz A/D przesuwają statek płynnie.
  - Statek nie może przekroczyć lewej krawędzi (`x >= 0`) ani prawej krawędzi (`x + width <= 800`).

- [ ] **Test US-02: Strzelanie z limitem pocisków**
  - Wciśnięcie Spacji emituje pocisk lecący pionowo w górę.
  - Nie da się wystrzelić więcej niż 3 pocisków naraz na ekranie.
  - Zniszczenie wroga lub opuszczenie ekranu natychmiast zwalnia slot.

- [ ] **Test US-03: Odpieranie formacji najeźdźców**
  - Na starcie pojawia się dokładnie 55 obcych w siatce 5 rzędów × 11 kolumn.
  - Formacja odbija się od ścian i obniża o stały krok.
  - Trafienie wroga pociskiem gracza usuwa go z ekranu i dodaje dokładnie +10 punktów do wyniku.

- [ ] **Test US-04: Osłony taktyczne**
  - Na planszy znajdują się 4 bunkry blokujące pociski gracza i wroga.
  - Każdy bunkier znika po dokładnie 3 trafieniach, zmieniając wygląd przy każdym trafieniu.

- [ ] **Test US-05: System obrażeń i nietykalność**
  - Gracz rozpoczyna partię z 3 życiami; trafienie odejmuje 1 życie.
  - Po trafieniu statek gracza migocze przez 2 sekundy i nie otrzymuje obrażeń od kolejnych pocisków.

- [ ] **Test US-06: Nowe fale i skalowanie trudności**
  - Zniszczenie ostatniego wroga przełącza do kolejnej fali.
  - Punkty i pozostałe życia zostają zachowane.
  - Osłony odnawiają się do stanu początkowego (pełne 3 HP).
  - Formacja porusza się o 10% szybciej niż w fali poprzedniej.

- [ ] **Test US-07: Koniec gry i natychmiastowy restart**
  - Utrata 3 żyć wyświetla ekran Game Over z powodem "Wszystkie życia utracone!".
  - Dotarcie formacji obcych do linii gracza natychmiast kończy grę z powodem "Najeźdźcy dotarli na Ziemię!".
  - Wciśnięcie klawisza `R` przywraca grę do Fali 1 z czystym stanem początkowym.

- [ ] **Test NFR-01: Płynność i niezależność od FPS**
  - Gra utrzymuje stabilne ~60 FPS bez wycieków pamięci i zacięć garbage collectora.
  - Prędkość obiektów zależy wyłącznie od parametru `dt` (przetestowane symulowane spadki klatkażu).

- [ ] **Test NFR-02: Brak zależności zewnętrznych npm**
  - W `package.json` sekcja `dependencies` jest pusta lub brak zewnętrznych pakietów.
  - Serwer uruchamia się i działa bez konieczności uruchamiania `npm install`.
