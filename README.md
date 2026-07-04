# Cyberd Portfolio

Static-first, AI-native portfolio site built with Astro and deployed to AWS with CDK.

## Local Development

Use Node 22.12 or newer.

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
```

The build emits static Astro output and then generates a Pagefind search index.

See **[docs/STARTUP_GUIDE.md](docs/STARTUP_GUIDE.md)** for the full first-time deploy checklist (AWS, SES, Turnstile, CI/CD).

See **[docs/OWNER_MANUAL.md](docs/OWNER_MANUAL.md)** for day-to-day content updates and operations.

## Deploy

The CDK stack expects `web/dist` to exist before synth/deploy:

```bash
npm run build -w web
npm run synth -w infra
npm run deploy -w infra -- --require-approval never
```

Set these values through environment variables, CDK context, or GitHub Actions variables/secrets:

- `SITE_URL`
- `PUBLIC_CONTACT_API_URL`
- `DOMAIN_NAME`
- `HOSTED_ZONE_ID`
- `HOSTED_ZONE_NAME`
- `CONTACT_TO_ADDRESS`
- `CONTACT_FROM_ADDRESS`

## AI-Native Files

The site generates:

- `/llms.txt`
- `/llms-full.txt`
- top-level Markdown summaries such as `/about.md`
- per-page agent reports such as `/projects/serverless-portfolio.md`
