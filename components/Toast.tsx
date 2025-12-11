import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: number) => void;
}

const ToastItem: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000); // Auto close after 4 seconds

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <AlertCircle size={20} className="text-red-500" />,
    info: <Info size={20} className="text-blue-500" />
  };

  const borders = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    info: 'border-l-blue-500'
  };

  return (
    <div className={`
      flex items-start gap-3 p-4 bg-white rounded-lg shadow-lg border-l-4 border-gray-100 
      ${borders[toast.type]} min-w-[300px] animate-in slide-in-from-right duration-300
    `}>
      <div className="flex-shrink-0 mt-0.5">
        {icons[toast.type]}
      </div>
      <div className="flex-1 text-sm font-medium text-gray-800 break-words">
        {toast.message}
      </div>
      <button 
        onClick={() => onClose(toast.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
};