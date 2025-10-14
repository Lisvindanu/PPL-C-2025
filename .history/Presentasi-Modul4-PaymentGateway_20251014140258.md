# PRESENTASI MODUL 4
# PAYMENT GATEWAY
## SkillConnect: Aplikasi Marketplace Jasa dan Skill Lokal Berbasis Web

---

## SLIDE 1: COVER

# MODUL 4 – PAYMENT GATEWAY

**SkillConnect**
Aplikasi Marketplace Jasa dan Skill Lokal Berbasis Web

Capstone Project – Teknik Informatika, Semester 7

---

## SLIDE 2: AGENDA PRESENTASI

### Agenda

1. Latar Belakang Modul
2. Tujuan dan Ruang Lingkup
3. User Stories
4. Kebutuhan Fungsional (Functional Requirements)
5. Kebutuhan Non-Fungsional
6. Arsitektur & Teknologi
7. Database Design
8. API Specification
9. Use Case Diagram
10. Sprint Planning & Product Backlog
11. Testing Strategy
12. Timeline & Deliverables
13. Demo & Kesimpulan

---

## SLIDE 3: LATAR BELAKANG MODUL

### Mengapa Payment Gateway Penting?

**Permasalahan:**
- Transaksi pembayaran manual memakan waktu dan rawan kesalahan
- Sulitnya melacak riwayat pembayaran secara digital
- Freelancer kesulitan monitoring penghasilan secara real-time
- Admin membutuhkan sistem reporting yang akurat dan cepat

**Solusi:**
✅ Integrasi payment gateway untuk pembayaran digital otomatis
✅ Verifikasi pembayaran real-time melalui webhook
✅ Dashboard penghasilan untuk freelancer
✅ Sistem invoice otomatis dan laporan transaksi

---

## SLIDE 4: TUJUAN & RUANG LINGKUP

### Tujuan Modul Payment Gateway

1. Menyediakan sistem pembayaran digital yang **aman** dan **terpercaya**
2. Mengotomasi verifikasi pembayaran secara **real-time**
3. Memberikan **transparansi** penghasilan kepada freelancer
4. Mempermudah **monitoring** dan **reporting** transaksi untuk admin
5. Meningkatkan **user experience** dengan invoice otomatis

### Ruang Lingkup

- Integrasi Midtrans/Xendit
- Multiple payment methods
- Webhook notification handling
- Transaction history management
- Earnings dashboard
- Invoice generation
- Transaction reporting

---

## SLIDE 5: USER STORIES (1/2)

### User Stories

| Kode | User Story |
|------|------------|
| **P-01** | Sebagai **pengguna**, saya ingin melakukan pembayaran digital secara aman agar saya dapat menyelesaikan transaksi pemesanan layanan dengan cepat dan terpercaya. |
| **P-02** | Sebagai **sistem**, saya ingin memverifikasi status pembayaran otomatis agar status order dapat diperbarui secara real-time tanpa intervensi manual. |
| **P-03** | Sebagai **pengguna**, saya ingin melihat riwayat pembayaran saya agar saya dapat melacak semua transaksi yang pernah saya lakukan. |

---

## SLIDE 6: USER STORIES (2/2)

| Kode | User Story |
|------|------------|
| **P-04** | Sebagai **freelancer**, saya ingin melihat penghasilan dari order yang selesai agar saya dapat memantau pendapatan saya dari platform. |
| **P-05** | Sebagai **admin**, saya ingin mengunduh laporan transaksi agar saya dapat menganalisis data keuangan sistem secara berkala. |
| **P-06** | Sebagai **sistem**, saya ingin mengirimkan invoice pembayaran secara otomatis agar pengguna memiliki bukti transaksi resmi. |

---

## SLIDE 7: FUNCTIONAL REQUIREMENTS

### Software Requirements

| Kode | Software Requirement | Prioritas |
|------|---------------------|-----------|
| **SR-01** | Integrasi dengan payment gateway (Midtrans/Xendit) yang mendukung berbagai metode pembayaran | **High** |
| **SR-02** | Endpoint webhook/callback untuk notifikasi status pembayaran real-time | **High** |
| **SR-03** | Penyimpanan riwayat transaksi dengan detail lengkap di database | **Medium** |
| **SR-04** | Dashboard penghasilan freelancer dengan total pendapatan dan breakdown | **Medium** |
| **SR-05** | Fitur ekspor laporan transaksi ke format PDF dan CSV | **Low** |
| **SR-06** | Auto-generate dan kirim invoice PDF via email setelah pembayaran berhasil | **Medium** |

---

## SLIDE 8: NON-FUNCTIONAL REQUIREMENTS

### Kebutuhan Non-Fungsional

#### Performance
- Waktu respons pembuatan transaksi: **< 3 detik**
- Webhook processing time: **< 5 detik**
- Loading riwayat pembayaran: **< 2 detik**

#### Security
- Semua komunikasi menggunakan **HTTPS**
- **Signature validation** pada setiap webhook
- **PCI DSS compliant** (tidak menyimpan data kartu kredit)
- **Enkripsi** data sensitif di database

#### Reliability
- System uptime: **99.5%**
- Retry mechanism untuk webhook: **3x retry**
- Daily backup transaksi

---

## SLIDE 9: ARSITEKTUR & TEKNOLOGI

### Tech Stack

```
┌─────────────────┐
│   FRONTEND      │
│   React.js      │
│   Axios         │
│   Chart.js      │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│   BACKEND       │
│   Node.js       │
│   Express.js    │
│   Midtrans SDK  │
│   PDFKit        │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│MongoDB│ │Midtrans │
│       │ │ /Xendit │
└───────┘ └─────────┘
```

**External Services:**
- Payment Gateway: Midtrans / Xendit
- Email Service: SendGrid / Mailgun
- Storage: AWS S3 / Cloudinary

---

## SLIDE 10: DATABASE DESIGN

### Tabel: payments

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| order_id | UUID | FK ke orders |
| user_id | UUID | FK ke users |
| transaction_id | VARCHAR(255) | ID dari payment gateway |
| amount | DECIMAL(10,2) | Jumlah pembayaran |
| payment_method | VARCHAR(50) | bank_transfer, e-wallet, credit_card, qris |
| status | ENUM | pending, success, failed, expired |
| payment_gateway | VARCHAR(50) | midtrans / xendit |
| payment_url | TEXT | URL pembayaran |
| callback_data | JSON | Raw webhook data |
| invoice_url | TEXT | URL invoice PDF |
| created_at | TIMESTAMP | Waktu dibuat |
| expires_at | TIMESTAMP | Waktu kadaluarsa |

### Status Flow
```
pending → success → invoice_sent
   ↓
failed / expired
```

---

## SLIDE 11: API SPECIFICATION

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create` | Membuat transaksi pembayaran baru |
| POST | `/api/payments/webhook` | Menerima callback dari payment gateway |
| GET | `/api/payments/history` | Mendapatkan riwayat pembayaran user |
| GET | `/api/payments/earnings` | Dashboard penghasilan freelancer |
| POST | `/api/payments/export` | Ekspor laporan transaksi (PDF/CSV) |
| GET | `/api/payments/:id` | Detail transaksi pembayaran |

### Example: Create Payment Response
```json
{
  "status": "success",
  "data": {
    "payment_id": "uuid",
    "transaction_id": "TRX-12345",
    "payment_url": "https://payment.gateway.com/xxx",
    "expires_at": "2025-10-15T10:00:00Z"
  }
}
```

---

## SLIDE 12: USE CASE DIAGRAM

```
        ┌──────────┐
        │  Klien   │
        └────┬─────┘
             │
    ┌────────┼────────┐
    │        │        │
┌───▼───┐ ┌──▼──┐ ┌──▼────────┐
│Bayar  │ │Lihat│ │Download   │
│Order  │ │Riw. │ │Invoice    │
└───┬───┘ └─────┘ └───────────┘
    │
    ▼
┌────────────┐      ┌─────────────┐
│  Payment   │◄─────│  Webhook    │
│  Gateway   │      │  Callback   │
└─────┬──────┘      └─────────────┘
      │
      ▼
┌────────────┐
│Update Order│
│Status      │
└─────┬──────┘
      │
      ▼
┌────────────┐
│Send Invoice│
│via Email   │
└────────────┘

┌────────────┐          ┌──────────┐
│ Freelancer │          │  Admin   │
└─────┬──────┘          └────┬─────┘
      │                      │
      ▼                      ▼
┌──────────┐          ┌─────────────┐
│Dashboard │          │Export       │
│Penghasilan│          │Laporan      │
└──────────┘          └─────────────┘
```

---

## SLIDE 13: PRODUCT BACKLOG

### Product Backlog - Modul 4

| No | Item | User Story | Priority | Story Points | Sprint |
|----|------|------------|----------|--------------|--------|
| 1 | Integrasi Payment Gateway | P-01, P-02 | High | 13 | Sprint 3 |
| 2 | Webhook Handler | P-02 | High | 8 | Sprint 3 |
| 3 | Riwayat Pembayaran | P-03 | Medium | 5 | Sprint 4 |
| 4 | Dashboard Penghasilan | P-04 | Medium | 8 | Sprint 4 |
| 5 | Invoice Otomatis | P-06 | Medium | 8 | Sprint 4 |
| 6 | Ekspor Laporan | P-05 | Low | 5 | Sprint 6 |
| 7 | Testing & Bug Fixing | All | High | 8 | Sprint 6 |

**Total Story Points:** 55

---

## SLIDE 14: SPRINT PLANNING

### Sprint 3 (Minggu 5-6) - Payment Integration

**Goal:** Implementasi core payment gateway dan webhook handler

**Sprint Backlog:**
- ✅ Setup Midtrans/Xendit SDK
- ✅ Implementasi create payment API
- ✅ Implementasi webhook endpoint
- ✅ Validasi signature webhook
- ✅ Update order status otomatis
- ✅ Testing integrasi payment gateway

**Deliverables:**
- User dapat melakukan pembayaran
- Sistem dapat menerima callback dari payment gateway
- Status order terupdate otomatis

---

## SLIDE 15: SPRINT PLANNING

### Sprint 4 (Minggu 7-8) - Payment Features

**Goal:** Melengkapi fitur pembayaran dan invoice

**Sprint Backlog:**
- ✅ Implementasi riwayat pembayaran
- ✅ Implementasi dashboard penghasilan freelancer
- ✅ Implementasi invoice generation (PDF)
- ✅ Implementasi email notification
- ✅ UI/UX payment history page
- ✅ Testing end-to-end payment flow

**Deliverables:**
- User dapat melihat riwayat pembayaran
- Freelancer dapat tracking penghasilan
- Invoice otomatis terkirim via email

---

## SLIDE 16: SPRINT PLANNING

### Sprint 6 (Minggu 11-12) - Reporting & Final Integration

**Goal:** Melengkapi reporting dan integrasi akhir

**Sprint Backlog:**
- ✅ Implementasi ekspor laporan PDF/CSV
- ✅ Testing security (signature validation, encryption)
- ✅ Performance testing (load testing)
- ✅ Bug fixing
- ✅ Dokumentasi API
- ✅ User acceptance testing

**Deliverables:**
- Admin dapat ekspor laporan transaksi
- Sistem lolos security testing
- Modul siap production

---

## SLIDE 17: SCRUM BACKLOG TABLE

### Scrum Backlog - Modul 4 Payment Gateway

| No | Item | Sub Item | Add Function | Priority | Prediksi Selesai | Status | Role | Environment | Deskripsi | Note |
|----|------|----------|--------------|----------|------------------|--------|------|-------------|-----------|------|
| | | | | | | | | Local | Prod | | |
| 1 | **Payment Gateway Integration** | Setup Payment Gateway | Integration, Config | High | Sprint 3 Week 1 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | Integrasi Midtrans/Xendit SDK, setup credentials | Testing dengan sandbox mode |
| 2 | | Create Payment API | CRUD, Validation | High | Sprint 3 Week 1 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | API endpoint untuk membuat transaksi pembayaran | Return payment URL/token |
| 3 | | Payment Methods Support | Multiple Options | High | Sprint 3 Week 1 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | Support transfer bank, e-wallet, kartu kredit, QRIS | Sesuai provider gateway |
| 4 | **Webhook & Verification** | Webhook Endpoint | POST Handler | High | Sprint 3 Week 2 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | Endpoint untuk menerima callback dari payment gateway | `/api/payments/webhook` |
| 5 | | Signature Validation | Security Check | High | Sprint 3 Week 2 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | Validasi signature dari payment gateway | Reject jika invalid |
| 6 | | Auto Update Order Status | Trigger Logic | High | Sprint 3 Week 2 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | Update status order otomatis setelah payment success | Trigger notifikasi |
| 7 | **Payment History** | Payment History API | GET, Filtering | Medium | Sprint 4 Week 1 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | API untuk mengambil riwayat pembayaran user | Support pagination |
| 8 | | Payment History UI | List, Detail View | Medium | Sprint 4 Week 1 | ⏳ Backlog | Frontend Dev | ⏳ Not Ready | ⏳ Not Ready | Halaman riwayat pembayaran dengan filter | Mobile responsive |
| 9 | | Transaction Detail | View Details | Medium | Sprint 4 Week 1 | ⏳ Backlog | Frontend Dev | ⏳ Not Ready | ⏳ Not Ready | Modal/page detail transaksi pembayaran | Include invoice download |
| 10 | **Freelancer Earnings** | Earnings Calculation | Aggregate Query | Medium | Sprint 4 Week 1 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | Perhitungan total penghasilan freelancer | Per periode (bulan/tahun) |
| 11 | | Earnings Dashboard API | GET, Analytics | Medium | Sprint 4 Week 1 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | API untuk dashboard penghasilan | Include breakdown |
| 12 | | Earnings Dashboard UI | Charts, Tables | Medium | Sprint 4 Week 2 | ⏳ Backlog | Frontend Dev | ⏳ Not Ready | ⏳ Not Ready | Dashboard visual penghasilan freelancer | Gunakan Chart.js |
| 13 | **Invoice System** | Invoice Generation | PDF Generate | Medium | Sprint 4 Week 2 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | Generate invoice PDF otomatis | Gunakan PDFKit/Puppeteer |
| 14 | | Invoice Template | Design Template | Medium | Sprint 4 Week 2 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | Template invoice dengan logo dan detail lengkap | Sesuai standar invoice |
| 15 | | Email Invoice Service | Email Integration | Medium | Sprint 4 Week 2 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | Kirim invoice via email otomatis | Nodemailer + SendGrid |
| 16 | | Invoice Storage | File Upload | Medium | Sprint 4 Week 2 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | Simpan invoice PDF di cloud storage | AWS S3 / Cloudinary |
| 17 | **Transaction Reporting** | Export Report API | Export Function | Low | Sprint 6 Week 1 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | API untuk ekspor laporan transaksi | Support PDF & CSV |
| 18 | | PDF Report Generation | PDF Export | Low | Sprint 6 Week 1 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | Generate laporan PDF dengan filter | Include charts |
| 19 | | CSV Report Generation | CSV Export | Low | Sprint 6 Week 1 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | Generate laporan CSV dengan filter | Format standar |
| 20 | | Report Download UI | Download Feature | Low | Sprint 6 Week 1 | ⏳ Backlog | Frontend Dev | ⏳ Not Ready | ⏳ Not Ready | UI untuk download laporan di admin dashboard | Include filter options |
| 21 | **Security & Testing** | Payment Security Audit | Security Test | High | Sprint 6 Week 2 | ⏳ Backlog | QA | ⏳ Not Ready | ⏳ Not Ready | Audit keamanan sistem pembayaran | HTTPS, encryption, validation |
| 22 | | Unit Testing | Automated Test | High | Sprint 6 Week 2 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | Unit test untuk semua fungsi payment | Coverage > 80% |
| 23 | | Integration Testing | E2E Test | High | Sprint 6 Week 2 | ⏳ Backlog | QA | ⏳ Not Ready | ⏳ Not Ready | Test integrasi dengan payment gateway | Test sandbox mode |
| 24 | | Performance Testing | Load Test | Medium | Sprint 6 Week 2 | ⏳ Backlog | QA | ⏳ Not Ready | ⏳ Not Ready | Load testing untuk endpoint payment | Concurrent users test |
| 25 | **Documentation** | API Documentation | Swagger/Postman | Medium | Sprint 6 Week 2 | ⏳ Backlog | Backend Dev | ⏳ Not Ready | ⏳ Not Ready | Dokumentasi API lengkap | Include request/response examples |

---

## SLIDE 18: BACKLOG SUMMARY

### Ringkasan Backlog

**Total Items:** 25
**Completed:** 16 (64%)
**In Progress:** 4 (16%)
**Backlog:** 5 (20%)

#### By Priority:
- **High:** 10 items
- **Medium:** 12 items
- **Low:** 3 items

#### By Sprint:
- **Sprint 3:** 6 items (100% completed)
- **Sprint 4:** 10 items (100% completed)
- **Sprint 6:** 9 items (44% in progress, 56% backlog)

---

## SLIDE 19: TESTING STRATEGY

### Testing Plan

#### 1. Unit Testing
- ✅ Payment creation logic
- ✅ Webhook validation
- ✅ Invoice generation
- ✅ Earnings calculation

#### 2. Integration Testing
- ✅ Payment gateway API integration
- ✅ Webhook callback handling
- ✅ Email delivery service
- ✅ Database transactions

#### 3. End-to-End Testing
- 🔄 Complete payment flow
- 🔄 Multiple payment methods
- 🔄 Expired payment scenario
- 🔄 Failed payment handling

#### 4. Security Testing
- ⏳ Signature validation
- ⏳ SQL injection prevention
- ⏳ XSS protection
- ⏳ Rate limiting

---

## SLIDE 20: TIMELINE & DELIVERABLES

### Project Timeline

```
Sprint 3 (Week 5-6)
├─ Week 5: Payment Gateway Integration
│  └─ Deliverable: Working payment creation
└─ Week 6: Webhook Handler
   └─ Deliverable: Auto order status update

Sprint 4 (Week 7-8)
├─ Week 7: Payment History & Earnings
│  └─ Deliverable: History page & dashboard
└─ Week 8: Invoice System
   └─ Deliverable: Auto invoice via email

Sprint 6 (Week 11-12)
├─ Week 11: Reporting & Export
│  └─ Deliverable: PDF/CSV export
└─ Week 12: Testing & Documentation
   └─ Deliverable: Production-ready module
```

**Total Duration:** 8 weeks (across 3 sprints)

---

## SLIDE 21: RISK & MITIGATION

### Potential Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Payment gateway downtime | High | Implement retry mechanism, support multiple providers |
| Webhook delay/lost | High | Implement fallback check payment status API |
| Invoice generation failure | Medium | Queue system with retry, manual regenerate option |
| Security breach | High | HTTPS only, signature validation, regular security audit |
| Performance bottleneck | Medium | Implement caching, database optimization, load balancing |

---

## SLIDE 22: SUCCESS METRICS

### Key Performance Indicators (KPIs)

#### Technical Metrics
- Payment success rate: **> 95%**
- Webhook processing time: **< 5 seconds**
- API response time: **< 3 seconds**
- System uptime: **99.5%**

#### Business Metrics
- Transaction volume growth: **target +20% monthly**
- Failed transaction rate: **< 5%**
- Invoice delivery success: **> 98%**
- User satisfaction score: **> 4.5/5**

#### Code Quality
- Test coverage: **> 80%**
- Code review approval: **100%**
- Zero critical bugs in production

---

## SLIDE 23: DEMO SCENARIO

### Demo Flow

**Scenario:** Klien melakukan pembayaran untuk order design logo

1. **Step 1:** Klien memilih order dan klik "Bayar Sekarang"
2. **Step 2:** Sistem menampilkan metode pembayaran (Bank Transfer, E-Wallet, QRIS)
3. **Step 3:** Klien memilih metode dan redirect ke payment gateway
4. **Step 4:** Klien menyelesaikan pembayaran
5. **Step 5:** Payment gateway mengirim webhook ke sistem
6. **Step 6:** Sistem otomatis update status order menjadi "Paid"
7. **Step 7:** Sistem generate dan kirim invoice via email
8. **Step 8:** Freelancer melihat penghasilan di dashboard
9. **Step 9:** Admin dapat melihat transaksi di laporan

---

## SLIDE 24: KESIMPULAN

### Kesimpulan

✅ **Modul Payment Gateway** berhasil diimplementasikan dengan fitur lengkap:
   - Multiple payment methods
   - Real-time verification
   - Auto invoice generation
   - Earnings tracking
   - Transaction reporting

✅ **Pengembangan menggunakan Scrum** dengan 3 sprint terstruktur

✅ **Integrasi sempurna** dengan modul lain (Order, User, Notification, Admin)

✅ **Keamanan terjaga** dengan HTTPS, signature validation, dan encryption

✅ **Siap untuk production** setelah melengkapi testing di Sprint 6

---

## SLIDE 25: NEXT STEPS

### Langkah Selanjutnya

#### Sprint 6 (Week 11-12)
1. ✅ Melengkapi fitur ekspor laporan PDF/CSV
2. ⏳ Melakukan security audit lengkap
3. ⏳ Performance testing dan optimization
4. ⏳ Bug fixing berdasarkan testing
5. ⏳ User Acceptance Testing (UAT)
6. ⏳ Documentation finalization

#### Post-Launch
- Monitoring payment success rate
- Gathering user feedback
- Continuous improvement
- A/B testing untuk payment flow optimization

---

## SLIDE 26: Q&A

# TERIMA KASIH

## Questions & Answers

---

## SLIDE 27: APPENDIX - PAYMENT METHODS

### Supported Payment Methods

| Metode | Provider | Status | Estimasi Waktu |
|--------|----------|--------|----------------|
| **Bank Transfer** | Midtrans/Xendit | ✅ Supported | Real-time - 24 jam |
| **E-Wallet** (GoPay, OVO, Dana, ShopeePay) | Midtrans/Xendit | ✅ Supported | Instant |
| **Kartu Kredit/Debit** | Midtrans | ✅ Supported | Instant |
| **QRIS** | Midtrans/Xendit | ✅ Supported | Instant |
| **Virtual Account** (BCA, BNI, BRI, Mandiri) | Midtrans/Xendit | ✅ Supported | Real-time - 24 jam |

---

## SLIDE 28: APPENDIX - ERROR HANDLING

### Common Error Codes

| Code | Message | User Action |
|------|---------|-------------|
| PAY-001 | Payment gateway connection failed | Coba lagi atau hubungi support |
| PAY-002 | Invalid signature webhook | - (sistem reject otomatis) |
| PAY-003 | Payment expired | Buat transaksi baru |
| PAY-004 | Insufficient balance | Gunakan metode pembayaran lain |
| PAY-005 | Invoice generation failed | Hubungi support untuk generate manual |
| PAY-006 | Payment amount mismatch | Verifikasi jumlah pembayaran |

---

## SLIDE 29: CONTACT & RESOURCES

### Resources

**Documentation:**
- API Documentation: `/docs/api/payments`
- User Guide: `/docs/user-guide/payment`
- Developer Guide: `/docs/dev/payment-integration`

**External Links:**
- Midtrans Docs: https://docs.midtrans.com
- Xendit Docs: https://developers.xendit.co

**Support:**
- Technical Issues: tech-support@skillconnect.com
- Payment Issues: payment@skillconnect.com
- General Inquiry: info@skillconnect.com

---

**END OF PRESENTATION**
