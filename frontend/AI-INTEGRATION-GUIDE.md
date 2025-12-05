# 🤖 AI Integration Guide - Frontend SkillConnect

> **Panduan lengkap menggunakan AI untuk development frontend React + Tailwind**

Dokumentasi ini berisi best practices, workflow, dan template prompts untuk mengerjakan frontend SkillConnect menggunakan AI assistant seperti Claude, ChatGPT, Copilot, atau Gemini CLI.

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Frontend Tech Stack](#-frontend-tech-stack)
- [AI Tools Recommendation](#-ai-tools-recommendation)
- [Project Structure Context](#-project-structure-context)
- [Common Tasks & Prompts](#-common-tasks--prompts)
- [Component Development Workflow](#-component-development-workflow)
- [API Integration with AI](#-api-integration-with-ai)
- [Styling with Tailwind + AI](#-styling-with-tailwind--ai)
- [State Management](#-state-management)
- [Real Examples](#-real-examples)
- [Best Practices](#-best-practices)
- [Common Pitfalls](#-common-pitfalls)

---

## 🚀 Quick Start

### Step 1: Give AI the Context

Sebelum mulai coding, **ALWAYS** kasih AI context lengkap tentang project:

```
Saya sedang develop frontend untuk SkillConnect - marketplace jasa lokal.

Tech Stack:
- React 18
- Tailwind CSS 3
- Vite
- React Router v6
- Axios untuk API calls
- React Query untuk data fetching
- Zustand untuk state management
- Socket.IO Client untuk real-time chat

Architecture:
- Atomic Design Pattern (atoms → molecules → organisms → templates → pages)

Backend API:
- Base URL: https://api-ppl.vinmedia.my.id
- Swagger Docs: https://api-ppl.vinmedia.my.id/api-docs/#/
- Authentication: JWT Bearer token
- Response format: { success: true/false, message: "", data: {} }

Project Structure:
frontend/
├── src/
│   ├── components/
│   │   ├── atoms/       # Basic UI (Button, Input, Badge)
│   │   ├── molecules/   # Combined components
│   │   ├── organisms/   # Complex components
│   │   └── templates/   # Page layouts
│   ├── pages/           # Complete pages
│   ├── services/        # API integration
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand stores
│   └── utils/           # Helper functions
```

### Step 2: Ask AI to Help

Dengan context di atas, AI akan generate code yang **consistent** dengan project structure kamu.

---

## 🛠️ Frontend Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI Library |
| **Tailwind CSS** | 3.x | Utility-first CSS |
| **Vite** | 5.x | Build tool & dev server |
| **React Router** | v6 | Client-side routing |
| **Axios** | Latest | HTTP client |
| **React Query** | v4 | Server state management |
| **Zustand** | Latest | Client state management |
| **Socket.IO Client** | Latest | Real-time communication |

### UI/UX Libraries

- **Headless UI** - Unstyled accessible components
- **Heroicons** - Icon library
- **React Hot Toast** - Toast notifications
- **React Hook Form** - Form validation

---

## 🤖 AI Tools Recommendation

### For Frontend Development:

1. **Claude (Primary)** ⭐
   - Best for: Component architecture, complex logic
   - Excellent at understanding Atomic Design
   - Great for refactoring

2. **GitHub Copilot (Secondary)**
   - Best for: In-editor autocomplete
   - Fast component scaffolding
   - Quick utility functions

3. **ChatGPT (Tertiary)**
   - Best for: Quick CSS/Tailwind questions
   - Algorithm help
   - Documentation

4. **Gemini CLI (Free Alternative)** 🆓
   - Best for: Quick component generation
   - Style tweaks
   - Code explanation

**Cursor IDE** is excellent for frontend - built-in AI chat + multi-file editing.

---

## 📁 Project Structure Context

### Atomic Design Pattern

Always explain to AI which level you're working on:

```
Atomic Design Hierarchy:

1. ATOMS (Smallest, reusable)
   - Button, Input, Label, Badge, Avatar, Icon
   - No business logic, only UI
   - Accept props, render UI

2. MOLECULES (Combined atoms)
   - SearchBar (Input + Button)
   - FormField (Label + Input + ErrorMessage)
   - Card (Image + Title + Description)
   - Still generic, reusable

3. ORGANISMS (Complex components)
   - Navbar (Logo + SearchBar + UserMenu)
   - ServiceCard (Molecule Card + business logic)
   - ChatBox (Messages + MessageInput)
   - Can have business logic

4. TEMPLATES (Page layouts)
   - DashboardTemplate
   - AuthTemplate
   - Defines layout structure

5. PAGES (Complete pages)
   - HomePage
   - ServiceDetailPage
   - Uses templates + organisms
```

---

## 💬 Common Tasks & Prompts

### Task 1: Create New Component

**Prompt Template:**
```
Buatkan component [ComponentName] untuk SkillConnect frontend.

Level: [atom/molecule/organism/template/page]

Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Styling:
- Gunakan Tailwind CSS
- Responsive (mobile-first)
- Match design system (blue primary, clean modern)

Props yang dibutuhkan:
- [prop1]: [type] - [description]
- [prop2]: [type] - [description]

Contoh usage:
<ComponentName prop1="value" prop2="value" />
```

**Real Example:**
```
Buatkan component ServiceCard untuk SkillConnect frontend.

Level: organism

Requirements:
- Display service image, title, seller name, rating, price
- Clickable card yang navigate ke detail page
- Show badge untuk "Trending" atau "New"
- Hover effect yang smooth

Styling:
- Gunakan Tailwind CSS
- Responsive (mobile-first)
- Match design system (blue primary #3B82F6, clean modern)
- Shadow on hover

Props yang dibutuhkan:
- service: object - { id, title, image, seller, rating, price, isTrending, isNew }
- onClick: function - Callback saat card diklik

Contoh usage:
<ServiceCard
  service={serviceData}
  onClick={() => navigate(`/services/${serviceData.id}`)}
/>
```

### Task 2: Integrate with API

**Prompt Template:**
```
Buatkan service file dan custom hook untuk [feature] di SkillConnect.

Backend Endpoint:
- Method: [GET/POST/PUT/DELETE]
- URL: /api/[endpoint]
- Request body: [schema]
- Response: [schema]

Requirements:
- Gunakan Axios instance yang sudah ada
- Gunakan React Query untuk data fetching
- Handle loading, error, success states
- Include proper TypeScript types (if using TS)

File location:
- Service: src/services/[name]Service.js
- Hook: src/hooks/use[Name].js
```

**Real Example:**
```
Buatkan service file dan custom hook untuk fetch services list di SkillConnect.

Backend Endpoint:
- Method: GET
- URL: /api/services
- Query params: { search?, kategori_id?, page?, limit? }
- Response: {
    success: true,
    data: {
      items: [...],
      pagination: { page, limit, total, totalPages }
    }
  }

Requirements:
- Gunakan Axios instance dari src/utils/axiosConfig.js
- Gunakan React Query untuk caching & pagination
- Handle loading, error states
- Support filter & search
- Auto-refetch on filter change

File location:
- Service: src/services/serviceService.js
- Hook: src/hooks/useServices.js

Usage di component:
const { data, isLoading, error } = useServices({
  search: 'fotografi',
  page: 1
});
```

### Task 3: Create Form with Validation

**Prompt Template:**
```
Buatkan form [FormName] dengan validation.

Fields:
- [field1]: [type] - [validation rules]
- [field2]: [type] - [validation rules]

Requirements:
- Gunakan React Hook Form
- Tailwind untuk styling
- Show inline validation errors
- Submit ke endpoint [endpoint]
- Handle loading & error states
- Success toast notification

On success:
- [Action setelah submit berhasil]
```

**Real Example:**
```
Buatkan form CreateServiceForm dengan validation.

Fields:
- title: text - required, min 10 chars, max 100 chars
- description: textarea - required, min 50 chars
- kategori_id: select - required
- harga_minimal: number - required, min 0
- harga_maksimal: number - required, greater than harga_minimal
- durasi_estimasi: number - required
- images: file upload - required, max 5 files, only jpg/png

Requirements:
- Gunakan React Hook Form
- Tailwind untuk styling yang clean & modern
- Show inline validation errors dengan text merah
- Submit ke POST /api/services
- Handle loading state (disable button, show spinner)
- Success toast notification "Service created!"
- Error handling dengan toast

On success:
- Navigate ke /my-services
- Invalidate services query untuk refresh data
```

### Task 4: Style with Tailwind

**Prompt Template:**
```
Buatkan styling Tailwind untuk [component/page].

Design requirements:
- [Color scheme]
- [Layout]
- [Responsive behavior]
- [Animations/transitions]

Reference:
- [Link to design/screenshot if available]

Harus support:
- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)
```

**Real Example:**
```
Buatkan styling Tailwind untuk ServiceDetailPage.

Design requirements:
- Hero section dengan image gallery (slider)
- 2-column layout: Left (service info), Right (booking card)
- Color: Primary blue #3B82F6, secondary gray
- Clean, modern, professional look
- Smooth animations

Layout:
- Full width pada mobile (stacked vertical)
- 2-column pada desktop (70% left, 30% right sticky)

Components:
- Image gallery dengan thumbnail
- Service title, description, seller info
- Rating & reviews section
- Sticky booking card (price, CTA button)

Harus support:
- Mobile (< 640px): Stacked layout
- Tablet (640px - 1024px): Stacked but wider
- Desktop (> 1024px): 2-column, sticky sidebar
```

### Task 5: Create Custom Hook

**Prompt Template:**
```
Buatkan custom hook use[Name] untuk [purpose].

Functionality:
- [Functionality 1]
- [Functionality 2]

Return values:
- [value1]: [type] - [description]
- [value2]: [type] - [description]

Dependencies:
- [Dependency 1]

Example usage:
const { value1, value2 } = use[Name]();
```

**Real Example:**
```
Buatkan custom hook useAuth untuk authentication logic.

Functionality:
- Get current user dari localStorage/Zustand
- Login function
- Logout function
- Register function
- Check if user is authenticated
- Auto-redirect jika belum login (optional)

Return values:
- user: object | null - Current user data
- isAuthenticated: boolean - Auth status
- isLoading: boolean - Loading state
- login: function - (email, password) => Promise
- logout: function - () => void
- register: function - (userData) => Promise

Dependencies:
- Zustand store untuk global state
- Axios untuk API calls
- React Router untuk navigation

Example usage:
const { user, isAuthenticated, login, logout } = useAuth();

if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

---

## 🏗️ Component Development Workflow

### Step-by-Step AI-Assisted Development:

#### 1. Planning Phase

**Prompt:**
```
Saya mau buat [feature name] di SkillConnect frontend.

Context:
- [Brief description]
- User flow: [Step 1 → Step 2 → Step 3]
- Backend endpoints tersedia: [List endpoints]

Tolong breakdown:
1. Components apa saja yang dibutuhkan (atomic design level)
2. State management strategy (local/global)
3. API integration points
4. Routing structure

Jangan langsung kasih code, planning dulu.
```

#### 2. Component Creation

**Prompt:**
```
Berdasarkan planning di atas, buatkan component [ComponentName] dulu.

[Follow Task 1 prompt template]
```

#### 3. API Integration

**Prompt:**
```
Sekarang integrate [ComponentName] dengan backend API.

[Follow Task 2 prompt template]
```

#### 4. Styling & Polish

**Prompt:**
```
Polish styling untuk [ComponentName].

[Follow Task 4 prompt template]
```

#### 5. Testing & Edge Cases

**Prompt:**
```
Review [ComponentName] dan handle edge cases:
- Loading state
- Error state (network error, 404, 500)
- Empty state (no data)
- Success state
- Form validation errors

Kasih suggestions untuk improvement.
```

---

## 🔗 API Integration with AI

### Template Service File

**Prompt:**
```
Buatkan service file untuk [module] di SkillConnect.

Base structure:
- Import axios instance dari src/utils/axiosConfig.js
- Export object dengan methods untuk semua endpoints
- Consistent error handling
- Return { data, error } pattern

Endpoints:
1. [endpoint1] - [description]
2. [endpoint2] - [description]

Contoh structure:
// src/services/[module]Service.js
import api from '@/utils/axiosConfig';

export const [module]Service = {
  method1: async (params) => {
    const response = await api.get('/endpoint', { params });
    return response.data;
  },
  // ...
};
```

### Template React Query Hook

**Prompt:**
```
Buatkan React Query hook untuk [feature].

Requirements:
- useQuery untuk GET requests
- useMutation untuk POST/PUT/DELETE
- Proper cache invalidation
- Loading & error states
- Retry logic untuk failed requests

Integration dengan:
- Service: src/services/[module]Service.js

Return:
- data, isLoading, error, refetch (untuk query)
- mutate, isLoading, error (untuk mutation)
```

---

## 🎨 Styling with Tailwind + AI

### Design System Context

Always give AI your design system:

```
SkillConnect Design System:

Colors:
- Primary: blue-500 (#3B82F6)
- Secondary: gray-600
- Success: green-500
- Error: red-500
- Warning: yellow-500

Typography:
- Headings: font-bold, text-gray-900
- Body: font-normal, text-gray-700
- Small: text-sm, text-gray-500

Components:
- Buttons: rounded-lg, px-4, py-2, font-medium, transition
- Cards: bg-white, shadow-md, rounded-lg, p-6, hover:shadow-lg
- Inputs: border-gray-300, rounded-md, focus:ring-blue-500

Spacing:
- Section: py-12
- Container: max-w-7xl, mx-auto, px-4
- Grid gap: gap-6

Responsive:
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
```

### Styling Prompts

**For existing component:**
```
Improve styling untuk component [Name] dengan Tailwind.

Current code:
[Paste component code]

Requirements:
- Lebih modern & clean
- Better spacing & typography
- Smooth hover/focus states
- Fully responsive
- Follow SkillConnect design system (above)
```

**For responsive layout:**
```
Buatkan responsive layout dengan Tailwind untuk [page].

Desktop (lg):
- [Layout description]

Tablet (md):
- [Layout description]

Mobile (default):
- [Layout description]

Gunakan Tailwind responsive utilities (sm:, md:, lg:).
```

---

## 🗄️ State Management

### Local State (useState)

**When to use:**
- UI state (modal open/close, tab active)
- Form inputs
- Component-specific state

**Prompt:**
```
Buatkan component dengan local state untuk [feature].

State yang dibutuhkan:
- [state1]: [type] - [initial value]
- [state2]: [type] - [initial value]

State changes on:
- [Event 1]: [State change]
- [Event 2]: [State change]
```

### Global State (Zustand)

**When to use:**
- User authentication
- Shopping cart
- Global notifications
- Theme preferences

**Prompt:**
```
Buatkan Zustand store untuk [feature].

State:
- [state1]: [type] - [description]
- [state2]: [type] - [description]

Actions:
- [action1]: [parameters] - [description]
- [action2]: [parameters] - [description]

Persist to localStorage: [yes/no]

File: src/store/[name]Store.js

Example usage:
const { state1, action1 } = use[Name]Store();
```

**Real Example:**
```
Buatkan Zustand store untuk authentication.

State:
- user: object | null - Current logged-in user
- token: string | null - JWT token
- isAuthenticated: boolean - Auth status

Actions:
- setUser: (user, token) - Set user & token, save to localStorage
- logout: () - Clear user & token, remove from localStorage
- updateUser: (userData) - Update user data

Persist to localStorage: yes (key: 'auth')

File: src/store/authStore.js

Example usage:
const { user, isAuthenticated, setUser, logout } = useAuthStore();
```

### Server State (React Query)

**When to use:**
- API data fetching
- Caching remote data
- Background refetching

**Prompt:**
```
Setup React Query untuk [feature] di SkillConnect.

Queries:
1. [queryKey] - Fetch [data]
   - Endpoint: [endpoint]
   - Cache time: [time]
   - Refetch on: [condition]

2. [queryKey] - Fetch [data]
   - ...

Mutations:
1. [mutationKey] - [Action]
   - Endpoint: [endpoint]
   - On success: [Invalidate queries, show toast, navigate]

File: src/hooks/use[Feature].js
```

---

## 📚 Real Examples

### Example 1: Service Listing Page

**Full Prompt:**
```
Buatkan ServiceListingPage untuk SkillConnect dengan fitur:

Features:
1. Search bar (search by title/description)
2. Category filter (dropdown)
3. Price range filter (slider)
4. Sort options (rating, price, newest)
5. Grid of ServiceCard components
6. Pagination
7. Loading skeleton
8. Empty state

Tech:
- React Query untuk data fetching
- URL query params untuk filters (shareable URL)
- Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)

API:
- GET /api/services?search=&kategori_id=&page=&limit=&sort=

Components structure:
- Page: ServiceListingPage
- Organisms: SearchBar, FilterPanel, ServiceGrid
- Molecules: FilterDropdown, PriceRangeSlider
- Atoms: ServiceCard (sudah ada)

Styling: Tailwind, modern, clean

File structure:
- src/pages/ServiceListingPage.jsx
- src/components/organisms/SearchBar.jsx
- src/components/organisms/FilterPanel.jsx
- src/hooks/useServices.js (React Query hook)
```

### Example 2: Authentication Flow

**Full Prompt:**
```
Buatkan complete authentication flow untuk SkillConnect:

Pages needed:
1. LoginPage - Email & password form
2. RegisterPage - Full registration form (nama, email, password, no_telepon, role)
3. ForgotPasswordPage - Request reset link

Features:
- Form validation (React Hook Form)
- Password strength indicator (register page)
- Show/hide password toggle
- Remember me checkbox (login)
- Redirect after login (return to previous page)
- Protected routes (redirect to login if not authenticated)

API:
- POST /api/users/login
- POST /api/users/register
- POST /api/users/forgot-password

State Management:
- Zustand store untuk user & token (src/store/authStore.js)
- Persist to localStorage

Routing:
- /login
- /register
- /forgot-password

Protection:
- Create ProtectedRoute component
- Wrap private routes dengan <ProtectedRoute>

Styling:
- Centered auth form
- Clean, modern design
- Responsive
- Blue primary color

Error handling:
- Show validation errors inline
- Show API errors as toast
- Proper error messages
```

### Example 3: Real-time Chat

**Full Prompt:**
```
Buatkan real-time chat feature untuk SkillConnect dengan Socket.IO.

Components:
1. ChatPage - Main chat interface
   - Sidebar: Conversation list
   - Main: Message thread
   - Input: Message composer

2. ConversationList - List of chats
   - Show last message
   - Unread count badge
   - Online status indicator

3. MessageThread - Chat messages
   - Grouped by date
   - Sender/receiver styling (align left/right)
   - Timestamp
   - Auto-scroll to bottom

4. MessageComposer - Input + send button
   - Textarea that expands
   - Send on Enter (Shift+Enter for new line)
   - Emoji picker (optional)

Socket.IO Events:
- Connect: socket.connect()
- Send message: socket.emit('chat:send', data)
- Receive message: socket.on('chat:message', callback)
- Typing indicator: socket.emit('chat:typing', data)

State:
- Zustand untuk active conversation
- React Query untuk fetch conversation history
- Local state untuk real-time messages

API:
- GET /api/chat/conversations - List conversations
- GET /api/chat/conversations/:id/messages - Message history
- POST /api/chat/messages - Send message (fallback)

Files:
- src/pages/ChatPage.jsx
- src/components/organisms/ConversationList.jsx
- src/components/organisms/MessageThread.jsx
- src/components/molecules/MessageComposer.jsx
- src/components/atoms/MessageBubble.jsx
- src/hooks/useChat.js (Socket.IO integration)
- src/hooks/useConversations.js (React Query)

Styling: Modern chat UI, WhatsApp-like
```

---

## ✅ Best Practices

### 1. **Always Give Context**

❌ Bad:
```
Buatkan button component
```

✅ Good:
```
Buatkan Button component (atom) untuk SkillConnect.

Requirements:
- Variants: primary, secondary, outline, ghost
- Sizes: sm, md, lg
- Props: onClick, disabled, loading, children
- Tailwind styling
- Accessible (proper aria labels)

Usage:
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

### 2. **Iterate & Refine**

Don't expect perfect code in first try:

1. Generate initial version
2. Review & test
3. Ask AI to improve:
   ```
   Code works, tapi ada issues:
   1. [Issue 1]
   2. [Issue 2]

   Tolong fix dan improve.
   ```

### 3. **Request Explanations**

```
Code sudah jalan, tapi explain:
1. Kenapa pakai useCallback di sini?
2. Apa benefit React Query vs useState?
3. Kenapa component ini di-memo?

Explain supaya saya belajar pattern nya.
```

### 4. **Ask for Alternatives**

```
Component [Name] sudah jadi, tapi explore alternatif:
1. Cara lain untuk handle [feature]?
2. Library alternatif yang lebih ringan?
3. Pattern yang lebih scalable?

Kasih comparison & recommendation.
```

### 5. **Security Review**

```
Review security untuk [component/feature]:
1. XSS vulnerabilities?
2. Proper input sanitization?
3. Secure token storage?
4. CSRF protection?

Kasih recommendations.
```

---

## ⚠️ Common Pitfalls

### 1. **Over-Engineering**

❌ Don't ask:
```
Buatkan super complex reusable generic customizable component...
```

✅ Do ask:
```
Buatkan simple Button component dulu.
Nanti kita enhance step by step.
```

### 2. **Forgetting Mobile**

❌ Don't say:
```
Buatkan layout untuk desktop.
```

✅ Do say:
```
Buatkan responsive layout (mobile-first).
Mobile: stacked vertical
Desktop: 2-column grid
```

### 3. **Ignoring Error States**

❌ Don't forget:
```
Hanya handle success case
```

✅ Do include:
```
Handle:
- Loading state (skeleton/spinner)
- Error state (error message + retry)
- Empty state (no data placeholder)
- Success state
```

### 4. **Not Following Atomic Design**

❌ Don't mix:
```
Atom component dengan business logic & API calls
```

✅ Do separate:
```
Atoms: Pure UI, no logic
Organisms: Business logic + API
Pages: Composition
```

### 5. **Hardcoding Values**

❌ Don't:
```jsx
<Button className="bg-blue-500">Click</Button>
```

✅ Do:
```jsx
// Design system constants
const COLORS = {
  primary: 'bg-blue-500',
  secondary: 'bg-gray-600'
};

<Button className={COLORS.primary}>Click</Button>
```

---

## 🎓 Learning Resources

Ask AI to explain concepts:

```
Explain [concept] dalam context React + SkillConnect:

1. Apa itu [concept]?
2. Kapan harus pakai?
3. Contoh real use case di SkillConnect
4. Code example yang simple

Concept bisa:
- React Query vs useState
- Zustand vs Context API
- Atomic Design benefits
- Code splitting
- Lazy loading
- Memoization
- Custom hooks pattern
- Compound components
- Render props vs hooks
```

---

## 🔗 Useful Links

- **Swagger API:** https://api-ppl.vinmedia.my.id/api-docs/#/
- **Tailwind Docs:** https://tailwindcss.com/docs
- **React Query Docs:** https://tanstack.com/query/latest
- **Zustand Docs:** https://zustand-demo.pmnd.rs/
- **React Router Docs:** https://reactrouter.com

---

## 📞 Need Help?

**Stuck?** Ask AI:
```
Saya stuck di [problem].

What I tried:
1. [Attempt 1] - [Result]
2. [Attempt 2] - [Result]

Error message:
[Paste error]

Expected behavior:
[What should happen]

Code:
[Paste relevant code]

Help me debug & fix.
```

---

## 🚀 Quick Start Checklist

Before asking AI for code:

- [ ] Baca backend API docs (Swagger)
- [ ] Understand data structure (request/response)
- [ ] Decide component atomic level
- [ ] Prepare full context prompt
- [ ] Mention tech stack explicitly
- [ ] Specify styling requirements
- [ ] Include error handling requirements
- [ ] Request responsive design
- [ ] Ask for code explanations

**Happy Coding with AI! 🤖⚛️**

---

**Last Updated:** 2025-01-02
**Maintained by:** SkillConnect Frontend Team
