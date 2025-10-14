# Services - API Integration Layer

## 📌 Apa itu Services?

**Services** adalah layer untuk berkomunikasi dengan **Backend API**. Services menangani semua **HTTP requests**, **error handling**, dan **data transformation**. Ini adalah single source of truth untuk semua API calls.

## 📂 Struktur Folder

```
services/
├── api.js                 # Axios instance & interceptors
├── authService.js         # Authentication API
├── userService.js         # User management API
├── serviceService.js      # Service listing API
├── orderService.js        # Order management API
├── paymentService.js      # Payment gateway API
├── chatService.js         # Chat & messaging API
├── reviewService.js       # Review & rating API
└── notificationService.js # Notification API
```

## 🧱 Contoh Implementasi

### api.js - Base API Configuration
```javascript
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      throw new Error('You do not have permission to perform this action');
    }

    // Handle network errors
    if (!error.response) {
      throw new Error('Network error. Please check your connection');
    }

    // Return error message from API
    const message = error.response?.data?.message || 'An error occurred';
    throw new Error(message);
  }
);

export default api;
```

---

### authService.js
```javascript
import api from './api';

const authService = {
  // Register new user
  async register(data) {
    const response = await api.post('/users/register', {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
    });
    return response.data;
  },

  // Login
  async login(email, password) {
    const response = await api.post('/users/login', {
      email,
      password,
    });

    // Save token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  // Get current user profile
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update profile
  async updateProfile(data) {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  // Request password reset
  async forgotPassword(email) {
    const response = await api.post('/users/forgot-password', { email });
    return response.data;
  },

  // Reset password with token
  async resetPassword(token, newPassword) {
    const response = await api.post('/users/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },
};

export default authService;
```

---

### serviceService.js
```javascript
import api from './api';

const serviceService = {
  // Get all services with filters
  async getServices(filters = {}) {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.minRating) params.append('minRating', filters.minRating);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/services?${params.toString()}`);
    return response.data;
  },

  // Get service by ID
  async getServiceById(id) {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Get popular services
  async getPopularServices(limit = 8) {
    const response = await api.get(`/services/popular?limit=${limit}`);
    return response.data;
  },

  // Create new service (freelancer only)
  async createService(data) {
    const response = await api.post('/services', data);
    return response.data;
  },

  // Update service
  async updateService(id, data) {
    const response = await api.put(`/services/${id}`, data);
    return response.data;
  },

  // Delete service
  async deleteService(id) {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },

  // Get categories
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  },
};

export default serviceService;
```

---

### orderService.js
```javascript
import api from './api';

const orderService = {
  // Create new order
  async createOrder(data) {
    const response = await api.post('/orders', {
      serviceId: data.serviceId,
      packageType: data.packageType,
      notes: data.notes,
      requirements: data.requirements,
    });
    return response.data;
  },

  // Get user's orders
  async getMyOrders(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/orders/my-orders?${params.toString()}`);
    return response.data;
  },

  // Get order by ID
  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Accept order (freelancer)
  async acceptOrder(id) {
    const response = await api.put(`/orders/${id}/accept`);
    return response.data;
  },

  // Reject order (freelancer)
  async rejectOrder(id, reason) {
    const response = await api.put(`/orders/${id}/reject`, { reason });
    return response.data;
  },

  // Submit delivery (freelancer)
  async submitDelivery(id, data) {
    const response = await api.put(`/orders/${id}/deliver`, {
      deliveryNote: data.deliveryNote,
      attachments: data.attachments,
    });
    return response.data;
  },

  // Mark as complete (client)
  async completeOrder(id) {
    const response = await api.put(`/orders/${id}/complete`);
    return response.data;
  },

  // Request revision (client)
  async requestRevision(id, revisionNote) {
    const response = await api.put(`/orders/${id}/revision`, { revisionNote });
    return response.data;
  },

  // Cancel order
  async cancelOrder(id, reason) {
    const response = await api.put(`/orders/${id}/cancel`, { reason });
    return response.data;
  },
};

export default orderService;
```

---

### paymentService.js
```javascript
import api from './api';

const paymentService = {
  // Create payment
  async createPayment(data) {
    const response = await api.post('/payments', {
      orderId: data.orderId,
      paymentMethod: data.paymentMethod,
      amount: data.amount,
    });
    return response.data;
  },

  // Get payment by order ID
  async getPaymentByOrder(orderId) {
    const response = await api.get(`/payments/order/${orderId}`);
    return response.data;
  },

  // Check payment status
  async checkPaymentStatus(transactionId) {
    const response = await api.get(`/payments/status/${transactionId}`);
    return response.data;
  },

  // Get saved payment methods
  async getPaymentMethods() {
    const response = await api.get('/payments/methods');
    return response.data;
  },

  // Save payment method
  async savePaymentMethod(data) {
    const response = await api.post('/payments/methods', data);
    return response.data;
  },

  // Delete payment method
  async deletePaymentMethod(id) {
    const response = await api.delete(`/payments/methods/${id}`);
    return response.data;
  },
};

export default paymentService;
```

---

### chatService.js
```javascript
import api from './api';
import io from 'socket.io-client';

const chatService = {
  // Socket instance
  socket: null,

  // Connect to socket
  connectSocket() {
    const token = localStorage.getItem('token');
    this.socket = io(import.meta.env.VITE_API_BASE_URL, {
      auth: { token },
    });
    return this.socket;
  },

  // Disconnect socket
  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },

  // Get conversations
  async getConversations() {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  // Get messages
  async getMessages(conversationId, page = 1) {
    const response = await api.get(`/chat/${conversationId}/messages?page=${page}`);
    return response.data;
  },

  // Send message (REST fallback)
  async sendMessage(conversationId, text) {
    const response = await api.post('/chat/send', {
      conversationId,
      text,
    });
    return response.data;
  },

  // Mark as read
  async markAsRead(conversationId) {
    const response = await api.put(`/chat/${conversationId}/read`);
    return response.data;
  },

  // Socket events
  emitSendMessage(conversationId, text) {
    if (this.socket) {
      this.socket.emit('chat:send-message', { conversationId, text });
    }
  },

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('chat:new-message', callback);
    }
  },

  onTyping(callback) {
    if (this.socket) {
      this.socket.on('chat:typing-indicator', callback);
    }
  },
};

export default chatService;
```

---

### reviewService.js
```javascript
import api from './api';

const reviewService = {
  // Create review
  async createReview(data) {
    const response = await api.post('/reviews', {
      orderId: data.orderId,
      rating: data.rating,
      comment: data.comment,
    });
    return response.data;
  },

  // Get reviews for service
  async getServiceReviews(serviceId, page = 1, limit = 10) {
    const response = await api.get(
      `/reviews/service/${serviceId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Update review
  async updateReview(id, data) {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data;
  },

  // Report review
  async reportReview(id, reason) {
    const response = await api.post(`/reviews/${id}/report`, { reason });
    return response.data;
  },
};

export default reviewService;
```

---

### notificationService.js
```javascript
import api from './api';

const notificationService = {
  // Get notifications
  async getNotifications(page = 1, limit = 20) {
    const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Mark as read
  async markAsRead(id) {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all as read
  async markAllAsRead() {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  async deleteNotification(id) {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  // Get unread count
  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },
};

export default notificationService;
```

---

## ✅ Service Layer Best Practices

1. **Single Responsibility** - 1 service = 1 resource/module
2. **Error Handling** - Let interceptors handle common errors
3. **Type Safety** - Use JSDoc or TypeScript for type hints
4. **Consistent Naming** - Follow REST conventions (GET, POST, PUT, DELETE)
5. **No Business Logic** - Services hanya handle API calls

## 📦 Export Pattern

`services/index.js`:
```javascript
export { default as authService } from './authService';
export { default as userService } from './userService';
export { default as serviceService } from './serviceService';
export { default as orderService } from './orderService';
export { default as paymentService } from './paymentService';
export { default as chatService } from './chatService';
export { default as reviewService } from './reviewService';
export { default as notificationService } from './notificationService';
```

**Usage:**
```javascript
import { authService, serviceService } from '../services';

// In component or hook
const handleLogin = async () => {
  try {
    const result = await authService.login(email, password);
    console.log('Login success:', result);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

## 🔒 Environment Variables

`.env`:
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

## 🚀 Usage in Custom Hooks

Services biasanya dipanggil dari **Custom Hooks**, bukan langsung dari components:

```javascript
// hooks/useAuth.js
import { authService } from '../services';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      setUser(result.user);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, login };
};
```
