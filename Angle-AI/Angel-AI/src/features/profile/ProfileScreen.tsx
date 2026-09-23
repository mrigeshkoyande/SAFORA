import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';
import Chip from '../../components/ui/Chip';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../core/hooks/useApp';
import { useHaptics, usePlatform } from '../../platform';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { state, setAuthenticated } = useApp();
  const { impact } = useHaptics();
  const { platform, isNative } = usePlatform();
  const [biometrics, setBiometrics] = useState(true);
  const [autoRecord, setAutoRecord] = useState(true);
  const [liveLocationSync, setLiveLocationSync] = useState(true);

  const user = state.user || {
    id: 'usr_mock',
    name: 'Elena Rostova',
    phone: '+91 98765 43210',
    email: 'elena.rostova@example.com',
    avatarUrl: '',
  };

  const handleLogout = () => {
    impact('heavy');
    if (confirm('Are you sure you want to log out of SAFORA?')) {
      setAuthenticated(false);
      navigate('/auth');
    }
  };

  return (
    <AppShell topBarProps={{ title: 'Profile & Safety Preferences', showBack: true }}>
      <div className="px-5 space-y-6 pt-4 pb-12 max-w-2xl mx-auto">
        {/* User Card */}
        <Card className="p-6 bg-surface-container-lowest border border-outline-variant/20 shadow-card flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center font-jakarta font-bold text-headline-md text-primary flex-shrink-0">
            {user.name[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-jakarta font-bold text-title-lg text-on-surface">{user.name}</h2>
              <Chip size="sm" color="primary">Protected</Chip>
            </div>
            <p className="font-inter text-body-sm text-on-surface-variant mt-0.5">{user.phone}</p>
            <p className="font-inter text-label-sm text-outline mt-0.5">{user.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => alert('Edit Profile modal opening...')}>
            Edit
          </Button>
        </Card>

        {/* Guardian Circle Management */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-jakarta font-semibold text-title-md text-on-surface">Guardian Circle (3/5)</h3>
            <button
              onClick={() => { impact('light'); alert('Add Guardian Contact dialog opening...'); }}
              className="font-inter text-label-md text-primary font-semibold hover:opacity-80 flex items-center gap-1 cursor-pointer"
            >
              <Icon name="person_add" size={18} />
              <span>Add Contact</span>
            </button>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Margaret Rostova (Mom)', relation: 'Primary Guardian', phone: '+91 98111 22233', status: 'Online' },
              { name: 'Alex Rostov (Brother)', relation: 'Secondary Guardian', phone: '+91 98222 33344', status: 'Online' },
              { name: 'Sara Jenkins (Roommate)', relation: 'Emergency Contact', phone: '+91 98333 44455', status: 'Online' },
            ].map((contact, i) => (
              <Card key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center font-jakarta font-bold text-primary">
                    {contact.name[0]}
                  </div>
                  <div>
                    <p className="font-jakarta font-semibold text-body-md text-on-surface">{contact.name}</p>
                    <p className="font-inter text-label-sm text-on-surface-variant">{contact.relation} • {contact.phone}</p>
                  </div>
                </div>
                <Chip size="sm" color="secondary">{contact.status}</Chip>
              </Card>
            ))}
          </div>
        </section>

        {/* Safety Preferences */}
        <section className="space-y-3">
          <h3 className="font-jakarta font-semibold text-title-md text-on-surface">Safety & App Settings</h3>
          <Card className="divide-y divide-outline-variant/10">
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-jakarta font-semibold text-body-md text-on-surface">Biometric Unlock</p>
                <p className="font-inter text-label-sm text-on-surface-variant">Require FaceID / Fingerprint on app opening</p>
              </div>
              <Toggle checked={biometrics} onChange={(val) => { impact('light'); setBiometrics(val); }} />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-jakarta font-semibold text-body-md text-on-surface">Auto-Record Evidence</p>
                <p className="font-inter text-label-sm text-on-surface-variant">Automatically record audio during Guardian & SOS alerts</p>
              </div>
              <Toggle checked={autoRecord} onChange={(val) => { impact('light'); setAutoRecord(val); }} />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-jakarta font-semibold text-body-md text-on-surface">Background GPS Tracking</p>
                <p className="font-inter text-label-sm text-on-surface-variant">Allow continuous route tracking in Guardian mode</p>
              </div>
              <Toggle checked={liveLocationSync} onChange={(val) => { impact('light'); setLiveLocationSync(val); }} />
            </div>
          </Card>
        </section>

        {/* Device & Platform Info */}
        <section className="space-y-3">
          <h3 className="font-jakarta font-semibold text-title-md text-on-surface">System Status</h3>
          <Card className="p-4 space-y-2 font-inter text-body-sm text-on-surface-variant">
            <div className="flex justify-between">
              <span>Client Platform:</span>
              <span className="font-semibold text-on-surface capitalize">{isNative ? `Native ${platform}` : 'Responsive Web / PWA'}</span>
            </div>
            <div className="flex justify-between">
              <span>Capacitor Core:</span>
              <span className="font-semibold text-on-surface">v7.0.0 (Enterprise Mode)</span>
            </div>
            <div className="flex justify-between">
              <span>Evidence Vault Sync:</span>
              <span className="font-semibold text-green-600">Tamper-Proof AES-256 Active</span>
            </div>
          </Card>
        </section>

        {/* Logout Button */}
        <div className="pt-4">
          <Button variant="outline" size="lg" fullWidth onClick={handleLogout} className="!text-red-600 !border-red-300 hover:!bg-red-50">
            Sign Out of SAFORA
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
