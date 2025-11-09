# Frontend Architecture Overview - PPL-C-2025

## 1. TECHNOLOGY STACK

### Core Framework
- **Framework**: React 18.3.1 (via Vite)
- **Build Tool**: Vite 5.2.0
- **Routing**: React Router DOM v6.30.1
- **State Management**: Zustand 4.5.2 (available, but currently using local state + localStorage)
- **HTTP Client**: Axios 1.7.2
- **API Query**: TanStack React Query 5.40.0

### Styling
- **CSS Framework**: Tailwind CSS 3.4.18
- **Approach**: Utility-first CSS with Tailwind classes (NOT CSS modules, NOT styled-components)
- **Icons**: 
  - FontAwesome Free 7.1.0 (via CSS)
  - Lucide React 0.546.0 (SVG icons library)
- **Animation**: Framer Motion 12.23.24

### Charts & Visualization
- **Recharts**: 3.3.0

### Others
- **Environment**: Vite with env variables via import.meta.env
- **Node**: ES modules (type: "module" in package.json)

---

## 2. FOLDER STRUCTURE

```
frontend/
├── src/
│   ├── components/                 # Atomic design components
│   │   ├── atoms/                  # Base UI elements (28 files)
│   │   │   ├── Avatar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Chip.jsx
│   │   │   ├── Icon.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Label.jsx
│   │   │   ├── TextArea.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── TextField.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── Text.jsx
│   │   │   ├── PasswordInput.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── ...more
│   │   │
│   │   ├── molecules/              # Composed components (39 files)
│   │   │   ├── PricingFormCard.jsx
│   │   │   ├── MediaFormCard.jsx
│   │   │   ├── ServiceCard.jsx
│   │   │   ├── ServiceCardItem.jsx
│   │   │   ├── ProfileHeader.jsx
│   │   │   ├── SkillTag.jsx
│   │   │   ├── DashboardHeaderBar.jsx
│   │   │   ├── NavHeader.jsx
│   │   │   ├── NavKategori.jsx
│   │   │   ├── NavService.jsx
│   │   │   ├── UserMenu.jsx
│   │   │   ├── ServiceHeader.jsx
│   │   │   └── ...more
│   │   │
│   │   ├── organisms/              # Complex components (24 files)
│   │   │   ├── Navbar.jsx          # Main navigation header
│   │   │   ├── Header.jsx          # Dashboard header
│   │   │   ├── Sidebar.jsx         # Dashboard sidebar
│   │   │   ├── EditForm.jsx
│   │   │   ├── ProfileInfo.jsx
│   │   │   ├── SkillsSection.jsx
│   │   │   ├── PortfolioSection.jsx
│   │   │   ├── OrderChart.jsx      # Charts
│   │   │   ├── UserChart.jsx       # Charts
│   │   │   ├── StatsGrid.jsx
│   │   │   ├── ReviewsSection.jsx
│   │   │   ├── ToastProvider.jsx   # Toast notifications
│   │   │   ├── RatingModal.jsx     # Modals
│   │   │   ├── LoadingOverlay.jsx
│   │   │   └── ...more
│   │   │
│   │   └── templates/              # Page layouts (4 files)
│   │       ├── DashboardLayout.jsx
│   │       ├── ProfileLayout.jsx
│   │       ├── AuthLayout.jsx
│   │       ├── LandingPageTemplate.jsx
│   │       └── ProtectedRoute.jsx  # Route protection wrapper
│   │
│   ├── pages/                      # Page components (user-facing)
│   │   ├── Landing.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterClientPage.jsx
│   │   ├── RegisterFreelancerPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── AdminDashboardPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── ServiceDetailPage.jsx
│   │   ├── FavoritePage.jsx
│   │   ├── SavedPage.jsx
│   │   ├── RiwayatPesananPage.jsx
│   │   ├── freelance/
│   │   │   ├── ServicePage.jsx
│   │   │   └── ServiceCreatePage.jsx
│   │   └── jobs/
│   │       └── ServiceDetailPage.jsx
│   │
│   ├── services/                   # API service calls
│   │   ├── authService.js          # Auth endpoints
│   │   ├── adminService.js         # Admin endpoints
│   │   ├── favoriteService.js      # Favorite endpoints
│   │   └── (payment service TBD)
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.js              # Authentication hook
│   │   └── useUserIdentity.jsx     # User identity hook
│   │
│   ├── utils/                      # Utility functions
│   │   ├── axiosConfig.js          # Axios instance with interceptors
│   │   ├── servicesData.js         # Mock data (development)
│   │   └── validators.js           # Form validators
│   │
│   ├── styles/                     # Global styles
│   │   ├── auth.css                # Auth page styles
│   │   └── fonts.css               # Font imports
│   │
│   ├── App.jsx                     # Main app router definition
│   └── main.jsx                    # React entry point
│
├── public/                         # Static assets
├── index.html                      # HTML entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 3. ROUTING STRUCTURE

Uses **React Router v6** with the following structure:

```
/                           → Landing page (public)
/login                      → Login page (public)
/register/client            → Client registration (public)
/register/freelancer        → Freelancer registration (public)
/dashboard                  → User dashboard (protected)
/admin/dashboard            → Admin dashboard (protected)
/profile                    → User profile (protected)
/freelance/service          → Freelancer services list (protected)
/freelance/service/new      → Create new service (protected)
/jobs/:slug                 → Job detail page (protected)

* (catch-all)              → Redirects to /
```

**Protection**: Uses `ProtectedRoute` wrapper component that checks for auth token in localStorage and redirects to /login if missing.

---

## 4. COMPONENT ARCHITECTURE (ATOMIC DESIGN)

### Hierarchy:
```
Atoms (base UI) → Molecules (composed) → Organisms (complex) → Templates (layouts) → Pages (routes)
```

### Atoms (Base Level)
Smallest, reusable UI elements with minimal props.

**Example: Button.jsx**
```jsx
export default function Button({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  ...props 
}) {
  const variants = {
    primary: 'bg-[#4782BE] text-white hover:bg-[#9DBBDD]',
    outline: 'border-2 border-[#4782BE] text-[#1D375B] hover:bg-[#D8E3F3]',
    neutral: 'bg-[#9DBBDD] text-white hover:bg-[#4782BE]',
    role: 'bg-[#FFFFFF] text-[#1D375B] hover:bg-[#D8E3F3] border-2 border-[#9DBBDD]'
  }
  return (
    <button 
      type={type} 
      className={`px-6 py-3 rounded-full font-medium transition ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  )
}
```

**Example: Input.jsx**
```jsx
export default function Input({ className = "", ...props }) {
  return (
    <input 
      className={`w-full rounded-md bg-[#F5F0EB] text-[#2E2A28] placeholder-[#9C8C84] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#696969] border border-[#B3B3B3] ${className}`} 
      {...props} 
    />
  );
}
```

### Molecules
Composition of atoms into functional units.

**Example: PricingFormCard.jsx**
```jsx
export default function PricingFormCard({ values, onChange, onCancel, onSubmit }) {
  return (
    <Card
      className="h-full flex flex-col"
      title="Harga"
      subtitle="Izinkan Pelanggan membayar sesuai keinginan mereka"
    >
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <Label>Waktu Pengerjaan <span className="text-red-500">*</span></Label>
          <SelectBox
            value={values.durasi || ""}
            onChange={(e) => onChange({ durasi: e.target.value })}
          >
            {/* options */}
          </SelectBox>
        </div>
        {/* more fields */}
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" onClick={onCancel}>Membatalkan</Button>
          <Button onClick={onSubmit}>Menambahkan</Button>
        </div>
      </div>
    </Card>
  );
}
```

### Organisms
Complex components combining multiple molecules.

**Example: Navbar.jsx**
```jsx
export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-200 bg-white/95 backdrop-blur">
      <NavHeader />
      <NavKategori />
      <NavService />
    </header>
  );
}
```

### Templates
Page layout structures without business logic.

**Example: DashboardLayout.jsx**
```jsx
export const DashboardLayout = ({ stats, userData, orderData, activeMenu = 'dashboard' }) => (
  <div className="flex h-screen bg-skill-primary">
    <Sidebar activeMenu={activeMenu} />
    <div className="flex-1 overflow-auto">
      <Header />
      <div className="p-6">
        <StatsGrid stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <UserChart data={userData} />
          <OrderChart data={orderData} />
        </div>
      </div>
    </div>
  </div>
);
```

### Pages
Full-page components that combine templates with business logic and state.

**Example: ProfilePage.jsx**
```jsx
export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({...})

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => { /* logic */ }
  const handleSave = async () => { /* logic */ }
  
  return (
    <>
      <ProfileLoadingOverlay loading={loading} />
      <ProfileLayout 
        profile={profile}
        isEditing={isEditing}
        loading={loading}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onLogout={handleLogout}
        onProfileChange={handleProfileChange}
      />
    </>
  )
}
```

---

## 5. STYLING APPROACH

### **Tailwind CSS Only** (Utility-first)
- All styling done with Tailwind utility classes directly in JSX
- NO CSS modules
- NO styled-components
- NO separate .css files (except global styles)

### Tailwind Configuration (tailwind.config.js)
```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        skill: {
          primary: "#D8E3F3",
          secondary: "#9DBBDD",
          tertiary: "#4782BE",
          bg: "#FFFFFF",
          dark: "#1D375B",
          chart1: "#4782BE",
          chart2: "1D375B",
        },
      },
    },
  },
  plugins: [...],
};
```

### Custom Color Palette
- **Primary Blue**: #3B82F6, #2563EB, #1D4ED8
- **Skill Colors**: Custom theme with #4782BE, #9DBBDD, #D8E3F3
- **Status Colors**: success (#10b981), warning (#f59e0b), danger (#ef4444)

### Common Patterns
```jsx
// Container with spacing
<div className="max-w-7xl mx-auto px-4 py-8">

// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Flexbox
<div className="flex items-center justify-between gap-3">

// Cards
<div className="bg-white rounded-lg shadow-sm p-8">

// Responsive text
<h1 className="text-3xl font-bold text-gray-900 mb-2">

// Buttons with variants
<button className="px-6 py-3 rounded-full font-medium transition">

// Forms
<input className="w-full rounded-md bg-[#F5F0EB] ... focus:ring-2" />
```

---

## 6. STATE MANAGEMENT

### Current Approach (Hybrid)
- **Local State**: useState for component-level state
- **Browser Storage**: localStorage for persistence (token, user data)
- **No Global Store**: Not using Zustand despite being available
- **Context/Providers**: ToastProvider for notifications

### Data Flow Example (ProfilePage)
```
User Interaction
    ↓
handleSave() [state update]
    ↓
API call (fetch/axios)
    ↓
localStorage update
    ↓
Component re-render
```

### LocalStorage Keys
- `token` - JWT authentication token
- `user` - User object (JSON stringified)

---

## 7. API INTEGRATION

### Axios Configuration (utils/axiosConfig.js)
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - adds auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }, ...
)

// Response interceptor - handles 401 redirects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### Service Pattern (authService.js)
```javascript
export const authService = {
  async login({ email, password }) {
    try {
      const response = await api.post('/users/login', { email, password })
      if (response.data.success) {
        const { token, user } = response.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        return { success: true, data: { token, user } }
      }
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        errors: error.response?.data?.errors || []
      }
    }
  },
  // ...other methods
}
```

### Custom Hooks for API (useAuth.js)
```javascript
export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (payload) => {
    setLoading(true); setError(null)
    try {
      const { data } = await authService.login(payload)
      setLoading(false)
      return user
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed')
      setLoading(false)
      throw e
    }
  }
  
  return { login, register, getProfile, updateProfile, logout, loading, error }
}
```

---

## 8. BACKEND PAYMENT INTEGRATION

### Payment Endpoints Available
```
POST   /api/payments/create              - Create payment
GET    /api/payments/:id                 - Get payment by ID
GET    /api/payments/order/:orderId      - Get payment by order
POST   /api/payments/webhook             - Handle payment gateway webhook
POST   /api/payments/escrow/release      - Release escrow funds
GET    /api/payments/escrow/:id          - Get escrow details
POST   /api/payments/withdraw            - Create withdrawal request
GET    /api/payments/withdrawals/:id     - Get withdrawal
GET    /api/payments/:id/invoice         - Get invoice PDF
POST   /api/payments/:id/send-invoice    - Send invoice email
GET    /api/payments/analytics/summary   - Payment analytics
POST   /api/payments/:id/refund          - Request refund
PUT    /api/payments/refund/:id/process  - Process refund (admin)
GET    /api/payments/refunds             - Get all refunds (admin)
POST   /api/payments/:id/retry           - Retry failed payment
```

### Payment Request Body Example
```javascript
{
  pesanan_id: number,          // Order ID
  jumlah: number,              // Amount
  metode_pembayaran: string,   // Payment method (e.g., "credit_card", "bank_transfer")
  channel: string              // Payment channel (e.g., "visa", "bca")
}
```

### Payment Response Example
```javascript
{
  success: true,
  data: {
    id: number,
    pesanan_id: number,
    user_id: number,
    jumlah: number,
    status: "pending|berhasil|gagal",
    metode_pembayaran: string,
    channel: string,
    token: string,           // Payment gateway token
    payment_url: string,     // Payment page URL from gateway
    created_at: datetime,
    updated_at: datetime
  }
}
```

---

## 9. EXISTING PAYMENT-RELATED COMPONENTS

Currently NO payment-related pages or components exist in the frontend. The payment integration is backend-ready but frontend implementation is needed.

### Related Pages/Sections:
- **AdminDashboardPage.jsx** - Has `OrderChart` component for visualizing order data
- **DashboardPage.jsx** - Cards linking to orders (currently "Coming Soon")
- **RiwayatPesananPage.jsx** - Order history page (exists but minimal)

### Available Components to Reuse:
- OrderCard (molecules) - Display order information
- OrderChart (organisms) - Visualize order statistics
- OrderConfirmModal (molecules) - Confirm actions

---

## 10. PATTERNS & BEST PRACTICES

### Component Naming & Organization
- **Atoms**: Simple, single-purpose components
- **Molecules**: Combine 2-3 atoms into reusable units
- **Organisms**: Complex sections combining molecules
- **Templates**: Layout structure without business logic
- **Pages**: Full-page components with hooks and state

### Props Pattern
```jsx
// Always provide default values
export default function Component({ 
  prop1 = 'default', 
  prop2 = false,
  className = '',
  children,
  ...props 
}) {
  return <div className={`base-styles ${className}`} {...props}>{children}</div>
}
```

### State Management Pattern
```jsx
const [state, setState] = useState(initialValue)

// Update multiple properties
setState(prev => ({ ...prev, ...updates }))

// Loading and error states
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
```

### Event Handler Pattern
```jsx
const handleAction = async () => {
  try {
    setLoading(true)
    setError(null)
    const result = await apiCall()
    // Update state
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
```

### Form Pattern
```jsx
const [form, setForm] = useState({ field1: '', field2: '' })

function handleChange(updates) {
  setForm(prev => ({ ...prev, ...updates }))
}

// In JSX
<Input 
  value={form.field1} 
  onChange={(e) => handleChange({ field1: e.target.value })} 
/>
```

### Conditional Rendering
```jsx
{loading && <Spinner />}
{error && <ErrorMessage message={error} />}
{data && <DataDisplay data={data} />}

{isEditing ? <EditForm /> : <ViewMode />}
```

### ProtectedRoute Pattern
```jsx
// In App.jsx
<Route
  path="/protected-page"
  element={
    <ProtectedRoute>
      <ProtectedPage />
    </ProtectedRoute>
  }
/>
```

---

## 11. ENVIRONMENT CONFIGURATION

### .env Variables
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Access in Code
```javascript
import.meta.env.VITE_API_BASE_URL
```

---

## 12. FONT CONFIGURATION

### Fonts Used
- **Poppins** - For titles/headings
- **Inter** - For body text

Both imported in `styles/fonts.css` via @font-face rules.

---

## 13. ICONS

### FontAwesome (CSS-based)
```jsx
import '@fortawesome/fontawesome-free/css/all.min.css'

// Usage in HTML
<i className="fas fa-icon-name"></i>
```

### Lucide React (SVG Components)
```jsx
import { CircleUser, Bell, ChevronDown } from 'lucide-react'

// Usage in JSX
<CircleUser size={20} className="text-gray-800" />
```

---

## 14. DEVELOPMENT WORKFLOW

### Start Dev Server
```bash
npm run dev
# Server runs on http://localhost:3000
```

### Build for Production
```bash
npm run build
# Output in dist/ directory
```

### Preview Production Build
```bash
npm run preview
```

---

## SUMMARY FOR PAYMENT PAGES

To create payment pages following exact patterns:

1. **Create payment service** in `src/services/paymentService.js` using same axios pattern
2. **Create atoms** for payment-specific inputs (e.g., CardInput, AmountInput)
3. **Create molecules** for forms (e.g., PaymentFormCard, RefundRequestCard)
4. **Create organisms** for complex sections (e.g., PaymentHistory, EscrowStatus)
5. **Create templates** if needed for payment layouts
6. **Create pages** (e.g., PaymentPage.jsx, CheckoutPage.jsx, PaymentHistoryPage.jsx)
7. **Use Tailwind only** for styling (no CSS modules or styled-components)
8. **Follow component hierarchy**: atoms → molecules → organisms → templates → pages
9. **Handle state** with useState, loading/error states, and localStorage
10. **Add routes** to App.jsx with ProtectedRoute wrapper
11. **Use existing atoms**: Button, Input, Card, Text, Icon, etc.
12. **Follow naming**: PascalCase for components, camelCase for functions
13. **Error handling**: Try-catch in async functions, error state management
14. **Loading states**: Show spinners/overlays during API calls

