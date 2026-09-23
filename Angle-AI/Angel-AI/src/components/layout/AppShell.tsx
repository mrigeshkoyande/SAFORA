import React, { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import Icon from '../ui/Icon';
import { useApp } from '../../core/hooks/useApp';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showAvatar?: boolean;
  transparent?: boolean;
}

function TopBar({ title = 'SAFORA', showBack = false, showMenu = true, showAvatar = true, transparent = false }: TopBarProps) {
  const navigate = useNavigate();
  const { state } = useApp();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 lg:left-20 z-50
        flex justify-between items-center
        px-5 h-16
        transition-shadow duration-200
        ${transparent && !scrolled
          ? 'bg-transparent'
          : 'backdrop-blur-glass bg-surface/80'
        }
        ${scrolled ? 'shadow-sm' : ''}
      `}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95"
          >
            <Icon name="arrow_back" size={24} className="text-on-surface" />
          </button>
        ) : showMenu ? (
          <button
            aria-label="Open menu"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95"
          >
            <Icon name="menu" size={24} className="text-primary" />
          </button>
        ) : null}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="SAFORA" className="w-7 h-7 object-contain" />
          <h1 className="font-jakarta font-bold text-title-lg text-primary">{title}</h1>
        </div>
      </div>

      {showAvatar && (
        <button
          onClick={() => navigate('/profile')}
          aria-label="View profile"
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container/30 active:scale-95 transition-transform"
        >
          {state.user?.avatarUrl ? (
            <img
              src={state.user.avatarUrl}
              alt={state.user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary-container/20 flex items-center justify-center">
              <Icon name="person" fill size={20} className="text-primary" />
            </div>
          )}
        </button>
      )}
    </header>
  );
}

interface AppShellProps {
  children: ReactNode;
  topBarProps?: TopBarProps;
  showTopBar?: boolean;
  showNav?: boolean;
  scrollable?: boolean;
}

export default function AppShell({
  children,
  topBarProps,
  showTopBar = true,
  showNav = true,
  scrollable = true,
}: AppShellProps) {
  return (
    <div className="min-h-dvh bg-surface">
      {/* Desktop sidebar */}
      {showNav && (
        <div className="hidden lg:block">
          <Sidebar />
        </div>
      )}

      {/* Top bar */}
      {showTopBar && <TopBar {...topBarProps} />}

      {/* Content */}
      <div
        className={`
          ${showNav ? 'lg:ml-20' : ''}
          ${showTopBar ? 'pt-16' : ''}
          ${showNav ? 'pb-28 lg:pb-8' : ''}
          ${scrollable ? 'min-h-screen' : 'h-screen overflow-hidden'}
        `}
      >
        {children}
      </div>

      {/* Mobile bottom nav */}
      {showNav && (
        <div className="lg:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
