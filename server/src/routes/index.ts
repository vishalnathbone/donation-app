import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { DonationController } from '../controllers/donationController';
import { DonationTypeController } from '../controllers/donationTypeController';
import { ExpenseController } from '../controllers/expenseController';
import { ReceiptController } from '../controllers/receiptController';
import { ReportController } from '../controllers/reportController';
import { ExcelController } from '../controllers/excelController';
import { UserController } from '../controllers/userController';
import { AuditController } from '../controllers/auditController';

import { authenticate, authorize } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validateMiddleware';
import {
  LoginSchema,
  DonationCreateSchema,
  DonationTypeCreateSchema,
  ExpenseCreateSchema,
  RejectionReasonSchema,
  UserCreateSchema,
} from '../validators';

const router = Router();

// ==========================================
// 1. AUTH ROUTES (Both /api/auth and /api/:year/auth)
// ==========================================
const authRouter = Router();
authRouter.post('/login', validateBody(LoginSchema), AuthController.login);
authRouter.post('/refresh', AuthController.refresh);
authRouter.post('/logout', AuthController.logout);
authRouter.get('/me', authenticate, AuthController.getMe);

router.use('/auth', authRouter);

// ==========================================
// 2. YEAR-SCOPED ROUTES (/api/:year/...)
// ==========================================
const yearRouter = Router({ mergeParams: true });
yearRouter.use('/auth', authRouter);

// --- DONATIONS ---
yearRouter.get('/donations', authenticate, DonationController.getDonations);
yearRouter.get('/donations/:id', authenticate, DonationController.getDonationById);
yearRouter.post(
  '/donations',
  authenticate,
  authorize('ADMIN', 'COLLECTOR'),
  validateBody(DonationCreateSchema),
  DonationController.createDonation
);
yearRouter.post(
  '/donations/:id/approve',
  authenticate,
  authorize('ADMIN'),
  DonationController.approveDonation
);
yearRouter.post(
  '/donations/:id/reject',
  authenticate,
  authorize('ADMIN'),
  validateBody(RejectionReasonSchema),
  DonationController.rejectDonation
);
yearRouter.patch(
  '/donations/:id',
  authenticate,
  authorize('ADMIN'),
  DonationController.editDonation
);

// --- DONATION TYPES ---
yearRouter.get('/donation-types', authenticate, DonationTypeController.getActiveTypes);
yearRouter.get('/donation-types/all', authenticate, authorize('ADMIN'), DonationTypeController.getAllTypes);
yearRouter.get('/donation-types/pending', authenticate, authorize('ADMIN'), DonationTypeController.getPendingTypes);
yearRouter.post(
  '/donation-types',
  authenticate,
  authorize('ADMIN', 'COLLECTOR'),
  validateBody(DonationTypeCreateSchema),
  DonationTypeController.createType
);
yearRouter.post(
  '/donation-types/:id/approve',
  authenticate,
  authorize('ADMIN'),
  DonationTypeController.approveType
);
yearRouter.post(
  '/donation-types/:id/reject',
  authenticate,
  authorize('ADMIN'),
  validateBody(RejectionReasonSchema),
  DonationTypeController.rejectType
);
yearRouter.patch(
  '/donation-types/:id',
  authenticate,
  authorize('ADMIN'),
  DonationTypeController.patchType
);

// --- EXPENSES ---
yearRouter.get('/expenses', authenticate, ExpenseController.getExpenses);
yearRouter.get('/expenses/:id', authenticate, ExpenseController.getExpenseById);
yearRouter.post(
  '/expenses',
  authenticate,
  authorize('ADMIN', 'COLLECTOR'),
  validateBody(ExpenseCreateSchema),
  ExpenseController.createExpense
);
yearRouter.post(
  '/expenses/:id/approve',
  authenticate,
  authorize('ADMIN'),
  ExpenseController.approveExpense
);
yearRouter.post(
  '/expenses/:id/reject',
  authenticate,
  authorize('ADMIN'),
  validateBody(RejectionReasonSchema),
  ExpenseController.rejectExpense
);

// --- RECEIPTS & WHATSAPP ---
yearRouter.get('/receipts/:id', authenticate, ReceiptController.getReceipt);
yearRouter.get('/receipts/:id/pdf', authenticate, ReceiptController.downloadReceiptPdf);
yearRouter.post('/receipts/log-whatsapp', authenticate, ReceiptController.logWhatsAppShare);

// --- REPORTS & DASHBOARD ---
yearRouter.get('/reports/dashboard', authenticate, ReportController.getDashboardSummary);
yearRouter.get('/reports/summary', authenticate, ReportController.getCollectionSummary);
yearRouter.get('/reports/expense-summary', authenticate, ReportController.getExpenseSummary);

// --- EXCEL EXPORTS ---
yearRouter.get('/export/donations', authenticate, authorize('ADMIN'), ExcelController.exportDonations);
yearRouter.get('/export/expenses', authenticate, authorize('ADMIN'), ExcelController.exportExpenses);
yearRouter.get('/export/summary', authenticate, authorize('ADMIN'), ExcelController.exportSummary);
yearRouter.get('/export/full', authenticate, authorize('ADMIN'), ExcelController.exportFullReport);

// --- USERS MANAGEMENT ---
yearRouter.get('/users', authenticate, authorize('ADMIN'), UserController.getUsers);
yearRouter.post(
  '/users',
  authenticate,
  authorize('ADMIN'),
  validateBody(UserCreateSchema),
  UserController.createUser
);
yearRouter.patch('/users/:id/status', authenticate, authorize('ADMIN'), UserController.toggleUserStatus);

// --- AUDIT LOGS ---
yearRouter.get('/audit-logs', authenticate, authorize('ADMIN'), AuditController.getLogs);

router.use('/:year([0-9]{4})', yearRouter);

export default router;
