import Label from "../atoms/Label";
import Input from "../atoms/Input";
import PasswordInput from "../atoms/PasswordInput";

export default function FormGroup({ label, name, type = "text", value, onChange, placeholder, error }) {
  return (
    <div className="mb-4 sm:mb-5">
      {label && <Label htmlFor={name}>{label}</Label>}
      <div className="mt-1.5 sm:mt-2">
        {type === "password" ? <PasswordInput id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} /> : <Input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} />}
      </div>
      {error && <p className="text-red-500 text-xs sm:text-sm mt-1.5 sm:mt-2">{error}</p>}
    </div>
  );
}
