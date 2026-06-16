import React from 'react';

// Tawuniya SVG Logo (Real Leaf/Flower pattern)
export const TawuniyaLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#006644" />
    <circle cx="50" cy="50" r="8" fill="none" stroke="white" strokeWidth="3" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <path
        key={angle}
        d="M50 24C52 28 52 34 50 36C48 34 48 28 50 24Z"
        fill="white"
        transform={`rotate(${angle} 50 50)`}
      />
    ))}
  </svg>
);

// Al Rajhi Takaful SVG Logo (Real Blue & Gold Palm tree + swords)
export const AlRajhiLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="20" fill="#002D72" />
    {/* Gold Palm Tree */}
    <path d="M50 70V42" stroke="#D4AF37" strokeWidth="5" strokeLinecap="round" />
    <path d="M50 42C45 35 35 35 30 40" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 42C55 35 65 35 70 40" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 48C42 42 35 45 32 52" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 48C58 42 65 45 68 52" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 55C44 50 38 55 36 62" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 55C56 50 62 55 64 62" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />
    {/* Crossed Swords */}
    <path d="M35 78L65 68" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />
    <path d="M65 78L35 68" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />
    <path d="M33 75C31 77 31 80 33 81" stroke="#D4AF37" strokeWidth="3" />
    <path d="M67 75C69 77 69 80 67 81" stroke="#D4AF37" strokeWidth="3" />
  </svg>
);

// Malath SVG Logo (Real Grey Shield with three curves)
export const MalathLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="white" stroke="#E2E8F0" strokeWidth="1" />
    <path d="M32 35C45 30 55 30 68 35C68 55 58 72 50 78C42 72 32 55 32 35Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="3.5" />
    {/* Three vertical curved lines inside */}
    <path d="M43 44C45 50 45 58 43 64" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M50 41C52 49 52 60 50 66" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M57 44C59 50 59 58 57 64" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

// Medgulf SVG Logo (Real Dark Blue Square with white stylized X and center red dot)
export const MedgulfLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="20" fill="#0F1E54" />
    {/* Stylized X shape */}
    <path d="M25 25C40 40 40 60 25 75" stroke="white" strokeWidth="9" strokeLinecap="round" />
    <path d="M75 25C60 40 60 60 75 75" stroke="white" strokeWidth="9" strokeLinecap="round" />
    <path d="M30 25C45 40 55 40 70 25" stroke="white" strokeWidth="9" strokeLinecap="round" />
    <path d="M30 75C45 60 55 60 70 75" stroke="white" strokeWidth="9" strokeLinecap="round" />
    {/* Red dot in the center */}
    <circle cx="50" cy="50" r="9" fill="#E11D48" />
  </svg>
);

// GIG SVG Logo (Red Circle with GIG text)
export const GIGLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#DC2626" />
    <text x="50" y="60" fill="white" fontSize="28" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">GIG</text>
  </svg>
);

// Walaa SVG Logo (Real intersecting double rings)
export const WalaaLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="white" stroke="#E2E8F0" strokeWidth="1" />
    {/* Two intersecting rings */}
    <circle cx="42" cy="50" r="16" stroke="#475569" strokeWidth="5" fill="none" />
    <circle cx="58" cy="50" r="16" stroke="#94A3B8" strokeWidth="5" fill="none" />
  </svg>
);

// Liva SVG Logo (Purple Circle with stylized L/triangle)
export const LivaLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#7C3AED" />
    <path d="M35 35H65L50 70L35 35Z" fill="white" />
  </svg>
);

// ACIG SVG Logo (Real Crescent/Circle logo with ACIG text)
export const ACIGLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="white" stroke="#E2E8F0" strokeWidth="1" />
    <circle cx="50" cy="45" r="20" stroke="#475569" strokeWidth="4" fill="none" />
    <path d="M40 32C44 40 44 50 40 58" stroke="#94A3B8" strokeWidth="3.5" fill="none" />
    <path d="M60 32C56 40 56 50 60 58" stroke="#94A3B8" strokeWidth="3.5" fill="none" />
    <text x="50" y="82" fill="#334155" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">ACIG</text>
  </svg>
);

// Salama SVG Logo (Real spiral vortex shell)
export const SalamaLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="white" stroke="#E2E8F0" strokeWidth="1" />
    <g strokeWidth="4.5" strokeLinecap="round" fill="none">
      {/* 4 layered spiral lines forming vortex */}
      <path d="M50 18C65 18 78 30 78 50C78 68 60 78 48 78" stroke="#334155" />
      <path d="M38 28C52 22 68 28 68 44C68 58 54 68 42 66" stroke="#475569" />
      <path d="M30 42C30 32 44 32 54 38C60 42 58 52 48 54" stroke="#64748B" stroke />
      <path d="M38 52C38 46 44 44 48 48" stroke="#94A3B8" />
    </g>
  </svg>
);

// Arabian Shield Logo (Real Dark Blue Shield with horizontal lines)
export const ArabianShieldLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="white" stroke="#E2E8F0" strokeWidth="1" />
    <path d="M35 32C45 28 55 28 65 32C65 52 57 68 50 74C43 68 35 52 35 32Z" fill="#1E293B" stroke="#475569" strokeWidth="3.5" />
    <path d="M50 30V72" stroke="white" strokeWidth="4" />
    <path d="M38 45H62" stroke="white" strokeWidth="3" />
    <path d="M40 55H60" stroke="white" strokeWidth="3" />
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
