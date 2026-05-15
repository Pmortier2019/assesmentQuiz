# Mortier Asses — Assessment Training Platform

Een SaaS platform waar gebruikers psychometrische oefentesten maken ter voorbereiding op sollicitatieprocessen. Het platform voelt als een **persoonlijke assessment coach**: het herkent jouw rol en sector, bouwt een gepersonaliseerd voorbereidingspad en prioriteert de testen die jouw doelwerkgever ook daadwerkelijk gebruikt.

**Live URLs**
- Frontend: https://assesment-quiz.vercel.app
- Backend API: https://app-white-shadow-5362.fly.dev
- GitHub: https://github.com/Pmortier2019/assesmentQuiz

---

## Tech stack

| Laag | Technologie |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend | Java 17, Spring Boot 3.2.5, Spring Data JPA, Lombok |
| Database | H2 in-memory (dev + cloud) |
| Deployment | Vercel (frontend) + Fly.io (backend) |
| CI/CD | GitHub Actions — auto-deploy bij push naar `main` |

---

## Project structuur

```
assesmentQuiz/
├── backend/                              ← Spring Boot API
│   └── src/main/java/com/assesspro/backend/
│       ├── ai/                           ← AiClient interface + MockAiClient
│       ├── config/                       ← CORS, DataInitializer, Jackson
│       ├── controller/                   ← REST controllers
│       ├── dto/                          ← Request/response objecten
│       ├── entity/                       ← JPA entiteiten
│       │   └── enums/                    ← TestType, Difficulty, AssessmentCategory, …
│       ├── exception/                    ← GlobalExceptionHandler
│       ├── repository/                   ← JPA repositories
│       └── service/
│           ├── recommendation/           ← RecommendationEngine + RuleBasedImpl
│           ├── TestService.java
│           ├── UserService.java
│           └── …
├── src/                                  ← Next.js frontend
│   ├── app/
│   │   ├── dashboard/page.tsx
│   │   ├── onboarding/page.tsx
│   │   ├── tests/page.tsx
│   │   ├── tests/[id]/page.tsx
│   │   ├── results/page.tsx
│   │   └── pricing/page.tsx
│   ├── components/
│   │   ├── cards/                        ← TestCard, DashboardCard, PreparationPathCard, …
│   │   ├── layout/                       ← Navbar, Sidebar
│   │   ├── sections/                     ← HeroSection, PricingPreviewSection, …
│   │   ├── test/                         ← FilterBar, TestQuestionCard, ResultsSummary, …
│   │   └── ui/                           ← Badge, ProgressBar, StreakBadge, PaywallCard
│   └── lib/
│       ├── api.ts                        ← Alle backend calls + type mapping
│       ├── types.ts                      ← Frontend types
│       └── utils.ts
├── .github/workflows/fly-deploy.yml
├── .env.local                            ← NEXT_PUBLIC_API_URL (lokaal)
└── README.md
```

---

## Lokaal draaien

### Vereisten
- Node.js 20+
- Java 17+
- Maven 3.9+

### Frontend

```bash
# installeer dependencies
npm install

# kopieer de environment file
cp .env.local.example .env.local   # of maak zelf aan met:
# NEXT_PUBLIC_API_URL=http://localhost:8080

npm run dev
# → http://localhost:3000
```

### Backend

```bash
cd backend
mvn spring-boot:run
# → http://localhost:8080
```

Bij opstart seed de `DataInitializer` automatisch:
- 2 gebruikers (`demo@assesspro.io` FREE, `pro@assesspro.io` PRO)
- 14 testen met vragen, categorisatie en targeting metadata
- 1 AI-gegenereerde test via `MockAiClient`

---

## REST API

### Tests

| Method | Endpoint | Beschrijving |
|---|---|---|
| `GET` | `/api/tests` | Alle testen (filter: `type`, `difficulty`, `access`) |
| `GET` | `/api/tests/{id}?userId=1` | Test detail met vragen |
| `POST` | `/api/tests/{id}/submit` | Test inleveren, score + uitleg terug |
| `GET` | `/api/tests/recommended/{userId}` | Testen gerankt op relevantie voor gebruiker |

### Gebruikers

| Method | Endpoint | Beschrijving |
|---|---|---|
| `GET` | `/api/users/{id}` | Gebruikersprofiel (incl. career targets) |
| `GET` | `/api/users/{id}/results` | Alle resultaten van de gebruiker |
| `GET` | `/api/users/{id}/recommendations` | Aanbevolen testen (op basis van targets + historie) |
| `PATCH` | `/api/users/{id}/career-targets` | Rol, sector en bedrijf opslaan |
| `GET` | `/api/users/{id}/preparation-path` | Gepersonaliseerd voorbereidingspad |

### Subscriptions & Admin

| Method | Endpoint | Beschrijving |
|---|---|---|
| `GET` | `/api/users/{id}/subscription` | Abonnementsstatus |
| `POST` | `/api/users/{id}/subscription/mock-upgrade` | Upgrade naar Pro (mock, geen Stripe) |
| `POST` | `/api/admin/tests/generate` | AI-test genereren |

---

## Type mapping frontend ↔ backend

```
frontend AssessmentType    →  backend TestType
numerical_reasoning        →  NUMERICAL_REASONING
logical_reasoning          →  LOGICAL_REASONING
verbal_reasoning           →  VERBAL_REASONING
situational_judgement      →  SITUATIONAL_JUDGEMENT
personality                →  PERSONALITY_WORK_STYLE

frontend Difficulty   →  backend Difficulty
beginner              →  EASY
intermediate          →  MEDIUM
advanced              →  HARD
```

---

## Smart Categorisation & Recommendation System

### Achtergrond

Elke test heeft uitgebreide targeting metadata:

```json
{
  "title": "Advanced Data Interpretation",
  "category": "FINANCE_CONSULTING",
  "subcategory": "Data Interpretation",
  "targetRoles": ["Finance", "Data & Analytics", "Consulting"],
  "targetIndustries": ["Finance", "Consulting", "Technology"],
  "recommendedForCompanies": ["Goldman Sachs", "McKinsey", "BCG"],
  "skillsMeasured": ["financial data", "compound interest", "break-even analysis"]
}
```

### Career targets (gebruiker)

```json
{
  "targetRole": "Consulting",
  "targetIndustry": "Finance",
  "targetCompany": "McKinsey"
}
```

Sla je op via `PATCH /api/users/{id}/career-targets`.

### Recommendation engine

De engine zit in `backend/.../service/recommendation/`:

```
RecommendationEngine (interface)
  └── RuleBasedRecommendationEngine  ← huidig (Spring @Component)
  └── AiRecommendationEngine         ← toekomstig (TODO-commentaar in code)
```

**Scoringslogica** (rule-based):
- +3 punten als `targetRole` overeenkomt met een rol in `test.targetRoles`
- +2 punten als `targetIndustry` overeenkomt
- +1 punt als `targetCompany` voorkomt in `test.recommendedForCompanies`

Testen worden aflopend gesorteerd op score.

**Preparation path** — per rol een vaste volgorde, focuspunten en schatting in dagen:

| Rol | Volgorde | Focuspunten | Dagen |
|---|---|---|---|
| Consulting | Numerical → Situational → Logical → Verbal | speed, data interpretation | 21 |
| Software Engineering | Logical → Coding → Algorithmic → Numerical | logical deduction, patterns | 21 |
| Finance | Numerical → Data Interpretation → Situational | percentages, calculations | 18 |
| Communication & PR | Verbal → Writing → Situational → Logical | written communication, persuasion | 14 |
| HR | Personality → Situational → Verbal → Logical | empathy, conflict resolution | 14 |
| Management & Leadership | Leadership → Situational → Personality → Verbal | decision making, people management | 14 |

### Dashboard secties (career-aware)

Wanneer een gebruiker career targets heeft ingesteld, toont het dashboard:

1. **Preparation Path card** — donkere gradient kaart met geordende stappen, focuspunten en tijdlijn
2. **Recommended for [rol]** — testen gescoord door de rule engine, met "Best match" badge
3. **Popular for [rol]** — testen waarvan `targetRoles` overeenkomt
4. **Frequently used at [bedrijf]** — testen waarvan het bedrijf in `recommendedForCompanies` staat
5. **Suggested Daily Exercises** — vaste set van korte oefeningen per type

Zonder career targets verschijnt een `CareerSetupBanner` die naar de onboarding wijst.

### Tests pagina (filters)

Naast de bestaande filters (type, niveau, tier) zijn er nu:

- **Rol filter** — dropdown met alle 14 rollen
- **Sector filter** — dropdown met alle 12 sectoren
- **Best match sortering** — toont een aparte "Best Matches" sectie bovenaan
- **Aanbevolen badge** — "Best match" chip op kaarten waar `isRecommended: true`

---

## Onboarding flow

4-staps career-first flow:

```
Stap 1 — Rol
  Searchable dropdown + quick-pick cards (top 6 rollen)

Stap 2 — Sector
  Searchable dropdown + grid van alle 12 sectoren

Stap 3 — Bedrijf (optioneel)
  Vrij tekstveld + populaire shortcut-knopjes

Stap 4 — Niveau
  Beginner / Intermediate / Advanced
  Toont een samenvatting van je profiel
```

Na voltooiing: POST naar `PATCH /api/users/{id}/career-targets` en redirect naar `/dashboard`.

---

## Business model

| Tier | Toegang |
|---|---|
| **Free** | 5 testen, daarna paywall |
| **Pro** | Onbeperkt + AI-gegenereerde testen (toekomstig) |

Upgrade via `POST /api/users/{id}/subscription/mock-upgrade` (mock, Stripe nog niet gekoppeld).

---

## Deployment

### Frontend — Vercel

Auto-deploy bij elke push naar `main`. Environment variable:

```
NEXT_PUBLIC_API_URL=https://app-white-shadow-5362.fly.dev
```

### Backend — Fly.io

Auto-deploy via `.github/workflows/fly-deploy.yml` bij push naar `main` of `backend/**`.

```bash
# handmatig deployen
flyctl deploy --config backend/fly.toml
```

Vluchtige H2 database: data reset bij elke deploy. De `DataInitializer` zaait alles opnieuw.

---

## Bekende beperkingen

| Beperking | Status |
|---|---|
| Authenticatie | Hardcoded `CURRENT_USER_ID = 1` in `api.ts` |
| Database | H2 in-memory — data verdwijnt bij herstart |
| Streak | Staat altijd op 0, backend telt niet bij |
| Betaling | Mock upgrade, Stripe niet gekoppeld |
| AI client | MockAiClient — hardcoded JSON, geen echte LLM |
| Recommendation | Rule-based, nog geen AI personalisation |

---

## Toekomstige AI-uitbreiding

De architectuur is klaar voor een echte AI recommendation engine. Zoek op `TODO` in de codebase voor alle inhaakpunten:

- `RecommendationEngine` interface — vervang `RuleBasedRecommendationEngine` met `AiRecommendationEngine`
- `backend/.../ai/AiClient.java` — vervang `MockAiClient` met een echte Anthropic/OpenAI client
- Toekomstige AI-features: zwakke skills detecteren, bedrijfsspecifieke testpatronen, adaptieve moeilijkheidsgraad, dagelijkse gepersonaliseerde oefenplannen

---

## Technische gotchas

- **`@Transactional(readOnly = true)`** verplicht op alle service-methodes die lazy relations aanraken (anders `LazyInitializationException`)
- **Lombok `boolean isXxx` velden** moeten `@JsonProperty("isXxx")` hebben, anders serialiseert Jackson als `xxx`
- **`@ElementCollection(fetch = FetchType.EAGER)`** voor `targetRoles`, `targetIndustries`, `recommendedForCompanies`, `skillsMeasured` op `AssessmentTest`
- **Dubbele `@Transactional` import** in `TestService.java` was aanwezig — verwijderd
