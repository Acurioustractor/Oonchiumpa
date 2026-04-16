import { useMemo } from "react";
import Fuse from "fuse.js";
import { services } from "../data/services";
import { newBlogPosts } from "../data/newBlogPosts";

export type SearchKind = "page" | "service" | "blog";

export interface SearchItem {
  kind: SearchKind;
  title: string;
  summary: string;
  path: string;
}

const pages: SearchItem[] = [
  { kind: "page", title: "Home", path: "/", summary: "Culture-led futures for young people on Arrernte Country." },
  { kind: "page", title: "About", path: "/about", summary: "Who we are, the model, cultural authority, and why it works." },
  { kind: "page", title: "Team", path: "/team", summary: "Leaders, staff, and community, 100% Aboriginal employment." },
  { kind: "page", title: "Services", path: "/services", summary: "All six services: diversion, cultural programs, brokerage, pathways." },
  { kind: "page", title: "Stories", path: "/stories", summary: "Community voices, articles, and lived experience from participants and families." },
  { kind: "page", title: "Impact", path: "/impact", summary: "Funder-facing evidence: $91/day diversion, 95% success, theory of change." },
  { kind: "page", title: "Contact", path: "/contact", summary: "Referrals, partnerships, and general enquiries." },
  { kind: "page", title: "Model", path: "/model", summary: "The Oonchiumpa model, inside-out delivery grounded in cultural authority." },
];

function buildItems(): SearchItem[] {
  const serviceItems: SearchItem[] = services.map((s) => ({
    kind: "service",
    title: s.title,
    summary: s.summary,
    path: `/services/${s.id}`,
  }));

  // Blog posts are now served under /stories; slugs resolve via Supabase
  // IDs, not titles, so link to the index page.
  const blogItems: SearchItem[] = newBlogPosts.map((p) => ({
    kind: "blog",
    title: p.title,
    summary: p.excerpt ?? "",
    path: "/stories",
  }));

  return [...pages, ...serviceItems, ...blogItems];
}

export function useSearchIndex() {
  return useMemo(() => {
    const items = buildItems();
    const fuse = new Fuse(items, {
      keys: [
        { name: "title", weight: 0.7 },
        { name: "summary", weight: 0.3 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
    return { fuse, items };
  }, []);
}
