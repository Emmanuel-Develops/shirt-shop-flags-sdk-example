"use server";

import { NGN_PRECISION_UNITS } from "./config";

// Using a fallback here so we don't need to make the BACKEND_URL part of the env,
// which makes using the template easy..
const MAVAPAY_URL =
  process.env.MAVAPAY_URL || "https://staging.api.mavapay.co/api/v1";

const OWNER_ACCOUNT_NAME = process.env.OWNER_ACCOUNT_NAME || "";
const OWNER_ACCOUNT_NUMBER = process.env.OWNER_ACCOUNT_NUMBER || "";
const OWNER_BANK_CODE = process.env.OWNER_BANK_CODE || "";
const OWNER_BANK_NAME = process.env.OWNER_BANK_NAME || "";

export type MavapayResponseSchema<T> =
  | {
      data: T;
      status: "ok";
    }
  | {
      message: string;
      status: "error";
    };

export type Invoice = {
  id: string;
  exchangeRate: number;
  usdToTargetCurrencyRate: number;
  sourceCurrency: string;
  targetCurrency: string;
  transactionFeesInSourceCurrency: number;
  transactionFeesInTargetCurrency: number;
  amountInSourceCurrency: number;
  amountInTargetCurrency: number;
  paymentMethod: "LIGHTNING" | "ONCHAIN";
  expiry: string;
  isValid: boolean;
  invoice: string;
  hash: string;
  totalAmountInSourceCurrency: number;
  customerInternalFee: number;
  orderId: string;
};

export type OrderSnippet = {
  id: string;
  quoteId: string;
  settledQuoteId: string;
  amount: number;
  currency: string;
  paymentMethod: "LIGHTNING" | "ONCHAIN";
  status: "PAID" | "PENDING" | "FAILED";
  createdAt: string;
  updatedAt: string;
};

export async function createInvoice(amount: number) {
  return await fetch(`${MAVAPAY_URL}/quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.MAVAPAY_API_KEY || "",
    },
    body: JSON.stringify({
      amount: amount,
      sourceCurrency: "BTCSAT",
      targetCurrency: "NGNKOBO",
      paymentMethod: "lightning",
      paymentCurrency: "NGNKOBO",
      autopayout: false,
      beneficiary: {
        bankAccountNumber: OWNER_ACCOUNT_NUMBER,
        bankAccountName: OWNER_ACCOUNT_NAME,
        bankCode: OWNER_BANK_CODE,
        bankName: OWNER_BANK_NAME,
      },
    }),
  });
}

export const handleCreateInvoice = async (amount: number) => {
  "use server";
  try {
    const response = await createInvoice(amount * NGN_PRECISION_UNITS);
    const invoiceData: MavapayResponseSchema<Invoice> = await response.json();
    console.log("invoiceData", invoiceData);
    if (!response.ok || response.status !== 200) {
      return new Error("Failed to create invoice");
    }
    if (invoiceData.status !== "ok") {
      return new Error("Failed to create invoice");
    }

    return invoiceData.data;
  } catch (error: any) {
    console.log("error", error);
    return new Error(error.message);
  }
};

export async function getOrderById(orderId: string) {
  const response = await fetch(`${MAVAPAY_URL}/order?id=${orderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.MAVAPAY_API_KEY || "",
    },
  })

  if (!response.ok || response.status !== 200) {
    return new Error("Failed to get order");
  }

  const order: MavapayResponseSchema<OrderSnippet> = await response.json();

  if (order.status !== "ok") {
    return new Error("Failed to get order");
  }

  return order.data;
}
