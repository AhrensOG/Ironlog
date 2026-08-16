"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, BookOpen, Tag } from "lucide-react";
import { useLearningDetail } from "@/lib/hooks/useAprender";
import { AprenderArticuloSkeleton } from "./AprenderSkeleton";

const NIVEL_COLOR: Record<string, string> = {
  principiante: "bg-success/10 text-success",
  intermedio: "bg-primary/10 text-primary",
  avanzado: "bg-warning/10 text-warning",
};

const TIPO_LABEL: Record<string, string> = {
  articulo: "Artículo",
  termino: "Glosario",
};

export function AprenderArticulo() {
  const t = useTranslations("aprender");
  const params = useParams<{ slug: string }>();
  const { data, isLoading, error } = useLearningDetail(params?.slug ?? null);

  if (isLoading) {
    return <AprenderArticuloSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">{t("notFound")}</p>
        <Link href="/aprender" className="text-primary hover:underline">
          {t("backToList")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link
        href="/aprender"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToList")}
      </Link>

      <div className="flex items-center gap-2 text-xs">
        <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">
          {TIPO_LABEL[data.type] ?? data.type}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 font-medium ${
            NIVEL_COLOR[data.level] ?? NIVEL_COLOR.principiante
          }`}
        >
          {t(`nivel_${data.level}`)}
        </span>
      </div>

      <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold text-foreground">
        {data.type === "termino" && <Tag className="h-5 w-5 text-primary" />}
        {data.type === "articulo" && <BookOpen className="h-5 w-5 text-primary" />}
        {data.title}
      </h1>

      <div className="aprender-prose mt-5 text-sm leading-7 text-foreground/90">
        <ReactMarkdown
          components={{
            h1: (props) => (
              <h2 className="mb-3 mt-6 text-lg font-bold text-foreground" {...props} />
            ),
            h2: (props) => (
              <h3 className="mb-2 mt-5 text-base font-semibold text-foreground" {...props} />
            ),
            p: (props) => <p className="mb-3" {...props} />,
            ul: (props) => <ul className="mb-3 list-disc pl-5" {...props} />,
            ol: (props) => <ol className="mb-3 list-decimal pl-5" {...props} />,
            li: (props) => <li className="mb-1" {...props} />,
            strong: (props) => (
              <strong className="font-semibold text-primary" {...props} />
            ),
          }}
        >
          {data.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
