"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { cartService } from "../../lib/api";
import { CartItem } from "../../type/cart_item";
import { Cart } from "../../type/cart_type";
import { useAuth } from "./auth_context";
import { useToast } from "../context/toast_context";

type CartContextType = {
  id: string;
  items: CartItem[];
  addItemToCart: (productId: string, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType>({
  id: "",
  items: [],
  addItemToCart: async () => {},
  fetchCart: async () => {},
});

export const CartProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Cart>({ id: "", items: [] });
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const fetchCart = async () => {
    try {
      setLoading(true);

      const res = await cartService.fetchCartItems();

      const cart = {
        id: res.data.id,
        items: res.data.items || [],
      };

      setCart(cart);
      console.log("Cart fetched successfully:", cart);
    } catch (error: any) {
      if (error.response?.status === 401) {
      }
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      const res = await cartService.addItemToCart(productId, quantity);

      console.log("Add item to cart response:", res);

      if (res.data.success) {
        showToast("Erreur lors de l'ajout du produit au panier", "error");
        return;
      } else {
        showToast("Produit ajouté au panier avec succès", "success");
      }
    } catch (error) {
      showToast("Erreur lors de l'ajout du produit au panier", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setCart({ id: "", items: [] });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        id: cart.id,
        items: cart.items,
        addItemToCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
