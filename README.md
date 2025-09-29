# Cześć! Witaj w projekcie "AI Team Chat" (Wersja dla Ucznia)

Hej! Jeśli tu jesteś, to znaczy, że zaczynamy wspólną przygodę z programowaniem. Ten plik to Twój przewodnik – przeczytaj go, aby zrozumieć, co będziemy razem tworzyć.

## 1. Co my właściwie robimy? (Nasz Cel)

**W skrócie:** Budujemy od zera własną aplikację do czatowania, trochę jak uproszczony Slack albo Discord.

**Dlaczego?** Żeby nauczyć się w praktyce, jak działają nowoczesne aplikacje internetowe. Zobaczysz, jak "gada ze sobą" strona internetowa, którą widzisz (frontend), z serwerem, który działa w tle (backend). To super ważna wiedza dla każdego przyszłego programisty!

## 2. Z jakich klocków to zbudujemy? (Technologie)

Każda aplikacja jest jak budowla z klocków. My użyjemy sprawdzonych i popularnych technologii, które warto znać.

### Coś, co działa w tle – "Mózg" aplikacji (Backend)
To część, której nie widać. Działa na serwerze i zajmuje się całą logiką: zarządza użytkownikami, przechowuje wiadomości i wysyła je do odpowiednich osób.
-   **Język:** Będziemy pisać w **Pythonie** – jest bardzo popularny i stosunkowo łatwy do nauczenia.
-   **Narzędzia:** Użyjemy **FastAPI** (pomaga szybko budować logikę serwera) i **WebSockets** (technologia do rozmów w czasie rzeczywistym).
-   **Pamięć:** Nasze wiadomości i użytkowników będziemy zapisywać w małej, plikowej bazie danych **SQLite**.

### Coś, co widać w przeglądarce – "Wygląd" aplikacji (Frontend)
To jest wszystko to, co widzisz i w co możesz klikać na stronie internetowej.
-   **Język:** Użyjemy trzech podstawowych języków internetu:
    -   **HTML** – do stworzenia szkieletu strony (gdzie co jest).
    -   **CSS** – do pokolorowania i upiększenia wszystkiego (wygląd).
    -   **JavaScript (bez żadnych dodatków!)** – do ożywienia strony, aby reagowała na kliknięcia i komunikowała się z "mózgiem" aplikacji.

**Chcesz wiedzieć więcej?** Szczegółowe, techniczne decyzje znajdziesz w [dokumentach architektonicznych](docs/architecture/).

## 3. Jak będzie wyglądał nasz proces pracy? (Praca z AI)

Wyobraź sobie, że mamy mały zespół ekspertów, którzy pomagają nam na każdym kroku. W naszym projekcie te role odgrywa Sztuczna Inteligencja (AI). Dzięki temu zobaczysz, jak wygląda praca w prawdziwym zespole programistycznym.

Oto nasz "zespół":

-   **[Product Manager](agents/product-manager_pl.md) (Szef Produktu):** Ustala, **CO** mamy zbudować. To on tworzy listę funkcji i historyjki użytkownika, np. "Użytkownik powinien móc wysłać wiadomość".

-   **[UX Designer](agents/ux-designer_pl.md) (Projektant Wyglądu):** Projektuje, **JAK** aplikacja ma wyglądać. Tworzy wizualne makiety (jak te w katalogu `docs/product/design_ux/`), abyśmy wiedzieli, do jakiego efektu dążymy.

-   **[Architekt](agents/solution-architect_pl.md) (Główny Inżynier):** Planuje, **JAK** zbudować aplikację od strony technicznej. Tworzy "mapy" i "schematy" (jak `api_design.md` czy `database_schema.md`), żeby wszystko do siebie pasowało.

-   **[Tech Lead](agents/tech-lead-task-planner_pl.md) (Lider Zespołu Technicznego):** Rozbija plany Architekta na małe, konkretne zadania do wykonania. Tworzy dla nas checklisty, np. "Stwórz plik `main.js`".

-   **[Deweloper](agents/software-developer_pl.md) (Programista):** To główny wykonawca – czyli **Ty i ja!** Bierzemy zadania od Tech Leada i piszemy kod, który sprawia, że aplikacja zaczyna działać.

## 4. Co dalej?

Jesteśmy gotowi do startu! Naszym pierwszym celem (opisanym w **Lekcji 1**) jest stworzenie szkieletu aplikacji i nawiązanie pierwszego połączenia między frontendem a backendem.

Zaczynajmy!
