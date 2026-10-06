import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, Outlet } from "react-router-dom";
import { getHotelById } from "../../api/BackendApi";
import HotelImageGrid from "./HotelImageGrid";
import PreFooter from "../reusable/PreFooter";
import { Compass } from "lucide-react";

const HotelPackageDetails: React.FC = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchHotel = async () => {
      if (!hotelId) {
        setError("Hotel not found.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const response = await getHotelById(hotelId);
        const data = response?.data?.data;
        if (!cancelled) {
          if (data) setHotel(data);
          else setError("Hotel not found.");
        }
      } catch (err) {
        console.error("Failed to load hotel:", err);
        if (!cancelled) {
          setHotel(null);
          setError("Hotel not found.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchHotel();
    return () => {
      cancelled = true;
    };
  }, [hotelId]);

  const detailData = useMemo(() => {
    if (!hotel) return null;

    const pricingTiers = Array.isArray(hotel.pricing_tiers)
      ? hotel.pricing_tiers
      : Array.isArray(hotel.pricingTiers)
      ? hotel.pricingTiers
      : [];

    const information = Array.isArray(hotel.information) ? hotel.information : [];
    const policies = Array.isArray(hotel.policies) ? hotel.policies : [];
    const faqs = Array.isArray(hotel.faqs) ? hotel.faqs : [];
    const testimonials = Array.isArray(hotel.testimonials) ? hotel.testimonials : [];
    const images = Array.isArray(hotel.images) ? hotel.images : [];

    const activePricingTiers = pricingTiers.filter((tier: any) => tier.status !== "INACTIVE");
    const activeInformation = information.filter((item: any) => item.status !== "INACTIVE");
    const activePolicies = policies.filter((item: any) => item.status !== "INACTIVE");
    const activeFaqs = faqs.filter((item: any) => item.status !== "INACTIVE");
    const activeTestimonials = testimonials.filter((item: any) => item.status !== "INACTIVE");
    const activeImages = images.filter((item: any) => item.status !== "INACTIVE");

    const getImageUrl = (image: any) =>
      image?.image_url ||
      image?.file_url ||
      image?.secure_url ||
      image?.url ||
      image?.image ||
      "";

    const primaryImage =
      activeImages.find((image: any) => image.is_primary) ||
      activeImages.find((image: any) => image.image_type === "COVER") ||
      activeImages[0];

    const image = getImageUrl(primaryImage);
    const gallery = activeImages.map((item: any) => getImageUrl(item)).filter(Boolean);

    const pricingTable = activePricingTiers.map((tier: any) => ({
      id: Number(tier.id),
      hotelId: Number(tier.hotel_id),
      service: tier.room_name || "Room",
      roomName: tier.room_name || "Room",
      roomCode: tier.room_code || "",
      description: tier.room_description || "",
      ageGroup: tier.pricing_unit === "PER_DAY" ? "Per Day / Per Room" : "Per Night / Per Room",
      priceNepali: String(Number(tier.price_npr || 0)),
      priceForeigner: String(Number(tier.price_npr || 0)),
      pricingUnit: tier.pricing_unit || "PER_NIGHT",
      maxGuests: Number(tier.max_guests || 1),
      maxAdults: tier.max_adults != null ? Number(tier.max_adults) : null,
      maxChildren: tier.max_children != null ? Number(tier.max_children) : null,
      bedType: tier.bed_type || "",
      roomSize: tier.room_size || "",
    }));

    const lowestTier = [...activePricingTiers]
      .filter((tier: any) => Number(tier.price_npr || 0) > 0)
      .sort((a: any, b: any) => Number(a.price_npr) - Number(b.price_npr))[0];

    const lowestPrice = Number(lowestTier?.price_npr || 0);

    const getInformation = (type: string) =>
      activeInformation
        .filter((item: any) => item.type === type)
        .sort((a: any, b: any) => Number(a.display_order || 0) - Number(b.display_order || 0))
        .map((item: any) => item.content)
        .filter(Boolean);

    const highlights = getInformation("HIGHLIGHT");
    const amenities = getInformation("AMENITY");
    const hotelIncludes = getInformation("INCLUSION");
    const hotelExcludes = getInformation("EXCLUSION");
    const hotelWhatToBring = getInformation("WHAT_TO_BRING");

    const hotelRestrictions = activePolicies
      .sort((a: any, b: any) => Number(a.display_order || 0) - Number(b.display_order || 0))
      .map((item: any) => item.content)
      .filter(Boolean);

    const formattedPolicies = activePolicies
      .sort((a: any, b: any) => Number(a.display_order || 0) - Number(b.display_order || 0))
      .map((item: any) => ({
        id: item.id,
        type: item.type,
        content: item.content,
        displayOrder: item.display_order || 0,
      }));

    const formattedFaqs = activeFaqs
      .sort((a: any, b: any) => Number(a.display_order || 0) - Number(b.display_order || 0))
      .map((item: any) => ({
        id: String(item.id),
        question: item.question,
        answer: item.answer,
      }));

    const formattedTestimonials = activeTestimonials
      .sort((a: any, b: any) => Number(a.display_order || 0) - Number(b.display_order || 0))
      .map((item: any) => ({
        id: String(item.id),
        name: item.guest_name,
        userName: item.guest_name,
        country: item.guest_country || "",
        location: item.guest_country || "",
        rating: Number(item.rating || 0),
        message: item.review,
        comment: item.review,
      }));

    const location = [hotel.address, hotel.city, hotel.country].filter(Boolean).join(", ");

    const pkg: any = {
      id: String(hotel.id),
      backendId: Number(hotel.id),
      hotelId: Number(hotel.id),
      title: hotel.hotel_name || "Hotel",
      name: hotel.hotel_name || "Hotel",
      hotelCode: hotel.hotel_code || "",
      slug: hotel.slug || String(hotel.id),
      duration: hotel.stay_type === "PER_DAY" ? "Per Day Stay" : "Per Night Stay",
      stayType: hotel.stay_type || "PER_NIGHT",
      location: location || hotel.city || "Nepal",
      address: hotel.address || "",
      city: hotel.city || "",
      country: hotel.country || "",
      price: String(lowestPrice),
      priceNPR: lowestPrice,
      lowestPriceNPR: lowestPrice,
      image,
      gallery,
      category: "domestic",
      type: "hotel",
      description: hotel.description || hotel.short_description || "",
      shortDescription: hotel.short_description || "",
      highlights: [...highlights, ...amenities],
      amenities,
      rating: Number(hotel.rating || 0),
      reviewsCount: activeTestimonials.length,
      pricingTable,
      availableFrom: hotel.available_from || null,
      availableTo: hotel.available_to || null,
      checkInTime: hotel.check_in_time || null,
      checkOutTime: hotel.check_out_time || null,
      isFeatured: Boolean(hotel.is_featured),
      roomTypes: pricingTable.map((tier: any) => tier.service),
    };

    const enrichedPkg = {
      ...pkg,
      allItenary: [],
      allIncludes: hotelIncludes,
      allExcludes: hotelExcludes,
      restrictions: hotelRestrictions,
      whatToBring: hotelWhatToBring,
      allfaqs: formattedFaqs,
      allTestimonies: formattedTestimonials,
      policies: formattedPolicies,
      highlightDetails: [],
    };

    return {
      enrichedPkg,
      hotelIncludes,
      hotelExcludes,
      hotelRestrictions,
      hotelWhatToBring,
      formattedFaqs,
      formattedTestimonials,
      formattedPolicies,
      pricingTable,
      highlights,
      amenities,
    };
  }, [hotel]);

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#E91E63] rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-500 mt-4">Loading hotel...</p>
      </div>
    );
  }

  if (error || !detailData) {
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

  const {
    enrichedPkg,
    hotelIncludes,
    hotelExcludes,
    hotelRestrictions,
    hotelWhatToBring,
    formattedFaqs,
    formattedTestimonials,
    formattedPolicies,
    pricingTable,
    highlights,
    amenities,
  } = detailData;

  return (
    <div className="w-full min-h-screen bg-[#FBFBFE] font-sans pt-14 sm:pt-16 md:pt-0 print:min-h-0 print:bg-white">
      <div className="w-full">
        <HotelImageGrid pkg={enrichedPkg} />
      </div>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-10 sm:pb-16 print:hidden">
        <Outlet
          context={{
            pkg: enrichedPkg,
            hotel: enrichedPkg,
            hotelId: enrichedPkg.hotelId,
            allItenary: [],
            allIncludes: hotelIncludes,
            allExcludes: hotelExcludes,
            restrictions: hotelRestrictions,
            whatToBring: hotelWhatToBring,
            allfaqs: formattedFaqs,
            allTestimonies: formattedTestimonials,
            policies: formattedPolicies,
            pricingTable,
            highlights,
            amenities,
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