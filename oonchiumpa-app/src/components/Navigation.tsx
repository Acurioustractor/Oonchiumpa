import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut, isAdmin, hasPermission } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-b from-earth-900/55 via-earth-900/20 to-transparent text-white"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-end space-x-1">
                <span className="relative flex items-center justify-center w-11 h-11 rounded-full border-[6px] border-ochre-500"></span>
                <span className="relative flex items-center justify-center w-11 h-11 rounded-full border-[6px] border-eucalyptus-600 -ml-2"></span>
              </div>
              <div className="flex items-center space-x-[7px] mt-1 ml-1">
                <span className="w-2.5 h-2.5 rounded-full bg-ochre-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-eucalyptus-600/90"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-eucalyptus-500/80"></span>
              </div>
            </div>
            <div className="leading-tight">
              <span
                className={`block font-display text-xl tracking-tight transition-colors duration-300 ${
                  isScrolled ? 'text-earth-900' : 'text-white'
                }`}
                style={!isScrolled ? { textShadow: '0 8px 26px rgba(0,0,0,0.5)' } : undefined}
              >
                {logo}
              </span>
              <span
                className={`block text-[11px] uppercase tracking-[0.35em] transition-colors duration-300 ${
                  isScrolled ? 'text-ochre-600' : 'text-ochre-100/90'
                }`}
              >
                Culture-Led Futures
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link, index) => {
              const isActive = location.pathname === link.href;
              const textClasses = isActive
                ? isScrolled
                  ? 'text-ochre-600'
                  : 'text-ochre-200'
                : isScrolled
                  ? 'text-earth-700 hover:text-ochre-600'
                  : 'text-white/85 hover:text-white';
              const underlineColor = isScrolled ? 'bg-ochre-600' : 'bg-white/70';
              return (
                <Link
                  key={index}
                  to={link.href}
                  className={`font-medium transition-colors duration-200 relative group ${textClasses}`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 ${underlineColor} transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>
              );
            })}
            {ctaButton && (
              <button
                onClick={ctaButton.onClick}
                className="ml-4 px-5 py-2.5 bg-ochre-600 text-white rounded-full hover:bg-ochre-700 transition-all duration-200 transform hover:scale-105"
              >
                {ctaButton.label}
              </button>
            )}

            {/* Authentication Section */}
            {isAuthenticated() ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-earth-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-ochre-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-earth-700 font-medium">
                    {user?.full_name}
                  </span>
                  <svg
                    className="w-4 h-4 text-earth-500"
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
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-earth-200 py-2">
                    <div className="px-4 py-2 border-b border-earth-200">
                      <div className="font-semibold text-earth-900">
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
                        <span className="mr-2">⚙️</span>
                        Admin Dashboard
                      </Link>
                    )}

                    {hasPermission("manage_media") && (
                      <Link
                        to="/media"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 hover:bg-earth-50 text-earth-700"
                      >
                        <span className="mr-2">📸</span>
                        Media Manager
                      </Link>
                    )}

                    {hasPermission("create_content") && (
                      <Link
                        to="/content-dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 hover:bg-earth-50 text-earth-700"
                      >
                        <span className="mr-2">📋</span>
                        Content Dashboard
                      </Link>
                    )}

                    {hasPermission("create_content") && (
                      <Link
                        to="/content-generator"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 hover:bg-earth-50 text-earth-700"
                      >
                        <span className="mr-2">✨</span>
                        Content Generator
                      </Link>
                    )}

                    <Link
                      to="/staff-portal"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 hover:bg-earth-50 text-earth-700"
                    >
                      <span className="mr-2">🏛️</span>
                      Staff Portal
                    </Link>

                    <div className="border-t border-earth-200 mt-2 pt-2">
                      <button
                        onClick={async () => {
                          await signOut();
                          setShowUserMenu(false);
                          navigate("/");
                        }}
                        className="flex items-center w-full px-4 py-2 hover:bg-red-50 text-red-600"
                      >
                        <span className="mr-2">🚪</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'hover:bg-earth-100' : 'hover:bg-white/10'
            }`}
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`block h-0.5 transition-all duration-300 ${
                  isScrolled ? 'bg-earth-800' : 'bg-white'
                } ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              ></span>
              <span
                className={`block h-0.5 transition-all duration-300 ${
                  isScrolled ? 'bg-earth-800' : 'bg-white'
                } ${isMobileMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                className={`block h-0.5 transition-all duration-300 ${
                  isScrolled ? 'bg-earth-800' : 'bg-white'
                } ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden bg-white/98 backdrop-blur-md shadow-lg ${
            isMobileMenuOpen ? "max-h-96 border-t border-earth-200" : "max-h-0"
          }`}
        >
          <div className="py-4 space-y-3">
            {links.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === link.href
                    ? "text-ochre-600 bg-ochre-50"
                    : "text-earth-700 hover:text-ochre-600 hover:bg-ochre-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {ctaButton && (
              <button
                onClick={ctaButton.onClick}
                className="w-full mt-4 px-5 py-2.5 bg-ochre-600 text-white rounded-full hover:bg-ochre-700 transition-all duration-200"
              >
                {ctaButton.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
