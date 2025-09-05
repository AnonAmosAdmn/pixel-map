"use client"

import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
  className?: string;
}

const Toast = ({ message, type = 'info', duration = 3000, onClose, className }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  }[type];

  return (
    <div
      className={`w-full ${bgColor} text-white px-4 py-2 rounded-md shadow-lg transition-opacity opacity-100 ${className ?? ''}`}
    >
      {message}
    </div>
  );
};

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    // Clear all previous toasts and add only the new one
    setToasts([{ id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 inset-x-0 z-50 space-y-2 px-4">
      {toasts.map(toast => (
        <div key={toast.id} className="w-full max-w-2xl mx-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
            className="text-center"
          />
        </div>
      ))}
    </div>
  );

  return { addToast, ToastContainer };
};