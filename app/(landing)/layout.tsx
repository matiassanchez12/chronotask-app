import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChonoTask - A simple and effective task manager",
  description: "ChonoTask is a simple and effective task manager that helps you organize your work and get things done.",
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
