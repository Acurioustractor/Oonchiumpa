import { Outlet, useNavigate } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

export const Layout = () => {
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Our Impact", href: "/impact" },
    { label: "Services", href: "/services" },
    { label: "Stories", href: "/stories" },
    { label: "Blog", href: "/blog" },
  ];

  const footerSections = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Story", href: "/about#story" },
        { label: "Team", href: "/about#team" },
        { label: "Careers", href: "/contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Cultural Consulting", href: "/services#consulting" },
        { label: "Education Programs", href: "/services#education" },
        { label: "Community Engagement", href: "/services#community" },
        { label: "Art & Design", href: "/services#art" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Our Impact", href: "/impact" },
        { label: "Stories", href: "/stories" },
        { label: "Community Blog", href: "/blog" },
        { label: "Outcomes", href: "/outcomes" },
        { label: "AI Content Generator", href: "/content-generator" },
        { label: "Upload Gallery Media", href: "/gallery-upload" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "Support", href: "/contact#support" },
        { label: "Partnerships", href: "/contact#partnerships" },
        { label: "Media Kit", href: "/contact#media" },
      ],
    },
    {
      title: "Internal Access",
      links: [
        { label: "Staff Login", href: "/login" },
        { label: "Demo Access", href: "/demo" },
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
