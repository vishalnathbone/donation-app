import ExcelJS from 'exceljs';
import { Donation, Expense, DonationType } from '../models/types';

export interface ExcelExportFilter {
  fromDate?: string;
  toDate?: string;
  donationType?: string;
  paymentMode?: string;
  collector?: string;
  status?: string;
}

export async function generateExcelWorkbook(
  year: number,
  donations: Donation[],
  expenses: Expense[],
  donationTypes: DonationType[],
  filters?: ExcelExportFilter
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Donation Acceptance App';
  workbook.created = new Date();

  // Helper for applying styling
  const headerFill: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '1E3A8A' }, // Deep Blue
  };
  const headerFont: Partial<ExcelJS.Font> = {
    name: 'Arial',
    size: 11,
    bold: true,
    color: { argb: 'FFFFFF' },
  };

  // Filter donations if filter supplied
  let filteredDonations = donations;
  if (filters) {
    if (filters.fromDate) filteredDonations = filteredDonations.filter((d) => d.donationDate >= filters.fromDate!);
    if (filters.toDate) filteredDonations = filteredDonations.filter((d) => d.donationDate <= filters.toDate!);
    if (filters.donationType) filteredDonations = filteredDonations.filter((d) => d.donationTypeName === filters.donationType || d.donationTypeId === filters.donationType);
    if (filters.paymentMode) filteredDonations = filteredDonations.filter((d) => d.paymentMode === filters.paymentMode);
    if (filters.collector) filteredDonations = filteredDonations.filter((d) => d.createdBy === filters.collector);
    if (filters.status) filteredDonations = filteredDonations.filter((d) => d.status === filters.status);
  }

  // Filter expenses if filter supplied
  let filteredExpenses = expenses;
  if (filters) {
    if (filters.fromDate) filteredExpenses = filteredExpenses.filter((e) => e.date >= filters.fromDate!);
    if (filters.toDate) filteredExpenses = filteredExpenses.filter((e) => e.date <= filters.toDate!);
    if (filters.paymentMode) filteredExpenses = filteredExpenses.filter((e) => e.paymentMode === filters.paymentMode);
    if (filters.collector) filteredExpenses = filteredExpenses.filter((e) => e.createdBy === filters.collector);
    if (filters.status) filteredExpenses = filteredExpenses.filter((e) => e.status === filters.status);
  }

  // ==========================================
  // SHEET 1: DONATIONS
  // ==========================================
  const sheetDonations = workbook.addWorksheet('Donations');
  sheetDonations.columns = [
    { header: 'Donation ID', key: 'id', width: 18 },
    { header: 'Receipt Number', key: 'receiptNo', width: 18 },
    { header: 'Date', key: 'donationDate', width: 14 },
    { header: 'Donor Name', key: 'donorName', width: 25 },
    { header: 'Mobile', key: 'mobileNumber', width: 15 },
    { header: 'Donation Type', key: 'donationTypeName', width: 20 },
    { header: 'Amount (₹)', key: 'amount', width: 15 },
    { header: 'Payment Mode', key: 'paymentMode', width: 16 },
    { header: 'Transaction Ref', key: 'transactionRef', width: 22 },
    { header: 'Collector', key: 'createdByName', width: 20 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Approved By', key: 'confirmedByName', width: 20 },
  ];

  sheetDonations.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
  });

  filteredDonations.forEach((d) => {
    sheetDonations.addRow({
      id: d.id,
      receiptNo: d.receiptNo || 'N/A',
      donationDate: d.donationDate,
      donorName: d.donorName,
      mobileNumber: d.mobileNumber || '',
      donationTypeName: d.donationTypeName,
      amount: d.amount,
      paymentMode: d.paymentMode,
      transactionRef: d.transactionRef || '',
      createdByName: d.createdByName,
      status: d.status,
      confirmedByName: d.confirmedByName || 'N/A',
    });
  });

  // ==========================================
  // SHEET 2: EXPENSES
  // ==========================================
  const sheetExpenses = workbook.addWorksheet('Expenses');
  sheetExpenses.columns = [
    { header: 'Expense ID', key: 'id', width: 18 },
    { header: 'Date', key: 'date', width: 14 },
    { header: 'Category', key: 'category', width: 18 },
    { header: 'Description', key: 'description', width: 30 },
    { header: 'Amount (₹)', key: 'amount', width: 15 },
    { header: 'Payment Mode', key: 'paymentMode', width: 16 },
    { header: 'Created By', key: 'createdByName', width: 20 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Approved By', key: 'confirmedByName', width: 20 },
  ];

  sheetExpenses.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
  });

  filteredExpenses.forEach((e) => {
    sheetExpenses.addRow({
      id: e.id,
      date: e.date,
      category: e.category,
      description: e.description,
      amount: e.amount,
      paymentMode: e.paymentMode,
      createdByName: e.createdByName,
      status: e.status,
      confirmedByName: e.confirmedByName || 'N/A',
    });
  });

  // ==========================================
  // SHEET 3: COLLECTION SUMMARY
  // ==========================================
  const sheetCollSummary = workbook.addWorksheet('Collection Summary');
  sheetCollSummary.columns = [
    { header: 'Donation Type', key: 'type', width: 25 },
    { header: 'Number of Donations', key: 'count', width: 22 },
    { header: 'Total Amount (₹)', key: 'totalAmount', width: 20 },
  ];
  sheetCollSummary.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
  });

  const typeMap = new Map<string, { count: number; total: number }>();
  filteredDonations
    .filter((d) => d.status === 'APPROVED')
    .forEach((d) => {
      const key = d.donationTypeName;
      const current = typeMap.get(key) || { count: 0, total: 0 };
      typeMap.set(key, { count: current.count + 1, total: current.total + d.amount });
    });

  typeMap.forEach((val, type) => {
    sheetCollSummary.addRow({
      type,
      count: val.count,
      totalAmount: val.total,
    });
  });

  // ==========================================
  // SHEET 4: PAYMENT SUMMARY
  // ==========================================
  const sheetPaySummary = workbook.addWorksheet('Payment Summary');
  sheetPaySummary.columns = [
    { header: 'Payment Mode', key: 'mode', width: 22 },
    { header: 'Number of Transactions', key: 'count', width: 25 },
    { header: 'Total Amount (₹)', key: 'totalAmount', width: 20 },
  ];
  sheetPaySummary.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
  });

  const modeMap = new Map<string, { count: number; total: number }>();
  filteredDonations
    .filter((d) => d.status === 'APPROVED')
    .forEach((d) => {
      const key = d.paymentMode;
      const current = modeMap.get(key) || { count: 0, total: 0 };
      modeMap.set(key, { count: current.count + 1, total: current.total + d.amount });
    });

  modeMap.forEach((val, mode) => {
    sheetPaySummary.addRow({
      mode,
      count: val.count,
      totalAmount: val.total,
    });
  });

  // ==========================================
  // SHEET 5: FINANCIAL SUMMARY
  // ==========================================
  const sheetFinSummary = workbook.addWorksheet('Financial Summary');
  sheetFinSummary.columns = [
    { header: 'Financial Metric', key: 'metric', width: 32 },
    { header: 'Amount (₹)', key: 'amount', width: 22 },
  ];
  sheetFinSummary.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
  });

  const totalCollection = filteredDonations
    .filter((d) => d.status === 'APPROVED')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalExpenses = filteredExpenses
    .filter((e) => e.status === 'APPROVED')
    .reduce((sum, e) => sum + e.amount, 0);

  const netBalance = totalCollection - totalExpenses;

  const pendingCollection = filteredDonations
    .filter((d) => d.status === 'PENDING')
    .reduce((sum, d) => sum + d.amount, 0);

  const pendingExpenses = filteredExpenses
    .filter((e) => e.status === 'PENDING')
    .reduce((sum, e) => sum + e.amount, 0);

  sheetFinSummary.addRow({ metric: 'Total Collection (Approved)', amount: totalCollection });
  sheetFinSummary.addRow({ metric: 'Total Expenses (Approved)', amount: totalExpenses });
  sheetFinSummary.addRow({ metric: 'Net Available Balance', amount: netBalance });
  sheetFinSummary.addRow({ metric: 'Pending Collection (Unapproved)', amount: pendingCollection });
  sheetFinSummary.addRow({ metric: 'Pending Expenses (Unapproved)', amount: pendingExpenses });

  // ==========================================
  // SHEET 6+: DEDICATED WORKSHEETS PER DONATION TYPE
  // ==========================================
  const categoriesPresent = Array.from(new Set(filteredDonations.map((d) => d.donationTypeName || 'GENERAL')));
  categoriesPresent.forEach((catName) => {
    const sanitizedTitle = catName.replace(/[\/*?:\[\]]/g, '').substring(0, 20);
    const catSheet = workbook.addWorksheet(`Type - ${sanitizedTitle}`);
    catSheet.columns = [
      { header: 'Donation ID', key: 'id', width: 18 },
      { header: 'Receipt Number', key: 'receiptNo', width: 18 },
      { header: 'Date', key: 'donationDate', width: 14 },
      { header: 'Donor Name', key: 'donorName', width: 25 },
      { header: 'Mobile', key: 'mobileNumber', width: 15 },
      { header: 'Donation Type', key: 'donationTypeName', width: 20 },
      { header: 'Amount (₹)', key: 'amount', width: 15 },
      { header: 'Payment Mode', key: 'paymentMode', width: 16 },
      { header: 'Transaction Ref', key: 'transactionRef', width: 22 },
      { header: 'Collector', key: 'createdByName', width: 20 },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Approved By', key: 'confirmedByName', width: 20 },
    ];

    catSheet.getRow(1).eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
    });

    filteredDonations
      .filter((d) => (d.donationTypeName || 'GENERAL') === catName)
      .forEach((d) => {
        catSheet.addRow({
          id: d.id,
          receiptNo: d.receiptNo || 'N/A',
          donationDate: d.donationDate,
          donorName: d.donorName,
          mobileNumber: d.mobileNumber || '',
          donationTypeName: d.donationTypeName,
          amount: d.amount,
          paymentMode: d.paymentMode,
          transactionRef: d.transactionRef || '',
          createdByName: d.createdByName,
          status: d.status,
          confirmedByName: d.confirmedByName || 'N/A',
        });
      });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
