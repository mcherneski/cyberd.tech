# 05 — Credentials & About ("File") Page

> **v2 (Jul 2, 2026)** — bio redrafted for "enterprise architect and builder" + techno-optimist tone, with whitepaper language woven in. Old bio preserved in the revision log below.

## Structure recommendation

The "File" conceit is distinctive — keep it. But a resume-style page for a founder-consultant should read as a **narrative with receipts**, not an anonymized timeline. Recommended order:

1. **Who I am** — 3–4 sentence bio (draft below)
2. **Now** — Cyberd + Moxa, current focus
3. **Career timeline** — named roles, dates, one outcome each
4. **Certifications & education** — AWS SA, Adams State University, anything else current
5. **Community & open source** — gistCyber, Asheville community bots, forum platform work
6. **Testimonials** — only when real ones exist

## Draft bio (v2 — needs your corrections)

> I'm Mike Cherneski, an enterprise architect and builder in Asheville, North Carolina. I've worked every layer of the stack — IT support, systems administration, cloud and enterprise architecture, blockchain systems, quantum experiments — mostly because I can't stop tinkering. I'm the co-founder and CTO of Moxa and the founder of Cyberd, where I help forward-looking organizations adopt AI and emerging technology on foundations they can trust: verified identity, audited actions, and a human accountable for every decision. I think this technology holds immense promise, and that capturing it is an engineering problem — one I genuinely enjoy. Investigate every design possibility before settling; build simple; give the work away when you can.

(The closing triple is a voice anchor built from the whitepaper's "Build Simple" principle plus the education-hub generosity stance. Replace freely.)

## Credential entries to replace

Current placeholders → target entries (all dates/orgs from the fill-in guide):

| Current placeholder | Replace with |
|---------------------|--------------|
| "Founder, Independent venture, 2023–" | **Founder, Cyberd LLC** (consulting practice) + **Co-Founder/CTO, Moxa** — separate entries, real dates |
| "Enterprise Technology Operator, Before 2023" | Named enterprise roles: employer (or industry if NDA'd), title, dates, 2–3 outcome bullets each |
| "Startup Technology Contributor, Before 2023" | Named startup/web3 engagements (Coordinape-ecosystem work, community platforms, etc.) |

Bullet formula that matches your voice: **action + system + constraint**. Example: "Migrated Azure VMs across subscriptions non-destructively for a multi-tenant environment — then open-sourced the tooling."

## Certifications

- **AWS Certified Solutions Architect** — confirm level (Associate/Professional) and whether active; state it precisely ("AWS SA-A, 2019–2025" reads more credible than an unqualified claim).
- List any others (Azure, security, ITIL?) from the fill-in guide. Expired certs can appear as "previously held" in the timeline — range evidence without overclaiming.

## Testimonials — how to get real ones fast

Send this to 4–5 people (Moxa co-founder, former manager, client, Semantic Arts collaborator):

> "I'm rebuilding cyberd.tech and adding a short testimonials section. Would you be willing to write 2–3 sentences about what it was like to work with me? Specifics beat superlatives — a moment where I helped un-stick something is perfect. I'll send you the exact quote for approval before it goes anywhere."

That framing (approval loop, specifics-over-praise) gets fast yeses and quotes that actually sound credible.

## Schema note

Each credential entry already emits to agents via the content collection. When real entries land, also update `personJsonLd()` with `alumniOf` (Adams State University), `hasCredential` (AWS SA), `worksFor` (Cyberd LLC, Moxa), and `jobTitle` ("Enterprise Architect").

---

## Revision log — v2 (old → new language)

| Item | v1 (old) | v2 (new) | Why |
|------|----------|----------|-----|
| Bio opener | "I'm Mike Cherneski, a **technologist** based in Asheville…" | "I'm Mike Cherneski, an **enterprise architect and builder** in Asheville…" | New stated identity. |
| Bio range | "starting in IT support and systems administration, moving through cloud and enterprise architecture, and eventually to founding companies" | "I've worked every layer of the stack — IT support, systems administration, cloud and enterprise architecture, blockchain systems, quantum experiments — mostly because I can't stop tinkering" | Adds blockchain/quantum breadth and the tinkering identity Mike named. |
| Bio value clause | "adopt AI with the same discipline they'd demand of any other core system" | "adopt AI and emerging technology **on foundations they can trust**" + "this technology holds **immense promise**, and capturing it is an engineering problem — one I genuinely enjoy" | Techno-optimist reframe; "immense promise" is the whitepaper's phrase. |
| Voice anchor | "I'd rather build something simple that works than something impressive that doesn't." | "Investigate every design possibility before settling; build simple; give the work away when you can." | Rebuilt from the whitepaper's "Build Simple" principle ("Investigate all design possibilities before settling on an AI solution") + education-hub generosity. Old line is still good — keep it if you prefer it. |
| Schema | jobTitle unspecified | jobTitle "Enterprise Architect" | Match positioning. |
