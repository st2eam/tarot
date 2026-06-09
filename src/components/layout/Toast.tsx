"use client";

import { create } from "zustand";

interface ToastState {
  message: string | null;
  show: (msg: string) => void;
  dismiss: () => void;
}

export const useToast = create<ToastState>((set) => ({
  message: null,
  show: (msg) => set({ message: msg }),
  dismiss: () => set({ message: null }),
}));

export function ToastContainer() {
  const message = useToast((s) => s.message);
  const dismiss = useToast((s) => s.dismiss);

  if (!message) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-2">
      <div
        className="glass-card rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-lg max-w-sm"
        style={{ border: "1px solid var(--theme-glass-border)" }}
      >
        <span className="text-sm" style={{ color: "var(--theme-text)" }}>
          {message}
        </span>
        <button
          onClick={dismiss}
          className="shrink-0 text-xs px-2 py-1 rounded-lg transition-colors hover:brightness-110"
          style={{
            background: "var(--theme-accent)",
            color: "#fff",
          }}
        >
          知道了
        </button>
      </div>
    </div>
  );
}
