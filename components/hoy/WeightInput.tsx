"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import type { WeightType } from "@/lib/models/RoutineExercise";
import { formatWeight } from "@/lib/format";

export function WeightInput({
  weightType,
  fixedBar,
  value,
  onChange,
}: {
  weightType: WeightType;
  fixedBar: number | null;
  value: string;
  onChange: (v: string) => void;
}) {
  const t = useTranslations("hoy");
  const weight = Number(value) || 0;

  if (weightType === "porLado") {
    return (
      <Input
        label={t("perSide")}
        name="weight"
        type="number"
        min={0}
        step={0.5}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        hint={`${t("totalWeight")}: ${formatWeight(weight * 2)} kg`}
        className="text-lg font-semibold"
      />
    );
  }

  if (weightType === "barraDiscos") {
    const bar = fixedBar ?? 0;
    return (
      <Input
        label={t("discsPerSide")}
        name="weight"
        type="number"
        min={0}
        step={0.25}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        hint={`${t("bar")}: ${formatWeight(bar)} kg · ${t("totalWeight")}: ${formatWeight(bar + weight * 2)} kg`}
        className="text-lg font-semibold"
      />
    );
  }

  return (
    <Input
      label={t("weight")}
      name="weight"
      type="number"
      min={0}
      step={0.25}
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-lg font-semibold"
    />
  );
}
