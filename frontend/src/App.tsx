import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Route Guards
import { ProtectedRoute, AdminRoute } from './components/guards/ProtectedRoute';

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

// Dashboard Pages
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { MyPropertiesPage } from './pages/dashboard/MyPropertiesPage';
import { AddPropertyPage } from './pages/dashboard/AddPropertyPage';
import { EditPropertyPage } from './pages/dashboard/EditPropertyPage';
import { InquiriesPage } from './pages/dashboard/InquiriesPage';
import { FavoritesPage } from './pages/dashboard/FavoritesPage';
import { ProfileSettingsPage } from './pages/dashboard/ProfileSettingsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminModerationPage } from './pages/admin/AdminModerationPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
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
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Authentication Pages */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* User and Agent Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardOverviewPage />} />
                <Route path="properties" element={<MyPropertiesPage />} />
                <Route path="properties/add" element={<AddPropertyPage />} />
                <Route path="properties/edit/:id" element={<EditPropertyPage />} />
                <Route path="inquiries" element={<InquiriesPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="profile" element={<ProfileSettingsPage />} />
              </Route>

              {/* Dedicated Admin Dashboard */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="moderation" element={<AdminModerationPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="audit-logs" element={<AdminAuditLogsPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
