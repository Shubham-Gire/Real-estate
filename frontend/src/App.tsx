import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { ClientLayout } from './layouts/ClientLayout';
import { AgentCrmLayout } from './layouts/AgentCrmLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Route Guards
import { ProtectedRoute, AgentRoute, AdminRoute } from './components/guards/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { PropertiesPage } from './pages/public/PropertiesPage';
import { PropertyDetailPage } from './pages/public/PropertyDetailPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { FaqPage } from './pages/public/FaqPage';
import { TermsPage } from './pages/public/TermsPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Client Portal Pages
import { ClientOverviewPage } from './pages/client/ClientOverviewPage';
import { ClientFavoritesPage } from './pages/client/ClientFavoritesPage';
import { ClientShowingsPage } from './pages/client/ClientShowingsPage';
import { ClientInquiriesPage } from './pages/client/ClientInquiriesPage';
import { ClientListingsPage } from './pages/client/ClientListingsPage';
import { AddPropertyPage } from './pages/dashboard/AddPropertyPage';
import { EditPropertyPage } from './pages/dashboard/EditPropertyPage';
import { ProfileSettingsPage } from './pages/dashboard/ProfileSettingsPage';

// Agent Real Estate CRM Pages
import { AgentDashboardPage } from './pages/agent/AgentDashboardPage';
import { AgentPipelinePage } from './pages/agent/AgentPipelinePage';
import { AgentContactsPage } from './pages/agent/AgentContactsPage';
import { AgentDealsPage } from './pages/agent/AgentDealsPage';
import { AgentShowingsPage } from './pages/agent/AgentShowingsPage';
import { AgentListingsPage } from './pages/agent/AgentListingsPage';
import { AgentAnalyticsPage } from './pages/agent/AgentAnalyticsPage';
import { AgentProfilePage } from './pages/agent/AgentProfilePage';

// Admin Governance Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminModerationPage } from './pages/admin/AdminModerationPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminAgentsPage } from './pages/admin/AdminAgentsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Smart Role-based dashboard dispatcher
const DashboardRedirect: React.FC = () => {
  const { user, isAdmin, isAgent } = useAuth();
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (isAgent) return <Navigate to="/agent/dashboard" replace />;
  return <Navigate to="/portal/overview" replace />;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Marketplace with MainLayout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="properties" element={<PropertiesPage />} />
                <Route path="properties/:id" element={<PropertyDetailPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="faq" element={<FaqPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
              </Route>

              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Smart Dashboard Redirection */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardRedirect />
                  </ProtectedRoute>
                }
              />

              {/* 1. Client / Consumer & Owner Portal */}
              <Route
                path="/portal"
                element={
                  <ProtectedRoute>
                    <ClientLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/portal/overview" replace />} />
                <Route path="overview" element={<ClientOverviewPage />} />
                <Route path="favorites" element={<ClientFavoritesPage />} />
                <Route path="showings" element={<ClientShowingsPage />} />
                <Route path="inquiries" element={<ClientInquiriesPage />} />
                <Route path="my-listings" element={<ClientListingsPage />} />
                <Route path="submit-property" element={<AddPropertyPage />} />
                <Route path="properties/edit/:id" element={<EditPropertyPage />} />
                <Route path="profile" element={<ProfileSettingsPage />} />
              </Route>

              {/* 2. Real Estate Agent CRM Portal */}
              <Route
                path="/agent"
                element={
                  <AgentRoute>
                    <AgentCrmLayout />
                  </AgentRoute>
                }
              >
                <Route index element={<Navigate to="/agent/dashboard" replace />} />
                <Route path="dashboard" element={<AgentDashboardPage />} />
                <Route path="pipeline" element={<AgentPipelinePage />} />
                <Route path="contacts" element={<AgentContactsPage />} />
                <Route path="deals" element={<AgentDealsPage />} />
                <Route path="showings" element={<AgentShowingsPage />} />
                <Route path="listings" element={<AgentListingsPage />} />
                <Route path="analytics" element={<AgentAnalyticsPage />} />
                <Route path="profile" element={<AgentProfilePage />} />
              </Route>

              {/* 3. Enterprise Admin Governance Portal */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="moderation" element={<AdminModerationPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="agents" element={<AdminAgentsPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="audit-logs" element={<AdminAuditLogsPage />} />
              </Route>

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

