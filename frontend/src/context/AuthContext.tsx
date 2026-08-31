import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import api from '../api/client';
import { User, Role } from '../types';

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role: Role) => Promise<User>;
  logout: () => void;
  setUser: (u: User) => void;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from token on load.
  useEffect(() => {
    const token = localStorage.getItem('sb_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('sb_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('sb_token', res.data.token);
    setUser(res.data.user);
    return res.data.user as User;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, role: Role) => {
      const res = await api.post('/auth/register', { name, email, password, role });
      localStorage.setItem('sb_token', res.data.token);
      setUser(res.data.user);
      return res.data.user as User;
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem('sb_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
