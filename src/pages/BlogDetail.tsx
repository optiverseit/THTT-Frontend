import React from "react";
import {
  Share2,
  Bookmark,
  MessageSquare,
  Facebook,
  Twitter,
  ChevronLeft,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PreFooter from "../components/reuseable/PreFooter";

// --- Types ---
interface RelatedPost {
  id: number;
  category: string;
  title: string;
  image: string;
}

const BlogDetailMore: React.FC = () => {
  const navigate = useNavigate();

  const tags: string[] = ["#ADVENTURE", "#HIMALAYAS", "#NEPAL2025", "#TREKKING", "#TRAVELTIPS"];

  const relatedPosts: RelatedPost[] = [
    {
      id: 1,
      category: "INTERNATIONAL",
      title: "BALI BEYOND BEACHES: DISCOVERING THE CULTURAL HEA...",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 2,
      category: "TRAVEL TIPS",
      title: "HOW TO CHOOSE THE RIGHT TRAVEL INSURANCE FOR HIMALAYAN TOURS",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 3,
      category: "VISA ASSISTANCE",
      title: "NEPAL VISA ON ARRIVAL: A SIMPLIFIED 2025 GUIDE FOR...",
      image: "https://images.unsplash.com/photo-1544627836-822bfe450209?auto=format&fit=crop&q=80&w=200",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#4A5568]">
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=2000"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B69]/90 via-[#2D1B69]/20 to-transparent" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-between py-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 w-fit px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-widest text-[#2D1B69] hover:bg-white transition-all uppercase">
            <ChevronLeft size={14} /> Back to Journal
          </button>
          <div className="max-w-3xl mb-10 text-white">
            <span className="inline-block px-4 py-1 bg-[#E91E63] text-[10px] font-bold tracking-widest rounded-md mb-4 uppercase">Trekking</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Top 10 Essential Tips for Your First Everest Base Camp Trek</h1>
            <div className="flex gap-10 border-l border-white/30 pl-6">
              <div><p className="text-[9px] opacity-60 font-bold uppercase tracking-widest">Author</p><p className="font-bold text-sm">ADVENTURE DESK</p></div>
              <div><p className="text-[9px] opacity-60 font-bold uppercase tracking-widest">Published</p><p className="font-bold text-sm">SEPT 21, 2025</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- META BAR --- */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-b border-gray-100 flex justify-between items-center">
        <div className="flex gap-6 text-[10px] font-bold tracking-widest text-gray-400">
          <button className="flex items-center gap-2 hover:text-[#E91E63] transition-colors"><Bookmark size={14} /> SAVE FOR LATER</button>
          <button className="flex items-center gap-2 hover:text-[#E91E63] transition-colors"><MessageSquare size={14} /> COMMENTS</button>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
          <span>SHARE STORY:</span>
          <div className="flex gap-4">
            <Facebook size={14} className="cursor-pointer hover:text-[#2D1B69]" />
            <Twitter size={14} className="cursor-pointer hover:text-[#2D1B69]" />
            <Share2 size={14} className="cursor-pointer hover:text-[#2D1B69]" />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* --- MAIN CONTENT --- */}
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-bold text-[#2D1B69] mb-8 italic leading-snug">
              Planning your first trek to the roof of the world? Here is everything you need to know about packing, training, and altitude.
            </h2>
            
            <div className="text-[15px] leading-relaxed space-y-6 text-[#4A5568]">
              <p>The Everest Base Camp trek is more than just a hike; it's a pilgrimage for adventurers. Reaching the base of the world's tallest peak is a life-changing milestone. However, it requires meticulous preparation.</p>
              
              <p className="whitespace-pre-line">
                1. <strong>Train Early</strong> : Start cardiovascular training at least 3 months before your departure. Focus on leg strength and endurance. 2. <strong>Pack Light</strong> : You'll be carrying your gear for days. Prioritize moisture-wicking fabrics and high-quality boots. 3. <strong>Hydration is Key</strong> : Altitude dehydrates you faster. Drink at least 4 liters of water daily. 4. <strong>Respect the Altitude</strong> : Move slowly. Acclimatization days in Namche Bazaar and Dingboche are non-negotiable. 5. <strong>Carry Cash</strong> : ATMs are non-existent past Namche, and credit cards are rarely accepted. 6. <strong>Bring a Power Bank</strong> : Charging your devices gets expensive as you go higher. 7. <strong>Sun Protection</strong> : The sun at high altitudes is incredibly strong. Wear a hat and high-SPF sunscreen. 8. <strong>Local Culture</strong> : Learn a few Sherpa phrases. A little 'Tashi Delek' goes a long way. 9. <strong>Snack Smart</strong> : Bring energy bars and nuts to supplement the dal bhat. 10. <strong>Enjoy the Journey</strong> : Don't just focus on the destination. The views in the Khumbu valley are unparalleled.
              </p>
            </div>

            {/* Tags */}
            <div className="mt-12 flex flex-wrap gap-3">
              {tags.map((tag) => (
                <span key={tag} className="px-4 py-2 bg-[#F1F5F9] text-[9px] font-bold text-[#94A3B8] rounded-full flex items-center gap-2 cursor-pointer hover:bg-[#E91E63] hover:text-white transition-colors">
                  <span className="text-[#CBD5E1]">#</span> {tag.replace("#", "")}
                </span>
              ))}
            </div>
          </div>

          {/* --- SIDEBAR --- */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Author Card */}
            <div className="bg-[#2D1B69] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={80} /></div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-8 opacity-60">About the Author</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#E91E63] flex items-center justify-center text-xl font-bold shadow-lg">AD</div>
                <div>
                  <h5 className="font-bold text-lg leading-none mb-1 text-white">ADVENTURE DESK</h5>
                  <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold">Travel Specialist</p>
                </div>
              </div>
              <p className="text-xs opacity-80 leading-relaxed mb-8">
                A veteran of the Himalayan trails with over 15 years of field experience in South Asian tourism.
              </p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[9px] font-bold uppercase tracking-[0.15em] transition-all border border-white/10">
                View All Stories
              </button>
            </div>

            {/* Related Articles */}
            <div>
              <h4 className="flex items-center gap-2 text-[12px] font-black text-[#2D1B69] uppercase mb-8">
                <TrendingUp size={18} className="text-[#E91E63]" /> Related Articles
              </h4>
              <div className="space-y-8">
                {relatedPosts.map((post) => (
                  <div key={post.id} className="flex gap-4 group cursor-pointer items-center text-left">
                    <div className="w-20 h-20 rounded-[20px] overflow-hidden shrink-0 shadow-md">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#E91E63] uppercase tracking-tighter">{post.category}</span>
                      <h6 className="text-[11px] font-black text-[#2D1B69] group-hover:underline leading-snug line-clamp-2 uppercase">
                        {post.title}
                      </h6>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspired CTA Box */}
            <div className="bg-[#F8FAFC] p-10 rounded-[50px] text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#E91E63] mb-6">
                <Share2 size={24} />
              </div>
              <h5 className="font-black text-xl text-[#2D1B69] mb-3">Inspired to Travel?</h5>
              <p className="text-xs text-[#94A3B8] mb-8 leading-relaxed max-w-[200px]">
                Let our experts craft a personalized Himalayan itinerary for you.
              </p>
              <button className="flex items-center gap-2 px-8 py-3 bg-[#E91E63] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:shadow-lg transition-all group">
                Get Started <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* PreFooter CTA */}
      <PreFooter
        title="Ready to Experience This Adventure?"
        description="Connect with our Himalayan travel specialists to book your trek, tour, or custom package."
        btn1="CALL US NOW"
        btn2="GET A FREE QUOTE"
      />
    </div>
  );
};

export default BlogDetailMore;