import React, { createContext, useContext, useState, useEffect } from 'react';
import { FarmerProfile, Language, FarmAlertItem } from '../types';
import { getSavedSchemeIds, toggleSaveScheme } from '../services/schemesService';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  farmer: FarmerProfile;
  updateFarmer: (updated: Partial<FarmerProfile>) => void;
  isAuthenticated: boolean;
  firebaseUser: User | null;
  isFirebaseAvailable: boolean;
  loginAsDemoFarmer: () => void;
  loginWithPhone: (phone: string, uid?: string) => void;
  logout: () => Promise<void>;
  alerts: FarmAlertItem[];
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  unreadAlertCount: number;
  savedSchemeIds: string[];
  toggleSaveSchemeId: (id: string) => boolean;
  isOnline: boolean;
  voiceModalOpen: boolean;
  setVoiceModalOpen: (open: boolean) => void;
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const DEFAULT_DEMO_FARMER: FarmerProfile = {
  id: 'farmer_murugan_01',
  name: 'Murugan',
  village: 'Thanjavur',
  state: 'Tamil Nadu',
  district: 'Thanjavur',
  preferredCrop: 'Tomato',
  landSize: '2 acres',
  language: 'ta',
  phone: '9876543210',
  loginMode: 'demo',
  lowDataMode: false,
  alertPreferences: {
    weather: true,
    disease: true,
    market: true
  }
};

const INITIAL_ALERTS: FarmAlertItem[] = [
  {
    id: 'alert_1',
    title: 'Weather Warning',
    titleTa: 'வானிலை எச்சரிக்கை',
    description: 'Heavy rain expected tomorrow. Consider harvesting mature crops today.',
    descriptionTa: 'நாளை கனமழை பெய்ய வாய்ப்புள்ளது. அறுவடைக்கு தயாரான பயிர்களை இன்று பாதுகாப்பாக சேகரிக்கவும்.',
    category: 'weather',
    severity: 'high',
    timestamp: '1 hour ago',
    isRead: false,
    actionRoute: '/dashboard'
  },
  {
    id: 'alert_2',
    title: 'Crop Fungal Risk Advisory',
    titleTa: 'பூஞ்சை நோய் பரவல் எச்சரிக்கை',
    description: 'High humidity may increase fungal disease risk for tomato crops.',
    descriptionTa: 'அதிக ஈரப்பதம் நிலவுவதால் தக்காளி பயிரில் பூஞ்சை நோய் ஆபத்து அதிகரிக்கலாம்.',
    category: 'disease',
    severity: 'medium',
    timestamp: '3 hours ago',
    isRead: false,
    actionRoute: '/crop-doctor'
  },
  {
    id: 'alert_3',
    title: 'Market Price Surge',
    titleTa: 'சந்தை விலை உயர்வு அறிவிப்பு',
    description: 'Tomato price increased by 12% at Nearby City Mandi (₹24/kg).',
    descriptionTa: 'அருகிலுள்ள நகர சந்தையில் தக்காளி விலை 12% உயர்ந்துள்ளது (₹24/கிலோ).',
    category: 'market',
    severity: 'info',
    timestamp: 'Today, 10:30 AM',
    isRead: false,
    actionRoute: '/market'
  },
  {
    id: 'alert_4',
    title: 'Health Report Follow-up',
    titleTa: 'பயிர் பரிசோதனை நினைவூட்டல்',
    description: 'Follow up on your tomato crop-health report.',
    descriptionTa: 'உங்கள் தக்காளி பயிர்-ஆரோக்கிய அறிக்கையின் நிலை குறித்து தொடர்ந்து கண்காணிக்கவும்.',
    category: 'reminder',
    severity: 'info',
    timestamp: 'Yesterday',
    isRead: true,
    actionRoute: '/crop-doctor'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('farmer_friend_lang');
      if (stored === 'en' || stored === 'ta') return stored;
    } catch {
      // Ignore
    }
    return 'ta'; // Default Tamil as per spec
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('farmer_friend_lang', lang);
      document.documentElement.lang = lang;
    } catch {
      // Ignore
    }
  };

  const toggleLanguage = () => {
    const next = language === 'ta' ? 'en' : 'ta';
    setLanguage(next);
  };

  // 2. Auth & Profile
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('farmer_friend_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [farmer, setFarmer] = useState<FarmerProfile>(() => {
    try {
      const stored = localStorage.getItem('farmer_friend_profile');
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return DEFAULT_DEMO_FARMER;
  });

  const updateFarmer = (updated: Partial<FarmerProfile>) => {
    setFarmer((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('farmer_friend_profile', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  // Firebase Auth state observer to restore verified sessions
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsAuthenticated(true);
        try {
          localStorage.setItem('farmer_friend_auth', 'true');
        } catch {
          // Ignore
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginAsDemoFarmer = () => {
    const demo = { ...DEFAULT_DEMO_FARMER, language };
    setFarmer(demo);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('farmer_friend_auth', 'true');
      localStorage.setItem('farmer_friend_profile', JSON.stringify(demo));
    } catch {
      // Ignore
    }
  };

  const loginWithPhone = (phone: string, uid?: string) => {
    // Mask verified phone number for privacy: +91 ******1234
    const digitsOnly = phone.replace(/\D/g, '').slice(-10);
    const maskedPhone =
      digitsOnly.length === 10
        ? `+91 ******${digitsOnly.slice(-4)}`
        : phone;

    const updated: FarmerProfile = {
      ...farmer,
      id: uid || `farmer_${digitsOnly.slice(-4)}`,
      phone: maskedPhone,
      loginMode: 'verified' as const
    };
    setFarmer(updated);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('farmer_friend_auth', 'true');
      localStorage.setItem('farmer_friend_profile', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setFirebaseUser(null);
    try {
      if (auth) {
        await signOut(auth);
      }
      localStorage.removeItem('farmer_friend_auth');
    } catch {
      // Ignore
    }
  };

  // 3. Alerts
  const [alerts, setAlerts] = useState<FarmAlertItem[]>(() => {
    try {
      const stored = localStorage.getItem('farmer_friend_alerts');
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return INITIAL_ALERTS;
  });

  const markAlertRead = (id: string) => {
    setAlerts((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, isRead: true } : a));
      try {
        localStorage.setItem('farmer_friend_alerts', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const markAllAlertsRead = () => {
    setAlerts((prev) => {
      const next = prev.map((a) => ({ ...a, isRead: true }));
      try {
        localStorage.setItem('farmer_friend_alerts', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const unreadAlertCount = alerts.filter((a) => !a.isRead).length;

  // 4. Saved schemes
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(() => getSavedSchemeIds());

  const toggleSaveSchemeId = (id: string): boolean => {
    const saved = toggleSaveScheme(id);
    setSavedSchemeIds(getSavedSchemeIds());
    return saved;
  };

  // 5. Online state
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 6. Voice Assistant modal
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  // 7. Toast system
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(
    null
  );

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        farmer,
        updateFarmer,
        isAuthenticated,
        firebaseUser,
        isFirebaseAvailable: isFirebaseConfigured,
        loginAsDemoFarmer,
        loginWithPhone,
        logout,
        alerts,
        markAlertRead,
        markAllAlertsRead,
        unreadAlertCount,
        savedSchemeIds,
        toggleSaveSchemeId,
        isOnline,
        voiceModalOpen,
        setVoiceModalOpen,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
