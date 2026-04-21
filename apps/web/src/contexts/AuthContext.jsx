import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { clearStoredToken, getStoredToken, storeToken } from "../lib/auth";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await api.auth.me(token);
        if (!ignore) {
          setUser(data.user);
        }
      } catch {
        clearStoredToken();
        if (!ignore) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, [token]);

  async function login(credentials) {
    const data = await api.auth.login(credentials);
    storeToken(data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const data = await api.auth.register(payload);
    storeToken(data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }

  function updateUser(nextUser) {
    setUser(nextUser);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
