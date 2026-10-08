import { SchemeItem } from '../types';

const SAVED_SCHEMES_KEY = 'farmer_friend_saved_schemes';

export const SCHEMES_LIST: SchemeItem[] = [
  {
    id: 'pm-kisan',
    title: 'PM-KISAN Samman Nidhi',
    titleTa: 'பிஎம்-கிசான் சம்மான் நிதி',
    shortDesc: 'Income support for eligible farmer families.',
    shortDescTa: 'தகுதியான விவசாய குடும்பங்களுக்கு வருமான ஆதரவு.',
    icon: 'cash',
    category: 'Income Support',
    categoryTa: 'வருமான ஆதரவு',
    benefit: '₹6,000 per year directly transferred to bank accounts in 3 equal installments of ₹2,000.',
    benefitTa: 'ஆண்டுக்கு ₹6,000 நிதி மூன்று தவணைகளில் தலா ₹2,000 என நேரடியாக வங்கி கணக்கில் செலுத்தப்படுகிறது.',
    eligibilityCriteria: [
      'Small and marginal farmer families with cultivable landholding',
      'Valid Aadhaar card linked with active bank account',
      'Land revenue records (Patta / Chitta) in farmer’s name',
      'Not a registered institutional landholder or high-income tax payee'
    ],
    eligibilityCriteriaTa: [
      'விவசாய சாகுபடி நிலம் வைத்துள்ள சிறு மற்றும் குறு விவசாய குடும்பங்கள்',
      'வங்கி கணக்குடன் இணைக்கப்பட்ட சரியான ஆதார் அட்டை',
      'விவசாயியின் பெயரில் உள்ள நில ஆவணம் (பட்டா / சிட்டா)',
      'நிறுவன நில உரிமையாளர்கள் மற்றும் வருமான வரி செலுத்துபவர்கள் அல்லாதவர்'
    ],
    requiredDocs: [
      'Aadhaar Card (ஆதார் அட்டை)',
      'Bank Account Passbook (வங்கி கணக்கு புத்தகம்)',
      'Land Revenue Records / Patta-Chitta (பட்டா / சிட்டா)',
      'Active Mobile Number linked to Aadhaar'
    ],
    requiredDocsTa: [
      'ஆதார் அட்டை நகல்',
      'வங்கி சேமிப்பு கணக்கு புத்தக நகல் (IFSC குறியீட்டுடன்)',
      'நில உரிமை ஆவணம் (பட்டா / சிட்டா நகல்)',
      'ஆதாருடன் இணைக்கப்பட்ட அலைபேசி எண்'
    ],
    officialUrl: 'https://pmkisan.gov.in',
    helpline: '155261 / 011-24300606'
  },
  {
    id: 'pmfby',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    titleTa: 'பிரதமர் பயிர் காப்பீட்டு திட்டம்',
    shortDesc: 'Crop-insurance support against crop-loss risk.',
    shortDescTa: 'பயிர் இழப்பு அபாயத்திற்கான காப்பீட்டு ஆதரவு.',
    icon: 'shield',
    category: 'Crop Insurance',
    categoryTa: 'பயிர் காப்பீடு',
    benefit: 'Comprehensive financial compensation against non-preventable natural risks like drought, flood, unseasonal rains, and localized pests.',
    benefitTa: 'வறட்சி, பெருமழை, எதிர்பாராத பருவமழை மற்றும் பூச்சி தாக்குதலால் ஏற்படும் பயிர் சேதங்களுக்கு முழுமையான இழப்பீடு.',
    eligibilityCriteria: [
      'All farmers cultivating notified crops in notified areas (both loanee and non-loanee)',
      'Sharecroppers and tenant farmers with valid cultivation certificates',
      'Enrollment must be completed before the cutoff date for the current crop season'
    ],
    eligibilityCriteriaTa: [
      'அறிவிக்கப்பட்ட பகுதிகளில் அறிவிக்கப்பட்ட பயிர்களை சாகுபடி செய்யும் அனைத்து விவசாயிகள்',
      'சாகுபடி சான்று வைத்துள்ள குத்தகை விவசாயிகள் மற்றும் பங்கு விவசாயிகள்',
      'பருவத்திற்கான கடைசி தேதிக்குள் பதிவு செய்திருக்க வேண்டும்'
    ],
    requiredDocs: [
      'Land Records (Patta / Chitta / Adangal)',
      'Sowing Certificate / VAO Cultivation Certificate (விஏஓ அடங்கல்)',
      'Aadhaar Card',
      'Bank Passbook with bank cancellation cheque'
    ],
    requiredDocsTa: [
      'பட்டா / சிட்டா / விஏஓ அடங்கல் சான்றிதழ்',
      'நடப்பு பருவ பயிர் சாகுபடி விவரம்',
      'ஆதார் அட்டை',
      'வங்கி கணக்கு புத்தகம்'
    ],
    officialUrl: 'https://pmfby.gov.in',
    helpline: '1800-180-1551'
  },
  {
    id: 'soil-health-card',
    title: 'Soil Health Card Scheme',
    titleTa: 'மண் ஆரோக்கிய அட்டை திட்டம்',
    shortDesc: 'Soil testing and nutrient guidance.',
    shortDescTa: 'மண் பரிசோதனை மற்றும் ஊட்டச்சத்து ஆலோசனை.',
    icon: 'soil',
    category: 'Soil Management',
    categoryTa: 'மண் வளம்',
    benefit: 'Issued every 2 years containing nutrient status of 12 vital parameters and customized dosage for optimal fertilizer usage.',
    benefitTa: '2 ஆண்டுகளுக்கு ஒருமுறை 12 முக்கிய ஊட்டச்சத்து அளவுகள் மற்றும் உகந்த உர பரிந்துரைகளுடன் வழங்கப்படும் அட்டை.',
    eligibilityCriteria: [
      'Open to all agricultural landholders across Tamil Nadu',
      'Field soil sample must be collected according to official sampling norms',
      'No minimum or maximum land limit required'
    ],
    eligibilityCriteriaTa: [
      'தமிழ்நாட்டின் அனைத்து விவசாய நில உரிமையாளர்களுக்கும் பொருந்தும்',
      'விதிமுறைகளின்படி மண் மாதிரி சேகரிக்கப்பட்டிருக்க வேண்டும்',
      'குறைந்தபட்ச அல்லது அதிகபட்ச நில வரம்பு தேவையில்லை'
    ],
    requiredDocs: [
      'Farmer Identification / Aadhaar',
      'Survey Number & Field Location Details',
      'Previous crop history note'
    ],
    requiredDocsTa: [
      'விவசாயி அடையாள அட்டை / ஆதார்',
      'புல எண் (Survey Number) மற்றும் நிலத்தின் எல்லை விவரம்',
      'முந்தைய பருவத்தில் பயிரிடப்பட்ட பயிர் விவரம்'
    ],
    officialUrl: 'https://soilhealth.dac.gov.in',
    helpline: '044-28583850'
  },
  {
    id: 'pmksy',
    title: 'PM Krishi Sinchayee Yojana (Micro Irrigation)',
    titleTa: 'பிரதமர் கிரிஷி சிஞ்சாய் திட்டம் (நுண்ணீர்ப் பாசனம்)',
    shortDesc: 'Support for improving irrigation efficiency.',
    shortDescTa: 'நீர்ப்பாசன திறனை மேம்படுத்தும் ஆதரவு.',
    icon: 'water',
    category: 'Irrigation Support',
    categoryTa: 'பாசன வசதி',
    benefit: 'Up to 100% subsidy for small and marginal farmers in Tamil Nadu for installing drip and sprinkler systems.',
    benefitTa: 'சொட்டுநீர் மற்றும் தெளிப்புநீர் பாசனம் அமைக்க சிறு, குறு விவசாயிகளுக்கு 100% வரை அரசு மானியம்.',
    eligibilityCriteria: [
      'Small and marginal farmers owning cultivable agricultural land',
      'Assured water source (well, borewell, or canal) in working condition',
      'Electricity connection or solar pump set for running irrigation unit'
    ],
    eligibilityCriteriaTa: [
      'சொந்த விவசாய நிலம் கொண்டுள்ள சிறு மற்றும் குறு விவசாயிகள்',
      'நிலத்தில் செயல்படும் கிணறு அல்லது ஆழ்துளை கிணறு பாசன நீர் ஆதாரம்',
      'மின் இணைப்பு அல்லது சூரிய மின் பம்ப் செட் வசதி'
    ],
    requiredDocs: [
      'Chitta and Adangal with FMB sketch',
      'Water & Electricity clearance certificate',
      'Aadhaar Card and ration card copy',
      'Small/Marginal Farmer Certificate from Tahsildar'
    ],
    requiredDocsTa: [
      'சிட்டா, அடங்கல் மற்றும் எஃப்பிஎம் வரைபடம்',
      'பாசன நீர் ஆதாரம் மற்றும் மின் இணைப்பு சான்று',
      'ஆதார் மற்றும் குடும்ப அட்டை நகல்',
      'வட்டாட்சியர் வழங்கிய சிறு/குறு விவசாயி சான்றிதழ்'
    ],
    officialUrl: 'https://pmksy.gov.in',
    helpline: '04362-230123'
  },
  {
    id: 'tn-uzhavar-pathukappu',
    title: 'Tamil Nadu Chief Minister’s Farmers Protection Scheme',
    titleTa: 'முதலமைச்சரின் உழவர் பாதுகாப்பு திட்டம்',
    shortDesc: 'Comprehensive social security for farmers and agricultural laborers.',
    shortDescTa: 'விவசாயிகள் மற்றும் விவசாய தொழிலாளர்களுக்கான சமூக பாதுகாப்பு.',
    icon: 'tractor',
    category: 'Social Welfare',
    categoryTa: 'சமூக நலம்',
    benefit: 'Education aid for children, marriage assistance, old age pension, and accidental relief for farmer families.',
    benefitTa: 'விவசாயிகளின் பிள்ளைகளுக்கு கல்வி உதவித்தொகை, திருமண உதவி, முதியோர் ஓய்வூதியம் மற்றும் விபத்து நிவாரணம்.',
    eligibilityCriteria: [
      'Small, marginal farmers or registered agricultural laborers residing in Tamil Nadu',
      'Holding valid Uzhavar Pathukappu Thittam member identity card',
      'Age between 18 and 65 years at time of enrollment'
    ],
    eligibilityCriteriaTa: [
      'தமிழ்நாட்டில் வசிக்கும் சிறு, குறு விவசாயிகள் அல்லது விவசாயத் தொழிலாளர்கள்',
      'உழவர் பாதுகாப்பு திட்ட உறுப்பினர் அட்டை பெற்றிருத்தல்',
      'பதிவு செய்யும் போது 18 முதல் 65 வயதுக்குள் இருத்தல்'
    ],
    requiredDocs: [
      'Uzhavar Pathukappu Identity Card (உழவர் அட்டை)',
      'Aadhaar Card and Family Ration Card',
      'Income Certificate & Village Administrative Officer (VAO) proof'
    ],
    requiredDocsTa: [
      'உழவர் பாதுகாப்பு திட்ட உறுப்பினர் அட்டை',
      'ஆதார் அட்டை மற்றும் குடும்ப அட்டை',
      'வருமான சான்றிதழ் மற்றும் விஏஓ சான்றிதழ்'
    ],
    officialUrl: 'https://tnagrisnet.tn.gov.in',
    helpline: '1800-425-1551'
  }
];

export function getSavedSchemeIds(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_SCHEMES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return ['pm-kisan']; // default demo saved scheme
}

export function toggleSaveScheme(schemeId: string): boolean {
  try {
    const current = getSavedSchemeIds();
    let updated: string[];
    let isSaved: boolean;
    if (current.includes(schemeId)) {
      updated = current.filter((id) => id !== schemeId);
      isSaved = false;
    } else {
      updated = [...current, schemeId];
      isSaved = true;
    }
    localStorage.setItem(SAVED_SCHEMES_KEY, JSON.stringify(updated));
    return isSaved;
  } catch {
    return false;
  }
}
