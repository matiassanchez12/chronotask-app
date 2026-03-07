import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tododoro - A simple and effective task manager",
  description: "Tododoro is a simple and effective task manager that helps you organize your work and get things done.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-y-auto min-h-screen">
      {children}
    </div>
  );
}
