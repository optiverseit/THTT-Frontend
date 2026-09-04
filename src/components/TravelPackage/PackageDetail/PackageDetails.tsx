import React from "react";
import PackageImageGrid from "./PackageImageGrid";
import { Outlet, useParams } from "react-router-dom";
import { packages } from "../../../assets/data/mockData";
import PreFooter from "../../reuseable/PreFooter";

const PackageDetails: React.FC = () => {
  const { packageId } = useParams();

  const pkg = packages.find((p) => p.id === packageId) || packages[0];

  // Default image fallbacks for any package without complete gallery
  const defaultGallery = [
    pkg.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800",
  ];

  const gallery = pkg.gallery && pkg.gallery.length > 0 ? pkg.gallery : defaultGallery;

  // Detailed 6-Step Itinerary fallback
  const defaultItinerary = [
    {
      day: "1",
      title: "Hotel Pickup & Base Station Transfer",
      desc: "Enjoy comfortable private pickup directly from your hotel with scenic transfer to our activity briefing lounge.",
    },
    {
      day: "2",
      title: "Preparation & Safety Briefing",
      desc: "Meet with your certified tandem master, review wind conditions and safety protocols, and strap into safety gear.",
    },
    {
      day: "3",
      title: "Scenic Mountain Ascent to Launch Point",
      desc: "Drive up through scenic winding mountain roads to the launch vantage point with panoramic Himalayan vistas.",
    },
    {
      day: "4",
      title: `Main ${pkg.title} Experience`,
      desc: `Experience the exhilarating core adventure with professional guidance and live 4K GoPro video recording.`,
    },
    {
      day: "5",
      title: "Gentle Landing & Refreshment",
      desc: "Perform a safe, smooth touchdown at the lakeside landing zone followed by fresh refreshments.",
    },
    {
      day: "6",
      title: "Media Handover & Hotel Drop-off",
      desc: "Receive your high-definition aerial video footage and action photos directly on your device, with return hotel transfer.",
    },
  ];

  const allItenary =
    pkg.itinerary && pkg.itinerary.length > 0
      ? pkg.itinerary
      : defaultItinerary;

  const defaultIncludes = [
    "Certified English-speaking guide and expert instructor",
    "All essential safety equipment and gear rental",
    "Hotel pickup & drop-off within city center",
    "Complimentary action photos & 4K video recording",
    "Govt taxes and emergency first-aid kit",
  ];

  const defaultExcludes = [
    "Personal travel insurance (mandatory)",
    "Alcoholic beverages and personal snacks",
    "Tips & gratitude for instructor and crew",
    "Extra personal expenses not specified",
  ];

  const defaultRestrictions = [
    "Maximum weight limit: 110 kg (242 lbs)",
    "Minimum age requirement: 12 years with parental consent",
    "Not recommended for pregnant travelers or individuals with acute heart conditions",
  ];

  const defaultWhatToBring = [
    "Comfortable sports clothing and windproof jacket",
    "Sturdy running or hiking shoes",
    "UV protection sunglasses and sunscreen",
    "Valid government ID or passport copy",
  ];

  const defaultPricingTable = [
    {
      service: "Standard Experience",
      ageGroup: "Adult (16+)",
      priceNepali: "NPR 9,500",
      priceForeigner: pkg.price || "$85",
    },
    {
      service: "VIP Tandem + Media Pack",
      ageGroup: "All Ages",
      priceNepali: "NPR 12,500",
      priceForeigner: `$${(Number(pkg.price?.replace(/[^0-9]/g, "") || 85) * 1.3).toFixed(0)}`,
    },
    {
      service: "Student / Youth Special",
      ageGroup: "Youth (12-15)",
      priceNepali: "NPR 8,000",
      priceForeigner: `$${(Number(pkg.price?.replace(/[^0-9]/g, "") || 85) * 0.85).toFixed(0)}`,
    },
  ];

  const allIncludes = pkg.includes?.length ? pkg.includes : defaultIncludes;
  const allExcludes = pkg.excludes?.length ? pkg.excludes : defaultExcludes;
  const restrictions = pkg.restrictions?.length ? pkg.restrictions : defaultRestrictions;
  const whatToBring = pkg.whatToBring?.length ? pkg.whatToBring : defaultWhatToBring;
  const allfaqs = pkg.faqs?.length ? pkg.faqs : [];
  const allTestimonies = pkg.testimonies?.length ? pkg.testimonies : [];
  const pricingTable = pkg.pricingTable?.length ? pkg.pricingTable : defaultPricingTable;

  const enrichedPkg = {
    ...pkg,
    gallery,
    pricingTable,
  };

  return (
    <div className="w-full min-h-screen bg-[#FBFBFE] font-sans pt-0">
      {/* ── 100% FULL WIDTH IMAGE GALLERY MOSAIC ── */}
      <div className="w-full">
        <PackageImageGrid pkg={enrichedPkg} />
      </div>

      {/* ── TAB CONTENT OUTLET ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16">
        <Outlet
          context={{
            pkg: enrichedPkg,
            allItenary,
            allIncludes,
            allExcludes,
            restrictions,
            whatToBring,
            allfaqs,
            allTestimonies,
          }}
        />
      </div>

      {/* ── PREFOOTER ── */}
      <PreFooter
        title="Ready to Experience This Adventure?"
        description="Connect with our Himalayan travel specialists for tailored dates, group discounts, and custom arrangements."
        btn1="CALL US NOW"
        btn2="REQUEST CUSTOM QUOTE"
      />
    </div>
  );
};

export default PackageDetails;
