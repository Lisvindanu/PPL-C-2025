# Frontend Architecture Documentation - Quick Start

Welcome! This directory contains comprehensive documentation for the PPL-C-2025 frontend project.

## Start Here

If you're new to the project, follow this order:

1. **FRONTEND_SUMMARY.txt** (5 min read)
   - Quick overview of tech stack and architecture
   - Best for: Getting oriented quickly

2. **FRONTEND_ARCHITECTURE.md** (25 min read)
   - Comprehensive guide covering everything
   - Best for: Understanding all patterns in detail

3. **PAYMENT_IMPLEMENTATION_CHECKLIST.md**
   - Step-by-step guide for building payment features
   - Best for: Following while you code

4. **PAYMENT_COMPONENTS_TEMPLATE.md**
   - Ready-to-copy code examples
   - Best for: Copy-paste reference while coding

5. **FRONTEND_DOCS_INDEX.md**
   - Index and how to use all these documents
   - Best for: Finding specific sections

## What's Inside

### Core Architecture Documentation
- **FRONTEND_ARCHITECTURE.md**: Complete architectural reference
- **FRONTEND_SUMMARY.txt**: Quick reference card
- **FRONTEND_DOCS_INDEX.md**: Navigation guide

### Payment Implementation
- **PAYMENT_COMPONENTS_TEMPLATE.md**: Code templates for all components
- **PAYMENT_IMPLEMENTATION_CHECKLIST.md**: Step-by-step checklist

## Key Facts

- **Framework**: React 18.3.1 + Vite 5.2.0
- **Routing**: React Router v6
- **Styling**: Tailwind CSS ONLY (no CSS modules, no styled-components)
- **Architecture**: Atomic Design (Atoms → Molecules → Organisms → Templates → Pages)
- **Components**: 95 total (28 atoms + 39 molecules + 24 organisms + 4 templates)
- **State**: localStorage + useState (no Redux/Zustand)
- **API**: Axios with interceptors and service layer

## Quick Navigation

| Need | Document | Section |
|------|----------|---------|
| Tech stack overview | FRONTEND_SUMMARY.txt | Top sections |
| Folder structure | FRONTEND_ARCHITECTURE.md | Section 2 |
| Routing setup | FRONTEND_ARCHITECTURE.md | Section 3 |
| Atomic Design | FRONTEND_ARCHITECTURE.md | Section 4 |
| Styling patterns | FRONTEND_ARCHITECTURE.md | Section 5 |
| State management | FRONTEND_ARCHITECTURE.md | Section 6 |
| API integration | FRONTEND_ARCHITECTURE.md | Section 7 |
| Component examples | PAYMENT_COMPONENTS_TEMPLATE.md | All sections |
| Step-by-step guide | PAYMENT_IMPLEMENTATION_CHECKLIST.md | All phases |

## Common Tasks

### Want to create a new component?
1. Read FRONTEND_ARCHITECTURE.md Section 4 (Atomic Design)
2. Look at similar existing component in `/src/components/`
3. Reference PAYMENT_COMPONENTS_TEMPLATE.md
4. Copy the appropriate pattern and adapt

### Want to call an API?
1. Read FRONTEND_ARCHITECTURE.md Section 7 (API Integration)
2. Create service file similar to `authService.js`
3. Use in component with useState + useEffect + try-catch
4. Reference PAYMENT_COMPONENTS_TEMPLATE.md Section 1

### Want to add styling?
1. Read FRONTEND_ARCHITECTURE.md Section 5 (Styling)
2. Use only Tailwind CSS classes (no separate CSS files)
3. Reference `tailwind.config.js` for custom colors
4. Check FRONTEND_SUMMARY.txt for Common Tailwind Classes

### Want to create a page?
1. Read FRONTEND_ARCHITECTURE.md Section 4.4 (Pages Pattern)
2. Look at existing page like `ProfilePage.jsx`
3. Reference PAYMENT_COMPONENTS_TEMPLATE.md Section 8
4. Follow: Navbar + Layout + Content pattern

### Want to build payment features?
1. Read FRONTEND_SUMMARY.txt (Payment Development section)
2. Follow PAYMENT_IMPLEMENTATION_CHECKLIST.md in order
3. Reference PAYMENT_COMPONENTS_TEMPLATE.md while coding
4. Use existing atoms/molecules from `src/components/`

## Architecture Summary

```
ATOMIC DESIGN HIERARCHY:

Atoms (base UI, 28 files)
  ↓
Molecules (composed, 39 files)
  ↓
Organisms (complex, 24 files)
  ↓
Templates (layouts, 4 files)
  ↓
Pages (routes, 14+ files)

STYLING:
  Tailwind CSS ONLY (utility-first)
  No CSS modules, no styled-components
  Colors: Primary blues + status colors
  Fonts: Poppins (titles), Inter (body)

STATE:
  Local: useState + useEffect
  Persist: localStorage
  Global: ToastProvider
  No Redux/Zustand

API:
  Axios base + interceptors
  Service layer pattern
  Try-catch error handling
  401 auto-redirect to login

ROUTING:
  React Router v6
  ProtectedRoute wrapper
  10+ routes (public + protected)
```

## Documentation Statistics

- **Total Size**: ~90 KB
- **4 Main Documents**: Comprehensive coverage
- **95 Components**: Fully analyzed and documented
- **10+ Code Examples**: Ready to copy
- **10 Implementation Phases**: Step-by-step guide

## Before You Code

Make sure you understand:
1. Tailwind CSS basics (utility-first styling)
2. React hooks (useState, useEffect, useCallback)
3. Axios and REST APIs
4. React Router v6 routing
5. Atomic Design pattern

## Frequently Asked Questions

**Q: Should I use CSS modules?**
A: No. Use Tailwind CSS utility classes only.

**Q: How do I structure a component?**
A: Follow Atomic Design: atoms → molecules → organisms → templates → pages

**Q: How do I call the API?**
A: Create a service file with axios, use in component with try-catch.

**Q: How do I handle forms?**
A: Use useState with form object, controlled inputs with onChange.

**Q: How do I protect pages?**
A: Wrap with ProtectedRoute component that checks localStorage.token

**Q: Where do I find examples?**
A: See PAYMENT_COMPONENTS_TEMPLATE.md for 10+ ready-to-use examples.

## Quick Reference

### Command Line
```bash
npm install       # Install dependencies
npm run dev       # Start dev server (port 3000)
npm run build     # Build for production
npm run preview   # Preview production build
```

### Environment
```
VITE_API_BASE_URL=http://localhost:5000/api
Accessed via: import.meta.env.VITE_API_BASE_URL
```

### Directory Structure
```
frontend/
  src/
    components/atoms (28)      ← Base UI
    components/molecules (39)  ← Composed
    components/organisms (24)  ← Complex
    components/templates (4)   ← Layouts
    pages/ (14+)               ← Routes
    services/ (3+)             ← API calls
    hooks/ (2+)                ← Custom hooks
    utils/                     ← Helpers
    styles/                    ← Global CSS
```

## Getting Help

1. **Architecture questions**: See FRONTEND_ARCHITECTURE.md
2. **Code examples**: See PAYMENT_COMPONENTS_TEMPLATE.md
3. **Implementation help**: See PAYMENT_IMPLEMENTATION_CHECKLIST.md
4. **Navigation help**: See FRONTEND_DOCS_INDEX.md
5. **Existing patterns**: Check `/src/components/` directory

## Document Files

- `FRONTEND_SUMMARY.txt` - Quick reference (9 KB)
- `FRONTEND_ARCHITECTURE.md` - Complete guide (21 KB)
- `PAYMENT_COMPONENTS_TEMPLATE.md` - Code examples (21 KB)
- `PAYMENT_IMPLEMENTATION_CHECKLIST.md` - Step-by-step (13 KB)
- `FRONTEND_DOCS_INDEX.md` - Navigation guide (13 KB)
- `README_FRONTEND_DOCS.md` - This file (you are here)

## Next Steps

1. Read FRONTEND_SUMMARY.txt (5 minutes)
2. Read FRONTEND_ARCHITECTURE.md (25 minutes)
3. Skim PAYMENT_IMPLEMENTATION_CHECKLIST.md
4. Start building following the patterns!

---

**Happy coding! All the patterns, examples, and guides you need are in these documents.**
