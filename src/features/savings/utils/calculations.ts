import { SavingsProduct } from '../types/SavingsProduct';

export function getRecommendedProducts(
  products: SavingsProduct[],
  count: number = 2
): SavingsProduct[] {
  return products
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, count);
}

export function calculateExpectedProfit(
  selectedProduct: SavingsProduct | undefined,
  monthlyAmount: string,
  selectedTerm: number
): number {
  if (!selectedProduct || !monthlyAmount) return 0;

  const monthly = Number(monthlyAmount.replace(/,/g, ''));
  const totalDeposit = monthly * selectedTerm;
  const annualRate = selectedProduct.annualRate / 100;

  const profit = totalDeposit * annualRate * (selectedTerm / 12);
  return Math.floor(profit);
}

export function calculateDifference(
  targetAmount: string,
  monthlyAmount: string,
  selectedTerm: number,
  expectedProfit: number
): number {
  if (!targetAmount || !monthlyAmount) return 0;

  const target = Number(targetAmount.replace(/,/g, ''));
  const monthly = Number(monthlyAmount.replace(/,/g, ''));
  const totalAmount = monthly * selectedTerm + expectedProfit;

  return totalAmount - target;
}

export function calculateRecommendedMonthly(
  selectedProduct: SavingsProduct | undefined,
  targetAmount: string,
  selectedTerm: number
): number {
  if (!selectedProduct || !targetAmount) return 0;

  const target = Number(targetAmount.replace(/,/g, ''));
  const annualRate = selectedProduct.annualRate / 100;
  const ratePerTerm = annualRate * (selectedTerm / 12);

  const recommended = target / (selectedTerm * (1 + ratePerTerm));
  return Math.ceil(recommended / 10000) * 10000;
}

