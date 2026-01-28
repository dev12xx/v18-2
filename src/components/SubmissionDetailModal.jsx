import { XCircle, AlertCircle, FileText, Printer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SubmissionDetailModal = ({ isOpen, onClose, submission, onUpdateStatus }) => {
    const { t } = useTranslation();

    if (!isOpen || !submission) return null;

    const getStatusLabel = (status, appealData) => {
        if (status === 'Accepted') return t('adminDashboard.statuses.accepted');
        if (status === 'Declined') return appealData ? t('adminDashboard.statuses.declinedFinal') : t('adminDashboard.statuses.declined');
        if (status === 'Appeal') return t('adminDashboard.statuses.appeal');
        return t('adminDashboard.statuses.pending');
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-5 sm:p-8 border-b border-slate-100 sticky top-0 bg-white z-10 flex justify-between items-center no-print">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t('adminDashboard.modal.title')}</h2>
                        <p className="text-primary-600 font-mono font-bold text-sm sm:text-base">{submission.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.print()}
                            className="px-3 py-2 sm:px-4 sm:py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors text-xs sm:text-sm flex items-center justify-center gap-2"
                            title={t('adminDashboard.modal.print')}
                        >
                            <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">{t('adminDashboard.modal.print')}</span>
                        </button>
                        <button onClick={onClose} className="p-1 sm:p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300" />
                        </button>
                    </div>
                </div>

                <div id="print-area" className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                    <div className="print-only">
                        <div className="flex justify-center mb-6">
                            <img src="/Logo-Gica.png" alt="Company" className="h-20 object-contain" />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                        <div>
                            <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">{t('adminDashboard.modal.currentStatus')}</label>
                            <span className={`inline-flex items-center gap-1.5 font-bold px-3 py-1 rounded-full text-xs sm:text-sm ${submission.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' :
                                submission.status === 'Declined' ? 'bg-rose-50 text-rose-700' :
                                    submission.status === 'Appeal' ? 'bg-primary-50 text-primary-700' : 'bg-amber-50 text-amber-700'
                                }`}>
                                {getStatusLabel(submission.status, submission.appealData)}
                            </span>
                        </div>
                        <div>
                            <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">{t('adminDashboard.modal.submittedAt')}</label>
                            <p className="font-semibold text-slate-900 text-sm sm:text-base">{submission.dateSubmitted}</p>
                        </div>
                    </div>

                    {submission.status === 'Appeal' && submission.appealData && (
                        <div className="p-4 sm:p-6 bg-primary-50 rounded-2xl border border-primary-100 border-l-4 border-l-primary-600">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertCircle className="w-5 h-5 text-primary-600" />
                                <h3 className="font-bold text-primary-900 text-sm sm:text-base">{t('adminDashboard.modal.appealDetailsTitle')}</h3>
                            </div>
                            <label className="text-[10px] sm:text-xs font-bold text-primary-400 uppercase tracking-wider mb-2 block">{t('adminDashboard.modal.appealReason')}</label>
                            <p className="text-slate-800 text-sm sm:text-base leading-relaxed mb-4 italic">"{submission.appealData.reason}"</p>
                            {submission.appealData.evidence && (
                                <div>
                                    <span className="text-[10px] sm:text-xs font-bold text-primary-400 uppercase tracking-wider mb-2 block">{t('adminDashboard.modal.newEvidence')}</span>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-primary-200 rounded-lg text-xs sm:text-sm text-primary-700">
                                        <FileText className="w-4 h-4" />
                                        {submission.appealData.evidence}
                                    </div>
                                </div>
                            )}
                            <p className="text-[10px] text-primary-400 mt-4 text-right">{t('adminDashboard.modal.filedOn')} : {submission.appealData.date}</p>
                        </div>
                    )}

                    <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{t('adminDashboard.modal.factsDescription')}</label>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{submission.description}</p>
                        {submission.evidence && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{t('adminDashboard.modal.originalAttachment')}</span>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-600">
                                    <FileText className="w-4 h-4" />
                                    {submission.evidence}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t('adminDashboard.modal.contactInfo')}</h3>
                        <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                            <div>
                                <span className="text-slate-400 block">{t('adminDashboard.modal.anonymity')}</span>
                                <span className="font-semibold text-slate-700">{submission.anonymous ? t('adminDashboard.modal.yes') : t('adminDashboard.modal.no')}</span>
                            </div>
                            {submission.fullName && (
                                <div>
                                    <span className="text-slate-400 block">{t('adminDashboard.modal.fullName')}</span>
                                    <span className="font-semibold text-slate-700">{submission.fullName}</span>
                                </div>
                            )}
                            {submission.email && (
                                <div>
                                    <span className="text-slate-400 block">{t('adminDashboard.modal.email')}</span>
                                    <span className="font-semibold text-slate-700">{submission.email}</span>
                                </div>
                            )}
                            {submission.phone && (
                                <div>
                                    <span className="text-slate-400 block">{t('adminDashboard.modal.phone')}</span>
                                    <span className="font-semibold text-slate-700">{submission.phone}</span>
                                </div>
                            )}
                            {submission.company && (
                                <div>
                                    <span className="text-slate-400 block">{t('adminDashboard.modal.company')}</span>
                                    <span className="font-semibold text-slate-700">{submission.company}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {(submission.incidentDate || submission.location || submission.department || submission.schbDepartment || submission.orderNumber) && (
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t('adminDashboard.modal.incidentDetails')}</h3>
                            <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                                {submission.incidentDate && (
                                    <div>
                                        <span className="text-slate-400 block">{t('adminDashboard.modal.incidentDate')}</span>
                                        <span className="font-semibold text-slate-700">{submission.incidentDate}</span>
                                    </div>
                                )}
                                {submission.location && (
                                    <div>
                                        <span className="text-slate-400 block">{t('adminDashboard.modal.location')}</span>
                                        <span className="font-semibold text-slate-700">{submission.location}</span>
                                    </div>
                                )}
                                {submission.department && (
                                    <div>
                                        <span className="text-slate-400 block">{t('adminDashboard.modal.department')}</span>
                                        <span className="font-semibold text-slate-700">{submission.department}</span>
                                    </div>
                                )}
                                {submission.schbDepartment && (
                                    <div>
                                        <span className="text-slate-400 block">{t('adminDashboard.modal.schbDepartment')}</span>
                                        <span className="font-semibold text-slate-700">{submission.schbDepartment}</span>
                                    </div>
                                )}
                                {submission.orderNumber && (
                                    <div>
                                        <span className="text-slate-400 block">{t('adminDashboard.modal.orderNumber')}</span>
                                        <span className="font-semibold text-slate-700">{submission.orderNumber}</span>
                                    </div>
                                )}
                                {submission.relationType && (
                                    <div>
                                        <span className="text-slate-400 block">{t('adminDashboard.modal.relationType')}</span>
                                        <span className="font-semibold text-slate-700">{submission.relationType}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {(submission.employeeId || submission.position || submission.supervisor || submission.personsInvolved) && (
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t('adminDashboard.modal.professionalInfo')}</h3>
                            <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                                {submission.employeeId && (
                                    <div>
                                        <span className="text-slate-400 block">{t('adminDashboard.modal.employeeId')}</span>
                                        <span className="font-semibold text-slate-700">{submission.employeeId}</span>
                                    </div>
                                )}
                                {submission.position && (
                                    <div>
                                        <span className="text-slate-400 block">{t('adminDashboard.modal.position')}</span>
                                        <span className="font-semibold text-slate-700">{submission.position}</span>
                                    </div>
                                )}
                                {submission.supervisor && (
                                    <div>
                                        <span className="text-slate-400 block">{t('adminDashboard.modal.supervisor')}</span>
                                        <span className="font-semibold text-slate-700">{submission.supervisor}</span>
                                    </div>
                                )}
                                {submission.personsInvolved && (
                                    <div className="sm:col-span-2">
                                        <span className="text-slate-400 block">{t('adminDashboard.modal.personsInvolved')}</span>
                                        <span className="font-semibold text-slate-700">{submission.personsInvolved}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100 no-print">
                        <div className="flex flex-row gap-3 flex-1">
                            <button
                                onClick={() => onUpdateStatus?.(submission.id, 'Accepted')}
                                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors text-sm sm:text-base"
                            >
                                {t('adminDashboard.modal.accept')}
                            </button>
                            <button
                                onClick={() => onUpdateStatus?.(submission.id, 'Declined')}
                                className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors text-sm sm:text-base"
                            >
                                {t('adminDashboard.modal.decline')}
                            </button>
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="w-full sm:w-auto px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
                        >
                            <Printer className="w-5 h-5" />
                            {t('adminDashboard.modal.print')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionDetailModal;
