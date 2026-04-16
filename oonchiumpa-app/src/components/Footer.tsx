import React from 'react';
import { Link } from 'react-router-dom';
import { CrosshatchPattern, SpiralPattern } from '../design-system/symbols';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  sections?: FooterSection[];
  acknowledgment?: string;
  copyright?: string;
}

export const Footer: React.FC<FooterProps> = ({
  sections = [],
  acknowledgment = "We acknowledge the Traditional Custodians of the land on which we work and live, and pay our respects to Elders past, present and emerging.",
  copyright = `© ${new Date().getFullYear()} Oonchiumpa. All rights reserved.`
}) => {
  const renderFooterLink = (link: FooterLink, className: string) => {
    if (link.href.startsWith('/')) {
      return (
        <Link to={link.href} className={className}>
          {link.label}
        </Link>
      );
    }

    return (
      <a href={link.href} className={className}>
        {link.label}
      </a>
    );
  };

  return (
    <footer className="bg-earth-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.08]">
        <CrosshatchPattern className="absolute top-0 left-0 w-full h-full" />
      </div>
      
      <div className="container-custom relative z-10">
        {/* Acknowledgment of Country */}
        <div className="py-10 border-b border-earth-700/80">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-5">
              <img
                src="/images/logo/logo-transparent.png"
                alt="Oonchiumpa logo"
                className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.35)]"
              />
            </div>
            <div className="flex justify-center mb-4">
              <SpiralPattern className="w-10 h-10 text-ochre-300/85" />
            </div>
            <h3 className="text-lg font-semibold mb-3 text-ochre-300">
              Acknowledgment of Country
            </h3>
            <p className="text-sand-100/90 leading-relaxed">
              {acknowledgment}
            </p>
          </div>
        </div>
        
        {/* Footer Links */}
        {sections.length > 0 && (
          <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 items-start">
            {sections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-sand-100 mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {renderFooterLink(
                        link,
                        'text-sand-300 hover:text-ochre-300 transition-colors duration-200'
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h4 className="font-semibold text-sand-100 mb-4">Contact</h4>
              <ul className="space-y-2 text-sand-300">
                <li>Alice Springs, Arrernte Country</li>
                <li>
                  <a
                    href="tel:0474702523"
                    className="hover:text-ochre-300 transition-colors duration-200"
                  >
                    0474 702 523
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:admin@oonchiumpaconsultancy.com.au"
                    className="hover:text-ochre-300 transition-colors duration-200 break-all"
                  >
                    admin@oonchiumpaconsultancy.com.au
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Copyright */}
        <div className="py-6 border-t border-earth-700/80">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sand-300 text-sm">
                {copyright}
              </p>
              <div className="flex space-x-4 text-xs text-sand-400">
                <Link
                  to="/login"
                  className="hover:text-ochre-300 transition-colors duration-200"
                >
                  Staff Login
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <a
                href="mailto:admin@oonchiumpaconsultancy.com.au"
                className="inline-flex items-center px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sand-100 transition-colors duration-200 text-xs"
              >
                Email
              </a>
              <a
                href="tel:0474702523"
                className="inline-flex items-center px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sand-100 transition-colors duration-200 text-xs"
              >
                Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
