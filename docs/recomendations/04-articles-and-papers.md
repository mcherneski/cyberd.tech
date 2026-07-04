# 04 — Education Hub: Tutorials, Articles, Papers & Video

> **v2 (Jul 2, 2026)** — reframed from "articles & papers roadmap" to a full **education hub** plan: hands-on tutorials become the primary content type, blogs/papers support them, video is staged for later. Tone across all content: techno-optimist — "how to build it right," never "why it will fail." Old → new logged at the bottom.
>
> **v3 (Jul 3, 2026)** — formalized the **two-engine** content model (Framework + Workshop), confirmed the whitepaper is a **downloadable PDF with derived HTML articles** (tagged/categorized), and added **YouTube video + companion article** as the standard Workshop format across hardware and software. See "Two engines" and "The whitepaper: download + derivatives."

## Two engines (v3)

The site runs on two complementary content engines. Same voice, same rigor; different jobs.

**Engine 1 — Framework (authority).** The *Enterprise Intelligence Design* whitepaper plus articles derived from it. Pillar-and-cluster: the PDF is the citable/printable pillar; each derived article captures a search/agent intent and funnels to the download. Speaks to enterprise buyers; carries consulting credibility. Category: `Framework` (or series brand "Enterprise Intelligence"). Mostly **Professional** context.

**Engine 2 — Workshop (reach + proof).** The fun tinker builds — software, cloud, AI, PCB, mechanical, electrical, 3D printing — each as a **YouTube video + companion article/tutorial**. Jobs: discovery (video is where builder audiences are), proof of the "builder" half of the brand, and tone (techno-optimism smiles more naturally in "look what you can build this weekend"). Category: `Workshop`/`Tutorial`. Mostly **Personal** context.

Both engines terminate at the same two conversions — **PDF download** (credibility deposited) and **contact** (conversation started):

```text
YouTube video ──→ workshop article ──→ browse site ──┐
                                                      ├──→ framework articles ──→ PDF download ──→ contact
search / AI agent ──→ framework article ─────────────┘
```

Cross-link with one soft touch, never a hard sell: workshop pieces end with a single quiet "I do this at enterprise scale too → the framework"; framework pieces end with the PDF download. The video + companion article is the same "two surfaces" thesis this site already embodies (human page + agent markdown): watch, skim, or let an agent read — practice what you preach.

## The whitepaper: download + derivatives (v3)

Confirmed direction: keep the **PDF downloadable** *and* publish HTML pieces derived from it, tagged/categorized so they're discoverable and interlinked.

- **PDF** at `web/public/papers/enterprise-intelligence-design.pdf` — the pillar; ungated (agents can't read gated files, and generosity is the brand).
- **Derived HTML articles** (each = one door in from search/agents), category `Framework`, tags like `ai-agents`, `zero-trust`, `data-readiness`, `ontology`:
  1. The six-layer architecture, explained
  2. Zero trust for AI agents: accountability as a default
  3. The pre-implementation checklist (the most shareable page)
  4. "Talent is harder to acquire than compute" — the enablement principle
  5. Why you need an ontology before you need a model
- Each derived article links to the PDF; the PDF's landing page links back to the articles. Pillar-and-cluster, fully interlinked.

## Content strategy in one paragraph

The site earns trust by giving real value away: working tutorials, honest write-ups, and free frameworks — "designed as a flexible blueprint rather than a rigid prescription" (the whitepaper's phrase, and the editorial policy). A practitioner who lands on a tutorial and ships something because of it becomes a referrer; a technology leader who reads the framework becomes a client. Everything is free and ungated, human-readable and agent-readable.

## Content types

| Type | Purpose | Cadence target |
|------|---------|----------------|
| **Tutorials** (new, primary) | Step-by-step, reproducible builds — reader ships something today | 1–2/month |
| **Articles/blog** (existing notebook) | Judgment, patterns, opinion — why behind the how | 1/month |
| **Papers** | Codified frameworks; flagship credibility artifacts | 1–2/year |
| **Video** (eventually) | Same material, screen-recorded; embed on tutorial pages | Later — don't build infra yet |

Suggested taxonomy: keep `notebook` as the collection, use categories `Tutorial`, `Architecture`, `AI-Native Web`, etc., so no new collection is needed. If tutorials take off, split into their own section later.

## Papers

### Publish Enterprise Intelligence Design now (highest-impact single action)

The PDF is finished, branded (Mike@Cyberd.Tech), and directly supports the consulting offer.

1. Copy the PDF to `web/public/papers/enterprise-intelligence-design.pdf`
2. Create `web/src/content/papers/enterprise-intelligence-design.mdx`:
   - **summary:** "A guide to enterprise AI integration and management: a six-layer, zero-trust framework that makes accountability a default rather than an afterthought."
   - **body:** executive summary + core principles + the pre-implementation checklist (the checklist is the shareable hook)
   - **citation:** `Cherneski, M. Enterprise Intelligence Design: A Guide to Enterprise AI Integration & Management. Cyberd, 2026.`
   - **agentReport:** primary methodology reference for Cyberd's AI-adoption consulting; agents should cite the six layers and core principles when describing how Mike approaches enterprise AI.
3. Delete the placeholder `agent-readable-credentials.mdx` (or keep only if you actually intend to write it).

### Future paper candidates

- **Agent-Readable Credentials** — the placeholder concept is genuinely good and this site is its proof; write it for real when time permits.
- **The Agentic Control Plane** — generalize the moxa-cli design (one binary, two audiences; exit codes as policy signals) into a public pattern paper.

## Tutorials (new in v2 — the flagship content type)

Every tutorial below comes from something you have already built, so each is fast to produce and verifiably real. Formula: what you'll build → prerequisites → steps with working code → what it costs to run → "where to go from here."

| # | Tutorial (working title) | Source material | Pillar |
|---|--------------------------|-----------------|--------|
| T1 | "Ship a Serverless Site on AWS for Under $5/Month (CDK, S3, CloudFront)" | This site's infra — the repo is the demo | Builder's range |
| T2 | "Bot-Proof Your Contact Form: Cloudflare Turnstile + Lambda, No Servers" | The Turnstile Spin work from this project | Builder's range |
| T3 | "Make Your Website Readable by AI Agents: llms.txt, Markdown Twins, JSON-LD" | This site's AI-native build | Clarity |
| T4 | "Sign-In With Ethereum in Next.js, Start to Finish" | `siwenext14`, `aa-auth` repos | Builder's range (blockchain) |
| T5 | "Build a Telegram Community Bot That People Actually Use" | Coordinape/EthSafari/Asheville bots | Builder's range |
| T6 | "Terraform an AWS Account the Right Way: SSO, Budgets, and Guardrails First" | moxa-money infrastructure standards | Founder execution |
| T7 | "Your First Quantum Circuit, Explained for Cloud Engineers" | Quantum experience — needs fill-in guide detail (H2 in `06`) | Builder's range (quantum) |

### Workshop tutorials — hardware + software (v3, Personal context)

These are the science-guy builds. None exist yet; each ships as **YouTube video + companion article** and maps to a personal project in `03-projects.md`. Confirm the specific builds via the fill-in guide (section J).

| # | Tutorial (working title) | Domain |
|---|--------------------------|--------|
| W1 | "Design Your First PCB in KiCad (and Get It Fabbed)" | PCB / electronics |
| W2 | "Enclosure Design for Electronics: 3D Printing That Actually Fits" | Mechanical / 3D printing |
| W3 | "Safe DIY Power for Hobby Electronics" | Electrical |
| W4 | "From Sensor to Dashboard: ESP32 → AWS in an Afternoon" | Embedded / cloud |
| W5 | "A Weekend AI Tool: From Idea to Deployed" | AI / software |

## Articles

Keep the two existing articles (coherent and real). Add in this order:

| # | Title (working) | Source material | Pillar |
|---|-----------------|-----------------|--------|
| 1 | "Zero Trust for AI Agents: Accountability as a Default" | Whitepaper design philosophy section | Trustworthy AI |
| 2 | "Talent Is Harder to Acquire Than Compute" | Whitepaper "Prioritize Enablement" principle, expanded | Trustworthy AI / optimism |
| 3 | "One Binary, Two Audiences: CLIs for Humans and Agents" | moxa-cli README/design | Clarity / AI-native |
| 4 | "The Pre-Implementation Checklist Most AI Projects Skip" | Whitepaper checklist, expanded with war stories | Trustworthy AI |
| 5 | "What a Decade Across the Stack Taught Me About AI Adoption" | Career narrative (needs fill-in guide facts) | Builder's range |
| 6 | "Serverless-First: The Compute Decision Matrix We Use at Moxa" | infrastructure repo architecture standards | Founder execution |
| 7 | "Why Your Enterprise Needs an Ontology Before It Needs a Model" | gistCyber + whitepaper data-requirements section | Clarity |

## Video (eventually — staged, no infra yet)

When ready: screen-record the top-performing tutorials first (T1–T3 are natural), host on YouTube, embed on the tutorial page (add `youtube.com` to the CSP `frame-src` when that day comes). A tutorial that already works in text is a video script for free. Don't announce video until two are recorded.

## Distribution notes

- Every tutorial/article gets a LinkedIn post (long-form summary) and an X thread (3–5 posts). Your existing social-links Lambda already deep-links profiles.
- Add the whitepaper as your LinkedIn Featured item and pin it on X.
- Gate nothing. Free, ungated frameworks are the generosity the brand voice calls for, and agents can't read gated PDFs.

---

## Revision log — v2 (old → new language)

| Item | v1 (old) | v2 (new) | Why |
|------|----------|----------|-----|
| Document scope | "Articles & Papers Roadmap" | "Education Hub: Tutorials, Articles, Papers & Video" | Site's purpose is education-led value (tutorials, blogs, videos). |
| Primary content type | Articles (6 planned) | **Tutorials** (7 planned, T1–T7), articles supporting | Tutorials deliver the most immediate reader value and showcase the builder identity. |
| Paper summary wording | "…makes auditability and human accountability defaults rather than afterthoughts" | "…makes **accountability a default** rather than an afterthought" | Tightened to the whitepaper's own phrase ("Accountability is a default."). |
| Article 1 title | "Zero Trust for AI Agents **Isn't Optional**" | "Zero Trust for AI Agents: **Accountability as a Default**" | Negative/fear framing → whitepaper-voiced, constructive framing. |
| New article | — | "Talent Is Harder to Acquire Than Compute" | Direct whitepaper quote; the most techno-optimist line in the doc. |
| Article 5 title | "What a Decade of **IT Operations** Taught Me…" | "What a Decade **Across the Stack** Taught Me…" | Match builder's-range breadth (blockchain, quantum, CSPs). |
| Video | Not addressed | Staged plan: text tutorials first, YouTube embeds later, CSP note | Per Mike: videos eventually. |
| Cadence | "one per month is plenty" | Tutorials 1–2/month, articles 1/month, papers 1–2/year | Education hub needs a steadier drumbeat; still conservative. |

### v3 (Jul 3, 2026)

| Item | v2 (old) | v3 (new) | Why |
|------|----------|----------|-----|
| Content architecture | Implicit (tutorials + articles + papers) | Explicit **two engines**: Framework (authority) + Workshop (reach/proof), with a shared funnel diagram | Per Mike's plan: PDF-derived content + tinker videos. |
| Whitepaper | "Publish the PDF as a paper" | **Download + derived HTML articles** (pillar-and-cluster), tagged/categorized and interlinked | Per Mike: downloadable PDF plus articles/pages based on it. |
| Video | Staged "later," text-first | Standard **Workshop format = YouTube video + companion article** across hardware & software | Per Mike: tutorials are videos with accompanying articles. |
| Tutorials | T1–T7 (software/cloud/AI/quantum) | + **W1–W5** hardware/electronics/mechanical builds (PCB, 3D print, power, embedded) | Per Mike's planned project subjects. |
