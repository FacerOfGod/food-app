import type { DishPreset } from './food';
import { mealDbIngredientImage, mealDbMealImage } from '@/lib/images';

interface IngredientPreset extends DishPreset {
  slugEn?: string;
}

const m = (slugEn: string) => mealDbIngredientImage(slugEn);
const t = (filename: string) => mealDbMealImage(filename);

export const INGREDIENTS_PRESET: IngredientPreset[] = [
  // ── Légumes ────────────────────────────────────────────────
  { name: "Tomate",              slugEn: "Tomato",            category: "Légumes",  imageUrl: m("Tomato") },
  { name: "Oignon",              slugEn: "Onion",             category: "Légumes",  imageUrl: m("Onion") },
  { name: "Ail",                 slugEn: "Garlic",            category: "Légumes",  imageUrl: m("Garlic") },
  { name: "Carottes",            slugEn: "Carrots",           category: "Légumes",  imageUrl: m("Carrots") },
  { name: "Courgettes",          slugEn: "Courgettes",        category: "Légumes",  imageUrl: m("Courgettes") },
  { name: "Aubergine",           slugEn: "Aubergine",         category: "Légumes",  imageUrl: m("Aubergine") },
  { name: "Poivron rouge",       slugEn: "Red Pepper",        category: "Légumes",  imageUrl: m("Red Pepper") },
  { name: "Poivron vert",        slugEn: "Green Pepper",      category: "Légumes",  imageUrl: m("Green Pepper") },
  { name: "Pommes de terre",     slugEn: "Potatoes",          category: "Légumes",  imageUrl: m("Potatoes") },
  { name: "Patates douces",      slugEn: "Sweet Potatoes",    category: "Légumes",  imageUrl: m("Sweet Potatoes") },
  { name: "Brocoli",             slugEn: "Broccoli",          category: "Légumes",  imageUrl: m("Broccoli") },
  { name: "Épinards",            slugEn: "Spinach",           category: "Légumes",  imageUrl: m("Spinach") },
  { name: "Champignons",         slugEn: "Mushrooms",         category: "Légumes",  imageUrl: m("Mushrooms") },
  { name: "Champignons de Paris", slugEn: "Chestnut Mushroom", category: "Légumes", imageUrl: m("Chestnut Mushroom") },
  { name: "Concombre",           slugEn: "Cucumber",          category: "Légumes",  imageUrl: m("Cucumber") },
  { name: "Maïs",                slugEn: "Sweetcorn",         category: "Légumes",  imageUrl: m("Sweetcorn") },
  { name: "Petits pois",         slugEn: "Peas",              category: "Légumes",  imageUrl: m("Peas") },
  { name: "Haricots verts",      slugEn: "Green Beans",       category: "Légumes",  imageUrl: m("Green Beans") },
  { name: "Avocat",              slugEn: "Avocado",           category: "Légumes",  imageUrl: m("Avocado") },
  { name: "Salade",              slugEn: "Lettuce",           category: "Légumes",  imageUrl: m("Lettuce") },
  { name: "Céleri",              slugEn: "Celery",            category: "Légumes",  imageUrl: m("Celery") },
  { name: "Poireau",             slugEn: "Leek",              category: "Légumes",  imageUrl: m("Leek") },
  { name: "Asperges",            slugEn: "Asparagus",         category: "Légumes",  imageUrl: m("Asparagus") },
  { name: "Betterave",           slugEn: "Beetroot",          category: "Légumes",  imageUrl: m("Beetroot") },
  { name: "Radis",               slugEn: "Radish",            category: "Légumes",  imageUrl: m("Radish") },
  { name: "Citrouille",          slugEn: "Pumpkin",           category: "Légumes",  imageUrl: m("Pumpkin") },

  // ── Fruits ─────────────────────────────────────────────────
  { name: "Pommes",              slugEn: "Apples",            category: "Fruits",   imageUrl: m("Apples") },
  { name: "Banane",              slugEn: "Banana",            category: "Fruits",   imageUrl: m("Banana") },
  { name: "Orange",              slugEn: "Orange",            category: "Fruits",   imageUrl: m("Orange") },
  { name: "Citron",              slugEn: "Lemon",             category: "Fruits",   imageUrl: m("Lemon") },
  { name: "Citron vert",         slugEn: "Lime",              category: "Fruits",   imageUrl: m("Lime") },
  { name: "Fraises",             slugEn: "Strawberries",      category: "Fruits",   imageUrl: m("Strawberries") },
  { name: "Framboises",          slugEn: "Raspberries",       category: "Fruits",   imageUrl: m("Raspberries") },
  { name: "Myrtilles",           slugEn: "Blueberries",       category: "Fruits",   imageUrl: m("Blueberries") },
  { name: "Poires",              slugEn: "Pears",             category: "Fruits",   imageUrl: m("Pears") },
  { name: "Pêches",              slugEn: "Peaches",           category: "Fruits",   imageUrl: m("Peaches") },
  { name: "Cerises",             slugEn: "Cherry",            category: "Fruits",   imageUrl: m("Cherry") },
  { name: "Abricots",            slugEn: "Apricot",           category: "Fruits",   imageUrl: m("Apricot") },

  // ── Viandes ────────────────────────────────────────────────
  { name: "Poulet",              slugEn: "Chicken",           category: "Viandes",  imageUrl: m("Chicken") },
  { name: "Bœuf",                slugEn: "Beef",              category: "Viandes",  imageUrl: m("Beef") },
  { name: "Porc",                slugEn: "Pork",              category: "Viandes",  imageUrl: m("Pork") },
  { name: "Agneau",              slugEn: "Lamb",              category: "Viandes",  imageUrl: m("Lamb") },
  { name: "Veau",                slugEn: "Veal",              category: "Viandes",  imageUrl: m("Veal") },
  { name: "Canard",              slugEn: "Duck",              category: "Viandes",  imageUrl: m("Duck") },
  { name: "Bœuf haché",          slugEn: "Minced Beef",       category: "Viandes",  imageUrl: m("Minced Beef") },
  { name: "Lard",                slugEn: "Bacon",             category: "Viandes",  imageUrl: m("Bacon") },
  { name: "Jambon",              slugEn: "Ham",               category: "Viandes",  imageUrl: m("Ham") },
  { name: "Saucisses",           slugEn: "Sausages",          category: "Viandes",  imageUrl: m("Sausages") },
  { name: "Blanc de poulet",     slugEn: "Chicken Breast",    category: "Viandes",  imageUrl: m("Chicken Breast") },
  { name: "Poitrine de bœuf",    slugEn: "Beef Brisket",      category: "Viandes",  imageUrl: m("Beef Brisket") },
  { name: "Filet de bœuf",       slugEn: "Beef Fillet",       category: "Viandes",  imageUrl: m("Beef Fillet") },

  // ── Poissons ───────────────────────────────────────────────
  { name: "Saumon",              slugEn: "Salmon",            category: "Poissons", imageUrl: m("Salmon") },
  { name: "Thon",                slugEn: "Tuna",              category: "Poissons", imageUrl: m("Tuna") },
  { name: "Cabillaud",           slugEn: "Cod",               category: "Poissons", imageUrl: m("Cod") },
  { name: "Crevettes",           slugEn: "Prawns",            category: "Poissons", imageUrl: m("Prawns") },
  { name: "Sardines",            slugEn: "Sardines",          category: "Poissons", imageUrl: m("Sardines") },
  { name: "Moules",              slugEn: "Mussels",           category: "Poissons", imageUrl: m("Mussels") },
  { name: "Calamar",             slugEn: "Squid",             category: "Poissons", imageUrl: m("Squid") },
  { name: "Maquereau",           slugEn: "Mackerel",          category: "Poissons", imageUrl: m("Mackerel") },

  // ── Féculents ──────────────────────────────────────────────
  { name: "Riz",                 slugEn: "Rice",              category: "Féculents", imageUrl: m("Rice") },
  { name: "Spaghetti",           slugEn: "Spaghetti",         category: "Féculents", imageUrl: m("Spaghetti") },
  { name: "Pain",                slugEn: "Bread",             category: "Féculents", imageUrl: m("Bread") },
  { name: "Couscous",            slugEn: "Couscous",          category: "Féculents", imageUrl: m("Couscous") },
  { name: "Quinoa",              slugEn: "Quinoa",            category: "Féculents", imageUrl: m("Quinoa") },
  { name: "Lentilles",           slugEn: "Lentils",           category: "Féculents", imageUrl: m("Lentils") },
  { name: "Pois chiches",        slugEn: "Chickpeas",         category: "Féculents", imageUrl: m("Chickpeas") },
  { name: "Haricots blancs",     slugEn: "Cannellini Beans",  category: "Féculents", imageUrl: m("Cannellini Beans") },
  { name: "Riz basmati",         slugEn: "Basmati Rice",      category: "Féculents", imageUrl: m("Basmati Rice") },

  // ── Produits laitiers ──────────────────────────────────────
  { name: "Lait",                slugEn: "Milk",              category: "Produits laitiers", imageUrl: m("Milk") },
  { name: "Beurre",              slugEn: "Butter",            category: "Produits laitiers", imageUrl: m("Butter") },
  { name: "Fromage",             slugEn: "Cheese",            category: "Produits laitiers", imageUrl: m("Cheese") },
  { name: "Yaourt",              slugEn: "Yogurt",            category: "Produits laitiers", imageUrl: m("Yogurt") },
  { name: "Crème épaisse",       slugEn: "Double Cream",      category: "Produits laitiers", imageUrl: m("Double Cream") },
  { name: "Mozzarella",          slugEn: "Mozzarella",        category: "Produits laitiers", imageUrl: m("Mozzarella") },
  { name: "Parmesan",            slugEn: "Parmesan",          category: "Produits laitiers", imageUrl: m("Parmesan") },
  { name: "Cheddar",             slugEn: "Cheddar Cheese",    category: "Produits laitiers", imageUrl: m("Cheddar Cheese") },
  { name: "Feta",                slugEn: "Feta",              category: "Produits laitiers", imageUrl: m("Feta") },

  // ── Œufs ───────────────────────────────────────────────────
  { name: "Œufs",                slugEn: "Eggs",              category: "Œufs",     imageUrl: m("Eggs") },
  { name: "Jaunes d'œuf",        slugEn: "Egg Yolks",         category: "Œufs",     imageUrl: m("Egg Yolks") },

  // ── Épices ─────────────────────────────────────────────────
  { name: "Sel",                 slugEn: "Salt",              category: "Épices",   imageUrl: m("Salt") },
  { name: "Poivre noir",         slugEn: "Black Pepper",      category: "Épices",   imageUrl: m("Black Pepper") },
  { name: "Piment en poudre",    slugEn: "Chilli Powder",     category: "Épices",   imageUrl: m("Chilli Powder") },
  { name: "Piment de Cayenne",   slugEn: "Cayenne Pepper",    category: "Épices",   imageUrl: m("Cayenne Pepper") },
  { name: "Paprika",             slugEn: "Paprika",           category: "Épices",   imageUrl: m("Paprika") },
  { name: "Cumin",               slugEn: "Cumin",             category: "Épices",   imageUrl: m("Cumin") },
  { name: "Curcuma",             slugEn: "Turmeric",          category: "Épices",   imageUrl: m("Turmeric") },
  { name: "Cannelle",            slugEn: "Cinnamon",          category: "Épices",   imageUrl: m("Cinnamon") },
  { name: "Curry",               slugEn: "Curry Powder",      category: "Épices",   imageUrl: m("Curry Powder") },
  { name: "Gingembre",           slugEn: "Ginger",            category: "Épices",   imageUrl: m("Ginger") },
  { name: "Muscade",             slugEn: "Nutmeg",            category: "Épices",   imageUrl: m("Nutmeg") },
  { name: "Vanille",             slugEn: "Vanilla",           category: "Épices",   imageUrl: m("Vanilla") },

  // ── Herbes ─────────────────────────────────────────────────
  { name: "Basilic",             slugEn: "Basil",             category: "Herbes",   imageUrl: m("Basil") },
  { name: "Persil",              slugEn: "Parsley",           category: "Herbes",   imageUrl: m("Parsley") },
  { name: "Thym",                slugEn: "Thyme",             category: "Herbes",   imageUrl: m("Thyme") },
  { name: "Romarin",             slugEn: "Rosemary",          category: "Herbes",   imageUrl: m("Rosemary") },
  { name: "Menthe",              slugEn: "Mint",              category: "Herbes",   imageUrl: m("Mint") },
  { name: "Ciboulette",          slugEn: "Chives",            category: "Herbes",   imageUrl: m("Chives") },
  { name: "Coriandre",           slugEn: "Coriander",         category: "Herbes",   imageUrl: m("Coriander") },
  { name: "Origan",              slugEn: "Oregano",           category: "Herbes",   imageUrl: m("Oregano") },
  { name: "Feuille de laurier",  slugEn: "Bay Leaf",          category: "Herbes",   imageUrl: m("Bay Leaf") },
  { name: "Sauge",               slugEn: "Sage",              category: "Herbes",   imageUrl: m("Sage") },
  { name: "Aneth",               slugEn: "Dill",              category: "Herbes",   imageUrl: m("Dill") },
  { name: "Estragon",            slugEn: "Tarragon Leaves",   category: "Herbes",   imageUrl: m("Tarragon Leaves") },

  // ── Sauces ─────────────────────────────────────────────────
  { name: "Huile d'olive",       slugEn: "Olive Oil",         category: "Sauces",   imageUrl: m("Olive Oil") },
  { name: "Vinaigre",            slugEn: "Vinegar",           category: "Sauces",   imageUrl: m("Vinegar") },
  { name: "Moutarde",            slugEn: "Mustard",           category: "Sauces",   imageUrl: m("Mustard") },
  { name: "Sauce soja",          slugEn: "Soy Sauce",         category: "Sauces",   imageUrl: m("Soy Sauce") },
  { name: "Sauce tomate",        slugEn: "Tomato Sauce",      category: "Sauces",   imageUrl: m("Tomato Sauce") },
  { name: "Mayonnaise",          slugEn: "Mayonnaise",        category: "Sauces",   imageUrl: m("Mayonnaise") },
  { name: "Ketchup",             slugEn: "Tomato Ketchup",    category: "Sauces",   imageUrl: m("Tomato Ketchup") },
  { name: "Huile végétale",      slugEn: "Vegetable Oil",     category: "Sauces",   imageUrl: m("Vegetable Oil") },
  { name: "Sauce Worcestershire", slugEn: "Worcestershire Sauce", category: "Sauces", imageUrl: m("Worcestershire Sauce") },

  // ── Autres ─────────────────────────────────────────────────
  { name: "Miel",                slugEn: "Honey",             category: "Autres",   imageUrl: m("Honey") },
  { name: "Sucre",               slugEn: "Sugar",             category: "Autres",   imageUrl: m("Sugar") },
  { name: "Sucre roux",          slugEn: "Brown Sugar",       category: "Autres",   imageUrl: m("Brown Sugar") },
  { name: "Farine",              slugEn: "Plain Flour",       category: "Autres",   imageUrl: m("Plain Flour") },
  { name: "Levure",              slugEn: "Yeast",             category: "Autres",   imageUrl: m("Yeast") },
  { name: "Chocolat noir",       slugEn: "Dark Chocolate",    category: "Autres",   imageUrl: m("Dark Chocolate") },
  { name: "Levure chimique",     slugEn: "Baking Powder",     category: "Autres",   imageUrl: m("Baking Powder") },
  { name: "Amandes",             slugEn: "Almonds",           category: "Autres",   imageUrl: m("Almonds") },
  { name: "Noix",                slugEn: "Walnuts",           category: "Autres",   imageUrl: m("Walnuts") },
  { name: "Noix de cajou",       slugEn: "Cashew Nuts",       category: "Autres",   imageUrl: m("Cashew Nuts") },

  // ── Plats Français ─────────────────────────────────────────
  { name: "Soupe à l'oignon",         category: "Plats Français",  imageUrl: t("xvrrux1511783685.jpg") },
  { name: "Bœuf Bourguignon",         category: "Plats Français",  imageUrl: t("vtqxtu1511784197.jpg") },
  { name: "Coq au Vin",               category: "Plats Français",  imageUrl: t("qstyvs1505931190.jpg") },
  { name: "Cassoulet",                category: "Plats Français",  imageUrl: t("wxuvuv1511299147.jpg") },
  { name: "Ratatouille",              category: "Plats Français",  imageUrl: t("wrpwuu1511786491.jpg") },
  { name: "Confit de Canard",         category: "Plats Français",  imageUrl: t("wvpvsu1511786158.jpg") },
  { name: "Tarte Tatin",              category: "Plats Français",  imageUrl: t("ryspuw1511786688.jpg") },
  { name: "Tarte Tatin aux Poires",   category: "Plats Français",  imageUrl: t("rxvxrr1511797671.jpg") },
  { name: "Soufflé au Fromage",       category: "Plats Français",  imageUrl: t("sxwquu1511793428.jpg") },
  { name: "Omelette Française",       category: "Plats Français",  imageUrl: t("yvpuuy1511797244.jpg") },
  { name: "Omelette Provençale",      category: "Plats Français",  imageUrl: t("qwtrtp1511799242.jpg") },
  { name: "Salade Niçoise",           category: "Plats Français",  imageUrl: t("yypwwq1511304979.jpg") },
  { name: "Crème Brûlée",             category: "Plats Français",  imageUrl: t("uryqru1511798039.jpg") },
  { name: "Steak Diane",              category: "Plats Français",  imageUrl: t("vussxq1511882648.jpg") },
  { name: "Gratin de Pommes de Terre", category: "Plats Français", imageUrl: t("qwrtut1468418027.jpg") },
  { name: "Lentilles au Thym",        category: "Plats Français",  imageUrl: t("vwwspt1487394060.jpg") },
  { name: "Mousse aux Framboises",    category: "Plats Français",  imageUrl: t("v5jrnn1764362830.jpg") },

  // ── Plats Italiens ─────────────────────────────────────────
  { name: "Pizza Margherita",      category: "Plats Italiens", imageUrl: t("x0lk931587671540.jpg") },
  { name: "Spaghetti Carbonara",   category: "Plats Italiens", imageUrl: t("llcbn01574260722.jpg") },
  { name: "Spaghetti Bolognaise",  category: "Plats Italiens", imageUrl: t("sutysw1468247559.jpg") },
  { name: "Lasagne",               category: "Plats Italiens", imageUrl: t("rvxxuy1468312893.jpg") },
  { name: "Osso Buco",             category: "Plats Italiens", imageUrl: t("wwuqvt1487345467.jpg") },

  // ── Plats Espagnols ────────────────────────────────────────
  { name: "Paella",              category: "Plats Espagnols", imageUrl: t("9bl20p1763248192.jpg") },
  { name: "Gazpacho",            category: "Plats Espagnols", imageUrl: t("h5qmn31763304965.jpg") },
  { name: "Tortilla Española",   category: "Plats Espagnols", imageUrl: t("quuxsx1511476154.jpg") },
  { name: "Patatas Bravas",      category: "Plats Espagnols", imageUrl: t("bvg8sn1763298713.jpg") },
  { name: "Croquetas",           category: "Plats Espagnols", imageUrl: t("6dpa7m1763331105.jpg") },
  { name: "Churros",             category: "Plats Espagnols", imageUrl: t("nxnny61763250596.jpg") },
  { name: "Crema Catalana",      category: "Plats Espagnols", imageUrl: t("x73ll91763247842.jpg") },

  // ── Plats Britanniques ─────────────────────────────────────
  { name: "Sticky Toffee Pudding",   category: "Plats Britanniques", imageUrl: t("xqqqtu1511637379.jpg") },
  { name: "Full English Breakfast",  category: "Plats Britanniques", imageUrl: t("sqrtwu1511721265.jpg") },
  { name: "Shepherd's Pie",          category: "Plats Britanniques", imageUrl: t("w8umt11583268117.jpg") },
  { name: "Apple Frangipan Tart",    category: "Plats Britanniques", imageUrl: t("wxywrq1468235067.jpg") },
  { name: "Beef Wellington",         category: "Plats Britanniques", imageUrl: t("vvpprx1487325699.jpg") },

  // ── Plats Méditerranéens ───────────────────────────────────
  { name: "Moussaka",   category: "Plats Méditerranéens", imageUrl: t("ctg8jd1585563097.jpg") },
  { name: "Houmous",    category: "Plats Méditerranéens", imageUrl: t("gpon5u1763801180.jpg") },
  { name: "Falafel",    category: "Plats Méditerranéens", imageUrl: t("u5e9qq1763795441.jpg") },
  { name: "Shawarma",   category: "Plats Méditerranéens", imageUrl: t("kcv6hj1598733479.jpg") },

  // ── Plats Asiatiques ──────────────────────────────────────
  { name: "Sushi",       category: "Plats Asiatiques", imageUrl: t("g046bb1663960946.jpg") },
  { name: "Ramen",       category: "Plats Asiatiques", imageUrl: t("ip5xtp1769779958.jpg") },
  { name: "Pad Thaï",    category: "Plats Asiatiques", imageUrl: t("rg9ze01763479093.jpg") },
  { name: "Tom Yum",     category: "Plats Asiatiques", imageUrl: t("l50vz41763422681.jpg") },
  { name: "Curry Vert",  category: "Plats Asiatiques", imageUrl: t("sstssx1487349585.jpg") },

  // ── Plats Américains ──────────────────────────────────────
  { name: "Pancakes",      category: "Plats Américains", imageUrl: t("rwuyqx1511383174.jpg") },
  { name: "Cheesecake",    category: "Plats Américains", imageUrl: t("swttys1511385853.jpg") },
  { name: "Mac & Cheese",  category: "Plats Américains", imageUrl: t("qrqywr1503066605.jpg") },

  // ── Plats Internationaux ───────────────────────────────────
  { name: "Beef Stroganoff",    category: "Plats Internationaux", imageUrl: t("svprys1511176755.jpg") },
  { name: "Gâteau au Chocolat", category: "Plats Internationaux", imageUrl: t("qxutws1486978099.jpg") },
];

export const INGREDIENT_CATEGORIES = [
  "Autre",
  ...new Set(INGREDIENTS_PRESET.map((d) => d.category)),
];
