import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [savedCredentials, setSavedCredentials] = useState(null);

  // Load user from localStorage if exists
  useEffect(() => {
    const cached = localStorage.getItem('sales_portal_user');
    if (cached) {
      setUser(JSON.parse(cached));
    }
  }, []);

  const loginWithPassword = async (username, password) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Simple mock check
    if (username.trim().toLowerCase() === 'agent' || username.trim().toLowerCase() === 'admin' || username.trim().includes('@')) {
      const mockUser = {
        username: username,
        role: 'agent',
        name: 'Faisal Al-Otaibi',
        agentId: 'AGT-99824',
        branch: 'Riyadh Main Branch',
        email: username.includes('@') ? username : 'f.otaibi@alrajhitakaful.com',
      };
      setUser(mockUser);
      localStorage.setItem('sales_portal_user', JSON.stringify(mockUser));
      setLoading(false);
      return { success: true };
    }

    setLoading(false);
    return { success: false, error: 'errCredentials' };
  };

  const sendOTP = async (nationalId, mobile) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Generate a random 4-digit code and save credentials
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setOtpCode(code);
    setSavedCredentials({ nationalId, mobile });
    setOtpSent(true);
    setLoading(false);

    // Show simulated OTP in console and alert for testing convenience
    console.log(`[Sales Portal SMS Gateway] Verification Code for ${mobile}: ${code}`);
    alert(`[Simulated SMS Gateway / بوابة الرسائل النصية المحاكاة]\n\nYour OTP Code is: ${code}`);

    return { success: true, code };
  };

  const verifyOTP = async (code) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (code === otpCode || code === '1234') { // Fallback 1234 for testing convenience
      const mockUser = {
        username: savedCredentials?.nationalId || '1098765432',
        role: 'agent',
        name: 'Faisal Al-Otaibi',
        agentId: 'AGT-99824',
        branch: 'Riyadh Main Branch',
        email: 'f.otaibi@alrajhitakaful.com',
      };
      setUser(mockUser);
      localStorage.setItem('sales_portal_user', JSON.stringify(mockUser));
      setOtpSent(false);
      setLoading(false);
      return { success: true };
    }

    setLoading(false);
    return { success: false, error: 'errOTP' };
  };

  const logout = () => {
    setUser(null);
    setOtpSent(false);
    setSavedCredentials(null);
    localStorage.removeItem('sales_portal_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        otpSent,
        otpCode,
        sendOTP,
        verifyOTP,
        loginWithPassword,
        logout,
        setOtpSent
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
