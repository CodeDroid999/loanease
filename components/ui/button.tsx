import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
}) => {
  // Button styles based on the variant
  const baseStyle = 'px-4 py-2 rounded-lg font-medium transition duration-300';
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    ghost: 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-100',
  };
  
  const buttonClassName = `${baseStyle} ${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <button
      onClick={onClick}
      className={buttonClassName}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
