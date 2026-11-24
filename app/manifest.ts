import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Air Indo",
    short_name: "Air Indo",
    description: "Andhra Pradesh's regional airline. Fly Beyond.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF9F4",
    theme_color: "#10215C",
    icons: [
      { src: "/brand/android-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/android-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
