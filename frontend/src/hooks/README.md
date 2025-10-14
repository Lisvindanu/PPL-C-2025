# Custom Hooks - Reusable Logic

## 📌 Apa itu Custom Hooks?

**Custom Hooks** adalah reusable functions yang encapsulate **state management**, **side effects**, dan **business logic**. Hooks membuat code lebih clean dan testable dengan memisahkan logic dari UI components.

## 📂 Struktur Folder

```
hooks/
├── useAuth.js              # Authentication state & logic
├── useServices.js          # Service listing logic
├── useService.js           # Single service detail
├── useOrders.js            # Orders management
├── useOrder.js             # Single order detail
├── usePayment.js           # Payment processing
├── useChat.js              # Chat/messaging logic
├── useNotifications.js     # Notifications logic
├── usePagination.js        # Pagination helper
└── useDebounce.js          # Debounce helper
```

## 🧱 Contoh Implementasi

### useAuth.js
```javascript
import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

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

  const register = async (data) => {
    setLoading(true);
    try {
      const result = await authService.register(data);
      setUser(result.user);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const updated = await authService.updateProfile(data);
      setUser(updated);
      return updated;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**Setup in App:**
```javascript
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* routes */}
      </Router>
    </AuthProvider>
  );
}
```

**Usage in components:**
```javascript
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <Button disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </Button>
    </form>
  );
}
```

---

### useServices.js
```javascript
import { useState, useEffect } from 'react';
import { serviceService } from '../services';

export const useServices = (initialFilters = {}) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const fetchServices = async (filters = initialFilters) => {
    setLoading(true);
    setError(null);

    try {
      const result = await serviceService.getServices(filters);
      setServices(result.services);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularServices = async (limit = 8) => {
    setLoading(true);
    try {
      const result = await serviceService.getPopularServices(limit);
      setServices(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    loading,
    error,
    pagination,
    fetchServices,
    fetchPopularServices,
  };
};
```

**Usage:**
```javascript
import { useServices } from '../hooks/useServices';

function ServicesPage() {
  const [filters, setFilters] = useState({ page: 1, category: '' });
  const { services, loading, pagination, fetchServices } = useServices();

  useEffect(() => {
    fetchServices(filters);
  }, [filters]);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <ServiceGrid services={services} />
      )}
      <Pagination
        currentPage={filters.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setFilters({ ...filters, page })}
      />
    </div>
  );
}
```

---

### useOrder.js
```javascript
import { useState, useEffect } from 'react';
import { orderService } from '../services';

export const useOrder = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await orderService.getOrderById(orderId);
      setOrder(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const result = await orderService.createOrder(data);
      setOrder(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async () => {
    setLoading(true);
    try {
      const result = await orderService.acceptOrder(orderId);
      setOrder(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeOrder = async () => {
    setLoading(true);
    try {
      const result = await orderService.completeOrder(orderId);
      setOrder(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    order,
    loading,
    error,
    fetchOrder,
    createOrder,
    acceptOrder,
    completeOrder,
  };
};
```

---

### usePayment.js
```javascript
import { useState } from 'react';
import { paymentService } from '../services';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processPayment = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.createPayment(data);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async (transactionId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.checkPaymentStatus(transactionId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    processPayment,
    checkStatus,
  };
};
```

---

### useChat.js
```javascript
import { useState, useEffect } from 'react';
import { chatService } from '../services';

export const useChat = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect socket
    const socket = chatService.connectSocket();

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('chat:join-conversation', conversationId);
    });

    // Listen for new messages
    chatService.onNewMessage((message) => {
      setMessages(prev => [...prev, message]);
    });

    // Cleanup
    return () => {
      chatService.disconnectSocket();
    };
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  const fetchMessages = async (page = 1) => {
    setLoading(true);
    try {
      const result = await chatService.getMessages(conversationId, page);
      setMessages(result.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (connected) {
      // Real-time via socket
      chatService.emitSendMessage(conversationId, text);
    } else {
      // Fallback to REST API
      try {
        const message = await chatService.sendMessage(conversationId, text);
        setMessages(prev => [...prev, message]);
      } catch (error) {
        throw error;
      }
    }
  };

  const markAsRead = async () => {
    try {
      await chatService.markAsRead(conversationId);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  return {
    messages,
    loading,
    connected,
    sendMessage,
    markAsRead,
  };
};
```

---

### useNotifications.js
```javascript
import { useState, useEffect } from 'react';
import { notificationService } from '../services';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Poll every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const result = await notificationService.getNotifications();
      setNotifications(result.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const result = await notificationService.getUnreadCount();
      setUnreadCount(result.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};
```

---

### useDebounce.js
```javascript
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

**Usage for search:**
```javascript
import { useDebounce } from '../hooks/useDebounce';

function SearchBar() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      // API call only fires after user stops typing for 500ms
      searchServices(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

---

## ✅ Custom Hooks Best Practices

1. **Start with "use"** - Convention untuk React hooks
2. **Single Responsibility** - 1 hook = 1 concern
3. **Return Objects** - Lebih flexible daripada array
4. **Error Handling** - Always handle errors gracefully
5. **Cleanup** - Use useEffect cleanup untuk prevent memory leaks

## 📦 Export Pattern

`hooks/index.js`:
```javascript
export { useAuth, AuthProvider } from './useAuth';
export { useServices } from './useServices';
export { useService } from './useService';
export { useOrder } from './useOrder';
export { usePayment } from './usePayment';
export { useChat } from './useChat';
export { useNotifications } from './useNotifications';
export { useDebounce } from './useDebounce';
```

**Usage:**
```javascript
import { useAuth, useServices, usePayment } from '../hooks';
```

## 🎯 Hook Patterns

### Data Fetching Hook
```javascript
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
};
```

### Form Hook
```javascript
const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const validate = (validationRules) => {
    // validation logic
  };

  return { values, errors, handleChange, validate };
};
```
