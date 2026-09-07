import { Donation } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

export interface IWhatsAppService {
  generateReceiptLink(donation: Donation, receiptPdfUrl?: string): string;
  shareReceipt(donation: Donation, receiptPdfUrl?: string): void;
}

export class DeepLinkWhatsAppService implements IWhatsAppService {
  private formatPhoneNumber(phone?: string): string {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) return `91${cleaned}`;
    return cleaned;
  }

  public generateReceiptLink(donation: Donation, receiptPdfUrl?: string): string {
    const formattedPhone = this.formatPhoneNumber(donation.mobileNumber);
    const receiptNum = donation.receiptNo || donation.id;
    const formattedAmount = formatCurrency(donation.amount);
    const formattedDate = formatDate(donation.donationDate);

    const messageLines = [
      `🙏 *Official Donation Receipt*`,
      `===========================`,
      `*Receipt No:* ${receiptNum}`,
      `*Donor:* ${donation.donorName}`,
      `*Amount Received:* ${formattedAmount}`,
      `*Category:* ${donation.donationTypeName || 'GENERAL'}`,
      `*Payment Mode:* ${donation.paymentMode}`,
      `*Date:* ${formattedDate}`,
      `===========================`,
      `Thank you for your generous contribution! Your receipt certificate has been safely recorded in our official registry.`,
    ];

    if (receiptPdfUrl) {
      messageLines.push(`📄 *Download PDF Receipt:* ${receiptPdfUrl}`);
    }

    const encodedText = encodeURIComponent(messageLines.join('\n'));

    if (formattedPhone) {
      return `https://wa.me/${formattedPhone}?text=${encodedText}`;
    }
    return `https://wa.me/?text=${encodedText}`;
  }

  public shareReceipt(donation: Donation, receiptPdfUrl?: string): void {
    const url = this.generateReceiptLink(donation, receiptPdfUrl);
    window.open(url, '_blank');
  }
}

export const whatsAppService = new DeepLinkWhatsAppService();
