import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
background_color: "#18171c",
    theme_color: "#f97316",
    icons: [
        {
            purpose: "maskable",
            sizes: "512x512",
            src: "/icon512_maskable.png",
            type: "image/png"
        },
        {
            purpose: "any",
            sizes: "512x512",
            src: "/icon512_rounded.png",
            type: "image/png"
        }
    ],
    orientation: "any",
    display: "standalone",
    dir: "auto",
    lang: "en-US",
    name: "UNI TRACK",
    short_name: "UNI TRACK",
    start_url: "/",
    description: "Student timetable with daily classes and progress."
  };
}
