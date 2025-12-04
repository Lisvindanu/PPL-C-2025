import StarRating from "../../Elements/Common/StarRating";

function ReviewItem({ rating = 5, title, content, avatar, name }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 sm:px-5 sm:py-5 shadow-sm">
      <div className="flex flex-col gap-3">
        {/* Stars */}
        <div className="text-[#facc15]">
          <StarRating value={rating} />
        </div>

        {/* Title & text */}
        <div>
          <p className="text-sm font-semibold text-neutral-900 sm:text-base">
            {title}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-neutral-700 sm:text-sm">
            {content}
          </p>
        </div>

        {/* Footer: avatar + name + quote icon */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt={name}
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="leading-tight">
              <p className="text-sm font-medium text-neutral-900">{name}</p>
            </div>
          </div>

          <span className="text-3xl leading-none text-[#10B981]">“</span>
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
        <button
          type="button"
          className="text-xs font-medium text-[#2563EB] hover:underline"
        >
          Lihat Semua
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((r, i) => (
          <ReviewItem key={i} {...r} />
        ))}
      </div>
    </section>
  );
}
