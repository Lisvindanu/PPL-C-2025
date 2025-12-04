import Icon from "../Icons/Icon";

export default function KebabButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Menu"
      className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
    >
      <Icon name="dots-vertical" size="lg" />
    </button>
  );
}
