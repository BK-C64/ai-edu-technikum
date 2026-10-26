## 4. Prosty Menadżer Zadań/To-Do List z Gamifikacją

**Opis:** Standardowa lista zadań, ale z elementami gamifikacji: za każde wykonane zadanie dostaje się "punkty doświadczenia", które odblokowują (wizualnie) nowe "poziomy" lub "osiągnięcia".

### Ekrany/Komentaty:
*   **Lista Zadań (To-Do List):** Główny widok z polami do dodawania zadań i listą aktywnych zadań.
*   **Karta Zadania (Task Card):** Komponent pojedynczego zadania z nazwą i przyciskiem "Ukończ".
*   **Panel Postępu/Gamifikacji (Gamification Panel):** Wyświetla aktualny poziom, punkty XP i odblokowane osiągnięcia.
*   **Formularz Dodawania Zadania (Add Task Form):** Pole tekstowe i przycisk do dodawania nowych zadań.

### Etapy Realizacji (Agile):

#### Etap 1: Podstawowa Lista Zadań
*   **Zakres:** Stworzenie podstawowej listy zadań, która pozwala dodawać i usuwać elementy.
*   **Funkcjonalność:** Strona wyświetla pole do wprowadzania nowych zadań i przycisk "Dodaj". Poniżej znajduje się lista zadań. Obok każdego zadania jest przycisk "Usuń". Zadania są przechowywane w `localStorage`.
*   **Test:**
    *   Można dodać nowe zadanie, które pojawia się na liście.
    *   Można usunąć zadanie z listy.
    *   Zadania są zapamiętywane po odświeżeniu strony.

#### Etap 2: Ukończenie Zadań i Punkty XP
*   **Zakres:** Implementacja oznaczania zadań jako ukończonych i naliczania punktów XP.
*   **Funkcjonalność:**
    *   Obok każdego zadania pojawia się checkbox lub przycisk "Ukończ". Zaznaczenie/kliknięcie przenosi zadanie do sekcji "Ukończone Zadania" (lub je ukrywa) i dodaje określoną liczbę "punktów doświadczenia" (XP).

    *   Panel gamifikacji wyświetla aktualne XP i "poziom" (np. co 100 XP to nowy poziom).

*   **Test:**
    *   Zadanie można oznaczyć jako ukończone, a XP rosną.

    *   Po osiągnięciu progu XP, "poziom" poprawnie się zwiększa.

    *   Zmiany XP i poziomu są zapamiętywane po odświeżeniu strony.

#### Etap 3: Osiągnięcia i Animacje
*   **Zakres:** Dodanie wizualnych osiągnięć i animacji.
*   **Funkcjonalność:**
    *   Zdefiniowanie kilku prostych "osiągnięć" (np. "Ukończ 5 zadań", "Osiągnij Poziom 3"). Po ich spełnieniu, osiągnięcie jest wizualnie "odblokowywane" w panelu gamifikacji.

    *   Wizualne powiadomienie (np. popup, animacja) po zdobyciu XP lub odblokowaniu osiągnięcia.

    *   Płynne animacje `hover`/`active` dla przycisków i kart zadań.
*   **Test:**
    *   Osiągnięcia są poprawnie odblokowywane i wyświetlane po spełnieniu warunków.

    *   Pojawiają się animacje/powiadomienia po zdobyciu XP/osiągnięć.

    *   Elementy UI reagują wizualnie na interakcję.
