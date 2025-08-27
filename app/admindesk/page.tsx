import MerchantGuest from "@/components/merchant-guest";
import React from "react";
import MerchantSignInPage from "./page-client";
import LayoutShell from "@/components/layout-shell";

const Page = () => {
  return (
    <LayoutShell showFooter={false}>
      <MerchantGuest>
        <MerchantSignInPage />
      </MerchantGuest>
    </LayoutShell>
  );
};

export default Page;
