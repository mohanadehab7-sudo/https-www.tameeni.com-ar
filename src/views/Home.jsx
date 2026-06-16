import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  RefreshCw, ShieldCheck, Car, FileText, 
  HelpCircle, ChevronDown, Calendar, AlertTriangle, 
  Search, X, FileSpreadsheet, ArrowLeft, ArrowRight, Check 
} from 'lucide-react';

export default function Home({ setQueryData, setActiveView, setIsPlusDrawerOpen, onStartNowClick }) {
  const { t, lang, isRTL } = useLanguage();
  const productSliderRef = useRef(null);

  // Subtabs state: 'individuals' | 'corporate'
  const [subTab, setSubTab] = useState('individuals');
  const [categoryTab, setCategoryTab] = useState('individuals');
  const [showPlusBanner, setShowPlusBanner] = useState(true);

  // Input states
  const [searchMode, setSearchMode] = useState('serial'); // 'serial' | 'customs'
  const [serialNumber, setSerialNumber] = useState('');
  const [nationalId, setNationalId] = useState('');

  const scrollProducts = (direction) => {
    if (productSliderRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      productSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  // Custom Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarType, setCalendarType] = useState('gregorian'); // 'gregorian' | 'hijri'
  const [selectedDate, setSelectedDate] = useState('2026-06-15');
  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [selectedHijriDay, setSelectedHijriDay] = useState(29);
  const [selectedHijriMonth, setSelectedHijriMonth] = useState('Dhul-Hijjah');

  // Purpose state
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false);
  const [purpose, setPurpose] = useState('private'); // 'private' | 'commercial' | 'taxi'

  // Captcha State
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');

  // Loader Overlay State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);

  // Mojaz Modal State
  const [showMojazModal, setShowMojazModal] = useState(false);
  const [mojazSearchQuery, setMojazSearchQuery] = useState('');
  const [mojazResult, setMojazResult] = useState(null);
  const [mojazLoading, setMojazLoading] = useState(false);

  // Generate a random 4-digit captcha
  const generateCaptcha = () => {
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Click outside handlers to close custom dropdowns
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

    // Saudi ID validation
    if (!/^[12]\d{9}$/.test(nationalId)) {
      setError(t('errID'));
      return;
    }

    // Vehicle Code/Serial validation (9 digits)
    if (!/^\d{9}$/.test(serialNumber)) {
      setError(lang === 'ar' ? 'الرقم التسلسلي يجب أن يتكون من 9 خانات رقمية' : 'Serial number must be exactly 9 numeric digits');
      return;
    }

    // Captcha validation
    if (captchaInput !== captchaCode) {
      setError(t('errCaptcha'));
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    // Start Multi-Stage Najm/NIC Verification animation
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

  const handleMojazQuery = (e) => {
    e.preventDefault();
    if (!mojazSearchQuery) return;
    setMojazLoading(true);
    setMojazResult(null);

    setTimeout(() => {
      setMojazLoading(false);
      setMojazResult({
        brand: lang === 'ar' ? 'تويوتا كامري GLE' : 'Toyota Camry GLE',
        year: '2023',
        color: lang === 'ar' ? 'أبيض لؤلؤي' : 'Pearl White',
        chassis: 'AJK48301849204928',
        accidents: lang === 'ar' ? '1 حادث بسيط مسجل (خدش الباب الخلفي - تم الإصلاح)' : '1 minor recorded accident (Rear door scratch - Repaired)',
        owners: 1,
        mileage: '48,500 KM',
        status: lang === 'ar' ? 'حالة الاستمارة سارية ومفحوصة' : 'Istimara Valid & Checked'
      });
    }, 1200);
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

  // grayscale scrolling partner logos list from tameeni.com/ar
  const partnerLogos = [
    { name: 'GulfUnion', code: '2' },
    { name: 'Malath', code: '3' },
    { name: 'AICC', code: '4' },
    { name: 'Walaa', code: '5' },
    { name: 'Der3', code: '6' },
    { name: 'ACIG', code: '7' },
    { name: 'Salama', code: '9' },
    { name: 'mutakamela', code: '10' },
    { name: 'GGCIC', code: '11' },
    { name: 'Etihad', code: '12' },
    { name: 'AJT', code: '13' },
    { name: 'Medgulf', code: '15' },
    { name: 'WIC', code: '18' },
    { name: 'Tawuniya', code: '19' },
    { name: 'ART', code: '31' },
    { name: 'AlSagr', code: '32' },
    { name: 'ATMC', code: '33' },
    { name: 'ACI', code: '34' },
    { name: 'GIG', code: '35' },
    { name: 'Liva', code: '36' },
    { name: 'Tree', code: '40' }
  ];

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
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

      {/* B. OFFICIAL HERO BANNER BLOCK */}
      <div className="flex justify-center items-center bg-blue-100 border-y border-slate-100 overflow-hidden min-h-[500px] py-6 lg:py-12">
        <div className="box flex flex-col-reverse justify-between lg:flex-row gap-3 lg:gap-6 lg:items-center max-w-[80rem] mx-auto px-4 w-full">
          <div className="flex flex-col gap-2 pt-4 pb-8 lg:py-12 justify-center lg:w-[56%]">
            <h1 className="text-3xl lg:text-[42px] font-extrabold text-slate-900 mb-2 !leading-tight">
              أول منصة لتأمين السيارات في <br /> السعودية
            </h1>
            <p className="max-w-2xl text-slate-600 text-base lg:text-xl mb-6">
              جميع وأفضل شركات التأمين… في مكان واحد، لمجموعة واسعة من الخيارات وإصدار فوري لوثائق التأمين
            </p>
            <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
              <a 
                className="w-full lg:max-w-56 px-8 py-4 text-center font-black bg-primary text-white rounded-md cursor-pointer leading-[1.75]" 
                href="/motorapp"
                onClick={(e) => {
                  e.preventDefault();
                  if (onStartNowClick) {
                    onStartNowClick();
                  }
                }}
              >
                ابدأ الآن
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="flex items-center text-slate-600 text-sm flex-wrap mt-4">
                هل تود شراء سيارة و ترغب في معرفة كل شيء عنها قبل الشراء؟
                <a 
                  className="flex items-center underline mx-1 text-blue-600 font-bold" 
                  href="#mojaz"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMojazModal(true);
                  }}
                >
                  تقرير موجز
                  <img 
                    alt="Mojaz" 
                    loading="lazy" 
                    width="30" 
                    height="30" 
                    class="w-[30px] mx-2" 
                    src="https://www.tameeni.com/Resources/images/mojaz/mojaz-logo.png" 
                    style={{ color: 'transparent' }}
                  />
                </a>
              </span>
            </div>
          </div>
          
          <div className="w-full lg:w-[44%]">
            <div className="relative flex justify-center items-center max-w-xl mx-auto">
              <div className="flex flex-col gap-2">
                <img 
                  loading="eager" 
                  alt="أول منصة لتأمين السيارات في السعودية" 
                  className="relative w-full h-auto rtl:scale-x-[-1] max-w-sm" 
                  src="https://www.tameeni.com/images/hero-images/motor-hero.webp"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* C. OFFICIAL SAMA & PARTNERS LOGOS STRIP */}
      <div className="relative w-full">
        {/* SAMA strip */}
        <div className="border-b border-slate-100">
          <div className="mx-auto flex w-full max-w-[80rem] flex-wrap items-center justify-center gap-x-10 gap-y-4 px-3 sm:px-4 py-4">
            <div className="flex items-center gap-2 sm:flex-row sm:gap-3 text-start">
              <img 
                alt="هيئة التأمين" 
                className="h-7 sm:h-8 w-auto" 
                src="https://www.tameeni.com/images/partners/insurance-authority.svg"
              />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400">مرخص من</span>
                <span className="text-xs font-semibold">هيئة التأمين</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Partners Marquee row */}
        <div className="border-b border-slate-100 bg-white">
          <div 
            className="mx-auto flex w-full max-w-[80rem] items-center overflow-x-auto scroll-smooth select-none px-4 py-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden cursor-grab" 
            style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)' }}
          >
            <div className="flex gap-4">
              {partnerLogos.concat(partnerLogos).map((logo, index) => (
                <a 
                  key={`${logo.code}-${index}`} 
                  href="#partners" 
                  draggable="false" 
                  className="shrink-0 px-2"
                  onClick={(e) => e.preventDefault()}
                >
                  <img 
                    alt={logo.name} 
                    title={logo.name} 
                    draggable="false" 
                    className="h-[30px] w-auto max-w-none grayscale transition-[filter] duration-200 hover:grayscale-0" 
                    src={`https://www.tameeni.com/images/ic-logos/full/${logo.code}.png`}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>



      {/* E. OFFICIAL TAMEENI FANTASY PROMO BANNER */}
      <div className="max-w-7xl mx-auto p-4 pb-0 bg-white">
        <a 
          className="block w-full h-auto rounded-lg md:rounded-2xl overflow-hidden" 
          href="#fantasy" 
          onClick={(e) => { e.preventDefault(); alert(lang === 'ar' ? 'فانتازي تأميني: مسابقة دوري روشن الحصرية قريباً!' : 'Tameeni Fantasy coming soon!'); }}
        >
          <picture>
            <source media="(max-width: 767px)" srcSet="https://www.tameeni.com/images/fantasy/fantasy-mobile-ar.webp" />
            <img 
              alt="Tameeni Fantasy" 
              className="w-full h-auto" 
              src="https://www.tameeni.com/images/fantasy/fantasy-web-ar.webp"
            />
          </picture>
        </a>
      </div>

      {/* E2. EHSAN CHARITY BANNER */}
      <div className="max-w-7xl mx-auto p-4 pb-0 bg-white">
        <div className="w-full h-auto rounded-lg md:rounded-2xl overflow-hidden">
          <img 
            alt="Ehsan Charity Banner" 
            className="w-full h-auto" 
            src="https://www.tameeni.com/images/ehsan/ehsan-web-ar.webp"
          />
        </div>
      </div>

      {/* E3. DUAL PROMOTIONAL BANNERS GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 p-4 bg-white">
        <a 
          target="_blank" 
          rel="noreferrer"
          className="block w-full h-auto rounded-lg md:rounded-2xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow" 
          href="/motorapp/TameeniOffers"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('motorapp');
          }}
        >
          <img alt="banner 1" src="https://www.tameeni.com/images/motor/tameeni-offers-ar.webp" className="w-full h-auto" />
        </a>
        <a 
          target="_blank" 
          rel="noreferrer"
          className="w-full block h-auto rounded-lg md:rounded-2xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow" 
          href="/motorapp/car/ar/tameeni-hero"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('motorapp');
          }}
        >
          <img alt="banner 2" src="https://www.tameeni.com/images/motor/tameeni-hero-ar.webp" className="w-full h-auto" />
        </a>
      </div>

      {/* E4. PRODUCT CATEGORIES SLIDER ("تأمين سيارات وأكثر!") */}
      <section className="max-w-7xl mx-auto mt-12 md:mt-16 flex flex-col gap-2 md:gap-4 bg-white py-4">
        <h2 className="px-6 text-center text-3xl md:text-5xl leading-snug font-extrabold text-slate-900">
          تأمين سيارات وأكثر!
        </h2>
        <p className="px-6 text-center text-base md:text-xl text-slate-600">
          منتجات التأمين المتنوعة
        </p>
        
        <div dir="rtl" className="mt-4 relative">
          {/* Tab buttons switcher */}
          <div className="flex w-fit items-center justify-center p-1 overflow-hidden bg-slate-100 rounded-lg gap-1 mb-8 min-w-56 mx-auto">
            <button 
              type="button" 
              className={`inline-flex items-center justify-center whitespace-nowrap transition-all py-2 px-6 font-bold text-slate-500 rounded-lg text-sm ${categoryTab === 'individuals' ? 'bg-white shadow-sm text-blue-600' : 'hover:text-slate-950'}`}
              onClick={() => setCategoryTab('individuals')}
            >
              للأفراد
            </button>
            <button 
              type="button" 
              className={`inline-flex items-center justify-center whitespace-nowrap transition-all py-2 px-6 font-bold text-slate-500 rounded-lg text-sm ${categoryTab === 'corporate' ? 'bg-white shadow-sm text-blue-600' : 'hover:text-slate-950'}`}
              onClick={() => setCategoryTab('corporate')}
            >
              للشركات
            </button>
          </div>

          <div className="relative w-full h-72">
            {/* Left scroll control arrow */}
            <div className="transition-all duration-300 z-10 absolute start-0 top-0 w-20 h-full backdrop-blur-[1px] bg-gradient-to-l from-white to-transparent items-center justify-start p-2 hidden md:flex pointer-events-none">
              <button 
                className="cursor-pointer whitespace-nowrap transition-colors border border-slate-200 size-11 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center shadow-sm pointer-events-auto" 
                type="button"
                onClick={() => scrollProducts('left')}
              >
                <ArrowRight className="text-slate-600 size-5" />
              </button>
            </div>

            {/* Scrolling cards container */}
            <div 
              ref={productSliderRef}
              className="relative px-4 flex gap-6 overflow-x-auto scroll-px-6 no-scrollbar justify-start scroll-smooth w-full"
            >
              {categoryTab === 'individuals' ? (
                <>
                  {/* Card 1: السيارات */}
                  <a 
                    className="cursor-pointer group shrink-0" 
                    href="/motorapp"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveView('motorapp');
                    }}
                  >
                    <div className="w-56 h-64 flex items-end rounded-xl bg-contain bg-bottom bg-no-repeat overflow-hidden border-2 border-slate-200 group-hover:border-blue-500 transition-all duration-200" style={{ backgroundImage: 'url("https://www.tameeni.com/images/products-cards/motor.webp")' }}>
                      <div className="w-full flex flex-col gap-2 p-6 h-full justify-start">
                        <h2 className="text-lg text-slate-900 font-bold mb-2">السيارات</h2>
                        <span className="cursor-pointer whitespace-nowrap text-center min-h-9 min-w-[7.5rem] px-4 py-2 text-xs rounded-sm bg-blue-200 text-blue-600 font-bold group-hover:bg-primary group-hover:text-white transition-all duration-200 inline-flex items-center justify-center">
                          ابدأ الآن
                        </span>
                      </div>
                    </div>
                  </a>

                  {/* Card 2: الأخطاء الطبية */}
                  <a 
                    className="cursor-pointer group shrink-0" 
                    href="#mmp"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(lang === 'ar' ? 'قسم الأخطاء الطبية محاكى حالياً.' : 'Medical Malpractice is simulated.');
                    }}
                  >
                    <div className="w-56 h-64 flex items-end rounded-xl bg-contain bg-bottom bg-no-repeat overflow-hidden border-2 border-slate-200 group-hover:border-blue-500 transition-all duration-200" style={{ backgroundImage: 'url("https://www.tameeni.com/images/products-cards/mmp.webp")' }}>
                      <div className="w-full flex flex-col gap-2 p-6 h-full justify-start">
                        <h2 className="text-lg text-slate-900 font-bold mb-2">الأخطاء الطبية</h2>
                        <span className="cursor-pointer whitespace-nowrap text-center min-h-9 min-w-[7.5rem] px-4 py-2 text-xs rounded-sm bg-blue-200 text-blue-600 font-bold group-hover:bg-primary group-hover:text-white transition-all duration-200 inline-flex items-center justify-center">
                          ابدأ الآن
                        </span>
                      </div>
                    </div>
                  </a>

                  {/* Card 3: العمالة المنزلية */}
                  <a 
                    className="cursor-pointer group shrink-0" 
                    href="#domestic"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(lang === 'ar' ? 'قسم العمالة المنزلية محاكى حالياً.' : 'Domestic Helpers is simulated.');
                    }}
                  >
                    <div className="w-56 h-64 flex items-end rounded-xl bg-contain bg-bottom bg-no-repeat overflow-hidden border-2 border-slate-200 group-hover:border-blue-500 transition-all duration-200" style={{ backgroundImage: 'url("https://www.tameeni.com/images/products-cards/domestic.webp")' }}>
                      <div className="w-full flex flex-col gap-2 p-6 h-full justify-start">
                        <h2 className="text-lg text-slate-900 font-bold mb-2">العمالة المنزلية</h2>
                        <span className="cursor-pointer whitespace-nowrap text-center min-h-9 min-w-[7.5rem] px-4 py-2 text-xs rounded-sm bg-blue-200 text-blue-600 font-bold group-hover:bg-primary group-hover:text-white transition-all duration-200 inline-flex items-center justify-center">
                          ابدأ الآن
                        </span>
                      </div>
                    </div>
                  </a>

                  {/* Card 4: السفر */}
                  <a 
                    className="cursor-pointer group shrink-0" 
                    href="#travel"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(lang === 'ar' ? 'قسم تأمين السفر محاكى حالياً.' : 'Travel Insurance is simulated.');
                    }}
                  >
                    <div className="w-56 h-64 flex items-end rounded-xl bg-contain bg-bottom bg-no-repeat overflow-hidden border-2 border-slate-200 group-hover:border-blue-500 transition-all duration-200" style={{ backgroundImage: 'url("https://www.tameeni.com/images/products-cards/travel.webp")' }}>
                      <div className="w-full flex flex-col gap-2 p-6 h-full justify-start">
                        <h2 className="text-lg text-slate-900 font-bold mb-2">السفر</h2>
                        <span className="cursor-pointer whitespace-nowrap text-center min-h-9 min-w-[7.5rem] px-4 py-2 text-xs rounded-sm bg-blue-200 text-blue-600 font-bold group-hover:bg-primary group-hover:text-white transition-all duration-200 inline-flex items-center justify-center">
                          ابدأ الآن
                        </span>
                      </div>
                    </div>
                  </a>

                  {/* Card 5: الإقامة المميزة */}
                  <a 
                    className="cursor-pointer group shrink-0" 
                    href="#residency"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(lang === 'ar' ? 'قسم الإقامة المميزة محاكى حالياً.' : 'Premium Residency is simulated.');
                    }}
                  >
                    <div className="w-56 h-64 flex items-end rounded-xl bg-contain bg-bottom bg-no-repeat overflow-hidden border-2 border-slate-200 group-hover:border-blue-500 transition-all duration-200" style={{ backgroundImage: 'url("https://www.tameeni.com/images/products-cards/premium-residency.webp")' }}>
                      <div className="w-full flex flex-col gap-2 p-6 h-full justify-start">
                        <h2 className="text-lg text-slate-900 font-bold mb-2">الإقامة المميزة</h2>
                        <span className="cursor-pointer whitespace-nowrap text-center min-h-9 min-w-[7.5rem] px-4 py-2 text-xs rounded-sm bg-blue-200 text-blue-600 font-bold group-hover:bg-primary group-hover:text-white transition-all duration-200 inline-flex items-center justify-center">
                          ابدأ الآن
                        </span>
                      </div>
                    </div>
                  </a>

                  {/* Card 6: الحماية والادخار */}
                  <a 
                    className="cursor-pointer group shrink-0" 
                    href="#savings"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(lang === 'ar' ? 'قسم الحماية والادخار محاكى حالياً.' : 'Protection and Savings is simulated.');
                    }}
                  >
                    <div className="w-56 h-64 flex items-end rounded-xl bg-contain bg-bottom bg-no-repeat overflow-hidden border-2 border-slate-200 group-hover:border-blue-500 transition-all duration-200" style={{ backgroundImage: 'url("https://www.tameeni.com/images/products-cards/life.webp")' }}>
                      <div className="w-full flex flex-col gap-2 p-6 h-full justify-start">
                        <h2 className="text-lg text-slate-900 font-bold mb-2">الحماية والادخار</h2>
                        <span className="cursor-pointer whitespace-nowrap text-center min-h-9 min-w-[7.5rem] px-4 py-2 text-xs rounded-sm bg-blue-200 text-blue-600 font-bold group-hover:bg-primary group-hover:text-white transition-all duration-200 inline-flex items-center justify-center">
                          ابدأ الآن
                        </span>
                      </div>
                    </div>
                  </a>

                  {/* Card 7: المنزل */}
                  <a 
                    className="cursor-pointer group shrink-0" 
                    href="#home"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(lang === 'ar' ? 'قسم تأمين المنزل محاكى حالياً.' : 'Home Insurance is simulated.');
                    }}
                  >
                    <div className="w-56 h-64 flex items-end rounded-xl bg-contain bg-bottom bg-no-repeat overflow-hidden border-2 border-slate-200 group-hover:border-blue-500 transition-all duration-200" style={{ backgroundImage: 'url("https://www.tameeni.com/images/products-cards/home.webp")' }}>
                      <div className="w-full flex flex-col gap-2 p-6 h-full justify-start">
                        <h2 className="text-lg text-slate-900 font-bold mb-2">المنزل</h2>
                        <span className="cursor-pointer whitespace-nowrap text-center min-h-9 min-w-[7.5rem] px-4 py-2 text-xs rounded-sm bg-blue-200 text-blue-600 font-bold group-hover:bg-primary group-hover:text-white transition-all duration-200 inline-flex items-center justify-center">
                          ابدأ الآن
                        </span>
                      </div>
                    </div>
                  </a>
                </>
              ) : (
                <>
                  {/* Corporate content */}
                  {/* Card 1: أسطول السيارات */}
                  <a 
                    className="cursor-pointer group shrink-0" 
                    href="#fleet"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(lang === 'ar' ? 'طلب عرض سعر لأسطول المنشأة.' : 'Corporate fleet inquiry.');
                    }}
                  >
                    <div className="w-56 h-64 flex items-end rounded-xl bg-contain bg-bottom bg-no-repeat overflow-hidden border-2 border-slate-200 group-hover:border-blue-500 transition-all duration-200" style={{ backgroundImage: 'url("https://www.tameeni.com/images/products-cards/motor.webp")' }}>
                      <div className="w-full flex flex-col gap-2 p-6 h-full justify-start">
                        <h2 className="text-lg text-slate-900 font-bold mb-2">أسطول السيارات</h2>
                        <span className="cursor-pointer whitespace-nowrap text-center min-h-9 min-w-[7.5rem] px-4 py-2 text-xs rounded-sm bg-blue-200 text-blue-600 font-bold group-hover:bg-primary group-hover:text-white transition-all duration-200 inline-flex items-center justify-center">
                          ابدأ الآن
                        </span>
                      </div>
                    </div>
                  </a>

                  {/* Card 2: نقل البضائع */}
                  <a 
                    className="cursor-pointer group shrink-0" 
                    href="#marine"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(lang === 'ar' ? 'تأمين نقل البضائع للمنشآت.' : 'Cargo and marine insurance.');
                    }}
                  >
                    <div className="w-56 h-64 flex items-end rounded-xl bg-contain bg-bottom bg-no-repeat overflow-hidden border-2 border-slate-200 group-hover:border-blue-500 transition-all duration-200" style={{ backgroundImage: 'url("https://www.tameeni.com/images/products-cards/home.webp")' }}>
                      <div className="w-full flex flex-col gap-2 p-6 h-full justify-start">
                        <h2 className="text-lg text-slate-900 font-bold mb-2">نقل البضائع</h2>
                        <span className="cursor-pointer whitespace-nowrap text-center min-h-9 min-w-[7.5rem] px-4 py-2 text-xs rounded-sm bg-blue-200 text-blue-600 font-bold group-hover:bg-primary group-hover:text-white transition-all duration-200 inline-flex items-center justify-center">
                          ابدأ الآن
                        </span>
                      </div>
                    </div>
                  </a>

                  {/* Card 3: الأخطاء الطبية */}
                  <a 
                    className="cursor-pointer group shrink-0" 
                    href="#mmp"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(lang === 'ar' ? 'طلب عروض أخطاء طبية جماعية.' : 'Group Medical Malpractice.');
                    }}
                  >
                    <div className="w-56 h-64 flex items-end rounded-xl bg-contain bg-bottom bg-no-repeat overflow-hidden border-2 border-slate-200 group-hover:border-blue-500 transition-all duration-200" style={{ backgroundImage: 'url("https://www.tameeni.com/images/products-cards/mmp.webp")' }}>
                      <div className="w-full flex flex-col gap-2 p-6 h-full justify-start">
                        <h2 className="text-lg text-slate-900 font-bold mb-2">الأخطاء الطبية</h2>
                        <span className="cursor-pointer whitespace-nowrap text-center min-h-9 min-w-[7.5rem] px-4 py-2 text-xs rounded-sm bg-blue-200 text-blue-600 font-bold group-hover:bg-primary group-hover:text-white transition-all duration-200 inline-flex items-center justify-center">
                          ابدأ الآن
                        </span>
                      </div>
                    </div>
                  </a>
                </>
              )}
            </div>

            {/* Right scroll control arrow */}
            <div className="transition-all duration-300 z-10 absolute end-0 top-0 w-20 h-full backdrop-blur-[1px] bg-gradient-to-r from-white to-transparent items-center justify-end p-2 hidden md:flex pointer-events-none">
              <button 
                className="cursor-pointer whitespace-nowrap transition-colors border border-slate-200 size-11 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center shadow-sm pointer-events-auto" 
                type="button"
                onClick={() => scrollProducts('right')}
              >
                <ArrowLeft className="text-slate-600 size-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* E5. COMPREHENSIVE VS THIRD-PARTY COMPARISON SECTION */}
      <section className="box py-6 lg:py-14 px-4 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto mb-8 text-center">
          <h1 className="text-2xl lg:text-4xl font-extrabold text-slate-900 mb-2 whitespace-pre-line leading-snug">
            هل يجب أن أشتري تأمينًا شاملًا أم تأمين طرف ثالث لسيارتي؟
          </h1>
          <h2 className="text-sm lg:text-lg text-slate-600 max-w-3xl mx-auto mb-8 whitespace-pre-line">
            تحقق من مزايا كل نوع أدناه وقارن بينها لمساعدتك في اتخاذ القرار الأفضل وفقًا لاحتياجاتك ونطاق ميزانيتك.
          </h2>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 lg:gap-8">
            
            {/* Card 1: ضد الغير */}
            <div className="w-full md:w-1/3 rounded-xl p-px drop-shadow-md border border-slate-200 bg-white flex flex-col justify-between">
              <div className="flex flex-col gap-4 py-6 px-5 h-full">
                <div className="flex flex-col items-start p-0">
                  <div className="inline-flex items-center justify-center rounded-full py-1.5 px-4 h-7 text-xs font-semibold bg-slate-400 text-white gap-2">
                    التغطية الأساسية
                  </div>
                </div>

                <div className="space-y-4 p-0 grow">
                  <div className="flex flex-col min-h-[7rem]">
                    <div className="grow mb-4 text-right">
                      <h6 className="text-lg font-bold text-slate-900 mb-1">ضد الغير (الطرف الثالث)</h6>
                      <h6 className="text-xs text-slate-500 leading-relaxed">التغطية الأساسية المطلوبة لتجنب المخالفات المرورية</h6>
                    </div>
                    
                    <button 
                      className="cursor-pointer whitespace-nowrap transition-colors focus-visible:outline-none text-center min-h-10 px-4 py-2 text-xs font-semibold rounded-md gap-2 bg-primary text-white hover:bg-primary/90 active:bg-primary/80 w-full inline-flex items-center justify-center" 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        formRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      اشتر الآن
                    </button>
                  </div>

                  <section className="flex flex-col gap-2 mt-4 text-right">
                    <div className="flex gap-2 w-full justify-start items-start">
                      <div className="mt-1">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="shrink-0 size-4.5 text-emerald-600">
                          <circle cx="12" cy="11.9998" r="9.00375" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
                          <path d="M8.44252 12.3397L10.6104 14.5076L10.5964 14.4936L15.4875 9.60254" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">يغطي الأضرار التي قد تتسبب بها مركبتك لطرف ثالث (مثل إصلاح مركبة شخص آخر أو تعويض أضرار ممتلكاته)</p>
                    </div>
                  </section>
                </div>
              </div>

              <div className="flex items-center justify-center text-center text-[10px] text-slate-400 py-3 border-t border-slate-100 mt-6 px-4">
                هذا النوع من التأمين إلزامي قانونًا في المملكة لجميع المركبات
              </div>
            </div>

            {/* Card 2: التأمين الشامل */}
            <div className="w-full md:w-1/3 rounded-xl p-px drop-shadow-md bg-gradient-golden flex flex-col justify-between">
              <div className="rounded-xl flex flex-col gap-4 py-6 px-5 h-full bg-gradient-golden-light">
                <div className="flex flex-col items-start p-0">
                  <div className="inline-flex items-center justify-center rounded-full py-1.5 px-4 h-7 text-xs font-semibold bg-amber-500 text-white gap-2">
                    أفضل تغطية
                  </div>
                </div>

                <div className="space-y-4 p-0 grow">
                  <div className="flex flex-col min-h-[7rem]">
                    <div className="grow mb-4 text-right">
                      <h6 className="text-lg font-bold text-slate-900 mb-1">التأمين الشامل</h6>
                      <h6 className="text-xs text-slate-500 leading-relaxed">توفر هذه التغطية حماية لسيارتك في حال وقوع الحوادث، حيث تغطي تكاليف الإصلاح أو الاستبدال (بغض النظر عن من كان السبب في الحادث)</h6>
                    </div>
                    
                    <button 
                      className="cursor-pointer whitespace-nowrap transition-colors focus-visible:outline-none text-center min-h-10 px-4 py-2 text-xs font-semibold rounded-md gap-2 bg-primary text-white hover:bg-primary/90 active:bg-primary/80 w-full inline-flex items-center justify-center" 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        formRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      اشتر الآن
                    </button>
                  </div>

                  <section className="flex flex-col gap-2 mt-4 text-right">
                    {[
                      'المسؤولية تجاه الغير',
                      'إصلاح السيارة',
                      'الكوارث الطبيعية',
                      'سرقة السيارة',
                      'عدم تحمل نسبة استهلاك قطع الغيار',
                      'إمكانية التقسيط',
                      'الحريق',
                      'تعويض الحوادث الشخصية للسائق',
                      'تغطية شاملة للسيارة المؤمن عليها'
                    ].map((feat, idx) => (
                      <div key={idx} className="flex gap-2 w-full justify-start items-center">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="shrink-0 size-4.5 text-emerald-600">
                          <circle cx="12" cy="11.9998" r="9.00375" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
                          <path d="M8.44252 12.3397L10.6104 14.5076L10.5964 14.4936L15.4875 9.60254" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        <p className="text-xs text-slate-700 font-semibold">{feat}</p>
                      </div>
                    ))}
                  </section>
                </div>
              </div>
            </div>

            {/* Card 3: ضد الغير بلس */}
            <div className="w-full md:w-1/3 rounded-xl p-px drop-shadow-md bg-gradient-secondary flex flex-col justify-between">
              <div className="rounded-xl flex flex-col gap-4 py-6 px-5 h-full bg-white">
                <div className="flex flex-col items-start p-0">
                  <div className="inline-flex items-center justify-center rounded-full py-1.5 px-4 h-7 text-xs font-semibold bg-indigo-500 text-white gap-2">
                    التغطية المخصصة
                  </div>
                </div>

                <div className="space-y-4 p-0 grow">
                  <div className="flex flex-col min-h-[7rem]">
                    <div className="grow mb-4 text-right">
                      <h6 className="text-lg font-bold text-slate-900 mb-1">ضد الغير بلس</h6>
                      <h6 className="text-xs text-slate-500 leading-relaxed">توفر تغطية التأمين ضد الغير مع تغطيات إضافية ومخصصة لحمايتك</h6>
                    </div>
                    
                    <button 
                      className="cursor-pointer whitespace-nowrap transition-colors focus-visible:outline-none text-center min-h-10 px-4 py-2 text-xs font-semibold rounded-md gap-2 bg-primary text-white hover:bg-primary/90 active:bg-primary/80 w-full inline-flex items-center justify-center" 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        formRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      اشتر الآن
                    </button>
                  </div>

                  <section className="flex flex-col gap-2 mt-4 text-right">
                    {[
                      'تغطية سيارة مالك الوثيقة بشروط محددة',
                      'تغطيات إضافية مقدمة من شركة التأمين'
                    ].map((feat, idx) => (
                      <div key={idx} className="flex gap-2 w-full justify-start items-center">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="shrink-0 size-4.5 text-emerald-600">
                          <circle cx="12" cy="11.9998" r="9.00375" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
                          <path d="M8.44252 12.3397L10.6104 14.5076L10.5964 14.4936L15.4875 9.60254" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        <p className="text-xs text-slate-700 font-semibold">{feat}</p>
                      </div>
                    ))}
                  </section>
                </div>
              </div>

              <div className="flex items-center justify-center text-center text-[10px] text-slate-400 py-3 border-t border-slate-100 mt-6 px-4">
                التغطيات لهذا المنتج تكون منوعة ومخصصة بناء على شركة التأمين
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* F. OFFICIAL TAMEENI PLUS PRODUCTS SECTION */}

      <section className="py-12 bg-white" id="tameeni-plus-section">
        <div className="box max-w-7xl mx-auto px-4 w-full">
          <div className="flex flex-col">
            {/* Banner Header Strip */}
            <div className="flex items-center justify-between relative rounded-t-2xl overflow-hidden p-4 lg:p-6 bg-slate-900">
              <img 
                alt="" 
                loading="lazy" 
                width="1000" 
                height="1000" 
                className="absolute top-0 left-0 w-full h-full object-cover z-10 rtl:scale-x-[-1]" 
                src="https://www.tameeni.com/images/tameeni-plus/banner-bg.png" 
                style={{ color: 'transparent' }}
              />
              <img 
                alt="" 
                loading="lazy" 
                width="640" 
                height="100" 
                className="absolute top-0 left-0 right-0 mx-auto object-contain z-20 rtl:scale-x-[-1]" 
                src="https://www.tameeni.com/images/tameeni-plus/coins-bg.png" 
                style={{ color: 'transparent' }}
              />
              <img 
                alt="" 
                loading="lazy" 
                width="159" 
                height="100" 
                className="absolute bottom-0 lg:start-0 lg:end-0 -end-6 lg:mx-auto object-contain z-30 rtl:scale-x-[-1]" 
                src="https://www.tameeni.com/images/tameeni-plus/tameeni-plus-persons.svg" 
                style={{ color: 'transparent' }}
              />
              <div className="flex flex-col text-white z-40 pe-[120px] lg:pe-0">
                <h2 className="text-lg lg:text-2xl font-bold whitespace-nowrap">نقدّم لكم تأميني بلس</h2>
                <p className="text-xs lg:text-sm">وجهتك الشاملة لخدمات السيارات المميزة والإكسسوارات</p>
              </div>
              <button 
                className="cursor-pointer whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-100 disabled:cursor-not-allowed text-center bg-white text-slate-500 hover:bg-white/60 active:bg-slate-50 disabled:bg-slate-300 disabled:text-slate-400 z-40 inline-flex items-center justify-center" 
                type="button"
                onClick={() => setIsPlusDrawerOpen(true)}
              >
                <div className="flex items-center w-full gap-2 justify-center">
                  <div className="overflow-hidden self-center">
                    <div>
                      <span className="text-sm hidden lg:flex text-blue-500 font-bold py-3 px-6">
                        جميع العروض
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Orange background container with products list */}
            <div className="bg-orange-50 rounded-b-2xl py-6 border border-border">
              <div className="flex flex-nowrap lg:grid lg:grid-cols-4 gap-3 lg:px-6 lg:gap-6 overflow-x-auto scroll-smooth">
                
                {/* Product 1 */}
                <div className="flex flex-col gap-2 rounded-xl bg-white w-64 lg:w-full shrink-0 border border-border lg:first:ms-0 lg:last:me-0 first:ms-4 last:me-4">
                  <a 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full rounded-t-xl h-44 relative z-10 shrink-0" 
                    href="https://www.tameeni.com/tameeniplus/product-details?id=be56c542-dcea-408e-6290-08de81cf0e37"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="absolute top-4 start-4 flex flex-col gap-1 z-20">
                      <span className="text-xs font-bold rounded-xl py-0.5 px-2 w-fit bg-red-500 text-white">عرض توفير ضخم</span>
                    </div>
                    <img 
                      alt="تظليل حراري نانو سيراميك" 
                      loading="lazy" 
                      width="420" 
                      height="240" 
                      className="w-full h-full object-cover rounded-t-xl absolute top-0 left-0" 
                      src="https://vas-docs.tameeni.com/VAS-Temp/products/be56c542-dcea-408e-6290-08de81cf0e37/d0bbdf93-55c1-4432-882e-08de81c36523/0d04bfe1-c054-461b-90ee-c3aa7632faff.jpg?v=639168581570423241" 
                      style={{ color: 'transparent' }}
                    />
                  </a>
                  <div className="flex flex-col gap-4 p-4 -mt-12 z-20 h-full">
                    <div className="flex flex-col gap-2">
                      <div className="size-12 rounded-sm border border-border p-2 flex items-center justify-center bg-white w-12 h-12">
                        <img 
                          alt="ديتاليواوتو" 
                          loading="lazy" 
                          width="48" 
                          height="48" 
                          src="https://www.tameeni.com/tameeniplus/attachments/suppliers/Dettaglioauto.jpg?v=639168581570423248" 
                          style={{ color: 'transparent' }}
                        />
                      </div>
                      <span className="text-gray-600 text-[11px] line-clamp-1 font-bold">ديتاليواوتو</span>
                    </div>
                    <h3 className="text-sm font-bold text-black line-clamp-2 h-10">تظليل حراري نانو سيراميك (شامل سلسلة مفاتيح جلدية)</h3>
                    <div className="flex flex-col text-xs text-gray-500">
                      <p className="line-clamp-2">ضمان لمدة 5 سنوات وعزل يصل إلى 60% للأشعة فوق البنفسجية والحرارة.</p>
                      <a href="#more" className="text-blue-500 font-semibold mt-1" onClick={(e) => e.preventDefault()}>عرض المزيد</a>
                    </div>
                    <div className="flex items-end justify-between mt-auto pt-2 border-t border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400">الأسعار تبدأ من</span>
                        <div className="text-black font-extrabold text-base flex items-center gap-1">
                          <img alt="SAR" className="w-3 h-3" src="https://www.tameeni.com/icons/Saudi-Riyal-Symbol.svg" />
                          <span>649</span>
                          <span className="text-gray-400 text-xs line-through ml-2 font-normal">1300</span>
                        </div>
                      </div>
                      <span className="bg-[#FF7A00] text-white text-[10px] px-2 py-0.5 font-bold rounded">50% خصم</span>
                    </div>
                  </div>
                </div>

                {/* Product 2 */}
                <div className="flex flex-col gap-2 rounded-xl bg-white w-64 lg:w-full shrink-0 border border-border lg:first:ms-0 lg:last:me-0 first:ms-4 last:me-4">
                  <a 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full rounded-t-xl h-44 relative z-10 shrink-0" 
                    href="https://www.tameeni.com/tameeniplus/product-details?id=5533b6a9-5da6-4386-9e05-08de8354b23f"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="absolute top-4 start-4 flex flex-col gap-1 z-20">
                      <span className="text-xs font-bold rounded-xl py-0.5 px-2 w-fit bg-orange-500 text-white">شامل التركيب*</span>
                      <span className="text-xs font-bold rounded-xl py-0.5 px-2 w-fit bg-red-500 text-white">عرض توفير ضخم</span>
                    </div>
                    <img 
                      alt="داش كام أمامية وخلفية" 
                      loading="lazy" 
                      width="420" 
                      height="240" 
                      className="w-full h-full object-cover rounded-t-xl absolute top-0 left-0" 
                      src="https://vas-docs.tameeni.com/VAS-Temp/products/5533b6a9-5da6-4386-9e05-08de8354b23f/eaa3787f-782a-4335-aeef-b78b0f7d764b.jpg?v=639168581570421154" 
                      style={{ color: 'transparent' }}
                    />
                  </a>
                  <div className="flex flex-col gap-4 p-4 -mt-12 z-20 h-full">
                    <div className="flex flex-col gap-2">
                      <div className="size-12 rounded-sm border border-border p-2 flex items-center justify-center bg-white w-12 h-12">
                        <img 
                          alt="داش كام السعودية" 
                          loading="lazy" 
                          width="48" 
                          height="48" 
                          src="https://vas-docs.tameeni.com/VAS-Temp/suppliers/2e833fe1-f6d7-4094-b292-850a3f7a8b64.png?v=639168581570421158" 
                          style={{ color: 'transparent' }}
                        />
                      </div>
                      <span className="text-gray-600 text-[11px] line-clamp-1 font-bold">داش كام السعودية</span>
                    </div>
                    <h3 className="text-sm font-bold text-black line-clamp-2 h-10">داش كام ثينك وير F790 أمامية وخلفية</h3>
                    <div className="flex flex-col text-xs text-gray-500">
                      <p className="line-clamp-2">شامل التركيب مجاناً بقيمة 200 ريال في الرياض وجدة والدمام.</p>
                      <a href="#more" className="text-blue-500 font-semibold mt-1" onClick={(e) => e.preventDefault()}>عرض المزيد</a>
                    </div>
                    <div className="flex items-end justify-between mt-auto pt-2 border-t border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400">الأسعار تبدأ من</span>
                        <div className="text-black font-extrabold text-base flex items-center gap-1">
                          <img alt="SAR" className="w-3 h-3" src="https://www.tameeni.com/icons/Saudi-Riyal-Symbol.svg" />
                          <span>849</span>
                          <span className="text-gray-400 text-xs line-through ml-2 font-normal">1550</span>
                        </div>
                      </div>
                      <span className="bg-[#FF7A00] text-white text-[10px] px-2 py-0.5 font-bold rounded">45% خصم</span>
                    </div>
                  </div>
                </div>

                {/* Product 3 */}
                <div className="flex flex-col gap-2 rounded-xl bg-white w-64 lg:w-full shrink-0 border border-border lg:first:ms-0 lg:last:me-0 first:ms-4 last:me-4">
                  <a 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full rounded-t-xl h-44 relative z-10 shrink-0" 
                    href="https://www.tameeni.com/tameeniplus/product-details?id=66c46494-3b8b-4455-6291-08de81cf0e37"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="absolute top-4 start-4 flex flex-col gap-1 z-20">
                      <span className="text-xs font-bold rounded-xl py-0.5 px-2 w-fit bg-red-500 text-white">عرض توفير ضخم</span>
                    </div>
                    <img 
                      alt="نانوسيراميك" 
                      loading="lazy" 
                      width="420" 
                      height="240" 
                      className="w-full h-full object-cover rounded-t-xl absolute top-0 left-0" 
                      src="https://vas-docs.tameeni.com/VAS-Temp/products/66c46494-3b8b-4455-6291-08de81cf0e37/824cc5f2-1347-4ef2-6d18-08de81c07a9b/949924a5-2800-4b22-b92d-004b560df8e1.jpg?v=639168581570416554" 
                      style={{ color: 'transparent' }}
                    />
                  </a>
                  <div className="flex flex-col gap-4 p-4 -mt-12 z-20 h-full">
                    <div className="flex flex-col gap-2">
                      <div className="size-12 rounded-sm border border-border p-2 flex items-center justify-center bg-white w-12 h-12">
                        <img 
                          alt="ديتاليواوتو" 
                          loading="lazy" 
                          width="48" 
                          height="48" 
                          src="https://www.tameeni.com/tameeniplus/attachments/suppliers/Dettaglioauto.jpg?v=639168581570423248" 
                          style={{ color: 'transparent' }}
                        />
                      </div>
                      <span className="text-gray-600 text-[11px] line-clamp-1 font-bold">ديتاليواوتو</span>
                    </div>
                    <h3 className="text-sm font-bold text-black line-clamp-2 h-10">نانوسيراميك خارجي طبقتان (حماية فائقة)</h3>
                    <div className="flex flex-col text-xs text-gray-500">
                      <p className="line-clamp-2">درع لحماية طلاء السيارة من الخدوش والعوامل الجوية وبهتان اللون.</p>
                      <a href="#more" className="text-blue-500 font-semibold mt-1" onClick={(e) => e.preventDefault()}>عرض المزيد</a>
                    </div>
                    <div className="flex items-end justify-between mt-auto pt-2 border-t border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400">الأسعار تبدأ من</span>
                        <div className="text-black font-extrabold text-base flex items-center gap-1">
                          <img alt="SAR" className="w-3 h-3" src="https://www.tameeni.com/icons/Saudi-Riyal-Symbol.svg" />
                          <span>698.99</span>
                          <span className="text-gray-400 text-xs line-through ml-2 font-normal">1100</span>
                        </div>
                      </div>
                      <span className="bg-[#FF7A00] text-white text-[10px] px-2 py-0.5 font-bold rounded">36% خصم</span>
                    </div>
                  </div>
                </div>

                {/* Product 4 */}
                <div className="flex flex-col gap-2 rounded-xl bg-white w-64 lg:w-full shrink-0 border border-border lg:first:ms-0 lg:last:me-0 first:ms-4 last:me-4">
                  <a 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full rounded-t-xl h-44 relative z-10 shrink-0" 
                    href="https://www.tameeni.com/tameeniplus/product-details?id=868c37d1-ddf7-4286-0c58-08ddf9cd1f11"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="absolute top-4 start-4 flex flex-col gap-1 z-20">
                      <span className="text-xs font-bold rounded-xl py-0.5 px-2 w-fit bg-red-500 text-white">عرض توفير ضخم</span>
                    </div>
                    <img 
                      alt="١٠ غسلات سيارات" 
                      loading="lazy" 
                      width="420" 
                      height="240" 
                      className="w-full h-full object-cover rounded-t-xl absolute top-0 left-0" 
                      src="https://vas-docs.tameeni.com/VAS-Temp/products/868c37d1-ddf7-4286-0c58-08ddf9cd1f11/6dedc225-5984-4594-7c8f-08ddf9d0bea1/005a69c7-8285-42d5-ace1-c6dcfda5f2a0.jpg?v=639168581570411803" 
                      style={{ color: 'transparent' }}
                    />
                  </a>
                  <div className="flex flex-col gap-4 p-4 -mt-12 z-20 h-full">
                    <div className="flex flex-col gap-2">
                      <div className="size-12 rounded-sm border border-border p-2 flex items-center justify-center bg-white w-12 h-12">
                        <img 
                          alt="سويتر" 
                          loading="lazy" 
                          width="48" 
                          height="48" 
                          src="https://www.tameeni.com/tameeniplus/attachments/suppliers/sweater.png?v=639168581570411808" 
                          style={{ color: 'transparent' }}
                        />
                      </div>
                      <span className="text-gray-600 text-[11px] line-clamp-1 font-bold">سويتر</span>
                    </div>
                    <h3 className="text-sm font-bold text-black line-clamp-2 h-10">باقة ١٠ غسلات سيارات (داخلي وخارجي)</h3>
                    <div className="flex flex-col text-xs text-gray-500">
                      <p className="line-clamp-2">تنظيف وتلميع كامل في موقعك مع كنس وتعطير المراتب.</p>
                      <a href="#more" className="text-blue-500 font-semibold mt-1" onClick={(e) => e.preventDefault()}>عرض المزيد</a>
                    </div>
                    <div className="flex items-end justify-between mt-auto pt-2 border-t border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400">الأسعار تبدأ من</span>
                        <div className="text-black font-extrabold text-base flex items-center gap-1">
                          <img alt="SAR" className="w-3 h-3" src="https://www.tameeni.com/icons/Saudi-Riyal-Symbol.svg" />
                          <span>279</span>
                          <span className="text-gray-400 text-xs line-through ml-2 font-normal">598</span>
                        </div>
                      </div>
                      <span className="bg-[#FF7A00] text-white text-[10px] px-2 py-0.5 font-bold rounded">53% خصم</span>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Mobile View Tameeni Plus CTA Button */}
              <button 
                className="cursor-pointer whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-100 disabled:cursor-not-allowed text-center min-h-14 min-w-[10.625rem] px-6 text-base font-bold rounded-lg gap-2.5 bg-primary text-white hover:bg-primary/90 active:bg-primary/80 disabled:bg-slate-400 lg:hidden mt-4 mx-4 w-[calc(100%-2rem)] inline-flex items-center justify-center" 
                type="button"
                onClick={() => setIsPlusDrawerOpen(true)}
              >
                <div className="flex items-center w-full gap-2 justify-center">
                  <div className="overflow-hidden self-center">
                    <div>
                      <span>جميع العروض</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* G. MOJAZ HISTORY REPORT DIALOG MODAL */}
      {showMojazModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--secondary-900)' }}>
                {lang === 'ar' ? 'استعلام تاريخ المركبة - تقرير موجز الموحد' : 'Mojaz Vehicle Diagnostic History'}
              </h3>
              <button onClick={() => { setShowMojazModal(false); setMojazResult(null); setMojazSearchQuery(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleMojazQuery} style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
                {mojazLoading ? <RefreshCw className="animate-spin" size={16} /> : <Search size={16} />}
                <span>{lang === 'ar' ? 'استعلام' : 'Inquire'}</span>
              </button>
              <input 
                type="text"
                className="form-control"
                placeholder={lang === 'ar' ? 'أدخل الرقم التسلسلي للمركبة (9 أرقام)' : 'Enter 9 digits Serial Code'}
                value={mojazSearchQuery}
                onChange={(e) => setMojazSearchQuery(e.target.value.replace(/\D/g, ''))}
                maxLength={9}
                style={{ flex: 1 }}
              />
            </form>

            {mojazResult && (
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.25rem', textAlign: isRTL ? 'right' : 'left' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary-500)', marginBottom: '10px' }}>
                  {mojazResult.brand} ({mojazResult.year})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'هيكل المركبة (شاسيه)' : 'Chassis ID'}</span>
                    <strong style={{ fontFamily: 'monospace' }}>{mojazResult.chassis}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الممشى (العداد)' : 'Odometer'}</span>
                    <strong>{mojazResult.mileage}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'عدد الملاك السابقين' : 'Previous Owners'}</span>
                    <strong>{mojazResult.owners}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الحوادث المسجلة' : 'Accident History'}</span>
                    <strong style={{ color: '#EF4444' }}>{mojazResult.accidents}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
}
