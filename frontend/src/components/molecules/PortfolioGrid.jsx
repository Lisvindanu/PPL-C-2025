export default function PortfolioGrid({ items = [] }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-neutral-900">Portfolio</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Portfolio ${i + 1}`}
            className="aspect-square w-full rounded-lg object-cover border border-neutral-200 bg-white hover:shadow-md transition"
          />
        ))}
      </div>
    </section>
  );
}
