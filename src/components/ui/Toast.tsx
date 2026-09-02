"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

interface ToastProps {
  open: boolean;
  message: string;
  variant?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export function Toast({ open, message, variant = "success", onClose, duration = 6000 }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open || !message) return null;

  const Icon = variant === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-fade-in-up fixed inset-x-4 bottom-4 z-50 flex items-start gap-3 rounded-xl border border-brand-ink/10 bg-white px-4 py-3.5 shadow-lg sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2"
    >
      <Icon
        className={`mt-0.5 h-5 w-5 shrink-0 ${variant === "success" ? "text-brand" : "text-red-600"}`}
        aria-hidden="true"
      />
      <p className="flex-1 text-sm font-medium text-brand-ink">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-brand-muted transition-colors hover:bg-brand-light hover:text-brand-deep"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
