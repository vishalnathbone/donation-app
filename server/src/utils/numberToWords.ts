export function numberToWordsIndian(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'Rupees Zero Only';

  const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertChunk(n: number): string {
    let str = '';
    if (n > 99) {
      str += single[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 19) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 9) {
      str += double[n - 10] + ' ';
      n = 0;
    }
    if (n > 0) {
      str += single[n] + ' ';
    }
    return str;
  }

  let num = Math.floor(Math.abs(amount));
  let result = '';

  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const remaining = num;

  if (crore > 0) {
    result += convertChunk(crore) + 'Crore ';
  }
  if (lakh > 0) {
    result += convertChunk(lakh) + 'Lakh ';
  }
  if (thousand > 0) {
    result += convertChunk(thousand) + 'Thousand ';
  }
  if (remaining > 0) {
    result += convertChunk(remaining);
  }

  const trimmed = result.trim();
  return `Rupees ${trimmed} Only`;
}

export function formatCurrencyIN(amount: number): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `Rs. ${formatted}`;
}
