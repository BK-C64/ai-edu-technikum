# Wymagania Niefunkcjonalne dla Prototypu Aplikacji

## 1. Wygląd i Użyteczność (Look & Feel / Usability)

-   **Intuicyjny Interfejs:** Aplikacja musi być łatwa w obsłudze bez potrzeby czytania instrukcji. Użytkownik powinien naturalnie rozumieć, jak przełączać się między serwerami, kanałami i jak wysyłać wiadomości.
-   **Spójność Wizualna:** Wszystkie elementy interfejsu (przyciski, ikony, pola tekstowe) muszą być spójne stylistycznie na całej platformie.
-   **Układ Trójkolumnowy:** Prototyp powinien zachować klasyczny układ znany z aplikacji tego typu:
    -   Lewa kolumna: Lista serwerów.
    -   Środkowa kolumna: Lista kanałów i okno czatu.
    -   Prawa kolumna: Lista użytkowników na serwerze.
-   **Czytelność:** Użyte czcionki, ich rozmiar i kolory muszą zapewniać wysoką czytelność wiadomości i elementów interfejsu. Kontrast między tłem a tekstem musi być odpowiedni.

## 2. Wydajność (Performance)

-   **Szybkość Reakcji Interfejsu:** Wszystkie akcje wykonywane przez użytkownika (np. kliknięcie na kanał, wysłanie wiadomości) muszą mieć natychmiastową odpowiedź wizualną. Nie powinno być odczuwalnych opóźnień.
-   **Płynne Przewijanie:** Przewijanie historii czatu musi być płynne, nawet przy symulowanej dużej liczbie wiadomości.

## 3. Kompatybilność (Compatibility)

-   **Wsparcie dla Przeglądarek:** Prototyp musi poprawnie wyświetlać się i działać w najnowszych wersjach popularnych przeglądarek internetowych: Chrome, Firefox, Safari i Edge.

## 4. Jakość Kodu (Code Quality & Maintainability)

-   **Separacja Warstw:** Kod musi być jasno podzielony na trzy warstwy:
    -   **HTML:** Struktura i treść.
    -   **CSS:** Wygląd i styl.
    -   **JavaScript:** Logika i interaktywność.
-   **Czytelność Kodu:** Kod powinien być napisany w sposób czysty i zrozumiały, z użyciem sensownych nazw dla zmiennych, funkcji i klas CSS, co ułatwi jego dalszy rozwój.
-   **Struktura Plików:** Pliki projektu powinny być zorganizowane w logiczną strukturę folderów (np. oddzielne foldery na CSS, JS i ewentualne obrazki).
