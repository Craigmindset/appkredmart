import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="w-full py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          {/* Left: Text */}
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ fontFamily: "Poppins, sans-serif", color: "#0F3D73" }}
            >
              About Us
            </h1>
            <p
              className="text-sm md:text-sm mb-8 text-justify"
              style={{ fontFamily: "sans-serif", color: "#000" }}
            >
              Kredmart is a modern e-commerce marketplace designed to make
              online shopping easier, fairer, and more accessible for everyone.
              We bring together a wide range of quality products, flexible
              credit options, and fast delivery, all backed by real human
              support.
              <br />
              <br />
              Built for everyday people and growing businesses, Kredmart is more
              than just a store; it is a smarter way to shop. Whether you are
              purchasing essentials, exploring new products, or scaling your
              business, we are here to ensure every experience feels simple,
              secure, and stress-free.
              <br />
              <br />
              At Kredmart, we believe shopping should work for you, with
              transparent prices, reliable service, and the freedom to buy now
              and pay later. Our goal is to empower individuals and businesses
              to get what they need, when they need it, without compromise.
              <br />
              <b>Kredmart — Smart shopping made simple.</b>
            </p>
            <button
              className="inline-flex items-center rounded-md bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              type="button"
            >
              Our Media File
            </button>
          </div>
          {/* Right: Image */}
          <div className="flex h-full w-full">
            <div className="relative h-full w-full rounded-xl overflow-hidden ">
              <Image
                src="/StoreBanner/kredmart-about.png"
                alt="About Kredmart"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
