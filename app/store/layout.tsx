import StoreHeader from "@/components/store-header";

export default function StoreLayout({
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
