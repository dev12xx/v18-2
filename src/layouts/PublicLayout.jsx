import { Outlet, Link } from 'react-router-dom';
import { Info, FileText, Search, Menu, X, Facebook } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PublicLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const next = i18n.language === 'ar' ? 'fr' : 'ar';
        i18n.changeLanguage(next);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <nav dir="ltr" className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-4">
                            <a href="https://www.schb.dz/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title={t('nav.visitSchb')}>
                                <img src="/Logo-Gica.png" alt="Logo" className="w-auto h-12 md:h-16 object-contain z-10 relative" />
                            </a>
                            <div className="hidden md:block h-8 w-px bg-slate-700"></div>
                            <Link to="/">
                                <span className="text-lg md:text-2xl font-bold text-white truncate max-w-[200px] md:max-w-none">
                                    {t('brand.name')}
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-slate-200 hover:text-white font-medium transition-colors">{t('nav.home')}</Link>
                            <Link to="/submit" className="text-slate-200 hover:text-white font-medium transition-colors flex items-center gap-1">
                                <FileText className="w-4 h-4" /> {t('nav.submitComplaint')}
                            </Link>
                            <Link to="/track" className="text-slate-200 hover:text-white font-medium transition-colors flex items-center gap-1">
                                <Search className="w-4 h-4" /> {t('nav.track')}
                            </Link>
                            <Link to="/about" className="text-slate-200 hover:text-white font-medium transition-colors flex items-center gap-1">
                                <Info className="w-4 h-4" /> {t('nav.about')}
                            </Link>
                            <button
                                type="button"
                                onClick={toggleLanguage}
                                className="px-3 py-2 text-slate-200 hover:text-white font-semibold transition-colors border border-slate-700 rounded-lg"
                            >
                                {i18n.language === 'ar' ? 'FR' : 'AR'}
                            </button>
                        </div>

                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors z-50"
                            aria-label={t('nav.toggleMenuAria')}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div dir="ltr" className="md:hidden fixed inset-0 top-16 bg-slate-900/95 backdrop-blur-xl z-40 animate-in slide-in-from-top-4 duration-200 border-t border-slate-800 shadow-xl h-[calc(100vh-4rem)] overflow-y-auto">
                        <div className="flex flex-col p-6 space-y-2">
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-semibold text-slate-200 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition-all"
                            >
                                {t('nav.home')}
                            </Link>
                            <Link
                                to="/submit"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-semibold text-slate-200 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition-all flex items-center gap-2"
                            >
                                <FileText className="w-5 h-5" /> {t('nav.submitComplaint')}
                            </Link>
                            <Link
                                to="/track"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-semibold text-slate-200 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition-all flex items-center gap-2"
                            >
                                <Search className="w-5 h-5" /> {t('nav.track')}
                            </Link>
                            <Link
                                to="/about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-semibold text-slate-200 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition-all flex items-center gap-2"
                            >
                                <Info className="w-5 h-5" /> {t('nav.about')}
                            </Link>
                            <button
                                type="button"
                                onClick={() => {
                                    toggleLanguage();
                                    setMobileMenuOpen(false);
                                }}
                                className="text-lg font-semibold text-slate-200 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition-all flex items-center gap-2"
                            >
                                {i18n.language === 'ar' ? 'FR' : 'AR'}
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4">{t('brand.name')}</h3>
                            <p className="mb-4">{t('footer.description')}</p>
                            <div className="flex gap-4">
                                <a href="https://www.facebook.com/CIMENTERIE.HAMMA.BOUZIANE/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                    <Facebook className="w-6 h-6" />
                                </a>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <h3 className="text-white font-bold text-lg mb-4">{t('footer.contacts')}</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                                <div>
                                    <h4 className="font-semibold text-slate-300">{t('footer.directorate')}</h4>
                                    <p>{t('footer.tel')}: 213 31 60 65 43</p>
                                    <p>{t('footer.fax')}: 213 31 60 65 39</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-300">{t('footer.productionUnit')}</h4>
                                    <p>{t('footer.tel')}: 213 31 90 68 45</p>
                                    <p>{t('footer.fax')}: 213 31 90 66 23</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-300">{t('footer.ucConstantine')}</h4>
                                    <p>{t('footer.tel')}: 213 31 86 40 40</p>
                                    <p>{t('footer.fax')}: 213 31 86 40 03</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-300">{t('footer.ucAnnaba')}</h4>
                                    <p>{t('footer.tel')}: 213 30 82 24 10</p>
                                    <p>{t('footer.fax')}: 213 30 82 24 10</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-300">{t('footer.ucSkikda')}</h4>
                                    <p>{t('footer.tel')}: 213 38 75 26 63</p>
                                    <p>{t('footer.fax')}: 213 38 75 26 63</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-6 text-center text-sm">
                        <p>{t('footer.copyright')}</p>
                        <p className="mt-2">{t('footer.tagline')}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
