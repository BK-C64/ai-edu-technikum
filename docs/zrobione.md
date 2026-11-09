# Zrobione (Stan Realny Projektu)

Plik ten rejestruje **wyłącznie faktycznie wykonane i zweryfikowane** prace w projekcie. Jest aktualizowany na bieżąco przez agentów i zespół.

---

## 1. Analiza i Wymagania Produktowe
- [x] Zebranie materiałów i założeń dydaktycznych pod kątem szkolenia nauczycieli w architekturze klient-serwer (`docs/produkt.md`, `docs/product/design_ux/`).
- [x] Opracowanie zrestrukturyzowanego planu Full-Stack na 10 modułów (od pustego katalogu, przez scaffolding backendu, SQLite i testy, po klienta i DM) w `docs/produkt.md`.

## 2. Architektura i Kontrakty Techniczne
- [x] Wybór stosu technologicznego: **Python 3.10+ (FastAPI + Uvicorn + WebSockets)**, baza **SQLite**, **Vanilla JS / HTML5 / CSS3** (brak bundlerów) w `docs/architecture_plan/basic_choices.md`.
- [x] Wstępny projekt schematu relacyjnej bazy danych SQLite (`users`, `channels`, `messages`, `channel_members`, `message_reactions`) w `docs/architecture_plan/database_schema.md`.
- [x] Wstępny projekt architektury modułowej klienta Vanilla JS w `docs/architecture_plan/frontend_architecture.md`.
- [x] Kompletny projekt i walidacja specyfikacji API WebSocket oraz endpointów HTTP REST w `docs/architecture_plan/api_design.md`:
  - Wzbogacenie obiektów wiadomości o unikalne `id` (`msg_...`),
  - Doprecyzowanie procedury logowania i auto-rejestracji (`auth_request`),
  - Dodanie specyfikacji tworzenia kanałów publicznych (`create_channel` / `channel_created`),
  - Dodanie endpointów HTTP (`GET /health` oraz montowanie `/static`).

## 3. Środowisko Wieloagentowe (Multi-Agent Setup)
- [x] Zdefiniowanie i uproszczenie zespołu agentów pi:
  - `@pm` (`.pi/agents/pm.md`),
  - `@architekt` (`.pi/agents/architekt.md`),
  - `@planner` (`.pi/agents/planner.md`),
  - `@designer` (`.pi/agents/designer.md`),
  - `@dev` (`.pi/agents/dev.md`).
- [x] Dostosowanie ról agentów do specyfiki komunikatora internetowego MyDiscord, FastAPI, SQLite, makiet UX i testów pytest.
- [x] Aktualizacja dokumentacji projektu w `README.md` oraz `agents.md`.
- [x] Utworzenie rejestru postępów `docs/zrobione.md` oraz listy zadań `docs/do_zrobienia.md`.
