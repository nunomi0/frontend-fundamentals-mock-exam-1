import {
  Assets,
  Border,
  colors,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';
import { useEffect, useState } from 'react';
import { useSavingsStore } from '../features/savings/store/useSavingsStore';
import * as calculations from '../features/savings/utils/calculations';

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

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={input.targetAmount}
        onChange={actions.handleTargetAmount}
      />

      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={input.monthlyAmount}
        onChange={actions.handleMonthlyAmount}
      />

      <Spacing size={16} />

      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={input.selectedTerm}
        onChange={(value) => actions.setSelectedTerm(value as number)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

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
                  bottom={`${utils.formatMoney(product.minMonthlyAmount)}원 ~ ${utils.formatMoney(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
                  bottomProps={{ fontSize: 13, color: colors.grey600 }}
                />
              }
              right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
              onClick={() => actions.selectProduct(product.id)}
            />
          ))}
        </>
      )}

      {selectedTab === 'results' && (
        <>
          {selectedProduct ? (
            <>
              <Spacing size={8} />

              <ListRow
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top="예상 수익 금액"
                    topProps={{ color: colors.grey600 }}
                    bottom={`${utils.formatMoney(expectedProfit)}원`}
                    bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                  />
                }
              />

              <ListRow
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top="목표 금액과의 차이"
                    topProps={{ color: colors.grey600 }}
                    bottom={`${difference >= 0 ? '+' : ''}${utils.formatMoney(difference)}원`}
                    bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                  />
                }
              />

              <ListRow
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top="추천 월 납입 금액"
                    topProps={{ color: colors.grey600 }}
                    bottom={`${utils.formatMoney(recommendedMonthly)}원`}
                    bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                  />
                }
              />

              <Spacing size={8} />
              <Border height={16} />
              <Spacing size={8} />
            </>
          ) : (
            <>
              <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
              <Spacing size={8} />
              <Border height={16} />
              <Spacing size={8} />
            </>
          )}

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          {recommendedProducts.map((product) => (
            <ListRow
              key={product.id}
              contents={
                <ListRow.Texts
                  type="3RowTypeA"
                  top={product.name}
                  topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                  middle={`연 이자율: ${product.annualRate}%`}
                  middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                  bottom={`${utils.formatMoney(product.minMonthlyAmount)}원 ~ ${utils.formatMoney(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
                  bottomProps={{ fontSize: 13, color: colors.grey600 }}
                />
              }
              right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
              onClick={() => actions.selectProduct(product.id)}
            />
          ))}

          <Spacing size={40} />
        </>
      )}

    </>
  );
}