# Bomberman - Wymagania Funkcjonalne

## Opis Gry
Klasyczna gra akcji/łamigłówki, w której gracz umieszcza bomby, niszczy bloki i unika wrogów na mapie w siatce.

## Wymagania Funkcjonalne

### 1. Gracz (Bomberman)
- Poruszanie się po siatce (grid-based movement)
- Sterowanie: WASD lub strzałki
- Gracz może umieścić bombę na swoim obecnym polu (klawisz spacja)
- Gracz ma ograniczoną liczbę bomb (np. 1-2 jednocześnie)
- Po wybuchu bomby, licznik bomb się odnawia
- Gracz ma 3 punkty życia
- Trafienie przez wybuch lub wroga odejmuje 1 życie

### 2. Mapa i Bloki
- Mapa jako siatka (np. 13x13 pól)
- Typy pól:
  - **Pusta przestrzeń:** Gracz i wrogowie mogą się poruszać
  - **Niezniszczalne ściany:** Blokują ruch i wybuchy (np. co drugie pole na krawędziach)
  - **Zniszczalne bloki:** Mogą być zniszczone wybuchem, blokują ruch
- Mapa generowana na początku gry (częściowo losowe rozmieszczenie bloków)

### 3. Bomby i Wybuchy
- Bomba umieszczana na polu gracza
- Bomba wybucha po 3 sekundach (timer)
- Wybuch rozprzestrzenia się w 4 kierunkach (góra, dół, lewo, prawo) na określoną odległość (np. 2 pola)
- Wybuch niszczy zniszczalne bloki
- Wybuch zatrzymuje się na niezniszczalnej ścianie lub zniszczalnym bloku
- Wybuch może zdetonować inne bomby (reakcja łańcuchowa)
- Gracz i wrogowie w zasięgu wybuchu tracą życie

### 4. Wrogowie
- 3-5 wrogów poruszających się losowo lub z prostą AI
- Wrogowie nie mogą przechodzić przez ściany i bloki
- Kolizja z wrogiem odejmuje życie gracza
- Wrogowie gną w wyniku wybuchu
- Po zniszczeniu wroga, gracz zdobywa punkty (50 pkt)

### 5. Power-upy (Opcjonalnie)
Po zniszczeniu niektórych bloków (losowo 20% szans) wypadają power-upy:
- **Dodatkowa bomba:** Zwiększa limit bomb o 1
- **Większy zasięg:** Wybuchy sięgają dalej (+1 pole)
- **Szybkość:** Gracz porusza się szybciej
- Power-upy zbiera się przechodząc przez ich pole

### 6. System Punktacji
- Zniszczenie bloku: +10 punktów
- Zniszczenie wroga: +50 punktów
- Wyświetlanie wyniku na górze ekranu
- Wyświetlanie liczby pozostałych żyć

### 7. Warunki Gry
- **Wygrana:** Zniszczenie wszystkich wrogów na mapie
- **Przegrana:** Utrata wszystkich punktów życia
- Po wygranej/przegranej: komunikat i przycisk "Restart"
- (Opcjonalnie) Poziomy - każdy kolejny poziom ma więcej wrogów i trudniejszą mapę

## High-Level Plan Implementacji (Agile - każdy etap daje działającą funkcjonalność)

### Etap 1: Mapa + Ruchomy Gracz
**Co działa po tym etapie:** Widoczna mapa w siatce, gracz może się poruszać
1. Utworzyć strukturę plików (index.html, css/style.css, js/config.js, js/player.js, js/map.js, js/main.js)
2. Skonfigurować canvas i game loop
3. Stworzyć klasę `Map` - siatka z różnymi typami pól (puste, ściana, blok)
4. Narysować mapę (prostokąty w różnych kolorach dla różnych typów)
5. Stworzyć klasę `Player` - ruch po siatce (grid-based, nie pixel-perfect)
6. Kolizje: gracz nie może wejść na ścianę ani blok
7. **TEST:** Możesz poruszać graczemm po mapie, omijając przeszkody

### Etap 2: Umieszczanie Bomb + Timer
**Co działa po tym etapie:** Gracz może stawiać bomby, bomby wybuchają po czasie
1. Stworzyć klasę `Bomb` (js/bomb.js)
2. Umieszczanie bomby na polu gracza (spacja)
3. Limit 1 bomby jednocześnie
4. Bomba ma timer (3 sekundy) i wizualną animację (miganie lub odliczanie)
5. Po 3 sekundach bomba "wybucha" - na razie prosta animacja
6. Po wybuchu, licznik bomb gracza resetuje się (można postawić nową)
7. **TEST:** Możesz stawiać bomby, bomby wybuchają po 3 sekundach

### Etap 3: Mechanika Wybuchu + Niszczenie Bloków
**Co działa po tym etapie:** Wybuchy niszczą bloki, mają zasięg w 4 kierunkach
1. Stworzyć klasę `Explosion` (js/explosion.js)
2. Wybuch rozprzestrzenia się w 4 kierunkach (góra/dół/lewo/prawo) na 2 pola
3. Wybuch zatrzymuje się na niezniszczalnej ścianie
4. Zniszczalne bloki znikają po trafieniu wybuchem
5. Wizualizacja wybuchu (np. pomarańczowe linie/krzyż)
6. **TEST:** Bomby niszczą bloki, mapa się zmienia, można tworzyć przejścia

### Etap 4: Obrażenia Gracza + Punkty Życia
**Co działa po tym etapie:** Gracz może zginąć od własnych bomb
1. Wybuch sprawdza czy gracz jest w zasięgu
2. Jeśli tak - odejmuje 1 życie
3. Dodać system 3 żyć + wyświetlanie na ekranie
4. Krótka nietykalność po trafieniu (2 sekundy, miganie sprite'a)
5. Przy 0 życia: "GAME OVER" i zatrzymanie gry
6. **TEST:** Pełna mechanika bomb - ryzyko/nagroda, można przegrać

### Etap 5: Wrogowie + AI
**Co działa po tym etapie:** Wrogowie poruszają się, można ich zniszczyć lub od nich zginąć
1. Stworzyć klasę `Enemy` (js/enemy.js)
2. Prosta AI: ruch losowy w dozwolonych kierunkach
3. Dodać 3 wrogów na mapie
4. Kolizja gracz vs wróg = odjęcie życia graczu
5. Wybuch niszczy wrogów (znikają z mapy)
6. Dodać punktację: +50 za wroga, +10 za blok
7. Warunek wygranej: wszyscy wrogowie zniszczeni
8. **TEST:** Pełna pętla gry - cel, wyzwanie, możliwość wygrania

### Etap 6: Power-upy
**Co działa po tym etapie:** Dodatkowa głębia rozgrywki, progresja gracza
1. Stworzyć klasę `PowerUp` (js/powerup.js)
2. 20% szans na power-up po zniszczeniu bloku
3. Typy: dodatkowa bomba, większy zasięg, szybkość
4. Zbieranie power-upów przez przejście po polu
5. Power-upy modyfikują statystyki gracza
6. **TEST:** Gra z rozwojem postaci w trakcie rozgrywki

### Etap 7: Polish + Poziomy (Opcjonalnie)
**Co działa po tym etapie:** Dopracowana gra z progresją poziomów
1. Ekran startowy ("Naciśnij START")
2. Lepszy ekran wygranej/przegranej z wynikiem
3. Przycisk "Restart" / "Następny poziom"
4. (Opcjonalnie) System poziomów - kolejne mapy z większą liczbą wrogów
5. (Opcjonalnie) Lepsza AI wrogów - podążanie za graczem
6. (Opcjonalnie) Efekty dźwiękowe (wybuch, zbieranie power-upów)
7. **TEST:** Pełna, dopracowana gra gotowa do rozgrywki

### Struktura Modułów
```
js/
├── config.js          # Stałe (rozmiar siatki, czas wybuchu, prędkości)
├── map.js             # Klasa mapy + generowanie poziomu
├── player.js          # Klasa gracza + sterowanie
├── bomb.js            # Klasa bomby + timer
├── explosion.js       # Klasa wybuchu + rozprzestrzenianie
├── enemy.js           # Klasa wroga + AI
├── powerup.js         # Klasa power-upów
├── collision.js       # Detekcja kolizji (grid-based)
├── game-state.js      # Stan gry (wynik, życia, level)
├── ui.js              # Renderowanie UI
└── main.js            # Game loop i orkiestracja
```

### Uwagi Implementacyjne
- **Siatka:** Wszystko oparte o grid - pozycje jako `{gridX, gridY}`, nie `{x, y}` w pikselach
- **Ruch grid-based:** Gracz przesuwa się o całe pole (smooth transition lub instant)
- **Wybuch - algorytm:**
  ```
  dla każdego kierunku (góra, dół, lewo, prawo):
    dla i = 1 do zasięg:
      sprawdź pole w kierunku
      jeśli ściana niezniszczalna: przerwij
      jeśli blok zniszczalny: zniszcz i przerwij
      jeśli puste: kontynuuj
      sprawdź czy gracz/wróg na polu: zadaj obrażenia
  ```
- **Reakcja łańcuchowa:** Wybuch sprawdza czy na polu jest inna bomba → natychmiast ją detonuje
- **Mapa startowa:** Pozostawić wolne pola wokół gracza (3x3) żeby nie zginął od razu
