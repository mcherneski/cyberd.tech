# Architectural Principles

> **Draft for review** — synthesized from *Enterprise Intelligence Design*, cyberd.tech implementation, brand/copy docs, and MuninnDB session notes (Jul 2026).  
> Last updated: 2026-07-04

This document captures the architectural principles Mike Cherneski adheres to across enterprise AI governance, web/cloud infrastructure, AI-native publishing, modernization practice, and day-to-day engineering decisions.

---

## I. Enterprise AI & governance

*Codified in [Enterprise Intelligence Design](../Enterprise%20Intelligence%20Design.pdf).*

### Core principles (non-negotiable)

1. **Prioritize enablement** — Build AI systems that augment human judgment and capability, not replace them. Talent is more difficult to acquire than compute.

2. **Build simple** — Investigate all design possibilities before settling on an AI solution. A simpler automation or simpler model may meet the requirement.

3. **Clear identity** — Every interaction is logged and verified at critical steps and paths. Every action traces back to a named operator through a verifiable authorization chain.

4. **Secure access** — Access is instantly revocable for human and AI actors if behavior is flagged as abnormal. AI credentials are temporary and expire automatically. Humans reauthenticate at regular intervals. Identity and access are correlated via secure tokens.

5. **Verify AI output** — AI-generated and retrieved data is referenced against trusted systems of record to ensure accuracy.

6. **Audit actions** — No changes occur in critical environments without a tested and audited write path. LLMs never directly write to critical data sources.

7. **Automatic compliance** — Controls are mapped directly to industry standards. Compliance is maintained and constantly monitored, not assembled after the fact.

### Overarching design philosophy

8. **Zero trust for AI agents** — Rather than granting open access, identity and permissions are verified at every step. An agent receives only the exact permissions needed for a specific task.

9. **Accountability is a default** — Every automated action is tied to the human operator who requested it. Authorization is always traceable and revocable.

10. **Human in the loop for final decisions** — Critical requests pass through policy boundaries that verify inputs, validate actions, and confirm human authorization. Final decisions are governed by rules with an authorizing human, not the AI itself.

11. **Event-driven, auditable spine** — Flexible, reliable event-based processing pipelines ensure accuracy and auditability. Compliance and incident mitigation are byproducts of standard operations.

12. **Modular six-layer architecture** — Decouple rapid AI innovation from operational risk. Each layer manages a discrete function; underlying models and services can be swapped as technology advances.

13. **Data readiness before automation** — AI is only as capable as its underlying data. Foundational data assessment, ontological alignment, and dedicated data ownership precede agent deployment.

14. **Flexible blueprint, not rigid prescription** — The framework empowers organizations to swap services and evolve quickly and safely. Core principles apply at any scale or stage, not only in regulated enterprise.

---

## II. Web & cloud infrastructure

*Demonstrated on [cyberd.tech](https://cyberd.tech) and documented in [The Stack Behind This Site](../web/src/content/notebook/the-stack-behind-this-site.mdx).*

15. **Static first, dynamic narrowly** — Pre-render what is known at build time. Keep the runtime dynamic surface as small as possible. A portfolio does not need a database just because it has content, or a server just because it has a form.

16. **Serverless-first, boring components** — Prefer managed services over servers you patch. Choose components that can be fixed at 2am and composed so the whole system runs itself.

17. **Infrastructure as code, git-based deploy** — Define infrastructure in CDK (or equivalent) in the same repository as the application. Deploy via CI on push to main. A system you cannot rebuild from source is a system you do not fully own.

18. **Least privilege everywhere** — Private origins behind CDN OAC, scoped IAM roles, OIDC deploy roles limited to the production branch, secrets in managed stores (SSM), and throttling on dynamic API routes.

19. **Minimize data retention** — Prefer relay patterns over storage. Data you do not retain is data you cannot leak. The contact form forwards via SES; it does not persist submissions by default.

20. **Security by default at the edge** — CSP, bot verification server-side, pinned CI action SHAs, budget alarms, and structured logging are part of the design—not post-launch hardening.

21. **Pay-per-request economics with cost discipline** — Size for actual traffic. Monitor account-level spend, retire unused resources, and treat recurring cost as a design input.

22. **Pragmatic reliability over cleverness** — When tooling races or fails intermittently, fix the root cause with the simplest durable approach (e.g., CDK `--method direct` with bounded retry instead of fragile pre-flight checks that cannot see the stack).

23. **Fix root cause, minimize scope** — Prefer the smallest correct change: CSS filter over duplicate assets, one shared widget over two redundant challenges, one token controller over backend session complexity when the simpler path works.

---

## III. AI-native publishing & dual-surface design

*Thesis in [Why AI-Native Websites Need Markdown](../web/src/content/notebook/why-ai-native-websites-need-markdown.mdx).*

24. **Two surfaces, one source** — Human pages need hierarchy, taste, and restraint. Agents need dense context, canonical links, and facts that survive extraction. Publish both from the same content at build time.

25. **Legibility for agents, not just findability** — Curated `agentReport` fields, per-page Markdown reports, `llms.txt`, and JSON-LD give delegated research canonical context instead of scraped nav chrome.

26. **Schema-validated content at build time** — Content collections validated by schema. A missing field fails the build, not the reader.

27. **Clarity as a service** — Documentation, ontologies, and semantic structure that humans and AI can both read. Shared language reduces logical errors and hallucinations.

---

## IV. Modernization & delivery

*From [Enterprise Modernization Map](../site_copy/enterprise-modernization-map.md) and client-facing practice.*

28. **Incremental over big-bang** — Treat modernization as a sequence of observable increments with rollback paths, dual-write windows, and success metrics per step—not a single replacement that never ships.

29. **Secure and observable target state** — Encryption, secrets handling, audit trails, and failure modes are defined before cutover.

30. **Each increment must earn its keep** — Every step should reduce operational load or unlock a product outcome. Avoid migration theater.

31. **Honest tradeoffs** — Name cost, risk, latency, and constraint plainly. Trust is earned by showing the work—including dead ends and ceilings.

---

## V. Product & UX engineering

*From shipped decisions on cyberd.tech (Turnstile consolidation, theme-aware logo, navigation model).*

32. **Simplest correct UX** — Remove redundant friction. One bot challenge for a section; fresh single-use tokens per downstream action when the provider requires it.

33. **Accept tradeoffs explicitly** — When a simpler design weakens one control (e.g., background bot scoring vs. manual gate), document and accept the trade rather than pretending both goals are fully met.

34. **Match implementation to the actual navigation model** — Full page loads vs. client-side routing changes what re-initialization logic is needed. Do not add swap/rehydration complexity where the architecture does not require it.

35. **Programmatic adaptation over duplicate assets** — Theme-aware styling, shared controllers, and build-time generation beat maintaining parallel copies of the same thing.

---

## VI. Meta-principles (how decisions get made)

36. **Techno-optimist, disciplined** — Commercially available AI holds immense promise; capturing it requires a strict foundation anchored by non-negotiable core principles. Never hype, never doom.

37. **Demonstrate, don't assert** — Architecture, code, and published frameworks are proof. Claims are paired with evidence, mechanism, or a working artifact.

38. **Range with rigor** — Breadth across software, cloud, AI, and hardware reads as mastery when paired with reproducible method. Playful subject, disciplined execution.

39. **Give real value first** — Frameworks, tutorials, and checklists published freely. Education is top-of-funnel and proof of competence.

---

## Canonical short set

A compact reference for bios, talks, agent context, and internal alignment:

| Principle | One line |
|-----------|----------|
| **Enablement** | Augment people; talent beats compute |
| **Build simple** | Investigate options; choose boring that ships |
| **Accountability** | Traceable, revocable, human-authorized by default |
| **Zero trust** | Verify identity and permission at every step |
| **Static first** | Pre-render; narrow dynamic surface |
| **IaC + git deploy** | Rebuildable from source |
| **Least privilege** | Minimal access, minimal retention |
| **Dual surface** | Beautiful for humans, dense for agents |
| **Incremental** | Observable steps, honest tradeoffs |
| **Demonstrate** | Architecture you can point to |

---

## Sources

| Source | What it contributed |
|--------|---------------------|
| `Enterprise Intelligence Design.pdf` | Core Principles, six-layer framework, design philosophy |
| `web/src/content/notebook/the-stack-behind-this-site.mdx` | Static-first, IaC, dual-surface, cost posture |
| `web/src/content/notebook/serverless-is-a-content-strategy.mdx` | Dynamic layer narrowness, publishing workflow |
| `web/src/content/notebook/why-ai-native-websites-need-markdown.mdx` | Dual-surface publishing thesis |
| `docs/copy-style-guide.md` (§6 Point of view) | Brand beliefs and voice anchors |
| `site_copy/enterprise-modernization-map.md` | Incremental modernization, target-state principles |
| `docs/recomendations/01-brand.md` | Messaging pillars, demonstrate-don't-assert |
| MuninnDB session notes (Jul 2026) | Security hardening, Turnstile consolidation, CDK deploy hardening, logo fix decisions |

---

## Review notes

- [ ] Confirm the canonical short set is the right public-facing subset
- [ ] Decide whether any principles should be retired, merged, or promoted to site copy
- [ ] Add cross-links to published whitepaper articles when they ship (see `docs/recomendations/04-articles-and-papers.md`)
- [ ] Optional: publish as a Notebook article or `/about` section once reviewed
