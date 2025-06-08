"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import request from "../_utils/request";
import { useEffect } from "react";

const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(false);
    document.body.appendChild(script);
  });
};

export function usePurchase() {
  const router = useRouter();

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const verifyOrder = async (
    orderCreationId,
    paymentId,
    signature,
    redirectUrl
  ) => {
    const res = await fetch("/api/verify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderCreationId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
      }),
    }).then((res) => res.json());

    if (res.success) {
      router.push(redirectUrl);
      toast.success(res.message || "Payment successful!");
    } else {
      toast.error(res.message || "Verification failed.");
    }
  };

  const initiatePurchase = async ({
    courseID = null,
    cartID = null,
    redirectTo = "/",
  }) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load Razorpay. Please try again.");
      return;
    }

    if (!cartID && !courseID) {
      toast.error("No courses or cart selected.");
      return;
    }

    const payload = cartID ? { cart_id: cartID } : { course_id: courseID };

    const orderResponse = await request("/api/order", {
      method: "POST",
      body: payload,
    });

    const { success, message } = orderResponse;
    const { order_id, amount } = orderResponse.data;

    if (!success) {
      toast.error(message || "Failed to create order.");
      return;
    }
    console.log(orderResponse)

    if(!orderResponse?.data?.order_id){
      toast.success(message || "Course enrolled successfully.");
      return;
    }

    const { email, phone, name } = await await request("/api/user-detail");
    if(!email || !phone || !name){
      toast.error("Please try again");
      console.error("Failed to retrieve user details.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount,
      currency: "INR",
      name: "LumiEd",
      description: "Course Purchase",
      order_id,
      prefill: { name, email, contact: phone },
      handler: (response) => {
        verifyOrder(
          order_id,
          response.razorpay_payment_id,
          response.razorpay_signature,
          redirectTo
        );
      },
    };

    const razor = new window.Razorpay(options);
    razor.on("payment.failed", (err) => {
      toast.error(err.error.description);
    });
    razor.open();
  };

  return { initiatePurchase };
}
