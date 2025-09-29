# Cel cwiczenia
pokazanie uczniom klasy 2 technikum mozliwosci AI poprzez zbudowanie webowego klienta IRC uruchamianego lokalnie na komputerach szkolnych. 

# Załozenia

Zarowno klient jak i serwer to ma byc prototyp. Proste uwierzytelnianie haslem pomiedzy klientem a serwerem. 
Klient irc'a bedzie sie laczyl do prostego serwera postawionego na AWS (do zaplanowania jak dokladnie)
Dzieciaki maja stworzyc prostego klienta IRC i miec mozliwosc rozmowy na wspolnym czacie, tak zeby bylo widac kto i kiedy co napisal. 
Serwer ma pamiec tylko tymczasowa, na potrzeby 1 zajec lekcyjnych. 

# Proces Połączenia, Uwierzytelniania i Inicjalizacji Czatu (Przepływ Ogólny)

Poniżej przedstawiono typowy przepływ zdarzeń od momentu próby połączenia klienta z serwerem aż do pełnej gotowości do uczestnictwa w czacie:

1.  **Klient -> Inicjacja Połączenia:**
    *   Użytkownik wprowadza w interfejsie klienta swój nick oraz hasło serwera.
    *   Klient próbuje nawiązać połączenie WebSocket z serwerem pod wskazanym adresem.

2.  **Połączenie Nawiązane (WebSocket `onopen` event po stronie klienta):**
    *   **Klient -> Serwer:** Klient wysyła komunikat typu `auth_password` zawierający podane przez użytkownika hasło.

3.  **Serwer -> Weryfikacja Hasła:**
    *   Serwer odbiera komunikat `auth_password`.
    *   **Scenariusz A (Błędne Hasło):**
        *   **Serwer -> Klient:** Serwer wysyła komunikat `auth_error` z powodem np. "Invalid password."
        *   Serwer rozłącza klienta.
        *   Klient informuje użytkownika o błędzie. Koniec przepływu dla tej próby.
    *   **Scenariusz B (Poprawne Hasło):**
        *   Serwer oczekuje na nick od klienta.

4.  **Klient -> Przesłanie Nicka (po tym, jak serwer nie rozłączył po weryfikacji hasła):**
    *   **Klient -> Serwer:** Klient wysyła komunikat typu `auth_username` zawierający wybrany przez użytkownika nick.

5.  **Serwer -> Weryfikacja Nicka:**
    *   Serwer odbiera komunikat `auth_username`.
    *   Serwer sprawdza, czy nick spełnia kryteria: długość między 3 a 20 znaków oraz czy nie jest już używany przez innego połączonego klienta. Jeśli nick jest zajęty lub ma nieprawidłową długość, serwer wysyła do klienta komunikat `auth_error` z odpowiednim powodem (np. "Nickname already in use." lub "Invalid username length (must be 3-20 characters).") i rozłącza klienta.
    *   Jeśli nick jest wolny i ma poprawną długość, uwierzytelnianie jest zakończone pomyślnie.

6.  **Klient -> Gotowość do Czatu:**
    *   Klient odebrał historię czatu i listę użytkowników.
    *   Interfejs klienta jest w pełni aktywny, umożliwiając wysyłanie i odbieranie nowych wiadomości (`new_message`).

# Serwer

## Specyfikacja

1.  **Nasłuchiwanie na połączenia WebSocket:** Serwer musi być w stanie akceptować nowe połączenia WebSocket na skonfigurowanym wcześniej porcie.
2.  **Uwierzytelnianie klientów:**
    *   Po nawiązaniu połączenia WebSocket, serwer oczekuje od klienta pierwszej wiadomości zawierającej hasło (komunikat `auth_password`).
    *   Serwer weryfikuje otrzymane hasło z hasłem predefiniowanym w konfiguracji serwera.
    *   W przypadku niepoprawnego hasła, serwer powinien wysłać komunikat `auth_error` i rozłączyć klienta.
    *   Jeśli hasło jest poprawne, serwer oczekuje na kolejną wiadomość od klienta (komunikat `auth_username`), tym razem z jego nazwą użytkownika (nickiem).
    *   **Serwer sprawdza, czy otrzymany nick spełnia kryteria: długość między 3 a 20 znaków oraz czy nie jest już używany przez innego połączonego klienta. Jeśli nick jest zajęty lub ma nieprawidłową długość, serwer wysyła do klienta komunikat `auth_error` z odpowiednim powodem (np. "Nickname already in use." lub "Invalid username length (must be 3-20 characters).") i rozłącza klienta.**
    *   Jeśli nick jest wolny i ma poprawną długość, uwierzytelnianie jest zakończone pomyślnie.
3.  **Zarządzanie użytkownikami:**
    *   Serwer utrzymuje w pamięci listę aktualnie połączonych i uwierzytelnionych użytkowników (ich nicki oraz powiązane z nimi obiekty połączeń WebSocket).
    *   Gdy nowy użytkownik pomyślnie się uwierzytelni (poprawne hasło, **unikalny nick o prawidłowej długości**):
        *   Serwer dodaje go do listy aktywnych użytkowników.
        *   Serwer wysyła do nowo dołączonego klienta całą dotychczasową historię czatu (komunikat `chat_history`).
        *   Serwer wysyła do nowo dołączonego klienta komunikat typu `user_list` zawierający listę wszystkich aktualnie połączonych użytkowników (włącznie z nowym).
        *   Serwer wysyła do wszystkich **pozostałych** połączonych klientów komunikat typu `user_joined` zawierający nick nowego użytkownika i znacznik czasu.
        *   **Serwer rozgłasza (broadcasts) zaktualizowany komunikat `user_list` do wszystkich połączonych klientów.**
    *   Gdy klient się rozłącza (np. zamknie zakładkę przeglądarki, utraci połączenie sieciowe):
        *   Serwer usuwa go z listy aktywnych użytkowników.
        *   Serwer wysyła do wszystkich pozostałych połączonych klientów komunikat typu `user_left` zawierający nick użytkownika, który opuścił czat, oraz znacznik czasu.
        *   **Serwer rozgłasza (broadcasts) zaktualizowany komunikat `user_list` do wszystkich pozostałych połączonych klientów.**
4.  **Przekazywanie wiadomości czatu:**
    *   Serwer odbiera od uwierzytelnionych klientów wiadomości tekstowe (komunikaty typu `new_message`).
    *   Serwer sprawdza długość otrzymanej wiadomości tekstowej w `payload.text`. Jeśli przekracza 300 znaków, wiadomość jest odrzucana (serwer może zignorować wiadomość lub opcjonalnie wysłać komunikat o błędzie do klienta).
    *   Jeśli wiadomość jest poprawna (nie przekracza limitu długości), serwer dołącza do niej nick nadawcy (na podstawie informacji zapisanej podczas uwierzytelniania) oraz aktualny serwerowy znacznik czasu.
    *   Serwer dodaje poprawną wiadomość (obiekt z nickiem, tekstem i timestampem) do przechowywanej w pamięci historii czatu.
    *   Serwer rozgłasza (broadcasts) tak przygotowaną wiadomość (wzbogaconą o nick i timestamp) do wszystkich aktualnie połączonych i uwierzytelnionych użytkowników.
5.  **Obsługa błędów i rozłączeń:** Serwer powinien być odporny na błędy komunikacji i poprawnie obsługiwać nieoczekiwane rozłączenia klientów, usuwając ich z listy aktywnych użytkowników.
6.  **Tymczasowość danych:** Zgodnie z założeniami, wszystkie dane (lista użytkowników, historia czatu od momentu uruchomienia serwera) są przechowywane wyłącznie w pamięci RAM serwera i są tracone po jego restarcie lub zatrzymaniu.

## Architektura Serwera

*   **Technologia:** Python.
    *   Sugerowany framework: **FastAPI** (nowoczesny, wydajny, wbudowane wsparcie dla WebSockets, automatyczna walidacja danych).
*   **Hosting:** AWS EC2 (np. instancja t2.micro lub t2.small).
    *   Wymagana konfiguracja Security Group: zezwolenie na ruch przychodzący na porcie serwera WebSocket (ustawiamy na **`8000`**).
*   **Komunikacja:** WebSockets.
    *   Akceptacja połączeń WebSocket od klientów.
    *   Pierwszy komunikat od klienta po połączeniu powinien zawierać hasło uwierzytelniające.
*   **Uwierzytelnianie:**
    *   Proste, predefiniowane hasło (ustawiamy na **`ircAMP2024!`**) wysyłane przez klienta jako pierwsza wiadomość po nawiązaniu połączenia WebSocket.
    *   Serwer weryfikuje hasło; niepoprawne skutkuje rozłączeniem.
    *   Po pomyślnym uwierzytelnieniu, klient wysyła swoją nazwę użytkownika (nick).
*   **Struktura komunikatów (JSON przez WebSocket):**
    *   **Klient -> Serwer:**
        *   Komunikat wysyłany jako pierwszy po nawiązaniu połączenia WebSocket w celu uwierzytelnienia hasłem:
            ```json
            {
              "type": "auth_password",
              "payload": {
                "password": "PREDEFINIOWANE_HASLO_SERWERA"
              }
            }
            ```
        *   Komunikat wysyłany po akceptacji hasła (jeśli serwer nie rozłączył), w celu przesłania nicka użytkownika:
            ```json
            {
              "type": "auth_username",
              "payload": {
                "username": "WYBRANY_NICK_UZYTKOWNIKA"
              }
            }
            ```
        *   Komunikat wysyłany po pomyślnym uwierzytelnieniu i ustawieniu nicka, do przesyłania wiadomości na czacie:
            ```json
            {
              "type": "new_message",
              "payload": {
                "text": "Treść wiadomości od użytkownika"
              }
            }
            ```
    *   **Serwer -> Klient:**
        *   Potwierdzenie połączenia / informacja o nowym użytkowniku:
            ```json
            {
              "type": "user_joined",
              "payload": {
                "username": "NowyUzytkownik",
                "timestamp": "YYYY-MM-DDTHH:MM:SSZ" // ISO 8601 UTC
              }
            }
            ```
        *   Nowa wiadomość od innego użytkownika:
            ```json
            {
              "type": "new_message",
              "payload": {
                "username": "WysylajacyUzytkownik",
                "text": "Treść wiadomości",
                "timestamp": "YYYY-MM-DDTHH:MM:SSZ" // ISO 8601 UTC
              }
            }
            ```
        *   Informacja o opuszczeniu czatu przez użytkownika:
            ```json
            {
              "type": "user_left",
              "payload": {
                "username": "UzytkownikKtoryWyszedl",
                "timestamp": "YYYY-MM-DDTHH:MM:SSZ" // ISO 8601 UTC
              }
            }
            ```
        *   Lista aktualnie połączonych użytkowników (np. wysyłana po dołączeniu nowego):
            ```json
            {
              "type": "user_list",
              "payload": {
                "users": ["User1", "User2", "User3"]
              }
            }
            ```
        *   Historia czatu (wysyłana do nowo połączonego klienta po uwierzytelnieniu):
            ```json
            {
              "type": "chat_history",
              "payload": {
                "messages": [
                  { "username": "User1", "text": "Wcześniejsza wiadomość 1", "timestamp": "YYYY-MM-DDTHH:MM:SSZ" }, // ISO 8601 UTC
                  { "username": "User2", "text": "Wcześniejsza wiadomość 2", "timestamp": "YYYY-MM-DDTHH:MM:SSZ" }  // ISO 8601 UTC
                ]
              }
            }
            ```
        *   **Komunikat błędu uwierzytelniania (np. błędne hasło, nick zajęty):**
            ```json
            {
              "type": "auth_error",
              "payload": {
                "reason": "Opis błędu, np. Nickname already in use. lub Invalid password."
              }
            }
            ```
        *   **Ogólny komunikat błędu (np. niepoprawny format wiadomości wysłanej przez klienta po uwierzytelnieniu, wiadomość za długa):**
            ```json
            {
              "type": "error",
              "payload": {
                "message": "Szczegółowy opis błędu skierowany do użytkownika."
              }
            }
            ```
*   **Logika serwera:**
    *   Utrzymywanie listy aktywnych połączeń/użytkowników (np. w słowniku Pythonowym).
    *   **Implementacja sprawdzania unikalności nicków i wysyłania `auth_error` w przypadku konfliktu lub błędnego hasła.**
    *   Przechowywanie historii czatu (np. w liście w pamięci serwera).
    *   Implementacja wysyłania pełnej historii czatu do nowo podłączonych i uwierzytelnionych klientów.
    *   Implementacja walidacji długości przychodzących wiadomości (limit 300 znaków).
    *   Dodawanie informacji o nadawcy (username) i znaczniku czasu (w formacie ISO 8601 UTC) do wiadomości.
    *   Rozgłaszanie (broadcast) wiadomości do wszystkich połączonych i uwierzytelnionych klientów.
    *   Obsługa rozłączania klientów i informowanie o tym pozostałych.
    *   **Obsługa nieznanych/niepoprawnych komunikatów od uwierzytelnionych klientów: ignorowanie komunikatu i logowanie ostrzeżenia do konsoli serwera.**
    *   **Podstawowe logowanie zdarzeń serwera (np. połączenia, rozłączenia, błędy) do konsoli.**
*   **Pamięć:** Tymczasowa, w pamięci RAM serwera (na potrzeby jednych zajęć).

# Klient

## Specyfikacja

1.  **Konfiguracja początkowa i połączenie:**
    *   Interfejs użytkownika powinien pozwalać na wprowadzenie:
        *   Żądanego nicka użytkownika.
        *   Hasła dostępu do serwera czatu.
    *   Po wprowadzeniu danych, klient inicjuje próbę nawiązania połączenia WebSocket z adresem serwera (który będzie podany, np. przez nauczyciela).
2.  **Proces uwierzytelniania po stronie klienta:**
    *   Po pomyślnym nawiązaniu połączenia WebSocket (zdarzenie `onopen`):
        1.  Klient automatycznie wysyła do serwera komunikat typu `auth_password` zawierający wprowadzone wcześniej hasło.
        2.  Jeśli serwer nie zakończy połączenia (co oznaczałoby błędne hasło), klient wysyła do serwera komunikat typu `auth_username` zawierający wprowadzony wcześniej nick.
3.  **Wysyłanie wiadomości:**
    *   Użytkownik ma do dyspozycji pole tekstowe do wpisywania wiadomości.
    *   Po wpisaniu wiadomości i kliknięciu przycisku "Wyślij" (lub naciśnięciu klawisza Enter w polu tekstowym), klient:
        *   Konstruuje obiekt JSON zawierający `type: "new_message"` oraz `payload: { text: "treść wiadomości" }`.
        *   Wysyła ten obiekt JSON do serwera poprzez aktywne połączenie WebSocket.
        *   Czyści pole do wpisywania wiadomości.
4.  **Odbieranie i wyświetlanie komunikatów od serwera:**
    *   Klient nasłuchuje na wiadomości przychodzące od serwera (zdarzenie `onmessage`).
    *   Każda otrzymana wiadomość (w formacie JSON) jest parsowana.
    *   Na podstawie wartości pola `type` w otrzymanym komunikacie, klient podejmuje odpowiednie działania:
        *   `auth_error`: Klient wyświetla użytkownikowi informację o błędzie (np. "Nick zajęty, spróbuj innego" lub "Błędne hasło"). Klient powinien umożliwić użytkownikowi ponowną próbę logowania (np. poprzez ponowne aktywowanie pól do wprowadzania danych logowania).
        *   `chat_history`: Klient iteruje po tablicy `messages` w `payload` i wyświetla każdą historyczną wiadomość w głównym oknie czatu. Wiadomości te powinny być wyświetlone przed ewentualnymi nowymi wiadomościami `new_message` przychodzącymi później, zachowując porządek chronologiczny.
        *   `new_message`: Wyświetla wiadomość w głównym oknie czatu. Format wyświetlania powinien zawierać: nick nadawcy, znacznik czasu (otrzymany od serwera) oraz treść wiadomości (np. "Kowalski [10:35:12]: Cześć wszystkim!").
        *   `user_joined`: Wyświetla w oknie czatu informację o dołączeniu nowego użytkownika (np. "-- Użytkownik Nowak dołączył do czatu --"). Opcjonalnie aktualizuje listę użytkowników.
        *   `user_left`: Wyświetla w oknie czatu informację o opuszczeniu czatu przez użytkownika (np. "-- Użytkownik Kowalski opuścił czat --"). Opcjonalnie aktualizuje listę użytkowników.
        *   `user_list`: (Jeśli zaimplementowano wyświetlanie listy użytkowników) Aktualizuje dedykowany obszar UI, pokazując listę nicków wszystkich obecnych na czacie.
        *   **`error`**: Klient powinien wyświetlić użytkownikowi komunikat o błędzie znajdujący się w `payload.message`. Może to być informacja np. o niepoprawnym formacie wysłanej wiadomości, przekroczeniu limitu długości itp. Klient pozostaje połączony, chyba że błąd jest krytyczny i serwer inicjuje rozłączenie.
5.  **Interfejs użytkownika (minimalne wymagania):**
    *   Wyraźne oddzielenie obszaru wpisywania wiadomości od obszaru wyświetlania konwersacji.
    *   Chronologiczne wyświetlanie wiadomości i zdarzeń (najnowsze na dole lub na górze, konsekwentnie).
    *   Możliwość przewijania historii czatu, jeśli wiadomości przekraczają widoczny obszar.
6.  **Obsługa stanu połączenia i błędów:**
    *   Klient powinien informować użytkownika o stanie połączenia (np. "Łączenie...", "Połączono", "Rozłączono").
    *   W przypadku błędów połączenia lub rozłączenia przez serwer, klient powinien wyświetlić odpowiedni komunikat.

## Architektura Klienta

*   **Technologie:**
    *   **HTML:** Struktura strony (interfejs).
    *   **CSS:** Minimalne ostylowanie dla użyteczności.
    *   **Czysty JavaScript (Vanilla JS):** Cała logika klienta.
*   **Interfejs użytkownika (UI) - podstawowe elementy:**
    *   Pola do wprowadzenia nazwy użytkownika (nicka) i hasła serwera.
    *   Główne okno czatu do wyświetlania wiadomości.
    *   Pole tekstowe (`<input type="text">`) do wpisywania nowych wiadomości.
    *   Przycisk "Wyślij" (`<button>`).
    *   Opcjonalnie: Lista połączonych użytkowników.
*   **Logika Klienta (JavaScript):**
    *   Pobranie od użytkownika nicka i hasła serwera.
    *   Nawiązanie połączenia WebSocket z serwerem AWS (np. `ws://adres-aws-ec2:port`).
    *   Obsługa zdarzenia `onopen`:
        1. Wysłanie do serwera komunikatu `auth_password` z hasłem.
        2. Jeśli połączenie nie zostało zerwane przez serwer, wysłanie komunikatu `auth_username` z nickiem.
    *   Obsługa zdarzenia `onmessage` (przychodzące wiadomości od serwera):
        *   Parsowanie wiadomości JSON.
        *   Dynamiczne aktualizowanie UI na podstawie typu wiadomości (`auth_error`, `chat_history`, `new_message`, `user_joined`, `user_left`, `user_list`, `error`).
    *   Obsługa wysyłania wiadomości:
        *   Konstrukcja obiektu JSON i wysłanie przez WebSocket.
    *   Obsługa błędów (`onerror`) i zamknięcia połączenia (`onclose`).



