import React from "react";
import { useParams, Link, Outlet } from "react-router-dom";
import { hotels, getHotelPricingTiers } from "../../assets/data/mockData";
import HotelImageGrid from "./HotelImageGrid";
import PreFooter from "../reusable/PreFooter";
import { Compass } from "lucide-react";

const HotelPackageDetails: React.FC = () => {
  const { hotelId } = useParams();

  const matchedHotel = hotels.find(
    (h) =>
      h.id.toLowerCase() === hotelId?.toLowerCase() ||
      h.slug.toLowerCase() === hotelId?.toLowerCase()
  );

  if (!matchedHotel) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center py-24 px-4 bg-gray-50 text-center font-sans">
        <div className="w-20 h-20 rounded-3xl bg-pink-50 text-[#E91E63] flex items-center justify-center mb-6 shadow-sm border border-pink-100 ring-8 ring-pink-50/50">
          <Compass size={40} />
        </div>
        <h2 className="text-3xl font-black text-[#2D1347]">Hotel Not Found</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-md">
          We couldn't find the requested hotel. Please browse all available hotels.
        </p>
        <div className="flex gap-3 mt-8">
          <Link to="/service/hotel-booking" className="px-6 py-3 bg-[#E91E63] hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all">
            View All Hotels
          </Link>
          <Link to="/" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full font-bold text-xs uppercase tracking-wider transition-all">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Price conversion: 1 USD = ~133 NPR (static seed; live rate used in CurrencyContext)
  const FALLBACK_USD_TO_NPR = 133;
  const basePriceNPR = Math.round(matchedHotel.priceUSD * FALLBACK_USD_TO_NPR);

  // Room tier pricing table — built from the shared getHotelPricingTiers() in mockData.
  // Edit tier names only in mockData.ts; this page updates automatically.
  const pricingTable = getHotelPricingTiers(matchedHotel).map((tier) => ({
    id: tier.id,
    service: tier.service,
    ageGroup: tier.ageGroup,
    priceNepali: String(Math.round(basePriceNPR * tier.priceMultiplier)),
    priceForeigner: String(Math.round(matchedHotel.priceUSD * tier.priceMultiplier)),
  }));

  const hotelIncludes = [
    "Daily breakfast for all registered guests",
    "24/7 front desk and concierge service",
    "Free high-speed Wi-Fi throughout property",
    "Complimentary welcome drink on arrival",
    "Access to hotel amenities (pool, gym, lounge)",
    "Airport/city transfer (subject to package selection)",
  ];

  const hotelExcludes = [
    "Lunch and dinner (unless specified in package)",
    "Personal laundry and dry-cleaning services",
    "Minibar and extra room service charges",
    "International phone calls",
    "Travel insurance (strongly recommended)",
    "Tips and gratuity for hotel staff",
  ];

  const hotelRestrictions = [
    "Valid government-issued photo ID or passport required at check-in",
    "Check-in from 2:00 PM; check-out by 12:00 PM noon",
    "Strictly no smoking inside rooms - designated smoking areas available",
    "Pets not permitted unless prior written approval is obtained",
  ];

  const hotelWhatToBring = [
    "Valid passport or national ID for verification",
    "Booking confirmation (printout or digital screenshot)",
    "Travel insurance policy documents",
    "Personal medications and toiletries",
  ];

  const pkg: any = {
    id: matchedHotel.id,
    title: matchedHotel.name,
    slug: matchedHotel.slug,
    duration: "Per Night Stay",
    location: matchedHotel.location || matchedHotel.city,
    price: String(basePriceNPR),
    image: matchedHotel.image,
    gallery: matchedHotel.gallery,
    category: "domestic",
    type: "activity",
    description: matchedHotel.description,
    highlights: [
      ...(matchedHotel.amenities || []),
      ...(matchedHotel.features || []),
    ],
    rating: matchedHotel.rating,
    reviewsCount: matchedHotel.reviewsCount,
    pricingTable,
  };

  const enrichedPkg = {
    ...pkg,
    allItenary: [],
    allIncludes: hotelIncludes,
    allExcludes: hotelExcludes,
    restrictions: hotelRestrictions,
    whatToBring: hotelWhatToBring,
    allfaqs: [],
    highlightDetails: [],
  };

  return (
    <div className="w-full min-h-screen bg-[#FBFBFE] font-sans pt-0 print:min-h-0 print:bg-white">
      <div className="w-full">
        <HotelImageGrid pkg={enrichedPkg} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16 print:hidden">
        <Outlet
          context={{
            pkg: enrichedPkg,
            allItenary: [],
            allIncludes: hotelIncludes,
            allExcludes: hotelExcludes,
            restrictions: hotelRestrictions,
            whatToBring: hotelWhatToBring,
            allfaqs: [],
            allTestimonies: [],
            pricingTable,
            highlights: pkg.highlights,
            highlightDetails: [],
          }}
        />
      </div>
      <div className="print:hidden">
        <PreFooter
          title="Ready to Book Your Stay?"
          description="Connect with our travel specialists for the best hotel deals, room upgrades, and custom arrangements."
          btn1="Call Us Now"
          btn2="Request Custom Quote"
        />
      </div>
    </div>
  );
};

export default HotelPackageDetails;
