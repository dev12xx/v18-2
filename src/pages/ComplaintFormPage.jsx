import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Send, CheckCircle2, RefreshCw, Loader2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ComplaintFormPage = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [step, setStep] = useState(1); // 1: Charter, 2: Email/Captcha, 3: Form, 4: Success
    const [loading, setLoading] = useState(false);

    // Charter State
    const [charterAccepted, setCharterAccepted] = useState(false);

    // Captcha State
    const [captchaVal, setCaptchaVal] = useState('');
    const [userInputCaptcha, setUserInputCaptcha] = useState('');
    const [captchaError, setCaptchaError] = useState(false);

    // Email State
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [sentOtp, setSentOtp] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        location: '',
        incidentDate: '',
        anonymous: true,
        fullName: '',
        company: '',
        phone: '',
        orderNumber: '',
        department: '',
        relationType: '',
        employeeId: '',
        position: '',
        supervisor: '',
        personsInvolved: '',
        schbDepartment: '',
        evidence: null,
    });

    const sanitizeName = (value) => value.replace(/[^\p{L} \-']/gu, '');

    const sanitizePhone = (value) => {
        const cleaned = value.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
        return cleaned;
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, evidence: e.target.files[0].name });
        }
    };

    const getTypeLabel = () => {
        if (type === 'client') return t('complaint.types.client');
        if (type === 'employee') return t('complaint.types.employee');
        return t('complaint.types.external');
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaVal(result);
    };

    const handleCharterSubmit = (e) => {
        e.preventDefault();
        if (charterAccepted) {
            setStep(2);
        }
    };

    const handleEmailCaptchaSubmit = (e) => {
        e.preventDefault();
        if (userInputCaptcha.toUpperCase() !== captchaVal) {
            setCaptchaError(true);
            generateCaptcha();
            setUserInputCaptcha('');
            return;
        }

        setCaptchaError(false);
        setLoading(true);
        setTimeout(() => {
            const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
            console.log("------------------------------------------");
            console.log(`CODE DE VÉRIFICATION : ${randomOtp}`);
            console.log("------------------------------------------");
            setSentOtp(randomOtp);
            setLoading(false);
        }, 1000);
    };

    const handleOtpVerify = (e) => {
        e.preventDefault();
        if (otp === sentOtp) {
            setStep(3);
        }
    };

    // ID State
    const [submissionId, setSubmissionId] = useState('');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(submissionId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
            const newId = `REF-${Math.floor(Math.random() * 9000) + 1000}`;
            const newSubmission = {
                ...formData,
                id: newId,
                type,
                dateSubmitted: new Date().toISOString().split('T')[0],
                status: 'Pending',
                email
            };
            submissions.push(newSubmission);
            localStorage.setItem('submissions', JSON.stringify(submissions));
            setSubmissionId(newId);
            setStep(4);
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="py-12 px-4 min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-12 flex items-center justify-between">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center flex-1 last:flex-none">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${step >= i ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-slate-300 text-slate-400'
                                }`}>
                                {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
                            </div>
                            {i < 4 && (
                                <div className={`h-1 flex-grow mx-2 rounded-full transition-all ${step > i ? 'bg-primary-600' : 'bg-slate-200'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-slate-200">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Confidentiality Charter */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <ShieldCheck className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-2xl font-bold">{t('complaint.steps.confidentialityCharter')}</h2>
                                    <p className="text-slate-600">{t('complaint.steps.charterSubtitle')}</p>
                                </div>

                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 max-h-60 overflow-y-auto text-sm text-slate-600 leading-relaxed">
                                    <p className="mb-4">{t('complaint.charter.intro')}</p>
                                    <p className="mb-4">{t('complaint.charter.anonymity')}</p>
                                    <p className="mb-4">{t('complaint.charter.dataUse')}</p>
                                    <p className="mb-4">{t('complaint.charter.security')}</p>
                                    <p>{t('complaint.charter.confirm')}</p>
                                </div>

                                <form onSubmit={handleCharterSubmit} className="space-y-6">
                                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-white border border-slate-200 rounded-xl hover:border-primary-500 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 accent-primary-600"
                                            checked={charterAccepted}
                                            onChange={(e) => setCharterAccepted(e.target.checked)}
                                            required
                                        />
                                        <span className="font-medium text-slate-700">{t('complaint.steps.acceptCharter')}</span>
                                    </label>
                                    <button
                                        type="submit"
                                        disabled={!charterAccepted}
                                        className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {t('complaint.steps.continue')}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 2: Email & Captcha Verification */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-2xl font-bold">{t('complaint.steps.securityVerification')}</h2>
                                    <p className="text-slate-600">{t('complaint.steps.emailCaptchaSubtitle')}</p>
                                </div>

                                {!sentOtp ? (
                                    <form onSubmit={handleEmailCaptchaSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.steps.emailLabel')}</label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="input-field"
                                                placeholder={t('complaint.steps.emailPlaceholder')}
                                            />
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-slate-100">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.steps.captchaLabel')}</label>
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="flex items-center gap-4 bg-slate-100 p-6 rounded-2xl border-2 border-dashed border-slate-300 select-none w-full justify-center">
                                                    <span className="text-3xl font-mono font-bold tracking-[0.5em] text-slate-800 italic transform skew-x-12">
                                                        {captchaVal}
                                                    </span>
                                                    <button type="button" onClick={generateCaptcha} className="text-primary-600 hover:rotate-180 transition-transform duration-500">
                                                        <RefreshCw className="w-6 h-6" />
                                                    </button>
                                                </div>

                                                <input
                                                    type="text"
                                                    placeholder={t('complaint.steps.captchaInputPlaceholder')}
                                                    value={userInputCaptcha}
                                                    onChange={(e) => setUserInputCaptcha(e.target.value)}
                                                    className={`input-field text-center text-xl tracking-widest uppercase font-bold px-4 ${captchaError ? 'border-rose-500 ring-2 ring-rose-500/20' : ''}`}
                                                    required
                                                />
                                                {captchaError && <p className="text-rose-500 text-sm">{t('complaint.steps.captchaError')}</p>}
                                            </div>
                                        </div>

                                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg">
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('complaint.steps.sendVerificationCode')}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleOtpVerify} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.steps.otpLabel')}</label>
                                            <input
                                                type="text"
                                                required
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                className="input-field text-center text-2xl tracking-[0.2em] font-bold"
                                                placeholder={t('complaint.steps.otpPlaceholder')}
                                                maxLength={6}
                                            />
                                        </div>
                                        <button type="submit" className="btn-primary w-full py-4">{t('complaint.steps.verifyProceed')}</button>
                                        <button type="button" onClick={() => setSentOtp('')} className="text-primary-600 w-full text-sm font-medium">{t('complaint.steps.resetEmail')}</button>
                                    </form>
                                )}
                            </motion.div>
                        )}

                        {/* Step 3: Actual Form */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold capitalize">{t('complaint.steps.formTitle')} - {getTypeLabel()}</h2>
                                    <p className="text-slate-600">{t('complaint.steps.formSubtitle')}</p>
                                </div>

                                <form onSubmit={handleFormSubmit} className="space-y-6">


                                    {/* Client Form */}
                                    {type === 'client' && (
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.fullName')}</label>
                                                <input type="text" required className="input-field" placeholder={t('complaint.fields.fullNamePlaceholder')} value={formData.fullName} onChange={(e) => setFormData((prev) => ({ ...prev, fullName: sanitizeName(e.target.value) }))} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.company')}</label>
                                                <input type="text" className="input-field" placeholder={t('complaint.fields.companyPlaceholder')} value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.email')}</label>
                                                <input type="email" readOnly className="input-field bg-slate-50 cursor-not-allowed" value={email} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.phone')}</label>
                                                <input type="tel" inputMode="numeric" required className="input-field" placeholder={t('complaint.fields.phonePlaceholder')} value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: sanitizePhone(e.target.value) }))} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.orderNumber')}</label>
                                                <input type="text" className="input-field" placeholder={t('complaint.fields.orderNumberPlaceholder')} value={formData.orderNumber} onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.incidentDateTime')}</label>
                                                <input type="datetime-local" required min="2026-01-01T00:00" className="input-field" value={formData.incidentDate} onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.departmentConcerned')}</label>
                                                <select className="input-field" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                                                    <option value="">{t('complaint.fields.departmentSelect')}</option>
                                                    <option value="commercial">{t('complaint.options.departmentsClient.commercial')}</option>
                                                    <option value="finance">{t('complaint.options.departmentsClient.finance')}</option>
                                                    <option value="logistique">{t('complaint.options.departmentsClient.logistique')}</option>
                                                    <option value="autre">{t('complaint.options.departmentsClient.autre')}</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.relationType')}</label>
                                                <select className="input-field" value={formData.relationType} onChange={(e) => setFormData({ ...formData, relationType: e.target.value })}>
                                                    <option value="">{t('complaint.fields.relationTypeSelect')}</option>
                                                    <option value="client-direct">{t('complaint.options.relationTypes.clientDirect')}</option>
                                                    <option value="client-indirect">{t('complaint.options.relationTypes.clientIndirect')}</option>
                                                    <option value="distributor">{t('complaint.options.relationTypes.distributor')}</option>
                                                    <option value="retailer">{t('complaint.options.relationTypes.retailer')}</option>
                                                    <option value="other">{t('complaint.options.relationTypes.other')}</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {/* Employee Form */}
                                    {type === 'employee' && (
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.employeeId')}</label>
                                                <input type="text" required className="input-field" placeholder={t('complaint.fields.employeeIdPlaceholder')} value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.professionalEmail')}</label>
                                                <input type="email" readOnly className="input-field bg-slate-50 cursor-not-allowed" value={email} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.department')}</label>
                                                <select className="input-field" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                                                    <option value="">{t('complaint.fields.departmentSelect')}</option>
                                                    <option value="rh">{t('complaint.options.departmentsEmployee.rh')}</option>
                                                    <option value="it">{t('complaint.options.departmentsEmployee.it')}</option>
                                                    <option value="production">{t('complaint.options.departmentsEmployee.production')}</option>
                                                    <option value="maintenance">{t('complaint.options.departmentsEmployee.maintenance')}</option>
                                                    <option value="finance">{t('complaint.options.departmentsEmployee.finance')}</option>
                                                    <option value="autre">{t('complaint.options.departmentsEmployee.autre')}</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.position')}</label>
                                                <input type="text" className="input-field" placeholder={t('complaint.fields.positionPlaceholder')} value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.supervisor')}</label>
                                                <input type="text" className="input-field" placeholder={t('complaint.fields.supervisorPlaceholder')} value={formData.supervisor} onChange={(e) => setFormData((prev) => ({ ...prev, supervisor: sanitizeName(e.target.value) }))} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.incidentDateTime')}</label>
                                                <input type="datetime-local" required min="2026-01-01T00:00" className="input-field" value={formData.incidentDate} onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.location')}</label>
                                                <input type="text" className="input-field" placeholder={t('complaint.fields.locationPlaceholder')} value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.personsInvolved')}</label>
                                                <input type="text" className="input-field" placeholder={t('complaint.fields.personsInvolvedPlaceholder')} value={formData.personsInvolved} onChange={(e) => setFormData((prev) => ({ ...prev, personsInvolved: sanitizeName(e.target.value) }))} />
                                            </div>
                                        </div>
                                    )}

                                    {/* External Form */}
                                    {type === 'external' && (
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.fullName')}</label>
                                                <input type="text" required className="input-field" placeholder={t('complaint.fields.fullNamePlaceholder')} value={formData.fullName} onChange={(e) => setFormData((prev) => ({ ...prev, fullName: sanitizeName(e.target.value) }))} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.email')}</label>
                                                <input type="email" readOnly className="input-field bg-slate-50 cursor-not-allowed" value={email} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.phone')}</label>
                                                <input type="tel" inputMode="numeric" className="input-field" placeholder={t('complaint.fields.phonePlaceholder')} value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: sanitizePhone(e.target.value) }))} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.incidentDateTime')}</label>
                                                <input type="datetime-local" required min="2026-01-01T00:00" className="input-field" value={formData.incidentDate} onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.schbDepartment')}</label>
                                                <select className="input-field" value={formData.schbDepartment} onChange={(e) => setFormData({ ...formData, schbDepartment: e.target.value })}>
                                                    <option value="">{t('complaint.fields.departmentSelect')}</option>
                                                    <option value="achats">{t('complaint.options.schbDepartmentsExternal.achats')}</option>
                                                    <option value="logistique">{t('complaint.options.schbDepartmentsExternal.logistique')}</option>
                                                    <option value="dg">{t('complaint.options.schbDepartmentsExternal.dg')}</option>
                                                    <option value="autre">{t('complaint.options.schbDepartmentsExternal.autre')}</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.personsInvolved')}</label>
                                                <input type="text" className="input-field" placeholder={t('complaint.fields.personsInvolvedPlaceholder')} value={formData.personsInvolved} onChange={(e) => setFormData((prev) => ({ ...prev, personsInvolved: sanitizeName(e.target.value) }))} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Description (Common) */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.description')}</label>
                                        <textarea
                                            required
                                            rows={5}
                                            placeholder={t('complaint.fields.descriptionPlaceholder')}
                                            className="input-field resize-none"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        ></textarea>
                                    </div>

                                    {/* File Evidence (Common) */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">{t('complaint.fields.evidence')}</label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-2xl hover:border-primary-400 transition-colors">
                                            <div className="space-y-1 text-center">
                                                <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="flex text-sm text-slate-600">
                                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                                        <span>{t('complaint.fields.uploadFile')}</span>
                                                        <input type="file" className="sr-only" onChange={handleFileChange} />
                                                    </label>
                                                    <p className="pl-1">{t('complaint.fields.orDragDrop')}</p>
                                                </div>
                                                <p className="text-xs text-slate-500">{t('complaint.fields.fileHint')}</p>
                                                {formData.evidence && <p className="text-sm text-emerald-600 font-medium">{t('complaint.fields.selected')}: {formData.evidence}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Conditional Anonymous Submission & Employee Follow-up */}
                                    <div className="space-y-4">


                                    </div>

                                    <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-6 h-6" /> {t('complaint.steps.submitReport')}</>}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 4: Success */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('complaint.steps.submittedTitle')}</h2>
                                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                    {t('complaint.steps.submittedSubtitle')}
                                </p>

                                <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 mb-6 inline-block w-full max-w-sm">
                                    <p className="text-primary-700 text-sm font-bold uppercase tracking-wider mb-2">{t('complaint.steps.referenceId')}</p>
                                    <div className="flex items-center justify-center gap-3">
                                        <p className="text-2xl sm:text-3xl font-mono font-black text-primary-900">{submissionId}</p>
                                        <button
                                            onClick={handleCopy}
                                            className={`p-2 rounded-lg transition-all ${copied ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-primary-600 hover:bg-primary-100 shadow-sm border border-primary-200'}`}
                                            title={t('complaint.steps.copy')}
                                        >
                                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <p className="mt-4 text-xs font-semibold text-primary-600 bg-white/50 py-2 px-3 rounded-lg border border-primary-100">
                                        {t('complaint.steps.saveReferenceNote')}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => navigate('/track')}
                                        className="btn-primary w-full"
                                    >
                                        {t('complaint.steps.trackStatus')}
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full text-slate-500 font-medium hover:text-slate-800 transition-colors"
                                    >
                                        {t('complaint.steps.backHome')}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ComplaintFormPage;
