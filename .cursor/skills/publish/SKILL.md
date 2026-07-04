---
name: publish
description: >-
  Build and deploy cyberd.tech to AWS production (S3, CloudFront, Lambda via CDK).
  Use when the user says /publish, publish, deploy the site, deploy to production,
  push live, or ship website changes.
---

# Publish cyberd.tech

Deploy the current working tree to production at **https://cyberd.tech**.

## When invoked

The user said `/publish` or wants the site live. **Execute the deploy yourself** — do not only describe steps.

## Prerequisites

- `.env` exists at repo root (copy from `.env.example` if missing)
- AWS CLI authenticated for account **752297506265** (`aws sts get-caller-identity`)
- Node dependencies installed (`npm ci` if `node_modules` missing or stale)

## Default workflow (local CDK deploy)

This repo's CDK entry (`infra/bin/cyberd-infra.ts`) reads **`process.env` only** — it does not load `.env` automatically. Always load `.env` before build and deploy.

### Option A — publish script (preferred on Windows)

From repo root:

```powershell
powershell -ExecutionPolicy Bypass -File .cursor/skills/publish/scripts/publish.ps1
```

### Option B — manual steps

```powershell
# 1. Load .env into the shell (PowerShell)
Get-Content .env | Where-Object { $_ -match '^\s*[^#].*=' } | ForEach-Object {
  $parts = $_ -split '=', 2
  if ($parts.Count -eq 2) { Set-Item -Path "Env:$($parts[0].Trim())" -Value $parts[1].Trim() }
}

# 2. Build
npm run build -w web

# 3. Deploy (allow ~2–3 min)
cd infra
npm run deploy -- --require-approval never
```

Required env vars for a full deploy (must be set from `.env`):

| Variable | Purpose |
|----------|---------|
| `SITE_URL`, `PUBLIC_*` | Astro build |
| `DOMAIN_NAME`, `HOSTED_ZONE_*` | Custom domain + cert (do not omit — empty values drop Route53/ACM) |
| `CONTACT_TO_ADDRESS`, `CONTACT_FROM_ADDRESS` | Contact Lambda |
| `TURNSTILE_SITEVERIFY_URL`, `TURNSTILE_SECRET_PARAMETER` | Turnstile |
| `SOCIAL_*_URL` | Social links Lambda |
| `CDK_DEFAULT_ACCOUNT`, `CDK_DEFAULT_REGION` | CDK target |

## After deploy

1. Confirm stack success: `CyberdPortfolioStack` UPDATE_COMPLETE
2. Smoke-check live HTML:

```powershell
curl.exe -sL -o NUL -w "%{http_code}" https://cyberd.tech/
```

Expect `200`. If stale, note CloudFront may need a hard refresh.

3. Tell the user: **Published to https://cyberd.tech**

## Git / CI (only if user asks)

Local deploy does **not** require a commit. Uncommitted changes can still go live via CDK.

To deploy via **GitHub Actions** instead: commit, push to `main`, workflow `.github/workflows/deploy.yml` runs OIDC → CDK. Only do this when the user explicitly wants git/CI deploy.

**Do not commit** unless the user asks.

## On failure

| Error | Fix |
|-------|-----|
| Build fails | Fix Astro/TS errors; run `npm run build -w web` until clean |
| CDK synth missing domain | `.env` not loaded — reload env vars |
| AWS auth error | `aws sts get-caller-identity`; re-auth IAM user |
| SES/contact 500 after deploy | Verify `CONTACT_TO_ADDRESS` / `CONTACT_FROM_ADDRESS` in `.env` and redeploy |

## Do not

- Deploy without building first
- Run `cdk deploy` without loading `.env` (drops `cyberd.tech` domain config)
- Commit or push unless the user requested it
