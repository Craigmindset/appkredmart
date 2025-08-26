"use client";

import { useState, useEffect, useRef } from "react";
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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart, cartSelectors } from "@/store/cart-store";
import { useAuth } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import Header from "@/components/site-header";
import Insurance, { insuranceOptions } from "./insurance";

/** -----------------------------------------------------------------------
 * Data
 * ----------------------------------------------------------------------*/
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

/** -----------------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------------------*/
const money = (n: number) =>
  `₦${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/** -----------------------------------------------------------------------
 * Page
 * ----------------------------------------------------------------------*/
export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuth((s) => s.user);

  /** Guest checkout control */
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  /** Prefill for signed-in users */
  useEffect(() => {
    if (user) {
      setGuestInfo((info) => ({
        ...info,
        email: user.email || "",
        firstName: (user as any).firstName || "",
        lastName: (user as any).lastName || "",
        phone: (user as any).phone || "",
      }));
    }
  }, [user]);

  /** Ask non-logged-in users to continue as guest/register */
  useEffect(() => {
    if (!user && !guestMode) setShowGuestModal(true);
    else setShowGuestModal(false);
  }, [user, guestMode]);

  /** Cart */
  const cartCount = useCart(cartSelectors.count);
  const cartItems = useCart((s) => s.items);
  const getCartTotal = useCart(cartSelectors.total);

  /** Payments */
  const paymentMethods =
    user || guestMode ? ["paystack", "bnpl", "wallet"] : ["paystack"];
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "paystack" | "bnpl" | "wallet"
  >("paystack");
  const [selectedBnplDuration, setSelectedBnplDuration] = useState("6months");
  const [selectedLoanProvider, setSelectedLoanProvider] =
    useState("creditloan");
  const [isProcessing, setIsProcessing] = useState(false);

  /** Mobile toggles */
  const [showSummaryMobile, setShowSummaryMobile] = useState(false);
  const [showDeliveryMobile, setShowDeliveryMobile] = useState(false);

  /** Delivery/Contact (shared) */
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

  /** Insurance state */
  const [selectedInsurance, setSelectedInsurance] = useState<string | null>(
    null
  );

  /** UI: reveal/hide Device Protection section on demand (from upsell) */
  const [showProtection, setShowProtection] = useState(false);
  const protectionRef = useRef<HTMLDivElement | null>(null);

  /** Smooth scroll to the protection section when it opens */
  useEffect(() => {
    if (showProtection && protectionRef.current) {
      const t = setTimeout(
        () =>
          protectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        100
      );
      return () => clearTimeout(t);
    }
  }, [showProtection]);

  /** Derived insurance amounts */
  const insuranceObj = selectedInsurance
    ? insuranceOptions.find((o) => o.id === selectedInsurance)
    : null;
  const insurancePrice = insuranceObj?.price || 0;

  /** Totals */
  const subtotal = getCartTotal;
  const vat = subtotal * 0.075;
  const delivery = 0;
  const total = subtotal + vat + delivery + insurancePrice;

  /** BNPL math */
  const calculateBnplPayment = () => {
    const duration = bnplDurations.find((d) => d.id === selectedBnplDuration);
    if (!duration) return 0;
    const months = Number.parseInt(duration.id.replace("months", ""));
    const interestAmount = (total * duration.interestRate) / 100;
    const totalWithInterest = total + interestAmount;
    return totalWithInterest / months;
  };

  /** Which methods require full address form */
  const requiresDeliveryForm =
    selectedPaymentMethod === "bnpl" || selectedPaymentMethod === "wallet";

  /** Auto-open mobile delivery when an address is required */
  useEffect(() => {
    if (requiresDeliveryForm) setShowDeliveryMobile(true);
  }, [requiresDeliveryForm]);

  /** Form change */
  const handleGuestInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setGuestInfo((p) => ({ ...p, [name]: value }));
  };

  /** ------------------------ Payment flows ------------------------ */
  const processPaystackPayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total * 100, // kobo
          email: guestInfo.email || "user@example.com",
          metadata: {
            cartItems,
            customerInfo: guestInfo,
            insurance: selectedInsurance
              ? insuranceOptions.find((o) => o.id === selectedInsurance)
              : null,
          },
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
          insurance: selectedInsurance
            ? insuranceOptions.find((o) => o.id === selectedInsurance)
            : null,
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
          insurance: selectedInsurance
            ? insuranceOptions.find((o) => o.id === selectedInsurance)
            : null,
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

  /** Validation aligned with visible fields */
  const isFormValid = () => {
    if (selectedPaymentMethod === "paystack") {
      return Boolean(guestInfo.email);
    }
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

  /** Empty cart guard */
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

  /** -----------------------------------------------------------------------
   * Render
   * ----------------------------------------------------------------------*/
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
            <>
              <OrderSummary
                cartItems={cartItems}
                subtotal={subtotal}
                vat={vat}
                total={total}
                selectedPaymentMethod={selectedPaymentMethod}
                selectedBnplDuration={selectedBnplDuration}
                calculateBnplPayment={calculateBnplPayment}
                selectedLoanProvider={selectedLoanProvider}
                insurance={insuranceObj}
                onToggleProtection={() => setShowProtection(true)}
              />

              {/* Device Protection (collapsible on mobile) */}
              <section ref={protectionRef} className="mt-3">
                <DeviceProtection
                  open={showProtection}
                  onClose={() => setShowProtection(false)}
                  selected={selectedInsurance}
                  onSelect={(id) =>
                    setSelectedInsurance(id === selectedInsurance ? null : id)
                  }
                />
              </section>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-4">
            {/* Delivery Information — mobile collapsible */}
            {(selectedPaymentMethod === "paystack" || requiresDeliveryForm) && (
              <div className="lg:hidden">
                <button
                  onClick={() => setShowDeliveryMobile((s) => !s)}
                  className="mb-2 w-full flex items-center justify-between rounded-md bg-white border px-3 py-2 text-sm"
                  aria-expanded={showDeliveryMobile}
                  aria-controls="delivery-mobile-panel"
                >
                  <span className="font-medium">Delivery Information</span>
                  {showDeliveryMobile ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {showDeliveryMobile && (
                  <section
                    id="delivery-mobile-panel"
                    className="bg-white rounded-xl border shadow-sm p-4"
                  >
                    <h2 className="text-base font-semibold text-gray-900 mb-3">
                      Delivery Information
                    </h2>

                    <DeliveryForm
                      guestInfo={guestInfo}
                      onChange={handleGuestInfoChange}
                    />
                  </section>
                )}
              </div>
            )}

            {/* Delivery Information — desktop always visible */}
            {(selectedPaymentMethod === "paystack" || requiresDeliveryForm) && (
              <section className="hidden lg:block bg-white rounded-xl border shadow-sm p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">
                  Delivery Information
                </h2>

                <DeliveryForm
                  guestInfo={guestInfo}
                  onChange={handleGuestInfoChange}
                />
              </section>
            )}

            {/* Payment */}
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
              <Notice
                color="yellow"
                title="BNPL Terms"
                items={[
                  "Account creation required",
                  "Credit check may be performed",
                  "Late payment fees may apply",
                ]}
              />
            )}
            {selectedPaymentMethod === "wallet" && (
              <Notice
                color="purple"
                title="Loan Requirements"
                items={[
                  "Valid ID and BVN required",
                  "Minimum age: 18 years",
                  "Credit assessment will be conducted",
                ]}
              />
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
            <div className="sticky top-4 flex flex-col gap-4">
              <OrderSummary
                cartItems={cartItems}
                subtotal={subtotal}
                vat={vat}
                total={total}
                selectedPaymentMethod={selectedPaymentMethod}
                selectedBnplDuration={selectedBnplDuration}
                calculateBnplPayment={calculateBnplPayment}
                selectedLoanProvider={selectedLoanProvider}
                insurance={insuranceObj}
                onToggleProtection={() => setShowProtection(true)}
              />

              {/* Device Protection (collapsible on desktop via button) */}
              <section ref={protectionRef}>
                <DeviceProtection
                  open={showProtection}
                  onClose={() => setShowProtection(false)}
                  selected={selectedInsurance}
                  onSelect={(id) =>
                    setSelectedInsurance(id === selectedInsurance ? null : id)
                  }
                />
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/** -----------------------------------------------------------------------
 * UI Partials
 * ----------------------------------------------------------------------*/

/** Delivery Form (reusable) */
function DeliveryForm({
  guestInfo,
  onChange,
}: {
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    landmark: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Email */}
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Email *
        </label>
        <Input
          name="email"
          value={guestInfo.email}
          onChange={onChange}
          placeholder="you@email.com"
          className="h-10 text-sm"
          required
        />
      </div>

      {/* Names */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          First Name *
        </label>
        <Input
          name="firstName"
          value={guestInfo.firstName}
          onChange={onChange}
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
          onChange={onChange}
          placeholder="Last name"
          className="h-10 text-sm"
          required
        />
      </div>

      {/* Phone */}
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <Input
          name="phone"
          value={guestInfo.phone}
          onChange={onChange}
          placeholder="Phone number"
          className="h-10 text-sm"
          required
        />
      </div>

      {/* Address */}
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Address *
        </label>
        <Input
          name="address"
          value={guestInfo.address}
          onChange={onChange}
          placeholder="Street address"
          className="h-10 text-sm"
          required
        />
      </div>

      {/* City / State */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          City *
        </label>
        <Input
          name="city"
          value={guestInfo.city}
          onChange={onChange}
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
          onChange={onChange}
          placeholder="State"
          list="states"
          className="h-10 text-sm border rounded-md px-3 w-full"
          required
        />
        <datalist id="states">
          {[
            "Abia",
            "Adamawa",
            "Akwa Ibom",
            "Anambra",
            "Bauchi",
            "Bayelsa",
            "Benue",
            "Borno",
            "Cross River",
            "Delta",
            "Ebonyi",
            "Edo",
            "Ekiti",
            "Enugu",
            "FCT",
            "Gombe",
            "Imo",
            "Jigawa",
            "Kaduna",
            "Kano",
            "Katsina",
            "Kebbi",
            "Kogi",
            "Kwara",
            "Lagos",
            "Nasarawa",
            "Niger",
            "Ogun",
            "Ondo",
            "Osun",
            "Oyo",
            "Plateau",
            "Rivers",
            "Sokoto",
            "Taraba",
            "Yobe",
            "Zamfara",
          ].map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      {/* Landmark */}
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Nearest Landmark
        </label>
        <select
          name="landmark"
          value={guestInfo.landmark}
          onChange={onChange}
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
  );
}

/** Payment Card */
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

/** Little row for totals */
function Row({
  label,
  value,
  tight = false,
}: {
  label: React.ReactNode;
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

/** Order Summary + Protection Upsell */
function OrderSummary({
  cartItems,
  subtotal,
  vat,
  total,
  selectedPaymentMethod,
  selectedBnplDuration,
  calculateBnplPayment,
  selectedLoanProvider,
  insurance,
  onToggleProtection,
}: {
  cartItems: any[];
  subtotal: number;
  vat: number;
  total: number;
  selectedPaymentMethod: "paystack" | "bnpl" | "wallet";
  selectedBnplDuration: string;
  calculateBnplPayment: () => number;
  selectedLoanProvider: string;
  insurance?: {
    id: string;
    label: string;
    price: number;
    description: string;
    claim: string;
  } | null;
  /** When the upsell is clicked */
  onToggleProtection: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-4">
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
              {money(item.product.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-2 mb-3 border-t pt-2">
        <Row label="Subtotal" value={money(subtotal)} />
        <Row
          label="Delivery"
          value={<span className="text-green-600 font-semibold">Free</span>}
        />
        <Row label="VAT" value={money(vat)} />

        {insurance && (
          <Row
            label={
              <span className="flex items-center gap-1">
                <span className="font-semibold text-green-700">Insurance</span>
                <span className="text-xs text-gray-500">
                  (Device Protection)
                </span>
              </span>
            }
            value={money(insurance.price)}
          />
        )}

        {selectedPaymentMethod === "bnpl" && (
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <Row
              label="Monthly Payment"
              value={money(calculateBnplPayment())}
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
            <Row label="Loan Amount" value={money(total)} tight />
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
              {money(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Security hint */}
      <div className="mt-1 flex items-center justify-center gap-1 text-[11px] text-gray-600">
        <Shield className="h-3.5 w-3.5" />
        <span>Secure & encrypted payment</span>
      </div>

      {/* --- 🛡️ Protection Upsell --- */}
      <button
        onClick={onToggleProtection}
        className="mt-3 w-full flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/60 hover:bg-blue-100/70 transition p-2 text-left"
        aria-label="Open device protection options"
      >
        <div className="shrink-0 rounded-md bg-white p-2 border">
          <Image src="/cubecover.png" alt="Cubecover" width={28} height={28} />
        </div>
        <div className="flex-1 ">
          <p className="text-xs font-semibold text-gray-900 ">
            Get a screen & water protection cover
          </p>
          <p className="text-sm text-gray-600 ">
            Protect your device from accidental damage. See flexible 1-year
            options.
          </p>
        </div>
        <Shield className="h-5 w-5 text-[#466cf4]" />
      </button>
    </div>
  );
}

/** Reusable notice block */
function Notice({
  color,
  title,
  items,
}: {
  color: "yellow" | "purple";
  title: string;
  items: string[];
}) {
  const colorMap = {
    yellow: {
      border: "border-yellow-200",
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      icon: "text-yellow-700",
    },
    purple: {
      border: "border-purple-200",
      bg: "bg-purple-50",
      text: "text-purple-800",
      icon: "text-purple-700",
    },
  }[color];

  return (
    <div
      className={`rounded-lg border ${colorMap.border} ${colorMap.bg} p-3 text-xs ${colorMap.text}`}
    >
      <div className="flex items-start gap-1.5">
        <AlertCircle className={`h-4 w-4 mt-0.5 ${colorMap.icon}`} />
        <div>
          <p className="font-medium">{title}</p>
          <ul className="list-disc list-inside space-y-0.5 mt-1">
            {items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Device Protection wrapper around your <Insurance /> with collapse/close */
function DeviceProtection({
  open,
  onClose,
  selected,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  if (!open) return null;

  return (
    <section className="bg-white rounded-xl border shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-gray-900">
          Device Protection
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 p-1"
          aria-label="Close device protection"
          title="Close"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      <p className="text-xs text-gray-600 mb-3">
        1-year Screen & Water Protection. Choose a cover that matches your
        device value.
      </p>

      <Insurance selected={selected} onSelect={(id) => onSelect(id)} />

      {selected && (
        <div className="mt-2 text-[11px] text-green-700 bg-green-50 border border-green-100 rounded-md px-2 py-1">
          <span className="font-medium">Added:</span>{" "}
          {insuranceOptions.find((o) => o.id === selected)?.description}
        </div>
      )}
    </section>
  );
}
