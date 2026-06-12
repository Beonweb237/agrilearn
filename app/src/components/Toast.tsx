import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { useEffect } from "react";

export default function Toast() {
  const { toast, clearToast } = useStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(clearToast, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle size={18} className="text-earth-500" />,
    error: <AlertCircle size={18} className="text-red-500" />,
    info: <Info size={18} className="text-sky-500" />,
  };

  const bgMap = {
    success: "bg-earth-50 border-earth-200",
    error: "bg-red-50 border-red-200",
    info: "bg-sky-50 border-sky-200",
  };

  return (
    <div className="fixed top-20 left-0 right-0 z-[60] flex justify-center px-4 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg max-w-md w-full animate-in slide-in-from-top-2 fade-in duration-300 ${bgMap[toast.type]}`}
      >
        {iconMap[toast.type]}
        <p className="text-sm font-medium text-charcoal flex-1">{toast.message}</p>
        <button
          onClick={clearToast}
          className="p-1 hover:bg-black/5 rounded-full transition-colors"
        >
          <X size={14} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
