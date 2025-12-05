# Payment Frontend Implementation Checklist

This checklist guides you through creating payment pages following the PPL-C-2025 frontend architecture patterns.

---

## Phase 1: Setup & Foundation

### Prerequisite Files
- [ ] Read `FRONTEND_ARCHITECTURE.md` (complete understanding of patterns)
- [ ] Read `PAYMENT_COMPONENTS_TEMPLATE.md` (understand component examples)
- [ ] Review existing payment API endpoints in backend

### Create Payment Service
- [ ] Create `/src/services/paymentService.js`
- [ ] Implement `createPayment()` method
- [ ] Implement `getPaymentById()` method  
- [ ] Implement `getPaymentByOrderId()` method
- [ ] Implement `releaseEscrow()` method
- [ ] Implement `requestRefund()` method
- [ ] Implement `getAnalytics()` method
- [ ] Add proper error handling & response format

### Update App Routes
- [ ] Add payment-related routes to `/src/App.jsx`
- [ ] Wrap routes with `ProtectedRoute` component
- [ ] Test route navigation works

---

## Phase 2: Create Atomic Components

### Atoms (Base UI Elements)

#### AmountInput
- [ ] Create `/src/components/atoms/AmountInput.jsx`
- [ ] Handle currency formatting (Rp)
- [ ] Accept numeric input only
- [ ] Use existing Input styling pattern
- [ ] Export as default

#### PaymentStatusBadge  
- [ ] Create `/src/components/atoms/PaymentStatusBadge.jsx`
- [ ] Support 4 statuses: pending, berhasil, gagal, cancelled
- [ ] Use Tailwind status colors (warning, success, danger)
- [ ] Display localized labels
- [ ] Export as default

#### Verify Other Atoms Exist
- [ ] Button.jsx - has variants
- [ ] Input.jsx - basic input
- [ ] Card.jsx - card component
- [ ] Label.jsx - form labels
- [ ] Select.jsx - dropdown select
- [ ] Spinner.jsx - loading indicator
- [ ] Text.jsx - text variants

---

## Phase 3: Create Molecule Components

### PaymentMethodCard
- [ ] Create `/src/components/molecules/PaymentMethodCard.jsx`
- [ ] Compose: Card + Icon + Text + Radio input
- [ ] Handle selection state
- [ ] Visual feedback on selection
- [ ] Accept method object with id, name, description, icon
- [ ] Call onSelect callback

### PaymentFormCard
- [ ] Create `/src/components/molecules/PaymentFormCard.jsx`
- [ ] Compose: Card + Label + AmountInput + Select + Input
- [ ] Accept form values as props
- [ ] Handle form field changes
- [ ] Show/hide channel field based on method
- [ ] Validate required fields
- [ ] Show loading state on buttons
- [ ] Call onCancel & onSubmit callbacks

### PaymentHistoryItem
- [ ] Create `/src/components/molecules/PaymentHistoryItem.jsx`
- [ ] Display payment details in list item format
- [ ] Show order ID with status badge
- [ ] Format currency and date properly
- [ ] Use Lucide icon (ChevronRight) for interaction
- [ ] Make clickable with onClick callback
- [ ] Hover effect

### Other Molecules (Reference Existing)
- [ ] Verify `ServiceCard.jsx` pattern for reuse
- [ ] Verify `OrderCard.jsx` exists for orders

---

## Phase 4: Create Organism Components

### PaymentHistoryList
- [ ] Create `/src/components/organisms/PaymentHistoryList.jsx`
- [ ] Compose: multiple PaymentHistoryItem components
- [ ] Show Spinner when loading
- [ ] Show empty state message when no payments
- [ ] Accept payments array as prop
- [ ] Call onSelectPayment callback on item click
- [ ] Proper spacing between items

### OrderPaymentCheckout
- [ ] Create `/src/components/organisms/OrderPaymentCheckout.jsx`
- [ ] Multi-step wizard (3 steps)
- [ ] Step 1: Select payment method (PaymentMethodCard)
- [ ] Step 2: Enter payment details (PaymentFormCard)
- [ ] Step 3: Confirm payment
- [ ] Show order summary (Card component)
- [ ] Handle step navigation
- [ ] Submit to paymentService.createPayment()
- [ ] Show loading during submission
- [ ] Handle success/error callbacks

### PaymentAnalyticsDashboard (Optional)
- [ ] Create `/src/components/organisms/PaymentAnalyticsDashboard.jsx`
- [ ] Use existing Chart components (Recharts)
- [ ] Display payment statistics
- [ ] Show period selector (7d, 30d, 90d, 365d)
- [ ] Call paymentService.getAnalytics()

---

## Phase 5: Create Page Components

### PaymentPage
- [ ] Create `/src/pages/PaymentPage.jsx`
- [ ] Compose: Navbar + PaymentFormCard + PaymentHistoryList
- [ ] Initialize state for form, payments, loading, error
- [ ] useEffect to load payment history on mount
- [ ] Handle form submission
- [ ] Handle payment creation
- [ ] Show error messages
- [ ] Show loading overlay during API calls
- [ ] Proper grid layout (responsive)
- [ ] Redirect to payment gateway if successful

### CheckoutPage  
- [ ] Create `/src/pages/CheckoutPage.jsx` (for order checkout)
- [ ] Use OrderPaymentCheckout organism
- [ ] Get order data from route params or context
- [ ] Handle payment success redirect
- [ ] Show order confirmation

### PaymentHistoryPage
- [ ] Create `/src/pages/PaymentHistoryPage.jsx`
- [ ] Show full payment history with filters
- [ ] Display PaymentHistoryList organism
- [ ] Add date range filter
- [ ] Add status filter
- [ ] Pagination support (if needed)

---

## Phase 6: Styling & Polish

### Tailwind Integration
- [ ] Verify all components use Tailwind (no CSS files)
- [ ] Use custom colors from tailwind.config.js
- [ ] Primary: #4782BE, #9DBBDD, #D8E3F3
- [ ] Status: success (#10b981), warning (#f59e0b), danger (#ef4444)
- [ ] Responsive classes (md:, lg:)
- [ ] Proper spacing (gap, p, m)

### Component Styling
- [ ] Cards have rounded-lg shadow-sm
- [ ] Buttons have proper padding & hover states
- [ ] Forms have proper label alignment
- [ ] Inputs have focus states
- [ ] Status badges have proper colors
- [ ] Loading states show spinner or disabled state

### Responsive Design
- [ ] Mobile-first approach
- [ ] Test on small screens (< 640px)
- [ ] Test on medium screens (640-1024px)
- [ ] Test on large screens (> 1024px)
- [ ] Grid layouts adjust properly

---

## Phase 7: State Management & Logic

### State Patterns
- [ ] Use useState for component state
- [ ] Use useEffect for side effects
- [ ] Initialize state with default values
- [ ] Handle loading states properly
- [ ] Handle error states properly
- [ ] Handle empty states

### API Integration
- [ ] Use paymentService for API calls
- [ ] Proper error handling (try-catch)
- [ ] Show error messages to user
- [ ] Handle 401 unauthorized (auto redirect)
- [ ] Handle validation errors from API
- [ ] Update localStorage if needed

### User Feedback
- [ ] Show loading spinner during API calls
- [ ] Show error messages clearly
- [ ] Show success messages (toast or modal)
- [ ] Disable buttons during submission
- [ ] Show confirmation before actions

---

## Phase 8: Testing & Validation

### Component Testing
- [ ] Test AmountInput formats numbers correctly
- [ ] Test PaymentStatusBadge shows correct colors
- [ ] Test PaymentMethodCard handles selection
- [ ] Test PaymentFormCard validates required fields
- [ ] Test PaymentHistoryList handles empty state

### Integration Testing
- [ ] Test payment creation flow
- [ ] Test payment history loading
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test success/redirect flows

### Manual Testing
- [ ] Fill payment form and submit
- [ ] Verify API call is made correctly
- [ ] Verify response data is handled
- [ ] Verify error cases show proper messages
- [ ] Test on different screen sizes
- [ ] Test keyboard navigation
- [ ] Test with slow network (throttle in DevTools)

---

## Phase 9: Backend Integration

### API Connection
- [ ] Verify payment service connects to correct base URL
- [ ] Test auth token is sent with requests
- [ ] Verify 401 handling redirects to login
- [ ] Test payment creation endpoint
- [ ] Test payment retrieval endpoints
- [ ] Test error responses are handled

### Webhook Handling (If needed)
- [ ] Backend sends webhooks for payment updates
- [ ] Frontend handles webhook updates
- [ ] Real-time status updates in UI
- [ ] Database sync after payment completion

---

## Phase 10: Deployment & Monitoring

### Code Quality
- [ ] No console.log in production code
- [ ] No commented code blocks
- [ ] Proper variable naming (camelCase)
- [ ] Proper component naming (PascalCase)
- [ ] Component documentation (comments)
- [ ] Error boundaries if needed

### Performance
- [ ] Load times are acceptable
- [ ] No unnecessary re-renders
- [ ] No memory leaks in useEffect
- [ ] Proper cleanup in useEffect (return function)
- [ ] Lazy loading if needed

### Security
- [ ] Sensitive data not in localStorage (besides token)
- [ ] XSS protection with React (automatic)
- [ ] CSRF tokens if needed
- [ ] No hardcoded API keys
- [ ] Environment variables for config

### Documentation
- [ ] Component props documented
- [ ] Service methods documented
- [ ] API integration explained
- [ ] State management pattern explained
- [ ] Error handling explained

---

## Quick Reference

### Component Hierarchy
```
PaymentPage
├── Navbar (existing)
├── LoadingOverlay (existing)
├── PaymentFormCard (molecule)
│   ├── Card (atom)
│   ├── Label (atom)
│   ├── AmountInput (atom) NEW
│   ├── Select (atom)
│   └── Button (atom)
└── PaymentHistoryList (organism)
    └── PaymentHistoryItem (molecule) x N
        ├── PaymentStatusBadge (atom) NEW
        └── ChevronRight icon
```

### File Structure to Create
```
src/
├── services/
│   └── paymentService.js (NEW)
├── components/
│   ├── atoms/
│   │   ├── AmountInput.jsx (NEW)
│   │   └── PaymentStatusBadge.jsx (NEW)
│   ├── molecules/
│   │   ├── PaymentMethodCard.jsx (NEW)
│   │   ├── PaymentFormCard.jsx (NEW)
│   │   ├── PaymentHistoryItem.jsx (NEW)
│   │   └── ... (existing)
│   ├── organisms/
│   │   ├── PaymentHistoryList.jsx (NEW)
│   │   ├── OrderPaymentCheckout.jsx (NEW)
│   │   ├── PaymentAnalyticsDashboard.jsx (OPTIONAL)
│   │   └── ... (existing)
│   └── templates/
│       └── ... (existing)
└── pages/
    ├── PaymentPage.jsx (NEW)
    ├── CheckoutPage.jsx (NEW)
    ├── PaymentHistoryPage.jsx (NEW)
    └── ... (existing)
```

### Key Tailwind Classes to Use
```
// Layout
max-w-7xl mx-auto px-4 py-8
grid grid-cols-1 lg:grid-cols-3 gap-6
flex items-center justify-between gap-3

// Cards
bg-white rounded-lg shadow-sm p-6
rounded-2xl border border-[#D9D9D9] bg-white

// Buttons
px-6 py-3 rounded-full font-medium transition
bg-[#4782BE] text-white hover:bg-[#9DBBDD]

// Forms
w-full rounded-md bg-[#F5F0EB] px-4 py-3
focus:outline-none focus:ring-2 focus:ring-[#696969]

// Status badges
px-3 py-1 rounded-full text-sm font-medium
bg-warning/10 text-warning border border-warning/30
```

---

## Common Pitfalls to Avoid

1. **Don't use CSS Modules** - Use Tailwind classes only
2. **Don't use styled-components** - Use Tailwind classes only
3. **Don't forget ProtectedRoute** - Wrap payment pages with it
4. **Don't hardcode colors** - Use Tailwind custom colors from config
5. **Don't forget error handling** - Always have try-catch in async
6. **Don't forget loading states** - Show spinner or disabled state
7. **Don't forget default props** - All components should have defaults
8. **Don't forget responsive** - Use md:, lg: for breakpoints
9. **Don't forget accessibility** - Proper labels, semantic HTML
10. **Don't forget dependencies** - useEffect dependency arrays

---

## Testing Checklist

### Unit Tests (if using Jest)
```javascript
test('AmountInput formats currency correctly', () => { })
test('PaymentStatusBadge shows correct color for status', () => { })
test('PaymentFormCard validates required fields', () => { })
test('PaymentHistoryList shows empty state when no payments', () => { })
```

### E2E Tests (if using Cypress)
```javascript
describe('Payment Flow', () => {
  it('should complete payment creation', () => { })
  it('should handle payment errors', () => { })
  it('should redirect to payment gateway', () => { })
  it('should show payment history', () => { })
})
```

---

## Resources

- Frontend Architecture: `/backend/FRONTEND_ARCHITECTURE.md`
- Component Templates: `/backend/PAYMENT_COMPONENTS_TEMPLATE.md`
- Tailwind Docs: https://tailwindcss.com/docs
- React Router: https://reactrouter.com/
- React Hooks: https://react.dev/reference/react/hooks
- Lucide Icons: https://lucide.dev/

---

## Support

For questions about:
- **Architecture patterns** - See FRONTEND_ARCHITECTURE.md
- **Component examples** - See PAYMENT_COMPONENTS_TEMPLATE.md
- **Existing components** - Check `/src/components/atoms` and `/src/components/molecules`
- **Tailwind styling** - Check `tailwind.config.js`
- **API integration** - Check `/src/services/authService.js` as reference

Good luck with implementation!
