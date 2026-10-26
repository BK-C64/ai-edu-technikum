# Szachy - Wymagania Funkcjonalne

## Opis Gry
Klasyczna gra szachowa dla dwóch graczy na jednym komputerze, z pełnymi zasadami szachów.

## Wymagania Funkcjonalne

### 1. Plansza i Wizualizacja
- Plansza 8x8 pól z naprzemiennymi kolorami (jasny/ciemny)
- Współrzędne planszy oznaczone literami (a-h) i cyframi (1-8)
- Wszystkie figury wyświetlane jako symbole Unicode lub proste grafiki
- Podświetlenie wybranej figury
- Podświetlenie możliwych ruchów dla wybranej figury

### 2. Figury i Ich Ruchy
- **Pion:** Ruch o 1 pole do przodu, pierwszy ruch o 2 pola, bicie na skos
- **Wieża:** Ruch w poziomie i pionie na dowolną odległość
- **Skoczek:** Ruch w kształcie litery "L" (2+1 pola)
- **Goniec:** Ruch po przekątnych na dowolną odległość
- **Hetman:** Połączenie ruchów wieży i gońca
- **Król:** Ruch o 1 pole w dowolnym kierunku

### 3. Zasady Gry
- Gra dla dwóch graczy (białe vs czarne)
- Białe zawsze zaczynają
- Gracze wykonują ruchy naprzemiennie
- Nie można wykonać ruchu, który naraża własnego króla na szacha
- Figury nie mogą przeskakiwać innych figur (wyjątek: skoczek)
- Bicie następuje przez zajęcie pola przeciwnika

### 4. Wybór i Ruch Figur
- Kliknięcie na figurę swojego koloru wybiera ją i pokazuje możliwe ruchy
- Kliknięcie na podświetlone pole wykonuje ruch
- Kliknięcie poza możliwymi ruchami anuluje wybór
- Niemożliwe jest wykonanie nielegalnego ruchu (system blokuje)

### 5. Zasady Specjalne (Uproszczone)
- **Szach:** Komunikat "Szach!" gdy król jest zagrożony
- **Mat:** Gra kończy się, gdy król nie ma legalnych ruchów i jest w szachu
- **Pat:** Remis, gdy gracz nie ma legalnych ruchów ale nie jest w szachu
- **Promocja piona:** Pion dochodzący do końca planszy automatycznie staje się hetmanem
- (Opcjonalnie) Roszada i bicie w przelocie - można pominąć w podstawowej wersji

### 6. Interfejs Użytkownika
- Wyświetlanie, czyja jest teraz tura (białe/czarne)
- Historia ruchów (lista w notacji szachowej, np. "e2-e4")
- Komunikaty o statusie gry (szach, mat, pat)
- Przycisk "Nowa gra" do zresetowania planszy
- Przycisk "Cofnij ruch" (undo ostatniego ruchu)

### 7. Warunki Końcowe
- Gra kończy się matem (wygrana jednego gracza)
- Gra kończy się patem (remis)
- Możliwość rozpoczęcia nowej gry w każdym momencie

## High-Level Plan Implementacji (Agile - każdy etap daje działającą funkcjonalność)

### Etap 1: Plansza + Figury Statyczne
**Co działa po tym etapie:** Widoczna szachownica z figurami w pozycji startowej
1. Utworzyć strukturę plików (index.html, css/style.css, js/)
2. Narysować planszę 8x8 (div grid lub canvas) z przemiennymi kolorami
3. Stworzyć klasę `Board` (js/board.js) - tablica 8x8
4. Zainicjować figury w pozycji startowej (używając Unicode: ♔♕♖♗♘♙)
5. Wyrenderować wszystkie figury na planszy
6. **TEST:** Widzisz pełną szachownicę z figurami, gotową do gry

### Etap 2: Wybór Figury + Podstawowy Ruch (tylko Pionki)
**Co działa po tym etapie:** Można wybierać pionki i nimi ruszać (bez walidacji zasad)
1. Stworzyć moduł `input.js` - obsługa kliknięć
2. Kliknięcie na figurę podświetla ją
3. Stworzyć klasę `Pawn` z metodą `getPossibleMoves()` (ruch o 1 do przodu)
4. Pokazać możliwe ruchy dla wybranego piona
5. Kliknięcie na dozwolone pole przesuwa piona
6. **TEST:** Możesz poruszać pionkami obu kolorów (jeszcze bez tur)

### Etap 3: System Tur + Wszystkie Figury (proste ruchy)
**Co działa po tym etapie:** Można grać wszystkimi figurami, naprzemienne tury
1. Stworzyć klasy dla pozostałych figur: `Rook`, `Knight`, `Bishop`, `Queen`, `King`
2. Zaimplementować `getPossibleMoves()` dla każdej (bez sprawdzania blokowania)
3. Dodać `GameState` (js/game-state.js) - śledzenie tury (biały/czarny)
4. Blokować wybór figur przeciwnika (tylko swoje figury w swojej turze)
5. Wyświetlać komunikat "Tura: Białe/Czarne"
6. **TEST:** Pełna gra, wszystkie figury się ruszają, gracze grają naprzemiennie

### Etap 4: Walidacja Ruchów + Blokowanie
**Co działa po tym etapie:** Figury ruszają się zgodnie z pełnymi zasadami szachów
1. Ulepszyć `getPossibleMoves()` - sprawdzanie blokowania przez inne figury
2. Wieża/goniec/hetman nie mogą przeskakiwać figur
3. Pion bije tylko na skos (dodać logikę bicia)
4. Blokować ruchy na pola zajęte przez własne figury
5. **TEST:** Figury ruszają się zgodnie z prawdziwymi zasadami szachów

### Etap 5: Szach + Ochrona Króla
**Co działa po tym etapie:** System wykrywa szacha, blokuje nielegalne ruchy narażające króla
1. Stworzyć moduł `chess-rules.js`
2. Funkcja `isKingInCheck(board, color)` - czy król jest atakowany
3. Walidacja: nie można wykonać ruchu, który naraża własnego króla
4. Komunikat "Szach!" gdy król jest zagrożony
5. **TEST:** Nie można zrobić ruchu, który zostawi króla w szachu

### Etap 6: Mat + Pat + Koniec Gry
**Co działa po tym etapie:** Pełna gra z wykrywaniem końca (mat/pat)
1. Funkcja `isCheckmate(board, color)` - szach + brak legalnych ruchów
2. Funkcja `isStalemate(board, color)` - brak legalnych ruchów bez szacha
3. Sprawdzać warunki końca po każdym ruchu
4. Komunikaty: "Mat! Wygrywa Biały/Czarny" lub "Pat! Remis"
5. Blokować dalsze ruchy po końcu gry
6. **TEST:** Gra kończy się poprawnie w sytuacjach mat/pat

### Etap 7: Historia Ruchów + UI
**Co działa po tym etapie:** Pełny interfejs z historią i przyciskami
1. Stworzyć moduł `ui.js`
2. Lista historii ruchów (np. "e2-e4", "e7-e5")
3. Dodać oznaczenia planszy (a-h, 1-8)
4. Przycisk "Nowa gra" - reset planszy
5. Przycisk "Cofnij ruch" - undo ostatniego ruchu
6. **TEST:** Pełnowartościowa gra szachowa z wygodnym interfejsem

### Etap 8: Promocja Piona (opcjonalnie: Roszada)
**Co działa po tym etapie:** Kompletna gra szachowa ze wszystkimi zasadami
1. Automatyczna promocja piona do hetmana po dojściu do końca
2. (Opcjonalnie) Wybór figury przy promocji (hetman/wieża/goniec/skoczek)
3. (Opcjonalnie) Roszada - specjalny ruch króla i wieży
4. Finalne testy i poprawki
5. **TEST:** Gotowa, w pełni funkcjonalna gra szachowa

### Struktura Modułów
```
js/
├── config.js          # Stałe (rozmiary, kolory)
├── board.js           # Reprezentacja planszy (8x8 grid)
├── piece.js           # Bazowa klasa figury
├── pieces/
│   ├── pawn.js        # Logika piona
│   ├── rook.js        # Logika wieży
│   ├── knight.js      # Logika skoczka
│   ├── bishop.js      # Logika gońca
│   ├── queen.js       # Logika hetmana
│   └── king.js        # Logika króla
├── chess-rules.js     # Zasady (szach, mat, pat)
├── game-state.js      # Stan gry (tura, historia)
├── renderer.js        # Renderowanie planszy i figur
├── input.js           # Obsługa kliknięć
├── ui.js              # Interfejs (historia, komunikaty)
└── main.js            # Inicjalizacja i orkiestracja
```

### Uwagi Implementacyjne
- **Reprezentacja planszy:** Tablica 2D: `board[row][col]` gdzie row=0 to rząd 1 (białe)
- **Notacja:** Konwersja między współrzędnymi tablicy a notacją szachową (a1 = [0,0])
- **Unicode figury:**
  - Białe: ♔ ♕ ♖ ♗ ♘ ♙
  - Czarne: ♚ ♛ ♜ ♝ ♞ ♟
- **Kolor pola:** `(row + col) % 2 === 0` → jasne pole
