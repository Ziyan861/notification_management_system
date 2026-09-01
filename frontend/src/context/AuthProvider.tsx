import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './auth-context';
import type { AuthContextValue } from './auth-context';
import type { User } from '../models/user';
import { authService } from '../services/authService';
import { tokenStorage } from '../services/tokenStorage';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy initialiser: reads storage during the first render, so a page
  // refresh never flashes the login screen before restoring the session.
  const [user, setUser] = useState<User | null>(() => tokenStorage.getUser());

  const login = useCallback(async (username: string, password: string) => {
    const { accessToken, user: profile } = await authService.login(
      username,
      password,
    );

    tokenStorage.setToken(accessToken);
    tokenStorage.setUser(profile);
    setUser(profile);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, login, logout }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}