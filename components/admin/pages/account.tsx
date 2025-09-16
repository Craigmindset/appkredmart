"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { useAdminRoleAssign } from "@/lib/services/admin/role-assign";
import {
  Camera,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Send,
  Shield,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFetchAdminTeam } from "@/lib/services/admin/fetch-admin-team";
import { useUser } from "@/lib/services/user/user";
import { useUpdateAdminAccount } from "@/lib/services/admin/use-update-admin-account";
import { useUploadMedia } from "@/lib/services/upload/useUploadMedia";
import { useUpdatePassword } from "@/lib/services/user/use-update-password";

export default function AccountAdminPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { user } = useUser();
  const { mutateAsync, loading: isUpdatingProfile } = useUpdateAdminAccount();
  const { mutateAsync: uploadMedia, isPending: pictureLoading } =
    useUploadMedia();

  const { mutateAsync: updatePassword, loading: isChangingPassword } =
    useUpdatePassword();
  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstname || "",
    lastName: "User",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    bio: "System Administrator for KredMart platform",
  });

  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({ ...prev, firstName: user.firstname }));
      setProfileData((prev) => ({ ...prev, lastName: user.lastname }));
      setProfileData((prev) => ({ ...prev, email: user.email }));
      setProfileData((prev) => ({ ...prev, phone: user.phone }));
      setProfileData((prev) => ({ ...prev, address: user.address || "" }));
      setProfileData((prev) => ({ ...prev, bio: user.bio || "" }));
    }
  }, [user]);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
      await mutateAsync({ picture: response.original }).then(() => {
        toast.success("Profile image updated successfully");
      });
    });

    // const reader = new FileReader();
    // reader.onload = () => setAvatarUrl(String(reader.result || ""));
    // reader.readAsDataURL(file);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync({
      firstname: profileData.firstName,
      lastname: profileData.lastName,
      bio: profileData.bio,
      address: profileData.bio,
      phone: profileData.phone,
    }).then(() => {
      toast.success("Profile Updated", {
        description: "Your profile has been successfully updated.",
      });
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Error", {
        description: "New passwords do not match.",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Error", {
        description: "Password must be at least 8 characters long.",
      });
      return;
    }

    await updatePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword,
    }).then(() => {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your profile, security, and team access
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Management
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={
                          user?.picture || "/placeholder.svg?height=96&width=96"
                        }
                      />
                      <AvatarFallback className="bg-blue-600 text-white text-xl">
                        {profileData.firstName[0]}
                        {profileData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    {/* <Button
                      type="button"
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button> */}
                    <label className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full px-1 bg-primary text-primary-foreground inline-flex items-center justify-center">
                      {pictureLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onAvatarChange}
                        disabled={pictureLoading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-gray-600">{profileData.email}</p>
                    <Badge variant="secondary" className="mt-1">
                      Super Admin
                    </Badge>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      className="flex items-center gap-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        // onChange={(e) =>
                        //   setProfileData((prev) => ({
                        //     ...prev,
                        //     email: e.target.value,
                        //   }))
                        // }
                        disabled={true}
                        readOnly
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full md:w-auto"
                >
                  {isUpdatingProfile ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Profile
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full md:w-auto"
                >
                  {isChangingPassword ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Management Tab */}
        <TabsContent value="team" className="space-y-6">
          {/* Role Assignment */}
          <AdminRoleAssignment />
          {/* Team Members */}
          <TeamMembersPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const TeamMembersPanel = () => {
  const { data: teamMembers } = useFetchAdminTeam();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Members
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers?.map((member) => {
            let bg = "bg-white";
            if (member.position === "Manager") bg = "bg-red-50";
            else if (member.position === "Marketer") bg = "bg-orange-50";
            else if (member.position === "Finance") bg = "bg-blue-50";
            return (
              <div
                key={member.id}
                className={`flex items-center justify-between p-3 border rounded-md text-sm ${bg}`}
                style={{ minHeight: 64 }}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                    <AvatarFallback>
                      {`${member.firstname} ${member.lastname}`
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-sm">
                      {member.firstname} {member.lastname}
                    </h4>
                    <p className="text-xs text-gray-600">{member.email}</p>
                    <p className="text-xs text-gray-400">
                      Joined {formatDate(member.createdAt, "yyyy-MM-dd")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      member.position === "Manager"
                        ? "bg-red-100 text-red-700"
                        : member.position === "Marketer"
                        ? "bg-orange-100 text-orange-700"
                        : member.position === "Finance"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {member.position}
                  </span>
                  <Badge
                    variant={
                      member.firstname === "Active" ? "default" : "secondary"
                    }
                  >
                    {member.firstname ? "Active" : "Pending"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const AdminRoleAssignment = () => {
  // Role assignment state
  const { mutateAsync, loading: isSendingInvite } = useAdminRoleAssign();
  const [roleData, setRoleData] = useState({
    email: "",
    role: "",
  });

  const handleRoleAssignment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleData.email || !roleData.role) {
      toast.error("Error", {
        description: "Please fill in all fields.",
      });
      return;
    }

    await mutateAsync(roleData).then(() => {
      toast("Invitation Sent", {
        description: `Access link has been sent to ${roleData.email} for ${roleData.role} role.`,
      });
      setRoleData({ email: "", role: "" });
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Assign Role
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRoleAssignment} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roleEmail">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="roleEmail"
                  type="email"
                  placeholder="user@example.com"
                  value={roleData.email}
                  onChange={(e) =>
                    setRoleData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={roleData.role}
                onValueChange={(value) =>
                  setRoleData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Marketer">Marketer</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSendingInvite}
            className="w-full md:w-auto"
          >
            {isSendingInvite ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending Invite...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Access Link
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
