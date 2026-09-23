import React, { type HTMLAttributes } from 'react';

type ChipVariant = 'default' | 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'status' | 'outline';
type ChipSize = 'sm' | 'md' | 'lg';

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant | string;
  size?: ChipSize | string;
  color?: string;
  icon?: string;
  iconFill?: boolean;
}

const chipStyles: Record<string, string> = {
  default: 'bg-secondary-container/15 text-primary',
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary-container/20 text-secondary',
  tertiary: 'bg-tertiary-container/20 text-tertiary',
  success: 'bg-green-100 text-green-700',
  error: 'bg-error-container text-on-error-container',
  status: 'bg-primary-container/20 text-primary border border-primary/20',
  outline: 'bg-transparent border border-outline-variant text-on-surface-variant',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2.5 py-0.5 text-[11px]',
  md: 'px-3 py-1 text-label-sm',
  lg: 'px-4 py-1.5 text-label-md',
};

export default function Chip({
  variant = 'default',
  size = 'md',
  color,
  icon,
  iconFill = false,
  children,
  className = '',
  ...props
}: ChipProps) {
  const styleClass = chipStyles[variant] || (color === 'primary' ? chipStyles.primary : color === 'secondary' ? chipStyles.secondary : chipStyles.default);
  const sizeClass = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-[8px]
        font-inter font-semibold transition-colors
        ${styleClass}
        ${sizeClass}
        ${className}
      `}
      {...props}
    >
      {icon && (
        <span
          className="material-symbols-outlined text-[14px]"
          style={iconFill ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
