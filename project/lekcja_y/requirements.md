# Wymagania Funkcjonalne dla Lekcji 1: Interfejs i Połączenie

Dokument ten precyzuje wymagania funkcjonalne i biznesowe dla pierwszego etapu prac nad aplikacją.

## 1. Cel Biznesowy / Uzasadnienie

Stworzenie fundamentalnej, widocznej dla użytkownika warstwy aplikacji oraz nawiązanie podstawowej komunikacji z serwerem. Krok ten jest niezbędny do rozpoczęcia jakichkolwiek dalszych prac nad funkcjonalnościami interaktywnymi.

## 2. Historyjka Użytkownika (User Story)

-   **Jako nowy użytkownik,** chcę zobaczyć profesjonalnie wyglądający ekran logowania, abym mógł rozpocząć proces uwierzytelniania w aplikacji.

## 3. Wymagania Funkcjonalne

### Wymagania Ogólne Systemu

1.  System musi składać się z dwóch komponentów: aplikacji klienckiej (frontend) działającej w przeglądarce oraz aplikacji serwerowej (backend).
2.  Aplikacja kliencka musi być zdolna do nawiązania i utrzymania połączenia w czasie rzeczywistym (WebSocket) z aplikacją serwerową.
3.  Aplikacja serwerowa musi być zdolna do przyjmowania i utrzymywania połączeń w czasie rzeczywistym (WebSocket) od wielu klientów jednocześnie.

### Wymagania dla Aplikacji Klienckiej (Frontend)

1.  Po pierwszym uruchomieniu, aplikacja musi wyświetlić użytkownikowi ekran logowania.
2.  Ekran logowania musi wizualnie odpowiadać makiecie dostarczonej przez UX Designera.
3.  Ekran logowania musi zawierać pola na wprowadzenie nazwy użytkownika i hasła oraz przycisk do zainicjowania logowania.
4.  Główny interfejs czatu (widok kanałów, wiadomości, użytkowników) nie może być widoczny dla niezalogowanego użytkownika.

## 4. Kryteria Akceptacji

Aby uznać tę lekcję za zakończoną, produkt musi pomyślnie przejść następujące testy:

1.  **Test Wyglądu Ekranu Startowego:**
    -   Po otwarciu aplikacji w przeglądarce, na ekranie wyświetlany jest formularz logowania.
    -   Wygląd formularza jest spójny z projektem z `docs/product/design_ux/login.html`.
    -   Żadne inne elementy interfejsu (listy kanałów, okno czatu) nie są widoczne.

2.  **Test Połączenia z Serwerem:**
    -   Gdy aplikacja jest uruchomiona, w narzędziach deweloperskich przeglądarki można zaobserwować aktywne, otwarte połączenie WebSocket z serwerem.
    -   W logach serwera widoczna jest informacja o nawiązaniu połączenia przez klienta.
    -   Połączenie pozostaje aktywne i nie jest zrywane przez serwer.
