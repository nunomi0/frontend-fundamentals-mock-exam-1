import { ListHeader, Spacing } from 'tosslib';
import { SavingsProduct } from '../../types/SavingsProduct';
import { SavingsProductList } from '../SavingsProductList';

interface RecommendedProductListProps {
  products: SavingsProduct[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  formatMoney: (n: number) => string;
}

export function RecommendedProductList({
  products,
  selectedProductId,
  onSelectProduct,
  formatMoney,
}: RecommendedProductListProps) {
  return (
    <>
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      <SavingsProductList
        products={products}
        selectedProductId={selectedProductId}
        onSelectProduct={onSelectProduct}
        formatMoney={formatMoney}
      />

      <Spacing size={40} />
    </>
  );
}

