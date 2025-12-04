import { useNavigate } from "react-router-dom";
import Icon from "../../Elements/Icons/Icon";

export default function AddServiceCallout() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl px-4">
      <button
        type="button"
        onClick={() => navigate("/freelance/service/new")}
        className="flex w-full items-center justify-center rounded-2xl border border-neutral-300 bg-white py-16 text-center shadow-sm transition hover:shadow-md"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C7CFB0]/30 text-[#1F5EFF] border-4 border-[#1F5EFF]">
            <Icon name="plus" className="h-6 w-6 text-[#1F5EFF]" />
          </div>
          <p className="text-2xl font-semibold text-[#1F5EFF]">
            Tambah Layanan Baru
          </p>
        </div>
      </button>
    </div>
  );
}
