import { renderIngredients } from "@/lib/dishScaling";
import type { DishScalerConfig } from "@/lib/dishScaling";
import { renderAmountIngredients } from "@/lib/amountScaling";
import type { AmountScalerConfig } from "@/lib/amountScaling";
import type { IngredientSubstitution } from "@/lib/substitutions";
import type { ShoppingItem } from "@/lib/shopping";
import { shoppingLists } from "@/data/shopping";

export interface RecipeSource {
  name: string;
  url: string;
}

export interface RecipeVariation {
  name: string;
  description: string;
  yield: string;
  ingredients: string[];
  steps: string[];
}

export interface CalculatorIngredient {
  name: string;
  perUnit: number;
  section?: string;
}

export interface CalculatorSection {
  key: string;
  label: string;
  caption?: string;
  summaryPrefix: string;
}

export interface CalculatorConfig {
  inputLabel: string;
  unitSingular: string;
  unitPlural: string;
  defaultValue: number;
  summarySuffix: string;
  ingredients: CalculatorIngredient[];
  sections?: CalculatorSection[];
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
  calculator?: CalculatorConfig;
  dishScaler?: DishScalerConfig;
  amountScaler?: AmountScalerConfig;
  substitution?: IngredientSubstitution;
  shopping?: ShoppingItem[];
  notes?: string[];
  source?: RecipeSource;
}

const tunaCasseroleScaler: DishScalerConfig = {
  reference: { shape: "rectangle", length: 13, width: 9, depth: 2 },
  referenceServings: 8,
  headroom: 0.5,
  defaultPresetId: "shaynes",
  presets: [
    {
      id: "shaynes",
      label: "Shayne's dish: 12.5″ × 10″ × 2.5″",
      dims: { shape: "rectangle", length: 12.5, width: 10, depth: 2.5 },
    },
    {
      id: "original",
      label: "Original: 13″ × 9″ × 2″",
      dims: { shape: "rectangle", length: 13, width: 9, depth: 2 },
    },
    {
      id: "8x8",
      label: "8″ × 8″ × 2″ square",
      dims: { shape: "rectangle", length: 8, width: 8, depth: 2 },
    },
    {
      id: "9x9",
      label: "9″ × 9″ × 2″ square",
      dims: { shape: "rectangle", length: 9, width: 9, depth: 2 },
    },
    {
      id: "11x7",
      label: "11″ × 7″ × 2″ rectangle",
      dims: { shape: "rectangle", length: 11, width: 7, depth: 2 },
    },
  ],
  ingredients: [
    { amount: 12, unit: "oz", name: "egg noodles", scaleBy: "volume" },
    {
      amount: 2,
      unit: "can",
      name: "(10.5 oz each) condensed cream of mushroom soup",
      note: "regular or low-sodium",
      scaleBy: "volume",
    },
    { amount: 1, unit: "cup", name: "milk", scaleBy: "volume" },
    { amount: 1, unit: "cup", name: "frozen peas", note: "thawed", scaleBy: "volume" },
    {
      amount: 10,
      unit: "oz",
      name: "canned tuna",
      note: "drained and flaked",
      scaleBy: "volume",
      alt: { size: 5, label: "5 oz cans" },
    },
    {
      amount: 1.5,
      unit: "cup",
      name: "shredded cheddar cheese",
      note: "to mix into the sauce",
      scaleBy: "volume",
    },
    { amount: 1, unit: "tsp", name: "garlic powder", scaleBy: "volume" },
    { amount: 1, unit: "tsp", name: "onion powder", scaleBy: "volume" },
    {
      amount: 1,
      unit: "tsp",
      name: "seasoning salt",
      note: "or the same amount of salt plus half as much black pepper",
      scaleBy: "volume",
    },
    {
      amount: 0.5,
      unit: "cup",
      name: "shredded cheddar cheese",
      note: "for the top",
      scaleBy: "area",
    },
    {
      amount: 1,
      unit: "cup",
      name: "buttery round cracker crumbs",
      note: "for the topping",
      scaleBy: "area",
    },
    {
      amount: 4,
      unit: "tbsp",
      name: "salted butter",
      note: "melted, for the topping",
      scaleBy: "area",
    },
  ],
};

// Reference pan: a 10-inch springform. Its depth isn't stated in the source,
// so 2.75in (a common springform depth) is assumed.
const scallopedBakeScaler: DishScalerConfig = {
  reference: { shape: "round", length: 10, width: 10, depth: 2.75 },
  referenceServings: 6,
  headroom: 0.5,
  defaultPresetId: "shaynes",
  presets: [
    {
      id: "shaynes",
      label: "Shayne's dish: 12.5″ × 10″ × 2.5″",
      dims: { shape: "rectangle", length: 12.5, width: 10, depth: 2.5 },
    },
    {
      id: "original",
      label: "Original: 10″ round springform",
      dims: { shape: "round", length: 10, width: 10, depth: 2.75 },
    },
    {
      id: "8x8",
      label: "8″ × 8″ × 2″ square",
      dims: { shape: "rectangle", length: 8, width: 8, depth: 2 },
    },
    {
      id: "9x9",
      label: "9″ × 9″ × 2″ square",
      dims: { shape: "rectangle", length: 9, width: 9, depth: 2 },
    },
    {
      id: "13x9",
      label: "13″ × 9″ × 2″ rectangle",
      dims: { shape: "rectangle", length: 13, width: 9, depth: 2 },
    },
  ],
  bakeNotes: {
    same: "Your layers will be about as deep as the original, so bake about 1½ hours, covered with foil. Poke the middle with a fork: if the vegetables still feel tough, put it back for another 15–30 minutes and check again.",
    deeper:
      "Your layers will be thicker than the original, so it may need 15–30 minutes longer. Poke the middle with a fork: if the vegetables still feel tough, put it back for another 15–30 minutes and check again.",
    shallower:
      "Your layers will be thinner than the original, so start checking at about 1 hour 15 minutes. Poke the middle with a fork: if the vegetables still feel tough, put it back for another 15–30 minutes and check again.",
  },
  ingredients: [
    { amount: 2, unit: "each", name: "medium zucchini", note: "washed", scaleBy: "volume" },
    {
      amount: 3,
      unit: "each",
      name: "medium potatoes",
      note: "washed and peeled",
      scaleBy: "volume",
    },
    {
      amount: 5,
      unit: "each",
      name: "medium carrots",
      note: "washed and peeled",
      scaleBy: "volume",
    },
    { amount: 4, unit: "each", name: "medium eggs", scaleBy: "volume" },
    { amount: 1 / 3, unit: "cup", name: "butter", note: "melted", scaleBy: "volume" },
    { amount: 2 / 3, unit: "cup", name: "milk", scaleBy: "volume" },
    { amount: 0.125, unit: "tsp", name: "nutmeg", scaleBy: "volume" },
    { amount: 0.5, unit: "tsp", name: "dried basil", scaleBy: "volume" },
    { amount: 0.5, unit: "tsp", name: "dried thyme", scaleBy: "volume" },
    { amount: 0, unit: "tsp", name: "", text: "salt, to taste", scaleBy: "volume" },
    { amount: 0, unit: "tsp", name: "", text: "pepper, to taste", scaleBy: "volume" },
    { amount: 1, unit: "cup", name: "all-purpose flour", scaleBy: "volume" },
    {
      amount: 1.5,
      unit: "cup",
      name: "shredded cheddar cheese",
      note: "for the middle layer",
      scaleBy: "area",
    },
  ],
};

// Kimchi (~150 g per cup) and cubed Spam (~165 g per cup) are converted from the
// source's grams to cups using those rough densities; the rice cup is assumed to
// be the 180 mL rice-cooker cup, which is what the 375 mL of water implies.
const kimchiSpamRiceScaler: AmountScalerConfig = {
  inputLabel: "Cups of rice",
  riceName: "jasmine rice",
  reference: 3,
  defaultAmount: 3,
  referenceCupId: "cooker",
  defaultCupId: "cooker",
  cupOptions: [
    { id: "cooker", label: "Rice-cooker cup (180 mL)", noun: "rice-cooker cup", ml: 180 },
    { id: "standard", label: "Standard measuring cup (240 mL)", noun: "cup", ml: 240 },
  ],
  ingredients: [
    { amount: 3, unit: "tbsp", name: "gochujang", smart: true, scaleBy: "volume" },
    { amount: 1, unit: "tbsp", name: "fish sauce", smart: true, scaleBy: "volume" },
    {
      amount: 250 / 150,
      unit: "cup",
      name: "kimchi",
      note: "chopped",
      smart: true,
      metric: { perUnit: 150, unit: "g" },
      scaleBy: "volume",
    },
    { amount: 2, unit: "tbsp", name: "sesame oil", smart: true, scaleBy: "volume" },
    {
      amount: 1.5,
      unit: "cup",
      name: "water",
      smart: true,
      metric: { perUnit: 250, unit: "mL" },
      scaleBy: "volume",
    },
    {
      amount: 250 / 165,
      unit: "cup",
      name: "Spam",
      note: "cubed",
      smart: true,
      metric: { perUnit: 165, unit: "g" },
      scaleBy: "volume",
    },
    { amount: 0, unit: "tsp", name: "", text: "fried egg, optional", scaleBy: "volume" },
    { amount: 0, unit: "tsp", name: "", text: "spring onion, sliced, for garnish", scaleBy: "volume" },
    { amount: 0, unit: "tsp", name: "", text: "chili crunch, optional", scaleBy: "volume" },
  ],
};

// Per 1 tbsp of gochujang: about 1/2 tbsp miso + 1/2 tbsp sriracha or gochugaru
// + 1/2 tsp sugar, scaled up to the recipe's 3 tbsp. Ratios vary between sources.
const gochujangSubstitution: IngredientSubstitution = {
  title: "No gochujang? Try one of these",
  replaces: "the 3 tbsp of gochujang",
  options: [
    {
      name: "Miso + sriracha + sugar",
      parts: [
        { amount: 1.5, unit: "tbsp", name: "miso (white or red)", smart: true, scaleBy: "volume" },
        { amount: 1.5, unit: "tbsp", name: "sriracha", smart: true, scaleBy: "volume" },
        { amount: 1.5, unit: "tsp", name: "sugar", smart: true, scaleBy: "volume" },
      ],
      note: "The easiest pantry swap. Stir it into a paste before it goes in the rice cooker.",
    },
    {
      name: "Miso + Korean chili flakes + sugar",
      parts: [
        { amount: 1.5, unit: "tbsp", name: "miso (white or red)", smart: true, scaleBy: "volume" },
        { amount: 1.5, unit: "tbsp", name: "gochugaru (Korean chili flakes)", smart: true, scaleBy: "volume" },
        { amount: 1.5, unit: "tsp", name: "sugar", smart: true, scaleBy: "volume" },
      ],
      note: "Closest match to the real thing, with no vinegar tang. No gochugaru? Cayenne and paprika can stand in, roughly half of each. Start with less heat and add more.",
    },
    {
      name: "Ssamjang",
      parts: [{ amount: 3, unit: "tbsp", name: "ssamjang", smart: true, scaleBy: "volume" }],
      note: "A Korean dipping sauce that already contains gochujang and fermented soybean paste, so it tastes similar but is chunkier. Taste first, since sources do not give an exact swap ratio.",
    },
    {
      name: "Tomato paste + chili flakes",
      parts: [
        { amount: 3, unit: "tbsp", name: "tomato paste", smart: true, scaleBy: "volume" },
        { amount: 1, unit: "tbsp", name: "red pepper (chili) flakes", smart: true, scaleBy: "volume" },
        { amount: 1.5, unit: "tsp", name: "soy sauce", smart: true, scaleBy: "volume" },
        { amount: 1.5, unit: "tsp", name: "sugar", smart: true, scaleBy: "volume" },
      ],
      note: "Pantry staples only. It gives the sweet heat and thick body but not the fermented depth, so stir in a little miso if you have it. My blend of the amounts the recipe sites suggest.",
    },
    {
      name: "Ketchup + chili flakes + soy sauce",
      parts: [
        { amount: 3, unit: "tbsp", name: "ketchup", smart: true, scaleBy: "volume" },
        { amount: 1, unit: "tbsp", name: "red pepper (chili) flakes", smart: true, scaleBy: "volume" },
        { amount: 3, unit: "tsp", name: "soy sauce", smart: true, scaleBy: "volume" },
      ],
      note: "The last-resort swap. Ketchup is already sweet, so there is no sugar. It will taste milder and sweeter than gochujang, so add more chili flakes for heat. My blend of the amounts the recipe sites suggest.",
    },
  ],
  caution:
    "Don't swap plain hot sauce for gochujang one for one. Sriracha and sambal oelek contain vinegar, so the rice comes out spicier and tangier. Miso and soy sauce are salty too, so go easy on extra fish sauce. None of these have gochujang's fermented depth, and the thick pastes may need a splash of water to blend into the rice.",
  sources: [
    { name: "Hip Hip Gourmet", url: "https://hiphipgourmet.com/gochujang-substitutes/" },
    { name: "Savory Sweet Spoon", url: "https://www.savorysweetspoon.com/gochujang-substitute/" },
    { name: "Pepper Geek", url: "https://peppergeek.com/gochujang-substitute/" },
    { name: "PepperScale", url: "https://pepperscale.com/gochujang-substitute/" },
    { name: "Bake It With Love", url: "https://bakeitwithlove.com/gochujang-substitute" },
    { name: "The Daily Meal", url: "https://www.thedailymeal.com/1260819/gochujang-best-replacement/" },
  ],
};

const baseRecipes: Recipe[] = [
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
      "A warm, fragrant dry rub built around pimento (allspice) and a whisper of cinnamon — the backbone of Jamaican jerk flavor. Finished with a Grace jerk seasoning wet rub after a 30-minute rest. Measured for 1 lb of chicken.",
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
      "2 tsp Grace jerk seasoning (wet rub — apply after the 30 min rest)",
    ],
    steps: [
      "Combine all dry rub spices in a small bowl and whisk until evenly blended.",
      "Pat the chicken dry with paper towels — dry skin grips the rub and crisps better.",
      "Sprinkle the dry rub over all sides of the chicken, pressing it in so it sticks.",
      "Let the chicken rest at least 30 minutes at room temperature, or cover and refrigerate up to overnight for deeper flavor. The wet rub goes on AFTER this rest — don't skip it.",
      "Once rested, rub 2 tsp Grace jerk seasoning evenly over the chicken for a sticky, flavor-packed finish.",
      "Cook as desired: grill, bake, or pan-sear until internal temp reaches 165°F.",
    ],
    calculator: {
      inputLabel: "Pounds of chicken",
      unitSingular: "pound",
      unitPlural: "pounds",
      defaultValue: 1,
      summarySuffix: "of chicken",
      sections: [
        {
          key: "dry",
          label: "Dry rub",
          caption: "Combine, then apply to the chicken first.",
          summaryPrefix: "use",
        },
        {
          key: "wet",
          label: "Wet rub",
          caption:
            "Apply only AFTER the dry rub has rested on the chicken for at least 30 minutes.",
          summaryPrefix: "After the chicken has rested at least 30 minutes, rub on",
        },
      ],
      ingredients: [
        { name: "Salt", perUnit: 1.25, section: "dry" },
        { name: "Garlic powder", perUnit: 0.75, section: "dry" },
        { name: "Coriander", perUnit: 0.375, section: "dry" },
        { name: "Black pepper", perUnit: 0.25, section: "dry" },
        { name: "Red pepper flakes", perUnit: 0.125, section: "dry" },
        { name: "Crushed pimento (allspice)", perUnit: 0.125, section: "dry" },
        { name: "Cinnamon", perUnit: 0.125, section: "dry" },
        { name: "Grace jerk seasoning", perUnit: 2, section: "wet" },
      ],
    },
  },
  {
    slug: "old-fashioned-tuna-noodle-casserole",
    title: "Old Fashioned Tuna Noodle Casserole",
    description:
      "A creamy, cheesy vintage casserole of egg noodles, tuna and peas in a mushroom-soup sauce, finished with a buttery cracker crumb crust. Enter your baking dish size and every amount adjusts to fit.",
    prepTime: "15 min",
    cookTime: "25–30 min",
    servings: "8 in a 9×13 dish (scales to your dish)",
    tags: ["casserole", "dinner", "vintage", "comfort food"],
    ingredients: renderIngredients(
      tunaCasseroleScaler,
      tunaCasseroleScaler.reference
    ),
    steps: [
      "Preheat the oven to 375°F. Butter or spray your baking dish with nonstick spray.",
      "Cook the egg noodles in well-salted water until just al dente (they keep cooking in the oven, so don't overdo it). Drain and set aside.",
      "In a large bowl, stir the cream of mushroom soup and milk together until smooth. Stir in the peas, flaked tuna, the mixed-in cheddar, garlic powder, onion powder and seasoning salt.",
      "Add the cooked noodles and stir gently until they are coated and the cheese is starting to melt.",
      "Pour the mixture into the prepared dish and sprinkle the topping cheddar over the surface.",
      "In a small bowl, stir the cracker crumbs and melted butter together until evenly moistened, then sprinkle over the cheese.",
      "Bake until the top is golden brown and the casserole is bubbly (25–30 minutes in the original 9×13 dish; see the baking note above for your dish). Garnish with chopped fresh parsley if you like.",
    ],
    dishScaler: tunaCasseroleScaler,
    notes: [
      "Make ahead: assemble the casserole without the cracker topping, wrap and refrigerate for up to a day. Add the topping just before baking.",
      "Storage: refrigerate leftovers in an airtight container for up to 4 days, or freeze for up to 2 months. Let it sit at room temperature for 30 minutes before reheating in the oven.",
      "Prefer homemade cream of mushroom soup? Dinner in 321 has a from-scratch version on the original recipe page.",
    ],
    source: {
      name: "Dinner in 321 (Laura Ashley Johnson)",
      url: "https://www.dinnerin321.com/old-fashioned-tuna-noodle-casserole/",
    },
  },
  {
    slug: "scalloped-vegetable-bake",
    title: "Scalloped Vegetable Bake",
    description:
      "Paper-thin zucchini, potato and carrot slices coated in a light herb batter, layered with cheddar and baked until tender. Enter your baking dish size and every amount adjusts to fit.",
    prepTime: "30 min",
    cookTime: "1 hr 30 min",
    servings: "6 in a 10-inch springform pan (scales to your dish)",
    tags: ["bake", "vegetarian", "dinner", "side dish"],
    ingredients: renderIngredients(
      scallopedBakeScaler,
      scallopedBakeScaler.reference
    ),
    steps: [
      "Preheat the oven to 350°F (180°C). Line your baking dish with parchment paper. The original uses a 10-inch (25 cm) springform pan.",
      "Slice the zucchini, potatoes and carrots very thinly with a mandoline or a sharp knife. Watch your fingers!",
      "In a large bowl, whisk the eggs, melted butter and milk together until combined.",
      "Add the nutmeg, basil, thyme, salt, pepper and flour, and whisk well.",
      "Add the sliced vegetables to the batter and stir until every slice is well coated.",
      "Spread half of the vegetable slices in the prepared dish and flatten them with a spoon.",
      "Sprinkle the cheddar evenly over the vegetables.",
      "Top with the rest of the vegetables, then cover the dish with aluminum foil.",
      "Bake for about 1½ hours, then poke the middle with a fork or knife. The vegetables should slide off easily and feel fully tender. If they still look or feel tough, cover the dish again and put it back in the oven for another 15–30 minutes, checking with the fork each time. Go by tenderness rather than the clock (see the baking note above for your dish).",
      "Let it cool for at least 10 minutes. If you used a springform pan, release the ring, then slice and serve.",
    ],
    dishScaler: scallopedBakeScaler,
    notes: [
      "Nutrition per serving, from the original recipe: 421 calories, 40 g carbohydrate, 22 g fat, 4 g fiber, 16 g protein, 5 g sugar.",
      "Doneness check: when this was first made, 1½ hours left the vegetables a little firm. Oven and dish differences matter, so always test the middle with a fork. If it's still tough, cover it and bake another 15–30 minutes.",
      "Portion scaling assumes the original 10-inch springform is about 2¾ inches deep (the source doesn't say), so treat the amounts for other dishes as a close guide.",
    ],
    source: {
      name: "Tasty",
      url: "https://tasty.co/recipe/scalloped-vegetable-bake",
    },
  },
  {
    slug: "kimchi-spam-rice-cooker-rice",
    title: "Kimchi & Spam Rice Cooker Rice",
    description:
      "A savory, spicy one-button meal: jasmine rice, gochujang, kimchi and cubed Spam all go in the rice cooker together. Top it with a fried egg, spring onion and chili crunch. Enter how much rice you are cooking and every amount adjusts, in cups and spoons.",
    prepTime: "—",
    cookTime: "1 rice cooker cycle",
    servings: "Scales to the rice you cook (3 rice-cooker cups as written)",
    tags: ["rice cooker", "one-pot", "weeknight", "korean-inspired"],
    ingredients: renderAmountIngredients(kimchiSpamRiceScaler, 3, "cooker"),
    steps: [
      "Put the jasmine rice in the rice cooker pot.",
      "Add the water, gochujang, fish sauce and sesame oil, and stir until the gochujang dissolves.",
      "Add the chopped kimchi and cubed Spam on top.",
      "Close the lid and start the rice cooker. That's the whole cook.",
      "When it finishes, stir everything together.",
      "Serve topped with a fried egg, sliced spring onion and chili crunch, as you like.",
    ],
    amountScaler: kimchiSpamRiceScaler,
    substitution: gochujangSubstitution,
    notes: [
      "Which cup? The recipe I was given said \"3 cups\" of rice with 375 mL of water and did not say which cup. That much water only makes sense for the small 180 mL cup that comes with a rice cooker (about 1 part water to 1 part rice is a common rice-cooker ratio for jasmine, though yours may differ), so the page assumes that cup. If you measure rice in standard 240 mL cups, switch the cup size above and every amount scales up to match.",
      "If your rice comes out too firm or too soft, adjust the water a little next time and keep the same amount.",
      "Kimchi and Spam were given in grams (250 g each). The cup amounts use rough densities of about 150 g per cup for kimchi and about 165 g per cup for cubed Spam, so treat them as close guides. A 12 oz (340 g) can of Spam is a little more than you need at the original size.",
      "The source only said to put everything in the rice cooker and press start. The step wording here is mine, and the original author is not known.",
    ],
  },
];

const recipes: Recipe[] = baseRecipes.map((r) => ({
  ...r,
  shopping: shoppingLists[r.slug],
}));

export function getAllRecipes(): Recipe[] {
  return recipes;
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}
