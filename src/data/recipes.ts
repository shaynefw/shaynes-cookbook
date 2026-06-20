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
  {
    slug: "ginger-snake-tea",
    title: "Ginger Snake Tea",
    description:
      "A fiery, electrolyte-packed ginger tea designed to keep you hydrated all day. Brewed with fresh ginger, potassium, and pink salt — makes a full 2-liter thermos.",
    prepTime: "5 min",
    cookTime: "15 min",
    servings: "2 liters (one full day's supply)",
    tags: ["drink", "hydration", "wellness"],
    ingredients: [
      "2.2 liters water (extra 200 ml accounts for evaporation during boiling)",
      "2–3 inch piece fresh ginger root",
      "1 tsp NoSalt (sodium-free salt, for potassium)",
      "½ tsp Himalayan pink salt",
      "1 tbsp fresh lemon juice (optional)",
    ],
    steps: [
      "Take your 2–3 inch piece of fresh ginger. Wash it (no need to peel). Slice it into thin coins to maximize surface area.",
      "Pour the water into a pot and add the ginger slices.",
      "Bring to a boil, then reduce heat and simmer for 15 minutes. Simmer longer if you want a stronger, spicier kick.",
      "Turn off the heat. While the water is still hot, add 1 tsp NoSalt and ½ tsp pink salt.",
      "Stir until completely dissolved — the salts will melt instantly in the hot liquid.",
      "Strain out the ginger slices (or leave them in if you like strong flavor).",
      "Add the optional 1 tbsp lemon juice.",
      "Pour into your 2-liter thermos or jug.",
    ],
  },
  {
    slug: "whittles-pepper-sauce",
    title: "Whittle's Pepper Sauce",
    description:
      "A fiery Caribbean-style pepper sauce with Scotch Bonnets, garlic, mustard, and fresh cilantro standing in for chadon beni. Blend it smooth or leave it chunky — either way, it brings the heat.",
    prepTime: "10 min",
    cookTime: "5 min",
    servings: "1 bottle",
    tags: ["sauce", "spicy", "caribbean"],
    ingredients: [
      "1 lb Scotch Bonnet peppers, stems removed",
      "1 cup white vinegar",
      "2 tbsp yellow prepared mustard (or 1 tbsp dry mustard powder)",
      "6–8 garlic cloves, roughly chopped",
      "1½ tbsp fine sea salt",
      "2 tbsp fresh cilantro leaves, lightly packed and chopped (standing in for chadon beni)",
    ],
    steps: [
      "Remove stems from the peppers. For a milder sauce, remove some or all of the seeds.",
      "Combine all ingredients in a blender or food processor.",
      "Blend until smooth (or pulse for a chunkier texture).",
      "Taste and adjust salt or vinegar to your preference.",
      "Transfer to a clean bottle or jar. Store in the fridge — it keeps for weeks.",
    ],
    variations: [
      {
        name: "Half Batch",
        description: "For ½ lb of Scotch Bonnet peppers.",
        yield: "1 small bottle",
        ingredients: [
          "½ lb Scotch Bonnet peppers, stems removed",
          "½ cup white vinegar",
          "1 tbsp yellow prepared mustard (or 1½ tsp dry mustard powder)",
          "3–4 garlic cloves, chopped",
          "2–2¼ tsp fine sea salt",
          "1 tbsp fresh cilantro leaves, lightly packed and chopped",
        ],
        steps: [
          "Remove stems from the peppers. For a milder sauce, remove some or all of the seeds.",
          "Combine all ingredients in a blender or food processor.",
          "Blend until smooth (or pulse for a chunkier texture).",
          "Taste and adjust salt or vinegar to your preference.",
          "Transfer to a clean bottle or jar. Store in the fridge — it keeps for weeks.",
        ],
      },
    ],
  },
  {
    slug: "jerk-chicken-dry-rub",
    title: "Jerk Chicken Dry Rub",
    description:
      "A warm, fragrant dry rub built around pimento (allspice) and a whisper of cinnamon — the backbone of Jamaican jerk flavor. Measured for 1 lb of chicken.",
    prepTime: "5 min",
    cookTime: "—",
    servings: "Seasoning for 1 lb of chicken",
    tags: ["seasoning", "rub", "caribbean", "spicy"],
    ingredients: [
      "1¼ tsp salt",
      "¾ tsp garlic powder",
      "⅜ tsp coriander",
      "¼ tsp black pepper",
      "⅛ tsp red pepper flakes",
      "⅛ tsp crushed pimento (allspice)",
      "⅛ tsp cinnamon",
    ],
    steps: [
      "Combine all spices in a small bowl and whisk until evenly blended.",
      "Pat the chicken dry with paper towels — dry skin grips the rub and crisps better.",
      "Sprinkle the rub over all sides of the chicken, pressing it in so it sticks.",
      "Let the chicken rest at least 30 minutes at room temperature, or cover and refrigerate up to overnight for deeper flavor.",
      "Cook as desired: grill, bake, or pan-sear until internal temp reaches 165°F.",
    ],
  },
];

export function getAllRecipes(): Recipe[] {
  return recipes;
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}
