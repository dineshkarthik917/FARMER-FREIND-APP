import React from 'react';
import { WifiOff, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline, farmer, language } = useApp();

  if (isOnline && !farmer.lowDataMode) return null;

  return (
    <div className="bg-amber-100/90 border-b border-amber-300 text-amber-900 text-xs px-3 py-1.5 flex items-center justify-center gap-2">
      {!isOnline ? (
        <>
          <WifiOff className="w-3.5 h-3.5 text-amber-800 flex-shrink-0" />
          <span>
            {language === 'ta'
              ? 'இணைப்பற்ற பயன்முறை — சேமிக்கப்பட்ட ஆஃப்லைன் தரவு காட்டப்படுகிறது.'
              : 'Offline Mode — Showing cached offline data.'}
          </span>
        </>
      ) : (
        <>
          <Database className="w-3.5 h-3.5 text-amber-800 flex-shrink-0" />
          <span>
            {language === 'ta'
              ? 'குறைந்த இணைய பயன்முறை செயலில் உள்ளது.'
              : 'Low-Data Mode active for speed.'}
          </span>
        </>
      )}
    </div>
  );
};
