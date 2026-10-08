import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomLogo } from '../components/CustomLogo';
import { useApp } from '../context/AppContext';
import { getT } from '../i18n/translations';
import { ArrowRight } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useApp();
  const t = getT(language);

  const [animStage, setAnimStage] = useState<'start' | 'zoom110' | 'rest' | 'pulse'>('start');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Logo animation sequence:
    // 0ms: 70% scale, opacity 0.3
    // 300ms: zoom to 110% scale
    // 800ms: zoom to 100% scale
    // 1300ms: repeating soft pulse
    const t1 = setTimeout(() => setAnimStage('zoom110'), 250);
    const t2 = setTimeout(() => setAnimStage('rest'), 850);
    const t3 = setTimeout(() => setAnimStage('pulse'), 1350);

    // Progress bar animation to 100% over 2.5s
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / 2500) * 100));
      setProgress(pct);
    }, 40);

    // Auto navigate after 2.5s
    const navTimer = setTimeout(() => {
      navigate('/login');
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(navTimer);
      clearInterval(interval);
    };
  }, [navigate]);

  const handleContinue = () => {
    navigate('/login');
  };

  const getLogoStyle = () => {
    switch (animStage) {
      case 'start':
        return 'scale-70 opacity-30 transition-all duration-300 ease-out';
      case 'zoom110':
        return 'scale-110 opacity-100 transition-all duration-500 ease-out';
      case 'rest':
        return 'scale-100 opacity-100 transition-all duration-450 ease-in-out';
      case 'pulse':
        return 'scale-100 opacity-100 animate-pulse';
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center overflow-hidden bg-gradient-to-b from-[#1B5E20] via-[#2E7D32] to-[#FFFDF5] text-white p-6 select-none">
      {/* Background Illustrated Farming Elements (SVG Hills & Crop Fields) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg
          viewBox="0 0 400 800"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          {/* Distant Hills */}
          <path
            d="M0 450 Q100 400 200 430 T400 420 L400 800 L0 800 Z"
            fill="#388E3C"
          />
          {/* Closer Terraced Crop Fields */}
          <path
            d="M0 500 Q150 470 300 510 T400 520 L400 800 L0 800 Z"
            fill="#4CAF50"
          />
          {/* Furrows / Field Rows */}
          <line x1="20" y1="580" x2="380" y2="600" stroke="#FFF" strokeWidth="1.5" strokeDasharray="6,8" />
          <line x1="0" y1="640" x2="400" y2="650" stroke="#FFF" strokeWidth="2" strokeDasharray="10,12" />
          <line x1="0" y1="710" x2="400" y2="705" stroke="#FFF" strokeWidth="2.5" strokeDasharray="14,14" />
        </svg>
      </div>

      {/* Top spacing */}
      <div className="w-full pt-8 flex justify-center z-10">
        <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 font-semibold border border-white/20">
          Smart Agri Platform • தமிழ்நாடு
        </span>
      </div>

      {/* Center: Custom Animated Logo & Titles */}
      <div className="flex flex-col items-center text-center z-10 my-auto">
        {/* Custom Logo Badge with exact specified animation */}
        <div className={`transform ${getLogoStyle()} mb-6`}>
          <CustomLogo size={128} />
        </div>

        {/* App Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
          Farmer Friend
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-300 mt-1 drop-shadow-sm font-['Mukta_Malar']">
          விவசாய நண்பன்
        </h2>

        {/* Slogans */}
        <div className="mt-5 space-y-1 max-w-xs">
          <p className="text-base font-semibold text-emerald-100 drop-shadow-sm">
            “{t.appSlogan}”
          </p>
          <p className="text-xs text-emerald-200/90 font-medium">
            {language === 'ta'
              ? 'Better Prices. Healthier Crops.'
              : 'சிறந்த விலை. ஆரோக்கியமான பயிர்கள்.'}
          </p>
        </div>
      </div>

      {/* Bottom: Progress Bar & Continue Button */}
      <div className="w-full max-w-xs flex flex-col items-center gap-4 pb-8 z-10">
        {/* Progress Bar */}
        <div className="w-full bg-black/25 backdrop-blur-xs rounded-full h-2 overflow-hidden border border-white/20">
          <div
            className="bg-amber-300 h-full rounded-full transition-all duration-75 ease-linear shadow-xs"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Immediate Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-98 text-stone-900 font-bold text-base shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>{t.continue}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
