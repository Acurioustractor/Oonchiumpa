import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  pattern?: boolean;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  pattern = false,
  id
}) => {
  const patternClass = pattern ? 'section-pattern' : '';
  
  return (
    <section id={id} className={`py-16 md:py-24 lg:py-32 ${patternClass} ${className}`}>
      <div className="container-custom">
        {children}
      </div>
    </section>
  );
};