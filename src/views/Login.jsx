import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from '../components/Logo';
import { RefreshCw, Lock, Mail, CreditCard, Phone, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

export default function Login() {
  const { loginWithPassword, sendOTP, verifyOTP, otpSent, setOtpSent, loading } = useAuth();
  const { t, lang, toggleLanguage, isRTL } = useLanguage();

  // Tab State: 'password' | 'otp'
  const [activeTab, setActiveTab] = useState('password');
  
  // Field States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [mobile, setMobile] = useState('');
  
  // Captcha
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  
  // OTP Verification Code input
  const [otpVal, setOtpVal] = useState('');

  // Errors
  const [error, setError] = useState('');

  // Regenerate Captcha
  const generateCaptcha = () => {
    const chars = '0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
  };

  const validateID = (id) => {
    // Saudi ID: 10 digits starting with 1 (National) or 2 (Iqama)
    return /^[12]\d{9}$/.test(id);
  };

  const validateMobile = (num) => {
    // Saudi Mobile: 10 digits starting with 05
    return /^05\d{8}$/.test(num);
  };

  // Submit password login
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !captchaInput) {
      setError(t('errEmpty'));
      return;
    }

    if (captchaInput !== captchaCode) {
      setError(t('errCaptcha'));
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    const res = await loginWithPassword(username, password);
    if (!res.success) {
      setError(t(res.error));
      generateCaptcha();
    }
  };

  // Request OTP
  const handleOTPRequest = async (e) => {
    e.preventDefault();
    setError('');

    if (!nationalId || !mobile || !captchaInput) {
      setError(t('errEmpty'));
      return;
    }

    if (!validateID(nationalId)) {
      setError(t('errID'));
      return;
    }

    if (!validateMobile(mobile)) {
      setError(t('errMobile'));
      return;
    }

    if (captchaInput !== captchaCode) {
      setError(t('errCaptcha'));
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    const res = await sendOTP(nationalId, mobile);
    if (res.success) {
      setCaptchaInput('');
    }
  };

  // Submit OTP Verification
  const handleOTPVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (!otpVal) {
      setError(t('errEmpty'));
      return;
    }

    if (otpVal.length !== 4) {
      setError(t('errOTP'));
      return;
    }

    const res = await verifyOTP(otpVal);
    if (!res.success) {
      setError(t(res.error));
    }
  };

  return (
    <div className="auth-wrapper animate-fade-in">
      {/* Right/Left Branding sidebar depending on lang */}
      <div className="auth-sidebar" style={{ order: isRTL ? 2 : 1 }}>
        <div>
          <Logo light={true} size="large" />
          <h2 style={{ fontSize: '2rem', marginTop: '2.5rem', fontWeight: '800', lineHeight: '1.2' }}>
            {lang === 'ar' ? 'بوابة الوكلاء والشركاء الذكية' : 'Smart Broker & Partner Portal'}
          </h2>
          <p style={{ marginTop: '1rem', color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            {lang === 'ar' 
              ? 'أصدر وثائق التأمين لعملائك بكل سهولة وسرعة، تابع عمولاتك، وقم بإدارة المطالبات في منصة رقمية موحدة.'
              : 'Issue insurance policies instantly, manage commissions, and track customer claims in a single digital workspace.'}
          </p>
        </div>

        {/* Feature badges list inside sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '2rem 0' }}>
          {[
            { titleAr: 'حساب أقساط فوري', titleEn: 'Instant Premium Calculation', descAr: 'تأمين السيارات والطبي في دقائق', descEn: 'Motor & health quotes in minutes' },
            { titleAr: 'بوابة دفع آمنة للعملاء', titleEn: 'Secure Customer Payment', descAr: 'إرسال روابط السداد بنقرة واحدة', descEn: 'Send pay links directly via SMS' },
            { titleAr: 'نظام عمولات فوري', titleEn: 'Instant Commission System', descAr: 'تتبع أرباحك واسحبها لحسابك الراجحي', descEn: 'Track earnings and withdraw directly' }
          ].map((item, idx) => (
            <div key={idx} className="dark-glass-card" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ 
                backgroundColor: 'rgba(212, 175, 55, 0.2)', 
                color: '#D4AF37', 
                width: '36px', 
                height: '36px', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'white' }}>
                  {lang === 'ar' ? item.titleAr : item.titleEn}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                  {lang === 'ar' ? item.descAr : item.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
          <p>{t('copyright')}</p>
        </div>
      </div>

      {/* Main Login form block */}
      <div className="auth-container" style={{ order: isRTL ? 1 : 2 }}>
        {/* Top Header Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isRTL ? <div /> : <Logo size="small" className="visible-mobile" style={{ display: 'none' }} />}
          <button 
            className="btn btn-secondary" 
            onClick={toggleLanguage} 
            style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', borderRadius: '20px' }}
          >
            {t('langToggle')}
          </button>
          {isRTL ? <Logo size="small" className="visible-mobile" style={{ display: 'none' }} /> : <div />}
        </div>

        {/* Auth Box Form Container */}
        <div style={{ maxWidth: '420px', width: '100%', margin: 'auto', padding: '2rem 0' }}>
          <div style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary-800)' }}>
              {otpSent ? t('enterOTP') : t('loginTitle')}
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.95rem' }}>
              {otpSent ? t('enterOTPPlaceholder') : t('loginSub')}
            </p>
          </div>

          {error && (
            <div className="error-banner">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {!otpSent ? (
            /* Choose Auth Mode Form: Password vs OTP */
            <div>
              <div className="tabs-container">
                <div 
                  className={`tab ${activeTab === 'password' ? 'active' : ''}`}
                  onClick={() => handleTabChange('password')}
                >
                  {t('tabPassword')}
                </div>
                <div 
                  className={`tab ${activeTab === 'otp' ? 'active' : ''}`}
                  onClick={() => handleTabChange('otp')}
                >
                  {t('tabOTP')}
                </div>
              </div>

              {activeTab === 'password' ? (
                /* Username/Password Mode Form */
                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label className="form-label">{t('usernameLabel')}</label>
                    <div style={{ position: 'relative' }}>
                      <Mail 
                        size={18} 
                        style={{ 
                          position: 'absolute', 
                          top: '50%', 
                          transform: 'translateY(-50%)', 
                          [isRTL ? 'left' : 'right']: '1rem',
                          color: 'var(--text-secondary)'
                        }} 
                      />
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder={t('usernamePlaceholder')}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ [isRTL ? 'paddingLeft' : 'paddingRight']: '2.5rem' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('passwordLabel')}</label>
                    <div style={{ position: 'relative' }}>
                      <Lock 
                        size={18} 
                        style={{ 
                          position: 'absolute', 
                          top: '50%', 
                          transform: 'translateY(-50%)', 
                          [isRTL ? 'left' : 'right']: '1rem',
                          color: 'var(--text-secondary)'
                        }} 
                      />
                      <input 
                        type="password" 
                        className="form-control" 
                        placeholder={t('passwordPlaceholder')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ [isRTL ? 'paddingLeft' : 'paddingRight']: '2.5rem' }}
                      />
                    </div>
                  </div>

                  {/* Captcha Block */}
                  <div className="form-group">
                    <label className="form-label">{t('captchaLabel')}</label>
                    <div className="captcha-box">
                      <div className="captcha-image">{captchaCode}</div>
                      <button type="button" className="captcha-refresh" onClick={generateCaptcha}>
                        <RefreshCw size={18} />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder={t('captchaPlaceholder')}
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      maxLength={4}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input type="checkbox" style={{ accentColor: 'var(--primary-500)' }} />
                      <span>{t('rememberMe')}</span>
                    </label>
                    <a href="#forgot" style={{ color: 'var(--primary-500)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
                      {t('forgotPassword')}
                    </a>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    {loading ? t('verifying') : t('loginBtn')}
                  </button>
                </form>
              ) : (
                /* National ID/OTP Request Mode Form */
                <form onSubmit={handleOTPRequest}>
                  <div className="form-group">
                    <label className="form-label">{t('idLabel')}</label>
                    <div style={{ position: 'relative' }}>
                      <CreditCard 
                        size={18} 
                        style={{ 
                          position: 'absolute', 
                          top: '50%', 
                          transform: 'translateY(-50%)', 
                          [isRTL ? 'left' : 'right']: '1rem',
                          color: 'var(--text-secondary)'
                        }} 
                      />
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder={t('idPlaceholder')}
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        maxLength={10}
                        style={{ [isRTL ? 'paddingLeft' : 'paddingRight']: '2.5rem' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('mobileLabel')}</label>
                    <div style={{ position: 'relative' }}>
                      <Phone 
                        size={18} 
                        style={{ 
                          position: 'absolute', 
                          top: '50%', 
                          transform: 'translateY(-50%)', 
                          [isRTL ? 'left' : 'right']: '1rem',
                          color: 'var(--text-secondary)'
                        }} 
                      />
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder={t('mobilePlaceholder')}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        maxLength={10}
                        style={{ [isRTL ? 'paddingLeft' : 'paddingRight']: '2.5rem' }}
                      />
                    </div>
                  </div>

                  {/* Captcha Block */}
                  <div className="form-group">
                    <label className="form-label">{t('captchaLabel')}</label>
                    <div className="captcha-box">
                      <div className="captcha-image">{captchaCode}</div>
                      <button type="button" className="captcha-refresh" onClick={generateCaptcha}>
                        <RefreshCw size={18} />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder={t('captchaPlaceholder')}
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      maxLength={4}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }} disabled={loading}>
                    {loading ? t('verifying') : t('otpBtn')}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* OTP Code Verification Form */
            <form onSubmit={handleOTPVerify}>
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-control text-center" 
                  placeholder={t('enterOTPPlaceholder')}
                  value={otpVal}
                  onChange={(e) => setOtpVal(e.target.value)}
                  maxLength={4}
                  style={{ fontSize: '1.75rem', letterSpacing: '8px', fontWeight: 'bold' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {t('resendOTP')} 59s
                </span>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setOtpSent(false)}
                  style={{ display: 'inline-flex', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem' }}
                >
                  {isRTL ? <ArrowRight size={14} style={{ marginLeft: '4px' }} /> : <ArrowLeft size={14} style={{ marginRight: '4px' }} />}
                  {t('back')}
                </button>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? t('verifying') : t('verifyOTPBtn')}
              </button>
            </form>
          )}

          {/* Broker registration note */}
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <a href="#register" style={{ color: 'var(--primary-800)', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem', borderBottom: '1px solid var(--primary-800)' }}>
              {t('partnerRegister')}
            </a>
          </div>
        </div>

        {/* Footer text */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: 'auto' }}>
          <p>{t('copyright')}</p>
        </div>
      </div>
    </div>
  );
}
