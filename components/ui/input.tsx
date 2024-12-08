import React, { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  className?: string;
};

const Input: React.FC<InputProps> = ({ label, id, className = '', ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className={`border border-gray-300 rounded-md p-2 w-full mt-1 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
