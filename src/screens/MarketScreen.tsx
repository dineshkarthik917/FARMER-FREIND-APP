import React, { useState } from 'react';
import {
  TrendingUp,
  Volume2,
  CheckCircle,
  Truck,
  MapPin,
  Sparkles,
  Info,
  Sliders,
  DollarSign
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
import { CROPS_DATA, calculateMandiProfits } from '../services/marketService';
import { speechService } from '../services/speechService';

export const MarketScreen: React.FC = () => {
  const { language, showToast } = useApp();
  const t = getT(language);

  const [selectedCrop, setSelectedCrop] = useState<string>('tomato');
  const [quantityKg, setQuantityKg] = useState<number>(500);
  const [transportAdjustment, setTransportAdjustment] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const currentCrop = CROPS_DATA[selectedCrop] || CROPS_DATA.tomato;
  const calculation = calculateMandiProfits(selectedCrop, quantityKg, transportAdjustment);

  const bestMarket = calculation.bestMarket;
  const delta = calculation.profitDeltaOverLocal;

  // Generate speech recommendation text
  const recommendationSpeech =
    language === 'ta'
      ? `சிறந்த தேர்வு: ${bestMarket.mandiNameTa}. 500 கிலோ தக்காளிக்கு நீங்கள் உள்ளூர் சந்தையை விட சுமார் 1550 ரூபாய் வரை கூடுதல் நிகர லாபம் பெறலாம்.`
      : `Best market choice: ${bestMarket.mandiName}. For ${quantityKg} kg of ${currentCrop.nameEn}, you can earn approximately ₹${delta.toLocaleString()} more net profit than selling locally.`;

  const handleListenResult = async () => {
    setIsSpeaking(true);
    showToast(
      language === 'ta' ? 'முடிவு குரல் வழியே ஒலிக்கிறது...' : 'Playing spoken recommendation...',
      'info'
    );
    try {
      await speechService.speak(recommendationSpeech, language);
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Screen Title & Subtitle */}
      <div className="px-1">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#1F2937]">
            {t.marketComparisonTitle}
          </h1>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
            {t.demoMarketData}
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">{t.marketSubtitle}</p>
      </div>

      {/* Input Form Card */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200 space-y-4">
        {/* Crop Selection */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            {t.selectCrop}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(CROPS_DATA).map((cropKey) => {
              const c = CROPS_DATA[cropKey];
              const isSelected = selectedCrop === cropKey;
              return (
                <button
                  key={cropKey}
                  type="button"
                  onClick={() => setSelectedCrop(cropKey)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {language === 'ta' ? c.nameTa : c.nameEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity in kg (input + slider) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              {t.quantityLabel}
            </label>
            <div className="flex items-baseline gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              <span className="text-base font-extrabold text-[#1B5E20]">
                {quantityKg}
              </span>
              <span className="text-[11px] font-bold text-emerald-800">kg</span>
            </div>
          </div>
          <input
            type="range"
            min="50"
            max="3000"
            step="50"
            value={quantityKg}
            onChange={(e) => setQuantityKg(Number(e.target.value))}
            className="w-full accent-[#2E7D32] h-2 bg-stone-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-semibold">
            <span>50 kg</span>
            <span>500 kg (Default)</span>
            <span>1500 kg</span>
            <span>3000 kg</span>
          </div>
        </div>

        {/* Transport adjustment (optional +/-) */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-stone-600 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.transportCostAdjustment}</span>
            </label>
            <span className="text-xs font-bold text-stone-700">
              {transportAdjustment >= 0 ? `+₹${transportAdjustment}` : `-₹${Math.abs(transportAdjustment)}`}
            </span>
          </div>
          <input
            type="range"
            min="-300"
            max="500"
            step="50"
            value={transportAdjustment}
            onChange={(e) => setTransportAdjustment(Number(e.target.value))}
            className="w-full accent-[#795548] h-1.5 bg-stone-200 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* HIGHLIGHTED BEST MARKET RECOMMENDATION CARD */}
      <div className="bg-gradient-to-br from-emerald-800 to-[#1B5E20] text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-stone-900 text-xs font-black tracking-wide">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>{t.bestChoiceBadge}</span>
          </div>

          {/* Listen Spoken Result Button */}
          <button
            onClick={handleListenResult}
            disabled={isSpeaking}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-xs font-bold text-white transition-all cursor-pointer backdrop-blur-xs"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
            <span>{isSpeaking ? (language === 'ta' ? 'ஒலிக்கிறது...' : 'Speaking...') : t.listenResult}</span>
          </button>
        </div>

        <h2 className="text-xl font-extrabold mt-2">
          {language === 'ta' ? bestMarket.mandiNameTa : bestMarket.mandiName}
        </h2>

        <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
          {selectedCrop === 'tomato' && quantityKg === 500
            ? t.bestMarketRecommendation
            : language === 'ta'
            ? `சிறந்த தேர்வு: ${bestMarket.mandiNameTa}. உள்ளூர் சந்தையை விட சுமார் ₹${delta.toLocaleString()} கூடுதல் நிகர லாபம் பெறலாம்.`
            : `Best choice: ${bestMarket.mandiName}. You can earn approximately ₹${delta.toLocaleString()} more than selling locally.`}
        </p>

        {/* Take-home Net Profit Big Stat */}
        <div className="mt-4 pt-3 border-t border-emerald-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold block">
              {t.netProfit}
            </span>
            <span className="text-3xl font-black text-amber-300">
              ₹{bestMarket.netProfit.toLocaleString()}
            </span>
          </div>

          <div className="text-right text-xs">
            <div className="text-emerald-200">
              <span>{t.grossIncome}: </span>
              <strong className="text-white">₹{bestMarket.grossIncome.toLocaleString()}</strong>
            </div>
            <div className="text-emerald-200 mt-0.5">
              <span>{t.transportCost}: </span>
              <strong className="text-white">₹{bestMarket.transportCost}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* COMPARISON CARDS ACROSS ALL 3 MANDIS */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-[#1F2937] px-1">
          {language === 'ta' ? 'அனைத்து சந்தைகள் ஒப்பீடு' : 'All Mandi Profit Comparison'}
        </h2>

        {calculation.results.map((item) => (
          <div
            key={item.mandiId}
            className={`rounded-2xl p-4 border transition-all ${
              item.isBest
                ? 'bg-emerald-50/80 border-emerald-400 shadow-xs ring-1 ring-emerald-300'
                : 'bg-white border-stone-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#1F2937]">
                    {language === 'ta' ? item.mandiNameTa : item.mandiName}
                  </h3>
                  {item.isBest && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      ★ {language === 'ta' ? 'அதிக லாபம்' : 'Top Profit'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#2E7D32]" />
                    <span>{item.distanceKm} {t.kilometers}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-[#795548]" />
                    <span>{t.transportCost}: ₹{item.transportCost}</span>
                  </span>
                </div>
              </div>

              {/* Price / kg */}
              <div className="text-right">
                <span className="text-xs text-stone-500 block">{t.perKg}</span>
                <span className="text-lg font-extrabold text-[#1B5E20]">
                  ₹{item.pricePerKg}
                </span>
              </div>
            </div>

            {/* Calculations Row */}
            <div className="mt-3 pt-2.5 border-t border-stone-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-stone-50 rounded-xl p-1.5">
                <span className="text-[10px] text-stone-500 block">{t.grossIncome}</span>
                <span className="font-bold text-stone-800">
                  ₹{item.grossIncome.toLocaleString()}
                </span>
              </div>
              <div className="bg-stone-50 rounded-xl p-1.5">
                <span className="text-[10px] text-stone-500 block">{t.transportCost}</span>
                <span className="font-bold text-stone-800">
                  -₹{item.transportCost}
                </span>
              </div>
              <div
                className={`rounded-xl p-1.5 ${
                  item.isBest ? 'bg-emerald-100 text-[#1B5E20]' : 'bg-stone-100 text-stone-800'
                }`}
              >
                <span className="text-[10px] font-bold block">{t.netProfit}</span>
                <span className="font-extrabold text-sm">
                  ₹{item.netProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 7-DAY MANDI TREND CHART */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-[#1F2937]">
            {t.marketTrend7Days} ({language === 'ta' ? currentCrop.nameTa : currentCrop.nameEn})
          </h2>
          <span className="text-xs text-stone-500">{t.demoMarketData}</span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={currentCrop.history}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="marketPriceGradient" x1="0" y1="0" x2="0" y2="1">
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
                  border: 'none'
                }}
                formatter={(value: any) => [`₹${value}/kg`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#2E7D32"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#marketPriceGradient)"
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#1B5E20"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#1B5E20', stroke: '#FFF', strokeWidth: 1.5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
