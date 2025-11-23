import { http } from 'tosslib';
import type { SavingsProduct } from '../features/savings/types/SavingsProduct';

export async function fetchProducts(): Promise<SavingsProduct[]> {
  const response = await http.get<SavingsProduct[]>('/api/savings-products');
  return response;
}