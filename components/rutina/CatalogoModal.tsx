"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useExerciseCatalog, type CatalogItem } from "@/lib/hooks/useCatalogo";
import { useMuscleGroups } from "@/lib/hooks/useRutina";
import { cn } from "@/lib/cn";

export function CatalogoModal({
  open,
  onClose,
  title,
  grupoId,
  excluirNombres,
  textoPersonalizado,
  onCrearPersonalizado,
  onSeleccion,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  grupoId?: string | null;
  excluirNombres?: Set<string>;
  textoPersonalizado: string;
  onCrearPersonalizado: () => void;
  onSeleccion: (cat: CatalogItem) => Promise<void>;
}) {
  const t = useTranslations("catalogo");
  const { data, isLoading } = useExerciseCatalog(grupoId);
  const { data: muscleGroups } = useMuscleGroups();
  const [search, setBusqueda] = useState("");
  const [groupFilter, setGrupoFiltro] = useState<string | null>(null);
  const [creando, setCreando] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    let lista = data ?? [];
    if (groupFilter) lista = lista.filter((c) => c.muscleGroup?.id === groupFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      lista = lista.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.pattern.toLowerCase().includes(q),
      );
    }
    if (excluirNombres?.size) {
      lista = lista.filter((c) => !excluirNombres.has(c.name));
    }
    return lista;
  }, [data, search, groupFilter, excluirNombres]);

  async function handleSelect(cat: CatalogItem) {
    setCreando(cat.id);
    try {
      await onSeleccion(cat);
    } finally {
      setCreando(null);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={ title } wide>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={t("search")}
              className="pl-9"
            />
          </div>
          <Button variant="outline" onClick={onCrearPersonalizado}>
            <Sparkles className="h-4 w-4" />
            {textoPersonalizado}
          </Button>
        </div>

        {!grupoId && (
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setGrupoFiltro(null)}
              className={cn(
                "pressable rounded-lg px-2.5 py-1 text-xs font-medium",
                groupFilter === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-surface-foreground hover:bg-muted",
              )}
            >
              {t("all")}
            </button>
            {(muscleGroups ?? []).map((g) => (
              <button
                key={g.id}
                onClick={() => setGrupoFiltro(g.id)}
                className={cn(
                  "pressable rounded-lg px-2.5 py-1 text-xs font-medium",
                  groupFilter === g.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-surface-foreground hover:bg-muted",
                )}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("empty")}
          </p>
        ) : (
          <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto pr-1">
            {filtrados.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat)}
                disabled={creando !== null}
                className="pressable flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/50 disabled:opacity-60"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-medium text-card-foreground">
                      {cat.name}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      {cat.pattern}
                    </span>
                    {!grupoId && cat.muscleGroup && (
                      <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-surface-foreground">
                        {cat.muscleGroup.name}
                      </span>
                    )}
                  </div>
                  {cat.description && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {cat.description}
                    </p>
                  )}
                </div>
                {creando === cat.id && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
