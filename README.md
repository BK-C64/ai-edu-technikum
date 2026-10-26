# Witaj w AI Edu Technikum: Środowisko Wieloagentowe (Gry Webowe)

Cześć! Jeśli tu jesteś, to znaczy, że rozpoczynamy wspólną przygodę z nowoczesnym programowaniem gier webowych i pracą w wieloagentowym zespole asystowanym przez sztuczną inteligencję (AI).

Ten plik to Twój przewodnik po repozytorium — przeczytaj go, aby dowiedzieć się, co tworzymy, z jakich technologii korzystamy i jak współpracować z agentami AI.

---

## 1. Co my właściwie robimy? (Nasz Cel)

**W skrócie:** Projektujemy i budujemy od podstaw gry internetowe (od klasycznych zręcznościówek retro 2D Canvas po trójwymiarowe światy voxelowe w WebGL / Three.js), symulując pracę w profesjonalnym zespole IT.

**Dlaczego?**
- Uczymy się tworzenia gier: pętla gry (*game loop* 60 FPS), fizyka 2D/3D, kolizje, obsługa wejścia gracza (*InputHandler*), stany gry oraz architektura klient-serwer.
- Doświadczamy pełnego cyklu życia oprogramowania: od pomysłu, przez wymagania produktowe, architekturę techniczną i planowanie zadań, po implementację i testy.
- Uczymy się efektywnej pracy ze sztuczną inteligencją w podziale na wyspecjalizowane role (subagenci).

W repozytorium znajdziesz gotowy projekt wzorcowy gry retro: **`space_inv/` (Space Invaders)**.

---

## 2. Z jakich klocków to budujemy? (Stos Technologiczny)

Dla zachowania przejrzystości i wysokiej wartości dydaktycznej korzystamy z nowoczesnego, ale minimalistycznego stacku webowego bez zbędnych, skomplikowanych frameworków:

### Backend / Serwer
- **Node.js**: środowisko uruchomieniowe backendu.
- **Serwer HTTP**: wbudowany w Node.js moduł `http` lub minimalistyczny `express` do serwowania plików gry i ewentualnych endpointów API.
- **Ekosystem npm**: zarządzanie zależnościami (`package.json`) oraz opcjonalnymi bibliotekami (np. komunikacja w czasie rzeczywistym przez `ws`/`socket.io`, silniki matematyczne).

### Frontend / Klient
- **HTML5**: semantyczna struktura strony, kontener elementu `<canvas>` oraz nakładki interfejsu.
- **CSS3**: stylizacja interfejsu gracza (HUD, licznik żyć i punktów, ekrany startowe i Game Over, retro stylistyka).
- **JavaScript (ES6+)**: czysty, modularny JavaScript odpowiedzialny za logikę gry, pętlę renderowania i sterowanie.
- **Grafika**: Canvas 2D API oraz WebGL (np. biblioteka Three.js przy projektach 3D).

---

## 3. Zespół Subagentów AI (Kto jest kim?)

W projekcie nie piszesz wszystkiego w pojedynkę w chaosie — korzystasz ze wsparcia dedykowanego zespołu subagentów AI (zdefiniowanych w katalogu `.pi/agents/` i opisanych szczegółowo w [`agents.md`](agents.md)):

| Subagent | Plik definicji | Rola w zespole | Co tworzy? |
| --- | --- | --- | --- |
| **Product Manager** | `.pi/agents/product-manager-pl.md` | Ustala **CO** budujemy: zasady gry, mechaniki, pętlę rozgrywki, historyjki gracza (User Stories) i kryteria akceptacji. | `requirements.md` |
| **Solution Architect** | `.pi/agents/solution-architect-pl.md` | Projektuje **JAK** zbudować grę technicznie: moduły, dobór pakietów npm, architekturę serwera Node.js i klienta gry. | `architecture.md` |
| **Tech Lead** | `.pi/agents/tech-lead-task-planner-pl.md` | Dzieli architekturę na małe, sekwencyjne kroki implementacyjne i checklisty deweloperskie. | `tasks.md` / `IMPLEMENTATION_PLAN.md` |
| **UX Designer** | `.pi/agents/ux-designer-pl.md` | Projektuje interfejs gry: układ ekranu, nakładki HUD, menu startowe, ekran Game Over w HTML5 i CSS3. | `index.html` + `style.css` |
| **Software Developer** | `.pi/agents/software-developer-pl.md` | Pisze właściwy kod w Node.js i JavaScript, dba o czystość kodu i stabilne 60 FPS. | Kod gry (`server.js`, `main.js`, moduły) |

---

## 4. Jak wygląda proces pracy? (Workflow)

Praca nad każdą grą przebiega w zorganizowanym, kaskadowo-zwinnym procesie:

```text
[ Pomysł / Temat Gry ]
         │
         ▼
1. Product Manager ─────────► requirements.md (wymagania, mechaniki, User Stories)
         │
         ▼
2. Solution Architect ──────► architecture.md (architektura Node.js + Canvas/WebGL, pakiety npm)
         │
         ├──────────────────────────────┐
         ▼                              ▼
3. Tech Lead ──────────────► tasks.md   4. UX Designer ──► index.html + style.css (szablon UI/HUD)
         │                              │
         └──────────────┬───────────────┘
                        ▼
5. Software Developer ─────► Implementacja kodu Node.js & JS (realizacja krok po kroku)
                        │
                        ▼
               Weryfikacja i Testy (npm start -> http://localhost:3000)
```

### Role uczniów i nauczycieli:
1. **Uczeń jako Developer:** Pobierasz plan od Tech Leada i z pomocą asystenta implementujesz poszczególne moduły gry.
2. **Uczeń jako Product Manager:** Wymyślasz własną grę, piszesz założenia, a agenci AI pomagają stworzyć architekturę i kod.
3. **Weryfikacja i ocena:** Nauczyciel i uczniowie analizują poprawność architektury, zgodność z kryteriami akceptacji i jakość kodu.

---

## 5. Jak uruchomić przykładową grę (Szybki Start)

W repozytorium znajduje się przykładowa implementacja klasycznej gry Space Invaders w katalogu `space_inv`.

1. Przejdź do katalogu projektu:
   ```bash
   cd space_inv
   ```

2. Zainstaluj ewentualne zależności:
   ```bash
   npm install
   ```

3. Uruchom serwer gry:
   ```bash
   npm start
   ```

4. Otwórz przeglądarkę i wpisz adres:
   ```text
   http://localhost:3000
   ```

---

## 6. Struktura Repozytorium

- **`.pi/agents/`** – pliki definicji ról subagentów w środowisku pi (prompty systemowe, zakresy odpowiedzialności).
- **`agents.md`** – szczegółowa dokumentacja środowiska wieloagentowego i zasad współpracy.
- **`space_inv/`** – kompletny projekt gry retro Space Invaders:
  - `requirements.md` – wymagania i reguły spisane przez Product Managera,
  - `architecture.md` – projekt techniczny stworzony przez Solution Architecta,
  - `tasks.md` – dekompozycja zadań przygotowana przez Tech Leada,
  - `server.js` – lekki serwer HTTP w Node.js,
  - `public/` – pliki klienta (`index.html`, style CSS, skrypty JS pętli gry).
- **`nauczyciele/`** oraz **`uczniowie/`** – scenariusze lekcji i materiały warsztatowe.

---

Gotowy na stworzenie własnej gry? Wybierz rolę i zacznijmy kodować!
