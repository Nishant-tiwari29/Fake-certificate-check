import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const register = async (userData, role) => {
    // Validate role
    const validRoles = ['institute', 'student', 'verifier'];
    if (!validRoles.includes(role)) {
      throw new Error('Invalid role specified');
    }

    // In a real app, this would make an API call
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      role: role,
      created_at: new Date().toISOString(),
      verified: role === 'institute' ? false : true, // Institutes need admin approval
      profileComplete: false
    };
    
    // Store in localStorage as a simple database
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration (except for institutes that need verification)
    if (role !== 'institute' || newUser.verified) {
      login(newUser);
    }
    return newUser;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};