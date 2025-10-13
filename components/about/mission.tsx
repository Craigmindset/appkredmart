import { Target, Eye } from "lucide-react";

export default function MissionVision() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
          {/* Mission */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left h-full flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
                <Target className="text-emerald-600 w-7 h-7" />
              </span>
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "Poppins, sans-serif", color: "#0F3D73" }}
              >
                Our Mission
              </h2>
            </div>
            <p
              className="text-gray-700 max-w-md text-2sm text-justify"
              style={{ fontFamily: "sans-serif" }}
            >
              Our mission is to make credit-powered shopping effortlessly
              accessible to everyone, anytime.
            </p>
          </div>

          {/* Vision */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left h-full flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100">
                <Eye className="text-indigo-600 w-7 h-7" />
              </span>
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "Poppins, sans-serif", color: "#0F3D73" }}
              >
                Our Vision
              </h2>
            </div>
            <p
              className="text-gray-700 max-w-md"
              style={{ fontFamily: "sans-serif" }}
            >
              To be Africa’s leading customer-centric, credit-powered
              e-commerce platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
