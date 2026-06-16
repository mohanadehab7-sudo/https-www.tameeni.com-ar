import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Logo } from './components/Logo';
import Home from './views/Home';
import Comparison from './views/Comparison';
import Checkout from './views/Checkout';
import MotorApp from './views/MotorApp';
import LoginModal from './components/LoginModal';
import { 
  X, Phone, Mail, MessageSquare, Car, Heart, FileText, 
  Sparkles, Percent, Copy, Check, Search, Globe, ShieldCheck
} from 'lucide-react';

function AppContent() {
  const { t, lang, toggleLanguage, isRTL } = useLanguage();

  // Navigation View State: 'home' | 'comparison' | 'checkout' | 'motorapp'
  const [activeView, setActiveView] = useState('home');
  const [queryData, setQueryData] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // States for Drawers and Banners
  const [showMobilePromo, setShowMobilePromo] = useState(true);
  const [showPlusBanner, setShowPlusBanner] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlusDrawerOpen, setIsPlusDrawerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null); // { id, mobile }
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderView = () => {
    switch (activeView) {
      case 'comparison':
        return (
          <Comparison 
            queryData={queryData} 
            setSelectedQuote={setSelectedQuote} 
            setActiveView={setActiveView} 
          />
        );
      case 'checkout':
        return (
          <Checkout 
            selectedQuote={selectedQuote} 
            queryData={queryData} 
            setActiveView={setActiveView} 
          />
        );
      case 'motorapp':
        return (
          <MotorApp 
            setActiveView={setActiveView} 
            setQueryData={setQueryData} 
          />
        );
      case 'home':
      default:
        return (
          <Home 
            setQueryData={setQueryData} 
            setActiveView={setActiveView} 
            setIsPlusDrawerOpen={setIsPlusDrawerOpen}
            onStartNowClick={() => setIsLoginModalOpen(true)}
          />
        );
    }
  };

  const plusOffers = [
    {
      partner: lang === 'ar' ? 'ثري إم للعناية بالسيارات 3M' : '3M Auto Care',
      desc: lang === 'ar' ? 'خصم 30% على خدمات النانو سيراميك والتظليل العازل' : '30% OFF Nano Ceramic & Tinting services',
      code: 'TPLUS30'
    },
    {
      partner: lang === 'ar' ? 'كار واش بلس' : 'Car Wash Plus',
      desc: lang === 'ar' ? 'غسيل داخلي وخارجي متنقل بخصم حصري 20%' : '20% OFF Mobile interior & exterior wash',
      code: 'WASH20'
    },
    {
      partner: lang === 'ar' ? 'الفحص الفني الدوري' : 'Motor Vehicle Inspection',
      desc: lang === 'ar' ? 'خصم 25% على رسوم الخدمة والتقارير الفنية' : '25% OFF technical vehicle inspection reports',
      code: 'INSPECT25'
    },
    {
      partner: lang === 'ar' ? 'إطارات الساير وكيل بريدجستون' : 'Al-Sayer Tires (Bridgestone)',
      desc: lang === 'ar' ? 'خصم 15% على شراء الإطارات والميزان المجاني' : '15% OFF tires purchase + free alignment check',
      code: 'TIRES15'
    }
  ];

  return (
    <div className="tameeni-app" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* 1. MOBILE APP DOWNLOADING TOP RIBBON */}
      {showMobilePromo && (
        <div className="flex lg:hidden w-full bg-primary text-slate-50 p-4 gap-4 justify-between items-center border-b border-slate-100">
          <div className="flex gap-2 items-center">
            <div className="p-2 rounded-md bg-slate-50 flex items-center justify-center">
              {/* Shield check SVG */}
              <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="shrink-0 size-5">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.67889 9.56532H4.63534C4.46705 9.56595 4.30545 9.49853 4.18623 9.37795C4.06701 9.25737 4 9.09357 4 8.92273V3.73527C4 2.76424 4.77543 1.97707 5.73197 1.97707H10.7046C11.2572 1.97738 11.7985 1.81858 12.2657 1.5191L14.3692 0.172116C14.7281 -0.057372 15.1849 -0.057372 15.5439 0.172116L17.7715 1.59833C18.157 1.84521 18.6035 1.97624 19.0593 1.97628H24.32C25.1985 1.97628 25.9107 2.69924 25.9107 3.59107V4.95865C25.9107 5.07829 25.9154 9.57958 25.9154 9.57958C25.9555 9.98874 25.7669 10.3863 25.4268 10.6096L15.5228 17.9538C15.3897 18.0488 15.2156 18.0606 15.0713 17.9845C14.927 17.9083 14.8365 17.7568 14.8367 17.5917V15.9048C14.8368 15.5009 15.0275 15.1215 15.3495 14.8843L23.0915 9.10021C23.3945 8.88284 23.5703 8.52594 23.5598 8.1494L23.5465 5.3667C23.537 5.00717 23.3781 4.66852 23.109 4.4345C22.84 4.20049 22.486 4.09298 22.1345 4.13857L18.8759 4.16314C18.2154 4.18963 17.5615 4.02208 16.9925 3.6806L15.3183 2.61253C15.0978 2.46288 14.8096 2.4654 14.5916 2.61886L13.0782 3.55303C12.4254 3.95097 11.6792 4.16334 10.9177 4.16789L7.63175 4.1877C6.8821 4.1925 6.27738 4.8117 6.27911 5.57271L6.28848 8.94491C6.28889 9.10931 6.22485 9.26711 6.11049 9.38351C5.99612 9.4999 5.84084 9.56532 5.67889 9.56532ZM24.9793 13.0546L15.8715 19.8925C15.3289 20.3037 14.5845 20.3037 14.0419 19.8925L4.94031 13.0546C4.76141 12.9199 4.5228 12.8996 4.32429 13.0022C4.12579 13.1048 4.0016 13.3126 4.00369 13.5387V21.0335C4.00263 21.9452 4.43588 22.8012 5.16666 23.3313L13.8827 29.6518C14.5262 30.1161 15.3887 30.1161 16.0322 29.6518L24.7483 23.3313C25.4769 22.7993 25.9095 21.9445 25.9113 21.0335V13.5324C25.9114 13.3083 25.7872 13.1033 25.5902 13.0022C25.3932 12.9012 25.1569 12.9215 24.9793 13.0546ZM23.5214 20.2529C23.5471 20.8549 23.278 21.4309 22.8025 21.7916L16.1314 26.972C15.4368 27.5022 14.4805 27.5022 13.786 26.972L6.93847 21.7053C6.86574 21.6598 6.79977 21.6041 6.74256 21.5397C6.49751 21.2822 6.33951 20.9523 6.29142 20.5976C6.27128 20.5084 6.26029 20.4173 6.25864 20.3258L6.27815 18.1699C6.2753 17.9895 6.37326 17.823 6.53106 17.7401C6.68886 17.6571 6.87931 17.672 7.02277 17.7784L14.0724 22.912C14.5994 23.2966 15.3094 23.2966 15.8364 22.912L22.8407 17.8046C22.9712 17.7094 23.1431 17.6961 23.2863 17.7702C23.4294 17.8443 23.5198 17.9933 23.5206 18.1564L23.5214 20.2529Z" fill="#0088EB"></path>
              </svg>
            </div>
            <div className="flex flex-col text-slate-50">
              <p className="text-sm font-bold">تطبيق تأميني</p>
              <p className="text-[10px]">تأمينك أسهل مع تطبيق تأميني</p>
            </div>
          </div>
          
          <div className="flex gap-3 items-center">
            <a href="https://play.google.com/store/apps/details?id=tameeni.com" target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="shrink-0 size-6 text-slate-50">
                <path d="M15.5575 11.1104L12 14.6678L8.44252 11.1104" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"></path>
                <path d="M12 3.99707V14.6685" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M20.0033 16.4463C20.0033 18.411 18.4106 20.0038 16.4459 20.0038H7.55416C5.58941 20.0038 3.99667 18.411 3.99667 16.4463" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </a>
            <button className="p-1 text-xs !rounded-full bg-blue-500 text-white" onClick={() => setShowMobilePromo(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" width="16" height="16" className="shrink-0 size-5 text-slate-50">
                <path d="M5 5L15 15" stroke="currentColor" strokeWidth="1.13333" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M15 5L5 15" stroke="currentColor" strokeWidth="1.13333" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 2. OFFICIAL SAMA HEADER NAVBAR */}
      <header className="w-full flex flex-col bg-white border-b border-slate-100">
        <div className="box h-16 flex items-center gap-4 z-50 max-w-7xl mx-auto w-full px-4 justify-between">
          <button 
            className="p-1.5 rounded-xs w-9 h-9 flex items-center justify-center bg-slate-100" 
            aria-label="Toggle navigation" 
            type="button" 
            aria-haspopup="dialog" 
            aria-expanded="false" 
            aria-controls="radix-_r_0_" 
            data-state="closed"
            onClick={() => setIsMenuOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="shrink-0 size-4.5 transition-transform duration-300 cursor-pointer ease-in-out w-6 h-6 scale-100">
              <g clipPath="url(#clip0_6065_2514)">
                <path d="M4 6L20 6L4 6Z" fill="currentColor"></path>
                <path d="M4 6L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M4 12H20H4Z" fill="currentColor"></path>
                <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </g>
              <defs>
                <clipPath id="clip0_6065_2514"><rect width="24" height="24" fill="white"></rect></clipPath>
              </defs>
            </svg>
          </button>
          
          <div className="grow ms-0 md:ms-4">
            <div className="flex items-center gap-4">
              <a href="/ar" onClick={(e) => { e.preventDefault(); setActiveView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <svg viewBox="0 0 113 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="36" className="shrink-0 size-4.5 hidden md:block h-[36px] text-primary w-[165px] rtl:w-[113px]">
                  <path fillRule="evenodd" clipRule="evenodd" d="M61.9452 0.0523007C62.3676 -0.050385 62.812 -0.000903602 63.2024 0.192281V1.06657L62.979 1.04859C62.7148 1.02591 62.496 1.01418 62.3242 1.01418C62.0097 1.0192 61.7533 1.2716 61.7387 1.59052C61.7155 1.70585 61.7155 1.82476 61.7387 1.94008C61.7384 2.07018 61.7927 2.19426 61.888 2.28127C61.9832 2.36829 62.1105 2.41001 62.2379 2.396H63.3048C63.3819 2.396 63.4944 2.40225 63.6322 2.4132V3.49707H60.2042V2.37801H60.4969L60.7727 2.396L60.7203 2.09883C60.5747 1.66126 60.627 1.1807 60.8632 0.78596C61.0995 0.39122 61.4955 0.122673 61.9452 0.0523007ZM63.4947 20.2664H66.6308V20.2686H70.1796V20.2682H74.7785C75.1591 20.2896 75.5321 20.1542 75.8131 19.8928C76.0782 19.6085 76.2154 19.2255 76.1921 18.8347V11.5941H79.3274V18.5204C79.3274 21.3997 77.8976 22.8394 75.0381 22.8394H70.869V22.8398H65.9388V22.8377H60.3771V5.15633H63.4954L63.4947 20.2664ZM32.4007 6.16293C32.0686 5.83266 31.6026 5.68038 31.1431 5.75187H31.1423C30.0972 5.76334 29.5692 6.32873 29.5585 7.44806C29.549 8.05002 29.8611 8.61009 30.3741 8.91207C30.8872 9.21405 31.521 9.21072 32.031 8.90336C32.5409 8.596 32.8472 8.03269 32.8316 7.43085C32.8925 6.96293 32.7329 6.4932 32.4007 6.16293ZM35.7417 20.2674H32.6064V11.5237H29.488V20.2674H26.3181V20.2674H22.0768V20.2688H18.5324V20.2682H16.6543L12.6046 19.8467L12.8804 20.8633C13.1079 21.8523 13.2805 22.8536 13.3973 23.8623C13.5686 25.17 13.6551 26.4876 13.6561 27.8068H6.69603C6.47488 27.7842 6.2559 27.7434 6.04124 27.6848C4.68163 27.4598 3.58433 26.435 3.25028 25.0784C3.15052 24.6838 3.09878 24.2783 3.09621 23.8709V20.2682H0.0980225V25.4686C0.257071 27.5689 1.68658 29.347 3.68167 29.9261C4.64149 30.254 5.64955 30.4127 6.66214 30.3953H16.7406V22.8395H17.8396V22.8401H22.7698V22.8398H27.0071V22.8387H35.053V22.8424H46.5781V22.8407H46.8376C47.8297 22.8739 48.7866 22.4651 49.4567 21.7216L49.7325 21.5292L49.6285 21.3892C50.5894 22.5478 51.9957 23.2293 53.4873 23.2593C54.9789 23.2892 56.4107 22.6647 57.4159 21.5456C59.5287 19.2119 59.5287 15.6244 57.4159 13.2907C56.4349 12.1992 55.0467 11.5773 53.5912 11.5773C52.1357 11.5773 50.7474 12.1992 49.7664 13.2907C48.7222 14.4008 48.1529 15.8851 48.1826 17.4197C48.1789 17.987 48.2541 18.552 48.406 19.0979C48.2923 19.6813 47.8298 20.1292 47.2505 20.217C46.837 20.2519 46.2685 20.2694 45.5449 20.2694V20.2712H43.4428V11.5275H40.3252V20.2712H35.7417V20.2674ZM7.23067 32.6161C7.69005 32.5446 8.15579 32.6968 8.4878 33.0269C8.81982 33.3571 8.97938 33.8266 8.9185 34.2943C8.93416 34.8961 8.62798 35.4595 8.11811 35.7669C7.60825 36.0744 6.97445 36.0779 6.46134 35.776C5.94823 35.4742 5.63605 34.9142 5.6453 34.3123C5.6566 33.194 6.18506 32.6291 7.23067 32.6177V32.6161ZM12.7602 33.0269C12.4281 32.6968 11.9623 32.5446 11.5029 32.6161V32.6176C10.4578 32.6291 9.92931 33.194 9.91749 34.3123C9.92239 35.23 10.6593 35.97 11.5633 35.965C12.4674 35.9601 13.1964 35.2121 13.1915 34.2943C13.2521 33.8265 13.0923 33.357 12.7602 33.0269ZM40.8234 25.51C40.4915 25.1797 40.0258 25.0273 39.5663 25.0985L39.5671 25.0962C38.5209 25.1092 37.9922 25.6757 37.9809 26.7955C37.9717 27.3975 38.2839 27.9574 38.797 28.2592C39.3101 28.5611 39.9439 28.5576 40.4537 28.2501C40.9636 27.9427 41.2698 27.3793 41.2541 26.7775C41.3149 26.3098 41.1554 25.8402 40.8234 25.51ZM43.8387 25.0985C44.2982 25.0273 44.7638 25.1797 45.0958 25.51C45.4278 25.8402 45.5873 26.3098 45.5265 26.7775C45.5422 27.3793 45.236 27.9427 44.7261 28.2501C44.2163 28.5576 43.5825 28.5611 43.0694 28.2592C42.5563 27.9574 42.2441 27.3975 42.2533 26.7955C42.2646 25.6757 42.7931 25.1092 43.8387 25.0962V25.0985ZM53.5898 14.0441C54.9682 14.0436 55.6574 15.1686 55.6574 17.4193V17.4208C55.6569 19.671 54.9675 20.796 53.5891 20.796C52.2107 20.796 51.5215 19.671 51.5215 17.4208C51.522 15.1702 52.2114 14.0446 53.5898 14.0441ZM74.779 6.16322C74.447 5.83299 73.9813 5.68058 73.5219 5.7518V5.75258C72.4768 5.76405 71.9483 6.32918 71.9365 7.44799C71.9271 8.04995 72.2391 8.61002 72.7522 8.912C73.2652 9.21398 73.899 9.21065 74.409 8.90329C74.9189 8.59593 75.2252 8.03262 75.2097 7.43078C75.2705 6.96301 75.1109 6.49345 74.779 6.16322ZM77.7946 5.7518C78.2541 5.68058 78.7198 5.83299 79.0517 6.16322C79.3837 6.49345 79.5433 6.96301 79.4824 7.43078C79.498 8.03262 79.1917 8.59593 78.6817 8.90329C78.1718 9.21065 77.538 9.21398 77.0249 8.912C76.5118 8.61002 76.1998 8.04995 76.2092 7.44799C76.2205 6.32918 76.7487 5.76405 77.7938 5.75258L77.7946 5.7518Z" fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M88.7098 11.4784H87.4576C87.2556 11.4791 87.0617 11.3982 86.9186 11.2535C86.7756 11.1088 86.6952 10.9123 86.6952 10.7073V4.48233C86.6952 3.31709 87.6257 2.37248 88.7735 2.37248H94.7407C95.4038 2.37286 96.0533 2.18229 96.614 1.82291L99.1382 0.206539C99.5689 -0.0688464 100.117 -0.0688464 100.548 0.206539L103.221 1.918C103.684 2.21425 104.219 2.37153 104.766 2.37153H111.079C112.133 2.37153 112.988 3.23909 112.988 4.30928V5.95038C112.988 6.09395 112.994 11.4955 112.994 11.4955C113.042 11.9865 112.815 12.4636 112.407 12.7315L100.522 21.5446C100.363 21.6586 100.154 21.6728 99.9808 21.5814C99.8076 21.49 99.699 21.3082 99.6992 21.1101V19.0858C99.6994 18.6011 99.9281 18.1458 100.315 17.8612L109.605 10.9203C109.969 10.6594 110.18 10.2311 110.167 9.77928L110.151 6.44004C110.14 6.00861 109.949 5.60222 109.626 5.32141C109.303 5.04059 108.878 4.91158 108.457 4.96629L104.546 4.99576C103.754 5.02756 102.969 4.8265 102.286 4.41672L100.277 3.13503C100.013 2.95546 99.6666 2.95848 99.4051 3.14264L97.589 4.26364C96.8056 4.74117 95.9102 4.99601 94.9964 5.00147L91.0533 5.02524C90.1537 5.031 89.428 5.77403 89.4301 6.68725L89.4413 10.7339C89.4418 10.9312 89.365 11.1205 89.2277 11.2602C89.0905 11.3999 88.9042 11.4784 88.7098 11.4784ZM111.87 15.6655L100.941 23.871C100.29 24.3645 99.3966 24.3645 98.7455 23.871L87.8235 15.6655C87.6089 15.5039 87.3225 15.4795 87.0843 15.6026C86.8461 15.7257 86.6971 15.9751 86.6996 16.2465V25.2402C86.6983 26.3343 87.2182 27.3615 88.0952 27.9975L98.5544 35.5821C99.3266 36.1393 100.362 36.1393 101.134 35.5821L111.593 27.9975C112.467 27.3592 112.987 26.3334 112.989 25.2402V16.2389C112.989 15.97 112.84 15.7239 112.603 15.6027C112.367 15.4815 112.083 15.5058 111.87 15.6655ZM110.121 24.3034C110.152 25.0258 109.829 25.717 109.258 26.1499L101.253 32.3663C100.42 33.0025 99.272 33.0025 98.4385 32.3663L90.2215 26.0463C90.1342 25.9917 90.0551 25.9248 89.9864 25.8475C89.6924 25.5386 89.5028 25.1426 89.445 24.717C89.4209 24.61 89.4077 24.5007 89.4057 24.3909L89.4291 21.8037C89.4257 21.5873 89.5433 21.3875 89.7326 21.288C89.922 21.1885 90.1505 21.2063 90.3227 21.334L98.7822 27.4943C99.4146 27.9558 100.267 27.9558 100.899 27.4943L109.304 21.3654C109.461 21.2512 109.667 21.2353 109.839 21.3242C110.011 21.413 110.119 21.5919 110.12 21.7876L110.121 24.3034Z" fill="currentColor"></path>
                </svg>
              </a>
              <div data-orientation="vertical" role="none" className="shrink-0 w-[1px] hidden md:block h-3 bg-slate-300"></div>
              <span className="text-sm text-slate-500 font-normal hidden md:block">السيارات</span>
            </div>
          </div>
          
          <button 
            aria-label="عن ماذا تبحث ؟" 
            className="flex items-center justify-center size-9 rounded-full hover:bg-slate-100 transition-colors" 
            type="button" 
            aria-haspopup="dialog" 
            aria-expanded="false" 
            aria-controls="radix-_r_3_" 
            data-state="closed"
            onClick={(e) => e.preventDefault()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search size-5 text-slate-600">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </button>
          
          <button 
            className="cursor-pointer whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-100 disabled:cursor-not-allowed text-center bg-transparent text-slate-600 hover:text-primary active:text-primary/80 disabled:text-slate-400 inline-flex items-center justify-center" 
            type="button"
            onClick={toggleLanguage}
          >
            <div className="flex items-center w-full gap-2 justify-center">
              <div className="overflow-hidden self-center">
                <div>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="shrink-0 size-4.5 w-6 h-6 sm:hidden text-inherit" aria-label="Language">
                    <path d="M12 3.10001C16.667 8.02701 16.667 15.973 12 20.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"></path>
                    <path d="M12 20.9C7.33301 15.973 7.33301 8.02701 12 3.10001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"></path>
                    <path d="M12 3C16.982 3 21 7.018 21 12C21 16.982 16.982 21 12 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"></path>
                    <path d="M12 21C7.018 21 3 16.982 3 12C3 7.018 7.018 3 12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"></path>
                    <path d="M3.51 9H20.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"></path>
                    <path d="M3.51 15H20.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"></path>
                  </svg>
                  <div className="items-center hidden sm:block">
                    <span className="text-sm text-inherit font-semibold">{lang === 'ar' ? 'English' : 'العربية'}</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
          
          <div className="hidden lg:flex w-fit items-center justify-center cursor-pointer">
            <a 
              className="text-sm text-primary py-1.5 px-4 border border-primary rounded-md font-semibold hover:bg-primary/5 transition-colors" 
              href="/ar/contact-us"
              onClick={(e) => { e.preventDefault(); setIsMenuOpen(true); }}
            >
              تواصل معنا
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <div data-orientation="vertical" role="none" className="shrink-0 w-[1px] hidden md:block h-3 bg-slate-300"></div>
            {loggedInUser ? (
              /* ── Logged-in user button ── */
              <div className="relative">
                <button
                  className="cursor-pointer flex items-center gap-2 py-1.5 px-3 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {loggedInUser.mobile ? loggedInUser.mobile.slice(-2) : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 hidden md:block">
                    {lang === 'ar' ? 'هلا' : 'Hala'}
                  </span>
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-100 rounded-lg shadow-lg py-1 z-50">
                    <button
                      className="w-full text-start px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        alert(lang === 'ar' ? 'عرض وثائقي التأمينية...' : 'Showing my policies...');
                      }}
                    >
                      {lang === 'ar' ? 'وثائقي' : 'My Policies'}
                    </button>
                    <button
                      className="w-full text-start px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setLoggedInUser(null);
                      }}
                    >
                      {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ── Login button ── */
              <button 
                className="cursor-pointer whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-100 disabled:cursor-not-allowed text-center min-h-9 min-w-[7.5rem] py-2 text-xs rounded-md gap-2 bg-primary text-white hover:bg-primary/90 active:bg-primary/80 disabled:bg-slate-400 w-fit px-4 font-semibold inline-flex items-center justify-center" 
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <div className="flex items-center w-full gap-2 justify-center">
                  <div className="overflow-hidden self-center">
                    <div>الدخول لحسابي</div>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 3. OFFICIAL TABS MENU NAVIGATION */}
      <nav className="relative w-full max-w-7xl mx-auto flex justify-between items-center">
        <div className="cursor-pointer items-center justify-start p-2 absolute top-0 start-0 bottom-0 w-24 bg-gradient-to-l rtl:from-white rtl:to-transparent ltr:to-white ltr:from-transparent rtl:from-50% ltr:to-50% transition-all duration-300 hidden lg:flex">
          <span className="flex items-center justify-center p-2 bg-white rounded-full border border-slate-200">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="shrink-0 size-4 text-slate-500 ltr:rotate-180 rtl:rotate-0">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M14 17L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M14 7L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </span>
        </div>
        
        <ul className="w-fit flex justify-start px-2 md:px-4 items-center mx-auto gap-3 scroll-smooth no-scrollbar overflow-x-auto touch-pan-x">
          <div>
            <li 
              className={`transition-all font-bold py-4 px-2 md:font-semibold text-t3 cursor-pointer ${
                activeView === 'motorapp' || activeView === 'comparison' || activeView === 'checkout'
                  ? 'text-blue-600 border-b-[3px] border-b-blue-600' 
                  : 'text-gray-700 md:border-b-transparent hover:text-blue-600'
              }`}
              onClick={() => setActiveView('motorapp')}
            >
              <a href="/ar" onClick={(e) => { e.preventDefault(); setActiveView('motorapp'); }} aria-label="السيارات" className="flex items-center justify-center gap-2">
                <span aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="shrink-0 size-6">
                    <g clipPath="url(#clip0_6236_1707)">
                      <path d="M24 13.1648V14.8464C24 15.5316 23.7451 16.1485 23.3372 16.5826C22.9537 16.9921 22.439 17.2405 21.8734 17.2405H2.12907C0.951649 17.2405 0 16.1676 0 14.8464V13.4104C0 12.2939 0.6579 11.3139 1.61198 11.0027L4.28242 10.1346C4.77038 9.97624 5.19765 9.64592 5.50354 9.1873L6.23427 8.09534L7.06453 6.85869C7.67874 5.94691 8.63524 5.40912 9.65244 5.40912H16.581C17.2389 5.40912 17.8701 5.63297 18.3969 6.03699C18.7417 6.29634 19.0427 6.63211 19.2782 7.03341L20.6644 9.37293C20.8974 9.76603 21.2203 10.0827 21.5966 10.2874L22.74 10.9071C23.5096 11.3248 24 12.2038 24 13.1648Z" fill="url(#paint0_linear_6236_1707)"></path>
                      <path d="M5.08594 19.591C6.59967 19.591 7.82678 18.2111 7.82678 16.5089C7.82678 14.8068 6.59967 13.4269 5.08594 13.4269C3.57221 13.4269 2.34509 14.8068 2.34509 16.5089C2.34509 18.2111 3.57221 19.591 5.08594 19.591Z" fill="url(#paint1_linear_6236_1707)"></path>
                      <path d="M18.6324 19.591C20.1462 19.591 21.3733 18.2111 21.3733 16.5089C21.3733 14.8068 20.1462 13.4269 18.6324 13.4269C17.1187 13.4269 15.8916 14.8068 15.8916 16.5089C15.8916 18.2111 17.1187 19.591 18.6324 19.591Z" fill="url(#paint2_linear_6236_1707)"></path>
                    </g>
                    <defs>
                      <linearGradient id="paint0_linear_6236_1707" x1="12" y1="5.40912" x2="12" y2="17.2405" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#54AFF2"></stop>
                        <stop offset="1" stopColor="#0088EB"></stop>
                      </linearGradient>
                      <linearGradient id="paint1_linear_6236_1707" x1="5.08594" y1="13.4269" x2="5.08594" y2="19.591" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#007CD6"></stop>
                        <stop offset="1" stopColor="#0061A7"></stop>
                      </linearGradient>
                      <linearGradient id="paint2_linear_6236_1707" x1="18.6324" y1="13.4269" x2="18.6324" y2="19.591" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#007CD6"></stop>
                        <stop offset="1" stopColor="#0061A7"></stop>
                      </linearGradient>
                      <clipPath id="clip0_6236_1707">
                        <rect width="24" height="14.1818" fill="white" transform="translate(0 5.40912)"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <h3 className="text-sm text-nowrap">السيارات</h3>
              </a>
            </li>
          </div>
          
          <div>
            <li 
              className="transition-all font-bold py-4 px-2 md:font-semibold text-t3 cursor-pointer text-gray-700 md:border-b-transparent hover:text-blue-600"
              onClick={(e) => e.preventDefault()}
            >
              <div aria-label="الصحي" className="flex items-center justify-center gap-2">
                <span aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="shrink-0 size-6">
                    <g clipPath="url(#clip0_6338_66385)">
                      <path d="M19.4781 13.8146C18.6222 14.9641 17.5812 15.9368 16.5101 16.8745C15.3858 17.8565 14.2545 18.8385 13.1256 19.8158C13.084 19.8507 13.0423 19.8879 12.9984 19.9252C12.9012 20.0113 12.8041 20.0927 12.7069 20.1788C12.2211 20.5976 11.6936 20.6163 11.2217 20.2067C9.56997 18.764 7.91591 17.326 6.28267 15.8647C5.45217 15.1177 4.70958 14.2893 4.09885 13.3446C2.98149 11.6296 2.67381 9.79601 3.37245 7.85535C4.00168 6.10317 5.23008 4.95831 7.07615 4.60229C8.98006 4.23464 10.5184 4.91876 11.7376 6.39636C11.8047 6.47548 11.8695 6.56157 11.9365 6.65C12.1748 6.38007 12.3992 6.1148 12.6398 5.8728C14.5206 3.99264 17.3267 4.14854 19.0941 5.70759C19.9963 6.50573 20.5238 7.51096 20.7574 8.66978C20.7829 8.78612 20.8037 8.9048 20.8199 9.0258C20.8315 9.11887 20.843 9.20962 20.8476 9.30037C21.0188 10.9804 20.4775 12.4627 19.4758 13.8146H19.4781Z" fill="#94A3B8"></path>
                      <path d="M16.5 10.5C17.6046 10.5 18.5 9.60457 18.5 8.5C18.5 7.39543 17.6046 6.5 16.5 6.5C15.3954 6.5 14.5 7.39543 14.5 8.5C14.5 9.60457 15.3954 10.5 16.5 10.5Z" fill="#CBD5E1"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_6338_66385">
                        <rect width="17.8824" height="16" fill="white" transform="translate(3 4.5)"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <h3 className="text-sm text-nowrap">الصحي</h3>
                <svg viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="shrink-0 size-3 transition-transform duration-300">
                  <path d="M1.25 1.375L6.5 6.625L11.75 1.375" stroke="currentColor" strokeWidth="1.3125" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
            </li>
          </div>
          
          <div>
            <li 
              className="transition-all font-bold py-4 px-2 md:font-semibold text-t3 cursor-pointer text-gray-700 md:border-b-transparent hover:text-blue-600"
              onClick={(e) => e.preventDefault()}
            >
              <a href="/ar/mmp" onClick={(e) => e.preventDefault()} aria-label="الأخطاء الطبية" className="flex items-center justify-center gap-2">
                <span aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="shrink-0 size-6">
                    <g clipPath="url(#clip0_6338_66394)">
                      <path d="M17.0228 4.08417H6.4772C5.66079 4.08417 5 4.75859 5 5.59184V19.4924C5 20.3256 5.66079 21 6.4772 21H17.0228C17.8392 21 18.5 20.3256 18.5 19.4924V5.59184C18.5 4.75859 17.8392 4.08417 17.0228 4.08417ZM14.6322 13.1624H12.2078V15.6369H11.2922V13.1624H8.86777V12.2279H11.2922V9.75348H12.2078V12.2279H14.6322V13.1624Z" fill="#94A3B8"></path>
                      <path d="M13.2881 3H10.2142C9.62755 3 9.15198 3.48487 9.15198 4.08299C9.15198 4.68111 9.62755 5.16598 10.2142 5.16598H13.2881C13.8748 5.16598 14.3504 4.68111 14.3504 4.08299C14.3504 3.48487 13.8748 3 13.2881 3Z" fill="#CBD5E1"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_6338_66394">
                        <rect width="13.5" height="18" fill="white" transform="translate(5 3)"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <h3 className="text-sm text-nowrap">الأخطاء الطبية</h3>
              </a>
            </li>
          </div>
          
          <div>
            <li 
              className="transition-all font-bold py-4 px-2 md:font-semibold text-t3 cursor-pointer text-gray-700 md:border-b-transparent hover:text-blue-600"
              onClick={(e) => e.preventDefault()}
            >
              <a href="/ar/domestic-helper" onClick={(e) => e.preventDefault()} aria-label="العمالة المنزلية" className="flex items-center justify-center gap-2">
                <span aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="shrink-0 size-6">
                    <g clipPath="url(#clip0_6338_66385)">
                      <path d="M19.4781 13.8146C18.6222 14.9641 17.5812 15.9368 16.5101 16.8745C15.3858 17.8565 14.2545 18.8385 13.1256 19.8158C13.084 19.8507 13.0423 19.8879 12.9984 19.9252C12.9012 20.0113 12.8041 20.0927 12.7069 20.1788C12.2211 20.5976 11.6936 20.6163 11.2217 20.2067C9.56997 18.764 7.91591 17.326 6.28267 15.8647C5.45217 15.1177 4.70958 14.2893 4.09885 13.3446C2.98149 11.6296 2.67381 9.79601 3.37245 7.85535C4.00168 6.10317 5.23008 4.95831 7.07615 4.60229C8.98006 4.23464 10.5184 4.91876 11.7376 6.39636C11.8047 6.47548 11.8695 6.56157 11.9365 6.65C12.1748 6.38007 12.3992 6.1148 12.6398 5.8728C14.5206 3.99264 17.3267 4.14854 19.0941 5.70759C19.9963 6.50573 20.5238 7.51096 20.7574 8.66978C20.7829 8.78612 20.8037 8.9048 20.8199 9.0258C20.8315 9.11887 20.843 9.20962 20.8476 9.30037C21.0188 10.9804 20.4775 12.4627 19.4758 13.8146H19.4781Z" fill="#94A3B8"></path>
                      <path d="M16.5 10.5C17.6046 10.5 18.5 9.60457 18.5 8.5C18.5 7.39543 17.6046 6.5 16.5 6.5C15.3954 6.5 14.5 7.39543 14.5 8.5C14.5 9.60457 15.3954 10.5 16.5 10.5Z" fill="#CBD5E1"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_6338_66385">
                        <rect width="17.8824" height="16" fill="white" transform="translate(3 4.5)"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <h3 className="text-sm text-nowrap">العمالة المنزلية</h3>
              </a>
            </li>
          </div>
          
          <div>
            <li 
              className="transition-all font-bold py-4 px-2 md:font-semibold text-t3 cursor-pointer text-gray-700 md:border-b-transparent hover:text-blue-600"
              onClick={(e) => e.preventDefault()}
            >
              <a href="/ar/travel" onClick={(e) => e.preventDefault()} aria-label="السفر" className="flex items-center justify-center gap-2">
                <span aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="shrink-0 size-6">
                    <g clipPath="url(#clip0_6338_66389)">
                      <path d="M17.6611 9.55405C17.5652 9.82345 17.5839 9.90706 17.6822 10.3274L19.1704 16.728C19.2289 16.9857 19.2617 17.1181 19.2547 17.2459C19.2547 17.2784 19.2477 17.3086 19.243 17.3388C19.1821 17.6267 19.119 17.6894 18.8031 18.003L18.4848 18.3188C17.963 18.8367 17.7009 19.0968 17.4342 19.1433C17.2002 19.1851 16.9591 19.1293 16.7696 18.9877C16.552 18.8297 16.435 18.4814 16.201 17.7847L14.4694 12.6312L11.5889 15.4901C11.4227 15.6527 11.3385 15.7386 11.2823 15.8338C11.2683 15.8571 11.2543 15.8826 11.2449 15.9082C11.1419 16.1474 11.1513 16.224 11.1958 16.6072L11.3525 18.0215C11.3947 18.4071 11.4064 18.4837 11.3034 18.7206C11.2917 18.7461 11.28 18.774 11.266 18.7972C11.2075 18.8924 11.1232 18.976 10.9594 19.1409L10.7886 19.3105C10.3791 19.7146 10.1755 19.9189 9.95089 19.9747C9.75199 20.0281 9.54139 20.0072 9.35887 19.9166C9.14828 19.8144 8.98916 19.5752 8.66858 19.1015L7.31841 17.0903C7.26225 17.0043 7.23417 16.9625 7.19907 16.923C7.17099 16.8905 7.13823 16.858 7.10313 16.8278C7.06569 16.7953 7.02123 16.7674 6.93699 16.7094L4.91056 15.3694C4.43086 15.0512 4.19219 14.8933 4.08923 14.6842C4.00031 14.5008 3.97925 14.2941 4.03073 14.0967C4.08923 13.8714 4.2928 13.6694 4.69996 13.2653L4.8661 13.1027L4.87312 13.0957C5.03926 12.9308 5.1235 12.8449 5.21944 12.7892C5.24284 12.7752 5.27092 12.7636 5.29666 12.752C5.53534 12.6521 5.61256 12.6591 6.00099 12.7032L7.42371 12.8612C7.81214 12.903 7.88936 12.9122 8.12804 12.8124C8.15378 12.8008 8.18186 12.7892 8.20526 12.7752C8.3012 12.7172 8.38544 12.6312 8.55158 12.4687L9.80581 11.2262C10.5546 10.483 10.2527 9.21963 9.2489 8.88752L6.24201 7.89121C5.54236 7.66129 5.19136 7.54517 5.0299 7.32919C4.8895 7.14107 4.83334 6.90187 4.87312 6.66963C4.92226 6.40487 5.182 6.14476 5.70382 5.62687L6.02205 5.3087C6.33795 4.99517 6.40113 4.93247 6.69363 4.87209C6.72405 4.86512 6.75681 4.86047 6.78723 4.85815C6.91359 4.85351 7.04931 4.8837 7.30671 4.94408L13.7323 6.41416C13.9991 6.47454 14.1324 6.50474 14.2611 6.49777C14.3852 6.48848 14.5068 6.45364 14.6168 6.39326C14.7057 6.34449 14.783 6.27482 14.9023 6.15405C14.9374 6.12154 14.9748 6.08206 15.017 6.04026L17.3499 3.64818C18.2204 2.75638 19.6829 2.78657 20.5136 3.74572C21.2343 4.58179 21.1547 5.83821 20.3896 6.63479L18.0379 9.07564C17.8577 9.26375 17.7664 9.36129 17.7056 9.46812C17.6916 9.49599 17.6799 9.52618 17.6705 9.55405H17.6611Z" fill="#94A3B8"></path>
                      <path d="M19 6C19.5523 6 20 5.55228 20 5C20 4.44772 19.5523 4 19 4C18.4477 4 18 4.44772 18 5C18 5.55228 18.4477 6 19 6Z" fill="#CBD5E1"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_6338_66389">
                        <rect width="17" height="17" fill="white" transform="translate(4 3)"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <h3 className="text-sm text-nowrap">السفر</h3>
              </a>
            </li>
          </div>
          
          <div>
            <li 
              className="transition-all font-bold py-4 px-2 md:font-semibold text-t3 cursor-pointer text-gray-700 md:border-b-transparent hover:text-blue-600"
              onClick={(e) => e.preventDefault()}
            >
              <a href="/ar/fleet" onClick={(e) => e.preventDefault()} aria-label="أسطول السيارات" className="flex items-center justify-center gap-2">
                <span aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="shrink-0 size-6">
                    <path d="M19 11.5625V12.9854C19 13.5652 18.7982 14.0872 18.4753 14.4545C18.1717 14.801 17.7642 15.0112 17.3164 15.0112H1.68551C0.753389 15.0112 0 14.1034 0 12.9854V11.7704C0 10.8256 0.520838 9.99634 1.27615 9.73301L3.39025 8.99846C3.77655 8.86448 4.11481 8.58498 4.35697 8.19692L4.93546 7.27295L5.59276 6.22656C6.079 5.45505 6.83623 5 7.64151 5H13.1266C13.6475 5 14.1472 5.18941 14.5642 5.53128C14.8371 5.75072 15.0755 6.03484 15.2619 6.3744L16.3593 8.35399C16.5438 8.68662 16.7994 8.95457 17.0973 9.12781L18.0025 9.65216C18.6118 10.0056 19 10.7494 19 11.5625Z" fill="#E2E8F0"></path>
                    <path d="M4.0264 17.0001C5.22477 17.0001 6.19623 15.8325 6.19623 14.3922C6.19623 12.9519 5.22477 11.7843 4.0264 11.7843C2.82803 11.7843 1.85656 12.9519 1.85656 14.3922C1.85656 15.8325 2.82803 17.0001 4.0264 17.0001Z" fill="#F1F5F9"></path>
                    <path d="M14.7507 17.0001C15.949 17.0001 16.9205 15.8325 16.9205 14.3922C16.9205 12.9519 15.949 11.7843 14.7507 11.7843C13.5523 11.7843 12.5808 12.9519 12.5808 14.3922C12.5808 15.8325 13.5523 17.0001 14.7507 17.0001Z" fill="#CBD5E1"></path>
                    <path d="M24 14.0156V15.3199C24 15.8514 23.7982 16.3299 23.4753 16.6666C23.1717 16.9842 22.7642 17.1769 22.3164 17.1769H6.68551C5.75339 17.1769 5 16.3448 5 15.3199V14.2062C5 13.3401 5.52084 12.58 6.27615 12.3386L8.39025 11.6653C8.77655 11.5424 9.11481 11.2862 9.35697 10.9305L9.93546 10.0835L10.5928 9.12435C11.079 8.41713 11.8362 8 12.6415 8H18.1266C18.6475 8 19.1472 8.17363 19.5642 8.48701C19.8371 8.68816 20.0755 8.9486 20.2619 9.25986L21.3593 11.0745C21.5438 11.3794 21.7994 11.625 22.0973 11.7838L23.0025 12.2645C23.6118 12.5884 24 13.2703 24 14.0156Z" fill="#94A3B8"></path>
                    <path d="M9.0264 19C10.2248 19 11.1962 17.9298 11.1962 16.6095C11.1962 15.2892 10.2248 14.2189 9.0264 14.2189C7.82803 14.2189 6.85656 15.2892 6.85656 16.6095C6.85656 17.9298 7.82803 19 9.0264 19Z" fill="#CBD5E1"></path>
                    <path d="M19.7507 19C20.949 19 21.9205 17.9298 21.9205 16.6095C21.9205 15.2892 20.949 14.2189 19.7507 14.2189C18.5523 14.2189 17.5808 15.2892 17.5808 16.6095C17.5808 17.9298 18.5523 19 19.7507 19Z" fill="#CBD5E1"></path>
                  </svg>
                </span>
                <h3 className="text-sm text-nowrap">أسطول السيارات</h3>
              </a>
            </li>
          </div>
          
          <div>
            <li 
              className="transition-all font-bold py-4 px-2 md:font-semibold text-t3 cursor-pointer text-gray-700 md:border-b-transparent hover:text-blue-600"
              onClick={(e) => e.preventDefault()}
            >
              <a href="/ar/ps" onClick={(e) => e.preventDefault()} aria-label="الحماية والادخار" className="flex items-center justify-center gap-2">
                <span aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="shrink-0 size-6">
                    <g clipPath="url(#clip0_6338_66398)">
                      <path d="M20.9274 14.1138H12.7079V14.3424C12.7079 15.6927 12.7128 17.0453 12.7079 18.398C12.703 19.2652 12.1553 19.9957 11.3744 20.3209C11.0699 20.4458 10.731 20.5094 10.3773 20.4976C9.201 20.4529 8.21868 19.4796 8.26289 18.3909H9.69216C9.74864 18.5229 9.77565 18.6596 9.85178 18.7656C9.98931 18.9659 10.1956 19.0767 10.4215 19.0932C10.5026 19.1002 10.5885 19.0932 10.6745 19.0719C10.9839 18.9965 11.2098 18.7279 11.2393 18.4027C11.2442 18.3485 11.2418 18.2919 11.2418 18.2377V14.1256H3.02715C2.6686 9.88855 5.79236 5.54547 11.006 4.95633C11.0821 4.94691 11.1607 4.93984 11.2368 4.93277V3.5H12.7054V4.93041C14.9967 5.17785 16.9122 6.01677 18.4176 7.51081C18.7417 7.83366 19.0463 8.18478 19.3311 8.56654C20.6916 10.3928 21.033 12.377 20.9274 14.1138Z" fill="#94A3B8"></path>
                      <path d="M13 3.5H11V5H13V3.5Z" fill="#CBD5E1"></path>
                    </g>
                  </svg>
                </span>
                <h3 className="text-sm text-nowrap">الحماية والادخار</h3>
              </a>
            </li>
          </div>
          
          <div>
            <li 
              className="transition-all font-bold py-4 px-2 md:font-semibold text-t3 cursor-pointer text-gray-700 md:border-b-transparent hover:text-blue-600"
              onClick={(e) => e.preventDefault()}
            >
              <a href="/ar/marine" onClick={(e) => e.preventDefault()} aria-label="نقل البضائع" className="flex items-center justify-center gap-2">
                <span aria-hidden="true">
                  <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="shrink-0 size-6">
                    <path d="M22.1297 14.6608L21.7197 16.5208C21.0097 19.7207 18.4997 22.0008 14.8797 22.0008H10.1197C6.49974 22.0008 3.98974 19.7207 3.27974 16.5208L2.86974 14.6608C2.66974 13.7508 3.20973 12.7208 4.07973 12.3708L5.49974 11.8007L11.0098 9.59079C11.4898 9.40079 11.9997 9.30078 12.4997 9.30078C12.9997 9.30078 13.5097 9.40079 13.9897 9.59079L19.4997 11.8007L20.9198 12.3708C21.7898 12.7208 22.3298 13.7508 22.1297 14.6608Z" fill="#94A3B8"></path>
                    <path opacity="0.4" d="M19.5 8V11.8L13.99 9.59C13.03 9.21 11.97 9.21 11.01 9.59L5.5 11.8V8C5.5 6.35 6.85 5 8.5 5H16.5C18.15 5 19.5 6.35 19.5 8Z" fill="#CBD5E1"></path>
                    <path d="M15 5H10V3C10 2.45 10.45 2 11 2H14C14.55 2 15 2.45 15 3V5Z" fill="#94A3B8"></path>
                  </svg>
                </span>
                <h3 className="text-sm text-nowrap">نقل البضائع</h3>
              </a>
            </li>
          </div>
          
          <div>
            <li 
              className="transition-all font-bold py-4 px-2 md:font-semibold text-t3 cursor-pointer text-gray-700 md:border-b-transparent hover:text-blue-600"
              onClick={(e) => e.preventDefault()}
            >
              <a href="/ar/home" onClick={(e) => e.preventDefault()} aria-label="المنزل" className="flex items-center justify-center gap-2">
                <span aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="shrink-0 size-6">
                    <g clipPath="url(#clip0_6338_66401)">
                      <path d="M20.9778 11.5047C20.8894 11.9145 20.5605 12.1943 20.1408 12.2041C19.7285 12.2139 19.3136 12.2041 18.8743 12.2041V18.4637C18.8743 19.4085 18.2852 19.9974 17.3427 19.9974H14.5568V14.7315H10.3964V19.9974H7.65222C6.71951 19.9974 6.12551 19.406 6.12551 18.476V12.2041H5.28361C5.16334 12.2041 5.04062 12.2065 4.92034 12.2041C4.51044 12.1992 4.19626 11.9955 4.06372 11.6421C3.92381 11.2643 4.01463 10.933 4.29935 10.6582C4.99643 9.98582 5.69597 9.31839 6.39551 8.6485C7.81422 7.28909 9.23293 5.92722 10.6541 4.56781C11.1278 4.11386 11.6015 3.6599 12.0753 3.20595C12.3624 2.92867 12.6374 2.92867 12.9294 3.2084C15.5067 5.67693 18.0815 8.14547 20.6587 10.6115C20.9164 10.8594 21.0539 11.144 20.9778 11.5023V11.5047Z" fill="#94A3B8"></path>
                      <path d="M15 5C15 4.44772 15.4477 4 16 4H17C17.5523 4 18 4.44772 18 5V8L15 5.5V5Z" fill="#CBD5E1"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_6338_66401">
                        <rect width="17" height="17" fill="white" transform="translate(4 3)"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <h3 className="text-sm text-nowrap">المنزل</h3>
              </a>
            </li>
          </div>
          
          <div>
            <li 
              className="transition-all font-bold py-4 px-2 md:font-semibold text-t3 cursor-pointer text-gray-700 md:border-b-transparent hover:text-blue-600"
              onClick={(e) => e.preventDefault()}
            >
              <div aria-label="منصة تريزا للسيارات الممولة" className="flex items-center justify-center gap-2">
                <span aria-hidden="true">
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="shrink-0 size-6">
                    <rect width="40" height="40" fill="white"></rect>
                    <path d="M34.0108 4H5.98921C4.8906 4 4 4.8906 4 5.98921V13.5772C4 14.6759 4.8906 15.5665 5.98921 15.5665H34.0108C35.1094 15.5665 36 14.6759 36 13.5772V5.98921C36 4.8906 35.1094 4 34.0108 4Z" fill="#94A3B8"></path>
                    <path fillRule="evenodd" clipRule="evenodd" d="M19.9137 22.0168C23.4271 22.0168 26.2752 19.0824 26.2752 15.4624H13.5522C13.5522 19.0824 16.4004 22.0168 19.9137 22.0168Z" fill="#94A3B8"></path>
                    <path fillRule="evenodd" clipRule="evenodd" d="M19.9137 8.77588C23.4271 8.77588 26.2752 11.7104 26.2752 15.3299H13.5522C13.5522 11.7104 16.4004 8.77588 19.9137 8.77588Z" fill="#CBD5E1"></path>
                    <path d="M19.9137 35.8275C23.4271 35.8275 26.2752 32.9793 26.2752 29.466C26.2752 25.9526 23.4271 23.1045 19.9137 23.1045C16.4004 23.1045 13.5522 25.9526 13.5522 29.466C13.5522 32.9793 16.4004 35.8275 19.9137 35.8275Z" fill="#94A3B8"></path>
                  </svg>
                </span>
                <h3 className="text-sm text-nowrap">منصة تريزا للسيارات الممولة</h3>
                <svg viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="shrink-0 size-3 transition-transform duration-300">
                  <path d="M1.25 1.375L6.5 6.625L11.75 1.375" stroke="currentColor" strokeWidth="1.3125" strokeLinecap="round" stroke-linejoin="round"></path>
                </svg>
              </div>
            </li>
          </div>
        </ul>
        
        <div className="cursor-pointer items-center justify-end p-2 absolute top-0 end-0 bottom-0 w-24 bg-gradient-to-r rtl:from-white rtl:to-transparent ltr:to-white ltr:from-transparent rtl:from-50% ltr:to-50% transition-all duration-300 hidden lg:flex">
          <span className="flex items-center justify-center p-2 bg-white rounded-full border border-slate-200">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="shrink-0 size-4 text-slate-500 ltr:rotate-180 rtl:rotate-0">
              <path d="M5 12H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M10 7L5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M10 17L5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </span>
        </div>
      </nav>

      {/* 3.5. TAMEENI PLUS BANNER */}
      {showPlusBanner && (
        <div className="bg-custom-gradient-2 py-3 lg:py-2">
          <div className="box flex items-center gap-1 lg:gap-4 relative max-w-7xl mx-auto px-4 w-full">
            <div className="flex gap-3 lg:gap-4 items-center pe-2 lg:pe-0">
              <img 
                alt="Plus Banner" 
                loading="lazy" 
                width="115" 
                height="100" 
                className="hidden lg:flex" 
                src="https://www.tameeni.com/images/tameeni-plus/logo-lg-ar.svg" 
                style={{ color: 'transparent' }}
              />
              <img 
                alt="Plus Banner" 
                loading="lazy" 
                width="60" 
                height="100" 
                className="flex lg:hidden" 
                src="https://www.tameeni.com/images/tameeni-plus/logo-sm-ar.svg" 
                style={{ color: 'transparent' }}
              />
              <span className="text-sm font-medium hidden lg:block">ارتقِ بتجربة قيادتك. إكسسوارات والعناية بالسيارة في مكان واحد.</span>
              <span className="text-sm font-medium flex lg:hidden rtl:text-s2">إكسسوارات والعناية بالسيارة في مكان واحد.</span>
            </div>
            
            <button 
              className="cursor-pointer whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-100 disabled:cursor-not-allowed text-center min-h-9 py-2 text-xs font-medium gap-2 text-white active:bg-blue-800 disabled:bg-slate-400 bg-t-plus-color hover:bg-t-plus-color/80 min-w-fit !w-fit h-fit rounded-3xl ms-auto me-6 lg:me-2 px-2 lg:px-4 inline-flex items-center justify-center" 
              type="button"
              onClick={() => setIsPlusDrawerOpen(true)}
            >
              <div className="overflow-hidden self-center">
                <div>جميع العروض</div>
              </div>
            </button>
            
            <button 
              className="cursor-pointer whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-100 disabled:cursor-not-allowed text-center px-6 text-base font-bold rounded-lg gap-2.5 bg-transparent text-blue-600 hover:text-blue-700 active:text-blue-800 disabled:text-slate-400 !p-0 !size-6 !text-black min-w-6 lg:relative absolute top-0 bottom-0 end-3 lg:m-0 m-auto min-h-0 inline-flex items-center justify-center" 
              type="button"
              onClick={() => setShowPlusBanner(false)}
            >
              <div className="flex items-center w-full gap-2 justify-center">
                <div className="overflow-hidden self-center">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" width="1em" height="1em" className="shrink-0 size-5 text-dark">
                      <path d="M5 5L15 15" stroke="currentColor" strokeWidth="1.13333" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path d="M15 5L5 15" stroke="currentColor" strokeWidth="1.13333" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 4. MAIN INTERACTIVE VIEWS */}
      <main style={{ flex: 1 }}>
        {renderView()}
      </main>

      {/* A. Hamburger Mobile Navigation Drawer */}
      {isMenuOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setIsMenuOpen(false)} />
          <div className={`side-drawer ${isRTL ? 'rtl' : 'ltr'}`}>
            <div className="drawer-header" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <Logo />
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X size={22} className="text-slate-600" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 mt-4">
              <a 
                href="#home" 
                onClick={(e) => { e.preventDefault(); setActiveView('home'); setIsMenuOpen(false); }}
                className="text-base text-slate-800 font-extrabold hover:text-blue-500 flex items-center gap-3"
              >
                <Car size={18} />
                <span>{lang === 'ar' ? 'تأمين المركبات' : 'Motor Insurance'}</span>
              </a>
              <a 
                href="#health" 
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }}
                className="text-base text-slate-800 font-extrabold hover:text-blue-500 flex items-center gap-3"
              >
                <Heart size={18} />
                <span>{lang === 'ar' ? 'التأمين الطبي' : 'Medical Insurance'}</span>
              </a>
              <a 
                href="#contact" 
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }}
                className="text-base text-slate-800 font-extrabold hover:text-blue-500 flex items-center gap-3"
              >
                <Phone size={18} />
                <span>{lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}</span>
              </a>
            </nav>

            <div className="mt-auto border-t border-slate-100 pt-6">
              <h4 className="text-xs font-bold text-slate-900 mb-4">{lang === 'ar' ? 'تواصل مع العناية بالعملاء' : 'Customer Care support'}</h4>
              <div className="flex flex-col gap-3 text-sm text-slate-600">
                <span className="flex items-center gap-3">
                  <Phone size={14} />
                  <span>800 124 8888</span>
                </span>
                <span className="flex items-center gap-3">
                  <Mail size={14} />
                  <span>care@tameeni.com</span>
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* B. Tameeni Plus Offers Drawer */}
      {isPlusDrawerOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setIsPlusDrawerOpen(false)} />
          <div className={`side-drawer ${isRTL ? 'rtl' : 'ltr'}`}>
            <div className="drawer-header" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <div className="flex items-center gap-2">
                <span className="bg-[#FF7A00] text-white text-[10px] font-extrabold px-2 py-0.5 rounded">Plus</span>
                <h3 className="text-base font-extrabold text-slate-900">عروض تأميني بلس الحصرية</h3>
              </div>
              <button 
                onClick={() => setIsPlusDrawerOpen(false)} 
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X size={22} className="text-slate-600" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              انسخ كود الخصم الحصري واستمتع بتوفير إضافي عند الدفع لدى شركائنا المعتمدين لخدمات السيارات المميزة.
            </p>

            <div className="flex flex-col gap-4">
              {plusOffers.map((offer, index) => (
                <div 
                  key={index}
                  className="border border-orange-100 bg-orange-50/50 rounded-xl p-4 flex flex-col gap-3 text-right"
                >
                  <strong className="text-sm font-bold text-slate-800 block">{offer.partner}</strong>
                  <p className="text-xs text-slate-600">{offer.desc}</p>
                  
                  <div className="flex justify-between items-center border-t border-orange-100 pt-3">
                    <span className="font-mono text-sm font-extrabold bg-red-100 text-red-500 px-2 py-1 rounded">
                      {offer.code}
                    </span>
                    <button 
                      className="btn" 
                      onClick={() => handleCopyCode(offer.code)}
                      style={{ 
                        padding: '4px 12px', 
                        fontSize: '0.75rem', 
                        backgroundColor: copiedCode === offer.code ? 'var(--success)' : 'var(--primary-500)', 
                        color: 'white',
                        borderRadius: '6px'
                      }}
                    >
                      {copiedCode === offer.code ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedCode === offer.code ? 'تم النسخ' : 'نسخ الكود'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 5. BOTTOM OFFICIAL FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-10 text-center">
        <div className="max-w-[80rem] mx-auto px-4 flex flex-col items-center gap-4">
          <Logo />
          
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>{t('regulated')}</span>
            <strong className="text-slate-900 flex items-center gap-1 font-bold">
              <ShieldCheck size={14} className="text-emerald-500" />
              {t('insuranceAuthority')}
            </strong>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl">
            {t('copyright')}
          </p>
        </div>
      </footer>

      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => { setLoggedInUser(user); setIsLoginModalOpen(false); }}
        lang={lang}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
