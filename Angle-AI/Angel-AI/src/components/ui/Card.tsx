import React, { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  radius?: 'lg' | 'xl' | '2xl' | '3xl';
  hoverable?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const radiusStyles = {
  lg: 'rounded-lg',   // 20px
  xl: 'rounded-xl',   // 24px
  '2xl': 'rounded-2xl', // 32px
  '3xl': 'rounded-3xl', // 40px
};

export default function Card({
  glass = false,
  padding = 'lg',
  radius = 'lg',
  hoverable = false,
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`
        ${glass ? 'glass-card' : 'bg-surface-container-lowest'}
        shadow-card
        ${paddingStyles[padding]}
        ${radiusStyles[radius]}
        ${hoverable ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.98] transition-transform duration-150' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
