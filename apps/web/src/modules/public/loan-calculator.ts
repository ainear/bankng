export type LoanInput = {
  principal: number; // VND
  annualRate: number; // e.g. 8.5 for 8.5%
  termMonths: number;
  loanType: "vay-mua-nha" | "vay-mua-xe" | "vay-tin-chap" | "vay-kinh-doanh" | "the-tin-dung" | "tiet-kiem";
};

export type LoanResult = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  effectiveRate: number;
  amortizationSchedule: AmortizationRow[];
};

export type AmortizationRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

export function calculateLoan(input: LoanInput): LoanResult {
  const { principal, annualRate, termMonths } = input;
  const monthlyRate = annualRate / 100 / 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / termMonths;
  } else {
    monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
  }

  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - principal;

  const schedule: AmortizationRow[] = [];
  let balance = principal;
  for (let month = 1; month <= termMonths; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance = Math.max(0, balance - principalPayment);
    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance,
    });
  }

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    effectiveRate: (totalInterest / principal) * 100,
    amortizationSchedule: schedule,
  };
}

export function formatVND(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)} ty`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(0)} trieu`;
  }
  return amount.toLocaleString("vi-VN");
}

export function parseVND(value: string): number {
  return parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
}
