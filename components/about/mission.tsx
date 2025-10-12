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
                className="text-2xl font-bold"
                style={{ fontFamily: "Poppins, sans-serif", color: "#0F3D73" }}
              >
                Our Mission
              </h2>
            </div>
            <p
              className="text-gray-700 max-w-md text-2sm text-justify"
              style={{ fontFamily: "sans-serif" }}
            >
              To empower commerce and enrich lives by connecting buyers and
              sellers with trust, speed, and innovation. We strive to make
              shopping seamless and rewarding for everyone, leveraging
              technology to transform everyday experiences and put people first.
            </p>
          </div>

          {/* Vision */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left h-full flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100">
                <Eye className="text-indigo-600 w-7 h-7" />
              </span>
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: "Poppins, sans-serif", color: "#0F3D73" }}
              >
                Our Vision
              </h2>
            </div>
            <p
              className="text-gray-700 max-w-md"
              style={{ fontFamily: "sans-serif" }}
            >
              To be the leading platform for modern shopping, fostering a
              community where innovation, flexibility, and customer satisfaction
              drive growth and opportunity for all.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
