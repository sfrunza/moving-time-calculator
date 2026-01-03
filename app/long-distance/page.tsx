import type { Metadata } from 'next';
import { MovingPriceCalculator } from '@/components/moving-price-calculator';

export const metadata: Metadata = {
  title: 'Long Distance Price Calculator',
  description: 'Calculate the cost of a long distance move',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/long-distance`,
  },
};

export default function LongDistance() {
  return <MovingPriceCalculator />;
}
