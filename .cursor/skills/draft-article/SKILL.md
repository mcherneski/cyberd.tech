---
name: draft-article
description: Draft articles, Notebook posts, build logs, tutorials, papers, and LinkedIn posts in the Cyberd brand voice. Identifies the subject from the user's prompt, suggests audiences and a register, confirms the angle, then writes a first draft to drafts/. Use when the user asks to draft an article, write a post, start a build log, create a tutorial draft, or write anything in the Cyberd/Mike Cherneski voice.
---

# Draft Article

Turn a topic prompt into a first article draft that follows the Cyberd brand language. The single source of truth for voice, vocabulary, boilerplate, and checklists is `docs/copy-style-guide.md` — this skill orchestrates the workflow; the guide defines the standards.

## Workflow

Copy this checklist and track progress:

```
Draft Progress:
- [ ] Step 1: Read the style guide
- [ ] Step 2: Analyze the prompt
- [ ] Step 3: Propose and confirm the angle
- [ ] Step 4: Outline
- [ ] Step 5: Write the draft to drafts/
- [ ] Step 6: Self-check against the pre-publish checklist
```

### Step 1: Read the style guide

**Mandatory first action:** read `docs/copy-style-guide.md` in full before writing anything. Do not draft from memory of the brand — the guide is authoritative and may have changed.

### Step 2: Analyze the prompt

From the user's prompt, determine:

- **Subject matter** — what the piece is actually about, in one sentence.
- **Register** — Professional (framework, enterprise, papers, consulting topics) or Personal (tutorials, build logs, tinker projects, video companions). Infer from the topic; guide section 5 vs 4 defines the split.
- **Messaging pillar(s)** — which of the five pillars in guide section 1 the piece supports. If it supports none, tell the user and ask whether the piece should exist.

### Step 3: Propose and confirm the angle

Before writing, present a proposal and get the user's confirmation. Use the AskQuestion tool when available; otherwise ask conversationally. Propose:

1. **Primary audience** — recommend one from the guide's priority list (section 1), plus 1–2 alternates. One primary audience per piece.
2. **Register** — Professional or Personal, with one sentence of reasoning.
3. **Thesis** — a single clear claim the piece opens with and defends.
4. **Working titles** — 2–3 options. Titles state the substance (and for build logs, the constraint); never clickbait gaps.
5. **Target surface and length** — Notebook article, paper, LinkedIn post, video companion, README, etc., with a rough word count.

Adjust based on the user's answers before proceeding.

### Step 4: Outline

Draft a brief outline (headings plus one line each) matching the register:

- **Personal register:** follow the build-log narrative arc from guide section 5 — the itch, the constraint, the build (including the real mistake), the result, the handoff.
- **Professional register:** thesis-first sections with informative sentence-case headings; use tables, checklists, and bold-lead-in principle lists where they aid scanning (guide section 4).

Share the outline with the proposal in Step 3 when the piece is short; for longer pieces, confirm the outline separately.

### Step 5: Write the draft

Write the first draft to `drafts/YYYY-MM-DD-slug.md` (today's date, kebab-case slug from the title). Use this frontmatter:

```yaml
---
title: "Working title"
register: professional | personal
audience: "Primary audience from the guide's priority list"
pillar: "Messaging pillar(s) supported"
surface: notebook | paper | linkedin | video-companion | readme
status: draft
---
```

Drafts are plain Markdown, not publish-ready MDX. Converting to `web/src/content/notebook/` frontmatter is a separate, manual step.

### Step 6: Self-check and report

Run the pre-publish checklist from guide section 12: all "both registers" items, plus the Professional or Personal add-ons matching the draft's register. Fix any failures in the draft, then report the checklist results to the user, noting anything that needs Mike's input.

## Hard rules (non-negotiable, from the guide)

- **Never fabricate** metrics, clients, testimonials, credentials, or history. Unknown facts become `TODO(mike): ...` notes in the draft, or are written around.
- **Bios and identity language verbatim** — when a bio, tagline, or one-liner appears, copy it exactly from guide section 8. The identity phrase is "enterprise architect and builder."
- **Site vocabulary:** Hobby (not "personal project"), Notebook (not "blog"), File (not "about page"), Papers (not "whitepapers"). Guide section 2.
- **No hype or fear-selling** — no "revolutionary," "game-changing," "you can't afford to," etc. Guide section 7 lists banned words.
- **Professional register uses no contractions.** Personal register welcomes them.
- **Cyberd is Mike; write "I."** No corporate "we" except when speaking as the Moxa team.
- **Thesis first, both registers.** Open with the claim, not throat-clearing.
