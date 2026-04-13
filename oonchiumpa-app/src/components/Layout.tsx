import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { applyPageMeta, formatSlugLabel } from "../utils/seo";

interface PageMeta {
  title: string;
  description: string;
  image: string;
  jsonLd?: Record<string, unknown>;
}

const defaultMeta: PageMeta = {
  title: "Oonchiumpa",
  description:
    "Aboriginal community-controlled services supporting young people and families on Arrernte Country.",
  image: "/images/model/community-on-country.jpg",
};

const getRouteMeta = (path: string): PageMeta => {
  const organizationId = "https://oonchiumpaconsultancy.com.au/#organization";

  if (path === "/") {
    return {
      title: "Home",
      description:
        "Culturally-led support for young people, families, and community across Arrernte Country.",
      image: "/images/hero/hero-main.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Oonchiumpa",
        url: "https://oonchiumpaconsultancy.com.au/",
        publisher: {
          "@id": organizationId,
        },
      },
    };
  }

  if (path === "/about") {
    return {
      title: "About",
      description:
        "Learn how Traditional Owner leadership drives Oonchiumpa's youth diversion and healing programs.",
      image: "/images/stories/IMG_9713.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Oonchiumpa",
        url: "https://oonchiumpaconsultancy.com.au/about",
        about: {
          "@type": "Organization",
          "@id": organizationId,
          name: "Oonchiumpa",
        },
      },
    };
  }

  if (path === "/services") {
    return {
      title: "Services",
      description:
        "Explore youth diversion, cultural healing, on-Country programs, and service navigation support.",
      image: "/images/model/atnarpa-facilities.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Oonchiumpa Services",
        url: "https://oonchiumpaconsultancy.com.au/services",
        about: {
          "@type": "Service",
          serviceType: "Youth diversion and cultural healing support",
          provider: {
            "@id": organizationId,
          },
        },
      },
    };
  }

  if (path.startsWith("/services/")) {
    const serviceId = path.split("/")[2] || "";
    const serviceProfiles: Record<
      string,
      { title: string; description: string; image: string }
    > = {
      "youth-mentorship": {
        title: "Youth Mentorship & Cultural Healing",
        description:
          "One-on-one mentorship and cultural healing support for Aboriginal young people and families.",
        image: "/images/model/atnarpa-facilities.jpg",
      },
      "law-students": {
        title: "True Justice: Deep Listening on Country",
        description:
          "On-Country legal education led by Traditional Owners, connecting students to Aboriginal law and justice in practice.",
        image: "/images/stories/IMG_9713.jpg",
      },
      "atnarpa-homestead": {
        title: "Atnarpa Homestead On-Country Experiences",
        description:
          "Traditional Owner-led on-Country accommodation, cultural tourism, and healing experiences at Loves Creek Station.",
        image: "/images/model/atnarpa-land.jpg",
      },
      "cultural-brokerage": {
        title: "Cultural Brokerage & Service Navigation",
        description:
          "Trusted referral and service navigation across education, health, housing, legal, and family support systems.",
        image: "/images/stories/IMG_9698.jpg",
      },
    };
    const serviceProfile = serviceProfiles[serviceId];
    const serviceLabel = serviceProfile?.title || formatSlugLabel(serviceId);
    const serviceDescription =
      serviceProfile?.description ||
      "Program delivery, outcomes, and media from Oonchiumpa services across Arrernte Country.";
    const serviceImage = serviceProfile?.image || "/images/model/community-on-country.jpg";

    return {
      title: serviceLabel ? `${serviceLabel} Service` : "Service Detail",
      description: serviceDescription,
      image: serviceImage,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Service",
        name: serviceLabel || "Oonchiumpa Service",
        description: serviceDescription,
        areaServed: {
          "@type": "Place",
          name: "Arrernte Country, Alice Springs",
        },
        provider: {
          "@id": organizationId,
        },
      },
    };
  }

  if (path === "/stories") {
    return {
      title: "Stories",
      description:
        "Community stories of cultural healing, justice support, and family-led change.",
      image: "/images/stories/IMG_9698.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Oonchiumpa Stories",
        url: "https://oonchiumpaconsultancy.com.au/stories",
      },
    };
  }

  if (path === "/blog") {
    return {
      title: "Blog",
      description:
        "Syndicated articles from Empathy Ledger featuring community insight, field delivery, and outcomes analysis.",
      image: "/images/stories/IMG_9713.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Oonchiumpa Blog",
        url: "https://oonchiumpaconsultancy.com.au/blog",
      },
    };
  }

  if (path.startsWith("/stories/")) {
    const pathId = path.split("/")[2] || "";
    const readableId = pathId.includes("-") ? formatSlugLabel(pathId) : "Story";

    return {
      title: `${readableId} Story`,
      description:
        "Read first-hand stories from young people, families, and community partners.",
      image: "/images/stories/IMG_9713.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: readableId,
        author: {
          "@type": "Organization",
          "@id": organizationId,
          name: "Oonchiumpa",
        },
      },
    };
  }

  if (path.startsWith("/blog/")) {
    const pathId = path.split("/")[2] || "";
    const readableId = pathId.includes("-") ? formatSlugLabel(pathId) : "Article";

    return {
      title: `${readableId} Article`,
      description:
        "Read syndicated community articles and analysis from Empathy Ledger.",
      image: "/images/stories/IMG_9713.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: readableId,
        author: {
          "@type": "Organization",
          "@id": organizationId,
          name: "Oonchiumpa",
        },
      },
    };
  }

  if (path === "/outcomes") {
    return {
      title: "Outcomes",
      description:
        "Measured outcomes, impact categories, and beneficiary results from Oonchiumpa programs.",
      image: "/images/model/atnarpa-land.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Oonchiumpa Outcomes",
        url: "https://oonchiumpaconsultancy.com.au/outcomes",
      },
    };
  }

  if (path === "/impact") {
    return {
      title: "Impact",
      description:
        "Evidence of diversion success, cost effectiveness, and community outcomes.",
      image: "/images/hero/hero-main.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Oonchiumpa Impact",
        url: "https://oonchiumpaconsultancy.com.au/impact",
      },
    };
  }

  if (path === "/videos") {
    return {
      title: "Videos",
      description:
        "Watch Oonchiumpa program stories and on-Country delivery in motion.",
      image: "/images/model/community-on-country.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Oonchiumpa Videos",
        url: "https://oonchiumpaconsultancy.com.au/videos",
      },
    };
  }

  if (path === "/contact") {
    return {
      title: "Contact",
      description:
        "Make a referral, start a partnership, or contact Oonchiumpa for culturally safe support pathways.",
      image: "/images/model/community-on-country.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact Oonchiumpa",
        url: "https://oonchiumpaconsultancy.com.au/contact",
        mainEntity: {
          "@type": "Organization",
          "@id": organizationId,
          name: "Oonchiumpa",
          telephone: "0474 702 523",
          email: "admin@oonchiumpaconsultancy.com.au",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Alice Springs",
            addressRegion: "NT",
            addressCountry: "AU",
          },
        },
      },
    };
  }

  return defaultMeta;
};

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const meta = getRouteMeta(location.pathname);
    const canonicalUrl = window.location.href.split("#")[0];
    applyPageMeta({
      title: meta.title,
      description: meta.description,
      image: meta.image,
      jsonLd: meta.jsonLd,
      canonicalUrl,
    });
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Team", href: "/team" },
    { label: "Services", href: "/services" },
    { label: "Stories", href: "/stories" },
    { label: "Blog", href: "/blog" },
    { label: "Impact", href: "/impact" },
    { label: "Videos", href: "/videos" },
  ];

  const footerSections = [
    {
      title: "About",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Team", href: "/team" },
        { label: "Our Services", href: "/services" },
      ],
    },
    {
      title: "Stories",
      links: [
        { label: "Community Stories", href: "/stories" },
        { label: "Blog & Articles", href: "/blog" },
        { label: "Video Gallery", href: "/videos" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Impact",
      links: [
        { label: "Impact Overview", href: "/impact" },
        { label: "Outcomes", href: "/outcomes" },
        { label: "JusticeHub Profile", href: "https://justicehub.com.au/organizations/oonchiumpa" },
        { label: "Judges on Country", href: "https://justicehub.com.au/judges-on-country" },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation
        links={navLinks}
        ctaButton={{
          label: "Contact Us",
          onClick: () => navigate("/contact"),
        }}
      />

      <main>
        <Outlet />
      </main>

      <Footer sections={footerSections} />
      <ScrollToTop />
    </div>
  );
};
