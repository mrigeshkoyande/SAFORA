import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  label?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export default function Toggle({ checked, onChange, id, label, size = 'md', disabled = false }: ToggleProps) {
  const toggleId = id || label?.toLowerCase().replace(/\s+/g, '-') || 'toggle';
  const isSmall = size === 'sm';

  return (
    <label
      htmlFor={toggleId}
      className={`relative inline-flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} gap-2`}
    >
      <input
        id={toggleId}
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
      />
      <div
        className={`
          relative rounded-full
          bg-outline-variant
          peer-checked:bg-primary
          transition-colors duration-200
          after:content-[''] after:absolute after:top-0.5 after:left-0.5
          after:bg-white after:rounded-full
          after:transition-transform after:duration-200
          peer-checked:after:translate-x-full
          ${isSmall
            ? 'w-10 h-5 after:w-4 after:h-4'
            : 'w-12 h-6 after:w-5 after:h-5'
          }
        `}
      />
      {label && (
        <span className="font-inter text-label-md text-on-surface">{label}</span>
      )}
    </label>
  );
}
