/**
 * SEO Slug Utilities for Trip Himalaya Tours & Travels
 * Transforms titles and names into clean, URL-safe SEO slugs.
 */

export const slugify = (text?: string | null): string => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD") // normalize accented characters
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with -
    .replace(/^-+|-+$/g, "") // Trim - from start and end
    .replace(/--+/g, "-"); // Replace consecutive - with single -
};

/**
 * Returns the SEO-friendly URL for a Tour/Trek Package.
 * Prefers `slug`, then slugified `title`, falling back to `id`.
 */
export const getPackageUrl = (pkg: {
  slug?: string | null;
  title?: string | null;
  id?: number | string | null;
}): string => {
  const segment = pkg.slug || slugify(pkg.title) || (pkg.id ? String(pkg.id) : "");
  return segment ? `/packages/${segment}` : "/packages";
};

/**
 * Returns the SEO-friendly URL for a Hotel.
 */
export const getHotelUrl = (hotel: {
  slug?: string | null;
  hotel_name?: string | null;
  name?: string | null;
  id?: number | string | null;
}): string => {
  const segment =
    hotel.slug ||
    slugify(hotel.hotel_name || hotel.name) ||
    (hotel.id ? String(hotel.id) : "");
  return segment ? `/hotels/${segment}` : "/service/hotel-booking";
};

/**
 * Returns the SEO-friendly URL for a Vehicle.
 */
export const getVehicleUrl = (vehicle: {
  slug?: string | null;
  name?: string | null;
  id?: number | string | null;
}): string => {
  const segment =
    vehicle.slug ||
    slugify(vehicle.name) ||
    (vehicle.id ? String(vehicle.id) : "");
  return segment ? `/vehicles/${segment}` : "/service/vehicle-rental";
};

/**
 * Returns the SEO-friendly URL for a Visa Category.
 */
export const getVisaUrl = (visa: {
  slug?: string | null;
  name?: string | null;
  visaType?: string | null;
  id?: number | string | null;
}): string => {
  const segment =
    visa.slug ||
    slugify(visa.name || visa.visaType) ||
    (visa.id ? String(visa.id) : "");
  return segment ? `/visa/${segment}` : "/service/visa-service";
};

/**
 * Returns the SEO-friendly URL for an Insurance Plan.
 */
export const getInsuranceUrl = (plan: {
  slug?: string | null;
  name?: string | null;
  title?: string | null;
  id?: number | string | null;
}): string => {
  const segment =
    plan.slug ||
    slugify(plan.name || plan.title) ||
    (plan.id ? String(plan.id) : "");
  return segment ? `/insurance/${segment}` : "/service/travel-insurance";
};

/**
 * Returns the SEO-friendly URL for a Documentation guide.
 */
export const getDocumentationUrl = (doc: {
  slug?: string | null;
  title?: string | null;
  id?: number | string | null;
}): string => {
  const segment =
    doc.slug ||
    slugify(doc.title) ||
    (doc.id ? String(doc.id) : "");
  return segment ? `/documentation/${segment}` : "/documentation";
};

/**
 * Returns the SEO-friendly URL for a Blog post.
 * Always prefers a clean, titled slug over a numeric ID to optimize for SEO.
 */
export const getBlogUrl = (post: {
  slug?: string | null;
  title?: string | null;
  id?: number | string | null;
}): string => {
  const hasCleanSlug = post.slug && !/^\d+$/.test(String(post.slug).trim());
  const segment =
    (hasCleanSlug ? post.slug : "") ||
    slugify(post.title) ||
    (post.slug ? String(post.slug) : "") ||
    (post.id ? String(post.id) : "");
  return segment ? `/blog/${segment}` : "/blog";
};
