import { useEffect, useState } from "react";
import Card from "../../Elements/Layout/Card";
import Label from "../../Elements/Text/Label";
import Input from "../../Elements/Inputs/Input";
import TextArea from "../../Elements/Inputs/TextArea";
import UploadDropzone from "../../Elements/Inputs/UploadDropzone";
import { buildMediaUrl } from "../../../utils/mediaUrl";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_GALLERY = 5;

export default function MediaEditFormCard({
  values,
  onChange,
  maxDesc = 2000,
}) {
  const remain = Math.max(0, maxDesc - (values.deskripsi || "").length);

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryFilePreviews, setGalleryFilePreviews] = useState([]);

  // ===== Helpers angka =====
  function handleIntFieldChange(e, field) {
    const raw = e.target.value || "";
    const numeric = raw.replace(/\D/g, "");
    onChange({ [field]: numeric });
  }

  // ===== Preview thumbnail (existing path / new file) =====
  useEffect(() => {
    let url;

    if (values.thumbnailFile) {
      url = URL.createObjectURL(values.thumbnailFile);
      setThumbnailPreview(url);

      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    }

    if (values.thumbnail) {
      setThumbnailPreview(buildMediaUrl(values.thumbnail));
      return undefined;
    }

    setThumbnailPreview(null);
    return undefined;
  }, [values.thumbnailFile, values.thumbnail]);

  // ===== Preview gallery untuk file baru =====
  useEffect(() => {
    const files = Array.isArray(values.gambarFiles) ? values.gambarFiles : [];
    const urls = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setGalleryFilePreviews(urls);

    return () => {
      urls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [values.gambarFiles]);

  // ===== Handlers upload =====
  function handleThumbnailChange(e) {
    const file = e.target.files?.[0] || null;

    if (file && !ALLOWED_TYPES.includes(file.type)) {
      alert("Format thumbnail harus jpg, jpeg, atau png.");
      return;
    }

    onChange({
      thumbnailFile: file,
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

    const existingPaths = Array.isArray(values.gambar) ? values.gambar : [];
    const currentNewFiles = Array.isArray(values.gambarFiles)
      ? values.gambarFiles
      : [];

    const totalExisting = existingPaths.length;
    const totalNew = currentNewFiles.length;
    const remainingSlots = Math.max(0, MAX_GALLERY - totalExisting - totalNew);

    if (remainingSlots <= 0) {
      alert("Maksimal 5 gambar pendukung yang bisa diupload.");
      return;
    }

    const toAdd = validNew.slice(0, remainingSlots);
    if (validNew.length > remainingSlots) {
      alert("Beberapa file di-skip karena melebihi batas 5 gambar.");
    }

    onChange({
      gambarFiles: [...currentNewFiles, ...toAdd],
    });
  }

  // ===== Remove handlers =====
  function removeThumbnail() {
    onChange({
      thumbnail: "",
      thumbnailFile: null,
    });
  }

  function removeExistingGalleryImage(index) {
    const existing = Array.isArray(values.gambar) ? values.gambar : [];
    const next = existing.filter((_, i) => i !== index);
    onChange({ gambar: next });
  }

  function removeNewGalleryImage(index) {
    const current = Array.isArray(values.gambarFiles) ? values.gambarFiles : [];
    const next = current.filter((_, i) => i !== index);
    onChange({ gambarFiles: next });
  }

  const existingGallery = Array.isArray(values.gambar) ? values.gambar : [];
  const newGalleryFiles = Array.isArray(values.gambarFiles)
    ? values.gambarFiles
    : [];

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
            Tambahkan hingga 5 gambar pendukung layanan Anda (jpg, jpeg, png).
          </p>

          {(existingGallery.length > 0 || galleryFilePreviews.length > 0) && (
            <div className="mt-2 space-y-3">
              {existingGallery.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-medium text-[#6B7280]">
                    Gambar Lama
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {existingGallery.map((path, index) => (
                      <div
                        key={`old-${index}`}
                        className="relative overflow-hidden rounded-lg border border-[#E5D5CC] bg-[#F5F0EB]"
                      >
                        <img
                          src={buildMediaUrl(path)}
                          alt={`Gambar lama ${index + 1}`}
                          className="h-20 w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-[10px] text-white"
                          onClick={() => removeExistingGalleryImage(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {galleryFilePreviews.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-medium text-[#6B7280]">
                    Gambar Baru
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {galleryFilePreviews.map((item, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative overflow-hidden rounded-lg border border-[#E5D5CC] bg-[#F5F0EB]"
                      >
                        <img
                          src={item.url}
                          alt={`Gambar baru ${index + 1}`}
                          className="h-20 w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-[10px] text-white"
                          onClick={() => removeNewGalleryImage(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
