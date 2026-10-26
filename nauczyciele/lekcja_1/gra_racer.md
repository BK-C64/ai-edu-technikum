# Racer 2D (Top-Down) - Wymagania Funkcjonalne

## Opis Gry
Wyścigowa gra z widokiem z góry, w której gracz steruje samochodem, ściga się z przeciwnikami i unika wyjścia poza tor.

## Wymagania Funkcjonalne

### 1. Samochód Gracza
- Widok z góry (top-down) - samochód jako prostokąt lub sprite
- Sterowanie:
  - Strzałka w górę / W - przyspieszanie
  - Strzałka w dół / S - hamowanie/cofanie
  - Strzałka w lewo / A - skręt w lewo
  - Strzałka w prawo / D - skręt w prawo
- Prosta fizyka: przyspieszanie, tarcie, maksymalna prędkość
- Samochód obraca się w kierunku ruchu (rotacja sprite'a)

### 2. Tor Wyścigowy
- Tor zamknięty (okrąg, owalna lub bardziej skomplikowana trasa)
- Tor składa się z asfaltu (jezdnia) i trawy (poza torem)
- Jazda po trawie spowalnia samochód
- Linia mety/startu oznaczona na torze
- (Opcjonalnie) Bariery/ściany - kolizja zatrzymuje samochód

### 3. System Okrążeń
- Licznik okrążeń - przejechanie przez linię mety dodaje okrążenie
- Wyścig na 3 okrążenia (lub dowolna liczba)
- Wyświetlanie aktualnego okrążenia (np. "Okrążenie 2/3")
- Po ukończeniu ostatniego okrążenia - koniec wyścigu

### 4. Przeciwnicy AI (Opcjonalnie)
- 2-3 samochody AI poruszające się po torze
- Prosta AI: podąża za predefiniowanymi punktami na torze
- Przeciwnicy startują przed lub za graczem
- Wyświetlanie pozycji w wyścigu (1., 2., 3., 4.)

### 5. System Czasu
- Timer - mierzenie czasu przejazdu
- Wyświetlanie aktualnego czasu wyścigu
- Wyświetlanie najlepszego czasu okrążenia (lap time)
- Po zakończeniu wyścigu - pokazanie łącznego czasu

### 6. Checkpointy (Opcjonalnie, aby zapobiec oszustwom)
- Niewidoczne punkty kontrolne na torze
- Aby zaliczyć okrążenie, trzeba przejechać przez wszystkie checkpointy
- Zapobiega skracaniu trasy

### 7. Interfejs Użytkownika
- Wyświetlanie prędkości samochodu (km/h lub umowne jednostki)
- Licznik okrążeń ("2/3")
- Timer wyścigu
- (Opcjonalnie) Pozycja w wyścigu ("1st", "2nd")
- (Opcjonalnie) Mini-mapa toru
- Ekran końcowy z wynikiem ("Ukończono! Czas: 1:23.45")

### 8. Warunki Końcowe
- Wyścig kończy się po ukończeniu wszystkich okrążeń
- Wyświetlenie końcowego czasu i pozycji
- Przycisk "Restart" - nowy wyścig
- (Opcjonalnie) Tablica najlepszych czasów (local storage)

## High-Level Plan Implementacji (Agile - każdy etap daje działającą funkcjonalność)

### Etap 1: Samochód + Sterowanie + Fizyka
**Co działa po tym etapie:** Samochód jeździ po ekranie, reaguje na klawisze
1. Utworzyć strukturę plików (index.html, css/style.css, js/config.js, js/car.js, js/main.js)
2. Skonfigurować canvas i game loop
3. Stworzyć klasę `Car` - prostokąt reprezentujący samochód
4. Dodać fizykę: przyspieszanie (w górę), hamowanie (w dół), rotacja (lewo/prawo)
5. Prędkość wpływa na łatwość skręcania (im szybciej, tym mniejszy skręt)
6. **TEST:** Możesz jeździć samochodem po pustym ekranie, sterowanie jest responsywne

### Etap 2: Prosty Tor + Detekcja Powierzchni
**Co działa po tym etapie:** Tor jest widoczny, trawa spowalnia samochód
1. Stworzyć klasę `Track` (js/track.js)
2. Narysować prosty tor (np. okrąg) - asfalt (szary) + trawa (zielona)
3. Funkcja sprawdzania, na czym stoi samochód: `isOnGrass(x, y)`
4. Jeśli samochód na trawie - zmniejszyć prędkość maksymalną i dodać większe tarcie
5. **TEST:** Samochód jedzie szybciej na asfalcie, wolniej na trawie

### Etap 3: Linia Mety + System Okrążeń
**Co działa po tym etapie:** Można jeździć w okrążeniach, gra ma cel
1. Narysować linię mety na torze (np. biało-czarna linia)
2. Detekcja przejazdu przez linię mety
3. Licznik okrążeń - zwiększa się po przejechaniu linii
4. Wyświetlać "Okrążenie X/3" na ekranie
5. Po 3 okrążeniu - komunikat "Ukończono!" i zatrzymanie gry
6. **TEST:** Pełna pętla gry - możesz ukończyć wyścig na 3 okrążenia

### Etap 4: Timer + Pomiar Czasu
**Co działa po tym etapie:** Gra mierzy czas, można konkurować o najlepszy wynik
1. Dodać timer rozpoczynający się od startu
2. Wyświetlać aktualny czas wyścigu na górze ekranu (format: 1:23.45)
3. Zapisywać czas każdego okrążenia
4. Po zakończeniu - pokazać łączny czas i najlepsze okrążenie
5. **TEST:** Pełna gra wyścigowa z pomiarem czasu

### Etap 5: Checkpointy (zabezpieczenie przed oszustwami)
**Co działa po tym etapie:** Nie można skracać trasy, trzeba jechać po torze
1. Zdefiniować 3-4 niewidoczne checkpointy na torze
2. Śledzić, które checkpointy zostały odwiedzone
3. Okrążenie liczy się tylko jeśli przejechano przez wszystkie checkpointy
4. Reset checkpointów po zaliczeniu okrążenia
5. **TEST:** Gra wymusza uczciwe przejazdy

### Etap 6: Przeciwnicy AI (Opcjonalnie)
**Co działa po tym etapie:** Wyścig z botami, pozycja w rankingu
1. Stworzyć klasę `AICar` dziedziczącą po `Car`
2. Zdefiniować ścieżkę AI - lista punktów do podążania
3. AI podąża za kolejnymi punktami na torze
4. Dodać 2-3 samochody AI
5. System rankingowania - kto jest na której pozycji
6. Wyświetlać pozycję gracza ("2nd/4")
7. **TEST:** Wyścig z przeciwnikami, walka o pozycję

### Etap 7: Polish + UI + Restart
**Co działa po tym etapie:** Dopracowana gra z pełnym UI
1. Lepszy ekran startowy ("Naciśnij SPACJĘ aby rozpocząć")
2. Ekran końcowy z pełnymi statystykami (czas, pozycja, najlepsze okrążenie)
3. Przycisk "Restart" lub "Spróbuj ponownie"
4. (Opcjonalnie) Mini-mapa pokazująca pozycję na torze
5. (Opcjonalnie) Efekty dźwiękowe (silnik, skrzypienie opon)
6. (Opcjonalnie) Local storage - zapisywanie najlepszego czasu
7. **TEST:** Gotowa, dopracowana gra wyścigowa

### Struktura Modułów
```
js/
├── config.js          # Stałe (prędkości, przyspieszenie, tarcie)
├── car.js             # Klasa samochodu + fizyka
├── ai-car.js          # Klasa samochodu AI (opcjonalnie)
├── track.js           # Klasa toru + detekcja powierzchni
├── checkpoints.js     # System checkpointów
├── race-manager.js    # Zarządzanie wyścigiem (okrążenia, pozycje, czas)
├── collision.js       # Detekcja kolizji (opcjonalnie dla barier)
├── ui.js              # Renderowanie UI (HUD, ekrany)
└── main.js            # Game loop i orkiestracja
```

### Uwagi Implementacyjne
- **Fizyka samochodu:**
  - `velocity += acceleration * direction` (direction = 1 dla przodu, -1 dla tyłu)
  - `velocity *= friction` (np. 0.98 na asfalcie, 0.90 na trawie)
  - `angle += turnSpeed * (velocity / maxVelocity)` (wolniejszy skręt przy wyższej prędkości)
- **Detekcja lini mety:** Sprawdzić czy samochód przecina linię (poprzednia pozycja vs aktualna)
- **Tor:** Można narysować na canvasie lub użyć mapy bitowej (pixel-based collision)
- **AI ścieżka:** Tablica punktów [x, y] - AI jedzie do najbliższego jeszcze nieodwiedzonego punktu
