import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function ConfirmModal({ open, title = "Konfirmasi", message = "Apakah Anda yakin?", onConfirm, onCancel, confirmText = "Ya", cancelText = "Tidak" }) {
  useEffect(() => {
    if (open) {
      // Disable background scroll and compensate for scrollbar width to avoid layout shift
      const prevOverflow = document.body.style.overflow;
      const prevPaddingRight = document.body.style.paddingRight || "";
      const scrollbarWidth = typeof window !== "undefined" ? window.innerWidth - document.documentElement.clientWidth : 0;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.paddingRight = prevPaddingRight;
      };
    }
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === "Escape") onCancel && onCancel();
      if (e.key === "Enter") onConfirm && onConfirm();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={onCancel} aria-hidden="true" />

      {/* Modal box */}
      <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-md mx-4 sm:mx-0 rounded-lg bg-white p-4 sm:p-6 shadow-xl pointer-events-auto max-h-[80vh] overflow-auto">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        <p className="mt-2 text-sm text-neutral-600">{message}</p>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button type="button" onClick={onCancel} className="w-full sm:w-auto rounded-md px-4 py-2 bg-white border border-neutral-200 text-sm font-medium hover:bg-neutral-50">
            {cancelText}
          </button>
          <button type="button" onClick={onConfirm} className="w-full sm:w-auto rounded-md px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return modal;
  return createPortal(modal, document.body);
}
