# 🚀 Instrukcja: Budowa Prototypu Aplikacji Czat (IRC) z AI

W tym zadaniu wykorzystasz sztuczną inteligencję (Gemini CLI), aby na podstawie dokumentacji technicznej wygenerować działający interfejs użytkownika, który połączy się z Twoim serwerem.

## Krok 1: Przygotowanie środowiska
1.  **Pobierz kod projektu** z repozytorium i rozpakuj go na swoim komputerze.
2.  Otwórz terminal (np. PowerShell lub CMD) w głównym folderze projektu (`ai-edu-technikum`).

## Krok 2: Instalacja serwera (Backend)
Serwer potrzebuje odpowiednich bibliotek, aby obsłużyć połączenia WebSocket.
1.  W terminalu przejdź do folderu serwera:
    ```powershell
    cd project\archive_code\server_iirc
    ```
2.  Zainstaluj wymagane biblioteki:
    ```powershell
    pip install fastapi "uvicorn[standard]" websockets
    ```
    *(Możesz też użyć: `pip install -r requirements.txt` jeśli plik istnieje)*

## Krok 3: Generowanie Frontendu przez AI (Gemini CLI)
Teraz poprosisz AI o stworzenie klienta na podstawie Twoich wytycznych.
1.  Otwórz **drugi terminal** w głównym folderze projektu.
2.  Uruchom Gemini CLI:
    ```powershell
    gemini
    ```
3.  Wpisz poniższe polecenie do Gemini (możesz skopiować i wkleić):
    > "Mam kod serwera w `project/archive_code/server_iirc/server.py`. Przeczytaj specyfikację API w `docs/architecture/api_design.md` oraz architekturę frontendu w `docs/architecture/frontend_architecture.md`. Na ich podstawie stwórz kompletny, nowoczesny i modułowy klient czatu w folderze `src/client`. Pamiętaj o obsłudze dwuetapowego logowania (hasło, potem nick)."

4.  Zatwierdź zmiany, które zaproponuje AI.

## Krok 4: Uruchomienie Serwera
Wróć do **pierwszego terminala** (tego w folderze serwera) i uruchom go:
```powershell
python server.py
```
Powinieneś zobaczyć komunikat: `Uvicorn running on http://0.0.0.0:8000`.

## Krok 5: Uruchomienie Klienta (Frontend)
Ponieważ klient korzysta z modułów JavaScript, nie możemy go otworzyć po prostu klikając w plik `index.html`. Musimy uruchomić prosty serwer WWW dla plików frontendu.
1.  W **trzecim terminalu** przejdź do folderu z wygenerowanym klientem:
    ```powershell
    cd src\client
    ```
2.  Uruchom serwer podglądu:
    ```powershell
    python -m http.server 3000
    ```
3.  Otwórz przeglądarkę i wejdź pod adres:
    ```
    http://localhost:3000
    ```

## Krok 6: Testowanie!
1.  W formularzu logowania powinieneś mieć już wpisany adres: `ws://localhost:8000/ws` oraz hasło: `ircAMP2024!`.
2.  Wpisz swój **Nick** i kliknij **Connect**.
3.  Otwórz drugą kartę w przeglądarce pod tym samym adresem, zaloguj się jako inny użytkownik i sprawdź, czy wiadomości docierają do obu osób!

---

### 💡 Wskazówki dla uczniów:
*   Jeśli serwer nie działa, sprawdź czy nie masz innego programu na porcie 8000.
*   Jeśli Gemini CLI nie widzi plików, upewnij się, że uruchomiłeś go w głównym katalogu projektu.
*   Eksperymentuj! Możesz poprosić Gemini o zmianę kolorów (np. "zmień motyw na jasny/Light Mode") bez zmieniania logiki działania.
