import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, X, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getT } from '../i18n/translations';
import { speechService } from '../services/speechService';

export const VoiceAssistantModal: React.FC = () => {
  const { voiceModalOpen, setVoiceModalOpen, language } = useApp();
  const t = getT(language);
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!voiceModalOpen) {
      speechService.stopListening();
      speechService.stopSpeaking();
      setIsListening(false);
      setIsSpeaking(false);
      setTranscript('');
      setResponseMsg('');
      setErrorMsg('');
    }
  }, [voiceModalOpen]);

  if (!voiceModalOpen) return null;

  const handleStartListening = () => {
    setErrorMsg('');
    setTranscript('');
    setResponseMsg('');

    if (!speechService.isRecognitionSupported) {
      setErrorMsg(t.voiceUnsupported);
      return;
    }

    setIsListening(true);
    const success = speechService.startListening(
      language,
      (text) => {
        setTranscript(text);
        processCommand(text);
      },
      (err) => {
        setIsListening(false);
        setErrorMsg(
          language === 'ta'
            ? 'குரல் உள்ளீடு பதிவு செய்யப்படவில்லை. மீண்டும் முயற்சிக்கவும்.'
            : 'Could not capture voice input. Please try again.'
        );
      },
      () => {
        setIsListening(false);
      }
    );

    if (!success) {
      setIsListening(false);
    }
  };

  const handleStopListening = () => {
    speechService.stopListening();
    setIsListening(false);
  };

  const processCommand = async (command: string) => {
    setIsListening(false);
    const text = command.toLowerCase();

    let reply = '';
    let targetPath: string | null = null;

    if (
      text.includes('தக்காளி') ||
      text.includes('விலை') ||
      text.includes('tomato') ||
      text.includes('price') ||
      text.includes('market') ||
      text.includes('சந்தை')
    ) {
      reply =
        language === 'ta'
          ? 'இன்றைய தக்காளி விலை அருகிலுள்ள நகர சந்தையில் கிலோவுக்கு 24 ரூபாய். உள்ளூரை விட 1550 ரூபாய் வரை கூடுதல் லாபம் கிடைக்கும்!'
          : 'Today’s tomato price is ₹24 per kg at Nearby City Mandi, offering highest net profit.';
      targetPath = '/market';
    } else if (
      text.includes('வானிலை') ||
      text.includes('மழை') ||
      text.includes('weather') ||
      text.includes('rain')
    ) {
      reply =
        language === 'ta'
          ? 'தஞ்சாவூரில் இன்று 31 டிகிரி செல்சியஸ், பகுதி மேகமூட்டம். நாளை மழை வாய்ப்பு உள்ளதால் பயிர்களை கவனமாக பாதுகாக்கவும்.'
          : 'In Thanjavur today: 31 degrees Celsius, partly cloudy. Rain is possible tomorrow; consider harvesting mature crops.';
      targetPath = '/dashboard';
    } else if (
      text.includes('பயிர்') ||
      text.includes('நோய்') ||
      text.includes('மருத்துவர்') ||
      text.includes('crop') ||
      text.includes('scan') ||
      text.includes('disease')
    ) {
      reply =
        language === 'ta'
          ? 'பயிர் மருத்துவரை திறக்கிறேன். உங்கள் இலை புகைப்படத்தை பதிவேற்றி நோயை பரிசோதிக்கவும்.'
          : 'Opening Crop Doctor. Upload a leaf photo to screen for crop disease risks.';
      targetPath = '/crop-doctor';
    } else if (
      text.includes('திட்டம்') ||
      text.includes('அரசு') ||
      text.includes('scheme') ||
      text.includes('kisan') ||
      text.includes('காப்பீடு')
    ) {
      reply =
        language === 'ta'
          ? 'அரசு விவசாய நலத்திட்டங்கள் பக்கத்திற்கு செல்கிறோம். பிஎம்-கிசான் மற்றும் பயிர் காப்பீட்டு விவரங்களை காணலாம்.'
          : 'Showing government agricultural schemes including PM-KISAN Samman Nidhi and PMFBY.';
      targetPath = '/schemes';
    } else {
      reply =
        language === 'ta'
          ? 'நீங்கள் கூறியது பதிவு செய்யப்பட்டது. சந்தை விலை, வானிலை அல்லது பயிர் மருத்துவரை பரிசோதிக்கலாம்.'
          : 'Command recognized. You can check mandi prices, weather alerts, or scan crop disease.';
    }

    setResponseMsg(reply);
    setIsSpeaking(true);

    try {
      await speechService.speak(reply, language);
    } finally {
      setIsSpeaking(false);
      if (targetPath) {
        setTimeout(() => {
          setVoiceModalOpen(false);
          navigate(targetPath!);
        }, 1200);
      }
    }
  };

  const sampleCommands = [
    {
      text: language === 'ta' ? 'தக்காளி விலை என்ன?' : 'What is today’s tomato price?',
      label: language === 'ta' ? '🍅 தக்காளி விலை' : '🍅 Tomato Price'
    },
    {
      text: language === 'ta' ? 'இன்றைய வானிலை என்ன?' : 'Show weather forecast',
      label: language === 'ta' ? '🌤️ வானிலை' : '🌤️ Weather'
    },
    {
      text: language === 'ta' ? 'பயிர் மருத்துவரை திறக்கவும்' : 'Scan my crop',
      label: language === 'ta' ? '🌿 நோய் பரிசோதனை' : '🌿 Crop Scan'
    },
    {
      text: language === 'ta' ? 'அரசு திட்டங்கள் காட்டு' : 'Show government schemes',
      label: language === 'ta' ? '📜 அரசு திட்டங்கள்' : '📜 Schemes'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h2 className="font-bold text-lg">{t.voiceModalTitle}</h2>
          </div>
          <button
            onClick={() => setVoiceModalOpen(false)}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* Mic Button with Animated Pulse */}
          <div className="relative my-4">
            {isListening && (
              <>
                <span className="absolute -inset-4 rounded-full bg-emerald-400 opacity-40 animate-ping" />
                <span className="absolute -inset-2 rounded-full bg-emerald-500 opacity-50 animate-pulse" />
              </>
            )}
            <button
              onClick={isListening ? handleStopListening : handleStartListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white'
              }`}
              aria-label={isListening ? 'Stop Listening' : 'Start Listening'}
            >
              {isListening ? (
                <MicOff className="w-9 h-9" />
              ) : (
                <Mic className="w-9 h-9 text-amber-300" />
              )}
            </button>
          </div>

          {/* Status Text */}
          <p className="font-semibold text-base text-[#1F2937]">
            {isListening
              ? t.voiceListening
              : isSpeaking
              ? t.voiceSpeaking
              : t.voiceTapToSpeak}
          </p>

          {/* Captured transcript */}
          {transcript && (
            <div className="mt-3 w-full bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-[#1B5E20] font-medium text-left">
              <span className="text-xs uppercase text-emerald-800 font-bold block mb-0.5">
                {language === 'ta' ? 'நீங்கள் கூறியது:' : 'You said:'}
              </span>
              "{transcript}"
            </div>
          )}

          {/* Response Msg */}
          {responseMsg && (
            <div className="mt-3 w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm text-[#1F2937] text-left flex items-start gap-2.5">
              <Volume2 className="w-4 h-4 text-[#2E7D32] flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">{responseMsg}</p>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-3 w-full bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}

          {/* Sample quick prompts */}
          <div className="mt-6 w-full text-left">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              {t.voiceCommandHint}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {sampleCommands.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTranscript(cmd.text);
                    processCommand(cmd.text);
                  }}
                  className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/80 hover:bg-emerald-50 hover:border-emerald-300 text-xs font-semibold text-stone-700 hover:text-[#1B5E20] text-left transition-colors cursor-pointer"
                >
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-stone-100 border-t border-stone-200 text-center">
          <button
            onClick={() => setVoiceModalOpen(false)}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium text-sm transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
