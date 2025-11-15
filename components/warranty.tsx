"use client";
import React from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Warranty() {
  const router = useRouter();
  const handleClose = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  };
  return (
    <section className="max-w-2xl mx-auto px-4 py-10 relative">
      <button
        aria-label="Close"
        onClick={handleClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300"
      >
        <X className="h-5 w-5 text-gray-600" />
      </button>
      <h1 className="text-3xl text-left mt-10 md:text-3xl font-bold mb-6 text-[#0F3D73]">
        Warranty
      </h1>
      <h2 className="text-xl text-left md:text-2xl font-bold mb-4 text-[#0F3D73]">
        Kredmart Limited
      </h2>
      
      <div className="space-y-4 text-gray-700">
        <p className="font-semibold">Receipts must be presented</p>
        
        <p>
          PHONES, LAPTOPS AND ELECTRONICS with scratch, Liquid, or physical damage will not be accepted.
        </p>
        
        <p>
          PHONES, LAPTOPS AND ELECTRONICS BOX, with liquid damage or tear will not be accepted for swap.
        </p>
        
        <p>Warranty does not cover accessories</p>
        
        <p>
          PHONES, LAPTOPS AND ELECTRONICS can ONLY be swapped within 7 days of purchase if found faulty
        </p>
        
        <p>
          After 7 days of purchase, no device swap but faulty components only will be replaced through warranty.
        </p>
        
        <p>
          Device replacements are only open to devices that display a manufacturers defect or software issue within the FIRST 7 days of purchase.
        </p>
      </div>
    </section>
  );
}
