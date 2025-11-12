import React from "react";

export default function WhyKredmart() {
  return (
    <section
      className="w-full py-12 relative overflow-hidden"
      style={{ position: "relative" }}
    >
      {/* Background image with overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/bg-about.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
        }}
      />
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-6"
              style={{ fontFamily: "Poppins, sans-serif", color: "#0F3D73" }}
            >
              What We Offer
            </h2>
            <div className="mb-6">
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: "#0F3D73" }}
              >
                Top Deals & Trusted Products
              </h3>
              <p className="text-sm text-gray-700 text-justify md:text-left">
                Kredmart connects consumers to dependable merchants who offer
                unbeatable prices on a variety of products, including
                electronics, gadgets, fashion, and lifestyle items.
              </p>
            </div>
            <div className="mb-6">
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: "#0F3D73" }}
              >
                Wallet Loans
              </h3>
              <p className="text-sm text-gray-700 text-justify md:text-left">
                Instantly purchase using funds that have been deposited into
                your Kredmart Wallet and receive approval for flexible credit.
              </p>
            </div>
            <div className="mb-6">
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: "#0F3D73" }}
              >
                Various Payment Methods
              </h3>
              <p className="text-sm text-gray-700 text-justify md:text-left">
                Utilise your wallet balance, credit card, or secure payment
                gateways to make your payment, whichever method is most
                convenient for you.
              </p>
            </div>
            <div className="mb-6">
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: "#0F3D73" }}
              >
                Rapid Delivery
              </h3>
              <p className="text-sm text-gray-700 text-justify md:text-left">
                Our trusted logistics partners provide seamless
                nationwide delivery.
              </p>
            </div>
            <div className="mb-6">
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: "#0F3D73" }}
              >
                Merchant Support
              </h3>
              <p className="text-sm text-gray-700 text-justify md:text-left">
                Our  infrastructure enables merchants to access real-time
                dashboards, payment confirmation , and automated settlements.
              </p>
            </div>
          </div>
          {/* Right Column */}
          <div className="flex flex-col justify-center">
            {/* Divider for mobile only */}
            <hr className="block md:hidden border-t border-gray-300 mb-7" />
            <h2
              className="text-2xl md:text-3xl font-bold mb-3 md:mb-6"
              style={{ fontFamily: "Poppins, sans-serif", color: "#0F3D73" }}
            >
              For Sellers & Brands
            </h2>
            <h3
              className="text-xl md:text-2xl font-bold mb-1 mt-6"
              style={{ fontFamily: "Poppins, sans-serif", color: "#0F3D73" }}
            >
              Seller
            </h3>
            <p className="text-sm text-gray-800 text-justify md:text-left">
              Kredmart connects customers with verified merchants, offering
              flexible payment options and fast product delivery. All products
              are from authentic brands, ensuring high quality and exceptional
              service as promised
            </p>
            <h3
              className="text-xl md:text-2xl font-bold mb-1 mt-6"
              style={{ fontFamily: "Poppins, sans-serif", color: "#0F3D73" }}
            >
              Brands
            </h3>
            <p className="text-sm text-gray-800 text-justify md:text-left">
              At Kredmart, we understand how important trust is when choosing a
              product. That’s why we are committed to offering only authentic,
              high-quality products from verified brands you can rely on. Every
              item we sell meets strict quality standards to ensure you get
              exactly what you expect—no compromises. With us, you can shop with
              confidence, knowing that your satisfaction and experience are our
              top priorities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
