import { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Clock, AlertCircle, Printer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SubmissionDetailModal from '../components/SubmissionDetailModal';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [submissions, setSubmissions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const loadSubmissions = () => {
        const data = JSON.parse(localStorage.getItem('submissions') || '[]');
        setSubmissions(data);
    };

    useEffect(() => {
        loadSubmissions();

        const handleStorageChange = () => {
            loadSubmissions();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const updateStatus = (id, newStatus) => {
        const updated = submissions.map(s => s.id === id ? { ...s, status: newStatus } : s);
        setSubmissions(updated);
        localStorage.setItem('submissions', JSON.stringify(updated));
        // Force storage event for other tabs/windows if needed, though 'setItem' fires it in OTHER windows.
        // For same-window cross-component updates (unlikely here but good practice):
        window.dispatchEvent(new Event('storage'));

        if (selectedSubmission && selectedSubmission.id === id) {
            setSelectedSubmission({ ...selectedSubmission, status: newStatus });
        }
    };

    const deleteSubmission = (id) => {
        const updated = submissions.filter(s => s.id !== id);
        setSubmissions(updated);
        localStorage.setItem('submissions', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));

        if (selectedSubmission && selectedSubmission.id === id) {
            setSelectedSubmission(null);
        }
    };

    const filteredSubmissions = submissions.filter((s) => {
        if (filter === 'all') return true;
        if (filter === 'pending') return s.status === 'Pending';
        if (filter === 'accepted') return s.status === 'Accepted';
        if (filter === 'declined') return s.status === 'Declined';
        if (filter === 'appeal') return s.status === 'Appeal';
        return true;
    });

    const getTypeLabel = (type) => {
        if (type === 'client') return t('adminDashboard.types.client');
        if (type === 'employee') return t('adminDashboard.types.employee');
        return t('adminDashboard.types.external');
    };

    const getStatusLabel = (status, appealData) => {
        if (status === 'Accepted') return t('adminDashboard.statuses.accepted');
        if (status === 'Declined') return appealData ? t('adminDashboard.statuses.declinedFinal') : t('adminDashboard.statuses.declined');
        if (status === 'Appeal') return t('adminDashboard.statuses.appeal');
        return t('adminDashboard.statuses.pending');
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{t('adminDashboard.title')}</h1>
                    <p className="text-slate-500 text-sm md:text-base">{t('adminDashboard.subtitle')}</p>
                </div>

                <div className="flex flex-wrap gap-2 bg-white p-1 rounded-xl border border-slate-200">
                    {[
                        { id: 'all', label: t('adminDashboard.filters.all') },
                        { id: 'pending', label: t('adminDashboard.filters.pending') },
                        { id: 'accepted', label: t('adminDashboard.filters.accepted') },
                        { id: 'declined', label: t('adminDashboard.filters.declined') },
                        { id: 'appeal', label: t('adminDashboard.filters.appeal') }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium capitalize transition-all ${filter === f.id ? 'bg-primary-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider">{t('adminDashboard.table.reference')}</th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider">{t('adminDashboard.table.type')}</th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider">{t('adminDashboard.table.date')}</th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider">{t('adminDashboard.table.status')}</th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider text-right">{t('adminDashboard.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredSubmissions.length > 0 ? filteredSubmissions.map((sub) => (
                                <tr key={sub.id} className={`hover:bg-slate-50/50 transition-colors ${sub.status === 'Appeal' ? 'bg-primary-50/30' : ''}`}>
                                    <td className="px-6 py-4 font-mono font-bold text-primary-700">{sub.id}</td>
                                    <td className="px-6 py-4 capitalize">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${sub.type === 'employee' ? 'bg-emerald-100 text-emerald-700' :
                                            sub.type === 'client' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {getTypeLabel(sub.type)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{sub.dateSubmitted}</td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1.5 font-semibold ${sub.status === 'Accepted' ? 'text-emerald-600' :
                                            sub.status === 'Declined' ? 'text-rose-600' :
                                                sub.status === 'Appeal' ? 'text-primary-600' : 'text-amber-600'
                                            }`}>
                                            {sub.status === 'Accepted' ? <CheckCircle className="w-4 h-4" /> :
                                                sub.status === 'Declined' ? <XCircle className="w-4 h-4" /> :
                                                    sub.status === 'Appeal' ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                            {getStatusLabel(sub.status, sub.appealData)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setSelectedSubmission(sub)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" title={t('adminDashboard.actions.viewDetails')}><Eye className="w-5 h-5" /></button>
                                            <button
                                                onClick={() => {
                                                    setSelectedSubmission(sub);
                                                    setTimeout(() => window.print(), 0);
                                                }}
                                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                                title={t('adminDashboard.modal.print')}
                                            >
                                                <Printer className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-slate-400">
                                        {t('adminDashboard.table.none')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <SubmissionDetailModal
                isOpen={!!selectedSubmission}
                onClose={() => setSelectedSubmission(null)}
                submission={selectedSubmission}
                onUpdateStatus={updateStatus}
            />
        </div>
    );
};

export default AdminDashboard;
