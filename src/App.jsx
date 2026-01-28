import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import FormSelector from './pages/FormSelector';
import ComplaintFormPage from './pages/ComplaintFormPage';
import StatusChecker from './pages/StatusChecker';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ScrollToTop from './components/ScrollToTop';

const AdminEntry = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('isAdmin')));

  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(Boolean(localStorage.getItem('isAdmin')));
    window.addEventListener('admin-auth-changed', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('admin-auth-changed', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  return isAuthenticated ? (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  ) : (
    <AdminLogin />
  );
};

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lng = i18n.language === 'ar' ? 'ar' : 'fr';
    const dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    document.documentElement.dir = dir;
  }, [i18n.language]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/submit" element={<FormSelector />} />
          <Route path="/submit/:type" element={<ComplaintFormPage />} />
          <Route path="/track" element={<StatusChecker />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminEntry />} />
        <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
