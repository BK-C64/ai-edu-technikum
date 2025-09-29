# Specyfikacja Produktowa: MyDiscord "AI-Powered Team Chat"

## Wprowadzenie

Ten dokument opisuje funkcjonalność prostej, edukacyjnej aplikacji czatu "MyDiscord". Celem jest stworzenie narzędzia do komunikacji dla małych grup, które będzie jednocześnie praktycznym przykładem budowy nowoczesnej aplikacji webowej. Projekt skupia się na przejrzystości kodu i demonstracji kluczowych technologii, a nie na zaawansowanej skalowalności.

---

## 1. Zarządzanie Użytkownikami

### Opis Funkcjonalności

System musi umożliwiać nowym użytkownikom założenie konta, a obecnym logowanie się do aplikacji. Procesy te powinny być bezpieczne i intuicyjne. Po zalogowaniu aplikacja musi "pamiętać" użytkownika podczas jego sesji.

### Historyjki Użytkownika (User Stories)

*   **Jako nowy użytkownik,** chcę móc się zarejestrować, podając unikalną nazwę i hasło, aby uzyskać dostęp do aplikacji.
*   **Jako zarejestrowany użytkownik,** chcę móc się zalogować przy użyciu mojej nazwy i hasła, aby rozpocząć korzystanie z czatu.
*   **Jako nowy użytkownik,** chcę otrzymać komunikat o błędzie, jeśli podczas rejestracji moja nazwa użytkownika jest juz zajeta, będzie krótsza niż 3 znaki lub hasło krótsze niż 8 znaków, aby tworzyć bezpieczniejsze konta.
*   **Jako użytkownik,** chcę, aby moje hasło było bezpiecznie przechowywane (haszowane), aby chronić moje konto przed nieautoryzowanym dostępem.
*   **Jako zalogowany użytkownik,** chcę, aby aplikacja utrzymywała moją sesję, abym nie musiał logować się ponownie przy każdym odświeżeniu strony.

---

## 2. Zarządzanie Kanałami Komunikacyjnymi

### Opis Funkcjonalności

Aplikacja powinna pozwalać użytkownikom na tworzenie tematycznych "pokoi" do rozmów, zwanych kanałami. Użytkownicy powinni mieć możliwość przeglądania dostępnych kanałów i tworzenia nowych.

### Historyjki Użytkownika (User Stories)

*   **Jako zalogowany użytkownik,** chcę widzieć listę wszystkich dostępnych kanałów, aby móc dołączyć do istniejącej dyskusji.
*   **Jako zalogowany użytkownik,** chcę mieć możliwość stworzenia nowego kanału tematycznego, aby zainicjować nową rozmowę na konkretny temat.
*   **Jako użytkownik,** chcę, aby po wejściu do kanału jego nazwa była wyraźnie widoczna, abym wiedział, gdzie aktualnie się znajduję.

---

## 3. Komunikacja w Czasie Rzeczywistym

### Opis Funkcjonalności

Główną funkcją aplikacji jest wysyłanie i odbieranie wiadomości w ramach wybranego kanału. Komunikacja powinna odbywać się w czasie rzeczywistym, bez konieczności ręcznego odświeżania strony. Wiadomości powinny być powiązane z autorem i kanałem, w którym zostały wysłane.

### Historyjki Użytkownika (User Stories)

*   **Jako użytkownik w kanale,** chcę móc wysłać wiadomość tekstową, aby podzielić się informacjami z innymi uczestnikami.
*   **Jako użytkownik w kanale,** chcę widzieć wiadomości od innych użytkowników pojawiające się automatycznie (na żywo), abym mógł prowadzić płynną rozmowę.
*   **Jako użytkownik przeglądający wiadomości,** chcę widzieć, kto jest autorem każdej wiadomości oraz kiedy została wysłana, aby mieć pełen kontekst rozmowy.
*   **Jako użytkownik,** chcę, aby po przełączeniu się między kanałami wyświetlała się historia wiadomości tylko z tego aktywnego kanału.

---

## 4. Interfejs Użytkownika i Doświadczenie

### Opis Funkcjonalności

Interfejs aplikacji powinien być przejrzysty i estetyczny. Użytkownik powinien w łatwy sposób móc nawigować między kanałami, widzieć okno czatu oraz listę osób aktywnych na danym kanale.

### Historyjki Użytkownika (User Stories)

*   **Jako użytkownik,** chcę widzieć listę użytkowników, którzy są aktualnie online na kanale, na którym przebywam, aby wiedzieć, z kim mogę rozmawiać.
*   **Jako użytkownik,** chcę otrzymywać wizualne powiadomienie (np. migający tytuł karty przeglądarki), gdy na nieaktywnym kanale pojawi się nowa wiadomość, aby nie przegapić ważnych informacji.
*   **Jako użytkownik,** chcę mieć możliwość prostej personalizacji wyglądu aplikacji (np. wybór między jasnym a ciemnym motywem), aby dostosować ją do swoich preferencji.
*   **Jako użytkownik,** chcę widzieć proste statystyki kanału (np. liczba wiadomości, liczba użytkowników), aby szybko ocenić jego aktywność.

---

### 4.5. Angażowanie Użytkownika i Personalizacja

#### Opis Funkcjonalności

Aby aplikacja była bardziej przyjazna i angażująca, dodamy proste elementy personalizacji oraz interakcji, które poprawią ogólne wrażenia z użytkowania.

#### Historyjki Użytkownika (User Stories)

*   **Jako użytkownik,** chcę mieć możliwość wybrania prostego awatara z predefiniowanej listy, aby inni mogli mnie łatwiej rozpoznać na czacie.
*   **Jako użytkownik,** chcę otrzymywać subtelne, wizualne potwierdzenie (np. chwilowa zmiana koloru tła wiadomości), że moja wiadomość została wysłana, abym miał pewność, że dotarła.
*   **Jako użytkownik,** chcę słyszeć opcjonalny, krótki dźwięk powiadomienia, gdy ktoś wyśle wiadomość na kanale, na którym jestem aktywny, abym nie przegapił nowych treści, gdy nie patrzę na ekran.

---

## 5. Architektura i Wdrożenie

### Opis Funkcjonalności

Aplikacja zostanie "opakowana" w kontenery Docker, aby pokazać, jak w praktyce wygląda nowoczesne wdrożenie. Celem jest zapewnienie, że aplikacja działa tak samo na komputerze lokalnym, jak i na serwerze, co jest kluczową umiejętnością dla programistów. Nie skupiamy się na obsłudze dużego ruchu, lecz na poprawności i powtarzalności procesu wdrożenia.

### Historyjki Użytkownika (User Stories)

*   **Jako deweloper,** chcę, aby cała aplikacja (backend, baza danych, serwer proxy) mogła być uruchomiona lokalnie za pomocą jednej komendy (`docker-compose up`), aby uprościć proces rozwoju i testowania.
*   **Jako deweloper,** chcę, aby aplikacja korzystała z prostej bazy danych (SQLite lokalnie, PostgreSQL w Dockerze) jako przykładu integracji z warstwą danych.
*   **Jako deweloper,** chcę, aby dane w bazie danych były trwałe i nie znikały po restarcie kontenera, aby zademonstrować mechanizm wolumenów w Dockerze.
