import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Trans, useTranslation } from 'react-i18next';

const Home = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="relative overflow-hidden">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <img src="/3.png" alt="Hero" className="w-full max-w-xs mx-auto mb-8 mix-blend-multiply opacity-90" />
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 font-semibold text-sm mb-6 border border-primary-100">
                            {t('home.badge')}
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
                            {t('home.title1')} <span className="text-primary-600">{t('home.title2')}</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                            <Trans i18nKey="home.description" components={{ strong: <strong /> }} />
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center font-medium">
                            <button
                                onClick={() => navigate('/submit')}
                                className="btn-primary flex items-center justify-center gap-2"
                            >
                                {t('home.ctaSubmit')} <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate('/about')}
                                className="px-8 py-4 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-all border border-slate-200"
                            >
                                {t('home.ctaLearnMore')}
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-0">
                    <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
                    <div className="absolute bottom-[10%] right-[5%] w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
                </div>
            </section>
        </div>
    );
};

export default Home;
