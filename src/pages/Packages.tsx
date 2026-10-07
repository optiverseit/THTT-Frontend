import React, { useEffect, useState } from "react";

import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Users,
} from "lucide-react";

import FilterSideBar from "../components/TravelPackage/FilterSiderBar";
import PackageDetailsSection from "../components/TravelPackage/PackageDetailsSection";
import BookingModal from "../components/reusable/packages/BookingModal";
import Testimonials from "../components/reusable/Testimonials";
import PreFooter from "../components/reusable/PreFooter";

import type { Package } from "../assets/data/types";

import {
  getPackages,
  getCategories,
} from "../api/BackendApi";

import { useNavigate } from "react-router-dom";
import { useGlobalCurrency } from "../context/CurrencyContext";
import { isSessionValid, clearAuthSession } from "../utils/sessionManager";


interface Category {
  id: number | string;
  title?: string;
  name?: string;
  slug?: string;
  status?: string;
}


const Packages: React.FC = () => {

  const navigate = useNavigate();
  const { nprPerOneDollar } = useGlobalCurrency();


  // =========================================================
  // BACKEND DATA
  // =========================================================

  const [packages, setPackages] = useState<Package[]>([]);

  const [filteredPackages, setFilteredPackages] =
    useState<Package[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);


  // =========================================================
  // FILTER STATES
  // =========================================================

  const [searchQuery, setSearchQuery] =
    useState<string>("");

  const [selectedCategory, setSelectedCategory] =
    useState<string>("all");

  // Applied values (only updated when user clicks SEARCH button or presses Enter)
  const [appliedSearchQuery, setAppliedSearchQuery] =
    useState<string>("");

  const [appliedCategory, setAppliedCategory] =
    useState<string>("all");

  const [priceRange, setPriceRange] = useState<number>(500000);

  const [selectedRating, setSelectedRating] =
    useState<number>(0);

  const [selectedKeywords, setSelectedKeywords] =
    useState<string[]>([]);


  // =========================================================
  // BOOKING STATES
  // =========================================================

  const [selectedBookingPkg, setSelectedBookingPkg] =
    useState<Package | null>(null);

  const [isBookingModalOpen, setIsBookingModalOpen] =
    useState<boolean>(false);


  // =========================================================
  // FETCH PACKAGES
  // =========================================================

  const fetchPackages = async () => {

    try {

      setLoading(true);

      const response = await getPackages();

      console.log(
        "FULL PACKAGE RESPONSE:",
        response.data
      );


      /*
       * Supports:
       *
       * {
       *   status: true,
       *   data: [...]
       * }
       *
       * OR
       *
       * {
       *   status: true,
       *   data: {
       *      data: [...]
       *   }
       * }
       *
       * OR direct array.
       */

      let packageData: Package[] = [];


      if (Array.isArray(response.data)) {

        packageData = response.data;

      } else if (
        Array.isArray(response.data?.data)
      ) {

        packageData =
          response.data.data;

      } else if (
        Array.isArray(
          response.data?.data?.data
        )
      ) {

        packageData =
          response.data.data.data;

      }


      console.log(
        "PACKAGE DATA:",
        packageData
      );


      const mappedPackages = packageData.map((pkg: any) => {
        if (pkg.rating !== undefined && pkg.rating !== null && pkg.rating !== "") {
          return pkg;
        }
        const numId = Number(pkg.id);
        const computedRating = (!isNaN(numId) && (numId + (pkg.title?.length || 0)) % 2 === 0) ? 4 : 5;
        return {
          ...pkg,
          rating: computedRating,
        };
      });

      // Sort packages so the latest inserted card appears first (newest to oldest):
      const sortedPackages = [...mappedPackages].sort((a: any, b: any) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;

        if (timeA && timeB && timeA !== timeB) {
          return timeB - timeA;
        }

        const idA = Number(a.id) || 0;
        const idB = Number(b.id) || 0;
        return idB - idA;
      });

      setPackages(sortedPackages);

      setFilteredPackages(sortedPackages);

    } catch (error) {

      console.error(
        "Error fetching packages:",
        error
      );

      setPackages([]);

      setFilteredPackages([]);

    } finally {

      setLoading(false);
    }
  };


  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  const fetchCategories = async () => {

    try {

      const response =
        await getCategories();


      console.log(
        "FULL CATEGORY RESPONSE:",
        response.data
      );


      /*
       * Supports:
       *
       * {
       *   status: true,
       *   data: [...]
       * }
       *
       * OR
       *
       * {
       *   status: true,
       *   data: {
       *      data: [...]
       *   }
       * }
       *
       * OR direct array.
       */

      let categoryData: Category[] = [];


      if (Array.isArray(response.data)) {

        categoryData =
          response.data;

      } else if (
        Array.isArray(
          response.data?.data
        )
      ) {

        categoryData =
          response.data.data;

      } else if (
        Array.isArray(
          response.data?.data?.data
        )
      ) {

        categoryData =
          response.data.data.data;

      }


      console.log(
        "CATEGORY DATA:",
        categoryData
      );


      setCategories(categoryData);

    } catch (error) {

      console.error(
        "Error fetching categories:",
        error
      );

      setCategories([]);
    }
  };


  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {

    fetchPackages();

    fetchCategories();

  }, []);


  // =========================================================
  // BOOK PACKAGE
  // =========================================================

  const handleBookPackage = (
    pkgToBook: Package
  ) => {
    if (!isSessionValid()) {
      clearAuthSession();
      navigate("/login", {
        state: {
          from: "/packages",
          packageId:
            pkgToBook.id,
          openBooking: true,
        },
      });
      return;
    }



    setSelectedBookingPkg(
      pkgToBook
    );

    setIsBookingModalOpen(true);
  };


  // =========================================================
  // FILTER PACKAGES
  // =========================================================

  const filterPackagesWith = (queryText: string, categoryFilter: string) => {

    const filtered =
      packages.filter(
        (pkg: any) => {


          // =====================================
          // SEARCH BY TITLE OR LOCATION
          // =====================================

          const query = queryText.trim().toLowerCase();

          const matchesSearch =
            !query ||
            // Title match (any word in query matches title)
            query.split(/[\s,]+/).filter(Boolean).some((word) =>
              pkg.title?.toLowerCase().includes(word)
            ) ||
            // Location match (any word in query matches location keywords)
            query.split(/[\s,]+/).filter(Boolean).some((word) =>
              pkg.location?.toLowerCase().includes(word)
            );


          // =====================================
          // CATEGORY
          // Matches static options: all | tours | adventure | trekking
          // against pkg.category.name / pkg.category.title / pkg.type
          // =====================================

          const pkgCategoryName = (
            pkg.category?.name ||
            pkg.category?.title ||
            pkg.category?.slug ||
            pkg.type ||
            ""
          ).toLowerCase();

          const pkgCategoryId = String(pkg.category_id ?? pkg.category?.id ?? "");

          const matchesCategory =
            categoryFilter === "all" || categoryFilter === ""
              ? true
              : categoryFilter === "tours"
              ? pkgCategoryName.includes("tour") || pkgCategoryName.includes("holiday") || pkgCategoryName.includes("unesco")
              : categoryFilter === "adventure"
              ? pkgCategoryName.includes("adventure") || pkgCategoryName.includes("activity") || pkgCategoryName.includes("activities")
              : categoryFilter === "trekking"
              ? pkgCategoryName.includes("trek") || pkgCategoryName.includes("hiking") || pkgCategoryName.includes("expedition")
              : String(pkgCategoryId) === String(categoryFilter);


          // =====================================
          // PRICE
          // =====================================

          const extractPriceNPR = (item: any): number => {
            if (Array.isArray(item.pricingTable) && item.pricingTable.length > 0) {
              const firstTier = item.pricingTable[0];
              const rawTier = String(firstTier?.priceNepali || firstTier?.price || "").replace(/[^0-9.]/g, "");
              const tierNum = Number(rawTier);
              if (Number.isFinite(tierNum) && tierNum > 0) return tierNum;
            }

            if (typeof item.price === "number" && !isNaN(item.price)) return item.price;
            if (typeof item.price_npr === "number" && !isNaN(item.price_npr)) return item.price_npr;
            if (typeof item.starting_price === "number" && !isNaN(item.starting_price)) return item.starting_price;
            if (typeof item.priceNepali === "number" && !isNaN(item.priceNepali)) return item.priceNepali;

            const rawStr = String(item.price ?? item.price_npr ?? item.starting_price ?? item.priceNepali ?? "").trim();
            if (rawStr) {
              const isUSD = rawStr.includes("$");
              const cleaned = Number(rawStr.replace(/[^0-9.]/g, ""));
              if (Number.isFinite(cleaned) && cleaned > 0) {
                return isUSD ? cleaned * (nprPerOneDollar || 151.09) : cleaned;
              }
            }
            return 0;
          };

          const priceNum = extractPriceNPR(pkg);
          const matchesPrice =
            priceNum === 0 ||
            priceNum <= priceRange;

          // =====================================
          // RATING
          // =====================================

          const packageRating = Math.round(Number(pkg.rating ?? 5));
          const matchesRating =
            selectedRating === 0 ||
            packageRating === selectedRating;


          // =====================================
          // KEYWORDS
          // =====================================

          const matchesKeywords =

            selectedKeywords.length ===
              0

              ? true

              : selectedKeywords.some(
                (
                  keyword
                ) => {

                  const lowerKeyword =
                    keyword.toLowerCase();


                  const titleMatches =
                    pkg.title
                      ?.toLowerCase()
                      .includes(
                        lowerKeyword
                      );


                  const highlightMatches =
                    pkg.highlights?.some(
                      (
                        highlight: any
                      ) => {

                        const value =

                          typeof highlight ===
                            "string"

                            ? highlight

                            : highlight
                              ?.highlight;


                        return value
                          ?.toLowerCase()
                          .includes(
                            lowerKeyword
                          );
                      }
                    );


                  return (
                    titleMatches ||
                    highlightMatches
                  );
                }
              );


          return (
            matchesSearch &&
            matchesCategory &&
            matchesPrice &&
            matchesRating &&
            matchesKeywords
          );
        }
      );


    setFilteredPackages(
      filtered
    );
  };

  // Called when user clicks "SEARCH" or presses Enter in the search input
  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery);
    setAppliedCategory(selectedCategory);
    filterPackagesWith(searchQuery, selectedCategory);
  };


  // =========================================================
  // APPLY FILTERS (only triggers on packages load, applied search/category, or sidebar filters)
  // =========================================================

  useEffect(() => {

    filterPackagesWith(appliedSearchQuery, appliedCategory);

  }, [
    packages,
    appliedSearchQuery,
    appliedCategory,
    priceRange,
    selectedRating,
    selectedKeywords,
  ]);


  // =========================================================
  // TESTIMONIALS
  // =========================================================

  const pkg: any =
    packages.length > 0
      ? packages[0]
      : null;


  const testimonies =
    pkg?.testimonies ?? [];


  // =========================================================
  // JSX
  // =========================================================

  return (

    <div className="w-full min-h-screen bg-[#FBFBFE] font-sans">


      {/* =================================================
                HERO
            ================================================= */}

      <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">


        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000"
          alt="Canyon & Mountain Adventures"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />


        <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />


        <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">


          <div className="flex flex-col items-center mt-2 sm:mt-1.5">


            <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">

              CURATED ADVENTURES

            </span>


            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">

              Travel Packages

            </h1>


            <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />

          </div>


          {/* =========================================
                        SEARCH BAR
                    ========================================= */}

          <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">


            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">


              {/* LEFT: SELECT CATEGORY */}

              <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">


                <MapPin
                  size={18}
                  className="text-pink-500 flex-shrink-0"
                />


                <div className="flex flex-col w-full text-left">


                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    SELECT CATEGORY
                  </label>


                  <select
                    className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Packages</option>
                    <option value="tours">Tours Packages</option>
                    <option value="adventure">Adventure Activity</option>
                    <option value="trekking">Trekking Packages</option>
                  </select>


                </div>

              </div>


              {/* RIGHT: SEARCH BY TITLE / LOCATION */}

              <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">


                <Search
                  size={18}
                  className="text-pink-500 flex-shrink-0"
                />


                <div className="flex flex-col w-full text-left">


                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    SEARCH BY TITLE / LOCATION
                  </label>


                  <input
                    type="text"
                    className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal"
                    placeholder="Package name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />


                </div>

              </div>


              {/* SEARCH BUTTON */}

              <button
                onClick={handleSearch}
                className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer active:scale-95"
              >

                SEARCH

              </button>

            </div>

          </div>


          <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">

            "Explore the tours and treks crafted for your next adventure."

          </p>


          {/* =========================================
                        STAT CARDS
                    ========================================= */}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3">


            {[
              {
                icon: MapPin,
                label: `${packages.length} Packages`,
                desc: "Curated Adventures",
              },

              {
                icon: Star,
                label: "4.9/5 Rating",
                desc: "Verified Reviews",
              },

              {
                icon: ShieldCheck,
                label: "Best Price Match",
                desc: "No Hidden Fees",
              },

              {
                icon: Users,
                label: "10,000+ Travelers",
                desc: "Happy Clients",
              },

            ].map(
              (
                stat,
                idx
              ) => {


                const Icon =
                  stat.icon;


                return (

                  <div
                    key={
                      idx
                    }
                    className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0"
                  >


                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25 group-hover:scale-105 transition-transform">

                      <Icon
                        size={
                          14
                        }
                      />

                    </div>


                    <div className="flex flex-col text-left min-w-0">


                      <h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">

                        {
                          stat.label
                        }

                      </h4>


                      <p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">

                        {
                          stat.desc
                        }

                      </p>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        </div>

      </section>


      {/* =================================================
                MAIN CONTENT
            ================================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">


        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">


          {/* FILTER SIDEBAR */}

          <div className="lg:col-span-1">


            <FilterSideBar
              setPriceRange={
                setPriceRange
              }
              priceRange={
                priceRange
              }
              minPrice={0}
              maxPrice={500000}
              step={5000}
              selectedRating={
                selectedRating
              }
              setSelectedRating={
                setSelectedRating
              }
              selectedKeywords={
                selectedKeywords
              }
              setSelectedKeywords={
                setSelectedKeywords
              }
            />

          </div>


          {/* PACKAGE LIST */}

          <div className="lg:col-span-3">


            {loading ? (

              <div className="py-20 text-center">
                <div className="w-12 h-12 border-4 border-[#2D1347] border-t-[#FF4FA3] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#2D1347] font-bold text-base">Loading packages...</p>
              </div>

            ) : filteredPackages.length ===
              0 ? (

              <div className="py-20 text-center text-gray-500">

                No packages found.

              </div>

            ) : (

              <PackageDetailsSection
                pkgs={
                  filteredPackages
                }
                onBook={
                  handleBookPackage
                }
              />

            )}

          </div>

        </div>


        {/* =============================================
                    TESTIMONIALS
                ============================================= */}

        <div className="mt-16">


          <Testimonials
            testimonials={
              testimonies
            }
            pkg={
              pkg
            }
          />

        </div>

      </div>


      {/* =================================================
                PRE FOOTER
            ================================================= */}

      <PreFooter
        title="Find Your Perfect Himalayan Adventure"
        description="Speak with our travel specialists to create your dream custom itinerary."
        btn1="Call Us Now"
        btn2="Request Custom Quote"
      />


      {/* =================================================
                BOOKING MODAL
            ================================================= */}

      <BookingModal
        pkg={selectedBookingPkg}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        pricingSource="package"
      />

    </div>
  );
};


export default Packages;