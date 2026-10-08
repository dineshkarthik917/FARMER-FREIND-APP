import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm pointer-events-none transition-all animate-bounce">
      <div
        className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 backdrop-blur-md pointer-events-auto ${
          toast.type === 'success'
            ? 'bg-emerald-900/90 text-white border-emerald-700'
            : toast.type === 'warning'
            ? 'bg-amber-900/90 text-white border-amber-700'
            : 'bg-stone-900/90 text-white border-stone-700'
        }`}
      >
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
        {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />}
        <p className="text-sm font-medium leading-tight">{toast.message}</p>
      </div>
    </div>
  );
};
