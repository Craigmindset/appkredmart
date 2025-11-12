import { Target, Eye } from "lucide-react";

export default function MissionVision() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left Column: Mission & Vision */}
          <div className="flex flex-col gap-8">
            {/* Mission */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
                  <Target className="text-emerald-600 w-7 h-7" />
                </span>
                <h2
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "#0F3D73",
                  }}
                >
                  Our Mission
                </h2>
              </div>
              <p
                className="text-gray-700 text-2sm text-justify"
                style={{ fontFamily: "sans-serif" }}
              >
                Our mission is to make credit-powered shopping effortlessly
                accessible to everyone, anytime.
              </p>
            </div>

            {/* Vision */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100">
                  <Eye className="text-indigo-600 w-7 h-7" />
                </span>
                <h2
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "#0F3D73",
                  }}
                >
                  Our Vision
                </h2>
              </div>
              <p className="text-gray-700" style={{ fontFamily: "sans-serif" }}>
                To be a leading customer centric, credit marketplace.
              </p>
            </div>
          </div>

          {/* Right Column: Purpose */}

          {/* Purpose */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left h-full flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100">
                <Eye className="text-indigo-600 w-7 h-7" />
              </span>
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "Poppins, sans-serif", color: "#0F3D73" }}
              >
                Our Purpose
              </h2>
            </div>
            <p
              className="text-gray-700 max-w-md text-justify"
              style={{ fontFamily: "sans-serif" }}
            >
              Many buyers lose out on items because they can’t pay upfront or
              struggle with restricted access to affordable loans. <br />{" "}
              Kredmart fixes this by making access to lending a part of the
              shopping experience. Users may apply for credit, get accepted
              right away, and then use their Kredmart Wallet to buy
              things on the site.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
