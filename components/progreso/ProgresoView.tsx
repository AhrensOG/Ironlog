"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { mutate } from "swr";
import { Trophy } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  useBodyWeight,
  useEventos,
  useProgressDetail,
  useProgressSummary,
} from "@/lib/hooks/useProgreso";
import { todayISO } from "@/lib/dates";
import { formatWeight } from "@/lib/format";
import { ProgresoSkeleton } from "./ProgresoSkeleton";

export function ProgresoView() {
  const t = useTranslations("progreso");
  const { data: resumen, isLoading } = useProgressSummary();
  const [exerciseId, setExerciseId] = useState<string | null>(null);
  const { data: detalle } = useProgressDetail(exerciseId);
  const { data: weights } = useBodyWeight();
  const { data: eventos } = useEventos();

  const [weightInput, setPesoInput] = useState("");
  const [weightDate, setFechaPeso] = useState(todayISO());
  const [savingWeight, setGuardandoPeso] = useState(false);

  async function saveWeight() {
    setGuardandoPeso(true);
    const res = await fetch("/api/body-weight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: weightDate, weight: Number(weightInput) }),
    });
    setGuardandoPeso(false);

    if (!res.ok) {
      toast.error(t("saveError"));
      return;
    }
    toast.success(t("weightSaved"));
    setPesoInput("");
    await mutate("/api/body-weight");
  }

  if (isLoading) {
    return <ProgresoSkeleton />;
  }

  const chartData = (detalle?.serie ?? []).map((p) => ({
    ...p,
    label: p.date.slice(5),
  }));

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm font-medium text-foreground">{t("exercise")}</label>
          <select
            value={exerciseId ?? ""}
            onChange={(e) => setExerciseId(e.target.value || null)}
            className="h-10 flex-1 min-w-52 rounded-lg border border-input bg-card px-3 text-sm text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">{t("selectExercise")}</option>
            {(resumen?.exercises ?? []).map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.registros} {t("logs").toLowerCase()})
              </option>
            ))}
          </select>
        </div>

        {detalle?.exercise && chartData.length > 0 && (
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(value, name) => [
                    `${formatWeight(Number(value))} kg`,
                    name === "weight" ? t("weight") : "e1RM",
                  ]}
                  labelFormatter={(l) => `${l}`}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="weight"
                />
                <Line
                  type="monotone"
                  dataKey="e1rm"
                  stroke="var(--success)"
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                  dot={false}
                  name="e1rm"
                />
                {(eventos ?? [])
                  .filter((e) => chartData.some((d) => d.date === e.date))
                  .map((e) => (
                    <ReferenceLine
                      key={e.id}
                      x={e.date.slice(5)}
                      stroke="var(--warning)"
                      strokeDasharray="3 3"
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {detalle?.exercise && chartData.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">{t("noData")}</p>
        )}
      </div>

      {(resumen?.prs.length ?? 0) > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-card-foreground">
            <Trophy className="h-4 w-4 text-warning" />
            {t("prs")}
          </h3>
          <div className="flex flex-col gap-2">
            {resumen!.prs.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg bg-surface/40 px-3 py-2 text-sm"
              >
                <span className="text-muted-foreground">
                  {p.date} · {p.exercise}
                </span>
                <span className="font-semibold text-warning">
                  {formatWeight(p.weight)} kg × {p.reps}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-3 font-semibold text-card-foreground">{t("bodyWeight")}</h3>
        <div className="flex flex-wrap items-end gap-2">
          <Input
            label={t("date")}
            type="date"
            value={weightDate}
            onChange={(e) => setFechaPeso(e.target.value)}
            className="w-40"
          />
          <Input
            label={t("weightKg")}
            type="number"
            min={20}
            max={400}
            step={0.1}
            value={weightInput}
            onChange={(e) => setPesoInput(e.target.value)}
            className="w-28"
          />
          <Button onClick={saveWeight} loading={savingWeight}>
            {t("save")}
          </Button>
        </div>
        {(weights?.length ?? 0) > 1 && (
          <div className="mt-4 h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={(weights ?? []).map((p) => ({ ...p, label: p.date.slice(5) }))}
                margin={{ top: 8, right: 12, bottom: 0, left: -12 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis
                  domain={["dataMin - 1", "dataMax + 1"]}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${formatWeight(Number(value))} kg`, t("bodyWeight")]}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {(eventos?.length ?? 0) > 0 && (
          <div className="mt-4 border-t border-border pt-3">
            <h4 className="mb-2 text-sm font-medium text-foreground">{t("events")}</h4>
            {eventos!.map((e) => (
              <p key={e.id} className="text-xs text-muted-foreground">
                <span className="font-medium text-warning">{e.date}</span> · {e.note ?? e.type}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
