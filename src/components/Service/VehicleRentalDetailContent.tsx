import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Package } from "../../assets/data/types";

import {
  useGlobalCurrency,
  displayPrice,
} from "../../context/CurrencyContext";

import FilterSideBar from "../TravelPackage/FilterSiderBar";
import PackageDetailsSection from "../TravelPackage/PackageDetailsSection";

import BookingModal, {
  BookingItem,
} from "../reusable/packages/BookingModal";

import DynamicFaqSection from "../reusable/DynamicFaqSection";

// Change this path only if your API file is located somewhere else
import { getAllVehicles } from "../../api/BackendApi";

import {
  ShieldCheck,
  Wind,
  Video,
  Gauge,
  AlertCircle,
  Sparkles,
} from "lucide-react";


// ============================================================
// BACKEND VEHICLE TYPE
// ============================================================

interface BackendVehicle {
  id: number | string;
  name?: string;
  title?: string;
  slug?: string;

  capacity?: number | string;
  type?: string;
  status?: string;

  price?: number | string;
  price_per_day?: number | string;
  pricePerDay?: number | string;

  image?: string;
  description?: string;
  location?: string;

  category?: string;
  categoryLabel?: string;

  best_for?: string;
  bestFor?: string;

  amenities?: string[];
  features?: string[];

  rating?: number;

  is_featured?: boolean | number;
  isFeatured?: boolean;
}


// ============================================================
// POPULAR ROUTES
// ============================================================

const POPULAR_ROUTES = [
  {
    route: "Kathmandu to Pokhara (One-Way)",
    distance: "200 km (6-7 hrs)",
    priceUSD: 95,
    popularVehicle: "Toyota HiAce or Sedan",
    stops:
      "Malekhu Fish Market, Trishuli Riverside, Bandipur Junction",
  },
  {
    route: "Kathmandu to Chitwan National Park",
    distance: "165 km (5-6 hrs)",
    priceUSD: 85,
    popularVehicle: "Private AC Sedan or 4x4 SUV",
    stops:
      "Mugling Junction, Narayanghat Bazar, Resort Gate Drop",
  },
  {
    route:
      "Kathmandu Valley Full Day Sightseeing (7 UNESCO Spots)",
    distance: "Full Day (8 hrs)",
    priceUSD: 50,
    popularVehicle: "Sedan / Scorpio SUV",
    stops:
      "Pashupatinath, Boudhanath, Swayambhu, Patan & Bhaktapur",
  },
  {
    route: "Kathmandu to Nagarkot Sunrise Return Trip",
    distance: "32 km (2 hrs drive)",
    priceUSD: 40,
    popularVehicle: "Comfort Sedan / SUV",
    stops:
      "Nagarkot View Tower, Bhaktapur Heritage Pause",
  },
  {
    route:
      "Pokhara to Muktinath / Jomsom (Off-Road 4x4)",
    distance: "175 km (8 hrs)",
    priceUSD: 180,
    popularVehicle: "Mahindra Scorpio 4WD Only",
    stops:
      "Tatopani Hot Springs, Rupse Waterfall, Marpha Apple Orchards",
  },
];


// ============================================================
// FAQ
// ============================================================

const VEHICLE_FAQS = [
  {
    q: "Is a professional chauffeur included in the rental price?",
    a: "Yes! All our vehicle rentals include a courteous, government-licensed professional chauffeur with extensive experience in Nepal's mountain highways. Chauffeur daily salary, meals, and overnight lodging allowance are 100% included with no hidden extras.",
  },
  {
    q: "Are fuel, road tolls, and driver allowances included in the price?",
    a: "Yes, 100%! All our quoted rental rates are completely all-inclusive: vehicle rental, experienced mountain chauffeur, all fuel costs, interstate highway tolls, parking charges, and complete driver lodging/meals.",
  },
  {
    q: "Can I rent a vehicle for self-drive in Nepal without a driver?",
    a: "Due to road conditions, steep mountain passes, and local regulations in Nepal, we strongly recommend and exclusively provide chauffeur-driven vehicles to guarantee maximum safety, smooth navigation, and zero liability for damages.",
  },
];


// ============================================================
// COMPONENT
// ============================================================

export const VehicleRentalDetailContent: React.FC = () => {

  const navigate = useNavigate();


  // ==========================================================
  // VEHICLE DATA
  // ==========================================================

  const [vehicles, setVehicles] =
    useState<BackendVehicle[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");


  // ==========================================================
  // FILTER STATES
  // ==========================================================

  const [activeTab, setActiveTab] =
    useState<string>("all");

  /*
   * 0 = no maximum price filter
   */
  const [priceRange, setPriceRange] =
    useState<number>(0);

  const [selectedRating, setSelectedRating] =
    useState<number>(0);

  const [selectedKeywords, setSelectedKeywords] =
    useState<string[]>([]);


  // ==========================================================
  // CURRENCY
  // ==========================================================

  const {
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
  } = useGlobalCurrency();


  // ==========================================================
  // BOOKING MODAL
  // ==========================================================

  const [
    selectedBookingItem,
    setSelectedBookingItem,
  ] = useState<BookingItem | null>(null);

  const [
    isBookingModalOpen,
    setIsBookingModalOpen,
  ] = useState(false);


  // ==========================================================
  // FETCH VEHICLES
  //
  // ONLY:
  // GET /vehicles
  //
  // NO /vehicles/{id}
  // ==========================================================

  useEffect(() => {

    const fetchVehicles = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await getAllVehicles();

        console.log(
          "Vehicles API response:",
          response.data
        );


        /*
         * Handles:
         *
         * {
         *   status: true,
         *   data: {
         *      current_page: 1,
         *      data: [...]
         *   }
         * }
         *
         * AND:
         *
         * {
         *   status: true,
         *   data: [...]
         * }
         */

        const vehicleData =
          response.data?.data?.data ??
          response.data?.data ??
          [];


        setVehicles(
          Array.isArray(vehicleData)
            ? vehicleData
            : []
        );

      } catch (err: any) {

        console.error(
          "Failed to fetch vehicles:",
          err
        );

        setVehicles([]);

        setError(
          err?.response?.data?.message ||
            "Unable to load vehicles."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchVehicles();

  }, []);


  // ==========================================================
  // FORMAT POPULAR ROUTE USD PRICE
  // ==========================================================

  const formatPrice = (
    usdAmount: number
  ) => {

    const nprAmount =
      usdAmount * nprPerOneDollar;

    return displayPrice(
      nprAmount,
      selectedCurrency,
      nprPerOneDollar,
      nprPerOneINR
    );
  };


  // ==========================================================
  // GET VEHICLE PRICE
  //
  // Supports different possible backend field names.
  // ==========================================================

  const getVehiclePrice = (
    vehicle: BackendVehicle
  ): number => {

    const value =
      vehicle.price ??
      vehicle.price_per_day ??
      vehicle.pricePerDay ??
      0;

    const parsed =
      Number(value);

    return Number.isNaN(parsed)
      ? 0
      : parsed;
  };


  // ==========================================================
  // KEYWORDS
  // ==========================================================

  const vehicleKeywords = [
    "4X4",
    "SUV",
    "SCORPIO",
    "PRADO",
    "HIACE",
    "VAN",
    "SEDAN",
    "COASTER",
    "CHAUFFEUR",
    "MOUNTAIN",
    "POKHARA",
    "MUKTINATH",
  ];


  // ==========================================================
  // CONVERT BACKEND VEHICLES TO PACKAGE FORMAT
  //
  // PackageDetailsSection expects Package[]
  // ==========================================================

  const vehiclePackages: Package[] =
    vehicles.map((vehicle) => {

      const price =
        getVehiclePrice(vehicle);

      const capacity =
        vehicle.capacity ?? "";

      const title =
        vehicle.name ||
        vehicle.title ||
        "Vehicle";

      const categoryLabel =
        vehicle.categoryLabel ||
        vehicle.type ||
        vehicle.category ||
        "Vehicle Rental";

      const bestFor =
        vehicle.best_for ||
        vehicle.bestFor ||
        vehicle.location ||
        "All Nepal Routes";


      return {
        id: vehicle.id,

        title,

        slug:
          vehicle.slug ||
          `vehicle-${vehicle.id}`,

        duration:
          capacity
            ? `Capacity: ${capacity}`
            : "Chauffeur Rental",

        highlights:
          vehicle.amenities ||
          vehicle.features ||
          [],

        /*
         * Vehicle price from backend.
         *
         * If your backend stores NPR, this is NPR.
         */
        price: String(price),

        image:
          vehicle.image || "",

        category:
          vehicle.type ||
          vehicle.category ||
          "vehicle",

        type: "activity",

        isFeatured: Boolean(
          vehicle.is_featured ??
          vehicle.isFeatured
        ),

        description:
          vehicle.description ||
          `${categoryLabel}${
            capacity
              ? ` with ${capacity} passenger capacity`
              : ""
          } and professional chauffeur service.`,

        location: bestFor,

        rating:
          vehicle.rating ?? 5,

        categoryLabel,

        priceUnit:
          "per day / trip",

      } as any;

    });


  // ==========================================================
  // FILTER VEHICLES
  // ==========================================================

  const filteredFleet =
    vehiclePackages.filter((pkg) => {

      const rawVehicle =
        vehicles.find(
          (vehicle) =>
            String(vehicle.id) ===
            String(pkg.id)
        );


      if (!rawVehicle) {
        return false;
      }


      // ------------------------------------------------------
      // 1. VEHICLE TYPE FILTER
      // ------------------------------------------------------

      if (activeTab !== "all") {

        const vehicleType =
          (
            rawVehicle.type ||
            rawVehicle.category ||
            ""
          ).toLowerCase();


        const vehicleName =
          (
            rawVehicle.name ||
            rawVehicle.title ||
            ""
          ).toLowerCase();


        if (activeTab === "suv") {

          const matches =
            vehicleType.includes("suv") ||
            vehicleType.includes("4x4") ||
            vehicleName.includes("suv") ||
            vehicleName.includes("scorpio") ||
            vehicleName.includes("prado") ||
            vehicleName.includes("4x4");

          if (!matches) {
            return false;
          }

        }


        if (activeTab === "van") {

          const matches =
            vehicleType.includes("van") ||
            vehicleType.includes("hiace") ||
            vehicleName.includes("van") ||
            vehicleName.includes("hiace");

          if (!matches) {
            return false;
          }

        }


        if (activeTab === "sedan") {

          const matches =
            vehicleType.includes("sedan") ||
            vehicleName.includes("sedan");

          if (!matches) {
            return false;
          }

        }


        if (activeTab === "bus") {

          const matches =
            vehicleType.includes("bus") ||
            vehicleType.includes("coaster") ||
            vehicleName.includes("bus") ||
            vehicleName.includes("coaster");

          if (!matches) {
            return false;
          }

        }

      }


      // ------------------------------------------------------
      // 2. PRICE FILTER
      //
      // 0 = don't filter by price
      // ------------------------------------------------------

      const priceNum =
        getVehiclePrice(rawVehicle);


      const matchesPrice =
        priceRange === 0 ||
        priceNum === 0 ||
        priceNum <= priceRange;


      // ------------------------------------------------------
      // 3. RATING FILTER
      // ------------------------------------------------------

      const rating =
        rawVehicle.rating ?? 5;


      const matchesRating =
        selectedRating === 0 ||
        Math.round(
          Number(rating)
        ) >= selectedRating;


      // ------------------------------------------------------
      // 4. KEYWORD FILTER
      // ------------------------------------------------------

      const matchesKeywords =
        selectedKeywords.length === 0
          ? true
          : selectedKeywords.some(
              (keyword) => {

                const kw =
                  keyword.toLowerCase();


                const name =
                  (
                    rawVehicle.name ||
                    rawVehicle.title ||
                    ""
                  ).toLowerCase();


                const type =
                  (
                    rawVehicle.type ||
                    rawVehicle.category ||
                    ""
                  ).toLowerCase();


                const description =
                  (
                    rawVehicle.description ||
                    ""
                  ).toLowerCase();


                const location =
                  (
                    rawVehicle.location ||
                    rawVehicle.best_for ||
                    rawVehicle.bestFor ||
                    ""
                  ).toLowerCase();


                const capacity =
                  String(
                    rawVehicle.capacity ??
                    ""
                  ).toLowerCase();


                const amenities =
                  rawVehicle.amenities ||
                  [];


                const features =
                  rawVehicle.features ||
                  [];


                return (
                  name.includes(kw) ||
                  type.includes(kw) ||
                  description.includes(kw) ||
                  location.includes(kw) ||
                  capacity.includes(kw) ||
                  amenities.some(
                    (item) =>
                      item
                        .toLowerCase()
                        .includes(kw)
                  ) ||
                  features.some(
                    (item) =>
                      item
                        .toLowerCase()
                        .includes(kw)
                  )
                );

              }
            );


      return (
        matchesPrice &&
        matchesRating &&
        matchesKeywords
      );

    });


  // ==========================================================
  // BOOK VEHICLE
  // ==========================================================

  const handleBookVehicle = (
    pkg: Package
  ) => {

    const token =
      localStorage.getItem("token");


    // --------------------------------------------------------
    // NOT LOGGED IN
    // --------------------------------------------------------

    if (!token) {

      navigate("/login", {

        state: {

          from:
            "/service/vehicle-rental",

          vehicleId:
            pkg.id,

          openBooking:
            true,

        },

      });


      return;
    }


    // --------------------------------------------------------
    // FIND VEHICLE FROM ALREADY FETCHED /vehicles DATA
    //
    // NO /vehicles/{id} API CALL
    // --------------------------------------------------------

    const rawVehicle =
      vehicles.find(
        (vehicle) =>
          String(vehicle.id) ===
          String(pkg.id)
      );


    const capacity =
      rawVehicle?.capacity ??
      pkg.duration;


    setSelectedBookingItem({

      id:
        pkg.id,

      title:
        pkg.title,

      location:
        `Capacity: ${capacity || "N/A"}`,

      duration:
        "Chauffeur Rental (Per Day / Trip)",

      price:
        pkg.price || "0",

      image:
        pkg.image,

    });


    setIsBookingModalOpen(true);

  };


  // ==========================================================
  // FULL DETAILS / WHATSAPP
  //
  // ALSO DOES NOT CALL /vehicles/{id}
  // ==========================================================

  const handleFullDetails = (
    pkg: Package
  ) => {

    const rawVehicle =
      vehicles.find(
        (vehicle) =>
          String(vehicle.id) ===
          String(pkg.id)
      );


    const price =
      rawVehicle
        ? getVehiclePrice(rawVehicle)
        : Number(pkg.price || 0);


    /*
     * Assuming backend vehicle price is NPR.
     */
    const priceFormatted =
      displayPrice(
        price,
        selectedCurrency,
        nprPerOneDollar,
        nprPerOneINR
      );


    const categoryLabel =
      rawVehicle?.categoryLabel ||
      rawVehicle?.type ||
      rawVehicle?.category ||
      "Rental";


    const msg =
      encodeURIComponent(

        `Hello Trip Himalaya! Please share full vehicle specifications, luggage capacity, photos, and all-inclusive rental terms for "${pkg.title}" (${categoryLabel}) at ${priceFormatted}/day.`

      );


    window.open(

      `https://wa.me/9779800000003?text=${msg}`,

      "_blank",

      "noopener,noreferrer"

    );

  };


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <div className="py-16 text-center">

        <p className="text-[#2D1347] font-bold">

          Loading vehicles...

        </p>

      </div>

    );

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {

    return (

      <div className="py-16 text-center">

        <p className="text-red-600 font-bold">

          {error}

        </p>

      </div>

    );

  }


  // ==========================================================
  // PAGE
  // ==========================================================

  return (

    <div className="space-y-12">


      {/* ==================================================== */}
      {/* HEADER & FILTER PILLS */}
      {/* ==================================================== */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">

        <div>

          <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight">

            Comfort &amp; 4WD Vehicles with Driver

          </h3>


          <p className="text-xs text-gray-500 font-medium mt-1">

            Choose a vehicle category or filter by daily rate,
            ratings, and vehicle tags below.

          </p>

        </div>


        {/* Filter Tabs */}

        <div className="flex flex-wrap gap-2">

          {[
            {
              id: "all",
              label:
                `All Vehicles (${vehicles.length})`,
            },
            {
              id: "suv",
              label: "4WD SUVs",
            },
            {
              id: "van",
              label: "HiAce Vans",
            },
            {
              id: "sedan",
              label: "Sedans",
            },
            {
              id: "bus",
              label: "Coasters",
            },
          ].map((tab) => (

            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id)
              }
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


      {/* ==================================================== */}
      {/* SIDEBAR + VEHICLE LIST */}
      {/* ==================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">


        {/* LEFT FILTER */}

        <div className="lg:col-span-1">

          <FilterSideBar
            setPriceRange={setPriceRange}
            priceRange={priceRange}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            selectedKeywords={selectedKeywords}
            setSelectedKeywords={setSelectedKeywords}
            customKeywords={vehicleKeywords}
          />

        </div>


        {/* RIGHT VEHICLES */}

        <div className="lg:col-span-3">

          {filteredFleet.length === 0 ? (

            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">

              <p className="font-bold text-gray-500">

                No vehicles found.

              </p>

            </div>

          ) : (

            <PackageDetailsSection
              pkgs={filteredFleet}
              onBook={handleBookVehicle}
              onDetails={handleFullDetails}
              priceUnit="per day / trip"
              itemsPerPage={12}
            />

          )}

        </div>

      </div>


      {/* ==================================================== */}
      {/* POPULAR ROUTES */}
      {/* ==================================================== */}

      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-100 shadow-sm">

        <span className="text-[#E11D48] font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs block mb-1">

          FIXED HIGHWAY FARES

        </span>


        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#2D1347] tracking-tight mb-4 sm:mb-6">

          Popular Tourist Route Fares
          (Fuel &amp; Driver Included)

        </h3>


        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs sm:text-sm">

            <thead>

              <tr className="border-b border-gray-200 text-[#2D1347] font-black text-[11px] uppercase tracking-wider">

                <th className="pb-3 pr-4">

                  Route &amp; Destination

                </th>

                <th className="pb-3 px-3">

                  Distance &amp; Time

                </th>

                <th className="pb-3 px-3">

                  Recommended Vehicle

                </th>

                <th className="pb-3 pl-3 text-right">

                  Fixed Rate

                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-gray-100">

              {POPULAR_ROUTES.map(
                (route, i) => (

                  <tr
                    key={i}
                    className="hover:bg-pink-50/30 transition-colors"
                  >

                    <td className="py-3.5 pr-4">

                      <strong className="text-[#2D1347] block font-extrabold">

                        {route.route}

                      </strong>


                      <span className="text-[11px] text-gray-500 font-medium">

                        Stops: {route.stops}

                      </span>

                    </td>


                    <td className="py-3.5 px-3 font-semibold text-gray-600 whitespace-nowrap">

                      {route.distance}

                    </td>


                    <td className="py-3.5 px-3 font-bold text-purple-900">

                      {route.popularVehicle}

                    </td>


                    <td className="py-3.5 pl-3 text-right">

                      <span className="font-black text-sm text-[#E11D48] bg-pink-50 px-3 py-1 rounded-xl inline-block">

                        {formatPrice(
                          route.priceUSD
                        )}

                      </span>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ==================================================== */}
      {/* VEHICLE SAFETY */}
      {/* ==================================================== */}

      <div className="bg-gradient-to-br from-[#2D1347] via-[#3B145C] to-[#2D1347] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl">

        <div className="max-w-3xl mb-6 sm:mb-8">

          <span className="text-[#FF4FA3] font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs block mb-1">

            SAFE &amp; COMFORTABLE TRAVEL

          </span>


          <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">

            Reliable Vehicles for Nepal's Roads

          </h3>


          <p className="text-gray-300 text-xs sm:text-sm mt-2 font-medium">

            Travel with professional drivers and
            well-maintained vehicles suitable for city,
            highway, and mountain routes.

          </p>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">

          {[
            {
              icon: ShieldCheck,
              title: "Professional Drivers",
              desc: "Experienced and licensed chauffeurs familiar with Nepal's highways and mountain roads.",
            },
            {
              icon: Gauge,
              title: "Regular Maintenance",
              desc: "Vehicles are routinely inspected and maintained before long-distance journeys.",
            },
            {
              icon: Wind,
              title: "Comfortable Travel",
              desc: "Comfortable passenger vehicles suitable for sightseeing, transfers, and longer road journeys.",
            },
            {
              icon: Video,
              title: "Tourist Friendly",
              desc: "Flexible stops for sightseeing, photography, meals, and rest breaks along the journey.",
            },
            {
              icon: AlertCircle,
              title: "Route Planning",
              desc: "Routes are planned according to road conditions, travel time, weather, and destination.",
            },
            {
              icon: Sparkles,
              title: "Multiple Vehicle Options",
              desc: "Choose from sedans, SUVs, vans, HiAce vehicles, and larger group transport options.",
            },
          ].map((item, idx) => {

            const Icon =
              item.icon;

            return (

              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10"
              >

                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] flex items-center justify-center text-white mb-3 shadow-md">

                  <Icon size={20} />

                </div>


                <h4 className="font-bold text-white text-sm mb-1">

                  {item.title}

                </h4>


                <p className="text-gray-300 text-xs leading-relaxed font-medium">

                  {item.desc}

                </p>

              </div>

            );

          })}

        </div>

      </div>


      {/* ==================================================== */}
      {/* FAQ */}
      {/* ==================================================== */}

      <DynamicFaqSection
        targetType="service"
        targetId="vehicle-rental"
        defaultFaqs={VEHICLE_FAQS}
        title="Vehicle Rental FAQ"
        subtitle="Important details regarding chauffeur services and highway routes"
      />


      {/* ==================================================== */}
      {/* BOOKING MODAL */}
      {/* ==================================================== */}

      <BookingModal
        pkg={selectedBookingItem}
        isOpen={isBookingModalOpen}
        onClose={() =>
          setIsBookingModalOpen(false)
        }
      />

    </div>

  );

};


export default VehicleRentalDetailContent;