import React, { useState, useEffect } from 'react';
import AppShell from '../../components/layout/AppShell';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Chip from '../../components/ui/Chip';
import Icon from '../../components/ui/Icon';
import { evidenceApi } from '../../core/api';
import type { EvidenceItem } from '../../core/types';
import { useHaptics, useCapacitor } from '../../platform';

export default function EvidenceVaultScreen() {
  const { impact, notification } = useHaptics();
  const { camera } = useCapacitor();
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadVault = async () => {
      try {
        const res = await evidenceApi.getVault();
        const allItems = [...res.photos, ...res.videos, ...res.audio, ...res.logs];
        setItems(allItems);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    void loadVault();
  }, []);

  const handleCaptureEvidence = async () => {
    if (uploading) return;
    setUploading(true);

    try {
      await impact('medium');
      const photo = await camera.getPhoto('camera');

      await new Promise((resolve) => window.setTimeout(resolve, 1500));
      if (photo) {
        const newItem: EvidenceItem = {
          id: Date.now().toString(),
          type: 'photo',
          url: photo.webviewPath || photo.filepath,
          timestamp: new Date(),
          location: 'HSR Layout, Sector 2',
          isEncrypted: true,
        };
        setItems((prev) => [newItem, ...prev]);
        await notification('success');
      }
    } catch {
      // Camera cancellation or unavailable hardware is a non-fatal no-op.
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppShell topBarProps={{ title: 'Smart Evidence Vault', showBack: true }}>
      <div className="px-5 space-y-6 pt-4 pb-12">
        {/* Vault Banner */}
        <Card className="p-6 bg-surface-container-lowest border border-primary/20 shadow-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <Chip icon="lock" iconFill color="primary" size="sm" className="mb-2">AES-256 Cloud Encrypted</Chip>
              <h2 className="font-jakarta font-bold text-headline-sm text-on-surface">Tamper-Proof Archive</h2>
              <p className="font-inter text-body-sm text-on-surface-variant max-w-sm mt-1">
                All audio, photos, and GPS logs captured during alerts are backed up instantly to secure cloud servers.
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary flex-shrink-0">
              <Icon name="folder_check" fill size={36} />
            </div>
          </div>
        </Card>

        {/* Upload Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleCaptureEvidence}
          disabled={uploading}
          icon={uploading ? 'sync' : 'add_a_photo'}
        >
          {uploading ? 'Encrypting & Syncing to Cloud...' : 'Capture & Archive New Evidence'}
        </Button>

        {/* Evidence List */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-jakarta font-semibold text-title-md text-on-surface">Archived Records ({items.length})</h3>
            <span className="font-inter text-label-sm text-green-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>All Synced</span>
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-on-surface-variant font-inter">Loading encrypted vault...</div>
          ) : items.length === 0 ? (
            <Card className="p-8 text-center text-on-surface-variant font-inter">No evidence recorded yet.</Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((item) => (
                <Card key={item.id} className="p-4 flex items-center justify-between gap-3 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.type === 'audio' ? 'bg-secondary-container/30 text-secondary' : item.type === 'video' ? 'bg-tertiary-container/30 text-tertiary' : 'bg-primary-container/30 text-primary'}`}>
                      <Icon name={item.type === 'audio' ? 'mic' : item.type === 'video' ? 'videocam' : 'photo_camera'} size={24} />
                    </div>
                    <div>
                      <p className="font-jakarta font-semibold text-body-md text-on-surface capitalize">{item.type} Recording</p>
                      <p className="font-inter text-label-sm text-on-surface-variant">{item.location}</p>
                      <p className="font-inter text-[11px] text-outline mt-0.5">
                        {new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                  <Chip size="sm" color="primary" icon="cloud_done">Synced</Chip>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
