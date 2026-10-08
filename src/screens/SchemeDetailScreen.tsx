import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  MapPin,
  CheckCircle2,
  FileText,
  HelpCircle,
  PhoneCall,
  Info,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getT } from '../i18n/translations';
import { SCHEMES_LIST } from '../services/schemesService';

export const SchemeDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, savedSchemeIds, toggleSaveSchemeId, showToast, farmer } = useApp();
  const t = getT(language);

  const scheme = SCHEMES_LIST.find((s) => s.id === id) || SCHEMES_LIST[0];
  const isSaved = savedSchemeIds.includes(scheme.id);

  // Eligibility Mock Form State
  const [farmerCategory, setFarmerCategory] = useState<'small' | 'medium' | 'large'>('small');
  const [landOwnership, setLandOwnership] = useState<'own' | 'lease'>('own');
  const [hasAadhaar, setHasAadhaar] = useState<'yes' | 'no'>('yes');
  const [isPhoneVerified, setIsPhoneVerified] = useState<'yes' | 'no'>('yes');
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);

  // Office finder modal
  const [showOfficeModal, setShowOfficeModal] = useState<boolean>(false);

  const handleToggleSave = () => {
    const saved = toggleSaveSchemeId(scheme.id);
    showToast(
      saved
        ? t.savedSchemeSuccess
        : language === 'ta'
        ? 'திட்டம் நீக்கப்பட்டது'
        : 'Scheme removed',
      'info'
    );
  };

  const handleEvaluateEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasAadhaar === 'no') {
      setEligibilityResult(
        language === 'ta'
          ? 'ஆதார் இணைப்பு இத்திட்டத்திற்கு கட்டாயமாகும். அருகில் உள்ள இ-சேவை மையத்தில் ஆதாரை வங்கி கணக்குடன் இணைக்கவும்.'
          : 'Aadhaar seeding is mandatory for this scheme. Please link your Aadhaar at the nearest CSC center.'
      );
    } else {
      setEligibilityResult(
        language === 'ta'
          ? 'வாழ்த்துகள்! நீங்கள் முதற்கட்ட தகுதி வரம்புகளை பூர்த்தி செய்கிறீர்கள். தேவையான ஆவணங்களுடன் வட்டார வேளாண் விரிவாக்க மையத்தை அணுகவும்.'
          : 'Preliminary Eligibility Confirmed! You satisfy primary conditions for this scheme. Visit your local agriculture extension office with required documents.'
      );
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => navigate('/schemes')}
          className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <button
          onClick={handleToggleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            isSaved
              ? 'bg-amber-100 border-amber-300 text-[#795548]'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          <span>{isSaved ? t.alreadySaved : t.saveScheme}</span>
        </button>
      </div>

      {/* Main Scheme Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-800 to-[#1B5E20] text-white rounded-3xl p-5 shadow-sm space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-amber-300 border border-emerald-700/50">
          {language === 'ta' ? scheme.categoryTa : scheme.category}
        </span>
        <h1 className="text-xl font-extrabold leading-snug">
          {language === 'ta' ? scheme.titleTa : scheme.title}
        </h1>
        <p className="text-xs text-emerald-100 leading-relaxed font-medium">
          {language === 'ta' ? scheme.shortDescTa : scheme.shortDesc}
        </p>
      </div>

      {/* Benefits Card */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
          <span>{language === 'ta' ? 'திட்ட பயன் & உதவித் தொகை' : 'Scheme Benefit & Assistance'}</span>
        </h2>
        <p className="text-xs text-stone-800 font-medium leading-relaxed bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100">
          {language === 'ta' ? scheme.benefitTa : scheme.benefit}
        </p>
      </div>

      {/* Required Documents */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-[#795548]" />
          <span>{t.requiredDocuments}</span>
        </h2>
        <ul className="space-y-2">
          {(language === 'ta' ? scheme.requiredDocsTa : scheme.requiredDocs).map((doc, idx) => (
            <li
              key={idx}
              className="text-xs text-stone-700 flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100"
            >
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32] flex-shrink-0 mt-0.5" />
              <span className="font-medium">{doc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mock Eligibility Checker Form */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h2 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#2E7D32]" />
            <span>{t.eligibilityCheckerTitle}</span>
          </h2>
        </div>

        <form onSubmit={handleEvaluateEligibility} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                {t.stateLabel}
              </label>
              <input
                type="text"
                value="Tamil Nadu"
                readOnly
                className="w-full py-2 px-3 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                {t.districtLabel}
              </label>
              <input
                type="text"
                value={farmer.district}
                readOnly
                className="w-full py-2 px-3 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1">
              {t.farmerTypeLabel}
            </label>
            <select
              value={farmerCategory}
              onChange={(e) => setFarmerCategory(e.target.value as any)}
              className="w-full py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 text-xs font-medium text-stone-800"
            >
              <option value="small">{t.smallMarginal}</option>
              <option value="medium">{t.mediumFarmer}</option>
              <option value="large">{t.largeFarmer}</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1">
              {t.landOwnershipLabel}
            </label>
            <select
              value={landOwnership}
              onChange={(e) => setLandOwnership(e.target.value as any)}
              className="w-full py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 text-xs font-medium text-stone-800"
            >
              <option value="own">{t.ownLand}</option>
              <option value="lease">{t.leaseLand}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                {t.aadhaarLinkedLabel}
              </label>
              <select
                value={hasAadhaar}
                onChange={(e) => setHasAadhaar(e.target.value as any)}
                className="w-full py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 text-xs font-medium text-stone-800"
              >
                <option value="yes">{t.yes}</option>
                <option value="no">{t.no}</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                {language === 'ta' ? 'அலைபேசி சரிபார்ப்பு' : 'Mobile Verified'}
              </label>
              <select
                value={isPhoneVerified}
                onChange={(e) => setIsPhoneVerified(e.target.value as any)}
                className="w-full py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 text-xs font-medium text-stone-800"
              >
                <option value="yes">{t.yes}</option>
                <option value="no">{t.no}</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            {t.checkEligibility}
          </button>
        </form>

        {/* Eligibility Checker Evaluation Box */}
        {eligibilityResult && (
          <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-[#1B5E20] flex items-start gap-2.5 font-medium leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32] flex-shrink-0 mt-0.5" />
            <p>{eligibilityResult}</p>
          </div>
        )}
      </div>

      {/* Mandatory Disclaimer */}
      <div className="bg-stone-100 rounded-2xl p-3.5 text-xs text-stone-600 leading-snug flex items-start gap-2 border border-stone-200">
        <Info className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" />
        <p>{t.schemeEligibilityDisclaimer}</p>
      </div>

      {/* External Action Buttons */}
      <div className="space-y-2 pt-1">
        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 rounded-xl bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>{t.openOfficialPortal}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={() => setShowOfficeModal(true)}
          className="w-full py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>{t.findAgriOffice}</span>
        </button>
      </div>

      {/* Office Finder Modal */}
      {showOfficeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-2 text-[#1B5E20]">
              <MapPin className="w-5 h-5" />
              <h3 className="font-bold text-sm">{t.agriOfficeFinderTitle}</h3>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-medium bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
              {t.agriOfficeFinderDesc}
            </p>
            <div className="text-xs text-stone-500 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#795548]" />
              <span>உழவர் உதவி எண் (Toll-Free): 1800-180-1551</span>
            </div>
            <button
              onClick={() => setShowOfficeModal(false)}
              className="w-full py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
