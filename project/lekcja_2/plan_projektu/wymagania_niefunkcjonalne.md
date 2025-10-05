# Wymagania Niefunkcjonalne dla Prototypu Samochodu (HTML/JS/CSS 2D)

Poniżej przedstawiono wymagania niefunkcjonalne dla prototypu samochodu, który ma być zrealizowany w technologiach HTML, JavaScript i CSS, z prostą grafiką 2D, uruchamianym lokalnie.

## 1. Wydajność

*   **Szybkość ładowania:** Aplikacja powinna ładować się w przeglądarce w czasie krótszym niż 2 sekundy na standardowym komputerze.
*   **Płynność animacji:** Animacje ruchu samochodu (przyspieszanie, skręcanie, hamowanie) powinny być płynne i nie wykazywać zauważalnych opóźnień (min. 30 FPS).

## 2. Użyteczność

*   **Prostota interfejsu:** Interfejs użytkownika powinien być intuicyjny i łatwy do zrozumienia dla każdego użytkownika.
*   **Sterowanie:** Sterowanie samochodem powinno być proste i responsywne, realizowane za pomocą klawiatury:
    *   'W' - przyspieszanie
    *   'S' - zwalnianie/hamowanie
    *   'A' - skręcanie w lewo
    *   'D' - skręcanie w prawo

## 3. Niezawodność

*   **Stabilność:** Aplikacja powinna działać stabilnie bez awarii i błędów podczas typowego użytkowania.
*   **Obsługa błędów:** W przypadku wystąpienia błędów (np. nieprawidłowe dane wejściowe), aplikacja powinna reagować w sposób kontrolowany i nie prowadzić do jej zawieszenia.

## 4. Przenośność

*   **Kompatybilność z przeglądarkami:** Prototyp powinien działać poprawnie w nowoczesnych przeglądarkach internetowych (np. Chrome, Firefox, Edge) bez konieczności instalowania dodatkowych wtyczek.
*   **Lokalne uruchamianie:** Aplikacja powinna być możliwa do uruchomienia bezpośrednio z pliku HTML na lokalnym komputerze, bez potrzeby serwera WWW.

## 5. Utrzymywalność

*   **Struktura kodu:** Kod powinien być podzielony na oddzielne pliki HTML, CSS i JavaScript, zgodnie z dobrymi praktykami. Pliki CSS powinny być zorganizowane obiektowo, aby umożliwić łatwe rozdzielanie stylów dla różnych elementów i ułatwić rozbudowę aplikacji.
*   **Czytelność kodu:** Kod powinien być czytelny, dobrze skomentowany i łatwy do zrozumienia dla innych programistów.
*   **Modułowość:** Komponenty kodu powinny być w miarę możliwości modułowe, aby ułatwić przyszłe rozszerzenia i modyfikacje.

## 6. Wygląd i Grafika

*   **Kształt i kolor samochodu:** Samochód powinien być przedstawiony jako jasnoniebieski prostokąt.
*   **Szyby:** Samochód powinien mieć szyby z przodu i z tyłu, koloru czarnego.
*   **Oświetlenie:** Samochód powinien mieć żółte światła z przodu i czerwone światła z tyłu.