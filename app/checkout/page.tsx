"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  Wallet,
  Shield,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart, cartSelectors } from "@/store/cart-store";
import { useAuth } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import Header from "@/components/site-header";

// --- Data --------------------------------------------------------------------
const landmarkAddresses = [
  "ABUJA 1 BRANCH - Suite c16/17 New Bannex Plaza, Aminu Kano Crescent, Wuse 2, Abuja, NG",
  "Ikeja - Medical Rd - NO 2B Medical Road, Ikeja, Lagos, NG",
  "OPEBI BRANCH - No 19 Opebi Road, Awosika B/Stop, Ikeja, Lagos, NG",
  "COMPUTER VILLAGE BRANCH - 15/19 Ola-Ayeni Street, Ikeja, Lagos, NG",
  "IKEJA CITY MALL BRANCH - Alausa, Ikeja, Lagos, NG",
  "VICTORIA ISLAND 1 - 13A Saka Tinubu Street, Victoria Island, Lagos, NG",
  "VICTORIA ISLAND 2 - 1296 Akin Adesola Street, VI, Lagos, NG",
  "EGBEDA AKOWONJO BRANCH - 39 Shasha Road, Akowonjo-Egbeda, Lagos, NG",
  "SURULERE BRANCH - 67 Adeniran Ogunsanya Street, Surulere, Lagos, NG",
  "OKOTA BRANCH - 160 Okota Road, Cele Bus-Stop, Lagos, NG",
  "ABUJA 2 BRANCH - Plot 466, Ahmadu Bello Way, Garki, Beside Eddy-Vic Hotel, Abuja, NG",
  "BENIN BRANCH 1 - 89 Ekenwan Road, Beside UBA, Benin City, BENIN, NG",
  "BENIN BRANCH 2 - 70 Airport Road, By Akenzua Junction, Benin City, BENIN, NG",
  "OYINGBO EBUTE META BRANCH - 73 Murtala Muhammed Way, Oyingbo, Lagos, NG",
  "AJAH BRANCH - Berger Bus Stop, Ajah, Lagos, NG",
  "AJAH BRANCH 2 - No 1A Addo Road, Ajah, Lagos, NG",
];

const bnplDurations = [
  { id: "3months", label: "3 Months", interestRate: 5, monthlyFee: 2.5 },
  { id: "6months", label: "6 Months", interestRate: 8, monthlyFee: 2.0 },
  { id: "12months", label: "12 Months", interestRate: 12, monthlyFee: 1.5 },
  { id: "24months", label: "24 Months", interestRate: 18, monthlyFee: 1.0 },
];

const loanProviders = [
  {
    id: "creditloan",
    name: "CreditLoan",
    logo: "/placeholder.svg?height=40&width=120",
    maxAmount: 50000,
    interestRate: 12,
    processingTime: "5 minutes",
    features: ["Instant approval", "No collateral", "Flexible repayment"],
  },
  {
    id: "renmoney",
    name: "RenMoney",
    logo: "/placeholder.svg?height=40&width=120",
    maxAmount: 30000,
    interestRate: 15,
    processingTime: "10 minutes",
    features: ["Quick disbursement", "Low interest", "24/7 support"],
  },
  {
    id: "fairloan",
    name: "FairLoan",
    logo: "/placeholder.svg?height=40&width=120",
    maxAmount: 75000,
    interestRate: 10,
    processingTime: "3 minutes",
    features: ["Best rates", "Instant approval", "No hidden fees"],
  },
];

// --- Helpers -----------------------------------------------------------------
const money = (n: number) =>
  `₦${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// --- Page --------------------------------------------------------------------
export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuth((s) => s.user);

  // Guest checkout logic
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  // Prefill delivery info for logged-in users
  useEffect(() => {
    if (user) {
      setGuestInfo((info) => ({
        ...info,
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      }));
    }
  }, [user]);

  // Show guest modal for non-logged-in users
  useEffect(() => {
    if (!user && !guestMode) {
      setShowGuestModal(true);
    } else {
      setShowGuestModal(false);
    }
  }, [user, guestMode]);

  // Payment methods available
  const paymentMethods =
    user || guestMode ? ["paystack", "bnpl", "wallet"] : ["paystack"];
  const cartCount = useCart(cartSelectors.count);
  const cartItems = useCart((state) => state.items);
  const getCartTotal = useCart(cartSelectors.total);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "paystack" | "bnpl" | "wallet"
  >("paystack");
  const [selectedBnplDuration, setSelectedBnplDuration] = useState("6months");
  const [selectedLoanProvider, setSelectedLoanProvider] =
    useState("creditloan");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSummaryMobile, setShowSummaryMobile] = useState(false);

  // Contact/Delivery info (compact)
  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
  });

  // Totals
  const subtotal = getCartTotal;
  const vat = subtotal * 0.075;
  const delivery = 0;
  const total = subtotal + vat + delivery;

  const calculateBnplPayment = () => {
    const duration = bnplDurations.find((d) => d.id === selectedBnplDuration);
    if (!duration) return 0;
    const months = Number.parseInt(duration.id.replace("months", ""));
    const interestAmount = (total * duration.interestRate) / 100;
    const totalWithInterest = total + interestAmount;
    return totalWithInterest / months;
  };

  // Show Delivery form for BNPL & Wallet; Paystack needs only email (and phone for receipts)
  const requiresDeliveryForm =
    selectedPaymentMethod === "bnpl" || selectedPaymentMethod === "wallet";

  // Sync form reveal (legacy behavior simplified)
  useEffect(() => {
    // No-op: UI now conditionally renders instead of toggling another state
  }, [selectedPaymentMethod]);

  const handleGuestInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setGuestInfo((p) => ({ ...p, [name]: value }));
  };

  // --- Payment flows (as in your code) --------------------------------------
  const processPaystackPayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total * 100,
          email: guestInfo.email || "user@example.com",
          metadata: { cartItems, customerInfo: guestInfo },
        }),
      });
      const data = await response.json();
      if (data.status) window.location.href = data.data.authorization_url;
    } catch (error) {
      console.error("Paystack payment error:", error);
      alert("Payment initialization failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const processBnplPayment = async () => {
    if (!isFormValid()) {
      alert("Please fill in all required information.");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await fetch("/api/payments/bnpl/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          duration: selectedBnplDuration,
          customerInfo: guestInfo,
          cartItems,
          monthlyPayment: calculateBnplPayment(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = `/checkout/bnpl-confirmation?orderId=${data.orderId}`;
      }
    } catch (error) {
      console.error("BNPL payment error:", error);
      alert("BNPL setup failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const processWalletLoan = async () => {
    if (!isFormValid()) {
      alert("Please fill in all required information.");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await fetch("/api/payments/wallet-loan/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          provider: selectedLoanProvider,
          customerInfo: guestInfo,
          cartItems,
        }),
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = `/checkout/loan-approval?applicationId=${data.applicationId}`;
      }
    } catch (error) {
      console.error("Wallet loan error:", error);
      alert("Loan application failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    switch (selectedPaymentMethod) {
      case "paystack":
        return processPaystackPayment();
      case "bnpl":
        return processBnplPayment();
      case "wallet":
        return processWalletLoan();
      default:
        alert("Please select a payment method.");
    }
  };

  // ✅ Fixed: validation now matches the UI
  const isFormValid = () => {
    if (selectedPaymentMethod === "paystack") {
      return Boolean(guestInfo.email);
    }
    // BNPL & Wallet need full delivery info
    return (
      guestInfo.firstName &&
      guestInfo.lastName &&
      guestInfo.email &&
      guestInfo.phone &&
      guestInfo.address &&
      guestInfo.city &&
      guestInfo.state
    );
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <Link href="/">
            <Button className="bg-[#466cf4] hover:bg-[#3a5ce0]">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Guest Modal */}
      {showGuestModal && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-xs w-full text-center">
            <h2 className="text-lg font-bold mb-4">
              Continue as Guest or Register
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              To access all payment options, please register or sign in. You can
              also checkout as a guest with Paystack.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  setGuestMode(true);
                  setShowGuestModal(false);
                  setSelectedPaymentMethod("paystack");
                }}
              >
                Continue as Guest
              </Button>
              <Button
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900"
                onClick={() => router.push("/sign-up")}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {/* Top bar */}
        <div className="flex items-center gap-2 mb-4">
          <Link href="/cart" className="text-[#466cf4] hover:text-[#3a5ce0]">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Checkout
          </h1>
        </div>

        {/* Mobile order summary toggle */}
        <div className="lg:hidden mb-3">
          <button
            onClick={() => setShowSummaryMobile((s) => !s)}
            className="w-full flex items-center justify-between rounded-md bg-white border px-3 py-2 text-sm"
          >
            <span className="font-medium">Order Summary</span>
            {showSummaryMobile ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {showSummaryMobile && (
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              vat={vat}
              total={total}
              selectedPaymentMethod={selectedPaymentMethod}
              selectedBnplDuration={selectedBnplDuration}
              calculateBnplPayment={calculateBnplPayment}
              selectedLoanProvider={selectedLoanProvider}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-4">
            {/* Delivery Information always for Paystack, BNPL, Wallet */}
            {(selectedPaymentMethod === "paystack" || requiresDeliveryForm) && (
              <section className="bg-white rounded-xl border shadow-sm p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">
                  Delivery Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Email field always present and required */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input
                      name="email"
                      value={guestInfo.email}
                      onChange={handleGuestInfoChange}
                      placeholder="you@email.com"
                      className="h-10 text-sm"
                      required
                    />
                  </div>
                  {/* ...existing delivery fields... */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <Input
                      name="firstName"
                      value={guestInfo.firstName}
                      onChange={handleGuestInfoChange}
                      placeholder="First name"
                      className="h-10 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <Input
                      name="lastName"
                      value={guestInfo.lastName}
                      onChange={handleGuestInfoChange}
                      placeholder="Last name"
                      className="h-10 text-sm"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <Input
                      name="address"
                      value={guestInfo.address}
                      onChange={handleGuestInfoChange}
                      placeholder="Street address"
                      className="h-10 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <Input
                      name="city"
                      value={guestInfo.city}
                      onChange={handleGuestInfoChange}
                      placeholder="City"
                      className="h-10 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      name="state"
                      value={guestInfo.state}
                      onChange={handleGuestInfoChange}
                      placeholder="State"
                      list="states"
                      className="h-10 text-sm border rounded-md px-3 w-full"
                      required
                    />
                    <datalist id="states">
                      <option value="Abia" />
                      <option value="Adamawa" />
                      <option value="Akwa Ibom" />
                      <option value="Anambra" />
                      <option value="Bauchi" />
                      <option value="Bayelsa" />
                      <option value="Benue" />
                      <option value="Borno" />
                      <option value="Cross River" />
                      <option value="Delta" />
                      <option value="Ebonyi" />
                      <option value="Edo" />
                      <option value="Ekiti" />
                      <option value="Enugu" />
                      <option value="FCT" />
                      <option value="Gombe" />
                      <option value="Imo" />
                      <option value="Jigawa" />
                      <option value="Kaduna" />
                      <option value="Kano" />
                      <option value="Katsina" />
                      <option value="Kebbi" />
                      <option value="Kogi" />
                      <option value="Kwara" />
                      <option value="Lagos" />
                      <option value="Nasarawa" />
                      <option value="Niger" />
                      <option value="Ogun" />
                      <option value="Ondo" />
                      <option value="Osun" />
                      <option value="Oyo" />
                      <option value="Plateau" />
                      <option value="Rivers" />
                      <option value="Sokoto" />
                      <option value="Taraba" />
                      <option value="Yobe" />
                      <option value="Zamfara" />
                    </datalist>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nearest Landmark
                    </label>
                    <select
                      name="landmark"
                      value={guestInfo.landmark}
                      onChange={handleGuestInfoChange}
                      className="h-10 text-sm border rounded-md px-3 bg-white w-full focus:outline-none focus:ring-2 focus:ring-[#466cf4]"
                    >
                      <option value="">Select Nearest Landmark</option>
                      {landmarkAddresses.map((address, idx) => {
                        const match = address.match(
                          /^(.*?)\s*-\s*(.*?)(,\s*([A-Za-z ]+),\s*NG)?$/
                        );
                        let label = address;
                        if (match) {
                          label = match[1];
                          if (match[4]) label += ` (${match[4]})`;
                        }
                        return (
                          <option key={idx} value={address} title={address}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </section>
            )}

            {/* Payment Method (compact, modern cards) */}
            <section className="bg-white rounded-xl border shadow-sm p-4">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Payment
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {paymentMethods.includes("paystack") && (
                  <PaymentCard
                    active={selectedPaymentMethod === "paystack"}
                    onClick={() => setSelectedPaymentMethod("paystack")}
                    icon={<CreditCard className="h-5 w-5" />}
                    title="Pay Now"
                    subtitle="Paystack"
                    color="blue"
                  />
                )}
                {paymentMethods.includes("bnpl") && (
                  <PaymentCard
                    active={selectedPaymentMethod === "bnpl"}
                    onClick={() => setSelectedPaymentMethod("bnpl")}
                    icon={<Calendar className="h-5 w-5" />}
                    title="BNPL"
                    subtitle="Pay monthly"
                    color="green"
                  />
                )}
                {paymentMethods.includes("wallet") && (
                  <PaymentCard
                    active={selectedPaymentMethod === "wallet"}
                    onClick={() => setSelectedPaymentMethod("wallet")}
                    icon={<Wallet className="h-5 w-5" />}
                    title="Wallet Loan"
                    subtitle="Instant loan"
                    color="purple"
                  />
                )}
              </div>

              {/* BNPL inline options */}
              {selectedPaymentMethod === "bnpl" && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Select duration</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {bnplDurations.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedBnplDuration(d.id)}
                        className={`border rounded-lg px-2 py-2 text-sm text-left transition
                          ${
                            selectedBnplDuration === d.id
                              ? "border-[#466cf4] bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <div className="font-medium">{d.label}</div>
                        <div className="text-xs text-gray-600">
                          {d.interestRate}% interest
                        </div>
                        <div className="text-xs font-semibold text-[#466cf4]">
                          {money(calculateBnplPayment())}/mo
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wallet providers */}
              {selectedPaymentMethod === "wallet" && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Choose provider</h4>
                  <div className="space-y-2">
                    {loanProviders.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedLoanProvider(p.id)}
                        className={`w-full border rounded-lg p-3 text-left transition
                          ${
                            selectedLoanProvider === p.id
                              ? "border-[#466cf4] bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Image
                              src={p.logo || "/placeholder.svg"}
                              alt={p.name}
                              width={60}
                              height={30}
                              className="h-6 w-auto object-contain"
                            />
                            <div>
                              <div className="text-sm font-semibold">
                                {p.name}
                              </div>
                              <div className="text-xs text-gray-600">
                                Up to {money(p.maxAmount)} • {p.interestRate}%
                                interest
                              </div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-green-600">
                            {p.processingTime}
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {p.features.map((f, i) => (
                            <span
                              key={i}
                              className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Notices */}
            {selectedPaymentMethod === "bnpl" && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
                <div className="flex items-start gap-1.5">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-medium">BNPL Terms</p>
                    <ul className="list-disc list-inside space-y-0.5 mt-1">
                      <li>Account creation required</li>
                      <li>Credit check may be performed</li>
                      <li>Late payment fees may apply</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {selectedPaymentMethod === "wallet" && (
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 text-xs text-purple-800">
                <div className="flex items-start gap-1.5">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Loan Requirements</p>
                    <ul className="list-disc list-inside space-y-0.5 mt-1">
                      <li>Valid ID and BVN required</li>
                      <li>Minimum age: 18 years</li>
                      <li>Credit assessment will be conducted</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Pay button */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handlePayment}
                disabled={isProcessing || !isFormValid()}
                className="w-full bg-[#466cf4] hover:bg-[#3a5ce0] text-white h-10 text-sm font-semibold"
              >
                {isProcessing
                  ? "Processing..."
                  : selectedPaymentMethod === "paystack"
                  ? "Pay Now"
                  : selectedPaymentMethod === "bnpl"
                  ? "Setup BNPL"
                  : "Apply for Loan"}
              </Button>
              <div className="hidden sm:flex items-center justify-center gap-1 text-[11px] text-gray-600">
                <Shield className="h-3.5 w-3.5" />
                <span>Secure & encrypted</span>
              </div>
            </div>
          </div>

          {/* Right: Order Summary (sticky on desktop) */}
          <aside className="hidden lg:block">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              vat={vat}
              total={total}
              selectedPaymentMethod={selectedPaymentMethod}
              selectedBnplDuration={selectedBnplDuration}
              calculateBnplPayment={calculateBnplPayment}
              selectedLoanProvider={selectedLoanProvider}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

// --- UI Partials -------------------------------------------------------------
function PaymentCard({
  active,
  onClick,
  icon,
  title,
  subtitle,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: "blue" | "green" | "purple";
}) {
  const colorMap: Record<typeof color, string> = {
    blue: "text-[#466cf4]",
    green: "text-green-600",
    purple: "text-purple-600",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border rounded-xl p-3 text-left transition group
      ${
        active
          ? "border-[#466cf4] bg-blue-50"
          : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${active ? "border-[#466cf4] bg-[#466cf4]" : "border-gray-300"}`}
        >
          {active && <Check className="h-3 w-3 text-white" />}
        </div>
        <div className={`shrink-0 ${colorMap[color]}`}>{icon}</div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-gray-600">{subtitle}</div>
        </div>
      </div>
    </button>
  );
}

function OrderSummary({
  cartItems,
  subtotal,
  vat,
  total,
  selectedPaymentMethod,
  selectedBnplDuration,
  calculateBnplPayment,
  selectedLoanProvider,
}: {
  cartItems: any[];
  subtotal: number;
  vat: number;
  total: number;
  selectedPaymentMethod: "paystack" | "bnpl" | "wallet";
  selectedBnplDuration: string;
  calculateBnplPayment: () => number;
  selectedLoanProvider: string;
}) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 sticky top-4">
      <h2 className="text-base font-semibold text-gray-900 mb-3">
        Order Summary
      </h2>

      {/* Items */}
      <div className="space-y-2 mb-3 max-h-56 overflow-y-auto pr-1">
        {cartItems.map((item: any) => (
          <div key={item.product.id} className="flex items-center gap-3">
            <Image
              src={item.product.image || "/placeholder.svg"}
              alt={item.product.title}
              width={60}
              height={60}
              className="w-14 h-14 object-cover rounded-md"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {item.product.title}
              </h4>
              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
            </div>
            <span className="text-sm font-semibold">
              ₦{(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-2 mb-3 border-t pt-2">
        <Row label="Subtotal" value={`₦${subtotal.toFixed(2)}`} />
        <Row
          label="Delivery"
          value={<span className="text-green-600 font-semibold">Free</span>}
        />
        <Row label="VAT" value={`₦${vat.toFixed(2)}`} />

        {selectedPaymentMethod === "bnpl" && (
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <Row
              label="Monthly Payment"
              value={`₦${calculateBnplPayment().toFixed(2)}`}
              tight
            />
            <Row
              label="Duration"
              value={
                bnplDurations.find((d) => d.id === selectedBnplDuration)
                  ?.label ?? ""
              }
              tight
            />
          </div>
        )}

        {selectedPaymentMethod === "wallet" && (
          <div className="bg-purple-50 p-3 rounded-lg text-sm">
            <Row label="Loan Amount" value={`₦${total.toFixed(2)}`} tight />
            <Row
              label="Provider"
              value={
                loanProviders.find((p) => p.id === selectedLoanProvider)
                  ?.name ?? ""
              }
              tight
            />
            <Row
              label="Processing"
              value={
                <span className="text-green-600">
                  {
                    loanProviders.find((p) => p.id === selectedLoanProvider)
                      ?.processingTime
                  }
                </span>
              }
              tight
            />
          </div>
        )}

        <div className="border-t pt-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wide">
              Total
            </span>
            <span className="text-base font-bold text-[#466cf4]">
              ₦{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-center gap-1 text-[11px] text-gray-600">
        <Shield className="h-3.5 w-3.5" />
        <span>Secure & encrypted payment</span>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tight = false,
}: {
  label: string;
  value: React.ReactNode;
  tight?: boolean;
}) {
  return (
    <div className={`flex justify-between ${tight ? "py-0.5" : ""}`}>
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="font-semibold text-sm">{value}</span>
    </div>
  );
}
