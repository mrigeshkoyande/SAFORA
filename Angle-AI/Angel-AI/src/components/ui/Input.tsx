import React, { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  iconPosition = 'right',
  hint,
  id,
  className = '',
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block font-inter text-label-md text-on-surface-variant ml-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full h-14 px-4
            ${icon && iconPosition === 'left' ? 'pl-12' : ''}
            ${icon && iconPosition === 'right' ? 'pr-12' : ''}
            bg-secondary-container/20
            border-none rounded-[16px]
            font-jakarta text-body-md text-on-surface
            placeholder:text-outline/50
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-container/60 focus:bg-white
            ${error ? 'ring-2 ring-error' : ''}
            ${className}
          `}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">
            {icon}
          </span>
        )}
      </div>
      {hint && !error && (
        <p className="font-inter text-label-sm text-on-surface-variant ml-1">{hint}</p>
      )}
      {error && (
        <p className="font-inter text-label-sm text-error ml-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
