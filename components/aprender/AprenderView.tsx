"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { BookOpen, GraduationCap } from "lucide-react";
import { useLearningList } from "@/lib/hooks/useAprender";
import { cn } from "@/lib/cn";
import { AprenderSkeleton } from "./AprenderSkeleton";

const CATEGORIAS: Record<string, string> = {
  fundamentos: "Fundamentos",
  intensidad: "Intensidad",
  volumen: "Volumen",
  progresion: "Progresión",
  programacion: "Programación",
  biomecanica: "Biomecánica",
  fuerza: "Fuerza",
  practica: "Práctica",
};

const NIVEL_COLOR: Record<string, string> = {
  principiante: "bg-success/10 text-success",
  intermedio: "bg-primary/10 text-primary",
  avanzado: "bg-warning/10 text-warning",
};

export function AprenderView() {
  const t = useTranslations("aprender");
  const { data, isLoading, error } = useLearningList();
  const [filtro, setFiltro] = useState<string>("todos");

  const terms = useMemo(
    () => (data ?? []).filter((c) => c.type === "termino"),
    [data],
  );
  const articles = useMemo(
    () =>
      (data ?? [])
        .filter((c) => c.type === "articulo")
        .filter((c) => filtro === "todos" || c.category === filtro),
    [data, filtro],
  );

  const articleCategories = useMemo(
    () => [
      ...new Set(
        (data ?? [])
          .filter((c) => c.type === "articulo")
          .map((c) => c.category),
      ),
    ],
    [data],
  );

  if (isLoading) {
    return <AprenderSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">{t("loadError")}</p>
        <button
          onClick={() => window.location.reload()}
          className="pressable rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <GraduationCap className="h-5 w-5 text-primary" />
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground">{t("articles")}</h2>
        <div className="mb-3 flex flex-wrap gap-1.5">
          <button
            onClick={() => setFiltro("todos")}
            className={cn(
              "pressable rounded-lg px-3 py-1.5 text-sm font-medium",
              filtro === "todos"
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-surface-foreground hover:bg-muted",
            )}
          >
            {t("all")}
          </button>
          {articleCategories.map((c) => (
            <button
              key={c}
              onClick={() => setFiltro(c)}
              className={cn(
                "pressable rounded-lg px-3 py-1.5 text-sm font-medium",
                filtro === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-surface-foreground hover:bg-muted",
              )}
            >
              {CATEGORIAS[c] ?? c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/aprender/${a.slug}`}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="font-medium text-card-foreground">{a.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium",
                    NIVEL_COLOR[a.level] ?? NIVEL_COLOR.principiante,
                  )}
                >
                  {t(`nivel_${a.level}`)}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  {CATEGORIAS[a.category] ?? a.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground">{t("glossary")}</h2>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {terms.map((term) => (
            <Link
              key={term.slug}
              href={`/aprender/${term.slug}`}
              className="truncate rounded-lg bg-surface/50 px-3 py-2 text-sm text-surface-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {term.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
