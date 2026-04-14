import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  pattern?: boolean;
  id?: string;
  noContainer?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  containerClassName = '',
  pattern = false,
  id,
  noContainer = false,
}) => {
  const patternClass = pattern ? 'section-pattern' : '';

  return (
    <section id={id} className={`py-20 md:py-24 lg:py-28 ${patternClass} ${className}`}>
      {noContainer ? (
        children
      ) : (
        <div className={`container-custom ${containerClassName}`}>
          {children}
        </div>
      )}
    </section>
  );
};
