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
            <h3
              className="text-xl md:text-xl font-bold mb-2"
              style={{ fontFamily: "Poppins, sans-serif", color: "#0F3D73" }}
            >
              Hello and Welcome to Kredmart
            </h3>
            <p
              className="text-sm md:text-sm mb-8 text-justify"
              style={{ fontFamily: "sans-serif", color: "#000" }}
            >
              Kredmart is a cutting-edge e-commerce platform that offers
              consumers the ability to access lenders, allowing them to shop
              their preferred brands with ease and confidence at the most
              competitive market prices.
              <br />
              <br />
              Kredmart is not merely a store; it is a more intelligent shopping
              experience, designed for everyday individuals and expanding
              businesses. We are committed to ensuring that every experience is
              stress-free, secure, and straightforward, whether you are
              purchasing essentials, investigating new products, or
              scaling your business.
              <br />
            </p>
            <button
              className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              type="button"
            >
              Our Media File
            </button>
          </div>
          {/* Right: Image */}
          <div className="flex h-full w-full">
            <div className="relative h-full w-full rounded-xl overflow-hidden ">
              <Image
                src="/StoreBanner/about-kredmart.png"
                alt="About Kredmart"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
