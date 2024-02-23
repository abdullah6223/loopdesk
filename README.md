# Loopdesk

Open-source customer support platform that puts an AI agent, a human inbox, a help center and public feedback boards behind one in-product widget.

## What This Project Does

Small product teams answer support questions themselves, and the same questions keep coming back while feature requests and bug reports end up scattered across chats and emails. Loopdesk gives those teams one place to answer users and collect feedback: an AI agent answers from the team's own help articles, a person takes over when needed, and requests turn into public boards, a roadmap and a changelog.

It is built for startups and product teams who want to self-host their support stack or run it on Cloudflare Workers or Vercel.

Main features:

- **In-product widget.** A chat launcher for any website with an AI assistant, conversation history, feedback submission and help articles, with optional single sign-on so signed-in users are recognised.
- **AI support agent.** Answers questions from the help center and existing feedback, cites the articles it used, and hands the conversation to a person when it cannot help.
- **Human inbox.** Conversations handed off by the agent, with take-over, unread tracking, attachments and email notifications to the team.
- **Help center.** Articles and collections written in a Markdown editor, public help pages, and optional semantic search with pgvector.
- **Feedback boards.** Users post ideas and bugs, vote and comment; admins set statuses, merge duplicates and link similar posts.
- **Roadmap and changelog.** A public roadmap built from post statuses and a changelog with AI-assisted drafts.
- **MCP server.** AI assistants can read and manage feedback, comments, help articles and changelogs through an OAuth-protected Model Context Protocol endpoint.
- **Dashboard.** Board, inbox, help center, changelog, roadmap, widget, SSO and developer settings for admins.
- **Flexible sign-in.** Google, GitHub or email and password, with admin roles assigned by email.
- **English and Chinese UI**, and deploy targets for Docker, Cloudflare Workers and Vercel.

## How It Works

Loopdesk is a single Nuxt application. The Vue pages under `app/` serve both the admin dashboard and the public portal, and the Nitro server under `server/` provides the API, the MCP endpoint and background jobs.

1. A visitor opens the **widget** (`app/pages/widget/embed.vue`) on the host website and asks a question.
2. The message goes to `server/api/widget/messages.post.ts`, which runs the **agent** (`server/lib/agent`, built on Mastra and the AI SDK). The agent searches help articles and feedback with its tools and streams an answer with citations back over server-sent events.
3. If the agent cannot help, or the visitor asks for a person, the conversation is **handed off** to the inbox (`server/lib/inbox`). The team is notified by email, and an admin replies from `app/pages/dashboard/inbox.vue`.
4. Feature requests submitted from the widget or the portal become **feedback posts** on a board (`server/services/feedback.ts`). Their status changes feed the public roadmap and changelog.
5. Help articles written in the dashboard are stored as Markdown and, when enabled, indexed with embeddings for semantic search.
6. External AI assistants connect to **`/api/mcp`** (`server/api/mcp.ts`, `server/mcp`) using OAuth through Better Auth and call the same services the dashboard uses.

```mermaid
flowchart LR
    V[Visitor on host site] --> W[Widget]
    W --> M[/api/widget/messages/]
    M --> A[AI agent<br/>Mastra + AI SDK]
    A -->|search tools| H[(Help articles<br/>+ feedback)]
    A -->|answer with citations| W
    A -->|hand-off| I[Inbox]
    I --> T[Team in dashboard]
    W -->|submit idea| F[Feedback boards]
    F --> R[Roadmap + changelog]
    C[AI assistant] -->|OAuth| P[/api/mcp/]
    P --> F
    P --> H
    H --- DB[(PostgreSQL + pgvector)]
    F --- DB
    I --- DB
```

Data lives in PostgreSQL through Drizzle ORM (`server/db/schemas`), with SQL migrations in `server/db/migrations`. Uploaded files go to NuxtHub blob storage: the local filesystem by default, an S3-compatible bucket on Docker, R2 on Cloudflare, or Vercel Blob on Vercel.

## Project Structure

```
.
├── app/                    # Nuxt front end (dashboard, public portal, widget)
│   ├── pages/              # Routes: dashboard/, widget/, help/, changelog/, roadmap, auth/, mcp/, sso/
│   ├── components/         # Vue components (feedback, inbox, help, widget, settings, shadcn UI)
│   ├── composables/        # Shared state and data-fetching logic
│   ├── layouts/            # Dashboard and portal layouts
│   ├── stores/             # Pinia stores
│   └── workers/            # Web workers (e.g. image processing)
├── server/                 # Nitro back end
│   ├── api/                # REST endpoints: posts, boards, comments, help, changelogs, widget, admin, MCP
│   ├── lib/                # Agent, inbox, help search and onboarding logic
│   ├── services/           # Query and mutation services shared by the API and MCP
│   ├── mcp/                # MCP server, OAuth consent and tool definitions
│   ├── db/                 # Drizzle schemas and SQL migrations
│   ├── plugins/            # Startup plugins: migrations, blob storage, email, inbox scheduler
│   ├── tasks/              # Background tasks (inbox delivery)
│   ├── middleware/         # Request middleware
│   └── utils/              # Auth, email templates, helpers
├── shared/                 # Code shared by client and server (types, schemas, agent and inbox helpers)
├── modules/                # Local Nuxt modules: S3 blob driver, Cloudflare setup, widget preload
├── i18n/                   # English and Chinese translations
├── docs/                   # Deployment, configuration, widget and MCP guides
├── scripts/                # Maintenance and test scripts
├── tests/                  # Node test runner tests and fixtures
├── public/                 # Static assets and onboarding media
├── nuxt.config.ts          # Nuxt configuration
├── drizzle.config.ts       # Drizzle Kit configuration
├── Dockerfile              # Multi-stage production image
├── compose.yml             # Docker Compose stack: Postgres with pgvector + app
├── wrangler.toml           # Cloudflare Workers configuration
├── vercel.json             # Vercel configuration
└── .env.example            # Annotated environment variables
```

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Nuxt 3.8, Vue 3, Nitro | Full-stack app, server routes and multiple deploy presets |
| UI | Tailwind CSS 3.3, shadcn-nuxt 2.4, Reka UI 2.9, lucide icons | Components and styling |
| State | Pinia 0.5, VueUse 10.6 | Client state and utilities |
| Editor | Tiptap 2.1 (with Tiptap 3 list and Markdown extensions), CodeMirror 6, markdown-it 13.0 | Markdown editing and rendering |
| Database | PostgreSQL with pgvector | Data storage and vector search |
| ORM | Drizzle ORM 0.29, drizzle-kit 0.20, postgres 3.4, pg 8.11 | Schema, queries and migrations |
| Auth | Better Auth 1.7 (OAuth provider, MCP plugin) | Sign-in, sessions and MCP OAuth |
| AI | Mastra 1.67, AI SDK 2.2, `@ai-sdk/openai` 4.0, OpenAI SDK 4.17 | Support agent and AI drafts (any OpenAI-compatible API) |
| MCP | `@modelcontextprotocol/server` 2.2 | MCP endpoint for AI assistants |
| Storage | NuxtHub 0.10, Vercel Blob 0.15, S3-compatible driver | File uploads |
| Queues | Vercel Queue 0.7 | Delayed inbox delivery on Vercel |
| i18n | `@nuxtjs/i18n` 7.3 | English and Chinese UI |
| Validation | Zod 3.22 | Request and config validation |
| Tooling | TypeScript 5.2, vue-tsc 1.8, Nuxt ESLint 1.15, tsx 4.1 | Type checking, linting and scripts |
| Testing | Node test runner, PGlite 0.3, Playwright Core 1.39 | Unit, integration and browser checks |
| Deployment | Docker, Cloudflare Workers, Vercel | Hosting options |

## How to Run This Project

### 1. Prerequisites

- **Node.js 22**
- **pnpm 10** (the version is pinned in `package.json`; `corepack enable` installs it)
- **PostgreSQL** with the `vector` extension, or **Docker** to run `pgvector/pgvector:pg17`
- Optional: an **OpenAI-compatible API key** for the AI features, and a **Resend** key for email

### 2. Clone

```bash
git clone https://github.com/abdullah6223/loopdesk.git
cd loopdesk
```

### 3. Install dependencies

```bash
pnpm install
```

### 4. Environment variables

```bash
cp .env.example .env
```

Required:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/loopdesk` |
| `BETTER_AUTH_SECRET` | Session and cookie encryption secret, 32+ characters | `generate-with-openssl-rand-hex-32` |
| `SYSTEM_ADMIN_EMAILS` | Comma-separated emails that get the admin role on sign-up | `admin@example.com` |

Optional:

| Group | Variables | Purpose |
|---|---|---|
| Public URL | `BETTER_AUTH_URL` | Fixed public origin when a proxy rewrites the Host header |
| MCP | `MCP_ENABLED` | Set `false` to turn off the MCP endpoint |
| Sign-in | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `AUTH_EMAIL_ENABLED`, `AUTH_EMAIL_VERIFY` | OAuth providers and email/password login |
| AI | `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_TEXT_MODEL`, `HELP_SEARCH_BILINGUAL`, `HELP_VECTOR_SEARCH`, `AGENT_TIMING` | Agent, AI drafts, help search and timing logs |
| Email | `EMAIL_PROVIDER`, `RESEND_API_KEY`, `EMAIL_FROM` | Transactional email |
| File storage | `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`, `UPLOAD_PREFIX` | S3-compatible uploads on Docker / Node |
| Docker | `LOOPDESK_IMAGE` | Override the image used by `compose.yml` |

Every variable is described in `.env.example` and `docs/configuration.md`.

### 5. Database setup

Start PostgreSQL with pgvector, for example:

```bash
docker run -d --name loopdesk-db -p 5432:5432 \
  -e POSTGRES_DB=loopdesk -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres \
  pgvector/pgvector:pg17
```

Apply the migrations:

```bash
pnpm migrate
```

Production Node builds (including Docker) apply migrations automatically on startup. Sign up with an address listed in `SYSTEM_ADMIN_EMAILS` to become the admin.

### 6. Run

```bash
pnpm dev
```

Open <http://localhost:3000>. The dashboard is at `/dashboard`.

Production build:

```bash
pnpm build
node .output/server/index.mjs
```

Other targets: `pnpm build:cf` and `pnpm deploy:cf` for Cloudflare Workers, `pnpm build:vercel` for Vercel. See `docs/deploy/`.

### 7. Run tests

```bash
pnpm editor:test                                        # Markdown editor tests
pnpm mcp:test                                           # MCP tests
node --import tsx --test tests/widget-framing.test.ts   # a single test file
pnpm agent:test                                         # agent tests, read .env and need an AI key
pnpm i18n:check                                         # translation key check
```

The inbox tests expect a local database named `loopdesk_inbox_mvp` in `DATABASE_URL`.

### 8. Docker

Run Postgres and the app with Docker Compose (set `BETTER_AUTH_SECRET` and `SYSTEM_ADMIN_EMAILS` in `.env` first):

```bash
docker compose up -d
```

`compose.yml` uses the image in `LOOPDESK_IMAGE` (default `ghcr.io/abdullah6223/loopdesk:latest`). To build the image from source instead:

```bash
docker build -t loopdesk .
```

## License

[MIT](./LICENSE)
