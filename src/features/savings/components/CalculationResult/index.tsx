import { Border, ListRow, Spacing } from 'tosslib';
import { SavingsProduct } from '../../types/SavingsProduct';
import { ResultSummary } from './ResultSummary';
import { RecommendedProductList } from './RecommendedProductList';

interface CalculationResultProps {
  selectedProduct: SavingsProduct | undefined;
  expectedProfit: number;
  difference: number;
  recommendedMonthly: number;
  recommendedProducts: SavingsProduct[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  formatMoney: (n: number) => string;
}

export function CalculationResult({
  selectedProduct,
  expectedProfit,
  difference,
  recommendedMonthly,
  recommendedProducts,
  selectedProductId,
  onSelectProduct,
  formatMoney,
}: CalculationResultProps) {
  return (
    <>
      {selectedProduct ? (
        <ResultSummary
          expectedProfit={expectedProfit}
          difference={difference}
          recommendedMonthly={recommendedMonthly}
          formatMoney={formatMoney}
        />
      ) : (
        <>
          <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />
        </>
      )}

      <RecommendedProductList
        products={recommendedProducts}
        selectedProductId={selectedProductId}
        onSelectProduct={onSelectProduct}
        formatMoney={formatMoney}
      />
    </>
  );
}

