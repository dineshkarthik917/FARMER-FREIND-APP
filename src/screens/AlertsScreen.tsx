import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CloudRain,
  AlertTriangle,
  TrendingUp,
  CheckCheck,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  Clock,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getT } from '../i18n/translations';
import { speechService } from '../services/speechService';

export const AlertsScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    language,
    alerts,
    markAlertRead,
    markAllAlertsRead,
    farmer,
    updateFarmer,
    showToast
  } = useApp();
  const t = getT(language);

  const [activeCategory, setActiveCategory] = useState<'all' | 'weather' | 'disease' | 'market'>('all');
  const [showPreferences, setShowPreferences] = useState<boolean>(false);

  // Filter alerts based on category and user preferences
  const filteredAlerts = alerts.filter((alert) => {
    if (activeCategory !== 'all' && alert.category !== activeCategory) {
      return false;
    }
    // Check preferences
    if (alert.category === 'weather' && !farmer.alertPreferences.weather) return false;
    if (alert.category === 'disease' && !farmer.alertPreferences.disease) return false;
    if (alert.category === 'market' && !farmer.alertPreferences.market) return false;
    return true;
  });

  const handleTogglePreference = (cat: 'weather' | 'disease' | 'market') => {
    const updated = {
      ...farmer.alertPreferences,
      [cat]: !farmer.alertPreferences[cat]
    };
    updateFarmer({ alertPreferences: updated });
    showToast(
      language === 'ta' ? 'அறிவிப்பு விருப்பம் புதுப்பிக்கப்பட்டது!' : 'Alert preferences updated!',
      'info'
    );
  };

  const handleSpeakAlert = (desc: string) => {
    speechService.speak(desc, language);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Screen Title & Top Actions */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-xl font-bold text-[#1F2937]">
            {t.farmAlertsTitle}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'ta'
              ? 'விவசாய முக்கிய அறிவிப்புகள் & வழிகாட்டல்'
              : 'Timely farming advisories & warnings'}
          </p>
        </div>

        <button
          onClick={() => setShowPreferences(!showPreferences)}
          className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
            showPreferences
              ? 'bg-[#1B5E20] text-white border-[#1B5E20]'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
          aria-label={t.alertPreferencesTitle}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Alert Preferences Panel (Toggleable) */}
      {showPreferences && (
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              {t.alertPreferencesTitle}
            </h2>
            <span className="text-[11px] text-stone-400">
              {language === 'ta' ? 'உள்ளூர் சேமிப்பு' : 'Saved locally'}
            </span>
          </div>

          <div className="space-y-2.5">
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 cursor-pointer">
              <span className="text-xs font-medium text-stone-800">
                {t.notifyWeather}
              </span>
              <input
                type="checkbox"
                checked={farmer.alertPreferences.weather}
                onChange={() => handleTogglePreference('weather')}
                className="w-4 h-4 accent-[#2E7D32] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 cursor-pointer">
              <span className="text-xs font-medium text-stone-800">
                {t.notifyDisease}
              </span>
              <input
                type="checkbox"
                checked={farmer.alertPreferences.disease}
                onChange={() => handleTogglePreference('disease')}
                className="w-4 h-4 accent-[#2E7D32] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 cursor-pointer">
              <span className="text-xs font-medium text-stone-800">
                {t.notifyMarket}
              </span>
              <input
                type="checkbox"
                checked={farmer.alertPreferences.market}
                onChange={() => handleTogglePreference('market')}
                className="w-4 h-4 accent-[#2E7D32] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}

      {/* Category Filter Tabs & Mark All Read */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-2xl">
          {[
            { id: 'all', label: t.allAlerts },
            { id: 'weather', label: t.weatherCategory },
            { id: 'disease', label: t.diseaseCategory },
            { id: 'market', label: t.marketCategory }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-white text-[#1B5E20] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={markAllAlertsRead}
          className="text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] whitespace-nowrap px-2 py-1 flex items-center gap-1 cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>{t.markAllRead}</span>
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200">
            <Bell className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-500">{t.noAlerts}</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isUnread = !alert.isRead;
            const title = language === 'ta' ? alert.titleTa : alert.title;
            const desc = language === 'ta' ? alert.descriptionTa : alert.description;

            const Icon =
              alert.category === 'weather'
                ? CloudRain
                : alert.category === 'disease'
                ? AlertTriangle
                : alert.category === 'market'
                ? TrendingUp
                : ShieldAlert;

            return (
              <div
                key={alert.id}
                onClick={() => {
                  markAlertRead(alert.id);
                  if (alert.actionRoute) navigate(alert.actionRoute);
                }}
                className={`rounded-2xl p-4 border transition-all cursor-pointer relative ${
                  isUnread
                    ? alert.severity === 'high'
                      ? 'bg-red-50/70 border-red-200 shadow-xs ring-1 ring-red-200'
                      : alert.severity === 'medium'
                      ? 'bg-amber-50/70 border-amber-200 shadow-xs ring-1 ring-amber-200'
                      : 'bg-emerald-50/70 border-emerald-200 shadow-xs ring-1 ring-emerald-200'
                    : 'bg-white border-stone-200 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      alert.severity === 'high'
                        ? 'bg-red-100 text-red-700'
                        : alert.severity === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-[#1B5E20]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-[#1F2937] leading-tight flex items-center gap-1.5 truncate">
                        <span>{title}</span>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
                        )}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-stone-400 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 mt-1 leading-relaxed font-medium">
                      {desc}
                    </p>

                    <div className="mt-3 pt-2 border-t border-stone-200/50 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeakAlert(desc);
                        }}
                        className="text-[11px] font-bold text-[#795548] flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{language === 'ta' ? 'கேட்க' : 'Listen'}</span>
                      </button>

                      {alert.actionRoute && (
                        <span className="text-[11px] font-bold text-[#2E7D32] flex items-center gap-0.5">
                          <span>{language === 'ta' ? 'திறக்கவும்' : 'View'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
