import React from "react";
import { useParams, Link, Outlet } from "react-router-dom";
import { hotels } from "../../assets/data/mockData";
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

        <h2 className="text-3xl font-black text-[#2D1347]">
          Hotel Not Found
        </h2>

        <p className="text-gray-500 text-sm mt-2 max-w-md">
          We couldn't find the requested hotel. Please browse all available hotels.
        </p>

        <div className="flex gap-3 mt-8">
          <Link
            to="/service/hotel-booking"
            className="px-6 py-3 bg-[#E91E63] hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            View All Hotels
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


  // ============================================================
  // BUILD PKG SHAPE (same fields PackageImageGrid expects)
  // ============================================================

  const pkg: any = {
    id: matchedHotel.id,
    title: matchedHotel.name,
    slug: matchedHotel.slug,
    duration: "Per Night Stay",
    location: matchedHotel.location || matchedHotel.city,
    price: `$${matchedHotel.priceUSD}`,
    image: matchedHotel.image,
    gallery: matchedHotel.gallery,
    category: "domestic",
    type: "activity",
    description: matchedHotel.description,
    highlights: matchedHotel.amenities || matchedHotel.features || [],
    rating: matchedHotel.rating,
    reviewsCount: matchedHotel.reviewsCount,
  };

  const enrichedPkg = {
    ...pkg,
    pricingTable: [],
    allItenary: [],
    allIncludes: [],
    allExcludes: [],
    restrictions: [],
    whatToBring: [],
    allfaqs: [],
    highlightDetails: [],
  };

  return (
    <div className="w-full min-h-screen bg-[#FBFBFE] font-sans pt-0 print:min-h-0 print:bg-white">

      {/* ── HERO IMAGE GRID with hotel-specific nav tabs ── */}
      <div className="w-full">
        <HotelImageGrid pkg={enrichedPkg} />
      </div>

      {/* ── OUTLET: Overview / Policy / FAQ / Testimonial tabs ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16 print:hidden">
        <Outlet
          context={{
            pkg: enrichedPkg,
            allItenary: [],
            allIncludes: [],
            allExcludes: [],
            restrictions: [],
            whatToBring: [],
            allfaqs: [],
            allTestimonies: [],
            pricingTable: [],
            highlights: pkg.highlights,
            highlightDetails: [],
          }}
        />
      </div>

      {/* ── PRE FOOTER ── */}
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
