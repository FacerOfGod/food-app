export interface DishPreset {
  name: string;
  category: string;
  imageUrl: string;
}

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=400&fit=crop&q=80&auto=format`;

export const DISHES_PRESET: DishPreset[] = [
  // ── Française ──────────────────────────────────────────────
  {
    name: "Croissant",
    category: "Française",
    imageUrl: u("1555507036-ab1f4038808a"),
  },
  {
    name: "Crêpes",
    category: "Française",
    imageUrl: u("1519676867240-f03562e64548"),
  },
  {
    name: "Quiche Lorraine",
    category: "Française",
    imageUrl: u("1542834369-f10ebf06d3e4"),
  },
  {
    name: "Soupe à l'oignon",
    category: "Française",
    imageUrl: u("1547592166-23ac45744acd"),
  },
  {
    name: "Bœuf Bourguignon",
    category: "Française",
    imageUrl: u("1574484284602-3bc992d0a05e"),
  },
  {
    name: "Steak Frites",
    category: "Française",
    imageUrl: u("1546964124-0cce460f38ef"),
  },
  {
    name: "Ratatouille",
    category: "Française",
    imageUrl: u("1568625710821-7e9ced6a8e4a"),
  },
  {
    name: "Foie Gras",
    category: "Française",
    imageUrl: u("1630384060421-cb20d0e0649d"),
  },
  {
    name: "Bouillabaisse",
    category: "Française",
    imageUrl: u("1559847274-164ed7bb1bef"),
  },
  {
    name: "Magret de Canard",
    category: "Française",
    imageUrl: u("1504674900247-0877df9cc836"),
  },
  {
    name: "Soufflé au Fromage",
    category: "Française",
    imageUrl: u("1586190848861-99aa4a171e90"),
  },
  {
    name: "Tarte Tatin",
    category: "Française",
    imageUrl: u("1569864317222-5c9d4e4b3a94"),
  },

  // ── Italienne ──────────────────────────────────────────────
  {
    name: "Pizza Margherita",
    category: "Italienne",
    imageUrl: u("1565299624946-b28f40a0ae38"),
  },
  {
    name: "Spaghetti Carbonara",
    category: "Italienne",
    imageUrl: u("1555949258-eb67b1ef0ceb"),
  },
  {
    name: "Lasagne",
    category: "Italienne",
    imageUrl: u("1548695607-9aa26a5f0e96"),
  },
  {
    name: "Risotto aux Champignons",
    category: "Italienne",
    imageUrl: u("1476124369491-e7addf5db371"),
  },
  {
    name: "Penne all'Arrabbiata",
    category: "Italienne",
    imageUrl: u("1563379926898-05f4575a45d8"),
  },
  {
    name: "Tiramisu",
    category: "Italienne",
    imageUrl: u("1571877227200-a0d98ea607e9"),
  },
  {
    name: "Osso Buco",
    category: "Italienne",
    imageUrl: u("1504674900247-0877df9cc836"),
  },

  // ── Japonaise ──────────────────────────────────────────────
  {
    name: "Sushi",
    category: "Japonaise",
    imageUrl: u("1579871494447-9811cf80d66c"),
  },
  {
    name: "Ramen",
    category: "Japonaise",
    imageUrl: u("1569718212165-3a8278d5f624"),
  },
  {
    name: "Gyoza",
    category: "Japonaise",
    imageUrl: u("1534482421-64566f976cfa"),
  },
  {
    name: "Tempura",
    category: "Japonaise",
    imageUrl: u("1617196034183-421b4040ed20"),
  },
  {
    name: "Yakitori",
    category: "Japonaise",
    imageUrl: u("1529193591184-b1d58069ecdd"),
  },
  {
    name: "Onigiri",
    category: "Japonaise",
    imageUrl: u("1603133872878-684f208fb054"),
  },
  {
    name: "Miso Soup",
    category: "Japonaise",
    imageUrl: u("1547592180-85f173990554"),
  },

  // ── Chinoise ───────────────────────────────────────────────
  {
    name: "Dim Sum",
    category: "Chinoise",
    imageUrl: u("1563245372-f21724e3856d"),
  },
  {
    name: "Canard Laqué",
    category: "Chinoise",
    imageUrl: u("1504674900247-0877df9cc836"),
  },
  {
    name: "Riz Cantonais",
    category: "Chinoise",
    imageUrl: u("1603133872878-684f208fb054"),
  },
  {
    name: "Poulet Kung Pao",
    category: "Chinoise",
    imageUrl: u("1562802378-173f63860078"),
  },
  {
    name: "Nouilles Sautées",
    category: "Chinoise",
    imageUrl: u("1569718212165-3a8278d5f624"),
  },

  // ── Thaïlandaise ───────────────────────────────────────────
  {
    name: "Pad Thaï",
    category: "Thaïlandaise",
    imageUrl: u("1562802378-173f63860078"),
  },
  {
    name: "Tom Yum",
    category: "Thaïlandaise",
    imageUrl: u("1547592180-85f173990554"),
  },
  {
    name: "Curry Vert",
    category: "Thaïlandaise",
    imageUrl: u("1585937421612-70a008356fbe"),
  },
  {
    name: "Mango Sticky Rice",
    category: "Thaïlandaise",
    imageUrl: u("1582716401942-6a699abdc228"),
  },

  // ── Indienne ───────────────────────────────────────────────
  {
    name: "Butter Chicken",
    category: "Indienne",
    imageUrl: u("1565557623262-b51ff475f72e"),
  },
  {
    name: "Biryani",
    category: "Indienne",
    imageUrl: u("1603133872878-684f208fb054"),
  },
  {
    name: "Dal Makhani",
    category: "Indienne",
    imageUrl: u("1585937421612-70a008356fbe"),
  },
  {
    name: "Naan au Beurre",
    category: "Indienne",
    imageUrl: u("1555507036-ab1f4038808a"),
  },
  {
    name: "Samosa",
    category: "Indienne",
    imageUrl: u("1601050690597-df0568f70950"),
  },

  // ── Mexicaine ──────────────────────────────────────────────
  {
    name: "Tacos",
    category: "Mexicaine",
    imageUrl: u("1565299585323-38d6b0865b47"),
  },
  {
    name: "Guacamole",
    category: "Mexicaine",
    imageUrl: u("1600348759986-e9d879b9226b"),
  },
  {
    name: "Enchiladas",
    category: "Mexicaine",
    imageUrl: u("1565299624946-b28f40a0ae38"),
  },
  {
    name: "Nachos",
    category: "Mexicaine",
    imageUrl: u("1513456852971-30c0b8199d4d"),
  },
  {
    name: "Burrito",
    category: "Mexicaine",
    imageUrl: u("1553909489-cd47e0907980"),
  },

  // ── Américaine ─────────────────────────────────────────────
  {
    name: "Burger",
    category: "Américaine",
    imageUrl: u("1568901346375-23c9450c58cd"),
  },
  {
    name: "BBQ Ribs",
    category: "Américaine",
    imageUrl: u("1544025162-d76694265947"),
  },
  {
    name: "Mac & Cheese",
    category: "Américaine",
    imageUrl: u("1543352634-de0b2ee26395"),
  },
  {
    name: "Pancakes",
    category: "Américaine",
    imageUrl: u("1567620905732-2d1ec7ab7445"),
  },
  {
    name: "Club Sandwich",
    category: "Américaine",
    imageUrl: u("1553909489-cd47e0907980"),
  },
  {
    name: "Hot Dog",
    category: "Américaine",
    imageUrl: u("1619740455993-9d54574b4975"),
  },
  {
    name: "Cheesecake",
    category: "Américaine",
    imageUrl: u("1578985545062-69928b1d9587"),
  },

  // ── Espagnole ──────────────────────────────────────────────
  {
    name: "Paella",
    category: "Espagnole",
    imageUrl: u("1534080564583-6be75777b70a"),
  },
  {
    name: "Gazpacho",
    category: "Espagnole",
    imageUrl: u("1547592180-85f173990554"),
  },
  {
    name: "Tortilla Española",
    category: "Espagnole",
    imageUrl: u("1525351484163-7529414344d8"),
  },

  // ── Méditerranéenne ────────────────────────────────────────
  {
    name: "Falafel",
    category: "Méditerranéenne",
    imageUrl: u("1601050690597-df0568f70950"),
  },
  {
    name: "Shawarma",
    category: "Méditerranéenne",
    imageUrl: u("1529193591184-b1d58069ecdd"),
  },
  {
    name: "Houmous",
    category: "Méditerranéenne",
    imageUrl: u("1600348759986-e9d879b9226b"),
  },
  {
    name: "Salade Grecque",
    category: "Méditerranéenne",
    imageUrl: u("1512621776951-a57141f2eefd"),
  },
  {
    name: "Moussaka",
    category: "Méditerranéenne",
    imageUrl: u("1574484284602-3bc992d0a05e"),
  },

  // ── Poissons & Fruits de mer ───────────────────────────────
  {
    name: "Fish & Chips",
    category: "Poissons",
    imageUrl: u("1579372786545-d24232daf58c"),
  },
  {
    name: "Saumon Grillé",
    category: "Poissons",
    imageUrl: u("1559847274-164ed7bb1bef"),
  },
  {
    name: "Moules Marinières",
    category: "Poissons",
    imageUrl: u("1563245372-f21724e3856d"),
  },
  {
    name: "Ceviche",
    category: "Poissons",
    imageUrl: u("1565299624946-b28f40a0ae38"),
  },

  // ── Végétarien / Salade ────────────────────────────────────
  {
    name: "Salade César",
    category: "Végétarien",
    imageUrl: u("1512621776951-a57141f2eefd"),
  },
  {
    name: "Buddha Bowl",
    category: "Végétarien",
    imageUrl: u("1540420773420-3366772f4999"),
  },
  {
    name: "Avocado Toast",
    category: "Végétarien",
    imageUrl: u("1541519481356-f4ed60563d6d"),
  },
  {
    name: "Soupe de Lentilles",
    category: "Végétarien",
    imageUrl: u("1547592180-85f173990554"),
  },

  // ── Desserts ───────────────────────────────────────────────
  {
    name: "Glace",
    category: "Desserts",
    imageUrl: u("1576506295286-5cda18df43e7"),
  },
  {
    name: "Gâteau au Chocolat",
    category: "Desserts",
    imageUrl: u("1578985545062-69928b1d9587"),
  },
  {
    name: "Crème Brûlée",
    category: "Desserts",
    imageUrl: u("1571877227200-a0d98ea607e9"),
  },
  {
    name: "Macarons",
    category: "Desserts",
    imageUrl: u("1569864317222-5c9d4e4b3a94"),
  },
  {
    name: "Fondant au Chocolat",
    category: "Desserts",
    imageUrl: u("1578985545062-69928b1d9587"),
  },

  // ── Légumes ────────────────────────────────────────────────
  {
    name: "Carottes",
    category: "Légumes",
    imageUrl: u("1598170845058-32b9d6a5da37"),
  },
  {
    name: "Haricots Verts",
    category: "Légumes",
    imageUrl: u("1558618666-fcd25c85cd64"),
  },
  {
    name: "Brocoli",
    category: "Légumes",
    imageUrl: u("1459411621453-7b03977f4bfc"),
  },
  {
    name: "Épinards",
    category: "Légumes",
    imageUrl: u("1576045057995-568f588f82fb"),
  },
  {
    name: "Petits Pois",
    category: "Légumes",
    imageUrl: u("1587280501635-68a0e82cd5ff"),
  },
  {
    name: "Tomates",
    category: "Légumes",
    imageUrl: u("1607305387299-a3d9611cd469"),
  },
  {
    name: "Oignons",
    category: "Légumes",
    imageUrl: u("1587005914119-5b9a86562c99"),
  },
  {
    name: "Ail",
    category: "Légumes",
    imageUrl: u("1474823609651-534849a25b08"),
  },
  {
    name: "Pommes de Terre",
    category: "Légumes",
    imageUrl: u("1518977676601-b53f82aba655"),
  },
  {
    name: "Maïs",
    category: "Légumes",
    imageUrl: u("1551754655-cd27e38d2076"),
  },
  {
    name: "Aubergine",
    category: "Légumes",
    imageUrl: u("1568158879083-c42860933ed7"),
  },
  {
    name: "Courgette",
    category: "Légumes",
    imageUrl: u("1563246973-73d66c4c11d9"),
  },
  {
    name: "Asperges",
    category: "Légumes",
    imageUrl: u("1510627489930-0c1b0bfb6785"),
  },
  {
    name: "Chou-fleur",
    category: "Légumes",
    imageUrl: u("1510511459019-5dda7724fd87"),
  },
  {
    name: "Champignons",
    category: "Légumes",
    imageUrl: u("1504198453319-5ce911bafcde"),
  },
  {
    name: "Poivrons",
    category: "Légumes",
    imageUrl: u("1585389773840-d4d9083a6f3a"),
  },
  {
    name: "Céleri",
    category: "Légumes",
    imageUrl: u("1591379425739-36be7108b929"),
  },
  {
    name: "Betterave",
    category: "Légumes",
    imageUrl: u("1593538312308-d4c29d8dc7f1"),
  },
  {
    name: "Artichauts",
    category: "Légumes",
    imageUrl: u("1540148426945-6cf22a6b2383"),
  },
  {
    name: "Poireaux",
    category: "Légumes",
    imageUrl: u("1574484284602-3bc992d0a05e"),
  },

  // ── Fruits ─────────────────────────────────────────────────
  {
    name: "Fraises",
    category: "Fruits",
    imageUrl: u("1464965911861-746a04b4bca6"),
  },
  {
    name: "Bananes",
    category: "Fruits",
    imageUrl: u("1571771894821-ce9b6c11b08e"),
  },
  {
    name: "Pommes",
    category: "Fruits",
    imageUrl: u("1568702846914-96b305d2aaeb"),
  },
  {
    name: "Oranges",
    category: "Fruits",
    imageUrl: u("1547514701-42782101795e"),
  },
  {
    name: "Raisins",
    category: "Fruits",
    imageUrl: u("1537640538966-79f369143f8f"),
  },
  {
    name: "Mangue",
    category: "Fruits",
    imageUrl: u("1553279768-865429fa0078"),
  },
  {
    name: "Ananas",
    category: "Fruits",
    imageUrl: u("1490885578174-acda8905c2c6"),
  },
  {
    name: "Myrtilles",
    category: "Fruits",
    imageUrl: u("1498557850523-fd3d118b962e"),
  },
  {
    name: "Cerises",
    category: "Fruits",
    imageUrl: u("1528821128474-27f963b062bf"),
  },
  {
    name: "Pastèque",
    category: "Fruits",
    imageUrl: u("1563114773-84221bd62daa"),
  },
  {
    name: "Pêches",
    category: "Fruits",
    imageUrl: u("1560717789-0ac7d9c16f8b"),
  },
  {
    name: "Citron",
    category: "Fruits",
    imageUrl: u("1582979512210-a5a5e51e4b48"),
  },
  {
    name: "Kiwi",
    category: "Fruits",
    imageUrl: u("1571809840602-1a75c83e3e1a"),
  },
  {
    name: "Avocat",
    category: "Fruits",
    imageUrl: u("1523049673857-eb18f1d7b578"),
  },

  // ── Protéines ──────────────────────────────────────────────
  {
    name: "Œufs",
    category: "Protéines",
    imageUrl: u("1582722872445-44dc5f7e3c8f"),
  },
  {
    name: "Poulet",
    category: "Protéines",
    imageUrl: u("1604503468506-a8da13d82791"),
  },
  {
    name: "Saumon",
    category: "Protéines",
    imageUrl: u("1559847274-164ed7bb1bef"),
  },
  {
    name: "Thon",
    category: "Protéines",
    imageUrl: u("1611143669185-af224c5e3252"),
  },
  {
    name: "Crevettes",
    category: "Protéines",
    imageUrl: u("1510130387422-82bed34b37e9"),
  },
  {
    name: "Tofu",
    category: "Protéines",
    imageUrl: u("1546069901-5ec6a79120b0"),
  },
  {
    name: "Lentilles",
    category: "Protéines",
    imageUrl: u("1574323347407-f5e1ad6d020b"),
  },
  {
    name: "Pois Chiches",
    category: "Protéines",
    imageUrl: u("1574323347407-f5e1ad6d020b"),
  },

  // ── Produits Laitiers ──────────────────────────────────────
  {
    name: "Fromage",
    category: "Produits Laitiers",
    imageUrl: u("1486297678162-eb2a19b0a32d"),
  },
  {
    name: "Yaourt",
    category: "Produits Laitiers",
    imageUrl: u("1488477181946-6428a0291777"),
  },
  {
    name: "Lait",
    category: "Produits Laitiers",
    imageUrl: u("1550583724-b2692b85b150"),
  },
  {
    name: "Beurre",
    category: "Produits Laitiers",
    imageUrl: u("1589985270826-4b7bb135bc9d"),
  },
  {
    name: "Crème Fraîche",
    category: "Produits Laitiers",
    imageUrl: u("1488477181946-6428a0291777"),
  },
];

export const PRESET_CATEGORIES = [
  ...new Set(DISHES_PRESET.map((d) => d.category)),
];
