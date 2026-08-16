import { Dumbbell } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-iron-orange-100 via-background to-iron-stone-800 px-4 py-12 dark:from-iron-orange-700/20 dark:via-background dark:to-iron-stone-800/40">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <Dumbbell className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          IronLog
        </h1>
        <p className="text-sm text-muted-foreground">
          Registra tu entrenamiento y progresa con evidencia científica
        </p>
      </div>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
        {children}
      </div>
    </div>
  );
}
