# PROJECT STRUCTURE DOCUMENTATION - REACT + ATOMIC DESIGN

> **Project:** Codingin - Company Profile & Project Management System
> **Tech Stack:** React 19 + TypeScript + Vite + Tailwind CSS + Zustand + Atomic Design
> **State Management:** Zustand + Custom Hooks

---

## PROJECT OVERVIEW

This project is a company profile with project management system for a software development company, built with:
- **React 19** with hooks-based architecture
- **TypeScript** for type safety
- **Vite** for fast development & build
- **Tailwind CSS** for styling
- **Zustand** for global state management
- **Axios** for HTTP client
- **Atomic Design** for component organization
- **Service + Hook Pattern** for business logic
- **JWT-based authentication** with Session Storage

---

## COMPLETE FOLDER STRUCTURE

```
frontend/
├── .env                          # Environment variables
├── .gitignore                    # Git ignore configuration
├── eslint.config.js              # ESLint config
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite configuration
│
├── node_modules/                 # Dependencies (auto-generated)
│
├── public/                       # Static assets
│   ├── images/                   # Image files
│   │   ├── portfolio/            # Portfolio project images
│   │   ├── testimonials/         # Testimonial avatars
│   │   └── blog/                 # Blog featured images
│   ├── icon.png                  # Favicon
│   └── logo.png                  # Company logo
│
└── src/                          # Source code
    ├── assets/                   # React-specific assets
    │   └── react.svg
    │
    ├── config/                   # Configuration files
    │   └── env.ts                # Environment variables config
    │
    ├── types/                    # TypeScript type definitions
    │   ├── api/index.ts          # API response types
    │   ├── common/index.ts       # Common types
    │   └── entities/index.ts     # Entity types
    │
    ├── lib/                      # Library & utility layer
    │   └── api/
    │       └── client.ts         # Axios instance & interceptors
    │
    ├── Components/               # Component hierarchy (Atomic Design)
    │   ├── Elements/             # ATOMS - Base components
    │   │   ├── Buttons/
    │   │   │   ├── Button.tsx          # ✅ Main button with variants
    │   │   │   └── HamburgerButton.tsx # ✅ Animated hamburger menu
    │   │   ├── Inputs/
    │   │   │   ├── Input.tsx           # ✅ Text input
    │   │   │   ├── TextArea.tsx        # ✅ Multi-line text input
    │   │   │   └── Select.tsx          # ✅ Dropdown select
    │   │   ├── Common/
    │   │   │   ├── Badge.tsx           # ✅ Tag/label badge
    │   │   │   ├── Loading.tsx         # ✅ Loading spinner
    │   │   │   ├── Avatar.tsx          # ✅ User avatar with initials
    │   │   │   ├── Switch.tsx          # ✅ Toggle switch
    │   │   │   ├── Modal.tsx           # ✅ Modal dialog
    │   │   │   ├── Dropdown.tsx        # ✅ Dropdown menu
    │   │   │   └── Pagination.tsx      # ✅ Pagination component
    │   │   ├── Table/
    │   │   │   └── Table.tsx           # ✅ Table components
    │   │   ├── Layout/
    │   │   │   ├── Container.tsx       # ✅ Container wrapper
    │   │   │   ├── Section.tsx         # ✅ Section wrapper
    │   │   │   └── Card.tsx            # ✅ Card wrapper
    │   │   └── Text/
    │   │       ├── Heading.tsx         # ✅ h1-h6 headings
    │   │       ├── Paragraph.tsx       # ✅ Paragraphs
    │   │       ├── Label.tsx           # ✅ Section labels
    │   │       └── Link.tsx            # ✅ Link component
    │   │
    │   ├── Fragments/            # MOLECULES/ORGANISMS - Composite components
    │   │   ├── Common/
    │   │   │   ├── Navbar.tsx          # ✅ Main navigation with hamburger menu
    │   │   │   └── Footer.tsx          # ✅ Footer with navigation & contact
    │   │   │
    │   │   ├── Home/
    │   │   │   ├── HeroSection.tsx     # ✅ Hero with tagline & CTA
    │   │   │   ├── ServiceSection.tsx  # ✅ Services showcase (3 cards)
    │   │   │   ├── FeaturedPortfolio.tsx # ✅ Portfolio highlight
    │   │   │   ├── Testimonials.tsx    # ✅ Client testimonials carousel
    │   │   │   └── CTASection.tsx      # ✅ Call to action
    │   │   │
    │   │   └── Admin/
    │   │       ├── Sidebar.tsx         # ✅ Admin sidebar navigation
    │   │       ├── Header.tsx          # ✅ Admin header with search
    │   │       ├── StatsCard.tsx       # ✅ Dashboard statistics card
    │   │       ├── DataTable.tsx       # ✅ Reusable data table
    │   │       ├── PageHeader.tsx      # ✅ Page header with actions
    │   │       └── FormCard.tsx        # ✅ Form section wrapper
    │   │
    │   ├── Guards/               # Route guards
    │   │   └── AuthGuard.tsx           # ✅ Authentication guard
    │   │
    │   └── Layouts/              # TEMPLATES - Page layouts
    │       ├── PublicLayout.tsx        # ✅ Layout for public pages
    │       └── AdminLayout.tsx         # ✅ Layout for admin pages
    │
    ├── Pages/                    # Page components
    │   ├── Public/
    │   │   ├── HomePage.tsx            # ✅ Home page
    │   │   ├── ServicesPage.tsx        # ✅ Services page
    │   │   ├── PortfolioPage.tsx       # ✅ Portfolio page
    │   │   ├── PortfolioDetailPage.tsx # ✅ Portfolio detail page
    │   │   ├── BlogPage.tsx            # ✅ Blog page
    │   │   ├── AboutPage.tsx           # ✅ About us page
    │   │   ├── ContactPage.tsx         # ✅ Contact page
    │   │   ├── PricingPage.tsx         # ✅ Pricing & packages page
    │   │   └── QuoteBuilderPage.tsx    # ✅ Multi-step quote form
    │   │
    │   └── Admin/
    │       ├── LoginPage.tsx           # ✅ Admin login
    │       ├── DashboardPage.tsx       # ✅ Admin dashboard
    │       ├── Portfolio/
    │       │   ├── PortfolioListPage.tsx   # ✅ Portfolio management
    │       │   └── PortfolioFormPage.tsx   # ✅ Create/Edit portfolio
    │       ├── Blog/
    │       │   ├── BlogListPage.tsx        # ✅ Blog management
    │       │   └── BlogFormPage.tsx        # ✅ Create/Edit blog
    │       ├── Services/
    │       │   └── ServicesListPage.tsx    # ✅ Services management
    │       ├── Inquiries/
    │       │   └── InquiriesListPage.tsx   # ✅ Inquiries management
    │       └── Settings/
    │           └── SettingsPage.tsx        # ✅ Admin settings
    │
    ├── Routes/                   # Routing configuration
    │   └── index.tsx                   # ✅ Main router with auth guard
    │
    ├── Hooks/                    # Custom React hooks
    │   ├── Auth/
    │   ├── Services/
    │   └── ...
    │
    ├── Services/                 # API service layer
    │   ├── Common/
    │   └── ...
    │
    ├── Store/                    # Zustand stores
    │   └── ...
    │
    ├── Utils/                    # Utility functions
    │   └── ...
    │
    ├── App.tsx                   # ✅ App entry component
    ├── main.tsx                  # ✅ React entry point
    └── index.css                 # ✅ Global CSS + Tailwind
```

---

## ATOMIC DESIGN IMPLEMENTATION

### 1️⃣ ELEMENTS (Atoms) - Base Components

**Location:** `src/Components/Elements/`

The most basic components that cannot be broken down further. They are **reusable** and **stateless**.

#### **Buttons/** - Button components
```tsx
// Button.tsx - Button with various variants
<Button
  variant="primary|secondary|outline|ghost|danger"
  size="sm|md|lg"
  loading={boolean}
>
  Click Me
</Button>

// HamburgerButton.tsx - Hamburger button with animation
<HamburgerButton isOpen={boolean} onClick={handler} />
```

#### **Inputs/** - Input fields
```tsx
// Input.tsx
<Input
  label="Name"
  placeholder="Enter name"
  error="Error message"
/>

// TextArea.tsx
<TextArea
  label="Message"
  rows={5}
  placeholder="Your message"
/>

// Select.tsx
<Select
  label="Category"
  options={[{ value: 'web', label: 'Web Development' }]}
  placeholder="Select category"
/>
```

#### **Common/** - Common components
```tsx
// Badge.tsx
<Badge variant="default|yellow|outline" size="sm|md">
  Featured
</Badge>

// Loading.tsx
<Loading size="sm|md|lg" color="white|yellow" />

// Avatar.tsx
<Avatar src="url" name="John Doe" size="sm|md|lg|xl" />

// Switch.tsx
<Switch checked={boolean} onChange={handler} label="Active" />

// Modal.tsx
<Modal isOpen={boolean} onClose={handler} title="Title">
  Content
</Modal>

// Dropdown.tsx
<Dropdown trigger={<button>Menu</button>} options={[...]} />

// Pagination.tsx
<Pagination currentPage={1} totalPages={10} onPageChange={handler} />
```

#### **Table/** - Table components
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHeadCell>Column</TableHeadCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### **Layout/** - Layout wrappers
```tsx
// Container.tsx
<Container maxWidth="sm|md|lg|xl|full">
  {children}
</Container>

// Section.tsx
<Section padding="sm|md|lg|xl" background="transparent|dark|gradient">
  {children}
</Section>

// Card.tsx
<Card variant="default|bordered|gradient" padding="sm|md|lg" hover>
  {children}
</Card>
```

#### **Text/** - Text components
```tsx
// Heading.tsx
<Heading level={1|2|3|4|5|6}>Title</Heading>

// Paragraph.tsx
<Paragraph size="sm|md|lg" color="default|muted|light">
  Content text
</Paragraph>

// Label.tsx
<Label color="yellow|white|muted">Section Label</Label>

// Link.tsx
<Link to="/path">Link Text</Link>
```

---

### 2️⃣ FRAGMENTS (Molecules/Organisms) - Composite Components

**Location:** `src/Components/Fragments/`

Combinations of **Elements** that form more complex components. They contain **logic** and **state**.

#### **Common/** - Common components
```tsx
// Navbar.tsx - Navigation bar with hamburger menu
<Navbar />

// Footer.tsx - Footer component
<Footer />
```

#### **Home/** - Homepage fragments
```tsx
<HeroSection />
<ServiceSection />
<FeaturedPortfolio />
<Testimonials />
<CTASection />
```

#### **Admin/** - Admin fragments
```tsx
// Sidebar.tsx - Admin navigation sidebar
<Sidebar />

// Header.tsx - Admin header with search & user menu
<Header title="Page Title" />

// StatsCard.tsx - Statistics card
<StatsCard
  title="Total Projects"
  value={24}
  icon={<Icon />}
  change={{ value: 12, isPositive: true }}
/>

// DataTable.tsx - Reusable data table
<DataTable
  columns={columns}
  data={data}
  keyField="id"
  searchable
  pagination={{ ... }}
  actions={(item) => <Actions />}
/>

// PageHeader.tsx - Page header with actions
<PageHeader
  title="Portfolio"
  description="Manage projects"
  backLink="/admin"
  actions={<Button>Add</Button>}
/>

// FormCard.tsx - Form section
<FormCard title="Project Info">
  <Input ... />
</FormCard>
```

---

### 3️⃣ LAYOUTS (Templates) - Page Layouts

**Location:** `src/Components/Layouts/`

```tsx
// PublicLayout.tsx - Layout for public pages
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

// AdminLayout.tsx - Layout for admin pages
const AdminLayout = ({ children, title }) => (
  <div className="min-h-screen bg-slate-950">
    <Sidebar />
    <div className="lg:ml-64">
      <Header title={title} />
      <main className="p-4 lg:p-6">{children}</main>
    </div>
  </div>
);
```

---

## PAGES - Page Components

**Location:** `src/Pages/`

### Public Pages

| Page | Route | Features |
|------|-------|----------|
| HomePage | `/` | Hero, Services, Portfolio, Testimonials, CTA |
| ServicesPage | `/services` | Expand/collapse categories, pricing |
| PortfolioPage | `/portfolio` | Filter by category, project cards |
| PortfolioDetailPage | `/portfolio/:slug` | Project details, gallery, related projects |
| BlogPage | `/blog` | Search, filter, featured post |
| AboutPage | `/about` | Stats, story, values, vision & mission |
| ContactPage | `/contact` | Contact form, info, business hours |
| PricingPage | `/pricing` | 3 packages, bonus section |
| QuoteBuilderPage | `/quote` | Multi-step form (4 steps) |

### Admin Pages

| Page | Route | Features |
|------|-------|----------|
| LoginPage | `/admin/login` | Admin authentication |
| DashboardPage | `/admin` | Stats, recent activity, quick links |
| PortfolioListPage | `/admin/portfolio` | Project list, search, CRUD |
| PortfolioFormPage | `/admin/portfolio/create` | Create/Edit project form |
| BlogListPage | `/admin/blog` | Post list, search, CRUD |
| BlogFormPage | `/admin/blog/create` | Create/Edit post form |
| ServicesListPage | `/admin/services` | Service categories management |
| InquiriesListPage | `/admin/inquiries` | Contact form submissions |
| SettingsPage | `/admin/settings` | Company info, social, SEO, payment |

---

## ROUTES - Routing Configuration

**Location:** `src/Routes/`

```tsx
// Routes/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthGuard from '@/Components/Guards/AuthGuard';

const router = createBrowserRouter([
  // Public Routes
  { path: '/', element: <PublicLayout><HomePage /></PublicLayout> },
  { path: '/services', element: <PublicLayout><ServicesPage /></PublicLayout> },
  { path: '/portfolio', element: <PublicLayout><PortfolioPage /></PublicLayout> },
  { path: '/portfolio/:slug', element: <PublicLayout><PortfolioDetailPage /></PublicLayout> },
  // ... more public routes

  // Admin Routes (Protected)
  { path: '/admin/login', element: <AdminLoginPage /> },
  { path: '/admin', element: <AuthGuard><AdminDashboardPage /></AuthGuard> },
  { path: '/admin/portfolio', element: <AuthGuard><AdminPortfolioListPage /></AuthGuard> },
  // ... more admin routes

  // 404
  { path: '*', element: <NotFoundPage /> },
]);
```

---

## STYLING APPROACH

### Design System

```css
/* Colors */
--primary: yellow-400 (accent)
--background: slate-900, slate-800, slate-950 (dark)
--text: white, gray-300, gray-400

/* Gradients */
bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
bg-gradient-to-br from-teal-900 to-slate-800

/* Animations */
- Hover: Yellow text + dash underline from left
- Button: White background fill from left
- Transition duration: 300ms - 500ms
```

### Tailwind CSS Classes Pattern

```tsx
// Button with hover animation
<button className="relative overflow-hidden group">
  <span className="relative z-10 group-hover:text-slate-900 transition-colors duration-500">
    Button Text
  </span>
  <span className="absolute inset-0 bg-white transform origin-left scale-x-0
                   transition-transform duration-500 ease-out group-hover:scale-x-100" />
</button>

// Link with dash underline
<a className="relative text-white hover:text-yellow-400 group">
  Link Text
  <span className="absolute -bottom-1 left-0 h-px bg-yellow-400
                   w-0 transition-all duration-300 ease-out group-hover:w-full" />
</a>
```

---

## ADMIN AUTHENTICATION

### Login Credentials (Demo)
- **Email:** admin@codingin.id
- **Password:** admin123

### Auth Flow
1. User enters credentials on `/admin/login`
2. Token stored in localStorage
3. AuthGuard checks token for protected routes
4. Redirect to login if not authenticated

---

## IMPLEMENTED FEATURES

### Public Features
- ✅ **Homepage** - Hero, Services, Portfolio, Testimonials, CTA
- ✅ **Services** - Expand/collapse categories with pricing
- ✅ **Portfolio** - Filter by category, project cards, detail view
- ✅ **Blog** - Search, filter, featured post
- ✅ **About** - Stats, story, values, vision & mission
- ✅ **Contact** - Complete form, contact info
- ✅ **Pricing** - 3 packages, bonus highlights
- ✅ **Quote Builder** - Multi-step form (4 steps)
- ✅ **Navbar** - Transparent/solid, hamburger menu
- ✅ **Footer** - CTA, navigation, social links

### Admin Features
- ✅ **Login** - JWT authentication
- ✅ **Dashboard** - Stats, activity, tasks
- ✅ **Portfolio Management** - CRUD with image upload
- ✅ **Blog Management** - CRUD with rich editor
- ✅ **Services Management** - Categories & sub-categories
- ✅ **Inquiries** - View & manage contact submissions
- ✅ **Settings** - Company info, social, SEO, payment

### Future Features
- Client Dashboard
- Order Management
- Payment Processing
- API Integration

---

## BEST PRACTICES

### 1. Component Organization
- One component per file
- Group related components in folders
- Use Atomic Design principles
- Keep components focused and reusable

### 2. Naming Conventions
- PascalCase for components (Button.tsx)
- camelCase for hooks (useAuth.ts)
- kebab-case for CSS classes

### 3. TypeScript
- Define interfaces for props
- Use type imports with `import type`
- Avoid `any` type

### 4. Styling
- Use Tailwind CSS utility classes
- Group related classes logically
- Use clsx for conditional classes

---

**Happy Coding!**

---

*Documentation for Codingin - Company Profile & Project Management System*
*Last updated: 2024*
