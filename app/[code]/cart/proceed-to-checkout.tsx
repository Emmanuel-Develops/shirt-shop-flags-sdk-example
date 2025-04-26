'use client';

import { ProceedToCheckoutButton } from '@/components/shopping-cart/proceed-to-checkout-button';
import { track } from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function ProceedToCheckout({ color }: { color: string }) {
  const router = useRouter();
  return (
    <ProceedToCheckoutButton
      color={color}
      onClick={() => {
        track('proceed_to_checkout:clicked');
        router.push('/checkout');
      }}
    />
  );
}
