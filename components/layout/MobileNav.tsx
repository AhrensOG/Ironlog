"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { navItems } from "./Sidebar";
import { cn } from "@/lib/cn";

export function MobileNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card/95 backdrop-blur md:hidden">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "pressable flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
            pathname.startsWith(item.href)
              ? "text-primary"
              : "text-muted-foreground",
          )}
        >
          <item.icon className="h-5 w-5" />
          {t(item.key)}
        </Link>
      ))}
    </nav>
  );
}
