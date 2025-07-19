import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  showAuthOverlay: boolean;
  openAuthOverlay: () => void;
  closeAuthOverlay: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);

  const openAuthOverlay = () => setShowAuthOverlay(true);
  const closeAuthOverlay = () => setShowAuthOverlay(false);

  return (
    <AuthContext.Provider value={{ showAuthOverlay, openAuthOverlay, closeAuthOverlay }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthOverlay() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthOverlay must be used within an AuthProvider');
  }
  return context;
}
