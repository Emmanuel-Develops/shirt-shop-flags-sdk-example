import React, { useEffect, useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import Checkmark from "@/public/assets/checkmark-400.svg";
import ErrorIcon from "@/public/assets/error-icon.svg";
import { toast } from "sonner";
import Image from "next/image";
import { type Invoice } from "@/lib/mavapay";
import { NGN_PRECISION_UNITS } from "@/lib/config";
import clsx from "clsx";
import { Button } from "./ui/button";
import { useCheckPayment } from "@/hooks/useCheckPayment";
import { clearCart } from "@/lib/actions";
import { PaymentStatus, useCheckoutContext } from "./utils/checkout-context";

const handleCopyInvoice = (text: string) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast("Invoice copied to clipboard");
      })
      .catch((err) => {
        toast("Failed to copy invoice");
      });
  } else {
    toast(`Clipboard functionality is not available`);
  }
};

const Invoice = ({ data, retry }: { data: Invoice | null, retry: () => void }) => {
  const { paymentStatus, setPaymentStatus } = useCheckoutContext();
  const [error, setError] = useState("");
  const [countDown, setCountDown] = useState("5:00");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const finalizeSuccessPayment = async () => {
    await clearCart();
  }

  const manageInvoicePayment = async (status: PaymentStatus) => {
    setPaymentStatus(status);
    if (status === "PAID" || status === "FAILED") {
      setCountDown("0:00");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // this is not awaited so its non blocking for the parent function
      finalizeSuccessPayment();
    }
  }

  useCheckPayment({ orderId: data!.orderId, handleInvoiceStatus: manageInvoicePayment, stopChecking: paymentStatus !== "PENDING" });

  useEffect(() => {
    if (!data) return;
    if (intervalRef.current) {
      return;
    }
    intervalRef.current = setInterval(() => {
      const timeLeft = new Date(data.expiry).getTime() - new Date().getTime();
      const countDown = Math.floor(timeLeft / 1000);

      const countDownInMinutes = Math.floor(countDown / 60);
      const countDownInSeconds = countDown % 60;
      const countDownString = `${countDownInMinutes}:${countDownInSeconds}`;
      console.log({ countDownString });
      setCountDown(countDownString);

      if (countDown < 1) {
        setPaymentStatus("EXPIRED");
        setCountDown("0:00");
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [data]);

  if (!data) return null;
  const amount = data?.amountInTargetCurrency / NGN_PRECISION_UNITS;

  return (
    <div className="flex flex-col items-center gap-y-4 px-3 w-full">
      <div
        className={clsx(
          "flex-col items-center justify-center w-full gap-y-4",
          paymentStatus === "PENDING" ? "flex" : "hidden"
        )}
      >
        <div>
          <span className="text-secondary-black font-rebond font-light text-base">
            Invoice expires in{" "}
            <span className="font-medium">{countDown} minutes</span>
          </span>
          <div className="flex items-center justify-center w-full gap-x-2">
            <span className="text-secondary-black font-rebond font-light text-base">
              Amount:
            </span>
            <span className="text-secondary-black font-rebond font-medium text-base">
              NGN{" "}
              {amount.toLocaleString("en-NG", {
                minimumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
        <button
          className="flex items-center justify-center w-full border-none"
          onClick={() => handleCopyInvoice(data.invoice)}
        >
          <QRCode
            value={data.invoice}
            size={300}
            bgColor="#FFFFFF"
            fgColor="#000000"
            logoImage="/favicon-32x32.png"
            logoWidth={30}
            logoHeight={30}
            ecLevel="H"
            id="qr-code"
          />
        </button>
        <span className="text-secondary-black font-rebond font-light text-sm">
          Scan or Copy the QR code to pay
        </span>
        <button
          onClick={() => handleCopyInvoice(data.invoice)}
          className="text-secondary-black font-rebond font-light text-sm border border-secondary-gray bg-accent-gray p-1 md:p-2 rounded-md hover:bg-accent-green hover:border-primary-green"
        >
          {data.invoice?.slice(0, 15) +
            "..." +
            data.invoice?.slice(data.invoice?.length - 15)}
        </button>
      </div>

      <div
        className={`relative justify-center w-full text-secondary-black py-4 flex-col items-center ${
          paymentStatus === "PAID" && data.invoice ? "flex" : "hidden"
        }`}
      >
        <p className="text-center font-semibold text-xl">Payment Successful</p>
        <Image
          src={Checkmark}
          width={300}
          height={300}
          priority
          alt="successful payment"
        />
      </div>
      <div
        className={`relative justify-center w-full text-secondary-black py-4 flex-col gap-6 items-center ${
          paymentStatus === "EXPIRED" ? "flex" : "hidden"
        }`}
      >
        <p className="text-center font-semibold text-xl">Invoice Expired</p>
        <Image
          src={ErrorIcon}
          width={300}
          height={300}
          priority
          alt="failed payment"
        />
        <Button type="submit" className="w-full max-w-sm" onClick={retry}>
          Generate a new invoice
        </Button>
      </div>
    </div>
  );
};

export default Invoice;
