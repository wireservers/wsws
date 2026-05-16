import type { Metadata } from "next";
import { ClientProviders } from "@/components/ClientProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Wireservers Template",
    template: "%s | Wireservers Template",
  },
  description: "Wireservers template shell app with ws-security MSAL integration.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="theme-light">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
