"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import Toast from "./toast";

interface ToastContextType {
  showToast: (
    message: string,
    type: "success" | "error" | "warning" | "info",
    duration?: number
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      message: string;
      type: "success" | "error" | "warning" | "info";
      duration: number;
    }>
  >([]);

  const showToast = (
    message: string,
    type: "success" | "error" | "warning" | "info",
    duration = 4000
  ) => {
    const id = Date.now().toString();
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Render all toasts */}
      <div className="fixed bottom-4 left-4 z-50 space-y-2">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              transform: `translateY(-${index * 80}px)`,
              zIndex: 1000 + index,
            }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
              isVisible={true}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
