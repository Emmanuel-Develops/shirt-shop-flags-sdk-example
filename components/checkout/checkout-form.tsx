"use client";

import type React from "react";

import { useState } from "react";
import { Check, CreditCard, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Invoice from "../invoice";
import { toast } from "sonner";
import { handleCreateInvoice } from "@/lib/mavapay";
import { useCheckoutContext } from "../utils/checkout-context";

export function CheckoutForm() {
  const [step, setStep] = useState(1);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const { totalCost } = useCheckoutContext();

  const [paymentMethod, setPaymentMethod] = useState("mavapay");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    // setLoading(true);

    // // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1500));

    // setLoading(false);
    // router.push("/checkout/success");
  };

  const handlePayment = async () => {
    const invoice = await handleCreateInvoice(totalCost);
    console.log("invoice", invoice);
    if (invoice instanceof Error) {
      toast(`error creating invoice: ${invoice.message}`);
      return;
    }
    setInvoice(invoice);
    setStep(3);
    console.log(invoice);
  };

  return (
    <div className="mt-8 space-y-8">
      <div className="flex items-center space-x-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            step >= 1 ? "bg-primary text-primary-foreground" : "border"
          }`}
        >
          {step > 1 ? <Check className="h-4 w-4" /> : 1}
        </div>
        <div className="h-0.5 w-10 bg-muted"></div>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            step >= 2 ? "bg-primary text-primary-foreground" : "border"
          }`}
        >
          {step > 2 ? <Check className="h-4 w-4" /> : 2}
        </div>
        <div className="h-0.5 w-10 bg-muted"></div>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            step >= 3 ? "bg-primary text-primary-foreground" : "border"
          }`}
        >
          3
        </div>
      </div>

      {step === 1 && (
        // <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Package className="h-5 w-5" />
              Shipping Information
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="John" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" placeholder="Doe" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="123 Main St" required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Ikeja" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select required>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="la">Lagos</SelectItem>
                    <SelectItem value="abj">Abuja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" placeholder="94103" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select defaultValue="ng" required>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ng">Nigeria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(123) 456-7890"
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Shipping Method</Label>
              <RadioGroup defaultValue="standard" className="grid gap-3">
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label
                    htmlFor="standard"
                    className="flex flex-1 items-center justify-between font-normal"
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>Standard Shipping (3-5 business days)</span>
                    </div>
                    <span>NGN 500</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="express" id="express" disabled />
                  <Label
                    htmlFor="express"
                    className="flex flex-1 items-center justify-between font-normal"
                    aria-disabled="true"
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>Express Shipping (1-2 business days)</span>
                    </div>
                    <span>NGN 1299</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" onClick={() => setStep(2)}>
              Continue to Payment
            </Button>
          </div>
        // </form>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </h2>

          <Tabs
            defaultValue="mavapay"
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mavapay">MavaPay</TabsTrigger>
              <TabsTrigger value="paypal">PayPal</TabsTrigger>
            </TabsList>
            <TabsContent value="mavapay" className="space-y-6 pt-4">
              <div>
                <div className="pt-6 text-center">
                  <p className="mb-4">Enabling digital payments in africa</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="paypal" className="pt-4">
              <div>
                <div className="pt-6 text-center">
                  <p className="mb-4">Paypal is currently not available</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              type="button"
              disabled={paymentMethod != "mavapay"}
              className="flex-1 bg-green-600"
              onClick={async () => await handlePayment()}
            >
              Make Payment
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <Invoice data={invoice} retry={() => setStep(2)} />
      )}
    </div>
  );
}
