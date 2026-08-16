import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar userName={user.name} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col md:pl-60">
        <TopBar />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 pb-24 md:px-8 md:pb-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
