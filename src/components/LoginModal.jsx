import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/* ── OTP 4-box ─────────────────────────────────────────────── */
function OtpInput({ value, onChange, refs, hasError }) {
  const handleChange = (idx, raw) => {
    if (!/^\d*$/.test(raw)) return;
    const digit = raw.slice(-1);
    const next = [...value];
    next[idx] = digit;
    onChange(next);
    if (digit && idx < 3) {
      setTimeout(() => refs[idx + 1].current?.focus(), 10);
    }
  };
  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...value];
      if (value[idx]) {
        next[idx] = '';
        onChange(next);
      } else if (idx > 0) {
        next[idx - 1] = '';
        onChange(next);
        refs[idx - 1].current?.focus();
      }
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;
    const next = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    onChange(next);
    const focusIdx = Math.min(pasted.length, 3);
    refs[focusIdx].current?.focus();
  };
  return (
    /* dir="ltr" isolated so boxes go left-to-right regardless of page RTL */
    <div className="flex gap-3 justify-center" dir="ltr">
      {value.map((digit, idx) => (
        <input
          key={idx}
          ref={refs[idx]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          autoComplete="one-time-code"
          value={digit}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          className={`
            w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl
            focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all
            ${hasError
              ? 'border-red-400 bg-red-50 text-red-600'
              : digit
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-slate-200 focus:border-primary text-slate-900'}
          `}
        />
      ))}
    </div>
  );
}

/* ── Error alert ─────────────────────────────────────────────── */
function ErrBox({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 animate-fade-in">
      <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {msg}
    </div>
  );
}

/* ── Primary button ─────────────────────────────────────────── */
function PrimaryBtn({ loading, label, spinLabel, disabled, onClick, type = 'submit' }) {
  return (
    <button type={type} onClick={onClick} disabled={loading || disabled}
      className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm
                 hover:bg-primary/90 active:bg-primary/80 transition-colors
                 disabled:opacity-60 flex items-center justify-center gap-2">
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {spinLabel}
        </>
      ) : label}
    </button>
  );
}

/* ── Success screen ─────────────────────────────────────────── */
function SuccessScreen({ title, desc, btnLabel, onBtn }) {
  return (
    <div className="flex flex-col items-center gap-5 py-6 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
          stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
      </div>
      <button onClick={onBtn}
        className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors">
        {btnLabel}
      </button>
    </div>
  );
}

/* ── OTP verification screen ─────────────────────────────────── */
function OtpScreen({ maskedMobile, otpVal, setOtpVal, refs,
  onVerify, onResend, onBack, err, loading, countdown, backLabel }) {
  return (
    <div className="flex flex-col gap-5">
      {/* icon + heading */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
            stroke="#0088EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
        </div>
        <h3 className="font-bold text-slate-900 text-base mb-1">أدخل رمز التحقق</h3>
        <p className="text-sm text-slate-500">
          تم إرسال رمز مكوّن من 4 أرقام إلى الجوال المنتهي بـ{' '}
          <span className="font-bold text-slate-800" dir="ltr">****{maskedMobile}</span>
        </p>
      </div>

      <form onSubmit={onVerify} className="flex flex-col gap-4">
        <OtpInput value={otpVal} onChange={setOtpVal} refs={refs} hasError={!!err} />
        <ErrBox msg={err} />
        <PrimaryBtn loading={loading} label="تأكيد" spinLabel="جاري التحقق..."
          disabled={otpVal.join('').length < 4} />

        <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
          <span className="text-slate-500">لم يصلك الرمز؟</span>
          <button type="button" onClick={onResend} disabled={countdown > 0}
            className="text-primary font-semibold hover:underline disabled:text-slate-400">
            {countdown > 0 ? `إعادة الإرسال (${countdown}ث)` : 'إعادة الإرسال'}
          </button>
        </div>

        <button type="button" onClick={onBack}
          className="text-center text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← {backLabel}
        </button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function LoginModal({ isOpen, onClose, onLoginSuccess, lang }) {
  const [tab, setTab] = useState('login');

  /* ── Login state ── */
  const [loginType, setLoginType] = useState('individual');
  const [lStep, setLStep]   = useState(1);
  const [lId, setLId]       = useState('');
  const [lMobile, setLMobile] = useState('');
  const [lOtp, setLOtp]     = useState(['', '', '', '']);
  const [lOtpGen, setLOtpGen] = useState('');
  const [lErr, setLErr]     = useState('');
  const [lLoading, setLLoading] = useState(false);
  const [lCount, setLCount] = useState(0);
  const lRefs = [useRef(), useRef(), useRef(), useRef()];

  /* ── Register state ── */
  const [rStep, setRStep]     = useState(1);
  const [rId, setRId]         = useState('');
  const [rMobile, setRMobile] = useState('');
  const [rEmail, setREmail]   = useState('');
  const [rAgree, setRAgree]   = useState(false);
  const [rOtp, setROtp]       = useState(['', '', '', '']);
  const [rOtpGen, setROtpGen] = useState('');
  const [rErr, setRErr]       = useState('');
  const [rOtpErr, setROtpErr] = useState('');
  const [rLoading, setRLoading]   = useState(false);
  const [rOtpLoading, setROtpLoading] = useState(false);
  const [rCount, setRCount]   = useState(0);
  const rRefs = [useRef(), useRef(), useRef(), useRef()];

  const overlay = useRef();

  /* reset on open */
  useEffect(() => {
    if (!isOpen) return;
    setTab('login'); setLoginType('individual');
    setLStep(1); setLId(''); setLMobile(''); setLOtp(['','','','']);
    setLOtpGen(''); setLErr(''); setLLoading(false); setLCount(0);
    setRStep(1); setRId(''); setRMobile(''); setREmail(''); setRAgree(false);
    setROtp(['','','','']); setROtpGen(''); setRErr(''); setROtpErr('');
    setRLoading(false); setROtpLoading(false); setRCount(0);
  }, [isOpen]);

  /* countdowns */
  useEffect(() => { if (lCount > 0) { const t = setTimeout(() => setLCount(c => c-1), 1000); return () => clearTimeout(t); } }, [lCount]);
  useEffect(() => { if (rCount > 0) { const t = setTimeout(() => setRCount(c => c-1), 1000); return () => clearTimeout(t); } }, [rCount]);

  /* scroll lock */
  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]);

  /* helpers */
  const genCode = () => Math.floor(1000 + Math.random() * 9000).toString();
  const validId  = (v) => /^[12]\d{9}$/.test(v);
  const validMob = (v) => /^05\d{8}$/.test(v);

  /* fill OTP boxes automatically */
  const autoFillOtp = (code, setFn, refs) => {
    const arr = code.split('');
    setFn(arr);
    // focus last box
    setTimeout(() => refs[3].current?.focus(), 80);
  };

  /* ── LOGIN handlers ── */
  const handleLoginSend = async (e) => {
    e.preventDefault(); setLErr('');
    if (!validId(lId))   return setLErr('رقم الهوية يجب أن يبدأ بـ 1 أو 2 ويتكون من 10 أرقام');
    if (!validMob(lMobile)) return setLErr('رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام');
    setLLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const code = genCode();
    setLOtpGen(code);
    setLLoading(false);
    setLStep(2);
    setLCount(60);
    // auto-fill after short delay
    setTimeout(() => autoFillOtp(code, setLOtp, lRefs), 600);
  };

  const handleLoginVerify = async (e) => {
    e.preventDefault(); setLErr('');
    const entered = lOtp.join('');
    if (entered.length < 4) return setLErr('يرجى إدخال رمز التحقق المكون من 4 أرقام');
    setLLoading(true);
    await new Promise(r => setTimeout(r, 900));
    if (entered === lOtpGen || entered === '1234') {
      setLStep(3);
      onLoginSuccess?.({ id: lId, mobile: lMobile });
    } else {
      setLErr('رمز التحقق غير صحيح، يرجى المحاولة مجدداً');
      setLOtp(['','','','']);
      lRefs[0].current?.focus();
    }
    setLLoading(false);
  };

  const handleLoginResend = async () => {
    if (lCount > 0) return;
    setLLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const code = genCode();
    setLOtpGen(code);
    setLOtp(['','','','']);
    setLErr('');
    setLLoading(false);
    setLCount(60);
    setTimeout(() => autoFillOtp(code, setLOtp, lRefs), 600);
  };

  /* ── REGISTER handlers ── */
  const handleRegSubmit = async (e) => {
    e.preventDefault(); setRErr('');
    if (!validId(rId))    return setRErr('رقم الهوية يجب أن يبدأ بـ 1 أو 2 ويتكون من 10 أرقام');
    if (!validMob(rMobile)) return setRErr('رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام');
    if (!rAgree)           return setRErr('يرجى الموافقة على الشروط والأحكام للمتابعة');
    setRLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    const code = genCode();
    setROtpGen(code);
    setRLoading(false);
    setRStep(2);
    setRCount(60);
    setTimeout(() => autoFillOtp(code, setROtp, rRefs), 600);
  };

  const handleRegVerify = async (e) => {
    e.preventDefault(); setROtpErr('');
    const entered = rOtp.join('');
    if (entered.length < 4) return setROtpErr('يرجى إدخال رمز التحقق المكون من 4 أرقام');
    setROtpLoading(true);
    await new Promise(r => setTimeout(r, 900));
    if (entered === rOtpGen || entered === '1234') {
      setRStep(3);
      onLoginSuccess?.({ id: rId, mobile: rMobile });
    } else {
      setROtpErr('رمز التحقق غير صحيح، يرجى المحاولة مجدداً');
      setROtp(['','','','']);
      rRefs[0].current?.focus();
    }
    setROtpLoading(false);
  };

  const handleRegResend = async () => {
    if (rCount > 0) return;
    setROtpLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const code = genCode();
    setROtpGen(code);
    setROtp(['','','','']);
    setROtpErr('');
    setROtpLoading(false);
    setRCount(60);
    setTimeout(() => autoFillOtp(code, setROtp, rRefs), 600);
  };

  if (!isOpen) return null;

  return (
    <div ref={overlay} onClick={(e) => { if (e.target === overlay.current) onClose(); }}
      className="fixed inset-0 z-[999] flex items-start justify-center bg-black/50
                 backdrop-blur-sm overflow-y-auto">
      <div style={{ direction: 'rtl' }}
        className="relative bg-white w-full max-w-md mx-auto rounded-none md:rounded-2xl
                   shadow-2xl overflow-hidden my-0 md:my-8 min-h-screen md:min-h-0">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
              <path fillRule="evenodd" clipRule="evenodd" d="M5.67889 9.56532H4.63534C4.46705 9.56595 4.30545 9.49853 4.18623 9.37795C4.06701 9.25737 4 9.09357 4 8.92273V3.73527C4 2.76424 4.77543 1.97707 5.73197 1.97707H10.7046C11.2572 1.97738 11.7985 1.81858 12.2657 1.5191L14.3692 0.172116C14.7281 -0.057372 15.1849 -0.057372 15.5439 0.172116L17.7715 1.59833C18.157 1.84521 18.6035 1.97624 19.0593 1.97628H24.32C25.1985 1.97628 25.9107 2.69924 25.9107 3.59107V4.95865C25.9107 5.07829 25.9154 9.57958 25.9154 9.57958C25.9555 9.98874 25.7669 10.3863 25.4268 10.6096L15.5228 17.9538C15.3897 18.0488 15.2156 18.0606 15.0713 17.9845C14.927 17.9083 14.8365 17.7568 14.8367 17.5917V15.9048C14.8368 15.5009 15.0275 15.1215 15.3495 14.8843L23.0915 9.10021C23.3945 8.88284 23.5703 8.52594 23.5598 8.1494L23.5465 5.3667C23.537 5.00717 23.3781 4.66852 23.109 4.4345C22.84 4.20049 22.486 4.09298 22.1345 4.13857L18.8759 4.16314C18.2154 4.18963 17.5615 4.02208 16.9925 3.6806L15.3183 2.61253C15.0978 2.46288 14.8096 2.4654 14.5916 2.61886L13.0782 3.55303C12.4254 3.95097 11.6792 4.16334 10.9177 4.16789L7.63175 4.1877C6.8821 4.1925 6.27738 4.8117 6.27911 5.57271L6.28848 8.94491C6.28889 9.10931 6.22485 9.26711 6.11049 9.38351C5.99612 9.4999 5.84084 9.56532 5.67889 9.56532ZM24.9793 13.0546L15.8715 19.8925C15.3289 20.3037 14.5845 20.3037 14.0419 19.8925L4.94031 13.0546C4.76141 12.9199 4.5228 12.8996 4.32429 13.0022C4.12579 13.1048 4.0016 13.3126 4.00369 13.5387V21.0335C4.00263 21.9452 4.43588 22.8012 5.16666 23.3313L13.8827 29.6518C14.5262 30.1161 15.3887 30.1161 16.0322 29.6518L24.7483 23.3313C25.4769 22.7993 25.9095 21.9445 25.9113 21.0335V13.5324C25.9114 13.3083 25.7872 13.1033 25.5902 13.0022C25.3932 12.9012 25.1569 12.9215 24.9793 13.0546Z" fill="#0088EB"/>
            </svg>
            <span className="text-lg font-bold text-slate-900">تأميني</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-slate-100">
          {[['login','تسجيل دخول'], ['register','إنشاء حساب']].map(([key, label]) => (
            <button key={key}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors border-b-2
                ${tab === key ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
              onClick={() => { setTab(key); setLErr(''); setRErr(''); }}>
              {label}
            </button>
          ))}
        </div>

        <div className="px-6 py-6">

          {/* ══════ LOGIN TAB ══════ */}
          {tab === 'login' && (
            <>
              {/* Individual / Corporate selector */}
              {lStep === 1 && (
                <div className="flex rounded-xl bg-slate-100 p-1 mb-5 gap-1">
                  {[['individual','أفراد'], ['corporate','شركات']].map(([k,lbl]) => (
                    <button key={k}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${loginType === k ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                      onClick={() => setLoginType(k)}>
                      {lbl}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 1 – Individuals */}
              {lStep === 1 && loginType === 'individual' && (
                <form onSubmit={handleLoginSend} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">رقم الهوية الوطنية / الإقامة</label>
                    <input type="text" inputMode="numeric" maxLength={10} value={lId}
                      onChange={(e) => setLId(e.target.value.replace(/\D/g,''))}
                      placeholder="أدخل رقم هويتك الوطنية"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">رقم الجوال</label>
                    <div className="flex">
                      <span className="flex items-center px-3 border border-e-0 border-slate-200 rounded-r-xl bg-slate-50 text-sm text-slate-500">🇸🇦 +966</span>
                      <input type="text" inputMode="numeric" maxLength={10} value={lMobile}
                        onChange={(e) => setLMobile(e.target.value.replace(/\D/g,''))}
                        placeholder="05XXXXXXXX"
                        className="flex-1 border border-slate-200 rounded-l-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"/>
                    </div>
                  </div>
                  <ErrBox msg={lErr} />
                  <PrimaryBtn loading={lLoading} label="إرسال رمز التحقق" spinLabel="جاري الإرسال..."/>
                  <p className="text-center text-xs text-slate-400">
                    بتسجيل دخولك، أنت توافق على{' '}
                    <a href="#" className="text-primary underline" onClick={e=>e.preventDefault()}>الشروط والأحكام</a>
                    {' '}و{' '}
                    <a href="#" className="text-primary underline" onClick={e=>e.preventDefault()}>سياسة الخصوصية</a>
                  </p>
                  <p className="text-center text-sm text-slate-500">
                    ليس لديك حساب؟{' '}
                    <button type="button" className="text-primary font-semibold hover:underline" onClick={() => setTab('register')}>إنشاء حساب</button>
                  </p>
                </form>
              )}

              {/* Step 1 – Corporate */}
              {lStep === 1 && loginType === 'corporate' && (
                <form onSubmit={(e) => { e.preventDefault(); setLStep(3); onLoginSuccess?.({ id:'corp', mobile:'0500000000' }); }} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">رقم السجل التجاري</label>
                    <input type="text" inputMode="numeric" maxLength={10} placeholder="أدخل رقم السجل التجاري"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">كلمة المرور</label>
                    <input type="password" placeholder="أدخل كلمة المرور"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"/>
                    <a href="#" className="text-xs text-primary hover:underline mt-1 inline-block" onClick={e=>e.preventDefault()}>نسيت كلمة المرور؟</a>
                  </div>
                  <button type="submit" className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors">دخول</button>
                </form>
              )}

              {/* Step 2 – OTP */}
              {lStep === 2 && (
                <OtpScreen maskedMobile={lMobile.slice(-3)}
                  otpVal={lOtp} setOtpVal={setLOtp} refs={lRefs}
                  onVerify={handleLoginVerify} onResend={handleLoginResend}
                  onBack={() => { setLStep(1); setLErr(''); setLOtp(['','','','']); }}
                  err={lErr} loading={lLoading} countdown={lCount}
                  backLabel="تعديل رقم الجوال"/>
              )}

              {/* Step 3 – done */}
              {lStep === 3 && (
                <SuccessScreen title="تم تسجيل الدخول بنجاح!"
                  desc="مرحباً بك في تأميني. يمكنك الآن الاستمتاع بجميع خدماتنا التأمينية."
                  btnLabel="الانتقال للصفحة الرئيسية" onBtn={onClose}/>
              )}
            </>
          )}

          {/* ══════ REGISTER TAB ══════ */}
          {tab === 'register' && (
            <>
              {/* Step 1 – form */}
              {rStep === 1 && (
                <form onSubmit={handleRegSubmit} className="flex flex-col gap-4">
                  <p className="text-sm text-slate-500 pb-1">أنشئ حسابك في تأميني وابدأ مقارنة عروض التأمين الآن</p>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">رقم الهوية الوطنية / الإقامة</label>
                    <input type="text" inputMode="numeric" maxLength={10} value={rId}
                      onChange={(e) => setRId(e.target.value.replace(/\D/g,''))}
                      placeholder="أدخل رقم هويتك الوطنية"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"/>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">رقم الجوال</label>
                    <div className="flex">
                      <span className="flex items-center px-3 border border-e-0 border-slate-200 rounded-r-xl bg-slate-50 text-sm text-slate-500">🇸🇦 +966</span>
                      <input type="text" inputMode="numeric" maxLength={10} value={rMobile}
                        onChange={(e) => setRMobile(e.target.value.replace(/\D/g,''))}
                        placeholder="05XXXXXXXX"
                        className="flex-1 border border-slate-200 rounded-l-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      البريد الإلكتروني <span className="text-slate-400 font-normal">(اختياري)</span>
                    </label>
                    <input type="email" value={rEmail} onChange={(e) => setREmail(e.target.value)}
                      placeholder="example@email.com"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"/>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={rAgree} onChange={(e) => setRAgree(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded accent-primary shrink-0"/>
                    <span className="text-xs text-slate-600 leading-relaxed">
                      أوافق على{' '}
                      <a href="#" className="text-primary underline" onClick={e=>e.preventDefault()}>الشروط والأحكام</a>
                      {' '}و{' '}
                      <a href="#" className="text-primary underline" onClick={e=>e.preventDefault()}>سياسة الخصوصية</a>
                      {' '}وأقر بأن المعلومات صحيحة
                    </span>
                  </label>

                  <ErrBox msg={rErr} />
                  <PrimaryBtn loading={rLoading} label="إنشاء حساب" spinLabel="جاري إنشاء الحساب..."/>

                  <p className="text-center text-sm text-slate-500">
                    لديك حساب بالفعل؟{' '}
                    <button type="button" className="text-primary font-semibold hover:underline" onClick={() => setTab('login')}>تسجيل دخول</button>
                  </p>
                </form>
              )}

              {/* Step 2 – OTP after registration */}
              {rStep === 2 && (
                <OtpScreen maskedMobile={rMobile.slice(-3)}
                  otpVal={rOtp} setOtpVal={setROtp} refs={rRefs}
                  onVerify={handleRegVerify} onResend={handleRegResend}
                  onBack={() => { setRStep(1); setROtpErr(''); setROtp(['','','','']); }}
                  err={rOtpErr} loading={rOtpLoading} countdown={rCount}
                  backLabel="العودة وتعديل البيانات"/>
              )}

              {/* Step 3 – success */}
              {rStep === 3 && (
                <SuccessScreen title="تم إنشاء حسابك بنجاح! 🎉"
                  desc="مرحباً بك في تأميني! حسابك فعّال الآن. يمكنك مقارنة عروض التأمين وإصدار وثائقك بسهولة."
                  btnLabel="ابدأ الاستخدام" onBtn={onClose}/>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
