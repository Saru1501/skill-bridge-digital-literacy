import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authLogin, authRegister } from "../services/api";
import axios from "axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth,    setAuth]    = useState({ user: null, token: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Support both storage formats
      const stored = localStorage.getItem("skillbridge_auth");
      const token  = localStorage.getItem("token");
      const user   = localStorage.getItem("user");

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.token && parsed?.user) {
          setAuth(parsed);
          axios.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
        }
      } else if (token && user && user !== "undefined" && user !== "null") {
        const parsedUser = JSON.parse(user);
        const next = { token, user: parsedUser };
        setAuth(next);
        localStorage.setItem("skillbridge_auth", JSON.stringify(next));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("skillbridge_auth");
    } finally { setLoading(false); }
  }, []);

  const persist = (token, user) => {
    const next = { token, user };
    setAuth(next);
    localStorage.setItem("token",           token);
    localStorage.setItem("user",            JSON.stringify(user));
    localStorage.setItem("skillbridge_auth", JSON.stringify(next));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // login(email, password) → returns user object directly
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res   = await authLogin(email, password);
      const user  = res?.data?.data;
      const token = res?.data?.token;
      persist(token, user);
      return user;
    } finally { setLoading(false); }
  };

  // register(name, email, password, role) → returns user object directly
  const register = async (name, email, password, role = "student") => {
    setLoading(true);
    try {
      const res   = await authRegister(name, email, password, role);
      const user  = res?.data?.data;
      const token = res?.data?.token;
      persist(token, user);
      return user;
    } finally { setLoading(false); }
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("skillbridge_auth");
    delete axios.defaults.headers.common["Authorization"];
  };

  const role      = auth.user?.role?.toLowerCase();
  const isAdmin   = role === "admin" || role === "university";
  const isStudent = role === "student";
  const isNgo     = role === "ngo";

  const value = useMemo(() => ({
    user:            auth.user,
    token:           auth.token,
    isAuthenticated: !!auth.token,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isStudent,
    isNgo,
  }), [auth, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
