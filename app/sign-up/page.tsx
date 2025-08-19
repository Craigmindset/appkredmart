"use client";

import Link from "next/link";

import type React from "react";

import LayoutShell from "@/components/layout-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { StepProgress } from "@/components/step-progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, registerSchemaType } from "@/lib/validations/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function SignUpPage() {
  const params = useSearchParams();
  const step = params.get("step");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Password step state
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
    },
  });

  const onStart = async (data: registerSchemaType) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    router.push("/sign-up/verify");
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    // After account creation, send user to /login (alias to /sign-in)
    router.push("/login");
  };

  return (
    <LayoutShell showFooter={false}>
      <section className="relative">
        <img
          src="https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/young-african-ladies-viewing-something-their-mobile-phones-while-carrying-shopping-bags.png"
          alt="Background"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

        <div className="container mx-auto px-4">
          <div className="grid min-h-[calc(100svh-64px)] items-center gap-8 md:grid-cols-2">
            {/* Left: Brand + Headline */}
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
                {"Build your account…"}
              </h1>
              <p className="mt-4 max-w-md text-sm/6 text-white/85">
                {
                  "Create an account to shop, track orders, manage loans, and enjoy exclusive deals."
                }
              </p>

              <div className="mt-8 flex items-center gap-4">
                <span className="h-1.5 w-12 rounded-full bg-white/90" />
                <span className="h-1 w-8 rounded-full bg-white/50" />
                <span className="h-1 w-8 rounded-full bg-white/50" />
              </div>
            </div>

            {/* Right: Sign Up Card */}
            <div className="flex w-full items-center justify-center py-10">
              <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-lg backdrop-blur-md md:p-8">
                {step === "password" ? (
                  <>
                    <StepProgress current={3} total={3} />
                    <div className="text-xs font-medium text-muted-foreground">
                      {"FINAL STEP"}
                    </div>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
                      {"Create your password"}
                    </h2>

                    <form onSubmit={onCreate} className="mt-6 space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          {"Password"}
                        </label>
                        <div className="relative">
                          <Input
                            type={showPwd ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter a strong password"
                            className="pr-10"
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
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          {"Confirm Password"}
                        </label>
                        <div className="relative">
                          <Input
                            type={showConfirm ? "text" : "password"}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                            placeholder="Re-enter your password"
                            className="pr-10"
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
                      </div>

                      <Button
                        type="submit"
                        className="mt-2 h-11 w-full"
                        disabled={loading || password !== confirm}
                      >
                        {loading ? "Creating..." : "CREATE ACCOUNT"}
                      </Button>
                    </form>

                    <div className="mt-6 text-center text-xs text-muted-foreground">
                      {"Already have an account? "}
                      <Link href="/sign-in" className="font-semibold underline">
                        {"Log in"}
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <StepProgress current={1} total={3} />
                    <div className="text-xs font-medium text-muted-foreground">
                      {"GET STARTED"}
                    </div>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
                      {"Create account"}
                    </h2>

                    <Form {...registerForm}>
                      <form
                        onSubmit={registerForm.handleSubmit(onStart)}
                        className="mt-6 space-y-4"
                      >
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <FormField
                            control={registerForm.control}
                            name="firstname"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block text-sm font-medium">
                                  First Name
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="lastname"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block text-sm font-medium">
                                  Last Name
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="you@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium">
                                Phone number
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="+234 800 000 0000"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          className="mt-2 h-11 w-full"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Redirecting..." : "Verify Email & Phone"}
                        </Button>

                        <div className="mt-4 flex items-center gap-3">
                          <Separator className="flex-1" />
                          <span className="text-xs text-muted-foreground">
                            {"Or"}
                          </span>
                          <Separator className="flex-1" />
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 w-full bg-transparent"
                        >
                          <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background text-[10px]">
                            {"G"}
                          </span>
                          {"Sign up with Google"}
                        </Button>
                      </form>
                    </Form>

                    <div className="mt-6 text-center text-xs text-muted-foreground">
                      {"Already have an account? "}
                      <Link href="/sign-in" className="font-semibold underline">
                        {"Log in"}
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </LayoutShell>
  );
}
