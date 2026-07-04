# Cyberd Portfolio — Owner's Manual

This guide explains how to run, update, and publish the site without needing to understand every line of code.

## What you have

The repo is a monorepo with two main parts:

| Folder | Purpose |
|--------|---------|
| `web/` | The website (Astro static site + content) |
| `infra/` | AWS infrastructure (CDK: S3, CloudFront, contact API) |
| `.github/workflows/deploy.yml` | Automatic deploy on push to `main` |

Publishing is **git-based**: you edit content files, commit, and push. GitHub Actions builds and deploys.

---

## Prerequisites

- **Node.js 22.12+** (`node -v`)
- **npm 9.6.5+** (`npm -v`)
- Optional: **nvm-windows** to switch Node versions

---

## Local development

From the repo root:

```powershell
cd X:\Apps\cyberd_website
npm ci
npm run dev
```

Open `http://localhost:4321`.

To view from other devices on your network:

```powershell
npm run dev -- --host
```

### Environment variables (local)

Copy `.env.example` to `.env` if needed. For local dev, the contact form is optional:

```powershell
$env:PUBLIC_CONTACT_API_URL="https://your-api-id.execute-api.us-east-1.amazonaws.com/contact"
$env:PUBLIC_SOCIAL_API_URL="https://your-api-id.execute-api.us-east-1.amazonaws.com/social-links"
$env:PUBLIC_TURNSTILE_SITE_KEY="your-turnstile-site-key"
npm run dev
```

Without that variable, the form displays but does not submit.

### Theme toggle

The header includes a **Light / Dark** toggle. The choice is saved in your browser (`localStorage` key: `cyberd-theme`).

---

## Updating content

All human-visible content lives under `web/src/content/` and `web/public/`.

### Projects

**Path:** `web/src/content/projects/*.mdx`

Each file is one project page at `/projects/{filename-without-extension}`.

Example frontmatter:

```yaml
---
title: "Project name"
summary: "One-line description for cards and SEO."
date: "2026-06-30"
status: "case-study"   # live | case-study | research | archived
category: "Serverless Architecture"
tags: ["AWS", "Astro"]
highlights:
  - "Bullet one"
  - "Bullet two"
links:
  - label: "Live demo"
    href: "https://example.com"
agentReport: "Long paragraph for AI agents only. Not shown on the human page."
---
```

Body content below the frontmatter is the project write-up (Markdown/MDX).

### Notebook (articles)

**Path:** `web/src/content/notebook/*.mdx`

URL: `/notebook/{slug}`

```yaml
---
title: "Article title"
excerpt: "Short summary for listings and search."
date: "2026-06-30"
category: "Architecture"      # one editorial bucket
tags: ["AWS", "serverless"]   # many topical labels
readingTime: "5 min"          # optional
agentReport: "AI-only context paragraph."
---
```

- **Tags** and **categories** are separate. Tags get `/notebook/tags/{tag}` pages; categories get `/notebook/categories/{category}`.

### Papers (PDF-backed)

**Path:** `web/src/content/papers/*.mdx`  
**PDF files:** `web/public/papers/*.pdf`

```yaml
---
title: "Paper title"
summary: "Human-readable summary."
date: "2026-06-15"
category: "AI Research"
tags: ["credentials", "AI agents"]
pdf: "/papers/your-file.pdf"
citation: "Optional citation string."
agentReport: "AI-only briefing."
---
```

Put the actual PDF at `web/public/papers/your-file.pdf`.

### Testimonials

**Path:** `web/src/content/testimonials/*.json`

```json
{
  "name": "Jane Doe",
  "role": "CTO",
  "quote": "What they said about you.",
  "relationship": "Enterprise collaborator"
}
```

### Credentials / File page timeline

**Path:** `web/src/content/credentials/*.json`

```json
{
  "title": "Founder",
  "organization": "Your company",
  "start": "2023",
  "end": "Present",
  "summary": "Short paragraph.",
  "bullets": ["Achievement one", "Achievement two"],
  "type": "founder"
}
```

`type` is one of: `founder`, `enterprise`, `startup`, `education`, `credential`.

These feed the **File** page (`/about`) and the home page credentials section.

### Site-wide settings

**Path:** `web/src/lib/site.ts`

Update site name, description, author email, navigation labels, and logo path here.

Default logo: `web/public/logo.svg` (referenced as `/logo.svg`). Replace that file or point `logo` in `site.ts` at a PNG/JPG/WebP path.

---

## AI-native files (automatic)

On build, the site generates agent-facing files. You do **not** edit these by hand:

| URL | Purpose |
|-----|---------|
| `/llms.txt` | Curated index for AI crawlers |
| `/llms-full.txt` | Full Markdown corpus |
| `/about.md`, `/projects/foo.md`, etc. | Per-page agent reports |

Each content item's `agentReport` frontmatter field feeds these reports. Keep it factual and detailed for agents.

---

## Building for production locally

```powershell
npm run build
```

This runs Astro check + build + Pagefind search index generation. Output goes to `web/dist/`.

Preview the built site:

```powershell
npm run preview -w web
```

---

## Deploying to AWS

### First-time setup

1. Install AWS CLI and configure credentials (`aws configure`).
2. Bootstrap CDK (once per account/region):

   ```powershell
   cd infra
   npx cdk bootstrap
   ```

3. Set environment variables (or GitHub Actions vars/secrets):

   | Variable | Purpose |
   |----------|---------|
   | `SITE_URL` | Canonical site URL for sitemaps and AI files |
   | `DOMAIN_NAME` | Custom domain (optional) |
   | `HOSTED_ZONE_ID` | Route 53 zone ID (optional) |
   | `HOSTED_ZONE_NAME` | e.g. `example.com` (optional) |
   | `CONTACT_TO_ADDRESS` | Where contact emails go |
   | `CONTACT_FROM_ADDRESS` | Verified SES sender |
   | `PUBLIC_CONTACT_API_URL` | API Gateway `/contact` URL (for the form) |
   | `PUBLIC_SOCIAL_API_URL` | API Gateway `/social-links` URL (protected social buttons) |
   | `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key (public) |
   | `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret (Lambda only, never in web build) |
   | `SOCIAL_LINKEDIN_URL` | Your LinkedIn profile URL (Lambda env only) |
   | `SOCIAL_X_URL` | Your X profile URL (Lambda env only) |
   | `SOCIAL_TELEGRAM_URL` | Your Telegram URL (Lambda env only) |

4. Verify the sender email/domain in **Amazon SES** before the contact form will work.

### Manual deploy

```powershell
npm run build -w web
npm run deploy -w infra -- --require-approval never
```

### Automatic deploy (recommended)

Push to `main`. GitHub Actions will:

1. Build the site + Pagefind index
2. Synth and deploy CDK (S3 sync + CloudFront invalidation)

Required GitHub secret:

- `AWS_DEPLOY_ROLE_ARN` — IAM role for OIDC (no long-lived AWS keys)

---

## Common tasks

### Add a new project

1. Create `web/src/content/projects/my-project.mdx`
2. Fill frontmatter + body
3. Save — dev server hot-reloads
4. Commit and push to deploy

### Add a Notebook article

1. Create `web/src/content/notebook/my-article.mdx`
2. Set `category` and `tags`
3. Push to deploy

### Replace a PDF

1. Drop new file in `web/public/papers/`
2. Update the `pdf:` field in the matching paper MDX if the filename changed
3. Push to deploy

### Protected social buttons (LinkedIn, X, Telegram)

Social URLs are **never embedded in the static site HTML**. They live in Lambda environment variables and are returned only after Cloudflare Turnstile verification.

1. Create a Turnstile widget at [Cloudflare Dashboard](https://dash.cloudflare.com/) → Turnstile.
2. Set `SOCIAL_*_URL` values in deploy env (or CDK context).
3. Set `TURNSTILE_SECRET_KEY` as a GitHub secret / deploy env var.
4. Set `PUBLIC_TURNSTILE_SITE_KEY` and `PUBLIC_SOCIAL_API_URL` for the web build.
5. Deploy infra; copy the `SocialApiUrl` output into `PUBLIC_SOCIAL_API_URL`.

**Local testing:** Cloudflare provides always-pass test keys:

- Site key: `1x00000000000000000000AA`
- Secret key: `1x0000000000000000000000000000000AA`

---

### Change nav or site title

Edit `web/src/lib/site.ts`.

### Change colors / theme behavior

Edit `web/src/styles/global.css` — CSS variables at the top control light/dark palettes, shadows, and hover accent (`--color-hover`).

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Node.js v20.x is not supported by Astro` | Upgrade to Node 22.12+ (`nvm use 22.12.0`) |
| `npm ci` EPERM on Windows | Close dev server/editors locking `node_modules`, delete `node_modules`, retry |
| Contact form does nothing | Set `PUBLIC_CONTACT_API_URL` and verify SES sender |
| Search box empty locally | Run full build once (`npm run build`) — Pagefind index is created at build time |
| Page 404 on AWS but works locally | CloudFront URL rewrite handles clean URLs; redeploy after build |

---

## Security notes

- No contact submissions are stored in a database by default — email only via SES.
- S3 bucket is private; CloudFront serves content with OAC.
- Publishing access = git repo access + AWS deploy role.
- Do not commit `.env` files with secrets.

---

## Quick reference — file map

```
web/src/content/
  projects/       → /projects/*
  notebook/       → /notebook/*
  papers/         → /papers/*
  testimonials/   → home + /about
  credentials/    → /about (File page)

web/public/
  papers/         → PDF downloads

web/src/lib/site.ts     → site config
web/src/styles/global.css → design tokens + theme
infra/lib/portfolio-stack.ts → AWS resources
```

When in doubt: edit content under `web/src/content/`, run `npm run dev` to preview, push to `main` to publish.

**First-time setup?** See **[STARTUP_GUIDE.md](./STARTUP_GUIDE.md)** for the full deploy checklist.
