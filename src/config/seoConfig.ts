import { SEOProps } from "../components/reusable/SEO";

export const defaultSEO: SEOProps = {
  title: "Trip Himalaya Tours & Travel | Nepal Tours, Treks & Visas",
  description:
    "Trip Himalaya Tours & Travel is a premier Kathmandu travel agency offering domestic and international tour packages, Himalayan treks, visas, and work permits.",
  keywords:
    "Trip Himalaya, Trip Himalaya Tours and Travel, Travel Agency Kathmandu, Nepal Tour Packages, Trekking in Nepal, International Tours Nepal, Visa Services Nepal, Work Permit Nepal",
  canonicalPath: "/",
  type: "website",
};

export const pagesSEO: Record<string, SEOProps> = {
  home: {
    title: "Trip Himalaya Tours & Travel | Nepal Tours, Treks & Visas",
    description:
      "Trip Himalaya Tours & Travel is a premier Kathmandu travel agency offering domestic and international tour packages, Himalayan treks, visas, and work permits.",
    keywords:
      "Trip Himalaya, Trip Himalaya Tours and Travel, Travel Agency Kathmandu, Nepal Tour Packages, Trekking in Nepal, International Tours Nepal, Visa Services Nepal, Work Permit Nepal",
    canonicalPath: "/",
    type: "website",
    schema: {
      "@context": "https://schema.org",
      "@type": ["TravelAgency", "TouristInformationCenter"],
      "name": "Trip Himalaya Tours & Travel",
      "url": "https://triphimalaya.com.np/",
      "logo": "https://triphimalaya.com.np/THTTLogo.png",
      "description":
        "Trip Himalaya Tours & Travel: Premier travel agency in Nepal for domestic & international holiday packages, flight ticketing, worldwide visa processing, Himalayan trekking, travel insurance, and hotel reservations.",
      "telephone": "+977-9851420882",
      "email": "triphimalayatt@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Kathmandu",
        "addressLocality": "Kathmandu",
        "addressRegion": "Bagmati",
        "postalCode": "44600",
        "addressCountry": "NP"
      }
    }
  },

  packages: {
    title: "Nepal Tour Packages & Trekking Holidays | Trip Himalaya",
    description:
      "Explore top Nepal tour packages, trekking expeditions, and holiday itineraries. Book Everest Base Camp, Annapurna Circuit, Pokhara & Chitwan tours at best prices.",
    keywords:
      "Nepal tour packages, Nepal holiday packages, Nepal trekking packages, Everest Base Camp Trek, Annapurna Base Camp Trek, Annapurna Circuit Trek, Langtang Valley Trek, Mardi Himal Trek, Manaslu Circuit Trek, Upper Mustang Trek, Poon Hill Trek, Customized Nepal tour packages, Nepal multi-day tour packages, Nepal luxury tour packages, Nepal private tours, Nepal tour package cost, Nepal tour itinerary 7 days, Nepal tour itinerary 10 days, Nepal tour packages from USA, Nepal tour packages from UK, Nepal tour packages from Australia, Nepal tour packages from India",
    canonicalPath: "/packages",
    type: "website",
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Nepal Tour Packages & Trekking Expeditions",
      "description": "Comprehensive collection of Nepal holiday packages, guided Himalayan treks, and cultural sightseeing tours.",
      "url": "https://triphimalaya.com.np/packages",
      "provider": {
        "@type": "TravelAgency",
        "name": "Trip Himalaya Tours & Travel"
      }
    }
  },

  services: {
    title: "Travel & Tour Services in Nepal | Trip Himalaya",
    description:
      "Comprehensive travel services in Nepal: International visa assistance, helicopter tours, car & 4WD jeep rental, luxury hotel bookings, trekking insurance, and work permits.",
    keywords:
      "Travel services Nepal, Tour operator services Kathmandu, Nepal visa service, Nepal helicopter rental, Car hire Kathmandu, Nepal hotel booking, Trekking insurance Nepal, Work permit assistance Nepal",
    canonicalPath: "/service",
    type: "website"
  },

  serviceVisa: {
    title: "Nepal & International Visa Services in Kathmandu | Trip Himalaya",
    description:
      "Fast, reliable tourist visa processing, embassy consultations, and travel document clearance in Nepal. Worldwide visa support with expert assistance.",
    keywords:
      "Visa services Nepal, Travel visa Kathmandu, International visa assistance Nepal, Tourist visa application Nepal, Visa agency Kathmandu, Visa clearance Nepal",
    canonicalPath: "/service/visa-services",
    type: "website"
  },

  serviceHeli: {
    title: "Nepal Helicopter Tours & Himalayan Scenic Flights | Trip Himalaya",
    description:
      "Book luxury Everest Base Camp helicopter tours, Annapurna heli rides, Langtang scenic flights, and emergency mountain rescue charters in Nepal.",
    keywords:
      "Nepal helicopter tours, Everest Base Camp heli tour, Annapurna helicopter flight, Langtang heli tour, Private helicopter charter Nepal, Mountain rescue flights Nepal, Heli sightseeing Nepal",
    canonicalPath: "/service/heli-service",
    type: "website"
  },

  serviceHotel: {
    title: "Hotel Booking in Nepal | Kathmandu, Pokhara & Chitwan Hotels",
    description:
      "Best hotel deals in Nepal. Reserve budget hotels, heritage boutique stays, 5-star luxury resorts in Kathmandu, Pokhara, Chitwan, and Nagarkot with instant confirmation.",
    keywords:
      "Hotel booking Nepal, Hotels in Kathmandu, Pokhara luxury resorts, Chitwan safari resort, Budget hotels Nepal, Best places to stay Nepal, Nepal resort reservations",
    canonicalPath: "/service/hotel-booking",
    type: "website"
  },

  serviceVehicle: {
    title: "Vehicle Rental in Nepal | Car, Jeep, HiAce & Bus Hire Kathmandu",
    description:
      "Rent private cars, Scorpio 4WD jeeps, Toyota HiAce vans, and luxury tourist buses with experienced drivers in Nepal. Airport transfers & highway travel.",
    keywords:
      "Car rental Nepal, Jeep hire Kathmandu, 4WD rental Nepal, Tourist bus hire Kathmandu, Airport transfer Kathmandu, Vehicle rental with driver Nepal, Pokhara car hire",
    canonicalPath: "/service/vehicle-rental",
    type: "website"
  },

  serviceInsurance: {
    title: "Nepal Travel Insurance & High-Altitude Trekking Medical Coverage",
    description:
      "Himalayan trekking and travel insurance coverage for Nepal tourists. High-altitude emergency helicopter evacuation, medical, and baggage protection.",
    keywords:
      "Nepal travel insurance, Trekking insurance Nepal, High altitude medical insurance, Helicopter evacuation insurance Nepal, Travel insurance Kathmandu",
    canonicalPath: "/service/travel-insurance",
    type: "website"
  },

  serviceWorkPermit: {
    title: "Foreign Work Permit & Document Attestation | Trip Himalaya",
    description:
      "Professional consultation for overseas employment, work permits, document legalization, and embassy attestation services in Nepal.",
    keywords:
      "Work permit Nepal, Foreign employment documentation, Embassy attestation Kathmandu, Overseas work permit assistance, Document clearance Nepal",
    canonicalPath: "/service/work-permit",
    type: "website"
  },

  travelGuide: {
    title: "Best Places to Visit in Nepal | Travel Guide & Tips | Trip Himalaya",
    description:
      "Comprehensive travel guide for visiting Nepal: Top attractions, Kathmandu UNESCO heritage, Pokhara adventure, Chitwan wildlife safari, best seasons, and safety tips.",
    keywords:
      "Best places to visit in Nepal, Best time to visit Nepal, Nepal travel guide, Kathmandu sightseeing tour, Nepal tour itinerary 7 days, Nepal tour itinerary 10 days, Nepal travel tips, Nepal holiday guide",
    canonicalPath: "/travel-guide",
    type: "article",
    schema: {
      "@context": "https://schema.org",
      "@type": "TravelGuide",
      "name": "Complete Nepal Travel & Sightseeing Guide",
      "description": "Essential travel advice, top places to visit in Nepal, best seasons, and itineraries.",
      "url": "https://triphimalaya.com.np/travel-guide"
    }
  },

  about: {
    title: "About Trip Himalaya | Premier Tour Operator & Travel Agency Nepal",
    description:
      "Learn about Trip Himalaya Tours & Travel Pvt. Ltd., our passionate team, certified travel experts, and dedication to authentic Himalayan adventures.",
    keywords:
      "About Trip Himalaya, Best tour operator in Nepal, Nepal travel company, Tour operator in Kathmandu, Kathmandu travel agency, Trusted Nepal travel agency, Leading travel agency Nepal",
    canonicalPath: "/about",
    type: "website"
  },

  contact: {
    title: "Contact Trip Himalaya | Kathmandu Travel Agency & Support",
    description:
      "Contact Trip Himalaya Tours & Travel in Kathmandu, Nepal. Call +977-9851420882 or visit us for customized tour bookings, trek planning, and instant quotations.",
    keywords:
      "Contact Trip Himalaya, Travel agency in Kathmandu address, Kathmandu tour operator phone, Nepal trip inquiry, Trip Himalaya office, Travel consultation Kathmandu",
    canonicalPath: "/contact",
    type: "website"
  },

  blog: {
    title: "Nepal Travel Blog, Trekking Stories & Mountain Guides | Trip Himalaya",
    description:
      "Discover expert Nepal travel blogs, Himalayan trekking itineraries, Everest & Annapurna trail guides, local cultural tips, and travel photography.",
    keywords:
      "Nepal travel blog, Trekking in Nepal blog, Everest base camp guide, Annapurna circuit tips, Nepal cultural stories, Himalayan travel guide, Travel tips Nepal",
    canonicalPath: "/blog",
    type: "website"
  },

  gallery: {
    title: "Nepal Travel & Himalayan Trekking Photo Gallery | Trip Himalaya",
    description:
      "Explore stunning photography of Nepal's towering Himalayan peaks, ancient heritage temples, mountain treks, wildlife safaris, and cultural festivals.",
    keywords:
      "Nepal travel photo gallery, Himalaya photos, Everest Base Camp pictures, Nepal sightseeing images, Kathmandu heritage photos, Nepal trekking images",
    canonicalPath: "/gallery",
    type: "website"
  },

  documentation: {
    title: "Nepal Travel Documents, Trekking Permits & Visa Guidelines",
    description:
      "Everything you need to know about Nepal tourist visas, TIMS trekking cards, national park entrance fees, and documentation requirements.",
    keywords:
      "Nepal travel documents, TIMS card Nepal, Nepal trekking permits, National park entry fees Nepal, Nepal visa requirements, Travel clearance Nepal",
    canonicalPath: "/documentation",
    type: "website"
  }
};
