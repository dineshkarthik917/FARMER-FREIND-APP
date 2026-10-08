import { CropAnalysisResult, ExpertConsultRequest } from '../types';

const SAVED_REPORTS_KEY = 'farmer_friend_saved_reports';
const EXPERT_REQUESTS_KEY = 'farmer_friend_expert_requests';

export const DEMO_DISEASE_PROFILES: Record<string, Omit<CropAnalysisResult, 'id' | 'analyzedAt' | 'imageUri'>> = {
  tomato: {
    cropName: 'Tomato',
    cropNameTa: 'தக்காளி',
    possibleCondition: 'Early Blight',
    possibleConditionTa: 'ஆரம்ப இலை கருகல் நோய்',
    riskLevel: 'Medium',
    confidence: 78,
    symptoms: 'Brown spots with ring-like concentric patterns and yellowing around leaf margins.',
    symptomsTa: 'இலைகளில் வளைய வடிவ அடர் பழுப்பு புள்ளிகள் மற்றும் இலை விளிம்புகளில் மஞ்சள் நிறமாதல்.',
    immediateAdvice:
      'Inspect nearby plants, remove severely affected lower leaves where appropriate, avoid overhead watering, and consult a local agricultural officer before using any chemical fungicide.',
    immediateAdviceTa:
      'அருகிலுள்ள செடிகளை பரிசோதிக்கவும், பாதிக்கப்பட்ட கீழ் இலைகளை கவனமாக அகற்றவும், இலைகளில் நீர் தெளிப்பதை தவிர்க்கவும், பூஞ்சாணக்கொல்லி பயன்படுத்தும் முன் வேளாண் அலுவலரை அணுகவும்.',
    preventionTips:
      'Ensure adequate plant spacing for airflow, practice crop rotation with non-solanaceous crops, and mulch soil to prevent fungal spores from splashing onto foliage.',
    preventionTipsTa:
      'செடிகளுக்கு இடையே போதிய இடைவெளி விடவும், பயிர் சுழற்சி முறையை பின்பற்றவும், மண்ணில் நீர் தெறிப்பதைத் தடுக்க வைக்கோல் மூடாக்கு இடவும்.'
  },
  paddy: {
    cropName: 'Paddy',
    cropNameTa: 'நெல்',
    possibleCondition: 'Brown Spot',
    possibleConditionTa: 'பழுப்பு புள்ளி நோய்',
    riskLevel: 'Medium',
    confidence: 74,
    symptoms: 'Oval to circular brown lesions on leaves with gray or whitish center.',
    symptomsTa: 'நெல் இலைகளில் நீள்வட்ட அல்லது வட்ட வடிவ பழுப்பு நிற புள்ளிகள் மற்றும் சாம்பல் நிற மையம்.',
    immediateAdvice:
      'Monitor field spread across adjacent plots and seek certified agricultural extension guidance for nutrient management.',
    immediateAdviceTa:
      'வயலில் நோய் பரவலை தொடர்ந்து கண்காணிக்கவும் மற்றும் ஊட்டச்சத்து மேலாண்மைக்கு உள்ளூர் வேளாண் விரிவாக்க மையத்தை அணுகவும்.',
    preventionTips:
      'Use certified disease-free treated seeds, maintain balanced potash and zinc nutrition, and avoid excessive nitrogen fertilizer.',
    preventionTipsTa:
      'சான்றுபெற்ற விதை நேர்த்தி செய்த விதைகளை பயன்படுத்தவும், சாம்பல் சத்து (பொட்டாஷ்) மற்றும் துத்தநாக ஊட்டச்சத்தை சமநிலையில் வழங்கவும்.'
  },
  chilli: {
    cropName: 'Chilli',
    cropNameTa: 'மிளகாய்',
    possibleCondition: 'Leaf Curl',
    possibleConditionTa: 'இலை சுருட்டை நோய்',
    riskLevel: 'High',
    confidence: 84,
    symptoms: 'Severe upward curling, crinkling and stunting of leaves, thickened veins.',
    symptomsTa: 'இலைகள் மேல்நோக்கி சுருண்டு கூடுதல் தடிமனாதல், நரம்புகள் தடித்தல் மற்றும் செடியின் வளர்ச்சி குன்றுதல்.',
    immediateAdvice:
      'Isolate or rogue out severely affected plants if practical, and contact an agriculture expert promptly to identify vector pressure.',
    immediateAdviceTa:
      'கடுமையாக பாதிக்கப்பட்ட செடிகளை வயலில் இருந்து அப்புறப்படுத்தவும், வெள்ளை ஈ அல்லது பூச்சிகளைக் கட்டுப்படுத்த உடனடியாக வேளாண் வல்லுநரை அணுகவும்.',
    preventionTips:
      'Install yellow sticky traps (12 per acre) to monitor vector insects early, use barrier crops like maize/sorghum on border.',
    preventionTipsTa:
      'ஏக்கருக்கு 12 மஞ்சள் நிற ஒட்டும் பொறிகளை வைக்கவும், வயல் வரப்பில் மக்காச்சோளம் போன்ற தடுப்பு பயிர்களை நடவு செய்யவும்.'
  },
  banana: {
    cropName: 'Banana',
    cropNameTa: 'வாழை',
    possibleCondition: 'Sigatoka Leaf Spot',
    possibleConditionTa: 'சிகாடோகா இலைப்புள்ளி நோய்',
    riskLevel: 'Medium',
    confidence: 76,
    symptoms: 'Yellow streaks that mature into elliptical brown spots with sunken dark borders.',
    symptomsTa: 'இலைகளில் மஞ்சள் நிற கோடுகள் தோன்றி பின்னர் நடுவில் உலர்ந்த பழுப்பு நிற புள்ளிகளாக மாறுதல்.',
    immediateAdvice:
      'Prune and destroy heavily infected lower leaves and ensure good field drainage to reduce relative humidity.',
    immediateAdviceTa:
      'முற்றிய பாதிக்கப்பட்ட இலைகளை வெட்டி அப்புறப்படுத்தி அழிக்கவும், பாத்திகளில் தண்ணீர் தேங்காமல் வடிகால் வசதி செய்யவும்.',
    preventionTips:
      'Maintain wide spacing for adequate sunlight, remove suckers regularly, and spray mineral oil or bio-fungicide during monsoon.',
    preventionTipsTa:
      'சூரிய ஒளி நன்கு படும்படி கன்றுகளை கவாத்து செய்யவும், மழைக்காலங்களில் இயற்கை பூஞ்சாண பாதுகாப்பு தெளிப்புகளை மேற்கொள்ளவும்.'
  },
  cotton: {
    cropName: 'Cotton',
    cropNameTa: 'பருத்தி',
    possibleCondition: 'Bacterial Blight',
    possibleConditionTa: 'பாக்டீரியா இலைக்கருகல்',
    riskLevel: 'Medium',
    confidence: 72,
    symptoms: 'Water-soaked angular spots on lower leaf surface bounded by leaf veins.',
    symptomsTa: 'இலை நரம்புகளுக்கு இடையே நீர் ஊறிய கோண வடிவ புள்ளிகள் தோன்றி கருகலாக மாறுதல்.',
    immediateAdvice:
      'Consult agricultural officer for recommended bactericide seed treatments and avoid handling wet plants.',
    immediateAdviceTa:
      'பாக்டீரியா எதிர்ப்பு மருந்துகள் குறித்து வட்டார வேளாண் அலுவலரிடம் ஆலோசனை பெறவும், ஈரமாக உள்ள பயிர்களை கையாள வேண்டாம்.',
    preventionTips:
      'Deep summer ploughing, crop rotation, and use of resistant hybrids suited for Tamil Nadu black soils.',
    preventionTipsTa:
      'கோடை உழவு செய்யவும், பருத்திக்கு பின் தானியப் பயிர்களை சுழற்சியாக பயிரிடவும், நோய் எதிர்ப்பு ரகங்களை தேர்வு செய்யவும்.'
  }
};

export async function simulateCropDiagnosis(
  cropKey: string,
  imageUri: string
): Promise<CropAnalysisResult> {
  // Simulate realistic network/processing delay (1.5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const profile = DEMO_DISEASE_PROFILES[cropKey] || DEMO_DISEASE_PROFILES.tomato;

  return {
    ...profile,
    id: `report_${Date.now()}`,
    analyzedAt: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    imageUri
  };
}

export function saveCropReport(report: CropAnalysisResult) {
  try {
    const existing = getSavedCropReports();
    const updated = [report, ...existing.filter((r) => r.id !== report.id)];
    localStorage.setItem(SAVED_REPORTS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }
}

export function getSavedCropReports(): CropAnalysisResult[] {
  try {
    const raw = localStorage.getItem(SAVED_REPORTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return [];
}

export function saveExpertRequest(request: ExpertConsultRequest) {
  try {
    const raw = localStorage.getItem(EXPERT_REQUESTS_KEY);
    const existing: ExpertConsultRequest[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(EXPERT_REQUESTS_KEY, JSON.stringify([request, ...existing]));
  } catch {
    // Ignore
  }
}

export function getExpertRequests(): ExpertConsultRequest[] {
  try {
    const raw = localStorage.getItem(EXPERT_REQUESTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return [];
}
