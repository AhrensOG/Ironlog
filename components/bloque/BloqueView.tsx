"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarRange, Flag, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useBloque, type BlockExerciseRes } from "@/lib/hooks/useBloque";
import { cn } from "@/lib/cn";
import { formatWeight } from "@/lib/format";
import { DIAS } from "@/lib/csv";
import { BloqueSkeleton } from "./BloqueSkeleton";

function AmrapRow({
  exercise,
  bloqueId,
  e1rmInicial,
  onSaved,
}: {
  exercise: BlockExerciseRes;
  bloqueId: string;
  e1rmInicial: number | null;
  onSaved: () => void;
}) {
  const t = useTranslations("bloque");
  const [weight, setPeso] = useState(
    e1rmInicial != null ? "" : String(exercise.currentLoad),
  );
  const [reps, setReps] = useState("");
  const [e1rm, setE1rm] = useState(e1rmInicial);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    const res = await fetch(`/api/blocks/${bloqueId}/amrap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routineExerciseId: exercise.id,
        weight: Number(weight) || 0,
        reps: Number(reps),
      }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? t("saveError"));
      return;
    }

    const data = await res.json();
    setE1rm(data.e1rm);
    toast.success(t("amrapSaved"));
    onSaved();
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-end">
      <div className="flex-1 min-w-0">
        <span className="block truncate text-sm font-medium text-card-foreground">
          {exercise.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {DIAS[exercise.weekday - 1]} · {exercise.muscleGroup?.name}
        </span>
      </div>
      <div className="flex items-end gap-2">
        <Input
          label={t("weight")}
          type="number"
          min={0}
          step={0.25}
          className="w-24"
          value={ weight }
          onChange={(e) => setPeso(e.target.value)}
        />
        <Input
          label={t("reps")}
          type="number"
          min={1}
          max={100}
          className="w-20"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="AMRAP"
        />
        <Button size="md" loading={loading} onClick={handleSave}>
          {t("save")}
        </Button>
      </div>
      {e1rm != null && (
        <span className="flex items-center gap-1 text-sm font-semibold text-success sm:pl-2">
          <Trophy className="h-4 w-4" />
          e1RM: {formatWeight(e1rm)} kg
        </span>
      )}
    </div>
  );
}

export function BloqueView() {
  const t = useTranslations("bloque");
  const { data, isLoading, mutate: mutateBloque } = useBloque();
  const [showClose, setShowCerrar] = useState(false);
  const [cerrando, setCerrando] = useState(false);

  async function handleCerrar() {
    if (!data?.block) return;
    setCerrando(true);
    const res = await fetch(`/api/blocks/${data.block.id}/close`, {
      method: "POST",
    });
    setCerrando(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? t("saveError"));
      return;
    }

    const result = await res.json();
    toast.success(
      t("blockClosed", { number: result.block.number, recalibrated: result.recalibrated }),
    );
    setShowCerrar(false);
    await mutateBloque();
  }

  if (isLoading) {
    return <BloqueSkeleton />;
  }

  if (!data?.routine) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <p className="text-muted-foreground">{t("noRoutine")}</p>
        <Link
          href="/rutina"
          className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90"
        >
          {t("goRoutine")}
        </Link>
      </div>
    );
  }

  if (!data.block) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <p className="text-muted-foreground">{t("noBlock")}</p>
      </div>
    );
  }

  const { block } = data;
  const totalSemanas = block.blockLength + 1;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-lg font-bold text-foreground">
          <CalendarRange className="h-5 w-5 text-primary" />
          {t("blockTitle", { number: block.number })}
        </span>
        <span className="text-sm text-muted-foreground">
          {t("startedAt", { date: block.startDate })}
        </span>
        {block.isDeload ? (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {t("deload")}
          </span>
        ) : (
          block.targetRir != null && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {t("rirTarget", { rir: block.targetRir })}
            </span>
          )
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: totalSemanas }, (_, i) => i + 1).map((week) => {
          const esActual = block.week === week;
          const isDeloadSemana = week > block.blockLength;
          const esPasada = block.week > week;
          return (
            <div
              key={ week }
              className={cn(
                "flex min-w-14 flex-col items-center rounded-xl border px-3 py-2",
                esActual
                  ? "border-primary bg-primary/10 text-primary"
                  : esPasada
                    ? "border-success/40 bg-success/5 text-success/70"
                    : "border-border bg-card text-muted-foreground",
              )}
            >
              <span className="text-xs font-medium">{t("weekShort", { n: week })}</span>
              <span className="text-sm font-bold">
                {isDeloadSemana
                  ? t("deloadShort")
                  : `RIR ${block.rirPerWeek[week - 1] ?? "?"}`}
              </span>
            </div>
          );
        })}
      </div>

      {block.isDeload && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm text-foreground">
            <Flag className="mr-1 inline h-4 w-4 text-primary" />
            {t("deloadInfo", { pct: 60 })}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            <Link href="/aprender/descarga-y-test" className="text-primary hover:underline">
              {t("learn")}
            </Link>
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-1 font-semibold text-card-foreground">{t("amrapTitle")}</h3>
        <p className="mb-3 text-xs text-muted-foreground">{t("amrapHintBloque")}</p>
        <div className="flex flex-col gap-2">
          {data.exercises.map((e) => (
            <AmrapRow
              key={e.id}
              exercise={e}
              bloqueId={block.id}
              e1rmInicial={
                data.amraps.find((a) => a.routineExerciseId === e.id)?.e1rm ?? null
              }
              onSaved={() => mutateBloque()}
            />
          ))}
        </div>
        {data.amraps.length > 0 && (
          <div className="mt-4 border-t border-border pt-3">
            <h4 className="mb-2 text-sm font-medium text-foreground">
              {t("resultsTitle")}
            </h4>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {data.amraps.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-lg bg-surface/50 px-3 py-2 text-sm"
                >
                  <span className="truncate text-muted-foreground">{a.name}</span>
                  <span className="font-semibold text-success">
                    {formatWeight(a.e1rm)} kg
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {block.deloadPassed && (
        <div className="rounded-xl border border-success/40 bg-success/5 px-4 py-3 text-sm text-success">
          {t("deloadDone")}
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setShowCerrar(true)}>
          {t("closeBlock")}
        </Button>
      </div>

      <Modal
        open={showClose}
        onClose={() => setShowCerrar(false)}
        title={t("closeBlock")}
      >
        <p className="text-sm text-muted-foreground">{t("closeConfirm")}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowCerrar(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleCerrar} loading={cerrando}>
            {t("closeAndCreate")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
