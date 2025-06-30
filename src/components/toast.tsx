"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

const Toast = ({
  message,
  type,
  duration = 4000,
  onClose,
  isVisible,
}: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = "transform transition-all duration-300 ease-in-out";
    const visibleStyles = isVisible
      ? "translate-x-0 opacity-100"
      : "-translate-x-full opacity-0";

    return `${baseStyles} ${visibleStyles}`;
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-100 border-green-500",
          text: "text-green-800",
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        };
      case "error":
        return {
          bg: "bg-red-100 border-red-500",
          text: "text-red-800",
          icon: <XCircle className="w-5 h-5 text-red-600" />,
        };
      case "warning":
        return {
          bg: "bg-orange-100 border-orange-500",
          text: "text-orange-800",
          icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
        };
      case "info":
        return {
          bg: "bg-blue-100 border-blue-500",
          text: "text-blue-800",
          icon: <Info className="w-5 h-5 text-blue-600" />,
        };
      default:
        return {
          bg: "bg-gray-100 border-gray-500",
          text: "text-gray-800",
          icon: <Info className="w-5 h-5 text-gray-600" />,
        };
    }
  };

  const styles = getTypeStyles();

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 max-w-sm w-full ${getToastStyles()}`}
    >
      <div
        className={`${styles.bg} border-l-4 rounded-lg shadow-lg p-4 flex items-start space-x-3 w-100`}
      >
        <div className="flex-shrink-0">{styles.icon}</div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${styles.text} hover:opacity-70 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
