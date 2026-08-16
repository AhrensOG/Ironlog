"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { AlertTriangle, ChevronDown, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import type { TodayExerciseRes } from "@/lib/hooks/useHoy";
import { epley1RM } from "@/lib/progression";
import { cn } from "@/lib/cn";
import { formatWeight, formatRange } from "@/lib/format";
import { WeightInput } from "./WeightInput";

const ACCION_ICON: Record<string, { color: string; labelKey: string }> = {
  subirPeso: { color: "text-success", labelKey: "accSubirPeso" },
  sumarReps: { color: "text-success", labelKey: "accSumarReps" },
  saltoDoble: { color: "text-success", labelKey: "accSaltoDoble" },
  mantener: { color: "text-warning", labelKey: "accMantener" },
  bajarPeso: { color: "text-destructive", labelKey: "accBajarPeso" },
  protegerLesion: { color: "text-destructive", labelKey: "accProtegerLesion" },
  descarga: { color: "text-primary", labelKey: "accDescarga" },
};

export function ExerciseLogCard({
  exercise,
  ensureSession,
  onSaved,
  blockId,
}: {
  exercise: TodayExerciseRes;
  ensureSession: () => Promise<string | null>;
  onSaved: () => void;
  blockId: string | null;
}) {
  const t = useTranslations("hoy");

  const [weight, setPeso] = useState(
    String(exercise.todayLog?.actualWeight ?? exercise.suggestion.weight),
  );
  const [reps, setReps] = useState(
    String(exercise.todayLog?.actualReps ?? exercise.suggestion.reps),
  );
  const [sets, setSeries] = useState(
    String(exercise.todayLog?.setsDone ?? exercise.sets),
  );
  const [rir, setRir] = useState<number | null>(
    exercise.todayLog?.rir ?? exercise.baseRir,
  );
  const [isPR, setFlagPR] = useState(exercise.todayLog?.isPR ?? false);
  const [isInjury, setFlagLesion] = useState(
    exercise.todayLog?.isInjury ?? false,
  );
  const [note, setNota] = useState(exercise.todayLog?.note ?? "");
  const [noteOpen, setNotaAbierta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setGuardado] = useState(exercise.todayLog != null);

  // ── Test AMRAP (week de descarga) ──
  const [amrapWeight, setAmrapPeso] = useState(
    String(exercise.amrap?.saved?.weight ?? exercise.amrap?.week6Weight ?? 0),
  );
  const [amrapReps, setAmrapReps] = useState(
    exercise.amrap?.saved?.reps ? String(exercise.amrap.saved.reps) : "",
  );
  const [amrapLoading, setAmrapLoading] = useState(false);
  const amrapE1rm =
    Number(amrapWeight) > 0 && Number(amrapReps) > 0
      ? epley1RM(Number(amrapWeight), Number(amrapReps))
      : null;

  async function handleSaveAmrap() {
    if (!blockId) return;
    setAmrapLoading(true);
    const res = await fetch(`/api/blocks/${blockId}/amrap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routineExerciseId: exercise.id,
        weight: Number(amrapWeight) || 0,
        reps: Number(amrapReps) || 0,
      }),
    });
    setAmrapLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? t("saveError"));
      return;
    }

    const data = await res.json();
    toast.success(t("amrapSaved"), {
      description: `${t("e1rmLabel")}: ${formatWeight(data.e1rm)} kg`,
    });
    onSaved();
  }

  async function handleSave() {
    const sessionId = await ensureSession();
    if (!sessionId) return;

    setLoading(true);
    const res = await fetch("/api/session-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        routineExerciseId: exercise.id,
        actualWeight: Number(weight) || 0,
        setsDone: Number(sets) || 0,
        actualReps: Number(reps) || 0,
        rir,
        isPR,
        isInjury,
        note: note || null,
      }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? t("saveError"));
      return;
    }

    const data = await res.json();
    if (data.esPR) {
      toast.success(t("prToast"), { icon: <Trophy className="h-4 w-4" /> });
    } else {
      toast.success(t("saved"));
    }
    setGuardado(true);
    onSaved();
  }

  async function handleVariantChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const group = exercise.group;
    if (!group) return;
    const res = await fetch(`/api/routine-exercises/${group.parentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activeVariantId: e.target.value }),
    });
    if (!res.ok) {
      toast.error(t("saveError"));
      return;
    }
    onSaved();
  }

  const actionInfo = ACCION_ICON[exercise.suggestion.action] ?? ACCION_ICON.mantener;

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-card-foreground">
              {exercise.name}
            </span>
            {exercise.muscleGroup && (
              <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-surface-foreground">
                {exercise.muscleGroup.name}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {formatRange(exercise)}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setFlagPR((v) => !v)}
            className={cn(
              "pressable flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
              isPR
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
            title={t("pr")}
          >
            <Trophy className="h-4 w-4" />
          </button>
          <button
            onClick={() => setFlagLesion((v) => !v)}
            className={cn(
              "pressable flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
              isInjury
                ? "border-destructive/50 bg-destructive/10 text-destructive"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
            title={t("lesion")}
          >
            <AlertTriangle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {exercise.group && (
        <div className="mt-2">
          {exercise.group.mode === "manual" ? (
            <select
              value={exercise.group.activeId}
              onChange={handleVariantChange}
              className="pressable h-8 rounded-lg border border-input bg-card px-2 text-xs text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {exercise.group.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          ) : (
            <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-surface-foreground">
              {t("autoRotation")} ·{" "}
              {exercise.group.variants.find(
                (v) => v.id === exercise.group!.activeId,
              )?.name ?? ""}
            </span>
          )}
        </div>
      )}

      {!saved && (
        <div className="mt-3 rounded-lg border border-border bg-surface/50 px-3 py-2 text-xs">
          <span className={cn("font-semibold", actionInfo.color)}>
            {t(actionInfo.labelKey)}:{" "}
          </span>
          <span className="text-muted-foreground">
            {formatRange({ sets: exercise.sets, minReps: exercise.suggestion.reps, maxReps: exercise.suggestion.reps })} ·{" "}
            {exercise.suggestion.weight > 0 ? `${exercise.suggestion.weight} kg` : "corporal"}
          </span>
          <p className="mt-1 text-muted-foreground">{exercise.suggestion.reason}</p>
          {exercise.last && (
            <p className="mt-1 text-muted-foreground/70">
              {t("lastLog")}: {exercise.last.actualWeight} kg × {exercise.last.actualReps}{" "}
              {exercise.last.rir != null && `· RIR ${exercise.last.rir}`}
            </p>
          )}
        </div>
      )}

      {saved && (
        <p className="mt-3 text-xs text-success">
          ✓ {t("savedAt")} { weight } kg × {reps} {rir != null ? `· RIR ${rir}` : ""}
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3">
        <WeightInput
          weightType={exercise.weightType}
          fixedBar={exercise.fixedBar}
          value={ weight }
          onChange={setPeso}
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground">{t("reps")}</label>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-lg font-semibold text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">{t("sets")}</label>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={ sets }
              onChange={(e) => setSeries(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-lg font-semibold text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1 flex items-center gap-1.5">
          <label className="text-sm font-medium text-foreground">{t("rir")}</label>
          <Link href="/aprender/rir" className="text-xs text-primary hover:underline">
            {t("whatIs")}
          </Link>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRir(n)}
              className={cn(
                "pressable h-9 min-w-9 rounded-lg border px-2 text-sm font-semibold transition-colors",
                rir === n
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setNotaAbierta((v) => !v)}
        className="pressable mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ChevronDown className={cn("h-3 w-3 transition-transform", noteOpen && "rotate-180")} />
        {t("note")} {note && `(${note.length})`}
      </button>
      {noteOpen && (
        <Textarea
          rows={2}
          value={ note }
          onChange={(e) => setNota(e.target.value)}
          placeholder={t("notePlaceholder")}
          className="mt-1"
        />
      )}

      {exercise.amrap && blockId && (
        <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-primary">
              {t("amrapTitle")}
            </span>
            <Link href="/aprender/descarga-y-test" className="text-[11px] text-primary hover:underline">
              {t("howTo")}
            </Link>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {t("amrapHint", {
              week: 6,
              weight: exercise.amrap.week6Weight,
            })}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-foreground">
                {t("amrapWeight")}
              </label>
              <input
                type="number"
                min={0}
                step={0.25}
                inputMode="decimal"
                value={amrapWeight}
                onChange={(e) => setAmrapPeso(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-input bg-card px-2.5 text-sm font-semibold text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-foreground">
                {t("amrapReps")}
              </label>
              <input
                type="number"
                min={0}
                max={100}
                inputMode="numeric"
                value={amrapReps}
                onChange={(e) => setAmrapReps(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-input bg-card px-2.5 text-sm font-semibold text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              {amrapE1rm != null ? (
                <>
                  {t("e1rmLabel")}:{" "}
                  <span className="font-semibold text-success">
                    {formatWeight(amrapE1rm)} kg
                  </span>
                </>
              ) : (
                t("e1rmHint")
              )}
            </span>
            <Button size="sm" variant="outline" loading={amrapLoading} onClick={handleSaveAmrap}>
              {exercise.amrap.saved ? t("update") : t("save")}
            </Button>
          </div>
        </div>
      )}

      <Button
        onClick={handleSave}
        loading={loading}
        className="mt-3 w-full"
        variant={saved ? "outline" : "primary"}
      >
        {saved ? t("update") : t("saveLog")}
      </Button>
    </div>
  );
}
