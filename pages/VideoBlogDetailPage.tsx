
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { videoPosts } from '../data/mockData';
import { 
  Calendar, 
  User, 
  Clock, 
  ChevronLeft, 
  Share2, 
  Bookmark, 
  Facebook, 
  Twitter, 
  MessageCircle,
  ArrowRight,
  TrendingUp,
  Tag,
  Eye,
  Youtube,
  Play
} from 'lucide-react';

const VideoBlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const video = videoPosts.find(v => v.slug === slug);

  if (!video) {
    return (
      <div className="py-40 text-center">
        <h2 className="text-3xl font-black text-[#2D1347]">Video not found</h2>
        <Link to="/video-blog" className="text-[#D92671] mt-4 inline-block font-bold">Back to Vlogs</Link>
      </div>
    );
  }

  const relatedVideos = videoPosts.filter(v => v.slug !== video.slug).slice(0, 3);

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Cinematic Video Player Hero */}
      <section className="bg-[#0a0f1a] pt-12 pb-24 md:pt-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <TrendingUp size={800} className="absolute -top-20 -right-20 text-white" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="mb-8">
             <Link to="/video-blog" className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center space-x-2 hover:bg-white/20 transition-all">
                <ChevronLeft size={16} />
                <span>Back to Vlogs</span>
             </Link>
          </div>

          <div className="aspect-video w-full rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 bg-black">
            <iframe 
               src={`${video.videoUrl}?autoplay=0&rel=0`} 
               title={video.title}
               className="w-full h-full"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               allowFullScreen
             ></iframe>
          </div>

          <div className="mt-12 text-white max-w-4xl">
             <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="bg-[#D92671] text-white px-5 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl">
                  {video.category}
                </span>
                <div className="flex items-center space-x-2 text-white/40 text-[10px] font-black tracking-widest uppercase">
                   <Clock size={14} className="text-[#D92671]" />
                   <span>{video.duration}</span>
                </div>
                <div className="flex items-center space-x-2 text-white/40 text-[10px] font-black tracking-widest uppercase">
                   <Eye size={14} className="text-[#D92671]" />
                   <span>{video.views} Views</span>
                </div>
             </div>
             <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-8">
               {video.title}
             </h1>
             
             <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-4">
                   <div className="w-14 h-14 rounded-2xl bg-[#D92671] p-0.5">
                      <img src={`https://ui-avatars.com/api/?name=${video.author}&background=2D1347&color=fff`} className="w-full h-full rounded-[0.9rem] object-cover" />
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] font-black text-[#D92671] uppercase tracking-widest leading-none mb-1">Uploaded by</p>
                      <p className="text-base font-bold text-white uppercase">{video.author}</p>
                   </div>
                </div>
                <div className="h-10 w-px bg-white/20 hidden md:block"></div>
                <div className="text-left hidden md:block">
                   <p className="text-[10px] font-black text-[#D92671] uppercase tracking-widest leading-none mb-1">Release Date</p>
                   <p className="text-base font-bold text-white uppercase">{video.date}</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. Content & Sidebar Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Content Area */}
            <div className="lg:col-span-8">
              {/* Interaction Bar */}
              <div className="flex items-center justify-between py-6 border-b border-slate-100 mb-12">
                 <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-[#2D1347] font-black text-[10px] uppercase tracking-widest hover:text-[#D92671] transition-colors">
                       <Youtube size={18} className="text-red-600" />
                       <span>Subscribe</span>
                    </button>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <button className="flex items-center space-x-2 text-[#2D1347] font-black text-[10px] uppercase tracking-widest hover:text-[#D92671] transition-colors">
                       <MessageCircle size={18} />
                       <span>Comments</span>
                    </button>
                 </div>
                 <div className="flex items-center space-x-3">
                    <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#2D1347] hover:bg-[#D92671] hover:text-white transition-all shadow-sm"><Facebook size={16} /></button>
                    <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#2D1347] hover:bg-[#D92671] hover:text-white transition-all shadow-sm"><Twitter size={16} /></button>
                    <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#2D1347] hover:bg-[#D92671] hover:text-white transition-all shadow-sm"><Share2 size={16} /></button>
                 </div>
              </div>

              {/* Prose Description */}
              <div className="prose prose-lg max-w-none prose-slate">
                <h3 className="text-2xl font-black text-[#2D1347] mb-6 uppercase tracking-tight">About this journey</h3>
                <p className="text-xl text-slate-600 font-bold leading-relaxed mb-10 italic">
                  {video.description}
                </p>
                
                <div className="text-slate-700 space-y-8 font-medium leading-[1.8]">
                  {video.content?.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                 
              </div>

              {/* Tags Section */}
              <div className="mt-16 flex flex-wrap gap-3">
                 {['Vlog', 'Himalayas', 'Adventure', 'TravelNepal', 'Cinematic'].map(tag => (
                   <span key={tag} className="flex items-center bg-slate-100 px-5 py-2.5 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-[#D92671] hover:text-white transition-all">
                      <Tag size={12} className="mr-2" /> #{tag}
                   </span>
                 ))}
              </div>
            </div>

            {/* Sidebar: Related Videos */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-12">
                 
                 <div>
                    <h3 className="text-lg font-black text-[#2D1347] uppercase tracking-tight mb-8 flex items-center">
                       <TrendingUp size={20} className="mr-3 text-[#D92671]" /> More Visuals
                    </h3>
                    <div className="space-y-6">
                       {relatedVideos.map(related => (
                         <Link key={related.id} to={`/video-blog/${related.slug}`} className="flex gap-5 group">
                            <div className="w-32 h-20 rounded-2xl overflow-hidden shrink-0 shadow-lg relative">
                               <img src={related.thumbnail} alt={related.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                               <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Play size={20} className="text-white fill-white" />
                               </div>
                               <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                                  {related.duration}
                               </span>
                            </div>
                            <div className="flex flex-col justify-center">
                               <span className="text-[9px] font-black text-[#D92671] uppercase tracking-widest mb-1">{related.category}</span>
                               <h4 className="text-xs font-black text-[#2D1347] group-hover:text-[#D92671] transition-colors line-clamp-2 leading-tight uppercase tracking-tight">{related.title}</h4>
                            </div>
                         </Link>
                       ))}
                    </div>
                 </div>
 

                 {/* CTA: Plan a Trip */}
                 <div className="bg-gradient-to-br from-[#D92671] to-[#E91E63] p-10 rounded-[3rem] shadow-2xl text-center group">
                    <h3 className="text-xl font-black text-white mb-4">Feel the Vibe?</h3>
                    <p className="text-white/80 text-sm font-medium mb-8 leading-relaxed">Stop watching and start living. Book your custom adventure today.</p>
                    <Link to="/contact" className="inline-flex items-center space-x-3 bg-white text-[#D92671] px-10 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-xl hover:brightness-110 transition-all">
                       <span>Get Started</span>
                       <ArrowRight size={14} />
                    </Link>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default VideoBlogDetailPage;
