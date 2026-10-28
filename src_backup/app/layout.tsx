import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portal Warga RT 006 Vila Permata",
  description: "Portal informasi, administrasi, keuangan, dan fasilitas RT 006 Vila Permata.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
