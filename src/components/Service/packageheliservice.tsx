/**
 * packageheliservice.tsx
 * -----------------------------------------------------------------
 * Helicopter Services Package Component.
 * Implements the exact same flow as available in Packages:
 *  - Filter sidebar (Price range, Ratings, Keywords)
 *  - Tour cards matching Image 1 (Image, Badge, Ratings, Details, Starting price, View Details, Book Now, Instant Inquiry)
 *  - Complete View Details page matching Image 2:
 *      - Top banner with title, badge, WhatsApp button, and Print/Save PDF export
 *      - Sub-navigation strip (OVERVIEW, POLICIES, FAQS, TESTIMONIES) + Starts From + Book Now
 *      - Trip Highlights
 *      - What's Included (teal green card)
 *      - What's Excluded (pink card)
 *      - Restrictions & Health (amber card with warning triangle)
 *      - What to Bring (pink card with essentials)
 *      - Dedicated heliservicepricemodel integration
 *  - Booking Submission Form Modal with CAAN weight declaration, document upload, and passenger manifest
 *  - Print Slip (voucher/receipt) with print trigger
 * -----------------------------------------------------------------
 */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  Users,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  AlertTriangle,
  ShoppingBag,
  Printer,
  MessageCircle,
  Plane,
  ChevronDown,
  ChevronUp,
  Check,
  Calendar,
  FileText,
  UploadCloud,
  Trash2,
  Receipt,
  Headphones,
  FileCheck,
  Luggage,
  HeartPulse,
  CloudSun,
  Filter,
  ArrowLeft,
  Share2,
} from "lucide-react";
import {
  useGlobalCurrency,
  formatNPR,
  formatUSD,
  formatINR,
  displayPrice,
} from "../../context/CurrencyContext";
import HeliServicePriceModel, { HeliTourData } from "./heliservicepricemodel";
import THTTLogo from "../../assets/images/THTTLogo.png";
import Logo from "../../assets/images/Logo.png";
import { COUNTRY_CODES, isoToFlag } from "../../utils/countrycodes";

// =============================================================================
// Comprehensive Helicopter Tours Data
// =============================================================================

export interface HeliPackageItem extends HeliTourData {
  category: "ebc" | "abc" | "langtang" | "pilgrimage" | "rescue";
  tag: string;
  image: string;
  gallery: string[];
  description: string;
  rating: number;
  reviewsCount: number;
  tripHighlights: string[];
  whatsIncluded: string[];
  whatsExcluded: string[];
  restrictionsAndHealth: string[];
  whatToBring: string[];
  policies: string[];
  faqs: Array<{ q: string; a: string }>;
  testimonies: Array<{ name: string; country: string; rating: number; comment: string; date: string }>;
}

export const HELI_PACKAGES: HeliPackageItem[] = [
  {
    id: "everest-base-camp-heli",
    title: "Everest Base Camp Helicopter Tour",
    slug: "everest-base-camp-heli",
    tag: "AIR ADVENTURE",
    location: "Kala Patthar / Everest Base Camp",
    duration: "4-5 Hours",
    maxAltitude: "5,545m (Kala Patthar)",
    rating: 5,
    reviewsCount: 342,
    charterPriceNPR: 696800,
    sharingPriceNPR: 184416,
    charterDesc:
      "Families, groups, creators, photographers, luxury travelers, and customized trips — Exclusive aircraft strictly for your group",
    sharingDesc:
      "Solo travelers, couples, and individual seats. Most cost-budget-friendly option — Per-person fare. Dates on seat availability",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=1200",
    ],
    description:
      "The ultimate Himalayan experience — a VIP helicopter flight to the foot of Mount Everest. Hover beside the world's highest peak, land at Kala Patthar (5,545m), and enjoy a panoramic breakfast above the clouds.",
    category: "ebc",
    tripHighlights: [
      "Aerial views of Mt. Everest (8,848m) & Lhotse",
      "Landing at Kala Patthar (5,545m)",
      "Namche Bazaar overflight",
      "Breakfast at Hotel Everest View (3,880m)",
      "CAAN-certified flight & oxygen onboard",
    ],
    whatsIncluded: [
      "Hotel pickup and drop-off in Kathmandu (private AC vehicle)",
      "Helicopter flight with CAAN certified high-altitude pilot",
      "Kala Patthar / EBC landing permit fees",
      "Sagarmatha National Park entry permit & local fees",
      "Emergency oxygen cylinder and first-aid kits onboard",
      "Breakfast at Hotel Everest View, Syangboche",
      "All airport taxes and government levies",
    ],
    whatsExcluded: [
      "Personal travel and high-altitude medical insurance",
      "Personal expenses, drinks, and gratuities",
    ],
    restrictionsAndHealth: [
      "Mandatory accurate body weight (kg) declaration at booking to comply with CAAN high-altitude weight & balance regulations",
      "Kala Patthar (5,545m) landing weight limit strictly restricted to max 240kg-250kg total payload (shuttle flights arranged if exceeded)",
      "Luggage allowance strictly limited to maximum 20 kg per passenger",
      "Medical clearance advised for travelers with acute cardiac conditions, severe COPD, or late pregnancy",
      "Passport copy or National ID must be submitted at least 24 hours in advance for flight security manifest",
    ],
    whatToBring: [
      "Original Passport or National Identity Card (Mandatory for airport security check)",
      "High-altitude travel insurance document with emergency helicopter evacuation coverage",
      "Warm windproof down jacket, thermal fleece layers, and warm woolen cap/beanie",
      "100% UV protection sunglasses (essential against Himalayan snow glare)",
      "Sunscreen (SPF 50+), lip balm with moisturizer, and personal medications",
      "Camera / smartphone with extra batteries (cold temperatures drain batteries quickly)",
    ],
    policies: [
      "Weather Delay Policy: Himalayan alpine weather is unpredictable. If weather grounds the flight, you receive a 100% full refund or free priority reschedule for the next available morning.",
      "Payload Safety Policy: In accordance with CAAN regulations, helicopters cannot land at 5,545m with more than 250kg payload. If group weight exceeds this threshold, a quick 2-shuttle hop from Pheriche is carried out at no extra surcharge to passengers.",
      "Cancellation Terms: Free cancellation up to 48 hours prior to scheduled departure. Cancellations within 24 hours incur a 15% administrative preparation fee.",
      "Health & Safety: All flights carry high-purity medical oxygen cylinders and pulse oximeters with HEMS-certified mountain pilots.",
    ],
    faqs: [
      {
        q: "How long do we stop at Kala Patthar?",
        a: "We land at Kala Patthar (5,545m) for approximately 10 to 15 minutes. This window provides ample time for breathtaking photographs without risking acute altitude sickness (AMS).",
      },
      {
        q: "Is breakfast at Hotel Everest View included?",
        a: "Yes! After the Kala Patthar touchdown, we fly down to Syangboche (3,880m) where a hot breakfast with freshly brewed coffee/tea is served on the world's highest hotel balcony overlooking Everest.",
      },
      {
        q: "What happens if the flight is delayed due to weather?",
        a: "Safety is our number one priority. Our operations team monitors real-time Lukla and Syangboche meteorological feeds. If weather is unfavorable, we will either wait for the weather window or reschedule you at zero charge, or issue a 100% full refund.",
      },
      {
        q: "Do I need prior mountain trekking experience?",
        a: "No trekking experience is needed! This helicopter tour is suitable for travelers of all ages, from young children to seniors.",
      },
    ],
    testimonies: [
      {
        name: "David Miller",
        country: "United Kingdom",
        rating: 5,
        comment:
          "Landing at Kala Patthar with Mount Everest right in front of us was the highlight of our entire Nepal holiday. The pilot was calm, courteous, and very experienced.",
        date: "September 2026",
      },
      {
        name: "Ananya Sharma",
        country: "India",
        rating: 5,
        comment:
          "Unbelievable experience! Breakfast at Hotel Everest View with clear blue skies and crisp mountain air. Highly recommended for families with elders.",
        date: "August 2026",
      },
      {
        name: "Elena Rostova",
        country: "Germany",
        rating: 5,
        comment:
          "Trip Himalaya managed everything smoothly — from the 5:30 AM hotel pickup in Kathmandu to the landing at Everest. Truly unforgettable!",
        date: "July 2026",
      },
    ],
  },
  {
    id: "annapurna-base-camp-heli",
    title: "Annapurna Base Camp Helicopter Tour",
    slug: "annapurna-base-camp-heli",
    tag: "AIR ADVENTURE",
    location: "Annapurna Sanctuary / Pokhara",
    duration: "2 Hours",
    maxAltitude: "4,130m (ABC)",
    rating: 5,
    reviewsCount: 218,
    charterPriceNPR: 385000,
    sharingPriceNPR: 85000,
    charterDesc:
      "Exclusive charter flight directly from Pokhara Airport into the heart of the 360-degree Annapurna mountain amphitheater.",
    sharingDesc:
      "Seat-in-helicopter shared departure from Pokhara. Daily morning flights during peak trekking seasons.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
    ],
    description:
      "Fly from scenic Pokhara Valley directly into the Annapurna Sanctuary amphitheater. Land at ABC (4,130m) surrounded by Annapurna I, Machapuchare (Fishtail), and Hiunchuli.",
    category: "abc",
    tripHighlights: [
      "Low-level flight over Phewa Lake and Pokhara Valley",
      "30-minute ground landing at Annapurna Base Camp (4,130m)",
      "Close-up views of Mount Machapuchare (Fishtail) and Annapurna South",
      "Hot tea/coffee at base camp mountain lodge",
      "CAAN-certified mountain pilot & onboard oxygen",
    ],
    whatsIncluded: [
      "Pickup and drop-off from Pokhara lakeside hotels",
      "Scenic helicopter flight to Annapurna Base Camp & return",
      "Annapurna Conservation Area Project (ACAP) permit fees",
      "Ground landing time at ABC (approx. 30 mins)",
      "All airport taxes and handling fees",
    ],
    whatsExcluded: [
      "Personal travel insurance with emergency heli rescue",
      "Breakfast/meals at base camp",
      "Personal expenses and tips",
    ],
    restrictionsAndHealth: [
      "Accurate passenger weight declaration required at check-in",
      "Warm down jacket and UV sunglasses recommended",
      "Safe for all ages without extreme medical restrictions",
    ],
    whatToBring: [
      "Original Passport / National ID card",
      "Warm windbreaker or down jacket",
      "Camera / phone with full battery",
      "Sunglasses and sunscreen",
    ],
    policies: [
      "100% refund in case of inclement weather cancellation in Pokhara.",
      "Maximum 5 passengers per flight or 420kg total passenger payload.",
    ],
    faqs: [
      {
        q: "Where does this flight take off from?",
        a: "This tour departs from Pokhara Airport. We provide complimentary pickup from your hotel in Lakeside Pokhara.",
      },
      {
        q: "How long is the flight from Pokhara to ABC?",
        a: "The flight takes approximately 18 to 20 minutes each way, with 30 minutes on the ground at the base camp.",
      },
    ],
    testimonies: [
      {
        name: "Saurav Joshi",
        country: "Nepal",
        rating: 5,
        comment:
          "The views of Fishtail from the helicopter were breathtaking. Within 25 minutes of leaving Pokhara we were standing in snow at ABC!",
        date: "September 2026",
      },
    ],
  },
  {
    id: "langtang-valley-heli",
    title: "Langtang Valley & Kyanjin Gompa Heli Tour",
    slug: "langtang-valley-heli",
    tag: "AIR ADVENTURE",
    location: "Kyanjin Gompa / Langtang Valley",
    duration: "2 Hours",
    maxAltitude: "3,870m (Kyanjin)",
    rating: 5,
    reviewsCount: 164,
    charterPriceNPR: 320000,
    sharingPriceNPR: 75000,
    charterDesc:
      "Short, dramatic flight north of Kathmandu into the serene Langtang Himalayan valley and famous yak cheese factory village.",
    sharingDesc:
      "Cost-effective shared seat tour departing from Kathmandu Domestic Airport.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    ],
    description:
      "The closest alpine helicopter escape from Kathmandu. Land at Kyanjin Gompa (3,870m) beneath Langtang Lirung, explore the ancient monastery, and sample fresh Himalayan yak cheese.",
    category: "langtang",
    tripHighlights: [
      "Quick 25-minute flight from Kathmandu over pine valleys",
      "45-minute landing at Kyanjin Gompa (3,870m)",
      "Visit ancient Buddhist monastery & traditional Swiss-heritage Yak Cheese factory",
      "Spectacular vistas of Langtang Lirung (7,227m) and Ganesh Himal",
    ],
    whatsIncluded: [
      "Hotel pickup and drop-off in Kathmandu",
      "Return helicopter flight Kathmandu - Kyanjin Gompa",
      "Langtang National Park entry permit",
      "Airport passenger tax",
    ],
    whatsExcluded: ["Food and beverages at Kyanjin", "Personal expenses"],
    restrictionsAndHealth: [
      "Standard CAAN weight declaration at booking",
      "Warm layers recommended as temperatures at Kyanjin can be cold in mornings",
    ],
    whatToBring: ["ID card / passport copy", "Warm jacket", "Sunglasses", "Camera"],
    policies: ["Free weather rescheduling or 100% full refund."],
    faqs: [
      {
        q: "Can we visit the cheese factory?",
        a: "Yes! The local government Yak Cheese production facility is a short 3-minute stroll from the helipad at Kyanjin.",
      },
    ],
    testimonies: [
      {
        name: "Chloe Dupont",
        country: "France",
        rating: 5,
        comment:
          "Short and peaceful tour! We had breakfast in Kathmandu, flew to Kyanjin for coffee and cheese tasting with snow mountains all around, and were back by lunch.",
        date: "August 2026",
      },
    ],
  },
  {
    id: "gosaikunda-lake-heli",
    title: "Gosaikunda Holy Lake Helicopter Tour",
    slug: "gosaikunda-lake-heli",
    tag: "PILGRIMAGE & SCENIC",
    location: "Gosaikunda Sacred Lakes, Rasuwa",
    duration: "1.5 Hours",
    maxAltitude: "4,380m (Holy Lake)",
    rating: 5,
    reviewsCount: 185,
    charterPriceNPR: 290000,
    sharingPriceNPR: 65000,
    charterDesc:
      "Dedicated charter for sacred pooja, family holy darshan, and breathtaking alpine photography.",
    sharingDesc:
      "Shared seats available on auspicious Hindu & Buddhist festival dates and peak weekends.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    ],
    description:
      "A revered Hindu and Buddhist high-altitude pilgrimage. Fly from Kathmandu directly to the glacial alpine waters of Gosaikunda Lake (4,380m) dedicated to Lord Shiva.",
    category: "pilgrimage",
    tripHighlights: [
      "Swift 15-minute flight from Kathmandu airport",
      "30-minute sacred holy darshan and pooja at Gosaikunda Lake",
      "Surrounded by snowy peaks of Ganesh Himal and Langtang range",
      "Ideal for elderly devotees unable to undertake the 5-day strenuous trek",
    ],
    whatsIncluded: [
      "Kathmandu hotel transfers",
      "Return helicopter flight",
      "Langtang National Park permit",
      "Airport security and ground fees",
    ],
    whatsExcluded: ["Temple offerings and pooja materials", "Personal expenses"],
    restrictionsAndHealth: [
      "Mandatory body weight declaration",
      "Warm woolen clothing required as lake altitude can reach near freezing in early morning",
    ],
    whatToBring: ["ID card/Passport", "Warm down jacket", "Pooja supplies (optional)"],
    policies: ["Full refund for weather cancellations."],
    faqs: [
      {
        q: "Is there time to perform a quick pooja and holy water dip?",
        a: "Yes, the 30-minute ground stop provides ample time to offer prayers, take holy water, and capture photos.",
      },
    ],
    testimonies: [
      {
        name: "Rameshwar Prasad",
        country: "India",
        rating: 5,
        comment:
          "Took my elderly parents for Gosaikunda darshan. The helicopter landed right beside the lake. Blessed experience!",
        date: "July 2026",
      },
    ],
  },
  {
    id: "muktinath-temple-heli",
    title: "Muktinath VIP Helicopter Pilgrimage",
    slug: "muktinath-temple-heli",
    tag: "VIP PILGRIMAGE",
    location: "Mustang / Muktinath (3,710m)",
    duration: "3 Hours",
    maxAltitude: "3,710m (Muktinath)",
    rating: 5,
    reviewsCount: 198,
    charterPriceNPR: 520000,
    sharingPriceNPR: 120000,
    charterDesc:
      "VIP private charter flight directly into Mustang valley with 1.5-hour priority ground stop for 108 water sprouts bath and Vishnu darshan.",
    sharingDesc:
      "Shared seat availability departing from Pokhara or Kathmandu for pilgrims.",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    ],
    description:
      "The sacred shrine of liberation (Moksha Kshetra). Fly past the Kali Gandaki gorge, Annapurna, and Dhaulagiri directly to Muktinath in Mustang.",
    category: "pilgrimage",
    tripHighlights: [
      "Deep gorge flight between Dhaulagiri (8,167m) and Annapurna (8,091m)",
      "1.5 hours ground time at Muktinath Temple for pooja and holy bath",
      "Holy 108 water sprouts (Muktidhara) and sacred Jwala Mai eternal flame",
      "Horse / pony ride or private jeep shuttle from helipad to temple",
    ],
    whatsIncluded: [
      "Kathmandu or Pokhara airport transfers",
      "Charter or shared seat helicopter flight",
      "Annapurna Conservation Area Project & TIMS permits",
      "Helipad to temple transfer coordination",
    ],
    whatsExcluded: ["Donations and pooja dakshina", "Personal shopping"],
    restrictionsAndHealth: [
      "Weight declaration required",
      "Bring comfortable walking shoes or request horse ride at helipad",
    ],
    whatToBring: ["ID card/Passport", "Warm clothes", "Dry clothes if taking 108 sprouts bath"],
    policies: ["100% weather guarantee policy."],
    faqs: [
      {
        q: "Is it easy for senior citizens to reach the temple from the helipad?",
        a: "Yes, horses/ponies and local jeeps are stationed right at the helipad to escort seniors directly to the temple gates.",
      },
    ],
    testimonies: [
      {
        name: "Smt. K. Venkataraman",
        country: "India",
        rating: 5,
        comment:
          "Muktinath darshan was a lifelong dream accomplished in total comfort. Trip Himalaya arranged everything seamlessly.",
        date: "September 2026",
      },
    ],
  },
  {
    id: "medical-rescue-heli",
    title: "24/7 Himalayan Emergency Medical Rescue",
    slug: "medical-rescue-heli",
    tag: "EMERGENCY STANDBY",
    location: "All Nepal Mountain Regions (Up to 6,000m)",
    duration: "Immediate Dispatch",
    maxAltitude: "6,000m+ (Oxygen & Doctor)",
    rating: 5,
    reviewsCount: 450,
    charterPriceNPR: 450000,
    sharingPriceNPR: 450000,
    charterDesc:
      "Immediate VIP emergency dispatch with onboard HEMS flight doctor, medical oxygen, and direct ambulance handover to CIWEC / Mediciti hospital.",
    sharingDesc:
      "Immediate dedicated aircraft dispatch. Cashless insurance coordination handled.",
    image:
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200",
    ],
    description:
      "Round-the-clock emergency medical evacuation service across Everest, Annapurna, Manaslu, and remote trekking regions. Coordination with global travel insurance agencies.",
    category: "rescue",
    tripHighlights: [
      "45-minute rapid takeoff from Kathmandu/Lukla/Pokhara upon notification",
      "HEMS-certified pilots and high-altitude emergency medics",
      "Continuous oxygen support, vital monitoring, and spinal stretchers onboard",
      "Direct tarmac transfer to waiting ICU ambulance in Kathmandu",
    ],
    whatsIncluded: [
      "Emergency helicopter flight dispatch",
      "High-altitude oxygen cylinders & medical kit onboard",
      "Insurance verification & hospital liaison",
      "Kathmandu airport tarmac ambulance coordination",
    ],
    whatsExcluded: ["Hospital admission costs", "Medicine costs at hospital"],
    restrictionsAndHealth: [
      "Provide exact GPS coordinates or tea-house location and patient symptoms",
    ],
    whatToBring: ["Insurance policy number", "Passport copy", "Doctor fit to fly note (if available)"],
    policies: [
      "Immediate dispatch upon insurance guarantee of payment (GOP) or advance card guarantee.",
    ],
    faqs: [
      {
        q: "Do you coordinate with international insurance companies?",
        a: "Yes, we work directly with Allianz, AXA, World Nomads, Bupa, Global Rescue, Ripcord, and all major global insurers.",
      },
    ],
    testimonies: [
      {
        name: "Markus Weber",
        country: "Switzerland",
        rating: 5,
        comment:
          "Suffered from severe HAPE near Lobuche. Trip Himalaya had the helicopter on ground within 40 minutes and landed me directly at CIWEC hospital. They saved my life.",
        date: "May 2026",
      },
    ],
  },
];

// =============================================================================
// Main PackageHeliService Component
// =============================================================================

export const PackageHeliService: React.FC = () => {
  const {
    selectedCurrency,
    setSelectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
  } = useGlobalCurrency();

  const navigate = useNavigate();
  const { tourId } = useParams<{ tourId?: string }>();
  const [searchParams] = useSearchParams();
  const routeTourId = tourId || searchParams.get("tour");

  // Read URL search params for heli route/flightType filtering
  const urlRoute = searchParams.get("route") || "";
  const urlFlightType = searchParams.get("flightType") || "";

  // Determine active tour from URL (dedicated Details Page route: /service/heli-services/:tourId)
  const selectedTour = routeTourId
    ? HELI_PACKAGES.find(
        (t) =>
          t.id.toLowerCase() === routeTourId.toLowerCase() ||
          t.slug?.toLowerCase() === routeTourId.toLowerCase()
      ) || HELI_PACKAGES[0]
    : null;

  const startsFromDisplayPrice = selectedTour
    ? displayPrice(
        selectedTour.sharingPriceNPR,
        selectedCurrency,
        nprPerOneDollar,
        nprPerOneINR
      )
    : "";

  const rateUSD = nprPerOneDollar || 133;
  const printCharterPriceNPR = selectedTour?.charterPriceNPR || 385000;
  const printSharingPriceNPR = selectedTour?.sharingPriceNPR || 85000;
  const printCharterPriceUSD = Math.round(printCharterPriceNPR / rateUSD);
  const printSharingPriceUSD = Math.round(printSharingPriceNPR / rateUSD);
  const printVipPriceNPR = Math.round(printSharingPriceNPR * 1.15);
  const printVipPriceUSD = Math.round(printSharingPriceUSD * 1.15);

  const heliItineraryList = [
    { phase: "Phase 1", title: "Private Hotel Pickup & Airport Transfer", desc: "Private vehicle transfer from your hotel to the domestic airport helicopter terminal. Check-in, passenger weighing & CAAN flight manifest clearance." },
    { phase: "Phase 2", title: "Captain Safety Briefing & Boarding", desc: "Meet your CAAN-certified alpine captain. Comprehensive briefing on headsets, emergency oxygen protocols, and high-altitude flight safety." },
    { phase: "Phase 3", title: `Scenic Helicopter Flight to ${selectedTour?.location || "Alpine Destination"}`, desc: "Take off and enjoy breathtaking aerial views of Himalayan massifs, deep valleys, and alpine rivers from panoramic window seats." },
    { phase: "Phase 4", title: "Alpine Ground Landing & Photography", desc: `Land at ${selectedTour?.maxAltitude ? `${selectedTour.location} (${selectedTour.maxAltitude})` : (selectedTour?.location || "Alpine Base")}. Savor 30-45 minutes of ground time for photography, fresh mountain air, and tea/coffee.` },
    { phase: "Phase 5", title: "Return Scenic Flight & Hotel Drop-off", desc: "Scenic return flight with aerial panorama of snow-capped peaks. Touchdown and private transfer back to your hotel." },
  ];

  // Active Tab in Details Page: "OVERVIEW" | "POLICIES" | "FAQS" | "TESTIMONIES"
  const [activeDetailTab, setActiveDetailTab] = useState<
    "OVERVIEW" | "POLICIES" | "FAQS" | "TESTIMONIES"
  >("OVERVIEW");

  // Filter States for Cards Listing
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(800000);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingTour, setBookingTour] = useState<HeliPackageItem | null>(null);
  const [bookingFlightOption, setBookingFlightOption] = useState<"charter" | "sharing">("charter");
  const [bookingSeatCount, setBookingSeatCount] = useState<number>(1);
  const [activeApplicantIndex, setActiveApplicantIndex] = useState<number>(0);
  const [bookingTotalPriceNPR, setBookingTotalPriceNPR] = useState<number>(696800);

  // Submission / Print Slip State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionId, setSubmissionId] = useState<string>("");
  const [submittedAt, setSubmittedAt] = useState<string>("");
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Booking Applicant Interface
  interface HeliApplicant {
    fullName: string;
    nationality: string;
    idNumber: string;
    bodyWeightKg: string;
    luggageKg: string;
    email: string;
    phoneCode: string;
    phone: string;
    preferredDate: string;
    pickupHotel: string;
    passportFile?: File | null;
    photoFile?: File | null;
    flightFile?: File | null;
    hotelFile?: File | null;
    insuranceFile?: File | null;
  }

  // Booking Form Fields
  const [bookingFormData, setBookingFormData] = useState({
    fullName: "",
    email: "",
    phoneCode: "+977",
    phone: "",
    nationality: "",
    preferredDate: "",
    reserveDate: "",
    idNumber: "",
    pickupHotel: "",
    specialRequirements: "",
    bodyWeightKg: "",
    luggageKg: "",
    termsAgreed: false,
    applicants: [
      {
        fullName: "",
        nationality: "",
        idNumber: "",
        bodyWeightKg: "",
        luggageKg: "",
        email: "",
        phoneCode: "+977",
        phone: "",
        preferredDate: "",
        pickupHotel: "",
        passportFile: null,
        photoFile: null,
        flightFile: null,
        hotelFile: null,
        insuranceFile: null,
      },
    ] as HeliApplicant[],
  });

  // Booking Form Errors State
  interface HeliFormErrors {
    [key: string]: string | undefined;
  }
  const [formErrors, setFormErrors] = useState<HeliFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const validateHeliField = (name: string, value: any): string | undefined => {
    switch (name) {
      case "fullName":
        if (!value || !String(value).trim()) return "Full name is required (as per passport/NID)";
        if (String(value).trim().length < 2) return "Name must be at least 2 characters";
        return undefined;
      case "email":
        if (!value || !String(value).trim()) return "Email address is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim()))
          return "Please enter a valid email address";
        return undefined;
      case "phone":
        if (!value || !String(value).trim()) return "WhatsApp phone number is required";
        const cleanPhone = String(value).replace(/[\s\-()]/g, "");
        if (!/^\d{6,15}$/.test(cleanPhone)) return "Enter a valid phone number (6-15 digits)";
        return undefined;
      case "nationality":
        if (!value || !String(value).trim()) return "Nationality is required";
        if (String(value).trim().length < 2) return "Please enter a valid nationality";
        return undefined;
      case "preferredDate":
        if (!value) return "Preferred flight date is required";
        const selected = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) return "Flight date cannot be in the past";
        return undefined;
      case "reserveDate":
        if (value && bookingFormData.preferredDate) {
          const pref = new Date(bookingFormData.preferredDate);
          const res = new Date(value);
          if (res < pref) return "Backup date cannot be earlier than preferred flight date";
        }
        return undefined;
      case "bodyWeightKg":
        if (value === "" || value === null || value === undefined)
          return "Approximate body weight is mandatory for flight safety";
        const num = Number(value);
        if (isNaN(num) || num < 20 || num > 160)
          return "Weight must be between 20 kg and 160 kg";
        return undefined;
      case "luggageKg":
        if (value === "" || value === null || value === undefined) return undefined;
        const lugNum = Number(value);
        if (isNaN(lugNum)) return "Please enter a valid luggage weight in kg";
        if (lugNum < 0) return "Luggage weight cannot be negative";
        const maxLuggage = (bookingSeatCount || 1) * 20;
        if (lugNum > maxLuggage) {
          return bookingSeatCount > 1
            ? `Luggage cannot exceed 20 kg per person (max ${maxLuggage} kg for ${bookingSeatCount} passengers)`
            : "Luggage cannot exceed 20 kg per person";
        }
        return undefined;
      case "idNumber":
        if (!value || !String(value).trim()) return "Passport or National ID is required";
        if (String(value).trim().length < 4) return "ID number must be at least 4 characters";
        return undefined;
      case "pickupHotel":
        return undefined;
      case "termsAgreed":
        if (!value) return "You must declare accuracy and accept flight regulations";
        return undefined;
      default:
        return undefined;
    }
  };

  const validateApplicantField = (
    field: keyof HeliApplicant,
    value: any,
    index: number
  ): string | undefined => {
    const label = `Applicant ${index + 1}`;
    switch (field) {
      case "fullName":
        if (!value || !String(value).trim())
          return `${label}: Full name is required`;
        if (String(value).trim().length < 2)
          return `${label}: Name must be at least 2 characters`;
        return undefined;
      case "nationality":
        if (!value || !String(value).trim())
          return `${label}: Nationality is required`;
        if (String(value).trim().length < 2)
          return `${label}: Please enter valid nationality`;
        return undefined;
      case "idNumber":
        if (!value || !String(value).trim())
          return `${label}: Passport or NID number is required`;
        if (String(value).trim().length < 4)
          return `${label}: ID must be at least 4 characters`;
        return undefined;
      case "bodyWeightKg":
        if (value === "" || value === null || value === undefined)
          return `${label}: Weight declaration is mandatory for flight safety`;
        const weightNum = Number(value);
        if (isNaN(weightNum) || weightNum < 20 || weightNum > 160)
          return `${label}: Weight must be between 20 kg and 160 kg`;
        return undefined;
      case "luggageKg":
        if (value === "" || value === null || value === undefined) return undefined;
        const lugNum = Number(value);
        if (isNaN(lugNum)) return `${label}: Please enter a valid luggage weight in kg`;
        if (lugNum < 0) return `${label}: Luggage weight cannot be negative`;
        if (lugNum > 20) return `${label}: Luggage cannot exceed 20 kg per person`;
        return undefined;
      case "email":
        if (!value || !String(value).trim())
          return `${label}: Email address is required`;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim()))
          return `${label}: Please enter a valid email address`;
        return undefined;
      case "phone":
        if (!value || !String(value).trim())
          return `${label}: WhatsApp phone number is required`;
        const cleanPhone = String(value).replace(/[\s\-()]/g, "");
        if (!/^\d{6,15}$/.test(cleanPhone))
          return `${label}: Enter a valid phone number (6-15 digits)`;
        return undefined;
      case "preferredDate":
        if (!value) return `${label}: Preferred flight date is required`;
        const selected = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) return `${label}: Flight date cannot be in the past`;
        return undefined;
      case "pickupHotel":
        return undefined;
      default:
        return undefined;
    }
  };

  const handleApplicantDocChange = (
    index: number,
    docType: "passportFile" | "photoFile" | "flightFile" | "hotelFile" | "insuranceFile",
    file: File | null
  ) => {
    setBookingFormData((prev) => {
      const updated = [...(prev.applicants || [])];
      while (updated.length <= index) {
        updated.push({
          fullName: "",
          nationality: "",
          idNumber: "",
          bodyWeightKg: "",
          luggageKg: "",
          email: "",
          phoneCode: "+977",
          phone: "",
          preferredDate: "",
          pickupHotel: "",
          passportFile: null,
          photoFile: null,
          flightFile: null,
          hotelFile: null,
          insuranceFile: null,
        });
      }
      updated[index] = { ...updated[index], [docType]: file };
      return { ...prev, applicants: updated };
    });
  };

  const handleApplicantChange = (
    index: number,
    field: keyof HeliApplicant,
    value: any
  ) => {
    setBookingFormData((prev) => {
      const updated = [...(prev.applicants || [])];
      while (updated.length <= index) {
        updated.push({
          fullName: "",
          nationality: "",
          idNumber: "",
          bodyWeightKg: "",
          luggageKg: "",
          email: "",
          phoneCode: "+977",
          phone: "",
          preferredDate: "",
          pickupHotel: "",
          passportFile: null,
          photoFile: null,
          flightFile: null,
          hotelFile: null,
          insuranceFile: null,
        });
      }
      updated[index] = { ...updated[index], [field]: value };

      const syncExtra: Partial<typeof prev> = {};
      if (index === 0) {
        if (field === "fullName") syncExtra.fullName = value;
        if (field === "nationality") syncExtra.nationality = value;
        if (field === "idNumber") syncExtra.idNumber = value;
        if (field === "bodyWeightKg") syncExtra.bodyWeightKg = value;
        if (field === "luggageKg") syncExtra.luggageKg = value;
        if (field === "email") syncExtra.email = value;
        if (field === "phoneCode") syncExtra.phoneCode = value;
        if (field === "phone") syncExtra.phone = value;
        if (field === "preferredDate") syncExtra.preferredDate = value;
        if (field === "pickupHotel") syncExtra.pickupHotel = value;
      }
      return { ...prev, ...syncExtra, applicants: updated };
    });

    const errorKey = `applicant_${index}_${field}`;
    if (touchedFields[errorKey]) {
      const err = validateApplicantField(field, value, index);
      setFormErrors((prev) => ({ ...prev, [errorKey]: err }));
    }
  };

  const handleApplicantBlur = (index: number, field: keyof HeliApplicant) => {
    const errorKey = `applicant_${index}_${field}`;
    setTouchedFields((prev) => ({ ...prev, [errorKey]: true }));
    const val = bookingFormData.applicants?.[index]?.[field] || "";
    const err = validateApplicantField(field, val, index);
    setFormErrors((prev) => ({ ...prev, [errorKey]: err }));
  };

  const handleUpdateSeatCount = (newCount: number) => {
    if (!bookingTour) return;
    const clamped = Math.min(5, Math.max(1, newCount));
    setBookingSeatCount(clamped);
    setActiveApplicantIndex((prev) => Math.min(prev, clamped - 1));
    if (bookingFlightOption === "sharing") {
      setBookingTotalPriceNPR(bookingTour.sharingPriceNPR * clamped);
    }
    setBookingFormData((prev) => {
      const nextApplicants: HeliApplicant[] = [];
      const primaryDate = prev.applicants?.[0]?.preferredDate || prev.preferredDate || "";
      const primaryHotel = prev.applicants?.[0]?.pickupHotel || prev.pickupHotel || "";
      for (let i = 0; i < clamped; i++) {
        nextApplicants.push(
          prev.applicants?.[i] || {
            fullName: "",
            nationality: "",
            idNumber: "",
            bodyWeightKg: "",
            luggageKg: "",
            email: "",
            phoneCode: "+977",
            phone: "",
            preferredDate: primaryDate,
            pickupHotel: primaryHotel,
            passportFile: null,
            photoFile: null,
            flightFile: null,
            hotelFile: null,
            insuranceFile: null,
          }
        );
      }
      return { ...prev, applicants: nextApplicants };
    });
  };

  const handleFieldChange = (field: string, value: any) => {
    setBookingFormData((prev) => ({ ...prev, [field]: value }));
    if (touchedFields[field]) {
      const err = validateHeliField(field, value);
      setFormErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    const err = validateHeliField(field, (bookingFormData as any)[field]);
    setFormErrors((prev) => ({ ...prev, [field]: err }));
  };

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  // Share popup state
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isShareCopied, setIsShareCopied] = useState<boolean>(false);
  const shareDropdownRef = useRef<HTMLDivElement>(null);
  const passportRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const flightRef = useRef<HTMLInputElement>(null);
  const hotelRef = useRef<HTMLInputElement>(null);
  const insuranceRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        shareDropdownRef.current &&
        !shareDropdownRef.current.contains(e.target as Node)
      ) {
        setIsShareOpen(false);
      }
    };
    if (isShareOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isShareOpen]);

  const handleCopyTourLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsShareCopied(true);
      setTimeout(() => setIsShareCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Sync scroll to top on navigation
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectTour = (tour: HeliPackageItem) => {
    navigate(`/service/heli-services/${tour.id}`);
    setActiveDetailTab("OVERVIEW");
    scrollToTop();
  };

  const handleBackToListing = () => {
    navigate("/service/heli-services");
    scrollToTop();
  };

  // Open booking modal
  const handleOpenBooking = (tour: HeliPackageItem, option: "charter" | "sharing" = "charter") => {
    const seatCount = 1;
    setBookingTour(tour);
    setBookingFlightOption(option);
    setBookingSeatCount(seatCount);
    setActiveApplicantIndex(0);
    setBookingTotalPriceNPR(option === "charter" ? tour.charterPriceNPR : tour.sharingPriceNPR);
    setBookingFormData((prev) => ({
      ...prev,
      applicants: Array.from(
        { length: seatCount },
        (_, i) =>
          prev.applicants?.[i] || {
            fullName: i === 0 ? prev.fullName : "",
            nationality: i === 0 ? prev.nationality : "",
            idNumber: i === 0 ? prev.idNumber : "",
            bodyWeightKg: i === 0 ? prev.bodyWeightKg : "",
            luggageKg: i === 0 ? prev.luggageKg : "",
            email: i === 0 ? prev.email : "",
            phoneCode: i === 0 ? prev.phoneCode || "+977" : "+977",
            phone: i === 0 ? prev.phone : "",
            preferredDate: prev.preferredDate || "",
            pickupHotel: prev.pickupHotel || "",
            passportFile: null,
            photoFile: null,
            flightFile: null,
            hotelFile: null,
            insuranceFile: null,
          }
      ),
    }));
    setFormErrors({});
    setTouchedFields({});
    setIsSubmitted(false);
    setIsBookingModalOpen(true);
  };

  // Handler for PriceModel book now trigger
  const handlePriceModelBookNow = (details: {
    flightType: "charter" | "sharing";
    seatCount: number;
    totalPriceNPR: number;
  }) => {
    if (!selectedTour) return;
    const seatCount = Math.max(1, details.seatCount || 1);
    setBookingTour(selectedTour);
    setBookingFlightOption(details.flightType);
    setBookingSeatCount(seatCount);
    setActiveApplicantIndex(0);
    setBookingTotalPriceNPR(details.totalPriceNPR);
    setBookingFormData((prev) => ({
      ...prev,
      applicants: Array.from(
        { length: seatCount },
        (_, i) =>
          prev.applicants?.[i] || {
            fullName: i === 0 ? prev.fullName : "",
            nationality: i === 0 ? prev.nationality : "",
            idNumber: i === 0 ? prev.idNumber : "",
            bodyWeightKg: i === 0 ? prev.bodyWeightKg : "",
            luggageKg: i === 0 ? prev.luggageKg : "",
            email: i === 0 ? prev.email : "",
            phoneCode: i === 0 ? prev.phoneCode || "+977" : "+977",
            phone: i === 0 ? prev.phone : "",
            preferredDate: prev.preferredDate || "",
            pickupHotel: prev.pickupHotel || "",
            passportFile: null,
            photoFile: null,
            flightFile: null,
            hotelFile: null,
            insuranceFile: null,
          }
      ),
    }));
    setFormErrors({});
    setTouchedFields({});
    setIsSubmitted(false);
    setIsBookingModalOpen(true);
  };

  // Form submission handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const paxCount = Math.max(1, bookingSeatCount || 1);
    const errors: Record<string, string | undefined> = {};
    const allTouched: Record<string, boolean> = { ...touchedFields };

    // Validate each applicant
    for (let i = 0; i < paxCount; i++) {
      const applicant = bookingFormData.applicants?.[i] || {
        fullName: "",
        nationality: "",
        idNumber: "",
        bodyWeightKg: "",
        luggageKg: "",
        email: "",
        phoneCode: "+977",
        phone: "",
        preferredDate: "",
        pickupHotel: "",
        passportFile: null,
        photoFile: null,
        flightFile: null,
        hotelFile: null,
        insuranceFile: null,
      };
      const applicantFields: (keyof HeliApplicant)[] = [
        "fullName",
        "nationality",
        "idNumber",
        "bodyWeightKg",
        "luggageKg",
        "email",
        "phone",
        "preferredDate",
      ];
      applicantFields.forEach((f) => {
        const errKey = `applicant_${i}_${f}`;
        allTouched[errKey] = true;
        const err = validateApplicantField(f, applicant[f], i);
        if (err) errors[errKey] = err;
      });
    }

    // Terms agreement
    allTouched["termsAgreed"] = true;
    const termsErr = validateHeliField("termsAgreed", bookingFormData.termsAgreed);
    if (termsErr) errors["termsAgreed"] = termsErr;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setTouchedFields(allTouched);

      // Auto-switch to first applicant with an error
      for (let i = 0; i < paxCount; i++) {
        const hasErr = Object.keys(errors).some((k) =>
          k.startsWith(`applicant_${i}_`)
        );
        if (hasErr) {
          setActiveApplicantIndex(i);
          break;
        }
      }
      return;
    }

    setFormErrors({});
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `TH-HELI-2026-${randomSuffix}`;
    const now = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    setSubmissionId(generatedId);
    setSubmittedAt(now);
    setIsSubmitted(true);
  };

  // Print quotation dossier from Details View
  const handlePrintQuotation = () => {
    const originalTitle = document.title;
    document.title = `${selectedTour?.title || "Heli Tour"} - Quotation Slip - Trip Himalaya`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 2000);
  };

  // Print booking receipt / slip from Modal
  const handlePrintBookingSlip = () => {
    const originalTitle = document.title;
    document.title = `Booking Voucher - ${submissionId} - Trip Himalaya`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 2000);
  };

  // Instant WhatsApp Inquiry
  const handleWhatsAppInquiry = (tour: HeliPackageItem) => {
    const basePrice = displayPrice(
      tour.sharingPriceNPR,
      selectedCurrency,
      nprPerOneDollar,
      nprPerOneINR
    );
    const msg = encodeURIComponent(
      `Hello Trip Himalaya (Heli Operations Desk)! I am interested in booking "${tour.title}" (${tour.location}, Duration: ${tour.duration}). Starting price: ${basePrice}. Please share current flight availability and CAAN slot details.`
    );
    window.open(`https://wa.me/9779851403761?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  // Filter logic — exclude rescue category from listing
  const LISTING_PACKAGES = HELI_PACKAGES.filter((t) => t.category !== "rescue");

  const filteredTours = LISTING_PACKAGES.filter((tour) => {
    // Inline search query
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      tour.title.toLowerCase().includes(query) ||
      tour.location.toLowerCase().includes(query) ||
      tour.description.toLowerCase().includes(query) ||
      tour.tripHighlights.some((h) => h.toLowerCase().includes(query));

    // Route filter (from header search bar)
    const routeMap: Record<string, string> = {
      everest: "ebc",
      annapurna: "abc",
      langtang: "langtang",
      muktinath: "pilgrimage",
      gosaikunda: "pilgrimage",
    };
    const mappedCategory = urlRoute ? routeMap[urlRoute] : "";
    const matchesRoute =
      !urlRoute ||
      (mappedCategory
        ? tour.category === mappedCategory
        : tour.location.toLowerCase().includes(urlRoute.toLowerCase()) ||
          tour.title.toLowerCase().includes(urlRoute.toLowerCase()));

    // Flight type filter (from header search bar)
    const matchesFlightType =
      !urlFlightType ||
      (urlFlightType === "charter"
        ? tour.charterPriceNPR > 0
        : urlFlightType === "sharing"
        ? tour.sharingPriceNPR > 0
        : true);

    // Price range (compare sharing price or charter)
    const matchesPrice = tour.sharingPriceNPR <= priceRange;

    // Rating
    const matchesRating = selectedRating === 0 || tour.rating >= selectedRating;

    // Keywords
    const matchesKeywords =
      selectedKeywords.length === 0 ||
      selectedKeywords.some((kw) => {
        const kwLower = kw.toLowerCase();
        return (
          tour.title.toLowerCase().includes(kwLower) ||
          tour.location.toLowerCase().includes(kwLower) ||
          tour.tag.toLowerCase().includes(kwLower) ||
          tour.category.toLowerCase().includes(kwLower)
        );
      });

    return matchesSearch && matchesRoute && matchesFlightType && matchesPrice && matchesRating && matchesKeywords;
  });

  const availableKeywords = [
    "EVEREST",
    "ANNAPURNA",
    "LANGTANG",
    "GOSAINKUNDA",
    "MUKTINATH",
    "CHARTER",
    "SHARING",
    "LUXURY",
  ];

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* ── DETAIL VIEW (Matching Image 2) ─────────────────────────────────────── */}
      {/* ========================================================================= */}
      {selectedTour ? (
        <div className="w-full space-y-8 animate-in fade-in duration-300">
          {/* ══════════════════════════════════════════════════════════
              PRINT-ONLY COMPREHENSIVE DOSSIER & QUOTATION
              Includes all details: Itinerary, Inclusions, Exclusions,
              Restrictions, What to Bring, Pricing, FAQs, and Policies.
              ══════════════════════════════════════════════════════════ */}
          {!isBookingModalOpen && (
            <div
              id="heli-print-dossier"
            className="hidden print:block relative"
            style={{
              fontFamily: "'Inter', Arial, sans-serif",
              fontSize: "9.5px",
              lineHeight: "1.45",
              color: "#1e293b",
              width: "100%",
              position: "relative",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            {/* ── BACKGROUND WATERMARK ── */}
            <div
              aria-hidden="true"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 999,
              }}
            >
              <div
                style={{
                  transform: "rotate(-28deg)",
                  fontSize: "38px",
                  fontWeight: 900,
                  color: "rgba(45, 19, 71, 0.06)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  lineHeight: 2.2,
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  mixBlendMode: "multiply",
                }}
              >
                Trip Himalaya Tours and Travels
              </div>
            </div>

            {/* ── 1. CORPORATE LETTERHEAD ── */}
            <div style={{ background: "linear-gradient(135deg, #2D1347 0%, #3B145C 50%, #4a1c7a 100%)", borderRadius: "10px 10px 0 0", padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
                <div style={{ background: "#ffffff", borderRadius: "8px", padding: "4px 6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <img src={Logo} alt="Trip Himalaya" style={{ height: "68px", width: "auto", objectFit: "contain", display: "block" }} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "16px", fontWeight: 900, color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.01em", margin: 0, whiteSpace: "nowrap" }}>
                    Trip Himalaya Tours &amp; Travel Pvt. Ltd.
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2.5px",
                      marginTop: "4px",
                      fontSize: "8.5px",
                      color: "#f3e8ff",
                      lineHeight: "1.35",
                    }}
                  >
                    {/* Row 1: Address */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                      <MapPin size={10} color="#f472b6" style={{ flexShrink: 0 }} />
                      <span>Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal</span>
                    </div>
                    {/* Row 2: Phone + Website */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                        <span style={{ color: "#f472b6" }}>📞</span>
                        <span>+977 9851403761</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                        <span style={{ color: "#f472b6" }}>🌐</span>
                        <span>www.triphimalaya.com.np</span>
                      </div>
                    </div>
                    {/* Row 3: Email */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                      <span style={{ color: "#f472b6" }}>✉</span>
                      <span>pradip.triphimalayatt@gmail.com</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, whiteSpace: "nowrap", alignSelf: "flex-end", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", paddingBottom: "2px" }}>
                <div style={{ fontSize: "8.5px", background: "rgba(233, 30, 99, 0.25)", color: "#fbcfe8", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, border: "1px solid rgba(233, 30, 99, 0.4)" }}>
                  Helicopter Operations Team
                </div>
                <div style={{ fontSize: "9.5px", color: "#e9d5ff", whiteSpace: "nowrap" }}>
                  Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>
            </div>
            {/* Project brand accent strip */}
            <div style={{ height: "4px", background: "linear-gradient(90deg, #E91E63 0%, #db2777 30%, #9333ea 70%, #2D1347 100%)", marginBottom: "10px" }} />

            {/* ── PACKAGE SUMMARY & OVERVIEW CARD ── */}
            <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "8px", padding: "10px 14px", marginBottom: "10px", background: "#fdf4ff", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "15px", fontWeight: 900, color: "#2D1347", lineHeight: 1.2 }}>{selectedTour.title}</div>
                  <div style={{ fontSize: "8.5px", color: "#6b21a8", marginTop: "4px", display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ background: "#2D1347", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>Heli Services</span>
                    {selectedTour.location && <span style={{ background: "#7c3aed", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>📍 {selectedTour.location}</span>}
                    {selectedTour.duration && <span style={{ background: "#9333ea", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>⏱ {selectedTour.duration}</span>}
                    {selectedTour.maxAltitude && <span style={{ background: "#c026d3", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>⚡ Max Alt: {selectedTour.maxAltitude}</span>}
                    <span style={{ background: "#E91E63", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>★ {selectedTour.rating || 4.9} / 5.0 ({selectedTour.reviewsCount || 1} reviews)</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "8px", color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Starting From</div>
                  <div style={{ fontSize: "16px", fontWeight: 900, color: "#2D1347" }}>{startsFromDisplayPrice}</div>
                </div>
              </div>
              <div style={{ marginTop: "7px", paddingTop: "7px", borderTop: "1px solid #f3e8ff", fontSize: "9px", color: "#4a154b", lineHeight: "1.45" }}>
                <strong style={{ color: "#2D1347" }}>Experience Overview: </strong>
                {selectedTour.description}
              </div>
            </div>

            {/* ── SECTION 1: PRICING SCHEDULE ── */}
            <div style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <div style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderLeft: "3.5px solid #E91E63", paddingLeft: "7px", marginBottom: "5px" }}>
                1. Pricing Schedule &amp; Package Tiers
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9px", border: "1px solid #e9d5ff" }}>
                <thead>
                  <tr style={{ background: "linear-gradient(90deg, #2D1347, #3B145C)", color: "#ffffff" }}>
                    <th style={{ padding: "6px 8px", textAlign: "left", fontWeight: 800, width: "42%" }}>Service / Experience Tier</th>
                    <th style={{ padding: "6px 8px", textAlign: "center", fontWeight: 800, width: "22%" }}>Group / Age Bracket</th>
                    <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 800, width: "18%" }}>Price (NPR)</th>
                    <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 800, width: "18%" }}>Price (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: "#ffffff", borderBottom: "1px solid #f3e8ff" }}>
                    <td style={{ padding: "5px 8px", fontWeight: 700, color: "#2D1347" }}>Private Charter (Full Helicopter)</td>
                    <td style={{ padding: "5px 8px", textAlign: "center", color: "#6b21a8" }}>Up to 5 Pax (Private Flight)</td>
                    <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 800, color: "#2D1347" }}>NPR {printCharterPriceNPR.toLocaleString("en-IN")}</td>
                    <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, color: "#E91E63" }}>${printCharterPriceUSD.toLocaleString()}</td>
                  </tr>
                  <tr style={{ background: "#faf5ff", borderBottom: "1px solid #f3e8ff" }}>
                    <td style={{ padding: "5px 8px", fontWeight: 700, color: "#2D1347" }}>Group Joining (Per Seat Sharing)</td>
                    <td style={{ padding: "5px 8px", textAlign: "center", color: "#6b21a8" }}>Per Person (Guaranteed Seat)</td>
                    <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 800, color: "#2D1347" }}>NPR {printSharingPriceNPR.toLocaleString("en-IN")}</td>
                    <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, color: "#E91E63" }}>${printSharingPriceUSD.toLocaleString()}</td>
                  </tr>
                  <tr style={{ background: "#ffffff", borderBottom: "1px solid #f3e8ff" }}>
                    <td style={{ padding: "5px 8px", fontWeight: 700, color: "#2D1347" }}>VIP Priority (Front Window View)</td>
                    <td style={{ padding: "5px 8px", textAlign: "center", color: "#6b21a8" }}>Per Person (Front Window Seat)</td>
                    <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 800, color: "#2D1347" }}>NPR {printVipPriceNPR.toLocaleString("en-IN")}</td>
                    <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, color: "#E91E63" }}>${printVipPriceUSD.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ fontSize: "8px", color: "#7c3aed", marginTop: "3px", fontWeight: 500 }}>
                * Rates include certified captain/pilot fees, aviation passenger insurance, landing permits, national park fees, and emergency ground support.
              </div>
            </div>

            {/* ── SECTION 2: DAY-BY-DAY / STEP-BY-STEP ITINERARY ── */}
            <div style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <div style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderLeft: "3.5px solid #E91E63", paddingLeft: "7px", marginBottom: "6px" }}>
                2. Step-by-Step Experience Itinerary &amp; Timeline
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {heliItineraryList.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      border: "1px solid #e9d5ff",
                      borderRadius: "4px",
                      padding: "6px 8px",
                      background: "#faf5ff",
                      display: "flex",
                      gap: "8px",
                      alignItems: "flex-start",
                      pageBreakInside: "avoid",
                      breakInside: "avoid",
                    }}
                  >
                    <div
                      style={{
                        background: "#2D1347",
                        color: "#ffffff",
                        fontSize: "8px",
                        fontWeight: 800,
                        padding: "2px 6px",
                        borderRadius: "3px",
                        flexShrink: 0,
                        textTransform: "uppercase",
                      }}
                    >
                      {item.phase || `Phase ${i + 1}`}
                    </div>
                    <div>
                      <div style={{ fontSize: "9.5px", fontWeight: 800, color: "#2D1347" }}>{item.title}</div>
                      <div style={{ fontSize: "8.5px", color: "#581c87", marginTop: "1px", lineHeight: "1.35" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SECTION 3: TRIP HIGHLIGHTS ── */}
            <div style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <div style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderLeft: "3.5px solid #E91E63", paddingLeft: "7px", marginBottom: "6px" }}>
                3. Key Highlights &amp; Features
              </div>
              <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "6px", padding: "8px 10px", background: "#fdf4ff" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
                  {(selectedTour.tripHighlights || []).map((h: string, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px", fontSize: "9px", color: "#4a154b" }}>
                      <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>✓</span>
                      <span style={{ lineHeight: "1.35" }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── SECTION 4: INCLUSIONS & EXCLUSIONS (2 columns) ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
              {/* What's Included */}
              <div style={{ border: "1.5px solid #d8b4fe", borderRadius: "6px", padding: "8px 10px", background: "#faf5ff" }}>
                <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "3px", marginBottom: "5px" }}>
                  4. What&apos;s Included
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {(selectedTour.whatsIncluded || []).map((inc: string, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px", fontSize: "8.5px", color: "#581c87" }}>
                      <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>✓</span>
                      <span style={{ lineHeight: "1.3" }}>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Excluded */}
              <div style={{ border: "1.5px solid #fecdd3", borderRadius: "6px", padding: "8px 10px", background: "#fff1f2" }}>
                <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#881337", borderBottom: "1.5px solid #fda4af", paddingBottom: "3px", marginBottom: "5px" }}>
                  5. What&apos;s Excluded / Not Included
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {(selectedTour.whatsExcluded || []).map((ex: string, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px", fontSize: "8.5px", color: "#4c0519" }}>
                      <span style={{ fontWeight: 900, color: "#be185d", flexShrink: 0 }}>✗</span>
                      <span style={{ lineHeight: "1.3" }}>{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── SECTION 5: SAFETY GUIDELINES, RESTRICTIONS & WHAT TO BRING (2 columns) ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
              {/* Restrictions */}
              <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "6px", padding: "8px 10px", background: "#fdf4ff" }}>
                <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "3px", marginBottom: "5px" }}>
                  6. Safety Restrictions &amp; CAAN Flight Rules
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {(selectedTour.restrictionsAndHealth || []).map((r: string, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px", fontSize: "8.5px", color: "#4a154b" }}>
                      <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>&bull;</span>
                      <span style={{ lineHeight: "1.3" }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What to Bring */}
              <div style={{ border: "1.5px solid #d8b4fe", borderRadius: "6px", padding: "8px 10px", background: "#faf5ff" }}>
                <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "3px", marginBottom: "5px" }}>
                  7. Passenger Checklist &amp; What to Bring
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {(selectedTour.whatToBring || []).map((b: string, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px", fontSize: "8.5px", color: "#581c87" }}>
                      <span style={{ fontWeight: 900, color: "#9333ea", flexShrink: 0 }}>&bull;</span>
                      <span style={{ lineHeight: "1.3" }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── SECTION 6: FREQUENTLY ASKED QUESTIONS ── */}
            <div style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <div style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderLeft: "3.5px solid #E91E63", paddingLeft: "7px", marginBottom: "6px" }}>
                8. Important FAQs &amp; Flight Information
              </div>
              <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "6px", padding: "8px 10px", background: "#fdf4ff" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {(selectedTour.faqs || []).map((faq, i) => (
                    <div key={i} style={{ fontSize: "8.5px", color: "#4a154b", lineHeight: "1.35" }}>
                      <div style={{ fontWeight: 800, color: "#2D1347" }}>Q: {faq.q}</div>
                      <div style={{ color: "#581c87", marginTop: "1px" }}>A: {faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── SECTION 7: BOOKING TERMS & CANCELLATION POLICIES ── */}
            <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "6px", padding: "7px 10px", marginBottom: "10px", background: "#faf5ff", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "3px", marginBottom: "5px" }}>
                9. Booking Policies, Weather &amp; Cancellation Terms
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 14px", fontSize: "8px", color: "#4a154b", lineHeight: "1.4" }}>
                <div><strong style={{ color: "#2D1347" }}>Weather Guarantee:</strong> 100% full refund or complimentary reschedule if flight is grounded due to mountain weather/air traffic control.</div>
                <div><strong style={{ color: "#2D1347" }}>Weight &amp; Balance:</strong> Strictly max 5 passengers or total passenger weight per CAAN and aircraft flight manual specifications.</div>
                <div><strong style={{ color: "#2D1347" }}>Reservation &amp; Confirmation:</strong> 30% advance deposit secures flight slot and permits; balance payable prior to boarding.</div>
                <div><strong style={{ color: "#2D1347" }}>Permits &amp; Identification:</strong> Valid passport copy (or Nepali citizenship ID) required for domestic terminal clearance.</div>
              </div>
            </div>

            {/* ── CORPORATE FOOTER ── */}
            <div style={{ background: "linear-gradient(90deg, #2D1347, #3B145C)", padding: "8px 14px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "8.5px", color: "#ffffff" }}>
              <div>
                <strong style={{ color: "#ffffff" }}>Trip Himalaya Tours &amp; Travel Pvt. Ltd.</strong> &bull; Registered in Nepal (Lic: 2490)
              </div>
              <div style={{ color: "#fce7f3" }}>
                Heli Operations Desk: +977 9851403761 &bull; pradip.triphimalayatt@gmail.com
              </div>
              <div style={{ fontWeight: 700, color: "#f472b6" }}>
                Official Computer-Generated Travel Dossier &bull; Page 1 of 1
              </div>
            </div>
          </div>
          )}

          {/* ── TOP HERO HEADER (From Image 2) ── */}
          <div className="print:hidden relative rounded-3xl overflow-hidden shadow-xl min-h-[300px] sm:min-h-[360px] flex flex-col justify-end text-white">
            <img
              src={selectedTour.image}
              alt={selectedTour.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#200B3B]/95 via-[#200B3B]/60 to-black/30" />

            {/* ── Share button (top-right, always visible) ── */}
            <div ref={shareDropdownRef} className="absolute top-3 right-4 sm:top-8 sm:right-6 z-20 print:hidden">
              <button
                type="button"
                onClick={() => setIsShareOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center transition-all shadow-md cursor-pointer active:scale-95"
                title="Share this tour"
              >
                <Share2 size={16} />
              </button>

              {/* Share Dropdown */}
              {isShareOpen && (
                <div className="absolute top-12 right-0 sm:top-0 sm:right-12 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/80 p-2 flex items-center gap-1.5 min-w-max z-30 animate-in fade-in duration-150">
                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => {
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          window.location.href
                        )}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                      setIsShareOpen(false);
                    }}
                    title="Facebook"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                    style={{ background: "#1877F2" }}
                  >
                    <svg viewBox="0 0 24 24" fill="white" width="15" height="15">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                  </button>

                  {/* Instagram */}
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(window.location.href).catch(() => {});
                      setIsShareCopied(true);
                      setTimeout(() => setIsShareCopied(false), 2000);
                      window.open("https://www.instagram.com/triphimalayatt", "_blank", "noopener,noreferrer");
                      setIsShareOpen(false);
                    }}
                    title="Instagram"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2" />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="white" />
                      <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
                    </svg>
                  </button>

                  {/* TikTok */}
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(window.location.href).catch(() => {});
                      setIsShareCopied(true);
                      setTimeout(() => setIsShareCopied(false), 2000);
                      window.open("https://www.tiktok.com/@trip.himalaya", "_blank", "noopener,noreferrer");
                      setIsShareOpen(false);
                    }}
                    title="TikTok"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                    style={{ background: "#000000" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                    </svg>
                  </button>

                  {/* LinkedIn */}
                  <button
                    type="button"
                    onClick={() => {
                      window.open(
                        `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                          window.location.href
                        )}&title=${encodeURIComponent(selectedTour.title)}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                      setIsShareOpen(false);
                    }}
                    title="LinkedIn"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                    style={{ background: "#0A66C2" }}
                  >
                    <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" fill="white" />
                    </svg>
                  </button>

                  {/* Twitter / X */}
                  <button
                    type="button"
                    onClick={() => {
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          window.location.href
                        )}&text=${encodeURIComponent(selectedTour.title)}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                      setIsShareOpen(false);
                    }}
                    title="Twitter / X"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                    style={{ background: "#000000" }}
                  >
                    <svg viewBox="0 0 24 24" fill="white" width="13" height="13">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>

                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={() => {
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(
                          `Check out ${selectedTour.title} on Trip Himalaya: ${window.location.href}`
                        )}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                      setIsShareOpen(false);
                    }}
                    title="WhatsApp"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                    style={{ background: "#25D366" }}
                  >
                    <MessageCircle size={15} color="white" />
                  </button>

                  {/* Copy Link */}
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(window.location.href).catch(() => {});
                      setIsShareCopied(true);
                      setTimeout(() => setIsShareCopied(false), 2000);
                      setIsShareOpen(false);
                    }}
                    title={isShareCopied ? "Copied!" : "Copy Link"}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm flex-shrink-0 cursor-pointer ${
                      isShareCopied ? "bg-emerald-500" : "bg-gray-700 hover:bg-gray-900"
                    }`}
                  >
                    {isShareCopied ? (
                      <Check size={13} color="white" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="13" height="13">
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                      </svg>
                    )}
                  </button>

                  <div className="hidden sm:block absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-gray-200/80" />
                </div>
              )}
            </div>

            {/* ── Desktop-only: stacked action buttons top-right ── */}
            <div className="hidden sm:flex flex-col absolute sm:top-32 sm:right-6 gap-2 w-48 z-20 print:hidden">
              <button
                type="button"
                onClick={() => handleWhatsAppInquiry(selectedTour)}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <MessageCircle size={15} />
                <span>Ask on WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={handlePrintQuotation}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#200B3B]/60 hover:bg-[#200B3B]/80 backdrop-blur-md border border-white/25 text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <Printer size={14} />
                <span>Print / Save PDF</span>
              </button>
            </div>

            {/* ── Title & description + mobile action buttons ── */}
            <div className="relative z-10 p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  {selectedTour.title}
                </h1>
                <span className="bg-[#E91E63] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xs">
                  EXPERIENCE
                </span>
              </div>
              <p className="text-white/90 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl mb-4 sm:mb-0">
                {selectedTour.description}
              </p>

              {/* Mobile-only: action buttons below description */}
              <div className="flex sm:hidden items-center gap-3 mt-4 print:hidden">
                <button
                  type="button"
                  onClick={() => handleWhatsAppInquiry(selectedTour)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <MessageCircle size={14} />
                  <span>Ask on WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintQuotation}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-xs font-semibold py-2.5 px-3 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Printer size={14} />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── SUB-NAVIGATION STRIP (OVERVIEW | POLICIES | FAQS | TESTIMONIES + Starts From & Book Now) ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sm:px-6 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
            {/* Tabs */}
            <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto">
              {(["OVERVIEW", "POLICIES", "FAQS", "TESTIMONIES"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveDetailTab(tab)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeDetailTab === tab
                      ? "text-[#E91E63] bg-pink-50/70 border-b-2 border-[#E91E63]"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Starts From & Book Now Button */}
            <div className="flex items-center justify-end gap-3.5">
              <div className="text-right">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                  STARTS FROM
                </span>
                <span className="text-base sm:text-lg font-black text-[#E91E63]">
                  {displayPrice(
                    selectedTour.sharingPriceNPR,
                    selectedCurrency,
                    nprPerOneDollar,
                    nprPerOneINR
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenBooking(selectedTour, "charter")}
                className="px-6 py-2.5 rounded-full bg-[#E91E63] hover:bg-pink-700 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
              >
                BOOK NOW
              </button>
            </div>
          </div>

          {/* ── MAIN 2-COLUMN LAYOUT: CONTENT + HELI SERVICE PRICE MODEL ── */}
          <div className="print:hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: TOUR DETAILS (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Tab 1: OVERVIEW */}
              {activeDetailTab === "OVERVIEW" && (
                <div className="space-y-6">
                  {/* Title & Metadata */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#200B3B] leading-tight">
                      {selectedTour.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-bold text-gray-500">
                      <span className="flex items-center gap-1.5 text-[#E91E63]">
                        <MapPin size={15} />
                        <span className="text-gray-700">{selectedTour.location}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-[#E91E63]">
                        <Clock size={15} />
                        <span className="text-gray-700">{selectedTour.duration}</span>
                      </span>
                      {selectedTour.maxAltitude && (
                        <span className="bg-pink-50 text-[#E91E63] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          Max Alt: {selectedTour.maxAltitude}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description + Trip Highlights — single card */}
                  <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                      {selectedTour.description}
                    </p>
                    <div className="border-t border-gray-100 pt-4 space-y-3">
                      <h3 className="text-base sm:text-lg font-black text-[#200B3B]">
                        Trip Highlights
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedTour.tripHighlights.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-[11px] font-medium text-gray-600 text-left"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E91E63] mt-1 flex-shrink-0" />
                            <span>{item.replace(/^[\u2022\-\*]\s*/, "")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* What's Included (Teal Green Card) & What's Excluded (Pink Card) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* What's Included */}
                    <div className="bg-[#009688] text-white p-6 rounded-3xl shadow-sm space-y-4">
                      <h4 className="flex items-center gap-2 text-sm sm:text-base font-black uppercase tracking-wider">
                        <CheckCircle2 size={18} />
                        <span>What's Included</span>
                      </h4>
                      <ul className="space-y-2.5 text-xs font-medium">
                        {selectedTour.whatsIncluded.map((inc, i) => (
                          <li key={i} className="flex items-start gap-2 leading-relaxed">
                            <Check size={15} className="flex-shrink-0 mt-0.5 text-teal-200" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What's Excluded */}
                    <div className="bg-[#E91E63] text-white p-6 rounded-3xl shadow-sm space-y-4">
                      <h4 className="flex items-center gap-2 text-sm sm:text-base font-black uppercase tracking-wider">
                        <X size={18} />
                        <span>What's Excluded</span>
                      </h4>
                      <ul className="space-y-2.5 text-xs font-medium">
                        {selectedTour.whatsExcluded.map((exc, i) => (
                          <li key={i} className="flex items-start gap-2 leading-relaxed">
                            <X size={15} className="flex-shrink-0 mt-0.5 text-pink-200" />
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Restrictions & Health Card (Amber Warning) */}
                  <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                    <h3 className="flex items-center gap-2.5 text-base sm:text-lg font-black text-[#200B3B]">
                      <AlertTriangle size={20} className="text-amber-500" />
                      <span>Restrictions &amp; Health</span>
                    </h3>
                    <ul className="space-y-2.5 pt-1 text-xs text-gray-700 leading-relaxed">
                      {selectedTour.restrictionsAndHealth.map((res, i) => (
                        <li key={i} className="flex items-start gap-2.5 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                          <span>{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What to Bring Card (Pink Bag) */}
                  <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                    <h3 className="flex items-center gap-2.5 text-base sm:text-lg font-black text-[#200B3B]">
                      <ShoppingBag size={20} className="text-[#E91E63]" />
                      <span>What to Bring</span>
                    </h3>
                    <ul className="space-y-2.5 pt-1 text-xs text-gray-700 leading-relaxed">
                      {selectedTour.whatToBring.map((wtb, i) => (
                        <li key={i} className="flex items-start gap-2.5 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E91E63] mt-1.5 flex-shrink-0" />
                          <span>{wtb}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 2: POLICIES */}
              {activeDetailTab === "POLICIES" && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                  <h3 className="text-xl font-black text-[#200B3B]">
                    Heli Service Policies &amp; Aviation Guidelines
                  </h3>
                  <div className="space-y-4">
                    {selectedTour.policies.map((policy, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <p className="text-xs text-gray-700 font-medium leading-relaxed">
                          {policy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: FAQS */}
              {activeDetailTab === "FAQS" && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                  <h3 className="text-xl font-black text-[#200B3B]">
                    Frequently Asked Questions about {selectedTour.title}
                  </h3>
                  <div className="space-y-3">
                    {selectedTour.faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2"
                      >
                        <h4 className="text-sm font-bold text-[#200B3B]">{faq.q}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: TESTIMONIES */}
              {activeDetailTab === "TESTIMONIES" && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                  <h3 className="text-xl font-black text-[#200B3B]">
                    Guest Experiences &amp; Reviews
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedTour.testimonies.map((test, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-center gap-1">
                          {Array.from({ length: test.rating }).map((_, r) => (
                            <Star
                              key={r}
                              size={14}
                              className="text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-700 italic font-medium leading-relaxed">
                          "{test.comment}"
                        </p>
                        <div className="pt-2 border-t border-gray-200/70 flex items-center justify-between text-[11px] text-gray-500 font-bold">
                          <span className="text-[#200B3B]">{test.name} ({test.country})</span>
                          <span>{test.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: STICKY PRICING MODEL SIDEBAR (Matching Visa Service Details Page) */}
            <div id="pricing-section" className="lg:col-span-4 lg:sticky lg:top-[150px] self-start space-y-6">
              <HeliServicePriceModel
                tour={selectedTour}
                onBookNow={handlePriceModelBookNow}
                onWhatsAppInquiry={(flightType, formattedTotal) => {
                  const typeLabel =
                    flightType === "charter" ? "Private Charter" : "Sharing Heli Service";
                  const msg = encodeURIComponent(
                    `Hello Trip Himalaya! Inquiring for "${selectedTour.title}". Selected: ${typeLabel}. Price: ${formattedTotal}. Please confirm next flight timing.`
                  );
                  window.open(`https://wa.me/9779851403761?text=${msg}`, "_blank", "noopener,noreferrer");
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================================= */
        /* ── CARDS LISTING VIEW (Matching Image 1) ────────────────────────────── */
        /* ======================================================================= */
        <div className="w-full space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* ── LEFT: FILTER SIDEBAR ── */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-[#E91E63]" />
                  <h3 className="text-sm font-black text-[#200B3B]">Filter By</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setPriceRange(800000);
                    setSelectedRating(0);
                    setSelectedKeywords([]);
                    navigate("/service/heli-services");
                  }}
                  className="text-[10px] font-bold text-[#E91E63] hover:underline uppercase tracking-wider cursor-pointer"
                >
                  CLEAR ALL
                </button>
              </div>

              {/* 1. Price Range Slider */}
              <div className="space-y-3 pb-5 border-b border-gray-100">
                <label className="text-[10px] font-black text-[#200B3B] tracking-widest uppercase block">
                  PRICE RANGE ({selectedCurrency === "nepali" ? "NPR" : selectedCurrency === "inr" ? "INR" : "USD"})
                </label>
                <input
                  type="range"
                  min={50000}
                  max={800000}
                  step={10000}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#E91E63] cursor-pointer h-1.5 bg-gray-200 rounded-lg outline-none"
                />
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-gray-400">
                    {displayPrice(50000, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
                  </span>
                  <span className="text-[#E91E63] font-black">
                    {displayPrice(priceRange, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
                  </span>
                </div>
              </div>

              {/* 2. Star Ratings */}
              <div className="space-y-3 pb-5 border-b border-gray-100">
                <label className="text-[10px] font-black text-[#200B3B] tracking-widest uppercase block">
                  RATINGS
                </label>
                <div className="space-y-1.5">
                  {[5, 4, 3, 2, 1].map((starCount) => (
                    <button
                      key={starCount}
                      type="button"
                      onClick={() =>
                        setSelectedRating(selectedRating === starCount ? 0 : starCount)
                      }
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                        selectedRating === starCount
                          ? "bg-pink-50 border border-pink-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i < starCount
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      {selectedRating === starCount && (
                        <Check size={14} className="text-[#E91E63]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Keywords Tags */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#200B3B] tracking-widest uppercase block">
                  KEYWORDS
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableKeywords.map((kw) => {
                    const isSelected = selectedKeywords.includes(kw);
                    return (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedKeywords((prev) => prev.filter((k) => k !== kw));
                          } else {
                            setSelectedKeywords((prev) => [...prev, kw]);
                          }
                        }}
                        className={`text-[9.5px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer uppercase ${
                          isSelected
                            ? "bg-[#200B3B] text-white border-[#200B3B]"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {kw}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── RIGHT: HORIZONTAL HELI CARDS (Matching Image 1) ── */}
            <div className="lg:col-span-3 space-y-5">
              {filteredTours.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
                  <Plane size={40} className="mx-auto text-gray-300" />
                  <h4 className="text-lg font-black text-[#200B3B]">
                    No Helicopter Tours Found
                  </h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Try adjusting your price range or clearing keyword filters to see available mountain flights.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPriceRange(800000);
                      setSelectedRating(0);
                      setSelectedKeywords([]);
                      setSearchQuery("");
                      navigate("/service/heli-services");
                    }}
                    className="mt-2 px-5 py-2 rounded-full bg-[#E91E63] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredTours.map((tour) => {
                  const formattedStartingPrice = displayPrice(
                    tour.sharingPriceNPR,
                    selectedCurrency,
                    nprPerOneDollar,
                    nprPerOneINR
                  );

                  return (
                    <div
                      key={tour.id}
                      onClick={() => handleSelectTour(tour)}
                      className="flex flex-col md:flex-row md:h-[230px] bg-white rounded-3xl shadow-sm hover:shadow-lg border border-gray-100/90 transition-all duration-300 overflow-hidden group cursor-pointer"
                    >
                      {/* Left: Image with Badge */}
                      <div className="relative w-full md:w-72 lg:w-80 h-52 md:h-full flex-shrink-0 overflow-hidden bg-gray-100">
                        <img
                          src={tour.image}
                          alt={tour.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-xs text-[#2D1347] text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                          {tour.tag}
                        </span>
                      </div>

                      {/* Middle: Info */}
                      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between min-w-0">
                        <div>
                          {/* Star Rating & Highly Rated Tag */}
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={13}
                                  className="text-yellow-400 fill-yellow-400"
                                />
                              ))}
                            </div>
                            <span className="text-[10px] font-black text-gray-400 tracking-wider uppercase">
                              HIGHLY RATED
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-base sm:text-lg font-black text-[#200B3B] group-hover:text-[#E91E63] transition-colors leading-snug line-clamp-1">
                            {tour.title}
                          </h3>

                          {/* Description */}
                          <p className="text-xs text-gray-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                            {tour.description}
                          </p>
                        </div>

                        {/* Location & Duration */}
                        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-100 text-[11px] font-bold text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-[#E91E63]" />
                            <span>{tour.location}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} className="text-[#E91E63]" />
                            <span>{tour.duration}</span>
                          </span>
                        </div>
                      </div>

                      {/* Right: Pricing & Actions */}
                      <div className="w-full md:w-56 lg:w-60 p-5 sm:p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 flex-shrink-0 text-left bg-white">
                        <div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                            STARTING FROM
                          </span>

                          <p className="text-2xl sm:text-3xl font-black text-[#E91E63] my-0.5 tracking-tight">
                            {formattedStartingPrice}
                          </p>

                          <span className="text-[9px] text-gray-400 font-medium block">
                            per person
                          </span>
                        </div>

                        <div className="w-full">
                          {/* Buttons */}
                          <div className="flex items-center gap-2 w-full justify-start">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectTour(tour);
                              }}
                              className="flex-1 px-3 py-2 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-[#E91E63] hover:bg-pink-600 text-white shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95 text-center"
                            >
                              VIEW DETAILS
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenBooking(tour, "sharing");
                              }}
                              className="flex-1 px-3 py-2 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-[#200B3B] hover:bg-[#2D1347] text-white shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95 text-center"
                            >
                              BOOK NOW
                            </button>
                          </div>

                          {/* Instant Inquiry */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWhatsAppInquiry(tour);
                            }}
                            className="flex items-center justify-center gap-1.5 mt-2.5 text-[10px] font-bold text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer group/inq"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                            <span className="group-hover/inq:underline">INSTANT INQUIRY</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── BOOKING MODAL & PRINT SLIP ─────────────────────────────────────────── */}
      {/* ========================================================================= */}
      {isBookingModalOpen && bookingTour && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/70 backdrop-blur-sm print:p-0 print:bg-white print:static">
          <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 print:border-none print:shadow-none print:max-w-none print:max-h-none">
            {/* Modal Header (Fixed at top with Selected Flight Option & Total Estimate) */}
            <div className="bg-gradient-to-r from-[#200B3B] via-[#3B145C] to-[#200B3B] text-white p-4 sm:p-5 flex-shrink-0 border-b border-white/10 print:hidden space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-pink-300 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <Plane size={20} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black leading-tight">
                      Helicopter Service Reservation
                    </h3>
                    <p className="text-xs text-pink-200/80 font-medium line-clamp-1">
                      {bookingTour.title}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Header Summary Strip: Flight Option & Total Estimate */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/15">
                <div>
                  <span className="text-[9px] font-black uppercase text-pink-200/90 block tracking-wider">
                    SELECTED FLIGHT OPTION
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs sm:text-sm font-black text-white">
                      {bookingFlightOption === "charter"
                        ? "Private Charter"
                        : "Sharing Heli Service"}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[9px] font-black uppercase text-pink-200/90 block tracking-wider">
                    TOTAL ESTIMATE
                  </span>
                  <span className="text-sm sm:text-base font-black text-[#FF69B4] tracking-tight block mt-0.5">
                    {displayPrice(
                      bookingTotalPriceNPR,
                      selectedCurrency,
                      nprPerOneDollar,
                      nprPerOneINR
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Content (Scrollable to fit any screen height) */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 overscroll-contain">
              {!isSubmitted ? (
                /* ── STEP 1: SUBMISSION FORM ── */
                <form onSubmit={handleFormSubmit} noValidate className="space-y-4 sm:space-y-5">
                  {/* Validation Error Banner */}
                  {Object.keys(formErrors).length > 0 &&
                    Object.values(formErrors).some(Boolean) && (
                      <div className="p-3 rounded-2xl bg-red-50/90 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                        <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                        <span>Please correct the highlighted fields before submitting.</span>
                      </div>
                    )}

                  {/* ── APPLICANT SELECTOR TABS (Shown prominently when paxCount > 1, sharing only) ── */}
                  {bookingFlightOption !== "charter" && bookingSeatCount > 1 && (
                    <div className="bg-gradient-to-r from-purple-50/90 via-pink-50/40 to-purple-50/90 p-3 rounded-2xl border border-purple-200/80 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap px-0.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-[#200B3B] text-white flex items-center justify-center text-[10px] font-black">
                            {bookingSeatCount}
                          </div>
                          <h4 className="text-xs font-black text-[#200B3B] uppercase tracking-wider">
                            Applicants ({bookingSeatCount})
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-[#E91E63] bg-pink-100/80 px-2.5 py-0.5 rounded-full border border-pink-200">
                          Editing: Applicant {activeApplicantIndex + 1} of {bookingSeatCount}
                        </span>
                      </div>

                      {/* Scrollable Tabs for Applicants */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                        {Array.from({ length: bookingSeatCount }, (_, idx) => {
                          const isActive = idx === activeApplicantIndex;
                          const app = bookingFormData.applicants?.[idx] || {
                            fullName: "",
                            nationality: "",
                            idNumber: "",
                            bodyWeightKg: "",
                            luggageKg: "",
                            email: "",
                            phoneCode: "+977",
                            phone: "",
                            preferredDate: "",
                            pickupHotel: "",
                            file: null,
                          };
                          const isFilled =
                            Boolean(app.fullName?.trim()) &&
                            Boolean(app.nationality?.trim()) &&
                            Boolean(app.idNumber?.trim()) &&
                            app.bodyWeightKg !== "" &&
                            app.bodyWeightKg !== null &&
                            app.bodyWeightKg !== undefined &&
                            Boolean(app.email?.trim()) &&
                            Boolean(app.phone?.trim()) &&
                            Boolean(app.preferredDate);
                          const hasError = Object.keys(formErrors).some(
                            (k) => k.startsWith(`applicant_${idx}_`) && Boolean(formErrors[k]) && touchedFields[k]
                          );

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveApplicantIndex(idx)}
                              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 border ${
                                isActive
                                  ? "bg-gradient-to-r from-[#200B3B] to-[#E91E63] text-white border-transparent shadow-sm shadow-pink-500/25"
                                  : hasError
                                  ? "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                                  : isFilled
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                                  : "bg-white text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-300"
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                                  isActive
                                    ? "bg-white/20 text-white"
                                    : hasError
                                    ? "bg-red-200 text-red-800"
                                    : isFilled
                                    ? "bg-emerald-200 text-emerald-800"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <span className="whitespace-nowrap font-extrabold">
                                Applicant {idx + 1}
                              </span>
                              {hasError && !isActive ? (
                                <AlertCircle size={12} className="text-red-600" />
                              ) : isFilled && !isActive ? (
                                <Check size={12} className="text-emerald-600 stroke-[3]" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── ALL DETAILS FOR CURRENT ACTIVE APPLICANT (As marked in image) ── */}
                  {(() => {
                    const currentApp = bookingFormData.applicants?.[activeApplicantIndex] || {
                      fullName: "",
                      nationality: "",
                      idNumber: "",
                      bodyWeightKg: "",
                      luggageKg: "",
                      email: "",
                      phoneCode: "+977",
                      phone: "",
                      preferredDate: "",
                      pickupHotel: "",
                      passportFile: null,
                      photoFile: null,
                      flightFile: null,
                      hotelFile: null,
                      insuranceFile: null,
                    };

                    return (
                      <div className="space-y-4">
                        {/* ── CARD 1: PERSONAL DETAILS ── */}
                        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-xs space-y-3.5">
                          {/* Section Header */}
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-[#200B3B]">
                              <div className="w-6 h-6 rounded-lg bg-pink-100 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                                <User size={13} />
                              </div>
                              <h4 className="text-xs font-black uppercase tracking-wider">
                                1. Personal Details{" "}
                                {bookingFlightOption !== "charter" && bookingSeatCount > 1
                                  ? `— Applicant ${activeApplicantIndex + 1}`
                                  : ""}
                              </h4>
                            </div>
                            {bookingFlightOption !== "charter" && bookingSeatCount > 1 && (
                              <span className="text-[10px] font-bold text-gray-500">
                                Passenger {activeApplicantIndex + 1} of {bookingSeatCount}
                              </span>
                            )}
                          </div>

                          {/* Inputs Row 1: Full Name & Nationality */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label className="text-[10px] font-black uppercase text-[#200B3B] block mb-1">
                                FULL NAME (AS PRINTED ON PASSPORT) *
                              </label>
                              <input
                                type="text"
                                value={currentApp.fullName}
                                onChange={(e) =>
                                  handleApplicantChange(activeApplicantIndex, "fullName", e.target.value)
                                }
                                onBlur={() => handleApplicantBlur(activeApplicantIndex, "fullName")}
                                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-800 focus:outline-none transition-colors ${
                                  formErrors[`applicant_${activeApplicantIndex}_fullName`] &&
                                  touchedFields[`applicant_${activeApplicantIndex}_fullName`]
                                    ? "border-red-400 bg-red-50/20 focus:border-red-500"
                                    : "border-gray-200 focus:border-[#E91E63]"
                                }`}
                              />
                              {formErrors[`applicant_${activeApplicantIndex}_fullName`] &&
                                touchedFields[`applicant_${activeApplicantIndex}_fullName`] && (
                                  <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle size={11} className="flex-shrink-0" />
                                    {formErrors[`applicant_${activeApplicantIndex}_fullName`]}
                                  </span>
                                )}
                            </div>

                            <div>
                              <label className="text-[10px] font-black uppercase text-[#200B3B] block mb-1">
                                NATIONALITY *
                              </label>
                              <input
                                type="text"
                                value={currentApp.nationality}
                                onChange={(e) =>
                                  handleApplicantChange(activeApplicantIndex, "nationality", e.target.value)
                                }
                                onBlur={() => handleApplicantBlur(activeApplicantIndex, "nationality")}
                                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-800 focus:outline-none transition-colors ${
                                  formErrors[`applicant_${activeApplicantIndex}_nationality`] &&
                                  touchedFields[`applicant_${activeApplicantIndex}_nationality`]
                                    ? "border-red-400 bg-red-50/20 focus:border-red-500"
                                    : "border-gray-200 focus:border-[#E91E63]"
                                }`}
                              />
                              {formErrors[`applicant_${activeApplicantIndex}_nationality`] &&
                                touchedFields[`applicant_${activeApplicantIndex}_nationality`] && (
                                  <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle size={11} className="flex-shrink-0" />
                                    {formErrors[`applicant_${activeApplicantIndex}_nationality`]}
                                  </span>
                                )}
                            </div>
                          </div>

                          {/* Row 2: Passport / NID */}
                          <div>
                            <label className="text-[10px] font-black uppercase text-[#200B3B] block mb-1">
                              PASSPORT / CITIZENSHIP / NID NUMBER *
                            </label>
                            <input
                              type="text"
                              value={currentApp.idNumber}
                              onChange={(e) =>
                                handleApplicantChange(activeApplicantIndex, "idNumber", e.target.value)
                              }
                              onBlur={() => handleApplicantBlur(activeApplicantIndex, "idNumber")}
                              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-800 focus:outline-none transition-colors ${
                                formErrors[`applicant_${activeApplicantIndex}_idNumber`] &&
                                touchedFields[`applicant_${activeApplicantIndex}_idNumber`]
                                  ? "border-red-400 bg-red-50/20 focus:border-red-500"
                                  : "border-gray-200 focus:border-[#E91E63]"
                              }`}
                            />
                            {formErrors[`applicant_${activeApplicantIndex}_idNumber`] &&
                              touchedFields[`applicant_${activeApplicantIndex}_idNumber`] && (
                                <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                  <AlertCircle size={11} className="flex-shrink-0" />
                                  {formErrors[`applicant_${activeApplicantIndex}_idNumber`]}
                                </span>
                              )}
                          </div>

                          {/* Row 3: CAAN Weight & Luggage Box */}
                          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                            <div className="flex items-center justify-between">
                              <h6 className="text-[10.5px] font-black uppercase tracking-wider text-amber-900">
                                BODY WEIGHT &amp; LUGGAGE (CAAN HIGH-ALTITUDE)
                              </h6>
                              <span className="text-[9px] font-bold text-amber-800/80">
                                MAX 20 KG LUGGAGE
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              <div>
                                <label className="text-[9.5px] font-bold uppercase text-amber-900 block mb-1">
                                  APPROXIMATE WEIGHT (KG) *
                                </label>
                                <input
                                  type="number"
                                  min={20}
                                  max={160}
                                  value={currentApp.bodyWeightKg}
                                  onChange={(e) =>
                                    handleApplicantChange(activeApplicantIndex, "bodyWeightKg", e.target.value)
                                  }
                                  onBlur={() => handleApplicantBlur(activeApplicantIndex, "bodyWeightKg")}
                                  className={`w-full px-3 py-2 rounded-xl bg-white border text-xs font-bold text-gray-800 focus:outline-none transition-colors ${
                                    formErrors[`applicant_${activeApplicantIndex}_bodyWeightKg`] &&
                                    touchedFields[`applicant_${activeApplicantIndex}_bodyWeightKg`]
                                      ? "border-red-500 bg-red-50/30"
                                      : "border-amber-300 focus:border-amber-500"
                                  }`}
                                />
                                {formErrors[`applicant_${activeApplicantIndex}_bodyWeightKg`] &&
                                  touchedFields[`applicant_${activeApplicantIndex}_bodyWeightKg`] && (
                                    <span className="text-[10px] font-bold text-red-600 mt-1 flex items-center gap-1">
                                      <AlertCircle size={11} className="flex-shrink-0" />
                                      {formErrors[`applicant_${activeApplicantIndex}_bodyWeightKg`]}
                                    </span>
                                  )}
                              </div>

                              <div>
                                <label className="text-[9.5px] font-bold uppercase text-amber-900 block mb-1">
                                  LUGGAGE (MAX 20 KG PER PERSON)
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  max={20}
                                  value={currentApp.luggageKg}
                                  onChange={(e) =>
                                    handleApplicantChange(activeApplicantIndex, "luggageKg", e.target.value)
                                  }
                                  onBlur={() => handleApplicantBlur(activeApplicantIndex, "luggageKg")}
                                  className={`w-full px-3 py-2 rounded-xl bg-white border text-xs font-bold text-gray-800 focus:outline-none transition-colors ${
                                    formErrors[`applicant_${activeApplicantIndex}_luggageKg`] &&
                                    touchedFields[`applicant_${activeApplicantIndex}_luggageKg`]
                                      ? "border-red-500 bg-red-50/30"
                                      : "border-amber-300 focus:border-amber-500"
                                  }`}
                                />
                                {formErrors[`applicant_${activeApplicantIndex}_luggageKg`] &&
                                  touchedFields[`applicant_${activeApplicantIndex}_luggageKg`] && (
                                    <span className="text-[10px] font-bold text-red-600 mt-1 flex items-center gap-1">
                                      <AlertCircle size={11} className="flex-shrink-0" />
                                      {formErrors[`applicant_${activeApplicantIndex}_luggageKg`]}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ── CARD 2: FLIGHT LOGISTICS & CONTACT ── */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-4">
                          <div className="flex items-center gap-2 pb-2 border-b border-gray-200/60 text-[#200B3B]">
                            <div className="w-6 h-6 rounded-lg bg-pink-100 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                              <Calendar size={13} />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-wider">
                              2. Flight Logistics &amp; Contact{" "}
                              {bookingFlightOption !== "charter" && bookingSeatCount > 1
                                ? `— Applicant ${activeApplicantIndex + 1}`
                                : ""}
                            </h4>
                          </div>

                          {/* WhatsApp & Email */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-black uppercase text-[#200B3B] block mb-1">
                                EMAIL ADDRESS *
                              </label>
                              <input
                                type="email"
                                value={currentApp.email}
                                onChange={(e) =>
                                  handleApplicantChange(activeApplicantIndex, "email", e.target.value)
                                }
                                onBlur={() => handleApplicantBlur(activeApplicantIndex, "email")}
                                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-800 focus:outline-none transition-colors ${
                                  formErrors[`applicant_${activeApplicantIndex}_email`] &&
                                  touchedFields[`applicant_${activeApplicantIndex}_email`]
                                    ? "border-red-400 bg-red-50/20 focus:border-red-500"
                                    : "border-gray-200 focus:border-[#E91E63]"
                                }`}
                              />
                              {formErrors[`applicant_${activeApplicantIndex}_email`] &&
                                touchedFields[`applicant_${activeApplicantIndex}_email`] && (
                                  <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle size={11} className="flex-shrink-0" />
                                    {formErrors[`applicant_${activeApplicantIndex}_email`]}
                                  </span>
                                )}
                            </div>

                            <div>
                              <label className="text-[10px] font-black uppercase text-[#200B3B] block mb-1">
                                WHATSAPP PHONE NUMBER *
                              </label>
                              <div
                                className={`flex rounded-xl border overflow-hidden transition-all ${
                                  formErrors[`applicant_${activeApplicantIndex}_phone`] &&
                                  touchedFields[`applicant_${activeApplicantIndex}_phone`]
                                    ? "border-red-400 bg-red-50/20 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500"
                                    : "border-gray-200 focus-within:border-[#E91E63] focus-within:ring-1 focus-within:ring-[#E91E63] bg-white"
                                }`}
                              >
                                <select
                                  value={currentApp.phoneCode || "+977"}
                                  onChange={(e) =>
                                    handleApplicantChange(activeApplicantIndex, "phoneCode", e.target.value)
                                  }
                                  className="flex-shrink-0 bg-gray-50 border-r border-gray-200 px-2.5 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                                  style={{ maxWidth: "135px" }}
                                >
                                  {COUNTRY_CODES.map((c) => (
                                    <option key={`${c.iso}-${c.code}`} value={c.code}>
                                      {isoToFlag(c.iso)} {c.code} ({c.iso})
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="tel"
                                  value={currentApp.phone}
                                  onChange={(e) =>
                                    handleApplicantChange(activeApplicantIndex, "phone", e.target.value)
                                  }
                                  onBlur={() => handleApplicantBlur(activeApplicantIndex, "phone")}
                                  className="flex-1 min-w-0 px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none bg-transparent"
                                />
                              </div>
                              {formErrors[`applicant_${activeApplicantIndex}_phone`] &&
                                touchedFields[`applicant_${activeApplicantIndex}_phone`] && (
                                  <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle size={11} className="flex-shrink-0" />
                                    {formErrors[`applicant_${activeApplicantIndex}_phone`]}
                                  </span>
                                )}
                            </div>
                          </div>

                          {/* Flight Date & Pickup Hotel */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-black uppercase text-[#200B3B] block mb-1">
                                PREFERRED FLIGHT DATE *
                              </label>
                              <input
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={currentApp.preferredDate}
                                onChange={(e) =>
                                  handleApplicantChange(activeApplicantIndex, "preferredDate", e.target.value)
                                }
                                onBlur={() => handleApplicantBlur(activeApplicantIndex, "preferredDate")}
                                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-800 focus:outline-none transition-colors ${
                                  formErrors[`applicant_${activeApplicantIndex}_preferredDate`] &&
                                  touchedFields[`applicant_${activeApplicantIndex}_preferredDate`]
                                    ? "border-red-400 bg-red-50/20 focus:border-red-500"
                                    : "border-gray-200 focus:border-[#E91E63]"
                                }`}
                              />
                              {formErrors[`applicant_${activeApplicantIndex}_preferredDate`] &&
                                touchedFields[`applicant_${activeApplicantIndex}_preferredDate`] && (
                                  <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle size={11} className="flex-shrink-0" />
                                    {formErrors[`applicant_${activeApplicantIndex}_preferredDate`]}
                                  </span>
                                )}
                            </div>

                            <div>
                              <label className="text-[10px] font-black uppercase text-[#200B3B] block mb-1">
                                PICKUP HOTEL IN KATHMANDU / POKHARA
                              </label>
                              <input
                                type="text"
                                value={currentApp.pickupHotel}
                                onChange={(e) =>
                                  handleApplicantChange(activeApplicantIndex, "pickupHotel", e.target.value)
                                }
                                onBlur={() => handleApplicantBlur(activeApplicantIndex, "pickupHotel")}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#E91E63] text-xs font-semibold text-gray-800 focus:outline-none transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        {/* ── CARD 3: DOCUMENT ATTACHMENTS ── */}
                        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-xs space-y-3.5">
                          {/* Hidden file inputs */}
                          <input
                            ref={passportRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleApplicantDocChange(activeApplicantIndex, "passportFile", e.target.files[0]);
                              }
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                          <input
                            ref={photoRef}
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleApplicantDocChange(activeApplicantIndex, "photoFile", e.target.files[0]);
                              }
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                          <input
                            ref={flightRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleApplicantDocChange(activeApplicantIndex, "flightFile", e.target.files[0]);
                              }
                              e.target.value = "";
                            }}
                            className="hidden"
                          />

                          <input
                            ref={insuranceRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleApplicantDocChange(activeApplicantIndex, "insuranceFile", e.target.files[0]);
                              }
                              e.target.value = "";
                            }}
                            className="hidden"
                          />

                          {/* Section Header */}
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-[#200B3B]">
                              <div className="w-6 h-6 rounded-lg bg-pink-100 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                                <UploadCloud size={13} />
                              </div>
                              <h4 className="text-xs font-black uppercase tracking-wider">
                                3. Document Attachments
                              </h4>
                            </div>
                          </div>

                          <p className="text-[11px] text-gray-500 -mt-1 font-medium">
                            Attach files{bookingFlightOption !== "charter" && bookingSeatCount > 1 ? ` for Applicant ${activeApplicantIndex + 1}` : ""} or send later via WhatsApp. Accepted: PDF, JPG, PNG (max 10 MB each).
                          </p>

                          <div className="space-y-2.5">
                            {[
                              {
                                label: "Passport / National ID",
                                required: true,
                                ref: passportRef,
                                file: currentApp.passportFile,
                                clear: () => handleApplicantDocChange(activeApplicantIndex, "passportFile", null),
                                hint: bookingFlightOption !== "charter" && bookingSeatCount > 1
                                  ? `Clear color copy of Applicant ${activeApplicantIndex + 1}'s passport (valid ≥ 6 months)`
                                  : `Clear color copy of your passport (valid ≥ 6 months)`,
                              },
                              {
                                label: "Passport Size Photo",
                                required: true,
                                ref: photoRef,
                                file: currentApp.photoFile,
                                clear: () => handleApplicantDocChange(activeApplicantIndex, "photoFile", null),
                                hint: bookingFlightOption !== "charter" && bookingSeatCount > 1
                                  ? `White background, digital copy for Applicant ${activeApplicantIndex + 1}`
                                  : `White background, digital copy`,
                              },
                              {
                                label: "Confirmed Return Flight Ticket",
                                required: false,
                                ref: flightRef,
                                file: currentApp.flightFile,
                                clear: () => handleApplicantDocChange(activeApplicantIndex, "flightFile", null),
                                hint: "PDF or screenshot of round-trip reservation",
                              },

                              {
                                label: "Travel Insurance",
                                required: false,
                                ref: insuranceRef,
                                file: currentApp.insuranceFile,
                                clear: () => handleApplicantDocChange(activeApplicantIndex, "insuranceFile", null),
                                hint: "Travel/medical insurance with emergency helicopter evacuation coverage (optional if required)",
                              },
                            ].map((field) => (
                              <div
                                key={field.label}
                                className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border ${
                                  field.file
                                    ? "bg-emerald-50/60 border-emerald-200"
                                    : "bg-white border-gray-200 hover:border-[#E91E63]"
                                } transition-all`}
                              >
                                {/* Left: icon + label */}
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                      field.file
                                        ? "bg-emerald-100 text-emerald-600"
                                        : "bg-pink-50 text-[#E91E63]"
                                    }`}
                                  >
                                    {field.file ? (
                                      <CheckCircle2 size={16} />
                                    ) : (
                                      <FileText size={15} />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-[#200B3B] flex items-center gap-1.5 flex-wrap">
                                      <span>{field.label}</span>
                                      {field.required ? (
                                        <span className="text-[#E91E63] font-black">*</span>
                                      ) : (
                                        <span className="text-[9px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                          Optional
                                        </span>
                                      )}
                                    </p>
                                    {field.file ? (
                                      <p className="text-[10px] text-emerald-700 font-semibold truncate max-w-[200px] sm:max-w-xs">
                                        {field.file.name}{" "}
                                        <span className="text-emerald-500 font-normal">
                                          ({(field.file.size / 1024).toFixed(0)} KB)
                                        </span>
                                      </p>
                                    ) : (
                                      <p className="text-[10px] text-gray-400">{field.hint}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Right: attach / remove */}
                                {field.file ? (
                                  <button
                                    type="button"
                                    onClick={field.clear}
                                    className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-[10px] font-bold transition-colors cursor-pointer border border-red-200"
                                  >
                                    <Trash2 size={11} />
                                    Remove
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => field.ref.current?.click()}
                                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#E91E63] text-xs font-bold transition-colors cursor-pointer border border-pink-200 shadow-2xs"
                                  >
                                    <UploadCloud size={13} />
                                    Attach
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>


                      </div>
                    );
                  })()}

                  {/* Terms & Conditions */}
                  <div>
                    <label className="flex items-start gap-2 text-[10.5px] text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bookingFormData.termsAgreed}
                        onChange={(e) => handleFieldChange("termsAgreed", e.target.checked)}
                        className="mt-0.5 accent-[#E91E63]"
                      />
                      <span>
                        I declare that all passenger information &amp; body weight details are accurate. I understand that alpine flights are subject to CAAN safety regulations and weather permits.
                      </span>
                    </label>
                    {formErrors.termsAgreed && touchedFields.termsAgreed && (
                      <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={11} className="flex-shrink-0" />
                        {formErrors.termsAgreed}
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#E91E63] hover:bg-pink-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <Plane size={16} />
                    <span>CONFIRM &amp; SUBMIT HELI RESERVATION</span>
                  </button>
                </form>
              ) : (
                /* ── STEP 2: SUBMISSION CONFIRMATION & PRINT SLIP ── */
                <div className="space-y-6">
                  {/* Success Banner */}
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 print:hidden">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 size={24} />
                    </div>
                    <h4 className="text-lg font-black text-emerald-900">
                      Heli Flight Reservation Submitted!
                    </h4>
                    <p className="text-xs text-emerald-700 font-medium max-w-md mx-auto">
                      Thank you, <strong className="font-bold">{bookingFormData.fullName}</strong>. Our Flight Operations Desk has received your request and is verifying CAAN runway slots for your requested date.
                    </p>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-300 text-xs font-black text-emerald-900 mt-1">
                      <span>Booking Reference: {submissionId}</span>
                    </div>
                  </div>

                  {/* ── PRINTABLE VOUCHER / BOOKING SLIP ── */}
                  <div className="p-6 rounded-3xl bg-white border border-gray-200 space-y-5 shadow-xs text-left">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <img src={THTTLogo} alt="Trip Himalaya" className="h-10 object-contain" />
                        <div>
                          <h4 className="text-xs font-black uppercase text-[#200B3B]">
                            TRIP HIMALAYA TOURS &amp; TRAVELS
                          </h4>
                          <p className="text-[9.5px] text-gray-500">
                            Authorized Heli Charter &amp; Himalayan Expeditions Operator
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-bold text-gray-400 block uppercase">
                          STATUS
                        </span>
                        <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md inline-block">
                          SLOT RESERVED
                        </span>
                      </div>
                    </div>

                    {/* Booking Reference & Flight Info */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50 p-4 rounded-2xl">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-gray-400 block">
                          BOOKING ID
                        </span>
                        <span className="font-black text-[#200B3B]">{submissionId}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase text-gray-400 block">
                          DATE ISSUED
                        </span>
                        <span className="font-semibold text-gray-800">{submittedAt}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase text-gray-400 block">
                          FLIGHT OPTION
                        </span>
                        <span className="font-black text-[#E91E63] uppercase">
                          {bookingFlightOption}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase text-gray-400 block">
                          DEPARTURE DATE
                        </span>
                        <span className="font-semibold text-gray-800">
                          {bookingFormData.preferredDate || "Immediate"}
                        </span>
                      </div>
                    </div>

                    {/* Passenger Manifest & Weight Details */}
                    <div className="space-y-3 text-xs">
                      <h5 className="text-[10px] font-black uppercase text-[#200B3B] tracking-wider flex items-center justify-between">
                        <span>
                          PASSENGER &amp; FLIGHT MANIFEST (
                          {bookingSeatCount} PASSENGER
                          {bookingSeatCount > 1 ? "S" : ""}
                          )
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold">
                          CAAN HIGH-ALTITUDE MANIFEST
                        </span>
                      </h5>

                      <div className="space-y-2">
                        {Array.from(
                          { length: Math.max(1, bookingSeatCount || 1) },
                          (_, idx) => {
                            const app = bookingFormData.applicants?.[idx] || {
                              fullName: bookingFormData.fullName,
                              nationality: bookingFormData.nationality,
                              idNumber: bookingFormData.idNumber,
                              bodyWeightKg: bookingFormData.bodyWeightKg,
                              luggageKg: bookingFormData.luggageKg,
                            };
                            return (
                              <div
                                key={idx}
                                className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-700 text-xs"
                              >
                                <div className="flex items-center justify-between font-bold text-[#200B3B] mb-1.5">
                                  <span>
                                    Applicant {idx + 1}: {app.fullName || (idx === 0 ? bookingFormData.fullName : `Passenger ${idx + 1}`)}
                                  </span>
                                  <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-pink-50 text-[#E91E63] font-black">
                                    {idx === 0 ? "Lead Traveler" : `Pax ${idx + 1}`}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-600">
                                  <div>
                                    <strong>Nationality:</strong> {app.nationality || bookingFormData.nationality}
                                  </div>
                                  <div>
                                    <strong>Weight:</strong> {app.bodyWeightKg || bookingFormData.bodyWeightKg} kg
                                  </div>
                                  <div>
                                    <strong>Luggage:</strong>{" "}
                                    {app.luggageKg ? `${app.luggageKg} kg` : "0 kg"}
                                  </div>
                                  <div>
                                    <strong>ID / Passport:</strong> {app.idNumber || bookingFormData.idNumber}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 pt-2 border-t border-gray-100">
                        <div>
                          <strong>Pickup Hotel:</strong> {bookingFormData.pickupHotel}
                        </div>
                        <div>
                          <strong>WhatsApp:</strong> {bookingFormData.phoneCode} {bookingFormData.phone}
                        </div>
                        <div>
                          <strong>Email:</strong> {bookingFormData.email}
                        </div>
                        <div>
                          <strong>Departure Date:</strong> {bookingFormData.preferredDate || "Immediate"}
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-600">
                        Estimated Flight Package Total:
                      </span>
                      <span className="text-base font-black text-[#E91E63]">
                        {displayPrice(
                          bookingTotalPriceNPR,
                          selectedCurrency,
                          nprPerOneDollar,
                          nprPerOneINR
                        )}
                      </span>
                    </div>

                    {/* Operational Contacts */}
                    <div className="p-3 bg-gray-50 rounded-xl text-[9.5px] text-gray-500 space-y-1">
                      <div>
                        <strong className="text-gray-800">24/7 Heli Flight Operations Desk:</strong>{" "}
                        +977 9851403761 | info@triphimalaya.com
                      </div>
                      <div>
                        <strong className="text-gray-800">Helipad Ground Dispatch:</strong> Tribhuvan International Airport, Domestic Terminal, VIP Helipad Section.
                      </div>
                    </div>
                  </div>

                  {/* Actions: Print Slip, WhatsApp, Close */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 print:hidden">
                    <button
                      type="button"
                      onClick={handlePrintBookingSlip}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#200B3B] hover:bg-[#2D1347] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Printer size={15} />
                      <span>PRINT BOOKING SLIP</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const msg = encodeURIComponent(
                          `Hello Trip Himalaya! I just booked "${bookingTour.title}" with Reference ID: ${submissionId}. Lead Passenger: ${bookingFormData.fullName}. Preferred Date: ${bookingFormData.preferredDate}. Please confirm my heli flight slot.`
                        );
                        window.open(`https://wa.me/9779851403761?text=${msg}`, "_blank", "noopener,noreferrer");
                      }}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <MessageCircle size={15} />
                      <span>CONFIRM ON WHATSAPP</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsBookingModalOpen(false)}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageHeliService;
