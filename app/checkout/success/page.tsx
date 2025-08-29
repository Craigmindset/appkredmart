"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

let animationData: any;
if (typeof window !== "undefined") {
  animationData = require("../../../public/result page success motion design.json");
}

const Lottie = (props: any) => {
  const [LottieComponent, setLottieComponent] = useState<any>(null);
  useEffect(() => {
    import("lottie-react").then((mod) => setLottieComponent(() => mod.default));
  }, []);
  if (!LottieComponent) return null;
  return <LottieComponent {...props} />;
};

export default function CheckoutSuccess() {
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const orderId = searchParams?.get("orderId") || "";
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col items-center max-w-lg w-full">
        <div className="w-40 h-40 mb-6">
          <Lottie
            animationData={animationData}
            loop={false}
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-2 text-center">
          Payment Successful!
        </h1>
        <p className="text-gray-600 text-center mb-6">
          {`Thank you for your purchase. Your order${
            orderId ? ` ${orderId}` : ""
          } has been confirmed and a receipt has been sent to your email.`}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link href="/store" className="w-full">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all shadow">
              Continue Shopping
            </button>
          </Link>
          <Link href="/dashboard/my-orders" className="w-full">
            <button className="w-full bg-white border border-green-600 text-green-700 font-semibold py-3 rounded-lg transition-all shadow hover:bg-green-50">
              View Orders
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
