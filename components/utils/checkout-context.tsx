"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Cart } from "./cart-types";
import { getCart } from "@/lib/actions";

export type CheckoutContextType = {
  cart: Cart | null;
  totalCost: number;
  paymentStatus: PaymentStatus;
  cartRef?: React.RefObject<Cart | null>;
  setPaymentStatus: (status: PaymentStatus) => void;
  userData: typeof defaultUserData;
  setUserData: (userData: typeof defaultUserData) => void;
};

const PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  EXPIRED: "EXPIRED",
} as const;

const defaultUserData = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  phone: "",
};

export const CheckoutContext = createContext<CheckoutContextType>({
  cart: null,
  totalCost: 0,
  paymentStatus: PaymentStatus.PENDING,
  setPaymentStatus: () => {},
  userData: defaultUserData,
  setUserData: () => {},
});

export type PaymentStatus = keyof typeof PaymentStatus;

const calculateTotal = (cart: Cart | null) => {
  if (!cart || !cart.items.length) return 0;
  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingCost = 500;
  return subtotal + shippingCost;
};

export const CheckoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    PaymentStatus.PENDING
  );
  const [userData, setUserData] =
    useState<typeof defaultUserData>(defaultUserData);

  const cartRef = useRef<Cart | null>(null);

  useEffect(() => {
    if (!cart) {
      const cart = getCart().then((data) => {
        setCart(data);
        cartRef.current = data;
      });
    }
    return () => {
      setCart(null);
      cartRef.current = null;
    };
  }, []);

  const totalCost = calculateTotal(cart);

  return (
    <CheckoutContext.Provider
      value={{
        cart,
        totalCost,
        paymentStatus,
        cartRef,
        setPaymentStatus,
        userData,
        setUserData,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export function useCheckoutContext() {
  return useContext(CheckoutContext);
}
