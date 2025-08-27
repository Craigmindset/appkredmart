"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LayoutShell from "@/components/layout-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StepProgress } from "@/components/step-progress";
import { BadgeCheck, Badge, KeyRound, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useMerchantRegister } from "@/lib/services/auth/use-merchant-register";
import { useVerifyMerchantEmailOtp } from "@/lib/services/auth/use-merchant-verify";
import { useMerchantAddPassword } from "@/lib/services/auth/use-merchant-add-password";

type Step = 1 | 2 | 3 | 4;
const DEMO_MERCHANT_ID = "KM02341";
const DEMO_OTP = "111111";

function Timeline({ current }: { current: Step }) {
  const items = [
    { key: 1, label: "Details", icon: BadgeCheck },
    { key: 2, label: "Merchant ID", icon: Badge },
    { key: 3, label: "OTP", icon: KeyRound },
    { key: 4, label: "Password", icon: Lock },
  ] as const;

  return (
    <div className="mb-4">
      <div className="hidden items-center justify-between gap-2 md:flex">
        {items.map((it, idx) => {
          const Icon = it.icon;
          const done = it.key < current;
          const active = it.key === current;
          return (
            <div key={it.key} className="flex flex-1 items-center">
              <div
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                  active
                    ? "bg-foreground text-background ring-foreground/10"
                    : done
                    ? "bg-emerald-600/10 text-emerald-700 ring-emerald-600/20"
                    : "bg-muted text-muted-foreground ring-border"
                }`}
              >
                <Icon className="mr-1.5 h-3.5 w-3.5" />
                {it.label}
              </div>
              {idx < items.length - 1 && (
                <div
                  className={`mx-2 h-px flex-1 ${
                    done
                      ? "bg-emerald-600/40"
                      : active
                      ? "bg-foreground/40"
                      : "bg-muted"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Mobile compact progress */}
      <div className="md:hidden">
        <StepProgress current={current} total={4} />
      </div>
    </div>
  );
}

export default function MerchantSignUpPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);

  // Step 1: details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [cacNumber, setCacNumber] = useState("");
  const [supportingDoc, setSupportingDoc] = useState<File | null>(null);

  const { mutateAsync, loading: verifyingMerchantId } = useMerchantRegister();
  const { verifyOtp: verifyOtpAsync, loading: verifyingOtp } =
    useVerifyMerchantEmailOtp();

  const validateFileSize = (file: File | null): boolean => {
    if (!file) return false;
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    return file.size <= maxSize;
  };

  const canStep1 = useMemo(() => {
    const ok =
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      /\S+@\S+\.\S+/.test(email) &&
      role.trim().length > 0 &&
      companyName.trim().length > 0 &&
      cacNumber.trim().length > 0 &&
      supportingDoc !== null &&
      validateFileSize(supportingDoc);
    return ok;
  }, [firstName, lastName, email, role, companyName, cacNumber, supportingDoc]);

  // Step 2: merchant id verification
  const [merchantId, setMerchantId] = useState("");
  // const [verifyingMerchantId, setVerifyingMerchantId] = useState(false);
  const [merchantVerified, setMerchantVerified] = useState(false);
  const merchantIdValidFormat = useMemo(
    () => /^[A-Za-z0-9]{7}$/.test(merchantId),
    [merchantId]
  );

  async function verifyMerchantId() {
    if (!merchantIdValidFormat) {
      toast.error("Invalid Merchant ID format", {
        description: "Enter a 7-character code. Example: KM02341",
      });
      return;
    }
    if (!supportingDoc) {
      toast.error("Please upload supporting document");
      return;
    }
    await mutateAsync({
      firstname: firstName,
      lastname: lastName,
      email,
      phone: "",
      token: merchantId,
      position: role,
      company: companyName,
      cac: cacNumber,
      documentFile: supportingDoc,
    }).then(() => {
      setMerchantVerified(true);
      setStep(3);
      toast.success("Merchant ID verified", {
        description: "Your Merchant ID has been verified successfully.",
      });
    });
    // setVerifyingMerchantId(true);
    // await new Promise((r) => setTimeout(r, 700));
    // setVerifyingMerchantId(false);
    // if (merchantId.toUpperCase() === DEMO_MERCHANT_ID) {
    //   setMerchantVerified(true);
    //   toast({
    //     title: "Merchant ID verified",
    //     description: "Your Merchant ID has been verified successfully.",
    //   });
    //   setStep(3);
    // } else {
    //   setMerchantVerified(false);
    //   toast({
    //     title: "Verification failed",
    //     description:
    //       "We couldn't verify this Merchant ID. Use KM02341 as the demo code.",
    //     variant: "destructive",
    //   });
    // }
  }

  // Step 3: OTP
  const [otp, setOtp] = useState("");
  const otpValidFormat = useMemo(() => /^\d{6}$/.test(otp), [otp]);

  async function verifyOtp() {
    if (!otpValidFormat) {
      toast.error("Invalid OTP", {
        description:
          "Enter the 6-digit code sent to your email. Use 111111 for demo.",
      });
      return;
    }
    await verifyOtpAsync({ token: otp }).then(() => {
      toast.success("OTP verified", {
        description: "Verification successful.",
      });
      setStep(4);
    });
    // setVerifyingOtp(true);
    // await new Promise((r) => setTimeout(r, 600));
    // setVerifyingOtp(false);
    // if (otp === DEMO_OTP) {
    // } else {
    //   toast.error("Incorrect OTP", {
    //     description: "Use 111111 as the demo code.",
    //   });
    // }
  }

  // Step 4: password
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const passwordOk = useMemo(
    () => pwd.length >= 8 && pwd === confirm,
    [pwd, confirm]
  );

  const { mutateAsync: addMerchantPasswordAsync, loading: creating } =
    useMerchantAddPassword();
  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordOk) return;
    await addMerchantPasswordAsync({
      password: pwd,
      confirmPassword: confirm,
    }).then((res) => {
      toast.success("Account created", {
        description: "You can now sign in to your merchant dashboard.",
      });
      router.replace("/admindesk");
    });
    // setCreating(true);
    // await new Promise((r) => setTimeout(r, 900));
    // setCreating(false);
  }

  // Prevent skipping ahead without prerequisites
  useEffect(() => {
    if (step >= 3 && !merchantVerified) setStep(2);
  }, [step, merchantVerified]);

  return (
    <LayoutShell showFooter={false}>
      <section className="relative">
        <img
          src="https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/merchant.jpg"
          alt="Background"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />

        <div className="container mx-auto px-4">
          <div className="grid min-h-[calc(100svh-64px)] items-center gap-8 md:grid-cols-2">
            {/* Left: Brand + Headline */}
            <div className="max-w-xl py-10 text-white">
              <div className="mb-10 inline-flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                  <div className="h-5 w-5 rounded-full bg-white" />
                </div>
                <span className="text-2xl font-semibold tracking-tight">
                  KredMart Merchant
                </span>
              </div>

              <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                Create your merchant account
              </h1>
              <p className="mt-4 max-w-md text-sm/6 text-white/85">
                Follow the steps to register. Verify your Merchant ID and email,
                then secure your account with a password.
              </p>
            </div>

            {/* Right: Sign Up Card */}
            <div className="flex w-full items-center justify-center py-10 ">
              <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-lg backdrop-blur-md md:p-8">
                <Timeline current={step} />
                <div className="text-xs font-medium text-muted-foreground">
                  {"REGISTRATION"}
                </div>
                <h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
                  {"Merchant Sign Up"}
                </h2>

                {/* Step content */}
                <div className="mt-6 space-y-4">
                  {step === 1 && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (canStep1) setStep(2);
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            First Name
                          </label>
                          <Input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Last Name
                          </label>
                          <Input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="merchant@store.com"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Role
                        </label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          required
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select a role</option>
                          <option value="CEO">CEO</option>
                          <option value="COO">COO</option>
                          <option value="CTO">CTO</option>
                          <option value="Manager">Manager</option>
                          <option value="Merchant">Admin Officer</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Company Name
                        </label>
                        <Input
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          required
                          placeholder="Your company name"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Company CAC Number
                        </label>
                        <Input
                          value={cacNumber}
                          onChange={(e) => setCacNumber(e.target.value)}
                          required
                          placeholder="Enter CAC registration number"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Supporting Documents
                        </label>
                        <Input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            if (file && !validateFileSize(file)) {
                              toast.error("File too large", {
                                description:
                                  "Please upload a file smaller than 5MB",
                              });
                              e.target.value = "";
                              return;
                            }
                            setSupportingDoc(file);
                          }}
                          required
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Upload CAC certificate or other supporting documents
                          (JPG, PDF, DOC - Max 5MB)
                        </p>
                        {supportingDoc && (
                          <p className="mt-1 text-xs text-green-600">
                            Selected file: {supportingDoc.name} (
                            {Math.round(supportingDoc.size / 1024)}KB)
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          className="bg-transparent"
                          onClick={() => router.back()}
                        >
                          Back
                        </Button>
                        <Button type="submit" disabled={!canStep1}>
                          Continue
                        </Button>
                      </div>
                    </form>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Merchant ID
                        </label>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          <div className="sm:col-span-2">
                            <Input
                              value={merchantId}
                              onChange={(e) =>
                                setMerchantId(e.target.value.toUpperCase())
                              }
                              placeholder="KM02341"
                              maxLength={7}
                            />
                            <div className="mt-1 text-xs text-muted-foreground">
                              Enter your 7-character Merchant ID. Use KM02341
                              for demo.
                            </div>
                          </div>
                          <div className="sm:col-span-1">
                            <Button
                              className="w-full"
                              onClick={verifyMerchantId}
                              disabled={verifyingMerchantId}
                            >
                              {verifyingMerchantId ? "Verifying..." : "Verify"}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          className="bg-transparent"
                          onClick={() => setStep(1)}
                        >
                          Back
                        </Button>
                        <Button
                          onClick={verifyMerchantId}
                          disabled={
                            verifyingMerchantId || !merchantIdValidFormat
                          }
                          variant="secondary"
                        >
                          {verifyingMerchantId ? "Verifying..." : "Continue"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Enter OTP
                        </label>
                        <Input
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          value={otp}
                          onChange={(e) =>
                            setOtp(
                              e.target.value.replace(/\D/g, "").slice(0, 6)
                            )
                          }
                          placeholder="Enter 111111"
                        />
                        <div className="mt-1 text-xs text-muted-foreground">
                          A 6-digit code was sent to {email || "your email"}.
                          Use 111111 for demo.
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          className="bg-transparent"
                          onClick={() => setStep(2)}
                        >
                          Back
                        </Button>
                        <Button
                          onClick={verifyOtp}
                          disabled={verifyingOtp || !otpValidFormat}
                        >
                          {verifyingOtp ? "Verifying..." : "Verify OTP"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <form onSubmit={onCreate} className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Create Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showPwd ? "text" : "password"}
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            placeholder="At least 8 characters"
                            className="pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPwd((v) => !v)}
                            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
                            aria-label={
                              showPwd ? "Hide password" : "Show password"
                            }
                          >
                            {showPwd ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Minimum 8 characters.
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showConfirm ? "text" : "password"}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="Re-enter password"
                            className="pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm((v) => !v)}
                            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
                            aria-label={
                              showConfirm ? "Hide password" : "Show password"
                            }
                          >
                            {showConfirm ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {confirm && pwd !== confirm && (
                          <div className="mt-1 text-xs text-rose-600">
                            Passwords do not match.
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          className="bg-transparent"
                          onClick={() => setStep(3)}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={!passwordOk || creating}
                        >
                          {creating ? "Creating..." : "Create Account"}
                        </Button>
                      </div>
                    </form>
                  )}

                  <Separator />

                  <div className="text-center text-xs text-muted-foreground">
                    Already have a merchant account?{" "}
                    <a href="/admindesk" className="font-semibold underline">
                      Sign in
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LayoutShell>
  );
}
