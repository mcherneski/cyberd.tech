import type { APIRoute } from "astro";
import { absoluteUrl, siteConfig } from "@lib/site";

export const GET: APIRoute = () =>
  new Response(
    [
      `# ${siteConfig.name} Services`,
      "",
      "> Fixed-scope, fixed-price consulting engagements offered by Mike Cherneski through Cyberd. Every engagement ends in a written deliverable and applies the Intelligent Business framework (/papers/intelligent-business).",
      "",
      "## Offers",
      "",
      "### AI Architecture Review — from $8,500, 3-5 days",
      "A second-opinion review of a proposed or existing AI/automation architecture: trust boundaries, audit trail, data governance, and cost model. Deliverable: a findings memo covering what holds, what fails, and what to fix first, plus a live walkthrough.",
      "",
      "### Executive AI Strategy Sprint — from $15,000, 1 week",
      "A compressed week with the leadership team producing an AI strategy memo, ranked investment priorities, and a scoped first pilot with success criteria, closed by a half-day pressure-testing workshop.",
      "",
      "### AI Readiness Assessment — from $18,000, 2 weeks (flagship)",
      "A full diagnostic scored against the Pre-Implementation Checklist from the Intelligent Business whitepaper: interviews, data landscape and systems review, an audit of current AI initiatives, a risk register, and a prioritized twelve-month roadmap, delivered as a board-readable report with an executive briefing.",
      "",
      "## Larger engagements (scoped after an assessment)",
      "",
      "- **Pilot Workflow Build** (typically 4-6 weeks): one process automated end to end on the framework architecture, with measured before-and-after economics.",
      "- **Workforce Transition Assessment**: task inventories, automation-residue analysis, skills adjacency mapping, and a redeployment plan with measurable returns.",
      "",
      "## Process",
      "",
      "1. Intro call to confirm fit.",
      "2. One-page statement of work: fixed scope, fixed price, named deliverable, end date.",
      "3. The work, on a set schedule.",
      "4. Written deliverable plus live briefing, with two weeks of follow-up questions included.",
      "",
      "## Contact",
      "",
      `- Email: ${siteConfig.author.email}`,
      `- Contact form: ${absoluteUrl("/services#contact")}`,
      `- Framework: ${absoluteUrl("/papers/intelligent-business")}`,
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    },
  );
