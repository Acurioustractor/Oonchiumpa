import React from "react";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Path to link to. Omit for the current (last) crumb. */
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Use light colours for breadcrumbs that sit on a dark hero. */
  onDark?: boolean;
  className?: string;
}

/**
 * Breadcrumb trail for detail pages. Wayfinding, the user should always be able
 * to see where they are in the hierarchy and click back up a level.
 * Emits JSON-LD BreadcrumbList for SEO.
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  onDark = false,
  className = "",
}) => {
  if (items.length === 0) return null;

  const textColor = onDark ? "text-white/80" : "text-earth-600";
  const hoverColor = onDark ? "hover:text-white" : "hover:text-ochre-700";
  const separatorColor = onDark ? "text-white/40" : "text-earth-300";
  const currentColor = onDark ? "text-white" : "text-earth-950";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-sm ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className={`${textColor} ${hoverColor} transition-colors`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? currentColor : textColor}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className={separatorColor} aria-hidden="true">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
};
