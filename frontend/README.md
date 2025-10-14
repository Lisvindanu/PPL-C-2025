# SkillConnect Frontend - Payment Gateway Module

## 🚀 Tech Stack
- **React 18**
- **Tailwind CSS 3**
- **Vite** (Build tool)
- **React Router v6**
- **Axios** (HTTP client)
- **React Query** (Data fetching)
- **Zustand** (State management)

## 📁 Architecture: Atomic Design

Struktur ini menggunakan **Atomic Design** untuk component-based development yang scalable dan reusable.

```
frontend/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── atoms/           # Komponen terkecil (Button, Input, Label)
│   │   ├── molecules/       # Kombinasi atoms (FormGroup, Card)
│   │   ├── organisms/       # Kombinasi molecules (Navbar, PaymentForm)
│   │   └── templates/       # Layout halaman
│   ├── pages/               # Halaman utama
│   ├── services/            # API calls
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Helper functions
│   ├── styles/              # Global styles
│   ├── assets/              # Images, fonts
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🔧 Setup

### 1. Clone & Install
```bash
git clone <repo-url>
cd frontend
npm install
```

### 2. Environment Variables
Copy `.env.example` ke `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

**Frontend akan jalan di: `http://localhost:3000`**

## 📦 NPM Scripts
- `npm run dev` - Development mode dengan Vite
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality
- `npm test` - Run tests

## 🔐 Environment Variables Required
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

## 📖 Atomic Design Structure

### 1. **Atoms** (`components/atoms/`)
Komponen terkecil yang tidak bisa dipecah lagi.

**Contoh:** Button, Input, Label, Icon, Text, Badge

### 2. **Molecules** (`components/molecules/`)
Kombinasi dari beberapa atoms.

**Contoh:** FormGroup (Label + Input), Card (Text + Image), SearchBar (Input + Button)

### 3. **Organisms** (`components/organisms/`)
Kombinasi dari molecules dan atoms yang membentuk section kompleks.

**Contoh:** Navbar, PaymentForm, PaymentHistoryTable, EarningsDashboard

### 4. **Templates** (`components/templates/`)
Layout halaman dengan slot untuk content.

**Contoh:** DashboardLayout, AuthLayout, MainLayout

### 5. **Pages** (`pages/`)
Halaman lengkap dengan data dan business logic.

**Contoh:** PaymentPage, PaymentHistoryPage, EarningsPage

## 🎨 Tailwind CSS Configuration

`tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
}
```

## 🧩 Component Example Structure

### Atom Example: `Button.jsx`
```javascript
const Button = ({ children, variant = 'primary', onClick, disabled }) => {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
```

### Molecule Example: `FormGroup.jsx`
```javascript
import Label from '../atoms/Label';
import Input from '../atoms/Input';

const FormGroup = ({ label, name, type, value, onChange, error }) => {
  return (
    <div className="mb-4">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        error={error}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormGroup;
```

### Organism Example: `PaymentForm.jsx`
```javascript
import { useState } from 'react';
import FormGroup from '../molecules/FormGroup';
import Button from '../atoms/Button';
import Select from '../atoms/Select';

const PaymentForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    orderId: '',
    amount: '',
    method: 'bank_transfer',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Payment</h2>

      <FormGroup
        label="Order ID"
        name="orderId"
        type="text"
        value={formData.orderId}
        onChange={handleChange}
      />

      <FormGroup
        label="Amount"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Payment Method</label>
        <Select
          name="method"
          value={formData.method}
          onChange={handleChange}
          options={[
            { value: 'bank_transfer', label: 'Bank Transfer' },
            { value: 'e_wallet', label: 'E-Wallet' },
            { value: 'credit_card', label: 'Credit Card' },
            { value: 'qris', label: 'QRIS' },
          ]}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Create Payment'}
      </Button>
    </form>
  );
};

export default PaymentForm;
```

## 🔗 API Service Example

`services/paymentService.js`:
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const paymentService = {
  createPayment: async (data) => {
    const response = await api.post('/payments/create', data);
    return response.data;
  },

  getPaymentHistory: async (filters = {}) => {
    const response = await api.get('/payments/history', { params: filters });
    return response.data;
  },

  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  getEarnings: async (filters = {}) => {
    const response = await api.get('/payments/earnings', { params: filters });
    return response.data;
  },

  exportReport: async (filters) => {
    const response = await api.post('/payments/export', filters, {
      responseType: 'blob',
    });
    return response.data;
  },
};
```

## 🪝 Custom Hooks Example

`hooks/usePayment.js`:
```javascript
import { useState } from 'react';
import { paymentService } from '../services/paymentService';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPayment = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentService.createPayment(data);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
      throw err;
    }
  };

  return {
    createPayment,
    loading,
    error,
  };
};
```

## 🗂️ Folder Structure Details

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Label.jsx
│   │   ├── Badge.jsx
│   │   └── Icon.jsx
│   ├── molecules/
│   │   ├── FormGroup.jsx
│   │   ├── Card.jsx
│   │   └── SearchBar.jsx
│   ├── organisms/
│   │   ├── Navbar.jsx
│   │   ├── PaymentForm.jsx
│   │   ├── PaymentHistoryTable.jsx
│   │   └── EarningsDashboard.jsx
│   └── templates/
│       ├── DashboardLayout.jsx
│       └── MainLayout.jsx
├── pages/
│   ├── PaymentPage.jsx
│   ├── PaymentHistoryPage.jsx
│   ├── EarningsPage.jsx
│   └── NotFoundPage.jsx
├── services/
│   └── paymentService.js
├── hooks/
│   ├── usePayment.js
│   └── useAuth.js
├── utils/
│   ├── formatCurrency.js
│   └── formatDate.js
└── styles/
    └── index.css
```

## 🧪 Testing
```bash
npm test                # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

## 📝 Code Style
- ESLint + Prettier
- Use functional components
- Use hooks (useState, useEffect, custom hooks)
- PropTypes untuk type checking

## 🔗 Related Documentation
- [Component Library](./docs/components.md)
- [API Integration](./docs/api-integration.md)
- [State Management](./docs/state-management.md)

## 🌐 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/payment/create` | PaymentPage | Create new payment |
| `/payment/history` | PaymentHistoryPage | View payment history |
| `/payment/:id` | PaymentDetailPage | Payment detail |
| `/earnings` | EarningsPage | Freelancer earnings dashboard |

**Backend Port:** `5000`
**Frontend Port:** `3000`
