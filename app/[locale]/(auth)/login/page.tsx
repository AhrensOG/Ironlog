import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const t = await getTranslations("auth");

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-card-foreground">
        {t("loginTitle")}
      </h2>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          {t("register")}
        </Link>
      </p>
    </>
  );
}
