"use client";
import { createContext, useContext, useState } from "react";
import Toast from "@component/Toast";

// Create a context for toast notifications
const ToastContext = createContext();

// Provider component that wraps your app and makes toast available to any child component
export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ visible: false, message: "" });

  const showToast = (message) => {
    setToast({ visible: true, message });
  };

  const hideToast = () => {
    setToast({ visible: false, message: "" });
  };

  // The value that will be given to the context
  const toastValue = {
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={toastValue}>
      {children}
      {toast.visible && (
        <div className="fixed bottom-5 left-5 inset-x-0 flex z-[9999]">
          <Toast message={toast.message} onClose={hideToast} />
        </div>
      )}
    </ToastContext.Provider>
  );
}

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
