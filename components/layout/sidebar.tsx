"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  StickyNote,
  BellRing,
  BarChart,
  LogOut,
  Command,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "My Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Journal", href: "/notes", icon: StickyNote },
  { name: "Reminders", href: "/reminders", icon: BellRing },
  { name: "Analytics", href: "/analytics", icon: BarChart },
];

export function Sidebar({
  className,
  onClose,
}: {
  className?: string;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl transition-all",
        className
      )}
    >
      {/* Brand Header */}
      <Link href="/">
        <div className="flex h-14 items-center gap-2 border-b border-border px-6">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
            <Command className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-bold tracking-wide text-foreground">
            PROD<span className="opacity-50">.APP</span>
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-opacity",
                  isActive
                    ? "opacity-100"
                    : "opacity-70 group-hover:opacity-100"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-border p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="h-4 w-4 opacity-70 group-hover:opacity-100" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
