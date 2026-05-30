import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Omkar Power Solutions — AI-powered solar platform",
description: "Go solar with intelligent decisions — Omkar Power Solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <head />
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}