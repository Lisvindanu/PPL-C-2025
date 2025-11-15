import ResetPasswordLabel from "../atoms/ResetPasswordLabel";
import ResetPasswordInput from "../atoms/ResetPasswordInput";

export default function ResetPasswordFormGroup({ label, name, type = "text", value, onChange, placeholder, error }) {
  return (
    <div className="mb-5">
      {label && <ResetPasswordLabel htmlFor={name}>{label}</ResetPasswordLabel>}
      <ResetPasswordInput id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
