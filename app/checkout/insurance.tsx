import { useCallback } from "react";
import { Info, X } from "lucide-react";

export type InsuranceOption = {
  id: string;
  label: string; // e.g. "₦5,000"
  price: number; // e.g. 5000
  description: string; // e.g. "1 year Screen & Water Protection (claim ₦50,000)"
  claim: string; // e.g. "₦50,000"
};

export const insuranceOptions: InsuranceOption[] = [
  {
    id: "cover50k",
    label: "₦5,000",
    price: 5000,
    description: "1 year Screen & Water Protection",
    claim: "₦50,000",
  },
  {
    id: "cover100k",
    label: "₦10,000",
    price: 10000,
    description: "1 year Screen & Water Protection",
    claim: "₦100,000",
  },
];

export default function Insurance({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string | null, price: number) => void;
}) {
  const toggle = useCallback(
    (id: string, price: number) => {
      if (selected === id)
        onSelect(null, 0); // deselect if clicking the active one
      else onSelect(id, price);
    },
    [selected, onSelect]
  );

  return (
    <section className="bg-white rounded-xl border shadow-sm p-4 mt-4">
      <div
        role="radiogroup"
        aria-label="Device protection options"
        className="flex flex-col gap-3"
      >
        {insuranceOptions.map((option) => {
          const active = selected === option.id;

          return (
            <div
              key={option.id}
              className={`relative border rounded-lg transition
                  ${
                    active
                      ? "border-[#466cf4] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }
                  ${option.id === "cover50k" ? "bg-green-50" : ""}
                  ${option.id === "cover100k" ? "bg-blue-50" : ""}
                  ${active ? "ring-2 ring-[#466cf4]" : ""}
                `}
            >
              {/* Clickable/keyboard-focusable option */}
              <button
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => toggle(option.id, option.price)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    toggle(option.id, option.price);
                  }
                }}
                className="w-full text-left px-3 py-2 flex items-start gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#466cf4] rounded-lg"
              >
                {/* Custom radio indicator */}
                <span
                  className={`mt-1 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    active ? "border-[#466cf4]" : "border-gray-300"
                  }`}
                  aria-hidden="true"
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      active ? "bg-[#466cf4]" : "bg-transparent"
                    }`}
                  />
                </span>

                <span className="flex-1">
                  <span className="font-medium text-sm">{option.label}</span>
                  <span className="mt-0.5 block text-xs text-gray-600">
                    {option.description}
                    <Info
                      className="inline-block ml-1 h-3.5 w-3.5 text-gray-400 align-middle"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </button>

              {/* Close (clear) icon — only visible when selected */}
              {active && (
                <button
                  type="button"
                  aria-label="Remove insurance"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(null, 0);
                  }}
                  className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/60"
                >
                  <X className="h-3.5 w-3.5 text-gray-600" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Optional hidden inputs if you need to submit via HTML forms */}
      {/* <input type="hidden" name="insuranceId" value={selected ?? ""} />
      <input
        type="hidden"
        name="insurancePrice"
        value={
          selected
            ? insuranceOptions.find((o) => o.id === selected)?.price ?? 0
            : 0
        }
      /> */}
    </section>
  );
}
