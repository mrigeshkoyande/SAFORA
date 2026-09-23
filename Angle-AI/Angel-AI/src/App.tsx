import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './core/hooks/AppProvider';
import GlobalSOS from './components/sos/GlobalSOS';
import AppRouter from './routes';
import { healthApi } from './core/api';

export default function App() {
  useEffect(() => {
    // Pre-warm the backend server on mount (wakes up free instances like Render/Railway)
    healthApi.ping();
  }, []);

  return (
    <AppProvider>
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <AppRouter />
        <GlobalSOS />
      </BrowserRouter>
    </AppProvider>
  );
}
