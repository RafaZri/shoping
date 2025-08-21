'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Only set user to null if we don't already have a user
        // This prevents overriding a valid user state during redirects
        if (!user) {
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Only set user to null if we don't already have a user
      if (!user) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Signin network error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const signUp = async (firstName, lastName, email, password) => {
    try {
      const response = await fetch('/api/auth/signup-dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const signOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });
      
      if (response.ok) {
        setUser(null);
        setLoading(false);
      } else {
        console.error('Signout failed:', response.status);
      }
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  const refreshAuth = async () => {
    await checkAuthStatus();
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    checkAuthStatus,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 