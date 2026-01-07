import { Metadata } from 'next';
import CombosPageClient from './CombosPageClient';

export const metadata: Metadata = {
  title: 'Fragrance Combos - Eda Perfumes',
  description: 'Curated perfume combinations at special bundle prices',
};

// Simple server component - no data fetching
export default function CombosPage() {
  return <CombosPageClient />;
}
