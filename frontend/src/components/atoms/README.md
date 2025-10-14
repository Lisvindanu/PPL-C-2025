# Atoms - Komponen Terkecil

## 📌 Apa itu Atoms?

**Atoms** adalah building block terkecil dalam Atomic Design. Komponen ini **tidak bisa dipecah lagi** dan bersifat **reusable**.

## 📂 Struktur Folder

```
atoms/
├── Button.jsx          # Tombol dengan berbagai variant
├── Input.jsx           # Input field
├── Label.jsx           # Label untuk form
├── Badge.jsx           # Status badge
├── Icon.jsx            # Icon wrapper
├── Text.jsx            # Typography text
├── Select.jsx          # Select dropdown
├── Checkbox.jsx        # Checkbox input
├── Radio.jsx           # Radio input
└── Spinner.jsx         # Loading spinner
```

## 🧱 Contoh Implementasi

### Button.jsx
```javascript
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  type = 'button',
  className = ''
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg font-medium
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
```

**Usage:**
```javascript
import Button from './components/atoms/Button';

<Button variant="primary" onClick={handleClick}>
  Submit
</Button>

<Button variant="danger" size="sm">
  Delete
</Button>
```

---

### Input.jsx
```javascript
const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  className = ''
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        w-full px-4 py-2 rounded-lg border
        ${error ? 'border-red-500' : 'border-gray-300'}
        focus:outline-none focus:ring-2
        ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${className}
      `}
    />
  );
};

export default Input;
```

**Usage:**
```javascript
<Input
  name="amount"
  type="number"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  placeholder="Enter amount"
  error={errors.amount}
/>
```

---

### Badge.jsx
```javascript
const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
```

**Usage:**
```javascript
<Badge variant="success">Paid</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Failed</Badge>
```

---

### Select.jsx
```javascript
const Select = ({
  name,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  error,
  className = ''
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`
        w-full px-4 py-2 rounded-lg border
        ${error ? 'border-red-500' : 'border-gray-300'}
        focus:outline-none focus:ring-2
        ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
        bg-white cursor-pointer
        ${className}
      `}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
```

**Usage:**
```javascript
<Select
  name="paymentMethod"
  value={method}
  onChange={(e) => setMethod(e.target.value)}
  options={[
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'e_wallet', label: 'E-Wallet' },
    { value: 'credit_card', label: 'Credit Card' },
  ]}
/>
```

---

### Spinner.jsx
```javascript
const Spinner = ({ size = 'md', color = 'blue' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colors = {
    blue: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-600 border-t-transparent',
  };

  return (
    <div
      className={`
        ${sizes[size]}
        ${colors[color]}
        rounded-full animate-spin
      `}
    />
  );
};

export default Spinner;
```

**Usage:**
```javascript
<Spinner size="lg" color="blue" />
```

---

### Label.jsx
```javascript
const Label = ({ children, htmlFor, required, className = '' }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`
        block text-sm font-medium text-gray-700 mb-2
        ${className}
      `}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;
```

**Usage:**
```javascript
<Label htmlFor="email" required>
  Email Address
</Label>
```

---

## ✅ Prinsip Atoms

1. **Single Responsibility** - Satu komponen = satu fungsi
2. **Reusable** - Bisa dipakai di banyak tempat
3. **No Business Logic** - Hanya presentational
4. **Props for Customization** - Gunakan props untuk variant, size, dll
5. **Tailwind Classes** - Gunakan Tailwind untuk styling

## 🎨 Tailwind Tips

### Reusable Classes
```javascript
// ❌ Don't repeat classes
<button className="px-4 py-2 bg-blue-600 text-white rounded">...</button>
<button className="px-4 py-2 bg-blue-600 text-white rounded">...</button>

// ✅ Create reusable component
const Button = ({ children }) => (
  <button className="px-4 py-2 bg-blue-600 text-white rounded">
    {children}
  </button>
);
```

### Conditional Classes
```javascript
const Button = ({ variant, disabled }) => (
  <button
    className={`
      px-4 py-2 rounded
      ${variant === 'primary' ? 'bg-blue-600' : 'bg-gray-600'}
      ${disabled ? 'opacity-50' : 'hover:shadow-md'}
    `}
  >
    Click me
  </button>
);
```

## 📦 Export Pattern

`atoms/index.js`:
```javascript
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Label } from './Label';
export { default as Badge } from './Badge';
export { default as Select } from './Select';
export { default as Spinner } from './Spinner';
```

**Usage:**
```javascript
import { Button, Input, Label } from './components/atoms';
```

## 🚀 Next Steps

Setelah membuat Atoms, lanjut ke **Molecules** untuk kombinasi atoms!
