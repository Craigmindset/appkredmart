"use client";
import Welcome from "@/components/welcome";
import { useUser } from "@/lib/services/user/user";
import { useEffect, useState } from "react";

export default function WelcomePage() {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const username = user?.firstname || "User";
  return <Welcome username={username} />;
}
