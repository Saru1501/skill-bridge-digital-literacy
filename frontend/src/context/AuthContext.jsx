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
      user: res.data,   // ✅ IMPORTANT (data, not user)
      token: res.token,
    };

    setAuth(newAuth);
    localStorage.setItem("skillbridge_auth", JSON.stringify(newAuth));

    return {
      success: true,
      user: res.data,   // ✅ return correct user
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  } finally {
    setLoading(false);
  }
 };

  const register = async (formData) => {
  setLoading(true);
  try {
    const data = await registerUser(formData);

    const newAuth = {
      user: data.user,
      token: data.token,
    };

    setAuth(newAuth);
    localStorage.setItem("skillbridge_auth", JSON.stringify(newAuth));

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed",
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
      const data = await getMe();
      setAuth((prev) => ({
        ...prev,
        user: data.user,
      }));
    } catch (error) {
      logout();
    }
  };

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