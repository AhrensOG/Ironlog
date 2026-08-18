import useSWR from "swr";

export interface TemplateRes {
  id: string;
  name: string;
  description: string;
  level: "principiante" | "intermedio" | "avanzado";
  tags: string[];
  articles: string[];
  isSeed: boolean;
  isPublic: boolean;
  isOwn: boolean;
  activations: number;
  days: number[];
  exercises: number;
  metodo: string;
}

export function useTemplates() {
  return useSWR<TemplateRes[]>("/api/templates", { keepPreviousData: true });
}
