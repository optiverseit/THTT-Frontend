import React, { useEffect, useState } from "react";
import PackageImageGrid from "./PackageImageGrid";
import {
  Outlet,
  useParams,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { slugify } from "../../../utils/slugUtils";
import PreFooter from "../../reusable/PreFooter";
import { Compass } from "lucide-react";
import { SEO } from "../../reusable";
import {
  getPackages,
  getPackagesByCategory,
  getPackageById,
  getPackageInclusions,
  getPackageExclusions,
  getPackageRestrictions,
  getPackageWhatToBring,
  getPackageFaqs,
  getPackagePricingTiers,
  getPackageItineraries,
  getPackageHighlights,
  getPublicPackageTestimonials,
  getPublicPackagePolicies,
  getPublicPackageGallery,
} from "../../../api/BackendApi";
import { packages as mockPackages } from "../../../assets/data/mockData";
const normalizeSlug = (str?: string | null): string => {
  if (!str) return "";
  return str
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "-and-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
};

const extractArray = (res: any): any[] => {
  if (!res) return [];
  const d = res.data ?? res;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.data?.data)) return d.data.data;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.data?.items)) return d.data.items;
  return [];
};

const findMatchingPackage = (list: any[], target: string) => {
  if (!Array.isArray(list) || list.length === 0 || !target) return null;
  const cleanTarget = decodeURIComponent(target).trim().toLowerCase();
  const targetWithoutAnd = cleanTarget.replace(/-and-/g, "-");

  return (
    list.find((p: any) => {
      if (!p) return false;
      const pId = String(p.id ?? "").trim().toLowerCase();
      const pSlug = String(p.slug ?? "").trim().toLowerCase();
      const pTitle = String(p.title ?? "").trim();
      const pTitleSlug = normalizeSlug(pTitle);
      const pTitleSlugNoAnd = pTitleSlug.replace(/-and-/g, "-");
      const pSlugNoAnd = pSlug.replace(/-and-/g, "-");

      return (
        pId === cleanTarget ||
        pSlug === cleanTarget ||
        pSlugNoAnd === targetWithoutAnd ||
        pTitleSlug === cleanTarget ||
        pTitleSlugNoAnd === targetWithoutAnd ||
        normalizeSlug(pTitle.replace(/&/g, " ")) === cleanTarget
      );
    }) || null
  );
};

const PackageDetails: React.FC = () => {
  const { packageId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Instant state restore if passed via navigation
  const passedPackage = (location.state as any)?.packageData || (location.state as any)?.package || (location.state as any)?.pkg;
  const isPassedMatch = Boolean(
    passedPackage &&
    packageId &&
    findMatchingPackage([passedPackage], packageId)
  );

  // ============================================================
  // STATE
  // ============================================================
  const [backendPackage, setBackendPackage] = useState<any>(
    isPassedMatch ? passedPackage : null
  );
  // Main package loading
  const [loading, setLoading] = useState(!isPassedMatch);
  const [packageLoadFinished, setPackageLoadFinished] = useState(false);
  const [pricingLoading, setPricingLoading] = useState(false);

  // Automatic SEO normalization: redirect /details/:id -> /packages/:slug
  useEffect(() => {
    if (backendPackage && location.pathname.startsWith("/details/")) {
      const targetSlug = backendPackage.slug || slugify(backendPackage.title) || backendPackage.id;
      const subpath = location.pathname.replace(/^\/details\/[^/]+/, "");
      navigate(`/packages/${targetSlug}${subpath}`, { replace: true });
    }
  }, [backendPackage, location.pathname, navigate]);

  // ============================================================
  // FETCH PACKAGE AND RELATED DATA
  // ============================================================
  useEffect(() => {
    if (!packageId) {
      setPackageLoadFinished(true);
      setLoading(false);
      setPricingLoading(false);
      return;
    }
    let cancelled = false;

    const fetchPackageDetails = async () => {
      try {
        if (!isPassedMatch) {
          setLoading(true);
          setPackageLoadFinished(false);
        }

        const target = String(packageId).trim().toLowerCase();
        let packageData: any = isPassedMatch ? passedPackage : null;
        let isMock = false;

        // 1. Direct numeric fetch if numeric ID
        if (!packageData && /^\d+$/.test(packageId)) {
          try {
            const packageRes = await getPackageById(packageId);
            if (packageRes?.data?.data) {
              packageData = packageRes.data.data;
            } else if (packageRes?.data && typeof packageRes.data === "object" && packageRes.data.id) {
              packageData = packageRes.data;
            }
          } catch (idErr) {
            console.warn("Direct package fetch by ID failed, trying slug lookups:", idErr);
          }
        }

        // 2. Look up in backend packages list (/packages)
        if (!packageData) {
          try {
            const listRes = await getPackages({ per_page: 100 });
            const packageList = extractArray(listRes);
            packageData = findMatchingPackage(packageList, target);
          } catch (listErr) {
            console.warn("Backend getPackages list lookup failed:", listErr);
          }
        }

        // 3. Fallback: Look up across categories (Tours, Trekking, Adventure Activities, Holiday)
        if (!packageData) {
          const commonCategories = ["Tours", "Trekking", "Adventure Activities", "Holiday"];
          for (const cat of commonCategories) {
            try {
              const catRes = await getPackagesByCategory(cat);
              const catList = extractArray(catRes);
              const match = findMatchingPackage(catList, target);
              if (match) {
                packageData = match;
                break;
              }
            } catch {
              // ignore
            }
          }
        }

        // 4. Fallback matching against mock packages (e.g. p1, p2, ebc-trek from sitemap)
        if (!packageData) {
          const matchedMock = findMatchingPackage(mockPackages, target);
          if (matchedMock) {
            isMock = true;
            packageData = {
              ...matchedMock,
              itineraries: (matchedMock.itinerary || []).map((it: any, idx: number) => ({
                id: it.id || idx + 1,
                day: it.day || `Day ${idx + 1}`,
                title: it.title || "",
                description: it.desc || it.description || "",
                display_order: idx + 1,
              })),
              inclusions: (((matchedMock as any).inclusions || (matchedMock as any).includes) || []).map((inc: any, idx: number) =>
                typeof inc === "string" ? { id: idx + 1, item: inc, display_order: idx + 1 } : inc
              ),
              exclusions: (((matchedMock as any).exclusions || (matchedMock as any).excludes) || []).map((exc: any, idx: number) =>
                typeof exc === "string" ? { id: idx + 1, item: exc, display_order: idx + 1 } : exc
              ),
              pricing_tiers: (matchedMock as any).pricingTable || [],
              highlights: (matchedMock.highlights || []).map((h: any, idx: number) =>
                typeof h === "string" ? { id: idx + 1, highlight: h, display_order: idx + 1 } : h
              ),
              faqs: matchedMock.faqs || [],
              testimonies: matchedMock.testimonies || [],
              gallery: matchedMock.gallery || [],
              policies: (matchedMock as any).policies || [],
            };
          }
        }

        if (cancelled) return;

        if (!packageData) {
          setBackendPackage(null);
          setLoading(false);
          setPackageLoadFinished(true);
          return;
        }

        // If mock package, skip querying backend sub-endpoints
        if (isMock) {
          setBackendPackage(packageData);
          setLoading(false);
          setPricingLoading(false);
          setPackageLoadFinished(true);
          return;
        }

        // Immediately set package data shell so the details view renders right away
        setBackendPackage((prev: any) => ({
          ...(prev || {}),
          ...packageData,
        }));
        setLoading(false);

        const realPackageId = packageData.id;
        setPricingLoading(true);

        const pricingRequest = getPackagePricingTiers(realPackageId)
          .then((res) => {
            if (cancelled) return res;
            const raw = res?.data?.data ?? res?.data;
            const tiers = Array.isArray(raw) ? raw : [];
            if (tiers.length > 0) {
              setBackendPackage((prev: any) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  pricing_tiers: tiers,
                };
              });
            }
            return res;
          })
          .catch((err) => {
            console.warn("Failed fetching package pricing tiers:", err);
            return null;
          })
          .finally(() => {
            if (!cancelled) setPricingLoading(false);
          });
        const itinerariesRequest = getPackageItineraries(realPackageId);
        const inclusionsRequest = getPackageInclusions(realPackageId);
        const exclusionsRequest = getPackageExclusions(realPackageId);
        const restrictionsRequest = getPackageRestrictions(realPackageId);
        const whatToBringRequest = getPackageWhatToBring(realPackageId);
        const faqsRequest = getPackageFaqs(realPackageId);
        const highlightsRequest = getPackageHighlights(realPackageId);
        const testimonialsRequest = getPublicPackageTestimonials(realPackageId);
        const policiesRequest = getPublicPackagePolicies(realPackageId);
        const galleryRequest = getPublicPackageGallery(realPackageId);

        const [
          pricingRes,
          itinerariesRes,
          inclusionsRes,
          exclusionsRes,
          restrictionsRes,
          whatToBringRes,
          faqsRes,
          highlightsRes,
          testimonialsRes,
          policiesRes,
          galleryRes,
        ] = await Promise.allSettled([
          pricingRequest,
          itinerariesRequest,
          inclusionsRequest,
          exclusionsRequest,
          restrictionsRequest,
          whatToBringRequest,
          faqsRequest,
          highlightsRequest,
          testimonialsRequest,
          policiesRequest,
          galleryRequest,
        ]);
        if (cancelled) return;

        const getArray = (res: PromiseSettledResult<any>) => {
          if (res.status === "fulfilled") {
            const d = res.value?.data?.data;
            if (Array.isArray(d)) return d;
            if (Array.isArray(res.value?.data)) return res.value.data;
          }
          return [];
        };
        const inclusions = getArray(inclusionsRes);
        const exclusions = getArray(exclusionsRes);
        const restrictions = getArray(restrictionsRes);
        const what_to_bring = getArray(whatToBringRes);
        const faqs = getArray(faqsRes);
        const pricing_tiers = getArray(pricingRes);
        const itineraries = getArray(itinerariesRes);
        const highlights = getArray(highlightsRes);

        const getPublicArray = (res: PromiseSettledResult<any>) => {
          if (res.status !== "fulfilled") return [];
          const data = res.value?.data?.data;
          if (Array.isArray(data)) return data;
          if (Array.isArray(data?.data)) return data.data;
          return Array.isArray(res.value?.data) ? res.value.data : [];
        };
        const testimonials = getPublicArray(testimonialsRes);
        const policies = getPublicArray(policiesRes);
        const galleryImages = getPublicArray(galleryRes);

        setBackendPackage({
          ...packageData,
          inclusions: inclusions.length > 0 ? inclusions : (Array.isArray(packageData.inclusions) ? packageData.inclusions : []),
          exclusions: exclusions.length > 0 ? exclusions : (Array.isArray(packageData.exclusions) ? packageData.exclusions : []),
          restrictions: restrictions.length > 0 ? restrictions : (Array.isArray(packageData.restrictions) ? packageData.restrictions : []),
          what_to_bring: what_to_bring.length > 0 ? what_to_bring : (Array.isArray(packageData.what_to_bring) ? packageData.what_to_bring : []),
          faqs: faqs.length > 0 ? faqs : (Array.isArray(packageData.faqs) ? packageData.faqs : []),
          pricing_tiers: pricing_tiers.length > 0 ? pricing_tiers : (Array.isArray(packageData.pricing_tiers) ? packageData.pricing_tiers : []),
          itineraries: itineraries.length > 0 ? itineraries : (Array.isArray(packageData.itineraries) ? packageData.itineraries : []),
          highlights: highlights.length > 0 ? highlights : (Array.isArray(packageData.highlights) ? packageData.highlights : []),
          testimonies: testimonials.length > 0 ? testimonials : (Array.isArray(packageData.testimonies) ? packageData.testimonies : []),
          testimonials: testimonials.length > 0 ? testimonials : (Array.isArray(packageData.testimonials) ? packageData.testimonials : []),
          policies: policies.length > 0 ? policies : (Array.isArray(packageData.policies) ? packageData.policies : []),
          gallery: galleryImages.length > 0 ? galleryImages : (Array.isArray(packageData.gallery) ? packageData.gallery : []),
        });
        setLoading(false);
        setPricingLoading(false);
        setPackageLoadFinished(true);
      } catch (error) {
        if (cancelled) return;
        console.error("Error fetching package details:", error);
        setBackendPackage(null);
        setLoading(false);
        setPricingLoading(false);
        setPackageLoadFinished(true);
      }
    };

    fetchPackageDetails();
    return () => {
      cancelled = true;
    };
  }, [packageId, isPassedMatch]);
  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#E91E63] rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-500 mt-4">
            Loading package details...
          </p>
        </div>
      </div>
    );
  }
  // ============================================================
  // PACKAGE
  // ============================================================
  let pkg: any = backendPackage;



  // ============================================================
  // NOT FOUND
  // ============================================================
  if (
    !pkg &&
    packageLoadFinished
  ) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center py-24 px-4 bg-gray-50 text-center font-sans">
        <div className="w-20 h-20 rounded-3xl bg-pink-50 text-[#E91E63] flex items-center justify-center mb-6 shadow-sm border border-pink-100 ring-8 ring-pink-50/50">
          <Compass size={40} />
        </div>
        <h2 className="text-3xl font-black text-[#2D1347]">
          Package Not Found
        </h2>
        <p className="text-gray-500 text-sm mt-2 max-w-md">
          We couldn't find the requested travel or trekking package.
        </p>
        <div className="flex gap-3 mt-8">
          <Link
            to="/packages"
            className="px-6 py-3 bg-[#E91E63] hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            Explore All Packages
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full font-bold text-xs uppercase tracking-wider transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }
  if (!pkg) {
    return null;
  }
  // ============================================================
  // CATEGORY
  // ============================================================
  const normalizedCategory =
    typeof pkg.category === "string"
      ? pkg.category
      : pkg.category?.name ||
        pkg.category?.title ||
        pkg.category?.slug ||
        "";
  // ============================================================
  // IMAGE
  // ============================================================
  const packageImage =
    pkg.image ||
    pkg.image_url ||
    pkg.thumbnail ||
    "";
  // ============================================================
  // PRICE
  // ============================================================
  const packagePrice =
    pkg.price !== undefined &&
    pkg.price !== null
      ? String(pkg.price)
      : "";
  // ============================================================
  // GALLERY
  // ============================================================
  const backendGallery =
    Array.isArray(pkg.gallery)
      ? pkg.gallery
          .map((item: any) => {
            if (typeof item === "string") {
              return item;
            }
            return (
              item.image ||
              item.image_url ||
              item.url ||
              ""
            );
          })
          .filter(Boolean)
      : [];
  // ============================================================
  // ITINERARIES
  // ============================================================
  const normalizedItinerary =
    Array.isArray(pkg.itineraries)
      ? [...pkg.itineraries]
          .sort(
            (a: any, b: any) =>
              Number(a.display_order ?? 0) -
              Number(b.display_order ?? 0)
          )
          .map((item: any) => ({
            id:
              item.id,
            package_id:
              item.package_id,
            day:
              item.day ?? "",
            title:
              item.title ?? "",
            description:
              item.description ?? "",
            desc:
              item.description ?? "",
            display_order:
              item.display_order ?? 0,
            status:
              item.status,
          }))
      : [];
  // ============================================================
  // INCLUSIONS
  // ============================================================
  const normalizedIncludes =
    Array.isArray(pkg.inclusions)
      ? [...pkg.inclusions]
          .sort(
            (a: any, b: any) =>
              Number(a.display_order ?? 0) -
              Number(b.display_order ?? 0)
          )
          .map((item: any) => {
            if (typeof item === "string") {
              return item;
            }
            return item.item ?? "";
          })
          .filter(Boolean)
      : [];
  // ============================================================
  // EXCLUSIONS
  // ============================================================
  const normalizedExcludes =
    Array.isArray(pkg.exclusions)
      ? [...pkg.exclusions]
          .sort(
            (a: any, b: any) =>
              Number(a.display_order ?? 0) -
              Number(b.display_order ?? 0)
          )
          .map((item: any) => {
            if (typeof item === "string") {
              return item;
            }
            return item.item ?? "";
          })
          .filter(Boolean)
      : [];
  // ============================================================
  // RESTRICTIONS
  // ============================================================
  const normalizedRestrictions =
    Array.isArray(pkg.restrictions)
      ? pkg.restrictions
          .map((item: any) => {
            if (typeof item === "string") {
              return item;
            }
            return (
              item.restriction ||
              item.item ||
              ""
            );
          })
          .filter(Boolean)
      : [];
  // ============================================================
  // WHAT TO BRING
  // ============================================================
  const normalizedWhatToBring =
    Array.isArray(pkg.what_to_bring)
      ? pkg.what_to_bring
          .map((item: any) => {
            if (typeof item === "string") {
              return item;
            }
            return item.item ?? "";
          })
          .filter(Boolean)
      : [];
  // ============================================================
  // FAQS
  // ============================================================
  const normalizedFaqs =
    Array.isArray(pkg.faqs)
      ? [...pkg.faqs]
          .sort(
            (a: any, b: any) =>
              Number(a.display_order ?? 0) -
              Number(b.display_order ?? 0)
          )
          .map((faq: any) => ({
            id:
              faq.id,
            question:
              faq.question ?? "",
            answer:
              faq.answer ?? "",
            display_order:
              faq.display_order ?? 0,
            displayOrder:
              faq.display_order ?? 0,
          }))
      : [];
  // ============================================================
  // PRICING TIERS
  // ============================================================
  const normalizedPricingTable =
    Array.isArray(pkg.pricing_tiers)
      ? pkg.pricing_tiers.map((row: any) => ({
          id:
            row.id,
          service:
            row.service ?? "",
          ageGroup:
            row.age_group ??
            row.ageGroup ??
            "",
          // Keep prices as NUMBERS
          priceNepali:
            Number(row.price_npr ?? 0),
          priceForeigner:
            Number(row.price_usd ?? 0),
          // Keep original backend fields too
          price_npr:
            Number(row.price_npr ?? 0),
          price_usd:
            Number(row.price_usd ?? 0),
        }))
      : [];
  // ============================================================
  // HIGHLIGHT DETAILS
  // ============================================================
  const highlightDetails =
    Array.isArray(pkg.highlights)
      ? [...pkg.highlights]
          .sort(
            (a: any, b: any) =>
              Number(a.display_order ?? 0) -
              Number(b.display_order ?? 0)
          )
          .map((item: any) => ({
            id:
              item.id,
            package_id:
              item.package_id,
            highlight:
              item.highlight ?? "",
            image:
              item.image ?? "",
            display_order:
              item.display_order ?? 0,
            status:
              item.status ?? "ACTIVE",
            image_public_id:
              item.image_public_id ?? null,
          }))
      : [];
  // ============================================================
  // NORMALIZED HIGHLIGHTS
  // ============================================================
  const normalizedHighlights =
    highlightDetails
      .map((item: any) => item.highlight)
      .filter(Boolean);
  // ============================================================
  // NORMALIZED PACKAGE
  // ============================================================
  const normalizedPkg = {
    ...pkg,
    image:
      packageImage,
    price:
      packagePrice,
    category:
      normalizedCategory,
    adventureCategory:
      pkg.adventure_category ??
      pkg.adventureCategory,
    pricingTable:
      normalizedPricingTable,
    itinerary:
      normalizedItinerary,
    includes:
      normalizedIncludes,
    excludes:
      normalizedExcludes,
    restrictions:
      normalizedRestrictions,
    whatToBring:
      normalizedWhatToBring,
    faqs:
      normalizedFaqs,
    // Strings for PackageImageGrid
    highlights:
      normalizedHighlights,
    // Complete backend highlight objects
    highlightDetails:
      highlightDetails,
  };
  // ============================================================
  // GALLERY
  // ============================================================
  const gallery = backendGallery;
  // ============================================================
  // FINAL CHILD DATA
  // ============================================================
  const allItenary =
    normalizedItinerary;
  const allIncludes =
    normalizedIncludes;
  const allExcludes =
    normalizedExcludes;
  const restrictions =
    normalizedRestrictions;
  const whatToBring =
    normalizedWhatToBring;
  const allfaqs =
    normalizedFaqs;
  const allTestimonies =
    Array.isArray(pkg.testimonies)
      ? pkg.testimonies
      : [];
  const pricingTable =
    normalizedPricingTable;
  // ============================================================
  // ENRICHED PACKAGE
  // ============================================================
  const enrichedPkg = {
    ...normalizedPkg,
    gallery,
    policies: Array.isArray(pkg.policies) ? pkg.policies : [],
    allPolicies: Array.isArray(pkg.policies) ? pkg.policies : [],
    allTestimonies,
    testimonials: allTestimonies,
    pricingTable,
    allItenary,
    allIncludes,
    allExcludes,
    restrictions,
    whatToBring,
    allfaqs,
    highlightDetails,
  };
  // ============================================================
  // PAGE
  // ============================================================
  return (
    <div className="w-full min-h-screen bg-[#FBFBFE] font-sans pt-14 sm:pt-16 md:pt-0 print:min-h-0 print:bg-white">
      <SEO
        title={pkg.title ? `${pkg.title} | Trip Himalaya` : "Nepal Tour Package | Trip Himalaya"}
        description={pkg.description ? pkg.description.replace(/<[^>]+>/g, "").slice(0, 160) : `Book ${pkg.title || "Nepal tour"} with Trip Himalaya. Best price guarantee, licensed local guides, and 24/7 travel support.`}
        keywords={`${pkg.title || "Nepal Tour"}, Nepal tour packages, Nepal trekking packages, Trip Himalaya, Nepal holiday, ${pkg.location || "Nepal"}`}
        canonicalPath={`/packages/${backendPackage?.slug || slugify(backendPackage?.title) || packageId}`}
        image={packageImage}
        type="website"
        schema={{
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          "name": pkg.title || "Nepal Tour Package",
          "description": pkg.description ? pkg.description.replace(/<[^>]+>/g, "").slice(0, 160) : "Nepal tour with Trip Himalaya",
          "touristType": "Sightseeing, Trekking & Holiday",
          "provider": {
            "@type": "TravelAgency",
            "name": "Trip Himalaya Tours & Travel"
          }
        }}
      />
      {/* ======================================================
          PACKAGE HERO / IMAGE GRID
      ====================================================== */}
      <div className="w-full">
        <PackageImageGrid
          pkg={enrichedPkg}
        />
      </div>
      {/* ======================================================
          CHILD ROUTES
      ====================================================== */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-10 sm:pb-16 print:hidden">
        <Outlet
          context={{
            pkg:
              enrichedPkg,
            policies:
              enrichedPkg.policies,
            allPolicies:
              enrichedPkg.policies,
            allItenary,
            allIncludes,
            allExcludes,
            restrictions,
            whatToBring,
            allfaqs,
            allTestimonies,
            testimonials:
              allTestimonies,
            pricingTable,
            // =================================================
            // IMPORTANT:
            // Only represents pricing-tier API loading.
            // Child pricing component can use this without
            // blocking the entire package page.
            // =================================================
            pricingLoading,
            // Strings if an existing component needs them
            highlights:
              normalizedHighlights,
            // Full objects including Cloudinary images
            highlightDetails:
              highlightDetails,
          }}
        />
      </div>
      {/* ======================================================
          PRE FOOTER
      ====================================================== */}
      <div className="print:hidden">
        <PreFooter
          title="Ready to Experience This Adventure?"
          description="Connect with our Himalayan travel specialists for tailored dates, group discounts, and custom arrangements."
          btn1="Call Us Now"
          btn2="Request Custom Quote"
        />
      </div>
    </div>
  );
};
export default PackageDetails;
