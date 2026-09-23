import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';

interface OnboardingStep {
  icon: string;
  iconColor: string;
  headline: string;
  body: string;
  bgBlob1: string;
  bgBlob2: string;
}

const steps: OnboardingStep[] = [
  {
    icon: 'shield_with_heart',
    iconColor: 'text-primary',
    headline: 'Stay Protected',
    body: 'AI Guardian Mode proactively monitors your safety during every journey — day or night.',
    bgBlob1: 'bg-primary-container/10',
    bgBlob2: 'bg-tertiary-container/10',
  },
  {
    icon: 'sos',
    iconColor: 'text-primary',
    headline: 'Silent SOS, Instantly',
    body: 'Trigger a hidden emergency alert in seconds — no screen needed. Press, gesture, or whisper.',
    bgBlob1: 'bg-secondary-container/10',
    bgBlob2: 'bg-primary-container/10',
  },
  {
    icon: 'psychology',
    iconColor: 'text-tertiary',
    headline: 'Your AI Escape Coach',
    body: 'Real-time coaching when you feel unsafe. SAFORA reads your situation and tells you exactly what to do.',
    bgBlob1: 'bg-tertiary-container/10',
    bgBlob2: 'bg-primary-container/5',
  },
];

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const { step } = useParams<{ step: string }>();
  const stepIndex = Math.min(Math.max(parseInt(step || '1') - 1, 0), steps.length - 1);
  const current = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigate('/auth');
    } else {
      navigate(`/onboarding/${stepIndex + 2}`);
    }
  };

  const handleSkip = () => navigate('/auth');

  return (
    <div className="min-h-dvh flex flex-col bg-surface overflow-hidden selection:bg-primary-container/30">
      {/* Header */}
      <header className="flex justify-between items-center px-5 h-20">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="SAFORA" className="w-7 h-7 object-contain" />
          <span className="font-jakarta font-bold text-title-lg text-primary">SAFORA</span>
        </div>
        <button
          onClick={handleSkip}
          className="font-inter text-label-md text-on-surface-variant hover:opacity-70 transition-opacity active:scale-95"
          aria-label="Skip onboarding"
        >
          Skip
        </button>
      </header>

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/4 -right-20 w-64 h-64 ${current.bgBlob1} blur-[100px] rounded-full transition-all duration-700`} />
        <div className={`absolute bottom-1/4 -left-20 w-80 h-80 ${current.bgBlob2} blur-[120px] rounded-full transition-all duration-700`} />
      </div>

      {/* Illustration */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 relative">
        <div className="w-full max-w-sm flex items-center justify-center mb-12">
          <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Outer glow */}
            <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse" />
            {/* Icon card */}
            <div className="relative z-10 animate-float">
              <div className="bg-white/60 backdrop-blur-md p-10 rounded-[40px] shadow-nav border border-white/50">
                <Icon name={current.icon} fill size={80} className={current.iconColor} />
              </div>
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-white p-2.5 rounded-2xl shadow-card border border-primary/5">
                <Icon name="verified_user" fill size={22} className="text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="text-center space-y-3 max-w-[320px] animate-fade-in">
          <h1 className="font-jakarta font-bold text-headline-lg-mobile text-on-surface tracking-tight">
            {current.headline}
          </h1>
          <p className="font-jakarta text-body-md text-on-surface-variant leading-relaxed">
            {current.body}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 pb-10 pt-6">
        {/* Progress dots */}
        <div className="flex justify-center items-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === stepIndex
                  ? 'w-8 bg-primary-container'
                  : 'w-2 bg-surface-container-highest'
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-sm mx-auto">
          <Button
            variant="primary"
            fullWidth
            icon="arrow_forward"
            iconFill
            onClick={handleNext}
            aria-label={isLast ? 'Get started' : 'Next onboarding step'}
          >
            {isLast ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </footer>
    </div>
  );
}
