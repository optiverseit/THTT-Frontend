export interface InsuranceCostOption {
  name: string;
  days: string;
  nprPrice: number;
  usdPrice: number;
  coverageLimit: string;
  description: string;
}

export interface InsurancePlan {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  maxAltitude: string;
  priceUSD: number;
  baseNPRPrice: number;
  durationCovered: string;
  coverageLimit: string;
  highlights: string[];
  inclusions: string[];
  isPopular?: boolean;
  heroImage: string;
  aboutText: string;
  requirementDocuments: string[];
  termsAndConditions: string[];
  costOptions: InsuranceCostOption[];
  emergencyHelpline?: string;
  claimSettlement?: string;
}

export const INSURANCE_PLANS: InsurancePlan[] = [
  {
    id: "plan-trek-standard",
    name: "Standard Cultural & Foothill Plan",
    badge: "Low Altitude",
    badgeColor: "bg-blue-100 text-blue-800",
    maxAltitude: "Up to 3,000 Meters",
    priceUSD: 28,
    baseNPRPrice: 4300,
    durationCovered: "Up to 10 Days",
    coverageLimit: "$50,000 Medical Sum",
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1400",
    highlights: [
      "Kathmandu, Pokhara, Chitwan & Short Hikes",
      "Poon Hill, Nagarkot & Dhampus Trails",
      "Emergency Road Ambulance & Clinic Care",
      "Lost Luggage & Passport Theft Cover",
    ],
    inclusions: [
      "Outpatient & Inpatient Hospitalization up to $50,000",
      "Emergency road ambulance & ground medical transfers",
      "Luggage delay and personal effects loss allowance",
      "Trip cancellation & flight delay allowance",
      "24/7 Global emergency multilingual assistance hotline",
      "Loss of travel documents, passport re-issuance support",
    ],
    aboutText:
      "Designed specifically for cultural travelers, city explorers, and gentle foothill trekkers in Nepal. This plan provides robust financial and medical protection for journeys capped at 3,000 meters, covering destinations like Kathmandu Valley, Pokhara, Chitwan National Park, Nagarkot, and the Ghorepani Poon Hill panoramic trail. With cashless admission to premier clinics in Kathmandu and Pokhara, travelers can enjoy peace of mind throughout their scenic stay.",
    requirementDocuments: [
      "Passport, NID, or Citizenship scanned copy (clear color copy)",
      "Recent passport-sized digital photograph (white background)",
      "Trekking Permit / Itinerary (Optional)",
      "Next of Kin emergency contact details (full name & phone number)",
      "Basic health self-declaration (no specialized medical tests required)",
    ],
    termsAndConditions: [
      "Altitude limit: Strictly covers altitudes up to 3,000 meters above sea level.",
      "Helicopter rescue is not included in this low-altitude foothill policy; road ambulance is fully covered.",
      "Hospitalization claims must be reported to our 24/7 emergency hotline within 24 hours of admission.",
      "Loss of personal baggage requires a local police report filed within 24 hours of the incident.",
      "Cancellations and premium refunds are permitted up to 48 hours prior to the policy start date.",
    ],
    costOptions: [
      {
        name: "Foothill 7 Days",
        days: "7 Days",
        nprPrice: 3200,
        usdPrice: 21,
        coverageLimit: "$50,000",
        description: "Ideal for short city tours, Nagarkot & Pokhara getaways",
      },
      {
        name: "Standard 10 Days",
        days: "10 Days",
        nprPrice: 4300,
        usdPrice: 28,
        coverageLimit: "$50,000",
        description: "Recommended for Poon Hill, Dhampus & cultural circuits",
      },
      {
        name: "Extended 21 Days",
        days: "21 Days",
        nprPrice: 7200,
        usdPrice: 47,
        coverageLimit: "$50,000",
        description: "Comprehensive multi-city holidays and long foothill trails",
      },
    ],
  },
  {
    id: "plan-high-altitude",
    name: "High-Altitude Alpine & Heli Rescue",
    badge: "Most Popular in Nepal",
    badgeColor: "bg-[#E11D48] text-white",
    maxAltitude: "Up to 6,000 Meters",
    priceUSD: 75,
    baseNPRPrice: 11500,
    durationCovered: "Up to 15 Days",
    isPopular: true,
    coverageLimit: "$100,000 + Unlimited Heli Rescue",
    heroImage: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&q=80&w=1400",
    highlights: [
      "Everest Base Camp, Gokyo & Annapurna Circuit",
      "Immediate 45-Min Helicopter Evacuation",
      "Cashless Admission in Kathmandu & Pokhara Hospitals",
      "Altitude Sickness (AMS), HAPE, HACE & Frostbite",
    ],
    inclusions: [
      "Direct alpine helicopter search, rescue & emergency airlift",
      "Inpatient medical hospitalization with CIWEC & Swacon clinics",
      "Hyperbaric decompression chamber & high-flow oxygen therapy",
      "Trekking guide, porter & wilderness team liability cover",
      "Lukla, Jomsom & mountain airstrip weather delay compensation",
      "Emergency international medical repatriation if required",
      "24/7 Kathmandu Operations Emergency Dispatch Hotline",
    ],
    aboutText:
      "Nepal's definitive trekking insurance, trusted by thousands of trekkers tackling the Himalayas. Standard travel policies strictly exclude altitudes above 2,500m and helicopter rescue—leaving trekkers vulnerable to astronomical $3,000–$5,000 private rescue charges. Our High-Altitude Alpine Plan guarantees uncapped, immediate helicopter rescue up to 6,000m (covering Everest Base Camp 5,364m, Kala Patthar 5,545m, Annapurna Circuit Thorong La Pass 5,416m, Manaslu Larkya La 5,106m, and Gokyo Lakes). We maintain direct billing with Kathmandu's top tourist hospitals (CIWEC, Swacon, Era) with 100% cashless emergency admission.",
    requirementDocuments: [
      "Passport, NID, or Citizenship scanned copy (clear color copy)",
      "Recent passport-sized MRP digital photograph",
      "Trekking Permit / Itinerary (Optional)",
      "Trekking agency name and lead Sherpa / guide contact (if available)",
      "Health & fitness declaration (confirmation of no severe unmanaged cardiovascular or respiratory disease)",
      "Next of Kin emergency contact details (full name & phone number)",
    ],
    termsAndConditions: [
      "Altitude limit: Fully covers all trekking and non-technical alpine trails up to 6,000 meters.",
      "Helicopter rescue is authorized immediately upon confirmation from the trek leader or medical officer; cashless guarantee eliminates personal out-of-pocket deposits.",
      "Direct cashless admission is supported at CIWEC Hospital, Swacon International Hospital, and Era Health Center.",
      "Covers acute altitude illnesses including Acute Mountain Sickness (AMS), High-Altitude Pulmonary Edema (HAPE), and High-Altitude Cerebral Edema (HACE).",
      "All medical evacuations are monitored 24/7 by our Kathmandu Flight Operations Desk.",
    ],
    costOptions: [
      {
        name: "Standard Trek 10 Days",
        days: "10 Days",
        nprPrice: 8500,
        usdPrice: 55,
        coverageLimit: "$100,000 + Heli Rescue",
        description: "Ideal for Langtang Valley or Annapurna Base Camp (ABC)",
      },
      {
        name: "Alpine Trek 15 Days",
        days: "15 Days",
        nprPrice: 11500,
        usdPrice: 75,
        coverageLimit: "$100,000 + Heli Rescue",
        description: "Most popular for Everest Base Camp (EBC) & Gokyo Lakes",
      },
      {
        name: "Circuit & Passes 25 Days",
        days: "25 Days",
        nprPrice: 16800,
        usdPrice: 110,
        coverageLimit: "$100,000 + Heli Rescue",
        description: "Full Annapurna Circuit, Manaslu Circuit & Three Passes Trek",
      },
    ],
  },
  {
    id: "plan-extreme-expedition",
    name: "Extreme Mountaineering & Peak Climbing",
    badge: "Technical Climbing",
    badgeColor: "bg-purple-100 text-purple-800",
    maxAltitude: "Above 6,000 Meters (Uncapped)",
    priceUSD: 160,
    baseNPRPrice: 24500,
    durationCovered: "Up to 30 Days",
    coverageLimit: "$250,000 Comprehensive",
    heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1400",
    highlights: [
      "Island Peak, Mera Peak, Lobuche & 8000m Summits",
      "Rope, Harness, Ice Axe & Crampons Climbing",
      "Advanced High-Altitude Medical Resuscitation & ICU",
      "Emergency International Medical Repatriation Flight",
    ],
    inclusions: [
      "Uncapped altitude cover for all technical climbing & mountaineering peaks",
      "Long-line alpine helicopter rescue extraction from high camps",
      "Advanced trauma surgery, frostbite treatment & ICU hospital care",
      "Specialized air-ambulance international repatriation to home country",
      "High-altitude Sherpa climbing guide & porter emergency rescue pool",
      "Search and rescue logistics coordination with Nepal Army / Civil Aviation",
    ],
    aboutText:
      "Engineered specifically for mountaineers, technical alpinists, and expedition teams scaling Nepal's demanding trekking peaks (Island Peak 6,189m, Mera Peak 6,476m, Lobuche East 6,119m, Ama Dablam 6,812m, and 8,000m summits). Covers technical climbing hazards using ropes, harnesses, crampons, and ice axes. Includes long-line helicopter rescue extraction from extreme high camps, advanced frostbite and trauma resuscitation, and guaranteed international air-ambulance transfer back to your home country.",
    requirementDocuments: [
      "Passport, NID, or Citizenship scanned copy (clear color copy)",
      "NMA or Ministry of Tourism Peak Climbing Permit",
      "Recent passport-sized digital photograph",
      "Trekking Permit / Itinerary (Optional)",
      "Next of Kin emergency contact details and international repatriation protocol",
    ],
    termsAndConditions: [
      "Altitude limit: Uncapped — covers all elevations above 6,000 meters including 7,000m and 8,000m peaks.",
      "Valid for technical mountaineering involving ropes, ice axes, crampons, and fixed-line ascents.",
      "Direct coordination with Nepal Civil Aviation, helicopter rescue charter companies, and Nepal Army.",
      "International repatriation coverage up to $100,000 included in the total $250,000 coverage limit.",
      "Full coverage for climbing Sherpas and support team included under the group mountaineering policy.",
    ],
    costOptions: [
      {
        name: "Peak Climbing 15 Days",
        days: "15 Days",
        nprPrice: 17500,
        usdPrice: 115,
        coverageLimit: "$250,000 Comprehensive",
        description: "Perfect for Island Peak, Mera Peak, or Lobuche East climbing",
      },
      {
        name: "Expedition 30 Days",
        days: "30 Days",
        nprPrice: 24500,
        usdPrice: 160,
        coverageLimit: "$250,000 Comprehensive",
        description: "Recommended for Ama Dablam, Himlung Himal & multi-peak climbs",
      },
      {
        name: "Grand Expedition 45 Days",
        days: "45 Days",
        nprPrice: 34500,
        usdPrice: 225,
        coverageLimit: "$250,000 Comprehensive",
        description: "Full coverage for 8,000m major Himalayan peak expeditions",
      },
    ],
  },
  {
    id: "plan-international",
    name: "Global Outbound & Schengen Compliant",
    badge: "Schengen Visa Approved",
    badgeColor: "bg-emerald-100 text-emerald-800",
    maxAltitude: "Worldwide Coverage",
    priceUSD: 40,
    baseNPRPrice: 6100,
    durationCovered: "Per Trip (Up to 30 Days)",
    coverageLimit: "€30,000 / $50,000 Minimum",
    heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1400",
    highlights: [
      "Europe (Schengen), Dubai, Thailand, USA & Worldwide",
      "Meets 100% Embassy Visa Requirements (€30,000 min)",
      "Instant Embassy-Certified Digital Policy Certificate",
      "Emergency Dental, COVID-19 & Trip Interruption Cover",
    ],
    inclusions: [
      "€30,000 / $50,000 emergency medical expenses & hospitalization",
      "Meets 100% Schengen, UK, US, Dubai & Asian visa regulations",
      "Loss of checked baggage, passport and official travel documents",
      "Flight delay, cancellation, and missed transit flight allowances",
      "Accidental death & permanent total disablement coverage",
      "Instant printable QR-verified certificate for embassy appointments",
    ],
    aboutText:
      "The official international travel medical insurance for Nepali travelers heading abroad. Compliant with 100% of European Schengen embassy visa requirements (covering a mandatory €30,000 minimum medical sum, medical repatriation, and emergency hospital care with zero deductible). Also accepted worldwide for visas to the USA, United Kingdom, Canada, Australia, Japan, Dubai, and Southeast Asia. Receive your digitally certified policy document instantly with an embassy verification seal.",
    requirementDocuments: [
      "Passport, NID, or Citizenship scanned copy (clear color copy)",
      "Recent passport-sized digital photograph",
      "Trekking Permit / Itinerary (Optional)",
      "Next of Kin emergency contact details (full name & phone number)",
      "Destination country visa appointment or travel plan (if applicable)",
    ],
    termsAndConditions: [
      "Guaranteed acceptance at European embassies (France, Germany, Switzerland, Italy, etc.).",
      "Meets European Council Decision 2004/17/EC requirements for Schengen travel medical insurance.",
      "Zero deductible on emergency hospitalization and medical repatriation claims.",
      "Instant policy re-issuance or date shift permitted if visa appointment is rescheduled.",
      "Full premium refund (less NPR 500 admin charge) if visa application is refused by the embassy upon proof of refusal letter.",
    ],
    costOptions: [
      {
        name: "Standard Trip 10 Days",
        days: "10 Days",
        nprPrice: 4200,
        usdPrice: 28,
        coverageLimit: "€30,000 / $50,000",
        description: "Perfect for Dubai, Thailand, Singapore & short holidays",
      },
      {
        name: "Schengen Visa 20 Days",
        days: "20 Days",
        nprPrice: 6100,
        usdPrice: 40,
        coverageLimit: "€30,000 / $50,000",
        description: "Official Schengen embassy compliant tourist / business trip",
      },
      {
        name: "Worldwide 35 Days",
        days: "35 Days",
        nprPrice: 9400,
        usdPrice: 62,
        coverageLimit: "€50,000 / $100,000",
        description: "Extended worldwide travel for USA, UK, Europe & Australia",
      },
    ],
  },
];
