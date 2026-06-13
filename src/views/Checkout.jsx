import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  CreditCard, ShieldCheck, CheckCircle2, Printer, 
  ArrowLeft, ArrowRight, AlertTriangle, Send, ShieldAlert,
  Smartphone, Lock, Key, Copy, RefreshCw
} from 'lucide-react';
import { getInsurerLogo } from '../components/Insurers';

export default function Checkout({ selectedQuote, queryData, setActiveView }) {
  const { t, isRTL, lang } = useLanguage();

  // Steps: 1 (Details) | 2 (Payment) | 3 (Success)
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Customer Info Inputs
  const [mobileNumber, setMobileNumber] = useState('0549204928');
  const [emailAddress, setEmailAddress] = useState('mohand@example.com');
  const [ibanNumber, setIbanNumber] = useState('SA1280000000492049281920');

  // Step 2: Payment Inputs
  const [paymentMethod, setPaymentMethod] = useState('mada'); // 'mada' | 'sadad' | 'card'
  const [sadadCode, setSadadCode] = useState('');
  const [cardNumber, setCardNumber] = useState('4574 8920 4920 1928');
  const [cardName, setCardName] = useState('Mohand Al-Harbi');
  const [cardExpiry, setCardExpiry] = useState('12/29');
  const [cardCvv, setCardCvv] = useState('123');

  // Verification & Loader States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('1234'); // default for easy checkout simulation
  const [otpInput, setOtpInput] = useState('');
  const [policyLoading, setPolicyLoading] = useState(false);
  const [policyId, setPolicyId] = useState('');
  const [error, setError] = useState('');

  // Auto-format card numbers with spaces
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < val.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += val[i];
    }
    setCardNumber(formatted.substring(0, 19));
  };

  // Auto-format expiry dates with slashes
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      setCardExpiry(val.substring(0, 2) + '/' + val.substring(2, 4));
    } else {
      setCardExpiry(val);
    }
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setError('');

    // Mobile validation: starts with 05, 10 digits total
    if (!/^05\d{8}$/.test(mobileNumber)) {
      setError(lang === 'ar' ? 'رقم الجوال غير صحيح، يجب أن يبدأ بـ 05 ويتكون من 10 أرقام' : 'Invalid mobile number, must start with 05 and be 10 digits');
      return;
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(emailAddress)) {
      setError(lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
      return;
    }

    // IBAN validation: starts with SA, 24 characters total
    const cleanIban = ibanNumber.replace(/\s+/g, '').toUpperCase();
    if (!/^SA\d{22}$/.test(cleanIban)) {
      setError(lang === 'ar' ? 'رقم الآيبان IBAN غير صحيح، يجب أن يبدأ بـ SA ويتكون من 24 خانة' : 'Invalid Saudi IBAN, must start with SA and be 24 characters');
      return;
    }

    setCurrentStep(2);
  };

  const handleProceedPayment = (e) => {
    e.preventDefault();
    setError('');

    if (paymentMethod !== 'sadad') {
      const cleanCard = cardNumber.replace(/\s+/g, '');
      if (cleanCard.length < 16) {
        setError(lang === 'ar' ? 'رقم بطاقة الصراف غير مكتمل' : 'Card number incomplete');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setError(lang === 'ar' ? 'تاريخ انتهاء البطاقة غير صحيح (MM/YY)' : 'Invalid expiry format (MM/YY)');
        return;
      }
      if (cardCvv.length < 3) {
        setError(lang === 'ar' ? 'رمز CVV غير صحيح' : 'Invalid CVV code');
        return;
      }
    }

    // Trigger Bank 3D-Secure SMS OTP dialog
    setShowOtpModal(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpInput !== otpCode) {
      alert(lang === 'ar' ? 'رمز التحقق غير صحيح، يرجى المحاولة مرة أخرى' : 'Incorrect verification code');
      return;
    }

    // Close OTP modal & run simulated policy issuance spinner
    setShowOtpModal(false);
    setPolicyLoading(true);

    setTimeout(() => {
      setPolicyLoading(false);
      const newPolicyId = 'POL-' + selectedQuote.key.toUpperCase() + '-' + Math.floor(100000 + Math.random() * 900000);
      setPolicyId(newPolicyId);
      setCurrentStep(3);
    }, 1800);
  };

  const handleSadadClick = () => {
    setPaymentMethod('sadad');
    setSadadCode(Math.floor(100000000000 + Math.random() * 900000000000).toString());
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', backgroundColor: '#F8FAFC' }}>
      
      {/* A. SECURE ISSUANCE SPINNER OVERLAY */}
      {policyLoading && (
        <div className="loader-overlay">
          <div className="loader-spinner" />
          <div className="loader-text">
            {lang === 'ar' ? 'جاري ربط الوثيقة مع نجم وقواعد بيانات المرور...' : 'Registering policy with Najm and Traffic database...'}
          </div>
          <div className="loader-step-bullet">
            {lang === 'ar' ? 'الرجاء الانتظار قليلاً لتوليد الشهادة الرسمية' : 'Generating SAMA-approved PDF certificate'}
          </div>
        </div>
      )}

      <div className="checkout-card">
        
        {/* B. MULTI-STEP PROGRESS STEPPER */}
        <div className="checkout-stepper">
          <div className={`stepper-progress-line`} style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }} />

          <div className={`stepper-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="stepper-circle">1</div>
            <span className="stepper-label">{lang === 'ar' ? 'بيانات الوثيقة' : 'Insurant Info'}</span>
          </div>

          <div className={`stepper-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="stepper-circle">2</div>
            <span className="stepper-label">{lang === 'ar' ? 'بوابة الدفع' : 'Payment'}</span>
          </div>

          <div className={`stepper-step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="stepper-circle">3</div>
            <span className="stepper-label">{lang === 'ar' ? 'إصدار الوثيقة' : 'Issuance'}</span>
          </div>
        </div>

        {error && (
          <div className="error-banner" style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: CUSTOMER REGISTRATION INFO */}
        {currentStep === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="grid-mobile-1">
            
            <form onSubmit={handleStep1Submit} style={{ textAlign: isRTL ? 'right' : 'left' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--secondary-900)', marginBottom: '1.5rem' }}>
                {lang === 'ar' ? 'بيانات المؤمن له الإضافية للتفعيل' : 'Insurant Registration Details'}
              </h3>

              {/* Mobile Number */}
              <div className="form-group">
                <label className="form-label">{lang === 'ar' ? 'رقم الجوال لتلقي وثيقة الـ SMS' : 'Mobile Number (for SMS Certificate)'}</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="05xxxxxxxx"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                />
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label">{lang === 'ar' ? 'البريد الإلكتروني لتلقي الفاتورة' : 'Email Address (for Invoicing)'}</label>
                <input 
                  type="email" 
                  className="form-control"
                  placeholder="example@mail.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </div>

              {/* Refund IBAN */}
              <div className="form-group">
                <label className="form-label">{lang === 'ar' ? 'رقم الآيبان البنكي (للتعويضات والاسترداد)' : 'IBAN Account (for potential refunds)'}</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="SAxxxxxxxxxxxxxxxxxxxx"
                  value={ibanNumber}
                  onChange={(e) => setIbanNumber(e.target.value)}
                  maxLength={24}
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1.5rem', padding: '0.9rem' }}>
                <span>{lang === 'ar' ? 'الاستمرار لبوابة الدفع الآمنة' : 'Continue to Payment Gateway'}</span>
                {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </button>
            </form>

            {/* SIDE BILLING SUMMARY CARD */}
            <div 
              style={{ 
                backgroundColor: '#F8FAFC', 
                borderRadius: '12px', 
                padding: '1.5rem', 
                border: '1px solid var(--border-color)',
                height: 'fit-content',
                textAlign: isRTL ? 'right' : 'left'
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--secondary-900)', marginBottom: '1.25rem' }}>
                {t('policySummary')}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{t('insuranceCompany')}</span>
                  <strong style={{ color: 'var(--secondary-900)' }}>{selectedQuote.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{t('vehicleDetails')}</span>
                  <strong>{lang === 'ar' ? 'مركبة خصوصي مسجلة' : 'Registered Private Vehicle'}</strong>
                </div>
                
                <div style={{ borderBottom: '1px dashed var(--border-color)', margin: '4px 0' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'صافي القسط بعد خصم نجم' : 'Net Premium'}</span>
                  <strong>{(selectedQuote.total - selectedQuote.vat).toLocaleString()} {t('sar')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الضريبة (15%)' : 'VAT (15%)'}</span>
                  <strong>{selectedQuote.vat.toLocaleString()} {t('sar')}</strong>
                </div>

                <div style={{ borderBottom: '1px dashed var(--border-color)', margin: '4px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '850', color: 'var(--primary-500)', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span>{t('totalAmount')}</span>
                  <span>{selectedQuote.total.toLocaleString()} {t('sar')}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: GATEWAY SELECTOR & INPUT VALIDATIONS */}
        {currentStep === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="grid-mobile-1">
            
            <form onSubmit={handleProceedPayment} style={{ textAlign: isRTL ? 'right' : 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--secondary-900)' }}>
                  {t('checkoutTitle')}
                </h3>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setCurrentStep(1)}
                  style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                >
                  {t('back')}
                </button>
              </div>

              {/* Payment Methods toggle */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  className={`btn ${paymentMethod === 'mada' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '10px 4px', fontSize: '0.78rem' }}
                  onClick={() => setPaymentMethod('mada')}
                >
                  {t('mada')}
                </button>
                <button
                  type="button"
                  className={`btn ${paymentMethod === 'sadad' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '10px 4px', fontSize: '0.78rem' }}
                  onClick={handleSadadClick}
                >
                  {t('sadad')}
                </button>
                <button
                  type="button"
                  className={`btn ${paymentMethod === 'card' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '10px 4px', fontSize: '0.78rem' }}
                  onClick={() => setPaymentMethod('card')}
                >
                  {t('creditCard')}
                </button>
              </div>

              {paymentMethod === 'sadad' ? (
                /* SADAD Invoice Details display */
                <div style={{ border: '1px dashed var(--primary-500)', backgroundColor: 'var(--primary-100)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>
                    {t('sadadBillCode')}
                  </span>
                  <strong style={{ fontSize: '1.75rem', color: 'var(--secondary-900)', fontFamily: 'monospace', display: 'block', margin: '6px 0' }}>
                    {sadadCode}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-500)', fontWeight: '700' }}>
                    {t('sadadBillerInfo')}
                  </span>
                </div>
              ) : (
                /* Credit Card inputs */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">{t('cardNumber')}</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="4574 **** **** ****"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('cardName')}</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">{t('cardExpiry')}</label>
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        maxLength={5}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input 
                        type="password" 
                        className="form-control"
                        placeholder="***"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '12px', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '600', marginBottom: '1.5rem', border: '1px solid #a7f3d0' }}>
                <ShieldCheck size={18} style={{ flexShrink: 0 }} />
                <span>
                  {lang === 'ar' 
                    ? 'اتصال آمن ومحمي بالكامل بمعايير تشفير مصرفية عالمية معتمدة.'
                    : 'Encrypted bank-grade connection certified under SAMA policies.'}
                </span>
              </div>

              <button type="submit" className="btn btn-primary btn-block" style={{ padding: '0.9rem' }}>
                {t('btnPay')}
              </button>
            </form>

            {/* SIDE BILLING SUMMARY CARD */}
            <div 
              style={{ 
                backgroundColor: '#F8FAFC', 
                borderRadius: '12px', 
                padding: '1.5rem', 
                border: '1px solid var(--border-color)',
                height: 'fit-content',
                textAlign: isRTL ? 'right' : 'left'
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--secondary-900)', marginBottom: '1.25rem' }}>
                {t('policySummary')}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{t('insuranceCompany')}</span>
                  <strong style={{ color: 'var(--secondary-900)' }}>{selectedQuote.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الجوال المستهدف' : 'Target Mobile'}</span>
                  <strong>{mobileNumber}</strong>
                </div>
                
                <div style={{ borderBottom: '1px dashed var(--border-color)', margin: '4px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '850', color: 'var(--primary-500)', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span>{t('totalAmount')}</span>
                  <span>{selectedQuote.total.toLocaleString()} {t('sar')}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: SUCCESS ISSUING PDF POLICY */}
        {currentStep === 3 && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ 
              backgroundColor: 'var(--success-light)', 
              color: 'var(--success)', 
              width: '75px', 
              height: '75px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <CheckCircle2 size={44} />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--secondary-900)', marginBottom: '8px' }}>
              {t('issueSuccess')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 1.5rem auto', fontSize: '0.88rem' }}>
              {t('smsNotice')}
            </p>

            {/* PRINTABLE OFFICIAL POLICY CONTAINER CARD */}
            <div 
              style={{ 
                border: '1.5px solid var(--border-color)', 
                borderRadius: '12px', 
                padding: '2rem', 
                maxWidth: '650px', 
                margin: '0 auto 2.5rem auto',
                backgroundColor: 'white',
                boxShadow: '0 8px 25px rgba(0,0,0,0.02)',
                textAlign: isRTL ? 'right' : 'left'
              }}
            >
              {/* Official Stamp badge row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  {getInsurerLogo(selectedQuote.key, 36)}
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--secondary-900)' }}>{selectedQuote.name}</span>
                </div>
                <div style={{ border: '2px solid var(--success)', color: 'var(--success)', padding: '3px 10px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase' }}>
                  {lang === 'ar' ? 'نشط ومسجل نجم' : 'ACTIVE & REGISTERED'}
                </div>
              </div>

              {/* Policy Table details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>{t('policyNo')}</span>
                  <strong style={{ fontSize: '0.95rem', fontFamily: 'monospace' }}>{policyId}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>{lang === 'ar' ? 'الرقم التسلسلي للمركبة' : 'Vehicle Serial Code'}</span>
                  <strong style={{ fontSize: '0.95rem', fontFamily: 'monospace' }}>{queryData?.serialNumber}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>{lang === 'ar' ? 'تاريخ بدء التغطية' : 'Effective Date'}</span>
                  <strong>{queryData?.selectedDate}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>{lang === 'ar' ? 'نوع التغطية الصادرة' : 'Cover Type Issued'}</span>
                  <strong>{selectedQuote.coverType === 'comprehensive' ? t('comprehensive') : t('tpl')}</strong>
                </div>
              </div>

              {/* QR Code simulating verification */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  {/* Visual simulated QR code box */}
                  <div style={{ width: '80px', height: '80px', border: '1px solid #CBD5E1', padding: '4px', margin: '0 auto 6px auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }}>
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} style={{ backgroundColor: Math.random() > 0.5 ? '#1E293B' : 'white' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'امسح للتحقق المباشر بالمرور' : 'Scan for live SAMA Verification'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', maxWidth: '480px', margin: '0 auto' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => window.print()}
                style={{ flex: 1 }}
              >
                <Printer size={16} />
                <span>{t('certificatePdf')}</span>
              </button>

              <button 
                className="btn btn-primary" 
                onClick={() => setActiveView('home')}
                style={{ flex: 1 }}
              >
                {t('backHome')}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* C. BANK 3D-SECURE OTP SIMULATION DIALOG */}
      {showOtpModal && (
        <div className="modal-backdrop" style={{ zIndex: 600 }}>
          <div className="modal-content" style={{ maxWidth: '400px', padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-500)', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', margin: '0 auto 10px auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Lock size={26} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--secondary-900)' }}>
                {lang === 'ar' ? 'رمز الأمان الثنائي لبنك المؤمن له' : 'Secure 3D-Secure Verification'}
              </h3>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              {lang === 'ar' 
                ? `تم إرسال كود تحقق مؤقت (OTP) إلى رقم جوالك المسجل بالخدمة (${mobileNumber}). يرجى إدخال الرمز لتأكيد السداد.`
                : `Enter the 4-digit verification code sent to your registered mobile (${mobileNumber}) to complete the checkout.`}
            </p>

            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <input 
                  type="text"
                  className="form-control"
                  placeholder="****"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  maxLength={4}
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '10px', fontFamily: 'monospace', fontWeight: '800' }}
                />
              </div>

              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', textAlign: 'center' }}>
                {lang === 'ar' ? `الرمز التجريبي الافتراضي للدفع هو: ${otpCode}` : `Default demo checkout passcode is: ${otpCode}`}
              </span>

              <button type="submit" className="btn btn-primary btn-block" style={{ padding: '10px' }}>
                {lang === 'ar' ? 'تأكيد السداد وإصدار الوثيقة' : 'Confirm & Purchase'}
              </button>

              <button 
                type="button" 
                className="btn btn-secondary btn-block" 
                onClick={() => setShowOtpModal(false)}
                style={{ padding: '8px' }}
              >
                {lang === 'ar' ? 'إلغاء العملية' : 'Cancel Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .grid-mobile-1 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
