Oto seria szczegółowych pytań (promptów), które można zadać asystentowi AI, aby odtworzyć proces tworzenia prototypu aplikacji typu Discord:

---

### Pytanie 1: Tworzenie Wymagań Funkcjonalnych (User Stories)

**Cel:** Stworzenie pliku `funkcjonalne.md` z listą historyjek użytkownika.

**Szczegółowy prompt:**

"Dzień dobry, pracujemy nad stworzeniem prostego, klikalnego prototypu aplikacji webowej, która ma symulować podstawowe działanie Discorda. Na tym etapie będziemy używać wyłącznie HTML, CSS i JavaScript, bez backendu.

Proszę, wciel się w rolę Product Managera i przygotuj listę kluczowych historyjek użytkownika (User Stories) dla tego prototypu. Skup się na absolutnym minimum potrzebnym, aby pokazać główną koncepcję aplikacji. Historyjki powinny objąć następujące obszary:
1.  **Zarządzanie kontem:** Logowanie i rejestracja (symulowane). Ekran logowania powinien pozwalać na wejście bez weryfikacji danych, a próba rejestracji powinna wyświetlać komunikat "Funkcja niedostępna w prototypie".
2.  **Nawigacja:** Przeglądanie listy serwerów i kanałów.
3.  **Komunikacja:** Wysyłanie i odczytywanie wiadomości na kanale.
4.  **Społeczność:** Widok listy użytkowników na serwerze.

Wyniki zapisz w nowym pliku o nazwie `funkcjonalne.md`"

---

### Pytanie 2: Tworzenie Wymagań Niefunkcjonalnych

**Cel:** Stworzenie pliku `niefunkcjonalne.md` z listą wymagań jakościowych.

**Szczegółowy prompt:**

"Teraz, bazując na tym, że tworzymy prototyp front-endowy, proszę o przygotowanie listy wymagań niefunkcjonalnych. Powinny one określać, 'jak' aplikacja ma działać, a nie 'co' ma robić.

Skup się na następujących aspektach:
1.  **Użyteczność (Usability):** Interfejs ma być intuicyjny, atrakcyjny wizualnie i spójny. Należy jawnie wspomnieć o klasycznym, trójkolumnowym layoucie (serwery, kanały, czat).
2.  **Wydajność (Performance):** Interfejs użytkownika musi reagować natychmiastowo na akcje (bez opóźnień).
3.  **Kompatybilność (Compatibility):** Prototyp musi działać w najnowszych wersjach głównych przeglądarek (Chrome, Firefox, Safari, Edge).
4.  **Jakość Kodu (Code Quality):** Podkreśl konieczność separacji warstw (HTML, CSS, JS) oraz utrzymania czystej i zorganizowanej struktury plików.
5.  **Technologia:** Prototyp ma być w pełni po stronie klienta (client-side), wykorzystując wyłącznie czysty HTML, CSS i JavaScript. Nie będzie żadnego backendu, a aplikacja będzie uruchamiana lokalnie poprzez otwarcie pliku `index.html` w przeglądarce.

Wyniki zapisz w nowym pliku o nazwie `niefunkcjonalne.md` w katalogu `project/lekcja_4/`."

---

### Pytanie 3: Projektowanie Architektury Front-endu

**Cel:** Stworzenie pliku `architektura.md` z opisem organizacji kodu.

**Szczegółowy prompt:**

"Mamy już zdefiniowane wymagania funkcjonalne i niefunkcjonalne. Teraz potrzebujemy planu technicznego. Proszę o przygotowanie dokumentu opisującego proponowaną architekturę i organizację kodu dla naszego prototypu.

Dokument powinien zawierać:
1.  **Strukturę Plików:** Zaproponuj logiczny podział na foldery i pliki (`index.html`, folder `css/` z `style.css`, folder `js/`). W folderze `js/` wydziel osobne pliki na:
    *   **Stan aplikacji (dane):** np. `state.js` (plik ten będzie przechowywał statyczne, 'udawane' dane, takie jak lista serwerów, kanałów i wiadomości, ponieważ nie mamy backendu)
    *   **Manipulację UI (renderowanie):** np. `ui.js`
    *   **Główną logikę i zdarzenia:** np. `main.js`
2.  **Podział Odpowiedzialności:** Opisz krótko, za co będzie odpowiedzialny każdy z tych plików.
3.  **Przepływ Danych:** Wyjaśnij w prosty sposób, jak będzie działać interakcja, np. na przykładzie kliknięcia w kanał (Akcja użytkownika -> Aktualizacja stanu -> Ponowne renderowanie widoku).

Wyniki zapisz w nowym pliku o nazwie `architektura.md` w katalogu `project/lekcja_4/`."

---

### Pytanie 4: Planowanie i Realizacja Implementacji

**Cel:** Stworzenie listy zadań i wykonanie prototypu.

**Szczegółowy prompt:**

"Doskonale. Mamy kompletny plan. Proszę teraz o stworzenie listy zadań (to-do list), która krok po kroku przeprowadzi nas przez proces implementacji prototypu w czystym HTML, CSS i JavaScript, bazując na przygotowanej architekturze. Pamiętaj, że końcowy rezultat powinien być atrakcyjny wizualnie i w pełni 'klikalny', zgodnie z naszymi wymaganiami.

Następnie, po stworzeniu listy, proszę o natychmiastowe rozpoczęcie realizacji planu. Wykonuj zadania po kolei, informując mnie o ukończeniu każdego kroku i aktualizując status na liście. Zacznij od stworzenia struktury plików, a skończ na finalnym stylowaniu komponentów."
