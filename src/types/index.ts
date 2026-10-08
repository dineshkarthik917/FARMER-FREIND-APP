export type Language = 'ta' | 'en';

export interface FarmerProfile {
  id: string;
  name: string;
  village: string;
  state: string;
  district: string;
  preferredCrop: string;
  landSize: string;
  language: Language;
  phone: string;
  loginMode: 'demo' | 'verified';
  lowDataMode: boolean;
  alertPreferences: {
    weather: boolean;
    disease: boolean;
    market: boolean;
  };
}

export interface WeatherData {
  location: string;
  temp: number;
  condition: string;
  conditionTa: string;
  iconName: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  lastUpdated: string;
  isDemo: boolean;
  farmingAlert: string;
  farmingAlertTa: string;
}

export interface MandiPriceItem {
  id: string;
  mandiName: string;
  mandiNameTa: string;
  distanceKm: number;
  pricePerKg: number;
  yesterdayPrice: number;
  baseTransportCost: number;
  updatedAt: string;
}

export interface CropPriceHistory {
  day: string;
  dayTa: string;
  price: number;
  date: string;
}

export interface CropAnalysisResult {
  id: string;
  cropName: string;
  cropNameTa: string;
  possibleCondition: string;
  possibleConditionTa: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  confidence: number;
  symptoms: string;
  symptomsTa: string;
  immediateAdvice: string;
  immediateAdviceTa: string;
  preventionTips: string;
  preventionTipsTa: string;
  imageUri: string;
  analyzedAt: string;
}

export interface FarmAlertItem {
  id: string;
  title: string;
  titleTa: string;
  description: string;
  descriptionTa: string;
  category: 'weather' | 'disease' | 'market' | 'reminder';
  severity: 'high' | 'medium' | 'info';
  timestamp: string;
  isRead: boolean;
  actionRoute?: string;
}

export interface SchemeItem {
  id: string;
  title: string;
  titleTa: string;
  shortDesc: string;
  shortDescTa: string;
  icon: 'cash' | 'shield' | 'soil' | 'water' | 'tractor';
  category: string;
  categoryTa: string;
  benefit: string;
  benefitTa: string;
  eligibilityCriteria: string[];
  eligibilityCriteriaTa: string[];
  requiredDocs: string[];
  requiredDocsTa: string[];
  officialUrl: string;
  helpline: string;
}

export interface ExpertConsultRequest {
  id: string;
  farmerName: string;
  village: string;
  crop: string;
  description: string;
  imageUri?: string;
  phone: string;
  submittedAt: string;
  status: 'pending' | 'reviewing' | 'answered';
}

export interface SellingHistoryRecord {
  id: string;
  crop: string;
  cropTa: string;
  mandi: string;
  mandiTa: string;
  quantityKg: number;
  ratePerKg: number;
  totalIncome: number;
  date: string;
}
