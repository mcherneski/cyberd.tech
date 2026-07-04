# Copy editing guide — where text lives on cyberd.tech

Use this map to find every place you can change words on the site. Most **body copy** belongs in **content files** under `web/src/content/`. **Page shells** and **components** hold section headings, CTAs, and UI labels. **Global identity** (name, tagline, nav, SEO defaults) lives in one config file.

Before writing or rewriting, read [copy-style-guide.md](./copy-style-guide.md) for voice and register (Professional vs Personal/Hobby).

---

## Quick reference

| You want to change… | Edit here |
|---------------------|-----------|
| Site name, tagline, nav labels, default SEO | [web/src/lib/site.ts](../web/src/lib/site.ts) |
| A project card or project page | [web/src/content/projects/](../web/src/content/projects/) |
| A blog-style article | [web/src/content/notebook/](../web/src/content/notebook/) |
| A PDF-backed paper entry | [web/src/content/papers/](../web/src/content/papers/) |
| Timeline / résumé entries | [web/src/content/credentials/](../web/src/content/credentials/) |
| A client quote | Add JSON in [web/src/content/testimonials/](../web/src/content/testimonials/) |
| Homepage hero, about bio, page intros | Page files in [web/src/pages/](../web/src/pages/) |
| Contact section, footer, social blurb | Components in [web/src/components/](../web/src/components/) |
| What AI agents see (`llms.txt`) | [web/src/lib/site.ts](../web/src/lib/site.ts) + content files (auto) |
| Unpublish without deleting | Set `draft: true` in frontmatter (projects & notebook) |

---

## 1. Global site identity

**File:** [web/src/lib/site.ts](../web/src/lib/site.ts)

This is the single source of truth for brand strings used across the whole site.

| Field | Where it appears |
|-------|------------------|
| `name` | Wordmark in header (`Cyberd.`) |
| `tagline` | Subtitle under wordmark |
| `logo` / `logoAlt` | Header logo, favicon, default OG image |
| `photo` | Homepage hero card, About page portrait |
| `title` | Default `<title>` and Open Graph title |
| `description` | Default meta description, OG description, [llms.txt](../web/src/pages/llms.txt.ts) intro |
| `author.name`, `author.role`, `author.email`, `author.location` | About-adjacent metadata, agent corpus |
| `nav[].label` | Header links (`Notebook`, `Projects`, `File`) |
| `nav[].href` | Header link destinations |

**Also affects SEO / structured data:** [web/src/lib/jsonld.ts](../web/src/lib/jsonld.ts)

| What to edit | Used for |
|--------------|----------|
| `personJsonLd()` — `worksFor`, `alumniOf`, `sameAs`, `knowsAbout` | JSON-LD on most pages (search engines, agents) |
| `articleJsonLd()` / `creativeWorkJsonLd()` | Pulled from content frontmatter; templates only |

---

## 2. Content collections (primary copy workspace)

Schemas are defined in [web/src/content.config.ts](../web/src/content.config.ts). Published content is loaded by [web/src/lib/content.ts](../web/src/lib/content.ts) (draft entries are filtered out for projects and notebook).

### Projects — `web/src/content/projects/*.mdx`

**URL pattern:** `/projects/{filename-without-extension}`

Each file has YAML frontmatter + MDX body. The body is the long-form case study; the frontmatter feeds cards and sidebars.

| Frontmatter field | Where it shows |
|-------------------|----------------|
| `title` | Card, project page `<h1>`, browser title |
| `summary` | Card blurb, page intro, search, `llms.txt` |
| `date` | Sort order (newest first) |
| `status` | Eyebrow on detail page (`live`, `case-study`, etc.) |
| `context` | Filter badge: `professional` vs `hobby` |
| `draft` | `true` = hidden everywhere (unpublish) |
| `category` | Card eyebrow, tags area |
| `tags` | Tag list on detail page |
| `highlights` | Sidebar bullet list on detail page |
| `links` | Sidebar external links |
| `agentReport` | Agent-only Markdown at `/projects/{slug}.md` and in `llms-full.txt` |

**Current files:**

- [alternun.mdx](../web/src/content/projects/alternun.mdx)
- [home-lab.mdx](../web/src/content/projects/home-lab.mdx)
- [moxa.mdx](../web/src/content/projects/moxa.mdx)
- [plant-grow-chamber.mdx](../web/src/content/projects/plant-grow-chamber.mdx)
- [serverless-ai-native-portfolio.mdx](../web/src/content/projects/serverless-ai-native-portfolio.mdx)
- [web3-community-tooling.mdx](../web/src/content/projects/web3-community-tooling.mdx)
- [web3-game-architecture.mdx](../web/src/content/projects/web3-game-architecture.mdx)

**Detail page shell (usually leave alone):** [web/src/pages/projects/[slug].astro](../web/src/pages/projects/[slug].astro) — renders frontmatter + MDX body.

---

### Notebook — `web/src/content/notebook/*.mdx`

**URL pattern:** `/notebook/{filename}`

Articles, tutorials, essays. Same MDX pattern as projects.

| Frontmatter field | Where it shows |
|-------------------|----------------|
| `title` | Index list, detail `<h1>`, carousel on homepage |
| `excerpt` | Index, homepage carousel, meta description |
| `date` / `updated` | Sort order, JSON-LD |
| `draft` | `true` = hidden |
| `category` | Index eyebrow; drives `/notebook/categories/{slug}` |
| `tags` | Tag chips; drives `/notebook/tags/{slug}` |
| `readingTime` | Optional; detail page if set |
| `agentReport` | Agent Markdown + full corpus |

**Current files:**

- [serverless-is-a-content-strategy.mdx](../web/src/content/notebook/serverless-is-a-content-strategy.mdx)
- [the-stack-behind-this-site.mdx](../web/src/content/notebook/the-stack-behind-this-site.mdx)
- [why-ai-native-websites-need-markdown.mdx](../web/src/content/notebook/why-ai-native-websites-need-markdown.mdx)

**Index / search:** [web/src/pages/notebook/index.astro](../web/src/pages/notebook/index.astro)

---

### Papers — `web/src/content/papers/*.mdx`

**URL pattern:** `/papers/{filename}`

PDF-backed entries with a human summary page and download link.

| Frontmatter field | Where it shows |
|-------------------|----------------|
| `title`, `summary`, `category`, `tags` | Cards, detail page, agents |
| `pdf` | Path under [web/public/](../web/public/) (e.g. `/papers/agent-readable-credentials.pdf`) |
| `citation` | Optional citation line on detail page |
| `agentReport` | Agent corpus |
| Body (MDX) | Intro text above PDF link |

**Current file:** [agent-readable-credentials.mdx](../web/src/content/papers/agent-readable-credentials.mdx)

**PDF asset:** [web/public/papers/agent-readable-credentials.pdf](../web/public/papers/agent-readable-credentials.pdf) — replace the file; update frontmatter if the title changes.

**Enterprise Intelligence Design:** When ready, add a new `.mdx` here pointing at a PDF in `web/public/papers/`.

---

### Credentials — `web/src/content/credentials/*.json`

**Shown on:** Homepage timeline, About page timeline ([ExperienceTimeline.astro](../web/src/components/ExperienceTimeline.astro))

Each JSON file is one timeline card. Files are sorted chronologically by `start` / `end` in [content.ts](../web/src/lib/content.ts).

| Field | Where it shows |
|-------|----------------|
| `title` | Card heading |
| `organization` | Subheading |
| `start`, `end` | Date range (`end` omitted = "Present") |
| `summary` | Card body |
| `bullets` | Reserved for future use (not rendered yet) |
| `type` | Eyebrow color: `founder`, `enterprise`, `startup`, `education`, `credential` |

**Current files:**

- [founder.json](../web/src/content/credentials/founder.json)
- [moxa.json](../web/src/content/credentials/moxa.json)
- [quantum.json](../web/src/content/credentials/quantum.json)
- [alvarez-marsal.json](../web/src/content/credentials/alvarez-marsal.json)
- [consulting.json](../web/src/content/credentials/consulting.json)
- [blockchain-advisory.json](../web/src/content/credentials/blockchain-advisory.json)
- [blockchain-engineering.json](../web/src/content/credentials/blockchain-engineering.json)
- [early-career.json](../web/src/content/credentials/early-career.json)
- [education.json](../web/src/content/credentials/education.json)
- [certifications.json](../web/src/content/credentials/certifications.json)

---

### Testimonials — `web/src/content/testimonials/*.json`

**Shown on:** Homepage (up to 2) and About page (all), when files exist.

| Field | Purpose |
|-------|---------|
| `name`, `role` | Attribution |
| `quote` | The testimonial text |
| `relationship` | Shown on About (`name / relationship`) |

**Currently empty** — add one file per quote, e.g. `jane-doe.json`. Sections auto-hide when there are no entries.

---

## 3. Page-level copy (hardcoded in templates)

These `.astro` files contain section headings and intro paragraphs that are **not** in content collections. Change copy directly in the HTML portion of each file.

### Homepage — [web/src/pages/index.astro](../web/src/pages/index.astro)

| Section | Copy to edit |
|---------|--------------|
| Hero eyebrow | `Mike Cherneski · Enterprise architect & builder · Asheville, NC` |
| Hero headline | `Enterprise architect by trade. Builder by nature.` |
| Hero paragraph | Value prop under headline |
| Hero CTAs | `Work with me`, `See projects` |
| Profile card | Role line, tagline under photo |
| Projects section | `Selected work`, `The work comes first.`, filter labels (`All`, `Professional`, `Hobby`), empty state, archive link |
| Testimonials | `Outside signal.` (only if testimonials exist) |

Projects, credentials, notebook, and papers **content** on this page come from collections — not from this file.

---

### About (“File”) — [web/src/pages/about.astro](../web/src/pages/about.astro)

| Section | Copy to edit |
|---------|--------------|
| Page `<title>` / description | Props on `BaseLayout` at top of file |
| Bio paragraphs | Two `<p>` blocks under `Mike Cherneski.` |
| Signal sidebar | Bullet list (`Founder & principal`, etc.) |

---

### Projects archive — [web/src/pages/projects/index.astro](../web/src/pages/projects/index.astro)

| Copy | Text |
|------|------|
| Eyebrow / title / intro | `Archive`, `Projects.`, filter intro paragraph |
| Filter labels | Same as homepage |
| Empty state | `Nothing here yet…` |

---

### Notebook index — [web/src/pages/notebook/index.astro](../web/src/pages/notebook/index.astro)

| Copy | Text |
|------|------|
| Eyebrow / title / intro | `Not blog. Notebook.`, etc. |
| Sidebar labels | `Categories`, `Tags` |

---

### Papers index — [web/src/pages/papers/index.astro](../web/src/pages/papers/index.astro)

| Copy | Text |
|------|------|
| Eyebrow / title / intro | `PDF archive`, `Papers.`, intro paragraph |

---

### 404 — [web/src/pages/404.astro](../web/src/pages/404.astro)

| Copy | Text |
|------|------|
| Heading / body | `Wrong alley.`, explanation, `Return home` |

---

### Category & tag archives

- [web/src/pages/notebook/categories/[category].astro](../web/src/pages/notebook/categories/[category].astro) — title derived from category slug; minimal static copy
- [web/src/pages/notebook/tags/[tag].astro](../web/src/pages/notebook/tags/[tag].astro) — same pattern for tags

---

## 4. Shared components (reused copy)

### Layout — [web/src/layouts/BaseLayout.astro](../web/src/layouts/BaseLayout.astro)

| Copy | Location |
|------|----------|
| Skip link | `Skip to content` |
| Wordmark | Pulled from `siteConfig` |
| Nav labels | Pulled from `siteConfig.nav` |
| Footer eyebrow + blurb | `AI-native portfolio`, agent explanation |
| Footer links | `llms.txt`, `llms-full.txt` |

Per-page `<title>` and `description` are passed in by each page's `BaseLayout` props (or fall back to `siteConfig`).

---

### Contact — [web/src/components/ContactForm.astro](../web/src/components/ContactForm.astro)

| Copy | Text |
|------|------|
| Section eyebrow / headline | `Work with me`, `Let's build something.` |
| Services blurb | Paragraph listing offerings |
| Form labels | `Name`, `Email`, `Message` |
| Submit button | `Send signal` |
| Status messages (JS) | `Sending…`, `Message sent.`, error strings |

Used on homepage and About.

---

### Social links — [web/src/components/SocialLinks.astro](../web/src/components/SocialLinks.astro)

| Copy | Text |
|------|------|
| Eyebrow / explanation | `Direct channels`, bot-scraping note |
| Button labels | `LinkedIn`, `X`, `Telegram` |
| Status messages (JS) | `Unlocking channels…`, `Verified. Choose a channel.`, etc. |

Actual URLs are **not** in this file — they come from AWS Lambda env vars (`SOCIAL_*_URL`), configured in `.env` / GitHub vars.

---

### Experience timeline — [web/src/components/ExperienceTimeline.astro](../web/src/components/ExperienceTimeline.astro)

| Copy | Text |
|------|------|
| Section header | `Credentials`, `Experience, on a timeline.` |
| Subtext | `Latest roles first…` |
| CTA (homepage only) | `Full file ->` |
| Card content | From credential JSON files |

---

### Content carousel — [web/src/components/ContentCarousel.astro](../web/src/components/ContentCarousel.astro)

| Copy | Text |
|------|------|
| Section header | `Notebook / papers`, `Recent thinking.` |
| CTA | `Browse Notebook` |
| Card titles/summaries | From notebook + papers collections |

---

### Search — [web/src/components/SearchBox.astro](../web/src/components/SearchBox.astro)

| Copy | Text |
|------|------|
| Label / placeholder | `Search`, `Notebook, projects, papers…` |
| Empty state | `No matches yet. Try different terms.` |

---

### Theme toggle — [web/src/components/ThemeToggle.astro](../web/src/components/ThemeToggle.astro)

| Copy | Text |
|------|------|
| `aria-label` (JS) | `Switch to dark mode` / `Switch to light mode` |

---

## 5. Agent & SEO surfaces (mostly auto-generated)

| Surface | File | What you edit |
|---------|------|---------------|
| `llms.txt` | [web/src/lib/agent.ts](../web/src/lib/agent.ts) → `llmsTxt()` | `siteConfig.description`; list content comes from collections |
| `llms-full.txt` | Same file → `llmsFullTxt()` | All collection summaries + `agentReport` fields |
| Per-page `.md` reports | Generated from content `agentReport` + body | Edit frontmatter in `.mdx` / `.json` |
| JSON-LD | [web/src/lib/jsonld.ts](../web/src/lib/jsonld.ts) | Person schema fields; article/project schemas from content |

To change how agents are *introduced* to the site, edit `siteConfig` and the section descriptions inside `llmsTxt()`. To change what agents learn about a specific piece, edit that entry's `agentReport` frontmatter.

---

## 6. Static assets (non-code copy)

| Asset | Path | Notes |
|-------|------|-------|
| Logo | [web/public/cyberd-logo.png](../web/public/cyberd-logo.png) | Referenced as `/cyberd-logo.png` in `site.ts` |
| Portrait | [web/public/mike-cherneski.jpg](../web/public/mike-cherneski.jpg) | Referenced in `site.ts` |
| Paper PDFs | [web/public/papers/](../web/public/papers/) | Linked from paper frontmatter `pdf` field |
| Enterprise Intelligence Design PDF | Not yet wired | Add to `public/papers/` + new paper `.mdx` when ready |

---

## 7. Draft workspace (optional)

**Folder:** [site_copy/](../site_copy/)

Markdown drafts for iterating on project copy **before** moving it into `web/src/content/projects/`. Not deployed — see [site_copy/README.md](../site_copy/README.md).

Workflow: edit in `site_copy/` → copy frontmatter + body into the matching `.mdx` → build.

For new articles from scratch, the Cursor skill at [.cursor/skills/draft-article/SKILL.md](../.cursor/skills/draft-article/SKILL.md) writes first drafts to `drafts/`.

---

## 8. Unpublishing & hiding content

| Collection | How |
|------------|-----|
| Projects | Set `draft: true` in frontmatter |
| Notebook | Set `draft: true` in frontmatter |
| Papers, credentials, testimonials | Delete the file or remove from folder (no draft flag yet) |

Draft projects/notebook entries are excluded in [content.ts](../web/src/lib/content.ts) and in static path generation for `[slug].astro` routes.

---

## 9. What you usually should **not** edit for copy

These files control layout, filtering, and wiring — not marketing text:

- [web/src/components/Card.astro](../web/src/components/Card.astro) — card chrome only; title/summary come from props
- [web/src/lib/project-filter.ts](../web/src/lib/project-filter.ts) — filter behavior
- [web/src/lib/site-search.ts](../web/src/lib/site-search.ts) — search logic
- [web/src/pages/projects/[slug].astro](../web/src/pages/projects/[slug].astro), [notebook/[slug].astro](../web/src/pages/notebook/[slug].astro), [papers/[slug].astro](../web/src/pages/papers/[slug].astro) — page structure; content from collections
- [infra/lambda/contact-handler.ts](../infra/lambda/contact-handler.ts) — email subject/body for form submissions (backend, not visible on site)

---

## 10. After you edit

1. **Preview locally:** `npm run dev -w web` → open `http://localhost:4321`
2. **Production build:** `npm run build -w web`
3. **Deploy:** push to `main` (GitHub Actions) or `npm run deploy` from `infra/`

New `.mdx` or `.json` files in `web/src/content/` are picked up automatically on build — no route registration needed.

---

## Related docs

- [copy-style-guide.md](./copy-style-guide.md) — voice, registers, messaging pillars
- [recomendations/](./recomendations/) — brand strategy and fill-in prompts (not deployed)
- [recomendations/06-fill-in-guide.md](./recomendations/06-fill-in-guide.md) — questionnaire for missing biographical/project details
