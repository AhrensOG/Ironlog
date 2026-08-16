import { getTranslations } from "next-intl/server";

export async function Placeholder({ section }: { section: string }) {
  const t = await getTranslations("dashboard");
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
      <h1 className="text-2xl font-bold text-foreground">{section}</h1>
      <p className="mt-2 text-muted-foreground">{t("placeholder")}</p>
    </div>
  );
}
