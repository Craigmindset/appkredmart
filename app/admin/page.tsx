import React from "react";
import AdminSignIn from "./page-client";
import AdminGuest from "@/components/admin-guest";

const Page = () => {
  return (
    <AdminGuest>
      <AdminSignIn />
    </AdminGuest>
  );
};

export default Page;
