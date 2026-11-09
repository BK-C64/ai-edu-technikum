# Witaj w AI Edu: Projekt Komunikatora "MyDiscord" (Szkolenie Nauczycieli)

Cześć! Niniejsze repozytorium to środowisko edukacyjno-warsztatowe przeznaczone dla **nauczycieli**. Celem programu jest praktyczne przejście przez proces projektowania, architektury i budowy nowoczesnej aplikacji webowej w czasie rzeczywistym z asystą wyspecjalizowanych agentów sztucznej inteligencji (AI).

Budowanym projektem jest komunikator internetowy wzorowany na Discordzie / IRC (**MyDiscord / AI-Powered Team Chat**).

---

## 1. Co robimy i jaki jest cel dydaktyczny?

**Główny cel:** Pokazanie nauczycielom, jak wygląda kompletny, profesjonalny proces inżynierii oprogramowania (od pomysłu, User Stories i makiet UX, po architekturę WebSocket, bazę danych i implementację kodu) oraz jak wykorzystać podział na role agentów AI w nauczaniu informatyki i programowania.

**Czego uczymy poprzez projekt komunikatora?**
- **Modelu Klient-Serwer i komunikacji w czasie rzeczywistym**: obsługa protokołu WebSockets z komunikatami w formacie JSON (zdarzenia `auth_request`, `send_message`, `typing_indicator`, `user_joined` itp.).
- **Backendu w Pythonie z frameworkiem FastAPI**: asynchroniczna obsługa zdarzeń, automatyczna dokumentacja Swagger/OpenAPI, prosta konfiguracja.
- **Relacyjnej bazy danych SQLite**: trwałe przechowywanie użytkowników, kanałów i historii wiadomości bez konieczności stawiania zewnętrznych serwerów bazodanowych.
- **Frontendu w czystym Vanilla JavaScript**: brak zbędnych frameworków (React/Vue/Angular) i skomplikowanych bundlerów – bezpośrednia praca na elementach DOM, obsługa stanu czatu i zdarzeń WebSocket.
- **Projektowania UX/UI**: trójkolumnowy układ znany z Discorda (lista kanałów, okno czatu, lista obecności online).
- **Pracy z agentami AI**: orkiestracja zadań pomiędzy Product Managerem, Solution Architectem, UX Designerem, Tech Leadem i Software Developerem.

---

## 2. Gotowe Materiały i Prototypy w Repozytorium

Projekt posiada przygotowaną bazę analityczną i rejestr postępów w katalogu `docs/`:

- **Śledzenie Postępów Projektu:**
  - [`docs/zrobione.md`](docs/zrobione.md) – rejestr faktycznie zrealizowanych i zweryfikowanych zadań (na bieżąco aktualizowany przez agentów; obecnie: plan API i propozycja architektury).
  - [`docs/do_zrobienia.md`](docs/do_zrobienia.md) – całościowa lista zadań TODO projektu (od scaffoldingu backendu po klienta i testy).
- **Opis Produktowy i Historyjki Użytkownika:**
  - [`docs/produkt.md`](docs/produkt.md) – główna specyfikacja funkcjonalna i plan rozwoju Full-Stack z podziałem na User Stories i kryteria akceptacji.
- **Makiety i Design UX (HTML / CSS):**
  - [`docs/product/design_ux/login.html`](docs/product/design_ux/login.html) & [`docs/product/design_ux/login.css`](docs/product/design_ux/login.css) – ekran logowania i autoryzacji.
  - [`docs/product/design_ux/channel_view.html`](docs/product/design_ux/channel_view.html) & [`docs/product/design_ux/style.css`](docs/product/design_ux/style.css) – główny widok komunikatora w układzie trójkolumnowym.
- **Architektura Techniczna i API:**
  - [`docs/architecture_plan/basic_choices.md`](docs/architecture_plan/basic_choices.md) – decyzje technologiczne i słowniczek pojęć.
  - [`docs/architecture_plan/api_design.md`](docs/architecture_plan/api_design.md) – precyzyjny kontrakt WebSocket (formaty JSON C2S i S2C).
  - [`docs/architecture_plan/database_schema.md`](docs/architecture_plan/database_schema.md) – schemat bazy SQLite (tabele `users`, `channels`, `messages`, `channel_members`).
  - [`docs/architecture_plan/frontend_architecture.md`](docs/architecture_plan/frontend_architecture.md) – architektura modułowa w Vanilla JS.

---

## 3. Stos Technologiczny

Dla maksymalnej prostoty wdrożenia w pracowni szkolnej (np. na komputerach z systemem Windows / VS Code / przeglądarka) stos technologiczny został dobrany tak, aby nie wymagał instalacji skomplikowanych zależności:

- **Backend:** **Python 3.10+**, **FastAPI**, **Uvicorn**, **WebSockets**
- **Baza danych:** **SQLite** (plik lokalny `chat.db`)
- **Frontend:** **HTML5**, **CSS3**, **Vanilla JS (ES6+)**
- **Format wymiany danych:** **JSON** przez WebSocket:
  ```json
  {
    "type": "send_message",
    "payload": {
      "channel_id": "general",
      "text": "Cześć wszystkim!"
    }
  }
  ```

---

## 4. Zespół Subagentów AI i Skilli (Dwa Tryby Pracy)

W projekcie możemy pracować z rolami inżynierskimi na dwa sposoby:
1. **Jako autonomiczny Subagent (`@nazwa`)**: uruchamiany w tle dla większych, wielokrokowych zadań wymagających niezależnego wykonania.
2. **Jako Skill in-line (`/skill:nazwa`)**: aktywowany bezpośrednio w głównym wątku czatu dla szybkich odpowiedzi, wspólnego kodowania i iteracyjnych dyskusji z nauczycielem.

| Rola | Wywołanie Agenta (Tło) | Wywołanie Skilla (In-line) | Odpowiedzialność w projekcie MyDiscord |
| --- | --- | --- | --- |
| **Product Manager** | `@pm` | `/skill:pm` | Definiuje **CO** tworzymy: User Stories, kryteria akceptacji, mechaniki czatu (`docs/produkt.md`). |
| **Solution Architect** | `@architekt` | `/skill:architekt` | Projektuje **JAK** to działa: specyfikacja zdarzeń WebSocket, relacje SQLite, zasady DRY/SOLID. |
| **Tech Lead** | `@planner` | `/skill:planner` | Rozbija architekturę na przyrostowy plan wdrożeniowy (`docs/do_zrobienia.md`), instrukcje testów. |
| **UX Designer** | `@designer` | `/skill:designer` | Przygotowuje i adaptuje szablony HTML5/CSS3 na bazie makiet z `docs/product/design_ux/`. |
| **Software Developer** | `@dev` | `/skill:dev` | Implementuje kod backendu (FastAPI/SQLite), klienta (Vanilla JS) oraz testy `pytest`. |

---

## 5. Przepływ Pracy (Workflow)

```text
[ Wymagania i User Stories (docs/produkt.md) ]
                               │
                               ▼
1. @pm ────────────────────────► docs/produkt.md (User Stories, reguły biznesowe)
                               │
                               ▼
2. @architekt ─────────────────► architecture_plan/ (kontrakty WebSocket, schemat SQLite)
                               │
        ┌──────────────────────┴───────────────────────┐
        ▼                                              ▼
3. @planner ───────────────► docs/do_zrobienia.md      4. @designer ──► layout HTML5/CSS3
        │                                              │          (z docs/product/design_ux/)
        └──────────────────────┬───────────────────────┘
                               ▼
5. @dev ───────────────────────► Kod aplikacji (FastAPI backend + Vanilla JS frontend) + testy
                               │
                               ▼
                      Weryfikacja (pytest & http://localhost:8000)
```

---

## 6. Szybki Start (Dla Uczestnika / Nauczyciela)

Gdy projekt jest wdrażany, kroki uruchomienia prezentują się następująco:

1. **Przygotowanie środowiska Python:**
   ```bash
   python -m venv venv
   # Aktywacja w systemie Windows:
   venv\Scripts\activate
   # Aktywacja w systemie Linux/macOS:
   source venv/bin/activate
   ```

2. **Instalacja zależności:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Uruchomienie serwera aplikacji:**
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

4. **Dostęp do aplikacji:**
   - Otwórz w przeglądarce: `http://localhost:8000`
   - Interaktywna dokumentacja Swagger API: `http://localhost:8000/docs`
