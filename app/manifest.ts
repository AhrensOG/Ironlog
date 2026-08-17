import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IronLog",
    short_name: "IronLog",
    description: "Registra tu entrenamiento y progresa con evidencia científica.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0a09",
    theme_color: "#292524",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
