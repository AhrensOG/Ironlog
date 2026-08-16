import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  const t = await getTranslations("auth");

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-card-foreground">
        {t("registerTitle")}
      </h2>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          {t("login")}
        </Link>
      </p>
    </>
  );
}
