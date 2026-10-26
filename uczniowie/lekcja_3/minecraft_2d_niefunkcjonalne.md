# Wymagania Niefunkcjonalne dla Prototypu Gry 2D Minecraft

Poniżej przedstawiono wymagania niefunkcjonalne dla prototypu gry, który ma być zrealizowany w technologiach HTML, JavaScript i CSS, z prostą grafiką 2D, uruchamianym lokalnie.

## 1. Wydajność

*   **Szybkość ładowania:** Aplikacja powinna ładować się w przeglądarce w czasie krótszym niż 2 sekundy na standardowym komputerze.
*   **Płynność rozgrywki:** Animacje postaci i interakcje ze światem (niszczenie, budowanie) powinny być płynne i nie wykazywać zauważalnych opóźnień (min. 30 FPS).

## 2. Użyteczność

*   **Prostota interfejsu:** Interfejs użytkownika (hotbar) powinien być intuicyjny i łatwy do zrozumienia.
*   **Sterowanie:** Sterowanie postacią i interakcja ze światem powinny być proste i responsywne:
    *   'A' / 'D' lub strzałki - poruszanie się w lewo/prawo
    *   'Spacja' - skok
    *   Lewy przycisk myszy - niszczenie bloku
    *   Prawy przycisk myszy - budowanie bloku
    *   Klawisze 1-9 - wybór bloku z hotbara

## 3. Niezawodność

*   **Stabilność:** Aplikacja powinna działać stabilnie bez awarii i błędów podczas typowego użytkowania.
*   **Obsługa błędów:** W przypadku wystąpienia błędów, aplikacja powinna reagować w sposób kontrolowany i nie prowadzić do jej zawieszenia.

## 4. Przenośność

*   **Kompatybilność z przeglądarkami:** Prototyp powinien działać poprawnie w nowoczesnych przeglądarkach internetowych (np. Chrome, Firefox, Edge) bez konieczności instalowania dodatkowych wtyczek.
*   **Lokalne uruchamianie:** Aplikacja powinna być możliwa do uruchomienia bezpośrednio z pliku HTML na lokalnym komputerze, bez potrzeby serwera WWW.

## 5. Utrzymywalność

*   **Struktura kodu:** Kod powinien być podzielony na oddzielne pliki HTML, CSS i JavaScript, zgodnie z dobrymi praktykami.
*   **Czytelność kodu:** Kod powinien być czytelny, dobrze skomentowany i łatwy do zrozumienia dla innych programistów.
*   **Modułowość:** Logika gry (np. fizyka, renderowanie, sterowanie) powinna być w miarę możliwości rozdzielona na moduły, aby ułatwić przyszłe rozszerzenia.

## 6. Wygląd i Grafika

*   **Styl graficzny:** Grafika powinna być prosta, pikselowa (pixel art), nawiązująca do estetyki 2D gier retro.
*   **Postać:** Postać gracza powinna być prostym, rozpoznawalnym sprite'em.
*   **Bloki:** Różne typy bloków (np. trawa, ziemia, kamień) powinny być łatwo odróżnialne wizualnie.