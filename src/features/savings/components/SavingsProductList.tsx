import { Assets, colors, ListRow } from 'tosslib';
import { SavingsProduct } from '../types/SavingsProduct';

interface SavingsProductListProps {
  products: SavingsProduct[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  formatMoney: (n: number) => string;
}

export function SavingsProductList({
  products,
  selectedProductId,
  onSelectProduct,
  formatMoney,
}: SavingsProductListProps) {
  return (
    <>
      {products.map((product) => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${formatMoney(product.minMonthlyAmount)}원 ~ ${formatMoney(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
          onClick={() => onSelectProduct(product.id)}
        />
      ))}
    </>
  );
}

