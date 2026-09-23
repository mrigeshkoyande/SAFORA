import React, { useState, useEffect } from 'react';
import AppShell from '../../components/layout/AppShell';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import { useHaptics } from '../../platform';

export default function DummyCallScreen() {
  const { impact, vibrate } = useHaptics();
  const [callerName, setCallerName] = useState('Mom');
  const [callerNumber, setCallerNumber] = useState('+91 98765 43210');
  const [delaySeconds, setDelaySeconds] = useState(10);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'active'>('idle');
  const [callDuration, setCallDuration] = useState(0);

  // Countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown !== null && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => (prev !== null ? prev - 1 : null)), 1000);
    } else if (countdown === 0) {
      setCountdown(null);
      setCallState('ringing');
      vibrate(1000);
    }
    return () => clearInterval(timer);
  }, [countdown, vibrate]);

  // Active call duration
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (callState === 'active') {
      timer = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const handleScheduleCall = () => {
    impact('medium');
    setCountdown(delaySeconds);
  };

  const handleCancelCountdown = () => {
    impact('light');
    setCountdown(null);
  };

  const handleAcceptCall = () => {
    impact('heavy');
    setCallState('active');
  };

  const handleEndCall = () => {
    impact('medium');
    setCallState('idle');
    setCallDuration(0);
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Full screen incoming / active call overlay
  if (callState === 'ringing' || callState === 'active') {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-900 text-white flex flex-col justify-between p-8 text-center animate-fade-in">
        <div className="pt-12 space-y-3">
          <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary mx-auto flex items-center justify-center text-primary mb-4 animate-pulse">
            <Icon name="person" fill size={56} />
          </div>
          <h2 className="font-jakarta font-bold text-headline-lg">{callerName}</h2>
          <p className="font-inter text-body-md text-gray-400">{callerNumber}</p>
          <p className="font-inter text-label-md text-primary uppercase tracking-widest pt-2 font-semibold">
            {callState === 'ringing' ? 'Incoming Mobile Call...' : `00:${formatDuration(callDuration)}`}
          </p>
        </div>

        {callState === 'active' && (
          <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl max-w-xs mx-auto border border-gray-700 text-left space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-label-sm">
              <Icon name="record_voice_over" size={16} />
              <span>Simulated Voice Script Active</span>
            </div>
            <p className="font-inter text-body-sm text-gray-300 italic">
              "Hey! Where are you right now? I'm waiting outside with the car. Come out quickly!"
            </p>
          </div>
        )}

        <div className="pb-12 flex items-center justify-around max-w-sm mx-auto w-full">
          {callState === 'ringing' && (
            <button
              onClick={handleAcceptCall}
              aria-label="Accept Call"
              className="w-18 h-18 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
            >
              <Icon name="call" fill size={32} />
            </button>
          )}
          <button
            onClick={handleEndCall}
            aria-label="Decline or End Call"
            className="w-18 h-18 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
          >
            <Icon name="call_end" fill size={32} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <AppShell topBarProps={{ title: 'Simulated Dummy Call', showBack: true }}>
      <div className="px-5 space-y-6 pt-4 pb-12">
        {/* Banner */}
        <Card className="p-5 bg-tertiary/5 border border-tertiary/20 flex gap-4 items-start">
          <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary flex-shrink-0">
            <Icon name="call" size={24} />
          </div>
          <div>
            <h2 className="font-jakarta font-bold text-title-md text-tertiary">Discreet Situation Exit</h2>
            <p className="font-inter text-body-sm text-on-surface-variant mt-1">
              Schedule a realistic incoming phone call to gracefully exit uncomfortable or unsafe social interactions.
            </p>
          </div>
        </Card>

        {/* Countdown Banner if scheduled */}
        {countdown !== null && (
          <Card className="p-5 bg-primary-container/20 border border-primary/30 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <Icon name="timer" className="text-primary animate-spin" size={28} />
              <div>
                <p className="font-jakarta font-bold text-title-md text-on-surface">Call arriving in {countdown}s</p>
                <p className="font-inter text-label-sm text-on-surface-variant">Caller: {callerName}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleCancelCountdown}>
              Cancel
            </Button>
          </Card>
        )}

        {/* Caller Configuration */}
        <section className="space-y-3">
          <h3 className="font-jakarta font-semibold text-title-md text-on-surface">Caller Identity</h3>
          <div className="grid grid-cols-3 gap-3">
            {['Mom', 'Boss', 'Roommate'].map((name) => (
              <button
                key={name}
                onClick={() => { impact('light'); setCallerName(name); }}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${callerName === name ? 'bg-primary/10 border-primary font-bold text-primary shadow-sm' : 'bg-surface-container-lowest border-outline-variant/20 text-on-surface hover:bg-surface-container'}`}
              >
                <Icon name="person" className="mx-auto mb-1" size={24} fill={callerName === name} />
                <span className="font-inter text-label-md">{name}</span>
              </button>
            ))}
          </div>

          <Card className="p-4 space-y-3 mt-3">
            <div>
              <label className="block font-inter text-label-sm text-on-surface-variant mb-1">Custom Caller Name</label>
              <input
                type="text"
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container font-jakarta text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block font-inter text-label-sm text-on-surface-variant mb-1">Simulated Number</label>
              <input
                type="text"
                value={callerNumber}
                onChange={(e) => setCallerNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container font-jakarta text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </Card>
        </section>

        {/* Delay Timer */}
        <section className="space-y-3">
          <h3 className="font-jakarta font-semibold text-title-md text-on-surface">Call Delay Timer</h3>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 30, 60].map((secs) => (
              <button
                key={secs}
                onClick={() => { impact('light'); setDelaySeconds(secs); }}
                className={`py-3 rounded-xl border font-jakarta font-semibold text-label-md transition-all cursor-pointer ${delaySeconds === secs ? 'bg-tertiary text-white border-tertiary shadow-sm' : 'bg-surface-container-lowest text-on-surface border-outline-variant/20 hover:bg-surface-container'}`}
              >
                {secs < 60 ? `${secs}s` : '1 Min'}
              </button>
            ))}
          </div>
        </section>

        {/* Trigger Button */}
        <div className="pt-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleScheduleCall}
            disabled={countdown !== null}
            icon="call"
          >
            {countdown !== null ? 'Call Scheduled...' : `Schedule Dummy Call (${delaySeconds}s)`}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
