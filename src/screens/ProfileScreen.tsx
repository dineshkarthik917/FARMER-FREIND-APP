import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  Smartphone,
  Languages,
  ShieldCheck,
  Bookmark,
  FileText,
  LogOut,
  Edit2,
  Check,
  Zap,
  Bell,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getT } from '../i18n/translations';
import { getSavedCropReports } from '../services/cropDoctorService';
import { SCHEMES_LIST } from '../services/schemesService';
import { SellingHistoryRecord } from '../types';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    farmer,
    updateFarmer,
    language,
    toggleLanguage,
    savedSchemeIds,
    logout,
    showToast
  } = useApp();
  const t = getT(language);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(farmer.name);
  const [village, setVillage] = useState(farmer.village);
  const [preferredCrop, setPreferredCrop] = useState(farmer.preferredCrop);
  const [landSize, setLandSize] = useState(farmer.landSize);

  // Active Tab: Reports, Schemes, Selling History
  const [activeTab, setActiveTab] = useState<'reports' | 'schemes' | 'history'>('reports');

  // Saved reports
  const savedReports = getSavedCropReports();

  // Saved schemes
  const savedSchemes = SCHEMES_LIST.filter((s) => savedSchemeIds.includes(s.id));

  // Demo selling history
  const demoHistory: SellingHistoryRecord[] = [
    {
      id: 'sell_1',
      crop: 'Tomato',
      cropTa: 'தக்காளி',
      mandi: 'Nearby City Mandi',
      mandiTa: 'அருகிலுள்ள நகர சந்தை',
      quantityKg: 500,
      ratePerKg: 24,
      totalIncome: 11350,
      date: '05 Oct 2026'
    },
    {
      id: 'sell_2',
      crop: 'Paddy',
      cropTa: 'நெல்',
      mandi: 'District Mandi',
      mandiTa: 'மாவட்ட மொத்த சந்தை',
      quantityKg: 1000,
      ratePerKg: 24,
      totalIncome: 23550,
      date: '24 Sep 2026'
    }
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateFarmer({
      name,
      village,
      preferredCrop,
      landSize
    });
    setIsEditing(false);
    showToast(
      language === 'ta' ? 'விவரங்கள் புதுப்பிக்கப்பட்டன!' : 'Profile updated successfully!',
      'success'
    );
  };

  const handleToggleLowData = () => {
    const next = !farmer.lowDataMode;
    updateFarmer({ lowDataMode: next });
    showToast(
      next
        ? language === 'ta'
          ? 'குறைந்த இணைய பயன்முறை இயக்கப்பட்டது'
          : 'Low-Data Mode enabled'
        : language === 'ta'
        ? 'இயல்பு பயன்முறை இயக்கப்பட்டது'
        : 'Standard mode restored',
      'info'
    );
  };

  const handleLogout = async () => {
    await logout();
    showToast(
      language === 'ta' ? 'வெற்றிகரமாக வெளியேறியது' : 'Logged out',
      'info'
    );
    navigate('/login');
  };

  // Mask phone number for security, e.g. +91 ******1234
  const phoneDigits = farmer.phone.replace(/\D/g, '');
  const last4 = phoneDigits.slice(-4) || '1234';
  const maskedPhone = `+91 ******${last4}`;

  return (
    <div className="space-y-4 pb-24">
      {/* Title */}
      <div className="px-1 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1F2937]">
          {t.profileTitle}
        </h1>
        <button
          onClick={handleLogout}
          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t.logout}</span>
        </button>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200">
        <div className="flex items-start justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-[#1B5E20] text-amber-300 flex items-center justify-center font-black text-xl shadow-xs">
              {farmer.name.slice(0, 1)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1F2937]">
                {farmer.name}
              </h2>
              <div className="flex items-center gap-1 text-xs text-stone-500">
                <MapPin className="w-3 h-3 text-[#2E7D32]" />
                <span>{farmer.village}, {farmer.state}</span>
              </div>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#1B5E20]">
                {farmer.loginMode === 'demo' ? t.demoMode : t.otpVerifiedMode}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? t.close : t.editProfile}</span>
          </button>
        </div>

        {/* Profile Details or Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="mt-4 space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                {t.farmerName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#2E7D32]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                {t.village}
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#2E7D32]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  {t.preferredCropLabel}
                </label>
                <input
                  type="text"
                  value={preferredCrop}
                  onChange={(e) => setPreferredCrop(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#2E7D32]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  {t.landSizeLabel}
                </label>
                <input
                  type="text"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#2E7D32]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{t.saveChanges}</span>
            </button>
          </form>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-stone-50 p-2.5 rounded-xl">
              <span className="text-[10px] font-bold text-stone-400 uppercase block">
                {t.preferredCropLabel}
              </span>
              <span className="font-bold text-stone-800">{farmer.preferredCrop}</span>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl">
              <span className="text-[10px] font-bold text-stone-400 uppercase block">
                {t.landSizeLabel}
              </span>
              <span className="font-bold text-stone-800">{farmer.landSize}</span>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl col-span-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase block">
                  {t.phoneNumber}
                </span>
                <span className="font-bold text-stone-800">{maskedPhone}</span>
              </div>
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            </div>
          </div>
        )}
      </div>

      {/* App & Connectivity Settings */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
          {language === 'ta' ? 'அமைப்புகள் & இணைப்பு' : 'App & Connectivity'}
        </h3>

        {/* Language switch */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-[#2E7D32]" />
            <span className="text-xs font-bold text-stone-800">
              {language === 'ta' ? 'மொழி / Language' : 'Language'}
            </span>
          </div>
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-[#1B5E20] text-xs font-bold transition-colors cursor-pointer"
          >
            {language === 'ta' ? 'English-க்கு மாற' : 'தமிழுக்கு மாற'}
          </button>
        </div>

        {/* Low data mode toggle */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <div>
              <span className="text-xs font-bold text-stone-800 block">
                {t.lowDataModeLabel}
              </span>
              <span className="text-[10px] text-stone-500">
                {t.lowDataModeDesc}
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={farmer.lowDataMode}
            onChange={handleToggleLowData}
            className="w-4 h-4 accent-[#2E7D32] rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Tabs for Saved Data: Reports, Schemes, Selling History */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200 space-y-3">
        {/* Tab Headers */}
        <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 rounded-xl transition-all cursor-pointer text-center truncate px-1 ${
              activeTab === 'reports'
                ? 'bg-white text-[#1B5E20] shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'ta' ? 'பயிர் அறிக்கைகள்' : 'Reports'}
          </button>
          <button
            onClick={() => setActiveTab('schemes')}
            className={`py-2 rounded-xl transition-all cursor-pointer text-center truncate px-1 ${
              activeTab === 'schemes'
                ? 'bg-white text-[#1B5E20] shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'ta' ? 'திட்டங்கள்' : 'Schemes'}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 rounded-xl transition-all cursor-pointer text-center truncate px-1 ${
              activeTab === 'history'
                ? 'bg-white text-[#1B5E20] shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'ta' ? 'விற்பனை' : 'Sales'}
          </button>
        </div>

        {/* Tab 1: Saved Crop Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-2 pt-1">
            {savedReports.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-4">
                {t.noSavedReports}
              </p>
            ) : (
              savedReports.map((report) => (
                <div
                  key={report.id}
                  className="p-3 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-[#1F2937]">
                      {language === 'ta' ? report.cropNameTa : report.cropName}:{' '}
                      {language === 'ta' ? report.possibleConditionTa : report.possibleCondition}
                    </h4>
                    <span className="text-[10px] text-stone-500">
                      {report.analyzedAt} • {t.confidenceScore}: {report.confidence}%
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      report.riskLevel === 'High'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {report.riskLevel}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Saved Schemes */}
        {activeTab === 'schemes' && (
          <div className="space-y-2 pt-1">
            {savedSchemes.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-4">
                {t.noSavedSchemes}
              </p>
            ) : (
              savedSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  onClick={() => navigate(`/scheme/${scheme.id}`)}
                  className="p-3 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-emerald-50/50 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <h4 className="font-bold text-xs text-[#1F2937] truncate">
                      {language === 'ta' ? scheme.titleTa : scheme.title}
                    </h4>
                    <span className="text-[10px] text-stone-500">
                      {language === 'ta' ? scheme.categoryTa : scheme.category}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0" />
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Selling History Summary */}
        {activeTab === 'history' && (
          <div className="space-y-2 pt-1">
            {demoHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-[#1F2937]">
                    {language === 'ta' ? item.cropTa : item.crop} ({item.quantityKg} kg)
                  </h4>
                  <span className="text-[10px] text-stone-500">
                    {language === 'ta' ? item.mandiTa : item.mandi} • {item.date}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-[#1B5E20] block">
                    ₹{item.totalIncome.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    @ ₹{item.ratePerKg}/kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
