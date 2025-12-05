import { useRef } from "react";
import Icon from "./Icon";

export default function UploadDropzone({
  onChange,
  accept,
  multiple = false,
  label = "Gambar",
  ...rest
}) {
  const fileInputRef = useRef(null);

  function handleClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  return (
    <div {...rest}>
      <button
        type="button"
        onClick={handleClick}
        className="flex h-24 w-24 flex-col items-center justify-center rounded-xl border border-dashed border-[#E5D5CC] bg-[#F5F0EB] text-xs text-[#6B5B53]"
      >
        <Icon name="image-plus" size="xl" className="text-[#111827]" />
        <span className="mt-1">{label}</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={onChange}
        accept={accept}
        multiple={multiple}
      />
    </div>
  );
}
