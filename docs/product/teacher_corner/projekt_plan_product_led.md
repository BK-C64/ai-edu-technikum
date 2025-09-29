# Mapa Rozwoju Produktu – "HyperChat"

**Koncepcja:** Zaczynamy od działającego MVP (Minimum Viable Product), które AI generuje w kilka minut. To jest nasz **Sprint 0**. Każdy kolejny sprint to praca nad nową, konkretną funkcją, która realnie wzbogaca aplikację. Nauczyciel w tle rozwija API, aby wspierać nowe funkcje, a uczniowie projektują je od strony frontendu, zlecają implementację AI i integrują z istniejącą aplikacją.

---

### Mapa Drogowa Produktu

**Sprint 0: Fundament – Działający Czat Publiczny (1 zajęcia)**
*   **Cel:** Ustanowienie działającej podstawy. To jest nasz punkt startowy.
*   **Funkcjonalność do osiągnięcia (Epic): "Core Chat Experience"**
    *   Użytkownik podaje swój nick i łączy się z serwerem.
    *   Dołącza do jednego, domyślnego kanału publicznego.
    *   Widzi historię wiadomości.
    *   Wysyła i odbiera wiadomości w czasie rzeczywistym.
    *   Widzi listę pozostałych użytkowników na kanale.
*   **Zadanie dla uczniów:** Wygenerować z AI ten bazowy klient. Każda grupa ma za zadanie nadać mu unikalny wygląd (modyfikując CSS), aby odróżnić swoją aplikację.

**Sprint 1: Tożsamość Użytkownika i Personalizacja (1-2 zajęcia)**
*   **Cel:** Przejście od anonimowych nicków do stałych tożsamości.
*   **Nowe API od Nauczyciela:** Endpointy do `rejestracji` i `logowania` (z hasłem); endpoint do `zmiany avatara`.
*   **Funkcjonalność do zaimplementowania (Epic): "User Identity"**
    1.  **Prawdziwe Logowanie:** Stworzyć osobny widok/modal do rejestracji i logowania. Aplikacja ma pamiętać zalogowanego użytkownika (np. używając `localStorage`), aby nie musiał logować się za każdym razem.
    2.  **Awatary:** Dodać możliwość wyboru avatara z predefiniowanej listy. Avatar ma się pojawiać obok wiadomości użytkownika.

**Sprint 2: Świat Wielu Rozmów (2 zajęcia)**
*   **Cel:** Uwolnienie użytkowników z jednego kanału. To największy skok funkcjonalny.
*   **Nowe API od Nauczyciela:** Endpointy do `listowania kanałów`, `tworzenia kanałów` i `dołączania` do nich. Mechanizm na serwerze do obsługi `wiadomości prywatnych`.
*   **Funkcjonalność do zaimplementowania (Epic): "Multi-Channel & Private Messaging"**
    1.  **Przeglądarka Kanałów:** Zbudować interfejs pozwalający widzieć listę dostępnych kanałów i tworzyć nowe. Użytkownik musi móc płynnie przełączać się między kanałami, w których uczestniczy.
    2.  **Wiadomości Prywatne (1-na-1):** Po kliknięciu na użytkownika z listy, powinna otwierać się z nim prywatna konwersacja. UI musi być przeprojektowane tak, aby zarządzać wieloma otwartymi rozmowami naraz (kanały + rozmowy prywatne).

**Sprint 3: Wzbogacanie Komunikacji (1-2 zajęcia)**
*   **Cel:** Sprawienie, by rozmowa była bardziej ekspresyjna i informacyjna.
*   **Nowe API od Nauczyciela:** Logika serwera do obsługi wskaźnika "pisze..."; endpoint do `uploadu plików`.
*   **Funkcjonalność do zaimplementowania (Epic): "Rich Messaging"**
    1.  **Wskaźnik "Ktoś pisze...":** W oknie czatu (zarówno na kanale, jak i w rozmowie prywatnej) pojawia się informacja, gdy rozmówca zaczyna pisać wiadomość.
    2.  **Udostępnianie Obrazków:** Dodać przycisk pozwalający na wysłanie obrazka, który zostanie wyświetlony bezpośrednio w oknie czatu.

**Sprint 4: Funkcje Zaawansowane i UX (2 zajęcia)**
*   **Cel:** Dodanie narzędzi dających użytkownikowi większą kontrolę i lepsze doświadczenie.
*   **Nowe API od Nauczyciela:** Endpointy do `edycji` i `usuwania` wiadomości; wsparcie dla Web Push Notifications.
*   **Funkcjonalność do zaimplementowania (Epic): "Power-User Features"**
    1.  **Edycja i Usuwanie Wiadomości:** Użytkownik może edytować lub usuwać swoje własne, wcześniej wysłane wiadomości. Zmiana jest widoczna dla wszystkich w czasie rzeczywistym.
    2.  **Powiadomienia Przeglądarki:** Gdy użytkownik otrzyma nową wiadomość (prywatną lub na kanale, na którym jest aktywny), a okno aplikacji nie jest w focusie, otrzymuje natywne powiadomienie w systemie.

**Sprint 5: Refaktoryzacja i Prezentacja (1 zajęcia)**
*   **Cel:** Spojrzenie na swój kod okiem inżyniera i podsumowanie pracy.
*   **Zadanie:** To sprint bez nowych funkcji.
    1.  **Przegląd Kodu:** Uczniowie zlecają AI zadanie: "Przeanalizuj nasz kod. Zaproponuj podział na mniejsze moduły (`api.js`, `ui.js`, `websockets.js`) i wykonaj refaktoryzację, aby kod był czystszy i lepiej zorganizowany".
    2.  **Demo Day:** Każda grupa prezentuje swoją aplikację, omawiając cały proces produktowy: od MVP, przez kolejne sprinty, aż po finalny, bogaty w funkcje produkt.
