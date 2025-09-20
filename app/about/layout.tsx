import StoreHeader from "@/components/store-header";

export default function AboutLayout({
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
