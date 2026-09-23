import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PlatformProvider } from './platform/index.ts'
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <PlatformProvider>
        <App />
      </PlatformProvider>
    </ErrorBoundary>
  </StrictMode>,
)
