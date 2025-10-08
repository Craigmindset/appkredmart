"use client";

import type React from "react";

import LayoutShell from "@/components/layout-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth-store";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { StepProgress } from "@/components/step-progress";
import { useVerifyEmailOtp } from "@/lib/services/auth/use-verify-email-otp";
import { useResendVerifyEmail } from "@/lib/services/auth/use-resend-verify-email";
import { toast } from "sonner";

export default function VerifyPage() {
  const [resendIsBlue, setResendIsBlue] = useState(true);
  const [resendPressed, setResendPressed] = useState(false);
  const [resendIsRed, setResendIsRed] = useState(false);
  const resendTimeout = useRef<NodeJS.Timeout | null>(null);
  const resendRedTimeout = useRef<NodeJS.Timeout | null>(null);
  const [code, setCode] = useState("");
  const { setVerified } = useAuth();
  const router = useRouter();
  const { verifyOtp, loading } = useVerifyEmailOtp();
  const { mutateAsync, isPending: resending } = useResendVerifyEmail();

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyOtp({ token: code }).then(() => {
      setVerified(true);
      setResendIsBlue(false); // Reset resend color after successful verify
      router.push("/sign-up?step=password");
    });
  };

  return (
    <LayoutShell>
      <section className="relative">
        <img
          src="/images/login-bg.jpg"
          alt="Background"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

        <div className="container mx-auto px-4">
          <div className="grid min-h-[calc(100svh-64px)] items-center gap-8 md:grid-cols-2">
            <div className="max-w-xl py-10 text-white">
              <div className="mb-10 inline-flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                  <div className="h-5 w-5 rounded-full bg-white" />
                </div>
                <span className="text-2xl font-semibold tracking-tight">
                  KredMart
                </span>
              </div>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                {"Verify your account"}
              </h1>
              <p className="mt-4 max-w-md text-sm/6 text-white/85">
                {"Enter the 6-digit code sent to your email/phone to continue."}
              </p>
            </div>

            <div className="flex w-full items-center justify-center py-10">
              <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-lg backdrop-blur-md md:p-8">
                <StepProgress current={2} total={3} />
                <div className="text-xs font-medium text-muted-foreground">
                  {"VERIFICATION"}
                </div>
                <h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
                  {"Enter Code"}
                </h2>

                <form onSubmit={onVerify} className="mt-6 space-y-4">
                  <Input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="Enter code sent to your email"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    className="h-11 w-full"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </Button>
                  <div className="mt-2 text-left text-sm text-muted-foreground">
                    {"Didn't receive a code? "}
                    <button
                      type="button"
                      className={`underline ml-1 transition-colors duration-150 ${
                        resendIsRed
                          ? "text-red-600"
                          : resendIsBlue
                          ? "text-blue-600"
                          : "text-primary"
                      } ${resendPressed ? "opacity-60" : "opacity-100"}`}
                      style={{ padding: 0, background: "none", border: "none" }}
                      onClick={async () => {
                        setResendIsRed(true);
                        await mutateAsync()
                          .then(() => {
                            toast.success("Sent successfully");
                          })
                          .finally(() => {
                            if (resendRedTimeout.current)
                              clearTimeout(resendRedTimeout.current);
                            resendRedTimeout.current = setTimeout(
                              () => setResendIsRed(false),
                              5000
                            );
                          });
                      }}
                      // onMouseDown={() => {
                      //   setResendPressed(true);
                      //   if (resendTimeout.current)
                      //     clearTimeout(resendTimeout.current);
                      //   resendTimeout.current = setTimeout(
                      //     () => setResendPressed(false),
                      //     200
                      //   );
                      // }}
                      // onMouseUp={() => {
                      //   setResendPressed(false);
                      //   if (resendTimeout.current)
                      //     clearTimeout(resendTimeout.current);
                      // }}
                      // onMouseLeave={() => {
                      //   setResendPressed(false);
                      //   if (resendTimeout.current)
                      //     clearTimeout(resendTimeout.current);
                      // }}
                    >
                      Resend
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LayoutShell>
  );
}
