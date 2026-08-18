"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { navItems } from "./Sidebar";
import { NavLinkPending } from "./NavLinkPending";
import { preloadNavData } from "@/lib/nav-prefetch";
import { cn } from "@/lib/cn";

export function MobileNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="no-scrollbar fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around overflow-x-auto border-t border-border bg-card/95 px-1 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] backdrop-blur md:hidden">
      {navItems
        .filter((item) => item.mobile !== false)
        .map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onPointerDown={() => preloadNavData(item.href)}
          className={cn(
            "pressable relative flex min-w-16 shrink-0 flex-col items-center gap-0.5 whitespace-nowrap rounded-lg px-2 py-1 text-[10px] font-medium",
            pathname.startsWith(item.href)
              ? "text-primary"
              : "text-muted-foreground",
          )}
        >
          <item.icon className="h-5 w-5" />
          {t(item.key)}
          <NavLinkPending />
        </Link>
      ))}
    </nav>
  );
}
