import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, Award, Star, Info, Settings, Clock, 
  ArrowRight, ArrowLeft, ChevronDown, CheckSquare, Square, 
  PlusCircle, FileText, CheckCircle2 
} from 'lucide-react';
import { getInsurerLogo, SAMAShield } from '../components/Insurers';

export default function Comparison({ queryData, setSelectedQuote, setActiveView }) {
  const { t, isRTL, lang } = useLanguage();

  // Tab State: 'tpl' | 'comprehensive'
  const [coverType, setCoverType] = useState('tpl');

  // Sidebar Filter States
  const [filterRating, setFilterRating] = useState('all');
  const [checkedCompanies, setCheckedCompanies] = useState({
    tawuniya: true,
    rajhi: true,
    malath: true,
    medgulf: true,
    gig: true,
    walaa: true,
    liva: true,
    acig: true,
    salama: true
  });

  // Unique deductible and addons selections for EACH individual quote card
  const [deductibles, setDeductibles] = useState({
    tawuniya: 1000,
    rajhi: 1000,
    malath: 1000,
    medgulf: 1000,
    gig: 1000,
    walaa: 1000,
    liva: 1000,
    acig: 1000,
    salama: 1000
  });

  const [addons, setAddons] = useState({
    tawuniya: { roadside: false, agency: false, gcc: false, rental: false },
    rajhi: { roadside: false, agency: false, gcc: false, rental: false },
    malath: { roadside: false, agency: false, gcc: false, rental: false },
    medgulf: { roadside: false, agency: false, gcc: false, rental: false },
    gig: { roadside: false, agency: false, gcc: false, rental: false },
    walaa: { roadside: false, agency: false, gcc: false, rental: false },
    liva: { roadside: false, agency: false, gcc: false, rental: false },
    acig: { roadside: false, agency: false, gcc: false, rental: false },
    salama: { roadside: false, agency: false, gcc: false, rental: false }
  });

  // Collapsed details tracker state
  const [expandedQuoteKey, setExpandedQuoteKey] = useState(null);

  const toggleAccordion = (key) => {
    if (expandedQuoteKey === key) {
      setExpandedQuoteKey(null);
    } else {
      setExpandedQuoteKey(key);
    }
  };

  const companyBases = [
    { key: 'tawuniya', name: t('providerTawuniya'), rating: 4.8, tplBase: 950, compBase: 2800, logoColor: '#006644' },
    { key: 'rajhi', name: t('providerRajhi'), rating: 4.7, tplBase: 890, compBase: 2600, logoColor: '#0F2C59' },
    { key: 'malath', name: t('providerMalath'), rating: 4.6, tplBase: 920, compBase: 2750, logoColor: '#E28743' },
    { key: 'medgulf', name: t('providerMedgulf'), rating: 4.5, tplBase: 850, compBase: 2400, logoColor: '#1E3A8A' },
    { key: 'gig', name: t('providerGIG'), rating: 4.4, tplBase: 1100, compBase: 3100, logoColor: '#DC2626' },
    { key: 'walaa', name: t('providerWalaa'), rating: 4.5, tplBase: 990, compBase: 2900, logoColor: '#059669' },
    { key: 'liva', name: t('providerLiva'), rating: 4.4, tplBase: 940, compBase: 2700, logoColor: '#7C3AED' },
    { key: 'acig', name: t('providerACIG'), rating: 4.3, tplBase: 880, compBase: 2500, logoColor: '#0D9488' },
    { key: 'salama', name: t('providerSalama'), rating: 4.4, tplBase: 860, compBase: 2450, logoColor: '#2563EB' }
  ];

  // Dynamic pricing calculations for a single card instance
  const getCalculatedPrice = (company) => {
    let base = coverType === 'tpl' ? company.tplBase : company.compBase;
    let addonsTotal = 0;

    // Najm No-claims discount (typically 30% for clean records in KSA)
    const discountPercent = 30;
    const discountAmount = Math.round(base * (discountPercent / 100));
    let netPremium = base - discountAmount;

    // Deductible adjustments (Comprehensive only)
    if (coverType === 'comprehensive') {
      const ded = deductibles[company.key] || 1000;
      if (ded === 0) {
        netPremium += 450; // zero deductible surcharge
      } else if (ded === 2000) {
        netPremium -= 250; // discount for higher deductible
      }
    }

    // Addons additions
    const qAddons = addons[company.key] || {};
    if (qAddons.roadside) addonsTotal += 120;
    if (qAddons.gcc) addonsTotal += 100;
    if (coverType === 'comprehensive') {
      if (qAddons.agency) addonsTotal += 400;
      if (qAddons.rental) addonsTotal += 150;
    }

    const net = netPremium + addonsTotal;
    const vat = Math.round(net * 0.15); // 15% SAMA VAT
    const total = net + vat;

    return { 
      base, 
      discountPercent, 
      discountAmount, 
      netPremium, 
      addonsTotal, 
      vat, 
      total 
    };
  };

  const handleCheckboxToggle = (key) => {
    setCheckedCompanies(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAddonToggle = (compKey, addonKey) => {
    setAddons(prev => ({
      ...prev,
      [compKey]: {
        ...prev[compKey],
        [addonKey]: !prev[compKey][addonKey]
      }
    }));
  };

  const handleDeductibleChange = (compKey, value) => {
    setDeductibles(prev => ({
      ...prev,
      [compKey]: value
    }));
  };

  const handleBuyQuote = (company, prices) => {
    setSelectedQuote({
      key: company.key,
      name: company.name,
      logoColor: company.logoColor,
      base: prices.base,
      addonsTotal: prices.addonsTotal,
      vat: prices.vat,
      total: prices.total,
      coverType,
      deductible: deductibles[company.key]
    });
    setActiveView('checkout');
  };

  const filteredQuotes = companyBases
    .filter(c => checkedCompanies[c.key])
    .filter(c => {
      if (filterRating === 'high') return c.rating >= 4.6;
      return true;
    })
    .map(company => {
      const prices = getCalculatedPrice(company);
      return {
        ...company,
        prices
      };
    })
    .sort((a, b) => a.prices.total - b.prices.total);

  return (
    <div className="animate-fade-in">
      
      {/* 1. BREADCRUMBS ROW */}
      <div 
        style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '1rem 1.5rem', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }}
      >
        <button 
          className="btn btn-secondary" 
          onClick={() => setActiveView('home')}
          style={{ padding: '6px 14px', fontSize: '0.85rem' }}
        >
          {isRTL ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
          <span>{lang === 'ar' ? 'تعديل بيانات البحث' : 'Edit Inquiry Details'}</span>
        </button>

        <div style={{ textAlign: isRTL ? 'right' : 'left', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <span>{lang === 'ar' ? 'الهوية:' : 'ID:'} <strong>{queryData?.nationalId}</strong></span>
          <span style={{ margin: '0 8px' }}>|</span>
          <span>{lang === 'ar' ? 'التسلسلي:' : 'Serial:'} <strong>{queryData?.serialNumber}</strong></span>
        </div>
      </div>

      {/* 2. MAIN LAYOUT GRID */}
      <div className="comparison-layout">
        
        {/* SIDEBAR FILTER PANEL */}
        <aside className="filter-sidebar" style={{ order: isRTL ? 2 : 1 }}>
          <div className="filter-section">
            <h3 className="filter-title">{t('filtersTitle')}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'تصفية سريعة لعروض الأسعار' : 'Refine quote comparisons'}
            </span>
          </div>

          {/* Rating filter select */}
          <div className="filter-section" style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <h4 className="form-label">{lang === 'ar' ? 'تقييم الشركة' : 'Company Rating'}</h4>
            <select 
              className="form-control"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '6px 10px' }}
            >
              <option value="all">{lang === 'ar' ? 'الكل' : 'All Ratings'}</option>
              <option value="high">{lang === 'ar' ? 'أعلى من 4.5 نجوم' : '4.6+ Stars'}</option>
            </select>
          </div>

          {/* Company Checklist */}
          <div className="filter-section" style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <h4 className="form-label" style={{ marginBottom: '10px' }}>{lang === 'ar' ? 'شركات التأمين المتاحة' : 'Insurance Companies'}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
              {companyBases.map((company) => (
                <label 
                  key={company.key} 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer', flexDirection: isRTL ? 'row-reverse' : 'row' }}
                >
                  <input 
                    type="checkbox"
                    checked={checkedCompanies[company.key]}
                    onChange={() => handleCheckboxToggle(company.key)}
                    style={{ accentColor: 'var(--primary-500)' }}
                  />
                  <span>{company.name}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* QUOTES LIST GRID CONTAINER */}
        <div style={{ order: isRTL ? 1 : 2 }}>
          
          {/* Header Toolbar */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '12px',
              flexDirection: isRTL ? 'row-reverse' : 'row'
            }}
          >
            {/* TPL vs Comprehensive selector tabs */}
            <div style={{ display: 'flex', backgroundColor: '#e2e8f0', padding: '3px', borderRadius: '8px' }}>
              <button
                onClick={() => setCoverType('tpl')}
                style={{
                  border: 'none',
                  background: coverType === 'tpl' ? 'white' : 'transparent',
                  color: coverType === 'tpl' ? 'var(--primary-500)' : 'var(--text-secondary)',
                  fontWeight: '800',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                {t('tpl')}
              </button>
              <button
                onClick={() => setCoverType('comprehensive')}
                style={{
                  border: 'none',
                  background: coverType === 'comprehensive' ? 'white' : 'transparent',
                  color: coverType === 'comprehensive' ? 'var(--primary-500)' : 'var(--text-secondary)',
                  fontWeight: '800',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                {t('comprehensive')}
              </button>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '700' }}>
              {t('cheapestFirst')} ({filteredQuotes.length} {lang === 'ar' ? 'عرض متاح' : 'quotes found'})
            </div>
          </div>

          {/* Insurer cards loop */}
          <div className="quotes-container">
            {filteredQuotes.map((q) => {
              const isExpanded = expandedQuoteKey === q.key;
              const qAddons = addons[q.key] || {};
              const qDeductible = deductibles[q.key] || 1000;

              return (
                <div 
                  key={q.key} 
                  style={{ 
                    border: isExpanded ? '1.5px solid var(--primary-500)' : '1px solid var(--border-color)',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'border-color 0.25s'
                  }}
                >
                  {/* MAIN COMPARISON CARD BODY */}
                  <div className="quote-comparison-card" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
                    
                    {/* 1. Insurer Vector Logo & Rating */}
                    <div className="company-logo-section">
                      <div style={{ marginBottom: '8px' }}>
                        {getInsurerLogo(q.key, 55)}
                      </div>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--secondary-900)', textAlign: 'center' }}>
                        {q.name}
                      </strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--warning)', marginTop: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                        <Star size={11} fill="var(--warning)" />
                        <span>{q.rating}</span>
                      </div>
                    </div>

                    {/* 2. Insurer details details */}
                    <div className="quote-details-section" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--secondary-900)' }}>
                            {coverType === 'comprehensive' ? t('comprehensive') : t('tpl')}
                          </h3>
                          <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--success-light)', color: 'var(--success)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                            {lang === 'ar' ? 'معتمد من SAMA' : 'SAMA Approved'}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '3px' }}>
                          {lang === 'ar' 
                            ? 'تشمل الوثيقة الموحدة للتأمين الإجباري ضد الغير للمركبات.'
                            : 'Includes unified compulsory liability policy standard limits.'}
                        </p>
                      </div>

                      {/* Cover chips */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '8px 0' }}>
                        <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#F8FAFC', color: 'var(--secondary-700)', fontWeight: '600' }}>
                          {coverType === 'comprehensive' ? `${lang === 'ar' ? 'مبلغ التحمل:' : 'Deductible:'} ${qDeductible} SAR` : (lang === 'ar' ? 'المسؤولية المدنية' : 'Third Party Liability')}
                        </span>
                        {qAddons.roadside && (
                          <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-500)', fontWeight: '700' }}>
                            ✓ {lang === 'ar' ? 'مساعدة الطريق' : 'Roadside'}
                          </span>
                        )}
                        {qAddons.agency && coverType === 'comprehensive' && (
                          <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-500)', fontWeight: '700' }}>
                            ✓ {lang === 'ar' ? 'إصلاح الوكالة' : 'Agency'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 3. Pricing & Call-to-action */}
                    <div className="quote-price-section">
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{t('totalAmount')}</span>
                      <div className="price-text">{q.prices.total.toLocaleString()} {t('sar')}</div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', margin: '2px 0 10px 0' }}>{t('vatIncluded')}</span>

                      <button className="btn btn-primary btn-block" style={{ padding: '8px 12px', fontSize: '0.82rem' }} onClick={() => handleBuyQuote(q, q.prices)}>
                        {t('btnBuyNow')}
                      </button>
                    </div>

                  </div>

                  {/* ACCORDION EXPANSION TRIGGER BAR */}
                  <div 
                    className="quote-accordion-header"
                    onClick={() => toggleAccordion(q.key)}
                    style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
                  >
                    <span>{isExpanded ? (lang === 'ar' ? 'إغلاق التفاصيل' : 'Close Details') : (lang === 'ar' ? 'عرض تفاصيل الوثيقة والإضافات' : 'Show Details & Addons')}</span>
                    <ChevronDown size={14} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>

                  {/* COLLAPSIBLE ACCORDION BODY */}
                  {isExpanded && (
                    <div className="quote-accordion-content" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="grid-mobile-1">
                        
                        {/* Interactive Deductible & Extras options */}
                        <div>
                          {coverType === 'comprehensive' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--secondary-900)', marginBottom: '8px' }}>
                                {lang === 'ar' ? 'اختر مبلغ التحمل للوثيقة الشاملة' : 'Select Deductible Level'}
                              </h4>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                {[0, 1000, 2000].map(val => (
                                  <button
                                    key={val}
                                    type="button"
                                    className={`btn ${qDeductible === val ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ padding: '6px 12px', fontSize: '0.78rem', flex: 1 }}
                                    onClick={() => handleDeductibleChange(q.key, val)}
                                  >
                                    {val === 0 ? (lang === 'ar' ? 'صفر تحمل' : '0 SAR') : `${val} SAR`}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--secondary-900)', marginBottom: '8px' }}>
                              {t('addonsLabel')}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                <input 
                                  type="checkbox"
                                  checked={qAddons.roadside}
                                  onChange={() => handleAddonToggle(q.key, 'roadside')}
                                />
                                <span>{lang === 'ar' ? 'تغطية المساعدة على الطريق (+120 ريال)' : 'Roadside Assistance (+120 SAR)'}</span>
                              </label>

                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                <input 
                                  type="checkbox"
                                  checked={qAddons.gcc}
                                  onChange={() => handleAddonToggle(q.key, 'gcc')}
                                />
                                <span>{lang === 'ar' ? 'التوسع الجغرافي لدول الخليج العربي (+100 ريال)' : 'GCC Geographical Extension (+100 SAR)'}</span>
                              </label>

                              {coverType === 'comprehensive' && (
                                <>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                    <input 
                                      type="checkbox"
                                      checked={qAddons.agency}
                                      onChange={() => handleAddonToggle(q.key, 'agency')}
                                    />
                                    <span>{lang === 'ar' ? 'باقة الإصلاح بالوكالة (+400 ريال)' : 'Agency Repair Package (+400 SAR)'}</span>
                                  </label>

                                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                    <input 
                                      type="checkbox"
                                      checked={qAddons.rental}
                                      onChange={() => handleAddonToggle(q.key, 'rental')}
                                    />
                                    <span>{lang === 'ar' ? 'توفير سيارة بديلة عند الإصلاح (+150 ريال)' : 'Car Rental Replacement (+150 SAR)'}</span>
                                  </label>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Detailed pricing subtotal breakdown */}
                        <div style={{ backgroundColor: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--secondary-900)', marginBottom: '10px' }}>
                            {lang === 'ar' ? 'تفصيل قسط التأمين الإجمالي' : 'Premium Calculation Breakdown'}
                          </h4>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                              <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'القسط الأساسي للشركة' : 'Base Premium'}</span>
                              <strong>{q.prices.base.toLocaleString()} {t('sar')}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                              <span style={{ color: 'var(--text-secondary)' }}>
                                {lang === 'ar' ? `خصم نجم لعدم وجود مطالبات (${q.prices.discountPercent}%)` : `Najm Discount (${q.prices.discountPercent}%)`}
                              </span>
                              <strong style={{ color: 'var(--success)' }}>-{q.prices.discountAmount.toLocaleString()} {t('sar')}</strong>
                            </div>
                            
                            {coverType === 'comprehensive' && qDeductible !== 1000 && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'تعديل مبلغ التحمل المختارة' : 'Deductible adjustment'}</span>
                                <strong style={{ color: qDeductible === 0 ? 'var(--secondary-900)' : 'var(--success)' }}>
                                  {qDeductible === 0 ? `+450 ${t('sar')}` : `-250 ${t('sar')}`}
                                </strong>
                              </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                              <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'رسوم التغطيات الإضافية' : 'Addons Subtotal'}</span>
                              <strong>{q.prices.addonsTotal.toLocaleString()} {t('sar')}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                              <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الضريبة المطبقة (15%)' : 'VAT (15%)'}</span>
                              <strong>{q.prices.vat.toLocaleString()} {t('sar')}</strong>
                            </div>

                            <div style={{ borderTop: '1px dashed var(--border-color)', margin: '4px 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary-500)', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                              <span>{lang === 'ar' ? 'صافي المبلغ المستحق' : 'Total Net Due'}</span>
                              <span>{q.prices.total.toLocaleString()} {t('sar')}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

      </div>
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
