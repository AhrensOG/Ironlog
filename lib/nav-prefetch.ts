import { preload } from "swr";
import { fetcher } from "@/lib/fetcher";
import { todayISO } from "@/lib/dates";

export function navPrefetchKeys(href: string): string[] {
  switch (href) {
    case "/hoy":
      return ["/api/session/today"];
    case "/rutina":
      return ["/api/routines", "/api/muscle-groups"];
    case "/bloque":
      return ["/api/blocks/current"];
    case "/semanal":
      return [`/api/summary/week?date=${todayISO()}`];
    case "/progreso":
      return ["/api/progress", "/api/body-weight", "/api/events"];
    case "/aprender":
      return ["/api/learning"];
    default:
      return [];
  }
}

export function preloadNavData(href: string) {
  for (const key of navPrefetchKeys(href)) {
    preload(key, fetcher);
  }
}
