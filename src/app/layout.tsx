import type { Metadata } from "next";
import "./globals.css";
import NextAuthSessionProvider from "@/Providers/NextAuthSessionProvider";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "ShopVerse BD  |20 minutes grocery delivery",
  description:
    "ShopVerse BD is a complete online marketplace in Bangladesh, offering all types of products in one place — electronics, fashion, home essentials, groceries, and more. Fast delivery, trusted quality, and a seamless shopping experience, all in one universe of products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from-green-100 to-white">
        <ToastContainer />
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  );
}
