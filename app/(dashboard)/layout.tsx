"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserCircle, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";

// Note: Since we need state for the mobile menu, we turn the layout into a client component.
// The pages inside remain server components.

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="flex h-screen w-full flex-col bg-background md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (Overlay) */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="relative h-full w-64">
          <Sidebar
            className="h-full"
            onClose={() => setIsMobileMenuOpen(false)}
          />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute right-[-40px] top-4 rounded-full bg-white p-2 text-black"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="font-bold text-foreground">ProdApp</span>
          </div>

          <div className="hidden md:block">{/* Spacer */}</div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <span className="hidden text-sm font-medium text-foreground md:block">
                {session?.user?.name}
              </span>
              <UserCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in duration-500">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
