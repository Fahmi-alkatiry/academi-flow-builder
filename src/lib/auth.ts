import { useEffect, useState, useCallback } from "react";
import type { Role } from "./mock-data";

const KEY = "siat_role";

export function getStoredRole(): Role | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(KEY);
  if (v === "student" || v === "lecturer" || v === "admin" || v === "staff") return v;
  return null;
}

export function setStoredRole(role: Role) {
  window.localStorage.setItem(KEY, role);
}

export function clearStoredRole() {
  window.localStorage.removeItem(KEY);
}

export function useAuth() {
  const [role, setRole] = useState<Role | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRole(getStoredRole());
    setReady(true);
    const onStorage = () => setRole(getStoredRole());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback((r: Role) => {
    setStoredRole(r);
    setRole(r);
  }, []);
  const logout = useCallback(() => {
    clearStoredRole();
    setRole(null);
  }, []);

  return { role, ready, login, logout };
}
