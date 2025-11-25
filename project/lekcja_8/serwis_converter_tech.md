## 5. Interaktywny Przelicznik Jednostek Technicznych

**Opis:** Użytkownik wprowadza wartość w jednej jednostce (np. megabity), a aplikacja na bieżąco przelicza ją na inne powiązane jednostki (megabajty, gigabity, itp.). Może zawierać sekcje dla różnych kategorii przeliczeń (np. Sieć, Dane, Czas).

### Ekrany/Komentaty:
*   **Strona Przelicznika (Converter Page):** Główny widok z sekcjami kategorii i polami przeliczeń.
*   **Sekcja Kategori (Category Section):** Komponent grupujący powiązane jednostki (np. "Przeliczniki Sieciowe").
*   **Pole Przeliczania (Conversion Field):** Para pól input/output dla pojedynczej jednostki (np. "Megabit" - "Megabyte").
*   **Przycisk Wyboru Kategorii (Category Selector):** Przycisk/zakładka do zmiany aktywnej kategorii przeliczeń.

### Etapy Realizacji (Agile):

#### Etap 1: Podstawowy Przelicznik Bity <-> Bajty
*   **Zakres:** Implementacja podstawowego przelicznika między bitami a bajtami.
*   **Funkcjonalność:** Strona wyświetla dwa pola input: jedno dla "Bity", drugie dla "Bajty". Wprowadzenie wartości do jednego pola automatycznie przelicza i wyświetla wynik w drugim. Domyślnie 1 bajt = 8 bitów.
*   **Test:**
    *   Wprowadzenie wartości w bitach poprawnie wyświetla bajty.
    *   Wprowadzenie wartości w bajtach poprawnie wyświetla bity.

#### Etap 2: Dodatkowe Jednostki i Kategorie
*   **Zakres:** Rozszerzenie o więcej jednostek i wprowadzenie kategorii.
*   **Funkcjonalność:**
    *   Dodanie nowych jednostek do przeliczników danych (np. kilobity, gigabity, kilobajty, gigabajty). Wprowadzenie wartości do dowolnego pola przelicza na wszystkie inne powiązane jednostki.
    *   Wprowadzenie systemu zakładek/przycisków do wyboru kategorii (np. "Dane", "Czas"). Wybranie kategorii ukrywa niepasujące pola.
*   **Test:**
    *   Przeliczenia między wszystkimi nowymi jednostkami działają poprawnie.
    *   System kategorii poprawnie przełącza widok między zestawami przeliczników.

#### Etap 3: Design i Walidacja
*   **Zakres:** Ulepszenia UI/UX i walidacja wprowadzanych danych.
*   **Funkcjonalność:**
    *   Atrakcyjny wizualnie design dla pól input/output i przycisków kategorii.
    *   Walidacja wprowadzanej wartości (tylko liczby, opcjonalnie zakres). Komunikat o błędzie, jeśli wprowadzono nieprawidłowe dane.
    *   Płynne animacje `hover`/`active` dla przycisków kategorii i pól input.
*   **Test:**
    *   Interfejs jest estetyczny i intuicyjny.
    *   Wprowadzenie tekstu/znaków specjalnych do pola przelicznika wyświetla komunikat o błędzie i nie powoduje błędów JS.
    *   Elementy UI reagują wizualnie na interakcję.
