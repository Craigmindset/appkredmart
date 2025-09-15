"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { uploadMedia } from "@/lib/services/upload/useUploadMedia";
import { useUpdateMerchantAccount } from "@/lib/services/user/use-update-merchant-account";
import { useUser } from "@/lib/services/user/user";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Account() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstname ?? "");
  const [lastName, setLastName] = useState(user?.lastname ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.picture ?? "");
  const initials =
    (firstName?.[0] ?? "") + (lastName?.[0] ?? (firstName ? "" : "U"));

  const { mutateAsync, loading } = useUpdateMerchantAccount();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstname ?? "");
      setLastName(user.lastname ?? "");
      setEmail(user.email ?? "");
      setAvatarUrl(user.picture ?? "");
    }
  }, [user]);

  const onAvatarChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Max 2MB",
      });
      return;
    }

    await uploadMedia(file).then(async (response) => {
      await mutateAsync({ picture: response.original });
    });

    // const reader = new FileReader();
    // reader.onload = () => setAvatarUrl(String(reader.result || ""));
    // reader.readAsDataURL(file);
  };

  const onSave = async () => {
    await mutateAsync({ firstname: firstName, lastname: lastName }).then(() => {
      toast.success("Profile updated");
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Avatar" />
            ) : null}
            <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
          </Avatar>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium">
            <Upload className="h-4 w-4" />
            <span>Change photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={onAvatarChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">First name</label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Last name</label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={true}
              readOnly
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave} disabled={loading}>
            {loading ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
