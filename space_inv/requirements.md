# Wymagania Projektowe: Space Invaders

## 1. Cel Gry i Założenia Edukacyjne

### 1.1. Wizja i Cel Rozgrywki

Space Invaders to klasyczna gra zręcznościowa z gatunku retro arcade fixed shooter. Gracz steruje działem obronnym (statkiem) poruszającym się u dołu ekranu i odpiera nacierającą z góry armię obcych najeźdźców, chroniąc się za strategicznie rozmieszczonymi bunkrami obronnymi.

- **Główny cel gracza:** Przetrwać jak najwięcej fal, wyeliminować wszystkich najeźdźców z formacji i zdobyć jak najwyższy wynik punktowy.
- **Wyzwanie:** Rosnąca prędkość formacji wraz z ubywaniem wrogów oraz z każdą kolejną falą, konieczność unikania ostrzału wrogów, zarządzanie ograniczoną pulą własnych pocisków (maks. 3) oraz degradacja osłon.

### 1.2. Założenia Edukacyjne

Gra służy jako praktyczny projekt dydaktyczny dla uczniów technikum informatycznego i programistycznego:

- Zrozumienie zasady działania pętli gry (ciągłe aktualizowanie stanu i renderowanie klatek).
- Zarządzanie stanami gry (menu startowe, aktywna rozgrywka, nietykalność, koniec gry, nowa fala).
- Matematyka gier 2D: detekcja kolizji obiektów, wektory prędkości i pozycji, ograniczenia krawędzi planszy.
- Zasady czystego podziału odpowiedzialności w procesie tworzenia oprogramowania.

---

## 2. Wymagania Funkcjonalne

### 2.1. Gracz i Sterowanie

- Statek gracza znajduje się na dole ekranu i porusza się wyłącznie w poziomie (oś pozioma).
- **Sterowanie ruchem:** Klawisze strzałek w lewo / w prawo lub klawisze `A` / `D`.
- **Granice planszy:** Statek nie może wyjechać poza lewą ani prawą krawędź pola gry.
- **Życia:** Gracz rozpoczyna partię z 3 punktami życia.
- **Obrażenia i nietykalność:** Trafienie pociskiem wroga odbiera 1 życie i aktywuje 2 sekundy tymczasowej nietykalności, sygnalizowanej wizualnym migotaniem statku.
- **Porażka:** Utrata ostatniego życia powoduje natychmiastowy koniec gry (Game Over).

### 2.2. Przeciwnicy (Formacja Najeźdźców)

- **Liczba i układ:** Formacja składa się z 55 najeźdźców ułożonych w siatkę 5 rzędów po 11 kolumn.
- **Ruch grupowy:**
  - Cała formacja przemieszcza się synchronicznie w jednym kierunku poziomym.
  - Po dotarciu skrajnego najeźdźcy do krawędzi ekranu cała formacja opuszcza się o stały krok w dół i zmienia kierunek marszu na przeciwny.
- **Ostrzał wroga:**
  - Najeźdźcy losowo wystrzeliwują pociski w dół w kierunku gracza.
  - Strzelać mogą wyłącznie jednostki znajdujące się na samym dole danej kolumny formacji (brak samopostrzału).
- **Eliminacja i punktacja:** Każde trafienie najeźdźcy pociskiem gracza niszczy wroga i dodaje 10 punktów do wyniku.

### 2.3. Osłony Obronne (Bunkry)

- Na planszy rozmieszczone są 4 osłony pomiędzy formacją najeźdźców a statkiem gracza.
- Osłony blokują pociski wystrzeliwane zarówno przez gracza, jak i przez przeciwników.
- Każda osłona ma wytrzymałość równą 3 trafieniom.
- Po każdym trafieniu osłona ulega widocznej degradacji wizualnej, a po trzecim trafieniu znika całkowicie.

### 2.4. System Strzałów i Interakcje

- **Pociski gracza:** Wystrzeliwane klawiszem Spacja, lecą pionowo w górę.
- **Limit pocisków:** Gracz może mieć maksymalnie 3 pociski jednocześnie w locie. Kolejny strzał jest możliwy dopiero po trafieniu lub wylocie pocisku poza ekran.
- **Pociski wrogów:** Lecą pionowo w dół.
- **Kolizje:**
  - Pocisk gracza niszczy najeźdźcę i znika.
  - Pocisk wroga rani gracza (chyba że gracz jest w stanie nietykalności) i znika.
  - Pocisk (dowolny) niszczy fragment osłony i znika.
  - Pociski znikają po opuszczeniu widocznego obszaru gry.

### 2.5. Poziomy Trudności i Kolejne Fale

- Zniszczenie wszystkich 55 najeźdźców kończy bieżącą falę sukcesem.
- Następuje automatyczne przejście do kolejnej fali:
  - Odnawiana jest pełna formacja 55 wrogów.
  - Prędkość marszu formacji wzrasta o 10% względem poprzedniej fali.
  - 4 osłony zostają odnowione do pełnej wytrzymałości.
  - Zgromadzone punkty i pozostałe życia gracza przenoszą się do nowej fali.

### 2.6. Ekrany Gry i Interfejs (HUD)

- **Górny pasek (HUD):** Bieżący wynik punktowy (Score), liczba pozostałych żyć (Lives), numer fali (Wave).
- **Ekran startowy:** Tytuł gry, krótka instrukcja sterowania, przycisk lub zachęta do rozpoczęcia rozgrywki (Spacja).
- **Ekran końca gry (Game Over):** Komunikat o przegranej, przyczyna porażki, ostateczny wynik punktowy, numer osiągniętej fali oraz możliwość natychmiastowego restartu.

### 2.7. Warunki Końca Gry i Restart

- **Porażka (Game Over)** następuje, gdy:
  1. Gracz straci wszystkie 3 życia.
  2. Najeźdźcy zstąpią na wysokość statku gracza (przełamanie obrony).
- **Restart:** Rozpoczęcie nowej gry natychmiast resetuje stan do fali 1 (3 życia, 0 punktów, nowa formacja, pełne osłony).

---

## 3. Wymagania Niefunkcjonalne

### 3.1. Środowisko Uruchomieniowe

- Gra uruchamiana jako aplikacja webowa serwowana przez lokalny serwer Node.js (wbudowany moduł HTTP, bez konieczności pobierania zewnętrznych zależności npm).
- Klient gry działa w dowolnej nowoczesnej przeglądarce internetowej (Chrome, Firefox, Edge, Safari).

### 3.2. Płynność i Wydajność

- Docelowy klatkaż: stabilne 60 FPS (nie mniej niż 30 FPS).
- Niezależność prędkości obiektów od częstotliwości odświeżania ekranu gracza.
- Błyskawiczny czas reakcji na wciśnięcie klawiszy (brak opóźnień sterowania).

### 3.3. Dostępność i Czytelność Edukacyjna

- Czysty kod z polskimi komentarzami ułatwiającymi analizę przez uczniów.
- Prosty, estetyczny retro styl graficzny (np. klasyczne kolory zieleni, bieli i czerni).

---

## 4. Historyjki Gracza (User Stories) i Kryteria Akceptacji

### US-01: Sterowanie działem gracza

- *Jako gracz chcę poruszać statkiem w lewo i w prawo za pomocą klawiatury,*  
  *aby omijać wrogie pociski i ustawiać się do strzału.*

  - [ ] Naciśnięcie strzałek lub klawiszy A/D płynnie przesuwa statek.
  - [ ] Statek zatrzymuje się na lewej i prawej krawędzi ekranu.

### US-02: Strzelanie z limitem pocisków

- *Jako gracz chcę strzelać pociskami w górę po naciśnięciu spacji,*  
  *aby niszczyć nacierających najeźdźców.*

  - [ ] Wciśnięcie spacji emituje pocisk z wierzchołka statku.
  - [ ] Gracz może mieć maksymalnie 3 pociski jednocześnie na ekranie.
  - [ ] Po trafieniu lub wylocie pocisku za ekran slot zostaje natychmiast zwolniony.

### US-03: Odpieranie formacji najeźdźców

- *Jako gracz chcę obserwować marsz siatki wrogów, która schodzi w dół po dojściu do krawędzi,*  
  *aby strategicznie eliminować zagrożenie przed dotarciem obcych na Ziemię.*

  - [ ] Formacja liczy 55 najeźdźców (5x11).
  - [ ] Dotarcie skrajnego wroga do ściany obniża formację i zmienia jej kierunek.
  - [ ] Zestrzelenie najeźdźcy usuwa go z planszy i dodaje 10 punktów do wyniku.

### US-04: Osłony taktyczne

- *Jako gracz chcę móc chronić się za bunkrami obronnymi,*  
  *aby przetrwać zmasowany ostrzał wrogów.*

  - [ ] Na planszy znajdują się 4 osłony blokujące pociski obu stron.
  - [ ] Każda osłona wytrzymuje 3 uderzenia, ulegając wizualnej degradacji przed zniszczeniem.

### US-05: System obrażeń i nietykalność

- *Jako gracz chcę po trafieniu przez wroga stracić życie i otrzymać chwilową nietykalność,*  
  *aby móc zareagować i nie zginąć natychmiast od serii kolejnych pocisków.*

  - [ ] Gracz startuje z 3 życiami; trafienie odejmuje 1 życie.
  - [ ] Po trafieniu gracz miga przez 2 sekundy i jest odporny na wrogie pociski.

### US-06: Nowe fale i skalowanie trudności

- *Jako gracz chcę po pokonaniu wszystkich wrogów przejść do kolejnej, szybszej fali,*  
  *aby gra stawiała przede mną coraz większe wyzwanie.*

  - [ ] Po eliminacji 55 wrogów rozpoczyna się nowa fala.
  - [ ] Prędkość najeźdźców w nowej fali jest o 10% wyższa.
  - [ ] Osłony odnawiają się, a punkty i pozostałe życia są zachowane.

### US-07: Koniec gry i natychmiastowy restart

- *Jako gracz chcę widzieć wyraźny ekran Game Over i móc błyskawicznie rozpocząć nową grę,*  
  *aby bez opóźnień spróbować pobić swój wynik.*

  - [ ] Utrata 3 żyć lub zejście wrogów na wysokość gracza kończy grę.
  - [ ] Ekran Game Over wyświetla wynik i powód porażki.
  - [ ] Naciśnięcie restartu natychmiast resetuje grę do fali 1.
