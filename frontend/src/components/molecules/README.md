# Molecules - Kombinasi Atoms

## 📌 Apa itu Molecules?

**Molecules** adalah kombinasi dari beberapa **Atoms** yang membentuk komponen fungsional sederhana. Molecules sudah memiliki fungsi yang lebih spesifik dibanding Atoms.

## 📂 Struktur Folder

```
molecules/
├── FormField.jsx          # Input + Label + Error message
├── SearchBar.jsx          # Input + Search button
├── Card.jsx               # Card container component
├── ServiceCard.jsx        # Card untuk display service
├── UserAvatar.jsx         # Avatar + Name + Role
├── Pagination.jsx         # Pagination controls
├── Modal.jsx              # Modal dialog
├── Dropdown.jsx           # Dropdown menu
├── Alert.jsx              # Alert/Notification box
├── PriceTag.jsx           # Price display with currency
└── RatingStars.jsx        # Star rating display
```

## 🧱 Contoh Implementasi

### FormField.jsx
```javascript
import { Label, Input } from '../atoms';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required,
  disabled
}) => {
  return (
    <div className="mb-4">
      {label && (
        <Label htmlFor={name} required={required}>
          {label}
        </Label>
      )}
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
        disabled={disabled}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;
```

**Usage:**
```javascript
import FormField from './components/molecules/FormField';

<FormField
  label="Email"
  name="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>
```

---

### Card.jsx
```javascript
const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  onClick
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        hover:shadow-lg transition-shadow duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <div className="px-6 py-4">{children}</div>

      {footer && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
```

**Usage:**
```javascript
<Card
  title="Payment Method"
  subtitle="Select your preferred payment method"
  footer={<Button variant="primary">Continue</Button>}
>
  <Select
    options={paymentMethods}
    value={selected}
    onChange={handleChange}
  />
</Card>
```

---

### ServiceCard.jsx
```javascript
import { Badge, Button } from '../atoms';
import { PriceTag, RatingStars } from '../molecules';

const ServiceCard = ({ service, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => onClick(service.id)}
    >
      <div className="relative h-48">
        <img
          src={service.thumbnail}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        {service.featured && (
          <Badge
            variant="warning"
            className="absolute top-2 right-2"
          >
            Featured
          </Badge>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {service.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <img
            src={service.freelancer.avatar}
            alt={service.freelancer.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-600">
            {service.freelancer.name}
          </span>
        </div>

        <RatingStars
          rating={service.rating}
          count={service.reviewCount}
          size="sm"
        />

        <div className="mt-4 flex items-center justify-between">
          <PriceTag amount={service.price} />
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
```

**Usage:**
```javascript
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {services.map(service => (
    <ServiceCard
      key={service.id}
      service={service}
      onClick={handleViewService}
    />
  ))}
</div>
```

---

### SearchBar.jsx
```javascript
import { Input, Button } from '../atoms';
import { useState } from 'react';

const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  className = ''
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex gap-2 ${className}`}
    >
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit" variant="primary">
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
```

**Usage:**
```javascript
<SearchBar
  placeholder="Search services..."
  onSearch={(query) => handleSearch(query)}
/>
```

---

### Modal.jsx
```javascript
import { Button } from '../atoms';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md'
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className={`
            relative bg-white rounded-lg shadow-xl
            w-full ${sizes[size]}
            transform transition-all
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
```

**Usage:**
```javascript
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Payment"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        Confirm
      </Button>
    </>
  }
>
  <p>Are you sure you want to proceed with this payment?</p>
</Modal>
```

---

### RatingStars.jsx
```javascript
const RatingStars = ({ rating, count, size = 'md', showCount = true }) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-1">
      <div className={`flex ${sizes[size]} text-yellow-400`}>
        {[...Array(5)].map((_, i) => (
          <span key={i}>
            {i < fullStars ? '★' : i === fullStars && hasHalfStar ? '⯨' : '☆'}
          </span>
        ))}
      </div>
      <span className="text-sm font-medium text-gray-700">{rating}</span>
      {showCount && (
        <span className="text-sm text-gray-500">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
```

**Usage:**
```javascript
<RatingStars rating={4.5} count={128} size="md" />
```

---

### PriceTag.jsx
```javascript
const PriceTag = ({ amount, currency = 'IDR', size = 'md', showPrefix = true }) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex items-baseline gap-1">
      {showPrefix && (
        <span className="text-sm text-gray-600">Starting from</span>
      )}
      <span className={`font-bold text-blue-600 ${sizes[size]}`}>
        {formatPrice(amount)}
      </span>
    </div>
  );
};

export default PriceTag;
```

**Usage:**
```javascript
<PriceTag amount={250000} size="lg" showPrefix={false} />
```

---

### Pagination.jsx
```javascript
import { Button } from '../atoms';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {getPageNumbers().map(page => (
        <Button
          key={page}
          variant={page === currentPage ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
```

**Usage:**
```javascript
<Pagination
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
/>
```

---

## ✅ Prinsip Molecules

1. **Kombinasi Atoms** - Terdiri dari 2+ atoms
2. **Single Purpose** - Satu fungsi spesifik
3. **Reusable** - Bisa dipakai di berbagai context
4. **Simple Logic** - Logika presentational, bukan business logic
5. **Self-Contained** - Bisa standalone tanpa context kompleks

## 📦 Export Pattern

`molecules/index.js`:
```javascript
export { default as FormField } from './FormField';
export { default as Card } from './Card';
export { default as ServiceCard } from './ServiceCard';
export { default as SearchBar } from './SearchBar';
export { default as Modal } from './Modal';
export { default as RatingStars } from './RatingStars';
export { default as PriceTag } from './PriceTag';
export { default as Pagination } from './Pagination';
```

**Usage:**
```javascript
import { FormField, Card, Modal } from './components/molecules';
```

## 🚀 Next Steps

Setelah membuat Molecules, lanjut ke **Organisms** untuk kombinasi yang lebih kompleks!
