import { Store, CreditCard, Truck, Headphones } from "lucide-react";

export default function OurStory() {
  return (
    <section className="w-full py-16 bg-[#D4AF37]">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="rounded-2xl shadow-lg bg-[#F4F6F8] p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left: Our Story */}
            <div>
              <h2
                className="text-xl text-center md:text-2xl font-bold mb-4"
                style={{ fontFamily: "Poppins, sans-serif", color: "#0F3D73" }}
              >
                Our Story
              </h2>
              <p
                className="text-gray-700 text-2sm leading-relaxed"
                style={{ fontFamily: "sans-serif" }}
              >
                We started Kredmart to solve two problems we kept seeing;
                getting the right products at fair prices, and paying for them
                without the usual friction.
                <br />
                <br />
                In many communities, great items exist but access and
                affordability do not always meet. Kredmart bridges that gap with
                a trusted marketplace and wallet credit that lets you buy now,
                pay over time responsibly.
              </p>
            </div>

            {/* Right: What We Do */}
            <div>
              <h2
                className="text-2xl text-center md:text-2xl font-bold mb-4"
                style={{ fontFamily: "Poppins, sans-serif", color: "#0F3D73" }}
              >
                What We Do
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Store className="w-6 h-6 text-[#D4AF37] mt-1" />
                  <div>
                    <h3
                      className=" text-lg md:text-xl font-semibold mb-0.5"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#0F3D73",
                      }}
                    >
                      Curated Marketplace
                    </h3>
                    <p
                      className="text-gray-600"
                      style={{ fontFamily: "sans-serif" }}
                    >
                      Electronics, fashion, home, beauty, and more from verified
                      sellers and brands.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-6 h-6 text-[#D4AF37] mt-1" />
                  <div>
                    <h3
                      className="text-lg font-semibold mb-0.5"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#0F3D73",
                      }}
                    >
                      Flexible Credit
                    </h3>
                    <p
                      className="text-gray-600"
                      style={{ fontFamily: "sans-serif" }}
                    >
                      Shop with Kredmart Wallet Credit and spread payments with
                      plans that fit your life.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="w-6 h-6 text-[#D4AF37] mt-1" />
                  <div>
                    <h3
                      className="text-lg font-semibold mb-0.5"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#0F3D73",
                      }}
                    >
                      Fast Fulfillment
                    </h3>
                    <p
                      className="text-gray-600"
                      style={{ fontFamily: "sans-serif" }}
                    >
                      Clear delivery timelines and real-time order updates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Headphones className="w-6 h-6 text-[#D4AF37] mt-1" />
                  <div>
                    <h3
                      className="text-lg font-semibold mb-0.5"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#0F3D73",
                      }}
                    >
                      Reliable Support
                    </h3>
                    <p
                      className="text-gray-600"
                      style={{ fontFamily: "sans-serif" }}
                    >
                      People-first help across chat, email, and phone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
