# Środowisko Wieloagentowe: AI Edu – Projekt Komunikatora "MyDiscord"

## 1. Cel Repozytorium

Niniejsze repozytorium służy do celów edukacyjnych dla **nauczycieli** (oraz ich uczniów). Stanowi **wieloagentowe środowisko (multi-agent environment)** do eksperymentowania z nowoczesnymi technologiami programowania aplikacji webowych w czasie rzeczywistym, architekturą klient-serwer oraz procesem wytwarzania oprogramowania przy asyście sztucznej inteligencji.

Głównym projektem realizowanym w repozytorium jest edukacyjny komunikator internetowy wzorowany na Discordzie / IRC (**MyDiscord / AI-Powered Team Chat**), wykorzystujący:
- **Backend**: Python (**FastAPI** + **Uvicorn** + **WebSockets**),
- **Baza danych**: lekka, wbudowana baza **SQLite**,
- **Frontend**: czysty **HTML5, CSS3 i Vanilla JavaScript** (bez skomplikowanych bundlerów i frameworków),
- **Makiety UX**: gotowy design trójkolumnowy w `docs/product/design_ux/`.

---

## 2. Architektura Ról Subagentów

W procesie wytwarzania oprogramowania uczestniczy dedykowany zespół wyspecjalizowanych subagentów (zdefiniowanych w katalogu `.pi/agents/`). Każdy agent odpowiada za inną fazę projektu, symulując role w profesjonalnym zespole produktowo-inżynieryjnym:

| Subagent | Plik definicji | Główna rola i odpowiedzialność |
| --- | --- | --- |
| **`pm`** (Product Manager) | `.pi/agents/pm.md` | Definiowanie wizji komunikatora, User Stories, kryteriów akceptacji, logiki kanałów i uprawnień (`docs/produkt.md`). |
| **`architekt`** (Solution Architect) | `.pi/agents/architekt.md` | Opracowanie projektu technicznego full-stack (`docs/architecture_plan/basic_choices.md`, `api_design.md`, `database_schema.md`), protokołu WebSocket (JSON C2S/S2C), podziału na moduły backendu (FastAPI) i klienta (Vanilla JS) z poszanowaniem zasad DRY i SOLID. |
| **`planner`** (Tech Lead) | `.pi/agents/planner.md` | Przekształcenie projektu technicznego w sekwencyjny, przyrostowy plan zadań deweloperskich (`docs/do_zrobienia.md`) zintegrowany z testami pytest. |
| **`designer`** (UX Designer) | `.pi/agents/designer.md` | Projektowanie i implementacja interfejsu czatu (layout 3-kolumnowy, ekran logowania, lista kanałów, okno czatu, lista online, style CSS) na bazie `docs/product/design_ux/`. |
| **`dev`** (Software Developer) | `.pi/agents/dev.md` | Implementacja kodu backendu (Python/FastAPI, WebSockets, SQLite), frontendu (Vanilla JS) oraz testów automatycznych pytest krok po kroku według planu. |

---

## 3. Typowy Przepływ Pracy (Workflow)

Współpraca z agentami w środowisku szkoleniowym dla nauczycieli opiera się na iteracyjnym procesie kaskadowo-zwinnym:

```text
[ Wizja / Wymagania Komunikatora (docs/produkt.md) ]
                               │
                               ▼
1. pm ─────────────────────────► docs/produkt.md (User Stories, reguły biznesowe)
                               │
                               ▼
2. architekt ──────────────────► architecture_plan/ (kontrakty WebSocket, schemat SQLite, moduły)
                               │
        ┌──────────────────────┴───────────────────────┐
        ▼                                              ▼
3. planner ────────────────► docs/do_zrobienia.md  4. designer ──────► layout HTML5 + style.css
        │                                              │          (na bazie design_ux/)
        └──────────────────────┬───────────────────────┘
                               ▼
5. dev ────────────────────────► Implementacja kodu Python (FastAPI) & JS (WebSocket client) + testy
                               │
                               ▼
                      Weryfikacja i Testy (pytest & Uvicorn -> http://localhost:8000)
```

---

## 4. Wykorzystywany Stos Technologiczny

Dla zachowania przejrzystości dydaktycznej i bezproblemowego uruchomienia w pracowniach komputerowych projekt opiera się na stosie pozbawionym skomplikowanego toolingu:

- **Backend / Serwer**:
  - **Python 3.10+**: środowisko backendowe,
  - **FastAPI**: nowoczesny framework asynchroniczny z natywną obsługą WebSockets oraz automatyczną dokumentacją OpenAPI/Swagger,
  - **Uvicorn**: lekki serwer ASGI,
  - **SQLite**: plikowa baza danych wbudowana w Pythona (`sqlite3`), nie wymaga instalacji serwera bazodanowego.
- **Frontend / Klient**:
  - **HTML5**: semantyczny układ aplikacji (sidebar z kanałami, widok wiadomości, panel użytkowników online),
  - **CSS3**: nowoczesny ciemny motyw wzorowany na Discordzie (`docs/product/design_ux/style.css`, `login.css`),
  - **Vanilla JavaScript (ES6+)**: modułowa obsługa połączenia WebSocket, kolejkowanie wiadomości, manipulacja drzewem DOM.
- **Format komunikacji**:
  - Zdarzenia WebSocket w formacie JSON ze stałą strukturą `{ type: string, payload: object }` (zgodnie z `docs/architecture_plan/api_design.md`).

---

## 5. Śledzenie Postępów Projektu (`docs/zrobione.md` i `docs/do_zrobienia.md`)

Projekt korzysta z dwóch centralnych rejestrów stanu realizacji:
- **`docs/zrobione.md`**: rejestruje **wyłącznie faktycznie wykonane i zweryfikowane** prace (aktualizowany na bieżąco przez agentów po ukończeniu kroków). Na ten moment zawiera wstępny plan API oraz propozycję architektury.
- **`docs/do_zrobienia.md`**: prosta, całościowa lista zadań (TODO) obejmująca wszystkie fazy od scaffoldingu backendu po klienta i wdrożenie.

### Obowiązki Agentów wobec rejestru postępów:
- Każdy agent kończący swoje zadanie ma obowiązek zweryfikować rezultat, zaktualizować status w `docs/do_zrobienia.md` (zmienić `[ ]` na `[x]`) oraz dopisać ukończony element do `docs/zrobione.md`.

### Zasada Ochrony Kontekstu w Konsoli Windowsa (PowerShell / CMD):
- Środowisko pracy nauczycieli to **natywna konsola Windowsa (PowerShell / CMD)**, w której polecenia linuksowe (takie jak `tail` czy `grep`) **nie działają domyślnie**.
- Polecenia sugerowane użytkownikom oraz wywoływane przez agentów muszą być kompatybilne z Windowsem i zoptymalizowane pod kątem ochrony okna kontekstu (Context Budget):
  - **Dla testów `pytest`**: ZAWSZE używaj natywnych flag: `pytest -q --tb=short` (działa bez potoków w CMD i PowerShellu, zwraca tylko zwięzłe podsumowanie i linie błędu).
  - **Dla czytania końcówek logów w PowerShellu**: `Get-Content plik.log -Tail 20` lub potok `| Select-Object -Last 20` (zamiast linuksowego `tail`).
  - **Dla Gita**: wbudowane flagi ograniczające, np. `git log -n 10 --oneline`, `git status -s`.
- Bezwzględny zakaz wklejania do kontekstu pełnych, wielosetlinijkowych zrzutów całego terminala.

---

## 6. Jak Korzystać ze Środowiska (Szkolenie Nauczycieli)

1. **Uruchamianie agentów**:
   Subagenci mogą być wywoływani przez system pi jako zwięźle nazwane role: `@pm`, `@architekt`, `@planner`, `@designer`, `@dev`, pomagając nauczycielom w projektowaniu lekcji i budowaniu aplikacji.
2. **Eksperymentowanie z rolami inżynierskimi**:
   Nauczyciele poznają proces wytwarzania nowoczesnego oprogramowania od analizy wymagań po wdrożenie, ucząc się jak tłumaczyć te role i koncepcje uczniom.
3. **Materiały bazowe w projekcie**:
   - `docs/zrobione.md` – bieżący rejestr faktycznie ukończonych zadań,
   - `docs/do_zrobienia.md` – całościowa lista zadań TODO,
   - `docs/produkt.md` – główny plan rozwoju Full-Stack z podziałem na User Stories i kryteria akceptacji,
   - `docs/product/design_ux/` – gotowe makiety HTML/CSS (ekran logowania `login.html`, widok czatu `channel_view.html`),
   - `docs/architecture_plan/` – szczegółowy projekt architektury, bazy danych i API WebSocket.
