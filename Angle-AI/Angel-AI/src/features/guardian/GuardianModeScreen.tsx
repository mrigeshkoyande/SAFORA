import React, { useState, useEffect } from 'react';
import AppShell from '../../components/layout/AppShell';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Chip from '../../components/ui/Chip';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../core/hooks/useApp';
import { guardianApi } from '../../core/api';
import { useHaptics } from '../../platform';

export default function GuardianModeScreen() {
  const { state, setGuardianMode } = useApp();
  const { impact } = useHaptics();
  const [destination, setDestination] = useState('Indiranagar Metro Station');
  const [checkInTimer, setCheckInTimer] = useState(15 * 60); // 15 mins in seconds
  const [isTracking, setIsTracking] = useState(state.guardianMode.isActive);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTracking && checkInTimer > 0) {
      interval = setInterval(() => {
        setCheckInTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, checkInTimer]);

  const handleToggleGuardian = async () => {
    try {
      await impact('medium');
      if (isTracking) {
        setIsTracking(false);
        setGuardianMode({ isActive: false, status: 'inactive' });
        await guardianApi.stopMonitoring();
      } else {
        setIsTracking(true);
        setGuardianMode({ isActive: true, status: 'active', destination });
        await guardianApi.startMonitoring();
      }
    } catch {
      setGuardianMode({ status: isTracking ? 'inactive' : 'active' });
    }
  };

  const handleCheckIn = () => {
    impact('light');
    setCheckInTimer(15 * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AppShell topBarProps={{ title: 'AI Guardian Mode', showBack: true }}>
      <div className="px-5 space-y-6 pt-4 pb-12">
        {/* Status Header */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card border border-primary-container/20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 transition-colors ${isTracking ? 'bg-primary/10 text-primary animate-pulse' : 'bg-surface-container text-on-surface-variant'}`}>
              <Icon name="shield_with_heart" fill={isTracking} size={40} />
            </div>
            <h2 className="font-jakarta font-bold text-headline-sm text-on-surface mb-1">
              {isTracking ? 'Guardian is Active' : 'Guardian Standby'}
            </h2>
            <p className="font-inter text-body-sm text-on-surface-variant max-w-xs mb-4">
              {isTracking
                ? 'SAFORA is actively tracking your route and monitoring biometrics.'
                : 'Activate Guardian Mode when commuting or traveling solo.'}
            </p>
            <Button
              variant={isTracking ? 'outline' : 'primary'}
              size="lg"
              fullWidth
              onClick={handleToggleGuardian}
              icon={isTracking ? 'stop' : 'play_arrow'}
            >
              {isTracking ? 'End Guardian Mode' : 'Start Journey Protection'}
            </Button>
          </div>
        </div>

        {/* Live Check-in Timer */}
        {isTracking && (
          <Card className="p-5 border border-secondary/20 bg-secondary-container/10 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon name="timer" className="text-secondary" size={24} />
                <span className="font-jakarta font-semibold text-title-md text-on-surface">Next Check-In</span>
              </div>
              <Chip variant="status" color="secondary" size="sm">Required</Chip>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-jakarta font-bold text-headline-lg text-secondary">{formatTime(checkInTimer)}</span>
              <Button variant="secondary" size="md" onClick={handleCheckIn} icon="check">
                I'm Safe
              </Button>
            </div>
            <p className="font-inter text-label-sm text-on-surface-variant mt-2">
              If check-in expires, your Guardian Circle will be alerted automatically.
            </p>
          </Card>
        )}

        {/* Route Details */}
        <section className="space-y-3">
          <h3 className="font-jakarta font-semibold text-title-md text-on-surface">Journey Parameters</h3>
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                <Icon name="location_on" size={20} />
              </div>
              <div className="flex-1">
                <label className="block font-inter text-label-sm text-on-surface-variant">Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full font-jakarta font-medium text-body-md text-on-surface bg-transparent border-b border-outline-variant/30 focus:outline-none focus:border-primary py-1"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
              <span className="font-inter text-body-sm text-on-surface-variant">Selected Route</span>
              <Chip icon="verified" iconFill color="primary" size="sm">Well-Lit Corridor</Chip>
            </div>
          </Card>
        </section>

        {/* Guardian Circle Teaser */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-jakarta font-semibold text-title-md text-on-surface">Active Guardians</h3>
            <span className="font-inter text-label-sm text-primary font-medium">3 Online</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Mom', 'Alex (Brother)', 'Sara (Friend)'].map((name, i) => (
              <Card key={name} className="p-3 text-center flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center font-jakarta font-bold text-primary">
                  {name[0]}
                </div>
                <span className="font-inter font-medium text-label-md text-on-surface truncate w-full">{name}</span>
                <span className="font-inter text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Ready {i + 1}m ago</span>
              </Card>
            ))}
          </div>
        </section>
      </div>

    </AppShell>
  );
}
