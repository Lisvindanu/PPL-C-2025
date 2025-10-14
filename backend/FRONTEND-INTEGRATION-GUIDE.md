# Frontend Integration Guide - DDD Backend
## Cara Frontend Fetch Data dari Backend dengan Domain-Driven Design

---

## 📌 Overview

Backend menggunakan **Domain-Driven Design (DDD)** dengan 4 layer:
1. **Domain** - Business logic & entities
2. **Application** - Use cases
3. **Infrastructure** - Database & external services
4. **Presentation** - API endpoints (Controllers & Routes)

**Frontend hanya perlu tahu Presentation Layer (API Endpoints)** ✅

---

## 🔐 Authentication Flow

### 1. Login

**Frontend:**
```javascript
// services/authService.js
import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_BASE_URL; // http://localhost:5000/api

export const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/users/login`, {
      email,
      password
    });
    return response.data;
  }
};
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "client",
      "profile": {
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  }
}
```

### 2. Setup Axios Interceptor (Auto-attach Token)

```javascript
// utils/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL
});

// Request interceptor - tambahkan token otomatis
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 📦 Service Pattern untuk Setiap Modul

### Struktur Frontend Services

```
frontend/src/services/
├── authService.js          # Modul 1: User Management
├── serviceService.js       # Modul 2: Service Listing
├── orderService.js         # Modul 3: Order & Booking
├── paymentService.js       # Modul 4: Payment Gateway
├── reviewService.js        # Modul 5: Review & Rating
├── chatService.js          # Modul 6: Chat & Notification
├── adminService.js         # Modul 7: Admin Dashboard
└── recommendationService.js # Modul 8: Recommendation
```

---

## 🔥 Modul 1 - User Management

```javascript
// services/authService.js
import api from '../utils/axiosConfig';

export const authService = {
  // Register
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  // Get Profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update Profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  }
};
```

**Usage di Component:**
```javascript
import { authService } from '../services/authService';
import { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## 🛍️ Modul 2 - Service Listing

```javascript
// services/serviceService.js
import api from '../utils/axiosConfig';

export const serviceService = {
  // Get all services with filter
  getServices: async (filters = {}) => {
    const response = await api.get('/services', { params: filters });
    return response.data;
  },

  // Get service detail
  getServiceById: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Create service (freelancer only)
  createService: async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  // Update service
  updateService: async (id, serviceData) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },

  // Delete service
  deleteService: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },

  // Search services
  searchServices: async (query, filters = {}) => {
    const response = await api.get('/services/search', {
      params: { search: query, ...filters }
    });
    return response.data;
  }
};
```

**Usage dengan React Query:**
```javascript
import { useQuery } from '@tanstack/react-query';
import { serviceService } from '../services/serviceService';

function ServiceListPage() {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    page: 1,
    limit: 10
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['services', filters],
    queryFn: () => serviceService.getServices(filters)
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.data.services.map(service => (
        <ServiceCard key={service.serviceId} service={service} />
      ))}
    </div>
  );
}
```

---

## 📦 Modul 3 - Order & Booking

```javascript
// services/orderService.js
import api from '../utils/axiosConfig';

export const orderService = {
  // Create order (client)
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user orders
  getMyOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Get order detail
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Accept order (freelancer)
  acceptOrder: async (id) => {
    const response = await api.put(`/orders/${id}/accept`);
    return response.data;
  },

  // Reject order (freelancer)
  rejectOrder: async (id, reason) => {
    const response = await api.put(`/orders/${id}/reject`, { reason });
    return response.data;
  },

  // Complete order (freelancer)
  completeOrder: async (id) => {
    const response = await api.put(`/orders/${id}/complete`);
    return response.data;
  },

  // Cancel order (client)
  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  }
};
```

---

## 💳 Modul 4 - Payment Gateway

```javascript
// services/paymentService.js
import api from '../utils/axiosConfig';

export const paymentService = {
  // Create payment
  createPayment: async (paymentData) => {
    const response = await api.post('/payments/create', paymentData);
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async (filters = {}) => {
    const response = await api.get('/payments/history', { params: filters });
    return response.data;
  },

  // Get payment detail
  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // Get earnings (freelancer)
  getEarnings: async (filters = {}) => {
    const response = await api.get('/payments/earnings', { params: filters });
    return response.data;
  },

  // Export report (admin)
  exportReport: async (filters) => {
    const response = await api.post('/payments/export', filters, {
      responseType: 'blob' // Important for file download
    });
    return response.data;
  }
};
```

**Payment Flow Example:**
```javascript
function PaymentPage({ orderId }) {
  const handlePayment = async () => {
    try {
      // 1. Create payment
      const result = await paymentService.createPayment({
        orderId,
        amount: 250000,
        method: 'bank_transfer'
      });

      // 2. Redirect ke payment gateway
      window.location.href = result.data.paymentUrl;

    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return <button onClick={handlePayment}>Pay Now</button>;
}
```

---

## ⭐ Modul 5 - Review & Rating

```javascript
// services/reviewService.js
import api from '../utils/axiosConfig';

export const reviewService = {
  // Create review (client)
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Get reviews for service
  getServiceReviews: async (serviceId, page = 1, limit = 10) => {
    const response = await api.get(`/reviews/service/${serviceId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get reviews for freelancer
  getFreelancerReviews: async (freelancerId) => {
    const response = await api.get(`/reviews/freelancer/${freelancerId}`);
    return response.data;
  },

  // Report review
  reportReview: async (id, reason) => {
    const response = await api.post(`/reviews/${id}/report`, { reason });
    return response.data;
  }
};
```

---

## 💬 Modul 6 - Chat & Notification

```javascript
// services/chatService.js
import api from '../utils/axiosConfig';
import io from 'socket.io-client';

// Socket.io connection
let socket;

export const initSocket = (token) => {
  socket = io(process.env.VITE_API_BASE_URL, {
    auth: { token }
  });

  return socket;
};

export const chatService = {
  // REST API
  getConversations: async () => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  getMessages: async (conversationId, page = 1) => {
    const response = await api.get(`/chat/${conversationId}/messages`, {
      params: { page, limit: 50 }
    });
    return response.data;
  },

  markAsRead: async (conversationId) => {
    const response = await api.put(`/chat/${conversationId}/read`);
    return response.data;
  },

  // Socket.io methods
  sendMessage: (conversationId, text) => {
    socket.emit('chat:send-message', { conversationId, text });
  },

  onNewMessage: (callback) => {
    socket.on('chat:new-message', callback);
  },

  onTyping: (callback) => {
    socket.on('chat:typing-indicator', callback);
  },

  disconnect: () => {
    if (socket) socket.disconnect();
  }
};

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  }
};
```

**Chat Component Example:**
```javascript
import { useEffect, useState } from 'react';
import { initSocket, chatService } from '../services/chatService';

function ChatPage({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Connect socket
    const token = localStorage.getItem('token');
    const socket = initSocket(token);

    // Join conversation
    socket.emit('chat:join-conversation', conversationId);

    // Listen for new messages
    chatService.onNewMessage((message) => {
      setMessages(prev => [...prev, message]);
    });

    // Load message history
    chatService.getMessages(conversationId).then(result => {
      setMessages(result.data.messages);
    });

    return () => {
      chatService.disconnect();
    };
  }, [conversationId]);

  const handleSend = () => {
    chatService.sendMessage(conversationId, newMessage);
    setNewMessage('');
  };

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.messageId}>{msg.text}</div>
        ))}
      </div>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

---

## 🛡️ Modul 7 - Admin Dashboard

```javascript
// services/adminService.js
import api from '../utils/axiosConfig';

export const adminService = {
  // Dashboard stats
  getDashboardStats: async (timeRange = 'today') => {
    const response = await api.get('/admin/dashboard', {
      params: { timeRange }
    });
    return response.data;
  },

  // Analytics
  getRevenueAnalytics: async (period, year) => {
    const response = await api.get('/admin/analytics/revenue', {
      params: { period, year }
    });
    return response.data;
  },

  getUserAnalytics: async () => {
    const response = await api.get('/admin/analytics/users');
    return response.data;
  },

  // User management
  getUsers: async (filters = {}) => {
    const response = await api.get('/admin/users', { params: filters });
    return response.data;
  },

  blockUser: async (userId, reason) => {
    const response = await api.put(`/admin/users/${userId}/block`, { reason });
    return response.data;
  },

  // Reports
  exportReport: async (reportType, format, filters) => {
    const response = await api.post('/admin/reports/export', {
      reportType,
      format,
      filters
    }, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Fraud alerts
  getFraudAlerts: async () => {
    const response = await api.get('/admin/fraud-alerts');
    return response.data;
  }
};
```

---

## 🎯 Modul 8 - Recommendation

```javascript
// services/recommendationService.js
import api from '../utils/axiosConfig';

export const recommendationService = {
  // Get personalized recommendations
  getRecommendations: async (limit = 10) => {
    const response = await api.get('/recommendations', { params: { limit } });
    return response.data;
  },

  // Get similar services
  getSimilarServices: async (serviceId) => {
    const response = await api.get(`/recommendations/similar/${serviceId}`);
    return response.data;
  },

  // Get popular services
  getPopularServices: async () => {
    const response = await api.get('/recommendations/popular');
    return response.data;
  },

  // Favorites
  addToFavorites: async (serviceId) => {
    const response = await api.post(`/recommendations/favorites/${serviceId}`);
    return response.data;
  },

  removeFromFavorites: async (serviceId) => {
    const response = await api.delete(`/recommendations/favorites/${serviceId}`);
    return response.data;
  },

  getFavorites: async () => {
    const response = await api.get('/recommendations/favorites');
    return response.data;
  },

  // Track click (call otomatis saat user klik recommendation)
  trackClick: async (serviceId) => {
    await api.post('/recommendations/track-click', { serviceId });
  }
};
```

---

## 🏗️ Recommended Frontend Architecture

```
src/
├── services/          # API calls ke backend
│   ├── authService.js
│   ├── serviceService.js
│   ├── orderService.js
│   ├── paymentService.js
│   └── ...
├── hooks/             # Custom hooks
│   ├── useAuth.js
│   ├── useOrder.js
│   └── usePayment.js
├── contexts/          # Global state (Context API)
│   └── AuthContext.js
├── utils/
│   └── axiosConfig.js # Axios setup dengan interceptor
└── pages/             # Page components
```

---

## 🔑 Best Practices

### 1. ✅ Gunakan Custom Hooks
```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await authService.getProfile();
        setUser(result.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem('token')) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  return { user, loading };
};
```

### 2. ✅ Error Handling
```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message || 'Something went wrong';
  } else if (error.request) {
    // No response from server
    return 'Network error. Please check your connection.';
  } else {
    return error.message;
  }
};
```

### 3. ✅ Loading States
```javascript
function ServiceListPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const result = await serviceService.getServices();
        setServices(result.data.services);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return <ServiceList services={services} />;
}
```

---

## 📝 Summary

Frontend **tidak perlu tahu** tentang Domain Layer, Application Layer, atau Infrastructure Layer.

Frontend hanya perlu:
1. **Call API endpoints** (Presentation Layer)
2. **Handle responses** (success/error)
3. **Update UI**

Backend DDD architecture membuat code lebih maintainable, tapi **tidak mengubah cara frontend consume API**.

**Port Backend:** `5000`
**Port Frontend:** `3000`

Done! 🚀
