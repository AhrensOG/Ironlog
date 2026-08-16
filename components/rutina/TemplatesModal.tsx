"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { mutate } from "swr";
import { BookOpen, CopyPlus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTemplates, type TemplateRes } from "@/lib/hooks/usePlantillas";
import { DIAS } from "@/lib/csv";
import { cn } from "@/lib/cn";

const NIVEL_COLOR: Record<string, string> = {
  principiante: "bg-success/10 text-success",
  intermedio: "bg-primary/10 text-primary",
  avanzado: "bg-warning/10 text-warning",
};

export function TemplatesModal({
  open,
  onClose,
  onInstanciada,
}: {
  open: boolean;
  onClose: () => void;
  onInstanciada: (routineId: string) => void;
}) {
  const t = useTranslations("plantillas");
  const { data: templates, isLoading, mutate: mutateTemplates } = useTemplates();
  const [creando, setCreando] = useState<Record<string, boolean>>({});

  async function handleInstantiate(tpl: TemplateRes) {
    setCreando((c) => ({ ...c, [tpl.id]: true }));
    const res = await fetch(`/api/templates/${tpl.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setCreando((c) => ({ ...c, [tpl.id]: false }));

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? t("error"));
      return;
    }

    const data = await res.json();
    toast.success(t("instantiated", { exercises: data.exercises }));
    await mutate("/api/routines");
    await mutateTemplates();
    onInstanciada(data.routine.id);
    onClose();
  }

  async function handleSaveOwn() {
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? t("error"));
      return;
    }

    toast.success(t("savedMine"));
    await mutateTemplates();
  }

  async function handleDelete(tpl: TemplateRes) {
    if (!confirm(t("confirmDelete"))) return;
    const res = await fetch(`/api/templates/${tpl.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error(t("error"));
      return;
    }
    toast.success(t("deleted"));
    await mutateTemplates();
  }

  return (
    <Modal open={open} onClose={onClose} title={t("title")} wide>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        <Button variant="outline" size="sm" onClick={handleSaveOwn}>
          <CopyPlus className="h-4 w-4" />
          {t("saveMine")}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-xl border border-border bg-surface/40 p-4"
            >
              <Skeleton className="h-5 w-1/2" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(templates ?? []).map((tpl) => (
            <div
              key={tpl.id}
              className="flex flex-col gap-2 rounded-xl border border-border bg-surface/40 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-card-foreground">
                  {tpl.name}
                </span>
                {tpl.isSeed && (
                  <span
                    className="flex items-center gap-1 text-[11px] text-warning"
                    title={t("officialHint")}
                  >
                    <Star className="h-3 w-3" />
                    {t("official")}
                  </span>
                )}
                {tpl.isOwn && !tpl.isSeed && (
                  <span className="text-[11px] text-muted-foreground">
                    {t("mine")}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium",
                    NIVEL_COLOR[tpl.level] ?? NIVEL_COLOR.principiante,
                  )}
                >
                  {t(`nivel_${tpl.level}`)}
                </span>
                {tpl.tags.map((e) => (
                  <span
                    key={e}
                    className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {e}
                  </span>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                {tpl.days.map((d) => DIAS[d - 1]).join(" · ")} ·{" "}
                {t("exercisesCount", { count: tpl.exercises })}
              </p>

              <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">
                {tpl.description}
              </p>

              {tpl.articles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tpl.articles.map((slug) => (
                    <Link
                      key={slug}
                      href={`/aprender/${slug}`}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <BookOpen className="h-3 w-3" />
                      {t("learn")}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-auto flex gap-2 pt-1">
                <Button
                  size="sm"
                  className="flex-1"
                  loading={creando[tpl.id]}
                  onClick={() => handleInstantiate(tpl)}
                >
                  {t("use")}
                </Button>
                {tpl.isOwn && !tpl.isSeed && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(tpl)}
                    aria-label={t("delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
