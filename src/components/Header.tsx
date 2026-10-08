import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MapPin, Mic, Languages, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getT } from '../i18n/translations';
import { CustomLogo } from './CustomLogo';

export const Header: React.FC = () => {
  const { farmer, language, toggleLanguage, unreadAlertCount, setVoiceModalOpen } = useApp();
  const t = getT(language);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs px-4 py-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Left: Logo & Greeting */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
            aria-label="Farmer Friend Dashboard"
          >
            <CustomLogo size={42} />
          </button>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-[#1F2937] leading-tight truncate">
              {t.greeting}, <span className="text-[#1B5E20]">{farmer.name}</span>!
            </h1>
            <div className="flex items-center gap-1 text-xs text-stone-500 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-[#2E7D32] flex-shrink-0" />
              <span className="truncate">{farmer.village}, {farmer.state}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-[#1B5E20] border border-emerald-200 hover:bg-emerald-100 active:scale-95 transition-all cursor-pointer"
            title="Switch Language"
            aria-label="Switch Language"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'EN' : 'தமிழ்'}</span>
          </button>

          {/* Voice Assistant Trigger */}
          <button
            onClick={() => setVoiceModalOpen(true)}
            className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 active:scale-95 transition-all cursor-pointer relative"
            title={t.voiceModalTitle}
            aria-label={t.voiceModalTitle}
          >
            <Mic className="w-4 h-4 text-[#795548]" />
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => navigate('/alerts')}
            className="p-2 rounded-lg bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer relative"
            title={t.navAlerts}
            aria-label={t.navAlerts}
          >
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {/* Profile Avatar */}
          <button
            onClick={() => navigate('/profile')}
            className="p-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 active:scale-95 transition-all cursor-pointer"
            title={t.navProfile}
            aria-label={t.navProfile}
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
