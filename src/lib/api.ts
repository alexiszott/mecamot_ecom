import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    phone: string,
    confirmPassword: string
  ) => {
    const response = await api.post("auth/signup", {
      email,
      password,
      firstname,
      lastname,
      phone,
      confirmPassword,
    });
    return response.data;
  },

  login: async (email: string, password: string, rememberMe: boolean) => {
    const response = await api.post("auth/signin", {
      email,
      password,
      rememberMe,
    });
    return response.data;
  },

  checkAuth: async () => {
    const response = await api.get("auth/check");
    if (response.status === 200) {
      return {
        connected: true,
        user: response.data.user,
      };
    } else {
      return {
        connected: false,
        user: null,
      };
    }
  },

  verify: async (token: string) => {
    const response = await api.get("auth/verify", {
      params: { token },
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post("auth/logout");
    return response.data;
  },

  me: async () => {
    const response = await api.get("auth/me");
    return response.data;
  },
};

export const sessionService = {
  createSession: async (userId: string) => {
    const response = await api.post("session/create", {
      userId: userId,
    });
    return response.data;
  },
};
