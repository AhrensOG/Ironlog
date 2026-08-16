"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { ExerciseRes, MuscleGroupRes } from "@/lib/hooks/useRutina";
import type { WeightType } from "@/lib/models/RoutineExercise";
import { DIAS } from "@/lib/csv";

export function ExerciseForm({
  routineId,
  muscleGroups,
  exercise,
  varianteDe,
  diaPorDefecto,
  onClose,
}: {
  routineId: string;
  muscleGroups: MuscleGroupRes[];
  exercise?: ExerciseRes;
  varianteDe?: ExerciseRes;
  diaPorDefecto: number;
  onClose: () => void;
}) {
  const t = useTranslations("rutina");
  const base = varianteDe ?? exercise;
  const [form, setForm] = useState<{
    name: string;
    weekday: number;
    muscleGroupId: string;
    sets: number;
    minReps: number;
    maxReps: number;
    weightType: WeightType;
    fixedBar: string;
    currentLoad: string;
    equipmentIncrement: string;
    baseRir: number;
  }>({
    name: varianteDe ? "" : (exercise?.name ?? ""),
    weekday: base?.weekday ?? diaPorDefecto,
    muscleGroupId: base?.muscleGroup?.id ?? muscleGroups[0]?.id ?? "",
    sets: base?.sets ?? 3,
    minReps: base?.minReps ?? 8,
    maxReps: base?.maxReps ?? 10,
    weightType: base?.weightType ?? "total",
    fixedBar: base?.fixedBar?.toString() ?? "",
    currentLoad: varianteDe ? "0" : (exercise?.currentLoad?.toString() ?? "0"),
    equipmentIncrement: base?.equipmentIncrement?.toString() ?? "2.5",
    baseRir: base?.baseRir ?? 2,
  });
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name.trim(),
      weekday: Number(form.weekday),
      muscleGroupId: form.muscleGroupId,
      sets: Number(form.sets),
      minReps: Number(form.minReps),
      maxReps: Number(form.maxReps),
      weightType: form.weightType,
      fixedBar:
        form.weightType === "barraDiscos" && form.fixedBar !== ""
          ? Number(form.fixedBar)
          : null,
      currentLoad: Number(form.currentLoad),
      equipmentIncrement: Number(form.equipmentIncrement),
      baseRir: Number(form.baseRir),
      ...(varianteDe ? { variantOfId: varianteDe.id } : {}),
    };

    const url = exercise
      ? `/api/routine-exercises/${exercise.id}`
      : "/api/routine-exercises";
    const body = exercise ? payload : { ...payload, routineId };

    const res = await fetch(url, {
      method: exercise ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? t("saveError"));
      return;
    }

    toast.success(exercise ? t("saved") : t("created"));
    await mutate(`/api/routines/${routineId}`);
    await mutate("/api/routines");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label={t("exerciseName")}
        name="name"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <Select
          label={t("day")}
          name="weekday"
          value={form.weekday}
          onChange={(e) => set("weekday", Number(e.target.value))}
        >
          {DIAS.map((d, i) => (
            <option key={d} value={i + 1}>
              {d}
            </option>
          ))}
        </Select>
        <Select
          label={t("muscleGroup")}
          name="muscleGroupId"
          value={form.muscleGroupId}
          onChange={(e) => set("muscleGroupId", e.target.value)}
        >
          {muscleGroups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Input
          label={t("series")}
          name="series"
          type="number"
          min={1}
          value={form.sets}
          onChange={(e) => set("sets", Number(e.target.value))}
          required
        />
        <Input
          label={t("minReps")}
          name="minReps"
          type="number"
          min={1}
          value={form.minReps}
          onChange={(e) => set("minReps", Number(e.target.value))}
          required
        />
        <Input
          label={t("maxReps")}
          name="maxReps"
          type="number"
          min={1}
          value={form.maxReps}
          onChange={(e) => set("maxReps", Number(e.target.value))}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Select
          label={t("weightType")}
          name="weightType"
          value={form.weightType}
          onChange={(e) => set("weightType", e.target.value as WeightType)}
        >
          <option value="total">{t("pesoTotal")}</option>
          <option value="porLado">{t("pesoPorLado")}</option>
          <option value="barraDiscos">{t("pesoBarraDiscos")}</option>
        </Select>
        <Input
          label={t("baseRir")}
          name="baseRir"
          type="number"
          min={0}
          max={5}
          value={form.baseRir}
          onChange={(e) => set("baseRir", Number(e.target.value))}
          hint={t("baseRirHint")}
        />
      </div>
      {form.weightType === "barraDiscos" && (
        <Input
          label={t("fixedBar")}
          name="fixedBar"
          type="number"
          min={0}
          value={form.fixedBar}
          onChange={(e) => set("fixedBar", e.target.value)}
          placeholder="20"
        />
      )}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label={t("currentLoad")}
          name="currentLoad"
          type="number"
          min={0}
          step={0.25}
          value={form.currentLoad}
          onChange={(e) => set("currentLoad", e.target.value)}
          hint={t("cargaHint")}
        />
        <Input
          label={t("equipmentIncrement")}
          name="equipmentIncrement"
          type="number"
          min={0}
          step={0.25}
          value={form.equipmentIncrement}
          onChange={(e) => set("equipmentIncrement", e.target.value)}
          hint={t("incrementoHint")}
        />
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button type="submit" loading={loading}>
          {t("save")}
        </Button>
      </div>
    </form>
  );
}
