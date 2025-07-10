"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../../lib/api";
import { User } from "../../type/user_type";
import { useToast } from "../context/toast_context";

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
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
  isAdmin: false,
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

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
      const response = await authService.login(email, password, rememberMe);

      if (response.success && response.data.user) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        return response;
      }
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
