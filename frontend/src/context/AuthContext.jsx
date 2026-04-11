import { createContext, useContext, useState, useEffect } from "react";
import { authLogin, authRegister } from "../services/api";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const t = localStorage.getItem("token");
      const u = localStorage.getItem("user");
      if (t && u && u !== "undefined" && u !== "null") {
        const parsed = JSON.parse(u);
        setToken(t); setUser(parsed);
        axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally { setLoading(false); }
  }, []);

  const persist = (t, u) => {
    setToken(t); setUser(u);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
  };

  const login = async (email, password) => {
    const res = await authLogin(email, password);
    persist(res.data.token, res.data.data);
    return res.data.data;
  };

  const register = async (name, email, password, role = "student") => {
    const res = await authRegister(name, email, password, role);
    persist(res.data.token, res.data.data);
    return res.data.data;
  };

  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const role     = user?.role?.toLowerCase();
  const isAdmin  = role === "admin" || role === "university";
  const isStudent = role === "student";

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isStudent }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
