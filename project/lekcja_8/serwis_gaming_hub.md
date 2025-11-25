## 1. Strona Agregująca Informacje o Grach/Gaming Hub

**Opis:** Prototyp strony, która wyświetla (symulowane) newsy o grach, recenzje, nadchodzące premiery, czy proste "karty" gier z opisami, screenami i ocenami użytkowników. Dane pochodzą ze statycznych plików JS (JSON) lub localStorage.

### Ekrany/Komentaty:
*   **Strona Główna (Home):** Wyświetla listę kart gier/newsów.
*   **Karta Gry/News (Game/News Card):** Komponent prezentujący skrócone informacje o pojedynczej grze/newsie.
*   **Strona Detali Gry (Game Detail Page):** Wyświetla pełne informacje o wybranej grze, galerię obrazków, sekcję komentarzy/ocen.
*   **Pasek Nawigacji/Filtrowania (Nav/Filter Bar):** Elementy do nawigacji i filtrowania/sortowania listy gier/newsów.

### Etapy Realizacji (Agile):

#### Etap 1: Podstawowa Lista Gier
*   **Zakres:** Stworzenie statycznego pliku `data.js` z kilkoma obiektami gier (tytuł, krótki opis, data premiery, obrazek).
*   **Funkcjonalność:** Strona główna wyświetla listę kart gier. Każda karta zawiera tytuł, obrazek i krótki opis.
*   **Test:** Strona ładuje się i wyświetla wszystkie gry z pliku `data.js` w formie czytelnych kart.

#### Etap 2: Detale Gry i Podstawowe Filtrowanie
*   **Zakres:** Implementacja strony detali gry i prostego filtrowania/sortowania.
*   **Funkcjonalność:**
    *   Kliknięcie karty gry na stronie głównej przenosi do strony detali gry, wyświetlającej pełny opis i większy obrazek.
    *   Dodanie paska filtrowania (np. po gatunku) i sortowania (np. po dacie premiery) na stronie głównej. Filtrowanie/sortowanie odbywa się na danych z `data.js`.
*   **Test:**
    *   Przejście na stronę detali gry działa poprawnie, wyświetlając wszystkie informacje.
    *   Filtrowanie po gatunku działa, lista gier dynamicznie się zmienia.
    *   Sortowanie po dacie premiery poprawnie przestawia kolejność gier.

#### Etap 3: Interaktywność i Oceny
*   **Zakres:** Dodanie interakcji użytkownika i symulacji ocen.
*   **Funkcjonalność:**
    *   Na stronie detali gry użytkownik może "ocenić" grę (np. poprzez kliknięcie gwiazdki od 1 do 5). Ocena jest tymczasowo wyświetlana i może być zapisana w `localStorage`.
    *   Symulacja sekcji komentarzy (można dodać statyczne komentarze).
    *   Płynne animacje `hover`/`active` dla kart gier i przycisków filtrowania.
*   **Test:**
    *   Ocena gry zmienia się po kliknięciu gwiazdek i jest widoczna.
    *   Ocena jest zapamiętywana po odświeżeniu strony (jeśli użyto `localStorage`).
    *   Elementy UI reagują wizualnie na interakcję.
