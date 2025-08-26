import React from "react";
import AdminCreateAccountFromInvite from "./page-client";
import { redirect } from "next/navigation";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) => {
  const token = (await searchParams).token;
  if (!token) {
    redirect("/admin");
  }
  return <AdminCreateAccountFromInvite />;
};

export default Page;
