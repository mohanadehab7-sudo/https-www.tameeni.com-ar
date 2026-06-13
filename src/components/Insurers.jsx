import React from 'react';

// Tawuniya SVG Logo
export const TawuniyaLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#006644" />
    <path d="M35 55C40 40 60 40 65 55M50 30V70" stroke="white" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

// Al Rajhi Takaful SVG Logo
export const AlRajhiLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="15" fill="#0F2C59" />
    <path d="M30 35H70M50 35V75M35 75H65" stroke="#D4AF37" strokeWidth="7" strokeLinecap="round" />
  </svg>
);

// Malath SVG Logo
export const MalathLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#E28743" />
    <path d="M30 40C30 30 70 30 70 40C70 65 50 75 50 75C50 75 30 65 30 40Z" fill="white" />
    <circle cx="50" cy="45" r="10" fill="#E28743" />
  </svg>
);

// Medgulf SVG Logo
export const MedgulfLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="15" fill="#1E3A8A" />
    <path d="M30 30C45 45 55 45 70 30M30 70C45 55 55 55 70 70" stroke="white" strokeWidth="8" strokeLinecap="round" />
    <circle cx="50" cy="50" r="8" fill="#EF4444" />
  </svg>
);

// GIG SVG Logo
export const GIGLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#DC2626" />
    <text x="50" y="60" fill="white" fontSize="28" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">GIG</text>
  </svg>
);

// Walaa SVG Logo
export const WalaaLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#059669" />
    <path d="M50 25C36 25 25 36 25 50C25 64 50 80 50 80C50 80 75 64 75 50C75 36 64 25 50 25ZM50 60C44 60 40 56 40 50C40 44 44 40 50 40C56 40 60 44 60 50C60 56 56 60 50 60Z" fill="white" />
  </svg>
);

// Liva SVG Logo
export const LivaLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#7C3AED" />
    <path d="M35 35H65L50 70L35 35Z" fill="white" />
  </svg>
);

// ACIG SVG Logo
export const ACIGLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="15" fill="#0D9488" />
    <path d="M30 65L50 35L70 65H30Z" fill="white" />
    <circle cx="50" cy="55" r="6" fill="#0D9488" />
  </svg>
);

// Salama SVG Logo
export const SalamaLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#2563EB" />
    <path d="M30 50L45 65L70 35" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Arabian Shield Logo
export const ArabianShieldLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#1E293B" />
    <path d="M50 25C65 25 70 30 70 45C70 60 55 70 50 75C45 70 30 60 30 45C30 30 35 25 50 25Z" stroke="#38BDF8" strokeWidth="6" fill="none" />
    <path d="M50 33V67" stroke="#38BDF8" strokeWidth="4" />
  </svg>
);

// SAMA Shield checkmark
export const SAMAShield = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 15C68 15 78 20 78 35C78 60 55 80 50 85C45 80 22 60 22 35C22 20 32 15 50 15Z" fill="#10B981" />
    <path d="M50 22C64 22 72 26 72 37C72 56 53 73 50 77C47 73 28 56 28 37C28 26 36 22 50 22Z" fill="white" />
    <path d="M42 48L48 54L58 40" stroke="#10B981" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Unified map function to fetch SVG logo by key
export const getInsurerLogo = (key, size = 48) => {
  switch (key) {
    case 'tawuniya':
      return <TawuniyaLogo size={size} />;
    case 'rajhi':
      return <AlRajhiLogo size={size} />;
    case 'malath':
      return <MalathLogo size={size} />;
    case 'medgulf':
      return <MedgulfLogo size={size} />;
    case 'gig':
      return <GIGLogo size={size} />;
    case 'walaa':
      return <WalaaLogo size={size} />;
    case 'liva':
      return <LivaLogo size={size} />;
    case 'acig':
      return <ACIGLogo size={size} />;
    case 'salama':
      return <SalamaLogo size={size} />;
    case 'shield':
    default:
      return <ArabianShieldLogo size={size} />;
  }
};
