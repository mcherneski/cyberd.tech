import type { CollectionEntry } from "astro:content";
import { absoluteUrl, siteConfig } from "@lib/site";
import { entryPath } from "@lib/content";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    jobTitle: siteConfig.author.role,
    url: siteConfig.url,
    email: siteConfig.author.email,
    image: absoluteUrl(siteConfig.photo),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Asheville",
      addressRegion: "NC",
      addressCountry: "US",
    },
    worksFor: [{ "@type": "Organization", name: "Cyberd" }],
    alumniOf: { "@type": "CollegeOrUniversity", name: "Adams State University" },
    sameAs: [
      "https://www.linkedin.com/in/mikecherneski",
      "https://github.com/mcherneski",
      "https://x.com/mikecherneski",
    ],
    knowsAbout: [
      "enterprise architecture",
      "AI integration and governance",
      "serverless architecture",
      "cloud platforms (AWS, Azure, GCP)",
      "blockchain and EVM systems",
      "quantum computing",
    ],
  };
}

export function articleJsonLd(entry: CollectionEntry<"notebook">) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.data.title,
    description: entry.data.excerpt,
    datePublished: entry.data.date.toISOString(),
    dateModified: (entry.data.updated ?? entry.data.date).toISOString(),
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    keywords: entry.data.tags,
    articleSection: entry.data.category,
    url: absoluteUrl(entryPath("notebook", entry.id)),
  };
}

export function creativeWorkJsonLd(entry: CollectionEntry<"projects"> | CollectionEntry<"papers">) {
  const collection = entry.collection === "projects" ? "projects" : "papers";

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: entry.data.title,
    description: "summary" in entry.data ? entry.data.summary : "",
    dateCreated: entry.data.date.toISOString(),
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    keywords: entry.data.tags,
    genre: entry.data.category,
    url: absoluteUrl(entryPath(collection, entry.id)),
  };
}
