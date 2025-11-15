import Label from "../atoms/Label";
import Input from "../atoms/Input";
import PasswordInput from "../atoms/PasswordInput";

export default function FormGroup({ label, name, type = "text", value, onChange, placeholder, error }) {
  return (
    <div className="mb-5">
      {label && <Label htmlFor={name}>{label}</Label>}
      {type === "password" ? <PasswordInput id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} /> : <Input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} />}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
