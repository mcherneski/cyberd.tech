# Drafts

Working drafts of articles, build logs, tutorials, papers, and posts — written in the Cyberd voice per `docs/copy-style-guide.md`, usually via the `draft-article` skill (`.cursor/skills/draft-article/`).

## Lifecycle

1. **Draft** — created here as `YYYY-MM-DD-slug.md` with `status: draft` frontmatter. Plain Markdown, not publish-ready.
2. **Review** — Mike edits, resolves any `TODO(mike):` notes, and settles the final title.
3. **Publish** — the piece moves to its destination and is removed from this folder:
   - Notebook articles: convert to MDX with the full schema frontmatter and add to `web/src/content/notebook/`.
   - Papers: `web/src/content/papers/`.
   - External surfaces (LinkedIn, YouTube descriptions, READMEs): copy out to the platform.

Files in this folder are never published automatically and are not part of the site build.
