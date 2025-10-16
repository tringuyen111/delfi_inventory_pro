import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, type, message }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 4000); // Auto-dismiss after 4 seconds
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const contextValue = {
    success: (message: string) => showToast('success', message),
    error: (message: string) => showToast('error', message),
    info: (message: string) => showToast('info', message),
    warning: (message: string) => showToast('warning', message),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};


interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <>
      <div className="fixed top-5 right-5 z-[100] space-y-3 w-full max-w-xs">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} onDismiss={onDismiss} />
        ))}
      </div>
      <style>{`
        @keyframes slide-in-from-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in-from-right 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

interface ToastItemProps extends Toast {
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ id, type, message, onDismiss }) => {
    const theme = {
      success: {
        bg: 'bg-green-50 dark:bg-green-900/30', border: 'border-green-500', text: 'text-green-800 dark:text-green-200',
        icon: <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      },
      error: {
        bg: 'bg-red-50 dark:bg-red-900/30', border: 'border-red-500', text: 'text-red-800 dark:text-red-200',
        icon: <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      },
      warning: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/30', border: 'border-yellow-500', text: 'text-yellow-800 dark:text-yellow-200',
        icon: <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      },
      info: {
        bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-500', text: 'text-blue-800 dark:text-blue-200',
        icon: <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      }
    };
    
    const currentTheme = theme[type];

    return (
        <div className={`w-full ${currentTheme.bg} ${currentTheme.text} border-l-4 ${currentTheme.border} rounded-r-lg shadow-lg p-4 animate-slide-in`} role="alert">
            <div className="flex items-start">
                <div className="flex-shrink-0"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">{currentTheme.icon}</svg></div>
                <div className="ml-3 flex-1 pt-0.5 text-sm font-medium">{message}</div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button onClick={() => onDismiss(id)} className="inline-flex rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        <span className="sr-only">Close</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
