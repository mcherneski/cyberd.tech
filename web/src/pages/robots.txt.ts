import type { APIRoute } from "astro";
import { absoluteUrl } from "@lib/site";

export const GET: APIRoute = () =>
  new Response(
    [
      "User-agent: *",
      "Allow: /",
      `Sitemap: ${absoluteUrl("/sitemap-index.xml")}`,
      `LLMs: ${absoluteUrl("/llms.txt")}`,
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
