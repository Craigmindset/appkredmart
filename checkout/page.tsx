"use client";

import Header from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cartSelectors, useCart } from "@/store/cart-store";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  CreditCard,
  Shield,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// BNPL Duration Options
// Landmark addresses
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
  "OYINGBO EBUTE META BRANCH - Tantalizes Building, 73 Murtala Muhammed Way, Oyingbo, Ebute Meta, Lagos, NG",
  "AJAH BRANCH - Former Aquinos Building, Berger Bus Stop, Ajah, Lagos, NG",
  "AJAH BRANCH 2 - No 1A Addo Road, Ajah. Close to Ajah Roundabout. Opposite Olumegbon’s Palace at Ado Road, Lagos, NG",
];
const bnplDurations = [
  { id: "3months", label: "3 Months", interestRate: 5, monthlyFee: 2.5 },
  { id: "6months", label: "6 Months", interestRate: 8, monthlyFee: 2.0 },
  { id: "12months", label: "12 Months", interestRate: 12, monthlyFee: 1.5 },
  { id: "24months", label: "24 Months", interestRate: 18, monthlyFee: 1.0 },
];

// Wallet Loan Providers
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

export default function CheckoutPage() {
  const cartCount = useCart(cartSelectors.count);
  const cartItems = useCart((state) => state.items);
  const getCartTotal = useCart(cartSelectors.total);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("paystack");
  const [selectedBnplDuration, setSelectedBnplDuration] = useState("6months");
  const [selectedLoanProvider, setSelectedLoanProvider] =
    useState("creditloan");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [showGuestForm, setShowGuestForm] = useState(false);

  // Form states
  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    landmark: "",
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  // Calculate totals
  const subtotal = getCartTotal();
  const vat = subtotal * 0.075;
  const delivery = 0; // Free delivery
  const total = subtotal + vat + delivery;

  // Calculate BNPL monthly payment
  const calculateBnplPayment = () => {
    const duration = bnplDurations.find((d) => d.id === selectedBnplDuration);
    if (!duration) return 0;

    const months = Number.parseInt(duration.id.replace("months", ""));
    const interestAmount = (total * duration.interestRate) / 100;
    const totalWithInterest = total + interestAmount;
    return totalWithInterest / months;
  };

  // Handle guest checkout requirement
  useEffect(() => {
    if (
      selectedPaymentMethod === "bnpl" ||
      selectedPaymentMethod === "wallet"
    ) {
      setShowGuestForm(true);
    } else {
      setShowGuestForm(false);
    }
  }, [selectedPaymentMethod]);

  // Handle form submissions
  const handleGuestInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestInfo({
      ...guestInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardInfo({
      ...cardInfo,
      [e.target.name]: e.target.value,
    });
  };

  // Payment processing functions
  const processPaystackPayment = async () => {
    setIsProcessing(true);
    try {
      // API integration point: POST /api/payments/paystack/initialize
      const response = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total * 100, // Paystack expects amount in kobo
          email: guestInfo.email || "user@example.com",
          metadata: {
            cartItems,
            customerInfo: guestInfo,
          },
        }),
      });

      const data = await response.json();
      if (data.status) {
        // Redirect to Paystack payment page
        window.location.href = data.data.authorization_url;
      }
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
      // API integration point: POST /api/payments/bnpl/create
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
        // Redirect to BNPL confirmation page
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
      // API integration point: POST /api/payments/wallet-loan/apply
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
        // Redirect to loan approval page
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
        processPaystackPayment();
        break;
      case "bnpl":
        processBnplPayment();
        break;
      case "wallet":
        processWalletLoan();
        break;
      default:
        alert("Please select a payment method.");
    }
  };

  const isFormValid = () => {
    if (selectedPaymentMethod === "paystack" && !showGuestForm) {
      return (
        cardInfo.cardNumber &&
        cardInfo.expiryDate &&
        cardInfo.cvv &&
        cardInfo.cardName
      );
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

      <div className="container mx-auto px-2 py-4">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-4">
          <Link href="/cart" className="text-[#466cf4] hover:text-[#3a5ce0]">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Billing/Delivery Information FIRST */}
          <div className="space-y-3">
            {/* Billing/Delivery Information */}
            <div className="bg-white rounded-lg shadow p-3">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                {selectedPaymentMethod === "paystack"
                  ? "Billing Information"
                  : "Delivery Information"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <Input
                    name="firstName"
                    value={guestInfo.firstName}
                    onChange={handleGuestInfoChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <Input
                    name="lastName"
                    value={guestInfo.lastName}
                    onChange={handleGuestInfoChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    name="email"
                    value={guestInfo.email}
                    onChange={handleGuestInfoChange}
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <Input
                    name="phone"
                    value={guestInfo.phone}
                    onChange={handleGuestInfoChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <Input
                    name="address"
                    value={guestInfo.address}
                    onChange={handleGuestInfoChange}
                    placeholder="Enter address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <Input
                    name="city"
                    value={guestInfo.city}
                    onChange={handleGuestInfoChange}
                    placeholder="Enter city"
                    required
                    className="border rounded px-3 py-2 w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    name="state"
                    value={guestInfo.state}
                    onChange={handleGuestInfoChange}
                    placeholder="Enter state"
                    required
                    list="states"
                    className="border rounded px-3 py-2 w-full text-xs"
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nearest Landmark
                  </label>
                  <select
                    name="landmark"
                    value={guestInfo.landmark}
                    onChange={handleGuestInfoChange}
                    className="border rounded px-3 py-2 bg-white w-full text-xs focus:outline-none focus:ring-2 focus:ring-[#466cf4]"
                  >
                    <option value="">Select Nearest Landmark</option>
                    {landmarkAddresses.map((address, idx) => {
                      // Extract branch name and city for compact display
                      const match = address.match(
                        /^(.*?)\s*-\s*(.*?)(,\s*([A-Za-z ]+),\s*NG)?$/
                      );
                      let label = address;
                      if (match) {
                        // match[1]: branch name, match[2]: address, match[4]: city
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
            </div>

            {/* Payment Method Selection (now after billing info) */}
            <div className="bg-white rounded-lg shadow p-3">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Choose Payment Method
              </h2>

              <div className="space-y-2">
                {/* Paystack Option */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === "paystack"
                      ? "border-[#466cf4] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPaymentMethod("paystack")}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === "paystack"
                          ? "border-[#466cf4] bg-[#466cf4]"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPaymentMethod === "paystack" && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <CreditCard className="h-6 w-6 text-[#466cf4]" />
                    <div>
                      <h3 className="font-semibold">
                        Pay with Debit/Credit Card
                      </h3>
                      <p className="text-sm text-gray-600">
                        Secure payment via Paystack
                      </p>
                    </div>
                  </div>
                </div>

                {/* BNPL Option */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === "bnpl"
                      ? "border-[#466cf4] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPaymentMethod("bnpl")}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === "bnpl"
                          ? "border-[#466cf4] bg-[#466cf4]"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPaymentMethod === "bnpl" && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <Calendar className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold">
                        Buy Now, Pay Later (BNPL)
                      </h3>
                      <p className="text-sm text-gray-600">
                        Split your payment into installments
                      </p>
                    </div>
                  </div>

                  {selectedPaymentMethod === "bnpl" && (
                    <div className="mt-4 pl-8">
                      <h4 className="font-medium mb-3">Select Duration:</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {bnplDurations.map((duration) => (
                          <div
                            key={duration.id}
                            className={`border rounded-lg p-3 cursor-pointer text-center ${
                              selectedBnplDuration === duration.id
                                ? "border-[#466cf4] bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedBnplDuration(duration.id)}
                          >
                            <div className="font-semibold">
                              {duration.label}
                            </div>
                            <div className="text-sm text-gray-600">
                              {duration.interestRate}% interest
                            </div>
                            <div className="text-sm font-medium text-[#466cf4]">
                              ₦{calculateBnplPayment().toFixed(2)}/month
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Wallet Loan Option */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === "wallet"
                      ? "border-[#466cf4] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPaymentMethod("wallet")}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === "wallet"
                          ? "border-[#466cf4] bg-[#466cf4]"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPaymentMethod === "wallet" && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <Wallet className="h-6 w-6 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">Wallet Loan</h3>
                      <p className="text-sm text-gray-600">
                        Get instant loan to complete purchase
                      </p>
                    </div>
                  </div>

                  {selectedPaymentMethod === "wallet" && (
                    <div className="mt-4 pl-8">
                      <h4 className="font-medium mb-3">
                        Choose Loan Provider:
                      </h4>
                      <div className="space-y-3">
                        {loanProviders.map((provider) => (
                          <div
                            key={provider.id}
                            className={`border rounded-lg p-4 cursor-pointer ${
                              selectedLoanProvider === provider.id
                                ? "border-[#466cf4] bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedLoanProvider(provider.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Image
                                  src={provider.logo || "/placeholder.svg"}
                                  alt={provider.name}
                                  width={60}
                                  height={30}
                                  className="h-8 w-auto object-contain"
                                />
                                <div>
                                  <h5 className="font-semibold">
                                    {provider.name}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    Up to ₦{provider.maxAmount.toLocaleString()}{" "}
                                    • {provider.interestRate}% interest
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-green-600">
                                  {provider.processingTime}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {provider.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card Information section removed as requested */}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-3 sticky top-4">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <Image
                      src={item.img || "/placeholder.svg"}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="w-15 h-15 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      ₦{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-3 border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₦{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vat</span>
                  <span className="font-semibold">₦{vat.toFixed(2)}</span>
                </div>

                {/* BNPL Additional Info */}
                {selectedPaymentMethod === "bnpl" && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Payment:</span>
                      <span className="font-semibold">
                        ₦{calculateBnplPayment().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span>
                        {
                          bnplDurations.find(
                            (d) => d.id === selectedBnplDuration
                          )?.label
                        }
                      </span>
                    </div>
                  </div>
                )}

                {/* Wallet Loan Additional Info */}
                {selectedPaymentMethod === "wallet" && (
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Loan Amount:</span>
                        <span className="font-semibold">
                          ₦{total.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Provider:</span>
                        <span>
                          {
                            loanProviders.find(
                              (p) => p.id === selectedLoanProvider
                            )?.name
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Time:</span>
                        <span className="text-green-600">
                          {
                            loanProviders.find(
                              (p) => p.id === selectedLoanProvider
                            )?.processingTime
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold">Total</span>
                    <span className="text-base font-bold text-[#466cf4]">
                      ₦{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                disabled={isProcessing || !isFormValid()}
                className="w-full bg-[#466cf4] hover:bg-[#3a5ce0] text-white py-2 text-sm font-semibold"
              >
                {isProcessing
                  ? "Processing..."
                  : selectedPaymentMethod === "paystack"
                  ? "Pay Now"
                  : selectedPaymentMethod === "bnpl"
                  ? "Setup BNPL"
                  : "Apply for Loan"}
              </Button>

              {/* Security Notice */}
              <div className="mt-2 flex items-center justify-center space-x-1 text-xs text-gray-600">
                <Shield className="h-3 w-3" />
                <span>Secure & encrypted payment</span>
              </div>

              {/* Payment Method Specific Notices */}
              {selectedPaymentMethod === "bnpl" && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-1">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-xs text-yellow-800">
                      <p className="font-medium">BNPL Terms:</p>
                      <ul className="mt-1 list-disc list-inside space-y-0.5">
                        <li>Account creation required</li>
                        <li>Credit check may be performed</li>
                        <li>Late payment fees may apply</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === "wallet" && (
                <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start space-x-1">
                    <AlertCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                    <div className="text-xs text-purple-800">
                      <p className="font-medium">Loan Requirements:</p>
                      <ul className="mt-1 list-disc list-inside space-y-0.5">
                        <li>Valid ID and BVN required</li>
                        <li>Minimum age: 18 years</li>
                        <li>Credit assessment will be conducted</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
