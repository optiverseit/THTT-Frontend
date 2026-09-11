import type {
  Service,
  Package,
  Hotel,
  Vehicle,
  HeliTour,
  Testimonial,
  GalleryItem,
  TravelGuide,
  BlogPost,
  VideoPost,
  GalleryPhoto,
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
    name: "Holiday Tours",
    slug: "tours",
    icon: "Map",
    heroImage:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600",
    shortDesc:
      "Explore UNESCO heritage wonders, tranquil scenic lakes, wildlife safaris, and customized global holidays.",
    description:
      "Experience the rich cultural tapestry and natural splendors of Nepal and beyond with our expertly curated holiday tours. From UNESCO World Heritage monuments in Kathmandu to the deep jungles of Chitwan, the serene lakes of Pokhara, and international getaways, we provide end-to-end luxury management.",
    subServices: [
      "UNESCO Heritage Circuits",
      "Scenic Lake & Hill Stations",
      "Jungle Safaris & Wildlife",
      "Spiritual & Pilgrimage Tours",
      "International Holidays (Dubai, Bali, Thailand)",
      "Luxury Customized Vacations",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800",
    ],
  },
  {
    id: "5",
    name: "Adventure Activities",
    slug: "activities",
    icon: "Activity",
    heroImage:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1600",
    shortDesc:
      "Tandem paragliding, high-drop bungee jumping, raging whitewater river rafting, and world-record ziplining.",
    description:
      "Unleash your adrenaline in Nepal's top adventure playground. Fly over Himalayan lakes with APPI-certified tandem paragliding pilots, jump from the world's highest bungee bridges, conquer Class IV river rapids on the Trishuli and Bhote Koshi, or glide down the world's steepest zip-flyer.",
    subServices: [
      "Tandem Paragliding in Pokhara",
      "228m Kushma & Bhote Koshi Bungee",
      "Trishuli & Bhote Koshi Whitewater Rafting",
      "World's Steepest ZipFlyer (140 km/h)",
      "Canyon Swing & Waterfall Abseiling",
      "Multi-Action 2-Day Adventure Combos",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1544016768-982d1554f0b9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&q=80&w=800",
    ],
  },
  {
    id: "6",
    name: "Himalayan Trekking",
    slug: "trekking",
    icon: "Mountain",
    heroImage:
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=1600",
    shortDesc:
      "Guided expeditions through the world's highest mountains in Everest, Annapurna, Langtang, and Manaslu.",
    description:
      "Walk the world's most legendary alpine trails with our government-licensed native Sherpa guides. From the iconic Everest Base Camp and Kalapathar sunrise to the Annapurna Sanctuary, tranquil Mardi Himal ridge, and the remote Manaslu wilderness, we provide complete safety, teahouse lodges, permits, and daily health tracking.",
    subServices: [
      "Everest Base Camp & Kalapathar",
      "Annapurna Sanctuary & Circuit",
      "Mardi Himal Scenic Ridge Trek",
      "Langtang Valley & Kyanjin Gompa",
      "Manaslu & Remote Restricted Circuits",
      "Helicopter Return Trek Combos",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800",
    ],
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
    faqs: [
      {
        question: "Do I need any prior flying experience for tandem paragliding?",
        answer: "Absolutely not! Tandem paragliding means you fly attached to an APPI-certified expert pilot who handles all take-off, steering, and landing. You simply sit back, relax, and enjoy the breathtaking views of Phewa Lake and the Annapurna range.",
      },
      {
        question: "What is the minimum and maximum weight limit for paragliding?",
        answer: "The weight range is 35 kg (77 lbs) to 105 kg (231 lbs). Guests outside this range cannot fly for safety reasons. Please inform us in advance if you are close to these limits.",
      },
      {
        question: "How long does the actual flight last?",
        answer: "The standard tandem flight lasts 25–40 minutes depending on thermal conditions. Premium sunrise or thermal flights can be booked for extended 45–60 minute sessions.",
      },
      {
        question: "Are GoPro photos and videos included?",
        answer: "Yes! High-definition GoPro photos and video footage shot by your pilot are included and transferred to your phone immediately after landing via Bluetooth or USB. Drone footage is also available as an add-on.",
      },
      {
        question: "What happens if the weather is unsuitable for flying on my booking day?",
        answer: "Your safety is our priority. If weather conditions are unsafe (strong winds, rain, or poor visibility), we will reschedule your flight to the next available clear slot or issue a full 100% refund immediately.",
      },
    ],
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
    faqs: [
      {
        question: "What are the age and weight requirements for bungee jumping?",
        answer: "Minimum age is 16 years (under 18 requires signed parental consent). Weight must be between 40 kg and 110 kg. Medical conditions like heart problems, epilepsy, or recent surgeries are contraindicated — please consult your doctor beforehand.",
      },
      {
        question: "Is the bungee at The Last Resort safe and certified?",
        answer: "Yes. The Last Resort bungee (160m drop over Bhote Koshi river) is certified by the British Standards Institution and uses Swiss-engineered bungee cords. A trained safety crew is on-site at all times.",
      },
      {
        question: "What is included in the full-day package?",
        answer: "The full-day package includes: return transport from Kathmandu, the bungee jump, riverside lunch, and access to the canyon viewing area. Accommodation upgrade is also available.",
      },
      {
        question: "Can I get photos and video of my jump?",
        answer: "Yes! A professional videographer captures your jump from multiple angles. Photo + video packages are available for purchase on-site and transferred digitally on the spot.",
      },
      {
        question: "How do I get to The Last Resort from Kathmandu?",
        answer: "Comfortable tourist buses depart from Thamel, Kathmandu at approximately 7 AM and return by evening. The journey is around 2.5–3 hours through scenic mountain roads.",
      },
    ],
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
    faqs: [
      {
        question: "Do I need to know how to swim for river rafting?",
        answer: "Basic swimming ability is recommended but not strictly required. You will wear a certified life jacket and safety helmet at all times, and our trained river guides will brief you on self-rescue techniques before entering the water.",
      },
      {
        question: "What is the difficulty level of Trishuli rafting?",
        answer: "Trishuli offers Class III rapids — exciting but manageable for most healthy adults including beginners. The river includes thrilling drops, waves, and calm stretches perfect for first-time rafters.",
      },
      {
        question: "Is riverside camping included in the package?",
        answer: "Yes! The 2-day rafting package includes riverside tent camping with bonfire, traditional Nepali dinner, and breakfast. All camping equipment and cooking are handled by our crew.",
      },
      {
        question: "What should I bring for river rafting?",
        answer: "Pack quick-dry swimwear, sunscreen, sunglasses with a strap, water shoes or sandals with straps, and a change of dry clothes. We provide life jackets, helmets, paddles, and wetsuits if needed.",
      },
      {
        question: "Is transport from Kathmandu or Pokhara included?",
        answer: "Yes, return transport from your hotel in Kathmandu or Pokhara is included. Pick-up is typically at 7:30 AM and return is by late afternoon after the rafting journey.",
      },
    ],
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
    faqs: [
      {
        question: "What makes the ZipFlyer Pokhara unique?",
        answer: "The ZipFlyer Pokhara (also known as SkyFlyer) is one of the world's steepest and fastest zip-lines, dropping nearly 600m vertically over 1.8 km at speeds up to 120 km/h — all with a spectacular view of the Annapurna range and Phewa Lake.",
      },
      {
        question: "Is there a weight or age restriction?",
        answer: "Minimum weight is 35 kg and maximum is 120 kg. You must be at least 10 years old. Guests with heart conditions, vertigo, or pregnancy are not permitted.",
      },
      {
        question: "How long is the zip-line ride?",
        answer: "The full zip descent lasts approximately 60–90 seconds depending on your weight and the day's wind conditions.",
      },
      {
        question: "Does the package include photos and video?",
        answer: "Yes, a GoPro camera is mounted on your harness during the ride capturing the full descent. Photo and video packages are available for purchase on-site.",
      },
    ],
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
    faqs: [
      {
        question: "Do I need to be an experienced cyclist for mountain biking?",
        answer: "A moderate level of fitness and basic cycling ability is recommended. We offer trail options from beginner-friendly lakeside paths to challenging single-track descents on Himalayan hillsides. Your guide will match the trail to your fitness level.",
      },
      {
        question: "Is safety gear and a guide provided?",
        answer: "Yes. All guests receive a certified helmet, knee and elbow pads, and gloves. An experienced local trail guide accompanies your group throughout the entire ride.",
      },
      {
        question: "What type of bikes are used?",
        answer: "We use quality hybrid and full-suspension mountain bikes serviced and checked before every ride. Multiple frame sizes are available to suit different heights.",
      },
      {
        question: "What should I wear for mountain biking?",
        answer: "Wear comfortable athletic clothing, closed-toe shoes (trainers/sneakers work well), and bring a small backpack with water. Avoid loose, flowing clothing that could catch in the chain.",
      },
    ],
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
    faqs: [
      {
        question: "Do I need prior climbing experience for rock climbing?",
        answer: "No prior experience is needed! This is a beginner-friendly session. Our UIAGM-certified instructors will teach you basic technique, footwork, and safety protocols on the ground before you touch the rock face.",
      },
      {
        question: "What safety equipment is provided?",
        answer: "All safety equipment is provided — harness, helmet, climbing shoes, chalk bag, and a full top-rope belay setup. All gear meets CE/UIAA safety standards and is inspected before every session.",
      },
      {
        question: "How high are the climbing routes?",
        answer: "Routes range from 8 m to 25 m. Beginners start on easier Grade 3–4 routes while more confident climbers can attempt Grade 5–6 routes with instructor supervision.",
      },
      {
        question: "Can I go rock climbing if I have a fear of heights?",
        answer: "Many guests with mild height anxiety enjoy rock climbing! Our instructors are trained to guide you at your own pace. You are never pressured to go higher than your comfort level, and the rope and belay system ensure you are always safe.",
      },
    ],
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
    faqs: [
      {
        question: "Do I need to know how to swim for kayaking?",
        answer: "Basic swimming ability is strongly recommended. You will wear a life jacket and receive a full safety briefing including capsize recovery techniques before entering the water.",
      },
      {
        question: "Is kayaking suitable for children and beginners?",
        answer: "Yes! Phewa Lake kayaking is calm and perfect for families and first-timers. River kayaking is more suited to those with some paddle experience. Our guides assess your skill and recommend the right session.",
      },
      {
        question: "What is included in the kayaking session?",
        answer: "Included: kayak, paddle, life jacket, safety briefing, and a guide escort for the entire session. You can choose between sit-on-top kayaks (more stable) or sea kayaks for a longer touring experience.",
      },
    ],
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
    faqs: [
      {
        question: "What is a canyon swing and how is it different from bungee jumping?",
        answer: "In a bungee jump you fall vertically and bounce back. In a canyon swing, you free-fall and then arc forward like a giant pendulum over the gorge, giving a longer and different rush sensation. Many people prefer the swing for the extended freefall experience.",
      },
      {
        question: "What are the weight and age requirements?",
        answer: "Minimum weight is 40 kg and maximum is 110 kg. Minimum age is 12 years (under 18 requires parental consent). Medical conditions including heart issues, epilepsy, and pregnancy are contraindicated.",
      },
      {
        question: "Is the short access hike difficult?",
        answer: "The hike to the jump platform is approximately 10–15 minutes and is a moderate downhill trail. Proper footwear (closed-toe shoes) is required. The walk back up takes 15–20 minutes.",
      },
      {
        question: "Are photos and video available?",
        answer: "Yes! A professional camera operator captures your jump from the opposite canyon wall. Photo + video packages are available for purchase. Results are transferred digitally on the spot.",
      },
    ],
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
    faqs: [
      {
        question: "What activities are included in the 2-day Pokhara Ultimate Combo?",
        answer: "Day 1 includes tandem paragliding from Sarangkot over Phewa Lake followed by an exhilarating zipline ride. Day 2 features the high-adrenalin Pokhara cliff bungee jump and an afternoon relaxing lake cruise. A 4-star lakeside hotel stay is included.",
      },
      {
        question: "Is accommodation included in this combo package?",
        answer: "Yes, 1 night in a premium 4-star lakeside hotel in Pokhara is included, complete with complimentary breakfast and swimming pool access.",
      },
      {
        question: "Are safety gear and professional guides provided for each activity?",
        answer: "Every activity is operated by certified international standard operators with qualified pilots, jump masters, and safety equipment. Full safety briefings precede each experience.",
      },
      {
        question: "What happens if weather conditions prevent paragliding?",
        answer: "If adverse weather prevents paragliding on Day 1, the session is moved to Day 2 or substituted with an alternative activity or refunded per our weather policy.",
      },
    ],
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
    faqs: [
      {
        question: "What is included in the Kathmandu Adventure Starter Combo?",
        answer: "Day 1: Private transfer to Bhote Koshi for bungee jumping (160m drop). Day 2: Trishuli River rafting (Class III rapids) followed by a zipline session. All transport, safety gear, and lunch on Day 2 are included.",
      },
      {
        question: "How much travel is involved between activities?",
        answer: "The bungee site at Bhote Koshi is approximately 3 hours from Kathmandu. Trishuli River is about 2 hours away. All inter-location transport is handled by private tourist vehicle, making transitions comfortable and hassle-free.",
      },
      {
        question: "Can all three activities be done in 2 days?",
        answer: "Yes! Day 1 is dedicated to the bungee experience (full-day including transport). Day 2 covers both the Trishuli rafting trip and the zipline session back near Kathmandu.",
      },
      {
        question: "What fitness level is required for this combo?",
        answer: "A reasonable level of fitness is needed as the activities are physically demanding. You should be able to swim at least minimally for the rafting section. No extreme fitness is required — the activities are guided throughout.",
      },
    ],
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
    faqs: [
      {
        question: "What is included in the Trishuli Water Rush Combo?",
        answer: "Day 1: White water rafting on Class III Trishuli rapids with riverside lunch and overnight tent camping on the riverbank. Day 2: Kayak session on a calm stretch of river. All meals at camp, camping gear, safety equipment, and transport are included.",
      },
      {
        question: "Is riverside camping comfortable?",
        answer: "Yes! Tents are pitched on clean sandy riverbanks with sleeping bags and mats provided. A camp kitchen serves freshly cooked Nepali and continental meals. Evenings feature a bonfire under the stars.",
      },
      {
        question: "Do I need swimming or kayaking experience?",
        answer: "No prior kayaking experience is needed — Day 2's kayak session is on a calm stretch with full instructor guidance. For rafting, basic swimming ability is recommended but not mandatory as life jackets are provided.",
      },
      {
        question: "What is the best time for this water adventure combo?",
        answer: "October to May offers the best conditions. The monsoon season (June to September) brings higher, faster water which is thrilling but only suitable for experienced rafters.",
      },
    ],
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
    faqs: [
      {
        question: "What does the Sky & Trails Combo include?",
        answer: "Day 1: Tandem paragliding from Sarangkot with GoPro footage, then a sunset lakeside evening at Phewa. Day 2: Guided mountain biking through Himalayan trails with a sunrise viewpoint stop. Accommodation at a comfort hotel is included.",
      },
      {
        question: "What fitness level is required for mountain biking?",
        answer: "Moderate fitness is recommended. Trails are selected based on your experience level — from scenic flat lakeside routes to moderate hill descents. Your guide will assess and adjust the route on the day.",
      },
      {
        question: "Can the paragliding and biking be done on the same day?",
        answer: "We spread activities over 2 days so you can fully enjoy each experience without rushing. Paragliding is best in the morning when thermals are optimal, and biking tours depart at sunrise for cooler temperatures.",
      },
      {
        question: "What is the hotel accommodation like?",
        answer: "You will stay at a 3-star comfort hotel in Pokhara's lakeside area with breakfast included. Lake-view and mountain-view room upgrades are available on request.",
      },
    ],
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
    faqs: [
      {
        question: "What activities are included in the 2-day Pokhara Ultimate Combo?",
        answer: "Day 1 includes tandem paragliding from Sarangkot and the SkyFlyer zipline over the valley. Day 2 covers a bungee jump or canyon swing and an optional sunrise hike. All sessions include transport, gear, safety briefing, and GoPro footage.",
      },
      {
        question: "Is this combo suitable for first-time adventure travelers?",
        answer: "Yes! Paragliding and zipline are accessible for beginners. For bungee, a moderate level of courage is helpful but no experience is needed. Our instructors guide and encourage you every step of the way.",
      },
      {
        question: "What does the luxury hotel stay include?",
        answer: "The stay is at a 3-4 star lakeside hotel in Pokhara with breakfast included. Mountain-view or lake-view room upgrades are available at a small extra cost.",
      },
    ],
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
    faqs: [
      {
        question: "What activities are included in the 2-day Pokhara Ultimate Combo?",
        answer: "Day 1 includes tandem paragliding from Sarangkot and the SkyFlyer zipline over the valley. Day 2 covers a bungee jump or canyon swing and an optional sunrise hike. All sessions include transport, gear, safety briefing, and GoPro footage.",
      },
      {
        question: "Is this combo suitable for first-time adventure travelers?",
        answer: "Yes! Paragliding and zipline are accessible for beginners. For bungee, a moderate level of courage is helpful but no experience is needed.",
      },
    ],
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
    faqs: [
      {
        question: "What activities are included in the 2-day Pokhara Ultimate Combo?",
        answer: "Day 1 includes tandem paragliding from Sarangkot and the SkyFlyer zipline over the valley. Day 2 covers a bungee jump or canyon swing and an optional sunrise hike.",
      },
      {
        question: "Is this combo suitable for first-time adventure travelers?",
        answer: "Yes! All activities are guided by certified instructors and accessible to beginners.",
      },
    ],
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
        question: "What is the best time to do the Everest Base Camp Trek?",
        answer: "The best seasons are Spring (March to May) and Autumn (September to November). These months offer the clearest skies, stable weather, and the most dramatic views of Everest and surrounding peaks. Winter treks (December–February) are cold but less crowded.",
      },
      {
        question: "Do I need previous trekking experience for EBC?",
        answer: "No technical climbing skills are required, but a good level of physical fitness is essential. You should be comfortable walking 5–7 hours daily on steep mountain terrain for 14 consecutive days. We recommend regular cardiovascular exercise (jogging, hiking, cycling) for 4–6 weeks before departure.",
      },
      {
        question: "How serious is altitude sickness and how is it managed on this trek?",
        answer: "Altitude sickness (AMS) is a real risk above 3,500 m. Our itinerary includes mandatory acclimatization days at Namche Bazaar and Dingboche. Guides carry pulse oximeters, Diamox tablets, and oxygen kits. In serious cases, immediate heli-evacuation is coordinated within hours.",
      },
      {
        question: "What is the accommodation like during the EBC Trek?",
        answer: "You stay in comfortable teahouse lodges with twin-share or private rooms, warm blankets, and attached or shared bathrooms. At higher elevations (Gorak Shep, Lobuche), facilities are more basic but fully functional. All meals are freshly cooked — Dal Bhat, pasta, soups, and eggs are standard.",
      },
      {
        question: "What permits are required and does Trip Himalaya arrange them?",
        answer: "You need a TIMS card (Trekkers Information Management System) and Sagarmatha National Park entry permit. Both are 100% arranged by Trip Himalaya before your trek departure — no queuing at government offices needed.",
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
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=1600",
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
    faqs: [
      {
        question: "How difficult is the Annapurna Base Camp Trek?",
        answer: "The ABC Trek is rated Moderate to Challenging. You walk 4–6 hours daily on well-marked trails with gradual altitude gain. The famous 3,000 stone steps of Ulleri are the steepest section. Good fitness and some prior hiking experience is recommended.",
      },
      {
        question: "Can I soak in the Jhinu Danda hot springs on this trek?",
        answer: "Yes! Jhinu Danda natural hot springs are a highlight on the return route. After days of trekking, the warm geothermal pools beside the Modi Khola river are the perfect recovery stop. Included in the itinerary.",
      },
      {
        question: "What altitude does the Annapurna Base Camp reach?",
        answer: "The trek reaches Annapurna Base Camp at 4,130 m (13,549 ft). Acclimatization is built into the itinerary with a rest day at Machapuchare Base Camp (3,700 m) before the final push.",
      },
      {
        question: "What permits are needed for the ABC Trek?",
        answer: "You need an Annapurna Conservation Area Permit (ACAP) and a TIMS card. Both are arranged by Trip Himalaya before your departure date — no paperwork hassle for you.",
      },
      {
        question: "What is the best season for the Annapurna Base Camp Trek?",
        answer: "Spring (March–May) for rhododendron blooms and clear skies, and Autumn (September–November) for the most stable weather. Both seasons offer stunning sunrise views of Annapurna I, Machapuchare, and Hiunchuli.",
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
      "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&q=80&w=1200",
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
    faqs: [
      {
        question: "Is Mardi Himal Trek suitable for beginners?",
        answer: "Yes! Mardi Himal is one of the best introductory treks in Nepal. The trails are well-marked, the altitude is manageable (max 4,500 m at High Camp), and 7 days is a comfortable pace for first-time trekkers with basic fitness.",
      },
      {
        question: "How close do you get to Machhapuchhre (Fishtail) on this trek?",
        answer: "Mardi Himal offers some of the closest views of Machhapuchhre (Fishtail Peak) of any trek in Nepal. On the upper ridgeline between Low Camp and High Camp, you are literally walking alongside this iconic peak at eye level.",
      },
      {
        question: "What is the maximum altitude reached on Mardi Himal Trek?",
        answer: "The trek reaches Mardi Himal Base Camp / High Camp at approximately 4,200–4,500 m. This is well within the range for most fit trekkers without acclimatization issues, though altitude caution is still advised.",
      },
      {
        question: "What permits are required for Mardi Himal Trek?",
        answer: "An Annapurna Conservation Area Permit (ACAP) and TIMS card are required. Both are arranged by Trip Himalaya before departure so you can start the trail without any delays.",
      },
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
    faqs: [
      {
        question: "Do Nepali citizens need a visa to visit Bali, Indonesia?",
        answer: "Yes, Nepali passport holders require a Visa on Arrival (VoA) at Bali's Ngurah Rai International Airport. The fee is approximately USD 35 for 30 days. Trip Himalaya guides you through all documentation needed before and during travel.",
      },
      {
        question: "What currency is used in Bali and how do I manage money?",
        answer: "The Indonesian Rupiah (IDR) is the local currency. ATMs are widely available in tourist areas. We recommend carrying a mix of USD cash (for exchange) and a travel debit card. Credit cards are accepted at hotels and larger restaurants.",
      },
      {
        question: "Is Bali safe for solo travelers and couples?",
        answer: "Bali is one of Asia's most traveler-friendly destinations with a warm, welcoming culture. Tourist areas like Seminyak, Ubud, and Sanur are very safe. As always, normal travel precautions apply, and our local guide accompanies you throughout the itinerary.",
      },
      {
        question: "What is the best time to visit Bali?",
        answer: "April to October (dry season) is ideal. The rainy season (November to March) still has sunshine between showers. July and August are the busiest months. We recommend April–June or September–October for a good balance of weather and fewer crowds.",
      },
      {
        question: "What water sports activities are included in this Bali package?",
        answer: "The package includes jet-skiing at Tanjung Benoa, parasailing, and glass-bottom boat rides. Surfing lessons at Kuta Beach and snorkeling at Blue Lagoon can be added as optional extras.",
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
    faqs: [
      {
        question: "How do I travel between Pokhara and Chitwan on this tour?",
        answer: "The journey between Pokhara and Chitwan (approx. 4–5 hours) is done by comfortable tourist bus or private vehicle depending on your package tier. Scenic stops along the Prithvi Highway are included.",
      },
      {
        question: "What wildlife can I see at Chitwan National Park?",
        answer: "Chitwan is home to one-horned rhinos, Bengal tigers, gharial crocodiles, leopards, sloth bears, over 500 bird species, and wild elephants. Sightings of rhinos and deer are almost guaranteed on every jeep or elephant safari.",
      },
      {
        question: "What activities are included at Chitwan?",
        answer: "Included activities: jeep safari inside the national park, elephant bathing experience, dugout canoe ride on the Rapti River, Tharu cultural performance, and a nature walk with a naturalist guide.",
      },
      {
        question: "What is the best time to visit Chitwan National Park?",
        answer: "October to March is ideal when vegetation is low after monsoon, making wildlife easier to spot. The park is open year-round; however, some areas are closed during the monsoon (June–August) for conservation.",
      },
    ],
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
    faqs: [
      {
        question: "Is a visa required for Nepali citizens to visit Dubai?",
        answer: "Yes, Nepali citizens require a UAE visa. Trip Himalaya assists with the complete visa application process including all documents. A tourist visa is typically issued within 3–5 working days.",
      },
      {
        question: "What is the best time to visit Dubai?",
        answer: "November to April is the best time with pleasant temperatures (20–30°C). Summer months (May–September) are extremely hot (40–45°C) but hotel and flight rates drop significantly during this period.",
      },
      {
        question: "What does the Desert Safari include?",
        answer: "The evening desert safari includes dune bashing in 4x4 vehicles, camel rides, sandboarding, a traditional Bedouin camp dinner with BBQ, belly dancing and Tanoura dance performances, and stargazing in the desert.",
      },
      {
        question: "Is Dubai expensive and what currency is used?",
        answer: "Dubai uses the UAE Dirham (AED). It is a premium destination but very rewarding. Your package covers hotel, key attractions, and transport. Budget approximately $50–$100/day for meals, shopping, and additional activities.",
      },
    ],
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
    faqs: [
      {
        question: "How does Langtang compare to Everest and Annapurna treks?",
        answer: "Langtang is Nepal's third most popular trekking region and the closest high-altitude trek to Kathmandu (just 3–4 hours by road to the trailhead). It is less crowded than EBC or ABC, offers stunning Tamang culture, and reaches Kyanjin Gompa at 3,870 m in 8 days.",
      },
      {
        question: "What happened to Langtang after the 2015 earthquake?",
        answer: "The 2015 earthquake devastated Langtang Village. It has since been fully rebuilt with stronger structures and the trekking community has recovered. Trekking here actively supports the local Tamang community's livelihood and rebuilding efforts.",
      },
      {
        question: "Is the Langtang Valley Trek suitable for beginners?",
        answer: "Yes! The trail is well-marked and the altitude gain is gradual. The maximum altitude of 4,773 m (Tsergo Ri viewpoint) is optional. The main Kyanjin Gompa at 3,870 m is accessible for most fit trekkers.",
      },
      {
        question: "What permits are required for Langtang Trek?",
        answer: "A Langtang National Park Entry Permit and TIMS card are required. Both are arranged by Trip Himalaya. There is also a local municipal fee collected at the trailhead.",
      },
    ],
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
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    category: "domestic",
    type: "trek",
    isFeatured: true,
    faqs: [
      {
        question: "Is the Poon Hill Trek suitable for complete beginners?",
        answer: "Yes! Ghorepani Poon Hill is Nepal's most popular beginner trek. The trails are well-defined, teahouses are comfortable, and the maximum altitude (3,210 m at Poon Hill) is manageable without acclimatization issues for most healthy adults.",
      },
      {
        question: "What time do we hike to Poon Hill for the sunrise?",
        answer: "You depart from Ghorepani teahouse at approximately 4:30–5:00 AM for the 45-minute climb to Poon Hill (3,210 m). Sunrise over Dhaulagiri, Annapurna South, and Machhapuchhre is typically around 6:00–6:30 AM and is absolutely spectacular.",
      },
      {
        question: "What is the best season for the Poon Hill Trek?",
        answer: "March–May for rhododendron forests in full bloom (the trails become a sea of red and pink). October–November for crystal-clear mountain views. The trek can also be done in winter (December–February) with possible snowfall adding a magical atmosphere.",
      },
      {
        question: "How many hours do I walk each day on this trek?",
        answer: "Daily walking is 4–5 hours at a gentle pace, covering 8–15 km depending on the day. This is one of the least demanding multi-day treks in Nepal — perfect for families with older children and older adults.",
      },
    ],
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
    faqs: [
      {
        question: "What is the restricted area permit for Upper Mustang and how much does it cost?",
        answer: "Upper Mustang is a restricted trekking zone requiring a special Restricted Area Permit (RAP) costing USD 500 per person for the first 10 days (USD 50/day thereafter), plus an Annapurna Conservation Area Permit (ACAP). Trip Himalaya arranges all permits on your behalf.",
      },
      {
        question: "Is Upper Mustang Trek difficult?",
        answer: "The trek is Moderate in terms of trail difficulty as most paths are through the dry Trans-Himalayan plateau with gradual ascents. The main challenge is the remoteness and altitude (Lo Manthang at 3,840 m). Wind can be very strong in the afternoon.",
      },
      {
        question: "What is Lo Manthang and why is it special?",
        answer: "Lo Manthang is the walled capital of the ancient Kingdom of Mustang — a living medieval city that was completely off-limits to foreigners until 1992. It contains 15th-century monasteries, cave temples, and a palace that still hosts the King of Mustang. A truly unique cultural destination.",
      },
      {
        question: "What is the best season to trek Upper Mustang?",
        answer: "April to November is the ideal window. Uniquely, Upper Mustang is one of the few treks that can be done in the monsoon season (June–August) because the Himalayas shield the Mustang plateau from rain, offering a rare dry trekking option during monsoon.",
      },
    ],
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
    faqs: [
      {
        question: "What makes the Manaslu Circuit different from EBC or Annapurna Circuit?",
        answer: "Manaslu Circuit is a remote, restricted zone trek around the world's 8th highest mountain (8,163 m). It is less crowded than EBC or Annapurna, passes through pristine Tibetan-influenced villages, and crosses the spectacular Larkya La Pass at 5,106 m — one of the highest trekking passes in Nepal.",
      },
      {
        question: "What is the Larkya La Pass and how challenging is it?",
        answer: "Larkya La Pass (5,106 m) is the high point of the Manaslu Circuit and the most physically demanding day of the trek (8–9 hours). You cross glaciated terrain in the early morning to avoid afternoon winds. A high fitness level, proper acclimatization, and crampons (provided) are essential.",
      },
      {
        question: "What permits are required for the Manaslu Circuit?",
        answer: "Three permits are required: Manaslu Restricted Area Permit (USD 70–100/week depending on season), Manaslu Conservation Area Permit (MCAP), and Annapurna Conservation Area Permit (ACAP) for the final section. All are arranged by Trip Himalaya.",
      },
      {
        question: "Is a tent camping or teahouse trek?",
        answer: "Manaslu Circuit is a teahouse trek for most of the route. Accommodation at higher elevations (Dharamsala/Larkya Phedi) is in basic stone lodges with shared facilities. Below Samdo and Samagaon, teahouses are comfortable with private rooms available.",
      },
    ],
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
    faqs: [
      {
        question: "How many UNESCO World Heritage Sites does the Kathmandu Valley have?",
        answer: "The Kathmandu Valley has 7 UNESCO World Heritage Sites: Pashupatinath Temple, Boudhanath Stupa, Swayambhunath (Monkey Temple), Kathmandu Durbar Square, Patan Durbar Square, Bhaktapur Durbar Square, and Changu Narayan Temple. This 3-day tour covers the most iconic of these.",
      },
      {
        question: "Is a licensed guide included for all monument visits?",
        answer: "Yes! A government-licensed English-speaking guide accompanies you to every heritage site, providing detailed historical, cultural, and religious context. Guides speaking Hindi, French, German, Japanese, and Chinese are available on request.",
      },
      {
        question: "Are monument entry fees included in the tour price?",
        answer: "Yes, all UNESCO heritage monument entry fees, Durbar Square entry tickets, and stupa area fees are pre-included in the tour price. There are no surprise charges at the gates.",
      },
      {
        question: "What is the best time to visit Kathmandu for heritage sightseeing?",
        answer: "October to April offers the clearest, most comfortable weather for walking tours. Monsoon (June–August) brings lush greenery but some rain. March and April bring festivals like Holi and Bisket Jatra which add vibrant cultural colour to your visit.",
      },
    ],
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
    faqs: [
      {
        question: "How close do you actually see Mount Everest on the scenic flight?",
        answer: "The mountain flight offers breathtaking close-up aerial views of Everest (8,849 m) from as close as 5–8 km. Every passenger is guaranteed a window seat. You can clearly see the summit, the South Col, Khumbu Glacier, and surrounding peaks like Lhotse and Makalu.",
      },
      {
        question: "How long does the Everest scenic flight last?",
        answer: "The total flight duration is approximately 1 hour from Kathmandu, including the scenic mountain approach and return. The actual views of the Everest range are visible for approximately 30–40 minutes of the flight.",
      },
      {
        question: "What happens if clouds obscure the view on my flight day?",
        answer: "Mountain flights are operated only when visibility is good. If your flight is cancelled due to weather, it is rescheduled for the next clear morning or a full refund is issued. Flights always depart early morning (6:30–8:00 AM) when skies are clearest.",
      },
      {
        question: "Which airline operates the Everest scenic flight?",
        answer: "We book with CAAN-certified airlines including Buddha Air, Yeti Airlines, and Summit Air, all of which use modern turboprop aircraft specifically certified for Himalayan mountain flights.",
      },
    ],
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
    faqs: [
      {
        question: "Do Nepali citizens need a visa for Thailand?",
        answer: "Yes, Nepali citizens require a Thai Tourist Visa. It is available from the Royal Thai Embassy in Kathmandu (processing takes 2–3 business days) or as a Visa on Arrival at Bangkok Suvarnabhumi Airport for 2,000 THB (approx. USD 55). Trip Himalaya guides you through the process.",
      },
      {
        question: "What is the best time to visit Thailand?",
        answer: "November to February is the best period with cool, dry weather perfect for beach and city exploration. March–May is hot. June–October is rainy season — Phuket and Koh Samui are affected but Bangkok and Chiang Mai are mostly fine.",
      },
      {
        question: "Are the Phi Phi Islands included in this package?",
        answer: "Yes! A full-day speedboat island-hopping tour covering Ko Phi Phi Don, Ko Phi Phi Leh (Maya Bay), and Bamboo Island with snorkeling stops is included. This is one of the most breathtaking day trips in all of Southeast Asia.",
      },
      {
        question: "What currency is used in Thailand and how do I manage money?",
        answer: "The Thai Baht (THB) is the local currency. ATMs are available everywhere. We recommend carrying some cash for street markets and tuk-tuks. Credit cards are accepted at hotels, malls, and most restaurants.",
      },
    ],
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
    faqs: [
      {
        question: "Do Nepali citizens need a visa for Singapore?",
        answer: "Yes, Nepali passport holders require an entry visa for Singapore before departure. Trip Himalaya assists you with the visa submission through authorized visa agents. Processing generally takes 3 to 5 business days.",
      },
      {
        question: "What attractions are included in the Singapore package?",
        answer: "The package includes admission to Universal Studios Singapore on Sentosa Island, entry to Gardens by the Bay (Flower Dome and Cloud Forest), the Marina Bay Sands SkyPark Observation Deck, and a scenic Singapore River Cruise.",
      },
      {
        question: "What is the best way to get around Singapore during free time?",
        answer: "Singapore has one of the world's most efficient and affordable public transport networks. We provide an EZ-Link transport card topped up for MRT subway and public bus travel across the entire island.",
      },
      {
        question: "What is the weather like in Singapore?",
        answer: "Singapore has a tropical climate year-round with warm temperatures (26–32°C) and occasional brief showers. Light, breathable clothing and comfortable walking shoes are recommended.",
      },
    ],
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
    faqs: [
      {
        question: "Do tourists need a pre-arrival visa for the Maldives?",
        answer: "No, the Maldives grants a free 30-day Tourist Visa on Arrival to all nationalities, including Nepali citizens. You only need a valid passport (minimum 6 months validity), return flight tickets, and confirmed resort booking.",
      },
      {
        question: "How do we transfer from Malé International Airport to the resort?",
        answer: "Depending on your selected resort island, transfers are arranged via high-speed speedboat (for nearby atolls) or scenic seaplane (for outer atolls). Both transfer options provide spectacular turquoise lagoon views.",
      },
      {
        question: "Is this package all-inclusive?",
        answer: "Yes, our honeymoon escape includes all daily meals (breakfast, lunch, and gourmet dinner), unlimited select beverages, a private candlelit beach dinner, a couple's spa session, and complimentary non-motorized water sports.",
      },
      {
        question: "When is the best time to visit the Maldives?",
        answer: "November through April is the dry northeast monsoon with calm seas, crystal-clear water, and bright sunshine—ideal for honeymooners and diving. May to October brings occasional rain but offers excellent resort deals and lush tropical scenery.",
      },
    ],
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
    faqs: [
      {
        question: "When is the best time to see Cherry Blossoms (Sakura) in Japan?",
        answer: "Cherry blossom season typically peaks from late March to early April in Tokyo, Kyoto, and Osaka. Our tour is timed precisely around historical peak bloom forecasts to give you the most breathtaking hanami (flower-viewing) experience.",
      },
      {
        question: "How do we travel between Tokyo and Kyoto?",
        answer: "You will travel aboard the world-renowned Shinkansen (Bullet Train) reaching speeds over 300 km/h. Reserved seats with Mount Fuji views on clear days are included in your package.",
      },
      {
        question: "Do Nepali citizens need a visa to travel to Japan?",
        answer: "Yes, Nepali travelers require a Japan Tourist Visa. Trip Himalaya provides official itinerary documents, flight reservations, and hotel vouchers to ensure smooth application at the Embassy of Japan in Kathmandu.",
      },
      {
        question: "Is English widely spoken and are guides provided?",
        answer: "Our tour includes a professional bilingual English/Japanese-speaking guide for all scheduled tours and heritage visits. Free days come with easy-to-use transit maps and 24/7 concierge support.",
      },
    ],
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
    faqs: [
      {
        question: "Where is Rara Lake and what makes it special?",
        answer: "Rara Lake is Nepal's largest and deepest freshwater lake, situated at 2,990 meters in the remote Mugu district of western Nepal. Surrounded by pristine pine, spruce, and juniper forests with snowy Himalayan peaks in the background, it is often called the 'Queen of Lakes' due to its untouched, mirror-like beauty.",
      },
      {
        question: "How do we get to Rara Lake from Kathmandu?",
        answer: "The trip starts with a scenic domestic flight from Kathmandu to Nepalgunj, followed by a mountain flight to Talcha Airport in Mugu. From Talcha, it is an easy 2 to 3-hour hike through alpine woods to reach the lake shore.",
      },
      {
        question: "What accommodation is available at Rara Lake?",
        answer: "Accommodation is in rustic lakeside lodges and designated tented camps within Rara National Park. Facilities are clean, authentic, and cozy with warm local hospitality and traditional Karnali cuisine.",
      },
      {
        question: "What is the best season to trek to Rara Lake?",
        answer: "April to June (Spring) brings vibrant wildflowers and pleasant temperatures, while September to November (Autumn) offers crystal-clear blue waters and stunning mountain visibility. Winter can bring heavy snowfall, creating a wonderland landscape.",
      },
    ],
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
    faqs: [
      {
        question: "How does Bardiya National Park compare to Chitwan National Park?",
        answer: "Bardiya is much more remote, wild, and less commercialized than Chitwan. Because of fewer tourist crowds and extensive sal forest and riverine habitats, your chances of spotting a wild Royal Bengal Tiger in Bardiya are significantly higher.",
      },
      {
        question: "What wildlife can I expect to see in Bardiya?",
        answer: "Bardiya is famous for Royal Bengal Tigers, wild Asian elephants, one-horned rhinoceros, Gangetic freshwater dolphins in the Geruwa River, swamp deer, marsh muggers, and over 400 species of birds.",
      },
      {
        question: "What safari activities are included in the package?",
        answer: "The package includes a full-day 4WD open-top jeep safari deep into core park zones, an guided walking jungle safari with certified naturalists, a rafting safari on the Karnali/Geruwa river, and an evening Tharu cultural village visit.",
      },
      {
        question: "Is a jungle walking safari safe?",
        answer: "Yes, walking safaris are always led by two veteran, government-certified nature guides who are intimately familiar with animal behavior, tracking techniques, and emergency safety protocols.",
      },
    ],
    testimonies: [],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "John Doe",
    country: "United Kingdom",
    message:
      "Trip Himalaya made our EBC trek absolutely unforgettable. The organization, local sherpa guides, and teahouse arrangements were top-notch!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "t2",
    name: "Anita Sharma",
    country: "Nepal",
    message:
      "Best service for domestic air tickets and Pokhara luxury holiday. Highly recommended for their prompt WhatsApp responses.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "t3",
    name: "David Smith",
    country: "USA",
    message:
      "Amazing hospitality and expert guidance. They handled our tourist visa, vehicle rental, and 5-star hotel bookings seamlessly.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "t4",
    name: "Sarah Jenkins",
    country: "Australia (Sydney)",
    message:
      "The Everest helicopter tour was the absolute highlight of our honeymoon. The pilot was warm and confident, and the breakfast view at Kala Patthar was majestic.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "t5",
    name: "Carlos Mendez",
    country: "Spain (Madrid)",
    message:
      "Very reliable vehicle rental with a courteous driver. Navigated the winding roads from Kathmandu to Chitwan safely and comfortably.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "t6",
    name: "Mei Ling",
    country: "Singapore",
    message:
      "Seamless adventure activities booking in Pokhara! Paragliding video delivery was immediate, and their team was so attentive to safety.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
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
    videoUrl: "https://www.youtube.com/embed/3dHEAJPpFEs?rel=0&modestbranding=1",
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
    videoUrl: "https://www.youtube.com/embed/NvUZkQ3PiN8?rel=0&modestbranding=1",
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
    videoUrl: "https://www.youtube.com/embed/VibFaLKr9nY?rel=0&modestbranding=1",
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
    videoUrl: "https://www.youtube.com/embed/LCsVrpFrFKU?rel=0&modestbranding=1",
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

export const hotels: Hotel[] = [
  {
    id: "h1",
    name: "The Dwarika's Heritage Palace",
    slug: "dwarikas-heritage-kathmandu",
    category: "luxury",
    tierLabel: "5-Star Heritage Luxury",
    city: "Kathmandu",
    location: "Battisputali, Kathmandu",
    rating: 5.0,
    reviewsCount: 342,
    priceUSD: 240,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
    amenities: ["Free High-Speed Wi-Fi", "Historic Courtyard", "Luxury Spa", "Organic Dining", "Airport Limousine"],
    features: ["Authentic 15th-century Newari woodwork", "Complimentary heritage tour", "Handcrafted terracotta suites"],
    description: "A living museum of Nepali architecture offering world-class luxury and timeless cultural heritage.",
    isFeatured: true,
  },
  {
    id: "h2",
    name: "Temple Tree Resort & Spa",
    slug: "temple-tree-resort-pokhara",
    category: "boutique",
    tierLabel: "Boutique Lakeside",
    city: "Pokhara",
    location: "Gaurighat, Lakeside, Pokhara",
    rating: 4.9,
    reviewsCount: 289,
    priceUSD: 110,
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    amenities: ["Infinity Pool", "Phewa Lake View", "Ayurvedic Spa", "Garden Bar", "Free Breakfast"],
    features: ["5 minutes walk to Phewa Lake", "Mountain view private balconies", "Fresh local Himalayan teas"],
    description: "Tranquil boutique accommodation combining Western comforts with charming Himalayan lodge architecture.",
    isFeatured: true,
  },
  {
    id: "h3",
    name: "Barahi Jungle Lodge",
    slug: "barahi-jungle-lodge-chitwan",
    category: "resort",
    tierLabel: "Eco Wildlife Safari Resort",
    city: "Chitwan",
    location: "Meghauli, Chitwan National Park",
    rating: 4.9,
    reviewsCount: 195,
    priceUSD: 175,
    image:
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=1200",
    amenities: ["Riverfront Deck", "All Meals Included", "Infinity Pool", "Naturalist Guides", "Safari Transfers"],
    features: ["Direct Rapti river sunset views", "Private cottage balconies", "Tharu cultural musical evenings"],
    description: "Luxury eco-haven situated right on the banks of Rapti river overlooking pristine Chitwan wilderness.",
    isFeatured: true,
  },
  {
    id: "h4",
    name: "Club Himalaya Sunrise Resort",
    slug: "club-himalaya-nagarkot",
    category: "resort",
    tierLabel: "Scenic Mountain Resort",
    city: "Nagarkot",
    location: "Windy Hills, Nagarkot",
    rating: 4.8,
    reviewsCount: 210,
    priceUSD: 95,
    image:
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=1200",
    amenities: ["360° Himalayan View", "Indoor Heated Pool", "Observatory Deck", "Buffet Breakfast", "Free Parking"],
    features: ["Uninterrupted Everest sunrise panorama", "Helipad access on-site", "Cozy fireplace lounge"],
    description: "Perched atop Nagarkot ridge offering 360-degree vistas stretching from Annapurna to Mt. Everest.",
    isFeatured: true,
  },
  {
    id: "h5",
    name: "Aloft Kathmandu Thamel",
    slug: "aloft-hotel-thamel",
    category: "luxury",
    tierLabel: "Urban 5-Star Hotel",
    city: "Kathmandu",
    location: "Chhaya Center, Thamel, Kathmandu",
    rating: 4.9,
    reviewsCount: 420,
    priceUSD: 135,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200",
    amenities: ["Rooftop Infinity Pool", "W XYZ Bar", "24/7 Fitness Hub", "Buffet Breakfast", "Soundproof Rooms"],
    features: ["Located in the heart of Thamel shopping", "Vibrant rooftop lounge & nightlife", "State-of-the-art tech rooms"],
    description: "Modern Marriott lifestyle hotel right inside Thamel's premier shopping and entertainment center.",
    isFeatured: true,
  },
  {
    id: "h6",
    name: "Lumbini Heritage Garden Villa",
    slug: "lumbini-heritage-villa",
    category: "boutique",
    tierLabel: "Spiritual Boutique Stay",
    city: "Lumbini",
    location: "Buddha Nagar, Lumbini Sacred Garden",
    rating: 4.7,
    reviewsCount: 138,
    priceUSD: 70,
    image:
      "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&q=80&w=1200",
    amenities: ["Meditation Gardens", "Vegetarian Cuisine", "Bicycle Rental", "Free Wi-Fi", "Monastery Transfers"],
    features: ["Adjacent to Maya Devi Temple gates", "Peaceful lotus pond surroundings", "Eco-friendly solar powered"],
    description: "A peaceful sanctuary nestled near the birthplace of Lord Buddha, ideal for spiritual pilgrims.",
    isFeatured: false,
  },
  {
    id: "h7",
    name: "Yeti Mountain Home Kongde",
    slug: "yeti-mountain-home-kongde",
    category: "luxury",
    tierLabel: "High-Altitude Luxury Lodge",
    city: "Everest Region",
    location: "Kongde (4,250m), Solukhumbu",
    rating: 5.0,
    reviewsCount: 95,
    priceUSD: 310,
    image:
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=1200",
    amenities: ["Heated Electric Bedding", "Helipad Access", "Sherpa Hospitality", "Oxygen Concentrators", "Gourmet Meals"],
    features: ["Direct eye-level panoramic view of Mt. Everest & Ama Dablam", "Highest luxury lodge on earth", "Fine dining at 4,250m"],
    description: "The most spectacular high-altitude wilderness lodge in the Himalayas with direct views of Everest.",
    isFeatured: true,
  },
  {
    id: "h8",
    name: "Himalayan Front Hotel Sarangkot",
    slug: "himalayan-front-hotel",
    category: "resort",
    tierLabel: "Mountain View Boutique Resort",
    city: "Pokhara",
    location: "Sarangkot Mountain Viewpoint, Pokhara",
    rating: 4.8,
    reviewsCount: 176,
    priceUSD: 105,
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    amenities: ["Sunrise View Deck", "Rooftop Restaurant", "Paragliding Landing Nearby", "Free Breakfast", "Mini Bar"],
    features: ["Wake up to Machhapuchhre fishtail peak outside your window", "Private terrace with telescope", "Quiet hilltop setting"],
    description: "Unparalleled Annapurna and Fishtail sunrise panoramas right from your bed.",
    isFeatured: false,
  },
  {
    id: "h9",
    name: "Tiger Tops Tharu Lodge",
    slug: "tiger-tops-tharu-lodge",
    category: "resort",
    tierLabel: "Pioneer Jungle Safari Eco-Lodge",
    city: "Chitwan",
    location: "Nawalparasi, Chitwan Buffer Zone",
    rating: 4.9,
    reviewsCount: 145,
    priceUSD: 190,
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1200",
    amenities: ["Elephant Camp Walks", "Organic Farm Dining", "Solar Powered Cottages", "Naturalist Guides", "River Safari"],
    features: ["Pioneering ethical wildlife tourism", "Open-air dining overlooking buffer forest", "Handcrafted clay tharu huts"],
    description: "Authentic eco-safari retreat offering humane elephant encounters and immersive jungle wilderness walks.",
    isFeatured: true,
  },
  {
    id: "h10",
    name: "Baber Mahal Vilas Heritage Hotel",
    slug: "baber-mahal-vilas-kathmandu",
    category: "luxury",
    tierLabel: "Rana Palace Luxury Heritage",
    city: "Kathmandu",
    location: "Baber Mahal, Kathmandu",
    rating: 4.9,
    reviewsCount: 260,
    priceUSD: 180,
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200",
    amenities: ["Rooftop Swimming Pool", "Historic Courtyards", "Artisan Boutiques", "Fine Dining Restaurants", "Luxury Spa"],
    features: ["Neoclassical Rana architectural preservation", "Handcrafted vintage chandeliers & portraits", "Prime city access"],
    description: "Immerse yourself in 19th-century royal Rana grandeur inside an authentic palace courtyard sanctuary.",
    isFeatured: true,
  },
  {
    id: "h11",
    name: "Fish Tail Lodge Pokhara",
    slug: "fish-tail-lodge-pokhara",
    category: "boutique",
    tierLabel: "Iconic Lake Island Boutique",
    city: "Pokhara",
    location: "Phewa Lake Peninsula, Pokhara",
    rating: 4.8,
    reviewsCount: 310,
    priceUSD: 140,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
    amenities: ["Private Ferry Crossing", "Lakeside Bar & Garden", "Panoramic Annapurna Terrace", "Cozy Fireplace", "Free Wi-Fi"],
    features: ["Accessed solely via dedicated wooden rope shuttle raft", "Hosted royalty including Prince Charles", "Charity-driven lodge"],
    description: "Famous heritage island-style retreat afloat on Phewa Lake with postcard reflections of Mt. Machhapuchhre.",
    isFeatured: false,
  },
  {
    id: "h12",
    name: "Kasara Resort Chitwan",
    slug: "kasara-resort-chitwan",
    category: "resort",
    tierLabel: "Contemporary Luxury Jungle Resort",
    city: "Chitwan",
    location: "Patihani, Chitwan National Park",
    rating: 4.9,
    reviewsCount: 188,
    priceUSD: 210,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200",
    amenities: ["Private Plunge Pools", "Himalayan Herbal Spa", "Jeep Safari Fleet", "All-Inclusive Dining", "Infinity Pool"],
    features: ["Minimalist Zen villas surrounded by Sal forest", "Private sundecks with outdoor garden showers", "Guided birdwatching"],
    description: "Chic contemporary villas harmonized within Chitwan jungle canopy with bespoke VIP safari excursions.",
    isFeatured: true,
  },
  {
    id: "h13",
    name: "The Pavilions Himalayas The Farm",
    slug: "the-pavilions-himalayas",
    category: "boutique",
    tierLabel: "100% Eco-Organic Boutique Luxury",
    city: "Pokhara",
    location: "Chisapani, Pokhara Valley",
    rating: 5.0,
    reviewsCount: 162,
    priceUSD: 195,
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200",
    amenities: ["Solar-Powered Luxury Villas", "Organic Farm-to-Table", "Clubhouse & Jacuzzi", "Mountain View Terraces", "Wellness Spa"],
    features: ["Completely off-grid luxury villa resort", "Farm tours and mountain trail walks", "Pure organic artisan dairy and produce"],
    description: "Nestled in a peaceful valley below the Annapurnas, providing private villas powered by renewable green energy.",
    isFeatured: false,
  },
  {
    id: "h14",
    name: "Hyatt Regency Kathmandu",
    slug: "hyatt-regency-kathmandu",
    category: "luxury",
    tierLabel: "5-Star Global Luxury Resort",
    city: "Kathmandu",
    location: "Taragaon, Boudhanath, Kathmandu",
    rating: 4.8,
    reviewsCount: 450,
    priceUSD: 165,
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=1200",
    amenities: ["37 Acres Landscaped Gardens", "Outdoor Lagoon Pool", "Club Oasis Spa", "Tennis Courts", "24hr Fitness Center"],
    features: ["Traditional Newari palace red-brick architecture", "Walking distance to sacred Boudhanath Stupa", "Helipad access on-site"],
    description: "Sprawling luxury resort hotel offering peace, vast gardens, and world-class international standards near Boudha.",
    isFeatured: true,
  },
  {
    id: "h15",
    name: "Mystic Mountain Resort Nagarkot",
    slug: "mystic-mountain-nagarkot",
    category: "resort",
    tierLabel: "Panoramic Ridge View Resort",
    city: "Nagarkot",
    location: "Mahankal, Nagarkot Hill",
    rating: 4.8,
    reviewsCount: 224,
    priceUSD: 125,
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1200",
    amenities: ["Heated Infinity Pool", "Sky Garden Bar", "Sunset & Sunrise View Terraces", "Banquet Facilities", "Free Wi-Fi"],
    features: ["Every single room faces the snow-capped Himalayan peaks", "Forest edge hiking trails", "Stargazing telescopes"],
    description: "Contemporary cliffside architecture perched amidst Nagarkot pine forests with uninterrupted Himalayan sunrises.",
    isFeatured: false,
  },
];

export const vehicles: Vehicle[] = [
  {
    id: "v1",
    name: "Mahindra Scorpio 4x4 Off-Roader",
    slug: "scorpio-4x4-suv",
    category: "suv",
    categoryLabel: "4WD Mountain SUV",
    seats: "6 - 7 Passengers",
    luggage: "4 Large Bags",
    pricePerDayUSD: 75,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200",
    bestFor: "Muktinath, Mustang, Manang & Rugged Highways",
    transmission: "Manual 4WD with Low Range",
    fuelType: "Diesel",
    amenities: ["High Ground Clearance", "4x4 Low Range Gear", "Dual Climate AC", "Roof Luggage Carrier"],
    features: ["Heavy-duty off-road suspension", "Expert mountain-licensed chauffeur", "All fuel & toll taxes included"],
    description: "Nepal's most reliable 4WD workhorse capable of tackling river crossings, gravel trails, and high passes.",
    isFeatured: true,
  },
  {
    id: "v2",
    name: "Toyota Land Cruiser Prado VIP",
    slug: "toyota-prado-luxury-suv",
    category: "suv",
    categoryLabel: "Luxury VIP SUV",
    seats: "5 - 6 Passengers",
    luggage: "5 Large Bags",
    pricePerDayUSD: 160,
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200",
    bestFor: "VIP Delegations, Luxury Tours & Weddings",
    transmission: "Automatic 4x4",
    fuelType: "Diesel",
    amenities: ["Leather Reclining Seats", "Sunroof & Tinted Glass", "Premium Sound System", "Chilled Mini Fridge"],
    features: ["Ultra-smooth ride on all terrains", "English-speaking VIP chauffeur", "Complimentary mineral water & tissues"],
    description: "Premium flagship SUV providing supreme quietness, prestige, and executive luxury across Nepal.",
    isFeatured: true,
  },
  {
    id: "v3",
    name: "Toyota HiAce Grand Cabin Van",
    slug: "toyota-hiace-van",
    category: "van",
    categoryLabel: "14-Seater Luxury Van",
    seats: "12 - 14 Passengers",
    luggage: "10 Large Bags",
    pricePerDayUSD: 95,
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200",
    bestFor: "Kathmandu-Pokhara Highway & Family Groups",
    transmission: "Manual High-Roof",
    fuelType: "Diesel",
    amenities: ["High-Roof Spacious Cabin", "Individual AC Vents", "USB Charging Ports", "Spacious Boot Space"],
    features: ["Smooth coil-spring highway suspension", "Wide viewing windows for photography", "Professional tourist driver"],
    description: "Spacious and comfortable tourist passenger van ideal for family holidays and group expeditions.",
    isFeatured: true,
  },
  {
    id: "v4",
    name: "Hyundai Creta / Suzuki Sedan",
    slug: "comfort-city-sedan",
    category: "sedan",
    categoryLabel: "Comfort City Sedan",
    seats: "3 - 4 Passengers",
    luggage: "2 Medium Bags",
    pricePerDayUSD: 45,
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200",
    bestFor: "Airport Pickups & City Sightseeing",
    transmission: "Automatic / Manual",
    fuelType: "Petrol",
    amenities: ["Chilled Air Conditioning", "Bluetooth Music", "Clean Sanitized Cabin", "Child Seat (On Request)"],
    features: ["Quick navigation through city traffic", "Door-to-door hotel transfers", "Fuel, parking & driver included"],
    description: "Economical and smooth city car for airport transfers and UNESCO heritage tours in Kathmandu.",
    isFeatured: true,
  },
  {
    id: "v5",
    name: "Toyota Coaster Luxury Tourist Mini-Bus",
    slug: "toyota-coaster-bus",
    category: "bus",
    categoryLabel: "22-Seater Tourist Coaster",
    seats: "20 - 22 Passengers",
    luggage: "20+ Suitcases",
    pricePerDayUSD: 145,
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=1200",
    bestFor: "Corporate Tours, Student Groups & Big Families",
    transmission: "Manual Coach",
    fuelType: "Diesel",
    amenities: ["High-Back Reclining Seats", "PA Microphone System", "Full Central AC", "Huge Luggage Compartment"],
    features: ["Ideal for large tourist groups across Nepal", "Smooth mountain turning radius", "Dedicated driver + helper"],
    description: "Deluxe tourist coaster with wide panoramic windows, reclining seats, and full climate control.",
    isFeatured: true,
  },
  {
    id: "v6",
    name: "Toyota Hilux 4x4 Double Cab",
    slug: "toyota-hilux-pickup",
    category: "suv",
    categoryLabel: "Expedition Pickup 4WD",
    seats: "4 - 5 Passengers",
    luggage: "Expedition Gear / Boxes",
    pricePerDayUSD: 110,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200",
    bestFor: "Filming Crews, Heavy Trekking Gear & Off-Road",
    transmission: "Heavy 4WD",
    fuelType: "Diesel",
    amenities: ["Heavy Payload Cargo Bed", "Heavy Winch & Snorkel", "All-Terrain 4x4", "High Clearance"],
    features: ["Rugged expedition capability across river crossings", "Sturdy reinforced chassis", "Certified off-road pilot"],
    description: "Unstoppable heavy-duty pickup with high load bed capacity for trekking support and documentary film crews.",
    isFeatured: false,
  },
  {
    id: "v7",
    name: "Toyota Fortuner 4x4 Luxury SUV",
    slug: "toyota-fortuner-luxury-suv",
    category: "suv",
    categoryLabel: "Premium 4WD Mountain SUV",
    seats: "6 - 7 Passengers",
    luggage: "4 Large Suitcases",
    pricePerDayUSD: 130,
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200",
    bestFor: "Executive Travel, Mustang, & Long-Distance Highways",
    transmission: "Automatic 4WD",
    fuelType: "Diesel",
    amenities: ["Leather Interior", "Dual Climate AC", "Hill Descent Control", "USB Fast Charging"],
    features: ["Supreme highway overtaking power", "Chauffeur trained in high-altitude safety", "Child seats available on request"],
    description: "Imposing modern 4WD SUV blending muscular cross-country endurance with refined cabin elegance.",
    isFeatured: true,
  },
  {
    id: "v8",
    name: "Toyota Innova Crysta Deluxe MPV",
    slug: "toyota-innova-crysta",
    category: "van",
    categoryLabel: "Deluxe 7-Seater Touring MPV",
    seats: "6 - 7 Passengers",
    luggage: "5 Medium Suitcases",
    pricePerDayUSD: 85,
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200",
    bestFor: "Family Tours to Pokhara, Chitwan & Lumbini",
    transmission: "Manual / Automatic",
    fuelType: "Diesel",
    amenities: ["Captain Reclining Armchairs", "Roof Air Vents", "Smooth Highway Suspension", "Ample Legroom"],
    features: ["Renowned reliability on winding Nepal hills", "Spacious interior for elderly travelers", "Experienced tourist driver"],
    description: "The gold standard for family highway touring in Nepal, offering unbeatable seat comfort and smooth suspension.",
    isFeatured: true,
  },
  {
    id: "v9",
    name: "Nissan Patrol Heavy Off-Road 4WD",
    slug: "nissan-patrol-offroad",
    category: "suv",
    categoryLabel: "Heavy Expedition 4WD",
    seats: "6 - 7 Passengers",
    luggage: "6 Large Bags",
    pricePerDayUSD: 150,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200",
    bestFor: "Upper Mustang, Dolpo, & Remote Wilderness Routes",
    transmission: "Manual 4WD with Diff Lock",
    fuelType: "Diesel",
    amenities: ["Snorkel Intake", "Twin Off-Road Winches", "Reinforced Suspension", "Satellite Navigation"],
    features: ["Tackles high-altitude riverbeds and rough boulder passes", "Auxiliary fuel tank for deep remote expeditions", "Mountain specialist driver"],
    description: "Legendary brute off-roader designed specifically for the extreme terrain of Upper Mustang and Western Nepal.",
    isFeatured: false,
  },
  {
    id: "v10",
    name: "Honda City Executive Sedan",
    slug: "honda-city-executive-sedan",
    category: "sedan",
    categoryLabel: "Executive Business Sedan",
    seats: "3 - 4 Passengers",
    luggage: "3 Medium Suitcases",
    pricePerDayUSD: 50,
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200",
    bestFor: "Corporate Delegates, Embassy Transfers & Valley Sightseeing",
    transmission: "Automatic",
    fuelType: "Petrol",
    amenities: ["Plush Leather Seats", "Premium Audio", "Tinted Privacy Glass", "High-Efficiency AC"],
    features: ["Immaculately clean and sanitized daily", "Uniformed chauffeur", "Complimentary refreshments and city guides"],
    description: "Sleek and polished business sedan ideal for diplomatic visits, hotel transfers, and corporate executives.",
    isFeatured: false,
  },
  {
    id: "v11",
    name: "Force Traveller 17-Seater Mini-Bus",
    slug: "force-traveller-minibus",
    category: "bus",
    categoryLabel: "17-Seater Deluxe Mini-Coach",
    seats: "15 - 17 Passengers",
    luggage: "15 Suitcases + Overhead Racks",
    pricePerDayUSD: 105,
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=1200",
    bestFor: "Mid-Size Trekking Groups & Pilgrim Tours",
    transmission: "Manual High-Torque",
    fuelType: "Diesel",
    amenities: ["Push-Back High Comfort Seats", "Individual AC Louvers", "Music Sound System", "Spacious Aisle"],
    features: ["Superior maneuverability on hill curves", "Luggage roof carrier with waterproof tarp", "Dedicated licensed driver"],
    description: "Versatile medium coach tailored for groups traveling across Kathmandu, Pokhara, Muktinath, and Chitwan.",
    isFeatured: true,
  },
  {
    id: "v12",
    name: "Kia Carnival VIP Luxury Limousine Van",
    slug: "kia-carnival-vip-van",
    category: "van",
    categoryLabel: "Ultra-Luxury VIP MPV",
    seats: "6 - 7 Passengers",
    luggage: "6 Large Bags",
    pricePerDayUSD: 135,
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200",
    bestFor: "VIP Diplomats, Celebrity Tours & Luxury Weddings",
    transmission: "Automatic",
    fuelType: "Diesel",
    amenities: ["Ottoman Lounge Recliners", "Dual Sunroofs", "Smart Infotainment Screen", "Ambient Mood Lighting"],
    features: ["First-class aircraft comfort on wheels", "Whisper-quiet cabin isolation", "English-speaking VIP escort"],
    description: "Nepal's most luxurious private MPV, offering lie-flat ottoman recliners and first-class road travel.",
    isFeatured: true,
  },
  {
    id: "v13",
    name: "Sutlej 35-Seater Super Deluxe Tourist Coach",
    slug: "sutlej-deluxe-tourist-bus",
    category: "bus",
    categoryLabel: "35-Seater Large Tourist Coach",
    seats: "32 - 35 Passengers",
    luggage: "35+ Large Suitcases",
    pricePerDayUSD: 195,
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=1200",
    bestFor: "Large International Conferences, Inbound Tour Groups",
    transmission: "Manual Air-Brake Coach",
    fuelType: "Diesel",
    amenities: ["Air Suspension", "Microphone PA & LCD Displays", "Full Climate Control", "Underbody Luggage Bays"],
    features: ["Smooth air-cushioned ride for long journeys", "Certified long-haul tourist captain and co-driver", "First-aid medical kit"],
    description: "Spacious full-size tourist bus with panoramic sightseeing windows and deluxe reclining seating for large tour groups.",
    isFeatured: false,
  },
  {
    id: "v14",
    name: "Suzuki Ertiga Family Smart Hybrid",
    slug: "suzuki-ertiga-hybrid",
    category: "sedan",
    categoryLabel: "Compact 5-7 Seater MPV",
    seats: "5 - 6 Passengers",
    luggage: "3 Medium Bags",
    pricePerDayUSD: 55,
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200",
    bestFor: "Affordable Valley Sightseeing & Day Excursions",
    transmission: "Manual / Hybrid",
    fuelType: "Petrol Hybrid",
    amenities: ["Chilled AC", "Foldable 3rd Row Seats", "Eco-Friendly Low Emissions", "USB Ports"],
    features: ["Great fuel economy and compact city footprint", "Ideal for small families on budget", "Friendly local driver"],
    description: "Budget-friendly, modern multi-purpose vehicle perfect for day tours around Kathmandu and Pokhara valleys.",
    isFeatured: false,
  },
  {
    id: "v15",
    name: "Ford Everest 4WD Titanium",
    slug: "ford-everest-titanium-4wd",
    category: "suv",
    categoryLabel: "Premium Off-Road SUV",
    seats: "6 - 7 Passengers",
    luggage: "5 Large Bags",
    pricePerDayUSD: 125,
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200",
    bestFor: "Langtang Road, Pokhara Highway & National Parks",
    transmission: "10-Speed Automatic 4WD",
    fuelType: "Diesel",
    amenities: ["Terrain Management System", "Panoramic Sunroof", "Active Noise Cancellation", "Power Tailgate"],
    features: ["Exceptional water-wading and traction control", "Supple coil-spring suspension over potholes", "Top safety rating"],
    description: "Heavy-duty luxury 4WD engineered to cruise with effortless authority over bumpy mountain passes.",
    isFeatured: false,
  },
];

// ── HELI TOURS ──────────────────────────────────────────────────────────────
export const heliTours: HeliTour[] = [
  {
    id: "h1",
    name: "Everest Base Camp Heli Tour",
    slug: "everest-base-camp-heli",
    category: "everest",
    categoryLabel: "Everest Region",
    duration: "4-5 Hours",
    maxAltitude: "5,364 m (EBC)",
    landingSpot: "Everest Base Camp & Kala Patthar",
    sharedPriceUSD: 1050,
    charterPriceUSD: 4200,
    departureFrom: "Kathmandu / Lukla",
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    ],
    highlights: [
      "Aerial views of Mt. Everest (8,849 m)",
      "Land at Everest Base Camp at 5,364 m",
      "Panoramic sunrise from Kala Patthar",
      "Glacier and icefall close-up views",
      "Champagne breakfast at high altitude",
    ],
    inclusions: [
      "Return helicopter flight from Kathmandu",
      "Government royalty fees & landing permits",
      "Experienced licensed mountain pilot",
      "Insurance coverage during flight",
      "High-altitude breakfast at base camp",
    ],
    description:
      "The ultimate Himalayan helicopter experience — soar above the world's most famous trekking route and touch down at the legendary Everest Base Camp in a fraction of the time.",
    isFeatured: true,
  },
  {
    id: "h2",
    name: "Annapurna Base Camp Heli Tour",
    slug: "annapurna-base-camp-heli",
    category: "annapurna",
    categoryLabel: "Annapurna Region",
    duration: "5-6 Hours",
    maxAltitude: "4,130 m (ABC)",
    landingSpot: "Annapurna Base Camp",
    sharedPriceUSD: 820,
    charterPriceUSD: 3600,
    departureFrom: "Pokhara",
    image:
      "https://images.unsplash.com/photo-1562016600-ece13e8ba570?auto=format&fit=crop&q=80&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1615789591457-74a63395c990?auto=format&fit=crop&q=80&w=800",
    ],
    highlights: [
      "Stunning views of Annapurna Massif (8,091 m)",
      "Machhapuchhre Fish Tail Peak close views",
      "Land at Annapurna Sanctuary at 4,130 m",
      "Fly over Pokhara's Phewa Lake",
      "360° amphitheatre of 13 Himalayan peaks",
    ],
    inclusions: [
      "Return helicopter from Pokhara",
      "CAAN-certified pilot and crew",
      "Landing fees and government permits",
      "Flight insurance",
      "Tea/coffee at base camp",
    ],
    description:
      "Experience the dramatic Annapurna Sanctuary in a matter of hours. This scenic helicopter tour flies through deep valleys, over lush rhododendron forests, and lands inside the grand mountain amphitheatre at 4,130 m.",
    isFeatured: true,
  },
  {
    id: "h3",
    name: "Langtang Valley Heli Tour",
    slug: "langtang-valley-heli",
    category: "langtang",
    categoryLabel: "Langtang Region",
    duration: "3-4 Hours",
    maxAltitude: "3,870 m (Kyanjin Gompa)",
    landingSpot: "Kyanjin Gompa",
    sharedPriceUSD: 650,
    charterPriceUSD: 2800,
    departureFrom: "Kathmandu",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=800",
    ],
    highlights: [
      "Fly over Langtang National Park",
      "Views of Ganesh Himal and Dorje Lakpa",
      "Land at Kyanjin Gompa (3,870 m)",
      "Visit Kyanjin Ri viewpoint",
      "Yak cheese factory visit",
    ],
    inclusions: [
      "Return helicopter from Kathmandu",
      "Professional mountain pilot",
      "Government permits & fees",
      "Basic refreshments at landing",
      "Travel insurance",
    ],
    description:
      "A scenic escape to Langtang Valley — Nepal's closest high-altitude Himalayan retreat from Kathmandu. Fly over ancient Buddhist monasteries, yak pastures, and glacial rivers on this unforgettable heli tour.",
    isFeatured: false,
  },
  {
    id: "h4",
    name: "Muktinath Pilgrimage Heli Tour",
    slug: "muktinath-pilgrimage-heli",
    category: "pilgrimage",
    categoryLabel: "Pilgrimage & Sacred Sites",
    duration: "6-7 Hours",
    maxAltitude: "3,800 m (Muktinath)",
    landingSpot: "Muktinath Temple",
    sharedPriceUSD: 750,
    charterPriceUSD: 3200,
    departureFrom: "Pokhara",
    image:
      "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&q=80&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&q=80&w=800",
    ],
    highlights: [
      "Land directly at Muktinath Temple",
      "Sacred for both Hindus & Buddhists",
      "Views over Mustang's arid plateau",
      "Fly over Kagbeni & Jomsom villages",
      "108 Holy Water Spouts darshan",
    ],
    inclusions: [
      "Return heli flight from Pokhara",
      "Temple puja assistance by guide",
      "Government landing permits",
      "Flight insurance",
      "Lunch at Jomsom",
    ],
    description:
      "Reach the legendary Muktinath Temple — sacred to both Hindu and Buddhist traditions — via helicopter in a fraction of the time it takes by road or trek. This spiritual journey includes a complete temple darshan and stunning views of Mustang's desert plateau.",
    isFeatured: true,
  },
  {
    id: "h5",
    name: "Everest Heli & Sunrise Tour",
    slug: "everest-sunrise-heli",
    category: "everest",
    categoryLabel: "Everest Region",
    duration: "3-4 Hours (Early Morning)",
    maxAltitude: "5,600 m (Kala Patthar)",
    landingSpot: "Kala Patthar View Point",
    sharedPriceUSD: 1150,
    charterPriceUSD: 4800,
    departureFrom: "Kathmandu",
    image:
      "https://images.unsplash.com/photo-1535483882679-b7e65428f7ff?auto=format&fit=crop&q=80&w=1200",
    gallery: [],
    highlights: [
      "Witness golden sunrise from Kala Patthar",
      "Mt. Everest and Lhotse lit by first light",
      "Champagne toast at 5,550 m",
      "Aerial views of Khumbu Icefall",
      "Sherpa village flyover",
    ],
    inclusions: [
      "Pre-dawn departure from Kathmandu",
      "Champagne breakfast at Kala Patthar",
      "All permits and royalties included",
      "Safety gear and warm suits",
      "Expert mountain pilot",
    ],
    description:
      "An exclusive dawn departure experience. Watch the world's highest peak turn golden in the early morning light from the famous Kala Patthar viewpoint at 5,550 m — the most dramatic Everest heli experience available.",
    isFeatured: false,
  },
  {
    id: "h6",
    name: "Upper Mustang Heli Expedition",
    slug: "upper-mustang-heli",
    category: "pilgrimage",
    categoryLabel: "Pilgrimage & Sacred Sites",
    duration: "Full Day",
    maxAltitude: "3,840 m (Lo Manthang)",
    landingSpot: "Lo Manthang Walled City",
    sharedPriceUSD: 980,
    charterPriceUSD: 4500,
    departureFrom: "Pokhara",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=800",
    ],
    highlights: [
      "Land in the forbidden city of Lo Manthang",
      "Ancient Tibetan-style monasteries",
      "Sky caves of Mustang",
      "Overland return option available",
      "Restricted area permit included",
    ],
    inclusions: [
      "Return helicopter or one-way option",
      "Upper Mustang restricted area permit",
      "ACAP conservation permit",
      "Monastery entry guide",
      "Lunch in Lo Manthang",
    ],
    description:
      "Fly to the ancient forbidden kingdom of Upper Mustang — one of Nepal's most remote and culturally preserved regions. Land in the walled city of Lo Manthang and explore centuries-old monasteries, sky caves, and Tibetan traditions.",
    isFeatured: false,
  },
  {
    id: "h7",
    name: "Helicopter Rescue & Emergency Charter",
    slug: "heli-rescue-charter",
    category: "rescue",
    categoryLabel: "Rescue & Emergency",
    duration: "On Demand",
    maxAltitude: "Varies",
    landingSpot: "Any Accessible Location",
    sharedPriceUSD: 0,
    charterPriceUSD: 3000,
    departureFrom: "Kathmandu / Pokhara",
    image:
      "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&q=80&w=1200",
    gallery: [],
    highlights: [
      "24/7 emergency dispatch readiness",
      "HEMS-certified pilots on standby",
      "Oxygen onboard for AMS / HACE",
      "Coordination with CIWEC Hospital",
      "Insurance claim assistance",
    ],
    inclusions: [
      "Emergency response coordination",
      "Medical oxygen supply",
      "CAAN-approved rescue aircraft",
      "Hospital link and evacuation support",
      "Insurance paperwork assistance",
    ],
    description:
      "Trip Himalaya coordinates rapid helicopter rescue and medical evacuation services across all Himalayan regions. Our 24/7 dispatch network ensures immediate response for altitude sickness, injury, or emergency situations anywhere in Nepal.",
    isFeatured: false,
  },
];

// -- GALLERY DATA ------------------------------------------------------------
export const galleryData: GalleryPhoto[] = [
  { id: "g1", title: "Everest Base Camp Panorama", category: "treks", location: "Solukhumbu, Nepal", image: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=1600", caption: "Breathtaking panoramic view of the majestic Everest range during sunrise." },
  { id: "g2", title: "Phewa Lake Boating & Sunset", category: "tours", location: "Pokhara, Nepal", image: "https://images.unsplash.com/photo-1544735745-b81216c7ad8f?auto=format&fit=crop&q=80&w=1200", caption: "Tranquil evening reflection over the calm waters of Phewa Lake in Pokhara." },
  { id: "g3", title: "Tandem Paragliding High Skies", category: "adventures", location: "Sarangkot, Pokhara", image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=1200", caption: "Soaring through the clouds above the Annapurna mountain range." },
  { id: "g4", title: "Annapurna Sanctuary Expedition", category: "treks", location: "Annapurna Region, Nepal", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200", caption: "Hikers trekking through the rugged trails of the Annapurna massif." },
  { id: "g5", title: "Luxury Beachfront Getaway", category: "tours", location: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200", caption: "Exclusive luxury villa escape with turquoise ocean views." },
  { id: "g6", title: "Premium Tourist Coaches & Vans", category: "vehicles", location: "Kathmandu Valley", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200", caption: "Our modern, air-conditioned private fleet ready for airport transfers and tours." },
  { id: "g7", title: "White Water Rafting Adrenaline", category: "adventures", location: "Trishuli River, Nepal", image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200", caption: "Conquering thrilling class III rapids on the pristine Trishuli River." },
  { id: "g8", title: "Boudhanath Stupa Evening Chants", category: "cultural", location: "Kathmandu, Nepal", image: "https://images.unsplash.com/photo-1545231097-cbd796f1d95f?auto=format&fit=crop&q=80&w=1200", caption: "Spiritual ambiance around the ancient UNESCO World Heritage monument." },
  { id: "g9", title: "Himalayan Heli Sightseeing Tour", category: "vehicles", location: "Everest Region", image: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&q=80&w=1200", caption: "VIP helicopter flight touching down near Kalapathar overlooking Mt. Everest." },
  { id: "g10", title: "Dubai Desert Safari Sunset", category: "tours", location: "Dubai, UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200", caption: "Dune bashing and traditional Bedouin desert camp experience." },
  { id: "g11", title: "Langtang Rhododendron Trails", category: "treks", location: "Langtang Valley", image: "https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&q=80&w=1200", caption: "Blooming spring trails winding through traditional Tamang villages." },
  { id: "g12", title: "Pashupatinath Sacred Heritage", category: "cultural", location: "Kathmandu, Nepal", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=1200", caption: "Centuries-old architecture and cultural heritage preserved in time." },
];