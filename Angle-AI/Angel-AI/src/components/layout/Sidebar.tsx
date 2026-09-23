import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../ui/Icon';
import { useApp } from '../../core/hooks/useApp';
import type { NavTab } from '../../core/types';

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

export default function Sidebar() {
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
    <aside
      aria-label="Sidebar navigation"
      className="fixed left-0 top-0 bottom-0 w-20 z-40 flex flex-col items-center py-8 pt-20 gap-2 bg-surface-container-lowest border-r border-outline-variant/20 shadow-card"
    >
      {/* Logo mark */}
      <div className="mb-6">
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center p-1.5 overflow-hidden">
          <img src="/logo.png" alt="SAFORA" className="w-full h-full object-contain" />
        </div>
      </div>

      {navItems.map((item) => {
        const isActive = activeTab === item.tab;
        return (
          <button
            key={item.tab}
            onClick={() => handleNav(item)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={`
              flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-2xl
              transition-all duration-200
              ${isActive
                ? 'bg-primary-container/20 text-primary'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
              }
            `}
          >
            <Icon name={item.icon} fill={isActive} size={22} />
            <span className="font-inter text-[10px] font-semibold leading-none">{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
}
