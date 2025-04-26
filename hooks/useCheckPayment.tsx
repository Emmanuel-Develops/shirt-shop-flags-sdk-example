import { getOrderById } from "@/lib/mavapay";
import { useEffect, useRef } from "react";

export const useCheckPayment = ({
  orderId,
  handleInvoiceStatus,
  stopChecking,
}: {
  orderId: string;
  handleInvoiceStatus: (status: "PAID" | "FAILED") => void;
  stopChecking: boolean;
}) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkForPayment = async (orderId: string) => {
    try {
      const order = await getOrderById(orderId);
      console.log({order})
      if (order instanceof Error) {
        return order;
      }
      if (order.status === "PAID") {
        handleInvoiceStatus(order.status);
        intervalRef.current && clearInterval(intervalRef.current);
      }
      if (order.status === "FAILED") {
        handleInvoiceStatus(order.status);
        intervalRef.current && clearInterval(intervalRef.current);
      }
      
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  useEffect(() => {
    if (stopChecking) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    if (intervalRef.current) {
      return;
    }
    intervalRef.current = setInterval(async () => {
      await checkForPayment(orderId);
    }, 3000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [orderId, stopChecking]);

};
