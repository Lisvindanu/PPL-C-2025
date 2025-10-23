export default function Icon({ name, size = "md", className = "", ...props }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const cls = `${sizes[size]} ${className}`.trim();

  const icons = {
    edit: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className={cls}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    camera: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className={cls}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    check: (
      <svg fill="currentColor" viewBox="0 0 20 20" className={cls}>
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    share: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className={cls}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
        />
      </svg>
    ),
    plus: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className={cls}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v12M6 12h12"
        />
      </svg>
    ),
    home: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className={cls}
      >
        <path
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10.5l9-7 9 7V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z"
        />
      </svg>
    ),
    box: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className={cls}
      >
        <path
          strokeWidth={2}
          strokeLinejoin="round"
          d="M12 3l9 4.5-9 4.5L3 7.5 12 3z"
        />
        <path
          strokeWidth={2}
          strokeLinejoin="round"
          d="M21 7.5v9L12 21l-9-4.5v-9"
        />
        <path strokeWidth={2} d="M12 12v9" />
      </svg>
    ),
    chart: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className={cls}
      >
        <path
          strokeWidth={2}
          strokeLinecap="round"
          d="M4 20V6m6 14V4m6 16v-8m4 8H2"
        />
      </svg>
    ),
    settings: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className={cls}
      >
        <path strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        <path
          strokeWidth={2}
          strokeLinejoin="round"
          d="M19.4 15a8 8 0 00.1-2 8 8 0 00-.1-2l2.1-1.6-2-3.4-2.5 1A8 8 0 0013.7 3l-.4-2.7H9.7L9.3 3A8 8 0 007 4.9l-2.5-1-2 3.4 2.1 1.6a8.4 8.4 0 00-.1 2c0 .7 0 1.3.1 2L2.5 16.6l2 3.4 2.5-1A8 8 0 0010.3 21l.4 2.7h3.6l.4-2.7a8 8 0 002.3-1.9l2.5 1 2-3.4-2.1-1.6z"
        />
      </svg>
    ),
    time: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className={cls}
      >
        <path strokeWidth={2} strokeLinecap="round" d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="9" strokeWidth={2} />
      </svg>
    ),
    bag: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className={cls}
      >
        <path strokeWidth={2} strokeLinejoin="round" d="M6 8h12l1 12H5L6 8z" />
        <path strokeWidth={2} d="M9 8V6a3 3 0 016 0v2" />
      </svg>
    ),
    location: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className={cls}
      >
        <path
          strokeWidth={2}
          d="M12 21s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10z"
        />
        <circle cx="12" cy="11" r="2" strokeWidth={2} />
      </svg>
    ),
    "dots-vertical": (
      <svg viewBox="0 0 24 24" className={cls} fill="currentColor">
        <circle cx="12" cy="5" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="12" cy="19" r="1.5" />
      </svg>
    ),
  };

  return (
    <span className={`inline-flex items-center ${className}`} {...props}>
      {icons[name] || null}
    </span>
  );
}
