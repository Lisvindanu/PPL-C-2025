# PROJECT STRUCTURE DOCUMENTATION - SKILLCONNECT FRONTEND

> **Project:** SkillConnect - Platform Freelancer Marketplace
> **Tech Stack:** React 18 + JavaScript + Vite + Tailwind CSS + React Query
> **State Management:** React Query + Custom Hooks + Context

---

## PROJECT OVERVIEW

SkillConnect adalah platform marketplace yang menghubungkan freelancer dengan client. Dibangun dengan:
- **React 18** dengan hooks-based architecture
- **JavaScript** (JSX)
- **Vite** untuk fast development & build
- **Tailwind CSS** untuk styling
- **React Query (@tanstack/react-query)** untuk server state management
- **Axios** untuk HTTP client
- **Elements & Fragments Pattern** untuk component organization
- **Service + Hook Pattern** untuk business logic
- **JWT-based authentication** dengan localStorage

---

## COMPLETE FOLDER STRUCTURE

```
frontend/
├── .env                          # Environment variables
├── .gitignore                    # Git ignore configuration
├── eslint.config.js              # ESLint config
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── vite.config.js                # Vite configuration dengan path alias @/
│
├── public/                       # Static assets
│   └── images/                   # Image files
│
└── src/                          # Source code
    ├── config/                   # Configuration files
    │
    ├── lib/                      # Library & utility layer
    │   └── api/
    │       └── client.js         # Axios instance & interceptors
    │
    ├── components/               # Component hierarchy
    │   ├── Elements/             # Base UI components (Atoms)
    │   │   ├── Buttons/          # Button, IconButton, KebabButton, etc.
    │   │   ├── Inputs/           # Input, TextArea, Select, PasswordInput, etc.
    │   │   ├── Common/           # Avatar, Badge, Modal, Spinner, Pagination, etc.
    │   │   ├── Layout/           # Card, Breadcrumb
    │   │   ├── Text/             # Label, Text, GradientText, PriceText
    │   │   ├── Navigation/       # NavLink, Logo, NotificationBell
    │   │   └── Icons/            # Icon, FAIcon
    │   │
    │   ├── Fragments/            # Composite components (Molecules/Organisms)
    │   │   ├── Common/           # Navbar, Footer, ToastProvider, LoadingOverlay
    │   │   ├── Home/             # HeroSection, CategoryGrid, ServicesGrid
    │   │   ├── Profile/          # ProfileInfo, PortfolioSection, SkillsSection
    │   │   ├── Service/          # ServiceCard, MediaFormCard, PricingFormCard
    │   │   ├── Order/            # OrderCard, OrderList, OrderTimeline
    │   │   ├── Dashboard/        # DashboardHeaderBar, NavHeader, UserMenu
    │   │   ├── Auth/             # AuthCard, FormGroup, OTPInput, ResetPassword*
    │   │   ├── Admin/            # Sidebar, Header, Charts, Tables, Toolbars
    │   │   └── Search/           # SearchBar, SearchFilterSidebar
    │   │
    │   ├── Layouts/              # Page layouts (Templates)
    │   │   ├── DashboardLayout.jsx
    │   │   ├── LandingPageTemplate.jsx
    │   │   ├── ProfileLayout.jsx
    │   │   └── AuthLayout.jsx
    │   │
    │   └── Guards/               # Route guards
    │       └── ProtectedRoute.jsx
    │
    ├── pages/                    # Page components
    │   ├── Public/               # Public pages
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterClientPage.jsx
    │   │   ├── RegisterFreelancerPage.jsx
    │   │   ├── ForgotPasswordPage.jsx
    │   │   ├── OTPConfirmPage.jsx
    │   │   ├── NewPasswordPage.jsx
    │   │   ├── EmailVerificationPage.jsx
    │   │   ├── ServiceListPage.jsx
    │   │   ├── SearchPage.jsx
    │   │   ├── NotFoundPage.jsx
    │   │   ├── FreelancerProfilePage.jsx
    │   │   ├── FreelancerDetailPage.jsx
    │   │   └── ServiceDetailPage.jsx
    │   │
    │   ├── Client/               # Client dashboard pages
    │   │   ├── DashboardPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── ProfileEditPage.jsx
    │   │   ├── BookmarkPage.jsx
    │   │   ├── FavoritePage.jsx
    │   │   ├── RiwayatPesananPage.jsx
    │   │   ├── OrderListPage.jsx
    │   │   ├── OrderDetailPage.jsx
    │   │   ├── CreateOrderPage.jsx
    │   │   └── ClientSpendingPage.jsx
    │   │
    │   ├── Freelancer/           # Freelancer management pages
    │   │   ├── ServicePage.jsx
    │   │   ├── ServiceCreatePage.jsx
    │   │   ├── ServiceEditPage.jsx
    │   │   ├── OrdersIncomingPage.jsx
    │   │   └── FreelancerEarningsPage.jsx
    │   │
    │   ├── Admin/                # Admin dashboard pages
    │   │   ├── DashboardPage.jsx
    │   │   ├── UserManagementPage.jsx
    │   │   ├── ServiceManagementPage.jsx
    │   │   ├── CategoryManagementPage.jsx
    │   │   ├── SubCategoryManagementPage.jsx
    │   │   ├── TransactionTrendsPage.jsx
    │   │   ├── AllNotificationsPage.jsx
    │   │   └── FraudReportDetailPage.jsx
    │   │
    │   ├── payment/              # Payment flow pages
    │   │   ├── PaymentSuccessPage.jsx
    │   │   ├── PaymentPendingPage.jsx
    │   │   ├── PaymentErrorPage.jsx
    │   │   ├── PaymentExpiredPage.jsx
    │   │   ├── PaymentGatewayPage.jsx
    │   │   └── PaymentProcessingPage.jsx
    │   │
    │   └── jobs/                 # Job detail pages
    │       └── ServiceDetailPage.jsx
    │
    ├── hooks/                    # Custom React hooks
    │   ├── useAuth.js
    │   ├── useOrder.js
    │   ├── useServiceDetail.js
    │   ├── useServiceSearch.js
    │   └── useMyServices.js
    │
    ├── services/                 # API service layer
    │   ├── authService.js
    │   ├── serviceService.js
    │   ├── orderService.js
    │   ├── paymentService.js
    │   ├── bookmarkService.js
    │   ├── favoriteService.js
    │   ├── adminService.js
    │   └── adminKategoriService.js
    │
    ├── utils/                    # Utility functions
    │   ├── axiosConfig.js        # Axios configuration with interceptors
    │   ├── format.js             # Formatting utilities
    │   ├── validators.js         # Form validators
    │   └── mediaUrl.js           # Media URL helpers
    │
    ├── styles/                   # CSS files
    │   ├── auth.css
    │   └── fonts.css
    │
    ├── mocks/                    # Mock data for development
    │
    ├── App.jsx                   # App entry component with routes
    └── main.jsx                  # React entry point
```

---

## COMPONENT ARCHITECTURE

### 1. ELEMENTS (Base Components)

**Location:** `src/components/Elements/`

Komponen dasar yang tidak bisa dipecah lagi. Bersifat **reusable** dan umumnya **stateless**.

#### **Buttons/** - Komponen tombol
| Component | Description |
|-----------|-------------|
| Button.jsx | Tombol utama dengan variants |
| IconButton.jsx | Tombol dengan ikon |
| KebabButton.jsx | Tombol menu kebab (3 dots) |
| SearchButton.jsx | Tombol pencarian |
| ResetPasswordButton.jsx | Tombol untuk reset password |

#### **Inputs/** - Komponen input
| Component | Description |
|-----------|-------------|
| Input.jsx | Text input standar |
| TextField.jsx | Text field dengan label |
| TextArea.jsx | Multi-line text input |
| Select.jsx | Dropdown select |
| SelectBox.jsx | Styled select box |
| PasswordInput.jsx | Input password dengan toggle show/hide |
| SearchInput.jsx | Input untuk pencarian |
| UploadDropzone.jsx | Dropzone untuk upload file |

#### **Common/** - Komponen umum
| Component | Description |
|-----------|-------------|
| Avatar.jsx | User avatar dengan initials |
| Badge.jsx | Tag/label badge |
| StatusBadge.jsx | Badge untuk status |
| Spinner.jsx | Loading spinner |
| Modal.jsx | Modal dialog |
| ConfirmModal.jsx | Modal konfirmasi |
| Pagination.jsx | Komponen pagination |
| StarRating.jsx | Rating bintang |
| Chip.jsx | Chip/tag component |
| TagPill.jsx | Tag pill untuk labels |

#### **Layout/** - Komponen layout
| Component | Description |
|-----------|-------------|
| Card.jsx | Card wrapper |
| Breadcrumb.jsx | Breadcrumb navigation |

#### **Text/** - Komponen teks
| Component | Description |
|-----------|-------------|
| Label.jsx | Form labels |
| Text.jsx | Text component |
| GradientText.jsx | Text dengan gradient |
| PriceText.jsx | Format harga |
| ResetPasswordLabel.jsx | Label untuk reset password |

#### **Navigation/** - Komponen navigasi
| Component | Description |
|-----------|-------------|
| NavLink.jsx | Navigation link |
| Logo.jsx | Logo component |
| NotificationBell.jsx | Notification bell icon |

#### **Icons/** - Komponen ikon
| Component | Description |
|-----------|-------------|
| Icon.jsx | Icon wrapper |
| FAIcon.jsx | FontAwesome icon |

---

### 2. FRAGMENTS (Composite Components)

**Location:** `src/components/Fragments/`

Kombinasi dari **Elements** yang membentuk komponen lebih kompleks. Mengandung **logic** dan **state**.

#### **Common/** - Fragment umum
| Component | Description |
|-----------|-------------|
| Navbar.jsx | Main navigation bar |
| Footer.jsx | Footer component |
| ToastProvider.jsx | Toast notification provider |
| LoadingOverlay.jsx | Loading overlay |
| NotificationPanel.jsx | Panel notifikasi |
| RatingModal.jsx | Modal untuk rating |
| FavoriteToast.jsx | Toast untuk favorite |
| SavedToast.jsx | Toast untuk saved |
| SuccessModal.jsx | Modal sukses |

#### **Home/** - Fragment homepage
| Component | Description |
|-----------|-------------|
| HeroSection.jsx | Hero section dengan search |
| CategoryGrid.jsx | Grid kategori |
| CategoryServiceSection.jsx | Section layanan per kategori |
| ServicesGrid.jsx | Grid layanan |
| RecommendationSection.jsx | Section rekomendasi |
| CategoryCard.jsx | Card kategori |
| CategoryMenu.jsx | Menu kategori |
| TextRotator.jsx | Text dengan animasi rotasi |
| SearchBarLanding.jsx | Search bar untuk landing |

#### **Profile/** - Fragment profil
| Component | Description |
|-----------|-------------|
| ProfileInfo.jsx | Info profil user |
| ProfileHeader.jsx | Header profil |
| PortfolioSection.jsx | Section portfolio |
| PortfolioGrid.jsx | Grid portfolio |
| SkillsSection.jsx | Section skills |
| SkillTag.jsx | Tag skill |
| StatsGrid.jsx | Grid statistik |
| EditForm.jsx | Form edit profil |
| InfoCard.jsx | Card informasi |
| LanguageItem.jsx | Item bahasa |
| VerificationBadge.jsx | Badge verifikasi |
| AboutFreelancerCard.jsx | Card about freelancer |
| ProfileLoadingOverlay.jsx | Loading overlay profil |

#### **Service/** - Fragment layanan
| Component | Description |
|-----------|-------------|
| ServiceCard.jsx | Card layanan |
| ServiceCardItem.jsx | Item card layanan |
| ServiceHeaderCard.jsx | Header card layanan |
| ServiceTabs.jsx | Tabs layanan |
| MyServiceCard.jsx | Card layanan saya |
| MyServicesGrid.jsx | Grid layanan saya |
| AddServiceCallout.jsx | Callout tambah layanan |
| MediaFormCard.jsx | Form media layanan |
| MediaEditFormCard.jsx | Form edit media |
| PricingFormCard.jsx | Form pricing |
| PricingEditFormCard.jsx | Form edit pricing |
| ReviewsSection.jsx | Section review |
| FilterKategori.jsx | Filter kategori |

#### **Order/** - Fragment pesanan
| Component | Description |
|-----------|-------------|
| OrderCard.jsx | Card pesanan |
| OrderList.jsx | List pesanan |
| OrderTimeline.jsx | Timeline pesanan |
| OrderStatus.jsx | Status pesanan |
| OrderForm.jsx | Form pesanan |
| OrderConfirmModal.jsx | Modal konfirmasi pesanan |
| FreelancerOrderActions.jsx | Actions untuk freelancer |
| InteractionBar.jsx | Bar interaksi |
| SummaryCard.jsx | Card summary |

#### **Dashboard/** - Fragment dashboard
| Component | Description |
|-----------|-------------|
| DashboardHeaderBar.jsx | Header bar dashboard |
| DashboardSubnav.jsx | Sub navigation dashboard |
| NavHeader.jsx | Header navigasi |
| NavItem.jsx | Item navigasi |
| NavKategori.jsx | Navigasi kategori |
| NavService.jsx | Navigasi service |
| StatCard.jsx | Card statistik |
| UserMenu.jsx | Menu user |

#### **Auth/** - Fragment autentikasi
| Component | Description |
|-----------|-------------|
| AuthCard.jsx | Card autentikasi |
| FormGroup.jsx | Group form |
| OTPInput.jsx | Input OTP |
| ResetPasswordCard.jsx | Card reset password |
| ResetPasswordLayout.jsx | Layout reset password |
| ResetPasswordFormGroup.jsx | Form group reset password |
| RoleCard.jsx | Card role selection |
| HybridModeController.jsx | Controller hybrid mode |
| MockInfoCard.jsx | Info card mock mode |
| ResultModal.jsx | Modal hasil |

#### **Admin/** - Fragment admin
| Component | Description |
|-----------|-------------|
| Sidebar.jsx | Sidebar admin |
| Header.jsx | Header admin |
| UserChart.jsx | Chart user |
| OrderChart.jsx | Chart order |
| TransactionChart.jsx | Chart transaksi |
| TransactionTrendsContent.jsx | Content trends transaksi |
| UserManagementToolbar.jsx | Toolbar user management |
| UserTable.jsx | Table user |
| ServiceManagementToolbar.jsx | Toolbar service management |
| ServiceTable.jsx | Table service |
| CategoryManagementToolbar.jsx | Toolbar kategori |
| CategoryTable.jsx | Table kategori |
| CategoryTrendsTable.jsx | Table trends kategori |
| SubCategoryManagementToolbar.jsx | Toolbar sub kategori |
| SubCategoryTable.jsx | Table sub kategori |
| AdminSearchBar.jsx | Search bar admin |
| BlockListSection.jsx | Section block list |
| BlockReasonCard.jsx | Card alasan block |
| ConfirmDeleteModal.jsx | Modal konfirmasi delete |
| FilterForm.jsx | Form filter |

#### **Search/** - Fragment pencarian
| Component | Description |
|-----------|-------------|
| SearchBar.jsx | Search bar |
| SearchFilterSidebar.jsx | Sidebar filter pencarian |
| SearchServiceCardItem.jsx | Card item hasil pencarian |
| SearchSortBar.jsx | Bar sorting pencarian |

---

### 3. LAYOUTS (Page Templates)

**Location:** `src/components/Layouts/`

| Layout | Description |
|--------|-------------|
| DashboardLayout.jsx | Layout untuk admin dashboard |
| LandingPageTemplate.jsx | Template untuk landing page |
| ProfileLayout.jsx | Layout untuk halaman profil |
| AuthLayout.jsx | Layout untuk halaman autentikasi |

---

### 4. GUARDS (Route Protection)

**Location:** `src/components/Guards/`

| Guard | Description |
|-------|-------------|
| ProtectedRoute.jsx | Guard untuk route yang memerlukan autentikasi |

---

## PAGES STRUCTURE

### Public Pages (Tanpa login)

| Page | Route | Description |
|------|-------|-------------|
| LandingPage | `/` | Homepage dengan hero, kategori, services |
| LoginPage | `/login` | Halaman login |
| RegisterClientPage | `/register/client` | Registrasi sebagai client |
| RegisterFreelancerPage | `/register/freelancer` | Registrasi sebagai freelancer (protected) |
| ServiceListPage | `/services` | Daftar semua layanan |
| ServiceDetailPage | `/services/:slug` | Detail layanan |
| SearchPage | `/search` | Halaman pencarian |
| FreelancerProfilePage | `/freelancer/:id` | Profil freelancer |
| FreelancerDetailPage | `/freelancer/:id/detail` | Detail freelancer |
| ForgotPasswordPage | `/forgot-password` | Lupa password |
| OTPConfirmPage | `/reset-password/otp` | Konfirmasi OTP |
| NewPasswordPage | `/reset-password/new-password` | Set password baru |
| EmailVerificationPage | `/verify-email` | Verifikasi email |
| NotFoundPage | `*` | Halaman 404 |

### Client Pages (Login required)

| Page | Route | Description |
|------|-------|-------------|
| DashboardPage | `/dashboard` | Dashboard client |
| ProfilePage | `/profile` | Profil user |
| ProfileEditPage | `/profile/edit` | Edit profil |
| BookmarkPage | `/bookmarks` | Daftar bookmark |
| FavoritePage | `/favorit` | Daftar favorit |
| RiwayatPesananPage | `/riwayat-pesanan` | Riwayat pesanan |
| OrderListPage | `/orders` | Daftar pesanan |
| OrderDetailPage | `/orders/:id` | Detail pesanan |
| CreateOrderPage | `/create-order/:id` | Buat pesanan |
| ClientSpendingPage | `/analytics/spending` | Analitik pengeluaran |

### Freelancer Pages (Login required)

| Page | Route | Description |
|------|-------|-------------|
| ServicePage | `/freelance/service` | Kelola layanan |
| ServiceCreatePage | `/freelance/service/new` | Buat layanan baru |
| ServiceEditPage | `/freelance/service/:id/edit` | Edit layanan |
| OrdersIncomingPage | `/freelance/orders` | Pesanan masuk |
| FreelancerEarningsPage | `/analytics/earnings` | Analitik pendapatan |

### Admin Pages (Login required)

| Page | Route | Description |
|------|-------|-------------|
| DashboardPage | `/admin/dashboard` | Dashboard admin |
| UserManagementPage | `/admin/users` | Kelola user |
| ServiceManagementPage | `/admin/services` | Kelola layanan |
| CategoryManagementPage | `/admin/kategori` | Kelola kategori |
| SubCategoryManagementPage | `/admin/subkategori` | Kelola sub kategori |
| TransactionTrendsPage | `/admin/transaction-trends` | Trends transaksi |
| AllNotificationsPage | `/admin/notifications` | Semua notifikasi |
| FraudReportDetailPage | `/admin/fraud-report/:type/:id` | Detail laporan fraud |

### Payment Pages

| Page | Route | Description |
|------|-------|-------------|
| PaymentGatewayPage | `/payment/:orderId` | Gateway pembayaran |
| PaymentProcessingPage | `/payment/processing/:paymentId` | Proses pembayaran |
| PaymentSuccessPage | `/payment/success` | Pembayaran berhasil |
| PaymentPendingPage | `/payment/pending` | Pembayaran pending |
| PaymentErrorPage | `/payment/error` | Pembayaran gagal |
| PaymentExpiredPage | `/payment/expired` | Pembayaran expired |

---

## HOOKS (Custom React Hooks)

| Hook | Description |
|------|-------------|
| useAuth.js | Authentication & user state |
| useOrder.js | Order management |
| useServiceDetail.js | Service detail fetching |
| useServiceSearch.js | Service search functionality |
| useMyServices.js | Freelancer's own services |

---

## SERVICES (API Layer)

| Service | Description |
|---------|-------------|
| authService.js | Authentication API calls |
| serviceService.js | Service/layanan API calls |
| orderService.js | Order API calls |
| paymentService.js | Payment API calls |
| bookmarkService.js | Bookmark API calls |
| favoriteService.js | Favorite API calls |
| adminService.js | Admin API calls |
| adminKategoriService.js | Admin kategori API calls |
| adminSubKategoriService.js | Admin sub kategori API calls |
| hybridResetPasswordService.js | Reset password API calls |

---

## IMPORT PATH CONVENTIONS

Dengan Vite path alias `@/`, import menggunakan format:

```javascript
// Import dari components
import Button from "@/components/Elements/Buttons/Button";
import Navbar from "@/components/Fragments/Common/Navbar";
import DashboardLayout from "@/components/Layouts/DashboardLayout";
import ProtectedRoute from "@/components/Guards/ProtectedRoute";

// Import dari services
import { authService } from "@/services/authService";

// Import dari hooks
import { useAuth } from "@/hooks/useAuth";

// Import dari utils
import api from "@/utils/axiosConfig";
```

Atau dengan relative path:
```javascript
// Dari pages ke components
import Navbar from "../../components/Fragments/Common/Navbar";
import Button from "../../components/Elements/Buttons/Button";

// Dari Fragments ke Elements
import Button from "../../Elements/Buttons/Button";
import Avatar from "../../Elements/Common/Avatar";

// Dari Fragments ke services
import { authService } from "../../../services/authService";
```

---

## STYLING

### Tailwind CSS Classes

Project menggunakan Tailwind CSS dengan custom configuration:

```css
/* Primary Colors */
--primary: blue-500, blue-600 (accent)
--background: gray-50, white
--text: gray-900, gray-600, gray-400

/* Admin Colors */
--admin-bg: #DBE2EF
--admin-accent: #4782BE, #1D375B
```

---

## AUTHENTICATION FLOW

1. User login via `/login`
2. Token disimpan di `localStorage`
3. `ProtectedRoute` cek token untuk protected routes
4. Axios interceptor menambahkan token ke setiap request
5. Jika 401, redirect ke `/login`

---

## BUILD & DEVELOPMENT

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

**Happy Coding!**

---

*Documentation for SkillConnect - Freelancer Marketplace Platform*
*Last updated: December 2025*
