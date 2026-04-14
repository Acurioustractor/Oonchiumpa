import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { SearchModal } from "./SearchModal";

interface NavLink {
  label: string;
  href: string;
}

interface NavigationProps {
  logo?: string;
  links?: NavLink[];
  ctaButton?: {
    label: string;
    onClick: () => void;
  };
}

export const Navigation: React.FC<NavigationProps> = ({
  logo = "Oonchiumpa",
  links = [],
  ctaButton,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut, isAdmin, hasPermission } = useAuth();
  const logoSrc = isScrolled
    ? "/images/logo/logo-transparent-dark.png"
    : "/images/logo/logo-transparent.png";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setShowUserMenu(false);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen((v) => !v);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/92 backdrop-blur-md shadow-[0_10px_30px_rgba(47,30,26,0.1)] border-b border-earth-100"
          : "bg-gradient-to-b from-earth-950/72 via-earth-950/36 to-transparent text-white"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" aria-label={`${logo} home`}>
            <img
              src={logoSrc}
              alt={`${logo} logo`}
              className={`w-auto object-contain transition-all duration-300 ${
                isScrolled
                  ? "h-14 md:h-16"
                  : "h-16 md:h-20 drop-shadow-[0_10px_24px_rgba(0,0,0,0.5)]"
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-7">
            {links.map((link, index) => {
              const isActive = location.pathname === link.href;
              const textClasses = isActive
                ? isScrolled
                  ? "text-ochre-700"
                  : "text-ochre-100"
                : isScrolled
                  ? "text-earth-700 hover:text-ochre-700"
                  : "text-white/85 hover:text-white";
              const underlineColor = isScrolled ? "bg-ochre-600" : "bg-white/75";
              return (
                <Link
                  key={index}
                  to={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`font-medium tracking-wide transition-colors duration-200 relative group ${textClasses}`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 ${underlineColor} transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              );
            })}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search (Cmd/Ctrl+K)"
              className={`ml-2 p-2 rounded-lg transition-colors ${
                isScrolled
                  ? "text-earth-700 hover:bg-earth-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
            </button>
            {ctaButton && (
              <button
                onClick={ctaButton.onClick}
                className="ml-3 px-5 py-2.5 bg-ochre-600 text-white rounded-xl hover:bg-ochre-700 transition-all duration-200 shadow-[0_8px_22px_rgba(226,78,16,0.3)]"
              >
                {ctaButton.label}
              </button>
            )}

            {/* Authentication Section */}
            {isAuthenticated() ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-colors ${
                    isScrolled
                      ? "hover:bg-earth-100"
                      : "hover:bg-white/15"
                  }`}
                >
                  <div className="w-8 h-8 bg-ochre-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className={`font-medium ${isScrolled ? "text-earth-700" : "text-white/90"}`}>
                    {user?.full_name}
                  </span>
                  <svg
                    className={`w-4 h-4 ${isScrolled ? "text-earth-500" : "text-white/65"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-[0_18px_36px_rgba(47,30,26,0.18)] border border-earth-200 py-2">
                    <div className="px-4 py-2 border-b border-earth-200">
                      <div className="font-semibold text-earth-950">
                        {user?.full_name}
                      </div>
                      <div className="text-sm text-earth-600">
                        {user?.email}
                      </div>
                      <div className="text-xs text-ochre-600 font-medium capitalize">
                        {user?.role}
                      </div>
                    </div>

                    {isAdmin() && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 hover:bg-earth-50 text-earth-700"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    {hasPermission("manage_media") && (
                      <Link
                        to="/media"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 hover:bg-earth-50 text-earth-700"
                      >
                        Media Manager
                      </Link>
                    )}

                    {hasPermission("create_content") && (
                      <Link
                        to="/content-dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 hover:bg-earth-50 text-earth-700"
                      >
                        Content Dashboard
                      </Link>
                    )}

                    {hasPermission("create_content") && (
                      <Link
                        to="/content-generator"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 hover:bg-earth-50 text-earth-700"
                      >
                        Content Generator
                      </Link>
                    )}

                    <Link
                      to="/staff-portal"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 hover:bg-earth-50 text-earth-700"
                    >
                      Staff Portal
                    </Link>

                    <div className="border-t border-earth-200 mt-2 pt-2">
                      <button
                        onClick={async () => {
                          await signOut();
                          setShowUserMenu(false);
                          navigate("/");
                        }}
                        className="flex items-center w-full px-4 py-2 hover:bg-sunset-50 text-sunset-600"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`ml-3 px-5 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                  isScrolled
                    ? "bg-ochre-600 text-white hover:bg-ochre-700 shadow-[0_8px_22px_rgba(226,78,16,0.3)]"
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/25"
                }`}
              >
                Staff Login
              </Link>
            )}
          </div>

          {/* Mobile Search + Menu */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? "text-earth-700 hover:bg-earth-100" : "text-white hover:bg-white/10"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? "hover:bg-earth-100" : "hover:bg-white/10"
            }`}
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`block h-0.5 transition-all duration-300 ${
                  isScrolled ? "bg-earth-800" : "bg-white"
                } ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              ></span>
              <span
                className={`block h-0.5 transition-all duration-300 ${
                  isScrolled ? "bg-earth-800" : "bg-white"
                } ${isMobileMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                className={`block h-0.5 transition-all duration-300 ${
                  isScrolled ? "bg-earth-800" : "bg-white"
                } ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-white backdrop-blur-md shadow-xl rounded-b-2xl transition-[max-height] duration-300 ${
            isMobileMenuOpen
              ? "max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-earth-200"
              : "max-h-0 overflow-hidden"
          }`}
        >
          <div className="py-4 space-y-3">
            {links.map((link, index) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={index}
                  to={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 min-h-[44px] flex items-center rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-ochre-600 bg-ochre-50 font-semibold"
                      : "text-earth-700 hover:text-ochre-600 hover:bg-ochre-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {ctaButton && (
              <button
                onClick={ctaButton.onClick}
                className="w-full mt-4 px-5 py-2.5 bg-ochre-600 text-white rounded-xl hover:bg-ochre-700 transition-all duration-200"
              >
                {ctaButton.label}
              </button>
            )}

            {isAuthenticated() ? (
              <div className="pt-3 mt-3 border-t border-earth-200 space-y-2">
                <Link
                  to="/staff-portal"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-earth-700 hover:text-ochre-600 hover:bg-ochre-50 transition-colors duration-200"
                >
                  Staff Portal
                </Link>

                {isAdmin() && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-earth-700 hover:text-ochre-600 hover:bg-ochre-50 transition-colors duration-200"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={async () => {
                    await signOut();
                    setIsMobileMenuOpen(false);
                    navigate("/");
                  }}
                  className="w-full mt-1 px-4 py-2.5 rounded-lg text-sunset-600 bg-sunset-50 hover:bg-sunset-100 transition-colors duration-200 text-left"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full mt-4 px-5 py-2.5 bg-ochre-600 text-white text-center rounded-xl hover:bg-ochre-700 transition-all duration-200"
              >
                Staff Login
              </Link>
            )}
          </div>
        </div>
      </div>
      <SearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
};
