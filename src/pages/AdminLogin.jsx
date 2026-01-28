import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AdminLogin = () => {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError(false);
        // Simple mock logic
        if (username === 'admin' && password === 'admin') {
            localStorage.setItem('isAdmin', 'true');
            window.dispatchEvent(new Event('admin-auth-changed'));
            navigate('/admin', { replace: true });
        } else {
            setError(true);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-24 h-24 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 p-4">
                        <img src="/Logo-Gica.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('adminLogin.title')}</h1>
                    <p className="text-slate-500">{t('adminLogin.subtitle')}</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{t('adminLogin.invalid')}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">{t('adminLogin.username')}</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field"
                            placeholder="admin"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">{t('adminLogin.password')}</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full py-4 text-lg">
                        {t('adminLogin.login')}
                    </button>
                </form>

                <p className="text-center text-slate-400 text-sm mt-8">
                    {t('adminLogin.authorizedOnly')}
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
