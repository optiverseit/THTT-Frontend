import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Package } from "../../assets/data/types";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import BookingModal from "../reusable/packages/BookingModal";
import DynamicFaqSection from "../reusable/DynamicFaqSection";
import { getPackageCategoryName } from "../../utils/categoryUtils";

// CHANGE THIS IMPORT PATH ONLY if your API file has a different location/name
import { getPackagesByCategory } from "../../api/BackendApi";

import {
  MapPin,
  Clock,
  Tag,
  CheckCircle2,
  ShieldCheck,
  Award,
  Camera,
  Car,
  Hotel,
  MessageCircle,
  Globe,
  CalendarCheck,
  ArrowUpRight,
} from "lucide-react";



const TOUR_FAQS = [
  {
    q: "Can our holiday tour itinerary be completely customized?",
    a: "Yes! Every tour package can be customized to match your schedule, preferred hotel category (from budget to 5-star heritage resorts), private vehicle choice, and specific sightseeing interests.",
  },
  {
    q: "What is included in the private transport during tours?",
    a: "We provide clean, air-conditioned private vehicles (Sedans, Scorpio 4x4 SUVs, Toyota Hiace vans, or luxury tourist coasters) with experienced, courteous chauffeurs covering all fuel, toll, and parking fees.",
  },
  {
    q: "Are monument entry fees and government permits covered?",
    a: "In all our full-board packages, entrance fees to UNESCO Heritage monuments, National Park entry tickets, and local permits are organized and included in advance so you can skip queues.",
  },
  {
    q: "Do you offer multi-lingual professional tour guides?",
    a: "Yes, our certified government-licensed tour guides speak English, Hindi, Nepali, French, German, Spanish, Japanese, and Chinese upon request for guided city excursions.",
  },
  {
    q: "How do we confirm our booking and what payment options are accepted?",
    a: "You can reserve your tour with a 20% advance deposit via bank transfer, eSewa, Khalti, or credit card. The balance can be paid prior to departure or upon arrival in Kathmandu.",
  },
];

export const ToursDetailContent: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(9);

  // API data
  const [tourPackages, setTourPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Booking
  const [selectedBookingTour, setSelectedBookingTour] =
    useState<Package | null>(null);

  const [isBookingModalOpen, setIsBookingModalOpen] =
    useState<boolean>(false);

  const {
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
  } = useGlobalCurrency();

  // =========================================================
  // FETCH TOURS FROM BACKEND
  // GET /packageByCategory?category=Tours
  // =========================================================
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPackagesByCategory("Tours");

        console.log("Tours API response:", response.data);

        /*
         * Laravel paginate response:
         *
         * {
         *   status: true,
         *   data: {
         *      current_page: 1,
         *      data: [...]
         *   }
         * }
         */

        const packages =
          response.data?.data?.data ??
          response.data?.data ??
          [];

        setTourPackages(
          Array.isArray(packages) ? packages : []
        );
      } catch (err: any) {
        console.error("Failed to fetch Tours:", err);

        setTourPackages([]);

        setError(
          err?.response?.data?.message ||
            "Unable to load tour packages."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // =========================================================
  // BOOK PACKAGE
  // If not logged in -> login
  // If logged in -> booking modal
  // =========================================================
  const handleBookTour = (tour: any) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: {
          from: "/service/tours",
          packageId: tour.id,
          openBooking: true,
        },
      });

      return;
    }

    setSelectedBookingTour(tour as Package);
    setIsBookingModalOpen(true);
  };

  // =========================================================
  // PRICE
  // Backend package.price is NPR
  // =========================================================
  const formatPackagePrice = (
    price?: string | number
  ) => {
    if (price === undefined || price === null || price === "") {
      return null;
    }

    const nprAmount = Number(price);

    if (Number.isNaN(nprAmount)) {
      return String(price);
    }

    return displayPrice(
      nprAmount,
      selectedCurrency,
      nprPerOneDollar,
      nprPerOneINR
    );
  };

  // =========================================================
  // FILTERS
  // =========================================================
  const filteredTours = tourPackages.filter((pkg) => {
    if (activeTab === "all") {
      return true;
    }

    /*
     * Your backend Package fields do not currently show a
     * domestic/international field in the API design you've
     * provided, so only apply these filters if such a value
     * actually exists.
     */
    if (activeTab === "domestic") {
      return (
        pkg.tour_type === "domestic" ||
        pkg.category_type === "domestic"
      );
    }

    if (activeTab === "international") {
      return (
        pkg.tour_type === "international" ||
        pkg.category_type === "international"
      );
    }

    if (activeTab === "featured") {
      return (
        pkg.is_featured === true ||
        pkg.is_featured === 1 ||
        pkg.is_featured === "1"
      );
    }

    return true;
  });

  const visibleTours = filteredTours.slice(
    0,
    visibleCount
  );

  const hasMore =
    visibleCount < filteredTours.length;

  // =========================================================
  // WHATSAPP INQUIRY
  // =========================================================
  const handleInquiry = (
    tourTitle: string,
    price?: string | number
  ) => {
    const formattedPrice =
      formatPackagePrice(price);

    const priceText = formattedPrice
      ? ` (${formattedPrice})`
      : "";

    const msg = encodeURIComponent(
      `Hello Trip Himalaya (Tours & Holidays Team)! I am interested in booking the "${tourTitle}"${priceText}. Please share details, day-by-day itinerary, and pricing.`
    );

    window.open(
      `https://api.whatsapp.com/send?phone=9779851403761&text=${msg}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <div className="py-16 text-center">
        <p className="text-[#2D1347] font-bold">
          Loading tour packages...
        </p>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================
  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-600 font-bold">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADER & FILTER PILLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight">
            Featured Holiday Itineraries
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            {
              id: "all",
              label: `All Tours (${tourPackages.length})`,
            },
            {
              id: "domestic",
              label: "Domestic Nepal",
            },
            {
              id: "international",
              label: "International Holidays",
            },
            {
              id: "featured",
              label: "Top Featured",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#2D1347] text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200/80 hover:bg-pink-50 hover:border-pink-300 hover:text-[#E11D48] shadow-2xs"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* PACKAGES GRID */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100">
        {visibleTours.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-bold text-gray-500">
              No tour packages found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTours.map((tour) => (
              <div
                key={tour.id}
                onClick={() =>
                  navigate(`/details/${tour.id}`)
                }
                className="bg-[#FBFBFE] rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#E11D48]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#E11D48] text-white shadow-md">
                        Tour
                      </span>

                      {(tour.is_featured === true ||
                        tour.is_featured === 1 ||
                        tour.is_featured === "1") && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-md">
                          Featured
                        </span>
                      )}
                    </div>

                    {tour.duration && (
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
                        <Clock
                          size={13}
                          className="text-pink-400"
                        />
                        <span>{tour.duration}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="text-lg sm:text-xl font-black text-[#2D1347] group-hover:text-[#E11D48] transition-colors leading-snug">
                        {tour.title}
                      </h4>

                      {tour.price && (
                        <span className="font-extrabold text-sm text-[#E11D48] whitespace-nowrap bg-pink-50 px-2.5 py-1 rounded-xl">
                          {formatPackagePrice(
                            tour.price
                          )}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-gray-500 mb-4">
                      {tour.location && (
                        <div className="flex items-center gap-1.5 min-w-0">
                          <MapPin
                            size={14}
                            className="text-[#E11D48] flex-shrink-0"
                          />
                          <span className="truncate">
                            {tour.location}
                          </span>
                        </div>
                      )}

                      <span className="inline-flex items-center gap-1 bg-pink-50 text-[#E11D48] px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-pink-100 flex-shrink-0">
                        <Tag size={11} className="flex-shrink-0" />
                        <span>{getPackageCategoryName(tour, "Tours")}</span>
                      </span>
                    </div>

                    {tour.description && (
                      <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-3 mb-6">
                        {tour.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-gray-100 mt-auto space-y-2.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        handleInquiry(
                          tour.title,
                          tour.price
                        );
                      }}
                      className="bg-[#2D1347] hover:bg-[#3B145C] text-white font-bold text-xs py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      <MessageCircle
                        size={14}
                        className="text-pink-400"
                      />

                      <span>Inquiry</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookTour(tour);
                      }}
                      className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-pink-900/20 cursor-pointer whitespace-nowrap"
                    >
                      <CalendarCheck size={14} />
                      <span>Book Now</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      navigate(
                        `/details/${tour.id}`
                      );
                    }}
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#2D1347] text-[#2D1347] hover:text-[#E11D48] font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Full Details</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() =>
                setVisibleCount(
                  (prev) => prev + 15
                )
              }
              className="px-10 py-3.5 bg-[#2D1347] hover:bg-[#3B145C] text-white font-bold text-sm rounded-2xl flex items-center gap-2.5 transition-all shadow-lg cursor-pointer"
            >
              <span>See More</span>

              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        )}
      </div>


      <DynamicFaqSection
        targetType="service"
        targetId="holiday-tours"
        defaultFaqs={TOUR_FAQS}
        title="Tours & Holiday FAQ"
        subtitle="Common questions answered by our holiday specialists"
      />

      <BookingModal
        pkg={selectedBookingTour}
        isOpen={isBookingModalOpen}
        onClose={() =>
          setIsBookingModalOpen(false)
        }
      />
    </div>
  );
};

export default ToursDetailContent;