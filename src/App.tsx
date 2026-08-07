import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TravelerLayout } from './layouts/TravelerLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { TravelerHome } from './pages/TravelerHome';
import { TravelerID } from './pages/TravelerID';
import { TravelerSettings } from './pages/TravelerSettings';
import { AdminDashboard } from './pages/AdminDashboard';
import { Onboarding } from './pages/Onboarding';

import { ImmigrationVerify } from './pages/ImmigrationVerify';
import { InteractiveBackground } from './components/InteractiveBackground';

function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const isOnboarded = localStorage.getItem('safara_onboarded') === 'true';
  const userType = localStorage.getItem('safara_user_type');
  const accountStatus = localStorage.getItem('safara_account_status');

  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  if (userType === 'international' && accountStatus === 'pending_verification') {
    return <Navigate to="/verify" replace />;
  }

  return <>{children}</>;
}

function RequireVerification({ children }: { children: React.ReactNode }) {
  const isOnboarded = localStorage.getItem('safara_onboarded') === 'true';
  const userType = localStorage.getItem('safara_user_type');
  const accountStatus = localStorage.getItem('safara_account_status');

  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  if (userType !== 'international' || accountStatus !== 'pending_verification') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  const hostname = window.location.hostname;
  const isAdmin = hostname.startsWith('dash.') || import.meta.env.VITE_APP_ROLE === 'admin';

  return (
    <BrowserRouter>
      <InteractiveBackground>
        {isAdmin ? (
          <Routes>
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        ) : (
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/verify" element={
              <RequireVerification>
                <ImmigrationVerify />
              </RequireVerification>
            } />
            <Route path="/" element={
              <RequireOnboarding>
                <TravelerLayout />
              </RequireOnboarding>
            }>
              <Route index element={<TravelerHome />} />
              <Route path="id" element={<TravelerID />} />
              <Route path="settings" element={<TravelerSettings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        )}
      </InteractiveBackground>
    </BrowserRouter>
  );
}

export default App;
