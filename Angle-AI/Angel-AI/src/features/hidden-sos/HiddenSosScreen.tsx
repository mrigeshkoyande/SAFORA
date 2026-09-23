import React, { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Card from '../../components/ui/Card';
import Toggle from '../../components/ui/Toggle';
import Chip from '../../components/ui/Chip';
import Icon from '../../components/ui/Icon';
import { useHaptics } from '../../platform';

export default function HiddenSosScreen() {
  const { impact } = useHaptics();
  const [silentMode, setSilentMode] = useState(true);
  const [powerTap, setPowerTap] = useState(true);
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [fakePin, setFakePin] = useState('9999');
  const [isTestActive, setIsTestActive] = useState(false);

  const handleTestSilentTrigger = () => {
    void impact('medium');
    setIsTestActive(true);
    setTimeout(() => {
      setIsTestActive(false);
      alert('Covert SOS trigger verified! In a real emergency, silent alerts will be dispatched immediately without screen feedback.');
    }, 2000);
  };

  return (
    <AppShell topBarProps={{ title: 'Hidden SOS & Triggers', showBack: true }}>
      <div className="px-5 space-y-6 pt-4 pb-12">
        {/* Banner */}
        <Card className="p-5 bg-primary/5 border border-primary/20 flex gap-4 items-start">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Icon name="visibility_off" size={24} />
          </div>
          <div>
            <h2 className="font-jakarta font-bold text-title-md text-primary">Covert Emergency Activation</h2>
            <p className="font-inter text-body-sm text-on-surface-variant mt-1">
              Trigger emergency dispatch without audio or visual alarms to avoid escalating hazardous situations.
            </p>
          </div>
        </Card>

        {/* Triggers List */}
        <section className="space-y-3">
          <h3 className="font-jakarta font-semibold text-title-md text-on-surface">Hardware & Gesture Triggers</h3>
          
          <Card className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
                <Icon name="power_settings_new" size={22} />
              </div>
              <div>
                <p className="font-jakarta font-semibold text-body-md text-on-surface">5x Power Button Press</p>
                <p className="font-inter text-label-sm text-on-surface-variant">Rapidly press hardware power button 5 times</p>
              </div>
            </div>
            <Toggle checked={powerTap} onChange={(val) => { impact('light'); setPowerTap(val); }} />
          </Card>

          <Card className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
                <Icon name="vibration" size={22} />
              </div>
              <div>
                <p className="font-jakarta font-semibold text-body-md text-on-surface">Shake Device Trigger</p>
                <p className="font-inter text-label-sm text-on-surface-variant">Shake phone vigorously 3 times to dispatch</p>
              </div>
            </div>
            <Toggle checked={shakeTrigger} onChange={(val) => { impact('light'); setShakeTrigger(val); }} />
          </Card>

          <Card className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
                <Icon name="volume_off" size={22} />
              </div>
              <div>
                <p className="font-jakarta font-semibold text-body-md text-on-surface">Silent Mode Dispatch</p>
                <p className="font-inter text-label-sm text-on-surface-variant">Suppress all screen animations & sound during SOS</p>
              </div>
            </div>
            <Toggle checked={silentMode} onChange={(val) => { impact('light'); setSilentMode(val); }} />
          </Card>
        </section>

        {/* Fake PIN Protection */}
        <section className="space-y-3">
          <h3 className="font-jakarta font-semibold text-title-md text-on-surface">Decoy PIN Protection</h3>
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-jakarta font-semibold text-body-md text-on-surface">Emergency Decoy PIN</span>
              <Chip size="sm" color="secondary">Active</Chip>
            </div>
            <p className="font-inter text-body-sm text-on-surface-variant">
              If coerced to unlock your app, enter this PIN. SAFORA will open in a simulated normal state while secretly broadcasting emergency location and recording audio.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <input
                type="password"
                maxLength={4}
                value={fakePin}
                onChange={(e) => setFakePin(e.target.value)}
                className="w-24 px-3 py-2 bg-surface-container rounded-lg font-jakarta font-bold tracking-widest text-center text-body-lg text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
              />
              <span className="font-inter text-label-sm text-outline">4-digit PIN code</span>
            </div>
          </Card>
        </section>

        {/* Test Covert Trigger */}
        <div className="pt-2">
          <button
            onClick={handleTestSilentTrigger}
            disabled={isTestActive}
            className="w-full py-4 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary font-jakarta font-semibold text-body-md transition-colors flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Icon name={isTestActive ? 'sync' : 'bug_report'} className={isTestActive ? 'animate-spin' : ''} size={20} />
            <span>{isTestActive ? 'Testing Covert Dispatch...' : 'Test Covert Trigger Simulation'}</span>
          </button>
        </div>
      </div>

    </AppShell>
  );
}
