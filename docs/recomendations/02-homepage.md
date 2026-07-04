# 02 — Homepage Recommendations

> **v2 (Jul 2, 2026)** — hero rewritten for the "enterprise architect and builder" positioning, techno-optimist tone, and the new Cyberd wordmark lockup; added a Learn section for the education-hub direction. Old → new logged at the bottom.

Section-by-section plan for `web/src/pages/index.astro`. Current structure (hero → projects → credentials/testimonials → notebook carousel → contact) is good; the content inside each section is what changes.

## 0. Header wordmark (new)

Replace the current plain site title with the lockup from `01-brand.md`:

```text
cyberd_            ← heavy, tight-tracked, single glyph accent (cursor or colored "d")
MIKE CHERNESKI     ← small caps / mono, wide letter-spacing, muted
```

Same lockup, scaled down, in the footer and OG/social image. Text/SVG, not raster.

## 1. Hero

**Current live copy:** "Build useful systems. Explain them clearly." + generic subtitle about the portfolio itself.

**Problem:** describes the website, not you. No name, no offer, no reason to contact.

**Recommended (v2):**

```text
Eyebrow:   Mike Cherneski · Enterprise Architect & Builder · Asheville, NC
H1:        Architecture for the
           forward-looking enterprise.
Subtitle:  I design and build systems across AI, serverless, blockchain, and
           the major clouds — with identity, auditability, and human
           accountability designed in from the start. Technology holds
           immense promise; capturing it takes a strict foundation. I help
           with both.
CTAs:      [Read the framework]  →  /papers/enterprise-intelligence-design
           [Start learning]      →  /notebook   (or #learn)
           [Work with me]        →  #contact
```

Subtitle notes: "immense promise" and the strict-foundation idea are the whitepaper's own words ("While commercially available AI holds immense promise…", "requires a strict foundation, anchored by a set of non-negotiable core principles"). Optimism first, discipline second — that ordering *is* the tone.

**"File snapshot" side panel** — keep the device, replace the stats:

| Label | Value |
|-------|-------|
| Now | Founder, Cyberd · Co-Founder/CTO, Moxa |
| Range | IT ops → cloud & serverless → blockchain → quantum → AI systems |
| Credential | AWS Certified Solutions Architect |
| Framework | Enterprise Intelligence Design (free download) |

(Adjust once the fill-in guide confirms years of experience — "X years across enterprise and startup technology" is a stronger first stat if the number is big.)

## 2. Services section (NEW — currently missing entirely)

The single biggest gap: nothing on the site says what someone can hire you for. Insert between hero and projects. Recommended three cards (confirm against fill-in guide):

1. **AI Integration Architecture** — Assessment, roadmap, and reference architecture for adopting AI in enterprise environments — "a flexible blueprint rather than a rigid prescription." Anchored by the Enterprise Intelligence Design framework.
2. **Fractional Architecture / CTO** — Ongoing senior technical judgment for founders and small teams: infrastructure, cost, security, hiring, build-vs-buy.
3. **Enterprise Modernization** — Legacy workflow modernization toward serverless, observable, auditable systems.

Each card: one-sentence outcome, three bullet deliverables, "Start a conversation" link to contact.

## 3. Learn section (NEW in v2 — the education hub)

The site's stated purpose is real value through tutorials, blogs, and eventually videos. Give that a first-class homepage section (between services and projects, or merged with the notebook carousel):

```text
Eyebrow:   Free, useful, no gate
H2:        Learn something you can use today.
Body:      Tutorials, frameworks, and working notes from real systems —
           written for humans, structured for AI agents. If it saves you a
           week of trial and error, it did its job.
Cards:     3 featured tutorials/articles (see 04-articles-and-papers.md)
CTA:       [Browse the notebook] → /notebook
```

When video lands, this section grows a "Watch" card row — don't build for it yet.

## 4. Selected work

Keep the three-card grid but replace the meta-projects. Recommended front three (details in `03-projects.md`):

1. **Moxa** — founder story, agentic control plane, AWS platform
2. **Enterprise Intelligence Design** — the framework itself as a flagship artifact
3. **This site** (keep the existing case study) or the web3/community cluster if you want the builder breadth up front

## 5. Credentials strip

Replace vague entries ("Enterprise Technology Operator, Before 2023") with named roles and dates from the fill-in guide. Named organizations vastly outperform anonymized ones; if an NDA prevents naming, use the industry ("Fortune 500 healthcare company") not "enterprise environments."

## 6. Testimonials

**Remove the placeholder quotes before anything else ships — they are fabricated and undermine the exact trust the site exists to build.** Hide the section until you have 2–3 real quotes (fill-in guide includes an ask-template). Real sources to try: Moxa co-founder, a former enterprise colleague/manager, a client from consulting work, Semantic Arts collaborators from gistCyber.

## 7. Notebook carousel + contact

Fine as-is structurally (the carousel may fold into the Learn section). The contact section should gain one line of expectation-setting: *"Tell me what you're building or what's breaking. I read everything and reply within two business days."* — professional and kind in one sentence.

## JSON-LD / agent surfaces

When copy updates land, also update `personJsonLd()` (`web/src/lib/jsonld.ts`), `llms.txt`, and the per-page `.md` reports so human and agent surfaces stay in sync — name, `sameAs` links (LinkedIn, GitHub ×2, X), `jobTitle` ("Enterprise Architect"), and `knowsAbout` (AI architecture, serverless, blockchain, quantum computing, cloud platforms).

---

## Revision log — v2 (old → new language)

| Item | v1 (old) | v2 (new) | Why |
|------|----------|----------|-----|
| Header | (no wordmark spec) | `cyberd_` lockup with "MIKE CHERNESKI" subline | Per Mike's wordmark request. |
| Hero eyebrow | "Mike Cherneski · Founder, Cyberd · Asheville, NC" | "Mike Cherneski · **Enterprise Architect & Builder** · Asheville, NC" | New identity. |
| Hero H1 | "Enterprise-grade AI adoption. Founder-grade speed." | "Architecture for the forward-looking enterprise." | Whitepaper language; optimist framing. |
| Hero subtitle | "I help organizations integrate AI…without losing control of identity, data, or auditability — drawing on a career that runs from IT operations to enterprise architecture to founding and building Moxa." | "I design and build systems across AI, serverless, blockchain, and the major clouds — with identity, auditability, and human accountability designed in from the start. Technology holds immense promise; capturing it takes a strict foundation. I help with both." | Adds builder breadth; replaces loss-avoidance framing with the whitepaper's promise+foundation pairing. |
| Hero CTAs | [Read the framework] [Work with me] | + **[Start learning]** | Education hub is a primary CTA now. |
| Snapshot "Range" | "IT support → enterprise architecture → AI systems" | "IT ops → cloud & serverless → blockchain → quantum → AI systems" | Full stated breadth. |
| Services card 1 | "…for adopting AI in regulated or security-conscious environments" | "…in enterprise environments — 'a flexible blueprint rather than a rigid prescription'" | Less fear-coded, direct whitepaper quote. |
| New section | — | "Learn" section with "Learn something you can use today." | Education-first direction. |
| JSON-LD | jobTitle unspecified | jobTitle "Enterprise Architect"; knowsAbout adds blockchain, quantum, cloud platforms | Match positioning. |
