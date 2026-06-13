import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, Filter, Plus, FileText, Mail, 
  Printer, CreditCard, X, ShieldAlert, CheckCircle, Clock, Calendar
} from 'lucide-react';

export default function Quotes({ setActiveView }) {
  const { t, isRTL, lang } = useLanguage();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [quotes, setQuotes] = useState([]);
  
  // Checkout simulation states
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mada'); // 'mada' | 'sadad' | 'card'
  const [sadadCode, setSadadCode] = useState('');

  // Default mock quotes
  const defaultQuotes = [
    { 
      id: 'QT-99824', 
      customer: 'Suleiman Al-Harbi', 
      customerId: '1088746281',
      mobile: '0504829104',
      product: 'Motor Comprehensive', 
      vehicleMake: 'Toyota Camry',
      vehicleYear: '2024',
      chassisNo: 'A7B8C9D10E11F12G',
      plateNo: 'أ ب ج 1234',
      ncdLevel: '30% (Najm Checked)',
      basePremium: 3000,
      addons: ['addonRoadside', 'addonAgency'],
      vat: 548, 
      total: 4198, 
      expiryDate: '2026-07-09',
      status: 'pending', 
      createdDate: '2026-06-09' 
    },
    { 
      id: 'QT-99105', 
      customer: 'Sarah Al-Ghamdi', 
      customerId: '2019482710',
      mobile: '0554829101',
      product: 'Family Health', 
      ncdLevel: '10% (Loyalty)',
      memberCount: 3,
      ageRange: '35',
      basePremium: 4500,
      addons: ['addonDental'],
      vat: 795, 
      total: 6095, 
      expiryDate: '2026-07-08',
      status: 'draft', 
      createdDate: '2026-06-08' 
    },
    { 
      id: 'QT-98542', 
      customer: 'Khalid Al-Dossary', 
      customerId: '1092847582',
      mobile: '0507722119',
      product: 'Motor TPL', 
      vehicleMake: 'Hyundai Elantra',
      vehicleYear: '2021',
      chassisNo: 'H9I10J11K12L13M',
      plateNo: 'د ر س 5678',
      ncdLevel: '0% (No Claims history)',
      basePremium: 950,
      addons: ['addonRoadside'],
      vat: 165, 
      total: 1265, 
      expiryDate: '2026-07-05',
      status: 'review', 
      createdDate: '2026-06-05' 
    },
    { 
      id: 'QT-97412', 
      customer: 'Noura Al-Otaibi', 
      customerId: '1029481729',
      mobile: '0538827712',
      product: 'Motor Comprehensive', 
      vehicleMake: 'Lexus RX',
      vehicleYear: '2023',
      chassisNo: 'L2M3N4O5P6Q7R8S',
      plateNo: 'ح ص و 9999',
      ncdLevel: '40% (Safe Driver)',
      basePremium: 6000,
      addons: ['addonRoadside', 'addonAgency', 'addonDeductible'],
      vat: 1043, 
      total: 7993, 
      expiryDate: '2026-05-20',
      status: 'expired', 
      createdDate: '2026-04-20' 
    }
  ];

  // Sync quotes database
  useEffect(() => {
    const saved = localStorage.getItem('sales_portal_quotes');
    if (saved) {
      setQuotes(JSON.parse(saved));
    } else {
      localStorage.setItem('sales_portal_quotes', JSON.stringify(defaultQuotes));
      setQuotes(defaultQuotes);
    }
  }, []);

  const handleRowClick = (quote) => {
    setSelectedQuote(quote);
    setShowDrawer(true);
    setShowCheckout(false);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setSelectedQuote(null);
  };

  const handlePrintQuote = (id) => {
    alert(`[Print PDF / طباعة عرض السعر]\n\nGenerating Quote PDF for ${id}...`);
  };

  const handleEmailQuote = (id, email) => {
    alert(`[Email Quote / إرسال عرض السعر]\n\nEmail sent to ${email} containing Quote ${id} PDF sheet.`);
  };

  const handleProceedPayment = () => {
    setShowCheckout(true);
    // Generate a mock Sadad bill number
    setSadadCode(Math.floor(100000000000 + Math.random() * 900000000000).toString());
  };

  // Convert quote to active policy on mock payment completion
  const handleCompletePayment = () => {
    if (!selectedQuote) return;

    // Update quote status to Paid and issue policy
    const updatedQuotes = quotes.map(q => {
      if (q.id === selectedQuote.id) {
        return { ...q, status: 'paid' }; // Paid status
      }
      return q;
    });

    setQuotes(updatedQuotes);
    localStorage.setItem('sales_portal_quotes', JSON.stringify(updatedQuotes));

    // Also insert this as active policy in policies database
    const savedPolicies = localStorage.getItem('sales_portal_policies');
    let policies = savedPolicies ? JSON.parse(savedPolicies) : [];
    
    const newPolicyId = 'POL-' + selectedQuote.id.split('-')[1];
    
    const newPolicy = {
      id: newPolicyId,
      customer: selectedQuote.customer,
      product: selectedQuote.product.includes('Motor') ? 'Motor' : 'Health',
      premium: selectedQuote.total,
      status: 'active',
      date: new Date().toISOString().split('T')[0]
    };

    policies = [newPolicy, ...policies];
    localStorage.setItem('sales_portal_policies', JSON.stringify(policies));

    alert(lang === 'ar' 
      ? `تم سداد العرض بنجاح! تم إصدار الوثيقة برقم: ${newPolicyId}` 
      : `Quote paid successfully! Policy issued under number: ${newPolicyId}`);

    handleCloseDrawer();
  };

  const getFilteredQuotes = () => {
    return quotes.filter(q => {
      const matchesSearch = q.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            q.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            q.customerId.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const filtered = getFilteredQuotes();

  return (
    <div className="animate-slide-up" style={{ position: 'relative' }}>
      
      {/* Search & Actions Header */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }}
      >
        {/* Title */}
        <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary-500)', fontWeight: 'bold' }}>
            /web/home/quotes
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary-800)', marginTop: '2px' }}>
            {lang === 'ar' ? 'إدارة عروض الأسعار' : 'Quotes Management'}
          </h1>
        </div>

        <button className="btn btn-primary" onClick={() => setActiveView('quoteCalc')}>
          <Plus size={16} />
          <span>{lang === 'ar' ? 'حساب عرض سعر جديد' : 'New Quote'}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="table-card" style={{ marginBottom: '1.5rem' }}>
        <div 
          className="table-filters" 
          style={{ 
            flexDirection: isRTL ? 'row-reverse' : 'row',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0' 
          }}
        >
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isRTL ? 'left' : 'right']: '0.8rem', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                className="form-control" 
                placeholder={lang === 'ar' ? 'ابحث بالرقم، الاسم، أو الهوية...' : 'Search Quote ID, Name, ID...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', [isRTL ? 'paddingLeft' : 'paddingRight']: '2.2rem', borderRadius: '6px' }}
              />
            </div>

            {/* Status Filter buttons */}
            <div style={{ display: 'flex', gap: '6px', backgroundColor: '#e2e8f0', padding: '3px', borderRadius: '8px' }}>
              {[
                { val: 'all', ar: 'الكل', en: 'All' },
                { val: 'draft', ar: 'مسودة', en: 'Draft' },
                { val: 'pending', ar: 'بانتظار السداد', en: 'Pending Pay' },
                { val: 'review', ar: 'مراجعة نجم', en: 'Under Review' },
                { val: 'expired', ar: 'منتهي', en: 'Expired' }
              ].map((filter) => (
                <button
                  key={filter.val}
                  onClick={() => setStatusFilter(filter.val)}
                  style={{
                    border: 'none',
                    background: statusFilter === filter.val ? 'white' : 'transparent',
                    color: statusFilter === filter.val ? 'var(--primary-800)' : 'var(--text-secondary)',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {lang === 'ar' ? filter.ar : filter.en}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <thead>
              <tr>
                <th>{t('colPolicyNo')}</th>
                <th>{t('colCustomer')}</th>
                <th>{lang === 'ar' ? 'رقم الهوية' : 'ID Number'}</th>
                <th>{lang === 'ar' ? 'نوع التأمين' : 'Coverage Class'}</th>
                <th>{t('totalPremium')}</th>
                <th>{lang === 'ar' ? 'ينتهي في' : 'Expiry Date'}</th>
                <th>{t('colStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((q) => (
                  <tr 
                    key={q.id} 
                    onClick={() => handleRowClick(q)} 
                    style={{ cursor: 'pointer' }}
                    className="quote-row-hover"
                  >
                    <td style={{ fontWeight: '800', color: 'var(--primary-800)' }}>{q.id}</td>
                    <td style={{ fontWeight: '600' }}>{q.customer}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{q.customerId}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        backgroundColor: '#f1f5f9', 
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {q.product}
                      </span>
                    </td>
                    <td style={{ fontWeight: '800', color: 'var(--primary-700)' }}>{q.total.toLocaleString()} {t('sar')}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{q.expiryDate}</td>
                    <td>
                      <span className={`badge-status ${q.status === 'draft' ? 'review' : q.status === 'pending' ? 'pending' : q.status === 'review' ? 'review' : 'expired'}`}>
                        {q.status === 'draft' ? (lang === 'ar' ? 'مسودة' : 'Draft') : 
                         q.status === 'pending' ? (lang === 'ar' ? 'بانتظار السداد' : 'Pending Pay') : 
                         q.status === 'review' ? (lang === 'ar' ? 'تحت التدقيق' : 'Under Review') : 
                         q.status === 'paid' ? (lang === 'ar' ? 'تم الدفع' : 'Paid') :
                         (lang === 'ar' ? 'منتهي' : 'Expired')}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>
                    {lang === 'ar' ? 'لا توجد عروض أسعار مطابقة للبحث' : 'No quotes found matching criteria'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Quote Detail Drawer Panel */}
      {showDrawer && selectedQuote && (
        <>
          {/* Backdrop */}
          <div className="drawer-backdrop" onClick={handleCloseDrawer}></div>

          {/* Drawer content frame */}
          <div className={`detail-drawer open`} style={{ [isRTL ? 'left' : 'right']: 0 }}>
            {/* Header */}
            <div className="drawer-header" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary-500)', fontWeight: 'bold' }}>{selectedQuote.id}</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-800)' }}>
                  {lang === 'ar' ? 'تفاصيل عرض السعر' : 'Quote Details'}
                </h3>
              </div>
              <button 
                onClick={handleCloseDrawer} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="drawer-body" style={{ textAlign: isRTL ? 'right' : 'left' }}>
              
              {/* Section 1: Customer details */}
              <div className="drawer-section">
                <h4 className="drawer-section-title" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                  {lang === 'ar' ? 'بيانات حامل العرض' : 'Customer Info'}
                </h4>
                <div className="detail-row" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span className="detail-label">{lang === 'ar' ? 'اسم العميل' : 'Customer Name'}</span>
                  <span className="detail-value">{selectedQuote.customer}</span>
                </div>
                <div className="detail-row" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span className="detail-label">{t('idLabel')}</span>
                  <span className="detail-value">{selectedQuote.customerId}</span>
                </div>
                <div className="detail-row" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span className="detail-label">{t('mobileLabel')}</span>
                  <span className="detail-value">{selectedQuote.mobile}</span>
                </div>
                <div className="detail-row" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span className="detail-label">{lang === 'ar' ? 'نسبة خصم الحوادث (NCD)' : 'No Claims Discount (NCD)'}</span>
                  <span className="detail-value" style={{ color: 'var(--success)' }}>{selectedQuote.ncdLevel}</span>
                </div>
              </div>

              {/* Section 2: Insured details */}
              <div className="drawer-section">
                <h4 className="drawer-section-title" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                  {selectedQuote.product.includes('Motor') ? (lang === 'ar' ? 'تفاصيل المركبة المؤمنة' : 'Vehicle Details') : (lang === 'ar' ? 'تفاصيل الأعضاء الطبيين' : 'Medical Members')}
                </h4>
                {selectedQuote.product.includes('Motor') ? (
                  <>
                    <div className="detail-row" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <span className="detail-label">{lang === 'ar' ? 'طراز المركبة' : 'Vehicle Make'}</span>
                      <span className="detail-value">{selectedQuote.vehicleMake}</span>
                    </div>
                    <div className="detail-row" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <span className="detail-label">{lang === 'ar' ? 'سنة التصنيع' : 'Manufacturing Year'}</span>
                      <span className="detail-value">{selectedQuote.vehicleYear}</span>
                    </div>
                    <div className="detail-row" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <span className="detail-label">{lang === 'ar' ? 'رقم الشاصي' : 'Chassis Number'}</span>
                      <span className="detail-value" style={{ fontFamily: 'monospace' }}>{selectedQuote.chassisNo || 'A89D2948192837'}</span>
                    </div>
                    <div className="detail-row" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <span className="detail-label">{lang === 'ar' ? 'رقم اللوحة' : 'Plate Number'}</span>
                      <span className="detail-value">{selectedQuote.plateNo || 'أ ب ج 1234'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detail-row" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <span className="detail-label">{lang === 'ar' ? 'عدد الأعضاء المشمولين' : 'Covered Members'}</span>
                      <span className="detail-value">{selectedQuote.memberCount}</span>
                    </div>
                    <div className="detail-row" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <span className="detail-label">{lang === 'ar' ? 'عمر العضو الأكبر' : 'Oldest Member Age'}</span>
                      <span className="detail-value">{selectedQuote.ageRange} {lang === 'ar' ? 'سنة' : 'years'}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Section 3: Premium breakdown calculations */}
              <div className="drawer-section">
                <h4 className="drawer-section-title" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                  {lang === 'ar' ? 'تفاصيل حساب القسط' : 'Premium Breakdown'}
                </h4>
                <div className="detail-row" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span className="detail-label">{t('basePremium')}</span>
                  <span className="detail-value">{selectedQuote.basePremium.toLocaleString()} {t('sar')}</span>
                </div>
                
                {selectedQuote.addons?.length > 0 && (
                  <div className="detail-row" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <span className="detail-label">{lang === 'ar' ? 'إضافات التغطية' : 'Addons Total'}</span>
                    <span className="detail-value">
                      {selectedQuote.addons.includes('addonAgency') ? '+500 ' : ''}
                      {selectedQuote.addons.includes('addonRoadside') ? '+150 ' : ''}
                      {selectedQuote.addons.includes('addonDental') ? '+800 ' : ''}
                      {t('sar')}
                    </span>
                  </div>
                )}

                <div className="detail-row" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span className="detail-label">{lang === 'ar' ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)'}</span>
                  <span className="detail-value">{selectedQuote.vat.toLocaleString()} {t('sar')}</span>
                </div>
                <div className="detail-row" style={{ flexDirection: isRTL ? 'row-reverse' : 'row', borderTop: '2px dashed var(--border-color)', paddingTop: '12px' }}>
                  <span className="detail-label" style={{ fontWeight: '800', color: 'var(--primary-800)' }}>{t('totalPremium')}</span>
                  <span className="detail-value" style={{ color: 'var(--primary-500)', fontSize: '1.2rem' }}>{selectedQuote.total.toLocaleString()} {t('sar')}</span>
                </div>
              </div>

              {/* Checkout Frame simulation inside drawer */}
              {showCheckout ? (
                <div className="glass-card animate-fade-in" style={{ marginTop: '1rem', border: '1px solid var(--primary-500)' }}>
                  <h4 style={{ fontWeight: '800', color: 'var(--primary-800)', marginBottom: '1rem' }}>
                    {lang === 'ar' ? 'بوابة الدفع الإلكتروني الآمنة' : 'Secure Payment Gateway'}
                  </h4>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                    {['mada', 'sadad', 'card'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        className={`btn ${paymentMethod === method ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}
                        onClick={() => setPaymentMethod(method)}
                      >
                        {method.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'sadad' ? (
                    <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <p style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'رقم فاتورة سداد للعميل:' : 'SADAD Bill Code:'}</p>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>{sadadCode}</strong>
                      <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.75rem' }}>{lang === 'ar' ? 'رمز سداد لتكافل الراجحي: 801' : 'Al Rajhi Takaful SADAD Code: 801'}</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
                      <input type="text" className="form-control" placeholder={lang === 'ar' ? 'رقم بطاقة الصراف/الائتمان' : 'Card Number'} value="4574 **** **** 1092" readOnly />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="text" className="form-control" placeholder="MM/YY" value="09/29" readOnly style={{ flex: 1 }} />
                        <input type="password" className="form-control" placeholder="CVV" value="***" readOnly style={{ flex: 1 }} />
                      </div>
                    </div>
                  )}

                  <button className="btn btn-accent btn-block" onClick={handleCompletePayment}>
                    <CheckCircle size={16} />
                    <span>{lang === 'ar' ? 'إتمام عملية الدفع والتحصيل' : 'Confirm & Collect Payment'}</span>
                  </button>
                </div>
              ) : (
                /* Primary Actions footer inside drawer */
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                  <button className="btn btn-accent" style={{ flex: 1.5 }} onClick={handleProceedPayment}>
                    <CreditCard size={16} />
                    <span>{lang === 'ar' ? 'سداد وتحويل لوثيقة' : 'Pay & Issue Policy'}</span>
                  </button>

                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handlePrintQuote(selectedQuote.id)}>
                    <Printer size={16} />
                  </button>

                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleEmailQuote(selectedQuote.id, 'customer@mail.com')}>
                    <Mail size={16} />
                  </button>
                </div>
              )}

            </div>
          </div>
        </>
      )}

      {/* Row style inject for table selection highlights */}
      <style>{`
        .quote-row-hover:hover td {
          background-color: var(--primary-100) !important;
        }
      `}</style>
    </div>
  );
}
