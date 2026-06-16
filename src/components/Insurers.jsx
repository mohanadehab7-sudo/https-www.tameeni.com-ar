import React from 'react';

// Tawuniya Logo (Official PNG)
export const TawuniyaLogo = ({ size = 48 }) => (
  <img 
    src="https://www.tameeni.com/images/ic-logos/full/19.png" 
    alt="Tawuniya" 
    style={{ width: size, height: 'auto', maxHeight: size, objectFit: 'contain', display: 'inline-block' }} 
  />
);

// Al Rajhi Takaful Logo (Official PNG)
export const AlRajhiLogo = ({ size = 48 }) => (
  <img 
    src="https://www.tameeni.com/images/ic-logos/full/31.png" 
    alt="Al Rajhi Takaful" 
    style={{ width: size, height: 'auto', maxHeight: size, objectFit: 'contain', display: 'inline-block' }} 
  />
);

// Malath Logo (Official PNG)
export const MalathLogo = ({ size = 48 }) => (
  <img 
    src="https://www.tameeni.com/images/ic-logos/full/3.png" 
    alt="Malath" 
    style={{ width: size, height: 'auto', maxHeight: size, objectFit: 'contain', display: 'inline-block' }} 
  />
);

// Medgulf Logo (Official PNG)
export const MedgulfLogo = ({ size = 48 }) => (
  <img 
    src="https://www.tameeni.com/images/ic-logos/full/15.png" 
    alt="Medgulf" 
    style={{ width: size, height: 'auto', maxHeight: size, objectFit: 'contain', display: 'inline-block' }} 
  />
);

// GIG Logo (Official PNG)
export const GIGLogo = ({ size = 48 }) => (
  <img 
    src="https://www.tameeni.com/images/ic-logos/full/35.png" 
    alt="GIG Saudi" 
    style={{ width: size, height: 'auto', maxHeight: size, objectFit: 'contain', display: 'inline-block' }} 
  />
);

// Walaa Logo (Official PNG)
export const WalaaLogo = ({ size = 48 }) => (
  <img 
    src="https://www.tameeni.com/images/ic-logos/full/5.png" 
    alt="Walaa" 
    style={{ width: size, height: 'auto', maxHeight: size, objectFit: 'contain', display: 'inline-block' }} 
  />
);

// Liva Logo (Official PNG)
export const LivaLogo = ({ size = 48 }) => (
  <img 
    src="https://www.tameeni.com/images/ic-logos/full/36.png" 
    alt="Liva" 
    style={{ width: size, height: 'auto', maxHeight: size, objectFit: 'contain', display: 'inline-block' }} 
  />
);

// ACIG Logo (Official PNG)
export const ACIGLogo = ({ size = 48 }) => (
  <img 
    src="https://www.tameeni.com/images/ic-logos/full/7.png" 
    alt="ACIG" 
    style={{ width: size, height: 'auto', maxHeight: size, objectFit: 'contain', display: 'inline-block' }} 
  />
);

// Salama Logo (Official PNG)
export const SalamaLogo = ({ size = 48 }) => (
  <img 
    src="https://www.tameeni.com/images/ic-logos/full/9.png" 
    alt="Salama" 
    style={{ width: size, height: 'auto', maxHeight: size, objectFit: 'contain', display: 'inline-block' }} 
  />
);

// Arabian Shield Logo (Official PNG)
export const ArabianShieldLogo = ({ size = 48 }) => (
  <img 
    src="https://www.tameeni.com/images/ic-logos/full/6.png" 
    alt="Arabian Shield" 
    style={{ width: size, height: 'auto', maxHeight: size, objectFit: 'contain', display: 'inline-block' }} 
  />
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
