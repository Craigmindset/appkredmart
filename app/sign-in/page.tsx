"use client";

import LayoutShell from "@/components/layout-shell";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useLogin } from "@/lib/services/auth/use-login";
import { loginSchema, loginSchemaType } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const params = useSearchParams();
  const error = params.get("error");
  // Prefill email from localStorage if available
  const [initialEmail, setInitialEmail] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedEmail = localStorage.getItem("kredmart_email");
      if (cachedEmail) setInitialEmail(cachedEmail);
    }
  }, []);

  useEffect(() => {
    if (error) {
      const errorMessageMap: Record<string, string> = {
        UserNotFound:
          "We could not find an account associated with your Google email.",
        Unauthorized: "Your Google account could not be authenticated.",
        Default: "An unknown error occurred. Please try again.",
      };
      const message = errorMessageMap[error ?? ""] ?? "";
      if (message) {
        toast.error(message);
      }
    }
  }, [error]);

  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync, loading } = useLogin();

  // Import Zustand auth store dynamically to avoid SSR issues
  const { useAuth } = require("@/store/auth-store");
  const setUser = useAuth((s: any) => s.setUser);

  const handleGoogleLogin = async () => {
    router.push("/api/google/login");
  };

  async function onSubmit(data: loginSchemaType) {
    // Cache email in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("kredmart_email", data.email);
    }
    await mutateAsync({ ...data }).then(async (result) => {
      // Store token based on remember
      if (result?.token) {
        if (remember) {
          localStorage.setItem("kredmart_token", result.token);
        } else {
          sessionStorage.setItem("kredmart_token", result.token);
        }
      }
      // Fetch user profile from backend
      try {
        const { fetchUser } = require("@/lib/services/user/user");
        const userData = await fetchUser();
        // Map backend user fields to Zustand user shape
        setUser({
          firstName: userData.firstname,
          lastName: userData.lastname,
          email: userData.email,
          phone: userData.phone,
        });
      } catch (e) {
        // fallback: clear user
        setUser(null);
      }
      router.push("/welcome");
    });
  }

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: initialEmail,
      password: "",
    },
  });

  {
    /* Full-bleed background with leafy texture under content */
  }
  return (
    <section className="relative">
      {/* Layered background images */}
      <Image
        src="/bg-about.jpg"
        alt="Sign in background texture"
        fill
        className="absolute inset-0 -z-20 object-cover opacity-10"
        priority={false}
      />
      <img
        src="./images/signin-img.png"
        alt="Background"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover "
      />
      <div className="absolute inset-0 -z-30 bg-[#0F3D73]/50" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse md:grid md:min-h-[calc(100svh-64px)] min-h-[40vh] pt-14 md:pt-0 items-center gap-8 md:grid-cols-2">
          {/* Left: Brand + Headline over background */}
          <div className="text-white max-w-xl py-10 md:order-1">
            <div className="mb-10 inline-flex items-center gap-3">
              {/*<div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                <div className="h-5 w-5 rounded-full bg-white" />
              </div>*/}
              <span className="text-2xl font-semibold tracking-tight">
                KredMart
              </span>
            </div>

            <h1
              className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight whitespace-pre-line"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {`Finance Shopping\n When Needed`}
            </h1>

            <p
              className="mt-4 text-sm/6 text-white/85 max-w-md"
              style={{ fontFamily: " sans-serif" }}
            >
              <>
                Marketplace designed to make online shopping easier,
                <br />
                fairer, and more accessible to everyone.
              </>
            </p>

            {/* Simple progress indicators to echo the design */}
          </div>

          {/* Right: Auth Card */}
          <div className="flex w-full items-center justify-center py-10 md:order-2">
            <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-lg backdrop-blur-md md:p-8">
              <div className="text-xs font-medium text-muted-foreground">
                {"WELCOME BACK"}
              </div>
              <h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
                {"Log In to your Account"}
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mt-6 space-y-4"
                >
                  {/* Email */}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="youremail@mail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password with show/hide */}

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••••••"
                              className="pr-10"
                              minLength={6}
                              maxLength={20}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((v) => !v)}
                              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
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

                  {/* Remember + Forgot */}
                  <div className="mt-1 flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Checkbox
                        checked={remember}
                        onCheckedChange={(v) => setRemember(Boolean(v))}
                      />
                      <span>{"Remember me"}</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      {"Forgot Password?"}
                    </Link>
                  </div>

                  {/* Continue */}
                  <Button
                    type="submit"
                    className="mt-2 w-full h-11 bg-[#0F3D73]"
                    disabled={loading}
                  >
                    {loading ? "Continuing..." : "CONTINUE"}
                  </Button>

                  {/* Or separator */}
                  <div className="mt-4 flex items-center gap-3">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">
                      {"Or"}
                    </span>
                    <Separator className="flex-1" />
                  </div>

                  {/* Google button (placeholder) */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="w-full h-11 bg-transparent"
                  >
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#0F3D73] text-background text-[10px]">
                      {"G"}
                    </span>
                    {"Log In with Google"}
                  </Button>
                </form>
              </Form>

              {/* Footer link */}
              <div className="mt-6 text-center text-xs text-muted-foreground">
                {"New User? "}
                <Link href="/sign-up" className="font-semibold underline">
                  {"SIGN UP HERE"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
