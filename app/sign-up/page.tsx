"use client";

import Image from "next/image";
import Link from "next/link";

import LayoutShell from "@/components/layout-shell";
import { StepProgress } from "@/components/step-progress";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAddPassword } from "@/lib/services/auth/use-add-password";
import { useRegister } from "@/lib/services/auth/use-register";
import {
  registerPasswordSchema,
  registerPasswordSchemaType,
  registerSchema,
  registerSchemaType,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { poppins } from "@/lib/fonts";

export default function SignUpPage() {
  const params = useSearchParams();
  const step = params.get("step");
  const router = useRouter();

  // Password step state
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutateAsync, loading } = useRegister();
  const { loading: passwordLoading, mutateAsync: addPasswordSync } =
    useAddPassword();

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(registerPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Format phone number before submit
  const onStart = async (data: registerSchemaType) => {
    let phone = data.phone.replace(/\D/g, ""); // Remove non-digits
    if (phone.length === 11 && phone.startsWith("0")) {
      phone = "+234" + phone.slice(1);
    }
    await mutateAsync({ ...data, phone }).then(() => {
      router.push("/sign-up/verify");
    });
  };

  const onCreate = async (data: registerPasswordSchemaType) => {
    await addPasswordSync(data).then(() => {
      // After account creation, send user to /login (alias to /sign-in)
      router.push("/login");
    });
  };

  return (
    <LayoutShell showFooter={false}>
      <section className="relative">
        {/* Layered background images */}
        <Image
          src="/bg-about.jpg"
          alt="Sign up background texture"
          fill
          className="absolute inset-0 -z-20 object-cover opacity-10"
          priority={false}
        />
        <img
          src="./images/signin-img.png"
          alt="Background"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover "
        />
        <div className="absolute inset-0 -z-30 bg-[#0F3D73] bg-opacity-50" />

        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse md:grid md:min-h-[calc(100svh-64px)] min-h-[40vh] pt-14 md:pt-0 items-center gap-8 md:grid-cols-2">
            {/* Left: Brand + Headline */}
            <div className="max-w-xl py-10 text-white md:order-1">
              <div className="mb-10 inline-flex items-center gap-3">
                {/*<div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                  <div className="h-5 w-5 rounded-full bg-white" />
                </div>*/}
                <span className="text-2xl font-semibold tracking-tight">
                  KredMart
                </span>
              </div>

              <h1
                className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl"
                style={{ fontFamily: "poppins}}>" }}
              >
                {"Create your account…"}
              </h1>
              <p
                className="mt-4 max-w-md text-sm/6 text-white/85"
                style={{ fontFamily: " sans-serif" }}
              >
                {
                  "Create an account to shop, track orders, manage loans, and enjoy exclusive deals."
                }
              </p>
            </div>

            {/* Right: Sign Up Card */}
            <div className="flex w-full items-center justify-center py-10 md:order-2">
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

                    <Form {...passwordForm}>
                      <form
                        onSubmit={passwordForm.handleSubmit(onCreate)}
                        className="mt-6 space-y-4"
                      >
                        <FormField
                          control={passwordForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium">
                                Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    type={showPwd ? "text" : "password"}
                                    placeholder="Enter a strong password"
                                    className="pr-10"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPwd((v) => !v)}
                                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
                                    aria-label={
                                      showPwd
                                        ? "Hide password"
                                        : "Show password"
                                    }
                                  >
                                    {showPwd ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium">
                                Confirm Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Re-enter your password"
                                    className="pr-10"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
                                    aria-label={
                                      showPwd
                                        ? "Hide password"
                                        : "Show password"
                                    }
                                  >
                                    {showConfirm ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="mt-2 h-11 w-full"
                          disabled={
                            passwordLoading ||
                            passwordForm.watch("password") !==
                              passwordForm.watch("confirmPassword")
                          }
                        >
                          {passwordLoading ? "Creating..." : "CREATE ACCOUNT"}
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
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel className="block text-sm font-medium">
                                  Phone number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={11}
                                    pattern="[0-9]{11}"
                                    placeholder="09000000000"
                                    {...field}
                                    value={field.value
                                      .replace(/\D/g, "")
                                      .slice(0, 11)}
                                    onChange={(e) => {
                                      // Only allow digits, max 11
                                      const val = e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 11);
                                      field.onChange(val);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />

                        <Button
                          className="mt-2 h-11 w-full bg-[#0F3D73]"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Redirecting..." : "Continue"}
                        </Button>

                        <div className="mt-4 flex items-center gap-3">
                          <Separator className="flex-1" />
                          <span className="text-xs text-muted-foreground">
                            {"Or"}
                          </span>
                          <Separator className="flex-1" />
                        </div>

                        {/* <Button
                          type="button"
                          variant="outline"
                          className="h-11 w-full bg-transparent"
                          onClick={async () => {
                            router.push("/api/google");
                          }}
                        >
                          <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background text-[10px]">
                            {"G"}
                          </span>
                          {"Sign up with Google"}
                        </Button> */}
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
