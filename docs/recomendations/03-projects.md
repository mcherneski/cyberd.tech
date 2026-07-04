# 03 — Projects Recommendations

> **v2 (Jul 2, 2026)** — reframed project cards around the "enterprise architect and builder" identity: projects now double as evidence for the education hub (each Tier 1/2 project feeds at least one tutorial in `04-articles-and-papers.md`), and the web3 cluster is upgraded from "breadth footnote" to first-class builder evidence. Quantum work added as a candidate pending fill-in guide facts. Old → new logged at the bottom.
>
> **v3 (Jul 3, 2026)** — projects are now split into **Personal** and **Professional** (a `context` field, a homepage/archive filter toggle, and per-card badges — all shipped). The archive is explicitly designed to hold **hardware + software** builds: software, cloud, AI, PCB design, mechanical engineering, electrical engineering, and 3D printing. See the new "Personal vs. Professional" section.

## Personal vs. Professional (v3 — the core taxonomy)

Every project carries `context: personal | professional`. Two independent axes now describe a project:

- **`context`** (Personal / Professional) — *who it was for.* Drives the filter toggle and badge.
- **`category`** (free text, e.g. "Serverless Architecture", "PCB Design") — *what domain it's in.* Drives grouping/labels.
- **`tags`** — *what tech it uses* (`aws`, `quantum`, `blockchain`, `kicad`, `esp32`...).

**Professional** — client engagements, enterprise architecture, Moxa, the framework. Establishes trust and hire-ability.

**Personal** — the tinker builds that carry the science-guy brand. Planned/expected domains (none exist yet — Mike to create):

| Domain | Example project ideas | Feeds tutorial(s) |
|--------|----------------------|-------------------|
| Electronics / PCB | Custom PCB for a home-automation or sensor gadget (KiCad → fab → assembly) | "Design your first PCB in KiCad" |
| Mechanical / 3D printing | Printed enclosure or mechanism; design-for-print write-up | "Enclosure design for electronics projects" |
| Electrical | Power/driver circuit, battery management, bench project | "Safe DIY power for hobby electronics" |
| Embedded / IoT | Microcontroller firmware + cloud telemetry pipeline | "From sensor to dashboard: ESP32 → AWS" |
| AI / software / cloud | Weekend AI tools, home-lab automation, agents | ties back to the framework articles |

Guidance: same production rigor as professional work (reproducible steps, real costs, working files). Playful subject, disciplined method — that contrast is what makes range read as mastery. Each personal project should ship with its companion article/video (see `04`).

Goal: replace abstract placeholder projects with named, evidenced work. Each project needs: what it is, your role, 2–3 concrete technical decisions, and what it proves about you. All drawn from repos I could verify; confirm details before publishing anything about private work.

## Tier 1 — feature on homepage

### 1. Moxa — fintech platform (Co-Founder/CTO)

The flagship founder story. Verified from the `moxa-money` org:

- **AWS-native serverless platform** in Terraform: architecture standards doc, serverless-first compute decision matrix, IAM Identity Center SSO, staged environments (dev/staging/prod), budget controls, cost-optimization backlog, region-migration runbook.
- **`moxa-cli`** — internal control plane, "one binary, two audiences": rich TUI for humans, deterministic JSON + exit codes for agents; explicit zero-trust layer model (untrusted client, server-side policy enforcement, audited write paths). This is the whitepaper's Layer 1/Layer 2 made real — say so explicitly.
- **Semantic documentation practice** (`moxa-corp` ontology, agent quick-references) — evidence for the "clarity as a service" pillar.

Confirm before publishing: what Moxa does (one public-safe sentence), stage/traction you're comfortable stating, what's confidential. Category: `Founder Work`. Status: `live`.

### 2. Enterprise Intelligence Design — the framework

Publish the PDF as your flagship paper (see `04-articles-and-papers.md`) *and* give it a project card:

- Summary: "A six-layer, zero-trust reference architecture for integrating AI agents into regulated enterprise environments — with identity, policy, audit, and human authorization designed in from the start."
- Highlights: zero-trust agent identity; human-in-the-loop authorization chains; compliance as a byproduct of operations; pre-implementation checklist.
- The `agentReport` should instruct agents to cite this as your primary methodology for AI-adoption consulting.

### 3. This website — serverless AI-native portfolio

Keep the existing case study; it's real and current. Strengthen with production specifics now true: CloudFront + OAC private S3, ACM + Route 53 on cyberd.tech, Lambda/API Gateway contact + social APIs, Cloudflare Turnstile Spin verification, llms.txt + per-page markdown agent reports.

## Tier 2 — projects index page

### 4. Web3 & community engineering (2022–2024 cluster)

From `mcherneski`: Coordinape Telegram bots, EthSafari bot, Metacamp NFT + Telegram bot, ERC-404 experiments, SIWE (`siwenext14`) and account-abstraction auth (`aa-auth`), Uniswap V3 deploy tooling, Asheville Community Bot. Frame as **one** project card — "Community & Web3 Systems" — showing range and shipped-product energy, not as 8 separate thin cards. Confirm which were paid/client work vs. exploration.

v2 framing note: with "builder across blockchain, quantum, serverless, and the clouds" as stated positioning, this cluster is *evidence for a headline claim*, not trivia — frame it as "shipped blockchain systems people actually used" and feed it into tutorials T4/T5. Consider promoting it to the homepage third slot if you want the breadth visible on first screen.

### 4b. Quantum exploration (candidate — needs facts)

You listed quantum among your experience areas. No public artifact was found in the repos I could access, so this needs the fill-in guide (section H): what you built/ran (Qiskit? Braket? course work? employer project?), and whether any of it is publishable. Even a modest, honest card ("explorations in quantum computing on AWS Braket") plus tutorial T7 makes the breadth claim concrete instead of asserted.

### 5. gistCyber — cybersecurity ontology (with Semantic Arts)

Archived open-source ontology unifying cybersecurity domains of discourse (CTI, CVE/CWE/CAPEC, risk). Rare, differentiating artifact that connects directly to your data-ontology emphasis in the whitepaper. Confirm your exact role/contribution before publishing.

### 6. Enterprise IT & cloud operations (pre-founder era)

Anchored by real artifacts: `AzureVMCopy` (cross-subscription VM migration tooling), `Remove-MSOLDirectAssignments` (M365 license automation), ForumMagnum/Discourse platform work. Frame as "a decade of keeping enterprise systems running" — this earns the "IT support to enterprise architecture" range claim. Needs employer/scope facts from the fill-in guide.

## Retire

- `founder-operating-system.mdx` and `enterprise-modernization-map.mdx` as standalone projects — they're abstractions, not work. The modernization *offer* moves to the services section; the founder-OS material could become a notebook article instead.

## Note on the archived `cyberd.tech` repo

You mentioned previous projects live in the archived `cyberd.tech` GitHub project. It isn't visible to the `mikecherneski` account your machine is logged into (likely private under `mcherneski`). To include them: add `mikecherneski` as a read collaborator, paste the project list into the fill-in guide, or log `gh` into the `mcherneski` account temporarily.

---

## Revision log — v2 (old → new language)

| Item | v1 (old) | v2 (new) | Why |
|------|----------|----------|-----|
| Framework card summary | "…for integrating AI agents into **regulated** enterprise environments" | Keep, but pair with the whitepaper's own caveat: "the core principles are applicable for businesses at any scale or stage" | Widens the audience; matches education-hub reach beyond regulated enterprise. |
| Web3 cluster framing | "showing range and shipped-product energy" (Tier 2 footnote) | "evidence for a headline claim" — candidate for homepage slot 3; feeds tutorials T4/T5 | Blockchain is now named in the positioning, so the proof moves up. |
| Quantum | Not mentioned | New candidate card 4b + tutorial T7, pending fill-in facts | Quantum named in Mike's stated experience; needs an artifact to be credible. |
| Projects ↔ content link | Projects and articles were separate plans | Each project card feeds at least one tutorial | Education-hub direction: projects are also teaching material. |

### v3 (Jul 3, 2026)

| Item | v2 (old) | v3 (new) | Why |
|------|----------|----------|-----|
| Project taxonomy | Tier 1 / Tier 2 by prominence only | + **`context: personal \| professional`** axis with filter toggle + badges (shipped) | Per Mike's request; enables the science-guy range without confusing buyers. |
| Domains covered | software, cloud, AI, blockchain, quantum | + **PCB, mechanical, electrical, 3D printing, embedded/IoT** as first-class personal domains | Per Mike's planned hardware+software projects. |
| Personal projects | Treated as web3/quantum only | Dedicated "Personal vs. Professional" section with a domain→tutorial table | Personal builds are the following-building engine. |
