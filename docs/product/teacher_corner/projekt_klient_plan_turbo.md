# Plan projektu (Turbo): Rapid Prototyping with AI: Building a Real-Time Chat MVP

**Główne założenie:** Działamy jak startup. Naszym celem jest jak najszybsze dostarczenie działającego produktu (MVP - Minimum Viable Product). Uczniowie wcielają się w rolę product ownerów i technical leadów. Definiują epiki (duże funkcje) i zlecają ich implementację AI, weryfikując efekty na bieżąco.

---

### Plan w 5 supersprintach (każdy na 1-2 zajęcia)

**Sprint 1: "Walking Skeleton" – Od zera do działającego widoku czatu w 90 minut**
*   **Cel:** Stworzenie kompletnego, choć minimalnego, "szkieletu" aplikacji. Użytkownik ma zobaczyć listę kanałów i wiadomości, które pochodzą z serwera. Aplikacja nie musi być jeszcze piękna ani w pełni interaktywna.
*   **Wprowadzenie teoretyczne "Just-in-Time" (10 min):** Czym jest "end-to-end"? Krótka demonstracja osi: `API Server -> fetch() w JS -> Dynamiczny HTML`.
*   **Zadanie dla AI (Epic): "Stwórz szkielet aplikacji czatu"**
    *   **User Story 1:** "Jako użytkownik, chcę zobaczyć na ekranie głównym listę kanałów pobraną z endpointu `GET /api/channels`, aby móc nawigować po aplikacji."
    *   **User Story 2:** "Jako użytkownik, chcę, aby po załadowaniu aplikacji automatycznie wyświetliły się wiadomości z pierwszego kanału na liście (endpoint `GET /api/channels/{id}/messages`), abym od razu widział treść rozmowy."
    *   **User Story 3:** "Jako użytkownik, po kliknięciu na inny kanał z listy, chcę zobaczyć w głównym oknie wiadomości należące do tego kanału, aby móc przełączać się między rozmowami."
*   **Wynik SPRINTU:** Działająca, "klikalna" aplikacja, która w całości opiera się na danych z serwera. Wyświetla kanały i wiadomości. Nie można się jeszcze logować ani wysyłać wiadomości.

**Sprint 2: Pełna interakcja – Logowanie, wysyłanie i "udawany" real-time**
*   **Cel:** Umożliwienie użytkownikom realnego uczestnictwa w czacie.
*   **Wprowadzenie teoretyczne (10 min):** Różnica między `GET` a `POST`. Jak wysyłać dane (JSON) w ciele zapytania `fetch`. Czym jest `setInterval` i dlaczego to najprostsza droga do "live data".
*   **Zadanie dla AI (Epic): "Implementacja interakcji użytkownika"**
    *   **User Story 1:** "Jako użytkownik, chcę mieć prosty formularz logowania (tylko nazwa użytkownika), abym mógł dołączyć do czatu. Dane mają być wysłane na `POST /api/login`."
    *   **User Story 2:** "Jako zalogowany użytkownik, chcę móc wpisać wiadomość w pole tekstowe i wysłać ją na aktywny kanał (przycisk 'Wyślij' ma uruchomić `POST /api/channels/{id}/messages`)."
    *   **User Story 3:** "Jako użytkownik, chcę, aby widok wiadomości na moim aktywnym kanale odświeżał się automatycznie co 3 sekundy, abym widział nowe wiadomości od innych bez przeładowywania strony."
*   **Wynik SPRINTU:** W pełni funkcjonalny czat. Użytkownicy mogą się logować, przełączać między kanałami, pisać i czytać wiadomości, które pojawiają się niemal "na żywo".

**Sprint 3: UX/UI & State Management – Aplikacja, z której chce się korzystać**
*   **Cel:** Przekształcenie działającego prototypu w dopracowany produkt.
*   **Wprowadzenie teoretyczne (10 min):** Czym jest "stan aplikacji"? Jak `localStorage` pozwala "pamiętać" wybory użytkownika. Krótko o dobrych praktykach UX.
*   **Zadanie dla AI (Epic): "Poprawa doświadczenia użytkownika"**
    *   **User Story 1:** "Jako użytkownik, chcę, aby po dodaniu nowej wiadomości widok czatu automatycznie przewijał się na dół."
    *   **User Story 2:** "Jako użytkownik, chcę mieć możliwość przełączania motywu aplikacji między jasnym a ciemnym. Mój wybór powinien zostać zapamiętany, nawet jeśli odświeżę stronę."
    *   **User Story 3:** "Jako użytkownik, chcę widzieć listę osób aktualnie zalogowanych na danym kanale (wymaga to od nauczyciela przygotowania endpointu, np. `GET /api/channels/{id}/users`)."
    *   **User Story 4:** "Jako użytkownik, chcę, aby daty wiadomości były wyświetlane w bardziej przyjaznym formacie (np. `dziś o 14:37`)."
*   **Wynik SPRINTU:** Aplikacja jest nie tylko funkcjonalna, ale też estetyczna, intuicyjna i oferuje elementy personalizacji.

**Sprint 4: Refaktoryzacja i Architektura – Myślimy jak inżynierowie**
*   **Cel:** Zrozumienie, że działający kod to nie wszystko. Musi być też dobrze zorganizowany.
*   **Wprowadzenie teoretyczne (10 min):** Dlaczego trzymanie całego kodu w jednym pliku to zły pomysł? Wprowadzenie do modułów JavaScript (`import`/`export`). Idea separacji logiki (np. `api.js` do rozmowy z serwerem, `ui.js` do manipulacji DOM).
*   **Zadanie dla AI (Epic): "Uporządkowanie bazy kodu"**
    *   **User Story 1:** "Wydziel całą logikę odpowiedzialną za komunikację z serwerem (wszystkie wywołania `fetch`) do osobnego pliku `api.js`. Każda funkcja w tym pliku ma odpowiadać jednemu endpointowi."
    *   **User Story 2:** "Wydziel funkcje odpowiedzialne za renderowanie HTML (np. tworzenie listy kanałów, renderowanie wiadomości) do osobnego pliku `ui.js`."
    *   **User Story 3:** "Stwórz główny plik `app.js`, który importuje moduły `api` i `ui`, i jedynie orkiestruje przepływem danych (np. pobiera dane przez `api.js` i przekazuje je do wyrenderowania przez `ui.js`)."
*   **Wynik SPRINTU:** Aplikacja działa dokładnie tak samo jak wcześniej, ale jej wewnętrzna struktura jest profesjonalna, modułowa i łatwa do dalszego rozwoju. Uczniowie uczą się kluczowej koncepcji inżynierii oprogramowania.

**Sprint 5: Skok w przyszłość – Wprowadzenie do frameworka i prawdziwy real-time**
*   **Cel:** Zobaczyć, jak problemy, które rozwiązaliśmy "ręcznie", są rozwiązywane przez nowoczesne narzędzia.
*   **Wprowadzenie teoretyczne (10 min):** Czym jest "reaktywność" w frameworkach (np. React/Vue)? Koncepcja "stanu" i automatycznej aktualizacji UI. Krótkie wprowadzenie do WebSockets jako alternatywy dla `setInterval`.
*   **Zadanie dla AI (Epic): "Modernizacja stosu technologicznego"**
    *   **User Story 1 (opcja A - Framework):** "Przepisz komponent odpowiedzialny za wyświetlanie listy wiadomości, używając biblioteki Preact (lekki odpowiednik Reacta). Stan (tablica wiadomości) ma być trzymany w komponencie, a UI ma się automatycznie aktualizować po jego zmianie."
    *   **User Story 2 (opcja B - WebSockets):** "Zastąp mechanizm odpytywania (`setInterval`) prawdziwą komunikacją real-time. Połącz się z serwerem WebSocket (nauczyciel musi udostępnić adres `ws://...`) i nasłuchuj na wiadomości 'new_message'. Gdy taka wiadomość nadejdzie, dodaj ją do widoku czatu."
*   **Wynik SPRINTU:** Uczniowie mają styczność z technologiami o poziom wyżej niż podstawowy JavaScript, co daje im ogromną przewagę i pokazuje, w jakim kierunku mogą się dalej rozwijać.

