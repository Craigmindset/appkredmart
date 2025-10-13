import React from "react";

export default function WhyKredmart() {
  return (
    <section className="w-full py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-6"
              style={{ fontFamily: "Poppins, sans-serif", color: "#0F3D73" }}
            >
              Why Shop with Kredmart
            </h2>
            <div className="mb-6">
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: "#0F3D73" }}
              >
                Built on Trust
              </h3>
              <p className="text-sm text-gray-700 text-justify md:text-left">
                Every product and seller on KredMart goes through strict
                verification and quality checks. We guarantee authenticity and
                back every order with a clear, fair return policy so you can
                shop with complete confidence.
              </p>
            </div>
            <div className="mb-6">
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: "#0F3D73" }}
              >
                Your Security Comes First
              </h3>
              <p className="text-sm text-gray-700 text-justify md:text-left">
                We protect your data and payments with bank-level encryption and
                trusted payment gateways. Every transaction is safe, private,
                and verified.
              </p>
            </div>
            <div className="mb-6">
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: "#0F3D73" }}
              >
                Multiple Payment
              </h3>
              <p className="text-sm text-gray-700 text-justify md:text-left">
                Kredmart offers multiple payment solutions, including wallet
                backed loan payment.
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
              At KredMart, we understand how important trust is when choosing a
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
