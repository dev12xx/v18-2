import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminLayout = ({ children }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Simple check for simulation
    const isAuthenticated = localStorage.getItem('isAdmin');

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-100 flex">
            <aside className="w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-8">
                        <img src="/Logo-Gica.png" alt="Logo" className="w-12 h-12 object-contain" />
                        <div className="h-8 w-px bg-slate-200"></div>
                        <span className="font-bold text-lg">{t('brand.name')}</span>
                    </div>

                    <nav className="space-y-2">
                        <Link to="/admin" className="flex items-center gap-3 p-3 bg-primary-50 text-primary-700 rounded-lg font-medium">
                            <LayoutDashboard className="w-5 h-5" /> {t('adminLayout.dashboard')}
                        </Link>
                        <button
                            onClick={() => {
                                localStorage.removeItem('isAdmin');
                                window.dispatchEvent(new Event('admin-auth-changed'));
                                navigate('/admin', { replace: true });
                            }}
                            className="w-full flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" /> {t('adminLayout.logout')}
                        </button>
                    </nav>
                </div>
            </aside>

            <main className="flex-grow p-8">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
