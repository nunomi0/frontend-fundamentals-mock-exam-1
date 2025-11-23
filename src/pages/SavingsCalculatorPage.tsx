import {
  Border,
  NavigationBar,
  Spacing,
  Tab,
} from 'tosslib';
import { useEffect, useState } from 'react';
import { useSavingsStore } from '../features/savings/store/useSavingsStore';
import * as calculations from '../features/savings/utils/calculations';
import { SavingsInputForm } from '../features/savings/components/SavingsInputForm';
import { SavingsProductList } from '../features/savings/components/SavingsProductList';
import { CalculationResult } from '../features/savings/components/CalculationResult';

export function SavingsCalculatorPage() {
  const allProducts = useSavingsStore((s) => s.products);
  const selectedProductId = useSavingsStore((s) => s.selectedProductId);
  const input = useSavingsStore((s) => s.input);
  const actions = useSavingsStore((s) => s.actions);
  const utils = useSavingsStore((s) => s.utils);

  const [selectedTab, setSelectedTab] = useState<'products' | 'results'>('products');

  useEffect(() => {
    actions.loadProducts();
  }, []);

  const products = allProducts.filter((product) => {
    const amount = Number(input.monthlyAmount.replace(/,/g, ''));
    
    if (amount > 0) {
      if (amount < product.minMonthlyAmount || amount > product.maxMonthlyAmount) {
        return false;
      }
    }

    if (product.availableTerms !== input.selectedTerm) {
      return false;
    }

    return true;
  });

  const selectedProduct = allProducts.find((p) => p.id === selectedProductId);

  const expectedProfit = calculations.calculateExpectedProfit(
    selectedProduct,
    input.monthlyAmount,
    input.selectedTerm
  );

  const difference = calculations.calculateDifference(
    input.targetAmount,
    input.monthlyAmount,
    input.selectedTerm,
    expectedProfit
  );

  const recommendedMonthly = calculations.calculateRecommendedMonthly(
    selectedProduct,
    input.targetAmount,
    input.selectedTerm
  );

  const recommendedProducts = calculations.getRecommendedProducts(products);

  const handleProductSelect = (id: string) => {
    if (selectedProductId === id) {
      actions.selectProduct(null);
    } else {
      actions.selectProduct(id);
    }
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsInputForm
        targetAmount={input.targetAmount}
        monthlyAmount={input.monthlyAmount}
        selectedTerm={input.selectedTerm}
        onTargetAmountChange={actions.handleTargetAmount}
        onMonthlyAmountChange={actions.handleMonthlyAmount}
        onTermChange={(value) => actions.setSelectedTerm(value as number)}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={(value) => setSelectedTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' && (
        <SavingsProductList
          products={products}
          selectedProductId={selectedProductId}
          onSelectProduct={handleProductSelect}
          formatMoney={utils.formatMoney}
        />
      )}

      {selectedTab === 'results' && (
        <CalculationResult
          selectedProduct={selectedProduct}
          expectedProfit={expectedProfit}
          difference={difference}
          recommendedMonthly={recommendedMonthly}
          recommendedProducts={recommendedProducts}
          selectedProductId={selectedProductId}
          onSelectProduct={handleProductSelect}
          formatMoney={utils.formatMoney}
        />
      )}

    </>
  );
}