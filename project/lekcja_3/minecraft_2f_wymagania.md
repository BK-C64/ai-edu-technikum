# Wymagania Funkcjonalne: Prototyp Gry 2D Minecraft w Stylu Mario

Poniżej znajdują się historyjki użytkownika (user stories) dla prototypu gry, które koncentrują się na podstawowych mechanikach poruszania się, niszczenia i budowania.

## 1. Poruszanie się Postacią

*   **Jako gracz, chcę móc poruszać moją postacią w lewo i w prawo, aby eksplorować świat gry.**
    *   *Akceptacja:* Postać reaguje na wciśnięcie klawiszy A/D (lub strzałek) i płynnie przemieszcza się w odpowiednim kierunku.
*   **Jako gracz, chcę móc skakać, aby pokonywać przeszkody i dostawać się na wyższe platformy.**
    *   *Akceptacja:* Postać wykonuje skok po wciśnięciu spacji. Wysokość skoku jest stała. Postać podlega grawitacji i opada na ziemię.

## 2. Interakcja ze Światem (Bloki)

*   **Jako gracz, chcę móc niszczyć bloki znajdujące się obok mojej postaci, aby zbierać surowce i tworzyć przejścia.**
    *   *Akceptacja:* Kliknięcie myszką na blok w zasięgu postaci powoduje jego zniszczenie. Zniszczony blok znika ze świata gry.
*   **Jako gracz, chcę móc umieszczać bloki w świecie gry, aby budować struktury i platformy.**
    *   *Akceptacja:* Prawym przyciskiem myszy mogę umieścić posiadany blok w pustym miejscu w siatce świata, w zasięgu mojej postaci.
*   **Jako gracz, chcę mieć prosty interfejs (hotbar) pokazujący, jaki blok aktualnie trzymam, abym mógł łatwo przełączać się między posiadanymi blokami.**
    *   *Akceptacja:* Na dole ekranu widoczny jest pasek z kilkoma slotami. Mogę wybrać aktywny slot za pomocą klawiszy numerycznych (1-9).

## 3. Podstawy Świata Gry

*   **Jako gracz, chcę, aby świat gry był generowany jako prosta, płaska mapa z kilkoma warstwami bloków (np. trawa, ziemia, kamień), abym miał gdzie testować mechaniki.**
    *   *Akceptacja:* Po uruchomieniu gry pojawia się statyczny, predefiniowany świat, po którym mogę się poruszać.
*   **Jako gracz, chcę, aby postać kolidowała z blokami, abym nie mógł przez nie przechodzić i mógł na nich stawać.**
    *   *Akceptacja:* Postać zatrzymuje się, gdy napotka ścianę z bloków. Postać może stać i chodzić po powierzchni bloków.