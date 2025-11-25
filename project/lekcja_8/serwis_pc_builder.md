## 2. Symulator Konfiguracji PC (PC Part Picker Lite)

**Opis:** Użytkownik wybiera komponenty (procesor, karta graficzna, RAM, płyta główna, dysk) z predefiniowanych danych. Aplikacja sumuje ich ceny, moc (symulowana) i prezentuje "złożony" zestaw, z możliwością sprawdzenia symulowanej kompatybilności.

### Ekrany/Komentaty:
*   **Strona Konfiguratora (Configurator Page):** Główny widok z sekcjami wyboru komponentów.
*   **Sekcja Komponentu (Component Section):** Komponent do wyboru pojedynczego typu części (np. Procesor, Karta Graficzna).
*   **Podsumowanie Konfiguracji (Summary Panel):** Wyświetla wybrane komponenty, sumę cen i symulowane statystyki (np. "Moc PC", "Ocena Kompatybilności").

### Etapy Realizacji (Agile):

#### Etap 1: Wybór Komponentów i Sumowanie Cen
*   **Zakres:** Stworzenie statycznego pliku `components.js` z danymi dla kilku typów komponentów (np. CPU, GPU, RAM) z nazwami i cenami.
*   **Funkcjonalność:** Strona wyświetla sekcje wyboru dla CPU, GPU, RAM. Użytkownik może wybrać po jednym komponencie z każdej sekcji (np. za pomocą rozwijanych list lub przycisków-kart). Podsumowanie na bieżąco wyświetla sumę cen wybranych części.
*   **Test:**
    *   Wybór komponentów z każdej sekcji działa.
    *   Suma cen aktualizuje się poprawnie po każdym wyborze.

#### Etap 2: Symulowane Statystyki i Podstawowa Kompatybilność
*   **Zakres:** Dodanie symulowanych statystyk i prostej logiki kompatybilności.
*   **Funkcjonalność:**
    *   Każdy komponent w `components.js` otrzymuje dodatkowe, symulowane parametry (np. "moc", "kompatybilność z płytą główną A/B").
    *   Panel podsumowania wyświetla symulowaną "Moc PC" (suma mocy komponentów) oraz prostą "Ocenę Kompatybilności" (np. zielony/czerwony wskaźnik, jeśli wybrane CPU i płyta główna są "kompatybilne" zgodnie z danymi).
*   **Test:**
    *   Statystyki "Moc PC" i "Ocena Kompatybilności" dynamicznie zmieniają się po wyborze komponentów.
    *   Wskaźnik kompatybilności zmienia kolor/treść, gdy wybrane zostaną niekompatybilne komponenty (zgodnie z logiką symulacji).

#### Etap 3: Wizualizacje i Zapis Konfiguracji
*   **Zakres:** Ulepszenia wizualne i opcja zapisywania.
*   **Funkcjonalność:**
    *   Dodanie placeholderowych obrazków dla każdego komponentu, wyświetlanych po jego wyborze.
    *   Możliwość zapisania bieżącej konfiguracji PC do `localStorage` i wczytania jej przy kolejnym otwarciu strony.
    *   Płynne animacje `hover`/`active` dla przycisków wyboru komponentów.
*   **Test:**
    *   Obrazki komponentów pojawiają się po wyborze.
    *   Konfiguracja jest poprawnie zapisywana i wczytywana po odświeżeniu strony.
    *   Elementy UI reagują wizualnie na interakcję.
