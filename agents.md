# Środowisko Wieloagentowe: AI Edu Technikum

## 1. Cel Repozytorium

Niniejsze repozytorium służy do celów edukacyjnych dla **uczniów i nauczycieli**. Stanowi **wieloagentowe środowisko (multi-agent environment)** do eksperymentowania z nowoczesnymi technologiami programowania, architekturą aplikacji oraz procesem wytwarzania oprogramowania przy asyście sztucznej inteligencji.

Głównym obszarem praktycznych ćwiczeń jest projektowanie i implementacja prostych gier webowych (2D Canvas, 3D Voxel/Three.js) z wykorzystaniem środowiska **Node.js** (wbudowany moduł `http` lub minimalistyczny framework `express`), ekosystemu pakietów **npm** oraz czystego frontendu (HTML5, CSS3, JavaScript).

---

## 2. Architektura Ról Subagentów

W procesie wytwarzania oprogramowania uczestniczy dedykowany zespół wyspecjalizowanych subagentów (zdefiniowanych w katalogu `.pi/agents/`). Każdy agent odpowiada za inną fazę projektu, symulując role w profesjonalnym zespole IT:

| Subagent | Plik definicji | Główna rola i odpowiedzialność |
| --- | --- | --- |
| **Product Manager** | `.pi/agents/product-manager-pl.md` | Definiowanie wizji gry, mechanik rozgrywki, zasad, pętli gry (game loop), User Stories i kryteriów akceptacji (`requirements.md`). |
| **Solution Architect** | `.pi/agents/solution-architect-pl.md` | Opracowanie projektu technicznego full-stack (`architecture.md` / `design.md`), dobór pakietów npm, architektura serwera Node.js i klienta gry. |
| **Tech Lead** | `.pi/agents/tech-lead-task-planner-pl.md` | Przekształcenie projektu technicznego w sekwencyjny, przyrostowy plan zadań deweloperskich (`tasks.md` / `IMPLEMENTATION_PLAN.md`). |
| **UX Designer** | `.pi/agents/ux-designer-pl.md` | Tworzenie makiet wizualnych interfejsu gry (Game UI, nakładki HUD, menu startowe, ekran Game Over) w HTML5 i CSS3. |
| **Software Developer** | `.pi/agents/software-developer-pl.md` | Implementacja kodu serwera Node.js i klienta JavaScript, instalacja zależności npm, dbałość o płynność pętli gry (60 FPS). |

---

## 3. Typowy Przepływ Pracy (Workflow)

Współpraca z agentami w środowisku edukacyjnym opiera się na iteracyjnym procesie kaskadowo-zwinnym:

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

---

## 4. Wykorzystywany Stos Technologiczny

Dla zachowania prostoty, czytelności i wysokiej wartości dydaktycznej projekty opierają się na minimalistycznym, ale nowoczesnym stacku:

- **Backend / Serwer**:
  - **Node.js**: środowisko uruchomieniowe backendu.
  - **Serwer HTTP**: wbudowany w Node.js moduł `http` lub prosty framework `express` do serwowania plików gry i obsługi endpointów.
  - **Zarządzanie zależnościami**: `package.json` oraz pakiety z rejestru **npm** (np. `ws` / `socket.io` do komunikacji sieciowej, silniki matematyczne, narzędzia pomocnicze).
- **Frontend / Klient**:
  - **HTML5**: struktura gry, kontener elementu `<canvas>`.
  - **CSS3**: stylizacja interfejsu gracza (HUD, ekrany menu, responsywność).
  - **JavaScript (ES6+)**: logika klienta, obsługa wejścia (InputHandler), pętla renderowania (Game Loop).
  - **Grafika**: Canvas 2D API lub WebGL (np. Three.js).

---

## 5. Jak Korzystać ze Środowiska (Dla Uczniów i Nauczycieli)

1. **Uruchamianie agentów**:
   Subagenci mogą być wywoływani przez system pi jako wyspecjalizowane agenty (np. `product-manager-pl`, `software-developer-pl`), realizując konkretne etapy projektu.
2. **Eksperymentowanie z rolami**:
   Uczniowie mogą wcielać się w rolę wybranego agenta (np. pisać wymagania jako Product Manager) i prosić AI o realizację kolejnych ról (np. Architekta czy Developera) lub odwrotnie — weryfikować i recenzować plany generowane przez agentów.
3. **Instalacja i uruchamianie gier**:
   Każdy projekt gry zawiera plik `package.json`:

   ```bash
   # Instalacja zależności zadeklarowanych w projekcie
   npm install

   # Uruchomienie serwera gry
   npm start
   ```

   Aplikacja otwiera się lokalnie w przeglądarce pod adresem wskazanym przez serwer (zazwyczaj `http://localhost:3000`).
