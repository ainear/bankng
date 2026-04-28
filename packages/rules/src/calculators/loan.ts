export type LoanInput = {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
};

export function calculateEqualMonthlyPayment(input: LoanInput) {
  const monthlyRate = input.annualRatePercent / 100 / 12;

  if (monthlyRate === 0) {
    return input.principal / input.termMonths;
  }

  return (
    (input.principal * monthlyRate * (1 + monthlyRate) ** input.termMonths) /
    ((1 + monthlyRate) ** input.termMonths - 1)
  );
}
