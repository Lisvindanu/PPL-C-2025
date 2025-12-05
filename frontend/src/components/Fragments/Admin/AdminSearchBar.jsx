import { Search } from 'lucide-react';
import Input from '../../Elements/Inputs/Input';

export default function AdminSearchBar({ 
  placeholder = "Cari...",
  value, 
  onChange,
  className = "" 
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <Input
        type="text"
        placeholder={placeholder}
        className="pl-10"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}



