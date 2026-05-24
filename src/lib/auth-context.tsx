import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, api, getToken, saveToken, removeToken } from "./api";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: (onDone?: () => void) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const storedToken = getToken();
    if (storedToken) {
      setToken(storedToken);
      api
        .getMe()
        .then((userData) => {
          if (isMounted) setUser(userData);
        })
        .catch(() => {
          if (isMounted) {
            removeToken();
            setToken(null);
            setUser(null);
          }
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
    return () => { isMounted = false };
  }, []);

  const login = (newToken: string, userData: User) => {
    saveToken(newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = (onDone?: () => void) => {
    removeToken();
    setToken(null);
    setUser(null);
    onDone?.();
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const userData = await api.getMe();
        setUser(userData);
      } catch (e) {
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}