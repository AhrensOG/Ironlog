"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      if (res.status === 409) {
        toast.error(t("emailInUse"));
      } else {
        toast.error(body?.error ?? t("registerError"));
      }
      return;
    }

    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInRes?.error) {
      toast.error(t("invalidCredentials"));
      router.push("/login");
      return;
    }

    toast.success(t("welcome"));
    router.push("/hoy");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label={t("name")}
        name="name"
        type="text"
        placeholder="Tu nombre"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
      />
      <Input
        label={t("email")}
        name="email"
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label={t("password")}
        name="password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        hint={t("passwordHint")}
      />
      <Button type="submit" loading={loading} className="w-full">
        {t("register")}
      </Button>
    </form>
  );
}
