import type { APIRoute } from "astro";
import { buildSearchIndex } from "@lib/build-search-index";

export const GET: APIRoute = async () => {
  const entries = await buildSearchIndex();

  return new Response(JSON.stringify(entries), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
