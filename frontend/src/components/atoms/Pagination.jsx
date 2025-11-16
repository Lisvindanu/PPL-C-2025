export default function Pagination({ page, totalPages, onChange }) {
  const pages = (() => {
    const arr = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  })();

  return (
    <div className="mt-6 flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onChange(1)}
        disabled={page === 1}
        className="h-8 w-8 rounded-md border bg-white text-sm disabled:opacity-50"
      >
        «
      </button>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="h-8 w-8 rounded-md border bg-white text-sm disabled:opacity-50"
      >
        ‹
      </button>

      {pages.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`h-8 w-8 rounded-md border text-sm ${
            n === page ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white"
          }`}
        >
          {n}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="h-8 w-8 rounded-md border bg-white text-sm disabled:opacity-50"
      >
        ›
      </button>
      <button
        type="button"
        onClick={() => onChange(totalPages)}
        disabled={page === totalPages}
        className="h-8 w-8 rounded-md border bg-white text-sm disabled:opacity-50"
      >
        »
      </button>
    </div>
  );
}
