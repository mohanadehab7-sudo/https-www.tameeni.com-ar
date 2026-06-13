import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  User, Car, Shield, Award, CheckCircle, 
  ArrowRight, ArrowLeft, Send, Printer 
} from 'lucide-react';

export default function QuoteCalculator({ setActiveView }) {
  const { t, isRTL, lang } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);
  const [productType, setProductType] = useState('motor'); // 'motor' | 'health'

  // Step 1 Form States
  const [nationalId, setNationalId] = useState('');
  const [mobile, setMobile] = useState('');
  const [birthdate, setBirthdate] = useState('1995-01-01');
  const [gender, setGender] = useState('male');

  // Step 2 Form States (Motor)
  const [vehicleYear, setVehicleYear] = useState('2024');
  const [vehicleValue, setVehicleValue] = useState(80000);
  const [plateType, setPlateType] = useState('private');

  // Step 2 Form States (Health)
  const [memberCount, setMemberCount] = useState(1);
  const [ageRange, setAgeRange] = useState('35');

  // Step 3 Coverage States
  const [coverTier, setCoverTier] = useState('comprehensive'); // 'comprehensive' | 'tpl'
  
  // Addons states
  const [addonRoadside, setAddonRoadside] = useState(false);
  const [addonAgency, setAddonAgency] = useState(false);
  const [addonDeductible, setAddonDeductible] = useState(false);
  const [addonDental, setAddonDental] = useState(false);
  const [addonOptical, setAddonOptical] = useState(false);

  // Success States
  const [issuedPolicyId, setIssuedPolicyId] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Premium Calculations
  const calculatePremium = () => {
    let base = 0;
    let addonsTotal = 0;

    if (productType === 'motor') {
      if (coverTier === 'comprehensive') {
        // 3.5% of car value
        base = Math.round(Number(vehicleValue) * 0.035);
        if (addonRoadside) addonsTotal += 150;
        if (addonAgency) addonsTotal += 500;
        if (addonDeductible) addonsTotal += 300;
      } else {
        // TPL flat rate
        base = 950;
        if (addonRoadside) addonsTotal += 150;
      }
    } else {
      // Health Calculator
      const ageMultiplier = Number(ageRange) > 50 ? 2.5 : Number(ageRange) > 35 ? 1.5 : 1.0;
      base = Math.round(1200 * Number(memberCount) * ageMultiplier);
      if (addonDental) addonsTotal += 800 * Number(memberCount);
      if (addonOptical) addonsTotal += 400 * Number(memberCount);
    }

    const net = base + addonsTotal;
    const vat = Math.round(net * 0.15); // 15% Saudi VAT
    const total = net + vat;

    return { base, addonsTotal, net, vat, total };
  };

  const { base, addonsTotal, net, vat, total } = calculatePremium();

  const handleNextStep = () => {
    setValidationError('');
    if (currentStep === 1) {
      if (!nationalId || !mobile) {
        setValidationError(t('errEmpty'));
        return;
      }
      if (!/^[12]\d{9}$/.test(nationalId)) {
        setValidationError(t('errID'));
        return;
      }
      if (!/^05\d{8}$/.test(mobile)) {
        setValidationError(t('errMobile'));
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBackStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Generate simulated SMS pay link
  const handleGenerateLink = () => {
    setLinkSent(true);
    alert(`${t('paymentLinkGenerated')}\n\nSMS Payload: [Al Rajhi Takaful] Dear customer, please click the secure link to pay SAR ${total.toLocaleString()}: https://pay.alrajhitakaful.com/pay/q-${Math.floor(100000+Math.random()*900000)}`);
  };

  // Issue policy and update recent policy table in localStorage
  const handleIssuePolicy = () => {
    const newId = 'QT-' + Math.floor(10000 + Math.random() * 90000);
    setIssuedPolicyId(newId);

    // Get current quotes
    const savedQuotes = localStorage.getItem('sales_portal_quotes');
    let quotesList = savedQuotes ? JSON.parse(savedQuotes) : [];

    const newQuote = {
      id: newId,
      customer: lang === 'ar' ? 'سليمان الحربي' : 'Suleiman Al-Harbi',
      customerId: nationalId || '1088746281',
      mobile: mobile || '0504829104',
      product: productType === 'motor' ? (coverTier === 'comprehensive' ? 'Motor Comprehensive' : 'Motor TPL') : 'Family Health',
      vehicleMake: productType === 'motor' ? 'Toyota Camry' : undefined,
      vehicleYear: productType === 'motor' ? vehicleYear : undefined,
      chassisNo: productType === 'motor' ? 'A7B8C9D10E11F12G' : undefined,
      plateNo: productType === 'motor' ? 'أ ب ج 1234' : undefined,
      ncdLevel: '30% (Najm Checked)',
      basePremium: base,
      addons: productType === 'motor' 
        ? [addonRoadside && 'addonRoadside', addonAgency && 'addonAgency', addonDeductible && 'addonDeductible'].filter(Boolean)
        : [addonDental && 'addonDental', addonOptical && 'addonOptical'].filter(Boolean),
      vat: vat,
      total: total,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
      status: 'pending',
      createdDate: new Date().toISOString().split('T')[0]
    };

    // Prepend to array
    quotesList = [newQuote, ...quotesList];
    localStorage.setItem('sales_portal_quotes', JSON.stringify(quotesList));

    setCurrentStep(5); // Show success view
  };

  return (
    <div className="animate-slide-up">
      {/* Page Header */}
      <div style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary-800)' }}>
          {t('calculatorHeader')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          {t('calcSub')}
        </p>
      </div>

      {/* Wizard Progress Nodes */}
      {currentStep < 5 && (
        <div className="wizard-steps">
          {[
            { step: 1, icon: <User size={16} />, label: t('stepCustomer') },
            { step: 2, icon: <Car size={16} />, label: t('stepDetails') },
            { step: 3, icon: <Shield size={16} />, label: t('stepCover') },
            { step: 4, icon: <Award size={16} />, label: t('stepSummary') }
          ].map((s) => (
            <div 
              key={s.step} 
              className={`wizard-step-node ${currentStep === s.step ? 'active' : ''} ${currentStep > s.step ? 'completed' : ''}`}
            >
              {currentStep > s.step ? <CheckCircle size={18} /> : s.icon}
              <span className="wizard-step-label">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Form Card */}
      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', marginTop: '2rem' }}>
        {validationError && (
          <div className="error-banner">
            <span>{validationError}</span>
          </div>
        )}

        {/* STEP 1: CUSTOMER INFO */}
        {currentStep === 1 && (
          <div className="animate-fade-in" style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">{lang === 'ar' ? 'اختر منتج التأمين' : 'Select Insurance Product'}</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button"
                  className={`btn ${productType === 'motor' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '1rem' }}
                  onClick={() => setProductType('motor')}
                >
                  {t('filterMotor')}
                </button>
                <button 
                  type="button"
                  className={`btn ${productType === 'health' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '1rem' }}
                  onClick={() => setProductType('health')}
                >
                  {t('filterHealth')}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div className="form-group">
                <label className="form-label">{t('idLabel')}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder={t('idPlaceholder')}
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  maxLength={10}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('mobileLabel')}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder={t('mobilePlaceholder')}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  maxLength={10}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('birthdate')}</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('gender')}</label>
                <select 
                  className="form-control" 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">{t('male')}</option>
                  <option value="female">{t('female')}</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
              <button className="btn btn-primary" onClick={handleNextStep}>
                {t('next')}
                {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PRODUCT SPECIFIC DETAILS */}
        {currentStep === 2 && (
          <div className="animate-fade-in" style={{ textAlign: isRTL ? 'right' : 'left' }}>
            {productType === 'motor' ? (
              /* Motor Details */
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-800)', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                  {t('vehicleDetails')}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">{t('vehicleYear')}</label>
                    <select 
                      className="form-control"
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(e.target.value)}
                    >
                      {Array.from({ length: 15 }, (_, i) => 2026 - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('vehicleValue')}</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={vehicleValue}
                      onChange={(e) => setVehicleValue(Number(e.target.value))}
                      min={10000}
                      max={1000000}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">{t('plateType')}</label>
                    <select 
                      className="form-control"
                      value={plateType}
                      onChange={(e) => setPlateType(e.target.value)}
                    >
                      <option value="private">{t('platePrivate')}</option>
                      <option value="commercial">{t('plateCommercial')}</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              /* Health Details */
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-800)', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                  {t('healthDetails')}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">{t('memberCount')}</label>
                    <select 
                      className="form-control"
                      value={memberCount}
                      onChange={(e) => setMemberCount(Number(e.target.value))}
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('ageRange')}</label>
                    <select 
                      className="form-control"
                      value={ageRange}
                      onChange={(e) => setAgeRange(e.target.value)}
                    >
                      <option value="25">18 - 30</option>
                      <option value="35">31 - 45</option>
                      <option value="50">46 - 60</option>
                      <option value="65">61+</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
              <button className="btn btn-secondary" onClick={handleBackStep}>
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                {t('back')}
              </button>
              <button className="btn btn-primary" onClick={handleNextStep}>
                {t('next')}
                {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: COVERAGE SELECTION */}
        {currentStep === 3 && (
          <div className="animate-fade-in" style={{ textAlign: isRTL ? 'right' : 'left' }}>
            {productType === 'motor' ? (
              /* Motor Cover Tiers & Addons */
              <div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem' }}>
                  <div 
                    className={`coverage-card ${coverTier === 'comprehensive' ? 'selected' : ''}`}
                    onClick={() => setCoverTier('comprehensive')}
                    style={{ flex: 1 }}
                  >
                    <input 
                      type="radio" 
                      checked={coverTier === 'comprehensive'} 
                      readOnly 
                      style={{ accentColor: 'var(--primary-500)', marginTop: '4px' }} 
                    />
                    <div>
                      <div className="coverage-card-title">{t('coverComprehensive')}</div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {lang === 'ar' ? 'يغطي أضرار سيارتك وسيارات الغير' : 'Covers own damage & third party liability'}
                      </p>
                    </div>
                  </div>

                  <div 
                    className={`coverage-card ${coverTier === 'tpl' ? 'selected' : ''}`}
                    onClick={() => setCoverTier('tpl')}
                    style={{ flex: 1 }}
                  >
                    <input 
                      type="radio" 
                      checked={coverTier === 'tpl'} 
                      readOnly 
                      style={{ accentColor: 'var(--primary-500)', marginTop: '4px' }} 
                    />
                    <div>
                      <div className="coverage-card-title">{t('coverTPL')}</div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {lang === 'ar' ? 'يغطي الأضرار للطرف الآخر فقط' : 'Covers third party liability only'}
                      </p>
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-800)', marginBottom: '1rem', fontWeight: 'bold' }}>
                  {t('addons')}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label className={`coverage-card ${addonRoadside ? 'selected' : ''}`} style={{ padding: '1rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={addonRoadside} 
                      onChange={(e) => setAddonRoadside(e.target.checked)} 
                      style={{ accentColor: 'var(--primary-500)' }} 
                    />
                    <span>{t('addonRoadside')}</span>
                  </label>

                  {coverTier === 'comprehensive' && (
                    <>
                      <label className={`coverage-card ${addonAgency ? 'selected' : ''}`} style={{ padding: '1rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={addonAgency} 
                          onChange={(e) => setAddonAgency(e.target.checked)} 
                          style={{ accentColor: 'var(--primary-500)' }} 
                        />
                        <span>{t('addonAgency')}</span>
                      </label>

                      <label className={`coverage-card ${addonDeductible ? 'selected' : ''}`} style={{ padding: '1rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={addonDeductible} 
                          onChange={(e) => setAddonDeductible(e.target.checked)} 
                          style={{ accentColor: 'var(--primary-500)' }} 
                        />
                        <span>{t('addonDeductible')}</span>
                      </label>
                    </>
                  )}
                </div>
              </div>
            ) : (
              /* Health Addons */
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-800)', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                  {t('addons')}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label className={`coverage-card ${addonDental ? 'selected' : ''}`} style={{ padding: '1rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={addonDental} 
                      onChange={(e) => setAddonDental(e.target.checked)} 
                      style={{ accentColor: 'var(--primary-500)' }} 
                    />
                    <span>{t('addonDental')}</span>
                  </label>

                  <label className={`coverage-card ${addonOptical ? 'selected' : ''}`} style={{ padding: '1rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={addonOptical} 
                      onChange={(e) => setAddonOptical(e.target.checked)} 
                      style={{ accentColor: 'var(--primary-500)' }} 
                    />
                    <span>{t('addonOptical')}</span>
                  </label>
                </div>
              </div>
            )}

            {/* Total Indicator in selection step */}
            <div style={{ 
              backgroundColor: '#f8fafc', 
              padding: '1rem 1.5rem', 
              borderRadius: '8px', 
              marginTop: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: '700'
            }}>
              <span>{t('totalPremium')}</span>
              <span style={{ color: 'var(--primary-500)', fontSize: '1.25rem' }}>{total.toLocaleString()} {t('sar')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
              <button className="btn btn-secondary" onClick={handleBackStep}>
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                {t('back')}
              </button>
              <button className="btn btn-primary" onClick={handleNextStep}>
                {t('next')}
                {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: QUOTE SUMMARY & INVOICE */}
        {currentStep === 4 && (
          <div className="animate-fade-in" style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-800)', marginBottom: '1.5rem', fontWeight: 'bold' }}>
              {t('stepSummary')}
            </h3>

            {/* Invoice Print Graphic */}
            <div className="invoice-receipt" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #cbd5e1', paddingBottom: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: '600' }}>
                <div>
                  AL RAJHI TAKAFUL SALES
                  <br />
                  RIYADH, KSA
                </div>
                <div style={{ textAlign: 'right' }}>
                  DATE: {new Date().toISOString().split('T')[0]}
                  <br />
                  QUOTE: QT-{Math.floor(100000+Math.random()*900000)}
                </div>
              </div>

              {/* Items Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{productType === 'motor' ? `${t('filterMotor')} (${coverTier === 'comprehensive' ? 'Comprehensive' : 'TPL'})` : `${t('filterHealth')} (${memberCount} pax)`}</span>
                  <span>{base.toLocaleString()} SAR</span>
                </div>

                {/* Addon Items list */}
                {addonRoadside && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>- {t('addonRoadside').split(' (+')[0]}</span>
                    <span>150 SAR</span>
                  </div>
                )}
                {addonAgency && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>- {t('addonAgency').split(' (+')[0]}</span>
                    <span>500 SAR</span>
                  </div>
                )}
                {addonDeductible && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>- {t('addonDeductible').split(' (+')[0]}</span>
                    <span>300 SAR</span>
                  </div>
                )}
                {addonDental && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>- {t('addonDental').split(' (+')[0]}</span>
                    <span>{(800*memberCount).toLocaleString()} SAR</span>
                  </div>
                )}
                {addonOptical && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>- {t('addonOptical').split(' (+')[0]}</span>
                    <span>{(400*memberCount).toLocaleString()} SAR</span>
                  </div>
                )}

                {/* Divider */}
                <div style={{ borderBottom: '1px dashed #cbd5e1', margin: '0.5rem 0' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>NET PREMIUM</span>
                  <span>{net.toLocaleString()} SAR</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>VAT (15%)</span>
                  <span>{vat.toLocaleString()} SAR</span>
                </div>

                <div style={{ borderBottom: '1px dashed #cbd5e1', margin: '0.5rem 0' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-800)' }}>
                  <span>TOTAL DUE</span>
                  <span>{total.toLocaleString()} SAR</span>
                </div>
              </div>
            </div>

            {/* Actions Block */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem' }}>
              <button 
                className={`btn ${linkSent ? 'btn-secondary' : 'btn-primary'}`} 
                onClick={handleGenerateLink}
                style={{ flex: 1 }}
              >
                <Send size={16} />
                <span>{t('generateLink')}</span>
              </button>

              <button className="btn btn-accent" onClick={handleIssuePolicy} style={{ flex: 1 }}>
                <Award size={16} />
                <span>{lang === 'ar' ? 'إصدار الوثيقة فوراً' : 'Issue Policy Now'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button className="btn btn-secondary" onClick={handleBackStep}>
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                {t('back')}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS BLOCK */}
        {currentStep === 5 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ 
              backgroundColor: 'var(--success-light)', 
              color: 'var(--success)', 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <CheckCircle size={48} />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-800)', marginBottom: '8px' }}>
              {lang === 'ar' ? 'تم إصدار عرض السعر بنجاح!' : 'Quote Generated Successfully!'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {lang === 'ar' ? 'رقم عرض السعر' : 'Quote Reference'}: <strong style={{ color: 'var(--primary-800)', fontSize: '1.15rem' }}>{issuedPolicyId}</strong>
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', maxWidth: '380px', margin: '0 auto' }}>
              <button className="btn btn-secondary" onClick={() => alert(`[Printing PDF / طباعة عرض السعر]\n\nOpening print dialog for quote ${issuedPolicyId}...`)}>
                <Printer size={16} />
                <span>{lang === 'ar' ? 'طباعة عرض السعر' : 'Print Quote'}</span>
              </button>

              <button className="btn btn-primary" onClick={() => setActiveView('quotes')}>
                {lang === 'ar' ? 'الانتقال لعروض الأسعار' : 'Go to Quotes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
