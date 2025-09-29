# Główne Funkcjonalności Aplikacji (Propozycje do MVP i dalszego rozwoju)

Poniżej znajduje się lista propozycji funkcjonalności, z których możemy wybrać zestaw na najbliższe 8 lekcji, a także zaplanować dalszy rozwój produktu.

### I. Fundamenty i Interfejs Użytkownika (Lekcja 1-2)
1.  **Główny layout aplikacji:** Statyczna struktura z podziałem na trzy kolumny: serwery/kanały, okno czatu, lista użytkowników.
2.  **Wyświetlanie listy kanałów:** Dynamiczne pobieranie i wyświetlanie listy dostępnych kanałów publicznych z serwera.
3.  **Przełączanie widoku między kanałami:** Kliknięcie na kanał powoduje zmianę kontekstu okna czatu.
4.  **Prosty motyw graficzny:** Domyślny wygląd aplikacji (np. jasny lub ciemny motyw bez możliwości zmiany).

### II. Rdzeń Komunikacji (Lekcja 2-4)
5.  **Wysyłanie i odbieranie wiadomości na kanale publicznym:** Podstawowa komunikacja w czasie rzeczywistym.
6.  **Wyświetlanie historii wiadomości:** Po wejściu na kanał użytkownik widzi poprzednie wiadomości.
7.  **Tożsamość nadawcy:** Każda wiadomość jest podpisana nazwą użytkownika i opatrzona znacznikiem czasu.
8.  **Rozmowy prywatne (1-na-1):** Możliwość otwarcia bezpośredniej konwersacji z użytkownikiem z listy.
9.  **Wskaźnik "ktoś pisze...":** Informacja zwrotna dla użytkowników, że ich rozmówca jest w trakcie pisania wiadomości.

### III. Zarządzanie Użytkownikiem (Lekcja 5)
10. **Rejestracja i logowanie:** Stworzenie systemu uwierzytelniania, aby użytkownicy mieli stałe konta.
11. **Utrzymywanie sesji:** Aplikacja "pamięta" zalogowanego użytkownika po odświeżeniu strony.
12. **Status online/offline:** Prosta informacja o tym, którzy użytkownicy są aktualnie aktywni.
13. **Podstawowy profil użytkownika:** Możliwość ustawienia własnego awatara.

### IV. Wzbogacanie Interakcji (Lekcja 6-7)
14. **Reakcje emoji na wiadomości:** Możliwość dodawania prostych reakcji (np. 👍, ❤️) do postów innych.
15. **Edycja własnych wiadomości:** Funkcja pozwalająca na poprawienie wysłanej przez siebie wiadomości.
16. **Usuwanie własnych wiadomości:** Możliwość usunięcia swojej wiadomości z czatu.
17. **Wątki (Threads):** Odpowiadanie na konkretną wiadomość w osobnym, zagnieżdżonym widoku, aby nie zakłócać głównej rozmowy.

### V. Funkcje Użyteczności i Zaawansowane (Lekcja 8+)
18. **Wyszukiwanie użytkowników:** Prosta wyszukiwarka pozwalająca znaleźć konkretną osobę i rozpocząć rozmowę.
19. **Wyszukiwanie wiadomości:** Wyszukiwarka tekstowa wewnątrz aktywnego kanału lub rozmowy prywatnej.
20. **Powiadomienia w przeglądarce:** Notyfikacje o nowych wiadomościach, gdy aplikacja nie jest aktywna.
21. **Udostępnianie obrazków:** Możliwość wysłania pliku graficznego, który wyświetli się bezpośrednio w oknie czatu.
22. **Oznaczanie użytkowników (@mentions):** Możliwość "zawołania" konkretnego użytkownika na kanale, co może generować dla niego specjalne powiadomienie.

---

## Plan Rozwoju Aplikacji na 8 Lekcji (Opis Funkcjonalny i User Stories)

### Lekcja 1: Interfejs i Połączenie

-   **Cel:** Umożliwienie użytkownikowi zobaczenia interfejsu i nawiązania połączenia z serwerem.
-   **Kluczowe Funkcje:**
    -   Statyczny interfejs logowania.
    -   Nawiązanie połączenia WebSocket z serwerem po stronie klienta.
-   **User Story:**
    -   **Jako nowy użytkownik,** chcę zobaczyć ekran logowania, na którym mogę podać swój nick i hasło do serwera, aby rozpocząć korzystanie z aplikacji.

### Lekcja 2: Autentykacja i Wyświetlenie Stanu

-   **Cel:** Uwierzytelnienie użytkownika i wyświetlenie mu początkowego stanu aplikacji.
-   **Kluczowe Funkcje:**
    -   Wysyłanie prośby o autentykację (`auth_request`).
    -   Odbiór i przetworzenie odpowiedzi (`auth_success` / `auth_failure`).
    -   Wyświetlenie głównego widoku czatu.
    -   Załadowanie i wyświetlenie historii wiadomości oraz listy użytkowników online.
-   **User Stories:**
    -   **Jako zalogowany użytkownik,** chcę, aby aplikacja automatycznie wyświetliła mi historię ostatnich rozmów na głównym kanale, abym mógł zorientować się w kontekście dyskusji.
    -   **Jako zalogowany użytkownik,** chcę widzieć listę wszystkich osób, które są aktualnie online, abym wiedział, z kim mogę rozmawiać.

### Lekcja 3: Wysyłanie i Odbieranie Wiadomości

-   **Cel:** Umożliwienie użytkownikowi aktywnego uczestnictwa w rozmowie na głównym kanale.
-   **Kluczowe Funkcje:**
    -   Wysyłanie wiadomości (`send_message`).
    -   Odbieranie wiadomości w czasie rzeczywistym (`new_message`).
    -   Wizualne rozróżnienie własnych wiadomości.
-   **User Stories:**
    -   **Jako uczestnik czatu,** chcę móc wpisać wiadomość w pole tekstowe i wysłać ją, aby podzielić się informacjami z innymi.
    -   **Jako uczestnik czatu,** chcę, aby nowe wiadomości od innych użytkowników pojawiały się automatycznie, bez potrzeby odświeżania strony, abym mógł prowadzić płynną konwersację.
    -   **Jako autor wiadomości,** chcę, aby moje wiadomości były wizualnie odróżnione od wiadomości innych, abym mógł łatwo śledzić swoje wypowiedzi.

### Lekcja 4: Świadomość Obecności (Presence)

-   **Cel:** Informowanie użytkowników o zmianach w liście obecności na czacie.
-   **Kluczowe Funkcje:**
    -   Odbieranie informacji o dołączeniu nowego użytkownika (`user_joined`).
    -   Odbieranie informacji o opuszczeniu czatu przez użytkownika (`user_left`).
    -   Dynamiczna aktualizacja listy użytkowników online.
-   **User Story:**
    -   **Jako użytkownik,** chcę widzieć informację, gdy ktoś nowy dołącza do czatu lub go opuszcza, aby mieć świadomość, kto jest obecny.

### Lekcja 5: Obsługa Kanałów Publicznych

-   **Cel:** Wprowadzenie możliwości prowadzenia wielu rozmów na różnych kanałach tematycznych.
-   **Kluczowe Funkcje:**
    -   Wyświetlanie listy dostępnych kanałów tematycznych.
    -   Możliwość przełączania się między kanałami.
    -   Pobieranie i wyświetlanie historii wiadomości dla wybranego kanału.
-   **User Stories:**
    -   **Jako użytkownik,** chcę widzieć listę dostępnych kanałów tematycznych, abym mógł dołączyć do interesującej mnie dyskusji.
    -   **Jako użytkownik,** chcę móc łatwo przełączać się między kanałami, a widok czatu powinien pokazywać tylko wiadomości z aktywnego kanału.

### Lekcja 6: Rozmowy Prywatne

-   **Cel:** Umożliwienie użytkownikom prowadzenia prywatnych konwersacji jeden na jeden.
-   **Kluczowe Funkcje:**
    -   Inicjowanie rozmowy prywatnej po kliknięciu na użytkownika z listy.
    -   Wyświetlanie rozmów prywatnych w dedykowanej sekcji.
    -   Wysyłanie i odbieranie wiadomości w ramach rozmowy prywatnej.
-   **User Story:**
    -   **Jako użytkownik,** chcę mieć możliwość kliknięcia na nick dowolnej osoby z listy online, aby rozpocząć z nią prywatną rozmowę.

### Lekcja 7: Usprawnienia Interfejsu (UX)

-   **Cel:** Wzbogacenie komunikacji o dodatkowe, subtelne informacje zwrotne.
-   **Kluczowe Funkcje:**
    -   Implementacja wskaźnika "ktoś pisze...".
    -   Czytelne formatowanie znaczników czasu przy wiadomościach.
-   **User Stories:**
    -   **Jako rozmówca,** chcę widzieć subtelną informację zwrotną (np. "Janek pisze..."), gdy mój rozmówca jest w trakcie tworzenia odpowiedzi, abym wiedział, że mam czekać.
    -   **Jako użytkownik,** chcę, aby znaczniki czasu przy wiadomościach były wyświetlane w prostym, zrozumiałym formacie (np. "14:32"), abym mógł łatwo śledzić chronologię rozmowy.

### Lekcja 8: Funkcje Użyteczności

-   **Cel:** Dodanie narzędzi ułatwiających nawigację i znajdowanie informacji.
-   **Kluczowe Funkcje:**
    -   Implementacja wyszukiwarki użytkowników na liście online.
-   **User Story:**
    -   **Jako użytkownik,** chcę mieć proste pole wyszukiwania nad listą osób online, abym mógł szybko znaleźć konkretną osobę, zwłaszcza gdy na czacie jest dużo ludzi.
