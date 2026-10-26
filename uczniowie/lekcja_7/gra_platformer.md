# Platformer 2D - Wymagania Funkcjonalne

## Opis Gry
Klasyczna gra platformowa z widokiem z boku, w której gracz skacze przez platformy, zbiera monety i unika wrogów, aby dotrzeć do mety.

## Wymagania Funkcjonalne

### 1. Postać Gracza
- Gracz porusza się w poziomie (lewo/prawo): A/D lub strzałki
- Gracz może skakać: spacja lub strzałka w górę
- Fizyka:
  - Grawitacja ciągnie postać w dół
  - Gracz może skakać tylko gdy stoi na platformie (nie w powietrzu)
  - Kontrola w powietrzu (może lekko korygować ruch podczas skoku)
- Gracz ma 3 punkty życia
- Postać animowana (opcjonalnie: sprite walking/jumping)

### 2. Poziom i Platformy
- Widok z boku (side-scrolling)
- Kamera podąża za graczem (scroll w prawo/lewo)
- Platformy:
  - Podstawowe platformy - można na nich stać
  - Ziemia/podłoga - nieprzekraczalna bariera na dole
  - (Opcjonalnie) Ruchome platformy - poruszają się w poziomie lub pionie
  - (Opcjonalnie) Platformy-pułapki - znikają po 1 sekundzie od nadepnięcia
- Poziom ma początek (spawn gracza) i koniec (meta - flaga lub drzwi)

### 3. Kolizje
- Gracz koliduje z platformami - może na nich stać
- Gracz koliduje z ścianami - nie może przez nie przejść
- Detekcja czy gracz stoi na platformie (może skakać) vs spada (nie może skakać)
- Kolizja z górą platformy - uderzenie głową zatrzymuje ruch w górę

### 4. Wrogowie
- 2-3 typy wrogów:
  - **Patrol:** Chodzi w lewo-prawo na platformie (zmienia kierunek na krawędzi)
  - **Latający:** Lata w określonym wzorze (np. góra-dół lub koło)
  - (Opcjonalnie) **Kolce:** Statyczne przeszkody na platformach
- Kolizja z wrogiem = strata życia
- (Opcjonalnie) Gracz może zabić wroga skacząc na niego z góry (jak w Mario)
- Po utracie życia - krótka nietykalność (2 sekundy, miganie)

### 5. Przedmioty do Zbierania
- **Monety:** Rozrzucone po poziomie, zbieranie dodaje punkty (+10)
- **Życie (serce):** Dodaje 1 punkt życia
- **Checkpoint:** Niewidoczny punkt kontrolny - respawn gracza po śmierci
- Przedmioty zbiera się przechodząc przez nie
- Wyświetlanie liczby zebranych monet

### 6. System Punktacji i Życia
- Wyświetlanie liczby żyć (3 serca na starcie)
- Wyświetlanie wyniku (zebrane monety)
- (Opcjonalnie) Timer - szybsze przejście = więcej punktów
- Po utracie wszystkich żyć: respawn na ostatnim checkpoincie lub restart poziomu

### 7. Meta Poziomu
- Na końcu poziomu znajduje się meta (flaga, drzwi, portal)
- Dotarcie do mety = ukończenie poziomu
- Ekran końcowy z wynikiem (czas, zebrane monety)
- (Opcjonalnie) Kolejne poziomy o rosnącej trudności

### 8. Interfejs Użytkownika
- HUD z informacjami:
  - Liczba żyć (ikony serc)
  - Liczba monet
  - (Opcjonalnie) Timer
- Komunikat "Level Complete!" po ukończeniu
- Ekran "Game Over" po utracie wszystkich żyć
- Przyciski: "Restart" / "Next Level"

## High-Level Plan Implementacji (Agile - każdy etap daje działającą funkcjonalność)

### Etap 1: Gracz + Grawitacja + Podstawowa Platforma
**Co działa po tym etapie:** Gracz spada, stoi na platformie, może chodzić
1. Utworzyć strukturę plików (index.html, css/style.css, js/config.js, js/player.js, js/main.js)
2. Skonfigurować canvas i game loop
3. Stworzyć klasę `Player` - prostokąt jako postać
4. Dodać fizykę: grawitacja (`vy += gravity`), aktualizacja pozycji
5. Stworzyć prostą platformę (prostokąt na dole ekranu)
6. Detekcja kolizji: gracz vs platforma (zatrzymanie spadania)
7. Ruch poziomy (A/D) - zmiana `vx`
8. **TEST:** Gracz spada grawitacją, stoi na platformie, chodzi w lewo/prawo

### Etap 2: Skakanie
**Co działa po tym etapie:** Gracz może skakać, pełna kontrola ruchu
1. Dodać mechanikę skoku: nadanie prędkości w górę (`vy = -jumpPower`)
2. Skakanie tylko gdy gracz stoi na platformie (zmienna `isOnGround`)
3. Kontrola w powietrzu - gracz może lekko zmieniać kierunek podczas skoku
4. **TEST:** Pełna kontrola - chodzenie, skakanie, poprawna fizyka

### Etap 3: Poziom z Wieloma Platformami + Kamera
**Co działa po tym etapie:** Poziom z przeszkodami, kamera śledzi gracza
1. Stworzyć klasę `Level` (js/level.js) - lista platform
2. Dodać wiele platform w różnych miejscach (stworzenie prostego poziomu)
3. Kolizje z wszystkimi platformami (iteracja po liście)
4. Kamera podążająca za graczem (offset rendering)
5. Poziom szerszy niż ekran - scrolling w prawo
6. **TEST:** Możesz przeskakiwać przez platformy, eksplorować poziom

### Etap 4: Wrogowie + Kolizje z Graczem
**Co działa po tym etapie:** Wrogowie stanowią zagrożenie, można stracić życie
1. Stworzyć klasę `Enemy` (js/enemy.js) - typu "patrol"
2. Wróg chodzi w lewo-prawo na platformie (zmienia kierunek na krawędzi)
3. Dodać 2-3 wrogów na poziomie
4. Kolizja gracz vs wróg = strata życia
5. Dodać system 3 żyć, wyświetlanie serc
6. Nietykalność po trafieniu (2 sekundy, miganie)
7. Przy 0 życia: "GAME OVER"
8. **TEST:** Gra z wyzwaniem - trzeba omijać wrogów, można przegrać

### Etap 5: Monety i Punktacja
**Co działa po tym etapie:** Gra z systemem zbieranek i punktów
1. Stworzyć klasę `Collectible` (js/collectible.js)
2. Rozrzucić monety po poziomie (np. 10 monet)
3. Kolizja gracz vs moneta = zbierz monetę, znika z poziomu
4. Licznik monet/punktów (+10 za monetę)
5. Wyświetlanie wyniku na górze ekranu
6. (Opcjonalnie) Bonus za zebranie wszystkich monet
7. **TEST:** Gra z celem zbierackiego - zwiększa replayability

### Etap 6: Meta Poziomu + Ukończenie
**Co działa po tym etapie:** Poziom ma koniec, można go ukończyć
1. Dodać metę na końcu poziomu (flaga, drzwi - specjalny obiekt)
2. Kolizja gracz vs meta = ukończenie poziomu
3. Zatrzymanie gry, komunikat "Level Complete!"
4. Ekran końcowy z wynikiem (zebrane monety, czas)
5. Przycisk "Restart" lub "Next Level"
6. **TEST:** Pełna pętla gry - od startu przez zbieranie do mety

### Etap 7: Checkpointy + Respawn
**Co działa po tym etapie:** Gracz nie zaczyna od początku po śmierci
1. Dodać checkpointy (niewidoczne lub z animacją, np. flaga)
2. Przejście przez checkpoint zapisuje pozycję
3. Po śmierci (jeśli są życia) - respawn na ostatnim checkpoincie
4. Reset monet/życia (opcjonalnie - balansowanie)
5. **TEST:** Łagodniejsza krzywa trudności, mniej frustracji

### Etap 8: Polish + Dodatkowe Mechaniki
**Co działa po tym etapie:** Dopracowana, różnorodna gra
1. Dodać więcej typów wrogów (latający, kolce)
2. (Opcjonalnie) Zabijanie wrogów skokiem z góry
3. (Opcjonalnie) Ruchome platformy
4. (Opcjonalnie) Platformy-pułapki (znikają)
5. Lepsze animacje postaci (sprite sheets dla chodzenia/skoku)
6. Efekty cząstek (zbieranie monet, śmierć wroga)
7. Parallax background (tło scrolluje wolniej niż poziom)
8. (Opcjonalnie) Drugi/trzeci poziom o większej trudności
9. Efekty dźwiękowe (skok, zbieranie, kolizja)
10. **TEST:** Pełnoprawna gra platformowa gotowa do zabawy

### Struktura Modułów
```
js/
├── config.js          # Stałe (grawitacja, prędkości, rozmiary)
├── player.js          # Klasa gracza + fizyka + kontrola
├── level.js           # Klasa poziomu + platformy + obiekty
├── platform.js        # Klasa platformy (statyczna/ruchoma)
├── enemy.js           # Klasa wroga + AI (patrol, latający)
├── collectible.js     # Klasa przedmiotów (monety, życie)
├── camera.js          # Kamera śledząca gracza
├── collision.js       # Detekcja kolizji AABB
├── game-state.js      # Stan gry (życia, wynik, checkpointy)
├── ui.js              # Renderowanie HUD i ekranów
└── main.js            # Game loop i orkiestracja
```

### Uwagi Implementacyjne
- **Fizyka (prosta integracja Eulera):**
  ```javascript
  // Aktualizacja pozycji
  vy += gravity * deltaTime
  vx *= friction
  x += vx * deltaTime
  y += vy * deltaTime
  ```
- **Kolizja AABB (Axis-Aligned Bounding Box):**
  ```javascript
  function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.w &&
           rect1.x + rect1.w > rect2.x &&
           rect1.y < rect2.y + rect2.h &&
           rect1.y + rect1.h > rect2.y
  }
  ```
- **Detekcja `isOnGround`:** Sprawdź czy gracz koliduje z platformą od dołu (stopy gracza dotykają góry platformy)
- **Kamera:** Offset rendering: `drawX = objX - camera.x`, kamera podąża za graczem z lekkim opóźnieniem
- **Patrol AI:** Wróg ma `direction` (1 lub -1), zmienia na krawędzi platformy:
  ```javascript
  if (enemy.x < platform.x || enemy.x > platform.x + platform.w) {
    enemy.direction *= -1
  }
  ```
- **Poziomy:** Można definiować jako JSON:
  ```javascript
  level1 = {
    platforms: [{x:0,y:500,w:200,h:20}, ...],
    enemies: [{x:300,y:400,type:'patrol'}, ...],
    collectibles: [{x:150,y:450,type:'coin'}, ...]
  }
  ```
