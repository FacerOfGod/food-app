const ALLOWED_HOSTS = new Set([
  "images.unsplash.com",
  "plus.unsplash.com",
  "image.tmdb.org",
  "www.themealdb.com",
  "upload.wikimedia.org",
  "images.openfoodfacts.org",
  "world.openfoodfacts.org",
]);

export function validateImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("data:")) return null;
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return null;
    if (!ALLOWED_HOSTS.has(u.hostname)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function mealDbIngredientImage(slugEn: string): string {
  const slug = slugEn.toLowerCase().replace(/ /g, "_");
  return `https://www.themealdb.com/images/ingredients/${slug}.png`;
}

export function mealDbMealImage(filename: string): string {
  return `https://www.themealdb.com/images/media/meals/${filename}`;
}
