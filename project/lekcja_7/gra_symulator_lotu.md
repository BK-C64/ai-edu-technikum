# Symulator Lotu 2D - Wymagania Funkcjonalne

## Opis Gry
Side-scrolling symulator lotu, w którym gracz steruje samolotem, unika przeszkód i zbiera bonusy.

## Wymagania Funkcjonalne

### 1. Samolot Gracza
- Samolot porusza się automatycznie w prawo (stały scroll)
- Gracz kontroluje wysokość: strzałka w górę/spacja - wznoszenie, strzałka w dół - opadanie
- Samolot podlega prostej fizyce (grawitacja ciągnie w dół, silnik pcha w górę)
- Samolot może przechylać się (animacja rotacji) w zależności od kierunku ruchu
- Samolot nie może wyjść poza ekran (góra/dół ekranu to granice)

### 2. Świat Gry - Scrolling
- Tło scrolluje w lewo (efekt ruchu samolotu)
- Można użyć parallax scrolling (różne warstwy tła scrollują z różną prędkością)
- Świat generuje się proceduralnie - nowe przeszkody pojawiają się z prawej strony
- Grunt/ziemia na dole ekranu - kolizja z ziemią = koniec gry

### 3. Przeszkody
- **Góry/Wzgórza:** Wysokie tereny - trzeba je przelecieć
- **Chmury burzowe:** Statyczne lub ruchome - kolizja zmniejsza życie
- **Ptaki:** Latające przeszkody, poruszają się w górę-dół
- Przeszkody pojawiają się losowo z prawej strony ekranu
- Kolizja z przeszkodą zmniejsza życie (3 punkty życia)

### 4. Bonusy (Opcjonalnie)
- **Paliwo:** Ikona kanistra - uzupełnia paliwo
- **Naprawa:** Ikona klucza - dodaje 1 punkt życia
- **Punkty:** Monety lub gwiazdy - dodają punkty
- Bonusy scrollują razem z tłem

### 5. System Paliwa (Opcjonalnie dla większego wyzwania)
- Samolot ma pasek paliwa, który stopniowo się wyczerpuje
- Zbieranie bonusów paliwa uzupełnia
- Koniec paliwa = samolot opada (nie można wzbijać się)
- Gra kończy się, gdy samolot uderzy w ziemię

### 6. Interfejs Użytkownika
- Wyświetlanie wysokości (altitude) w metrach
- Wyświetlanie prędkości
- Pasek życia (3 serca lub pasek HP)
- Wyświetlanie wyniku/odległości przelotu
- (Opcjonalnie) Pasek paliwa
- Komunikat "CRASH!" po przegranej

### 7. Warunki Końcowe
- Gra kończy się, gdy:
  - Samolot uderzy w ziemię
  - Samolot straci wszystkie punkty życia
  - (Opcjonalnie) Zabraknie paliwa i samolot spadnie
- Możliwość restartu gry

## High-Level Plan Implementacji (Agile - każdy etap daje działającą funkcjonalność)

### Etap 1: Samolot + Podstawowa Fizyka
**Co działa po tym etapie:** Samolot leci, reaguje na grawitację i sterowanie
1. Utworzyć strukturę plików (index.html, css/style.css, js/config.js, js/plane.js, js/main.js)
2. Skonfigurować canvas i game loop
3. Stworzyć klasę `Plane` - prostokąt lub trójkąt jako samolot
4. Dodać prostą fizykę: grawitacja ciągnie w dół, spacja/strzałka w górę dodaje siłę w górę
5. Ograniczyć ruch do góry/dołu ekranu
6. **TEST:** Możesz sterować wysokością samolotu, nie wypada za ekran

### Etap 2: Scrolling Świata + Ziemia
**Co działa po tym etapie:** Tło się przesuwa, ziemia na dole, kolizja z ziemią kończy grę
1. Dodać tło scrollujące w lewo (stała prędkość)
2. Narysować ziemię/grunt na dole ekranu
3. Dodać prostą detekcję kolizji: samolot vs ziemia
4. Komunikat "CRASH!" i zatrzymanie gry po kolizji
5. **TEST:** Samolot leci, świat się scrolluje, crash przy uderzeniu w ziemię

### Etap 3: Pierwsze Przeszkody (Góry)
**Co działa po tym etapie:** Góry pojawiają się losowo, można je omijać lub uderzyć
1. Stworzyć klasę `Obstacle` (js/obstacle.js) - góra/wzgórze
2. Generować góry po prawej stronie ekranu w losowych odstępach
3. Scrollować góry w lewo razem z tłem
4. Dodać kolizję: samolot vs góra (zmniejsza życie)
5. Wyświetlić pasek życia (3 serca)
6. Gra kończy się przy 0 życia
7. **TEST:** Pełna gra - omijaj góry, strać życie przy kolizji, gra się kończy

### Etap 4: Więcej Typów Przeszkód
**Co działa po tym etapie:** Różnorodne przeszkody (chmury, ptaki) dla większego wyzwania
1. Dodać nowe typy przeszkód: chmury burzowe, ptaki
2. Ptaki - prostą animację lotu w górę-dół (sinus)
3. Różne punkty odjęcia życia dla różnych przeszkód (opcjonalnie)
4. **TEST:** Grywalna gra z różnorodnymi wyzwaniami

### Etap 5: System Punktacji + Bonusy
**Co działa po tym etapie:** Gra z pełnym systemem punktów i bonusów
1. Dodać licznik odległości/punktów (rośnie z czasem)
2. Stworzyć klasę `Bonus` (js/bonus.js)
3. Generować bonusy (paliwo, życie, punkty) losowo
4. Zbieranie bonusów: dodanie życia, punktów
5. Wyświetlać wynik na górze ekranu
6. **TEST:** Gra z systemem progresji i nagród

### Etap 6: (Opcjonalnie) System Paliwa
**Co działa po tym etapie:** Dodatkowy wymiar trudności - zarządzanie paliwem
1. Dodać pasek paliwa
2. Paliwo zmniejsza się z czasem
3. Przy braku paliwa - samolot nie reaguje na wznoszenie (tylko opada)
4. Bonusy paliwa uzupełniają pasek
5. **TEST:** Gra z zarządzaniem zasobami

### Etap 7: Polish + Efekty Wizualne
**Co działa po tym etapie:** Dopracowana, przyjemna wizualnie gra
1. Dodać parallax scrolling (2-3 warstwy tła)
2. Animacja rotacji samolotu (przechylanie przy wzlocie/opadaniu)
3. Efekty cząstek przy kolizji (eksplozja)
4. Ekran "GAME OVER" z wynikiem końcowym
5. Przycisk "Restart"
6. (Opcjonalnie) Prosta muzyka/efekty dźwiękowe
7. **TEST:** Gotowa, przyjemna do grania gra z dobrym feedbackiem wizualnym

### Struktura Modułów
```
js/
├── config.js          # Stałe (prędkości, grawitacja, kolory)
├── plane.js           # Klasa samolotu + fizyka
├── obstacle.js        # Klasa przeszkody (góry, chmury, ptaki)
├── bonus.js           # Klasa bonusów
├── background.js      # Scrolling tła (parallax)
├── collision.js       # Detekcja kolizji
├── game-state.js      # Stan gry (wynik, życie, paliwo)
├── ui.js              # Renderowanie UI (HUD)
└── main.js            # Game loop i orkiestracja
```

### Uwagi Implementacyjne
- **Fizyka:** Prosta fizyka Eulera: `velocity += gravity; y += velocity`
- **Generowanie przeszkód:** Timer lub sprawdzanie odległości ostatniej przeszkody
- **Parallax:** Wiele warstw canvas lub obrazów z różnymi prędkościami scrollu
- **Kolizja:** AABB (prostokąty) lub okręgi dla uproszczenia
