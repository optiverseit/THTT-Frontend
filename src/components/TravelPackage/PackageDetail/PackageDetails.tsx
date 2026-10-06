import React, { useEffect, useState } from "react";

import PackageImageGrid from "./PackageImageGrid";

import {
  Outlet,
  useParams,
  Link,
} from "react-router-dom";

import PreFooter from "../../reusable/PreFooter";

import { Compass } from "lucide-react";

import {
  getPackageById,
  getPackageInclusions,
  getPackageExclusions,
  getPackageRestrictions,
  getPackageWhatToBring,
  getPackageFaqs,
  getPackagePricingTiers,
  getPackageItineraries,
  getPackageHighlights,
} from "../../../api/BackendApi";

const PackageDetails: React.FC = () => {
  const { packageId } = useParams();

  // ============================================================
  // STATE
  // ============================================================

  const [backendPackage, setBackendPackage] = useState<any>(null);

  // Main package loading
  const [loading, setLoading] = useState(false);

  const [packageLoadFinished, setPackageLoadFinished] = useState(false);

  // ============================================================
  // PRICING LOADING
  // ============================================================

  /**
   * This loading state is ONLY for the pricing API.
   *
   * It is passed through Outlet context so the pricing page/card
   * can show its own loading state without blocking the entire
   * package details page.
   */
  const [pricingLoading, setPricingLoading] = useState(false);

  // ============================================================
  // NUMERIC BACKEND PACKAGE
  // ============================================================

  const isNumericPackageId =
    !!packageId && /^\d+$/.test(packageId);

  // ============================================================
  // FETCH PACKAGE AND RELATED DATA
  // ============================================================

  useEffect(() => {
    if (!packageId || !isNumericPackageId) {
      setPackageLoadFinished(true);
      setPricingLoading(false);
      return;
    }

    let cancelled = false;

    const updateRelatedData = (key: string, data: any[]) => {
      if (cancelled) return;

      setBackendPackage((prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          [key]: data,
        };
      });
    };

    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        setPackageLoadFinished(false);
        setBackendPackage(null);

        // Pricing starts loading independently.
        setPricingLoading(true);

        // ========================================================
        // API REQUESTS
        // ========================================================

        const packageRequest =
          getPackageById(packageId);

        const pricingRequest =
          getPackagePricingTiers(packageId);

        const itinerariesRequest =
          getPackageItineraries(packageId);

        const inclusionsRequest =
          getPackageInclusions(packageId);

        const exclusionsRequest =
          getPackageExclusions(packageId);

        const restrictionsRequest =
          getPackageRestrictions(packageId);

        const whatToBringRequest =
          getPackageWhatToBring(packageId);

        const faqsRequest =
          getPackageFaqs(packageId);

        const highlightsRequest =
          getPackageHighlights(packageId);

        // ========================================================
        // INCLUSIONS
        // ========================================================

        inclusionsRequest
          .then((response) => {
            const data = Array.isArray(response.data?.data)
              ? response.data.data
              : [];

            console.log("INCLUSIONS:", data);

            updateRelatedData("inclusions", data);
          })
          .catch((error) =>
            console.error(
              "Error fetching package inclusions:",
              error
            )
          );

        // ========================================================
        // EXCLUSIONS
        // ========================================================

        exclusionsRequest
          .then((response) => {
            const data = Array.isArray(response.data?.data)
              ? response.data.data
              : [];

            console.log("EXCLUSIONS:", data);

            updateRelatedData("exclusions", data);
          })
          .catch((error) =>
            console.error(
              "Error fetching package exclusions:",
              error
            )
          );

        // ========================================================
        // RESTRICTIONS
        // ========================================================

        restrictionsRequest
          .then((response) => {
            const data = Array.isArray(response.data?.data)
              ? response.data.data
              : [];

            console.log("RESTRICTIONS:", data);

            updateRelatedData("restrictions", data);
          })
          .catch((error) =>
            console.error(
              "Error fetching package restrictions:",
              error
            )
          );

        // ========================================================
        // WHAT TO BRING
        // ========================================================

        whatToBringRequest
          .then((response) => {
            const data = Array.isArray(response.data?.data)
              ? response.data.data
              : [];

            console.log("WHAT TO BRING:", data);

            updateRelatedData("what_to_bring", data);
          })
          .catch((error) =>
            console.error(
              "Error fetching what to bring:",
              error
            )
          );

        // ========================================================
        // FAQS
        // ========================================================

        faqsRequest
          .then((response) => {
            const data = Array.isArray(response.data?.data)
              ? response.data.data
              : [];

            console.log("FAQS:", data);

            updateRelatedData("faqs", data);
          })
          .catch((error) =>
            console.error(
              "Error fetching package FAQs:",
              error
            )
          );

        // ========================================================
        // PRICING TIERS
        // ========================================================

        pricingRequest
          .then((response) => {
            if (cancelled) return;

            const data = Array.isArray(response.data?.data)
              ? response.data.data
              : [];

            console.log("PRICING TIERS:", data);

            updateRelatedData("pricing_tiers", data);
          })
          .catch((error) => {
            if (cancelled) return;

            console.error(
              "Error fetching package pricing tiers:",
              error
            );

            updateRelatedData("pricing_tiers", []);
          })
          .finally(() => {
            if (cancelled) return;

            // IMPORTANT:
            // Only the pricing loading state stops here.
            setPricingLoading(false);
          });

        // ========================================================
        // ITINERARIES
        // ========================================================

        itinerariesRequest
          .then((response) => {
            const data = Array.isArray(response.data?.data)
              ? response.data.data
              : [];

            console.log("ITINERARIES:", data);

            updateRelatedData("itineraries", data);
          })
          .catch((error) =>
            console.error(
              "Error fetching package itineraries:",
              error
            )
          );

        // ========================================================
        // HIGHLIGHTS
        // ========================================================

        highlightsRequest
          .then((response) => {
            const data = Array.isArray(response.data?.data)
              ? response.data.data
              : [];

            console.log("HIGHLIGHTS:", data);

            updateRelatedData("highlights", data);
          })
          .catch((error) =>
            console.error(
              "Error fetching package highlights:",
              error
            )
          );

        // ========================================================
        // MAIN PACKAGE
        // ========================================================

        const packageResponse =
          await packageRequest;

        const packageData =
          packageResponse.data?.data ?? null;

        if (cancelled) return;

        if (!packageData) {
          setBackendPackage(null);
          setLoading(false);
          setPackageLoadFinished(true);

          return;
        }

        console.log("PACKAGE:", packageData);

        setBackendPackage((prev: any) => ({
          ...packageData,

          inclusions:
            prev?.inclusions ?? [],

          exclusions:
            prev?.exclusions ?? [],

          restrictions:
            prev?.restrictions ?? [],

          what_to_bring:
            prev?.what_to_bring ?? [],

          faqs:
            prev?.faqs ?? [],

          pricing_tiers:
            prev?.pricing_tiers ?? [],

          itineraries:
            prev?.itineraries ?? [],

          highlights:
            prev?.highlights ?? [],
        }));

        setLoading(false);
        setPackageLoadFinished(true);
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Error fetching package details:",
          error
        );

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
  }, [packageId, isNumericPackageId]);

  // ============================================================
  // LOADING
  // ============================================================

  if (isNumericPackageId && loading) {
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

  let pkg: any =
    isNumericPackageId
      ? backendPackage
      : null;

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

  const defaultGallery = [
    normalizedPkg.image ||
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",

    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3bfb?auto=format&fit=crop&q=80&w=800",

    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
  ];

  const gallery =
    backendGallery.length > 0
      ? backendGallery
      : defaultGallery;

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

            allItenary,

            allIncludes,

            allExcludes,

            restrictions,

            whatToBring,

            allfaqs,

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