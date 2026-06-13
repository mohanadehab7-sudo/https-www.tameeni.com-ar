import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Header & Footer
    tameeni: 'Tameeni',
    home: 'Home',
    contactUs: 'Contact Us',
    myAccount: 'Login to My Account',
    individuals: 'For Individuals',
    corporate: 'For Corporate',
    insuranceAuthority: 'Insurance Authority',
    regulated: 'Licensed and Regulated by',
    copyright: '© 2026 Tameeni. First Insurance Comparison Platform in KSA. All rights reserved.',

    // Tab categories
    tabMotor: 'Motor',
    tabHealth: 'Health',
    tabMMP: 'Medical Errors',
    tabDomestic: 'Domestic Helpers',
    tabTravel: 'Travel',
    tabFleet: 'Fleet',
    tabSavings: 'Savings & Protection',
    tabHome: 'Home Insurance',

    // Hero Section
    heroTitle: 'First Insurance Comparison Platform in Saudi Arabia',
    heroSub: 'Compare and purchase policies instantly from 20+ Saudi providers. Get the best rates in less than a minute.',
    startNow: 'Compare Now',
    mojazReport: 'Mojaz Vehicle Report',

    // Home Search Card
    serialNumberLabel: 'Vehicle Serial Number',
    serialNumberPlaceholder: 'e.g. 123456789 (9 digits)',
    nationalIdLabel: 'National ID / Iqama Number',
    nationalIdPlaceholder: 'e.g. 1xxxxxxxx or 2xxxxxxxx',
    purposeLabel: 'Purpose of Insurance',
    purposePrivate: 'Private Use',
    purposeCommercial: 'Commercial Use',
    captchaLabel: 'Enter Captcha Code',
    captchaPlaceholder: 'Enter the 4 digits',
    btnSearchQuotes: 'Show Insurance Quotes',

    // Errors
    errEmpty: 'All input fields are required',
    errID: 'ID must be 10 digits starting with 1 or 2',
    errSerial: 'Serial number must be 9 digits',
    errCaptcha: 'Captcha verification failed',

    // Comparison Dashboard
    compareTitle: 'Compare Insurance Quotes',
    compareSub: 'Select the best quote that fits your budget and cover requirements.',
    cheapestFirst: 'Cheapest First',
    tpl: 'Third-Party Liability (TPL)',
    comprehensive: 'Comprehensive Insurance',
    btnBuyNow: 'Buy Policy',
    sar: 'SAR',
    vatIncluded: 'VAT Included',
    addonsLabel: 'Coverage Addons',
    addonRoadside: 'Roadside Assistance (+150 SAR)',
    addonAgency: 'Agency Repair (+500 SAR)',
    addonDeductible: 'Zero Deductible (+300 SAR)',
    filtersTitle: 'Refine Comparison',

    // Checkout
    checkoutTitle: 'Secure Checkout',
    checkoutSub: 'Review policy details and complete payment.',
    policySummary: 'Policy Summary',
    insuranceCompany: 'Insurance Company',
    vehicleDetails: 'Vehicle Details',
    totalAmount: 'Total Amount Due',
    mada: 'Mada Card',
    sadad: 'SADAD Bill',
    creditCard: 'Credit Card',
    sadadBillerInfo: 'Tameeni SADAD Code: 801',
    sadadBillCode: 'SADAD Bill Number',
    cardNumber: 'Card Number',
    cardName: 'Cardholder Name',
    cardExpiry: 'Expiry MM/YY',
    btnPay: 'Complete Payment & Issue Policy',

    // Success
    issueSuccess: 'Insurance Policy Issued Successfully!',
    policyNo: 'Policy Number',
    certificatePdf: 'Print Policy Certificate',
    backHome: 'Back to Homepage',
    smsNotice: 'SMS sent containing the insurance policy activation code and digital document.',

    // Providers
    providerTawuniya: 'Tawuniya',
    providerRajhi: 'Al Rajhi Takaful',
    providerMalath: 'Malath Insurance',
    providerMedgulf: 'Medgulf',
    providerGIG: 'GIG Insurance',
    providerWalaa: 'Walaa Insurance',
    providerLiva: 'Liva',
    providerACIG: 'ACIG',
    providerSalama: 'Salama'
  },
  ar: {
    // Header & Footer
    tameeni: 'تأميني',
    home: 'الرئيسية',
    contactUs: 'تواصل معنا',
    myAccount: 'الدخول لحسابي',
    individuals: 'للأفراد',
    corporate: 'للمنشآت',
    insuranceAuthority: 'هيئة التأمين',
    regulated: 'مرخص وخاضع لرقابة وإشراف',
    copyright: '© 2026 تأميني. المنصة الأولى لمقارنة أسعار التأمين في السعودية. جميع الحقوق محفوظة.',

    // Tab categories
    tabMotor: 'السيارات',
    tabHealth: 'الصحي',
    tabMMP: 'الأخطاء الطبية',
    tabDomestic: 'العمالة المنزلية',
    tabTravel: 'السفر',
    tabFleet: 'أسطول السيارات',
    tabSavings: 'الحماية والادخار',
    tabHome: 'تأمين المنزل',

    // Hero Section
    heroTitle: 'أول منصة لتأمين السيارات في السعودية',
    heroSub: 'قارن أسعار تأمين المركبات من أكثر من 20 شركة واحصل على أفضل عرض وثيقة بشكل فوري.',
    startNow: 'ابدأ الآن',
    mojazReport: 'تقرير موجز',

    // Home Search Card
    serialNumberLabel: 'الرقم التسلسلي للمركبة',
    serialNumberPlaceholder: 'مثال: 123456789 (9 أرقام)',
    nationalIdLabel: 'رقم الهوية الوطنية / الإقامة',
    nationalIdPlaceholder: 'مثال: 1xxxxxxxx أو 2xxxxxxxx',
    purposeLabel: 'الغرض من التأمين',
    purposePrivate: 'استخدام شخصي / خصوصي',
    purposeCommercial: 'نقل تجاري',
    captchaLabel: 'أدخل رمز التحقق المرئي',
    captchaPlaceholder: 'أدخل الـ 4 أرقام الظاهرة',
    btnSearchQuotes: 'عرض أسعار التأمين',

    // Errors
    errEmpty: 'يرجى تعبئة جميع الحقول المطلوبة',
    errID: 'يجب أن يتكون رقم الهوية/الإقامة من 10 أرقام ويبدأ بـ 1 أو 2',
    errSerial: 'يجب أن يتكون الرقم التسلسلي للمركبة من 9 أرقام',
    errCaptcha: 'رمز التحقق المرئي غير صحيح',

    // Comparison Dashboard
    compareTitle: 'مقارنة عروض أسعار التأمين',
    compareSub: 'قارن واختر أفضل عرض تأميني يناسب ميزانيتك واحتياجات التغطية الخاصة بك.',
    cheapestFirst: 'الأرخص أولاً',
    tpl: 'تأمين ضد الغير (TPL)',
    comprehensive: 'تأمين شامل للمركبة',
    btnBuyNow: 'شراء الوثيقة',
    sar: 'ريال سعودي',
    vatIncluded: 'شامل ضريبة القيمة المضافة',
    addonsLabel: 'التغطيات الإضافية الاختيارية',
    addonRoadside: 'المساعدة على الطريق (+150 ريال)',
    addonAgency: 'الإصلاح بالوكالة (+500 ريال)',
    addonDeductible: 'بدون نسبة تحمل (+300 ريال)',
    filtersTitle: 'تصفية العروض المقارنة',

    // Checkout
    checkoutTitle: 'بوابة الدفع الآمنة',
    checkoutSub: 'راجع تفاصيل العرض التأميني المحدد لإتمام عملية الشراء.',
    policySummary: 'ملخص وثيقة التأمين',
    insuranceCompany: 'شركة التأمين المختارة',
    vehicleDetails: 'بيانات المركبة المؤمن عليها',
    totalAmount: 'إجمالي المبلغ المستحق',
    mada: 'بطاقة مدى',
    sadad: 'فاتورة سداد',
    creditCard: 'بطاقة ائتمانية (فيزا/ماستر)',
    sadadBillerInfo: 'رمز سداد لتأميني: 801',
    sadadBillCode: 'رقم سداد للفاتورة',
    cardNumber: 'رقم البطاقة المصرفية',
    cardName: 'اسم صاحب البطاقة',
    cardExpiry: 'تاريخ الانتهاء MM/YY',
    btnPay: 'دفع المبلغ وإصدار الوثيقة فوراً',

    // Success
    issueSuccess: 'تم إصدار وثيقة التأمين بنجاح!',
    policyNo: 'رقم وثيقة التأمين الصادرة',
    certificatePdf: 'تحميل وطباعة شهادة التأمين',
    backHome: 'العودة للصفحة الرئيسية',
    smsNotice: 'تم إرسال رسالة نصية (SMS) إلى رقم جوالك تحتوي على رمز تفعيل الوثيقة ونسختك الرقمية.',

    // Providers
    providerTawuniya: 'التعاونية للتأمين',
    providerRajhi: 'تكافل الراجحي',
    providerMalath: 'ملاذ للتأمين',
    providerMedgulf: 'ميدغلف للتأمين',
    providerGIG: 'جي آي جي السعودية',
    providerWalaa: 'ولاء للتأمين',
    providerLiva: 'ليفا للتأمين',
    providerACIG: 'المجموعة المتحدة ACIG',
    providerSalama: 'سلامة للتأمين'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('ar'); // Default to Arabic for Tameeni KSA

  useEffect(() => {
    const saved = localStorage.getItem('tameeni_lang');
    if (saved) {
      setLang(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'ar' : 'en';
    setLang(next);
    localStorage.setItem('tameeni_lang', next);
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  const isRTL = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
