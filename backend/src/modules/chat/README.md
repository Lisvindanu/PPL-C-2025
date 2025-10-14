# Modul 6 - Chat & Notification System

## 📋 Deskripsi
Modul untuk real-time chat antara client dan freelancer, serta sistem notifikasi untuk berbagai events.

## 🎯 User Stories
- **C-1**: Client kirim pesan ke freelancer
- **C-2**: Freelancer balas pesan real-time
- **C-3**: Sistem kirim notifikasi order/pesan
- **C-4**: User lihat daftar percakapan
- **C-5**: Tandai pesan terbaca
- **C-6**: Email notifikasi jika offline

## 📂 Struktur DDD

```
chat/
├── domain/
│   ├── entities/
│   │   ├── Conversation.js      # Entity Conversation
│   │   ├── Message.js           # Entity Message
│   │   └── Notification.js      # Entity Notification
│   └── value-objects/
│       └── MessageStatus.js     # sent, delivered, read
├── application/
│   ├── use-cases/
│   │   ├── SendMessage.js       # Kirim pesan
│   │   ├── GetConversations.js  # List conversations
│   │   ├── GetMessages.js       # Get chat history
│   │   ├── MarkAsRead.js        # Mark messages as read
│   │   └── SendNotification.js  # Kirim notifikasi
│   └── dtos/
│       ├── MessageDto.js
│       └── NotificationDto.js
├── infrastructure/
│   ├── repositories/
│   │   ├── SequelizeMessageRepository.js
│   │   └── SequelizeNotificationRepository.js
│   ├── models/
│   │   ├── ConversationModel.js
│   │   ├── MessageModel.js
│   │   └── NotificationModel.js
│   └── services/
│       ├── SocketService.js     # Socket.io setup
│       └── EmailNotificationService.js
└── presentation/
    ├── controllers/
    │   ├── ChatController.js
    │   └── NotificationController.js
    ├── routes/
    │   ├── chatRoutes.js
    │   └── notificationRoutes.js
    └── socket/
        └── chatSocket.js        # Socket event handlers
```

## 🌐 API Endpoints

### Chat Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/chat/conversations` | List conversations | Private |
| GET | `/api/chat/:conversationId/messages` | Get messages | Private |
| POST | `/api/chat/send` | Send message (REST fallback) | Private |
| PUT | `/api/chat/:conversationId/read` | Mark as read | Private |

### Notification Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications` | Get user notifications | Private |
| PUT | `/api/notifications/:id/read` | Mark notification as read | Private |
| PUT | `/api/notifications/read-all` | Mark all as read | Private |
| DELETE | `/api/notifications/:id` | Delete notification | Private |

## 🔌 Socket.io Events

### Client → Server
```javascript
'chat:send-message'      // Kirim pesan
'chat:typing'            // User sedang mengetik
'chat:join-conversation' // Join conversation room
'chat:read'              // Mark as read
```

### Server → Client
```javascript
'chat:new-message'       // Receive pesan baru
'chat:message-sent'      // Konfirmasi pesan terkirim
'chat:message-read'      // Pesan dibaca
'chat:typing-indicator'  // User lawan sedang mengetik
'notification:new'       // Notifikasi baru
```

## 📦 Database Schema

### ConversationModel
```javascript
{
  participants: [ObjectId] (ref: User),
  orderId: ObjectId (ref: Order),  // Optional: jika chat terkait order
  lastMessage: {
    text: String,
    senderId: ObjectId,
    timestamp: Date
  },
  unreadCount: {
    [userId]: Number  // Unread count per user
  },
  createdAt: Date,
  updatedAt: Date
}
```

### MessageModel
```javascript
{
  conversationId: ObjectId (ref: Conversation),
  senderId: ObjectId (ref: User),
  text: String,
  attachments: [{
    type: String (image/file),
    url: String,
    fileName: String
  }],
  status: Enum ['sent', 'delivered', 'read'],
  readBy: [ObjectId],
  createdAt: Date
}
```

### NotificationModel
```javascript
{
  userId: ObjectId (ref: User),
  type: Enum [
    'new_order',
    'order_accepted',
    'order_rejected',
    'order_completed',
    'payment_success',
    'new_message',
    'new_review'
  ],
  title: String,
  message: String,
  data: {
    orderId: String,
    serviceId: String,
    // ... additional data
  },
  isRead: Boolean (default: false),
  link: String,  // URL to navigate
  createdAt: Date
}
```

## 💡 Tips Implementasi

### Socket.io Setup (infrastructure/services/SocketService.js)
```javascript
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

class SocketService {
  constructor(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  setupMiddleware() {
    // Autentikasi socket dengan JWT
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.userId}`);

      // User join ke room nya sendiri (untuk notifikasi)
      socket.join(`user:${socket.userId}`);

      // Handle send message
      socket.on('chat:send-message', async (data) => {
        await this.handleSendMessage(socket, data);
      });

      // Handle typing indicator
      socket.on('chat:typing', (data) => {
        socket.to(`conversation:${data.conversationId}`).emit('chat:typing-indicator', {
          userId: socket.userId,
          isTyping: data.isTyping
        });
      });

      // Handle join conversation
      socket.on('chat:join-conversation', (conversationId) => {
        socket.join(`conversation:${conversationId}`);
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
      });
    });
  }

  async handleSendMessage(socket, data) {
    const message = await this.messageRepository.save({
      conversationId: data.conversationId,
      senderId: socket.userId,
      text: data.text,
      status: 'sent'
    });

    // Emit ke conversation room
    this.io.to(`conversation:${data.conversationId}`).emit('chat:new-message', message);

    // Emit confirmation ke sender
    socket.emit('chat:message-sent', { messageId: message.id });
  }

  // Method untuk kirim notifikasi
  sendNotification(userId, notification) {
    this.io.to(`user:${userId}`).emit('notification:new', notification);
  }
}

module.exports = SocketService;
```

### Send Message Use Case
```javascript
class SendMessage {
  constructor(messageRepository, conversationRepository, socketService) {
    this.messageRepository = messageRepository;
    this.conversationRepository = conversationRepository;
    this.socketService = socketService;
  }

  async execute(dto) {
    // 1. Validasi conversation exists
    const conversation = await this.conversationRepository.findById(dto.conversationId);
    if (!conversation) throw new Error('Conversation not found');

    // 2. Validasi user adalah participant
    if (!conversation.isParticipant(dto.senderId)) {
      throw new Error('Unauthorized');
    }

    // 3. Buat message entity
    const message = new Message({
      conversationId: dto.conversationId,
      senderId: dto.senderId,
      text: dto.text,
      attachments: dto.attachments,
      status: 'sent'
    });

    // 4. Save message
    await this.messageRepository.save(message);

    // 5. Update conversation last message
    conversation.updateLastMessage(message);
    await this.conversationRepository.update(conversation);

    // 6. Emit via socket (jika user online)
    this.socketService.sendMessage(dto.conversationId, message);

    // 7. Kirim email notification (jika user offline)
    const recipientId = conversation.getOtherParticipant(dto.senderId);
    const isOnline = await this.socketService.isUserOnline(recipientId);
    if (!isOnline) {
      await this.emailService.sendNewMessageNotification(recipientId, message);
    }

    return message;
  }
}
```

### Get Conversations Use Case
```javascript
class GetConversations {
  async execute(userId) {
    const conversations = await this.conversationRepository.findByUserId(userId);

    return conversations.map(conv => ({
      conversationId: conv.id,
      participant: conv.getOtherParticipant(userId),
      lastMessage: {
        text: conv.lastMessage.text,
        timestamp: conv.lastMessage.timestamp,
        isRead: conv.isReadByUser(userId)
      },
      unreadCount: conv.getUnreadCount(userId)
    }));
  }
}
```

### Mark As Read Use Case
```javascript
class MarkAsRead {
  async execute(conversationId, userId) {
    const messages = await this.messageRepository.findUnreadMessages(
      conversationId,
      userId
    );

    // Update status messages
    await Promise.all(
      messages.map(msg => {
        msg.markAsRead(userId);
        return this.messageRepository.update(msg);
      })
    );

    // Update unread count di conversation
    const conversation = await this.conversationRepository.findById(conversationId);
    conversation.resetUnreadCount(userId);
    await this.conversationRepository.update(conversation);

    // Emit via socket
    this.socketService.emitMessageRead(conversationId, messages.map(m => m.id));
  }
}
```

## 🚀 Frontend Integration

### Connect Socket.io
```javascript
import io from 'socket.io-client';

const socket = io(process.env.VITE_API_BASE_URL, {
  auth: {
    token: localStorage.getItem('token')
  }
});

// Listen for new messages
socket.on('chat:new-message', (message) => {
  console.log('New message:', message);
  // Update UI
});

// Listen for notifications
socket.on('notification:new', (notification) => {
  console.log('New notification:', notification);
  // Show notification toast
});
```

### Send Message
```javascript
// Via Socket.io (recommended)
socket.emit('chat:send-message', {
  conversationId: 'conv_id',
  text: 'Hello!'
});

socket.on('chat:message-sent', (data) => {
  console.log('Message sent:', data.messageId);
});

// Via REST (fallback)
POST /api/chat/send
Body: {
  conversationId: 'conv_id',
  text: 'Hello!'
}
```

### Get Conversations
```javascript
GET /api/chat/conversations
Response: {
  success: true,
  data: [
    {
      conversationId: "...",
      participant: {
        userId: "...",
        name: "John Doe",
        avatar: "..."
      },
      lastMessage: {
        text: "Hello!",
        timestamp: "2025-01-20T10:00:00Z",
        isRead: false
      },
      unreadCount: 3
    }
  ]
}
```

### Get Messages
```javascript
GET /api/chat/:conversationId/messages?page=1&limit=50
Response: {
  success: true,
  data: {
    messages: [
      {
        messageId: "...",
        senderId: "...",
        text: "Hello!",
        status: "read",
        createdAt: "2025-01-20T10:00:00Z"
      }
    ],
    pagination: { page: 1, limit: 50, total: 120 }
  }
}
```

### Get Notifications
```javascript
GET /api/notifications
Response: {
  success: true,
  data: [
    {
      notificationId: "...",
      type: "new_order",
      title: "New Order",
      message: "You have a new order request!",
      isRead: false,
      link: "/orders/123",
      createdAt: "2025-01-20T10:00:00Z"
    }
  ]
}
```

## 📧 Email Notification Template

```javascript
class EmailNotificationService {
  async sendNewMessageNotification(userId, message) {
    const user = await this.userRepository.findById(userId);

    await this.emailService.send({
      to: user.email,
      subject: 'New message on SkillConnect',
      html: `
        <h2>You have a new message!</h2>
        <p>${message.text}</p>
        <a href="${process.env.FRONTEND_URL}/chat/${message.conversationId}">
          View conversation
        </a>
      `
    });
  }
}
```

## 🔔 Push Notification (Optional)

Gunakan **Firebase Cloud Messaging (FCM)** atau **OneSignal** untuk push notification mobile/web.
