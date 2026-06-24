import { useEffect, useState, useCallback } from "react";
import { apiFetch, getStoredToken, setStoredToken, clearStoredToken } from "./api";
import type { Role } from "./mock-data";

const ROLE_KEY = "siat_role";

export function getStoredRole(): Role | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(ROLE_KEY);
  if (v === "student" || v === "lecturer" || v === "admin" || v === "staff") return v;
  return null;
}

export function setStoredRole(role: Role) {
  window.localStorage.setItem(ROLE_KEY, role);
}

export function clearStoredRole() {
  window.localStorage.removeItem(ROLE_KEY);
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: Role;
  nim?: string;
  nidn?: string;
  name: string;
  program: string;
  thumbnail?: string;
}

export function useAuth() {
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function initAuth() {
      const token = getStoredToken();
      if (token) {
        try {
          const res = await apiFetch<{ user: UserProfile }>("/api/auth/me");
          setUser(res.user);
          setRole(res.user.role);
          setStoredRole(res.user.role);
        } catch (e) {
          console.error("Failed to fetch current user:", e);
          clearStoredToken();
          clearStoredRole();
          setRole(null);
          setUser(null);
        }
      } else {
        setRole(null);
        setUser(null);
      }
      setReady(true);
    }
    
    initAuth();
  }, []);

  const login = useCallback(async (usernameInput: string, passwordInput: string) => {
    try {
      const res = await apiFetch<{ token: string; user: UserProfile }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });
      
      setStoredToken(res.token);
      setStoredRole(res.user.role);
      setUser(res.user);
      setRole(res.user.role);
      return res.user;
    } catch (err: any) {
      throw new Error(err.message || "Username atau password salah");
    }
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    clearStoredRole();
    setRole(null);
    setUser(null);
  }, []);

  return { role, user, ready, login, logout };
}
