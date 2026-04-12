import { createContext, useEffect, useMemo, useState } from "react";
import { getMe, loginUser, registerUser } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("skillbridge_auth");
    return stored ? JSON.parse(stored) : { user: null, token: null };
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth?.token) {
      localStorage.setItem("skillbridge_auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("skillbridge_auth");
    }
  }, [auth]);

  const login = async (formData) => {
    setLoading(true);
    try {
      const res = await loginUser(formData);

      const newAuth = {
        user: res.user,
        token: res.token,
      };

      setAuth(newAuth);
      localStorage.setItem("skillbridge_auth", JSON.stringify(newAuth));

      return {
        success: true,
        user: res.user,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await registerUser(formData);

      const newAuth = {
        user: res.user,
        token: res.token,
      };

      setAuth(newAuth);
      localStorage.setItem("skillbridge_auth", JSON.stringify(newAuth));

      return {
        success: true,
        user: res.user,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("skillbridge_auth");
  };

  const refreshUser = async () => {
    if (!auth?.token) return;

    try {
      const user = await getMe();

      setAuth((prev) => ({
        ...prev,
        user: user || prev.user,
      }));
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    if (auth?.token) {
      refreshUser();
    }
  }, []);

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isAuthenticated: !!auth.token,
      loading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [auth, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}