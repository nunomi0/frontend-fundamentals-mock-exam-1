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
    selectProduct: (id: string) => void;
    setTargetAmount: (v: string) => void;
    setMonthlyAmount: (v: string) => void;
    setSelectedTerm: (v: number) => void;
  };
  utils: {
    formatMoney: (n: number) => string;
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

    selectProduct: (id: string) => set({ selectedProductId: id }),

    setTargetAmount: (v: string) =>
      set((s) => ({ input: { ...s.input, targetAmount: v } })),

    setMonthlyAmount: (v: string) =>
      set((s) => ({ input: { ...s.input, monthlyAmount: v } })),

    setSelectedTerm: (v: number) =>
      set((s) => ({ input: { ...s.input, selectedTerm: v } })),
  },

  utils: {
    formatMoney: (n: number) => n.toLocaleString(),
  },
}));