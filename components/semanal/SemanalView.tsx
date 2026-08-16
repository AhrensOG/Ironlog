"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Download, Trophy, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSemanal } from "@/lib/hooks/useSemanal";
import { addDays, todayISO, weekRange } from "@/lib/dates";
import { cn } from "@/lib/cn";
import { formatWeight } from "@/lib/format";
import { SemanalSkeleton } from "./SemanalSkeleton";

export function SemanalView() {
  const t = useTranslations("semanal");
  const [date, setFecha] = useState(todayISO());
  const { data, isLoading } = useSemanal(date);

  function moveWeek(days: number) {
    setFecha((f) => addDays(f, days));
  }

  if (isLoading) {
    return <SemanalSkeleton />;
  }

  const week = data?.week ?? weekRange(date);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => moveWeek(-7)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="min-w-48 text-center text-sm font-medium text-foreground">
          {week.start} → {week.end}
        </span>
        <Button variant="outline" size="icon" onClick={() => moveWeek(7)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFecha(todayISO())}
        >
          {t("thisWeek")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() =>
            window.open(`/api/summary/export?date = ${ date }`, "_blank")
          }
        >
          <Download className="h-4 w-4" />
          {t("exportCsv")}
        </Button>
      </div>

      {!data?.routine ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center text-muted-foreground">
          {t("noRoutine")}
        </p>
      ) : data.rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center text-muted-foreground">
          {t("emptyWeek")}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-150 text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">{t("exercise")}</th>
                <th className="px-4 py-3 font-medium">{t("weekLogs")}</th>
                <th className="px-4 py-3 text-right font-medium">{t("vsPrev")}</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((fila) => (
                <tr key={fila.exercise} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 align-top">
                    <span className="font-medium text-card-foreground">
                      {fila.exercise}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {fila.group}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    {fila.registros.map((r, i) => (
                      <div key={i} className="flex flex-wrap items-center gap-2 py-0.5">
                        <span className="text-xs text-muted-foreground">
                          {r.date.slice(5)}
                        </span>
                        <span className="font-medium text-card-foreground">
                          {formatWeight(r.weight)} kg × {r.reps}
                        </span>
                        {r.rir != null && (
                          <span className="text-xs text-muted-foreground">
                            RIR {r.rir}
                          </span>
                        )}
                        {r.isPR && <Trophy className="h-3.5 w-3.5 text-warning" />}
                        {r.isInjury && (
                          <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                        )}
                        {r.note && (
                          <span className="text-xs italic text-muted-foreground">
                            — {r.note}
                          </span>
                        )}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-right align-top">
                    {(() => {
                      const last = fila.registros[fila.registros.length - 1];
                      if (fila.previousWeight == null) return <span className="text-muted-foreground">—</span>;
                      const diff = last.weight - fila.previousWeight;
                      if (diff > 0.001)
                        return <span className="font-medium text-success">↑ {formatWeight(diff)} kg</span>;
                      if (diff < -0.001)
                        return <span className="font-medium text-destructive">↓ {formatWeight(Math.abs(diff))} kg</span>;
                      return <span className="text-muted-foreground">=</span>;
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {((data?.sessions ?? []).some((s) => s.notes)) && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold text-card-foreground">{t("sessionNotes")}</h3>
          {(data?.sessions ?? [])
            .filter((s) => s.notes)
            .map((s) => (
              <p key={s.date} className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{s.date}</span> — {s.notes}
              </p>
            ))}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-1 font-semibold text-card-foreground">{t("auditTitle")}</h3>
        <p className="mb-3 text-xs text-muted-foreground">
          {t("auditHint")}{" "}
          <Link href="/aprender/volumen-mev-mav-mrv" className="text-primary hover:underline">
            {t("learn")}
          </Link>
        </p>
        <div className="flex flex-col gap-2">
          {(data?.auditoria ?? []).map((a) => (
            <div
              key={a.group}
              className="flex items-center justify-between gap-2 rounded-lg bg-surface/40 px-3 py-2 text-sm"
            >
              <span className="text-foreground">{a.group}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  {a.sets} / {a.minReps}-{a.maxReps}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    a.status === "optimal" && "bg-success/10 text-success",
                    a.status === "belowMEV" && "bg-warning/10 text-warning",
                    a.status === "aboveMRV" && "bg-destructive/10 text-destructive",
                  )}
                >
                  {t(`estado_${a.status}`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
