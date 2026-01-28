import { useState, useEffect } from 'react';
import { Search, Loader2, CheckCircle2, XCircle, Clock, Send, Upload, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const StatusChecker = () => {
    const { t } = useTranslation();
    const [complaintId, setComplaintId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    // Appeal State
    const [showAppealForm, setShowAppealForm] = useState(false);
    const [appealReason, setAppealReason] = useState('');
    const [appealEvidence, setAppealEvidence] = useState(null);
    const [isAppealing, setIsAppealing] = useState(false);
    const [appealSuccess, setAppealSuccess] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        setShowAppealForm(false);
        setAppealSuccess(false);

        if (!complaintId) return;

        setLoading(true);
        setTimeout(() => {
            const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
            const found = submissions.find(s => s.id.toLowerCase() === complaintId.trim().toLowerCase());

            if (found) {
                setResult(found);
            } else {
                setError(t('statusChecker.notFound'));
            }
            setLoading(false);
        }, 1000);
    };

    const handleAppealSubmit = (e) => {
        e.preventDefault();
        setIsAppealing(true);

        setTimeout(() => {
            const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
            const updated = submissions.map(s => {
                if (s.id === result.id) {
                    return {
                        ...s,
                        status: 'Appeal',
                        appealData: {
                            reason: appealReason,
                            evidence: appealEvidence,
                            date: new Date().toISOString().split('T')[0]
                        }
                    };
                }
                return s;
            });

            localStorage.setItem('submissions', JSON.stringify(updated));
            window.dispatchEvent(new Event('storage'));
            setResult({ ...result, status: 'Appeal' });
            setAppealSuccess(true);
            setIsAppealing(false);
            setShowAppealForm(false);
        }, 1500);
    };

    useEffect(() => {
        const handleStorageChange = () => {
            if (result) {
                const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
                const updatedResult = submissions.find(s => s.id === result.id);
                if (updatedResult) {
                    setResult(updatedResult);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [result]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Accepted': return <CheckCircle2 className="w-12 h-12 text-emerald-500" />;
            case 'Declined': return <XCircle className="w-12 h-12 text-rose-500" />;
            case 'Appeal': return <AlertCircle className="w-12 h-12 text-primary-500" />;
            default: return <Clock className="w-12 h-12 text-amber-500" />;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Accepted': return t('statusChecker.statuses.accepted');
            case 'Declined': return t('statusChecker.statuses.declined');
            case 'Appeal': return t('statusChecker.statuses.appeal');
            default: return t('statusChecker.statuses.pending');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Declined': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'Appeal': return 'bg-primary-50 text-primary-700 border-primary-100';
            default: return 'bg-amber-50 text-amber-700 border-amber-100';
        }
    };

    return (
        <div className="py-20 min-h-screen bg-slate-50">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-3">{t('statusChecker.title')}</h1>
                        <p className="text-slate-600">{t('statusChecker.subtitle')}</p>
                    </div>

                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('statusChecker.placeholder')}
                                value={complaintId}
                                onChange={(e) => setComplaintId(e.target.value)}
                                className="input-field pr-32"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-300 transition-colors flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-4 h-4" /> {t('statusChecker.search')}</>}
                            </button>
                        </div>
                        {error && <p className="mt-2 text-rose-500 text-sm font-medium">{error}</p>}
                    </form>

                    <AnimatePresence mode="wait">
                        {result && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-8 rounded-2xl border bg-slate-50"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-4">
                                        {getStatusIcon(result.status)}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">{t('statusChecker.status')}: {getStatusLabel(result.status)}</h3>
                                    <div className={`px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border ${getStatusColor(result.status)}`}>
                                        {t('statusChecker.ref')}: {result.id}
                                    </div>
                                    <p className="text-slate-600 mb-6 font-medium">
                                        {result.status === 'Accepted' ? t('statusChecker.messages.accepted') :
                                            result.status === 'Declined' && result.appealData ? t('statusChecker.messages.declinedFinal') :
                                                result.status === 'Declined' ? t('statusChecker.messages.declined') :
                                                    result.status === 'Appeal' ? t('statusChecker.messages.appeal') :
                                                        t('statusChecker.messages.pending')}
                                    </p>

                                    {result.status === 'Declined' && !result.appealData && !showAppealForm && !appealSuccess && (
                                        <button
                                            onClick={() => setShowAppealForm(true)}
                                            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg"
                                        >
                                            {t('statusChecker.appeal.button')}
                                        </button>
                                    )}

                                    {appealSuccess && (
                                        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-medium">
                                            {t('statusChecker.appeal.success')}
                                        </div>
                                    )}

                                    <div className="mt-6 w-full border-t border-slate-200 pt-6">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="text-left">
                                                <span className="text-slate-400 block uppercase text-[10px] font-bold tracking-wider">{t('statusChecker.info.submittedAt')}</span>
                                                <span className="font-semibold">{result.dateSubmitted}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-slate-400 block uppercase text-[10px] font-bold tracking-wider">{t('statusChecker.info.type')}</span>
                                                <span className="font-semibold capitalize">{result.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Appeal Form Overlay */}
                                <AnimatePresence>
                                    {showAppealForm && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-8 pt-8 border-t border-slate-200 overflow-hidden"
                                        >
                                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <AlertCircle className="w-5 h-5 text-primary-600" />
                                                {t('statusChecker.appeal.title')}
                                            </h4>
                                            <form onSubmit={handleAppealSubmit} className="space-y-4 text-left">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('statusChecker.appeal.reasonLabel')}</label>
                                                    <textarea
                                                        required
                                                        rows={4}
                                                        placeholder={t('statusChecker.appeal.reasonPlaceholder')}
                                                        className="input-field resize-none text-sm"
                                                        value={appealReason}
                                                        onChange={(e) => setAppealReason(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('statusChecker.appeal.evidenceLabel')}</label>
                                                    <div className="relative group cursor-pointer">
                                                        <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl group-hover:border-primary-500 transition-colors">
                                                            <Upload className="w-5 h-5 text-slate-400" />
                                                            <span className="text-slate-500 text-sm truncate">
                                                                {appealEvidence ? appealEvidence : t('statusChecker.appeal.evidencePlaceholder')}
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                            onChange={(e) => setAppealEvidence(e.target.files[0]?.name)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAppealForm(false)}
                                                        className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                                                    >
                                                        {t('statusChecker.appeal.cancel')}
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={isAppealing}
                                                        className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                                                    >
                                                        {isAppealing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> {t('statusChecker.appeal.send')}</>}
                                                    </button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default StatusChecker;
