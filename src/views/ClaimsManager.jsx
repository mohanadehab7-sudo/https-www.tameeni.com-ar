import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldAlert, Plus, Calendar, FileText, CheckCircle, Clock, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ClaimsManager() {
  const { t, isRTL, lang } = useLanguage();
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [policyNo, setPolicyNo] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [desc, setDesc] = useState('');
  const [fileAttached, setFileAttached] = useState(false);
  const [formError, setFormError] = useState('');

  // Initial claims data
  const [claims, setClaims] = useState([
    { id: 'CLM-11029', policyId: 'POL-99214', desc: 'Rear collision at Riyadh Ring Road', date: '2026-06-07', status: 'pending' },
    { id: 'CLM-10992', policyId: 'POL-97512', desc: 'Emergency dental hospitalization treatment', date: '2026-06-03', status: 'approved' },
    { id: 'CLM-10542', policyId: 'POL-98711', desc: 'Kitchen electrical short circuit fire damage', date: '2026-05-15', status: 'closed' }
  ]);

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      setFileAttached(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!policyNo || !desc) {
      setFormError(t('errEmpty'));
      return;
    }

    const newClaim = {
      id: 'CLM-' + Math.floor(10000 + Math.random() * 90000),
      policyId: policyNo,
      desc: desc,
      date: incidentDate,
      status: 'pending'
    };

    setClaims([newClaim, ...claims]);
    setShowForm(false);
    
    // Reset inputs
    setPolicyNo('');
    setDesc('');
    setFileAttached(false);

    alert(lang === 'ar' ? 'تم تسجيل المطالبة بنجاح وجاري إرسالها للمعاينة!' : 'Claim registered successfully and sent for inspection!');
  };

  return (
    <div className="animate-slide-up">
      {/* Page Header */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2.5rem',
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }}
      >
        <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary-800)' }}>
            {t('claimsHeader')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            {t('claimsSub')}
          </p>
        </div>

        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            <span>{t('btnSubmitClaim')}</span>
          </button>
        )}
      </div>

      {showForm ? (
        /* Submit Claim Form Card */
        <div className="glass-card animate-fade-in" style={{ maxWidth: '650px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-800)', marginBottom: '1.5rem', fontWeight: 'bold', textAlign: isRTL ? 'right' : 'left' }}>
            {t('newClaimTitle')}
          </h3>

          {formError && (
            <div className="error-banner">
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <div className="form-group">
              <label className="form-label">{t('claimPolicyNo')}</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. POL-99214"
                value={policyNo}
                onChange={(e) => setPolicyNo(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('claimDate')}</label>
              <input 
                type="date" 
                className="form-control" 
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('claimDesc')}</label>
              <textarea 
                className="form-control" 
                rows="4"
                placeholder={t('claimPlaceholder')}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('claimUpload')}</label>
              <input 
                type="file" 
                className="form-control" 
                onChange={handleFileUpload}
                accept="image/*,.pdf"
              />
              {fileAttached && (
                <p style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: '600', marginTop: '4px' }}>
                  ✓ {lang === 'ar' ? 'تم إرفاق الملفات بنجاح' : 'Attachment loaded successfully'}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                {t('back')}
              </button>
              <button type="submit" className="btn btn-primary">
                {t('btnSubmit')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Claims Data Table Card */
        <div className="table-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
              <thead>
                <tr>
                  <th>{t('colClaimNo')}</th>
                  <th>{t('colPolicyNo')}</th>
                  <th>{t('colClaimDesc')}</th>
                  <th>{t('colDate')}</th>
                  <th>{t('colClaimStatus')}</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: '700', color: 'var(--primary-800)' }}>{c.id}</td>
                    <td style={{ fontWeight: '600' }}>{c.policyId}</td>
                    <td style={{ fontSize: '0.9rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.desc}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{c.date}</td>
                    <td>
                      <span className={`badge-status ${c.status}`}>
                        {c.status === 'pending' && <Clock size={12} style={{ [isRTL ? 'marginLeft' : 'marginRight']: '4px' }} />}
                        {c.status === 'approved' && <CheckCircle size={12} style={{ [isRTL ? 'marginLeft' : 'marginRight']: '4px' }} />}
                        {c.status === 'closed' && <CheckCircle size={12} style={{ [isRTL ? 'marginLeft' : 'marginRight']: '4px' }} />}
                        {c.status === 'rejected' && <XCircle size={12} style={{ [isRTL ? 'marginLeft' : 'marginRight']: '4px' }} />}
                        
                        {c.status === 'pending' ? t('statusClaimPending') : 
                         c.status === 'approved' ? t('statusClaimApproved') : 
                         c.status === 'closed' ? t('statusClaimClosed') : t('statusClaimRejected')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
