export default function Modal({
  open,
  onClose,
  children,
  closeOnBackdrop = true,
  className = "",
}) {
  if (!open) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop) onClose?.();
  };

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-xl rounded-2xl bg-white shadow-2xl ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
