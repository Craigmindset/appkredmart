"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Shield, X } from "lucide-react";
import { useAdminRBACStore } from "@/store/admin-rbac-store";

// TODO: swap this for your real "register from invite" hook
// e.g. import { useAdminRegisterInvite } from "@/lib/services/auth/use-admin-register-invite";
import { useAdminLogin } from "@/lib/services/auth/use-admin-login";

type InvitePayload = {
  email: string;
};

export default function AdminCreateAccountFromInvite() {
  const router = useRouter();
  const params = useSearchParams();
  const { signIn } = useAdminRBACStore();

  // Using login as a placeholder – replace with register-hook mutate
  const { mutateAsync, loading } = useAdminLogin();

  const [showPasswords, setShowPasswords] = useState(false);
  const [resolvingInvite, setResolvingInvite] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Prefer token -> server validate; fallback to explicit email query param
  const token = params.get("token");
  const qpEmail = params.get("email");

  // For memoized fallback payload when no token
  const fallbackInvite = useMemo<InvitePayload | null>(() => {
    if (qpEmail) {
      return {
        email: decodeURIComponent(qpEmail),
      };
    }
    return null;
  }, [qpEmail]);

  useEffect(() => {
    let cancelled = false;

    async function resolveInvite() {
      try {
        // 1) Token flow (recommended)
        if (token) {
          const res = await fetch(
            `/api/invites/validate?token=${encodeURIComponent(token)}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!res.ok) {
            const { message } = await res
              .json()
              .catch(() => ({ message: "Invalid or expired link." }));
            throw new Error(message || "Invalid or expired link.");
          }

          const data = (await res.json()) as InvitePayload;

          if (!cancelled) {
            setFormData((prev) => ({
              ...prev,
              email: data.email,
            }));
          }
        }
        // 2) Fallback to explicit query params if present
        else if (fallbackInvite) {
          if (!cancelled) {
            setFormData((prev) => ({
              ...prev,
              email: fallbackInvite.email,
            }));
          }
        } else {
          // No token and no email in query – guide user
          throw new Error(
            "Missing invite information. Please use the invite link from your email."
          );
        }
      } catch (err: any) {
        toast({
          title: "Invite error",
          description: err?.message || "We couldn’t validate your invite link.",
          variant: "destructive",
        });
      } finally {
        if (!cancelled) setResolvingInvite(false);
      }
    }

    resolveInvite();
    return () => {
      cancelled = true;
    };
  }, [token, fallbackInvite]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please set your password and confirm it.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    // TODO: call your register-from-invite endpoint/hook:
    // await registerInviteMutateAsync({ token, email, password })
    // If you're not using token flow, your backend should still verify the invite record by email.
    await mutateAsync({ email, password }).then(() => {
      // Optionally auto sign-in after successful registration
      signIn(email);

      toast({
        title: "Account created",
        description: `Welcome!`,
      });

      router.replace("/admin");
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-16 md:py-32"
      style={{
        backgroundImage: "url('/images/login-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => router.push("/admin")}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>

          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Shield className="h-6 w-6" />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold">
            Create Admin Account
          </CardTitle>
          <p className="text-gray-600">
            Complete your invite to access KredMart Admin
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email (pre-filled + locked) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                readOnly
                disabled
                className="bg-gray-100"
              />
              {/* Keep a hidden input to ensure email is posted even if the visible one is disabled */}
              <input type="hidden" name="email" value={formData.email} />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPasswords ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="pr-10"
                  required
                  minLength={8}
                  maxLength={64}
                  autoComplete="new-password"
                  disabled={resolvingInvite}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPasswords((s) => !s)}
                  disabled={resolvingInvite}
                >
                  {showPasswords ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="pr-10"
                  required
                  minLength={8}
                  maxLength={64}
                  autoComplete="new-password"
                  disabled={resolvingInvite}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPasswords((s) => !s)}
                  disabled={resolvingInvite}
                >
                  {showPasswords ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || resolvingInvite}
            >
              {loading || resolvingInvite ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {resolvingInvite ? "Validating invite..." : "Creating..."}
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Optional: helper for expired/failed links */}
            {!resolvingInvite && !formData.email && (
              <p className="text-sm text-red-600">
                Your invite link seems invalid or expired. Please request a new
                invite from your admin.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
