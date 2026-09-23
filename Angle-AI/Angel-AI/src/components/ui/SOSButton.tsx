import React, { useCallback, useRef, useState } from 'react';
import Icon from './Icon';

interface SOSButtonProps {
  onActivate: () => void;
  onCancel?: () => void;
  holdDuration?: number;
  className?: string;
  activationMode?: 'click' | 'hold';
}

export default function SOSButton({
  onActivate,
  onCancel,
  holdDuration = 3000,
  className = '',
  activationMode = 'click',
}: SOSButtonProps) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
  }, []);

  const startHold = useCallback(() => {
    if (activationMode === 'click') return;
    setHolding(true);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / holdDuration) * 100, 100);
      setProgress(pct);
    }, 50);

    timerRef.current = setTimeout(() => {
      clearTimers();
      setHolding(false);
      setProgress(0);
      onActivate();
    }, holdDuration);
  }, [activationMode, clearTimers, holdDuration, onActivate]);

  const endHold = useCallback(() => {
    if (activationMode === 'click') return;
    if (holding) {
      clearTimers();
      setHolding(false);
      setProgress(0);
      onCancel?.();
    }
  }, [activationMode, clearTimers, holding, onCancel]);

  const handleClick = useCallback(() => {
    if (activationMode === 'click') {
      onActivate();
    }
  }, [activationMode, onActivate]);

  return (
    <button
      aria-label={activationMode === 'click' ? 'Open SOS activation flow' : 'SOS Emergency Button - hold for 3 seconds to activate'}
      className={`
        relative w-16 h-16 rounded-full
        bg-sos-gradient text-white
        flex items-center justify-center
        shadow-sos animate-sos-pulse
        transition-transform duration-150
        ${holding ? 'scale-110' : 'scale-100'}
        active:scale-90
        focus:outline-none focus:ring-4 focus:ring-primary/50
        ${className}
      `}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={(event) => {
        if (activationMode === 'hold') {
          event.preventDefault();
        }
        startHold();
      }}
      onTouchEnd={endHold}
      onClick={handleClick}
      style={{ animation: holding ? 'none' : undefined }}
    >
      {holding && (
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 64 64"
          aria-hidden="true"
        >
          <circle
            cx="32"
            cy="32"
            r="30"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="4"
          />
          <circle
            cx="32"
            cy="32"
            r="30"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 30}`}
            strokeDashoffset={`${2 * Math.PI * 30 * (1 - progress / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
      )}
      <Icon name="sos" fill size={28} weight={700} aria-hidden />
    </button>
  );
}
