import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/ui/Icon';
import { authApi } from '../../core/api';
import { useApp } from '../../core/hooks/useApp';

export default function AuthScreen() {
  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useApp();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!phone.trim()) { setError('Please enter your phone number'); return; }
    setError('');
    setLoading(true);
    try {
      const { user } = await authApi.login(phone);
      setUser(user);
      setAuthenticated(true);
      navigate('/home');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const { user } = await authApi.loginWithGoogle();
      setUser(user);
      setAuthenticated(true);
      navigate('/home');
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-surface overflow-hidden">
      {/* Decorative background blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-72 h-72 bg-tertiary-fixed/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-5%] left-[-5%] w-64 h-64 bg-primary-fixed-dim/30 blur-[80px] rounded-full pointer-events-none" />

      {/* Logo header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center items-center h-20 px-5 gap-2.5">
        <img src="/logo.png" alt="SAFORA" className="w-9 h-9 object-contain" />
        <h1 className="font-jakarta font-bold text-headline-lg-mobile text-primary tracking-tight">
          SAFORA
        </h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-5 pt-24 pb-12 relative z-10">
        {/* Welcome copy */}
        <div className="w-full max-w-md text-center mb-10">
          <h2 className="font-jakarta font-bold text-display-lg text-on-surface mb-2 tracking-tight">
            Welcome back
          </h2>
          <p className="font-jakarta text-body-md text-on-surface-variant">
            Your SAFORA safety network is waiting.
          </p>
        </div>

        {/* Form */}
        <div className="w-full max-w-md space-y-5">
          <Input
            id="phone"
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            icon="phone_iphone"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setError(''); }}
            error={error}
            autoComplete="tel"
          />

          <Button
            variant="primary"
            fullWidth
            loading={loading}
            onClick={handleLogin}
            aria-label="Continue with phone number"
          >
            Continue
          </Button>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-outline-variant" />
            <span className="flex-shrink mx-4 font-inter text-label-sm text-outline">or</span>
            <div className="flex-grow border-t border-outline-variant" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full h-14 bg-transparent border border-outline-variant text-on-surface font-inter font-semibold text-label-md rounded-full flex items-center justify-center gap-3 hover:bg-surface-container-low transition-colors active:scale-[0.98] disabled:opacity-50"
            aria-label="Continue with Google"
          >
            <svg height="20" viewBox="0 0 24 24" width="20" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Biometric */}
        <div className="mt-8 flex flex-col items-center">
          <button
            aria-label="Use Face ID or Touch ID for biometric login"
            className="p-4 bg-surface-container rounded-full text-primary hover:bg-surface-container-high transition-colors active:scale-90 duration-200"
          >
            <Icon name="fingerprint" size={40} className="text-primary" />
          </button>
          <p className="mt-2 font-inter text-label-sm text-outline">Use FaceID or TouchID</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-5 pb-10 text-center relative z-10">
        <p className="max-w-xs mx-auto font-inter text-label-sm text-on-surface-variant leading-relaxed">
          By continuing, you agree to SAFORA's{' '}
          <button onClick={(e) => { e.preventDefault(); alert('Terms of Service dialog opening...'); }} className="text-primary hover:underline cursor-pointer">Terms of Service</button>{' '}
          and{' '}
          <button onClick={(e) => { e.preventDefault(); alert('Privacy Policy dialog opening...'); }} className="text-primary hover:underline cursor-pointer">Privacy Policy</button>.
        </p>
      </footer>
    </div>
  );
}
