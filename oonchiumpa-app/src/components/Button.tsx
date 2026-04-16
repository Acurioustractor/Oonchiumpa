import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-[color,background-color,border-color,box-shadow,transform] duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2';

  const variantClasses = {
    primary:
      'text-white bg-ochre-600 hover:bg-ochre-700 focus:ring-ochre-200 shadow-[0_10px_24px_rgba(226,78,16,0.26)] hover:-translate-y-0.5',
    secondary:
      'text-earth-800 border border-earth-300 bg-white hover:bg-earth-50 focus:ring-ochre-100',
    ghost:
      'text-earth-700 bg-earth-100/75 hover:bg-earth-200/85 focus:ring-ochre-100',
  };

  const sizeClasses = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3.5 text-sm md:text-base',
    lg: 'px-8 py-4 text-base md:text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
