import React, { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Card from '../../components/ui/Card';
import Chip from '../../components/ui/Chip';
import Icon from '../../components/ui/Icon';
import { useHaptics } from '../../platform';

interface SafeHaven {
  id: string;
  name: string;
  type: 'cafe' | 'police' | 'hospital' | 'transit';
  distance: string;
  open247: boolean;
  address: string;
  rating: string;
}

const havens: SafeHaven[] = [
  { id: '1', name: 'Café Coffee Day (HSR 27th Main)', type: 'cafe', distance: '120m', open247: true, address: 'Sector 2, HSR Layout', rating: '4.8 ★' },
  { id: '2', name: 'HSR Layout Police Station', type: 'police', distance: '450m', open247: true, address: 'Sector 1, Near BDA Complex', rating: 'Official Precinct' },
  { id: '3', name: 'Narayana Multispeciality Hospital', type: 'hospital', distance: '800m', open247: true, address: 'Sector 3, Outer Ring Road', rating: 'Emergency ER' },
  { id: '4', name: 'Agara Metro Transit Hub', type: 'transit', distance: '1.2km', open247: false, address: 'Agara Flyover Junction', rating: 'Well-lit & Guarded' },
];

export default function SafetyMapScreen() {
  const { impact } = useHaptics();
  const [filter, setFilter] = useState<string>('all');
  const [selectedHaven, setSelectedHaven] = useState<SafeHaven | null>(null);

  const filteredHavens = filter === 'all' ? havens : havens.filter((h) => h.type === filter);

  return (
    <AppShell topBarProps={{ title: 'Community Safety Map', showBack: true }}>
      <div className="flex flex-col h-[calc(100dvh-4rem-5rem)] lg:h-[calc(100dvh-4rem)] relative">
        {/* Map Visualization Simulation */}
        <div className="flex-1 bg-gradient-to-br from-blue-50 via-slate-100 to-amber-50 relative overflow-hidden flex items-center justify-center">
          {/* Simulated Map Grid */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#a33759_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* User Location Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="w-16 h-16 rounded-full bg-primary/20 animate-ping absolute" />
            <div className="w-6 h-6 rounded-full bg-primary border-4 border-white shadow-lg relative z-10" />
            <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded shadow text-[11px] font-inter font-bold text-on-surface mt-1">You are here</span>
          </div>

          {/* Haven Markers */}
          {havens.map((h, i) => {
            const positions = [
              'top-1/3 left-1/3',
              'top-1/4 right-1/4',
              'bottom-1/3 right-1/3',
              'bottom-1/4 left-1/4',
            ];
            return (
              <button
                key={h.id}
                onClick={() => { impact('medium'); setSelectedHaven(h); }}
                className={`absolute ${positions[i]} z-20 flex flex-col items-center group cursor-pointer hover:scale-110 transition-transform`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 border-white ${h.type === 'police' ? 'bg-red-600 text-white' : h.type === 'hospital' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                  <Icon name={h.type === 'police' ? 'local_police' : h.type === 'hospital' ? 'local_hospital' : 'local_cafe'} size={20} />
                </div>
                <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded shadow text-[10px] font-inter font-semibold text-on-surface mt-1 truncate max-w-[120px]">
                  {h.name}
                </span>
              </button>
            );
          })}

          {/* Map Controls */}
          <div className="absolute top-4 left-4 right-4 z-30 flex gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Safe Havens' },
              { id: 'police', label: 'Police Stations' },
              { id: 'cafe', label: '24/7 Cafes' },
              { id: 'hospital', label: 'Hospitals' },
            ].map((f) => (
              <Chip
                key={f.id}
                color={filter === f.id ? 'primary' : 'outline'}
                onClick={() => { impact('light'); setFilter(f.id); }}
                className="bg-white/90 backdrop-blur-md shadow-sm cursor-pointer whitespace-nowrap"
              >
                {f.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Haven Details Sheet or Bottom List */}
        <div className="bg-surface-container-lowest border-t border-outline-variant/20 p-4 shadow-lg z-40 max-h-72 overflow-y-auto">
          <h3 className="font-jakarta font-semibold text-title-md text-on-surface mb-3">
            {selectedHaven ? 'Selected Haven Details' : `Nearby Safe Havens (${filteredHavens.length})`}
          </h3>

          {selectedHaven ? (
            <Card className="p-4 bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-jakarta font-bold text-title-lg text-primary">{selectedHaven.name}</h4>
                  <p className="font-inter text-body-sm text-on-surface-variant">{selectedHaven.address}</p>
                </div>
                <button
                  onClick={() => setSelectedHaven(null)}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>
              <div className="flex gap-2 items-center">
                <Chip size="sm" color="primary">{selectedHaven.distance} away</Chip>
                {selectedHaven.open247 && <Chip size="sm" color="secondary">Open 24/7</Chip>}
                <Chip size="sm" color="outline">{selectedHaven.rating}</Chip>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => alert(`Navigating to ${selectedHaven.name}...`)}
                  className="flex-1 bg-primary text-white py-2.5 rounded-xl font-jakarta font-semibold text-label-md flex items-center justify-center gap-2 shadow hover:opacity-90"
                >
                  <Icon name="directions" size={18} />
                  <span>Start Live Guidance</span>
                </button>
                <button
                  onClick={() => alert('Dispatch alerted and safe haven notified of your arrival.')}
                  className="px-4 bg-secondary-container text-on-secondary-container py-2.5 rounded-xl font-jakarta font-semibold text-label-md hover:opacity-90"
                >
                  Notify Haven
                </button>
              </div>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredHavens.map((h) => (
                <Card
                  key={h.id}
                  onClick={() => { impact('light'); setSelectedHaven(h); }}
                  className="p-3 flex items-center justify-between hover:bg-surface-container/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                      <Icon name={h.type === 'police' ? 'local_police' : h.type === 'hospital' ? 'local_hospital' : 'local_cafe'} size={20} />
                    </div>
                    <div>
                      <p className="font-jakarta font-semibold text-body-md text-on-surface">{h.name}</p>
                      <p className="font-inter text-label-sm text-on-surface-variant">{h.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-jakarta font-bold text-label-md text-primary">{h.distance}</span>
                    <span className="font-inter text-[10px] text-green-600 font-semibold">{h.open247 ? '24/7' : 'Open'}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
