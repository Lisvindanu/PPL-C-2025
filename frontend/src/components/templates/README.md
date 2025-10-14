# Templates - Layout Pages

## 📌 Apa itu Templates?

**Templates** adalah layout structure yang menggabungkan **Organisms** untuk membentuk kerangka halaman. Templates fokus pada **tata letak** dan **positioning**, bukan konten spesifik.

## 📂 Struktur Folder

```
templates/
├── MainLayout.jsx          # Layout utama dengan header & footer
├── AuthLayout.jsx          # Layout untuk login/register
├── DashboardLayout.jsx     # Layout untuk dashboard
├── CheckoutLayout.jsx      # Layout untuk checkout flow
└── EmptyLayout.jsx         # Layout minimal tanpa header/footer
```

## 🧱 Contoh Implementasi

### MainLayout.jsx
```javascript
import { Header, Footer } from '../organisms';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
```

**Usage dengan React Router:**
```javascript
import { MainLayout } from './components/templates';

<Routes>
  <Route element={<MainLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/services/:id" element={<ServiceDetailPage />} />
  </Route>
</Routes>
```

---

### AuthLayout.jsx
```javascript
const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SkillConnect</h1>
          <p className="text-blue-100">Connect with talented freelancers</p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {title && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
              {subtitle && (
                <p className="text-gray-600">{subtitle}</p>
              )}
            </div>
          )}

          {children}
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6">
          <p className="text-sm text-blue-100">
            © 2025 SkillConnect. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
```

**Usage:**
```javascript
import { AuthLayout } from './components/templates';

function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue to your account"
    >
      <LoginForm />
    </AuthLayout>
  );
}
```

---

### DashboardLayout.jsx
```javascript
import { Header } from '../organisms';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Overview', icon: '📊' },
    { path: '/dashboard/orders', label: 'My Orders', icon: '📦' },
    { path: '/dashboard/messages', label: 'Messages', icon: '💬' },
    { path: '/dashboard/profile', label: 'Profile', icon: '👤' },
  ];

  if (user.role === 'freelancer') {
    menuItems.splice(2, 0,
      { path: '/dashboard/services', label: 'My Services', icon: '🛠️' },
      { path: '/dashboard/earnings', label: 'Earnings', icon: '💰' }
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{user.role}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-colors
                    ${location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
```

**Usage:**
```javascript
<Routes>
  <Route element={<ProtectedRoute />}>
    <Route element={<DashboardLayout />}>
      <Route path="/dashboard" element={<DashboardOverview />} />
      <Route path="/dashboard/orders" element={<MyOrders />} />
      <Route path="/dashboard/messages" element={<Messages />} />
    </Route>
  </Route>
</Routes>
```

---

### CheckoutLayout.jsx
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutLayout = ({ children, currentStep, totalSteps }) => {
  const navigate = useNavigate();

  const steps = [
    { number: 1, label: 'Order Details' },
    { number: 2, label: 'Payment' },
    { number: 3, label: 'Confirmation' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">SkillConnect</h1>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full
                    ${currentStep >= step.number
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {currentStep > step.number ? '✓' : step.number}
                </div>

                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className={`w-24 h-1 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default CheckoutLayout;
```

**Usage:**
```javascript
function CheckoutPage() {
  const [step, setStep] = useState(1);

  return (
    <CheckoutLayout currentStep={step} totalSteps={3}>
      {step === 1 && <OrderDetailsForm onNext={() => setStep(2)} />}
      {step === 2 && <PaymentForm onNext={() => setStep(3)} />}
      {step === 3 && <ConfirmationPage />}
    </CheckoutLayout>
  );
}
```

---

### EmptyLayout.jsx
```javascript
import { Outlet } from 'react-router-dom';

const EmptyLayout = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};

export default EmptyLayout;
```

**Usage (untuk landing page atau halaman khusus):**
```javascript
<Routes>
  <Route element={<EmptyLayout />}>
    <Route path="/landing" element={<LandingPage />} />
    <Route path="/payment-callback" element={<PaymentCallback />} />
  </Route>
</Routes>
```

---

## 🎯 Layout Structure Best Practices

### Nested Layouts
```javascript
// App.jsx
<Routes>
  {/* Public Routes */}
  <Route element={<MainLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/services" element={<ServicesPage />} />
  </Route>

  {/* Auth Routes */}
  <Route element={<AuthLayout />}>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
  </Route>

  {/* Protected Routes */}
  <Route element={<ProtectedRoute />}>
    <Route element={<DashboardLayout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/orders" element={<OrdersPage />} />
    </Route>
  </Route>

  {/* Checkout Flow */}
  <Route path="/checkout" element={<CheckoutPage />} />
</Routes>
```

---

## ✅ Prinsip Templates

1. **Layout Only** - Fokus pada struktur, bukan konten
2. **Reusable Structure** - Bisa dipakai multiple pages
3. **Consistent Navigation** - Header, sidebar, footer konsisten
4. **Responsive Design** - Support mobile & desktop
5. **Flexible Content** - Gunakan `<Outlet />` atau `{children}`

## 📦 Export Pattern

`templates/index.js`:
```javascript
export { default as MainLayout } from './MainLayout';
export { default as AuthLayout } from './AuthLayout';
export { default as DashboardLayout } from './DashboardLayout';
export { default as CheckoutLayout } from './CheckoutLayout';
export { default as EmptyLayout } from './EmptyLayout';
```

**Usage:**
```javascript
import { MainLayout, DashboardLayout } from './components/templates';
```

## 🚀 Next Steps

Setelah membuat Templates, lanjut ke **Pages** untuk implementasi halaman lengkap!
