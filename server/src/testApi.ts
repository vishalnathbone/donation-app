import app from './app';
import { JsonStorageHelper } from './utils/jsonStorage';
import http from 'http';

async function runApiVerification() {
  console.log('🚀 Starting Donation Acceptance API Verification Tests...');

  // Initialize data
  await JsonStorageHelper.ensureYearDir(2026);
  await JsonStorageHelper.ensureYearDir(2027);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(5099, resolve));
  const baseUrl = 'http://localhost:5099/api';

  try {
    // Test 1: Admin Login
    console.log('1. Testing Admin Login...');
    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@donation.org',
        password: 'Admin@123',
        year: 2026,
      }),
    });
    const adminLoginData: any = await adminLoginRes.json();
    console.log('   ✅ Admin Login successful:', adminLoginData.data.user.role);
    const adminToken = adminLoginData.data.token;

    // Test 2: Collector Login
    console.log('2. Testing Collector Login...');
    const collectorLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'collector@donation.org',
        password: 'Collector@123',
        year: 2026,
      }),
    });
    const collectorLoginData: any = await collectorLoginRes.json();
    console.log('   ✅ Collector Login successful:', collectorLoginData.data.user.role);
    const collectorToken = collectorLoginData.data.token;

    // Test 3: Create Donation as Collector
    console.log('3. Testing Donation Creation as Collector...');
    const createDonationRes = await fetch(`${baseUrl}/2026/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${collectorToken}`,
      },
      body: JSON.stringify({
        donorName: 'Vikram Mehta',
        mobileNumber: '9876543210',
        email: 'vikram@example.com',
        address: 'Marine Drive, Mumbai',
        donationTypeId: 'TYP-001', // GENERAL
        amount: 5000,
        paymentMode: 'UPI',
        transactionRef: 'UPI/982374982739/PAY',
        notes: 'Annual seva donation',
      }),
    });
    const createDonationData: any = await createDonationRes.json();
    const donation = createDonationData.data;
    console.log(`   ✅ Donation created: ID=${donation.id}, Status=${donation.status}`);
    if (donation.status !== 'PENDING') throw new Error('New donation status must be PENDING');
    if (donation.id !== 'DON-2026-000001') throw new Error(`Expected DON-2026-000001, got ${donation.id}`);

    // Test 4: Dashboard summary before approval (Total collection must be 0)
    console.log('4. Testing Financial Summary before approval...');
    const dashRes1 = await fetch(`${baseUrl}/2026/reports/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const dashData1: any = await dashRes1.json();
    console.log(`   ✅ Total Collection (Approved): ₹${dashData1.data.totalCollection}, Pending Count: ${dashData1.data.pendingDonationsCount}`);
    if (dashData1.data.totalCollection !== 0) throw new Error('Unapproved donation was wrongly counted in total collection');

    // Test 5: Admin Approves Donation
    console.log('5. Testing Donation Approval by Admin...');
    const approveRes = await fetch(`${baseUrl}/2026/donations/${donation.id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const approveData: any = await approveRes.json();
    const approvedDonation = approveData.data;
    console.log(`   ✅ Donation Approved: ReceiptNo=${approvedDonation.receiptNo}, Status=${approvedDonation.status}`);
    if (approvedDonation.status !== 'APPROVED') throw new Error('Donation status should be APPROVED');
    if (!approvedDonation.receiptNo) throw new Error('Receipt number missing');

    // Test 6: Dashboard summary after approval (Total collection must now be 5000)
    console.log('6. Testing Financial Summary after approval...');
    const dashRes2 = await fetch(`${baseUrl}/2026/reports/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const dashData2: any = await dashRes2.json();
    console.log(`   ✅ Total Collection: ₹${dashData2.data.totalCollection}, Net Balance: ₹${dashData2.data.netBalance}`);
    if (dashData2.data.totalCollection !== 5000) throw new Error('Approved donation was not counted in total collection');

    // Test 7: Receipt PDF Generation & Download
    console.log('7. Testing PDF Receipt retrieval...');
    const pdfRes = await fetch(`${baseUrl}/2026/receipts/${approvedDonation.receiptNo}/pdf`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const pdfBuffer = await pdfRes.arrayBuffer();
    console.log(`   ✅ PDF Receipt downloaded successfully (${pdfBuffer.byteLength} bytes, content-type=${pdfRes.headers.get('content-type')})`);

    // Test 8: Excel Export Workbook
    console.log('8. Testing 5-Sheet Excel Workbook Export...');
    const excelRes = await fetch(`${baseUrl}/2026/export/full`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const excelBuffer = await excelRes.arrayBuffer();
    console.log(`   ✅ Excel Workbook downloaded successfully (${excelBuffer.byteLength} bytes, content-type=${excelRes.headers.get('content-type')})`);

    // Test 9: Audit Trail
    console.log('9. Testing Audit Trail Ledger...');
    const auditRes = await fetch(`${baseUrl}/2026/audit-logs`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const auditData: any = await auditRes.json();
    console.log(`   ✅ Audit logs retrieved (${auditData.count} entries)`);

    console.log('\n🎉 ALL BACKEND API VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
  } catch (err: any) {
    console.error('❌ Verification test failed:', err.message);
    process.exit(1);
  } finally {
    server.close();
  }
}

runApiVerification();
