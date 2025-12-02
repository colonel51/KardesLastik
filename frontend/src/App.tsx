import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import DebtsPage from './pages/admin/DebtsPage';
import GalleryPage from './pages/GalleryPage';
import AdminGalleryPage from './pages/admin/GalleryPage';
import ContactMessagesPage from './pages/admin/ContactMessagesPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="hakkimizda" element={<AboutPage />} />
            <Route path="hizmetlerimiz" element={<ServicesPage />} />
            <Route path="galeri" element={<GalleryPage />} />
            <Route path="iletisim" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Routes - React Admin Panel */}
          <Route path="/yonetim/login" element={<AdminLoginPage />} />
          <Route
            path="/yonetim"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/yonetim/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="debts" element={<DebtsPage />} />
            <Route path="gallery" element={<AdminGalleryPage />} />
            <Route path="contact-messages" element={<ContactMessagesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
