import StoreHeader from "@/components/store-header";
import SiteHeader from "@/components/site-header";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
