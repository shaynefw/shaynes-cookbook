import { ImageResponse } from "next/og";
import { getAllRecipes } from "@/data/recipes";
import { OG_SIZE, OgCard } from "@/lib/ogCard";

export const alt = "Shayne's Cookbook";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  const count = getAllRecipes().length;
  return new ImageResponse(
    (
      <OgCard
        title="Shayne's Cookbook"
        blurb="A personal collection of family favorite recipes, with portion scaling and a shopping list for each one."
        facts={[`${count} recipes`]}
        tags={["family favorites"]}
      />
    ),
    { ...size }
  );
}
