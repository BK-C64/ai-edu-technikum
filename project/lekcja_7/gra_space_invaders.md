# Space Invaders - Wymagania Funkcjonalne

## Opis Gry
Klasyczna gra arcade, w której gracz kontroluje statek kosmiczny i broni Ziemi przed falami najeźdźców z kosmosu.

## Wymagania Funkcjonalne

### 1. Gracz
- Statek gracza porusza się w poziomie na dole ekranu (sterowanie: strzałki lewo/prawo lub A/D)
- Gracz może strzelać pociskami w górę (sterowanie: spacja)
- Gracz może mieć maksymalnie 3 pociski jednocześnie na ekranie
- Statek gracza ma 3 punkty życia (lives)
- Po trafieniu przez wroga gracz traci życie i następuje krótka nietykalność (2 sekundy)
- Gra kończy się, gdy gracz straci wszystkie życia

### 2. Przeciwnicy (Najeźdźcy)
- Najeźdźcy ustawieni są w siatce 5 rzędów x 11 kolumn
- Cała formacja porusza się poziomo w jednym kierunku
- Po dojściu do krawędzi ekranu, wszyscy przesuwają się wiersz w dół i zmieniają kierunek
- Najeźdźcy losowo strzelają pociskami w dół
- Po zniszczeniu najeźdźcy znika ze świata gry
- Zniszczenie najeźdźcy dodaje punkty (10 punktów)

### 3. Osłony (Shields)
- 4 osłony rozmieszczone u dołu ekranu między graczem a najeźdźcami
- Osłony blokują pociski (zarówno gracza jak i wrogów)
- Osłony mają punkty wytrzymałości (3 trafienia)
- Po wyczerpaniu wytrzymałości osłona znika

### 4. System Strzałów
- Pociski gracza niszczą najeźdźców po trafieniu
- Pociski najeźdźców niszczą gracza po trafieniu
- Pociski znikają po zderzeniu z przeciwnikiem, graczem lub osłoną
- Pociski znikają po wyjściu poza ekran

### 5. Poziomy Trudności
- Po zniszczeniu wszystkich najeźdźców, pojawia się nowa, szybsza fala
- Z każdą falą prędkość najeźdźców wzrasta o 10%
- Liczba życia gracza przenosi się na kolejny poziom

### 6. Interfejs Użytkownika
- Wyświetlanie aktualnego wyniku (score) na górze ekranu
- Wyświetlanie liczby pozostałych istnień gracza
- Wyświetlanie aktualnego poziomu/fali
- Komunikat "GAME OVER" po przegranej
- Przycisk "Restart" po zakończeniu gry

### 7. Warunki Końcowe
- Gracz wygrywa rundę, gdy zniszczy wszystkich najeźdźców
- Gracz przegrywa, gdy:
  - Straci wszystkie życia
  - Najeźdźcy dotrą do dolnej krawędzi ekranu (na poziomie gracza)

## High-Level Plan Implementacji (Agile - każdy etap daje działającą funkcjonalność)

### Etap 1: Minimalny Playable Prototype - Ruchomy Gracz
**Co działa po tym etapie:** Gracz widzi statek, może nim poruszać w lewo/prawo
1. Utworzyć strukturę plików (index.html, css/style.css, js/config.js, js/player.js, js/main.js)
2. Skonfigurować canvas i podstawową pętlę gry (game loop)
3. Stworzyć klasę `Player` - prostokąt na dole ekranu
4. Zaimplementować ruch gracza w poziomie (strzałki/WASD)
5. **TEST:** Możesz poruszać statkiem po ekranie

### Etap 2: Strzelanie
**Co działa po tym etapie:** Gracz może strzelać pociskami, widzi je lecące w górę
1. Stworzyć klasę `Bullet` (js/bullet.js)
2. Dodać strzelanie na spację - pociski lecą w górę
3. Limit 3 pocisków jednocześnie
4. **TEST:** Możesz strzelać, pociski znikają na górze ekranu

### Etap 3: Najeźdźcy + Prosta Kolizja
**Co działa po tym etapie:** Są wrogowie, można ich zestrzelić
1. Stworzyć klasę `Invader` i `InvaderFormation` (js/invader.js, js/formation.js)
2. Narysować siatkę najeźdźców (5x11)
3. Dodać ruch formacji (poziomo + w dół na krawędzi)
4. Dodać prostą detekcję kolizji (js/collision.js): pocisk gracza niszczy najeźdźcę
5. **TEST:** Możesz zestrzelić najeźdźców, znikają po trafieniu

### Etap 4: Wrogowie Strzelają + Punkty Życia Gracza
**Co działa po tym etapie:** Wrogowie strzelają, gracz może umrzeć, gra się kończy
1. Najeźdźcy losowo strzelają w dół
2. Dodać kolizję: pocisk wroga vs gracz
3. Dodać system życia gracza (3 lives) + nietykalność
4. Wyświetlić liczbę żyć na ekranie (prosty tekst)
5. Warunek końca gry: 0 żyć → "GAME OVER"
6. **TEST:** Pełna pętla gry - można wygrać (zabić wszystkich) lub przegrać (stracić życia)

### Etap 5: Osłony
**Co działa po tym etapie:** Osłony chronią gracza, degradują się po trafieniach
1. Stworzyć klasę `Shield` (js/shield.js)
2. Dodać 4 osłony między graczem a wrogami
3. Kolizje: pociski (gracza i wrogów) vs osłony
4. System wytrzymałości - osłona znika po 3 trafieniach
5. **TEST:** Możesz schować się za osłonami, osłony stopniowo znikają

### Etap 6: System Punktacji + Poziomy
**Co działa po tym etapie:** Pełna gra z punktacją i rosnącą trudnością
1. Dodać system punktów (10 za najeźdźcę)
2. Wyświetlać score i numer poziomu na górze
3. Po zniszczeniu wszystkich - nowa fala (szybsza o 10%)
4. Warunek przegranej: najeźdźcy docierają do gracza
5. **TEST:** Gra ma pełną progresję, każdy poziom trudniejszy

### Etap 7: Polish + Restart
**Co działa po tym etapie:** Gotowa gra z UI i możliwością restartu
1. Dodać ekran startowy (kliknij żeby zacząć)
2. Lepszy ekran "GAME OVER" z wynikiem
3. Przycisk "Restart" - reset gry
4. (Opcjonalnie) Proste efekty dźwiękowe/wizualne przy trafieniach
5. **TEST:** Pełna, zbalansowana gra gotowa do rozgrywki

### Struktura Modułów
```
js/
├── config.js          # Stałe (prędkości, rozmiary, kolory)
├── player.js          # Klasa gracza
├── invader.js         # Klasa pojedynczego najeźdźcy
├── formation.js       # Zarządzanie formacją wrogów
├── bullet.js          # Klasa pocisku
├── shield.js          # Klasa osłony
├── collision.js       # Detekcja kolizji
├── game-state.js      # Stan gry (score, level, lives)
├── ui.js              # Renderowanie UI
└── main.js            # Główna pętla gry i orkiestracja
```
