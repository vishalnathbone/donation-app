# Donation Acceptance Web & Mobile Portal & Express Backend

Production-ready Donation Acceptance System featuring a dedicated **Desktop Web Portal (`web/`)**, **Mobile Application (`mobile/`)**, **Express TypeScript backend (`server/`)**, and a year-wise JSON file repository database with atomic storage safety.

---

## 🌟 Features Overview

- **Multi-Role Authorization**:
  - `ADMIN`: Executive dashboard, all collections, approvals/rejections, donation categories management, expense approvals, reports, 5-sheet Excel exports, user account management, audit trail.
  - `COLLECTOR`: Record donations, view own collections, generate & view PDF receipts, send receipts via WhatsApp, submit expenses.
  - `VIEWER`: Read-only financial dashboards, collection summaries, and reports.
- **Year-wise Isolated JSON Database**:
  - Year-prefixed API routing (`/api/2026/donations`, `/api/2027/donations`).
  - Decoupled Repository Pattern (`DonationRepository`, `ExpenseRepository`, `DonationTypeRepository`, `ReceiptRepository`, `UserRepository`, `AuditRepository`).
  - Thread-safe Mutex locking, atomic write operations (`.tmp` -> `rename`), and automated backups under `server/backup/:year/`.
- **Automatic ID Generation**:
  - Donation ID: `DON-2026-000001`
  - Receipt Number: `REC-2026-000001`
  - Expense ID: `EXP-2026-000001`
  - Audit Log ID: `AUD-2026-000001`
- **Official Receipt Generation & WhatsApp Sharing**:
  - PDF receipts generated with `pdfkit` featuring organization branding, amount in Indian words ("Rupees Five Thousand Only"), and authorized signatory lines.
  - `IWhatsAppService` service abstraction for sending structured WhatsApp receipt notifications via deep links (`https://wa.me/...`).
- **Excel Export**:
  - 5-sheet Excel workbook export (`exceljs`) containing Sheet 1 (Donations), Sheet 2 (Expenses), Sheet 3 (Collection Summary), Sheet 4 (Payment Summary), and Sheet 5 (Financial Summary).
- **Strict Financial Formula**:
  - `Net Available Balance = Total Collection (APPROVED) - Total Expenses (APPROVED)`
  - PENDING and REJECTED items are strictly excluded from net balance calculations.

---

## 🔐 Default Test Credentials

| Role | Email | Password |
|---|---|---|
| **ADMIN** | `admin@donation.org` | `Admin@123` |
| **COLLECTOR** | `collector@donation.org` | `Collector@123` |
| **VIEWER** | `viewer@donation.org` | `Viewer@123` |

---

## 🚀 Getting Started

### 1. Start the Express Backend Server
```bash
cd server
npm install
npm run dev
# Server running on http://localhost:5000
```

### 2. Start the Desktop Web Portal
```bash
cd web
npm install
npm run dev
# Web Portal running on http://localhost:3001
```

### 3. Start the Mobile Client App
```bash
cd mobile
npm install
npm run dev
# Mobile Client running on http://localhost:3000
```

---

## 📁 Project Structure

```text
donation-app/
├── web/                     # Dedicated Enterprise Desktop Web Portal (Vite React TS)
│   ├── src/
│   │   ├── components/      # WebContainer (Sidebar + Header), StatusBadge, RejectionModal
│   │   ├── features/        # Web Dashboard, Donations Table, Expenses Ledger, Reports, Categories, Users, Audit Logs
│   │   ├── hooks/           # TanStack Query custom API hooks
│   │   ├── services/        # Axios apiClient & WhatsApp deep link service
│   │   ├── store/           # Zustand Auth & Year stores
│   │   └── utils/           # Formatters & Icon components
│   ├── package.json
│   └── vite.config.ts       # Proxying /api to http://localhost:5000
│
├── mobile/                  # React Native Web TypeScript Application
│   ├── src/
│   │   ├── components/      # Mobile Container & Navigation
│   │   └── features/        # Mobile Screens
│   ├── package.json
│   └── vite.config.ts
│
├── server/                  # Node.js Express TypeScript REST API Backend
│   ├── src/
│   │   ├── config/          # JWT & Organization configuration
│   │   ├── controllers/     # Auth, Donation, Expense, Receipt, Report, Excel, User controllers
│   │   ├── middleware/      # Auth JWT, Role permissions guard, Zod request validators
│   │   ├── repositories/    # Interfaces & Year-wise JSON Repositories
│   │   └── services/        # Business services with Audit logging
│   ├── data/
│   │   ├── 2026/            # Year 2026 JSON data files
│   │   └── 2027/            # Year 2027 JSON data files
│   └── package.json
│
└── README.md
```

