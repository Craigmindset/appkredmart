"use client";

export default function ThreeColumnAd() {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 p-6 justify-center">
      {/* First row */}
      <div className="flex flex-row gap-6 justify-center">
        <div
          className="group rounded-2xl shadow-lg overflow-hidden flex items-center justify-center"
          style={{ width: 300, height: 250 }}
        >
          <img
            src="/StoreBanner/kredmart-1 (3).png"
            alt="Ad banner 1"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
            }}
            className="group-hover:scale-110"
          />
        </div>
        <div
          className="group rounded-2xl shadow-lg overflow-hidden flex items-center justify-center"
          style={{ width: 300, height: 250 }}
        >
          <img
            src="/StoreBanner/kredmart-1 (2).png"
            alt="Ad banner 2"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
            }}
            className="group-hover:scale-110"
          />
        </div>
        <div
          className="group rounded-2xl shadow-lg overflow-hidden flex items-center justify-center"
          style={{ width: 450, height: 250 }}
        >
          <img
            src="/StoreBanner/kredmart-1 (1).png"
            alt="Ad banner 3"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
            }}
            className="group-hover:scale-110"
          />
        </div>
      </div>
      {/* Second row */}
      <div className="flex flex-row gap-6 justify-center">
        <div
          className="group rounded-2xl shadow-lg overflow-hidden flex items-center justify-center"
          style={{ width: 450, height: 280 }}
        >
          <img
            src="/StoreBanner/kredmart-img (2).png"
            alt="Ad banner 4"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
            }}
            className="group-hover:scale-110"
          />
        </div>
        <div
          className="group rounded-2xl shadow-lg overflow-hidden flex items-center justify-center"
          style={{ width: 300, height: 280 }}
        >
          <img
            src="/StoreBanner/kredmart-img (1).png"
            alt="Ad banner 5"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
            }}
            className="group-hover:scale-110"
          />
        </div>
        <div
          className="group rounded-2xl shadow-lg overflow-hidden flex items-center justify-center"
          style={{ width: 300, height: 280 }}
        >
          <img
            src="/StoreBanner/kredmart-img (3).png"
            alt="Ad banner 6"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
            }}
            className="group-hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
}
