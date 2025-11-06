import Card from "../atoms/Card";
import Label from "../atoms/Label";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";
import UploadDropzone from "../atoms/UploadDropzone";

export default function MediaFormCard({ values, onChange, maxDesc = 2000 }) {
  const remain = Math.max(0, maxDesc - (values.deskripsi || "").length);

  return (
    <Card className="h-full" title="Gambar">
      <div className="space-y-4">
        <UploadDropzone onChange={(e) => onChange({ gambar: e.target.files?.[0] })} />

        <div className="space-y-2">
          <Label>Add Video <span className="text-red-500">*</span></Label>
          <Input
            placeholder="Please Select"
            value={values.video || ""}
            onChange={(e) => onChange({ video: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Judul <span className="text-red-500">*</span></Label>
          <Input
            placeholder="UI/UX Design"
            value={values.judul || ""}
            onChange={(e) => onChange({ judul: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Deskripsi <span className="text-red-500">*</span></Label>
          <TextArea
            rows={6}
            placeholder="menyediakan tampilan modern pada UI aplikasi web & Mobile"
            value={values.deskripsi || ""}
            onChange={(e) => onChange({ deskripsi: e.target.value })}
          />
          <div className="text-right text-[11px] text-[#9C8C84]">Max. {maxDesc} characters • {remain} left</div>
        </div>
      </div>
    </Card>
  );
}
