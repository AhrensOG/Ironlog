import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SPLASH_DEVICES = [
  { w: 375, h: 667, dpr: 2 }, // iPhone SE / 8
  { w: 414, h: 896, dpr: 2 }, // iPhone 11 / XR
  { w: 360, h: 780, dpr: 3 }, // iPhone 12/13 mini
  { w: 375, h: 812, dpr: 3 }, // iPhone X / XS / 11 Pro
  { w: 390, h: 844, dpr: 3 }, // iPhone 12 / 13 / 14
  { w: 393, h: 852, dpr: 3 }, // iPhone 14 Pro / 15 / 16
  { w: 430, h: 932, dpr: 3 }, // iPhone 14/15/16 Pro Max
  { w: 768, h: 1024, dpr: 2 }, // iPad
  { w: 1024, h: 1366, dpr: 2 }, // iPad Pro 12.9
];

const startupImages: Array<{ url: string; media: string }> = [];
for (const { w, h, dpr } of SPLASH_DEVICES) {
  const pxW = w * dpr;
  const pxH = h * dpr;
  const base = `(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${dpr}) and (orientation: portrait)`;
  startupImages.push({
    url: `/splash/splash-${pxW}x${pxH}-light.png`,
    media: base,
  });
  startupImages.push({
    url: `/splash/splash-${pxW}x${pxH}-dark.png`,
    media: `${base} and (prefers-color-scheme: dark)`,
  });
}

export const metadata: Metadata = {
  title: "IronLog",
  description: "Registra tu entrenamiento y progresa con evidencia científica.",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    title: "IronLog",
    statusBarStyle: "default",
    startupImage: startupImages,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff7ed" },
    { media: "(prefers-color-scheme: dark)", color: "#292524" },
  ],
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("ironlog-theme");
    var theme = stored === "light" ? "light" : "dark";
    var root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  } catch (e) {}
})();
`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
