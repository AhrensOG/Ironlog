import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Sequelize has dual CJS/ESM entry points; bundling it (Turbopack dev) can
  // produce two module copies and break `instanceof Model` checks in associations.
  serverExternalPackages: ["sequelize"],
  // A stray package-lock.json exists in the parent dir (~/Programacion is not
  // a git repo), which confuses Turbopack's project-root detection.
  turbopack: {
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);
