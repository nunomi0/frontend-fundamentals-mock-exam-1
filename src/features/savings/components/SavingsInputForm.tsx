import { SelectBottomSheet, Spacing, TextField } from 'tosslib';

interface SavingsInputFormProps {
  targetAmount: string;
  monthlyAmount: string;
  selectedTerm: number;
  onTargetAmountChange: (value: string | React.ChangeEvent<HTMLInputElement>) => void;
  onMonthlyAmountChange: (value: string | React.ChangeEvent<HTMLInputElement>) => void;
  onTermChange: (value: unknown) => void;
}

export function SavingsInputForm({
  targetAmount,
  monthlyAmount,
  selectedTerm,
  onTargetAmountChange,
  onMonthlyAmountChange,
  onTermChange,
}: SavingsInputFormProps) {
  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount}
        onChange={onTargetAmountChange}
      />

      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount}
        onChange={onMonthlyAmountChange}
      />

      <Spacing size={16} />

      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={selectedTerm}
        onChange={onTermChange}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
}

