import extenso from 'extenso';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + '%';
}

export function currencyToWords(value: number): string {
  try {
    // extenso expects a string like "1234.56" or a number
    const result = extenso(value.toFixed(2).replace('.', ','), {
      mode: 'currency',
      currency: { type: 'BRL' },
    });
    return result;
  } catch {
    return '';
  }
}
