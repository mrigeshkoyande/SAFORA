import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from '../features/splash/SplashScreen';
import OnboardingScreen from '../features/onboarding/OnboardingScreen';
import AuthScreen from '../features/auth/AuthScreen';
import HomeDashboard from '../features/dashboard/HomeDashboard';
import GuardianModeScreen from '../features/guardian/GuardianModeScreen';
import HiddenSosScreen from '../features/hidden-sos/HiddenSosScreen';
import DummyCallScreen from '../features/dummy-call/DummyCallScreen';
import EscapeCoachScreen from '../features/escape-coach/EscapeCoachScreen';
import EvidenceVaultScreen from '../features/vault/EvidenceVaultScreen';
import SelfDefenceScreen from '../features/self-defence/SelfDefenceScreen';
import SafetyMapScreen from '../features/safety-map/SafetyMapScreen';
import ProfileScreen from '../features/profile/ProfileScreen';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/onboarding" element={<OnboardingScreen />} />
      <Route path="/onboarding/:step" element={<OnboardingScreen />} />
      <Route path="/auth" element={<AuthScreen />} />
      <Route path="/home" element={<HomeDashboard />} />
      <Route path="/guardian" element={<GuardianModeScreen />} />
      <Route path="/hidden-sos" element={<HiddenSosScreen />} />
      <Route path="/dummy-call" element={<DummyCallScreen />} />
      <Route path="/escape-coach" element={<EscapeCoachScreen />} />
      <Route path="/evidence-vault" element={<EvidenceVaultScreen />} />
      <Route path="/self-defence" element={<SelfDefenceScreen />} />
      <Route path="/safety-map" element={<SafetyMapScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
