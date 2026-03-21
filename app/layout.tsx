import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Provider } from "@/components/provider";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChonoTask - A simple and effective task manager",
  description: "ChonoTask is a simple and effective task manager that helps you organize your work and get things done.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ChonoTask - A simple and effective task manager",
    description: "ChonoTask is a simple and effective task manager that helps you organize your work and get things done.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Script defer src="https://cloud.umami.is/script.js" data-website-id="1b652a52-a59d-4ba0-9bcd-faf0d18c93db" />
        <Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Toaster richColors position="top-center" closeButton />
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
