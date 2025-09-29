# Projekt: AI-Powered Team Chat

## 1. Wizja Produktu

Celem projektu jest stworzenie edukacyjnej aplikacji webowej typu "team chat", przypominającej funkcjonalnie uproszczoną wersję Slacka lub Discorda. Aplikacja ma służyć jako praktyczny przykład budowy nowoczesnego systemu klient-serwer, z naciskiem na przejrzystość kodu i demonstrację kluczowych technologii.

## 2. Architektura i Stos Technologiczny

System zostanie podzielony na dwa główne moduły:

### Backend
- **Język:** Python
- **Framework:** FastAPI (ze względu na jego wydajność, nowoczesność i wbudowane wsparcie dla WebSockets, co widać w istniejącym prototypie `project/server_iirc/`).
- **Komunikacja:** WebSockets (do obsługi komunikacji w czasie rzeczywistym).
- **Baza Danych:** Prosta, plikowa baza danych (np. SQLite), aby zapewnić trwałość danych (użytkownicy, kanały, historia wiadomości) między uruchomieniami serwera.

### Frontend
- **Technologia:** Lekki, prosty framework lub czysty JavaScript (Vanilla JS), HTML i CSS.
- **Podejście:** Skupimy się na podejściu, które będzie łatwe do zrozumienia dla uczniów, podobnie jak w prototypie `project/client/index.html`. Unikniemy skomplikowanych narzędzi budowania na wczesnym etapie. Interfejs będzie dynamicznie renderowany na podstawie danych otrzymanych z backendu.

Szczegółowe decyzje projektowe i architektoniczne znajdują się w dedykowanych dokumentach w katalogu `docs/architecture/`:
- **[Podstawowe Wybory Architektoniczne](docs/architecture/basic_choices.md)**: Uzasadnienie wyboru stosu technologicznego.
- **[Architektura Aplikacji Frontendowej](docs/architecture/frontend_architecture.md)**: Opis struktury i modułów aplikacji klienckiej.
- **[Projekt Schematu Bazy Danych](docs/architecture/database_schema.md)**: Definicja tabel i relacji w bazie SQLite.
- **[Projekt API WebSocket](docs/architecture/api_design.md)**: Pełna specyfikacja protokołu komunikacji WebSocket.

## 3. Kluczowe Funkcjonalności (Wstępny Zarys)

Bazując na [Głównych Funkcjonalnościach Aplikacji](docs/product/PRD/main_prd.md), możemy wyróżnić następujące kluczowe obszary funkcjonalne:

- **Zarządzanie Użytkownikami:** Rejestracja, logowanie, zarządzanie sesją.
- **Zarządzanie Kanałami:** Tworzenie i przeglądanie publicznych kanałów tematycznych.
- **Komunikacja w Czasie Rzeczywistym:** Wysyłanie i odbieranie wiadomości na kanałach bez konieczności odświeżania strony.
- **Interfejs Użytkownika:** Przejrzysty układ z listą kanałów, oknem czatu i listą użytkowników.

## 4. Plan Rozwoju

Będziemy pracować w sposób iteracyjny, zaczynając od zdefiniowania podstawowych historyjek użytkownika (User Stories) dla MVP (Minimum Viable Product), a następnie stopniowo rozbudowywać aplikację o kolejne funkcje.

## 5. Następne Kroki

- Szczegółowe zdefiniowanie wymagań i historyjek użytkownika dla pierwszej wersji produktu (MVP).
- Zaprojektowanie schematu bazy danych.
- Stworzenie podstawowej struktury projektu dla backendu i frontendu.

## 6. Proces Rozwoju z Wykorzystaniem AI

Projekt jest tworzony przy intensywnym wsparciu sztucznej inteligencji, która pełni rolę asystenta na różnych etapach rozwoju, odzwierciedlając pracę wyspecjalizowanego zespołu produktowo-technologicznego.

Nasz przepływ pracy (workflow) z AI można opisać następująco, przypisując do AI role z tradycyjnego zespołu deweloperskiego. Szczegółowe, polskojęzyczne definicje poszczególnych agentów znajdują się w katalogu `docs/agents/`.

- **AI jako [Product Manager](docs/agents/product-manager_pl.md):**
    - **Zadanie:** Definiowanie wymagań i historyjek użytkownika (User Stories).
    - **Proces:** Na podstawie ogólnych założeń i celów biznesowych, AI pomaga w precyz-yjnym formułowaniu historyjek użytkownika i kryteriów akceptacji.

- **AI jako [UX Designer](docs/agents/ux-designer_pl.md):**
    - **Zadanie:** Projektowanie doświadczeń użytkownika i interfejsu.
    - **Proces:** AI wspiera w tworzeniu makiet (wireframes), prototypów oraz w projektowaniu intuicyjnego i estetycznego interfejsu użytkownika, bazując na najlepszych praktykach UX.

- **AI jako [Architekt Oprogramowania](docs/agents/solution-architect_pl.md):**
    - **Zadanie:** Projektowanie architektury dla poszczególnych etapów.
    - **Proces:** AI wspiera w podejmowaniu decyzji architektonicznych, sugerując odpowiednie technologie, wzorce projektowe oraz strukturę systemu.

- **AI jako [Tech Lead](docs/agents/tech-lead-task-planner_pl.md):**
    - **Zadanie:** Planowanie kroków implementacyjnych.
    - **Proces:** AI pomaga w ustalaniu kolejności implementacji zadań, identyfikowaniu zależności oraz w podziale pracy na konkretne kroki (np. "co i gdzie należy zaimplementować").

- **AI jako [Deweloper](docs/agents/software-developer_pl.md):**
    - **Zadanie:** Pisanie kodu.
    - **Proces:** AI generuje kod, dokonuje refaktoryzacji, pisze testy i pomaga w debugowaniu, stanowiąc główną siłę wykonawczą w procesie tworzenia oprogramowania.

## 7. Licencja i Aspekty Prawne

Projekt jest udostępniany na licencji **Apache 2.0**. Jest to liberalna licencja open-source, która pozwala na szerokie wykorzystanie kodu, zarówno w projektach komercyjnych, jak i niekomercyjnych, pod warunkiem zachowania informacji o autorach i licencji.

Przed przystąpieniem do korzystania z projektu, modyfikowania go lub jego dystrybucji, zalecamy zapoznanie się z pełną treścią licencji.

Szczegółowa analiza potencjalnych ryzyk prawnych związanych z inspiracją istniejącymi produktami, ochroną danych (RODO) i innymi kwestiami została opisana w dokumencie **[Analiza Prawna](docs/legal.md)**.
