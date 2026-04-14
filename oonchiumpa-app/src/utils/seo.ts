export interface PageMetaInput {
  title: string;
  description: string;
  image?: string;
  jsonLd?: Record<string, unknown>;
  canonicalUrl?: string;
  ogType?: string;
  titleMode?: "auto" | "raw";
}

const SITE_NAME = "Oonchiumpa";
const DEFAULT_HOME_TITLE = "Oonchiumpa | Cultural Authority in Action";
const JSON_LD_SCRIPT_ID = "route-jsonld";

const upsertMetaTag = (key: string, value: string, useProperty = false) => {
  const selector = useProperty
    ? `meta[property="${key}"]`
    : `meta[name="${key}"]`;
  let meta = document.querySelector(selector) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    if (useProperty) meta.setAttribute("property", key);
    else meta.setAttribute("name", key);
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", value);
};

const upsertCanonicalLink = (href: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
};

const upsertJsonLd = (data?: Record<string, unknown>) => {
  let script = document.getElementById(JSON_LD_SCRIPT_ID) as HTMLScriptElement | null;

  if (!data) {
    if (script) script.remove();
    return;
  }

  if (!script) {
    script = document.createElement("script");
    script.id = JSON_LD_SCRIPT_ID;
    script.setAttribute("type", "application/ld+json");
    document.head.appendChild(script);
  }

  script.text = JSON.stringify(data);
};

export const formatSlugLabel = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const toCanonicalUrl = (input?: string) => {
  const rawUrl = input || window.location.href;
  return rawUrl.split("#")[0];
};

const toAbsoluteImageUrl = (src?: string) => {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return `${window.location.origin}${src.startsWith("/") ? src : `/${src}`}`;
};

const toFullTitle = (title: string, mode: "auto" | "raw") => {
  if (mode === "raw") return title;
  if (title === SITE_NAME) return DEFAULT_HOME_TITLE;
  return `${title} | ${SITE_NAME}`;
};

export const applyPageMeta = ({
  title,
  description,
  image,
  jsonLd,
  canonicalUrl,
  ogType = "website",
  titleMode = "auto",
}: PageMetaInput) => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const resolvedCanonical = toCanonicalUrl(canonicalUrl);
  const absoluteImage = toAbsoluteImageUrl(image);
  const fullTitle = toFullTitle(title, titleMode);

  document.title = fullTitle;
  upsertCanonicalLink(resolvedCanonical);
  upsertMetaTag("description", description);
  upsertMetaTag("og:type", ogType, true);
  upsertMetaTag("og:title", fullTitle, true);
  upsertMetaTag("og:description", description, true);
  upsertMetaTag("og:url", resolvedCanonical, true);
  upsertMetaTag("og:site_name", SITE_NAME, true);
  upsertMetaTag("twitter:card", "summary_large_image");
  upsertMetaTag("twitter:title", fullTitle);
  upsertMetaTag("twitter:description", description);
  if (absoluteImage) {
    upsertMetaTag("og:image", absoluteImage, true);
    upsertMetaTag("twitter:image", absoluteImage);
  }
  upsertJsonLd(jsonLd);
};

