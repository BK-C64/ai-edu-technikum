# AI-Powered Team Chat - Instrukcja dla ucznia

## O tej lekcji

Na dzisiejszej lekcji przygotujemy **backend do naszej aplikacji czatu** (podobnej do Discord). Serwer jest już napisany - Twoim zadaniem jest nauczyć się go **uruchamiać i testować**.

**Czego się nauczysz:**
- 🐍 Uruchamiać środowisko wirtualne Python (venv)
- 📦 Instalować pakiety Python (pip install)
- 🌐 Sprawdzać odpowiedzi serwera w konsoli
- 💾 Odpytywać bazę danych SQLite

**Nie musisz pisać kodu** - skupiamy się na uruchomieniu i zrozumieniu jak działa backend!

---

## Wymagania

- **Python 3.8+** (sprawdź: `python --version`)
- System: Windows, Linux lub macOS

---

## KROK PO KROKU

### 1. Sprawdź Pythona

**Windows:**
```cmd
python --version
```

**Linux/macOS:**
```bash
python3 --version
```

Powinno pokazać: `Python 3.8.x` lub nowszy. Jeśli nie - zainstaluj z https://python.org

---

### 2. Otwórz terminal w folderze projektu

**Windows:**
- Naciśnij `Win + R`, wpisz `cmd`
- Przejdź do folderu: `cd ścieżka\do\projektu\lekcja_5\server`

**Linux/macOS:**
- Otwórz Terminal
- Przejdź do folderu: `cd ścieżka/do/projektu/lekcja_5/server`

---

### 3. PIERWSZE uruchomienie (tylko raz!)

**Windows:**
```cmd
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
python server.py
```

**Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python server.py
```

Zobaczysz:
```
============================================================
  AI-POWERED TEAM CHAT - Backend Server
============================================================
📦 Tworzenie nowej bazy danych...
   → 3 użytkowników dodanych (Jan, Anna, Piotr)
   → 2 kanały utworzone (general, random)
   → 7 przykładowych wiadomości w kanale general
✓ Baza danych utworzona z przykładowymi danymi

🚀 Uruchamianie serwera FastAPI...
   HTTP endpoint: http://localhost:8000
   WebSocket endpoint: ws://localhost:8000/ws

💡 Aby zatrzymać serwer, naciśnij Ctrl+C
```

✅ **Serwer działa!**

**WAŻNE:** Serwer teraz **działa** i **nie zamykaj tego okna**! To okno będzie pokazywać logi serwera (co się dzieje).

**Jak poznać że serwer działa?**
- Widzisz `Uvicorn running on http://0.0.0.0:8000`
- Konsola "czeka" - nie możesz wpisać nowych komend
- To jest PRAWIDŁOWE! Serwer działa w tle.

---

### 4. Jak zatrzymać serwer?

Gdy skończysz pracę, **w oknie gdzie działa serwer** naciśnij:
```
Ctrl + C
```

Zobaczysz:
```
INFO:     Shutting down
INFO:     Application shutdown complete.
```

Teraz możesz zamknąć to okno.

---

### 5. KOLEJNE uruchomienia

**Windows:**
```cmd
cd ścieżka\do\projektu\lekcja_5\server
venv\Scripts\activate.bat
python server.py
```

**Linux/macOS:**
```bash
cd ścieżka/do/projektu/lekcja_5/server
source venv/bin/activate
python server.py
```

---

## TESTOWANIE

**⚠️ WAŻNE - Otwórz DRUGIE okno konsoli!**

Serwer działa w **OKNIE 1** (nie zamykaj go!). Żeby go przetestować, musisz otworzyć **OKNO 2** (nowe okno terminala/konsoli).

```
┌─────────────────────────────┐     ┌─────────────────────────────┐
│  OKNO 1: SERWER             │     │  OKNO 2: TESTOWANIE         │
│  (NIE ZAMYKAJ!)             │     │  (NOWE OKNO)                │
│                             │     │                             │
│  $ python server.py         │     │  $ curl http://...          │
│  🚀 Serwer działa...        │     │  $ python check_database.py │
│  INFO: connection open      │     │  $ python test_websocket... │
│  ...                        │     │  ...                        │
└─────────────────────────────┘     └─────────────────────────────┘
```

**Jak otworzyć drugie okno?**
- **Windows:** Naciśnij `Win + R`, wpisz `cmd`, Enter
- **Linux/macOS:** Otwórz nowy Terminal (Ctrl+Shift+N lub Cmd+N)
- **Visual Studio:** Menu → Terminal → New Terminal

---

### Test 1: Sprawdź status (HTTP)

**📍 Wykonaj w OKNIE 2 (lub przeglądarce)**

**Metoda A - W przeglądarce:**
- Otwórz przeglądarkę (Chrome, Firefox, Edge)
- Wejdź na: http://localhost:8000

**Metoda B - W konsoli (OKNO 2):**
```bash
curl http://localhost:8000
```

**Wynik:**
```json
{"status": "ok", "message": "AI-Powered Team Chat API is running"}
```

---

### Test 2: Sprawdź bazę danych

**📍 Wykonaj w OKNIE 2**

```bash
cd ścieżka/do/projektu/lekcja_5/server
python check_database.py
```

**Wynik:**
```
============================================================
  ZAWARTOŚĆ BAZY DANYCH - AI CHAT
============================================================

👥 UŻYTKOWNICY:
  • Jan             (ID: user_1)
  • Anna            (ID: user_2)
  • Piotr           (ID: user_3)

📺 KANAŁY:
  • Ogélny          (general) - 7 wiadomości
  • Ciekawostki     (random) - 0 wiadomości

💬 OSTATNIE WIADOMOŚCI (10 najnowszych):
  [general] Anna: Cześć wszystkim!
  ...

📊 STATYSTYKI:
  Użytkownicy: 3
  Kanały: 2
  Wiadomości: 7
```

---

### Test 3: Pełny test WebSocket

**📍 Wykonaj w OKNIE 2 (pamiętaj o aktywacji venv!)**

**Windows:**
```cmd
cd ścieżka\do\projektu\lekcja_5\server
venv\Scripts\activate.bat
python test_websocket_client.py
```

**Linux/macOS:**
```bash
cd ścieżka/do/projektu/lekcja_5/server
source venv/bin/activate
python test_websocket_client.py
```

**Co się stanie:** W OKNIE 1 (serwer) zobaczysz logi połączenia, w OKNIE 2 zobaczysz wyniki testów.

**Wynik:**
```
============================================================
  Test Klienta WebSocket - AI Chat
============================================================

✓ Połączono z serwerem

Test 1: Autentykacja...
✓ Autentykacja pomyślna!

Test 2: Wysłanie wiadomości...
✓ Wiadomość wysłana i otrzymana!

Test 3: Żądanie historii kanału 'random'...
✓ Historia otrzymana!

Test 4: Test walidacji (zbyt długa wiadomość)...
✓ Walidacja działa!

============================================================
  ✓ Wszystkie testy zakończone pomyślnie!
============================================================
```

---

### ✅ Podsumowanie testowania

Jeśli wszystkie 3 testy przeszły pomyślnie, to znaczy że:
- ✅ Serwer działa poprawnie
- ✅ Baza danych została utworzona z przykładowymi danymi
- ✅ WebSocket działa (komunikacja w czasie rzeczywistym)

**Co widziałeś w OKNIE 1 (serwer)?**
Gdy uruchamiałeś testy, w oknie serwera pojawiały się logi typu:
```
INFO:     127.0.0.1:52384 - "GET / HTTP/1.1" 200 OK
INFO:     ('127.0.0.1', 52385) - "WebSocket /ws" [accepted]
INFO:     connection open
```
To normalne - serwer rejestruje wszystkie połączenia i żądania.

---

## PRZYDATNE KOMENDY

### Zatrzymanie serwera:
```
Ctrl + C
```

### Reset bazy danych (usuń wszystkie dane):
```bash
python server.py --reset
```

### Uruchom testy jednostkowe:
```bash
pytest
pytest -v        # z detalami
```

---

## DANE TESTOWE

**Użytkownicy (hasło dla wszystkich: `ircAMP2024!`):**
- Jan (user_1)
- Anna (user_2)
- Piotr (user_3)

**Kanały:**
- general - Ogólny
- random - Ciekawostki

**Endpointy:**
- HTTP: http://localhost:8000
- WebSocket: ws://localhost:8000/ws

---

## NAJCZĘSTSZE PROBLEMY

### Problem: "python is not recognized"
**Przyczyna:** Python nie jest w PATH
**Rozwiązanie:** Zainstaluj Python z python.org i zaznacz "Add Python to PATH"

### Problem: "Port 8000 zajęty"
**Przyczyna:** Inny program używa portu 8000
**Rozwiązanie Windows:**
```cmd
netstat -ano | findstr :8000
taskkill /PID <numer> /F
```
**Rozwiązanie Linux/macOS:**
```bash
lsof -i :8000
kill -9 <PID>
```

### Problem: "Cannot activate venv" (PowerShell)
**Przyczyna:** Execution Policy blokuje skrypty
**Rozwiązanie:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Potem spróbuj ponownie: `venv\Scripts\Activate.ps1`

### Problem: Polskie znaki wyświetlają się jako ���
**Przyczyna:** Kodowanie konsoli
**Rozwiązanie Windows CMD:**
```cmd
chcp 65001
```

### Problem: "No module named 'fastapi'"
**Przyczyna:** Nie zainstalowano zależności lub venv nieaktywny
**Rozwiązanie:**
1. Aktywuj venv: `venv\Scripts\activate.bat` (Windows) lub `source venv/bin/activate` (Linux)
2. Zainstaluj: `pip install -r requirements.txt`

### Problem: Testy nie działają
**Sprawdź:**
1. ❗ **Czy serwer jest uruchomiony?** - Otwórz OKNO 1 i sprawdź czy widzisz `Uvicorn running on http://0.0.0.0:8000`
2. ❗ **Czy testujesz w DRUGIM oknie?** - Serwer działa w OKNIE 1, testy musisz uruchamiać w OKNIE 2
3. Czy venv jest aktywny w OKNIE 2? (powinieneś widzieć `(venv)` na początku linii)
4. Czy port 8000 jest wolny? (sprawdź czy inny program nie używa portu 8000)

---

## CO DALEJ?

- **Dokumentacja API:** Zobacz `docs/architecture/api_design.md` w głównym folderze projektu
- **Frontend:** Połącz przez WebSocket: `ws://localhost:8000/ws`
- **Zadania:** Zobacz plik `tasks.md` w folderze `lekcja_5/`

---

## SZYBKA ŚCIĄGAWKA

```bash
# ═══════════════════════════════════════════════════════════
# OKNO 1 - SERWER (uruchom raz i zostaw otwarte)
# ═══════════════════════════════════════════════════════════

# Pierwsze uruchomienie:
python -m venv venv                 # utwórz środowisko
venv\Scripts\activate.bat           # aktywuj (Windows)
source venv/bin/activate            # aktywuj (Linux/macOS)
pip install -r requirements.txt     # zainstaluj pakiety
python server.py                    # uruchom serwer (ZOSTAW OTWARTE!)

# Kolejne uruchomienia:
venv\Scripts\activate.bat           # aktywuj (Windows)
source venv/bin/activate            # aktywuj (Linux/macOS)
python server.py                    # uruchom serwer (ZOSTAW OTWARTE!)

# Zatrzymanie:
Ctrl + C                            # zatrzymaj serwer

# ═══════════════════════════════════════════════════════════
# OKNO 2 - TESTOWANIE (otwórz nowe okno konsoli)
# ═══════════════════════════════════════════════════════════

# Testowanie:
curl http://localhost:8000          # test HTTP (lub przeglądarka)
python check_database.py            # sprawdź bazę
python test_websocket_client.py     # test WebSocket (wymaga venv!)
pytest                              # testy jednostkowe (wymaga venv!)

# Inne:
python server.py --reset            # reset bazy (uruchom w OKNIE 1)
```

**Powodzenia! 🚀**
