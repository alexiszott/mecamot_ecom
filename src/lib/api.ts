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

  me: async () => {
    const response = await api.get("auth/me");
    return response.data;
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
};

export const sessionService = {
  createSession: async (userId: string) => {
    const response = await api.post("session/create", {
      userId: userId,
    });
    return response.data;
  },
};

export const statsService = {
  productsStats: async () => {
    const response = await api.get("stats/products-stats");
    return response.data;
  },
};

export const categoriesService = {
  fetchCategories: async () => {
    const response = await api.get("categories/");
    return response.data;
  },
};

export const productService = {
  fetchProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    stockFilter?: string;
  }) => {
    const response = await api.get("products/", {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        search: params?.search || "",
        category: params?.category || "",
        status: params?.status || "",
        stockFilter: params?.stockFilter || "",
      },
    });
    return response.data;
  },

  fetchProduct: async (id: string) => {
    const response = await api.get(`products/${id}`);
    return response.data;
  },

  createProduct: async (productData: any) => {
    const response = await api.post("products/", productData);
    return response.data;
  },

  updateProduct: async (id: string, productData: any) => {
    const response = await api.put(`products/${id}`, productData);
    return response.data;
  },

  archiveProducts: async (ids: string[]) => {
    console.log("Archiving products with IDs:", ids);
    const response = await api.patch("products/archive", { ids });
    return response.data;
  },

  archiveProduct: async (id: string) => {
    const response = await api.patch(`products/${id}/archive`);
    return response.data;
  },

  restoreProduct: async (id: string) => {
    const response = await api.patch(`products/${id}/restore`);
    return response.data;
  },
};
