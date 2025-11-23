import { create } from "zustand";
import { fetchProducts } from "../../../api/fetchProducts";
import { SavingsProduct } from "../types/SavingsProduct";

interface SavingsState {
  products: SavingsProduct[];
  selectedProductId: string | null;

  input: {
    targetAmount: string;
    monthlyAmount: string;
    selectedTerm: number;
  };

  actions: {
    loadProducts: () => Promise<void>;
    selectProduct: (id: string | null) => void;

    handleTargetAmount: (raw: string | React.ChangeEvent<HTMLInputElement>) => void;
    handleMonthlyAmount: (raw: string | React.ChangeEvent<HTMLInputElement>) => void;
    setSelectedTerm: (v: number) => void;
  };

  utils: {
    formatMoney: (n: number) => string;
  };

  selectors: {
    filteredProducts: () => SavingsProduct[];
  };
}

export const useSavingsStore = create<SavingsState>((set, get) => ({
  products: [],
  selectedProductId: null,

  input: {
    targetAmount: "",
    monthlyAmount: "",
    selectedTerm: 12,
  },

  actions: {
    loadProducts: async () => {
      const data = await fetchProducts();
      set({ products: data });
    },

    selectProduct: (id) => set({ selectedProductId: id }),

    handleTargetAmount: (raw) => {
      const value = typeof raw === "string" ? raw : raw.target.value;
      const onlyNumbers = value.replace(/,/g, "");

      if (!/^\d*$/.test(onlyNumbers)) return;

      const formatted = onlyNumbers
        ? Number(onlyNumbers).toLocaleString()
        : "";

      set((s) => ({
        input: { ...s.input, targetAmount: formatted },
      }));
    },

    handleMonthlyAmount: (raw) => {
      const value = typeof raw === "string" ? raw : raw.target.value;
      const onlyNumbers = value.replace(/,/g, "");

      if (!/^\d*$/.test(onlyNumbers)) return;

      const formatted = onlyNumbers
        ? Number(onlyNumbers).toLocaleString()
        : "";

      set((s) => ({
        input: { ...s.input, monthlyAmount: formatted },
      }));
    },

    setSelectedTerm: (v: number) =>
      set((s) => ({
        input: { ...s.input, selectedTerm: v },
    })),
  },

  utils: {
    formatMoney: (n: number) => n.toLocaleString(),
  },

  selectors: {
    filteredProducts: () => {
      const { products, input } = get();
      const amount = Number(input.monthlyAmount.replace(/,/g, ""));
      const term = input.selectedTerm;

      return products.filter((p) => {
        const inRange =
          amount >= p.minMonthlyAmount &&
          amount <= p.maxMonthlyAmount;

        const termMatch = p.availableTerms === term;

        return inRange && termMatch;
      });
    },
  },
}));