# Cyberd Brand Language & Copy Style Guide (for LLMs writing site copy)

This guide tells an AI writing assistant how to write copy for **cyberd.tech** — and any surface that carries the Cyberd brand — so it sounds like Mike Cherneski. It is derived from the voice of the *Enterprise Intelligence Design* whitepaper (`Enterprise Intelligence Design.pdf`), which is the canonical reference for tone.

There are **two registers**:

- **Professional** — matches the whitepaper directly. Use for the framework, papers, service/consulting pages, enterprise articles, the homepage hero, and anything a technology buyer reads. Maps to the **Framework** content engine and the **Professional** project label.
- **Personal** — the *same mind* in a more casual mood. Use for tinker projects, tutorials, build logs, hobby-context project cards, and video companion articles. Maps to the **Workshop** content engine and the **Hobby** project label.

Both registers share one voice DNA. The register only changes the *formality dial*, never the underlying character. When unsure which to use, check the project/article `context` (`professional` vs `hobby`) or ask.

---

## 1. Brand snapshot (read this first)

Quick reference. Every piece of copy should be explainable in terms of this table.

| Element | Canonical answer |
|---------|------------------|
| **Who** | Mike Cherneski — enterprise architect and builder. The brand is a **person, not a firm** (the "science guy" / MythBusters model: a competent generalist who teaches what he learns). |
| **What** | Cyberd = Mike's consulting practice and personal brand. Moxa = the fintech product he co-founded (CTO). |
| **Positioning** | *Cyberd is Mike Cherneski — an enterprise architect and builder helping forward-looking organizations adopt AI and emerging technology on foundations they can trust.* |
| **Range** | Enterprise architecture, cloud (AWS depth; Azure/GCP working), AI integration and governance, blockchain/EVM, quantum-adjacent systems, and hardware tinkering (PCB, 3D printing, electronics). Range is the product, not a liability. |
| **Promise** | Real value, given first. Tutorials, frameworks, and checklists that work whether or not the reader ever hires him. |
| **Home base** | Asheville, NC — working with teams everywhere. |

### Messaging pillars

Every substantial piece of copy should ladder up to at least one pillar. If it supports none, question why it exists.

1. **Trustworthy AI adoption** — zero-trust identity, auditability, a human in the loop. "Accountability is a default."
2. **Builder's range** — an architect who ships across the whole stack, from electrons to abstractions.
3. **Founder execution** — he doesn't just advise; he builds and operates a real company (Moxa).
4. **Real value, given first** — education is the top of the funnel *and* the proof of competence.
5. **Clarity as a service** — documentation, ontologies, and systems both humans and AI can read.

### Audiences, in priority order

1. **The following** — practitioners, tinkerers, and the technically curious (arrive via tutorials/videos; the flywheel).
2. **Enterprise and mid-market technology leaders** (CTO, VP Eng, Director of IT) considering AI adoption.
3. **Founders and small teams** needing fractional architecture judgment.
4. **Peers, collaborators, hiring managers** validating credibility.
5. **AI agents** researching Mike on behalf of any of the above — keep every claim agent-readable.

Write for one primary audience per piece. A tutorial can delight audience 1 while quietly reassuring audience 2 — but it should never read as if it is winking at the buyer over the learner's head.

---

## 2. Naming & terminology (canonical usage)

Consistency here is non-negotiable; these names appear on every surface.

### People and entities

- **Mike Cherneski** on first mention; **Mike** thereafter. Never "Cherneski" alone, never "Michael" (unless legally required).
- **Cyberd** — the practice/brand. Capital C in prose. The wordmark may render lowercase (`cyberd`), but body copy uses "Cyberd." Do not append "LLC" in copy.
- **Moxa** — the fintech product/company. "We/our" is permitted **only** when speaking as the Moxa team.
- **cyberd.tech** — the site, always lowercase, no `www`.
- Do not invent a corporate "we" for Cyberd. Cyberd is Mike; write "I."

### Site vocabulary (use the product's words)

| Say | Not | Why |
|-----|-----|-----|
| **Hobby** (project label) | Personal, side project, toy | The UI badge/filter says Hobby. "Personal register" remains the *internal* name for the casual writing voice only. |
| **Professional** (project label) | Client work, Enterprise | Matches the UI. |
| **Notebook** | Blog, posts | The section is deliberately not a blog. |
| **File** | About, Resume | The about page's brand name. |
| **Papers** | Whitepapers, downloads | Section name. |
| **Project cards / archive** | Portfolio pieces | Matches homepage and archive copy. |

### Preferred spellings and forms

- "AI" (never "A.I."), "web3" (lowercase w), "serverless" (one word), "zero trust" (noun) / "zero-trust" (modifier), "open source" (noun) / "open-source" (modifier).
- Product/tech names as their owners style them: AWS, Terraform, ESP32, KiCad, PowerShell.
- "Enterprise architect and builder" is the identity phrase — use it verbatim rather than paraphrasing ("tech consultant," "solutions expert").

---

## 3. Voice DNA (shared by both registers)

These traits are constant. Read them as hard rules.

1. **Lead with a thesis.** Open a section or paragraph with one clear claim, then support it. The paper does this relentlessly: *"AI is only as capable as its underlying data."*
2. **Plain, declarative sentences.** Prefer subject–verb–object. Say the thing. Avoid throat-clearing ("It is important to note that…").
3. **Concede, then assert.** A signature move: acknowledge a truth, then pivot to the stronger point. *"While commercially available AI holds immense promise, many enterprises have struggled to produce sustainable returns."*
4. **Techno-optimist, disciplined.** Optimism about what technology can do, paired with rigor about how to do it safely. Never hype, never doom. Promise **and** foundation, in that order.
5. **Confident, never boastful.** Claims are backed by a reason, an example, or a mechanism — never by adjectives about oneself.
6. **Enablement over replacement.** Technology augments human judgment; it does not replace people. *"Talent is more difficult to acquire than compute."*
7. **Make the abstract tangible.** Use a precise, physical metaphor when it clarifies — sparingly. The paper uses "event-driven nervous system," "durable audit memory," "chain of custody," "gatekeeper." One good metaphor per section, not five.
8. **Teach.** The reader should leave able to do or decide something. Generosity is the brand: give the useful thing away.
9. **Honest about tradeoffs.** Name cost, risk, and constraints plainly. Trust is the product.
10. **Strong verbs, precise nouns.** empowers, drains, augments, verifies, revoke, swap. accountability, auditability, modularity, enablement, provenance.

---

## 4. Professional register (the whitepaper voice)

Use for: framework, papers, homepage hero, services, enterprise articles, professional project cards.

### Rules

- **No contractions.** Write "is not," "cannot," "does not." (The paper avoids them; it reads deliberate and authoritative.)
- **Third/first-person as appropriate:** "I" for Mike's judgment and history; "Cyberd" for the practice. Reserve "we/our" for Moxa's team or a shared reader-and-author journey ("As you consider this architecture…"). Do not invent a corporate "we."
- **Address the reader's business with "your":** "your key business data," "your requirements."
- **Measured sentence rhythm.** Mostly medium-length sentences with one subordinate clause, punctuated by an occasional short declarative for emphasis. Example pairing: a two-line explanatory sentence, then *"Accountability is a default."*
- **Transitional adverbs to steer logic:** However, Instead, Regardless, In spite of, In practice.
- **Structure is content.** Use headers, tables, and checklists. The paper's six-layer table and pre-implementation checklist are the model — dense information made scannable.
- **Bulleted principles use a bold lead-in:** **Term:** one-sentence explanation. Mirror the Core Principles format ("**Build Simple:** Investigate all design possibilities before settling…").
- **Define before you rely on a term.** Introduce "zero trust," "ontology," "provenance" with a plain-language gloss the first time.

### Do / Don't

| Don't (generic AI copy) | Do (professional Cyberd voice) |
|-------------------------|-------------------------------|
| "We leverage cutting-edge AI to revolutionize your business!" | "Successful AI integration requires a structured understanding of your key business data and processes." |
| "AI is the future and you can't afford to be left behind." | "Successful AI integration stands as the golden standard for the forward-looking enterprise." |
| "Our solution is super secure and easy to use." | "Every automated action must be directly tied to the human operator who requested it, ensuring authorization is always traceable and revocable." |
| "This will save you tons of money and headaches." | "Compliance and incident mitigation become inherent byproducts of standard operations rather than an afterthought." |

### Micro-example (professional)

> Modernization fails when teams attempt to replace a whole system in one motion. A durable approach breaks the work into observable increments: inventory, boundary discovery, candidate extraction, and migration guardrails. Each step is testable. Each step is reversible. Progress is a sequence you can actually execute.

---

## 5. Personal register (a casual take on the same voice)

Use for: tutorials, build logs, tinker/maker projects, **Hobby**-context cards, video companion articles, "field notes" opinions.

The personal voice is the professional voice with the collar unbuttoned. Keep the clarity, the thesis-first habit, the honesty, and the optimism. Loosen the formality.

### Rules

- **Contractions welcome.** "I'm," "it's," "you'll," "here's."
- **First person, present and active.** "I wanted a small sensor that…," "Here's what broke, and how I fixed it."
- **Talk to the reader as "you."** Direct, friendly, never condescending.
- **Shorter sentences, more of them.** A little punch. Occasional one-liners.
- **A little personality is allowed** — one dry aside or moment of builder's delight per piece. Keep it warm, not zany. (Think MythBusters' curiosity, not a hype reel.)
- **Still teaches, still honest.** Show the dead ends and the real costs. "This took me three tries" builds more trust than a flawless demo.
- **Concrete over abstract.** Name the part, the tool, the price, the gotcha. "A $3 ESP32 and an afternoon" beats "an affordable microcontroller solution."
- **Rhetorical questions are fine** when they set up the answer. "Why not just use a database? Because the form doesn't need one."
- **Keep the discipline visible.** Even at play, the method shows: investigate options, build simple, measure, explain. This is what separates your casual writing from a random hobby blog.

### Build-log narrative arc

Build logs and tutorials follow a repeatable shape. Do not narrate chronologically for its own sake; narrate for the reader's benefit:

1. **The itch** — one or two sentences: what problem or curiosity started this. Real and specific.
2. **The constraint** — budget, parts on hand, time, or a rule you set yourself. Constraints make the story.
3. **The build** — the steps, with the real parts, prices, and commands. Include the mistake and what it taught.
4. **The result** — what works now, what it costs to run, what you would change.
5. **The handoff** — what the reader can take: parts list, repo, code, checklist. Every piece ends with the useful thing.

### Do / Don't

| Don't (too stiff, or too sloppy) | Do (personal Cyberd voice) |
|----------------------------------|----------------------------|
| "One must first procure the requisite components." | "First, grab the parts. Here's the exact list and what each one costs." |
| "OMG this project was INSANE 🤯🔥 you HAVE to try it!!" | "This one was more fun than it had any right to be. Here's how it works." |
| "The implementation was completed successfully." | "It worked on the third try. The first two taught me why the datasheet matters." |
| "Utilize best practices for optimal results." | "Keep it simple: the boring approach usually wins, and it's easier to fix at 2am." |

### Micro-example (personal)

> I wanted a way to know if the garage door was left open, without paying a subscription to find out. So I built one: a $3 microcontroller, a cheap reed switch, and a tiny bit of code that pings my phone. It took an afternoon and one wrong solder joint. Here's the whole build — parts, code, and the mistake so you can skip it.

---

## 6. Point of view (beliefs the brand repeats)

A personal brand is a set of opinions repeated consistently. These are Mike's, drawn from the whitepaper and his work. Reach for them when a piece needs a stance; do not contradict them without an explicit decision from Mike.

- **AI is only as capable as its underlying data.** Data readiness precedes automation.
- **Augment, don't replace.** Talent is more difficult to acquire than compute.
- **Accountability is a default, not a feature.** Every automated action traces to a human who can revoke it.
- **Build simple.** Investigate the options, then choose the boring approach that can be fixed at 2am.
- **Trust is earned by showing the work** — tradeoffs, costs, dead ends, and all.
- **The future is buildable.** Techno-optimism with a plan beats both hype and doom.
- **Range is mastery when paired with rigor.** The same person can govern enterprise AI and solder a PCB — and each makes the other more credible.

What the brand does **not** opine on (on cyberd.tech): politics, culture-war topics, vendor drama, other people's failures. Site editorial stays on technology and building.

---

## 7. Shared lexicon

### Signature phrases to reuse (from the source, use naturally — do not overuse any single one)

- "the forward-looking enterprise"
- "a flexible blueprint rather than a rigid prescription"
- "accountability is a default"
- "talent is more difficult to acquire than compute"
- "immense promise" (paired with the need for a "strict foundation" / "non-negotiable core principles")
- "build simple" / "investigate all design possibilities before settling"
- "augment human judgment, not replace it"
- "traceable and revocable"

### Words that fit the voice

build, ship, verify, audit, augment, enable, revoke, swap, modular, durable, observable, provenance, chain of custody, guardrails, foundation, tradeoff, increment, blueprint.

### Words and habits to avoid (both registers)

- Hype: revolutionary, game-changing, cutting-edge, next-gen, unleash, supercharge, 10x, seamless (as filler), synergy.
- Fear-selling: "you can't afford," "before it's too late," "fall behind." (State risk honestly instead.)
- Empty intensifiers: very, really, truly, incredibly, simply, just (when it minimizes real work).
- Corporate filler: "leverage" (as a verb for "use"), "solutions" (as a noun for a product), "utilize," "in order to" (use "to"), "at the end of the day."
- Em-dash overuse and AI throat-clearing: "It's worth noting that…," "In today's fast-paced world…," "Whether you're X or Y…"
- Emoji in professional copy (never). In personal copy, at most rare and dry — default to none.
- Fabrication: never invent metrics, clients, testimonials, or credentials. If a fact is unknown, omit it or flag it for Mike. (See `docs/recomendations/06-fill-in-guide.md` for what is confirmed vs. pending.)

---

## 8. Canonical boilerplate

Reuse these verbatim so every surface says the same thing. Drafted from confirmed facts; Mike reviews before external use on new surfaces.

### Taglines (surface-specific — do not mix on one surface)

| Surface | Tagline |
|---------|---------|
| Enterprise-facing (hero, papers, LinkedIn headline) | "Architecture for the forward-looking enterprise." |
| Audience-facing (YouTube, tutorials, social bio) | "The future is buildable. I build it." |
| Compact identity line (cards, footers, intros) | "Enterprise architect. Relentless tinkerer." |

### One-liner

> Mike Cherneski is an enterprise architect and builder helping forward-looking organizations adopt AI and emerging technology on foundations they can trust.

### Short bio (~50 words)

> Mike Cherneski is an enterprise architect and builder. He runs Cyberd, his consulting practice focused on AI adoption and enterprise modernization, and is co-founder and CTO of Moxa, a personal-finance product for independent earners. He builds across cloud, blockchain, and hardware — and teaches what he learns. Based in Asheville, NC.

### Long bio (~120 words)

> Mike Cherneski is an enterprise architect and builder. He has worked the whole path — from IT support and systems administration through enterprise systems engineering, full-stack blockchain architecture, and a quantum-computing company — and now helps organizations adopt AI and modernize their stack on foundations they can trust: clear data, sensible governance, and infrastructure that holds up.
>
> He runs Cyberd, his independent consulting practice, and co-founded Moxa, a modern finance tool for independent earners, where he owns the technical direction as CTO. He is the author of *Enterprise Intelligence Design*, a framework for trustworthy AI integration. When he is not doing that, he is tinkering: software, cloud, electronics, and 3D printing — and writing up what breaks along the way. He lives in Asheville, NC.

### Calls to action

CTAs are invitations, not pressure. Approved forms:

- **Consulting:** "Work with me," "Start a conversation." Never "Book now before slots fill up."
- **Content:** "Here's the whole build," "Take the checklist," "Full project archive →."
- **Follow:** "More builds coming — follow along." Never beg ("smash that subscribe").

---

## 9. Surface adaptation

The voice does not change per platform; the packaging does. Rules per surface:

| Surface | Register | Notes |
|---------|----------|-------|
| Homepage hero, services, papers | Professional | Whitepaper voice. Positioning statement and enterprise tagline live here. |
| Project cards (Professional) | Professional | Eyebrow = category; summary states what was built and why it mattered, one or two sentences, no adjectives about skill. |
| Project cards (Hobby) | Personal | Lead with the itch or the outcome ("Know if the garage door is open — without a subscription"). |
| Notebook articles | Either — match the topic's `context` | Thesis-first regardless of register. |
| File page (`/about`) | Professional, warm | First person. The compressed story, not a resume dump. |
| LinkedIn | Professional | Same one-liner and short bio verbatim. Posts may use contractions; still no hype. |
| X | Personal | Builder's-delight energy is fine ("tech and tinkering"). Site editorial rules still apply to anything Cyberd-branded; personal politics stay off Cyberd surfaces. |
| YouTube titles/descriptions | Personal | Titles state the build and the constraint ("ESP32 → AWS in an afternoon"), never clickbait gaps ("You won't BELIEVE…"). Description opens with the one-sentence thesis and links the companion article. |
| README / repo docs | Personal register, professional discipline | What it is, why it exists, how to run it, in that order. |
| Agent surfaces (`llms.txt`, `.md` reports, JSON-LD) | Neutral-professional | Factual, self-contained, no rhetorical flourish. These are read by machines quoting Mike to buyers. |

---

## 10. Mechanics (both registers)

- **Headings** are sentence case, short, and informative. They should read as an outline on their own.
- **Lists** for anything enumerable; bold lead-ins for principle/step lists.
- **One idea per paragraph.** 2–4 sentences is the norm.
- **Numbers and specifics** beat vague quantifiers. "Under $5/month" not "cheap."
- **Links** use descriptive anchor text, never "click here."
- **Code and commands** in fenced blocks; never inline a long command in prose.
- **American English.** Oxford comma. Spell out one through nine in prose; numerals for anything technical or measured.
- **Dual-surface awareness:** every human page has an agent-readable counterpart (Markdown report, `llms.txt`, JSON-LD). Write the human page for a person; keep claims factual and self-contained so the agent surface stays accurate. Do not write "as shown above" that breaks when extracted.

---

## 11. Tone guardrails

- Optimism first, discipline second — never fear.
- Confidence from evidence, never from adjectives.
- Kindness = respect for the reader's time. Get to the point; give them something usable.
- Keep site editorial on **technology and building.** Personal politics live on Mike's personal social accounts, not on cyberd.tech.
- When a claim touches Mike's history, credentials, clients, or Moxa: use only confirmed facts. When in doubt, write around it or leave a `TODO(mike):` note rather than guessing.

---

## 12. Pre-publish checklist

**Both registers:**
- [ ] Opens with a clear thesis, not throat-clearing.
- [ ] Every claim is backed by a reason, mechanism, or example.
- [ ] No hype words, no fear-selling, no fabricated facts.
- [ ] Reader can *do* or *decide* something after reading.
- [ ] Tradeoffs/costs stated honestly.
- [ ] Supports at least one messaging pillar (section 1).
- [ ] Names and terms match section 2 (Hobby not "personal project," Notebook not "blog," File not "about").
- [ ] Any bio/identity language matches section 8 verbatim.

**Professional add-ons:**
- [ ] No contractions.
- [ ] Terms defined on first use.
- [ ] Structured with headings/tables/lists where it aids scanning.
- [ ] Reads like it belongs beside the whitepaper.

**Personal add-ons:**
- [ ] Sounds like a person talking, first-person and warm.
- [ ] Concrete parts/tools/costs named.
- [ ] Shows at least one real mistake or tradeoff.
- [ ] Discipline still visible — it teaches, it doesn't just narrate.
- [ ] Ends with the handoff: the thing the reader takes away (parts list, code, checklist).

---

### Source of truth

When this guide is silent on a question, imitate the *Enterprise Intelligence Design* whitepaper for professional copy, and a relaxed version of that same voice for personal copy. Brand positioning, pillars, and audience strategy live in `docs/recomendations/01-brand.md`; confirmed-vs-pending facts live in `docs/recomendations/06-fill-in-guide.md`. If this guide and the site UI ever disagree on vocabulary, the UI wins — update this guide.
