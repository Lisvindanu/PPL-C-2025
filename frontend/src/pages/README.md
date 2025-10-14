# Pages - Complete Pages

## 📌 Apa itu Pages?

**Pages** adalah halaman lengkap yang menggabungkan **Templates**, **Organisms**, **Molecules**, dan **Atoms**. Pages adalah **final product** yang dilihat user dan berisi **business logic lengkap**.

## 📂 Struktur Folder

```
pages/
├── HomePage.jsx              # Landing page
├── LoginPage.jsx             # Login page
├── RegisterPage.jsx          # Registration page
├── ServicesPage.jsx          # Service listing page
├── ServiceDetailPage.jsx     # Service detail page
├── CheckoutPage.jsx          # Checkout flow
├── PaymentCallbackPage.jsx   # Payment callback
├── DashboardPage.jsx         # Dashboard overview
├── MyOrdersPage.jsx          # User's orders
├── OrderDetailPage.jsx       # Order detail
├── MyServicesPage.jsx        # Freelancer services
├── CreateServicePage.jsx     # Create new service
├── MessagesPage.jsx          # Chat/Messages
├── ProfilePage.jsx           # User profile
└── NotFoundPage.jsx          # 404 page
```

## 🧱 Contoh Implementasi

### HomePage.jsx
```javascript
import { Button } from '../components/atoms';
import { SearchBar, ServiceCard } from '../components/molecules';
import { ServiceList } from '../components/organisms';
import { useServices } from '../hooks/useServices';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const { popularServices, loading } = useServices();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Find The Perfect Freelancer For Your Project
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Connect with talented professionals across various fields
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar
              placeholder="Search for services..."
              onSearch={(query) => navigate(`/services?q=${query}`)}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate(`/services?category=${cat.slug}`)}
                className="p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold">{cat.name}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Popular Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {popularServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={(id) => navigate(`/services/${id}`)}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => navigate('/services')}
            >
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of satisfied clients and freelancers
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="primary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-blue-700"
              onClick={() => navigate('/services')}
            >
              Browse Services
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
```

---

### ServiceDetailPage.jsx
```javascript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Badge, Spinner } from '../components/atoms';
import { Card, RatingStars, PriceTag } from '../components/molecules';
import { ReviewList } from '../components/organisms';
import { useService } from '../hooks/useService';
import { useAuth } from '../hooks/useAuth';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { service, loading, error } = useService(id);
  const [selectedPackage, setSelectedPackage] = useState('basic');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
        <Button onClick={() => navigate('/services')}>
          Back to Services
        </Button>
      </div>
    );
  }

  const handleOrder = () => {
    if (!user) {
      navigate('/login', { state: { from: `/services/${id}` } });
      return;
    }
    navigate(`/checkout/${id}`, { state: { package: selectedPackage } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Service Details */}
        <div className="lg:col-span-2">
          {/* Images */}
          <div className="mb-6">
            <img
              src={service.thumbnail}
              alt={service.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* Title & Freelancer */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="info">{service.category.name}</Badge>
              {service.featured && <Badge variant="warning">Featured</Badge>}
            </div>
            <h1 className="text-3xl font-bold mb-4">{service.title}</h1>

            <div className="flex items-center gap-4 mb-4">
              <img
                src={service.freelancer.avatar}
                alt={service.freelancer.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{service.freelancer.name}</h3>
                <RatingStars
                  rating={service.freelancer.rating}
                  count={service.freelancer.reviewCount}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <Card title="About This Service">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: service.description }}
            />
          </Card>

          {/* Reviews */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>
            <ReviewList serviceId={id} />
          </div>
        </div>

        {/* Right Column - Order Box */}
        <div>
          <div className="sticky top-24">
            <Card>
              {/* Package Selection */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Select Package</h3>
                <div className="space-y-2">
                  {service.packages.map(pkg => (
                    <button
                      key={pkg.type}
                      onClick={() => setSelectedPackage(pkg.type)}
                      className={`
                        w-full p-4 border-2 rounded-lg text-left transition-all
                        ${selectedPackage === pkg.type
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold capitalize">{pkg.type}</h4>
                        <PriceTag amount={pkg.price} showPrefix={false} size="sm" />
                      </div>
                      <p className="text-sm text-gray-600">{pkg.description}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        ⏱ {pkg.deliveryDays} days delivery
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Button */}
              <Button
                variant="primary"
                className="w-full mb-3"
                onClick={handleOrder}
              >
                Continue (Rp {service.packages.find(p => p.type === selectedPackage)?.price.toLocaleString('id-ID')})
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/messages?freelancer=${service.freelancer.id}`)}
              >
                Contact Freelancer
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
```

---

### CheckoutPage.jsx
```javascript
import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CheckoutLayout } from '../components/templates';
import { PaymentForm } from '../components/organisms';
import { Card, FormField } from '../components/molecules';
import { Button } from '../components/atoms';
import { useService } from '../hooks/useService';
import { useOrder } from '../hooks/useOrder';

const CheckoutPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { service } = useService(id);
  const { createOrder, loading } = useOrder();

  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({
    serviceId: id,
    packageType: location.state?.package || 'basic',
    notes: '',
    requirements: '',
  });
  const [orderId, setOrderId] = useState(null);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    try {
      const order = await createOrder(orderData);
      setOrderId(order.id);
      setStep(2);
    } catch (error) {
      alert(error.message);
    }
  };

  const handlePaymentSuccess = () => {
    setStep(3);
  };

  return (
    <CheckoutLayout currentStep={step} totalSteps={3}>
      {step === 1 && (
        <Card title="Order Details">
          <form onSubmit={handleOrderSubmit}>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">{service.title}</h4>
              <p className="text-sm text-gray-600 mb-2">
                Package: <span className="capitalize">{orderData.packageType}</span>
              </p>
              <p className="text-lg font-bold text-blue-600">
                Rp {service.packages.find(p => p.type === orderData.packageType)?.price.toLocaleString('id-ID')}
              </p>
            </div>

            <FormField
              label="Project Requirements"
              name="requirements"
              type="textarea"
              value={orderData.requirements}
              onChange={(e) => setOrderData({ ...orderData, requirements: e.target.value })}
              placeholder="Describe your project requirements..."
              required
            />

            <FormField
              label="Additional Notes"
              name="notes"
              type="textarea"
              value={orderData.notes}
              onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
              placeholder="Any additional information for the freelancer..."
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating Order...' : 'Continue to Payment'}
            </Button>
          </form>
        </Card>
      )}

      {step === 2 && orderId && (
        <PaymentForm
          orderId={orderId}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {step === 3 && (
        <Card>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your order has been placed successfully. The freelancer will start working on your project soon.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="primary"
                onClick={() => navigate(`/dashboard/orders/${orderId}`)}
              >
                View Order
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      )}
    </CheckoutLayout>
  );
};

export default CheckoutPage;
```

---

### DashboardPage.jsx
```javascript
import { Card } from '../components/molecules';
import { DashboardStats } from '../components/organisms';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();
  const { stats, recentOrders, loading } = useDashboard();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Welcome back, {user.firstName}!
      </h1>

      {/* Stats Cards */}
      <DashboardStats stats={stats} role={user.role} />

      {/* Recent Orders */}
      <div className="mt-8">
        <Card title="Recent Orders">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : recentOrders.length > 0 ? (
            <div className="divide-y">
              {recentOrders.map(order => (
                <div key={order.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{order.service.title}</h4>
                    <p className="text-sm text-gray-600">
                      {order.createdAt}
                    </p>
                  </div>
                  <Badge variant={order.status === 'completed' ? 'success' : 'warning'}>
                    {order.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No orders yet
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
```

---

## ✅ Page Best Practices

1. **Single Responsibility** - 1 page = 1 route/feature
2. **Use Custom Hooks** - Data fetching, state management
3. **Error Handling** - Loading states, error boundaries
4. **SEO Friendly** - Page titles, meta tags
5. **Responsive Design** - Mobile & desktop support

## 📦 Route Configuration

`App.jsx`:
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout, AuthLayout, DashboardLayout } from './components/templates';
import * as Pages from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Pages.HomePage />} />
          <Route path="/services" element={<Pages.ServicesPage />} />
          <Route path="/services/:id" element={<Pages.ServiceDetailPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Pages.LoginPage />} />
        <Route path="/register" element={<Pages.RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Pages.DashboardPage />} />
            <Route path="/dashboard/orders" element={<Pages.MyOrdersPage />} />
          </Route>
        </Route>

        {/* Checkout */}
        <Route path="/checkout/:id" element={<Pages.CheckoutPage />} />

        {/* 404 */}
        <Route path="*" element={<Pages.NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 📄 Export Pattern

`pages/index.js`:
```javascript
export { default as HomePage } from './HomePage';
export { default as LoginPage } from './LoginPage';
export { default as RegisterPage } from './RegisterPage';
export { default as ServicesPage } from './ServicesPage';
export { default as ServiceDetailPage } from './ServiceDetailPage';
export { default as CheckoutPage } from './CheckoutPage';
export { default as DashboardPage } from './DashboardPage';
export { default as NotFoundPage } from './NotFoundPage';
```
