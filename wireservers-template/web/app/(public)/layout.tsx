import { BottomTabNav } from "@/components/BottomTabNav";
import { Footer } from "@/components/Footer";
import { TabNav } from "@/components/TabNav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TabNav />
      <main style={{ padding: 16, paddingBottom: 56 }}>{children}</main>
      <Footer />
      <BottomTabNav />
    </>
  );
}
