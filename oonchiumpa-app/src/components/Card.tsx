import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  bordered?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = true,
  bordered = false,
  onClick
}) => {
  const hoverClass = hoverable ? 'hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(47,30,26,0.12)]' : '';
  const borderClass = bordered ? 'border border-earth-200' : 'border border-earth-100';

  return (
    <div
      className={`bg-white rounded-2xl shadow-[0_8px_24px_rgba(47,30,26,0.08)] overflow-hidden transition-all duration-300 ${hoverClass} ${borderClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-5 border-b border-earth-100 ${className}`}>
    {children}
  </div>
);

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-5 ${className}`}>
    {children}
  </div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-5 border-t border-earth-100 bg-sand-50 ${className}`}>
    {children}
  </div>
);
