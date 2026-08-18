import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/hoy");
  }

  const t = await getTranslations("landing");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold text-primary">IronLog</h1>
      <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90"
        >
          {t("login")}
        </Link>
        <Link
          href="/register"
          className="rounded-lg border border-border bg-card px-5 py-2.5 font-medium text-card-foreground hover:bg-surface"
        >
          {t("register")}
        </Link>
      </div>
    </main>
  );
}
