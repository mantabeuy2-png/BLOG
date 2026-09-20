import React from 'react';
import { useCms } from '../../context/CmsContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useCms();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-md shadow-lg border text-sm transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-neutral-900 text-white border-neutral-800'
              : toast.type === 'error'
              ? 'bg-red-900 text-white border-red-800'
              : 'bg-neutral-800 text-neutral-100 border-neutral-700'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}
          <div className="flex-1 font-sans-ui text-[13px] leading-relaxed">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};
