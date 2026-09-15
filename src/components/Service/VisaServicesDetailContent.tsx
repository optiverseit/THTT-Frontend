import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import {
  Shield,
  Clock,
  CheckCircle2,
  Calendar,
  MessageCircle,
  ChevronDown,
  HelpCircle,
  Zap,
  Globe2,
  Search,
  Eye,
  X,
  FileText,
  Check,
  ArrowLeft,
  Printer,
} from "lucide-react";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import VisaCountryDetailView, { VisaDetailPlan, CostOption } from "./VisaCountryDetailView";

export type { VisaDetailPlan, CostOption };



const VISA_PLANS_RAW: VisaDetailPlan[] = [
  {
    id: "uae-30",
    country: "UAE (Dubai / Abu Dhabi)",
    countryCode: "AE",
    region: "middle-east",
    visaType: "Tourist Visa",
    duration: "30 Days Stay",
    processingTime: "3 – 4 Working Days",
    baseNPRPrice: 14500,
    entryType: "Single Entry",
    inclusions: [
      "100% Online Paperless Filing",
      "Embassy Application Fee Assistance",
      "Confirmed Return Flight Ticket Dummy",
      "24/7 Processing Support",
    ],
    popular: true,
    aboutText:
      "UAE tourist visas allow Nepali passport holders to visit Dubai, Abu Dhabi, and other emirates for tourism and leisure. Fast-tracked paperless filing with instant electronic delivery.",
    requirementDocuments: [
      "Clear color copy of Passport (valid for at least 6 months)",
      "Passport size photo (white background, digital copy)",
      "Confirmed return flight ticket",
      "Hotel reservation or host residency proof",
    ],
    termsAndConditions: [
      "Visa fee is strictly non-refundable once applied in immigration portal.",
      "Overstay fine applies per day as per UAE GDRFA regulations.",
      "Flight tickets subject to airline fare cancellation penalties.",
    ],
    costOptions: [
      {
        name: "Single Entry (30 Days)",
        days: "30 Days",
        nprPrice: 14500,
        entryType: "Single Entry",
      },
      {
        name: "Single Entry (60 Days)",
        days: "60 Days",
        nprPrice: 21000,
        entryType: "Single Entry",
      },
    ],
    successfulApplications: "2500+",
    successRate: "99.4%",
  },
  {
    id: "thailand-visit",
    country: "Thailand",
    countryCode: "TH",
    region: "asia",
    visaType: "Visit Visa",
    duration: "30 Days Valid",
    processingTime: "5 – 7 Working Days",
    baseNPRPrice: 5100,
    entryType: "Single Entry",
    inclusions: [
      "Royal Thai Embassy Submission Support",
      "Confirmed Round Trip Ticket Booking",
      "Confirm Hotel Booking Voucher",
      "Certified English Translations & Verification",
    ],
    popular: true,
    aboutText:
      "Nepali passport holders require a pre-approved tourist visa to enter Thailand. Following major policy changes, Nepal is not eligible for Visa on Arrival (VOA), meaning you must secure an e-Visa before booking your travel. Trip Himalaya provides end-to-end guidance for Royal Thai Embassy visa submission, ensuring seamless verification of bank funds, hotel bookings, flight itineraries, and all certified translations.",
    requirementDocuments: [
      "Passport copy",
      "passport size photo",
      "bank statement (up to 6 months closing balance Npr: 200000)",
      "Confirmed Round trip ticket",
      "Confirm hotel booking",
      "Certified English translations for any documents originally in Nepali",
    ],
    termsAndConditions: [
      "Payment fully non-refundable if visa refused",
      "Ticket canceled as per system penalties",
      "hotels payment is fully non-refundable",
    ],
    costOptions: [
      {
        name: "Single Entry",
        days: "30 Days",
        nprPrice: 5100,
        entryType: "Single Entry",
        description: "Standard tourist visit visa",
      },
      {
        name: "Multiple Entry",
        days: "90 Days",
        nprPrice: 7600,
        entryType: "Multiple Entry",
        description: "Frequent traveler multi-entry visit visa",
      },
    ],
    successfulApplications: "1000+",
    successRate: "99%",
  },
  {
    id: "schengen-tourist",
    country: "Schengen (Europe)",
    countryCode: "EU",
    region: "europe",
    visaType: "Visitor / Tourist Visa (Type C)",
    duration: "Up to 90 Days",
    processingTime: "10 – 15 Working Days",
    baseNPRPrice: 18500,
    entryType: "Single / Multiple Entry",
    inclusions: [
      "VFS Global Appointment Scheduling",
      "Embassy-Compliant Travel Insurance Aid",
      "Comprehensive Cover Letter & Day-by-Day Itinerary",
      "Financial Document & Sponsor Dossier Review",
    ],
    popular: true,
  },
  {
    id: "singapore-30",
    country: "Singapore",
    countryCode: "SG",
    region: "asia",
    visaType: "e-Visa / Entry Visa",
    duration: "30 Days Stay",
    processingTime: "3 – 5 Working Days",
    baseNPRPrice: 9200,
    entryType: "Multiple Entry",
    inclusions: [
      "ICA Singapore Authorized Submission",
      "LOI (Letter of Introduction) Guidance",
      "Digital e-Visa Issuance",
      "Full Documentation Counseling",
    ],
  },
  {
    id: "japan-tourist",
    country: "Japan",
    countryCode: "JP",
    region: "asia",
    visaType: "Short-Term Tourist Visa",
    duration: "15 – 30 Days",
    processingTime: "5 – 7 Working Days",
    baseNPRPrice: 12000,
    entryType: "Single Entry",
    inclusions: [
      "Embassy of Japan Kathmandu Submission",
      "Daily Schedule of Stay (Keikakusho) Drafting",
      "Confirmed Hotel & Flight Itineraries",
      "Tax & Bank Certificate Vetting",
    ],
  },
  {
    id: "uk-visitor",
    country: "United Kingdom",
    countryCode: "GB",
    region: "west",
    visaType: "Standard Visitor Visa",
    duration: "6 Months",
    processingTime: "15 Working Days",
    baseNPRPrice: 19500,
    entryType: "Multiple Entry",
    inclusions: [
      "UKVI Online Application Management",
      "VFS Global Kathmandu Biometrics Booking",
      "Financial Statement & Ties to Nepal Audit",
      "Detailed Travel Purpose Statement",
    ],
  },
  {
    id: "usa-b1b2",
    country: "United States (USA)",
    countryCode: "US",
    region: "west",
    visaType: "B1/B2 Tourist & Business",
    duration: "Up to 5 Years",
    processingTime: "Appointment Dependent",
    baseNPRPrice: 17000,
    entryType: "Multiple Entry",
    inclusions: [
      "DS-160 Form Accurate Filing & Review",
      "US Embassy Kathmandu Slot Monitoring",
      "1-on-1 Mock Interview Preparation Session",
      "Document Packaging & Checklist",
    ],
  },
  {
    id: "malaysia-evisa",
    country: "Malaysia",
    countryCode: "MY",
    region: "asia",
    visaType: "Tourist e-Visa",
    duration: "30 Days Stay",
    processingTime: "2 – 4 Working Days",
    baseNPRPrice: 7800,
    entryType: "Single Entry",
    inclusions: [
      "Direct Malaysia eVisa Portal Filing",
      "Confirmed Hotel & Return Flight Proof",
      "High Approval Rate Guarantee",
      "Instant Electronic Delivery via WhatsApp",
    ],
  },
  {
    id: "australia-600",
    country: "Australia",
    countryCode: "AU",
    region: "west",
    visaType: "Visitor Visa (Subclass 600)",
    duration: "3, 6 or 12 Months",
    processingTime: "15 – 20 Working Days",
    baseNPRPrice: 22500,
    entryType: "Multiple Entry",
    inclusions: [
      "ImmiAccount Portal Online Lodgement",
      "Biometrics Collection (VFS Global) Support",
      "Genuine Temporary Entrant (GTE) Statement",
      "Financial & Family Ties Audit",
    ],
    popular: true,
  },
  {
    id: "canada-v1",
    country: "Canada",
    countryCode: "CA",
    region: "west",
    visaType: "Visitor Visa (V-1 / TRV)",
    duration: "Up to 10 Years",
    processingTime: "20 – 30 Working Days",
    baseNPRPrice: 21000,
    entryType: "Multiple Entry",
    inclusions: [
      "IRCC Portal Application Filing",
      "Invitation Letter & Purpose Drafting",
      "VFS Biometrics Appointment Booking",
      "Financial Capability Statement Review",
    ],
    popular: true,
  },
  {
    id: "south-korea-c39",
    country: "South Korea",
    countryCode: "KR",
    region: "asia",
    visaType: "C-3-9 Tourist Visa",
    duration: "Up to 90 Days",
    processingTime: "7 – 10 Working Days",
    baseNPRPrice: 11500,
    entryType: "Single Entry",
    inclusions: [
      "KVAC / Embassy of Republic of Korea Filing",
      "Travel Schedule & Hotel Reservation",
      "Income Tax Certificate Verification",
      "Complete Dossier Organization",
    ],
  },
  {
    id: "qatar-tourist",
    country: "Qatar",
    countryCode: "QA",
    region: "middle-east",
    visaType: "Tourist / Hayya Visa",
    duration: "30 Days Stay",
    processingTime: "2 – 3 Working Days",
    baseNPRPrice: 9500,
    entryType: "Single Entry",
    inclusions: [
      "Hayya Portal Registration & Approval",
      "Discover Qatar Hotel Voucher Assistance",
      "Fast-Track 48-Hour Electronic Delivery",
      "WhatsApp Instant Confirmation",
    ],
  },
  {
    id: "saudi-arabia-evisa",
    country: "Saudi Arabia",
    countryCode: "SA",
    region: "middle-east",
    visaType: "Tourist & Umrah eVisa",
    duration: "90 Days Stay",
    processingTime: "1 – 3 Working Days",
    baseNPRPrice: 16500,
    entryType: "Multiple Entry",
    inclusions: [
      "Official MOFA Portal Submission",
      "Mandatory Travel Medical Insurance",
      "Valid for Tourism, Leisure & Umrah",
      "Fast Electronic Approval Guarantee",
    ],
    popular: true,
  },
  {
    id: "bali-indonesia",
    country: "Indonesia (Bali)",
    countryCode: "ID",
    region: "asia",
    visaType: "Tourist e-VoA / B211A",
    duration: "30 – 60 Days",
    processingTime: "2 – 4 Working Days",
    baseNPRPrice: 8200,
    entryType: "Single Entry",
    inclusions: [
      "Molina Immigration Official e-VoA",
      "Airport Fast-Track Guidance",
      "Extension Assistance Available in Bali",
      "Digital eVisa with QR Code",
    ],
  },
  {
    id: "vietnam-evisa",
    country: "Vietnam",
    countryCode: "VN",
    region: "asia",
    visaType: "Tourist eVisa",
    duration: "30 – 90 Days",
    processingTime: "3 – 4 Working Days",
    baseNPRPrice: 6500,
    entryType: "Single / Multiple Entry",
    inclusions: [
      "Vietnam Immigration Department Submission",
      "Airport Border Entry Gate Pre-registration",
      "No Stamp Fee at Airport Required",
      "Quick WhatsApp Delivery",
    ],
  },
  {
    id: "turkey-evisa",
    country: "Turkey",
    countryCode: "TR",
    region: "europe",
    visaType: "Tourist Visa Assistance",
    duration: "30 – 90 Days",
    processingTime: "10 – 15 Working Days",
    baseNPRPrice: 14000,
    entryType: "Single Entry",
    inclusions: [
      "Gateway Management Embassy Submission",
      "Detailed Cover Letter & Daily Itinerary",
      "Travel Insurance & Flight Reservation",
      "Financial Verification Support",
    ],
  },
  {
    id: "egypt-tourist",
    country: "Egypt",
    countryCode: "EG",
    region: "middle-east",
    visaType: "Tourist Visa",
    duration: "30 Days Stay",
    processingTime: "5 – 7 Working Days",
    baseNPRPrice: 9800,
    entryType: "Single Entry",
    inclusions: [
      "Embassy of Egypt Application Lodgement",
      "Cairo, Luxor & Nile Cruise Plan Dossier",
      "Bank Statement & Sponsor Verification",
      "Courier & Submission Assistance",
    ],
  },
  {
    id: "new-zealand-visitor",
    country: "New Zealand",
    countryCode: "NZ",
    region: "west",
    visaType: "Visitor Visa",
    duration: "Up to 9 Months",
    processingTime: "20 – 25 Working Days",
    baseNPRPrice: 24000,
    entryType: "Multiple Entry",
    inclusions: [
      "Immigration New Zealand RealMe Filing",
      "Comprehensive Itinerary & Ties Evidence",
      "Financial Solvency Proof Preparation",
      "Direct VFS Biometrics Guidance",
    ],
  },
  {
    id: "china-tourist",
    country: "China",
    countryCode: "CN",
    region: "asia",
    visaType: "L-Category Tourist Visa",
    duration: "30 – 60 Days",
    processingTime: "4 – 7 Working Days",
    baseNPRPrice: 13500,
    entryType: "Single / Double Entry",
    inclusions: [
      "Chinese Visa Application Center (Kathmandu)",
      "Invitation Letter / Tour Plan Drafting",
      "Hotel Vouchers & Round-Trip Flights",
      "Biometric Appointment Booking",
    ],
  },
  {
    id: "oman-evisa",
    country: "Oman",
    countryCode: "OM",
    region: "middle-east",
    visaType: "Tourist eVisa",
    duration: "30 Days Stay",
    processingTime: "2 – 4 Working Days",
    baseNPRPrice: 8900,
    entryType: "Single Entry",
    inclusions: [
      "Royal Oman Police eVisa Portal Submission",
      "Direct Electronic Approval",
      "Hotel & Travel Insurance Verification",
      "Instant Delivery via WhatsApp",
    ],
  },
  {
    id: "bahrain-evisa",
    country: "Bahrain",
    countryCode: "BH",
    region: "middle-east",
    visaType: "Tourist eVisa",
    duration: "14 – 30 Days",
    processingTime: "3 – 5 Working Days",
    baseNPRPrice: 8500,
    entryType: "Single Entry",
    inclusions: [
      "NPRA Bahrain Official Electronic Portal",
      "Return Flight & Hotel Verification",
      "Direct Digital eVisa Delivery",
      "Full Guidance for Airport Transit",
    ],
  },
  {
    id: "kuwait-visit",
    country: "Kuwait",
    countryCode: "KW",
    region: "middle-east",
    visaType: "Tourist / Family Visit",
    duration: "30 Days Stay",
    processingTime: "5 – 7 Working Days",
    baseNPRPrice: 11000,
    entryType: "Single Entry",
    inclusions: [
      "Kuwait Ministry of Interior Processing",
      "Sponsor & Document Validation",
      "Embassy Legalization Assistance",
      "Safe Electronic Transmission",
    ],
  },
  {
    id: "sri-lanka-eta",
    country: "Sri Lanka",
    countryCode: "LK",
    region: "asia",
    visaType: "ETA Tourist Visa",
    duration: "30 Days Stay",
    processingTime: "1 – 2 Working Days",
    baseNPRPrice: 6200,
    entryType: "Double Entry",
    inclusions: [
      "Official Sri Lanka ETA Online Filing",
      "Immediate Electronic Confirmation",
      "Colombo & Kandy Holiday Itinerary Aid",
      "24/7 WhatsApp Assistance",
    ],
  },
  {
    id: "maldives-arrival",
    country: "Maldives",
    countryCode: "MV",
    region: "asia",
    visaType: "Tourist On-Arrival Support",
    duration: "30 Days Stay",
    processingTime: "Instant / Same Day",
    baseNPRPrice: 4500,
    entryType: "Single Entry",
    inclusions: [
      "IMUGA Traveler Declaration Submission",
      "Resort Booking Confirmation Verification",
      "Confirmed Return Air Ticket Assistance",
      "Smooth Immigration Clearance Guide",
    ],
  },
  {
    id: "cambodia-evisa",
    country: "Cambodia",
    countryCode: "KH",
    region: "asia",
    visaType: "Tourist eVisa (Type T)",
    duration: "30 Days Stay",
    processingTime: "2 – 3 Working Days",
    baseNPRPrice: 7200,
    entryType: "Single Entry",
    inclusions: [
      "Ministry of Foreign Affairs Cambodia Filing",
      "Siem Reap & Angkor Wat Travel Itinerary",
      "High Approval Electronic Delivery",
      "Digital Certificate PDF",
    ],
  },
  {
    id: "philippines-9a",
    country: "Philippines",
    countryCode: "PH",
    region: "asia",
    visaType: "9A Temporary Visitor",
    duration: "30 – 59 Days",
    processingTime: "5 – 8 Working Days",
    baseNPRPrice: 9000,
    entryType: "Single Entry",
    inclusions: [
      "Embassy of the Philippines Verification",
      "Notarized Affidavit of Support Review",
      "Flight & Hotel Booking Vouchers",
      "Complete Filing Support",
    ],
  },
  {
    id: "hong-kong-par",
    country: "Hong Kong",
    countryCode: "HK",
    region: "asia",
    visaType: "Pre-Arrival Registration (PAR)",
    duration: "14 Days Stay",
    processingTime: "1 – 2 Working Days",
    baseNPRPrice: 5500,
    entryType: "Multiple Entry",
    inclusions: [
      "Hong Kong Immigration Department Portal",
      "Immediate Registration Slip Issuance",
      "Valid for 6 Months Multiple Trips",
      "Electronic Document via WhatsApp",
    ],
  },
  {
    id: "south-africa-tourist",
    country: "South Africa",
    countryCode: "ZA",
    region: "west",
    visaType: "Visitor Tourist Visa",
    duration: "Up to 90 Days",
    processingTime: "15 – 20 Working Days",
    baseNPRPrice: 16000,
    entryType: "Single Entry",
    inclusions: [
      "VFS Global / High Commission Lodgement",
      "Safari & Cape Town Travel Plan",
      "Bank Statement & Ties Audit",
      "Yellow Fever Vaccination Guidance",
    ],
  },
  {
    id: "brazil-tourist",
    country: "Brazil",
    countryCode: "BR",
    region: "west",
    visaType: "Visitor Visa (VIVIS)",
    duration: "Up to 90 Days",
    processingTime: "10 – 14 Working Days",
    baseNPRPrice: 18000,
    entryType: "Multiple Entry",
    inclusions: [
      "Embassy of Brazil Consular Portal Filing",
      "Rio & Amazon Holiday Itinerary Review",
      "Financial Stability & Bank Proof",
      "Complete Dossier Preparation",
    ],
  },
  {
    id: "switzerland-schengen",
    country: "Switzerland",
    countryCode: "CH",
    region: "europe",
    visaType: "Swiss Schengen Tourist",
    duration: "Up to 90 Days",
    processingTime: "10 – 15 Working Days",
    baseNPRPrice: 18500,
    entryType: "Multiple Entry",
    inclusions: [
      "Embassy of Switzerland VFS Booking",
      "Alpine Train & Hotel Itinerary Preparation",
      "Schengen Compliant Medical Insurance Aid",
      "Full Financial Statement Audit",
    ],
    popular: true,
  },
];

const ensurePlanDetails = (p: VisaDetailPlan): VisaDetailPlan => {
  const costOptions: CostOption[] =
    p.costOptions && p.costOptions.length > 0
      ? p.costOptions
      : [
          {
            name: "Single Entry",
            days: p.duration,
            nprPrice: p.baseNPRPrice,
            entryType: "Single Entry",
            description: `Standard single entry ${p.visaType}`,
          },
          {
            name: "Multiple Entry",
            days: "90 Days",
            nprPrice: Math.round(p.baseNPRPrice * 1.45),
            entryType: "Multiple Entry",
            description: `Frequent traveler multi-entry ${p.visaType}`,
          },
        ];

  const requirementDocuments =
    p.requirementDocuments && p.requirementDocuments.length > 0
      ? p.requirementDocuments
      : [
          "Passport copy (Valid for at least 6 months with blank pages)",
          "Passport size photo (Recent white background 35mm x 45mm)",
          "Bank statement (Up to 6 months closing balance minimum NPR 200,000)",
          "Confirmed Round trip ticket reservation",
          "Confirm hotel booking voucher",
          "Certified English translations for any documents originally in Nepali",
          "Covering letter stating purpose and duration of visit",
        ];

  const termsAndConditions =
    p.termsAndConditions && p.termsAndConditions.length > 0
      ? p.termsAndConditions
      : [
          "Payment fully non-refundable if visa refused",
          "Ticket canceled as per system penalties",
          "Hotels payment is fully non-refundable",
          "Embassy visa processing fees and service fees are strictly non-refundable.",
          "Visa grant and processing timelines are at the sole discretion of the embassy.",
        ];

  const aboutText =
    p.aboutText ||
    `Nepali passport holders require a pre-approved tourist visa to enter ${p.country}. Trip Himalaya provides end-to-end guidance for official visa submission, ensuring seamless verification of bank funds, hotel bookings, flight itineraries, and certified translations.`;

  return {
    ...p,
    costOptions,
    requirementDocuments,
    termsAndConditions,
    aboutText,
    successfulApplications: p.successfulApplications || "1000+",
    successRate: p.successRate || "99%",
  };
};

export const VISA_PLANS: VisaDetailPlan[] = VISA_PLANS_RAW.map(ensurePlanDetails);

const VISA_FAQS = [
  {
    q: "What documents are generally required for international tourist visas from Nepal?",
    qNp: "नेपालबाट अन्तर्राष्ट्रिय पर्यटक भिसाको लागि साधारणतया कुन कागजातहरू चाहिन्छन्?",
    a: "Most embassies require: (1) Original passport with at least 6 months validity, (2) Recent biometric photos as per embassy specs, (3) 6-month bank statements with sufficient funds and bank balance certificate, (4) Relationship/citizenship certificates, (5) Confirmed return flight and hotel vouchers, and (6) Leave/employment letters or business tax clearance. Trip Himalaya assists in preparing and verifying every document.",
    aNp: "अधिकांश दूतावासहरूले माग्ने: (१) कमसेकम ६ महिना म्याद रहेको मूल राहदानी, (२) हालिया बायोमेट्रिक फोटो, (३) ६-महिनाको ब्यांक बिबरण र ब्यांक ब्यालेन्स प्रमाणपत्र, (४) नाता/नागरिकता प्रमाणपत्र, (५) पुष्टि भएको फिर्ता उडान र होटल भाउचर, (६) छुट्टी/रोजगार पत्र वा कर चुक्ता प्रमाणपत्र। ट्रिप हिमालयले सबै कागजात तयारी र पुष्टीमा सहयोग गर्छ।",
  },
  {
    q: "Do you guarantee visa approval?",
    qNp: "के तपाईंहरूले भिसा अनुमोदनको गारन्टी दिनुहुन्छ?",
    a: "Visa granting is strictly the sovereign right of the respective embassy or consulate. However, Trip Himalaya maintains a 98%+ success rate by thoroughly reviewing your application, eliminating discrepancies, structuring your financial evidence correctly, and preparing tailored cover letters that satisfy embassy guidelines.",
    aNp: "भिसा प्रदान गर्नु सम्बन्धित दूतावास वा कन्सुलेटको सार्वभौम अधिकार हो। तथापि, ट्रिप हिमालयले तपाईंको आवेदन ध्यानपूर्वक समीक्षा, त्रुटि निवारण, सही ठेगान वित्तीय प्रमाण र दूतावास निर्देशिका पूरा गर्ने कभर लेटर तयार गरेर ८९%+ सफलता दर कायम राख्छ।",
  },
  {
    q: "How early should I apply for my visa before my travel date?",
    qNp: "यात्रा तारिखभन्दा कति अघि भिसाको लागि आवेदन गर्नुपर्छ?",
    a: "We recommend applying at least 3–4 weeks prior to your intended departure for Asian destinations (UAE, Thailand, Malaysia, Singapore), and at least 6–8 weeks in advance for European Schengen, UK, US, or Australian visas to secure convenient biometrics appointments.",
    aNp: "एसियाली गन्तव्यहरू (UAE, थाइल्याण्ड, मलेसिया, सिङ्गापुर) को लागि कमसेकम ३-४ हप्ता अगाडि र युरोपीय Schengen, UK, US, वा अस्ट्रेलियाली भिसाको लागि कमसेकम ६-८ हप्ता अगाडि आवेदन गर्न सिफारिस गरिन्छ।",
  },
  {
    q: "Can I apply for a visa online without visiting your office?",
    qNp: "के तपाईंको कार्यालय नगईकन अनलाइनमा भिसाको लागि आवेदन गर्न सकिन्छ?",
    a: "Yes! For e-Visas (such as Dubai/UAE, Malaysia, and Singapore), you can send your scanned passport and photo via WhatsApp or Email. We handle the complete filing, payment, and deliver your approved visa electronically.",
    aNp: "हो! इ-भिसाहरूको लागि (जस्तै दुबई/UAE, मलेसिया, र सिङ्गापुर), तपाईंले WhatsApp वा Email मार्फत स्क्यान गरिएको राहदानी र फोटो पठाउन सक्नुहुन्छ। हामी सम्पूर्ण दाखिला, भुक्तानी र अनुमोदित भिसा इलेक्ट्रोनिक रूपमा पठाउने काम गर्छौं।",
  },
];

export const VisaServicesDetailContent: React.FC = () => {
  const navigate = useNavigate();
  const INITIAL_COUNT = 9;
  const LOAD_MORE_STEP = 15;

  const [activeTab, setActiveTab] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);

  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  // Reset to initial 9 cards whenever filters or search change
  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [activeTab, searchQuery]);

  const filteredPlans = VISA_PLANS.filter((plan) => {
    if (activeTab !== "all" && plan.region !== activeTab) return false;
    if (searchQuery && !plan.country.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const displayedPlans = filteredPlans.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPlans.length;

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_STEP);
  };

  const handleSelectPlan = (plan: VisaDetailPlan) => {
    navigate(`/details/${plan.id}`);
  };

  const handleWhatsAppInquiry = (plan: VisaDetailPlan) => {
    const formattedPrice = displayPrice(
      plan.baseNPRPrice,
      selectedCurrency,
      nprPerOneDollar,
      nprPerOneINR
    );
    const msg = encodeURIComponent(
      `Hello Trip Himalaya (Visa & Documentation Team)! I would like to inquire about visa assistance for "${plan.country}" (${plan.visaType}, fee starting around ${formattedPrice}). Please guide me with requirements and next steps.`
    );
    window.open(`https://wa.me/9779851420882?text=${msg}`, "_blank", "noopener,noreferrer");
  };


  return (
    <div className="space-y-8">
      {/* ── 1. DESTINATION SEARCH & REGION PILL BAR (Enclosed format as in sketch) ── */}
      <div className="bg-white p-2.5 sm:p-3.5 rounded-2xl sm:rounded-full border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 px-4 sm:px-6">
        {/* Left side: "All Destination :" + Region Tabs */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
          <span className="text-xs sm:text-sm font-black text-[#2D1347] uppercase tracking-wider mr-1 whitespace-nowrap">
            All Destination :
          </span>
          {[
            { id: "all", label: "All" },
            { id: "asia", label: "Asia" },
            { id: "middle-east", label: "Gulf & UAE" },
            { id: "europe", label: "Schengen" },
            { id: "west", label: "USA & UK" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#2D1347] text-white shadow-xs"
                  : "text-gray-600 hover:text-[#2D1347] hover:bg-gray-100/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Center vertical separator */}
        <div className="hidden md:block h-6 w-[1px] bg-gray-200" />

        {/* Right side: Search Box */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 hover:bg-gray-100/60 focus:bg-white border border-gray-200 rounded-full text-xs sm:text-sm font-semibold text-[#2D1347] placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:border-[#E91E63] transition-colors"
          />
        </div>
      </div>

      {/* ── 2. POPULAR VISA DESTINATION SECTION (Underlined title as in sketch) ── */}
      <div className="space-y-6">
        <div className="text-center pt-2 pb-1">
          <div className="inline-flex flex-col items-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2D1347] tracking-tight">
              Popular Visa Destination
            </h3>
            <div className="h-1.5 w-32 sm:w-40 bg-[#E91E63] rounded-full mt-2.5 shadow-xs" />
          </div>
        </div>

        {/* ── 3 COLUMNS & 3 ROWS GRID (Total 9 initially, as requested) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPlans.map((plan) => {
            const formattedPrice = displayPrice(
              plan.baseNPRPrice,
              selectedCurrency,
              nprPerOneDollar,
              nprPerOneINR
            );

            return (
              <div
                key={plan.id}
                className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative group"
              >
                {plan.popular && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-[#E91E63] to-pink-500 text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    Popular
                  </span>
                )}

                <div>
                  {/* Flag & Destination (Text size increased as in Tours) */}
                  <div className="flex items-center gap-3 mb-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                      {plan.countryCode === "EU" ? (
                        <span className="text-2xl">🇪🇺</span>
                      ) : (
                        <ReactCountryFlag
                          svg
                          countryCode={plan.countryCode}
                          style={{ width: "1.8em", height: "1.8em", borderRadius: "4px" }}
                        />
                      )}
                    </div>
                    <div className="min-w-0 pr-14">
                      <h4 className="text-lg sm:text-xl font-black text-[#2D1347] leading-snug tracking-tight truncate">
                        {plan.country}
                      </h4>
                      <p className="text-xs sm:text-sm font-bold text-[#E91E63] mt-0.5 truncate">
                        {plan.visaType}
                      </p>
                    </div>
                  </div>

                  {/* Key Metadata Badges (Text size increased) */}
                  <div className="flex flex-wrap gap-2 my-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-[#2D1347] text-xs font-bold border border-purple-100/60">
                      <Calendar size={13} className="text-[#E91E63]" />
                      <span>{plan.duration}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-50 text-gray-700 text-xs font-semibold border border-gray-200/70">
                      <Clock size={13} className="text-gray-400" />
                      <span>{plan.processingTime}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                      <span>{plan.entryType}</span>
                    </span>
                  </div>

                  {/* Inclusions List (Text size increased to text-xs sm:text-sm as in Tours) */}
                  <div className="space-y-2 my-4 pt-3 border-t border-gray-100">
                    {plan.inclusions.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 font-medium leading-tight">
                        <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & Double Action Buttons (View Detail & Inquire) */}
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5 mt-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      Assistance Fee Starts At
                    </span>
                    <span className="text-lg sm:text-xl font-black text-[#2D1347]">
                      {formattedPrice}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mt-1">
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-purple-50 hover:bg-purple-100 text-[#2D1347] font-bold text-xs sm:text-sm rounded-xl border border-purple-200/80 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Eye size={15} className="text-[#E91E63]" />
                      <span>View Detail</span>
                    </button>

                    <button
                      onClick={() => handleWhatsAppInquiry(plan)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-[#E91E63] to-pink-600 hover:brightness-110 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-pink-600/20 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <MessageCircle size={15} />
                      <span>Inquire</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── SEE MORE BUTTON (Loads 15 more cards when clicked, matched to Tours page) ── */}
        {hasMore ? (
          <div className="flex flex-col items-center justify-center pt-8">
            <button
              onClick={handleSeeMore}
              className="px-10 py-3.5 bg-[#2D1347] hover:bg-[#3B145C] text-white font-bold text-sm rounded-2xl flex items-center gap-2.5 transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
            >
              <span>See More</span>
              <ChevronDown size={16} />
            </button>
          </div>
        ) : filteredPlans.length > INITIAL_COUNT ? (
          <div className="text-center pt-6">
            <span className="inline-block px-5 py-2 rounded-full bg-purple-50 text-[#2D1347] text-xs sm:text-sm font-bold border border-purple-100 shadow-xs">
              ✓ Showing all {filteredPlans.length} visa destinations
            </span>
          </div>
        ) : null}
      </div>

      {/* ── 4. HOW IT WORKS (Preserved as requested) ── */}
      <div className="bg-gradient-to-br from-[#2D1347] to-[#401863] text-white p-8 sm:p-12 rounded-3xl shadow-xl">
        <span className="text-pink-400 font-black uppercase tracking-[0.25em] text-[10px] mb-2 block">
          SEAMLESS 4-STEP PROCEDURE
        </span>
        <h3 className="text-2xl sm:text-3xl font-black mb-8 tracking-tight">
          How Our Visa Concierge Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              step: "01",
              title: "Free Evaluation",
              desc: "We assess your passport, travel history, and financial profile to suggest the optimal visa category.",
            },
            {
              step: "02",
              title: "Dossier Prep",
              desc: "Our team drafts tailored cover letters, verifies flight/hotel vouchers, and organizes your embassy dossier.",
            },
            {
              step: "03",
              title: "Appointment / E-filing",
              desc: "We secure your biometrics slot (VFS/TLS) or directly file your electronic visa portal application.",
            },
            {
              step: "04",
              title: "Visa Grant",
              desc: "Collect your passport with stamped visa or receive your digital e-visa directly on WhatsApp & Email.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-all"
            >
              <span className="text-2xl font-black text-pink-400 block mb-2">{item.step}</span>
              <h4 className="font-black text-sm uppercase tracking-wide text-white mb-1.5">
                {item.title}
              </h4>
              <p className="text-gray-300 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. VISA FAQS (Preserved as requested) ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-pink-50 text-[#E91E63]">
            <HelpCircle size={20} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
              FAQS Question
            </h3>
            <p className="text-xs text-gray-400 font-medium">Important answers to common visa queries</p>
          </div>
        </div>

        <div className="space-y-3">
          {VISA_FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-gray-100 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm text-[#2D1347] hover:text-[#E91E63] cursor-pointer"
                >
                  <div className="flex flex-col gap-0.5">
                    <span>{faq.q}</span>
                    <span className="text-[11px] font-medium text-gray-400">{faq.qNp}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#E91E63]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 border-t border-gray-50 pt-3 space-y-2">
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-2">{faq.aNp}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VisaServicesDetailContent;

