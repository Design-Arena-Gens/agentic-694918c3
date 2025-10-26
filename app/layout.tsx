import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Risk Monitoring Agent",
  description: "AI-powered risk monitoring and alert system for businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
