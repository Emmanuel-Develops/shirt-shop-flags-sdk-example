"use client";

import { ShoppingCartItem } from "@/components/shopping-cart/shopping-cart-item";
import { useCheckoutContext } from "@/components/utils/checkout-context";

export const CheckoutReviewContent = ({
  freeDelivery,
}: {
  freeDelivery: boolean;
}) => {
  const { cart, totalCost, paymentStatus, userData } = useCheckoutContext();
  const qualifyingForFreeDelivery = freeDelivery && totalCost > 4000;
  const shipping = 500;
  const total = totalCost;
  return (
    <>
      {paymentStatus === "PAID" ? (
        <>
         <div className="mt-4">
          <h3 className="text-center font-semibold text-lg">Order Completed</h3>
          <div className="flex flex-col justify-center gap-y-4 w-full">
            <p className="font-semibold">
              Shipping Details
            </p>
            <div className="w-full h-[1px] bg-gray-700"></div>
            <p>
              Name: {userData.firstName} {userData.lastName}
            </p>
            <p>Address: {userData.address}</p>
          </div>
         </div>
        </>
      ) : (
        <>
          {cart?.items.map((item) => (
            <ShoppingCartItem
              key={[item.id, item.color, item.size].join("/")}
              item={item}
              editable={false}
            />
          ))}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">Shipping estimate</p>
            {qualifyingForFreeDelivery ? (
              <p className="text-sm font-medium text-gray-900">
                <span className="line-through font-normal">
                  {shipping.toFixed(2)} NGN
                </span>{" "}
                FREE
              </p>
            ) : (
              <p className="text-sm font-medium text-gray-900">
                {shipping.toFixed(2)} NGN
              </p>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="text-base font-medium text-gray-900">Order total</p>
            <p className="text-base font-medium text-gray-900">
              {total.toFixed(2)} NGN
            </p>
          </div>
        </>
      )}
    </>
  );
};
