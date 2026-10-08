import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  Bookmark,
  MessageSquare,
  Sparkles,
  Info,
  X,
  FileCheck,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getT } from '../i18n/translations';
import {
  simulateCropDiagnosis,
  saveCropReport,
  saveExpertRequest
} from '../services/cropDoctorService';
import { speechService } from '../services/speechService';
import { CropAnalysisResult } from '../types';

// Embedded sample leaf illustration SVGs as data URIs for instant testing
const SAMPLE_LEAF_IMAGES: Record<string, string> = {
  tomato:
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%232E7D32"/><path d="M150 40 C70 90 70 210 150 260 C230 210 230 90 150 40 Z" fill="%2366BB6A"/><path d="M150 40 L150 260" stroke="%231B5E20" stroke-width="4"/><circle cx="120" cy="120" r="14" fill="%23795548" stroke="%23FBC02D" stroke-width="3"/><circle cx="170" cy="160" r="18" fill="%235D4037" stroke="%23FBC02D" stroke-width="4"/><circle cx="130" cy="200" r="12" fill="%23795548" stroke="%23FBC02D" stroke-width="2"/><text x="150" y="285" fill="%23FFF" font-family="sans-serif" font-size="14" text-anchor="middle" font-weight="bold">Tomato Leaf - Early Blight Signs</text></svg>',
  paddy:
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23388E3C"/><path d="M150 20 C110 80 120 220 150 280 C180 220 190 80 150 20 Z" fill="%2381C784"/><ellipse cx="150" cy="130" rx="12" ry="24" fill="%236D4C41" stroke="%23FFF" stroke-width="2"/><ellipse cx="150" cy="190" rx="10" ry="18" fill="%236D4C41"/><text x="150" y="285" fill="%23FFF" font-family="sans-serif" font-size="14" text-anchor="middle" font-weight="bold">Paddy Leaf - Brown Spot</text></svg>',
  chilli:
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%231B5E20"/><path d="M150 30 Q100 120 120 250 Q160 210 180 120 Z" fill="%23A5D6A7"/><path d="M120 100 Q150 120 130 160" stroke="%233E2723" stroke-width="4"/><text x="150" y="285" fill="%23FFF" font-family="sans-serif" font-size="14" text-anchor="middle" font-weight="bold">Chilli Leaf - Leaf Curl</text></svg>'
};

export const CropDoctorScreen: React.FC = () => {
  const { language, farmer, showToast } = useApp();
  const t = getT(language);

  const [selectedCrop, setSelectedCrop] = useState<string>('tomato');
  const [imageUri, setImageUri] = useState<string | null>(SAMPLE_LEAF_IMAGES.tomato);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<CropAnalysisResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Ask Expert Modal state
  const [showExpertModal, setShowExpertModal] = useState<boolean>(false);
  const [expertIssueDesc, setExpertIssueDesc] = useState<string>('');
  const [isSubmittingExpert, setIsSubmittingExpert] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUri(event.target?.result as string);
        setResult(null); // Reset previous result for new photo
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSampleImage = () => {
    const sample = SAMPLE_LEAF_IMAGES[selectedCrop] || SAMPLE_LEAF_IMAGES.tomato;
    setImageUri(sample);
    setResult(null);
    showToast(
      language === 'ta' ? 'மாதிரி இலை படம் தேர்ந்தெடுக்கப்பட்டது!' : 'Sample leaf loaded!',
      'info'
    );
  };

  const handleAnalyze = async () => {
    if (!imageUri) {
      showToast(
        language === 'ta' ? 'முதலில் ஒரு இலை படத்தை பதிவேற்றவும்!' : 'Please upload or select an image first!',
        'warning'
      );
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const res = await simulateCropDiagnosis(selectedCrop, imageUri);
      setResult(res);
      showToast(
        language === 'ta' ? 'பகுப்பாய்வு முடிவுகள் தயாராக உள்ளன!' : 'Crop risk analysis completed!',
        'success'
      );
    } catch {
      showToast('Error analyzing crop. Please retry.', 'warning');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveReport = () => {
    if (result) {
      saveCropReport(result);
      showToast(t.reportSaved, 'success');
    }
  };

  const handleListenAdvice = async () => {
    if (!result) return;
    setIsSpeaking(true);
    const speechText =
      language === 'ta'
        ? `சாத்தியமான நோய்: ${result.possibleConditionTa}. ஆபத்து நிலை: ${result.riskLevel === 'High' ? 'அதிகம்' : 'நடுத்தரம்'}. அறிவுரை: ${result.immediateAdviceTa}`
        : `Possible condition: ${result.possibleCondition}. Risk level: ${result.riskLevel}. Advice: ${result.immediateAdvice}`;

    try {
      await speechService.speak(speechText, language);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleSubmitExpertRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingExpert(true);

    setTimeout(() => {
      saveExpertRequest({
        id: `expert_${Date.now()}`,
        farmerName: farmer.name,
        village: farmer.village,
        crop: selectedCrop,
        description: expertIssueDesc || 'Early leaf infection guidance required.',
        imageUri: imageUri || undefined,
        phone: farmer.phone,
        submittedAt: new Date().toLocaleDateString(),
        status: 'pending'
      });
      setIsSubmittingExpert(false);
      setShowExpertModal(false);
      setExpertIssueDesc('');
      showToast(t.requestSubmittedMsg, 'success');
    }, 600);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="px-1">
        <h1 className="text-xl font-bold text-[#1F2937]">
          {t.cropDoctorTitle}
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">{t.cropDoctorSubtitle}</p>
      </div>

      {/* Crop Selector Card */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200 space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            {t.selectCropType}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'tomato', en: 'Tomato', ta: 'தக்காளி' },
              { id: 'paddy', en: 'Paddy', ta: 'நெல்' },
              { id: 'chilli', en: 'Chilli', ta: 'மிளகாய்' },
              { id: 'banana', en: 'Banana', ta: 'வாழை' },
              { id: 'cotton', en: 'Cotton', ta: 'பருத்தி' }
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedCrop(c.id);
                  setResult(null);
                  if (SAMPLE_LEAF_IMAGES[c.id]) {
                    setImageUri(SAMPLE_LEAF_IMAGES[c.id]);
                  }
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  selectedCrop === c.id
                    ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {language === 'ta' ? c.ta : c.en}
              </button>
            ))}
          </div>
        </div>

        {/* Upload / Camera Box */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            {t.uploadOrTake}
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />

          {imageUri ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-2">
              <div className="relative w-full h-52 bg-stone-900 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={imageUri}
                  alt="Crop Leaf Preview"
                  className="w-full h-full object-contain"
                />

                {/* Simulated Radar Scanning Laser Animation */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-emerald-950/40 flex flex-col items-center justify-center">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-amber-300 shadow-[0_0_12px_#FBC02D] animate-bounce" />
                    <div className="bg-stone-900/90 text-white px-4 py-2 rounded-xl border border-emerald-500/50 flex items-center gap-2 text-xs font-bold">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>{t.analyzing}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons under preview */}
              <div className="flex items-center justify-between mt-2 px-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'மாற்று படம் எடுக்க' : 'Change Photo'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleUseSampleImage}
                  className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
                >
                  {t.sampleLeafBtn}
                </button>
              </div>
            </div>
          ) : (
            /* Blank Upload Area */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-44 rounded-2xl border-2 border-dashed border-stone-300 hover:border-[#2E7D32] bg-stone-50 hover:bg-emerald-50/30 flex flex-col items-center justify-center p-4 cursor-pointer transition-colors text-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#1B5E20] flex items-center justify-center mb-2">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-stone-700">
                {t.uploadOrTake}
              </p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                {t.uploadHint}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUseSampleImage();
                }}
                className="mt-3 px-3 py-1 rounded-lg bg-amber-100 text-[#795548] font-bold text-xs hover:bg-amber-200"
              >
                {t.sampleLeafBtn}
              </button>
            </div>
          )}
        </div>

        {/* Analyze Crop Button */}
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !imageUri}
          className="w-full py-4 px-6 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-base shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{t.analyzing}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{t.analyzeCropBtn}</span>
            </>
          )}
        </button>
      </div>

      {/* AI SCREENING RESULTS CARD */}
      {result && (
        <div className="bg-white rounded-3xl p-5 shadow-md border border-stone-200 space-y-4 animate-fadeIn">
          {/* Top Result Banner */}
          <div className="flex items-start justify-between pb-3 border-b border-stone-100">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold block">
                {t.possibleCondition}
              </span>
              <h2 className="text-xl font-black text-[#1F2937] mt-0.5">
                {language === 'ta' ? result.possibleConditionTa : result.possibleCondition}
              </h2>
              <span className="text-xs font-semibold text-[#2E7D32]">
                {language === 'ta' ? result.cropNameTa : result.cropName}
              </span>
            </div>

            {/* Risk Badge & Confidence */}
            <div className="text-right flex flex-col items-end">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  result.riskLevel === 'High'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : result.riskLevel === 'Medium'
                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {result.riskLevel === 'High'
                  ? t.highRisk
                  : result.riskLevel === 'Medium'
                  ? t.mediumRisk
                  : t.lowRisk}
              </span>
              <span className="text-[11px] text-stone-500 font-medium mt-1">
                {t.confidenceScore}: <strong className="text-stone-800">{result.confidence}%</strong>
              </span>
            </div>
          </div>

          {/* Visible Symptoms */}
          <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.visibleSymptoms}</span>
            </h3>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              {language === 'ta' ? result.symptomsTa : result.symptoms}
            </p>
          </div>

          {/* Immediate Safe Actions */}
          <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>{t.immediateSafeActions}</span>
            </h3>
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              {language === 'ta' ? result.immediateAdviceTa : result.immediateAdvice}
            </p>
          </div>

          {/* Prevention Tips */}
          <div className="bg-amber-50/70 rounded-2xl p-3.5 border border-amber-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-1">
              <Info className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.preventionTips}</span>
            </h3>
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              {language === 'ta' ? result.preventionTipsTa : result.preventionTips}
            </p>
          </div>

          {/* Mandatory Safety Disclaimer */}
          <div className="bg-stone-100 rounded-2xl p-3 text-[11px] text-stone-600 leading-snug flex items-start gap-2 border border-stone-200">
            <Info className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" />
            <p>{t.cropSafetyDisclaimer}</p>
          </div>

          {/* Action Buttons: Ask Expert, Save Report, Listen */}
          <div className="pt-2 grid grid-cols-3 gap-2">
            <button
              onClick={() => setShowExpertModal(true)}
              className="py-3 px-2 rounded-xl bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-bold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-center">{t.askExpertBtn}</span>
            </button>

            <button
              onClick={handleSaveReport}
              className="py-3 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <Bookmark className="w-4 h-4 text-[#795548]" />
              <span className="text-center">{t.saveReportBtn}</span>
            </button>

            <button
              onClick={handleListenAdvice}
              disabled={isSpeaking}
              className="py-3 px-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <Volume2 className={`w-4 h-4 text-amber-800 ${isSpeaking ? 'animate-bounce' : ''}`} />
              <span className="text-center">
                {isSpeaking ? (language === 'ta' ? 'ஒலிக்கிறது...' : 'Speaking...') : t.listenAdvice}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ASK AN EXPERT MODAL */}
      {showExpertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-4 bg-[#1B5E20] text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>{t.expertFormTitle}</span>
              </h3>
              <button
                onClick={() => setShowExpertModal(false)}
                className="text-white/80 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitExpertRequest} className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    {t.farmerNameLabel}
                  </label>
                  <input
                    type="text"
                    value={farmer.name}
                    readOnly
                    className="w-full py-2 px-3 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    {t.villageLabel}
                  </label>
                  <input
                    type="text"
                    value={farmer.village}
                    readOnly
                    className="w-full py-2 px-3 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  {t.selectCropType}
                </label>
                <input
                  type="text"
                  value={selectedCrop.toUpperCase()}
                  readOnly
                  className="w-full py-2 px-3 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  {t.issueDescLabel}
                </label>
                <textarea
                  rows={3}
                  value={expertIssueDesc}
                  onChange={(e) => setExpertIssueDesc(e.target.value)}
                  placeholder={t.issueDescPlaceholder}
                  className="w-full py-2 px-3 rounded-xl border border-stone-300 focus:border-[#2E7D32] text-xs font-normal text-stone-900 outline-none"
                />
              </div>

              <p className="text-[10px] text-stone-400">
                * {language === 'ta' ? 'மாதிரி முன்மாதிரி கோரிக்கை - உங்கள் விவரங்கள் உள்ளூரில் சேமிக்கப்படும்.' : 'Prototype flow: Consultation request stored locally for demonstration.'}
              </p>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowExpertModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingExpert}
                  className="w-1/2 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs flex items-center justify-center gap-1"
                >
                  {isSubmittingExpert ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>{t.submitRequestBtn}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
