## 3. Interaktywny Quiz Programistyczny/Tech Trivia

**Opis:** Prototyp quizu wielokrotnego wyboru lub prawda/fałsz z pytaniami z zakresu programowania, hardware'u czy historii IT. Po zakończeniu pokazuje wynik i poprawne odpowiedzi.

### Ekrany/Komentaty:
*   **Strona Startowa (Start Page):** Powitanie i przycisk "Start Quiz".
*   **Ekran Pytania (Question Screen):** Wyświetla pytanie i dostępne odpowiedzi.
*   **Ekran Wyników (Results Screen):** Pokazuje końcowy wynik, listę pytań z poprawnymi/niepoprawnymi odpowiedziami.
*   **Pasek Postępu (Progress Bar):** Wskazuje postęp w quizie.

### Etapy Realizacji (Agile):

#### Etap 1: Podstawowy Quiz
*   **Zakres:** Stworzenie statycznego pliku `questions.js` z kilkoma pytaniami (treść, opcje odpowiedzi, poprawna odpowiedź).

*   **Funkcjonalność:** Strona startowa z przyciskiem "Start Quiz". Po kliknięciu, wyświetla pierwsze pytanie z opcjami odpowiedzi. Użytkownik może wybrać odpowiedź i przejść do kolejnego pytania. Na końcu wyświetla statyczny komunikat "Quiz zakończony".
*   **Test:**
    *   Quiz startuje, pytania i opcje wyświetlają się poprawnie.
    *   Można przejść przez wszystkie pytania, wybierając odpowiedzi.

#### Etap 2: Wynik i Feedback
*   **Zakres:** Obliczanie wyniku i wyświetlanie feedbacku.
*   **Funkcjonalność:**
    *   Po zakończeniu quizu, aplikacja oblicza liczbę poprawnych odpowiedzi i wyświetla wynik na ekranie wyników (np. "Twój wynik: X/Y").
    *   Po wyborze odpowiedzi, wizualny feedback (np. zielone tło dla poprawnej, czerwone dla błędnej) przed przejściem do kolejnego pytania.
    *   Implementacja paska postępu, który aktualizuje się z każdym pytaniem.
*   **Test:**
    *   Po zakończeniu quizu wyświetla się poprawny wynik.
    *   Wizualny feedback po wyborze odpowiedzi działa.
    *   Pasek postępu poprawnie odzwierciedla aktualne pytanie.

#### Etap 3: Szczegółowe Wyniki i Reset
*   **Zakres:** Rozszerzony ekran wyników i możliwość restartu.
*   **Funkcjonalność:**
    *   Na ekranie wyników, obok podsumowania, wyświetlana jest lista wszystkich pytań z quizu, z zaznaczeniem, która odpowiedź była wybrana przez użytkownika i która była poprawna.
    *   Przycisk "Zagraj ponownie" na ekranie wyników resetuje quiz do stanu początkowego.
    *   Płynne animacje `hover`/`active` dla przycisków wyboru odpowiedzi i nawigacji.
*   **Test:**
    *   Ekran wyników poprawnie wyświetla szczegóły wszystkich pytań.
    *   Przycisk "Zagraj ponownie" resetuje quiz, umożliwiając ponowne rozwiązanie.
    *   Elementy UI reagują wizualnie na interakcję.
