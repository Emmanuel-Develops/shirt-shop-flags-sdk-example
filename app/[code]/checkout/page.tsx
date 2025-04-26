import { Main } from "@/components/main";
import {
  productFlags,
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
} from "@/flags";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Suspense } from "react";
import { OrderSummaryFallback } from "@/components/shopping-cart/order-summary-section";
import { CheckoutProvider } from "@/components/utils/checkout-context";
import { CheckoutReviewContent } from "./checkout-review-content";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  // console.log("code at checkout", code);

  const showSummerBanner = await showSummerBannerFlag(code, productFlags);
  const freeDeliveryBanner = await showFreeDeliveryBannerFlag(
    code,
    productFlags
  );

  return (
    <CheckoutProvider>
      <Main>
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div className="lg:col-span-7">
            <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
            <p className="text-muted-foreground mt-1">
              Complete your order by providing your shipping and payment details.
            </p>
            <CheckoutForm />
          </div>
          <CheckoutReview />
        </div>
      </Main>
    </CheckoutProvider>
  );
}

const CheckoutReview = () => {
  return (
    <section className="mt-16 rounded-lg bg-gray-50 px-6 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

      <Suspense fallback={<OrderSummaryFallback showSummerBanner={false} />}>
        <CheckoutReviewContent freeDelivery={false} />
      </Suspense>
    </section>
  );
};
