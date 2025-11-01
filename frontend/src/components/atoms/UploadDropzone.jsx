import Icon from "./Icon";

export default function UploadDropzone({ onChange, className = "" }) {
  return (
    <label className={"flex h-28 w-28 cursor-pointer items-center justify-center rounded-xl border border-[#B3B3B3] bg-[#F5F0EB] text-[#6C5A55] transition hover:bg-[#EFE8E1] focus-within:ring-2 focus-within:ring-[#696969] " + className}>
      <input type="file" accept="image/*" onChange={onChange} className="sr-only" />
      <div className="flex flex-col items-center gap-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-[#B3B3B3]">
          <Icon name="plus" />
        </div>
        <span className="text-xs">Gambar</span>
      </div>
    </label>
  );
}
