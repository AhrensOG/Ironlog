"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { Moon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useToday } from "@/lib/hooks/useHoy";
import { DIAS } from "@/lib/csv";
import { cn } from "@/lib/cn";
import { ExerciseLogCard } from "./ExerciseLogCard";
import { todayISO } from "@/lib/dates";
import { HoySkeleton } from "./HoySkeleton";

export function HoyView() {
  const t = useTranslations("hoy");
  const [date, setFecha] = useState(todayISO());
  const [routineDayOverride, setDiaRutinaOverride] = useState<number | null>(null);

  const { data, isLoading, mutate: mutateToday } = useToday(date, routineDayOverride);
  const sessionRef = useRef<{ id: string } | null>(null);

  async function ensureSession(): Promise<string | null> {
    if (sessionRef.current?.id) return sessionRef.current.id;
    if (data?.session?.id) {
      sessionRef.current = data.session;
      return data.session.id;
    }
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date,
        routineDay: data?.routineDay ?? null,
      }),
    });
    if (!res.ok) {
      toast.error(t("saveError"));
      return null;
    }
    const session = await res.json();
    sessionRef.current = session;
    await mutateToday();
    return session.id;
  }

  async function saveNotes() {
    const sessionId = await ensureSession();
    if (!sessionId) return;
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, routineDay: data?.routineDay ?? null, notes: noteDraft }),
    });
    if (!res.ok) {
      toast.error(t("saveError"));
      return;
    }
    toast.success(t("notesSaved"));
    await mutateToday();
  }

  async function toggleRest() {
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date,
        routineDay: data?.routineDay ?? null,
        isRest: !data?.session?.isRest,
      }),
    });
    if (!res.ok) {
      toast.error(t("saveError"));
      return;
    }
    toast.success(data?.session?.isRest ? t("restRemoved") : t("restMarked"));
    await mutateToday();
  }

  const [noteDraft, setNotaDraft] = useState(data?.session?.notes ?? "");
  const notaActual = data?.session?.notes ?? "";

  const [closingBlock, setCerrandoBloque] = useState(false);

  async function handleCloseBlock() {
    if (!data?.block?.id) return;
    setCerrandoBloque(true);
    const res = await fetch(`/api/blocks/${data.block.id}/close`, {
      method: "POST",
    });
    setCerrandoBloque(false);

    if (!res.ok) {
      toast.error(t("saveError"));
      return;
    }

    const result = await res.json();
    toast.success(
      t("blockClosed", {
        number: result.block.number,
        recalibrated: result.recalibrated,
      }),
    );
    await mutateToday();
  }

  if (isLoading) {
    return <HoySkeleton />;
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

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="date"
          value={ date }
          onChange={(e) => {
            setFecha(e.target.value);
            sessionRef.current = null;
          }}
          className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {data.block && (
          <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-surface-foreground">
            {t("blockWeek", { week: data.block.week, total: data.block.blockLength + 1 })}
          </span>
        )}
        {data.block && data.block.isDeload ? (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {t("deload")}
          </span>
        ) : (
          data.block?.targetRir != null && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {t("rirTarget", { rir: data.block.targetRir })}
            </span>
          )
        )}
        {data.session?.isRest && (
          <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
            <Moon className="mr-1 inline h-3 w-3" />
            {t("rest")}
          </span>
        )}
      </div>

        {data.block?.deloadPassed && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-success/40 bg-success/5 px-4 py-3 text-sm text-success">
            {t("deloadDone")}
            <Button size="sm" variant="outline" onClick={handleCloseBlock} loading={closingBlock}>
              {t("closeBlock")}
            </Button>
          </div>
        )}

      <div className="flex flex-wrap gap-1.5">
        {DIAS.map((d, i) => (
          <button
            key={d}
            onClick={() => {
              setDiaRutinaOverride(i + 1);
              sessionRef.current = null;
            }}
            className={cn(
              "pressable rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              data.routineDay === i + 1 && !routineDayOverride
                ? "bg-primary text-primary-foreground"
                : routineDayOverride === i + 1
                  ? "bg-primary/70 text-primary-foreground"
                  : "bg-surface text-surface-foreground hover:bg-muted",
            )}
          >
            {d}
          </button>
        ))}
        {routineDayOverride && (
          <button
            onClick={() => {
              setDiaRutinaOverride(null);
              sessionRef.current = null;
            }}
            className="pressable flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            {t("resetDay")}
          </button>
        )}
      </div>

      {data.exercises.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
          <p className="text-muted-foreground">{t("emptyDay")}</p>
          <Button variant="outline" onClick={toggleRest}>
            {data.session?.isRest ? t("removeRest") : t("markRest")}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data.exercises.map((e) => (
            <ExerciseLogCard
              key={`${e.id}-${ date }-${data.routineDay}`}
              exercise={e}
              ensureSession={ensureSession}
              onSaved={() => mutateToday()}
              blockId={data.block?.id ?? null}
            />
          ))}
        </div>
      )}

      <div className="mt-2 flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            {t("sessionNotes")}
          </label>
          <Button variant="ghost" size="sm" onClick={toggleRest}>
            <Moon className="h-4 w-4" />
            {data.session?.isRest ? t("removeRest") : t("markRest")}
          </Button>
        </div>
        <Textarea
          rows={2}
          placeholder={t("sessionNotesPlaceholder")}
          value={noteDraft || notaActual}
          onChange={(e) => setNotaDraft(e.target.value)}
        />
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={saveNotes}>
            {t("saveNotes")}
          </Button>
        </div>
      </div>
    </div>
  );
}
