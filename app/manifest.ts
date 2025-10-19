import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Student Time Table",
    short_name: "TimeTable",
    description: "Student timetable with daily classes and progress.",
    start_url: "/",
    display: "standalone",
    background_color: "#18171c",
    theme_color: "#f97316",
    icons: [
      // Using available SVGs in public as placeholders
      { src: "/next.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/vercel.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }
    ]
  };
}
