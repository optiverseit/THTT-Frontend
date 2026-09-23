import React, { useEffect, useState } from "react";
import PackageImageGrid from "./PackageImageGrid";

import {
  Outlet,
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";

import {
  hotels,
  vehicles,
} from "../../../assets/data/mockData";

import { VISA_PLANS } from "../../Service/VisaServicesDetailContent";
import VisaCountryDetailView from "../../Service/VisaCountryDetailView";

import { INSURANCE_PLANS } from "../../Service/insuranceData";
import InsurancePlanDetailView from "../../Service/InsurancePlanDetailView";

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
  const navigate = useNavigate();

  // ============================================================
  // STATE
  // ============================================================

  const [backendPackage, setBackendPackage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [packageLoadFinished, setPackageLoadFinished] = useState(false);


  // ============================================================
  // VISA
  // ============================================================

  const matchedVisa = VISA_PLANS.find(
    (v) =>
      v.id.toLowerCase() === packageId?.toLowerCase() ||
      v.country.toLowerCase() === packageId?.toLowerCase() ||
      v.country
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") === packageId?.toLowerCase() ||
      packageId
        ?.toLowerCase()
        .includes(
          v.country
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
        ) ||
      packageId
        ?.toLowerCase()
        .includes(v.id.toLowerCase())
  );


  // ============================================================
  // INSURANCE
  // ============================================================

  const matchedInsurance = INSURANCE_PLANS.find(
    (ins) =>
      ins.id.toLowerCase() === packageId?.toLowerCase() ||
      packageId
        ?.toLowerCase()
        .includes(ins.id.toLowerCase())
  );


  // ============================================================
  // NUMERIC BACKEND PACKAGE
  // ============================================================

  const isNumericPackageId =
    !!packageId && /^\d+$/.test(packageId);


  // ============================================================
  // FETCH PACKAGE AND RELATED DATA
  // ============================================================

  useEffect(() => {
    if (
      !packageId ||
      !isNumericPackageId ||
      matchedVisa ||
      matchedInsurance
    ) {
      setPackageLoadFinished(true);
      return;
    }

    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        setPackageLoadFinished(false);

        const [
          packageResponse,
          inclusionsResponse,
          exclusionsResponse,
          restrictionsResponse,
          whatToBringResponse,
          faqsResponse,
          pricingResponse,
          itinerariesResponse,
          highlightsResponse,
        ] = await Promise.all([
          getPackageById(packageId),
          getPackageInclusions(packageId),
          getPackageExclusions(packageId),
          getPackageRestrictions(packageId),
          getPackageWhatToBring(packageId),
          getPackageFaqs(packageId),
          getPackagePricingTiers(packageId),
          getPackageItineraries(packageId),
          getPackageHighlights(packageId),
        ]);


        // ======================================================
        // EXACT API RESPONSE FORMAT:
        //
        // {
        //   status: true,
        //   message: "...",
        //   data: [...]
        // }
        // ======================================================

        const packageData =
          packageResponse.data?.data ?? null;

        const inclusions =
          Array.isArray(inclusionsResponse.data?.data)
            ? inclusionsResponse.data.data
            : [];

        const exclusions =
          Array.isArray(exclusionsResponse.data?.data)
            ? exclusionsResponse.data.data
            : [];

        const restrictions =
          Array.isArray(restrictionsResponse.data?.data)
            ? restrictionsResponse.data.data
            : [];

        const whatToBring =
          Array.isArray(whatToBringResponse.data?.data)
            ? whatToBringResponse.data.data
            : [];

        const faqs =
          Array.isArray(faqsResponse.data?.data)
            ? faqsResponse.data.data
            : [];

        const pricingTiers =
          Array.isArray(pricingResponse.data?.data)
            ? pricingResponse.data.data
            : [];

        const itineraries =
          Array.isArray(itinerariesResponse.data?.data)
            ? itinerariesResponse.data.data
            : [];

        const highlights =
          Array.isArray(highlightsResponse.data?.data)
            ? highlightsResponse.data.data
            : [];


        console.log("PACKAGE:", packageData);
        console.log("INCLUSIONS:", inclusions);
        console.log("EXCLUSIONS:", exclusions);
        console.log("RESTRICTIONS:", restrictions);
        console.log("WHAT TO BRING:", whatToBring);
        console.log("FAQS:", faqs);
        console.log("PRICING TIERS:", pricingTiers);
        console.log("ITINERARIES:", itineraries);
        console.log("HIGHLIGHTS:", highlights);


        // ======================================================
        // COMBINE ALL BACKEND DATA
        // ======================================================

        setBackendPackage({
          ...packageData,

          inclusions,
          exclusions,
          restrictions,

          what_to_bring: whatToBring,

          faqs,

          pricing_tiers: pricingTiers,

          itineraries,

          highlights,
        });

      } catch (error) {
        console.error(
          "Error fetching package details:",
          error
        );

        setBackendPackage(null);

      } finally {
        setLoading(false);
        setPackageLoadFinished(true);
      }
    };


    fetchPackageDetails();

  }, [packageId]);


  // ============================================================
  // VISA PAGE
  // ============================================================

  if (matchedVisa) {
    return (
      <div className="w-full min-h-screen bg-[#FBFBFE] font-sans print:min-h-0 print:bg-white print:p-0 print:m-0">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 sm:pt-14 sm:pb-12 print:max-w-none print:p-0 print:m-0">

          <VisaCountryDetailView
            plan={matchedVisa}
            allPlans={VISA_PLANS}

            onSelectPlan={(newPlan) =>
              navigate(`/details/${newPlan.id}`)
            }

            onBack={() =>
              navigate("/service/visa-services")
            }
          />

        </div>

      </div>
    );
  }


  // ============================================================
  // INSURANCE PAGE
  // ============================================================

  if (matchedInsurance) {
    return (
      <div className="w-full min-h-screen bg-[#FBFBFE] font-sans print:min-h-0 print:bg-white print:p-0 print:m-0">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 sm:pt-14 sm:pb-12 print:max-w-none print:p-0 print:m-0">

          <InsurancePlanDetailView
            plan={matchedInsurance}
            allPlans={INSURANCE_PLANS}

            onSelectPlan={(newPlan) =>
              navigate(`/details/${newPlan.id}`)
            }

            onBack={() =>
              navigate("/service/travel-insurance")
            }
          />

        </div>

      </div>
    );
  }


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
  // HOTEL FALLBACK
  // ============================================================

  if (
    !pkg &&
    packageId &&
    !isNumericPackageId
  ) {
    const matchedHotel = hotels.find(
      (h) =>
        h.id.toLowerCase() === packageId.toLowerCase() ||
        h.slug.toLowerCase() === packageId.toLowerCase()
    );


    if (matchedHotel) {
      pkg = {
        id: matchedHotel.id,
        title: matchedHotel.name,
        slug: matchedHotel.slug,

        duration: "Per Night Stay",

        location:
          matchedHotel.location ||
          matchedHotel.city,

        price:
          `$${matchedHotel.priceUSD}`,

        image:
          matchedHotel.image,

        gallery:
          matchedHotel.gallery,

        category:
          "domestic",

        type:
          "activity",

        description:
          matchedHotel.description,

        highlights:
          matchedHotel.amenities ||
          matchedHotel.features ||
          [],

        rating:
          matchedHotel.rating,

        reviewsCount:
          matchedHotel.reviewsCount,
      };
    }
  }


  // ============================================================
  // VEHICLE FALLBACK
  // ============================================================

  if (
    !pkg &&
    packageId &&
    !isNumericPackageId
  ) {
    const matchedVehicle = vehicles.find(
      (v) =>
        v.id.toLowerCase() === packageId.toLowerCase() ||
        v.slug.toLowerCase() === packageId.toLowerCase()
    );


    if (matchedVehicle) {
      pkg = {
        id:
          matchedVehicle.id,

        title:
          matchedVehicle.name,

        slug:
          matchedVehicle.slug,

        duration:
          `Capacity: ${matchedVehicle.seats}`,

        location:
          matchedVehicle.bestFor ||
          "All Nepal Routes",

        price:
          `$${matchedVehicle.pricePerDayUSD}`,

        image:
          matchedVehicle.image,

        gallery:
          matchedVehicle.gallery,

        category:
          "domestic",

        type:
          "activity",

        description:
          matchedVehicle.description,

        highlights:
          matchedVehicle.features ||
          matchedVehicle.amenities ||
          [],

        rating: 5,
        reviewsCount: 140,
      };
    }
  }


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
  //
  // Backend:
  //
  // category: {
  //   id: 1,
  //   name: "Trekking"
  // }
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
  //
  // Backend:
  //
  // {
  //   day: "Day 1",
  //   title: "test1",
  //   description: "tstgsyh"
  // }
  //
  // Existing UI may use `desc`, therefore both are provided.
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
  //
  // Backend:
  //
  // {
  //   item: "airport ticket and drop1"
  // }
  //
  // UI:
  //
  // ["airport ticket and drop1"]
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
  //
  // Expected backend:
  //
  // {
  //   restriction: "..."
  // }
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
  //
  // Backend:
  //
  // {
  //   item: "warm jacket1"
  // }
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
  //
  // Backend:
  //
  // age_group
  // price_npr
  // price_usd
  //
  // Existing UI:
  //
  // ageGroup
  // priceNepali
  // priceForeigner
  // ============================================================

  const normalizedPricingTable =
    Array.isArray(pkg.pricing_tiers)
      ? pkg.pricing_tiers.map((row: any) => ({
        id: row.id,

        service: row.service ?? "",

        ageGroup:
          row.age_group ??
          row.ageGroup ??
          "",

        // Keep prices as NUMBERS
        priceNepali: Number(row.price_npr ?? 0),

        priceForeigner: Number(row.price_usd ?? 0),

        // Keep original backend fields too
        price_npr: Number(row.price_npr ?? 0),

        price_usd: Number(row.price_usd ?? 0),
      }))
      : [];


  // ============================================================
  // HIGHLIGHT DETAILS
  //
  // KEEP COMPLETE OBJECTS because backend has:
  //
  // highlight
  // image
  // display_order
  //
  // These can later be used by a dedicated Highlights component.
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
  // IMPORTANT:
  //
  // PackageImageGrid currently expects pkg.highlights to contain
  // strings.
  //
  // DO NOT pass highlight objects to pkg.highlights.
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

    // IMPORTANT:
    // string[] for old PackageImageGrid
    highlights:
      normalizedHighlights,

    // Complete backend objects
    highlightDetails:
      highlightDetails,
  };


  // ============================================================
  // GALLERY
  // ============================================================

  const defaultGallery = [
    normalizedPkg.image ||
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",

    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",

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
    <div className="w-full min-h-screen bg-[#FBFBFE] font-sans pt-0 print:min-h-0 print:bg-white">

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16 print:hidden">

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