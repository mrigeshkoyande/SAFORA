import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Chip from '../../components/ui/Chip';
import Icon from '../../components/ui/Icon';
import { useApp } from '../../core/hooks/useApp';
import { locationApi } from '../../core/api';

interface QuickAction {
  icon: string;
  label: string;
  route: string;
  color: string;
  bgColor: string;
  hoverColor: string;
}

const quickActions: QuickAction[] = [
  { icon: 'visibility_off', label: 'Hidden SOS', route: '/hidden-sos', color: 'text-primary', bgColor: 'bg-primary-container/20', hoverColor: 'group-hover:bg-primary group-hover:text-white' },
  { icon: 'shield_with_heart', label: 'Guardian Mode', route: '/guardian', color: 'text-secondary', bgColor: 'bg-secondary-container/20', hoverColor: 'group-hover:bg-secondary group-hover:text-white' },
  { icon: 'call', label: 'Dummy Call', route: '/dummy-call', color: 'text-tertiary', bgColor: 'bg-tertiary-container/20', hoverColor: 'group-hover:bg-tertiary group-hover:text-white' },
  { icon: 'directions_run', label: 'Escape Coach', route: '/escape-coach', color: 'text-outline', bgColor: 'bg-outline-variant/20', hoverColor: 'group-hover:bg-outline group-hover:text-white' },
  { icon: 'folder_check', label: 'Evidence Vault', route: '/evidence-vault', color: 'text-primary', bgColor: 'bg-primary-container/20', hoverColor: 'group-hover:bg-primary group-hover:text-white' },
  { icon: 'sports_martial_arts', label: 'Self Defence', route: '/self-defence', color: 'text-secondary', bgColor: 'bg-secondary-container/20', hoverColor: 'group-hover:bg-secondary group-hover:text-white' },
];

export default function HomeDashboard() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [location, setLocation] = useState('HSR Layout, Sector 2');

  useEffect(() => {
    const loadLocation = async () => {
      try {
        const loc = await locationApi.getCurrentLocation();
        setLocation(loc.address);
      } catch {
        setLocation('Current location unavailable');
      }
    };
    void loadLocation();
  }, []);

  const userName = state.user?.name?.split(' ')[0] ?? 'Elena';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <AppShell>
      <div className="px-5 space-y-5 pt-2 pb-4">
        {/* Greeting */}
        <section className="animate-fade-in">
          <h2 className="font-jakarta font-bold text-headline-lg-mobile text-on-surface">
            {greeting}, {userName} 👋
          </h2>
          <p className="font-jakarta text-body-md text-on-surface-variant/80 mt-0.5">
            You're being looked after.
          </p>
        </section>

        {/* Safety status */}
        <div className="bg-secondary-container/20 rounded-xl p-4 flex items-center justify-between border border-secondary-container/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0">
              <Icon name="location_on" fill size={22} />
            </div>
            <div>
              <p className="font-inter text-label-sm text-on-secondary-container uppercase tracking-wider">Current Location</p>
              <p className="font-jakarta font-bold text-body-md text-on-surface">{location}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full flex-shrink-0">
            <span className="block w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-inter text-label-sm text-primary">Guardian ON</span>
          </div>
        </div>

        {/* Hero card */}
        <section className="relative overflow-hidden bg-surface-container-lowest rounded-lg shadow-card">
          {/* Decorative blob */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center text-center lg:text-left p-6 gap-6">
            <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Icon name="check_circle" fill size={56} weight={700} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-jakarta font-bold text-headline-lg-mobile text-primary mb-1">You're Safe</h3>
              <p className="font-jakarta text-body-md text-on-surface-variant max-w-xs">
                SAFORA is actively monitoring your surroundings and biometrics.
              </p>
              <Chip icon="shield_with_heart" iconFill className="mt-3">Active Protection</Chip>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <h4 className="font-jakarta font-semibold text-title-lg text-on-surface">Quick Actions</h4>
            <button className="font-inter text-label-md text-primary hover:opacity-70 transition-opacity">Edit Grid</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.route}
                onClick={() => navigate(action.route)}
                aria-label={action.label}
                className="bg-surface-container-lowest p-4 rounded-lg shadow-card hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer group text-left"
              >
                <div className={`w-10 h-10 rounded-full ${action.bgColor} flex items-center justify-center ${action.color} mb-3 ${action.hoverColor} transition-colors flex-shrink-0`}>
                  <Icon name={action.icon} size={20} />
                </div>
                <p className="font-inter text-label-md text-on-surface leading-tight">{action.label}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Journey */}
        <section className="bg-surface-container-lowest rounded-lg shadow-card p-5">
          <h4 className="font-jakarta font-semibold text-title-lg text-on-surface mb-4">Recent Journey</h4>
          <div className="relative pl-6 space-y-4 border-l-2 border-primary/10">
            {[
              { label: 'Left Office', meta: '06:45 PM • Whitefield', color: 'bg-primary', active: false },
              { label: 'Metro Transit', meta: '07:15 PM • MG Road Station', color: 'bg-tertiary', active: false },
              { label: 'Walking Home', meta: '08:02 PM • Current', color: 'bg-primary-container', active: true },
            ].map((stop) => (
              <div key={stop.label} className="relative">
                <span className={`absolute -left-[31px] top-1 w-4 h-4 ${stop.color} rounded-full border-4 border-white ${stop.active ? 'animate-pulse' : ''}`} />
                <p className={`font-inter text-label-md ${stop.active ? 'text-primary font-bold' : 'text-on-surface'}`}>{stop.label}</p>
                <p className="font-inter text-label-sm text-on-surface-variant">{stop.meta}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Safety map teaser */}
        <button
          onClick={() => navigate('/safety-map')}
          className="w-full bg-surface-container-lowest rounded-lg shadow-card overflow-hidden hover:scale-[1.01] active:scale-[0.99] transition-transform group"
          aria-label="View nearby safety map"
        >
          <div className="relative h-28 bg-gradient-to-br from-surface-container to-surface-container-high flex items-center justify-center">
            <Icon name="map" size={48} className="text-on-surface-variant/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                <Icon name="near_me" fill size={16} className="text-primary" />
                <span className="font-inter text-label-md text-on-surface">Nearby Safety Map</span>
                <Icon name="chevron_right" size={16} className="text-outline" />
              </div>
            </div>
          </div>
        </button>
      </div>

    </AppShell>
  );
}
