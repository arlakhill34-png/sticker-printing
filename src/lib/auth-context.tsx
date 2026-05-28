import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, api, getToken, saveToken, removeToken } from "./api";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: (onDone?: () => void) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedToken = getToken();
    if (!storedToken) {
      return;
    }
    setToken(storedToken);
    api
      .getMe()
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => {
        removeToken();
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (newToken: string) => {
    saveToken(newToken);
    setToken(newToken);
    try {
      const fullUser = await api.getMe();
      console.log("LOGIN SUCCESS");
      console.log("FETCHED USER FROM /ME:", fullUser);
      console.log("STICKER SIZE:", {
        width: fullUser.stickerWidth,
        height: fullUser.stickerHeight,
      });
      setUser(fullUser);
    } catch (e) {
      console.error("Failed to fetch user after login:", e);
      removeToken();
      setToken(null);
      setUser(null);
      throw e;
    }
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
