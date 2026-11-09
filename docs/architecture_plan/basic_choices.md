# Podstawowe Wybory Architektoniczne i Wymagania Niefunkcjonalne

Dokument ten opisuje kluczowe decyzje technologiczne i wymagania niefunkcjonalne dla projektu AI-Powered Team Chat, uwzględniając specyficzne środowisko pracy (sala szkolna, Windows, Visual Studio) oraz cele edukacyjne.

## 1. Kontekst i Główne Założenia

- **Środowisko:** Aplikacja będzie uruchamiana i rozwijana na komputerach z systemem Windows, z wykorzystaniem Visual Studio i środowiska Python.
- **Prostota Wdrożenia:** Konfiguracja i uruchomienie zarówno klienta, jak i serwera muszą być maksymalnie proste, aby zminimalizować problemy techniczne i pozwolić skupić się na nauce programowania.
- **Lokalne Uruchomienie:** W początkowej fazie każdy uczeń będzie uruchamiał serwer i klienta na swoim własnym komputerze (`localhost`).
- **Zrozumiałość Kodu:** Kod powinien być czytelny i dobrze zorganizowany, aby służyć jako materiał edukacyjny.

## 2. Stos Technologiczny

### Backend

- **Język:** **Python**
- **Framework:** **FastAPI**
  - **Uzasadnienie:** Nowoczesny, wysoce wydajny framework, idealny do budowy API i obsługi WebSockets. Jego kluczową zaletą w kontekście edukacyjnym jest automatycznie generowana, interaktywna dokumentacja (Swagger UI/ReDoc), która ułatwi uczniom zrozumienie i testowanie API.
- **Serwer Aplikacji (ASGI):** **Uvicorn**
  - **Uzasadnienie:** Standardowy, lekki i szybki serwer dla aplikacji opartych na FastAPI. Sprawdzony w istniejącym prototypie.
- **Zależności:** Zarządzane przez `pip` i plik `requirements.txt`. Podstawowe biblioteki to `fastapi` i `uvicorn`.

### Frontend

- **Technologie:** **HTML, CSS, Vanilla JavaScript (czysty JS)**
  - **Uzasadnienie:** Wyeliminowanie potrzeby stosowania skomplikowanych narzędzi do budowania (np. Node.js, npm, webpack) i frameworków (np. React, Vue). Uczniowie mogą po prostu otworzyć plik `index.html` w przeglądarce. Takie podejście pozwala skupić się na fundamentalnych technologiach webowych: strukturze (HTML), wyglądzie (CSS) i logice (JS) oraz na komunikacji z backendem.

### Baza Danych

- **System:** **SQLite**
  - **Uzasadnienie:** Jest to silnik bazy danych oparty na pliku, wbudowany w standardową bibliotekę Pythona (moduł `sqlite3`). Nie wymaga instalacji ani administracji oddzielnym serwerem, co jest idealne dla lokalnego środowiska deweloperskiego. Baza danych będzie po prostu plikiem w katalogu projektu, co znacząco upraszcza konfigurację. Jest w pełni wystarczająca do przechowywania użytkowników, kanałów i historii wiadomości na potrzeby tego projektu.

## 3. Podsumowanie Propozycji

Wybrany stos technologiczny (`FastAPI` + `Uvicorn` + `SQLite` po stronie serwera oraz `Vanilla JS` po stronie klienta) stanowi optymalny kompromis między nowoczesnością i wydajnością a prostotą konfiguracji i wdrożenia w środowisku edukacyjnym. Pozwoli to na efektywną naukę kluczowych koncepcji tworzenia aplikacji klient-serwer.

---

## 4. Słowniczek Podstawowych Pojęć

-   **Backend**: "Zaplecze" aplikacji, czyli część działająca na serwerze, niewidoczna bezpośrednio dla użytkownika. Odpowiada za logikę, przetwarzanie danych, komunikację z bazą danych i obsługę zapytań od klientów. W naszym projekcie backendem jest aplikacja napisana w Pythonie z użyciem FastAPI.

-   **Frontend**: "Front" aplikacji, czyli część, z którą użytkownik ma bezpośrednią interakcję. Jest to wszystko, co widać w przeglądarce internetowej – przyciski, pola tekstowe, wiadomości. W naszym projekcie frontendem jest plik `index.html` wraz z kodem CSS i JavaScript.

-   **Klient-Serwer**: Model architektury, w którym zadania są rozdzielone między dostawców usług (serwery) a odbiorców usług (klientów). Klient wysyła żądanie do serwera, a serwer przetwarza je i odsyła odpowiedź. Nasza aplikacja czatu działa dokładnie w tym modelu.

-   **Framework**: Zestaw gotowych narzędzi, bibliotek i komponentów, który narzuca pewną strukturę i ułatwia tworzenie aplikacji. Zamiast pisać wszystko od zera, używamy frameworka (np. FastAPI), który dostarcza nam gotowe rozwiązania dla typowych problemów, np. obsługi zapytań sieciowych.

-   **Baza Danych (Database)**: Zorganizowany zbiór danych przechowywany w formie elektronicznej. Służy do trwałego zapisywania, odczytywania i zarządzania informacjami, takimi jak lista użytkowników, historia wiadomości czy kanały. W naszym projekcie używamy prostej, plikowej bazy danych SQLite.

-   **API (Application Programming Interface)**: Sposób, w jaki frontend komunikuje się z backendem. To jak "menu w restauracji" – określa, o co klient (frontend) może poprosić serwer (backend) i co otrzyma w odpowiedzi. Nasze API WebSocket definiuje wszystkie możliwe interakcje w czacie.
