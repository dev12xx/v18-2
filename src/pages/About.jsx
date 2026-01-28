import { Shield, Target, Users, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();

    return (
        <div className="py-16">
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-slate-900 mb-6">{t('about.title')}</h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            {t('about.intro')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">{t('about.whyTitle')}</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">
                                {t('about.whyP1')}
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                {t('about.whyP2')}
                            </p>
                        </div>
                        <div className="bg-primary-50 p-8 rounded-3xl border border-primary-100">
                            <Shield className="w-16 h-16 text-primary-600 mb-6" />
                            <h3 className="text-2xl font-bold mb-4">{t('about.anonymityTitle')}</h3>
                            <p className="text-slate-600">
                                {t('about.anonymityP')}
                            </p>
                        </div>
                    </div>

                    <div className="mb-20 bg-slate-50 rounded-3xl p-8 lg:p-12 border border-slate-200">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            <div className="flex-1">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm mb-6">
                                    {t('about.dayTag')}
                                </span>
                                <h2 className="text-3xl font-bold mb-6">{t('about.dayTitle')}</h2>
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    {t('about.dayP1')}
                                </p>
                                <p className="text-slate-600 leading-relaxed">
                                    {t('about.dayP2')}
                                </p>
                            </div>
                            <div className="flex-1 w-full relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-3xl transform rotate-3 opacity-20"></div>
                                <img
                                    src="/anti_corruption_handshake_money.png"
                                    alt={t('about.imageAlt')}
                                    className="relative rounded-3xl shadow-xl w-full h-80 object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white p-12 rounded-3xl">
                        <h2 className="text-3xl font-bold mb-12 text-center">{t('about.valuesTitle')}</h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            {[
                                { icon: <Target className="w-10 h-10 mx-auto text-primary-400 mb-4" />, title: t('about.values.integrity') },
                                { icon: <Users className="w-10 h-10 mx-auto text-primary-400 mb-4" />, title: t('about.values.trust') },
                                { icon: <CheckCircle2 className="w-10 h-10 mx-auto text-primary-400 mb-4" />, title: t('about.values.justice') }
                            ].map((val, i) => (
                                <div key={i}>
                                    {val.icon}
                                    <h3 className="text-xl font-bold">{val.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
