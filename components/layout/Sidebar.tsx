"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  CalendarDays,
  CalendarRange,
  ClipboardList,
  Dumbbell,
  GraduationCap,
  LogOut,
  Settings,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/cn";

export interface NavItem {
  href: string;
  icon: typeof ClipboardList;
  key: string;
  mobile?: boolean;
}

export const navItems: NavItem[] = [
  { href: "/hoy", icon: ClipboardList, key: "hoy" },
  { href: "/rutina", icon: Dumbbell, key: "rutina" },
  { href: "/bloque", icon: CalendarRange, key: "bloque" },
  { href: "/semanal", icon: CalendarDays, key: "semanal" },
  { href: "/progreso", icon: TrendingUp, key: "progreso" },
  { href: "/aprender", icon: GraduationCap, key: "aprender" },
  { href: "/ajustes", icon: Settings, key: "ajustes", mobile: false },
];

export function Sidebar({ userName }: { userName?: string | null }) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Dumbbell className="h-4 w-4" />
        </div>
        <span className="text-lg font-bold text-foreground">IronLog</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith(item.href)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {t(item.key)}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border p-3">
        <div className="mb-2 truncate px-3 text-xs text-muted-foreground">
          {userName}
        </div>
        <button
          onClick={() => signOut({ redirectTo: "/" })}
          className="pressable flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          {t("salir")}
        </button>
      </div>
    </aside>
  );
}
