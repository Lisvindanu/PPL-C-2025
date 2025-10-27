export default function Breadcrumb({ items }) {
  return (
    <nav className="text-sm text-secondary" aria-label="Breadcrumb">
      <ol className="flex min-w-0 items-center gap-2">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {idx > 0 && <span className="text-neutral-300">›</span>}
            {it.href ? (
              <a
                href={it.href}
                className="max-w-[14rem] truncate hover:text-neutral-900"
                title={it.label}
              >
                {it.label}
              </a>
            ) : (
              <span
                className="max-w-[14rem] truncate text-black"
                title={it.label}
              >
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
