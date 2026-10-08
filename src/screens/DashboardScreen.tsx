import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  RotateCw,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Store,
  Sparkles,
  Bell,
  Mic,
  CreditCard,
  Shield,
  Layers,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { useApp } from '../context/AppContext';
import { getT } from '../i18n/translations';
import { fetchCurrentWeather } from '../services/weatherService';
import { CROPS_DATA } from '../services/marketService';
import { SCHEMES_LIST } from '../services/schemesService';
import { WeatherData } from '../types';

export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { language, farmer, setVoiceModalOpen, showToast } = useApp();
  const t = getT(language);

  // Weather state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isRefreshingWeather, setIsRefreshingWeather] = useState(false);

  // Market Graph state
  const [selectedCrop, setSelectedCrop] = useState<string>('tomato');
  const [selectedMandiId, setSelectedMandiId] = useState<string>('city');

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    setIsRefreshingWeather(true);
    try {
      const data = await fetchCurrentWeather();
      setWeather(data);
    } catch {
      // Fallback handled in service
    } finally {
      setIsRefreshingWeather(false);
    }
  };

  const handleRefreshClick = async () => {
    await loadWeather();
    showToast(
      language === 'ta' ? 'வானிலை தரவு புதுப்பிக்கப்பட்டது!' : 'Weather data refreshed!',
      'info'
    );
  };

  const currentCropData = CROPS_DATA[selectedCrop] || CROPS_DATA.tomato;
  const currentMandi =
    currentCropData.mandis.find((m) => m.id === selectedMandiId) || currentCropData.mandis[1];

  const priceDiff = currentMandi.pricePerKg - currentMandi.yesterdayPrice;

  return (
    <div className="space-y-6 pb-24">
      {/* 1. WEATHER CARD */}
      <section aria-labelledby="weather-heading">
        <div className="bg-gradient-to-br from-emerald-800 to-[#1B5E20] text-white rounded-3xl p-5 shadow-sm border border-emerald-700/50 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-600/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top header row */}
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  {t.weatherTitle}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-amber-300 border border-emerald-600/40">
                  {weather?.isDemo ? t.demoWeatherData : t.liveWeatherData}
                </span>
              </div>
              <p className="text-sm font-semibold text-emerald-100 mt-0.5">
                {weather?.location || `${farmer.village}, ${farmer.state}`}
              </p>
            </div>

            {/* Refresh button */}
            <button
              onClick={handleRefreshClick}
              disabled={isRefreshingWeather}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white cursor-pointer"
              aria-label={t.refresh}
              title={t.refresh}
            >
              <RotateCw
                className={`w-4 h-4 ${isRefreshingWeather ? 'animate-spin' : ''}`}
              />
            </button>
          </div>

          {/* Main Weather Metric */}
          <div className="flex items-center justify-between my-3 relative z-10">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black tracking-tight">
                {weather ? weather.temp : 31}°
              </span>
              <span className="text-xl font-bold text-emerald-200">C</span>
            </div>

            <div className="flex items-center gap-2.5 bg-white/10 px-3 py-2 rounded-2xl backdrop-blur-xs">
              <CloudSun className="w-8 h-8 text-amber-300 flex-shrink-0" />
              <div className="text-right">
                <span className="text-sm font-bold block leading-tight">
                  {language === 'ta'
                    ? weather?.conditionTa || 'பகுதி மேகமூட்டம்'
                    : weather?.condition || 'Partly Cloudy'}
                </span>
                <span className="text-[11px] text-emerald-200">
                  {t.updatedAt} {weather?.lastUpdated || '10:30 AM'}
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Weather Metrics (Humidity, Wind, Rain probability) */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-emerald-700/60 text-center relative z-10">
            <div className="bg-emerald-900/40 rounded-xl py-2 px-1">
              <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-200 font-medium">
                <Droplets className="w-3.5 h-3.5 text-blue-300" />
                <span>{t.humidity}</span>
              </div>
              <p className="text-base font-bold mt-0.5">
                {weather ? weather.humidity : 68}%
              </p>
            </div>

            <div className="bg-emerald-900/40 rounded-xl py-2 px-1">
              <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-200 font-medium">
                <Wind className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.windSpeed}</span>
              </div>
              <p className="text-base font-bold mt-0.5">
                {weather ? weather.windSpeed : 14} <span className="text-xs font-normal">km/h</span>
              </p>
            </div>

            <div className="bg-emerald-900/40 rounded-xl py-2 px-1">
              <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-200 font-medium">
                <CloudRain className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.rainProbability}</span>
              </div>
              <p className="text-base font-bold mt-0.5">
                {weather ? weather.rainChance : 45}%
              </p>
            </div>
          </div>

          {/* Agricultural guidance alert generated from weather conditions */}
          <div className="mt-3 bg-amber-400/20 border border-amber-300/40 rounded-2xl p-3 text-xs flex items-start gap-2.5 relative z-10 text-amber-100">
            <ShieldAlert className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
            <p className="leading-snug font-medium">
              {language === 'ta'
                ? weather?.farmingAlertTa || t.weatherAlertDefault
                : weather?.farmingAlert || t.weatherAlertDefault}
            </p>
          </div>
        </div>
      </section>

      {/* 2. TODAY'S MARKET PRICE GRAPH SECTION */}
      <section aria-labelledby="market-graph-heading">
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="market-graph-heading"
                  className="text-lg font-bold text-[#1F2937]"
                >
                  {t.todayMarketPrice}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                  {t.demoMarketData}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{t.updatedTodayAt}</p>
            </div>
          </div>

          {/* Selectors: Crop & Mandi Dropdowns */}
          <div className="grid grid-cols-2 gap-2 my-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                {t.selectCrop}
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full text-xs font-semibold py-2 px-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:border-[#2E7D32]"
              >
                <option value="tomato">{language === 'ta' ? 'தக்காளி' : 'Tomato'}</option>
                <option value="paddy">{language === 'ta' ? 'நெல்' : 'Paddy'}</option>
                <option value="onion">{language === 'ta' ? 'வெங்காயம்' : 'Onion'}</option>
                <option value="chilli">{language === 'ta' ? 'மிளகாய்' : 'Chilli'}</option>
                <option value="banana">{language === 'ta' ? 'வாழை' : 'Banana'}</option>
                <option value="cotton">{language === 'ta' ? 'பருத்தி' : 'Cotton'}</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                {t.selectMandi}
              </label>
              <select
                value={selectedMandiId}
                onChange={(e) => setSelectedMandiId(e.target.value)}
                className="w-full text-xs font-semibold py-2 px-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:border-[#2E7D32]"
              >
                {currentCropData.mandis.map((m) => (
                  <option key={m.id} value={m.id}>
                    {language === 'ta' ? m.mandiNameTa : m.mandiName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Summary Banner */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 my-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-emerald-800">
                {language === 'ta' ? currentMandi.mandiNameTa : currentMandi.mandiName}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold text-[#1B5E20]">
                  ₹{currentMandi.pricePerKg}
                </span>
                <span className="text-xs font-bold text-emerald-700">/{t.perKg}</span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  priceDiff >= 0
                    ? 'bg-emerald-100 text-[#1B5E20]'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>
                  {priceDiff >= 0
                    ? `+₹${priceDiff} ${language === 'ta' ? 'அதிகம்' : 'increase'}`
                    : `-₹${Math.abs(priceDiff)} ${language === 'ta' ? 'குறைவு' : 'decrease'}`}
                </span>
              </span>
              <p className="text-[10px] text-stone-500 mt-1">
                {language === 'ta'
                  ? `நேற்று: ₹${currentMandi.yesterdayPrice}/கிலோ`
                  : `Yesterday: ₹${currentMandi.yesterdayPrice}/kg`}
              </p>
            </div>
          </div>

          {/* 7-Day Line/Area Chart */}
          <div className="my-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-600">
                {t.marketTrend7Days}
              </span>
              <span className="text-[11px] text-[#2E7D32] font-semibold">
                {language === 'ta' ? currentCropData.nameTa : currentCropData.nameEn}
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={currentCropData.history}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#66BB6A" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey={language === 'ta' ? 'dayTa' : 'day'}
                    stroke="#9CA3AF"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={10}
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: any) => [`₹${value}/kg`, 'Price']}
                    labelFormatter={(label: any) => `${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#2E7D32"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#priceGradient)"
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#1B5E20"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#1B5E20', stroke: '#FFF', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: '#FBC02D', stroke: '#1B5E20', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Actionable Market Recommendation */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">
              {selectedCrop === 'tomato'
                ? t.tomatoRecommendation
                : language === 'ta'
                ? `${currentCropData.nameTa} விலை நல்ல நிலையில் உள்ளது. சந்தை போக்குவரத்து செலவை கணக்கிட்டு விற்பனை செய்யுங்கள்.`
                : `${currentCropData.nameEn} price is stable. Calculate transport to maximize true profit.`}
            </p>
          </div>

          {/* Button: View Market Details */}
          <button
            onClick={() => navigate('/market')}
            className="w-full mt-3 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-98 text-[#1B5E20] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{t.viewMarketDetails}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 3. GOVERNMENT SCHEMES SECTION (Horizontal Scroll) */}
      <section aria-labelledby="schemes-heading">
        <div className="flex items-center justify-between mb-2 px-1">
          <div>
            <h2 id="schemes-heading" className="text-lg font-bold text-[#1F2937]">
              {t.govSchemes}
            </h2>
            <p className="text-[11px] text-stone-500">
              {language === 'ta'
                ? 'விவசாய நல உதவிகள் & மானியங்கள்'
                : 'Subsidies & welfare assistance'}
            </p>
          </div>
          <button
            onClick={() => navigate('/schemes')}
            className="text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] flex items-center gap-0.5 cursor-pointer"
          >
            <span>{t.viewAllSchemes}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Disclaimer Notice */}
        <p className="text-[11px] text-stone-500 bg-stone-100/80 rounded-xl px-3 py-1.5 mb-3 leading-snug">
          ℹ️ {t.schemeDisclaimer}
        </p>

        {/* Horizontal scroll cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4 snap-x">
          {SCHEMES_LIST.slice(0, 4).map((scheme) => {
            const Icon =
              scheme.icon === 'cash'
                ? CreditCard
                : scheme.icon === 'shield'
                ? Shield
                : scheme.icon === 'soil'
                ? Layers
                : CloudRain;

            return (
              <div
                key={scheme.id}
                className="w-68 flex-shrink-0 bg-white rounded-2xl p-4 shadow-xs border border-stone-200 snap-start flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1B5E20] flex items-center justify-center mb-2.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#1F2937] leading-snug line-clamp-1">
                    {language === 'ta' ? scheme.titleTa : scheme.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {language === 'ta' ? scheme.shortDescTa : scheme.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-stone-500 uppercase">
                    {language === 'ta' ? scheme.categoryTa : scheme.category}
                  </span>
                  <button
                    onClick={() => navigate(`/scheme/${scheme.id}`)}
                    className="text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t.viewDetails}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MAIN ACTION CARDS (4 Large Cards) */}
      <section aria-labelledby="main-actions-heading">
        <h2 id="main-actions-heading" className="text-lg font-bold text-[#1F2937] mb-3 px-1">
          {language === 'ta' ? 'முக்கிய சேவைகள்' : 'Quick Actions'}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Check Mandi Prices */}
          <button
            onClick={() => navigate('/market')}
            className="p-4 rounded-2xl bg-white hover:bg-emerald-50/50 border border-stone-200 text-left shadow-xs transition-all active:scale-98 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2.5 group-hover:bg-amber-200 transition-colors">
                <Store className="w-5 h-5 text-[#795548]" />
              </div>
              <h3 className="font-bold text-sm text-[#1F2937] group-hover:text-[#1B5E20] transition-colors">
                {t.actionMandiTitle}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-snug">
                {t.actionMandiDesc}
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#2E7D32] mt-3 flex items-center gap-1">
              <span>{language === 'ta' ? 'விலை சரிபார்க்க' : 'Compare'}</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </button>

          {/* Card 2: Crop Disease Scan */}
          <button
            onClick={() => navigate('/crop-doctor')}
            className="p-4 rounded-2xl bg-white hover:bg-emerald-50/50 border border-stone-200 text-left shadow-xs transition-all active:scale-98 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2.5 group-hover:bg-emerald-200 transition-colors">
                <Sparkles className="w-5 h-5 text-[#1B5E20]" />
              </div>
              <h3 className="font-bold text-sm text-[#1F2937] group-hover:text-[#1B5E20] transition-colors">
                {t.actionCropDoctorTitle}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-snug">
                {t.actionCropDoctorDesc}
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#2E7D32] mt-3 flex items-center gap-1">
              <span>{language === 'ta' ? 'ஸ்கேன் செய்க' : 'Scan Leaf'}</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </button>

          {/* Card 3: Farm Alerts */}
          <button
            onClick={() => navigate('/alerts')}
            className="p-4 rounded-2xl bg-white hover:bg-amber-50/50 border border-stone-200 text-left shadow-xs transition-all active:scale-98 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center mb-2.5 group-hover:bg-orange-200 transition-colors">
                <Bell className="w-5 h-5 text-orange-700" />
              </div>
              <h3 className="font-bold text-sm text-[#1F2937] group-hover:text-orange-900 transition-colors">
                {t.actionAlertsTitle}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-snug">
                {t.actionAlertsDesc}
              </p>
            </div>
            <span className="text-[11px] font-bold text-orange-700 mt-3 flex items-center gap-1">
              <span>{language === 'ta' ? 'அறிவிப்புகள்' : 'View Alerts'}</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </button>

          {/* Card 4: Voice Assistant */}
          <button
            onClick={() => setVoiceModalOpen(true)}
            className="p-4 rounded-2xl bg-white hover:bg-emerald-50/50 border border-stone-200 text-left shadow-xs transition-all active:scale-98 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#795548] flex items-center justify-center mb-2.5 group-hover:bg-amber-200 transition-colors">
                <Mic className="w-5 h-5 text-[#795548]" />
              </div>
              <h3 className="font-bold text-sm text-[#1F2937] group-hover:text-[#1B5E20] transition-colors">
                {t.actionVoiceTitle}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-snug">
                {t.actionVoiceDesc}
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#795548] mt-3 flex items-center gap-1">
              <span>{language === 'ta' ? 'பேசி அறிய' : 'Speak'}</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};
