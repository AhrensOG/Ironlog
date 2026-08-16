"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { todayISO } from "@/lib/dates";

export function ImportRutinaModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("rutina");
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setNombre] = useState("Rutina importada");
  const [startDate, setFechaInicio] = useState(
    todayISO(),
  );
  const [csv, setCsv] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleImport() {
    setLoading(true);
    setWarnings([]);

    const res = await fetch("/api/routines/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, startDate, csv }),
    });

    setLoading(false);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const detalles = Array.isArray(data?.details) ? data.details : [];
      toast.error(data?.error ?? t("importError"));
      setWarnings(detalles.map(String));
      return;
    }

    toast.success(
      `${t("importedExercises", { count: data.importedExercises })}`,
    );
    setWarnings((data.warnings ?? []).map(String));
    await mutate("/api/routines");
    if (data.routine?.id) await mutate(`/api/routines/${data.routine.id}`);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={t("importTitle")} wide>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t("routineName")}
            name="name"
            value={ name }
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <Input
            label={t("startDate")}
            name="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
          />
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            file.text().then(setCsv);
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileRef.current?.click()}
        >
          {t("selectFile")}
        </Button>
        <Textarea
          label={t("csvText")}
          name="csv"
          rows={10}
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          placeholder="dia,ejercicio,series,minReps,maxReps,weightType,fixedBar,carga,incremento,rir,muscleGroup,orden"
        />
        {warnings.length > 0 && (
          <ul className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs text-warning">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button type="button" onClick={handleImport} loading={loading}>
            {t("import")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
