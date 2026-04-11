import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authLogin, authRegister } from "../services/api";
import axios from "axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ user: null, token: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("skillbridge_auth");
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        if (parsed?.token && parsed?.user) {
          setAuth(parsed);
          axios.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
        }
      } else if (token && user && user !== "undefined" && user !== "null") {
        const parsedUser = JSON.parse(user);
        const parsed = { token, user: parsedUser };
        setAuth(parsed);
        localStorage.setItem("skillbridge_auth", JSON.stringify(parsed));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("skillbridge_auth");
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (token, user) => {
    const nextAuth = { token, user };
    setAuth(nextAuth);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("skillbridge_auth", JSON.stringify(nextAuth));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const login = async (emailOrForm, password) => {
    const isFormMode = typeof emailOrForm === "object" && emailOrForm !== null;
    const email = isFormMode ? emailOrForm.email : emailOrForm;

    setLoading(true);
    try {
      const res = await authLogin(email, password ?? emailOrForm?.password);
      const user = res?.data?.data;
      const token = res?.data?.token;
      persist(token, user);

      if (isFormMode) {
        return { success: true, user };
      }
      return user;
    } catch (error) {
      if (isFormMode) {
        return {
          success: false,
          message: error.response?.data?.message || "Login failed",
        };
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (nameOrForm, email, password, role = "student") => {
    const isFormMode = typeof nameOrForm === "object" && nameOrForm !== null;
    const name = isFormMode ? nameOrForm.name : nameOrForm;
    const regEmail = isFormMode ? nameOrForm.email : email;
    const regPassword = isFormMode ? nameOrForm.password : password;
    const regRole = isFormMode ? (nameOrForm.role || "student") : role;

    setLoading(true);
    try {
      const res = await authRegister(name, regEmail, regPassword, regRole);
      const user = res?.data?.data;
      const token = res?.data?.token;
      persist(token, user);

      if (isFormMode) {
        return { success: true, user };
      }
      return user;
    } catch (error) {
      if (isFormMode) {
        return {
          success: false,
          message: error.response?.data?.message || "Registration failed",
        };
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("skillbridge_auth");
    delete axios.defaults.headers.common["Authorization"];
  };

  const role = auth.user?.role?.toLowerCase();
  const isAdmin = role === "admin" || role === "university";
  const isStudent = role === "student";

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isAuthenticated: !!auth.token,
      loading,
      login,
      register,
      logout,
      isAdmin,
      isStudent,
    }),
    [auth, loading, isAdmin, isStudent]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
