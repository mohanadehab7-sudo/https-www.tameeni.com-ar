import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  RefreshCw, ShieldCheck, Calendar, AlertTriangle, ChevronDown 
} from 'lucide-react';

export default function MotorApp({ setQueryData, setActiveView }) {
  const { t, lang, isRTL } = useLanguage();
  const [subTab, setSubTab] = useState('individuals');

  // Input states
  const [searchMode, setSearchMode] = useState('serial'); // 'serial' | 'customs'
  const [serialNumber, setSerialNumber] = useState('843940294');
  const [nationalId, setNationalId] = useState('1094039483');

  // Custom Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarType, setCalendarType] = useState('gregorian');
  const [selectedDate, setSelectedDate] = useState('2026-06-15');
  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [selectedHijriDay, setSelectedHijriDay] = useState(29);
  const [selectedHijriMonth, setSelectedHijriMonth] = useState('Dhul-Hijjah');

  // Purpose state
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false);
  const [purpose, setPurpose] = useState('private');

  // Captcha State
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');

  // Loader Overlay State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);

  const generateCaptcha = () => {
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    setCaptchaCode(code);
    setCaptchaInput(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const pickerRef = useRef(null);
  const purposeRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
      if (purposeRef.current && !purposeRef.current.contains(event.target)) {
        setShowPurposeDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!serialNumber || !nationalId || !captchaInput) {
      setError(t('errEmpty'));
      return;
    }

    if (!/^[12]\d{9}$/.test(nationalId)) {
      setError(t('errID'));
      return;
    }

    if (!/^\d{9}$/.test(serialNumber)) {
      setError(lang === 'ar' ? 'الرقم التسلسلي يجب أن يتكون من 9 خانات رقمية' : 'Serial number must be exactly 9 numeric digits');
      return;
    }

    if (captchaInput !== captchaCode) {
      setError(t('errCaptcha'));
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    setIsLoading(true);
    setLoadingStep(1);

    const stepIntervals = [
      setTimeout(() => setLoadingStep(2), 1200),
      setTimeout(() => setLoadingStep(3), 2400),
      setTimeout(() => setLoadingStep(4), 3600),
      setTimeout(() => {
        setIsLoading(false);
        setQueryData({
          serialNumber,
          nationalId,
          purpose,
          searchMode,
          selectedDate
        });
        setActiveView('comparison');
      }, 4800)
    ];

    return () => stepIntervals.forEach(clearTimeout);
  };

  const handleSelectDay = (day) => {
    setSelectedDay(day);
    const dateStr = `2026-06-${day < 10 ? '0' + day : day}`;
    setSelectedDate(dateStr);
    setShowDatePicker(false);
  };

  const handleSelectHijriDay = (day) => {
    setSelectedHijriDay(day);
    const dateStr = `1447-12-${day < 10 ? '0' + day : day}`;
    setSelectedDate(dateStr);
    setShowDatePicker(false);
  };

  const purposeOptions = [
    { value: 'private', label: lang === 'ar' ? 'خصوصي / استخدام شخصي' : 'Private Use' },
    { value: 'commercial', label: lang === 'ar' ? 'تجاري / نقل مواد' : 'Commercial Transport' },
    { value: 'taxi', label: lang === 'ar' ? 'سيارة أجرة / تاكسي' : 'Public Taxi' }
  ];

  return (
    <div className="animate-fade-in relative min-h-screen bg-slate-50 py-12">
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader-spinner" />
          <div className="loader-text">
            {loadingStep === 1 && (lang === 'ar' ? 'الاتصال بمركز المعلومات الوطني (NIC)...' : 'Connecting to National Information Center (NIC)...')}
            {loadingStep === 2 && (lang === 'ar' ? 'التحقق من سجل عروض نجم واستحقاق الخصم...' : 'Querying Najm database for No-Claims Discounts...')}
            {loadingStep === 3 && (lang === 'ar' ? 'طلب عروض الأسعار من شركات التأمين المعتمدة...' : 'Fetching quotes from SAMA licensed insurers...')}
            {loadingStep === 4 && (lang === 'ar' ? 'تجهيز عروض التغطية الفورية...' : 'Preparing instant comparison tables...')}
          </div>
          <div className="loader-step-bullet">
            {loadingStep === 1 && (lang === 'ar' ? 'الرجاء الانتظار قليلاً (خطوة 1 من 4)' : 'Please wait (Step 1 of 4)')}
            {loadingStep === 2 && (lang === 'ar' ? 'يتم سحب معلومات الحوادث (خطوة 2 من 4)' : 'Retrieving claim records (Step 2 of 4)')}
            {loadingStep === 3 && (lang === 'ar' ? 'التفاوض على أفضل قسط (خطوة 3 من 4)' : 'Calculating premium offers (Step 3 of 4)')}
            {loadingStep === 4 && (lang === 'ar' ? 'توليد لوحة عروض الأسعار (خطوة 4 من 4)' : 'Generating comparison dashboard (Step 4 of 4)')}
          </div>
        </div>
      )}

      <div className="max-w-[32rem] mx-auto px-4 text-center">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-2">
          تأمين سيارات وأكثر!
        </h2>
        <p className="text-slate-500 text-sm lg:text-base mb-8">
          أدخل البيانات المطلوبة لمقارنة أسعار التأمين فورياً والحصول على وثيقتك
        </p>

        <div className="search-card">
          <div className="search-tabs">
            <button 
              type="button"
              className={`search-tab ${subTab === 'individuals' ? 'active' : ''}`}
              onClick={() => setSubTab('individuals')}
              style={{ border: 'none', background: 'none' }}
            >
              للأفراد
            </button>
            <button 
              type="button"
              className={`search-tab ${subTab === 'corporate' ? 'active' : ''}`}
              onClick={() => setSubTab('corporate')}
              style={{ border: 'none', background: 'none' }}
            >
              للمنشآت
            </button>
          </div>

          {error && (
            <div className="error-banner text-right">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {subTab === 'individuals' ? (
            <form onSubmit={handleSearchSubmit} className="text-right">
              <div className="flex justify-center">
                <div className="sub-toggles">
                  <button 
                    type="button" 
                    className={`sub-toggle-btn ${searchMode === 'serial' ? 'active' : ''}`}
                    onClick={() => setSearchMode('serial')}
                  >
                    الرقم التسلسلي
                  </button>
                  <button 
                    type="button" 
                    className={`sub-toggle-btn ${searchMode === 'customs' ? 'active' : ''}`}
                    onClick={() => setSearchMode('customs')}
                  >
                    بطاقة جمركية
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">رقم الهوية الوطنية / الإقامة</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="مثال: 1xxxxxxxx أو 2xxxxxxxx"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {searchMode === 'serial' ? 'الرقم التسلسلي للمركبة' : 'رقم البطاقة الجمركية'}
                </label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="مثال: 123456789 (9 أرقام)"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value.replace(/\D/g, ''))}
                  maxLength={9}
                />
              </div>

              <div className="form-group relative" ref={pickerRef}>
                <label className="form-label">تاريخ بدء تغطية التأمين</label>
                <div 
                  className="custom-select-trigger" 
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <span>{selectedDate}</span>
                  <Calendar size={16} className="text-slate-400" />
                </div>

                {showDatePicker && (
                  <div className="custom-date-picker-dropdown">
                    <div className="datepicker-tabs">
                      <span 
                        className={`datepicker-tab ${calendarType === 'gregorian' ? 'active' : ''}`}
                        onClick={() => setCalendarType('gregorian')}
                      >
                        ميلادي
                      </span>
                      <span 
                        className={`datepicker-tab ${calendarType === 'hijri' ? 'active' : ''}`}
                        onClick={() => setCalendarType('hijri')}
                      >
                        هجري
                      </span>
                    </div>

                    <div style={{ padding: '4px', textAlign: 'center', fontSize: '0.8rem', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                      {calendarType === 'gregorian' ? `${selectedMonth} 2026` : `${selectedHijriMonth} 1447`}
                    </div>

                    <div className="datepicker-calendar-grid">
                      {(lang === 'ar' ? ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S']).map((d, i) => (
                        <div key={i} className="datepicker-day-header">{d}</div>
                      ))}

                      {calendarType === 'gregorian' ? (
                        Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                          <div 
                            key={d} 
                            className={`datepicker-day-cell ${selectedDay === d ? 'selected' : ''}`}
                            onClick={() => handleSelectDay(d)}
                          >
                            {d}
                          </div>
                        ))
                      ) : (
                        Array.from({ length: 29 }, (_, i) => i + 1).map((d) => (
                          <div 
                            key={d} 
                            className={`datepicker-day-cell ${selectedHijriDay === d ? 'selected' : ''}`}
                            onClick={() => handleSelectHijriDay(d)}
                          >
                            {d}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group relative" ref={purposeRef}>
                <label className="form-label">الغرض من التأمين</label>
                <div 
                  className={`custom-select-trigger ${showPurposeDropdown ? 'active' : ''}`}
                  onClick={() => setShowPurposeDropdown(!showPurposeDropdown)}
                >
                  <span>{purposeOptions.find(o => o.value === purpose)?.label}</span>
                  <ChevronDown size={16} style={{ transform: showPurposeDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>

                {showPurposeDropdown && (
                  <div className="custom-select-dropdown">
                    {purposeOptions.map((opt) => (
                      <div 
                        key={opt.value}
                        className="custom-select-option"
                        onClick={() => { setPurpose(opt.value); setShowPurposeDropdown(false); }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">أدخل رمز التحقق المرئي</label>
                <div className="captcha-container">
                  <div className="captcha-number">{captchaCode}</div>
                  <button type="button" className="captcha-refresh" onClick={generateCaptcha}>
                    <RefreshCw size={16} />
                  </button>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="أدخل الـ 4 أرقام الظاهرة"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block py-4 text-base font-bold">
                عرض أسعار التأمين
              </button>
            </form>
          ) : (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--secondary-900)' }}>
                تأمين أسطول المركبات للمنشآت والشركات
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px' }}>
                الرجاء تزويدنا ببيانات السجل التجاري لأسطول سيارات المنشأة للتواصل وتحديث عروض الأسعار مباشرة.
              </p>
              <button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={() => alert('تم استقبال طلب المنشأة')}>
                تقديم طلب عرض سعر للمنشأة
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
