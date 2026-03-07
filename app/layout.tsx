import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Provider } from "@/components/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tododoro - A simple and effective task manager",
  description: "Tododoro is a simple and effective task manager that helps you organize your work and get things done.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Tododoro - A simple and effective task manager",
    description: "Tododoro is a simple and effective task manager that helps you organize your work and get things done.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Provider>
          <Toaster richColors position="top-center" closeButton />
          {children}
        </Provider>
      </body>
    </html>
  );
}
