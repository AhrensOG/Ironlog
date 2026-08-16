"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LogOut, Moon, Settings, Sun } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTheme } from "@/components/theme-provider";

export function TopBar() {
  const t = useTranslations("nav");
  const { toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:px-8">
      <span className="text-sm font-medium text-muted-foreground">
        {new Date().toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={toggleTheme}
          className="pressable flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Cambiar tema"
        >
          <Sun className="hidden h-4 w-4 dark:block" />
          <Moon className="block h-4 w-4 dark:hidden" />
        </button>
        <Link
          href="/ajustes"
          className="pressable flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          aria-label={t("ajustes")}
        >
          <Settings className="h-4 w-4" />
        </Link>
        <button
          onClick={() => signOut({ redirectTo: "/" })}
          className="pressable flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          aria-label={t("salir")}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
