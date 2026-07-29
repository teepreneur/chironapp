import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chironlearning.com"),
  title: {
    template: "%s | Chiron",
    default: "Chiron | Personal Tutoring & Client Management by Theia",
  },
  description: "Chiron provides professional teachers and client pairs with a streamlined tutoring, scheduling, and mobile money payment platform.",
  keywords: ["Chiron", "tutoring", "client management", "education platform", "Ghana tutoring", "private tutoring", "mobile money payments"],
  authors: [{ name: "Theia" }],
  creator: "Theia",
  publisher: "Theia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/brand/chiron-icon.svg",
    apple: "/brand/chiron-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
