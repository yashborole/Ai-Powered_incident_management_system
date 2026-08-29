import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { ApplicationsListPage } from './pages/applications/ApplicationsListPage';
import { ApplicationDetailPage } from './pages/applications/ApplicationDetailPage';
import { IncidentsListPage } from './pages/incidents/IncidentsListPage';
import { IncidentDetailPage } from './pages/incidents/IncidentDetailPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { KnowledgePage } from './pages/knowledge/KnowledgePage';
import { SettingsPage } from './pages/settings/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Dashboard Area */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard/overview" replace />} />
              <Route path="overview" element={<DashboardOverviewPage />} />
              <Route path="applications" element={<ApplicationsListPage />} />
              <Route path="applications/:applicationId" element={<ApplicationDetailPage />} />
              <Route path="incidents" element={<IncidentsListPage />} />
              <Route path="incidents/:incidentId" element={<IncidentDetailPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="knowledge" element={<KnowledgePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Default Catch-all */}
            <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
            <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
