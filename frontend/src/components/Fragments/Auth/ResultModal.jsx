import Modal from "../../Elements/Common/Modal";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-12 w-12 text-green-600">
      <path
        fill="currentColor"
        d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm-1.2-6.2 6-6a1 1 0 1 0-1.4-1.4l-5.3 5.3-2.1-2.1a1 1 0 1 0-1.4 1.4l2.8 2.8a1 1 0 0 0 1.4 0Z"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-12 w-12 text-red-600">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 1-0.001 20.001A10 10 0 0 1 12 2Zm1 13v2h-2v-2h2Zm0-8v6h-2V7h2Z"
      />
    </svg>
  );
}

export default function ResultModal({
  open,
  onClose,
  title = "",
  description = "",
  variant = "success", // 'success' | 'error'
}) {
  const Icon = variant === "success" ? CheckIcon : ErrorIcon;
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6 sm:p-8">
        <div className="mb-4 flex items-center justify-center">
          <Icon />
        </div>
        <h3 className="text-center text-xl font-semibold text-neutral-900">
          {title}
        </h3>
        {description ? (
          <p className="mt-2 text-center text-neutral-600">{description}</p>
        ) : null}
        <div className="mt-6 flex items-center justify-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-neutral-900 px-4 py-2.5 text-white hover:opacity-90"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}
