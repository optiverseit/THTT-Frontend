import type {
  Service,
  Package,
  Testimonial,
  GalleryItem,
  TravelGuide,
  BlogPost,
  VideoPost,
} from "./types";

export const services: Service[] = [
  {
    id: "1",
    name: "Air Ticket",
    slug: "air-ticket",
    icon: "Plane",
    heroImage:
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=1600",
    shortDesc:
      "Affordable domestic and international flight bookings with top airlines.",
    description:
      "We offer the most competitive rates for both domestic flights within Nepal and international travel worldwide. Our real-time booking system ensures you get the best seats at the best prices with major carriers.",
    subServices: [
      "Domestic Air Ticket",
      "International Air Ticket",
      "Himalayan Sightseeing Flights",
      "Charter Flights",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1544016768-982d1554f0b9?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=1200",

      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&q=80&w=600",
    ],
  },
  {
    id: "2",
    name: "Tours",
    slug: "tours",
    icon: "Map",
    heroImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600",
    shortDesc:
      "Explore the beauty of Nepal and the world with our curated tour packages.",
    description:
      "Discover the rich culture and natural beauty of Nepal or travel across the globe with our expertly curated tour packages for all types of travelers.",
    subServices: [
      "Domestic Tours",
      "International Tours",
      "Religious Pilgrimages",
      "Cultural Heritage Tours",
    ],
    gallery: [],
  },
  {
    id: "5",
    name: "Adventure Activities",
    slug: "activities",
    icon: "Activity",
    heroImage:
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=1600",
    shortDesc: "Paragliding, Bungee, Rafting, and more.",
    description:
      "Experience the thrill of Nepal with our curated adventure activities.",
    subServices: [
      "Paragliding",
      "Bungee Jumping",
      "White Water Rafting",
      "Zip Lining",
    ],
    gallery: [],
  },
  {
    id: "6",
    name: "Trekking",
    slug: "trekking",
    icon: "Mountain",
    heroImage:
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=1600",
    shortDesc: "Guided treks through the world's highest mountains.",
    description:
      "Expert-led trekking expeditions in the Annapurna, Everest, and Langtang regions.",
    subServices: [
      "EBC Trek",
      "Annapurna Circuit",
      "Mardi Himal",
      "Langtang Valley",
    ],
    gallery: [],
  },
  {
    id: "7",
    name: "Hotel Booking",
    slug: "hotel-booking",
    icon: "Bed",
    heroImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600",
    shortDesc: "Best rates at premium hotels and resorts.",
    description:
      "Secure your stay in top-rated hotels across Nepal and international destinations.",
    subServices: [
      "Luxury Resorts",
      "Boutique Hotels",
      "Budget Stays",
      "Homestays",
    ],
    gallery: [],
  },
  {
    id: "8",
    name: "Visa Services",
    slug: "visa-services",
    icon: "Shield",
    heroImage:
      "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=1600",
    shortDesc: "Expert assistance for visa applications and processing.",
    description:
      "We help you navigate complex visa requirements for major travel destinations.",
    subServices: [
      "Visit Visas",
      "Work Permits",
      "Schengen Visas",
      "Visa Counseling",
    ],
    gallery: [],
  },
  {
    id: "9",
    name: "Travel Insurance",
    slug: "travel-insurance",
    icon: "Heart",
    heroImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000",
    shortDesc: "Comprehensive coverage for a worry-free journey.",
    description:
      "Protect yourself against unforeseen events with our comprehensive travel insurance plans.",
    subServices: [
      "Medical Coverage",
      "Trip Cancellation",
      "Lost Baggage",
      "Emergency Evacuation",
    ],
    gallery: [],
  },
  {
    id: "10",
    name: "Vehicle Rental",
    slug: "vehicle-rental",
    icon: "Car",
    heroImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1600",
    shortDesc: "Rent a car, SUV, or bus for your custom group travel.",
    description: "Modern fleet of vehicles for all your transportation needs.",
    subServices: [
      "Private Cars",
      "Scorpio/SUV",
      "Coaster/Hiace",
      "Tourist Bus",
    ],
    gallery: [],
  },
  {
    id: "11",
    name: "Heli Services",
    slug: "heli-services",
    icon: "Wind",
    heroImage:
      "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&q=80&w=1600",
    shortDesc: "VIP Helicopter tours and emergency rescue.",
    description:
      "Luxury helicopter tours to Everest Base Camp and other remote destinations.",
    subServices: [
      "EBC Heli Tour",
      "Muktinath Heli Tour",
      "Emergency Medical Rescue",
      "Charter Services",
    ],
    gallery: [],
  },
  {
    id: "12",
    name: "Online Shram/Labour",
    slug: "work-permit",
    icon: "FileText",
    heroImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1600",
    shortDesc: "Help with labor permits and online registration.",
    description:
      "We assist migrant workers with Shram (Labour) permits and essential documentation.",
    subServices: [
      "New Shram Permit",
      "Renewal",
      "Orientation Help",
      "Document Verification",
    ],
    gallery: [],
  },
];

export const packages: Package[] = [
  {
    id: "a1",
    title: "Paragliding in Pokhara",
    slug: "paragliding-pokhara",
    duration: "30-45 Mins",
    location: "Sarangkot, Pokhara",
    highlights: [
      "Phewa Lake View",
      "Annapurna Range",
      "Expert Pilots",
      "GoPro Footage",
    ],
    price: "$85",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "activity",
    adventureCategory: "Air",
    difficulty: "Easy",
    intensity: "High Thrill",
    isFeatured: true,
    testimonies: [
      {
        id: "at1",
        userName: "Emily Watson",
        rating: 5,
        date: "2024-06-01",
        comment: "Floating above Pokhara was the highlight of my life!",
        location: "USA",
      },
    ],
  },
  {
    id: "a2",
    title: "Bungee Jump - The Last Resort",
    slug: "bungee-nepal",
    duration: "Full Day",
    location: "Bhote Koshi, Nepal",
    highlights: [
      "160m Drop",
      "River Views",
      "Safety Certified",
      "Transport Included",
    ],
    price: "$110",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "activity",
    adventureCategory: "Land",
    difficulty: "Extreme",
    intensity: "Maximum Adrenaline",
    isFeatured: true,
    testimonies: [
      {
        id: "at1",
        userName: "Emily Watson",
        rating: 5,
        date: "2024-06-01",
        comment: "Floating above Pokhara was the highlight of my life!",
        location: "USA",
      },
    ],
  },
  {
    id: "a3",
    title: "Trishuli River Rafting",
    slug: "river-rafting",
    duration: "1-2 Days",
    location: "Trishuli River, Nepal",
    highlights: [
      "Class III Rapids",
      "River Side Camping",
      "Professional Safety",
      "Traditional Lunch",
    ],
    price: "$45",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "activity",
    adventureCategory: "Water",
    difficulty: "Moderate",
    intensity: "High Energy",
    isFeatured: true,
    testimonies: [
      {
        id: "at1",
        userName: "Emily Watson",
        rating: 5,
        date: "2024-06-01",
        comment: "Floating above Pokhara was the highlight of my life!",
        location: "USA",
      },
    ],
  },
  // ✅ More Adventure Activities (type: "activity")
  {
    id: "a4",
    title: "ZipFlyer Pokhara",
    slug: "zipflyer-pokhara",
    duration: "1-2 Mins",
    location: "Sarangkot, Pokhara",
    highlights: [
      "World-class Zipline",
      "Mountain Views",
      "Safety Harness",
      "Transport Options",
    ],
    price: "$70",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200", // zipline photo ID :contentReference[oaicite:1]{index=1}
    category: "domestic",
    type: "activity",
    adventureCategory: "Air",
    difficulty: "Moderate",
    intensity: "High Thrill",
    isFeatured: true,
    testimonies: [],
  },
  {
    id: "a5",
    title: "Mountain Biking in Pokhara",
    slug: "mountain-biking-pokhara",
    duration: "3-5 Hours",
    location: "Pokhara, Nepal",
    highlights: [
      "Himalayan Trails",
      "Local Guide",
      "Helmet & Gear",
      "Scenic Viewpoints",
    ],
    price: "$65",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200", // biking photo ID :contentReference[oaicite:2]{index=2}
    category: "domestic",
    type: "activity",
    adventureCategory: "Land",
    difficulty: "Hard",
    intensity: "High Energy",
    isFeatured: true,
    testimonies: [],
  },
  {
    id: "a6",
    title: "Rock Climbing Experience",
    slug: "rock-climbing-experience",
    duration: "2-3 Hours",
    location: "Outdoor Climbing Spot",
    highlights: [
      "Certified Instructors",
      "Safety Gear Included",
      "Beginner Friendly",
      "Photo Moments",
    ],
    price: "$55",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200", // climbing photo ID :contentReference[oaicite:3]{index=3}
    category: "domestic",
    type: "activity",
    adventureCategory: "Land",
    difficulty: "Moderate",
    intensity: "Skill + Strength",
    isFeatured: false,
    testimonies: [],
  },
  {
    id: "a7",
    title: "Kayaking Adventure (River / Lake)",
    slug: "kayaking-adventure",
    duration: "1-2 Hours",
    location: "Pokhara, Nepal",
    highlights: [
      "Safety Briefing",
      "Life Jacket",
      "Scenic Paddle",
      "Great for Couples",
    ],
    price: "$35",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200", // kayak photo ID :contentReference[oaicite:4]{index=4}
    category: "domestic",
    type: "activity",
    adventureCategory: "Water",
    difficulty: "Easy",
    intensity: "Chill + Active",
    isFeatured: false,
    testimonies: [],
  },
  {
    id: "a8",
    title: "Canyon Swing / Gorge Jump Experience",
    slug: "canyon-swing-gorge-jump",
    duration: "1-2 Hours",
    location: "River Gorge",
    highlights: [
      "Adrenaline Jump",
      "Safety Crew",
      "Photo/Video Option",
      "Short Hike Access",
    ],
    price: "$95",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200", // bungee-style photo ID :contentReference[oaicite:5]{index=5}
    category: "domestic",
    type: "activity",
    adventureCategory: "Land",
    difficulty: "Extreme",
    intensity: "Maximum Adrenaline",
    isFeatured: true,
    testimonies: [],
  },

  {
    id: "c1",
    title: "The Pokhara Ultimate Combo",
    slug: "pokhara-combo",
    duration: "2 Days",
    location: "Pokhara, Nepal",
    highlights: ["Paragliding", "Zip Lining", "Bungee Jump", "Luxury Stay"],
    price: "$250",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "combo",
    adventureCategory: "Air",
    difficulty: "Extreme",
    intensity: "Epic Adventure",
    isFeatured: true,
    testimonies: [],
  },
  {
    id: "c7",
    title: "The Pokhara Ultimate Combo",
    slug: "pokhara-combo",
    duration: "2 Days",
    location: "Pokhara, Nepal",
    highlights: ["Paragliding", "Zip Lining", "Bungee Jump", "Luxury Stay"],
    price: "$250",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "combo",
    adventureCategory: "Air",
    difficulty: "Extreme",
    intensity: "Epic Adventure",
    isFeatured: true,
    testimonies: [],
  },
  {
    id: "c2",
    title: "Kathmandu Adventure Starter Combo",
    slug: "kathmandu-adventure-starter-combo",
    duration: "2 Days",
    location: "Kathmandu + Bhote Koshi",
    highlights: ["Bungee Jump", "Rafting Day", "Zipline", "Private Transfers"],
    price: "$220",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200", // bungee gorge photo ID :contentReference[oaicite:6]{index=6}
    category: "domestic",
    type: "combo",
    adventureCategory: "Land",
    difficulty: "Hard",
    intensity: "Thrill Pack",
    isFeatured: true,
    testimonies: [],
  },
  {
    id: "c3",
    title: "Trishuli Water Rush Combo",
    slug: "trishuli-water-rush-combo",
    duration: "2 Days",
    location: "Trishuli River, Nepal",
    highlights: [
      "White Water Rafting",
      "Riverside Camping",
      "Kayak Session",
      "Local Meals",
    ],
    price: "$120",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200", // Trishuli rafting photo ID :contentReference[oaicite:7]{index=7}
    category: "domestic",
    type: "combo",
    adventureCategory: "Water",
    difficulty: "Moderate",
    intensity: "High Energy",
    isFeatured: true,
    testimonies: [],
  },
  {
    id: "c4",
    title: "Pokhara Sky & Trails Combo",
    slug: "pokhara-sky-trails-combo",
    duration: "2 Days",
    location: "Pokhara, Nepal",
    highlights: [
      "Paragliding",
      "Mountain Biking",
      "Sunrise Viewpoint",
      "Comfort Stay",
    ],
    price: "$195",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200", // Pokhara paragliding photo ID :contentReference[oaicite:8]{index=8}
    category: "domestic",
    type: "combo",
    adventureCategory: "Air",
    difficulty: "Hard",
    intensity: "Epic Adventure",
    isFeatured: true,
    testimonies: [],
  },
  {
    id: "c5",
    title: "The Pokhara Ultimate Combo",
    slug: "pokhara-combo",
    duration: "2 Days",
    location: "Pokhara, Nepal",
    highlights: ["Paragliding", "Zip Lining", "Bungee Jump", "Luxury Stay"],
    price: "$250",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "combo",
    adventureCategory: "Air",
    difficulty: "Extreme",
    intensity: "Epic Adventure",
    isFeatured: true,
    testimonies: [],
  },
  {
    id: "c6",
    title: "The Pokhara Ultimate Combo",
    slug: "pokhara-combo",
    duration: "2 Days",
    location: "Pokhara, Nepal",
    highlights: ["Paragliding", "Zip Lining", "Bungee Jump", "Luxury Stay"],
    price: "$250",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "combo",
    adventureCategory: "Air",
    difficulty: "Extreme",
    intensity: "Epic Adventure",
    isFeatured: true,
    testimonies: [],
  },
  {
    id: "c7",
    title: "The Pokhara Ultimate Combo",
    slug: "pokhara-combo",
    duration: "2 Days",
    location: "Pokhara, Nepal",
    highlights: ["Paragliding", "Zip Lining", "Bungee Jump", "Luxury Stay"],
    price: "$250",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "combo",
    adventureCategory: "Air",
    difficulty: "Extreme",
    intensity: "Epic Adventure",
    isFeatured: true,
    testimonies: [],
  },
  {
    id: "p1",
    title: "Everest Base Camp Trek",
    slug: "ebc-trek",
    duration: "14 Days",
    location: "Solukhumbu, Nepal",
    rating: 4.8,
    reviewsCount: 3,
    highlights: [
      "Lukla Flight",
      "Namche Bazaar",
      "Kalapathar Sunset",
      "Base Camp Visit",
    ],
    price: "$1,299",
    image:
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=1200",
      // "https://images.unsplash.com/photo-1544735745-b81216c7ad8f?auto=format&fit=crop&q=80&w=600",
      // "https://images.unsplash.com/photo-1582234372722-50d7ccc30e5a?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&q=80&w=600",
    ],
    description:
      "The Everest Base Camp trek is the most famous trek in the world. It leads you through the high-altitude landscapes of the Khumbu region, offering spectacular views of Mount Everest, Lhotse, and Nuptse. You will experience the rich Sherpa culture, visit ancient monasteries, and reach the base of the world's highest peak.",
    category: "domestic",
    type: "trek",
    isFeatured: true,
    itinerary: [
      {
        day: "01",
        title: "Arrival in Kathmandu",
        desc: "Our representative will meet you at the airport and transfer you to your hotel. Evening briefing about the trek.",
      },
      {
        day: "02",
        title: "Fly to Lukla & Trek to Phakding",
        desc: "An exciting flight to Lukla followed by a 3-4 hour trek through beautiful sherpa villages to Phakding.",
      },
      {
        day: "03",
        title: "Trek to Namche Bazaar",
        desc: "Entering the Sagarmatha National Park and crossing the famous Hillary Bridge to reach the vibrant town of Namche.",
      },
      {
        day: "04",
        title: "Acclimatization Day",
        desc: "Hike to Everest View Hotel for the first glimpse of Mt. Everest and visit the local museum.",
      },
      {
        day: "05",
        title: "Namche to Tengboche",
        desc: "A scenic trail leading to the famous Tengboche Monastery with 360-degree mountain views.",
      },
    ],
    includes: [
      "Airport pickups and drops in private vehicle",
      "Standard tea house accommodation during the trek",
      "Full meals (Breakfast, Lunch, Dinner) during the trek",
      "Kathmandu to Lukla return flights",
      "Highly experienced, helpful and friendly Government licensed guide",
      "Porters (1 porter for 2 trekkers)",
      "TIMS Card and Sagarmatha National Park entry permits",
    ],
    excludes: [
      "International flight fares",
      "Nepal entry visa fee",
      "Travel insurance (mandatory)",
      "Extra night accommodation in Kathmandu",
      "Personal trekking gear",
      "Tips for guide and porters",
    ],
    restrictions: [
      "Not Suitable for pets",
      "Children below 10 need supervison",
      "Strict noise policy after 10PM",
    ],
    whatToBring: ["Warm Clothes", "Comfortable Shoes", "Camera", "Sunscreen"],
    faqs: [
      {
        question: "What is the best time to trek?",
        answer:
          "The best seasons are Spring (March to May) and Autumn (September to November).",
      },
      {
        question: "Do I need previous experience?",
        answer:
          "While no technical climbing skills are needed, a good level of physical fitness is required.",
      },
    ],
    pricingTable: [
      {
        service: "Full EBC Trek Package",
        ageGroup: "Adult",
        priceNepali: "Rs 120,000",
        priceForeigner: "$1,299",
      },
      {
        service: "Heli Return Add-on",
        ageGroup: "All",
        priceNepali: "Rs 50,000",
        priceForeigner: "$500",
      },
    ],
    testimonies: [
      {
        id: "rev1",
        userName: "Mark Wilson",
        rating: 5,
        date: "2024-05-12",
        comment:
          "An absolute dream come true. The guide from Trip Himalaya was incredibly knowledgeable and helpful.",
        userAvatar: "https://i.pravatar.cc/150?u=mark",
        location: "Sydney, Australia",
      },
      {
        id: "rev2",
        userName: "Sarah Jenkins",
        rating: 4,
        date: "2024-04-20",
        comment:
          "Challenging but rewarding. The views from Kalapathar are something I will never forget.",
        userAvatar: "https://i.pravatar.cc/150?u=sarah",
        location: "London, UK",
      },
      {
        id: "rev3",
        userName: "Carlos Ruiz",
        rating: 5,
        date: "2024-03-15",
        comment:
          "Top notch service from start to finish. Everything was well organized.",
        userAvatar: "https://i.pravatar.cc/150?u=carlos",
        location: "Madrid, Spain",
      },
    ],
  },
  {
    id: "p2",
    title: "Annapurna Base Camp",
    slug: "abc-trek",
    rating: 3.2,
    duration: "10 Days",
    location: "Kaski, Nepal",
    highlights: [
      "Natural Hot Springs",
      "Annapurna Massif Views",
      "Ghandruk Village",
      "Cultural Immersion",
    ],
    price: "$899",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600",
    category: "domestic",
    type: "trek",
    isFeatured: true,
    itinerary: [
      {
        day: "01",
        title: "Drive to Nayapul & Trek to Tikhedhunga",
        desc: "A scenic drive from Pokhara followed by an easy trek to start our journey.",
      },
      {
        day: "02",
        title: "Trek to Ghorepani",
        desc: "The famous 3000 stone steps of Ulleri lead us to the beautiful rhododendron forest of Ghorepani.",
      },
      {
        day: "03",
        title: "Poon Hill Sunrise & Trek to Tadapani",
        desc: "Early morning hike for a panoramic sunrise view of Dhaulagiri and Annapurna ranges.",
      },
    ],
    testimonies: [
      {
        id: "rev1",
        userName: "Mark Wilson",
        rating: 5,
        date: "2024-05-12",
        comment:
          "An absolute dream come true. The guide from Trip Himalaya was incredibly knowledgeable and helpful.",
        userAvatar: "https://i.pravatar.cc/150?u=mark",
        location: "Sydney, Australia",
      },
      {
        id: "rev2",
        userName: "Sarah Jenkins",
        rating: 4,
        date: "2024-04-20",
        comment:
          "Challenging but rewarding. The views from Kalapathar are something I will never forget.",
        userAvatar: "https://i.pravatar.cc/150?u=sarah",
        location: "London, UK",
      },
      {
        id: "rev3",
        userName: "Carlos Ruiz",
        rating: 5,
        date: "2024-03-15",
        comment:
          "Top notch service from start to finish. Everything was well organized.",
        userAvatar: "https://i.pravatar.cc/150?u=carlos",
        location: "Madrid, Spain",
      },
    ],
  },
  {
    id: "p4",
    title: "Mardi Himal Trek",
    slug: "mardi-himal",
    duration: "7 Days",
    highlights: [
      "Close View of Machhapuchhre",
      "High Camp Overnight",
      "Rhododendron Forests",
      "Pokhara City Stay",
    ],
    price: "$550",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "trek",
    isFeatured: true,
    includes: [
      "Airport pickups and drops in private vehicle",
      "Standard tea house accommodation during the trek",
      "Full meals (Breakfast, Lunch, Dinner) during the trek",
      "Kathmandu to Lukla return flights",
      "Highly experienced, helpful and friendly Government licensed guide",
      "Porters (1 porter for 2 trekkers)",
      "TIMS Card and Sagarmatha National Park entry permits",
    ],
    testimonies: [],
  },
  {
    id: "p3",
    title: "Bali Luxury Escape",
    slug: "bali-escape",
    duration: "4 Days",
    highlights: [
      "Uluwatu Sunset",
      "Ubud Rice Terrace",
      "Luxury Beach Resort",
      "Water Sports",
    ],
    price: "$1,150",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200",
    category: "international",
    type: "tour",
    includes: [
      "Airport pickups and drops in private vehicle",
      "Standard tea house accommodation during the trek",
      "Full meals (Breakfast, Lunch, Dinner) during the trek",
      "Kathmandu to Lukla return flights",
      "Highly experienced, helpful and friendly Government licensed guide",
      "Porters (1 porter for 2 trekkers)",
      "TIMS Card and Sagarmatha National Park entry permits",
    ],
    isFeatured: true,
    itinerary: [
      {
        day: "01",
        title: "Arrival & Beach Sunset",
        desc: "Transfer to your luxury beachfront villa in Seminyak. Evening seafood dinner on the beach.",
      },
      {
        day: "02",
        title: "Cultural Ubud Tour",
        desc: "Visit the Sacred Monkey Forest, Tegalalang Rice Terraces, and traditional art markets.",
      },
      {
        day: "03",
        title: "Water Sports & Uluwatu",
        desc: "Morning paragliding and jet-skiing followed by a visit to the cliffside Uluwatu temple for Kecak dance.",
      },
    ],
    testimonies: [
      {
        id: "rev1",
        userName: "Mark Wilson",
        rating: 5,
        date: "2024-05-12",
        comment:
          "An absolute dream come true. The guide from Trip Himalaya was incredibly knowledgeable and helpful.",
        userAvatar: "https://i.pravatar.cc/150?u=mark",
        location: "Sydney, Australia",
      },
      {
        id: "rev2",
        userName: "Sarah Jenkins",
        rating: 4,
        date: "2024-04-20",
        comment:
          "Challenging but rewarding. The views from Kalapathar are something I will never forget.",
        userAvatar: "https://i.pravatar.cc/150?u=sarah",
        location: "London, UK",
      },
      {
        id: "rev3",
        userName: "Carlos Ruiz",
        rating: 5,
        date: "2024-03-15",
        comment:
          "Top notch service from start to finish. Everything was well organized.",
        userAvatar: "https://i.pravatar.cc/150?u=carlos",
        location: "Madrid, Spain",
      },
    ],
  },
  {
    id: "p5",
    title: "Pokhara & Chitwan Tour",
    slug: "pokhara-chitwan",
    duration: "6 Days",
    highlights: [
      "Lakeside Evening",
      "Elephant Safari",
      "Tharu Cultural Show",
      "Himalayan Sunrise",
    ],
    price: "$450",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600",
    category: "domestic",
    type: "tour",
    isFeatured: true,
    testimonies: [],
  },
  {
    id: "p6",
    title: "Dubai Desert Adventure",
    slug: "dubai-tour",
    duration: "5 Days",
    highlights: [
      "Burj Khalifa Visit",
      "Desert Safari",
      "Marina Cruise",
      "Gold Souk Shopping",
    ],
    price: "$899",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200",
    category: "international",
    type: "tour",
    isFeatured: true,
    testimonies: [],
  },
  {
    id: "p7",
    title: "Langtang Valley Trek",
    slug: "langtang-valley",
    duration: "8 Days",
    highlights: [
      "Kyanjin Gompa",
      "Langtang Lirung Views",
      "Tamang Culture",
      "Yak Cheese Factory",
    ],
    price: "$650",
    image:
      "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "trek",
    isFeatured: false,
    testimonies: [],
  },
  {
    id: "p8",
    title: "Ghorepani Poon Hill Trek",
    slug: "poon-hill",
    duration: "5 Days",
    highlights: [
      "Poon Hill Sunrise",
      "Annapurna Views",
      "Rhododendron Forest",
      "Short & Easy Trek",
    ],
    price: "$399",
    image:
      "https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "trek",
    isFeatured: true,
    testimonies: [],
  },
  {
    id: "p9",
    title: "Upper Mustang Trek",
    slug: "upper-mustang",
    duration: "14 Days",
    highlights: [
      "Lo Manthang",
      "Ancient Caves",
      "Restricted Kingdom",
      "Trans-Himalayan Desert",
    ],
    price: "$2,200",
    image:
      "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "trek",
    isFeatured: false,
    testimonies: [],
  },
  {
    id: "p10",
    title: "Manaslu Circuit Trek",
    slug: "manaslu-circuit",
    duration: "16 Days",
    highlights: [
      "Larkya La Pass",
      "Remote Villages",
      "Less Crowded Route",
      "Manaslu Range",
    ],
    price: "$1,350",
    image:
      "https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "trek",
    isFeatured: false,
    testimonies: [],
  },
  {
    id: "p11",
    title: "Kathmandu Valley Heritage Tour",
    slug: "ktm-heritage",
    duration: "3 Days",
    highlights: [
      "Pashupatinath",
      "Boudhanath Stupa",
      "Bhaktapur Durbar Square",
      "Swayambhunath",
    ],
    price: "$250",
    image:
      "https://images.unsplash.com/photo-1545231097-cbd796f1d95f?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "tour",
    isFeatured: true,
    testimonies: [],
  },
  {
    id: "p12",
    title: "Everest Scenic Flight",
    slug: "everest-flight",
    duration: "1 Day",
    highlights: [
      "Aerial Everest View",
      "Guaranteed Window Seat",
      "Short Time Commitment",
    ],
    price: "$240",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "tour",
    isFeatured: false,
    testimonies: [],
  },
  {
    id: "p13",
    title: "Thailand Beach & City Tour",
    slug: "thailand-tour",
    duration: "7 Days",
    highlights: [
      "Bangkok City Tour",
      "Phi Phi Islands",
      "Night Markets",
      "Island Hopping",
    ],
    price: "$1,050",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    category: "international",
    type: "tour",
    isFeatured: true,
    testimonies: [],
  },
  {
    id: "p14",
    title: "Singapore City Break",
    slug: "singapore-city",
    duration: "4 Days",
    highlights: [
      "Marina Bay Sands",
      "Sentosa Island",
      "Universal Studios",
      "City Skyline",
    ],
    price: "$1,200",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=1200",
    category: "international",
    type: "tour",
    isFeatured: false,
    testimonies: [],
  },
  {
    id: "p15",
    title: "Maldives Honeymoon Escape",
    slug: "maldives-honeymoon",
    duration: "5 Days",
    highlights: [
      "Overwater Villa",
      "Snorkeling",
      "Private Beach",
      "Luxury Resorts",
    ],
    price: "$2,500",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1200",
    category: "international",
    type: "tour",
    isFeatured: true,
    testimonies: [],
  },
  {
    id: "p16",
    title: "Japan Cherry Blossom Tour",
    slug: "japan-sakura",
    duration: "8 Days",
    highlights: [
      "Tokyo & Kyoto",
      "Sakura Season",
      "Cultural Experience",
      "Bullet Train",
    ],
    price: "$2,100",
    image:
      "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&q=80&w=1200",
    category: "international",
    type: "tour",
    isFeatured: false,
    testimonies: [],
  },
  {
    id: "p17",
    title: "Rara Lake Trek",
    slug: "rara-lake",
    duration: "10 Days",
    highlights: [
      "Nepal’s Largest Lake",
      "Remote Karnali Region",
      "Pristine Nature",
    ],
    price: "$1,100",
    image:
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "trek",
    isFeatured: false,
    testimonies: [],
  },
  {
    id: "p18",
    title: "Bardiya Jungle Safari",
    slug: "bardiya-safari",
    duration: "4 Days",
    highlights: [
      "Tiger Tracking",
      "River Rafting",
      "Wildlife Safari",
      "Tharu Culture",
    ],
    price: "$420",
    image:
      "https://images.unsplash.com/photo-1552083375-1447ce886485?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "tour",
    isFeatured: false,
    testimonies: [],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "John Doe",
    country: "United Kingdom",
    message:
      "Trip Himalaya made our EBC trek absolutely unforgettable. The organization was top-notch!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=john",
  },
  {
    id: "t2",
    name: "Anita Sharma",
    country: "Nepal",
    message:
      "Best service for domestic air tickets. Highly recommended for their prompt response.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=anita",
  },
  {
    id: "t3",
    name: "David Smith",
    country: "USA",
    message:
      "Amazing hospitality and expert guidance. They handled our visa and hotel bookings seamlessly.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=david",
  },
];

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    category: "tour",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600",
    title: "Mountain Tour",
  },
  {
    id: "g2",
    category: "vehicle",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200",
    title: "Our Private Van",
  },
  {
    id: "g3",
    category: "activity",
    image:
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=1200",
    title: "Paragliding in Pokhara",
  },
  {
    id: "g4",
    category: "office",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200",
    title: "Our KTM Office",
  },
];
export const workPermitCountries = [
  {
    id: "uae",
    name: "UAE",
    flag: "AE",
    desc: "Complete processing for Dubai, Abu Dhabi & more.",
  },
  {
    id: "qatar",
    name: "Qatar",
    flag: "QA",
    desc: "Hassle-free work permit for Qatar jobs.",
  },
  {
    id: "saudi",
    name: "Saudi Arabia",
    flag: "SA",
    desc: "Expert assistance for KSA work permits.",
  },
  {
    id: "malaysia",
    name: "Malaysia",
    flag: "MY",
    desc: "Fast processing for Malaysia employment.",
  },
  {
    id: "other",
    name: "Other Countries",
    flag: "🌐",
    desc: "Support for various other global destinations.",
  },
];
// Work Permit Testimonials (for WorkPermitPage)
export const workPermitTestimonials = [
  {
    id: "wp1",
    name: "Suman Karki",
    country: "UAE (Dubai)",
    rating: 5,
    message:
      "Trip Himalaya handled my श्रम स्वीकृति end-to-end. The document checklist was clear, and I got approval faster than I expected. WhatsApp updates were super helpful.",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "wp2",
    name: "Prakash Tamang",
    country: "Qatar (Doha)",
    rating: 5,
    message:
      "I was worried about rejection because my papers were not complete. They reviewed everything, fixed the missing items, and the process went smoothly. Very professional support.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "wp3",
    name: "Bishnu Shrestha",
    country: "Saudi Arabia (Riyadh)",
    rating: 4,
    message:
      "Good service and transparent steps. The timeline matched what they told me and they guided me properly for insurance + verification. Recommended for first-time applicants.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "wp4",
    name: "Ramesh Adhikari",
    country: "Malaysia (Kuala Lumpur)",
    rating: 5,
    message:
      "I needed renewal and didn’t know the updated requirements. They handled the paperwork and follow-ups. I received my renewed permit without hassle.",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=200",
  },
];

export const travelGuides: TravelGuide[] = [
  {
    id: "tg1",
    title: "Getting in Nepal",
    slug: "getting-in-nepal",
    icon: "Plane",
    content: `Nepal is primarily accessed by air through Tribhuvan International Airport (KTM) in Kathmandu. 
    There are several international carriers connecting Kathmandu to major hubs in the Middle East, Asia, and Europe.
    
    By Land: There are several border crossing points from India (Kakarbhitta, Birgunj, Belahiya, Jamunaha, Mohana, and Gaddachauki) and one from China (Kodari/Rasuwagadhi). 
    Travelers entering by land must ensure they have the proper visa documentation at the checkpoint.`,
  },
  {
    id: "tg2",
    title: "Best Seasons To Visit",
    slug: "best-seasons-to-visit",
    icon: "Calendar",
    content: `The best time to visit Nepal depends on your planned activities.
    
    Autumn (Sept - Nov): This is the peak tourist season. The weather is clear, dry, and provides excellent visibility for mountain trekking.
    Spring (March - May): The second best time, especially for nature lovers as rhododendrons bloom and temperatures are moderate.
    Winter (Dec - Feb): Good for low-altitude tours and sightseeing in cities like Kathmandu and Pokhara, though it gets very cold in the mountains.
    Monsoon (June - Aug): Best for visiting rain-shadow areas like Upper Mustang or Dolpo, but trekking in most areas is difficult due to leeches and rain.`,
  },
  {
    id: "tg3",
    title: "Visa and Entry Procedure",
    slug: "visa-and-entry-procedure",
    icon: "FileText",
    content: `Foreign nationals (except Indians) require a visa to enter Nepal.
    
    Visa on Arrival: Most nationalities can obtain a visa on arrival at Kathmandu airport and land borders. You will need a valid passport (at least 6 months validity) and a passport-size photo.
    Fees: 
    - 15 Days: $30
    - 30 Days: $50
    - 90 Days: $125
    
    Online Application: It is highly recommended to fill out the online visa form before arrival to save time at the airport.`,
  },
  {
    id: "tg4",
    title: "Travel Insurance",
    slug: "travel-insurance-guide",
    icon: "ShieldCheck",
    content: `Travel insurance is mandatory for anyone planning to trek in the Himalayas. 
    Ensure your policy specifically covers:
    - High altitude trekking (up to 6,000m if doing EBC).
    - Emergency Helicopter Evacuation.
    - Medical expenses and hospitalization.
    - Theft or loss of luggage.
    
    Always carry a hard copy of your insurance certificate and the emergency contact numbers provided by your provider.`,
  },
  {
    id: "tg5",
    title: "Altitude Sickness",
    slug: "altitude-sickness",
    icon: "Mountain",
    content: `Acute Mountain Sickness (AMS) is a serious concern above 2,500 meters.
    
    Symptoms: Headache, nausea, dizziness, fatigue, and loss of appetite.
    Prevention: 
    - Ascend slowly (max 300-500m per day).
    - Drink plenty of water (3-4 liters daily).
    - Avoid alcohol and smoking.
    - Take acclimatization days seriously.
    
    Treatment: If symptoms persist, descend immediately. Consult with our expert guides who are trained in wilderness first aid.`,
  },
  {
    id: "tg6",
    title: "Internet Access in Nepal",
    slug: "internet-access-in-nepal",
    icon: "Wifi",
    content: `Internet connectivity is widely available in Nepal's urban centers.
    
    Hotels & Cafes: Most offer free Wi-Fi.
    Mobile Data: Purchasing a local SIM (NTC or Ncell) is the best way to stay connected. Data packages are affordable.
    On Treks: Many teahouses in the Everest and Annapurna regions now offer Wi-Fi (often for a small fee). However, connection can be unstable in bad weather.`,
  },
  {
    id: "tg7",
    title: "Amazing truths about Nepal",
    slug: "amazing-truths-about-nepal",
    icon: "Zap",
    content: `1. Nepal is home to 8 of the world's 10 highest peaks.
    2. It is the birthplace of Lord Buddha (Lumbini).
    3. The Nepali flag is the only non-quadrilateral national flag in the world.
    4. Nepal was never colonized by any foreign power.
    5. The calendar in Nepal (Bikram Sambat) is approximately 56.7 years ahead of the Gregorian calendar.`,
  },
  {
    id: "tg8",
    title: "Some Useful Nepali Phrases",
    slug: "some-useful-nepali-phrases",
    icon: "MessageCircle",
    content: `- Namaste: Hello / Goodbye
    - Dhanyabaad: Thank you
    - Sanchai hunuhunchha?: How are you?
    - Maalai sanchai chha: I am fine
    - Mitho chha: It's delicious
    - Kati ho?: How much?
    - Ramro chha: It's good
    - Hajur: (A polite way of saying 'Yes' or 'Excuse me')`,
  },
];
export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "Top 10 Essential Tips for Your First Everest Base Camp Trek",
    slug: "ebc-trekking-tips",
    excerpt:
      "Planning your first trek to the roof of the world? Here is everything you need to know about packing, training, and altitude.",
    content: `The Everest Base Camp trek is more than just a hike; it's a pilgrimage for adventurers. Reaching the base of the world's tallest peak is a life-changing milestone. However, it requires meticulous preparation.

    1. Train Early : Start cardiovascular training at least 3 months before your departure. Focus on leg strength and endurance.
    2.  Pack Light : You'll be carrying your gear for days. Prioritize moisture-wicking fabrics and high-quality boots.
    3. Hydration is Key : Altitude dehydrates you faster. Drink at least 4 liters of water daily.
    4. Respect the Altitude : Move slowly. Acclimatization days in Namche Bazaar and Dingboche are non-negotiable.
    5. Carry Cash : ATMs are non-existent past Namche, and credit cards are rarely accepted.
    6. Bring a Power Bank : Charging your devices gets expensive as you go higher.
    7. Sun Protection : The sun at high altitudes is incredibly strong. Wear a hat and high-SPF sunscreen.
    8. Local Culture : Learn a few Sherpa phrases. A little 'Tashi Delek' goes a long way.
    9. Snack Smart : Bring energy bars and nuts to supplement the dal bhat.
    10. Enjoy the Journey : Don't just focus on the destination. The views in the Khumbu valley are unparalleled.`,
    category: "TREKKING",
    author: "Adventure Desk",
    date: "Sept 21, 2025",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600",
    readTime: "8 min read",
  },
  {
    id: "b2",
    title: "Bali Beyond Beaches: Discovering the Cultural Heart of Ubud",
    slug: "bali-cultural-guide",
    excerpt:
      "Experience the spiritual side of Bali with our guide to hidden temples, local art markets, and traditional ceremonies.",
    category: "INTERNATIONAL",
    author: "Travel Editor",
    date: "Aug 24, 2025",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
    readTime: "6 min read",
  },
  {
    id: "b3",
    title: "How to Choose the Right Travel Insurance for Himalayan Tours",
    slug: "travel-insurance-guide",
    excerpt:
      "Safety first! Learn why specific mountain coverage is vital for your high-altitude adventures in Nepal.",
    category: "TRAVEL TIPS",
    author: "Support Team",
    date: "Nov 21, 2024",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    readTime: "5 min read",
  },
  {
    id: "b4",
    title: "Nepal Visa on Arrival: A Simplified 2025 Guide for Foreigners",
    slug: "nepal-visa-guide",
    excerpt:
      "Getting your entry permit at Kathmandu airport is easier than ever with our step-by-step documentation guide.",
    category: "VISA ASSISTANCE",
    author: "Legal Desk",
    date: "Nov 17, 2024",
    image:
      "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?auto=format&fit=crop&q=80&w=800",
    readTime: "4 min read",
  },
  {
    id: "b5",
    title: "Everything You Need to Know About the ABC Heli Tour Experience",
    slug: "abc-heli-tour-blog",
    excerpt:
      "Short on time but want the big views? The Annapurna Base Camp Helicopter tour is the ultimate luxury experience.",
    category: "LUXURY",
    author: "Tour Guide",
    date: "Nov 10, 2024",
    image:
      "https://images.unsplash.com/photo-1544016768-982d1554f0b9?auto=format&fit=crop&q=80&w=800",
    readTime: "7 min read",
  },
];
export const videoPosts: VideoPost[] = [
  {
    id: "v1",
    title: "Everest Base Camp: The Ultimate Trekking Experience",
    slug: "everest-base-camp-vlog",
    videoUrl: "https://www.youtube.com/embed/S_8S_f5zWfQ",
    thumbnail:
      "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=1600",
    category: "ADVENTURE",
    duration: "12:45",
    views: "15.4K",
    date: "Oct 12, 2025",
    author: "Sam Adventures",
    description:
      "Join our team as we navigate the iconic trails to the base of the world's highest peak.",
    content: `Witness the majesty of the Himalayas in stunning detail. Our 14-day trek to Everest Base Camp was a test of endurance and a feast for the eyes. From the bustling streets of Namche Bazaar to the serene heights of Kalapathar, we captured every moment.

    In this video, we cover:
    - Packing essentials for high altitude.
    - Life at the teahouses along the trail.
    - Capturing the sunrise over Mt. Everest.
    - Meeting the local Sherpa communities.`,
  },
  {
    id: "v2",
    title: "A Glimpse of Heaven: Pokhara City Guide",
    slug: "pokhara-city-guide-video",
    videoUrl: "https://www.youtube.com/embed/6iWvI_W9tYI",
    thumbnail:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600",
    category: "DESTINATIONS",
    duration: "08:20",
    views: "8.2K",
    date: "Sept 05, 2025",
    author: "Maya Travel",
    description:
      "Discover the lakeside serenity and mountain views of Nepal's tourism capital.",
    content: `Pokhara is the jewel of Nepal. Whether you're looking for extreme adventure like paragliding or a quiet afternoon by Phewa Lake, this city has it all.

    Featured in this vlog:
    - Boat rides on the emerald waters of Phewa.
    - Exploring the mystical Bat Cave.
    - Early morning views from Sarangkot.
    - The best lakeside cafes for sunset drinks.`,
  },
  {
    id: "v3",
    title: "Wild Nepal: Chitwan National Park Safari",
    slug: "chitwan-safari-vlog",
    videoUrl: "https://www.youtube.com/embed/8oW8I5S4p2w",
    thumbnail:
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=1600",
    category: "WILDLIFE",
    duration: "06:15",
    views: "12.1K",
    date: "Aug 22, 2025",
    author: "Eco Wild",
    description:
      "Tracking the One-Horned Rhino and Royal Bengal Tiger in the heart of the jungle.",
    content: `Deep in the subtropical lowlands of Nepal, Chitwan National Park offers one of the best wildlife viewing experiences in Asia. We go off-road to find the rare One-Horned Rhino.

    Highlights:
    - Jeep safari through the dense Sal forest.
    - Canoeing on the Rapti River.
    - Bird watching at the Beeshazar Lake.
    - Learning about Tharu culture and tradition.`,
  },
  {
    id: "v4",
    title: "Himalayan Heli Tour: Annapurna Base Camp",
    slug: "abc-heli-tour-vlog",
    videoUrl: "https://www.youtube.com/embed/TIDoIOn2m6w",
    thumbnail:
      "https://images.unsplash.com/photo-1544016768-982d1554f0b9?auto=format&fit=crop&q=80&w=1200",
    category: "LUXURY",
    duration: "04:30",
    views: "5.6K",
    date: "July 14, 2025",
    author: "Elite Tours",
    description:
      "Experience the Annapurna range like never before with our luxury helicopter tour.",
    content: `Don't have time for a two-week trek? No problem. We took a helicopter directly to the heart of the Annapurna Sanctuary.

    The ABC Heli Tour experience:
    - Flight path details from Pokhara.
    - Landing at 4,130m with 360-degree mountain views.
    - Breakfast among the peaks.
    - Safety protocols and what to expect on board.`,
  },
];
