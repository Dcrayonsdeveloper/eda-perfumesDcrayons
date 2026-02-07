import { Metadata } from 'next';
import Buy1At799Client from './Buy1At799Client';

export const metadata: Metadata = {
  title: "Buy 1 Get 1 FREE @ ₹799 | Eda Perfumes",
  description: "Buy any 100ml signature perfume and get a 10ml travel size FREE at just ₹799. Premium eau de parfum deal at Eda Perfumes.",
  keywords: "buy 1 get 1, perfume deal, eda perfumes, fragrance offer, perfume bundle, free perfume",
  openGraph: {
    title: "Buy 1 Get 1 FREE @ ₹799 | Eda Perfumes",
    description: "100ml Signature Perfume + FREE 10ml Travel Size @ ₹799",
    type: "website",
  },
};

export default function Buy1At799Page() {
  return <Buy1At799Client />;
}



///
