"use client";

import Image from "next/image";
import { useState } from "react";

const testimonials = [
  {
    name: "Chinedu Okafor",
    role: "Customer",
    avatar: "/Testimonial Images/customer6.jpg",
    text: "Absolutely love the quality and speed of delivery. Highly recommended!",
  },
  {
    name: "Mary Johnson",
    role: "Store Merchant",
    avatar: "/Testimonial Images/customer.jpg",
    text: "The platform makes selling easy and efficient. Great support team!",
  },
  {
    name: "Aisha Bello",
    role: "Repeat Customer",
    avatar: "/Testimonial Images/customer2.jpg",
    text: "Modern UI, fast checkout, and amazing deals. My go-to shop!",
  },
  {
    name: "Samuel Ade",
    role: "First-time Shopper",
    avatar: "/Testimonial Images/customer3.jpg",
    text: "Great experience from start to finish. Will shop again!",
  },
  {
    name: "Fatima Musa",
    role: "Loyal Customer",
    avatar: "/Testimonial Images/customer4.jpg",
    text: "Customer service is top-notch. Highly satisfied!",
  },
  {
    name: "Emeka Uzo",
    role: "Merchant Partner",
    avatar: "/Testimonial Images/customer5.jpg",
    text: "Easy platform to manage my store and reach new customers.",
  },
];

export default function TestimonialGrid() {
  const [slide, setSlide] = useState(0);
  const perPage = 3;
  const totalSlides = Math.ceil(testimonials.length / perPage);
  const startIdx = slide * perPage;
  const visibleTestimonials = testimonials.slice(startIdx, startIdx + perPage);

  const bgColors = ["bg-green-50", "bg-purple-50", "bg-yellow-50"];

  return (
    <section className="w-full max-w-5xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        What Our Customers Say
      </h2>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleTestimonials.map((t, idx) => (
            <div
              key={startIdx + idx}
              className={`${
                bgColors[(startIdx + idx) % bgColors.length]
              } rounded-xl shadow-md p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-95`}
            >
              <div className="w-14 h-14 mb-3 rounded-full overflow-hidden flex items-center justify-center">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
              <p className="text-gray-700 text-base mb-4 italic">
                <span className="text-xl text-red-500 mr-2">“</span>
                {t.text}
                <span className="text-xl text-red-500 ml-2">”</span>
              </p>
              <div className="mt-auto">
                <span className="font-semibold text-gray-900">{t.name}</span>
                <span className="block text-xs text-gray-500">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Navigation Arrows */}
        <button
          onClick={() =>
            setSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
          }
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Previous testimonials"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={() => setSlide((prev) => (prev + 1) % totalSlides)}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Next testimonials"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      {/* Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              slide === idx
                ? "bg-red-500 scale-110"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to testimonials slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
