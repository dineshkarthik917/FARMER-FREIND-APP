import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { Toast } from './components/Toast';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { MarketScreen } from './screens/MarketScreen';
import { CropDoctorScreen } from './screens/CropDoctorScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { SchemesScreen } from './screens/SchemesScreen';
import { SchemeDetailScreen } from './screens/SchemeDetailScreen';
import { ProfileScreen } from './screens/ProfileScreen';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useApp();

  const isFullscreenRoute = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#1F2937] flex flex-col items-center">
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#FFFDF5] shadow-[0_0_24px_rgba(0,0,0,0.04)] relative">
        <OfflineBanner />
        {!isFullscreenRoute && <Header />}
        
        <main className={`flex-1 ${!isFullscreenRoute ? 'px-4 pt-3' : ''}`}>
          {children}
        </main>

        {!isFullscreenRoute && isAuthenticated && <BottomNav />}
        <VoiceAssistantModal />
        <Toast />
      </div>
    </div>
  );
};

// Route Guard for authenticated screens
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return element;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            {/* Screen 1: Splash / Welcome */}
            <Route path="/" element={<SplashScreen />} />

            {/* Screen 2: Login & OTP */}
            <Route path="/login" element={<LoginScreen />} />

            {/* Screen 3: Dashboard */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<DashboardScreen />} />}
            />

            {/* Screen 4: Market Comparison */}
            <Route
              path="/market"
              element={<ProtectedRoute element={<MarketScreen />} />}
            />

            {/* Screen 5: Crop Doctor */}
            <Route
              path="/crop-doctor"
              element={<ProtectedRoute element={<CropDoctorScreen />} />}
            />

            {/* Screen 6: Farm Alerts */}
            <Route
              path="/alerts"
              element={<ProtectedRoute element={<AlertsScreen />} />}
            />

            {/* Screen 7: Government Schemes */}
            <Route
              path="/schemes"
              element={<ProtectedRoute element={<SchemesScreen />} />}
            />

            {/* Screen 7b: Scheme Detail */}
            <Route
              path="/scheme/:id"
              element={<ProtectedRoute element={<SchemeDetailScreen />} />}
            />

            {/* Screen 8: Farmer Profile */}
            <Route
              path="/profile"
              element={<ProtectedRoute element={<ProfileScreen />} />}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AppProvider>
  );
}
