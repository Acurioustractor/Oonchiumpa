import React from 'react';
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
  return (
    <footer className="bg-earth-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <CrosshatchPattern className="absolute top-0 left-0 w-full h-full" />
      </div>
      
      <div className="container-custom relative z-10">
        {/* Acknowledgment of Country */}
        <div className="py-8 border-b border-earth-700">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <SpiralPattern className="w-12 h-12 text-ochre-400" />
            </div>
            <h3 className="text-lg font-semibold mb-3 text-ochre-300">
              Acknowledgment of Country
            </h3>
            <p className="text-sand-200 leading-relaxed">
              {acknowledgment}
            </p>
          </div>
        </div>
        
        {/* Footer Links */}
        {sections.length > 0 && (
          <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {sections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-sand-100 mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-sand-300 hover:text-ochre-400 transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        
        {/* Copyright */}
        <div className="py-6 border-t border-earth-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sand-400 text-sm">
              {copyright}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-sand-400 hover:text-ochre-400 transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="text-sand-400 hover:text-ochre-400 transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href="#"
                className="text-sand-400 hover:text-ochre-400 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};