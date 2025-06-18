import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (
    email: string,
    password: string,
    firstname: string,
    lastname: string
  ) => {
    const response = await api.post("/register", {
      email,
      password,
      firstname,
      lastname,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    return response.data;
  },
};
