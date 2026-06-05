import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { FeatureCards } from "@/components/FeatureCards";
import { MiniSimulator } from "@/components/MiniSimulator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AllerGuard — Know what's on the label" },
      {
        name: "description",
        content:
          "Personal food safety scanner that flags allergens and regional hazards like aflatoxin and mould — instantly, on-device.",
      },
      { property: "og:title", content: "AllerGuard — Know what's on the label" },
      {
        property: "og:description",
        content: "Scan ingredient labels against your personal allergen profile.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <FeatureCards />
      <MiniSimulator />
    </>
  );
}
