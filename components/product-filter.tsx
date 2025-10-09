"use client";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const BRANDS = [
  "APPLE",
  "Samsung",
  "JBL",
  "Sony",
  "HP",
  "Dell",
  "Nike",
  "Adidas",
  "Canon",
  "Infinix",
  "Tecno",
  "Oraimo",
];
const COLORS = [
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Blue",
  "Purple",
  "Pink",
  "Brown",
  "Black",
  "White",
  "Gray",
  "Cyan",
];

type FilterState = {
  brand: string;
  price: string;
  color: string;
  dealsOnly: boolean;
};
type ProductFilterProps = FilterState & {
  onChange?: (state: FilterState) => void;
};

const colorHex: Record<string, string> = {
  Red: "#EF4444",
  Orange: "#F97316",
  Yellow: "#F59E0B",
  Green: "#10B981",
  Blue: "#3B82F6",
  Purple: "#8B5CF6",
  Pink: "#EC4899",
  Brown: "#8B5E3C",
  Black: "#111827",
  White: "#FFFFFF",
  Gray: "#9CA3AF",
  Cyan: "#06B6D4",
};

export default function ProductFilter({
  brand,
  price,
  color,
  dealsOnly,
  onChange,
}: ProductFilterProps) {
  const [openColors, setOpenColors] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);

  const emit = (next: FilterState) => onChange?.(next);
  const handleChange = (field: keyof FilterState, value: string | boolean) =>
    emit({ brand, price, color, dealsOnly, [field]: value } as FilterState);
  const reset = () =>
    emit({ brand: "all", price: "none", color: "", dealsOnly: false });

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!colorRef.current?.contains(e.target as Node)) setOpenColors(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="w-full bg-black/5 py-0">
      {/* container */}
      <div
        className="
          w-screen max-w-none flex flex-col gap-6 px-4 py-0 bg-[#d3e7f6]
          md:flex-row md:flex-wrap md:items-center md:gap-x-10 md:gap-y-3 md:px-4 md:py-3 border-[#0F3D73] border-b-2
          relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
        "
      >
        {/* gold tag */}
        <div className="hidden md:flex h-10 shrink-0 items-center rounded-r-xl bg-[#d4af37] px-8 py-2 text-lg font-semibold text-white">
          Filter
        </div>

        {/* BRAND */}
        <div className="min-w-0 flex w-full flex-col md:w-auto md:flex-row md:items-center md:gap-3">
          <Label
            htmlFor="brand-select"
            className="mb-1 text-sm font-medium text-[#2b0f0f] md:mb-0"
            style={{ fontFamily: "sans-serif" }}
          >
            Brand
          </Label>
          <Select value={brand} onValueChange={(v) => handleChange("brand", v)}>
            <SelectTrigger
              id="brand-select"
              className="
                h-8 w-full md:max-w-[440px] rounded-full border border-black/15 pl-8 pr-8 text-xs
                focus:ring-0 focus:ring-offset-0
              "
            >
              <SelectValue placeholder="All brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All brands</SelectItem>
              {BRANDS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* PRICING */}
        <div className="min-w-0 flex w-full flex-col md:w-auto md:flex-row md:items-center md:gap-3">
          <Label
            htmlFor="price-select"
            className="mb-1 text-sm font-medium text-[#2b0f0f] md:mb-0"
            style={{ fontFamily: "sans-serif" }}
          >
            Pricing
          </Label>
          <Select value={price} onValueChange={(v) => handleChange("price", v)}>
            <SelectTrigger
              id="price-select"
              className="
                h-8 w-full md:max-w-[440px] rounded-full border border-black/15 pl-8 pr-8 text-xs
                focus:ring-0 focus:ring-offset-0
              "
            >
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Default</SelectItem>
              <SelectItem value="low-high">Low to High</SelectItem>
              <SelectItem value="high-low">High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* COLOR */}
        <div
          className="min-w-0 flex w-full flex-col md:w-auto md:flex-row md:items-center md:gap-3"
          ref={colorRef}
        >
          <span
            className="mb-1 text-sm font-medium text-[#2b0f0f] md:mb-0"
            style={{ fontFamily: "sans-serif" }}
          >
            Color
          </span>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={openColors}
            onClick={() => setOpenColors((o) => !o)}
            className="
              relative h-8 w-full md:max-w-[440px] rounded-full border border-black/15 bg-white pl-8 pr-8 text-left text-xs text-gray-900
              focus:outline-none
            "
          >
            {color || "Default"}
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {openColors && (
            <div
              role="listbox"
              className="
                absolute left-1/2 top-[125%] z-50 w-[min(94vw,600px)] -translate-x-1/2 rounded-full bg-[#E6E7EA] px-3 py-2 shadow-md ring-1 ring-black/10
                md:left-auto md:right-auto md:translate-x-0 md:max-w-[480px]
              "
            >
              <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {/* Default */}
                <button
                  title="Default"
                  role="option"
                  aria-selected={color === ""}
                  onClick={() => {
                    handleChange("color", "");
                    setOpenColors(false);
                  }}
                  className={`grid h-7 w-7 place-items-center rounded-full border transition ${
                    color === "" ? "border-[#0F3D73]" : "border-transparent"
                  }`}
                >
                  <span className="block h-3.5 w-3.5 rounded-full border bg-gradient-to-br from-gray-100 to-gray-200" />
                </button>
                {COLORS.map((c) => {
                  const hex = colorHex[c] ?? c.toLowerCase();
                  const selected = color === c;
                  return (
                    <button
                      key={c}
                      title={c}
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        handleChange("color", c);
                        setOpenColors(false);
                      }}
                      className={`grid h-7 w-7 place-items-center rounded-full border transition ${
                        selected ? "border-[#0F3D73]" : "border-transparent"
                      }`}
                    >
                      <span
                        className="block h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* DEALS + RESET */}
        <div className="flex w-full items-center justify-between md:ml-auto md:w-auto md:justify-start md:gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#2b0f0f]">
              Deals Only
            </span>
            <Switch
              id="deals-switch"
              checked={dealsOnly}
              onCheckedChange={(v) => handleChange("dealsOnly", v)}
              className="h-6 w-11 border-0 data-[state=unchecked]:bg-gray-300 data-[state=checked]:bg-[#B8C2CF] focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={reset}
            className="ml-4 mr-4 md:mr-8 text-sm font-semibold text-[#EB3B3B] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
