import React, { Suspense } from "react";
import AdminSignIn from "./page-client";
import AdminGuest from "@/components/admin-guest";

const Page = () => {
  return (
    <Suspense>
      <AdminGuest>
        <AdminSignIn />
      </AdminGuest>
    </Suspense>
  );
};

export default Page;
