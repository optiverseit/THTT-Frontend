export interface Service {
  id: string;
  name: string;
  slug: string;
  icon: string;
  heroImage: string;
  shortDesc: string;
  description: string;
  subServices: string[];
  gallery: string[];
}

export interface Testimony {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  location?: string;
}

export interface Package {
  id: string;
  title: string;
  slug: string;
  duration: string;
  highlights: string[];
  price?: string;
  image: string;
  category: "domestic" | "international";
  type: "tour" | "trek" | "activity" | "combo";
  isFeatured: boolean;
  difficulty?: "Easy" | "Moderate" | "Hard" | "Extreme";
  adventureCategory?: "Air" | "Water" | "Land";
  intensity?: string;
  // Extended fields for detail page
  description?: string;
  location?: string;
  rating?: number;
  reviewsCount?: number;
  gallery?: string[];
  itinerary?: { day: string; title: string; desc: string }[];
  includes?: string[];
  excludes?: string[];
  restrictions?: string[];
  whatToBring?: string[];
  faqs?: { question: string; answer: string }[];
  pricingTable?: {
    service: string;
    ageGroup: string;
    priceNepali: string;
    priceForeigner: string;
  }[];
  testimonies?: Testimony[];
}

export interface Testimonial {
  id: string;
  name: string;
  country: string;
  message: string;
  rating: number;
  avatar: string;
}

export interface GalleryItem {
  id: string;
  category: "tour" | "vehicle" | "activity" | "office";
  image: string;
  title: string;
}
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: string;
  author: string;
  date: string;
  image: string;
  readTime: string;
}
export interface TravelGuide {
  id: string;
  title: string;
  slug: string;
  content: string;
  icon: string;
}

export interface VideoPost {
  id: string;
  title: string;
  slug: string;
  videoUrl: string; // YouTube/Vimeo ID or URL
  thumbnail: string;
  category: string;
  duration: string;
  views: string;
  date: string;
  description: string;
  content?: string;
  author: string;
}
