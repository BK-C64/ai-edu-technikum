# Plan projektu: AI-Driven Frontend Development: Budujemy klienta czatu

**Główne założenie:** Nauczyciel dostarcza w pełni działający serwer (backend) oraz jego dokumentację (API). Uczniowie, pracując w grupach, wcielają się w rolę zespołu produktowego, którego zadaniem jest zaprojektowanie, zdefiniowanie wymagań i zlecenie AI stworzenia interfejsu użytkownika (frontendu) do obsługi tego serwera.

---

### Plan w 10 lekcjach

**Lekcja 1: Kick-off – Jesteśmy Zespołem Produktowym!**
*   **Wprowadzenie teoretyczne (15 min):**
    *   Czym jest architektura Klient-Serwer? (metafora restauracji: klient, kelner, kuchnia).
    *   Czym jest API? Analiza dostarczonej przez nauczyciela dokumentacji API – nasz "kontrakt" z backendem.
    *   Role w zespole: Product Manager (decyduje "co" robimy), Projektant UX/UI ("jak to ma wyglądać i działać"), AI-Developer ("wykonawca kodu").
*   **Zadanie praktyczne (30 min):**
    1.  Podział na grupy. Każda grupa zapoznaje się z dokumentacją API.
    2.  Burza mózgów: wymyślenie unikalnej nazwy i krótkiego opisu dla swojej aplikacji.
    3.  Na kartce papieru lub w prostym narzędziu online (np. Excalidraw) grupa szkicuje bardzo uproszczony wygląd głównego okna aplikacji (tzw. *wireframe*). Gdzie będą kanały? Gdzie wiadomości? Gdzie pole do wpisywania tekstu?
*   **Wynik:** Każda grupa ma nazwę dla projektu i szkic interfejsu, który będzie podstawą do dalszej pracy.

**Lekcja 2: Statyczny Szkielet – Pierwsze HTML i CSS**
*   **Wprowadzenie teoretyczne (15 min):**
    *   HTML jako szkielet strony (znaczniki `<div>`, `<h1>`, `<input>`, `<button>`).
    *   CSS jako "ubranie" dla szkieletu (podstawy stylów: `color`, `background-color`, `font-size` oraz wstęp do `Flexbox` jako metody układania elementów).
*   **Zadanie praktyczne (30 min):**
    *   Na podstawie szkicu z poprzedniej lekcji, grupa tworzy w języku naturalnym **specyfikację (prompt) dla AI**.
    *   *Przykład:* "Stwórz plik `index.html` i `style.css`. Układ ma mieć pionowy pasek boczny po lewej na listę kanałów (szerokość 25%) i główny obszar po prawej na wiadomości. Na dole głównego obszaru umieść pole tekstowe i przycisk 'Wyślij'. Użyj odcieni szarości i niebieskiego."
    *   Grupa weryfikuje wygenerowany przez AI kod, prosząc o poprawki, aż efekt wizualny będzie zadowalający.
*   **Wynik:** Statyczna, nieklikalna strona HTML/CSS, która wizualnie przypomina aplikację czatu.

**Lekcja 3: Ożywiamy Stronę – Wprowadzenie do JavaScript i DOM**
*   **Wprowadzenie teoretyczne (15 min):**
    *   Czym jest JavaScript i DOM (Document Object Model)? Drzewo dokumentu.
    *   Jak "chwytać" elementy HTML w JavaScripcie (`document.querySelector`).
    *   Jak reagować na akcje użytkownika (`addEventListener` dla kliknięcia przycisku).
    *   Narzędzie każdego dewelopera: `console.log()` do debugowania.
*   **Zadanie praktyczne (30 min):**
    *   Grupa definiuje zadanie dla AI: "Napisz skrypt `main.js`. Po kliknięciu przycisku 'Wyślij', pobierz tekst z pola do wpisywania wiadomości, wyświetl go w konsoli przeglądarki, a następnie wyczyść pole tekstowe."
*   **Wynik:** Użytkownik może wpisać tekst, kliknąć przycisk, a wpisana treść pojawia się w konsoli deweloperskiej przeglądarki.

**Lekcja 4: Rozmowa z Serwerem – Poznajemy `fetch` API**
*   **Wprowadzenie teoretyczne (15 min):**
    *   Programowanie asynchroniczne – dlaczego strona się nie zawiesza, czekając na odpowiedź?
    *   API `fetch` do wysyłania zapytań do serwera.
    *   JSON jako uniwersalny język komunikacji między klientem a serwerem.
    *   Zakładka "Network" w narzędziach deweloperskich przeglądarki.
*   **Zadanie praktyczne (30 min):**
    *   Grupa odnajduje w dokumentacji API endpoint do pobierania listy kanałów (np. `GET /api/channels`).
    *   Zleca AI zadanie: "W skrypcie `main.js`, zaraz po załadowaniu strony, wyślij zapytanie `GET` na adres `/api/channels` używając `fetch`, a otrzymaną listę kanałów w formacie JSON wyświetl w konsoli."
*   **Wynik:** Po otwarciu strony, w konsoli pojawia się lista kanałów pobrana prosto z serwera nauczyciela.

**Lekcja 5: Dynamiczny Interfejs – Renderowanie Danych**
*   **Wprowadzenie teoretyczne (15 min):**
    *   Jak dynamicznie tworzyć elementy HTML za pomocą JavaScript (`document.createElement`, `element.appendChild`).
    *   Użycie pętli (`for...of`) do iteracji po tablicy danych z API i generowania na jej podstawie listy elementów.
*   **Zadanie praktyczne (30 min):**
    *   Grupa rozwija poprzednie zadanie: "Pobraną z serwera listę kanałów wykorzystaj do dynamicznego wypełnienia paska bocznego. Usuń statyczne elementy z HTML. Dla każdego kanału z listy stwórz nowy element `<div>` z jego nazwą i dodaj go do paska bocznego."
*   **Wynik:** Lista kanałów w aplikacji nie jest już statyczna, lecz dynamicznie generowana na podstawie danych z serwera.

**Lekcja 6: Interakcja z Użytkownikiem – Logowanie i Wyświetlanie Wiadomości**
*   **Wprowadzenie teoretyczne (15 min):**
    *   Obsługa formularzy HTML w JavaScript.
    *   Wysyłanie danych na serwer – zapytania `POST` za pomocą `fetch`.
    *   Analiza endpointów API do logowania (`POST /api/login`) i pobierania wiadomości (`GET /api/channels/{id}/messages`).
*   **Zadanie praktyczne (30 min):**
    1.  Grupa projektuje i zleca AI stworzenie prostego formularza logowania (może być ukryty i pokazywać się na starcie).
    2.  Zleca AI logikę: "Po wysłaniu formularza, wyślij nazwę użytkownika na endpoint `/api/login`. Po udanej odpowiedzi, ukryj formularz i pobierz wiadomości dla domyślnego kanału (np. o ID 1), a następnie wyświetl je w głównym oknie czatu."
*   **Wynik:** Działa prosty system logowania. Po wpisaniu nazwy użytkownika, aplikacja pobiera i wyświetla wiadomości z pierwszego kanału.

**Lekcja 7: Poczucie Czasu Rzeczywistego – Wysyłanie i Odświeżanie**
*   **Wprowadzenie teoretyczne (15 min):**
    *   Czym jest *polling*? Najprostszy sposób na "udawanie" czasu rzeczywistego.
    *   Funkcja `setInterval` do cyklicznego wykonywania kodu co kilka sekund.
*   **Zadanie praktyczne (30 min):**
    1.  Grupa modyfikuje logikę przycisku "Wyślij": "Zamiast logować do konsoli, tekst wiadomości wyślij za pomocą `POST` na endpoint `/api/channels/{id}/messages`."
    2.  Grupa zleca AI implementację odświeżania: "Użyj `setInterval`, aby co 3 sekundy automatycznie pobierać listę wiadomości dla aktywnego kanału i odświeżać widok czatu."
*   **Wynik:** Użytkownicy mogą wysyłać wiadomości, a okno czatu odświeża się automatycznie, pokazując nowe wiadomości od innych.

**Lekcja 8: Pełna Nawigacja – Zmiana Kanałów**
*   **Wprowadzenie teoretyczne (15 min):**
    *   Zarządzanie "stanem" aplikacji – jak zapamiętać, który kanał jest aktualnie aktywny (np. w zmiennej `let currentChannelId`).
    *   Aktualizacja UI w odpowiedzi na zmianę stanu.
*   **Zadanie praktyczne (30 min):**
    *   Zlecenie dla AI: "Do każdego elementu na liście kanałów dodaj `addEventListener`. Po kliknięciu na kanał: 1. Zapisz jego ID w zmiennej `currentChannelId`. 2. Wyczyść okno wiadomości. 3. Pobierz i wyświetl wiadomości dla nowo wybranego kanału. 4. Zmodyfikuj pętlę `setInterval`, aby od teraz odświeżała wiadomości dla kanału o ID z tej zmiennej."
*   **Wynik:** Aplikacja jest w pełni interaktywna. Użytkownik może klikać na różne kanały, aby czytać i pisać wiadomości w każdym z nich.

**Lekcja 9: Szlifowanie Krawędzi – Poprawki UX (User Experience)**
*   **Wprowadzenie teoretyczne (15 min):**
    *   Czym jest UX? Dlaczego małe rzeczy mają znaczenie? (np. informacja zwrotna dla użytkownika, czytelne daty, płynność działania).
*   **Zadanie praktyczne (30 min):**
    *   Każda grupa wybiera co najmniej dwie z poniższych poprawek i definiuje wymagania dla AI, aby je zaimplementować:
        *   "Po załadowaniu nowych wiadomości, widok czatu powinien automatycznie przewinąć się na sam dół."
        *   "Przy każdej wiadomości wyświetl jej datę i godzinę w formacie `HH:MM`."
        *   "Po zalogowaniu, wyświetl nazwę aktywnego użytkownika w rogu ekranu."
        *   "Gdy użytkownik wyśle wiadomość, przycisk 'Wyślij' powinien być na chwilę zablokowany, aby zapobiec podwójnemu wysłaniu."
*   **Wynik:** Aplikacja działa płynniej i jest bardziej przyjazna dla użytkownika.

**Lekcja 10: Wielki Finał – Prezentacje i "Code Review"**
*   **Wprowadzenie teoretyczne (10 min):**
    *   Podsumowanie projektu i zdobytych umiejętności. Znaczenie prezentacji (demo) i przeglądów kodu (*code review*) w prawdziwej pracy.
*   **Zadanie praktyczne (35 min):**
    *   Każda grupa prezentuje na forum klasy swoją finalną aplikację.
    *   Omawia, które zadania były najciekawsze, a które najtrudniejsze.
    *   **Najważniejszy element:** Grupa wybiera jeden fragment kodu JavaScript wygenerowany przez AI (np. funkcję `fetch` lub pętlę `setInterval`) i, z pomocą nauczyciela, tłumaczy całej klasie, co dokładnie robi każda linijka. To cementuje zrozumienie kodu, a nie tylko jego generowanie.
*   **Wynik:** Uczniowie prezentują ukończone projekty i ćwiczą umiejętność czytania i rozumienia kodu napisanego przez AI.
