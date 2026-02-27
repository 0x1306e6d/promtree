import type { ReactNode } from "react";
import Navigation from "./navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <Navigation />
      <main className="w-full max-w-4xl flex-1 px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}
