export function formatNaira(amount: number) {
  const n = new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
  return `₦${n}`
}

// New formatter: comma-grouped with 2 decimals and colon separator, e.g., ₦1,000:00
export function formatMoneyColon(amount: number, currency: "NGN" | "GHA" | "GB" = "NGN") {
  const symbol = currency === "NGN" ? "₦" : currency === "GHA" ? "₵" : "£"
  const formatted = new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  // Replace the decimal point with a colon at the end
  const colonized = formatted.replace(/\.(\d{2})$/, ":$1")
  return `${symbol}${colonized}`
}
