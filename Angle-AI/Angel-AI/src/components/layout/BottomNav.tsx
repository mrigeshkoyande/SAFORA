import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../ui/Icon';
import type { NavTab } from '../../core/types';
import { useApp } from '../../core/hooks/useApp';

interface NavItem {
  tab: NavTab;
  route: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { tab: 'home', route: '/home', icon: 'home', label: 'Home' },
  { tab: 'guardian', route: '/guardian', icon: 'shield_with_heart', label: 'Guardian' },
  { tab: 'safety', route: '/hidden-sos', icon: 'security', label: 'Safety' },
  { tab: 'vault', route: '/evidence-vault', icon: 'folder_check', label: 'Vault' },
  { tab: 'profile', route: '/profile', icon: 'person', label: 'Profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setNavTab } = useApp();

  const getActiveTab = (): NavTab => {
    const path = location.pathname;
    if (path.startsWith('/home')) return 'home';
    if (path.startsWith('/guardian')) return 'guardian';
    if (path.startsWith('/hidden-sos') || path.startsWith('/escape-coach') || path.startsWith('/safety-map') || path.startsWith('/dummy-call')) return 'safety';
    if (path.startsWith('/evidence-vault') || path.startsWith('/self-defence')) return 'vault';
    if (path.startsWith('/profile')) return 'profile';
    return 'home';
  };

  const activeTab = getActiveTab();

  const handleNav = (item: NavItem) => {
    setNavTab(item.tab);
    navigate(item.route);
  };

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-4 left-5 right-5 z-50 flex justify-around items-center h-20 px-2 glass-nav rounded-full shadow-nav safe-bottom"
      style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}
    >
      {navItems.map((item) => {
        const isActive = activeTab === item.tab;
        return (
          <button
            key={item.tab}
            onClick={() => handleNav(item)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={`
              flex flex-col items-center justify-center gap-0.5
              transition-all duration-200
              min-w-[48px] min-h-[48px]
              ${isActive
                ? 'bg-primary-container/30 text-on-primary-container rounded-full px-4 py-2 scale-95'
                : 'text-on-surface-variant hover:text-primary hover:bg-primary-container/10 rounded-full p-2'
              }
            `}
          >
            <Icon
              name={item.icon}
              fill={isActive}
              size={24}
              className={isActive ? 'text-primary' : ''}
            />
            <span className="font-inter text-label-sm leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
