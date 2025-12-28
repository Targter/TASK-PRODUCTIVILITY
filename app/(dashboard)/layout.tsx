import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserCircle } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 dark:bg-gray-900 md:flex-row">
      {/* Sidebar - Hidden on mobile by default (controlled by CSS for simplicity in MVP) */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950 lg:px-6">
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Sidebar Trigger placeholder - For production we'd use a Sheet/Drawer */}
            <span className="font-bold text-gray-900 dark:text-white">
              ProdApp
            </span>
          </div>

          <div className="hidden md:block">
            {/* Breadcrumbs or Page Title could go here */}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 md:block">
                {session.user?.name}
              </span>
              <UserCircle className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-8">{children}</div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
