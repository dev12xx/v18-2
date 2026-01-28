import { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Clock, Trash2, AlertCircle, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [submissions, setSubmissions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const loadSubmissions = () => {
        const data = JSON.parse(localStorage.getItem('submissions') || '[]');
        setSubmissions(data);
        // Also update selected submission if it exists
        if (selectedSubmission) {
            const updatedSelected = data.find(s => s.id === selectedSubmission.id);
            if (updatedSelected) {
                setSelectedSubmission(updatedSelected);
            }
        }
    };

    useEffect(() => {
        loadSubmissions();

        const handleStorageChange = () => {
            loadSubmissions();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [selectedSubmission]); // Depend on selectedSubmission to correctly update it inside loadSubmissions ref

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
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('adminDashboard.title')}</h1>
                    <p className="text-slate-500">{t('adminDashboard.subtitle')}</p>
                </div>

                <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200">
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
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f.id ? 'bg-primary-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
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
                                            <button onClick={() => updateStatus(sub.id, 'Accepted')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg" title={t('adminDashboard.modal.accept')}><CheckCircle className="w-5 h-5" /></button>
                                            <button onClick={() => updateStatus(sub.id, 'Declined')} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg" title={t('adminDashboard.modal.decline')}><XCircle className="w-5 h-5" /></button>
                                            <button onClick={() => deleteSubmission(sub.id)} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-600 rounded-lg" title={t('adminDashboard.actions.delete')}><Trash2 className="w-5 h-5" /></button>
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

            {/* Detail Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 sticky top-0 bg-white z-10 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{t('adminDashboard.modal.title')}</h2>
                                <p className="text-primary-600 font-mono font-bold">{selectedSubmission.id}</p>
                            </div>
                            <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <XCircle className="w-8 h-8 text-slate-300" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">{t('adminDashboard.modal.currentStatus')}</label>
                                    <span className={`inline-flex items-center gap-1.5 font-bold px-3 py-1 rounded-full text-sm ${selectedSubmission.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' :
                                        selectedSubmission.status === 'Declined' ? 'bg-rose-50 text-rose-700' :
                                            selectedSubmission.status === 'Appeal' ? 'bg-primary-50 text-primary-700' : 'bg-amber-50 text-amber-700'
                                        }`}>
                                        {getStatusLabel(selectedSubmission.status, selectedSubmission.appealData)}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">{t('adminDashboard.modal.submittedAt')}</label>
                                    <p className="font-semibold text-slate-900">{selectedSubmission.dateSubmitted}</p>
                                </div>
                            </div>

                            {selectedSubmission.status === 'Appeal' && selectedSubmission.appealData && (
                                <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100 border-l-4 border-l-primary-600">
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertCircle className="w-5 h-5 text-primary-600" />
                                        <h3 className="font-bold text-primary-900">{t('adminDashboard.modal.appealDetailsTitle')}</h3>
                                    </div>
                                    <label className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-2 block">{t('adminDashboard.modal.appealReason')}</label>
                                    <p className="text-slate-800 leading-relaxed mb-4 italic">"{selectedSubmission.appealData.reason}"</p>
                                    {selectedSubmission.appealData.evidence && (
                                        <div>
                                            <span className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-2 block">{t('adminDashboard.modal.newEvidence')}</span>
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-primary-200 rounded-lg text-sm text-primary-700">
                                                <FileText className="w-4 h-4" />
                                                {selectedSubmission.appealData.evidence}
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-[10px] text-primary-400 mt-4 text-right">{t('adminDashboard.modal.filedOn')} : {selectedSubmission.appealData.date}</p>
                                </div>
                            )}

                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{t('adminDashboard.modal.factsDescription')}</label>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedSubmission.description}</p>
                                {selectedSubmission.evidence && (
                                    <div className="mt-4 pt-4 border-t border-slate-200">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{t('adminDashboard.modal.originalAttachment')}</span>
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">
                                            <FileText className="w-4 h-4" />
                                            {selectedSubmission.evidence}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h3 className="font-bold text-slate-900">{t('adminDashboard.modal.contactInfo')}</h3>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    {selectedSubmission.fullName && (
                                        <div>
                                            <span className="text-slate-400 block">{t('adminDashboard.modal.fullName')}</span>
                                            <span className="font-semibold text-slate-700">{selectedSubmission.fullName}</span>
                                        </div>
                                    )}
                                    {selectedSubmission.email && (
                                        <div>
                                            <span className="text-slate-400 block">{t('adminDashboard.modal.email')}</span>
                                            <span className="font-semibold text-slate-700">{selectedSubmission.email}</span>
                                        </div>
                                    )}
                                    {selectedSubmission.anonymous !== undefined && (
                                        <div>
                                            <span className="text-slate-400 block">{t('adminDashboard.modal.anonymity')}</span>
                                            <span className="font-semibold text-slate-700">{selectedSubmission.anonymous ? t('adminDashboard.modal.yes') : t('adminDashboard.modal.no')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-slate-100">
                                <button onClick={() => updateStatus(selectedSubmission.id, 'Accepted')} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">{t('adminDashboard.modal.accept')}</button>
                                <button onClick={() => updateStatus(selectedSubmission.id, 'Declined')} className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors">{t('adminDashboard.modal.decline')}</button>
                                <button onClick={() => deleteSubmission(selectedSubmission.id)} className="px-4 py-3 bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all">
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
