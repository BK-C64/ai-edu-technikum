# Tower Defense - Wymagania Funkcjonalne

## Opis Gry
Strategiczna gra obronna, w której gracz buduje wieże wzdłuż ścieżki, aby powstrzymać fale wrogów przed dotarciem do bazy.

## Wymagania Funkcjonalne

### 1. Mapa i Ścieżka
- Mapa podzielona na siatkę (np. 20x15 pól)
- Predefiniowana ścieżka od startu do mety (bazy gracza)
- Ścieżka może być prosta lub kręta (np. kształt S lub L)
- Pola poza ścieżką to miejsca, gdzie można budować wieże
- Baza gracza na końcu ścieżki (ma punkty życia, np. 20 HP)

### 2. Wrogowie
- Wrogowie pojawiają się falami na początku ścieżki
- Wrogowie podążają po ścieżce w stronę bazy
- Każdy wróg ma:
  - Punkty życia (HP)
  - Prędkość poruszania
  - Wartość złota za zniszczenie
- Typy wrogów (opcjonalnie):
  - **Podstawowy:** Średnie HP, średnia prędkość (10 HP, 1 gold)
  - **Szybki:** Niskie HP, wysoka prędkość (5 HP, 2 gold)
  - **Mocny:** Wysokie HP, niska prędkość (25 HP, 3 gold)
- Wróg dotarł do bazy = baza traci HP (np. -1 za każdego wroga)

### 3. Wieże
- Gracz może budować wieże na pustych polach (nie na ścieżce)
- Każda wieża ma:
  - Koszt budowy (np. 10 złota)
  - Zasięg ataku (okrąg wokół wieży)
  - Szybkostrzelność (czas między strzałami, np. 1 strzał/sekundę)
  - Obrażenia (np. 5 damage)
- Typy wież (opcjonalnie):
  - **Podstawowa:** Tania, mały zasięg (10 gold, zasięg 2 pola)
  - **Snajperska:** Droga, duży zasięg, wolne strzały (25 gold, zasięg 4 pola)
  - **Szybkostrzelna:** Średnia cena, szybkie strzały (15 gold, szybkie)
- Wieża automatycznie atakuje pierwszego wroga w zasięgu

### 4. System Walki
- Wieża wykrywa wrogów w swoim zasięgu
- Wieża wybiera cel (np. pierwszy wróg na ścieżce lub najbliższy)
- Wieża strzela pociskiem w stronę wroga
- Pocisk leci do wroga (animacja) i zadaje obrażenia
- Wróg traci HP, jeśli HP <= 0 → wróg ginie
- Za zniszczenie wroga gracz otrzymuje złoto

### 5. Zasoby i Ekonomia
- Gracz zaczyna z określoną ilością złota (np. 50 gold)
- Złoto używane do budowy wież
- Zniszczenie wroga daje złoto
- Wyświetlanie aktualnej ilości złota na ekranie
- Nie można budować wieży bez wystarczającego złota

### 6. Fale Wrogów
- Gra składa się z fal (wave) wrogów
- Każda fala to grupa wrogów pojawiających się jeden po drugim
- Przerwa między falami (np. 10 sekund) - czas na budowę wież
- Z każdą falą wrogowie są trudniejsi (więcej HP, więcej wrogów)
- Wyświetlanie numeru fali (np. "Fala 3/10")
- Przycisk "Rozpocznij falę" lub automatyczny start po przerwie

### 7. Interfejs Użytkownika
- Wyświetlanie HP bazy (np. "Baza: 18/20 HP")
- Wyświetlanie ilości złota (np. "Złoto: 75")
- Wyświetlanie numeru fali (np. "Fala 3")
- Menu budowy wież - kliknięcie na pole pokazuje opcje wież
- Wyświetlanie zasięgu wieży po najechaniu myszą (podgląd)
- (Opcjonalnie) Pasek HP nad wrogami
- (Opcjonalnie) Przycisk pauzy

### 8. Warunki Gry
- **Wygrana:** Przetrwanie wszystkich fal (np. 10 fal)
- **Przegrana:** Baza traci wszystkie HP (0 HP)
- Ekran końcowy z wynikiem (liczba zniszczonych wrogów, przetrwane fale)
- Przycisk "Restart"

## High-Level Plan Implementacji (Agile - każdy etap daje działającą funkcjonalność)

### Etap 1: Mapa + Ścieżka
**Co działa po tym etapie:** Widoczna mapa ze ścieżką i polami do budowy
1. Utworzyć strukturę plików (index.html, css/style.css, js/config.js, js/map.js, js/main.js)
2. Skonfigurować canvas i game loop
3. Stworzyć klasę `Map` - siatka pól
4. Zdefiniować ścieżkę jako lista punktów: `path = [{x:0,y:5}, {x:5,y:5}, {x:5,y:10}, ...]`
5. Narysować mapę: ścieżka (brązowa), pola do budowy (zielone), baza (czerwony kwadrat)
6. **TEST:** Widzisz kompletną mapę ze ścieżką od startu do bazy

### Etap 2: Wrogowie Poruszający Się Po Ścieżce
**Co działa po tym etapie:** Wrogowie idą po ścieżce do bazy
1. Stworzyć klasę `Enemy` (js/enemy.js)
2. Wróg podąża po punktach ścieżki (pathfinding: poruszanie się między punktami)
3. Dodać kilku wrogów na start ścieżki
4. Wrogowie animacja ruchu wzdłuż ścieżki
5. Wróg dotarł do bazy → znika z mapy
6. **TEST:** Wrogowie maszerują od startu do bazy

### Etap 3: Budowanie Wież + Mechanika Strzałów
**Co działa po tym etapie:** Można budować wieże, wieże strzelają do wrogów
1. Stworzyć klasę `Tower` (js/tower.js)
2. Kliknięcie na puste pole otwiera menu budowy
3. Wybór wieży → wieża pojawia się na polu
4. Wieża wykrywa wrogów w zasięgu (sprawdzanie dystansu)
5. Wieża strzela co X sekund (timer)
6. Stworzyć klasę `Projectile` (js/projectile.js) - pocisk leci do wroga
7. Pocisk trafia wroga → zadaje obrażenia (na razie wróg od razu ginie)
8. **TEST:** Możesz budować wieże, wieże niszczą wrogów

### Etap 4: System HP Wrogów + Złoto
**Co działa po tym etapie:** Wrogowie mają HP, za zabicie dostaje się złoto
1. Dodać system HP do wrogów (np. 10 HP)
2. Pocisk zadaje obrażenia (np. 5 damage), nie zabija od razu
3. Pasek HP nad wrogiem (opcjonalnie)
4. Wróg ginie gdy HP <= 0
5. Dodać system złota: start z 50 gold
6. Za zniszczenie wroga: +2 gold (lub więcej)
7. Budowa wieży kosztuje złoto (np. 10 gold)
8. Blokada budowy jeśli nie ma dość złota
9. Wyświetlać złoto na ekranie
10. **TEST:** Pełny cykl ekonomii - zarabiasz złoto, budujesz więcej wież

### Etap 5: HP Bazy + Przegrana
**Co działa po tym etapie:** Baza może zginąć, gra ma warunek przegranej
1. Dodać HP do bazy (np. 20 HP)
2. Wróg dociera do bazy → baza traci 1 HP, wróg znika
3. Wyświetlać HP bazy na ekranie
4. Przy HP = 0: "PRZEGRANA!" i zatrzymanie gry
5. **TEST:** Gra ma cel - obrona bazy, możliwość przegranej

### Etap 6: System Fal
**Co działa po tym etapie:** Gra z falami wrogów, progresja trudności
1. Stworzyć klasę `WaveManager` (js/wave-manager.js)
2. Definicja fal: fala 1 = 5 wrogów, fala 2 = 8 wrogów (trudniejszych), etc.
3. Wrogowie pojawiają się falami (np. co 2 sekundy nowy wróg w fali)
4. Przerwa między falami (10 sekund)
5. Wyświetlać "Fala X" i czas do następnej
6. Przycisk "Rozpocznij następną falę" (opcjonalnie)
7. Po 10 falach: "WYGRANA!"
8. **TEST:** Pełna gra z progresją i warunkiem wygranej

### Etap 7: Różne Typy Wież i Wrogów
**Co działa po tym etapie:** Większa głębia strategiczna, różnorodność
1. Dodać 2-3 typy wież (podstawowa, snajperska, szybkostrzelna)
2. Różne statystyki: koszt, zasięg, damage, prędkość
3. Menu wyboru wieży pokazuje wszystkie typy
4. Dodać 2-3 typy wrogów (podstawowy, szybki, mocny)
5. Fale zawierają mix różnych typów wrogów
6. **TEST:** Gra wymaga strategii - wybór odpowiednich wież na wrogów

### Etap 8: Polish + UI + Podgląd Zasięgu
**Co działa po tym etapie:** Dopracowana, przyjemna gra
1. Podgląd zasięgu wieży przy najechaniu myszą (okrąg zasięgu)
2. Lepsze efekty wizualne (strzały, eksplozje)
3. Wyświetlanie statystyk wieży po kliknięciu (zasięg, damage, koszt)
4. Ekrany start/przegrana/wygrana z statystykami
5. Przycisk "Restart"
6. (Opcjonalnie) Możliwość sprzedania wieży (zwrot 50% złota)
7. (Opcjonalnie) Efekty dźwiękowe
8. **TEST:** Gotowa, dopracowana gra tower defense

### Struktura Modułów
```
js/
├── config.js          # Stałe (rozmiary, ceny, statystyki)
├── map.js             # Klasa mapy + ścieżka
├── enemy.js           # Klasa wroga + ruch po ścieżce
├── tower.js           # Klasa wieży + detekcja celów
├── projectile.js      # Klasa pocisku
├── wave-manager.js    # Zarządzanie falami
├── game-state.js      # Stan gry (złoto, HP bazy, fala)
├── ui.js              # Renderowanie UI + menu budowy
├── collision.js       # Detekcja zasięgu wież
└── main.js            # Game loop i orkiestracja
```

### Uwagi Implementacyjne
- **Pathfinding:** Prosta interpolacja między punktami ścieżki
  ```javascript
  moveAlongPath(enemy, path, speed) {
    targetPoint = path[enemy.currentPathIndex]
    moveTowards(targetPoint)
    if (reached(targetPoint)) enemy.currentPathIndex++
  }
  ```
- **Zasięg wieży:** Dystans euklidesowy: `distance = sqrt((tx-ex)^2 + (ty-ey)^2)`
- **Wybór celu:** Wieża wybiera pierwszego (najbliższego bazy) wroga w zasięgu
- **Pociski:** Mogą być instant (hitscan) lub z animacją (lecą przez czas)
- **Ekonomia:** Balansowanie: koszt wież vs złoto z wrogów vs trudność fal
