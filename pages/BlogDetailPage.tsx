
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/mockData';
import { 
  Calendar, 
  User, 
  Clock, 
  ChevronLeft, 
  Share2, 
  Bookmark, 
  Facebook, 
  Twitter, 
  Linkedin,
  MessageCircle,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import ServicesStrip from '@/components/Layout/ServicesStrip';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="py-40 text-center">
        <h2 className="text-3xl font-black text-[#2D1347]">Article not found</h2>
        <Link to="/blog" className="text-[#D92671] mt-4 inline-block font-bold">Back to Journal</Link>
      </div>
    );
  }

  const relatedPosts = blogPosts.filter(p => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="bg-white min-h-screen">
         
      {/* 1. Article Header Hero */}
      <section className="relative h-[500px] md:h-[650px] overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D1347] via-[#2D1347]/40 to-transparent"></div>
        
        

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 h-full flex flex-col justify-end pb-20">
        
          <div className="max-w-4xl space-y-6">
            <div className="absolute top-20 left-1 z-20">
           <Link to="/blog" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-white hover:text-[#2D1347] transition-all">
              <ChevronLeft size={16} />
              <span>Back to Journal</span>
           </Link>
        </div>
            <div className="inline-flex items-center space-x-4">
               <span className="bg-[#D92671] text-white px-5 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl">
                 {post.category}
               </span>
               {/* <div className="flex items-center space-x-2 text-white/60 text-[10px] font-black tracking-widest uppercase">
                  <Clock size={14} className="text-[#D92671]" />
                  <span>{post.readTime}</span>
               </div> */}
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
              {post.title}
            </h1>
            <div className="flex items-center space-x-6 pt-4">
               <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#D92671] p-0.5 shadow-xl">
                     <img src={`https://ui-avatars.com/api/?name=${post.author}&background=2D1347&color=fff`} className="w-full h-full rounded-[0.9rem] object-cover" />
                  </div>
                  <div className="text-left">
                     <p className="text-[10px] font-black text-[#D92671] uppercase tracking-widest leading-none mb-1">Author</p>
                     <p className="text-sm font-bold text-white uppercase">{post.author}</p>
                  </div>
               </div>
               <div className="h-10 w-px bg-white/20"></div>
               <div className="text-left">
                  <p className="text-[10px] font-black text-[#D92671] uppercase tracking-widest leading-none mb-1">Published</p>
                  <p className="text-sm font-bold text-white uppercase">{post.date}</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Content Area */}
            <div className="lg:col-span-8">
              {/* Article Actions Bar */}
              <div className="flex items-center justify-between py-6 border-b border-slate-100 mb-12">
                 <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-[#2D1347] font-black text-[10px] uppercase tracking-widest hover:text-[#D92671] transition-colors">
                       <Bookmark size={16} />
                       <span>Save for later</span>
                    </button>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <button className="flex items-center space-x-2 text-[#2D1347] font-black text-[10px] uppercase tracking-widest hover:text-[#D92671] transition-colors">
                       <MessageCircle size={16} />
                       <span>Comments</span>
                    </button>
                 </div>
                 <div className="flex items-center space-x-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-2">Share story:</span>
                    <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#2D1347] hover:bg-[#D92671] hover:text-white transition-all"><Facebook size={14} /></button>
                    <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#2D1347] hover:bg-[#D92671] hover:text-white transition-all"><Twitter size={14} /></button>
                    <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#2D1347] hover:bg-[#D92671] hover:text-white transition-all"><Share2 size={14} /></button>
                 </div>
              </div>

              {/* Prose Content */}
              <div className="prose prose-lg max-w-none prose-slate">
                <p className="text-xl md:text-2xl text-slate-600 font-bold leading-relaxed mb-10 italic">
                  {post.excerpt}
                </p>
                
                <div className="text-slate-700 space-y-8 font-medium leading-[1.8]">
                  {post.content?.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                 
              </div>

              {/* Tags Section */}
              <div className="mt-16 flex flex-wrap gap-3">
                 {['Adventure', 'Himalayas', 'Nepal2025', 'Trekking', 'TravelTips'].map(tag => (
                   <span key={tag} className="flex items-center bg-slate-100 px-5 py-2 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-[#D92671] hover:text-white transition-all">
                      <Tag size={12} className="mr-2" /> #{tag}
                   </span>
                 ))}
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-10">
                 
                 {/* Author Profile */}
                 <div className="bg-[#2D1347] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute -top-10 -right-10 opacity-10"><TrendingUp size={150} /></div>
                    <h3 className="text-xs font-black text-[#D92671] uppercase tracking-[0.3em] mb-6">About the Author</h3>
                    <div className="flex items-center space-x-4 mb-6">
                       <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 p-1 shadow-xl">
                          <img src={`https://ui-avatars.com/api/?name=${post.author}&background=D92671&color=fff`} className="w-full h-full rounded-xl object-cover" />
                       </div>
                       <div>
                          <h4 className="font-black text-lg uppercase leading-none mb-1">{post.author}</h4>
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Travel Specialist</p>
                       </div>
                    </div>
                    <p className="text-white/60 text-sm font-medium leading-relaxed mb-6">
                       A veteran of the Himalayan trails with over 15 years of field experience in South Asian tourism.
                    </p>
                    <button className="w-full bg-white/10 hover:bg-white hover:text-[#2D1347] border border-white/20 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all">View All Stories</button>
                 </div>

                 {/* Related Posts */}
                 <div>
                    <h3 className="text-lg font-black text-[#2D1347] uppercase tracking-tight mb-8 flex items-center">
                       <TrendingUp size={20} className="mr-3 text-[#D92671]" /> Related Articles
                    </h3>
                    <div className="space-y-6">
                       {relatedPosts.map(related => (
                         <Link key={related.id} to={`/blog/${related.slug}`} className="flex gap-5 group">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-slate-100">
                               <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="flex flex-col justify-center">
                               <span className="text-[9px] font-black text-[#D92671] uppercase tracking-widest mb-1">{related.category}</span>
                               <h4 className="text-sm font-black text-[#2D1347] group-hover:text-[#D92671] transition-colors line-clamp-2 leading-tight uppercase tracking-tight">{related.title}</h4>
                            </div>
                         </Link>
                       ))}
                    </div>
                 </div>

                 {/* CTA: Plan a Trip */}
                 <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 text-center group">
                    <div className="bg-white w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center text-[#D92671] mx-auto mb-8 group-hover:scale-110 transition-transform">
                       <Share2 size={28} />
                    </div>
                    <h3 className="text-xl font-black text-[#2D1347] mb-4">Inspired to Travel?</h3>
                    <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">Let our experts craft a personalized Himalayan itinerary for you.</p>
                    <Link to="/contact" className="inline-flex items-center space-x-3 bg-[#D92671] text-white px-10 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-xl hover:brightness-110 transition-all">
                       <span>Get Started</span>
                       <ArrowRight size={14} />
                    </Link>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Global Newsletter Bottom */}
      <section className="py-24 bg-[#2D1347] text-white overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none -translate-x-1/2">
            <TrendingUp size={800} />
         </div>
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Enjoyed this journal?</h2>
            <p className="text-white/40 text-lg font-medium mb-12">Get our latest travel guides and exclusive package offers delivered to your inbox.</p>
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
               <input type="email" placeholder="Enter your email" className="flex-1 bg-white/5 border border-white/20 px-8 py-5 rounded-[1.8rem] text-white placeholder-white/30 outline-none focus:bg-white focus:text-[#2D1347] transition-all font-bold" />
               <button className="bg-[#D92671] text-white px-12 py-5 rounded-[1.8rem] font-black text-[10px] tracking-widest uppercase shadow-2xl hover:brightness-110 transition-all">Join The Club</button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default BlogDetailPage;
