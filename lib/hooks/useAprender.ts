import useSWR from "swr";

export interface LearningSummary {
  id: string;
  slug: string;
  title: string;
  level: "principiante" | "intermedio" | "avanzado";
  type: "termino" | "articulo";
  category: string;
  order: number;
}

export interface LearningDetail extends LearningSummary {
  content: string;
}

export function useLearningList() {
  return useSWR<LearningSummary[]>("/api/learning");
}

export function useLearningDetail(slug: string | null) {
  return useSWR<LearningDetail>(slug ? `/api/learning/${slug}` : null);
}
