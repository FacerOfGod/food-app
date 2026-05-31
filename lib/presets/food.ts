export interface DishPreset {
  name: string;
  category: string;
  imageUrl: string;
}

const t = (filename: string) => `https://www.themealdb.com/images/media/meals/${filename}`;

export const DISHES_PRESET: DishPreset[] = [
  // ── Française ──────────────────────────────────────────────
  { name: "Soupe à l'oignon",   category: "Française",      imageUrl: t("xvrrux1511783685.jpg") },
  { name: "Bœuf Bourguignon",   category: "Française",      imageUrl: t("vtqxtu1511784197.jpg") },
  { name: "Coq au Vin",         category: "Française",      imageUrl: t("qstyvs1505931190.jpg") },
  { name: "Cassoulet",          category: "Française",      imageUrl: t("wxuvuv1511299147.jpg") },
  { name: "Ratatouille",        category: "Française",      imageUrl: t("wrpwuu1511786491.jpg") },
  { name: "Confit de Canard",   category: "Française",      imageUrl: t("wvpvsu1511786158.jpg") },
  { name: "Tarte Tatin",        category: "Française",      imageUrl: t("ryspuw1511786688.jpg") },
  { name: "Soufflé au Fromage", category: "Française",      imageUrl: t("sxwquu1511793428.jpg") },

  // ── Italienne ──────────────────────────────────────────────
  { name: "Pizza Margherita",     category: "Italienne",    imageUrl: t("x0lk931587671540.jpg") },
  { name: "Spaghetti Carbonara",  category: "Italienne",    imageUrl: t("llcbn01574260722.jpg") },
  { name: "Spaghetti Bolognaise", category: "Italienne",    imageUrl: t("sutysw1468247559.jpg") },
  { name: "Lasagne",              category: "Italienne",    imageUrl: t("rvxxuy1468312893.jpg") },
  { name: "Osso Buco",            category: "Italienne",    imageUrl: t("wwuqvt1487345467.jpg") },

  // ── Espagnole ──────────────────────────────────────────────
  { name: "Paella",               category: "Espagnole",    imageUrl: t("9bl20p1763248192.jpg") },
  { name: "Gazpacho",             category: "Espagnole",    imageUrl: t("h5qmn31763304965.jpg") },
  { name: "Tortilla Española",    category: "Espagnole",    imageUrl: t("quuxsx1511476154.jpg") },
  { name: "Patatas Bravas",       category: "Espagnole",    imageUrl: t("bvg8sn1763298713.jpg") },
  { name: "Croquetas",            category: "Espagnole",    imageUrl: t("6dpa7m1763331105.jpg") },
  { name: "Churros",              category: "Espagnole",    imageUrl: t("nxnny61763250596.jpg") },
  { name: "Crema Catalana",       category: "Espagnole",    imageUrl: t("x73ll91763247842.jpg") },

  // ── Britannique ────────────────────────────────────────────
  { name: "Sticky Toffee Pudding",  category: "Britannique", imageUrl: t("xqqqtu1511637379.jpg") },
  { name: "Full English Breakfast", category: "Britannique", imageUrl: t("sqrtwu1511721265.jpg") },
  { name: "Shepherd's Pie",         category: "Britannique", imageUrl: t("w8umt11583268117.jpg") },
  { name: "Apple Frangipan Tart",   category: "Britannique", imageUrl: t("wxywrq1468235067.jpg") },
  { name: "Beef Wellington",        category: "Britannique", imageUrl: t("vvpprx1487325699.jpg") },

  // ── Méditerranéenne ────────────────────────────────────────
  { name: "Moussaka",     category: "Méditerranéenne",      imageUrl: t("ctg8jd1585563097.jpg") },
  { name: "Houmous",      category: "Méditerranéenne",      imageUrl: t("gpon5u1763801180.jpg") },
  { name: "Falafel",      category: "Méditerranéenne",      imageUrl: t("u5e9qq1763795441.jpg") },
  { name: "Shawarma",     category: "Méditerranéenne",      imageUrl: t("kcv6hj1598733479.jpg") },

  // ── Asiatique ──────────────────────────────────────────────
  { name: "Sushi",        category: "Asiatique",            imageUrl: t("g046bb1663960946.jpg") },
  { name: "Ramen",        category: "Asiatique",            imageUrl: t("ip5xtp1769779958.jpg") },
  { name: "Pad Thaï",     category: "Asiatique",            imageUrl: t("rg9ze01763479093.jpg") },
  { name: "Tom Yum",      category: "Asiatique",            imageUrl: t("l50vz41763422681.jpg") },
  { name: "Curry Vert",   category: "Asiatique",            imageUrl: t("sstssx1487349585.jpg") },

  // ── Américaine ─────────────────────────────────────────────
  { name: "Pancakes",     category: "Américaine",           imageUrl: t("rwuyqx1511383174.jpg") },
  { name: "Cheesecake",   category: "Américaine",           imageUrl: t("swttys1511385853.jpg") },
  { name: "Mac & Cheese", category: "Américaine",           imageUrl: t("qrqywr1503066605.jpg") },

  // ── Internationale ─────────────────────────────────────────
  { name: "Beef Stroganoff",   category: "Internationale",  imageUrl: t("svprys1511176755.jpg") },
  { name: "Gâteau au Chocolat", category: "Internationale", imageUrl: t("qxutws1486978099.jpg") },
];

export const PRESET_CATEGORIES = [
  "Autre",
  ...new Set(DISHES_PRESET.map((d) => d.category)),
];
