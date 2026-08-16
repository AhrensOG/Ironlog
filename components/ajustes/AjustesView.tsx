"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function AjustesView() {
  const t = useTranslations("ajustes");
  const { data: session } = useSession();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error(t("mismatch"));
      return;
    }

    setLoading(true);
    const res = await fetch("/api/account/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (res.status === 422) {
        toast.error(t("invalidData"));
      } else if (res.status === 400) {
        toast.error(t("wrongPassword"));
      } else {
        toast.error(data?.error ?? t("saveError"));
      }
      return;
    }

    toast.success(t("passwordChanged"));
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-foreground">{t("title")}</h1>

      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">{t("signedInAs")}</p>
        <p className="mt-1 font-medium text-card-foreground">
          {session?.user?.name ?? "—"} · {session?.user?.email ?? "—"}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h2 className="font-semibold text-card-foreground">
          {t("changePasswordTitle")}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("changePasswordHint")}
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <Input
            label={t("currentPassword")}
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label={t("newPassword")}
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            hint={t("newPasswordHint")}
          />
          <Input
            label={t("confirmPassword")}
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={loading}>
              {t("save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
