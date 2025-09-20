import StoreHeader from "@/components/store-header";

export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StoreHeader />
      {children}
    </>
  );
}
