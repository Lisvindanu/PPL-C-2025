import Label from "../../Elements/Text/Label";
import Input from "../../Elements/Inputs/Input";
import PasswordInput from "../../Elements/Inputs/PasswordInput";

export default function FormGroup({ label, name, type = "text", value, onChange, placeholder, error, required }) {
  return (
    <div className="mb-4 sm:mb-5">
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="mt-1.5 sm:mt-2">
        {type === "password" ? (
          <PasswordInput id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} />
        ) : (
          <Input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} />
        )}
      </div>
      {error && <p className="text-red-500 text-xs sm:text-sm mt-1.5 sm:mt-2">{error}</p>}
    </div>
  );
}
