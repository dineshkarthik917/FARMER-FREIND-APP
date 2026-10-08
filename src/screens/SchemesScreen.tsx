import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bookmark,
  ChevronRight,
  CreditCard,
  Shield,
  Layers,
  CloudRain,
  Tractor,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getT } from '../i18n/translations';
import { SCHEMES_LIST } from '../services/schemesService';

export const SchemesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { language, savedSchemeIds, toggleSaveSchemeId, showToast } = useApp();
  const t = getT(language);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredSchemes = SCHEMES_LIST.filter((scheme) => {
    const title = language === 'ta' ? scheme.titleTa : scheme.title;
    const desc = language === 'ta' ? scheme.shortDescTa : scheme.shortDesc;
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedFilter === 'saved') return savedSchemeIds.includes(scheme.id);
    return true;
  });

  const handleToggleSave = (e: React.MouseEvent, schemeId: string) => {
    e.stopPropagation();
    const saved = toggleSaveSchemeId(schemeId);
    showToast(
      saved
        ? t.savedSchemeSuccess
        : language === 'ta'
        ? 'திட்டம் நீக்கப்பட்டது'
        : 'Scheme removed from saved',
      'info'
    );
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Title */}
      <div className="px-1">
        <h1 className="text-xl font-bold text-[#1F2937]">
          {t.schemesTitle}
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          {language === 'ta'
            ? 'மத்திய & மாநில அரசின் நிதி மற்றும் பயிர் ஆதரவு திட்டங்கள்'
            : 'Central & State agricultural subsidies and welfare'}
        </p>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="leading-snug">{t.schemeDisclaimer}</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchSchemesPlaceholder}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 bg-white text-xs font-medium text-stone-900 focus:outline-none focus:border-[#2E7D32]"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            selectedFilter === 'all'
              ? 'bg-[#1B5E20] text-white'
              : 'bg-white text-stone-600 border border-stone-200'
          }`}
        >
          {language === 'ta' ? 'அனைத்து திட்டங்கள்' : 'All Schemes'}
        </button>
        <button
          onClick={() => setSelectedFilter('saved')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
            selectedFilter === 'saved'
              ? 'bg-[#1B5E20] text-white'
              : 'bg-white text-stone-600 border border-stone-200'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{language === 'ta' ? 'சேமிக்கப்பட்டவை' : 'Saved'} ({savedSchemeIds.length})</span>
        </button>
      </div>

      {/* Schemes List */}
      <div className="space-y-3">
        {filteredSchemes.map((scheme) => {
          const isSaved = savedSchemeIds.includes(scheme.id);
          const Icon =
            scheme.icon === 'cash'
              ? CreditCard
              : scheme.icon === 'shield'
              ? Shield
              : scheme.icon === 'soil'
              ? Layers
              : scheme.icon === 'water'
              ? CloudRain
              : Tractor;

          return (
            <div
              key={scheme.id}
              onClick={() => navigate(`/scheme/${scheme.id}`)}
              className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200 hover:border-emerald-300 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#1B5E20] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-[#1F2937] leading-snug">
                      {language === 'ta' ? scheme.titleTa : scheme.title}
                    </h3>
                    <button
                      onClick={(e) => handleToggleSave(e, scheme.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer flex-shrink-0 ${
                        isSaved
                          ? 'text-[#795548] bg-amber-50'
                          : 'text-stone-400 hover:text-stone-600'
                      }`}
                      aria-label="Save Scheme"
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {language === 'ta' ? scheme.shortDescTa : scheme.shortDesc}
                  </p>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                      {language === 'ta' ? scheme.categoryTa : scheme.category}
                    </span>
                    <span className="text-xs font-bold text-[#2E7D32] flex items-center gap-1">
                      <span>{t.viewDetails}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
