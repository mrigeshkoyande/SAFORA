import React, { type ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: string;
  iconFill?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-container text-white shadow-primary hover:opacity-90 active:scale-95',
  secondary: 'bg-surface-container text-on-surface border border-outline-variant hover:bg-surface-container-high active:scale-95',
  ghost: 'bg-transparent text-primary hover:bg-primary-container/10 active:scale-95',
  danger: 'bg-error text-on-error shadow-md hover:opacity-90 active:scale-95',
  outline: 'bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container-low active:scale-95',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-label-sm rounded-full',
  md: 'h-12 px-6 text-label-md',
  lg: 'h-14 px-8 text-label-md',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'lg',
  loading = false,
  fullWidth = false,
  icon,
  iconFill = false,
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  const isPill = variant === 'primary' || variant === 'danger';
  const radiusClass = isPill ? 'rounded-full' : size === 'sm' ? 'rounded-full' : 'rounded-[16px]';

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-inter font-semibold
        transition-all duration-150 select-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${radiusClass}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
      ) : icon ? (
        <span
          className="material-symbols-outlined text-[20px]"
          style={iconFill ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
