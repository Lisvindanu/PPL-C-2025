import { useEffect, useState } from "react";
import Card from "../atoms/Card";
import Label from "../atoms/Label";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";
import UploadDropzone from "../atoms/UploadDropzone";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export default function MediaFormCard({ values, onChange, maxDesc = 2000 }) {
  const remain = Math.max(0, maxDesc - (values.deskripsi || "").length);

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // ===== Helpers angka =====
  function handleIntFieldChange(e, field) {
    const raw = e.target.value || "";
    // hanya digit
    const numeric = raw.replace(/\D/g, "");
    onChange({ [field]: numeric });
  }

  // ===== Preview thumbnail =====
  useEffect(() => {
    if (!values.thumbnail) {
      setThumbnailPreview(null);
      return;
    }

    const url = URL.createObjectURL(values.thumbnail);
    setThumbnailPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [values.thumbnail]);

  // ===== Preview gallery =====
  useEffect(() => {
    if (!values.gambar || !values.gambar.length) {
      setGalleryPreviews([]);
      return;
    }

    const urls = values.gambar.map((file) => URL.createObjectURL(file));
    setGalleryPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [values.gambar]);

  function handleThumbnailChange(e) {
    const file = e.target.files?.[0] || null;

    if (file && !ALLOWED_TYPES.includes(file.type)) {
      alert("Format thumbnail harus jpg, jpeg, atau png.");
      return;
    }

    onChange({
      thumbnail: file,
    });
  }

  function handleGalleryChange(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validNew = files.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`File "${file.name}" di-skip karena bukan jpg/jpeg/png.`);
        return false;
      }
      return true;
    });

    const current = Array.isArray(values.gambar) ? values.gambar : [];
    const merged = [...current, ...validNew];

    let limited = merged;
    if (merged.length > 5) {
      limited = merged.slice(0, 5);
      alert("Maksimal 5 gambar pendukung yang bisa diupload.");
    }

    onChange({
      gambar: limited,
    });
  }

  function removeThumbnail() {
    onChange({ thumbnail: null });
  }

  function removeGalleryImage(index) {
    const next = (values.gambar || []).filter((_, i) => i !== index);
    onChange({ gambar: next });
  }

  return (
    <Card className="h-full" title="Gambar">
      <div className="space-y-4">
        {/* Thumbnail utama */}
        <div className="space-y-2">
          <Label>
            Thumbnail <span className="text-red-500">*</span>
          </Label>
          <UploadDropzone accept="image/*" onChange={handleThumbnailChange} />
          <p className="text-xs text-[#9C8C84]">
            Upload 1 gambar utama sebagai thumbnail layanan (jpg, jpeg, png).
          </p>

          {thumbnailPreview && (
            <div className="mt-2 h-20 w-20 overflow-hidden rounded-lg border border-[#E5D5CC] bg-[#F5F0EB] relative">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-[10px] text-white"
                onClick={removeThumbnail}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Galeri gambar (maks 5) */}
        <div className="space-y-2">
          <Label>Galeri Gambar (Maks. 5)</Label>
          <UploadDropzone
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
          />
          <p className="text-xs text-[#9C8C84]">
            Opsional, tambahkan hingga 5 gambar pendukung layanan Anda (jpg,
            jpeg, png).
          </p>

          {galleryPreviews.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-3">
              {galleryPreviews.map((url, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-lg border border-[#E5D5CC] bg-[#F5F0EB]"
                >
                  <img
                    src={url}
                    alt={`Gambar ${index + 1}`}
                    className="h-20 w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-[10px] text-white"
                    onClick={() => removeGalleryImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revamp / Revisi (INT) */}
        <div className="space-y-2">
          <Label>
            Revamp/Revisi <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="Masukan jumlah revisi"
            inputMode="numeric"
            value={values.batas_revisi || ""}
            onChange={(e) => handleIntFieldChange(e, "batas_revisi")}
          />
        </div>

        {/* Judul */}
        <div className="space-y-2">
          <Label>
            Judul <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="Masukan Judul"
            value={values.judul || ""}
            onChange={(e) =>
              onChange({
                judul: e.target.value,
              })
            }
          />
        </div>

        {/* Deskripsi */}
        <div className="space-y-2">
          <Label>
            Deskripsi <span className="text-red-500">*</span>
          </Label>
          <TextArea
            rows={6}
            placeholder="Masukan Deskripsi Layanan"
            value={values.deskripsi || ""}
            onChange={(e) =>
              onChange({
                deskripsi: e.target.value,
              })
            }
          />
          <div className="text-right text-[11px] text-[#9C8C84]">
            Max. {maxDesc} characters • {remain} left
          </div>
        </div>
      </div>
    </Card>
  );
}
