import StarRating from "../atoms/StarRating";

function ReviewItem({ rating = 5, title, content, avatar, name }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <img
          src={avatar}
          alt={name}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="flex-1">
          <StarRating value={rating} className="mb-1" />
          <p className="font-medium text-neutral-900">{title}</p>
          <p className="mt-1 text-sm text-neutral-700">{content}</p>
          <p className="mt-2 text-xs text-neutral-500">{name}</p>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection({ items = [] }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">
          Ulasan Customer
        </h3>
        <a href="#" className="text-sm text-[#3B82F6] hover:underline">
          Lihat Semua
        </a>
      </div>

      {/* LIST VERTICAL */}
      <div className="flex flex-col gap-3">
        {items.map((r, i) => (
          <ReviewItem key={i} {...r} />
        ))}
      </div>
    </section>
  );
}
