import PDFDocument from 'pdfkit';
import fs from 'fs';
import { Donation, Settings } from '../models/types';
import { numberToWordsIndian, formatCurrencyIN } from './numberToWords';

import path from 'path';
import { JsonStorageHelper } from './jsonStorage';

function parseImageBuffer(str?: string): Buffer | null {
  if (!str) return null;
  try {
    if (str.startsWith('data:image/')) {
      const base64Data = str.split(',')[1];
      return Buffer.from(base64Data, 'base64');
    }
    if (fs.existsSync(str)) {
      return fs.readFileSync(str);
    }
  } catch {
    return null;
  }
  return null;
}

export async function generateReceiptPdf(
  donation: Donation,
  receiptNo: string,
  settings: Settings,
  outputPath: string,
  _lang?: string
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    // Custom label text with fallback to English defaults
    const receiptNoLbl = settings.receiptNoLabel || 'RECEIPT NO';
    const dateLbl = settings.dateLabel || 'DATE';
    const idLbl = settings.idLabel || 'ID';
    const donorNameLbl = settings.donorNameLabel || 'Donor Name:';
    const purposeLbl = settings.purposeLabel || 'Purpose:';
    const paymentModeLbl = settings.paymentModeLabel || 'Payment Mode:';
    const refLbl = settings.refLabel || 'Ref:';
    const amountLbl = settings.amountLabel || 'Amount (Rs.):';
    const amountInWordsLbl = settings.amountInWordsLabel || 'Amount in Words:';
    const signatoryLbl = settings.signatoryLabel || 'Authorized Signatory';
    const thanksNotesLbl = settings.thanksNotes || 'Thank you for your generous contribution and support!';

    // Exact dimensions: 22 cm x 11 cm
    // 1 cm = 28.3464567 pt
    const PAGE_WIDTH = 623.62;  // 22.0 cm
    const PAGE_HEIGHT = 311.81; // 11.0 cm
    const HEADER_HEIGHT = 70.87; // 2.5 cm
    const BODY_HEIGHT = 184.25;  // 6.5 cm
    const FOOTER_HEIGHT = 56.69; // 2.0 cm

    const doc = new PDFDocument({
      size: [PAGE_WIDTH, PAGE_HEIGHT],
      margin: 0,
    });

    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // Fallback: Check data/<year>/receipt-templates/ for header.png and footer.png if not in settings object
    const yearDir = await JsonStorageHelper.ensureYearDir(settings.year || donation.year || 2026);
    const templateDir = path.join(yearDir, 'receipt-templates');

    let headerBuf = parseImageBuffer(settings.headerImage);
    if (!headerBuf && fs.existsSync(path.join(templateDir, 'header.png'))) {
      headerBuf = fs.readFileSync(path.join(templateDir, 'header.png'));
    }

    let footerBuf = parseImageBuffer(settings.footerImage);
    if (!footerBuf && fs.existsSync(path.join(templateDir, 'footer.png'))) {
      footerBuf = fs.readFileSync(path.join(templateDir, 'footer.png'));
    }

    // ==========================================
    // 1. HEADER SECTION (22 cm x 2.5 cm)
    // ==========================================
    if (headerBuf) {
      try {
        doc.image(headerBuf, 0, 0, { width: PAGE_WIDTH, height: HEADER_HEIGHT });
      } catch {
        renderDefaultHeader(doc, settings, PAGE_WIDTH, HEADER_HEIGHT);
      }
    } else {
      renderDefaultHeader(doc, settings, PAGE_WIDTH, HEADER_HEIGHT);
    }

    // ==========================================
    // 2. BODY SECTION (22 cm x 6.5 cm) - Receipt Content
    // ==========================================
    const yBody = HEADER_HEIGHT; // 70.87 pt
    const primaryColor = '#1e3a8a';
    const darkText = '#1f2937';

    // Body Background & Outer Outline
    doc.rect(0, yBody, PAGE_WIDTH, BODY_HEIGHT).fill('#f8fafc');
    doc.rect(10, yBody + 4, PAGE_WIDTH - 20, BODY_HEIGHT - 8).stroke('#cbd5e1');

    // Metadata Bar: Receipt No, Date, Donation ID
    doc.fillColor(primaryColor).fontSize(8.5).font('Helvetica-Bold').text(`${receiptNoLbl}: ${receiptNo}`, 20, yBody + 12);
    doc.fillColor(darkText).fontSize(8.5).font('Helvetica-Bold').text(`${dateLbl}: ${donation.donationDate}`, 260, yBody + 12);
    doc.fillColor(primaryColor).fontSize(8.5).font('Helvetica-Bold').text(`${idLbl}: ${donation.id}`, 470, yBody + 12);

    doc.lineWidth(0.5).moveTo(20, yBody + 26).lineTo(PAGE_WIDTH - 20, yBody + 26).stroke('#e2e8f0');

    // Name row
    const yName = yBody + 32;
    doc.fillColor('#475569').fontSize(8.5).font('Helvetica-Bold').text(donorNameLbl, 20, yName);
    doc.fillColor('#0f172a').fontSize(10.5).font('Helvetica-Bold').text(donation.donorName, 140, yName, { width: 460 });

    // Category / Purpose & Payment Info row
    const yRow2 = yBody + 52;
    doc.fillColor('#475569').fontSize(8).font('Helvetica-Bold').text(purposeLbl, 20, yRow2);
    doc.fillColor(darkText).fontSize(8.5).font('Helvetica-Bold').text(donation.donationTypeName || 'GENERAL', 95, yRow2);

    doc.fillColor('#475569').fontSize(8).font('Helvetica-Bold').text(paymentModeLbl, 240, yRow2);
    doc.fillColor(darkText).fontSize(8.5).font('Helvetica-Bold').text(donation.paymentMode, 340, yRow2);

    if (donation.transactionRef) {
      doc.fillColor('#475569').fontSize(8).font('Helvetica-Bold').text(`${refLbl} ${donation.transactionRef}`, 460, yRow2);
    }

    // Amount Box: Number & Words
    const yAmountBox = yBody + 72;
    doc.rect(20, yAmountBox, PAGE_WIDTH - 40, 48).fill('#f0fdf4').stroke('#86efac');

    const amountStr = formatCurrencyIN(donation.amount);
    const amountInWords = numberToWordsIndian(donation.amount);

    doc.fillColor('#166534').fontSize(9).font('Helvetica-Bold').text(amountLbl, 30, yAmountBox + 8);
    doc.fillColor('#15803d').fontSize(12.5).font('Helvetica-Bold').text(amountStr, 145, yAmountBox + 6);

    doc.fillColor('#166534').fontSize(8.5).font('Helvetica-Bold').text(amountInWordsLbl, 30, yAmountBox + 28);
    doc.fillColor('#14532d').fontSize(9).font('Helvetica-Bold').text(amountInWords, 155, yAmountBox + 28, { width: PAGE_WIDTH - 195 });

    // Remarks & Signatory row
    const yRow4 = yBody + 130;
    if (donation.notes) {
      doc.fillColor('#64748b').fontSize(7.5).font('Helvetica-Oblique').text(`Remarks: ${donation.notes}`, 20, yRow4, { width: 380 });
    } else {
      doc.fillColor('#64748b').fontSize(7.5).font('Helvetica-Oblique').text(thanksNotesLbl, 20, yRow4, { width: 380 });
    }

    doc.lineWidth(0.8).moveTo(420, yBody + 155).lineTo(600, yBody + 155).stroke('#cbd5e1');
    doc.fillColor('#334155').fontSize(8).font('Helvetica-Bold').text(signatoryLbl, 420, yBody + 158, { width: 180, align: 'center' });
    if (donation.confirmedByName) {
      doc.fillColor('#64748b').fontSize(7.5).font('Helvetica').text(donation.confirmedByName, 420, yBody + 168, { width: 180, align: 'center' });
    }

    // ==========================================
    // 3. FOOTER SECTION (22 cm x 2.0 cm)
    // ==========================================
    const yFooter = HEADER_HEIGHT + BODY_HEIGHT; // 255.12 pt

    if (footerBuf) {
      try {
        doc.image(footerBuf, 0, yFooter, { width: PAGE_WIDTH, height: FOOTER_HEIGHT });
      } catch {
        renderDefaultFooter(doc, settings, PAGE_WIDTH, yFooter, FOOTER_HEIGHT);
      }
    } else {
      renderDefaultFooter(doc, settings, PAGE_WIDTH, yFooter, FOOTER_HEIGHT);
    }

    doc.end();

    writeStream.on('finish', () => resolve());
    writeStream.on('error', (err) => reject(err));
  });
}

function renderDefaultHeader(doc: typeof PDFDocument.prototype, settings: Settings, width: number, height: number) {
  doc.rect(0, 0, width, height).fill('#1e293b');
  doc.fillColor('#ffffff').fontSize(15).font('Helvetica-Bold').text(settings.orgName.toUpperCase(), 15, 12, { width: width - 30, align: 'center' });
  doc.fillColor('#cbd5e1').fontSize(8.5).font('Helvetica').text(settings.orgAddress, 15, 33, { width: width - 30, align: 'center' });
  doc.fontSize(8).text(`Phone: ${settings.orgMobile} | Email: ${settings.orgEmail}`, 15, 48, { width: width - 30, align: 'center' });
}

function renderDefaultFooter(doc: typeof PDFDocument.prototype, settings: Settings, width: number, y: number, height: number) {
  doc.rect(0, y, width, height).fill('#0f172a');
  const notice = settings.officialNotice || 'THIS IS AN OFFICIAL COMPUTER GENERATED DONATION RECEIPT';
  const subNotice = `Subject to realization of payment. Thank you for supporting ${settings.orgName}.`;
  doc.fillColor('#94a3b8').fontSize(7.5).font('Helvetica-Bold').text(notice, 0, y + 16, { width, align: 'center' });
  doc.fillColor('#64748b').fontSize(7).font('Helvetica').text(subNotice, 0, y + 30, { width, align: 'center' });
}
