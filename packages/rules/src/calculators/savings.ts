export type SavingsInput = {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
};

export function calculateSavingsMaturity(input: SavingsInput) {
  const interest = input.principal * (input.annualRatePercent / 100) * (input.termMonths / 12);

  return input.principal + interest;
}
