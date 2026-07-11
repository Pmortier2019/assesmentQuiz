# Ready to Ace — Assessment Training Platform

Een full-stack SaaS waar gebruikers psychometrische oefentesten maken ter voorbereiding op sollicitatieprocessen. Het platform voelt als een **persoonlijke assessment coach**: het herkent jouw rol en sector, bouwt een gepersonaliseerd voorbereidingspad en prioriteert de testen die jouw doelwerkgever ook daadwerkelijk gebruikt.

> De codebase gebruikt intern de namespace `assesspro`; het publieke product heet **Ready to Ace**.

**Live URLs**
- Website: https://www.ready-to-ace.com
- Backend API: https://app-white-shadow-5362.fly.dev
- GitHub: https://github.com/Pmortier2019/assesmentQuiz

> **Demo proberen?** Maak op [ready-to-ace.com](https://www.ready-to-ace.com) een gratis account aan (registratie + e-mailverificatie). Je krijgt 5 gratis testen voordat de paywall verschijnt.

---

## Highlights

- **Full-stack** — Next.js/React frontend + Spring Boot REST API
- **Echte authenticatie** — Spring Security + JWT, access-token in memory, refresh-token via httpOnly-cookie, e-mailverificatie en wachtwoordherstel
- **Managed Postgres** — Neon (EU Frankfurt) met point-in-time recovery; Flyway-migraties voor schemaversiebeheer
- **AI-testgeneratie** — live Anthropic Claude-client (`claude-haiku-4-5`) genereert nieuwe testen on-demand
- **Betalingen** — LemonSqueezy checkout + webhook voor Pro-abonnementen
- **Productie-infra** — GitHub Actions (CI, CodeQL, security scan, auto-deploy), Sentry error monitoring, UptimeRobot uptime checks
- **Smart recommendations** — rule-based engine die testen scoort op rol/sector/bedrijf, met een geordend voorbereidingspad
- **i18n & a11y** — Engels + Nederlands, reduced-motion, aria-labels en toetsenbordnavigatie

---

## Tech stack

| Laag | Technologie |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS, TanStack Query |
| Backend | Java 17, Spring Boot 3.2.5, Spring Data JPA, Spring Security, Lombok |
| Auth | JWT (jjwt), refresh-cookie, e-mailverificatie |
| Database | PostgreSQL via Neon (prod) · H2 in-memory (lokale dev) · Flyway-migraties |
| AI | Anthropic Claude (`claude-haiku-4-5`) via `ClaudeAiClient` |
| Betalingen | LemonSqueezy (checkout + webhook) |
| Monitoring | Sentry (frontend + backend), UptimeRobot |
| Deployment | Vercel (frontend) + Fly.io (backend) |
| CI/CD | GitHub Actions — CI, CodeQL, security scan, auto-deploy bij push naar `main` |

---

## Project structuur

```
assesmentQuiz/
├── backend/                              ← Spring Boot API
│   └── src/main/java/com/assesspro/backend/
│       ├── ai/                           ← AiClient interface + Claude/Gemini/Mock impls
│       ├── config/                       ← CORS, security, DataInitializer, Jackson
│       ├── controller/                   ← REST controllers (auth, tests, users, …)
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
│   └── src/main/resources/
│       ├── application-*.properties      ← profielen: dev (H2), railway (Postgres), …
│       └── db/migration/                 ← Flyway: V1__init … V4__password_changed_at
├── src/                                  ← Next.js frontend
│   ├── app/
│   │   ├── (app)/                        ← dashboard, tests, results, progress, study-plan, pricing
│   │   ├── login/ · onboarding/          ← auth + career-first onboarding
│   │   ├── verify-email/ · forgot-password/ · reset-password/
│   │   └── admin/ · practice/
│   ├── components/                       ← cards, layout, sections, test, ui
│   └── lib/
│       ├── api.ts                        ← Alle backend calls + type mapping
│       ├── auth.ts · useAuth.ts          ← toclauder (in memory)
│       ├── queries.ts · queryClient.tsx  ← TanStack Query
│       ├── i18n.tsx                       ← EN/NL vertalingen
│       └── types.ts · utils.ts
├── .github/workflows/                    ← ci, codeql, security, fly-deploy, staging-deploy
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
npm install

# environment
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

npm run dev
# → http://localhost:3000
```

### Backend

```bash
cd backend
# lokaal draait standaard op het dev-profiel met een H2 in-memory DB
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
# → http://localhost:8080
```

Bij opstart seed de `DataInitializer` automatisch testdata (gebruikers, 14 testen met
categorisatie- en targeting-metadata). Voor AI-generatie lokaal heb je geen API-key
nodig: zonder key valt de `MockAiClient` in.

---

## REST API

### Auth (`/api/auth`)

| Method | Endpoint | Beschrijving |
|---|---|---|
| `POST` | `/register` | Account aanmaken |
| `POST` | `/login` | Inloggen → access-token + refresh-cookie |
| `POST` | `/refresh` | Access-token verversen via refresh-cookie |
| `POST` | `/logout` | Sessie beëindigen |
| `POST` | `/verify-email` · `/resend-verification` | E-mailverificatie |
| `POST` | `/forgot-password` · `/reset-password` | Wachtwoordherstel |

### Tests (`/api/tests`)

| Method | Endpoint | Beschrijving |
|---|---|---|
| `GET` | `/api/tests` | Alle testen (filter: `type`, `difficulty`, `access`) |
| `GET` | `/api/tests/{id}` | Test detail met vragen |
| `POST` | `/api/tests/{id}/submit` | Test inleveren, score + uitleg terug |
| `GET` | `/api/tests/recommended/me` | Testen gerankt op relevantie voor de ingelogde gebruiker |

### Gebruikers (`/api/users`)

| Method | Endpoint | Beschrijving |
|---|---|---|
| `GET` | `/{userId}` | Gebruikersprofiel (incl. career targets) |
| `GET` | `/{userId}/results` | Alle resultaten van de gebruiker |
| `GET` | `/{userId}/recommendations` · `/recommended-tests` | Aanbevolen testen |
| `PATCH` | `/{userId}/career-targets` | Rol, sector en bedrijf opslaan |
| `GET` | `/{userId}/preparation-path` | Gepersonaliseerd voorbereidingspad |
| `GET` | `/{userId}/skills-summary` | Skills-overzicht over sessies heen |

### Subscriptions, Admin & Webhooks

| Method | Endpoint | Beschrijving |
|---|---|---|
| `GET` | `/api/users/{userId}/subscription` | Abonnementsstatus |
| `GET` | `/api/users/{userId}/subscription/checkout-url` | LemonSqueezy checkout-URL |
| `DELETE` | `/api/users/{userId}/subscription` | Abonnement opzeggen |
| `POST` | `/api/webhooks/lemonsqueezy` | LemonSqueezy betalings-webhook |
| `POST` | `/api/admin/tests/generate` · `/generate-type/{userId}/{type}` | AI-test genereren |
| `GET` | `/api/admin/stats` · `/users` · `/tests` | Admin-dashboard data |
| `GET` | `/api/leaderboard` | Ranglijst |

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

---

## Onboarding flow

4-staps career-first flow:

```
Stap 1 — Rol        Searchable dropdown + quick-pick cards (top 6 rollen)
Stap 2 — Sector     Searchable dropdown + grid van alle 12 sectoren
Stap 3 — Bedrijf    Vrij tekstveld + populaire shortcut-knopjes (optioneel)
Stap 4 — Niveau     Beginner / Intermediate / Advanced + profiel-samenvatting
```

Na voltooiing: `PATCH /api/users/{id}/career-targets` en redirect naar `/dashboard`.

---

## Business model

| Tier | Toegang |
|---|---|
| **Free** | 5 testen, daarna paywall |
| **Pro** | Onbeperkt + AI-gegenereerde testen |

Upgrade verloopt via LemonSqueezy: de frontend haalt een checkout-URL op
(`GET /api/users/{id}/subscription/checkout-url`); na betaling bevestigt de
webhook (`POST /api/webhooks/lemonsqueezy`) het abonnement.

---

## AI-testgeneratie

`AiClient` is een interface met drie implementaties:

```
AiClient (interface)
  ├── ClaudeAiClient   ← actief (@Component) — Anthropic claude-haiku-4-5
  ├── GeminiAiClient   ← uitgeschakeld (alternatieve provider)
  └── MockAiClient     ← lokale fallback zonder API-key
```

Wisselen van provider = de actieve Spring-bean wisselen. De gegenereerde JSON wordt
gevalideerd (`AiTestJson`) en als echte test met vragen opgeslagen.

---

## Deployment

### Frontend — Vercel

Auto-deploy bij elke push naar `main`. Environment variable:

```
NEXT_PUBLIC_API_URL=https://app-white-shadow-5362.fly.dev
```

### Backend — Fly.io

Auto-deploy via `.github/workflows/fly-deploy.yml` bij push naar `main` of wijziging in
`backend/**`. Het `railway`-profiel draait tegen Neon Postgres met `ddl-auto=validate`;
Flyway voert migraties uit bij opstart.

```bash
# handmatig deployen
flyctl deploy --config backend/fly.toml
```

Productie-secrets (datasource, JWT, LemonSqueezy, Sentry) staan als Fly.io-secrets en
worden nooit in git bewaard — Gitleaks draait in CI.

---

## Engineering-keuzes & gotchas

- **`@Transactional(readOnly = true)`** op service-methodes die lazy relations aanraken (anders `LazyInitializationException`)
- **Lombok `boolean isXxx` velden** krijgen `@JsonProperty("isXxx")`, anders strippt Jackson de `is`
- **Connection pooling** — HikariCP `minimum-idle=0` zodat de Neon free-tier compute mag slapen; voorkomt een reconnect-stall na idle (zie issue #77)
- **Auth zonder localStorage** — access-token in memory + refresh via httpOnly-cookie beperkt XSS-impact
- **N+1 vermeden** — collections worden batch-gefetcht in de tests-lijst (issue #79)

---

## Roadmap

- `AiRecommendationEngine` die de rule-based engine vervangt (interface ligt klaar)
- Adaptieve moeilijkheidsgraad en zwakke-skill-detectie
- Dagelijkse gepersonaliseerde oefenplannen voor Pro-gebruikers
- Extra talen (DE, FR — `Locale`-type is voorbereid)
