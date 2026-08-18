"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { mutate } from "swr";
import { ArrowLeftRight, Download, GitBranch, LayoutTemplate, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  useMuscleGroups,
  useRoutineDetail,
  useRoutines,
  type ExerciseRes,
  type RoutineSummary,
} from "@/lib/hooks/useRutina";
import { DIAS } from "@/lib/csv";
import { formatLoad, formatRange } from "@/lib/format";
import { ExerciseForm } from "./ExerciseForm";
import { ImportRutinaModal } from "./ImportRutinaModal";
import { MethodConfigPanel } from "./MethodConfigPanel";
import { TemplatesModal } from "./TemplatesModal";
import { CatalogoModal } from "./CatalogoModal";
import type { CatalogItem } from "@/lib/hooks/useCatalogo";
import { cn } from "@/lib/cn";
import { todayISO } from "@/lib/dates";
import { RutinaSkeleton } from "./RutinaSkeleton";

export function RutinaView() {
  const t = useTranslations("rutina");
  const { data: routines, isLoading } = useRoutines();
  const { data: muscleGroups } = useMuscleGroups();

  const [routineId, setRoutineId] = useState<string | null>(null);
  const activeId =
    routines?.find((r) => r.isActive)?.id ?? routines?.[0]?.id ?? null;
  const effectiveId = routineId ?? activeId;
  const { data: detail } = useRoutineDetail(effectiveId);

  const [activeDay, setActiveDay] = useState(1);
  const [exerciseModal, setExerciseModal] = useState<
    ExerciseRes | "nuevo" | { varianteDe: ExerciseRes } | null
  >(null);
  const [showCatalog, setShowCatalog] = useState<
    | { mode: "variante"; parent: ExerciseRes }
    | { mode: "exercise" }
    | { mode: "cambiar"; exercise: ExerciseRes }
    | null
  >(null);
  const [showImport, setShowImport] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showNewRoutine, setShowNewRoutine] = useState(false);
  const [routineToDelete, setRoutineToDelete] = useState<RoutineSummary | null>(null);
  const [deletingRoutine, setDeletingRoutine] = useState(false);
  const [routineToRename, setRoutineToRename] = useState<RoutineSummary | null>(null);
  const [renameName, setRenameName] = useState("");
  const [renameDate, setRenameDate] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState(todayISO());
  const [creando, setCreating] = useState(false);

  const dayExercises = (detail?.exercises ?? []).filter(
    (e) => e.weekday === activeDay,
  );

  const dayParents = dayExercises.filter((e) => e.variantOfId == null);
  const childrenOf = new Map<string, ExerciseRes[]>();
  for (const e of dayExercises) {
    if (!e.variantOfId) continue;
    const list = childrenOf.get(e.variantOfId) ?? [];
    list.push(e);
    childrenOf.set(e.variantOfId, list);
  }

  async function handleRotation(e: ExerciseRes, mode: string) {
    const res = await fetch(`/api/routine-exercises/${e.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rotationMode: mode }),
    });
    if (!res.ok) {
      toast.error(t("saveError"));
      return;
    }
    toast.success(t("saved"));
    await mutate(`/api/routines/${effectiveId}`);
  }

  async function handleCreateCatalogExercise(cat: CatalogItem) {
    if (!effectiveId) return;
    const res = await fetch("/api/routine-exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routineId: effectiveId,
        catalogExerciseId: cat.id,
        weekday: activeDay,
        sets: 3,
        minReps: 8,
        maxReps: 12,
        currentLoad: 0,
        equipmentIncrement: 2.5,
        baseRir: 2,
        fixedBar: null,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? t("saveError"));
      return;
    }
    toast.success(t("created"));
    await mutate(`/api/routines/${effectiveId}`);
    await mutate("/api/routines");
    setShowCatalog(null);
  }

  async function handleCreateCatalogVariant(parent: ExerciseRes, cat: CatalogItem) {
    if (!effectiveId) return;
    const res = await fetch("/api/routine-exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routineId: effectiveId,
        variantOfId: parent.id,
        catalogExerciseId: cat.id,
        weekday: parent.weekday,
        sets: parent.sets,
        minReps: parent.minReps,
        maxReps: parent.maxReps,
        currentLoad: 0,
        equipmentIncrement: parent.equipmentIncrement,
        baseRir: parent.baseRir,
        fixedBar: parent.fixedBar,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? t("saveError"));
      return;
    }
    toast.success(t("created"));
    await mutate(`/api/routines/${effectiveId}`);
    await mutate("/api/routines");
    setShowCatalog(null);
  }

  async function handleSwapCatalogExercise(exercise: ExerciseRes, cat: CatalogItem) {
    const res = await fetch(`/api/routine-exercises/${exercise.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ catalogExerciseId: cat.id }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? t("saveError"));
      return;
    }
    toast.success(t("swapped"));
    await mutate(`/api/routines/${effectiveId}`);
    setShowCatalog(null);
  }

  async function handleDeleteRoutine() {
    if (!routineToDelete) return;
    setDeletingRoutine(true);
    const res = await fetch(`/api/routines/${routineToDelete.id}`, {
      method: "DELETE",
    });
    setDeletingRoutine(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? t("saveError"));
      setRoutineToDelete(null);
      return;
    }

    toast.success(t("routineDeleted"));
    if (effectiveId === routineToDelete.id) {
      setRoutineId(null);
    }
    await mutate("/api/routines");
    setRoutineToDelete(null);
  }

  async function handleRenameRoutine() {
    if (!routineToRename) return;
    setRenaming(true);
    const res = await fetch(`/api/routines/${routineToRename.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: renameName.trim(), startDate: renameDate || undefined }),
    });
    setRenaming(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? t("saveError"));
      return;
    }

    toast.success(t("routineRenamed"));
    await mutate("/api/routines");
    await mutate(`/api/routines/${routineToRename.id}`);
    setRoutineToRename(null);
  }

  async function handleNewRoutine() {
    setCreating(true);
    const res = await fetch("/api/routines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, startDate: newDate }),
    });
    setCreating(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? t("saveError"));
      return;
    }

    const data = await res.json();
    toast.success(t("routineCreated"));
    await mutate("/api/routines");
    setRoutineId(data.id);
    setShowNewRoutine(false);
    setNewName("");
  }

  async function handleActivate() {
    if (!effectiveId) return;
    const res = await fetch(`/api/routines/${effectiveId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });
    if (!res.ok) {
      toast.error(t("saveError"));
      return;
    }
    toast.success(t("routineActivated"));
    await mutate("/api/routines");
    await mutate(`/api/routines/${effectiveId}`);
  }

  async function handleDelete(exercise: ExerciseRes) {
    if (!confirm(t("confirmDelete"))) return;
    const res = await fetch(`/api/routine-exercises/${exercise.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error(t("saveError"));
      return;
    }
    toast.success(t("deleted"));
    await mutate(`/api/routines/${effectiveId}`);
    await mutate("/api/routines");
  }

  if (isLoading) {
    return <RutinaSkeleton />;
  }

  // Los modales se montan siempre (también con 0 rutinas) para que los
  // botones del status vacío funcionen.
  const modales = (
    <>
      <Modal
        open={exerciseModal !== null}
        onClose={() => setExerciseModal(null)}
        title={
          exerciseModal === "nuevo"
            ? t("addExercise")
            : exerciseModal !== null && "varianteDe" in exerciseModal
              ? t("addVariant")
              : t("editExercise")
        }
        wide
      >
        {exerciseModal !== null && effectiveId && (
          <ExerciseForm
            routineId={effectiveId}
            muscleGroups={muscleGroups ?? []}
            exercise={
              exerciseModal !== "nuevo" && !("varianteDe" in exerciseModal)
                ? exerciseModal
                : undefined
            }
            varianteDe={
              exerciseModal !== "nuevo" && "varianteDe" in exerciseModal
                ? exerciseModal.varianteDe
                : undefined
            }
            diaPorDefecto={activeDay}
            onClose={() => setExerciseModal(null)}
          />
        )}
      </Modal>

      <ImportRutinaModal open={showImport} onClose={() => setShowImport(false)} />

      <TemplatesModal
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        onInstanciada={(id) => {
          setRoutineId(id);
          mutate("/api/routines");
        }}
      />

      <CatalogoModal
        open={showCatalog !== null}
        onClose={() => setShowCatalog(null)}
        title={
          showCatalog?.mode === "variante"
            ? t("addVariant")
            : showCatalog?.mode === "cambiar"
              ? t("swapExercise")
              : t("addExercise")
        }
        grupoId={
          showCatalog?.mode === "variante"
            ? showCatalog.parent.muscleGroup?.id ?? null
            : null
        }
        excluirNombres={
          showCatalog?.mode === "variante"
            ? new Set([
                showCatalog.parent.name,
                ...(childrenOf.get(showCatalog.parent.id) ?? []).map((h) => h.name),
              ])
            : showCatalog?.mode === "cambiar"
              ? new Set([
                  showCatalog.exercise.name,
                  ...dayExercises
                    .filter((x) =>
                      showCatalog.exercise.variantOfId == null
                        ? x.variantOfId === showCatalog.exercise.id
                        : x.variantOfId === showCatalog.exercise.variantOfId ||
                          x.id === showCatalog.exercise.variantOfId,
                    )
                    .map((x) => x.name),
                ])
              : undefined
        }
        textoPersonalizado={t("createCustom")}
        onCrearPersonalizado={() => {
          if (showCatalog?.mode === "variante") {
            setExerciseModal({ varianteDe: showCatalog.parent });
          } else if (showCatalog?.mode === "cambiar") {
            setExerciseModal(showCatalog.exercise);
          } else {
            setExerciseModal("nuevo");
          }
          setShowCatalog(null);
        }}
        onSeleccion={(cat) =>
          showCatalog?.mode === "variante"
            ? handleCreateCatalogVariant(showCatalog.parent, cat)
            : showCatalog?.mode === "cambiar"
              ? handleSwapCatalogExercise(showCatalog.exercise, cat)
              : handleCreateCatalogExercise(cat)
        }
      />

      <Modal
        open={routineToRename !== null}
        onClose={() => setRoutineToRename(null)}
        title={t("renameRoutine")}
      >
        <div className="flex flex-col gap-4">
          <Input
            label={t("routineName")}
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            required
          />
          <Input
            label={t("startDate")}
            type="date"
            value={renameDate}
            onChange={(e) => setRenameDate(e.target.value)}
            hint={t("startDateHint")}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRoutineToRename(null)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleRenameRoutine} loading={renaming}>
              {t("save")}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={routineToDelete !== null}
        onClose={() => setRoutineToDelete(null)}
        title={t("deleteRoutine")}
      >
        {routineToDelete && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {routineToDelete.isActive
                ? t("cannotDeleteActive")
                : t("confirmDeleteRoutine", {
                    name: routineToDelete.name,
                    logs: routineToDelete.logs,
                  })}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRoutineToDelete(null)}>
                {t("cancel")}
              </Button>
              {!routineToDelete.isActive && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteRoutine}
                  loading={deletingRoutine}
                >
                  {t("delete")}
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={showNewRoutine}
        onClose={() => setShowNewRoutine(false)}
        title={t("newRoutine")}
      >
        <div className="flex flex-col gap-4">
          <Input
            label={t("routineName")}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <Input
            label={t("startDate")}
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNewRoutine(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleNewRoutine} loading={creando}>
              {t("create")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );

  if (!routines?.length) {
    return (
      <>
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <p className="text-muted-foreground">{t("noRoutine")}</p>
          <div className="flex gap-3">
            <Button onClick={() => setShowTemplates(true)}>
              <LayoutTemplate className="h-4 w-4" />
              {t("chooseTemplate")}
            </Button>
            <Button variant="outline" onClick={() => setShowImport(true)}>
              <Upload className="h-4 w-4" />
              {t("importRoutine")}
            </Button>
            <Button variant="outline" onClick={() => setShowNewRoutine(true)}>
              <Plus className="h-4 w-4" />
              {t("newRoutine")}
            </Button>
          </div>
        </div>
        {modales}
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={effectiveId ?? ""}
          onChange={(e) => setRoutineId(e.target.value)}
          className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {routines.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} {r.isActive ? `(${t("active")})` : ""}
            </option>
          ))}
        </select>
        <Button
          variant="ghost"
          size="icon"
          className="pressable h-10 w-10 text-muted-foreground hover:text-foreground"
          onClick={() => {
            const target = routines.find((r) => r.id === effectiveId);
            if (!target) return;
            setRenameName(target.name);
            setRenameDate(target.startDate);
            setRoutineToRename(target);
          }}
          aria-label={t("renameRoutine")}
          title={t("renameRoutine")}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="pressable h-10 w-10 text-muted-foreground hover:text-destructive"
          onClick={() => {
            const target = routines.find((r) => r.id === effectiveId);
            if (target) setRoutineToDelete(target);
          }}
          aria-label={t("deleteRoutine")}
          title={t("deleteRoutine")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowNewRoutine(true)}>
          <Plus className="h-4 w-4" />
          {t("newRoutine")}
        </Button>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)}>
            <LayoutTemplate className="h-4 w-4" />
            {t("templates")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
            <Upload className="h-4 w-4" />
            {t("importCsv")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (effectiveId) window.open(`/api/routines/${effectiveId}/export`, "_blank");
            }}
          >
            <Download className="h-4 w-4" />
            {t("exportCsv")}
          </Button>
        </div>
      </div>

      {detail && !detail.isActive && (
        <div className="flex items-center justify-between rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
          {t("notActive")}
          <Button size="sm" variant="outline" onClick={handleActivate}>
            {t("activate")}
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {DIAS.map((d, i) => {
          const tiene = (detail?.exercises ?? []).some((e) => e.weekday === i + 1);
          return (
            <button
              key={d}
              onClick={() => setActiveDay(i + 1)}
              className={cn(
                "pressable relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                activeDay === i + 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-surface-foreground hover:bg-muted",
              )}
            >
              {d}
              {tiene && (
                <span
                  className={cn(
                    "absolute -right-1 -top-1 h-2 w-2 rounded-full",
                    activeDay === i + 1 ? "bg-primary-foreground" : "bg-primary",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {dayExercises.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("emptyDay")}</p>
        )}
        {dayParents.map((e) => {
          const children = childrenOf.get(e.id) ?? [];
          return (
            <div key={e.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-card-foreground">{e.name}</span>
                    {e.muscleGroup && (
                      <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-surface-foreground">
                        {e.muscleGroup.name}
                      </span>
                    )}
                    {children.length > 0 && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                        {t("variantsCount", { count: children.length })}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatRange(e)} · RIR {e.baseRir} · {formatLoad(e)}
                  </p>
                  {children.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <select
                        value={e.rotationMode}
                        onChange={(ev) => handleRotation(e, ev.target.value)}
                        className="pressable h-8 rounded-lg border border-input bg-card px-2 text-xs text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="manual">{t("rotManual")}</option>
                        <option value="alternarSemana">{t("rotAlternar")}</option>
                        <option value="porEstancamiento">{t("rotEstancado")}</option>
                      </select>
                      {e.activeVariantId && (
                        <span className="text-xs text-muted-foreground">
                          {t("activeVariant")}:{" "}
                          {children.find((h) => h.id === e.activeVariantId)?.name ?? "—"}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowCatalog({ mode: "variante", parent: e })}
                  className="pressable flex h-9 w-9 items-center justify-center rounded-lg text-primary hover:bg-primary/10"
                  aria-label={t("addVariant")}
                  title={t("addVariant")}
                >
                  <GitBranch className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowCatalog({ mode: "cambiar", exercise: e })}
                  className="pressable flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label={t("swapExercise")}
                  title={t("swapExercise")}
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setExerciseModal(e)}
                  className="pressable flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label={t("edit")}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(e)}
                  className="pressable flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label={t("delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {children.map((h) => (
                <div
                  key={h.id}
                  className="ml-5 flex items-center gap-3 rounded-xl border border-dashed border-border bg-surface/30 p-3 sm:ml-8"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-card-foreground">
                        {h.name}
                      </span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        {t("variant")}
                      </span>
                      {e.activeVariantId === h.id && (
                        <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                          {t("activeVariantBadge")}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatRange(h)} · RIR {h.baseRir} · {formatLoad(h)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCatalog({ mode: "cambiar", exercise: h })}
                    className="pressable flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label={t("swapExercise")}
                    title={t("swapExercise")}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setExerciseModal(h)}
                    className="pressable flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label={t("edit")}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(h)}
                    className="pressable flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label={t("delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          );
        })}
        <Button
          variant="outline"
          onClick={() => setShowCatalog({ mode: "exercise" })}
          className="w-full border-dashed"
        >
          <Plus className="h-4 w-4" />
          {t("addExercise")}
        </Button>
      </div>

      {detail?.methodConfig && (
        <MethodConfigPanel config={detail.methodConfig} routineId={detail.id} />
      )}
      </div>
      {modales}
    </>
  );
}
