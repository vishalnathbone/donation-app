import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { Donation, Settings } from '../models/types';
import { numberToWordsIndian, formatCurrencyIN } from './numberToWords';

export async function generateReceiptPdf(
  donation: Donation,
  receiptNo: string,
  settings: Settings,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const writeStream = fs.createWriteStream(outputPath);

    doc.pipe(writeStream);

    // Primary Colors
    const primaryColor = '#1e3a8a'; // Deep Navy
    const secondaryColor = '#0d9488'; // Teal Accent
    const darkText = '#1f2937';
    const lightBg = '#f8fafc';
    const borderColor = '#e2e8f0';

    // Header Background Box
    doc.rect(40, 40, 515, 90).fill(lightBg);
    doc.rect(40, 40, 515, 90).stroke(primaryColor);

    // Organization Header
    doc.fillColor(primaryColor).fontSize(20).font('Helvetica-Bold').text(settings.orgName.toUpperCase(), 55, 55, { align: 'center' });
    doc.fillColor(darkText).fontSize(10).font('Helvetica').text(settings.orgAddress, 55, 82, { align: 'center' });
    doc.fontSize(9).text(`Phone: ${settings.orgMobile} | Email: ${settings.orgEmail}`, 55, 98, { align: 'center' });

    // Receipt Title Badge
    doc.rect(200, 145, 195, 26).fill(secondaryColor);
    doc.fillColor('#ffffff').fontSize(12).font('Helvetica-Bold').text('DONATION RECEIPT', 200, 152, { align: 'center' });

    // Receipt Metadata Bar (Receipt No, Date, Donation ID)
    const yMeta = 185;
    doc.rect(40, yMeta, 515, 30).fill('#f1f5f9').stroke(borderColor);
    doc.fillColor(darkText).fontSize(9).font('Helvetica-Bold');
    doc.text(`RECEIPT NO: `, 50, yMeta + 10);
    doc.fillColor(primaryColor).text(receiptNo, 120, yMeta + 10);

    doc.fillColor(darkText).text(`DONATION ID: `, 240, yMeta + 10);
    doc.fillColor(primaryColor).text(donation.id, 315, yMeta + 10);

    doc.fillColor(darkText).text(`DATE: `, 430, yMeta + 10);
    doc.fillColor(darkText).font('Helvetica').text(donation.donationDate, 465, yMeta + 10);

    // Donor Details Section
    let yDonor = 230;
    doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('DONOR DETAILS', 40, yDonor);
    doc.rect(40, yDonor + 15, 515, 75).stroke(borderColor);

    doc.fillColor(darkText).fontSize(10).font('Helvetica-Bold').text('Donor Name:', 50, yDonor + 25);
    doc.font('Helvetica').text(donation.donorName, 140, yDonor + 25);

    doc.font('Helvetica-Bold').text('Mobile Number:', 50, yDonor + 45);
    doc.font('Helvetica').text(donation.mobileNumber || 'N/A', 140, yDonor + 45);

    doc.font('Helvetica-Bold').text('Email:', 310, yDonor + 45);
    doc.font('Helvetica').text(donation.email || 'N/A', 360, yDonor + 45);

    doc.font('Helvetica-Bold').text('Address:', 50, yDonor + 65);
    doc.font('Helvetica').text(donation.address || 'N/A', 140, yDonor + 65, { width: 400 });

    // Contribution & Payment Details Section
    let yPayment = 335;
    doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('DONATION & PAYMENT DETAILS', 40, yPayment);
    doc.rect(40, yPayment + 15, 515, 100).stroke(borderColor);

    doc.fillColor(darkText).fontSize(10).font('Helvetica-Bold').text('Donation Type:', 50, yPayment + 25);
    doc.font('Helvetica').text(donation.donationTypeName, 150, yPayment + 25);

    doc.font('Helvetica-Bold').text('Payment Mode:', 310, yPayment + 25);
    doc.font('Helvetica').text(donation.paymentMode, 400, yPayment + 25);

    doc.font('Helvetica-Bold').text('Transaction Ref:', 50, yPayment + 48);
    doc.font('Helvetica').text(donation.transactionRef || 'N/A', 150, yPayment + 48);

    doc.font('Helvetica-Bold').text('Amount Received:', 50, yPayment + 72);
    doc.fillColor(secondaryColor).fontSize(14).font('Helvetica-Bold').text(formatCurrencyIN(donation.amount), 150, yPayment + 70);

    // Amount in Words
    doc.rect(40, 460, 515, 30).fill('#fef3c7').stroke('#f59e0b');
    doc.fillColor('#92400e').fontSize(10).font('Helvetica-Bold').text('Amount in Words:', 50, 470);
    doc.fillColor('#78350f').font('Helvetica-Bold').text(numberToWordsIndian(donation.amount), 160, 470);

    // Notes if present
    if (donation.notes) {
      doc.fillColor(darkText).fontSize(9).font('Helvetica-Oblique').text(`Note: ${donation.notes}`, 40, 502, { width: 515 });
    }

    // Thank You Message Box
    doc.rect(40, 530, 515, 50).fill('#eff6ff');
    doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold').text('THANK YOU FOR YOUR NOBLE CONTRIBUTION!', 55, 545, { align: 'center' });
    doc.fillColor(darkText).fontSize(8).font('Helvetica').text('Your generous support helps us continue our philanthropic services and community programs.', 55, 560, { align: 'center' });

    // Authorization & Signature Section
    doc.lineCap('butt').lineWidth(1).moveTo(380, 640).lineTo(535, 640).stroke(borderColor);
    doc.fillColor(darkText).fontSize(9).font('Helvetica-Bold').text('Authorized Signatory', 380, 646, { width: 155, align: 'center' });
    doc.fontSize(8).font('Helvetica').text(donation.confirmedByName || 'Trustee / Finance Admin', 380, 658, { width: 155, align: 'center' });

    // Footer
    doc.fontSize(8).fillColor('#9ca3af').text('This is a computer-generated donation receipt.', 40, 720, { align: 'center' });

    doc.end();

    writeStream.on('finish', () => resolve());
    writeStream.on('error', (err) => reject(err));
  });
}
