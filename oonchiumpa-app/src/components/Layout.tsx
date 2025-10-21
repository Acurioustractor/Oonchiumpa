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
      title: "About",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Impact", href: "/impact" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Our Services", href: "/services" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Stories", href: "/stories" },
        { label: "Blog", href: "/blog" },
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
