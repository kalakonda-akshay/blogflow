import React, { createContext, useContext, useState } from 'react';
import { authAPI } from '../utils/api';
import { errMsg } from '../utils/helpers';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => JSON.parse(localStorage.getItem('bf_user')  || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('bf_token') || null);

  const persist = (u, t) => {
    setUser(u); setToken(t);
    localStorage.setItem('bf_user',  JSON.stringify(u));
    localStorage.setItem('bf_token', t);
  };

  const login = async (creds) => {
    try { const { data } = await authAPI.login(creds); persist(data.user, data.token); return { success: true }; }
    catch (e) { return { error: errMsg(e) }; }
  };

  const register = async (creds) => {
    try { const { data } = await authAPI.register(creds); persist(data.user, data.token); return { success: true }; }
    catch (e) { return { error: errMsg(e) }; }
  };

  const logout = () => {
    setUser(null); setToken(null);
    localStorage.removeItem('bf_user'); localStorage.removeItem('bf_token');
  };

  const updateUser = (u) => {
    const merged = { ...user, ...u };
    setUser(merged); localStorage.setItem('bf_user', JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
