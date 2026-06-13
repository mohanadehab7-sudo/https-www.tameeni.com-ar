import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Award, CreditCard, Send, X, ShieldCheck, CheckCircle } from 'lucide-react';

export default function Ledger() {
  const { t, isRTL, lang } = { ...useLanguage() };
  
  // Ledger variables
  const [availablePayout, setAvailablePayout] = useState(84200);
  const [totalEarned, setTotalEarned] = useState(124500);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  
  // Modal states
  const [iban, setIban] = useState('SA8080000000001234567890');
  const [amount, setAmount] = useState('');
  const [modalError, setModalError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Table ledger items
  const ledgerItems = [
    { policyId: 'POL-99214', type: 'Motor', premium: 2450, rate: '10%', commission: 245, date: '2026-06-08', status: 'settled' },
    { policyId: 'POL-99105', type: 'Health', premium: 5800, rate: '12%', commission: 696, date: '2026-06-07', status: 'settled' },
    { policyId: 'POL-98711', type: 'Home', premium: 3500, rate: '15%', commission: 525, date: '2026-06-05', status: 'settled' },
    { policyId: 'POL-96112', type: 'Motor', premium: 4200, rate: '10%', commission: 420, date: '2026-05-28', status: 'settled' },
    { policyId: 'POL-95431', type: 'Health', premium: 12500, rate: '12%', commission: 1500, date: '2026-05-20', status: 'settled' }
  ];

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    setModalError('');

    if (!iban || !amount) {
      setModalError(t('errEmpty'));
      return;
    }

    // Saudi IBAN regex validation (starts with SA, followed by 22 digits)
    if (!/^SA\d{22}$/i.test(iban)) {
      setModalError(lang === 'ar' ? 'صيغة الآيبان غير صحيحة، يجب أن يبدأ بـ SA ويليه 22 رقماً' : 'Invalid IBAN format. Must start with SA followed by 22 digits');
      return;
    }

    const val = Number(amount);
    if (isNaN(val) || val <= 0) {
      setModalError(lang === 'ar' ? 'يرجى إدخال مبلغ صحيح' : 'Please enter a valid amount');
      return;
    }

    if (val > availablePayout) {
      setModalError(lang === 'ar' ? 'المبلغ المطلوب أكبر من الرصيد المتاح للسحب' : 'Amount exceeds available balance');
      return;
    }

    // Success simulation
    setAvailablePayout(prev => prev - val);
    setWithdrawSuccess(true);
  };

  const closeModal = () => {
    setShowWithdrawModal(false);
    setWithdrawSuccess(false);
    setAmount('');
    setModalError('');
  };

  return (
    <div className="animate-slide-up">
      {/* Page Header */}
      <div style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary-800)' }}>
          {t('ledgerHeader')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          {t('ledgerSub')}
        </p>
      </div>

      {/* Ledger Cards Overview */}
      <div className="metrics-grid">
        <div className="metric-card" style={{ borderLeft: isRTL ? 'none' : '4px solid var(--primary-500)', borderRight: isRTL ? '4px solid var(--primary-500)' : 'none' }}>
          <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>{t('totalEarned')}</span>
            <h3>{totalEarned.toLocaleString()} {t('sar')}</h3>
          </div>
          <div className="metric-icon" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-500)' }}>
            <Award size={24} />
          </div>
        </div>

        <div className="metric-card" style={{ borderLeft: isRTL ? 'none' : '4px solid var(--accent-gold)', borderRight: isRTL ? '4px solid var(--accent-gold)' : 'none' }}>
          <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>{t('availablePayout')}</span>
            <h3>{availablePayout.toLocaleString()} {t('sar')}</h3>
          </div>
          <button className="btn btn-accent" onClick={() => setShowWithdrawModal(true)}>
            <CreditCard size={16} />
            <span>{lang === 'ar' ? 'سحب العمولات' : 'Withdraw'}</span>
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="table-card" style={{ marginTop: '2rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <thead>
              <tr>
                <th>{t('colPolicy')}</th>
                <th>{lang === 'ar' ? 'نوع التأمين' : 'Insurance Type'}</th>
                <th>{lang === 'ar' ? 'القسط الإجمالي' : 'Total Premium'}</th>
                <th>{t('colCommissionRate')}</th>
                <th>{t('colCommission')}</th>
                <th>{t('colDate')}</th>
                <th>{t('colStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {ledgerItems.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '700', color: 'var(--primary-800)' }}>{item.policyId}</td>
                  <td>
                    {item.type === 'Motor' ? t('filterMotor') : 
                     item.type === 'Health' ? t('filterHealth') : t('filterHome')}
                  </td>
                  <td style={{ fontWeight: '600' }}>{item.premium.toLocaleString()} {t('sar')}</td>
                  <td style={{ color: 'var(--primary-500)', fontWeight: '700' }}>{item.rate}</td>
                  <td style={{ fontWeight: '700', color: 'var(--success)' }}>+{item.commission.toLocaleString()} {t('sar')}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.date}</td>
                  <td>
                    <span className="badge-status active">
                      {lang === 'ar' ? 'مسواة' : 'Settled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Withdrawal Modal Overlay */}
      {showWithdrawModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <button className="close-modal-btn" onClick={closeModal}>
              <X size={20} />
            </button>

            {!withdrawSuccess ? (
              /* Modal Form */
              <form onSubmit={handleWithdrawSubmit}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-800)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <CreditCard size={20} />
                  <span>{t('cashOutTitle')}</span>
                </h3>

                {modalError && (
                  <div className="error-banner">
                    <span>{modalError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">{t('bankAccount')}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder={t('bankAccountPlaceholder')}
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('amountLabel')}</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder={`Max ${availablePayout} SAR`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    max={availablePayout}
                  />
                </div>

                <div style={{ 
                  backgroundColor: 'var(--primary-100)', 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  fontSize: '0.85rem', 
                  color: 'var(--primary-800)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                  fontWeight: '600'
                }}>
                  <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    {lang === 'ar' 
                      ? 'سيتم التحويل مباشرة إلى حسابك الجاري المسجل لدى مصرف الراجحي دون رسوم تحويل.'
                      : 'Transfer will be executed immediately to your registered Al Rajhi current account with 0 fee.'}
                  </span>
                </div>

                <button type="submit" className="btn btn-accent btn-block">
                  <Send size={16} />
                  <span>{t('withdrawBtn')}</span>
                </button>
              </form>
            ) : (
              /* Success Screen inside Modal */
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ 
                  backgroundColor: 'var(--success-light)', 
                  color: 'var(--success)', 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto'
                }}>
                  <CheckCircle size={36} />
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary-800)', marginBottom: '8px' }}>
                  {lang === 'ar' ? 'تم تقديم الطلب بنجاح' : 'Request Sent Successfully'}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  {t('withdrawSuccess')}
                </p>

                <button className="btn btn-primary" onClick={closeModal}>
                  {lang === 'ar' ? 'إغلاق النافذة' : 'Close'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
