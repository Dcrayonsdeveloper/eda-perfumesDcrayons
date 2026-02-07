import { Metadata } from 'next';
import ValentineGiftPackClient from './ValentineGiftPackClient';




export const metadata: Metadata = {
  title: "Valentine's Gift Pack - 2×100ml + 4×10ml @ ₹1099 | Eda Perfumes",
  description: "Exclusive Valentine's Day gift pack - Get 2 signature 100ml perfumes + 4 travel size 10ml perfumes at just ₹1099. Perfect romantic gift for your loved ones.",
  keywords: "valentine gift, perfume gift pack, romantic gift, eda perfumes, fragrance gift set",
  openGraph: {
    title: "Valentine's Gift Pack - Eda Perfumes",
    description: "2×100ml + 4×10ml Perfumes @ ₹1099 - Limited Time Offer",
    type: "website",
  },
};

export default function ValentineGiftPackPage() {
  return <ValentineGiftPackClient />;
}
