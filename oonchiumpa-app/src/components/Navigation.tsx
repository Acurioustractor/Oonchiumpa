import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DotPattern } from '../design-system/symbols';

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
  logo = 'Oonchiumpa',
  links = [],
  ctaButton
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <DotPattern className="absolute inset-0 text-ochre-600" />
            </div>
            <span className="text-2xl font-display font-bold text-earth-900">
              {logo}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className={`font-medium transition-colors duration-200 relative group ${
                  location.pathname === link.href 
                    ? 'text-ochre-600' 
                    : 'text-earth-700 hover:text-ochre-600'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-ochre-600 transition-all duration-300 ${
                  location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
            {ctaButton && (
              <button
                onClick={ctaButton.onClick}
                className="ml-4 px-5 py-2.5 bg-ochre-600 text-white rounded-full hover:bg-ochre-700 transition-all duration-200 transform hover:scale-105"
              >
                {ctaButton.label}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-earth-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`block h-0.5 bg-earth-800 transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}></span>
              <span className={`block h-0.5 bg-earth-800 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}></span>
              <span className={`block h-0.5 bg-earth-800 transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96' : 'max-h-0'
        }`}>
          <div className="py-4 space-y-3">
            {links.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === link.href
                    ? 'text-ochre-600 bg-ochre-50'
                    : 'text-earth-700 hover:text-ochre-600 hover:bg-ochre-50'
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