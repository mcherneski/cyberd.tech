# Cyberd Portfolio — Startup Guide

Step-by-step checklists to go from a fresh clone to a fully deployed, production-ready portfolio site.

**Related docs:**
- [OWNER_MANUAL.md](./OWNER_MANUAL.md) — day-to-day content updates and operations
- [README.md](../README.md) — quick command reference

**Estimated time:** 2–4 hours for first deploy (longer if waiting on SES production access or DNS propagation).

---

## Phase 0 — What you are deploying

- [ ] Understand the architecture:
  - **Static site** (Astro) → S3 + CloudFront
  - **Contact form** → API Gateway + Lambda + SES email
  - **Social buttons** (LinkedIn, X, Telegram) → API Gateway + Lambda + Cloudflare Turnstile
  - **Publishing** → git push → GitHub Actions → CDK deploy

| Service | Purpose |
|---------|---------|
| S3 | Private bucket for static files |
| CloudFront | CDN + HTTPS + security headers |
| API Gateway (HTTP API) | Public URLs for `/contact` and `/social-links` |
| Lambda | Form handler + social-link gate |
| SES | Sends contact emails |
| Route 53 + ACM | Custom domain (optional) |
| Cloudflare Turnstile | Anti-bot for social links (free) |

---

## Phase 1 — Local machine setup

### Tools

- [ ] Install **Node.js 22.12+** (`node -v`)
- [ ] Install **npm 9.6.5+** (`npm -v`)
- [ ] Optional: **nvm-windows** for switching Node versions
- [ ] Install **AWS CLI v2** (`aws --version`)
- [ ] Install **Git**

### Verify AWS access

```powershell
aws sts get-caller-identity
aws configure list
```

- [ ] Command succeeds and shows your account ID and IAM user/role
- [ ] Default region is **`us-east-1`** (or note your chosen region — update `AWS_REGION` everywhere if different)

### Clone and install

```powershell
cd X:\Apps\cyberd_website
npm ci
```

- [ ] `npm ci` completes without `EPERM` errors  
  - If EPERM: stop dev server, close editors locking `node_modules`, delete `node_modules`, retry

### Run locally

```powershell
npm run dev
```

- [ ] Site loads at `http://localhost:4321`
- [ ] Optional LAN access: `npm run dev -- --host`

---

## Phase 2 — Personalize the site

### Site identity

Edit `web/src/lib/site.ts`:

- [ ] Update `name`, `title`, `description`
- [ ] Update `author.name`, `author.role`, `author.email`
- [ ] Replace logo: overwrite `web/public/logo.svg` or point `logo` at your file

### Content (replace seed/placeholder data)

| Content | Path |
|---------|------|
| Projects | `web/src/content/projects/*.mdx` |
| Notebook articles | `web/src/content/notebook/*.mdx` |
| Papers + PDFs | `web/src/content/papers/*.mdx` + `web/public/papers/*.pdf` |
| Testimonials | `web/src/content/testimonials/*.json` |
| File / resume timeline | `web/src/content/credentials/*.json` |

- [ ] Replace all placeholder projects and articles
- [ ] Replace placeholder testimonials and credentials
- [ ] Replace placeholder PDF in `web/public/papers/`
- [ ] Preview changes in dev server (hot reload)

### Production build smoke test

```powershell
npm run build
npm run preview -w web
```

- [ ] Build succeeds (requires Node 22.12+)
- [ ] Preview site looks correct
- [ ] Notebook search works (Pagefind index is built during `npm run build`)

---

## Phase 3 — AWS prerequisites

Your account will need these before features work end-to-end.

### CDK bootstrap (once per account + region)

```powershell
cd infra
npx cdk bootstrap
cd ..
```

- [ ] `CDKToolkit` stack created successfully

### Amazon SES (contact form email)

- [ ] Open **Amazon SES** in `us-east-1`
- [ ] Verify **sender** identity: `CONTACT_FROM_ADDRESS` (email or domain)
- [ ] Verify **recipient** identity if still in **SES sandbox** (`CONTACT_TO_ADDRESS`)
- [ ] Optional but recommended: request **SES production access** (allows emailing any address)

> **Note:** Your account may show `ProductionAccessEnabled: false` — contact form only delivers to verified addresses until production access is granted.

### Cloudflare Turnstile (protected social links)

- [ ] Create free Cloudflare account (if needed)
- [ ] Dashboard → **Turnstile** → Add site
- [ ] Add your domain (or `localhost` for testing)
- [ ] Save **Site key** → `PUBLIC_TURNSTILE_SITE_KEY`
- [ ] Save **Secret key** → `TURNSTILE_SECRET_KEY`

**Local dev test keys (always pass):**

| Key | Value |
|-----|-------|
| Site | `1x00000000000000000000AA` |
| Secret | `1x0000000000000000000000000000000AA` |

### Social profile URLs (server-side only)

Decide your real URLs — these never appear in static HTML:

- [ ] `SOCIAL_LINKEDIN_URL` — e.g. `https://linkedin.com/in/yourhandle`
- [ ] `SOCIAL_X_URL` — e.g. `https://x.com/yourhandle`
- [ ] `SOCIAL_TELEGRAM_URL` — e.g. `https://t.me/yourhandle`

---

## Phase 4 — Environment variables

Copy the template:

```powershell
copy .env.example .env
```

Fill in `.env` (local) and later mirror values in GitHub Actions / deploy shell.

### Site build (public — baked into static site)

| Variable | Example | Required |
|----------|---------|----------|
| `SITE_URL` | `https://yourdomain.com` | Yes (use CloudFront URL until domain is ready) |
| `PUBLIC_CONTACT_API_URL` | `https://xxx.execute-api.us-east-1.amazonaws.com/contact` | After 1st deploy |
| `PUBLIC_SOCIAL_API_URL` | `https://xxx.execute-api.us-east-1.amazonaws.com/social-links` | After 1st deploy |
| `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare site key | For social buttons |

- [ ] `.env` created from `.env.example`
- [ ] `SITE_URL` set (CloudFront URL is fine for first pass)

### Infrastructure deploy (CDK / Lambda)

| Variable | Example | Secret? |
|----------|---------|---------|
| `CONTACT_TO_ADDRESS` | `you@example.com` | GitHub secret |
| `CONTACT_FROM_ADDRESS` | `portfolio@yourdomain.com` | GitHub secret |
| `TURNSTILE_SECRET_KEY` | Cloudflare secret | GitHub secret |
| `SOCIAL_LINKEDIN_URL` | LinkedIn profile URL | GitHub var |
| `SOCIAL_X_URL` | X profile URL | GitHub var |
| `SOCIAL_TELEGRAM_URL` | Telegram URL | GitHub var |
| `DOMAIN_NAME` | `yourdomain.com` | Optional |
| `HOSTED_ZONE_ID` | Route 53 zone ID | Optional |
| `HOSTED_ZONE_NAME` | `yourdomain.com` | Optional |

- [ ] Contact email addresses chosen and SES-verified
- [ ] Social URLs and Turnstile keys ready
- [ ] Custom domain vars ready **or** skipped for now

> **Do not commit `.env`** — it is gitignored.

---

## Phase 5 — First manual deploy

Deploy infra first to get API URLs, then rebuild the site with those URLs.

### Step 5a — Deploy infrastructure

Set CDK env vars in your shell (PowerShell example):

```powershell
$env:CDK_DEFAULT_ACCOUNT = "YOUR_ACCOUNT_ID"
$env:CDK_DEFAULT_REGION = "us-east-1"
$env:CONTACT_TO_ADDRESS = "you@example.com"
$env:CONTACT_FROM_ADDRESS = "portfolio@yourdomain.com"
$env:TURNSTILE_SECRET_KEY = "your-turnstile-secret"
$env:SOCIAL_LINKEDIN_URL = "https://linkedin.com/in/yourhandle"
$env:SOCIAL_X_URL = "https://x.com/yourhandle"
$env:SOCIAL_TELEGRAM_URL = "https://t.me/yourhandle"
# Optional domain:
# $env:DOMAIN_NAME = "yourdomain.com"
# $env:HOSTED_ZONE_ID = "Z1234567890ABC"
# $env:HOSTED_ZONE_NAME = "yourdomain.com"
```

Build and deploy:

```powershell
npm run build -w web
npm run deploy -w infra -- --require-approval never
```

- [ ] CDK deploy completes without errors
- [ ] Note stack outputs:

```powershell
# Outputs appear at end of deploy; look for:
# - DistributionDomainName  → your CloudFront URL
# - ContactApiUrl           → contact form endpoint
# - SocialApiUrl            → social links endpoint
# - SiteBucketName
```

- [ ] Copy **DistributionDomainName** (e.g. `d1234abcd.cloudfront.net`)
- [ ] Copy **ContactApiUrl**
- [ ] Copy **SocialApiUrl**

### Step 5b — Rebuild site with API URLs

Update `.env` (or shell vars):

```powershell
$env:SITE_URL = "https://d1234abcd.cloudfront.net"
$env:PUBLIC_CONTACT_API_URL = "https://xxxx.execute-api.us-east-1.amazonaws.com/contact"
$env:PUBLIC_SOCIAL_API_URL = "https://xxxx.execute-api.us-east-1.amazonaws.com/social-links"
$env:PUBLIC_TURNSTILE_SITE_KEY = "your-turnstile-site-key"
```

Rebuild and redeploy:

```powershell
npm run build -w web
npm run deploy -w infra -- --require-approval never
```

- [ ] Second deploy uploads new static files to S3 and invalidates CloudFront

---

## Phase 6 — Verify production

Open your CloudFront URL (or custom domain).

### Static site

- [ ] Home page loads
- [ ] Projects, Notebook, Papers, File pages work
- [ ] `/404` works for bad URLs
- [ ] Light/dark toggle works
- [ ] Logo and wordmark display

### Search

- [ ] Notebook search returns results (Pagefind index present)

### AI-native files

- [ ] `/llms.txt` loads
- [ ] `/llms-full.txt` loads
- [ ] `/about.md` loads (agent report)

### Contact form

- [ ] Complete Turnstile (if on same page as social — social section has its own widget)
- [ ] Submit test message
- [ ] Email arrives at `CONTACT_TO_ADDRESS`
- [ ] If no email: check SES sandbox, verified identities, Lambda CloudWatch logs

### Social buttons

- [ ] Turnstile widget appears in contact section
- [ ] After verification, LinkedIn / X / Telegram buttons unlock
- [ ] Each button opens correct profile in new tab

### Optional custom domain

If you set `DOMAIN_NAME` + Route 53 vars:

- [ ] DNS resolves to CloudFront
- [ ] HTTPS certificate valid (ACM DNS validation via Route 53)
- [ ] Update `SITE_URL`, `PUBLIC_*` rebuild, redeploy
- [ ] Update Turnstile widget allowed domains in Cloudflare

---

## Phase 7 — GitHub CI/CD (recommended)

Automate deploy on push to `main` via `.github/workflows/deploy.yml`.

### Push repo to GitHub

- [ ] Create GitHub repository
- [ ] Push local `main` branch

```powershell
git remote add origin https://github.com/YOUR_ORG/cyberd_website.git
git push -u origin main
```

### Create GitHub OIDC deploy role in AWS

GitHub Actions uses **OIDC** (no long-lived AWS access keys).

- [ ] In IAM → **Identity providers** → Add **OpenID Connect** provider:
  - Provider URL: `https://token.actions.githubusercontent.com`
  - Audience: `sts.amazonaws.com`

- [ ] Create IAM role **GitHubDeployRole** with trust policy (replace `YOUR_ORG`, `YOUR_REPO`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/YOUR_REPO:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

- [ ] Attach permissions (start broad for first deploy, tighten later):
  - `AdministratorAccess` **or** scoped policy for CloudFormation, S3, CloudFront, Lambda, API Gateway, IAM pass-role, SES

- [ ] Copy role ARN → `arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubDeployRole`

### Configure GitHub repository

**Secrets** (Settings → Secrets and variables → Actions → Secrets):

- [ ] `AWS_DEPLOY_ROLE_ARN` — IAM role ARN from above
- [ ] `CONTACT_TO_ADDRESS`
- [ ] `CONTACT_FROM_ADDRESS`
- [ ] `TURNSTILE_SECRET_KEY`

**Variables** (Settings → Secrets and variables → Actions → Variables):

- [ ] `AWS_REGION` — `us-east-1`
- [ ] `SITE_URL` — `https://yourdomain.com` or CloudFront URL
- [ ] `PUBLIC_CONTACT_API_URL`
- [ ] `PUBLIC_SOCIAL_API_URL`
- [ ] `PUBLIC_TURNSTILE_SITE_KEY`
- [ ] `SOCIAL_LINKEDIN_URL`
- [ ] `SOCIAL_X_URL`
- [ ] `SOCIAL_TELEGRAM_URL`
- [ ] `DOMAIN_NAME` (optional)
- [ ] `HOSTED_ZONE_ID` (optional)
- [ ] `HOSTED_ZONE_NAME` (optional)

### Test CI/CD

- [ ] Push a small change to `main`
- [ ] GitHub Actions workflow **Deploy portfolio** runs green
- [ ] Site updates on CloudFront within ~2 minutes

---

## Phase 8 — Go-live checklist

- [ ] Replace all seed/placeholder content
- [ ] Real logo uploaded
- [ ] `SITE_URL` matches live canonical URL
- [ ] SES production access requested (if emailing arbitrary addresses)
- [ ] Turnstile production keys configured (not test keys)
- [ ] Social URLs point to real profiles
- [ ] Custom domain + HTTPS working (if applicable)
- [ ] Contact form tested end-to-end
- [ ] Social buttons tested end-to-end
- [ ] `/llms.txt` URLs use absolute production domain
- [ ] GitHub OIDC role scoped to least privilege (post-launch hardening)

---

## Quick command reference

| Task | Command |
|------|---------|
| Local dev | `npm run dev` |
| LAN dev | `npm run dev -- --host` |
| Production build | `npm run build` |
| Preview build | `npm run preview -w web` |
| Typecheck infra | `npm run typecheck -w infra` |
| CDK synth | `npm run synth -w infra` |
| CDK deploy | `npm run deploy -w infra -- --require-approval never` |
| AWS identity | `aws sts get-caller-identity` |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Astro refuses to run | Upgrade to Node **22.12+** |
| `npm ci` EPERM on Windows | Close dev server; delete `node_modules`; retry |
| CDK bootstrap missing | Run `npx cdk bootstrap` in `infra/` |
| Contact form 500 | Set `CONTACT_TO_ADDRESS` + `CONTACT_FROM_ADDRESS`; verify SES sender |
| Contact form silent | SES sandbox — verify recipient email too |
| Social buttons stay disabled | Set `PUBLIC_TURNSTILE_SITE_KEY` + `PUBLIC_SOCIAL_API_URL`; complete Turnstile |
| Social API 403 | Turnstile token invalid; check secret key matches site key |
| Search empty locally | Run `npm run build` once (Pagefind runs at build time) |
| 404 on subpages in prod | Redeploy after build; CloudFront rewrite function handles clean URLs |
| GitHub Action fails on AWS | Check `AWS_DEPLOY_ROLE_ARN` trust policy matches repo + branch |
| CSP blocks Turnstile | Redeploy infra — CSP allows `challenges.cloudflare.com` |

---

## After launch — ongoing workflow

1. Edit content in `web/src/content/` or `web/public/`
2. Preview: `npm run dev`
3. Commit and push to `main`
4. GitHub Actions builds and deploys automatically

For content editing details, see **[OWNER_MANUAL.md](./OWNER_MANUAL.md)**.

---

## Deploy order cheat sheet (two-pass)

Many env vars depend on CDK outputs. Use this order:

```
1. Bootstrap CDK
2. Configure SES + Turnstile + social URLs
3. Deploy infra (pass 1)          → get CloudFront + API URLs
4. Set SITE_URL + PUBLIC_* vars
5. Build web + deploy infra (pass 2)
6. Verify production
7. Wire GitHub Actions
8. Future updates: git push only
```

---

## Cost expectation

At personal-site traffic, expect roughly **low single-digit USD/month**:

- Route 53 hosted zone (~$0.50/mo) if using custom domain
- S3 + CloudFront + Lambda + API Gateway — mostly free tier / pennies
- SES — negligible at low volume
- Cloudflare Turnstile — free

No always-on servers. Pay-per-request serverless model.
