# Organisms - Komponen Kompleks

## 📌 Apa itu Organisms?

**Organisms** adalah kombinasi dari **Atoms** dan **Molecules** yang membentuk section kompleks dengan business logic. Organisms sudah bisa standalone sebagai bagian fungsional dari halaman.

## 📂 Struktur Folder

```
organisms/
├── Header.jsx                 # Navigation header
├── Footer.jsx                 # Footer section
├── ServiceList.jsx            # List of services with filters
├── PaymentForm.jsx            # Complete payment form
├── OrderList.jsx              # List of orders with filters
├── ChatBox.jsx                # Chat interface
├── ReviewList.jsx             # Review list with pagination
├── ProfileForm.jsx            # User profile editor
├── ServiceForm.jsx            # Service creation/edit form
├── NotificationPanel.jsx      # Notification dropdown
└── DashboardStats.jsx         # Dashboard statistics cards
```

## 🧱 Contoh Implementasi

### Header.jsx
```javascript
import { Button, Badge } from '../atoms';
import { SearchBar } from '../molecules';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

const Header = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">
              SkillConnect
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchBar
              placeholder="Search services..."
              onSearch={(query) => navigate(`/search?q=${query}`)}
            />
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 hover:bg-gray-100 rounded-full">
                  <BellIcon className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="danger"
                      size="sm"
                      className="absolute top-0 right-0"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </button>

                {/* Messages */}
                <button className="relative p-2 hover:bg-gray-100 rounded-full">
                  <MessageIcon className="w-6 h-6" />
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden md:block">{user.name}</span>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                      <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                        Profile
                      </a>
                      <a href="/orders" className="block px-4 py-2 hover:bg-gray-100">
                        My Orders
                      </a>
                      {user.role === 'freelancer' && (
                        <a href="/my-services" className="block px-4 py-2 hover:bg-gray-100">
                          My Services
                        </a>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="primary" onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

---

### PaymentForm.jsx
```javascript
import { FormField, Card, Modal } from '../molecules';
import { Button, Select, Badge } from '../atoms';
import { useState } from 'react';
import { usePayment } from '../../hooks/usePayment';

const PaymentForm = ({ order, onSuccess }) => {
  const { processPayment, loading } = usePayment();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer', fee: 4500 },
    { value: 'e_wallet', label: 'E-Wallet (GoPay, OVO, Dana)', fee: 0 },
    { value: 'credit_card', label: 'Credit Card', fee: order.amount * 0.029 },
    { value: 'qris', label: 'QRIS', fee: 0 },
  ];

  const selectedMethodData = paymentMethods.find(m => m.value === selectedMethod);
  const totalAmount = order.amount + (selectedMethodData?.fee || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      const result = await processPayment({
        orderId: order.id,
        paymentMethod: selectedMethod,
        amount: totalAmount,
      });

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        onSuccess(result);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card title="Payment Details">
          {/* Order Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Order Summary</h4>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium">{order.service.title}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium">
                Rp {order.amount.toLocaleString('id-ID')}
              </span>
            </div>
            {selectedMethodData && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Payment Fee:</span>
                <span className="font-medium">
                  Rp {selectedMethodData.fee.toLocaleString('id-ID')}
                </span>
              </div>
            )}
            <hr className="my-3" />
            <div className="flex justify-between">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-blue-600 text-lg">
                Rp {totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Select Payment Method
            </label>
            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setSelectedMethod(method.value)}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all
                    ${selectedMethod === method.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{method.label}</span>
                    {method.fee > 0 && (
                      <Badge variant="warning" size="sm">
                        +Rp {method.fee.toLocaleString('id-ID')}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={!selectedMethod || loading}
          >
            {loading ? 'Processing...' : 'Continue to Payment'}
          </Button>
        </Card>
      </form>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Payment"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm} disabled={loading}>
              {loading ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </>
        }
      >
        <p className="mb-4">
          You are about to make a payment of:
        </p>
        <p className="text-2xl font-bold text-blue-600 mb-4">
          Rp {totalAmount.toLocaleString('id-ID')}
        </p>
        <p className="text-sm text-gray-600">
          Payment method: {selectedMethodData?.label}
        </p>
      </Modal>
    </>
  );
};

export default PaymentForm;
```

---

### ServiceList.jsx
```javascript
import { ServiceCard, SearchBar, Pagination } from '../molecules';
import { Select, Spinner } from '../atoms';
import { useState, useEffect } from 'react';
import { useServices } from '../../hooks/useServices';

const ServiceList = ({ category }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: category || '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sortBy: 'popular',
    page: 1,
    limit: 12,
  });

  const { services, loading, pagination, fetchServices } = useServices();

  useEffect(() => {
    fetchServices(filters);
  }, [filters]);

  const handleSearch = (query) => {
    setFilters({ ...filters, search: query, page: 1 });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search & Filters */}
      <div className="mb-8">
        <SearchBar
          placeholder="Search services..."
          onSearch={handleSearch}
          className="mb-4"
        />

        <div className="flex flex-wrap gap-4">
          <Select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            options={[
              { value: 'popular', label: 'Most Popular' },
              { value: 'price_asc', label: 'Price: Low to High' },
              { value: 'price_desc', label: 'Price: High to Low' },
              { value: 'rating', label: 'Highest Rating' },
              { value: 'newest', label: 'Newest' },
            ]}
            className="w-48"
          />

          <Select
            value={filters.minRating}
            onChange={(e) => handleFilterChange('minRating', e.target.value)}
            options={[
              { value: '', label: 'All Ratings' },
              { value: '4', label: '4+ Stars' },
              { value: '3', label: '3+ Stars' },
            ]}
            className="w-40"
          />
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <p className="text-gray-600 mb-4">
          Found {pagination.total} services
        </p>
      )}

      {/* Services Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : services.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={(id) => navigate(`/services/${id}`)}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={filters.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => handleFilterChange('page', page)}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No services found</p>
          <p className="text-gray-500 mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
```

---

### ChatBox.jsx
```javascript
import { Input, Button, Spinner } from '../atoms';
import { Card } from '../molecules';
import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { formatTime } from '../../utils/dateUtils';

const ChatBox = ({ conversationId }) => {
  const { messages, loading, sendMessage, markAsRead } = useChat(conversationId);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
    markAsRead();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[70%] rounded-lg p-3
                  ${msg.isMine
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                  }
                `}
              >
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.isMine ? 'text-blue-200' : 'text-gray-500'}`}>
                  {formatTime(msg.createdAt)}
                  {msg.isMine && msg.isRead && ' ✓✓'}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg px-4 py-2">
              <span className="text-gray-600">typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t p-4 flex gap-2">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" variant="primary">
          Send
        </Button>
      </form>
    </Card>
  );
};

export default ChatBox;
```

---

## ✅ Prinsip Organisms

1. **Complex Components** - Kombinasi atoms, molecules, dan logic
2. **Business Logic** - Boleh ada state management dan API calls
3. **Feature-Complete** - Bisa standalone sebagai feature
4. **Reusable** - Bisa dipakai di multiple pages
5. **Context-Aware** - Bisa gunakan custom hooks dan context

## 📦 Export Pattern

`organisms/index.js`:
```javascript
export { default as Header } from './Header';
export { default as Footer } from './Footer';
export { default as ServiceList } from './ServiceList';
export { default as PaymentForm } from './PaymentForm';
export { default as OrderList } from './OrderList';
export { default as ChatBox } from './ChatBox';
```

**Usage:**
```javascript
import { Header, ServiceList, PaymentForm } from './components/organisms';
```

## 🚀 Next Steps

Setelah membuat Organisms, lanjut ke **Templates** untuk layout pages!
