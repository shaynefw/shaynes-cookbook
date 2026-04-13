export interface RecipeVariation {
  name: string;
  description: string;
  yield: string;
  ingredients: string[];
  steps: string[];
}

export interface Recipe {
  slug: string;
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
  variations?: RecipeVariation[];
}

const recipes: Recipe[] = [
  {
    slug: "maple-walnut-banana-bread",
    title: "Maple Walnut Banana Bread",
    description:
      "A moist and flavorful banana bread made with honey or maple syrup instead of refined sugar, packed with rum-soaked raisins and topped with walnuts. Perfect for breakfast or afternoon tea.",
    prepTime: "20 min",
    cookTime: "70-80 min",
    servings: "1 loaf",
    tags: ["baking", "breakfast", "snack"],
    ingredients: [
      "2½ cups all-purpose flour",
      "2 tsp baking powder",
      "¾ tsp salt",
      "½ tsp baking soda",
      "1½ cups mashed very ripe bananas (about 3 medium)",
      "2 tbsp milk",
      "2 tsp vanilla or almond extract",
      "½ cup butter or margarine (1 stick), softened",
      "⅔ cup honey or 1 cup maple syrup",
      "2 large eggs",
      "1 cup raisins, soaked in boiled water with a bit of rum/brandy (drain before adding)",
      "Walnuts/mixed nuts, sprinkled on top before baking",
    ],
    steps: [
      "Preheat oven to 325°F (reduced by 25°F to prevent over-browning). Grease a 9×5 inch metal loaf pan.",
      "In a medium bowl, combine the flour, baking powder, salt, and baking soda. Set aside.",
      "In a small bowl, combine mashed bananas, milk, and vanilla extract. Set aside.",
      "In a large bowl, use a mixer at medium speed to beat the butter and honey (or maple syrup) until light and fluffy. Add eggs one at a time, beating well after each addition.",
      "Reduce mixer speed to low. Alternately add the flour mixture and banana mixture to the butter mixture, beginning and ending with the flour mixture. Mix until just combined.",
      "Gently fold in the drained raisins. Do not overmix.",
      "Pour batter into the prepared loaf pan and sprinkle walnuts evenly on top.",
      "Bake for 1 hour and 10 minutes. Check the center with a knife or chopstick. If still raw, increase oven to 350°F and continue baking for 10 more minutes. Check every 10 minutes until it comes out clean.",
      "Cool in the pan on a wire rack for 10-15 minutes, then remove from the pan and cool completely on the rack for 1-2 hours.",
    ],
  },
  {
    slug: "okinawan-lentil-sweet-potato-stew",
    title: "Okinawan Lentil & Sweet Potato Stew",
    description:
      "A hearty, nourishing stew inspired by Okinawan longevity cooking. Red lentils and sweet potatoes melt into a rich, turmeric-golden base with spinach stirred in at the end. Perfect for Sunday batch cooking.",
    prepTime: "20 min",
    cookTime: "40 min",
    servings: "8 family servings",
    tags: ["stew", "batch cook", "vegan", "healthy"],
    ingredients: [
      "3 tbsp olive oil",
      "3 large onions, diced",
      "8 medium carrots, diced",
      "8 celery stalks, diced",
      "8 garlic cloves, minced",
      "2 tbsp fresh ginger, grated",
      "5 to 6 medium sweet potatoes, peeled and cubed (about 4 lb total)",
      "3 cups dry red lentils, rinsed",
      "2 large cans diced tomatoes (796 mL each)",
      "14 cups low-sodium broth or water",
      "2 tsp turmeric",
      "2 tsp black pepper",
      "2 tsp sea salt (or ½ tsp per cup of water — adjust at the end)",
      "1 tbsp dried thyme",
      "1 large bag frozen spinach (about 500–600 g), or 2 bunches chopped kale",
      "2 tbsp lemon juice (add at the end)",
    ],
    steps: [
      "Heat the oil in a very large pot over medium heat.",
      "Add onion, carrot, and celery; cook 8 to 10 minutes until softened.",
      "Add garlic and ginger; cook 1 minute.",
      "Add sweet potatoes, lentils, tomatoes, broth, turmeric, pepper, salt, and thyme.",
      "Bring to a boil, then reduce to a gentle simmer.",
      "Simmer 25 to 30 minutes, stirring occasionally, until the lentils are soft and the sweet potatoes are tender.",
      "Stir in spinach or kale and cook 5 more minutes.",
      "Add lemon juice and taste; add more salt, pepper, or thyme if needed.",
      "For a thicker, softer stew, blend about 25 to 30 percent of the pot with an immersion blender.",
    ],
    variations: [
      {
        name: "Quarter Batch",
        description: "Standard saucepan size — about 1 meal for 3 people, with maybe a small extra bowl.",
        yield: "5–6 cups",
        ingredients: [
          "2¼ tsp olive oil",
          "1 medium onion, diced",
          "2 medium carrots, diced",
          "2 celery stalks, diced",
          "2 garlic cloves, minced",
          "1½ tsp fresh ginger, grated",
          "1 to 1½ medium sweet potatoes, peeled and cubed (about 1 lb)",
          "¾ cup dry red lentils, rinsed",
          "1 standard can diced tomatoes (about 398 mL)",
          "3½ cups low-sodium broth or water",
          "½ tsp turmeric",
          "½ tsp black pepper",
          "½ tsp sea salt (or ½ tsp per cup of water — adjust at the end)",
          "¾ tsp dried thyme",
          "125–150 g frozen spinach, or about ½ bunch chopped kale",
          "1½ tsp lemon juice (add at the end)",
        ],
        steps: [
          "Heat the oil over medium heat.",
          "Add onion, carrot, and celery; cook 6 to 8 minutes until softened.",
          "Add garlic and ginger; cook 1 minute.",
          "Add sweet potatoes, lentils, tomatoes, broth, turmeric, pepper, salt, and thyme.",
          "Bring to a boil, then reduce to a gentle simmer.",
          "Simmer 20 to 25 minutes, stirring now and then, until lentils are soft and sweet potatoes are tender.",
          "Stir in spinach or kale and cook 3 to 5 more minutes.",
          "Add lemon juice and taste.",
          "Blend a small portion if you want a softer texture.",
        ],
      },
      {
        name: "Half Batch",
        description: "Standard soup pot size — about 2 meals for 3 people.",
        yield: "10–12 cups",
        ingredients: [
          "1½ tbsp olive oil",
          "2 medium onions, diced",
          "4 medium carrots, diced",
          "4 celery stalks, diced",
          "4 garlic cloves, minced",
          "1 tbsp fresh ginger, grated",
          "2½ to 3 medium sweet potatoes, peeled and cubed (about 2 lb)",
          "1½ cups dry red lentils, rinsed",
          "1 large can diced tomatoes (796 mL)",
          "7 cups low-sodium broth or water",
          "1 tsp turmeric",
          "1 tsp black pepper",
          "1 tsp sea salt (or ½ tsp per cup of water — adjust at the end)",
          "1½ tsp dried thyme",
          "250–300 g frozen spinach, or 1 bunch chopped kale",
          "1 tbsp lemon juice (add at the end)",
        ],
        steps: [
          "Heat the oil over medium heat.",
          "Add onion, carrot, and celery; cook 8 to 10 minutes until softened.",
          "Add garlic and ginger; cook 1 minute.",
          "Add sweet potatoes, lentils, tomatoes, broth, turmeric, pepper, salt, and thyme.",
          "Bring to a boil, then reduce to a gentle simmer.",
          "Simmer 25 to 30 minutes, stirring occasionally, until everything is tender.",
          "Stir in spinach or kale and cook 5 more minutes.",
          "Add lemon juice and taste.",
          "Blend 20 to 30 percent of the pot if you want it thicker and softer.",
        ],
      },
    ],
  },
];

export function getAllRecipes(): Recipe[] {
  return recipes;
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}
