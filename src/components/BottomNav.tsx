import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, TrendingUp, Sparkles, Bell, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getT } from '../i18n/translations';

export const BottomNav: React.FC = () => {
  const { language, unreadAlertCount } = useApp();
  const t = getT(language);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      path: '/dashboard',
      label: t.navHome,
      icon: Home
    },
    {
      path: '/market',
      label: t.navMarket,
      icon: TrendingUp
    },
    {
      path: '/crop-doctor',
      label: t.navCropDoctor,
      icon: Sparkles
    },
    {
      path: '/alerts',
      label: t.navAlerts,
      icon: Bell,
      badge: unreadAlertCount
    },
    {
      path: '/profile',
      label: t.navProfile,
      icon: User
    }
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
      role="navigation"
      aria-label="Bottom Navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 px-1 py-1">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === '/dashboard' && location.pathname === '/');
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-[#1B5E20] font-bold scale-102'
                  : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
              style={{ minHeight: '52px' }}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[11px] mt-1 leading-none text-center truncate max-w-full">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
