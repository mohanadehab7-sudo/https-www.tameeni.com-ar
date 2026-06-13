import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, Users, ShieldAlert, Award, Search, 
  Filter, FileText, Download, Eye, Plus, Calendar
} from 'lucide-react';

export default function Dashboard({ setActiveView }) {
  const { t, isRTL, lang } = useLanguage();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [policies, setPolicies] = useState([]);

  // Default policies if localStorage is empty
  const defaultPolicies = [
    { id: 'POL-99214', customer: 'Ahmed Al-Shehri', product: 'Motor', premium: 2450, status: 'active', date: '2026-06-08' },
    { id: 'POL-99105', customer: 'Sarah Al-Ghamdi', product: 'Health', premium: 5800, status: 'active', date: '2026-06-07' },
    { id: 'QTE-88210', customer: 'Khalid Al-Dossary', product: 'Motor', premium: 1800, status: 'pending', date: '2026-06-06' },
    { id: 'POL-98711', customer: 'Noura Al-Otaibi', product: 'Home', premium: 3500, status: 'active', date: '2026-06-05' },
    { id: 'QTE-88194', customer: 'Fahad Al-Harbi', product: 'Travel', premium: 450, status: 'review', date: '2026-06-04' },
    { id: 'POL-97512', customer: 'Mohammed Al-Qahtani', product: 'Health', premium: 8200, status: 'expired', date: '2025-06-04' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('sales_portal_policies');
    if (saved) {
      setPolicies(JSON.parse(saved));
    } else {
      localStorage.setItem('sales_portal_policies', JSON.stringify(defaultPolicies));
      setPolicies(defaultPolicies);
    }
  }, []);

  const handleDownloadPDF = (policyId) => {
    alert(`[PDF Download / تحميل ملف PDF]\n\nDownloading Certificate for ${policyId}...`);
  };

  const getFilteredPolicies = () => {
    return policies.filter(p => {
      const matchesSearch = p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.customer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === 'all' || p.product.toLowerCase() === filterType.toLowerCase();
      
      return matchesSearch && matchesFilter;
    });
  };

  const filtered = getFilteredPolicies();

  // Metric calculation
  const totalGWP = policies.reduce((sum, p) => p.status === 'active' ? sum + p.premium : sum, 0);
  const activeCount = policies.filter(p => p.status === 'active').length;
  const pendingCount = policies.filter(p => p.status === 'pending').length;
  const commissionEarned = Math.round(totalGWP * 0.12); // 12% flat commission

  return (
    <div className="animate-slide-up">
      {/* Welcome Banner */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-700) 100%)',
          color: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--card-shadow)',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
          <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>
            {t('agentTag')}
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '4px' }}>
            {t('welcome')} {user?.name || t('agentName')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', marginTop: '6px' }}>
            {lang === 'ar' 
              ? `الرقم المرجعي: ${user?.agentId || 'AGT-99824'} | الفرع الرئيسي بالرياض`
              : `ID: ${user?.agentId || 'AGT-99824'} | Riyadh Main Branch`}
          </p>
        </div>
        <button className="btn btn-accent" onClick={() => setActiveView('quoteCalc')}>
          <Plus size={18} />
          <span>{t('quoteCalc')}</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="metrics-grid">
        {/* Card 1: GWP */}
        <div className="metric-card">
          <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>{t('gwp')}</span>
            <h3>{totalGWP.toLocaleString()} {t('sar')}</h3>
            <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
              <TrendingUp size={14} /> +12% {t('trendUp')}
            </span>
          </div>
          <div className="metric-icon" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-500)' }}>
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Card 2: Active Policies */}
        <div className="metric-card">
          <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>{t('activePolicies')}</span>
            <h3>{activeCount}</h3>
            <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
              <TrendingUp size={14} /> +8% {t('trendUp')}
            </span>
          </div>
          <div className="metric-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <Users size={24} />
          </div>
        </div>

        {/* Card 3: Pending Quotes */}
        <div className="metric-card">
          <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>{t('pendingQuotes')}</span>
            <h3>{pendingCount}</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
              -5% {t('trendUp')}
            </span>
          </div>
          <div className="metric-icon" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
            <ShieldAlert size={24} />
          </div>
        </div>

        {/* Card 4: Earned Commissions */}
        <div className="metric-card">
          <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>{t('commissions')}</span>
            <h3>{commissionEarned.toLocaleString()} {t('sar')}</h3>
            <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
              <TrendingUp size={14} /> +15% {t('trendUp')}
            </span>
          </div>
          <div className="metric-icon" style={{ backgroundColor: 'var(--accent-gold-light)', color: 'var(--accent-gold)' }}>
            <Award size={24} />
          </div>
        </div>
      </div>

      {/* Graphics & Charts Grid */}
      <div className="charts-grid">
        {/* Line Chart */}
        <div className="chart-card">
          <div className="chart-header" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary-800)' }}>
              {t('salesPerformance')}
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} /> 2026 Q1-Q2
            </span>
          </div>
          
          {/* Custom animated SVG Line Chart */}
          <div style={{ width: '100%', height: '240px', position: 'relative', marginTop: 'auto' }}>
            <svg viewBox="0 0 500 200" width="100%" height="100%">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Area under the line (shaded blue gradient) */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary-500)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--primary-500)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path 
                d="M 40 170 L 40 130 L 128 100 L 216 110 L 304 80 L 392 60 L 480 30 L 480 170 Z" 
                fill="url(#chartGradient)" 
              />

              {/* Animated Stroke Line */}
              <path 
                className="svg-chart-line"
                d="M 40 130 L 128 100 L 216 110 L 304 80 L 392 60 L 480 30" 
                fill="none" 
                stroke="var(--primary-500)" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Plot points */}
              {[
                { x: 40, y: 130, val: '500K' },
                { x: 128, y: 100, val: '650K' },
                { x: 216, y: 110, val: '600K' },
                { x: 304, y: 80, val: '800K' },
                { x: 392, y: 60, val: '950K' },
                { x: 480, y: 30, val: '1.2M' }
              ].map((p, idx) => (
                <g key={idx}>
                  <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="var(--primary-800)" strokeWidth="2.5" />
                  <text x={p.x} y={p.y - 12} fontSize="9" fontWeight="700" fill="var(--primary-800)" textAnchor="middle">
                    {p.val}
                  </text>
                </g>
              ))}

              {/* X Axis Labels */}
              {[
                { x: 40, name: lang === 'ar' ? 'يناير' : 'Jan' },
                { x: 128, name: lang === 'ar' ? 'فبراير' : 'Feb' },
                { x: 216, name: lang === 'ar' ? 'مارس' : 'Mar' },
                { x: 304, name: lang === 'ar' ? 'أبريل' : 'Apr' },
                { x: 392, name: lang === 'ar' ? 'مايو' : 'May' },
                { x: 480, name: lang === 'ar' ? 'يونيو' : 'Jun' }
              ].map((l, idx) => (
                <text key={idx} x={l.x} y="190" fontSize="10" fontWeight="600" fill="var(--text-secondary)" textAnchor="middle">
                  {l.name}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Product Mix Donut Chart */}
        <div className="chart-card">
          <div className="chart-header" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary-800)' }}>
              {t('productMix')}
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1.5rem' }}>
            <div style={{ width: '130px', height: '130px', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
                <circle className="donut-hole" cx="21" cy="21" r="15.915" fill="#fff"></circle>
                <circle className="donut-ring" cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="4.5"></circle>

                {/* Motor: 45% (dasharray: 45 55, offset 25) */}
                <circle className="donut-segment" cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--primary-800)" strokeWidth="4.5" strokeDasharray="45 55" strokeDashoffset="100"></circle>
                
                {/* Health: 35% (dasharray: 35 65, offset 55) */}
                <circle className="donut-segment" cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--primary-500)" strokeWidth="4.5" strokeDasharray="35 65" strokeDashoffset="55"></circle>
                
                {/* Home: 12% (dasharray: 12 88, offset 20) */}
                <circle className="donut-segment" cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--accent-gold)" strokeWidth="4.5" strokeDasharray="12 88" strokeDashoffset="20"></circle>
                
                {/* Travel: 8% (dasharray: 8 92, offset 8) */}
                <circle className="donut-segment" cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--success)" strokeWidth="4.5" strokeDasharray="8 92" strokeDashoffset="8"></circle>
              </svg>
              
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>GWP</span>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-800)' }}>100%</div>
              </div>
            </div>

            {/* Custom Legend */}
            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem', fontWeight: '600' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: isRTL ? 'flex-end' : 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary-800)', display: 'inline-block' }}></span>
                <span>{lang === 'ar' ? 'سيارات (45%)' : 'Motor (45%)'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: isRTL ? 'flex-end' : 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary-500)', display: 'inline-block' }}></span>
                <span>{lang === 'ar' ? 'طبي (35%)' : 'Health (35%)'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: isRTL ? 'flex-end' : 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)', display: 'inline-block' }}></span>
                <span>{lang === 'ar' ? 'منازل (12%)' : 'Home (12%)'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: isRTL ? 'flex-end' : 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--success)', display: 'inline-block' }}></span>
                <span>{lang === 'ar' ? 'سفر (8%)' : 'Travel (8%)'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Policies and Tables */}
      <div className="table-card">
        <div className="table-filters" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary-800)' }}>
            {t('recentPolicies')}
          </h3>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isRTL ? 'left' : 'right']: '0.8rem', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                className="form-control" 
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', [isRTL ? 'paddingLeft' : 'paddingRight']: '2.2rem', borderRadius: '6px' }}
              />
            </div>

            {/* Product Type Filter */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Filter size={16} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '0.6rem', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
              <select 
                className="form-control"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.85rem', 
                  borderRadius: '6px', 
                  [isRTL ? 'paddingRight' : 'paddingLeft']: '2rem',
                  width: '140px',
                  backgroundImage: 'none'
                }}
              >
                <option value="all">{t('filterAll')}</option>
                <option value="motor">{t('filterMotor')}</option>
                <option value="health">{t('filterHealth')}</option>
                <option value="home">{t('filterHome')}</option>
                <option value="travel">{t('filterTravel')}</option>
              </select>
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
                <th>{t('colProduct')}</th>
                <th>{t('colPremium')}</th>
                <th>{t('colStatus')}</th>
                <th>{t('colDate')}</th>
                <th>{t('colAction')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: '700', color: 'var(--primary-800)' }}>{p.id}</td>
                    <td style={{ fontWeight: '600' }}>{p.customer}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        backgroundColor: '#f1f5f9', 
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {p.product === 'Motor' ? t('filterMotor') : 
                         p.product === 'Health' ? t('filterHealth') : 
                         p.product === 'Home' ? t('filterHome') : t('filterTravel')}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700' }}>{p.premium.toLocaleString()} {t('sar')}</td>
                    <td>
                      <span className={`badge-status ${p.status}`}>
                        {p.status === 'active' ? t('statusActive') : 
                         p.status === 'pending' ? t('statusPending') : 
                         p.status === 'review' ? t('statusReview') : t('statusExpired')}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{p.date}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => alert(`[Details Modal / تفاصيل وثيقة التأمين]\n\nPolicy Number: ${p.id}\nCustomer: ${p.customer}\nProduct: ${p.product}\nPremium: ${p.premium} SAR\nDate: ${p.date}`)}
                          style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}
                          title={t('btnView')}
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => handleDownloadPDF(p.id)}
                          style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}
                          title={t('btnDownload')}
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                    {lang === 'ar' ? 'لا توجد نتائج تطابق البحث' : 'No matching records found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
