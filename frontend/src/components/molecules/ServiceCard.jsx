import Icon from "../atoms/Icon";
import TagPill from "../atoms/TagPill";
import KebabButton from "../atoms/KebabButton";

export default function ServiceCard({ item }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <img
            src={item.logo}
            alt={item.title}
            className="h-10 w-10 rounded-md border object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              {item.title}
            </p>
            <p className="mt-0.5 line-clamp-2 text-[13px] text-neutral-600">
              {item.description}
            </p>
          </div>
        </div>
        <KebabButton onClick={() => {}} />
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {item.tags.map((t, i) => (
          <TagPill key={i}>{t}</TagPill>
        ))}
      </div>

      <div className="mb-3 flex items-center gap-4 text-xs text-neutral-600">
        <span className="inline-flex items-center gap-1">
          <Icon name="bag" className="h-4 w-4" />
          {item.type}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name="time" className="h-4 w-4" />
          {item.updated}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name="location" className="h-4 w-4" />
          {item.location}
        </span>
      </div>

      <div className="text-sm font-semibold text-neutral-900">{item.price}</div>
    </div>
  );
}
