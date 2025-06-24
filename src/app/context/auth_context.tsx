"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../../lib/api";
import { set } from "react-hook-form";

interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  role: string;
}

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setLoading(true);

      const res = await authService.me();

      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setIsLoggedIn(false);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ) => {
    setLoading(true);
    setUser(null);
    setIsLoggedIn(false);

    try {
      console.log("Tentative de connexion avec:", {
        email,
        password,
        rememberMe,
      });
      const response = await authService.login(email, password, rememberMe);

      console.log("Réponse de connexion:", response);
      if (response.success && response.data.user) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        return response;
      }
      console.error("Erreur de connexion:", response);
      throw new Error("Réponse de connexion invalide");
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      await authService.logout();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, loading, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
