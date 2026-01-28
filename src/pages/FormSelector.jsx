import { useNavigate } from 'react-router-dom';
import { Users, Building, Globe, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FormSelector = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const options = [
        {
            id: 'client',
            title: t('formSelector.options.clientTitle'),
            icon: <Users className="w-8 h-8" />,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            desc: t('formSelector.options.clientDesc')
        },
        {
            id: 'employee',
            title: t('formSelector.options.employeeTitle'),
            icon: <Building className="w-8 h-8" />,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            desc: t('formSelector.options.employeeDesc')
        },
        {
            id: 'external',
            title: t('formSelector.options.externalTitle'),
            icon: <Globe className="w-8 h-8" />,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            desc: t('formSelector.options.externalDesc')
        }
    ];

    return (
        <div className="py-20 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">{t('formSelector.title')}</h1>
                    <p className="text-slate-600">{t('formSelector.subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {options.map((opt) => (
                        <motion.button
                            key={opt.id}
                            whileHover={{ y: -8 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/submit/${opt.id}`)}
                            className="group flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all"
                        >
                            <div className={`w-20 h-20 ${opt.bg} ${opt.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                                {opt.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{opt.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">{opt.desc}</p>

                            <div className="w-full pt-4 border-t border-slate-50 flex items-center justify-center gap-2 text-primary-600 font-semibold group-hover:translate-x-1 transition-transform">
                                {t('formSelector.continue')} <ChevronRight className="w-4 h-4" />
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FormSelector;
