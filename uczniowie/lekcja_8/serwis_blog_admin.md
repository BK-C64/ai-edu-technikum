## 6. Dashboard "Mój Tech Blog" (Symulowany Panel Admina)

**Opis:** Prototyp prostego panelu administracyjnego dla (fikcyjnego) bloga technologicznego. Wyświetla listę (symulowanych) postów, pozwala na "edycję" tytułu i treści (zmiany widoczne tylko lokalnie, localStorage), dodawanie nowych postów i ich "usuwanie".

### Ekrany/Komentaty:
*   **Widok Listy Postów (Post List View):** Główny widok z tabelą/listą wszystkich postów.
*   **Karta/Wiersz Postu (Post Card/Row):** Komponent prezentujący skrócone informacje o poście z przyciskami akcji.
*   **Formularz Edycji/Dodawania Postu (Edit/Add Post Form):** Modal lub osobna strona do tworzenia/modyfikowania postów.
*   **Powiadomienia (Notifications):** Komponent do wyświetlania komunikatów o sukcesie/błędzie.

### Etapy Realizacji (Agile):

#### Etap 1: Podstawowa Lista Postów
*   **Zakres:** Stworzenie statycznego pliku `posts.js` z kilkoma obiektami postów (tytuł, krótka treść, data).
*   **Funkcjonalność:** Strona główna wyświetla listę wszystkich postów w formie tabeli lub estetycznych kart. Obok każdego postu znajdują się przyciski "Edytuj" i "Usuń" (na razie nieaktywne). Przyciski "Dodaj Nowy Post" (na razie nieaktywne).
*   **Test:** Strona ładuje się i wyświetla wszystkie posty z pliku `posts.js` w formie czytelnej listy.

#### Etap 2: Dodawanie i Usuwanie Postów
*   **Zakres:** Implementacja dodawania i usuwania postów.
*   **Funkcjonalność:**
    *   Przycisk "Dodaj Nowy Post" otwiera prosty formularz (np. w modalu) z polami na tytuł i treść. Po zatwierdzeniu, post jest dodawany do listy (i `localStorage`) i pojawia się wizualne potwierdzenie.

    *   Przycisk "Usuń" obok postu usuwa go z listy (i `localStorage`) po potwierdzeniu (np. `confirm()`).
*   **Test:**
    *   Można dodać nowy post, który pojawia się na liście i jest zapamiętywany po odświeżeniu.

    *   Można usunąć post, który znika z listy i nie wraca po odświeżeniu.

    *   Pojawiają się podstawowe powiadomienia o sukcesie/błędzie (np. `alert()`).

#### Etap 3: Edycja i Walidacja Formularzy
*   **Zakres:** Implementacja edycji postów i walidacji formularzy.
*   **Funkcjonalność:**
    *   Przycisk "Edytuj" obok postu otwiera formularz (pre-wypełniony danymi postu), umożliwiając modyfikację tytułu i treści. Zmiany są zapisywane do `localStorage`.

    *   Walidacja formularza dodawania/edycji (np. tytuł nie może być pusty, treść musi mieć min. 10 znaków).

    *   Estetyczne komunikaty o sukcesie (np. "Post zapisano!") i błędach walidacji.

    *   Płynne animacje `hover`/`active` dla przycisków akcji.
*   **Test:**
    *   Można edytować istniejący post, a zmiany są widoczne i zapamiętywane.

    *   Formularz poprawnie waliduje dane, wyświetlając komunikaty o błędach.

    *   Elementy UI reagują wizualnie na interakcję.
