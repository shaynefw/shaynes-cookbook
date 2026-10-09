import type { ShoppingItem } from "@/lib/shopping";

// Pack sizes are typical, not exact: brands and stores vary. "buy" says how
// the item is sold, "uses" says how much of it the recipe needs.

const bananaBread: ShoppingItem[] = [
  {
    name: "Bananas",
    aisle: "Produce",
    buy: "1 small bunch, very ripe (spotty brown)",
    uses: "3 medium (1½ cups mashed)",
  },
  {
    name: "Eggs",
    aisle: "Dairy & eggs",
    buy: "1 carton (6 or 12)",
    uses: "2 large",
  },
  {
    name: "Butter",
    aisle: "Dairy & eggs",
    buy: "1 package (1 lb / 454 g) or 1 stick",
    uses: "½ cup (1 stick)",
  },
  {
    name: "Milk",
    aisle: "Dairy & eggs",
    buy: "1 small carton (500 mL / 1 pint)",
    uses: "2 tbsp",
  },
  {
    name: "All-purpose flour",
    aisle: "Baking",
    buy: "1 bag (the smallest size is plenty)",
    uses: "2½ cups (about 310 g)",
  },
  {
    name: "Baking powder",
    aisle: "Baking",
    buy: "1 small tin",
    uses: "2 tsp",
  },
  {
    name: "Baking soda",
    aisle: "Baking",
    buy: "1 box",
    uses: "½ tsp",
  },
  {
    name: "Vanilla or almond extract",
    aisle: "Baking",
    buy: "1 small bottle",
    uses: "2 tsp",
  },
  {
    name: "Honey or maple syrup",
    aisle: "Baking",
    buy: "1 jar of honey (about 12 oz / 340 g) OR 1 bottle of maple syrup (250 mL / 8 oz or larger)",
    uses: "⅔ cup honey, or 1 cup maple syrup",
  },
  {
    name: "Raisins",
    aisle: "Baking",
    buy: "1 box or bag (the smallest size is fine)",
    uses: "1 cup (about 5 oz / 150 g)",
  },
  {
    name: "Walnuts or mixed nuts",
    aisle: "Baking",
    buy: "1 small bag",
    uses: "a handful for the top",
  },
  {
    name: "Rum or brandy",
    aisle: "Other",
    buy: "A splash from the cabinet, or 1 mini bottle (50 mL)",
    uses: "a splash to soak the raisins",
    optional: true,
  },
  {
    name: "Salt",
    aisle: "Spices & seasonings",
    buy: "Pantry staple",
    uses: "¾ tsp",
    pantry: true,
  },
];

const okinawanStew: ShoppingItem[] = [
  {
    name: "Yellow onions",
    aisle: "Produce",
    buy: "3 large onions (or a 3 lb bag)",
    uses: "3 large, diced",
    variations: {
      "Half Batch": { buy: "2 medium onions", uses: "2 medium, diced" },
      "Quarter Batch": { buy: "1 medium onion", uses: "1 medium, diced" },
    },
  },
  {
    name: "Carrots",
    aisle: "Produce",
    buy: "1 bag (2 lb / 1 kg)",
    uses: "8 medium, diced",
    variations: {
      "Half Batch": { buy: "1 bag (1–2 lb), or 4 loose carrots", uses: "4 medium" },
      "Quarter Batch": { buy: "2 loose carrots (or a small bag)", uses: "2 medium" },
    },
  },
  {
    name: "Celery",
    aisle: "Produce",
    buy: "1 bunch (a bunch has about 8–12 stalks)",
    uses: "8 stalks",
    variations: {
      "Half Batch": { buy: "1 bunch", uses: "4 stalks" },
      "Quarter Batch": { buy: "1 bunch (or a celery heart)", uses: "2 stalks" },
    },
  },
  {
    name: "Garlic",
    aisle: "Produce",
    buy: "1 head (a large head has 10–12 cloves)",
    uses: "8 cloves",
    variations: {
      "Half Batch": { buy: "1 head", uses: "4 cloves" },
      "Quarter Batch": { buy: "1 head", uses: "2 cloves" },
    },
  },
  {
    name: "Fresh ginger",
    aisle: "Produce",
    buy: "1 piece about 3 inches long",
    uses: "2 tbsp grated",
    variations: {
      "Half Batch": { buy: "1 small piece", uses: "1 tbsp grated" },
      "Quarter Batch": { buy: "1 small piece", uses: "1½ tsp grated" },
    },
  },
  {
    name: "Sweet potatoes",
    aisle: "Produce",
    buy: "5–6 medium (about 4 lb / 1.8 kg total)",
    uses: "peeled and cubed",
    variations: {
      "Half Batch": { buy: "2–3 medium (about 2 lb / 900 g)" },
      "Quarter Batch": { buy: "1–2 medium (about 1 lb / 450 g)" },
    },
  },
  {
    name: "Lemon",
    aisle: "Produce",
    buy: "1 lemon (yields about 2–3 tbsp juice)",
    uses: "2 tbsp juice, added at the end",
    variations: {
      "Half Batch": { uses: "1 tbsp juice" },
      "Quarter Batch": { uses: "1½ tsp juice" },
    },
  },
  {
    name: "Frozen spinach (or kale)",
    aisle: "Frozen",
    buy: "1 large bag frozen spinach (500–600 g), or 2 bunches kale from produce",
    uses: "500–600 g",
    variations: {
      "Half Batch": {
        buy: "1 bag frozen spinach (about 300 g), or 1 bunch kale",
        uses: "250–300 g",
      },
      "Quarter Batch": {
        buy: "1 small bag frozen spinach (use about half), or ½ bunch kale",
        uses: "125–150 g",
      },
    },
  },
  {
    name: "Diced tomatoes",
    aisle: "Canned & jarred",
    buy: "2 large cans (796 mL / 28 oz each)",
    uses: "2 large cans",
    variations: {
      "Half Batch": { buy: "1 large can (796 mL / 28 oz)", uses: "1 large can" },
      "Quarter Batch": { buy: "1 standard can (398 mL / 14 oz)", uses: "1 standard can" },
    },
  },
  {
    name: "Low-sodium broth (or just water)",
    aisle: "Canned & jarred",
    buy: "4 cartons (1 L / 32 oz each), or use water instead",
    uses: "14 cups (about 3.3 L)",
    variations: {
      "Half Batch": { buy: "2 cartons (1 L / 32 oz each), or water", uses: "7 cups" },
      "Quarter Batch": { buy: "1 carton (1 L / 32 oz), or water", uses: "3½ cups" },
    },
  },
  {
    name: "Red lentils",
    aisle: "Pasta & dry goods",
    buy: "1 bag (about 900 g / 2 lb)",
    uses: "3 cups dry (about 600 g)",
    variations: {
      "Half Batch": { buy: "1 bag (450–900 g)", uses: "1½ cups dry" },
      "Quarter Batch": { buy: "1 bag (the smallest size)", uses: "¾ cup dry" },
    },
  },
  {
    name: "Ground turmeric",
    aisle: "Spices & seasonings",
    buy: "1 jar",
    uses: "2 tsp",
    variations: {
      "Half Batch": { uses: "1 tsp" },
      "Quarter Batch": { uses: "½ tsp" },
    },
  },
  {
    name: "Dried thyme",
    aisle: "Spices & seasonings",
    buy: "1 jar",
    uses: "1 tbsp",
    variations: {
      "Half Batch": { uses: "1½ tsp" },
      "Quarter Batch": { uses: "¾ tsp" },
    },
  },
  {
    name: "Olive oil",
    aisle: "Sauces & condiments",
    buy: "Pantry staple",
    uses: "3 tbsp",
    pantry: true,
    variations: {
      "Half Batch": { uses: "1½ tbsp" },
      "Quarter Batch": { uses: "2¼ tsp" },
    },
  },
  {
    name: "Black pepper",
    aisle: "Spices & seasonings",
    buy: "Pantry staple",
    uses: "2 tsp",
    pantry: true,
    variations: {
      "Half Batch": { uses: "1 tsp" },
      "Quarter Batch": { uses: "½ tsp" },
    },
  },
  {
    name: "Sea salt",
    aisle: "Spices & seasonings",
    buy: "Pantry staple",
    uses: "2 tsp, adjusted at the end",
    pantry: true,
    variations: {
      "Half Batch": { uses: "1 tsp" },
      "Quarter Batch": { uses: "½ tsp" },
    },
  },
];

const gingerSnakeTea: ShoppingItem[] = [
  {
    name: "Fresh ginger",
    aisle: "Produce",
    buy: "1 piece, 3–4 inches long",
    uses: "2–3 inch piece",
  },
  {
    name: "Lemon",
    aisle: "Produce",
    buy: "1 lemon",
    uses: "1 tbsp juice",
    optional: true,
  },
  {
    name: "NoSalt (sodium-free salt substitute)",
    aisle: "Spices & seasonings",
    buy: "1 shaker or bottle (look near the salt, or in the health food aisle)",
    uses: "1 tsp",
  },
  {
    name: "Himalayan pink salt",
    aisle: "Spices & seasonings",
    buy: "1 small jar or grinder",
    uses: "½ tsp",
  },
];

const pepperSauce: ShoppingItem[] = [
  {
    name: "Scotch Bonnet peppers",
    aisle: "Produce",
    buy: "1 lb (about 450 g), usually sold loose by weight or in small bags",
    uses: "1 lb, stems removed",
    note: "Often at Caribbean or international markets. Habaneros are the closest substitute. Wear gloves when handling.",
    variations: {
      "Half Batch": { buy: "½ lb (about 225 g)", uses: "½ lb" },
    },
  },
  {
    name: "Garlic",
    aisle: "Produce",
    buy: "1 head",
    uses: "6–8 cloves",
    variations: {
      "Half Batch": { uses: "3–4 cloves" },
    },
  },
  {
    name: "Fresh cilantro",
    aisle: "Produce",
    buy: "1 small bunch",
    uses: "2 tbsp leaves",
    variations: {
      "Half Batch": { uses: "1 tbsp leaves" },
    },
  },
  {
    name: "White vinegar",
    aisle: "Sauces & condiments",
    buy: "1 bottle (500 mL or larger)",
    uses: "1 cup",
    variations: {
      "Half Batch": { uses: "½ cup" },
    },
  },
  {
    name: "Yellow prepared mustard",
    aisle: "Sauces & condiments",
    buy: "1 squeeze bottle (the smallest size is plenty)",
    uses: "2 tbsp",
    variations: {
      "Half Batch": { uses: "1 tbsp" },
    },
  },
  {
    name: "Fine sea salt",
    aisle: "Spices & seasonings",
    buy: "Pantry staple",
    uses: "1½ tbsp",
    pantry: true,
    variations: {
      "Half Batch": { uses: "2–2¼ tsp" },
    },
  },
  {
    name: "Glass bottle or jar",
    aisle: "Other",
    buy: "1 clean hot-sauce bottle or jar (about 8 oz / 250 mL), or reuse one",
    uses: "to store the sauce",
    optional: true,
  },
];

const jerkChicken: ShoppingItem[] = [
  {
    name: "Chicken",
    aisle: "Meat & seafood",
    buy: "As many pounds as you plan to cook",
    uses: "the rub is measured per pound (use the calculator above)",
  },
  {
    name: "Grace jerk seasoning",
    aisle: "Sauces & condiments",
    buy: "1 jar (check the Caribbean or international foods aisle)",
    uses: "2 tsp per lb of chicken",
  },
  {
    name: "Garlic powder",
    aisle: "Spices & seasonings",
    buy: "1 jar",
    uses: "¾ tsp per lb",
  },
  {
    name: "Ground coriander",
    aisle: "Spices & seasonings",
    buy: "1 jar",
    uses: "⅜ tsp per lb",
  },
  {
    name: "Red pepper flakes",
    aisle: "Spices & seasonings",
    buy: "1 jar",
    uses: "⅛ tsp per lb",
  },
  {
    name: "Allspice (pimento)",
    aisle: "Spices & seasonings",
    buy: "1 jar, ground or whole berries",
    uses: "⅛ tsp per lb, crushed",
    note: "If you buy whole berries, crush them first.",
  },
  {
    name: "Ground cinnamon",
    aisle: "Spices & seasonings",
    buy: "1 jar",
    uses: "⅛ tsp per lb",
  },
  {
    name: "Salt",
    aisle: "Spices & seasonings",
    buy: "Pantry staple",
    uses: "1¼ tsp per lb",
    pantry: true,
  },
  {
    name: "Black pepper",
    aisle: "Spices & seasonings",
    buy: "Pantry staple",
    uses: "¼ tsp per lb",
    pantry: true,
  },
];

const tunaCasserole: ShoppingItem[] = [
  {
    name: "Fresh parsley",
    aisle: "Produce",
    buy: "1 small bunch",
    uses: "chopped, for garnish",
    optional: true,
  },
  {
    name: "Cheddar cheese",
    aisle: "Dairy & eggs",
    pack: {
      label: "8 oz bag shredded cheddar (about 2 cups)",
      plural: "8 oz bags shredded cheddar (about 2 cups each)",
      size: 2,
      unit: "cup",
      needed: [
        { amount: 1.5, scaleBy: "volume" },
        { amount: 0.5, scaleBy: "area" },
      ],
    },
    note: "Or buy a block and shred it yourself: about 4 oz per cup.",
  },
  {
    name: "Milk",
    aisle: "Dairy & eggs",
    pack: {
      label: "pint (2 cup / about 500 mL) carton",
      plural: "pint (2 cup / about 500 mL) cartons",
      size: 2,
      unit: "cup",
      needed: [{ amount: 1, scaleBy: "volume" }],
    },
  },
  {
    name: "Salted butter",
    aisle: "Dairy & eggs",
    buy: "1 package (1 lb / 454 g) or 1 stick",
    usesScaled: { needed: [{ amount: 4, scaleBy: "area" }], unit: "tbsp" },
  },
  {
    name: "Frozen peas",
    aisle: "Frozen",
    pack: {
      label: "12 oz bag (340 g or larger)",
      plural: "12 oz bags (340 g or larger)",
      size: 2.5,
      unit: "cup",
      needed: [{ amount: 1, scaleBy: "volume" }],
    },
  },
  {
    name: "Cream of mushroom soup",
    aisle: "Canned & jarred",
    pack: {
      label: "10.5 oz can condensed soup",
      plural: "10.5 oz cans condensed soup",
      size: 1,
      unit: "can",
      needed: [{ amount: 2, scaleBy: "volume" }],
    },
    note: "Regular or low-sodium. Dinner in 321 also has a homemade version.",
  },
  {
    name: "Canned tuna",
    aisle: "Canned & jarred",
    pack: {
      label: "5 oz (142 g) can",
      plural: "5 oz (142 g) cans",
      size: 5,
      unit: "oz",
      needed: [{ amount: 10, scaleBy: "volume" }],
    },
    note: "A can drains to a little under its label weight. For a very tuna-y casserole, grab one extra.",
  },
  {
    name: "Egg noodles",
    aisle: "Pasta & dry goods",
    pack: {
      label: "12 oz bag",
      plural: "12 oz bags",
      size: 12,
      unit: "oz",
      needed: [{ amount: 12, scaleBy: "volume" }],
    },
    note: "Leftover noodles keep fine in the pantry.",
  },
  {
    name: "Buttery round crackers (like Ritz)",
    aisle: "Crackers & snacks",
    buy: "1 box (you'll use about 1–1½ sleeves)",
    uses: "about 1 cup of crumbs",
    note: "Roughly 1 sleeve makes 1 cup of crumbs. Crush one and measure to be sure.",
  },
  {
    name: "Garlic powder",
    aisle: "Spices & seasonings",
    buy: "1 jar",
    usesScaled: { needed: [{ amount: 1, scaleBy: "volume" }], unit: "tsp" },
  },
  {
    name: "Onion powder",
    aisle: "Spices & seasonings",
    buy: "1 jar",
    usesScaled: { needed: [{ amount: 1, scaleBy: "volume" }], unit: "tsp" },
  },
  {
    name: "Seasoning salt",
    aisle: "Spices & seasonings",
    buy: "1 container, or use plain salt plus pepper instead",
    usesScaled: { needed: [{ amount: 1, scaleBy: "volume" }], unit: "tsp" },
  },
];

const scallopedBake: ShoppingItem[] = [
  {
    name: "Zucchini",
    aisle: "Produce",
    pack: {
      label: "medium zucchini",
      plural: "medium zucchini",
      size: 1,
      unit: "each",
      needed: [{ amount: 2, scaleBy: "volume" }],
    },
  },
  {
    name: "Potatoes",
    aisle: "Produce",
    pack: {
      label: "medium potato",
      plural: "medium potatoes",
      size: 1,
      unit: "each",
      needed: [{ amount: 3, scaleBy: "volume" }],
    },
    note: "Any all-purpose potato works. You'll peel them.",
  },
  {
    name: "Carrots",
    aisle: "Produce",
    pack: {
      label: "medium carrot",
      plural: "medium carrots",
      size: 1,
      unit: "each",
      needed: [{ amount: 5, scaleBy: "volume" }],
    },
    note: "Or buy a 1–2 lb (500 g–1 kg) bag; you'll peel them.",
  },
  {
    name: "Cheddar cheese",
    aisle: "Dairy & eggs",
    pack: {
      label: "8 oz bag shredded cheddar (about 2 cups)",
      plural: "8 oz bags shredded cheddar (about 2 cups each)",
      size: 2,
      unit: "cup",
      needed: [{ amount: 1.5, scaleBy: "area" }],
    },
    note: "Or buy a block and shred it yourself: about 4 oz per cup.",
  },
  {
    name: "Eggs",
    aisle: "Dairy & eggs",
    pack: {
      label: "carton of 6 or 12 eggs",
      plural: "cartons of 6 or 12 eggs",
      size: 12,
      unit: "each",
      usesWord: "medium eggs",
      needed: [{ amount: 4, scaleBy: "volume" }],
    },
  },
  {
    name: "Milk",
    aisle: "Dairy & eggs",
    pack: {
      label: "pint (2 cup / about 500 mL) carton",
      plural: "pint (2 cup / about 500 mL) cartons",
      size: 2,
      unit: "cup",
      needed: [{ amount: 2 / 3, scaleBy: "volume" }],
    },
  },
  {
    name: "Butter",
    aisle: "Dairy & eggs",
    buy: "1 package (1 lb / 454 g) or 1 stick",
    usesScaled: { needed: [{ amount: 1 / 3, scaleBy: "volume" }], unit: "cup" },
    note: "Melted before using.",
  },
  {
    name: "All-purpose flour",
    aisle: "Baking",
    buy: "1 bag (the smallest size is plenty)",
    usesScaled: { needed: [{ amount: 1, scaleBy: "volume" }], unit: "cup" },
  },
  {
    name: "Ground nutmeg",
    aisle: "Spices & seasonings",
    buy: "1 jar",
    usesScaled: { needed: [{ amount: 0.125, scaleBy: "volume" }], unit: "tsp" },
  },
  {
    name: "Dried basil",
    aisle: "Spices & seasonings",
    buy: "1 jar",
    usesScaled: { needed: [{ amount: 0.5, scaleBy: "volume" }], unit: "tsp" },
  },
  {
    name: "Dried thyme",
    aisle: "Spices & seasonings",
    buy: "1 jar",
    usesScaled: { needed: [{ amount: 0.5, scaleBy: "volume" }], unit: "tsp" },
  },
  {
    name: "Parchment paper",
    aisle: "Other",
    buy: "1 roll",
    uses: "to line the dish",
  },
  {
    name: "Salt",
    aisle: "Spices & seasonings",
    buy: "Pantry staple",
    uses: "to taste",
    pantry: true,
  },
  {
    name: "Black pepper",
    aisle: "Spices & seasonings",
    buy: "Pantry staple",
    uses: "to taste",
    pantry: true,
  },
  {
    name: "Aluminum foil",
    aisle: "Other",
    buy: "Pantry staple",
    uses: "to cover the dish",
    pantry: true,
  },
];

export const shoppingLists: Record<string, ShoppingItem[]> = {
  "maple-walnut-banana-bread": bananaBread,
  "okinawan-lentil-sweet-potato-stew": okinawanStew,
  "ginger-snake-tea": gingerSnakeTea,
  "whittles-pepper-sauce": pepperSauce,
  "jerk-chicken-dry-rub": jerkChicken,
  "old-fashioned-tuna-noodle-casserole": tunaCasserole,
  "scalloped-vegetable-bake": scallopedBake,
};
