export default function NotificationBell({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Notifikasi"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 transition"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="text-neutral-700"
      >
        <path
          d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .53-.21 1.04-.59 1.41L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="absolute right-2 top-2 inline-block h-2 w-2 rounded-full bg-orange-400" />
    </button>
  );
}
