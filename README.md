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
- **Dashboard.** Board, inbox, help center, changelog, roadmap, widget, SSO and developer settings for admins.
- **Flexible sign-in.** Google, GitHub or email and password, with admin roles assigned by email.
- **English and Chinese UI.**

## Development

```bash
pnpm install
cp .env.example .env
pnpm migrate
pnpm dev
```

Requires PostgreSQL with the `vector` extension; set `DATABASE_URL`, `BETTER_AUTH_SECRET` and `SYSTEM_ADMIN_EMAILS` in `.env`.

## License

[MIT](./LICENSE)
