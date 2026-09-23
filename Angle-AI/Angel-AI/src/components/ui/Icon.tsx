import React from 'react';

interface IconProps {
  name: string;
  fill?: boolean;
  size?: number | string;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

export default function Icon({
  name,
  fill = false,
  size = 24,
  weight = 400,
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: IconProps) {
  const fontVariation = `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`;

  return (
    <span
      className={`material-symbols-outlined select-none leading-none ${className}`}
      style={{
        fontSize: typeof size === 'number' ? `${size}px` : size,
        fontVariationSettings: fontVariation,
      }}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? !ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    >
      {name}
    </span>
  );
}
