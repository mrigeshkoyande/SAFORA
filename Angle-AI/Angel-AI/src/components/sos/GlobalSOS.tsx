import React, { useCallback, useEffect, useRef, useState } from 'react';
import SOSButton from '../ui/SOSButton';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { useApp } from '../../core/hooks/useApp';
import { sosApi } from '../../core/api';
import { useHaptics } from '../../platform';

type FlowState = 'idle' | 'confirming' | 'activating' | 'active';

export default function GlobalSOS() {
  const { setSosState } = useApp();
  const { impact, notification } = useHaptics();
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [countdown, setCountdown] = useState(3);
  const [alertId, setAlertId] = useState<string | null>(null);
  const activatingRef = useRef(false);

  const activateSOS = useCallback(async () => {
    if (activatingRef.current) return;
    activatingRef.current = true;
    setFlowState('activating');
    setSosState('active');

    try {
      const result = await sosApi.triggerSOS();
      setAlertId(result.alertId);
    } catch {
      setAlertId(`mock_sos_${Date.now()}`);
    } finally {
      activatingRef.current = false;
      setFlowState('active');
      try {
        await notification('success');
      } catch {
        // Best effort only.
      }
    }
  }, [notification, setSosState]);

  useEffect(() => {
    if (flowState !== 'confirming') return undefined;

    setCountdown(3);
    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          void activateSOS();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activateSOS, flowState]);

  const openFlow = async () => {
    try {
      await impact('heavy');
    } catch {
      // Haptics are optional.
    } finally {
      setSosState('countdown');
      setFlowState('confirming');
    }
  };

  const cancelSOS = async () => {
    const idToCancel = alertId;
    setFlowState('idle');
    setCountdown(3);
    setAlertId(null);
    setSosState('cancelled');

    if (!idToCancel) return;
    try {
      await sosApi.cancelSOS(idToCancel);
    } catch {
      // Mock state is already cleared if backend is unavailable.
    }
  };

  const closeActive = () => {
    setFlowState('idle');
    setCountdown(3);
  };

  return (
    <>
      <div className="fixed bottom-28 lg:bottom-8 right-5 z-[60]">
        <SOSButton onActivate={openFlow} />
      </div>

      {flowState !== 'idle' && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/45 px-4 py-6 animate-fade-in">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sos-dialog-title"
            className="w-full max-w-sm rounded-2xl bg-surface-container-lowest shadow-2xl border border-primary/20 p-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center flex-shrink-0">
                <Icon name="sos" fill size={28} />
              </div>
              <div className="min-w-0">
                <h2 id="sos-dialog-title" className="font-jakarta font-bold text-title-lg text-on-surface">
                  {flowState === 'active' ? 'SOS Activated' : 'Activate Emergency SOS'}
                </h2>
                <p className="font-inter text-body-sm text-on-surface-variant mt-1">
                  {flowState === 'confirming'
                    ? `Emergency contacts will be notified in ${countdown}s.`
                    : flowState === 'activating'
                      ? 'Sending emergency alert using the safest available connection...'
                      : 'Emergency alert is active. Mock dispatch is being used until backend dispatch is connected.'}
                </p>
              </div>
            </div>

            {flowState === 'confirming' && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button variant="outline" size="md" onClick={cancelSOS}>
                  Cancel
                </Button>
                <Button variant="danger" size="md" onClick={activateSOS}>
                  Send Now
                </Button>
              </div>
            )}

            {flowState === 'activating' && (
              <div className="mt-5 flex items-center justify-center py-3 text-primary">
                <Icon name="sync" size={28} className="animate-spin" />
              </div>
            )}

            {flowState === 'active' && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button variant="outline" size="md" onClick={closeActive}>
                  Hide
                </Button>
                <Button variant="danger" size="md" onClick={cancelSOS}>
                  Cancel SOS
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
