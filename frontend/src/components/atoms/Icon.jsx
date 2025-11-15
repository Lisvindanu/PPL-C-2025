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
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={cls}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    camera: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={cls}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    check: (
      <svg fill="currentColor" viewBox="0 0 20 20" className={cls}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    share: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={cls}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
        />
      </svg>
    ),
    plus: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={cls}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
      </svg>
    ),
    home: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={cls}>
        <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M3 10.5l9-7 9 7V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
      </svg>
    ),
    box: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={cls}>
        <path strokeWidth={2} strokeLinejoin="round" d="M12 3l9 4.5-9 4.5L3 7.5 12 3z" />
        <path strokeWidth={2} strokeLinejoin="round" d="M21 7.5v9L12 21l-9-4.5v-9" />
        <path strokeWidth={2} d="M12 12v9" />
      </svg>
    ),
    chart: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={cls}>
        <path strokeWidth={2} strokeLinecap="round" d="M4 20V6m6 14V4m6 16v-8m4 8H2" />
      </svg>
    ),
    settings: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={cls}>
        <path strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        <path
          strokeWidth={2}
          strokeLinejoin="round"
          d="M19.4 15a8 8 0 00.1-2 8 8 0 00-.1-2l2.1-1.6-2-3.4-2.5 1A8 8 0 0013.7 3l-.4-2.7H9.7L9.3 3A8 8 0 007 4.9l-2.5-1-2 3.4 2.1 1.6a8.4 8.4 0 00-.1 2c0 .7 0 1.3.1 2L2.5 16.6l2 3.4 2.5-1A8 8 0 0010.3 21l.4 2.7h3.6l.4-2.7a8 8 0 002.3-1.9l2.5 1 2-3.4-2.1-1.6z"
        />
      </svg>
    ),
    time: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={cls}>
        <path strokeWidth={2} strokeLinecap="round" d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="9" strokeWidth={2} />
      </svg>
    ),
    bag: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={cls}>
        <path strokeWidth={2} strokeLinejoin="round" d="M6 8h12l1 12H5L6 8z" />
        <path strokeWidth={2} d="M9 8V6a3 3 0 016 0v2" />
      </svg>
    ),
    location: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={cls}>
        <path strokeWidth={2} d="M12 21s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10z" />
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
    google: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={sizes[size]}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
    palette: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={sizes[size]}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      </svg>
    ),
    briefcase: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={sizes[size]}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  };

  return (
    <span className={`inline-flex items-center ${className}`} {...props}>
      {icons[name] || null}
    </span>
  );
}
