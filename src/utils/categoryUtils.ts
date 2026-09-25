/**
 * Helper to get the category display name for any package or service.
 * 
 * Priority:
 * 1. API data: pkg.category?.title, pkg.category?.name, pkg.category_name, pkg.categoryName
 * 2. Explicit fallback category (e.g. "Tours", "Trekking", "Adventure")
 * 3. pkg.type ("tour" -> "Tours", "trek" -> "Trekking", "activity" -> "Adventure")
 * 4. Infer from title / slug / location heuristics
 * 5. Default fallback: "Tours"
 */
export function getPackageCategoryName(pkg: any, fallbackCategory?: string): string {
  if (!pkg && !fallbackCategory) return "Tours";

  // 1. API fields if provided by backend
  if (pkg?.category?.title && typeof pkg.category.title === "string" && pkg.category.title.trim()) {
    return pkg.category.title.trim();
  }
  if (pkg?.category?.name && typeof pkg.category.name === "string" && pkg.category.name.trim()) {
    return pkg.category.name.trim();
  }
  if (typeof pkg?.category_name === "string" && pkg.category_name.trim()) {
    return pkg.category_name.trim();
  }
  if (typeof pkg?.categoryName === "string" && pkg.categoryName.trim()) {
    return pkg.categoryName.trim();
  }
  if (typeof pkg?.categoryTitle === "string" && pkg.categoryTitle.trim()) {
    return pkg.categoryTitle.trim();
  }
  if (
    typeof pkg?.category === "string" &&
    pkg.category.trim() &&
    pkg.category !== "domestic" &&
    pkg.category !== "international"
  ) {
    return pkg.category.trim();
  }

  // 2. Explicit fallback provided by the calling component (e.g., from Trekking or Tours page)
  if (fallbackCategory && fallbackCategory.trim()) {
    return fallbackCategory.trim();
  }

  // 3. Normalized pkg.type mapping
  const typeStr = String(pkg?.type || "").toLowerCase().trim();
  if (typeStr === "trek" || typeStr === "trekking") return "Trekking";
  if (typeStr === "tour" || typeStr === "tours") return "Tours";
  if (
    typeStr === "activity" ||
    typeStr === "activities" ||
    typeStr === "adventure" ||
    typeStr === "combo"
  ) {
    return "Adventure";
  }

  // 4. Infer from title / slug / description / location
  const text = `${pkg?.title ?? ""} ${pkg?.slug ?? ""} ${pkg?.location ?? ""}`.toLowerCase();
  if (
    text.includes("trek") ||
    text.includes("camp") ||
    text.includes("circuit") ||
    text.includes("peak") ||
    text.includes("himalaya")
  ) {
    return "Trekking";
  }
  if (
    text.includes("adventure") ||
    text.includes("paraglid") ||
    text.includes("raft") ||
    text.includes("bungee") ||
    text.includes("canyon") ||
    text.includes("zip") ||
    text.includes("combo")
  ) {
    return "Adventure";
  }
  if (
    text.includes("tour") ||
    text.includes("cultural") ||
    text.includes("heritage") ||
    text.includes("sightseeing") ||
    text.includes("safari")
  ) {
    return "Tours";
  }

  // 5. Default fallback
  return "Tours";
}
