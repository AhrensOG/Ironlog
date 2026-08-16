"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { MethodConfigRes } from "@/lib/hooks/useRutina";

export function MethodConfigPanel({
  config,
  routineId,
}: {
  config: MethodConfigRes;
  routineId: string;
}) {
  const t = useTranslations("rutina");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: config.name,
    blockLength: String(config.blockLength),
    rirPerWeek: config.rirPerWeek.join(", "),
    deloadVolumePct: String(Math.round(config.deloadVolumePct * 100)),
    semanasFalloSeguidas: String(config.failureRules.semanasFalloSeguidas),
    ajustePct: String(config.failureRules.ajustePct),
    progressionStyle: config.progressionStyle,
  });
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    const res = await fetch(`/api/method-configs/${config.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        blockLength: Number(form.blockLength),
        rirPerWeek: form.rirPerWeek
          .split(",")
          .map((s) => Number(s.trim()))
          .filter((n) => !Number.isNaN(n)),
        deloadVolumePct: Number(form.deloadVolumePct) / 100,
        failureRules: {
          semanasFalloSeguidas: Number(form.semanasFalloSeguidas),
          ajustePct: Number(form.ajustePct),
        },
        progressionStyle: form.progressionStyle,
      }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? t("saveError"));
      return;
    }

    toast.success(t("methodSaved"));
    await mutate(`/api/routines/${routineId}`);
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
      >
        {t("editMethod")}
      </button>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3 rounded-xl border border-border bg-surface/40 p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input
          label={t("methodName")}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <Input
          label={t("blockLength")}
          type="number"
          min={2}
          max={20}
          value={form.blockLength}
          onChange={(e) =>
            setForm((f) => ({ ...f, blockLength: e.target.value }))
          }
        />
        <Input
          label={t("rirPerWeek")}
          value={form.rirPerWeek}
          onChange={(e) =>
            setForm((f) => ({ ...f, rirPerWeek: e.target.value }))
          }
          hint={t("rirPerWeekHint")}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input
          label={t("deloadPct")}
          type="number"
          min={10}
          max={100}
          value={form.deloadVolumePct}
          onChange={(e) =>
            setForm((f) => ({ ...f, deloadVolumePct: e.target.value }))
          }
          hint={t("deloadPctHint")}
        />
        <Input
          label={t("failWeeks")}
          type="number"
          min={1}
          value={form.semanasFalloSeguidas}
          onChange={(e) =>
            setForm((f) => ({ ...f, semanasFalloSeguidas: e.target.value }))
          }
        />
        <Input
          label={t("failAdjust")}
          type="number"
          min={-50}
          max={0}
          value={form.ajustePct}
          onChange={(e) => setForm((f) => ({ ...f, ajustePct: e.target.value }))}
          hint={t("failAdjustHint")}
        />
      </div>
      <Select
        label={t("progressionStyle")}
        value={form.progressionStyle}
        onChange={(e) =>
          setForm((f) => ({ ...f, progressionStyle: e.target.value }))
        }
      >
        <option value="doble">{t("styleDoble")}</option>
        <option value="lineal">{t("styleLineal")}</option>
        <option value="libre">{t("styleLibre")}</option>
      </Select>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          {t("cancel")}
        </Button>
        <Button type="button" onClick={handleSave} loading={loading}>
          {t("save")}
        </Button>
      </div>
    </div>
  );
}
