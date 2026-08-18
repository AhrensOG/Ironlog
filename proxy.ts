import { auth } from "@/auth";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlProxy = createMiddleware(routing);

const PROTECTED_PATHS = [
  "/hoy",
  "/rutina",
  "/bloque",
  "/semanal",
  "/progreso",
  "/aprender",
  "/ajustes",
];

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl);
    return Response.redirect(loginUrl);
  }

  return intlProxy(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
