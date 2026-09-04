import React from "react";
import {
  CheckCircle2, Shield, Users, Target, Eye, Plane, Hotel,
  Car, Mountain, Briefcase, CreditCard, MapPin, Heart, Globe,
  Zap, Activity, History,
} from "lucide-react";

const About: React.FC = () => {
  return (
    <div>
      {/* Hero Header */}
      <section className="relative h-[320px] sm:h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
          alt="Himalayan Peaks"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/40 to-slate-50" />

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span className="inline-block bg-[#D92671] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.35em] mb-4 shadow-xl border border-white/10">
            Discover Our Legacy
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-5 tracking-tight drop-shadow-2xl">
            About Trip Himalaya
          </h1>
          <div className="h-1.5 w-16 sm:w-24 bg-[#D92671] mx-auto rounded-full mb-5 shadow-lg" />
          <p className="text-white/90 text-sm sm:text-base md:text-xl font-medium max-w-2xl mx-auto leading-relaxed italic">
            "Your dedicated partner for unforgettable travel experiences across the Himalayas and beyond."
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 sm:h-24 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Story Section */}
      <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -top-4 -left-4 w-full h-full bg-[#D92671]/10 rounded-[2rem] -z-10 transition-transform group-hover:scale-105" />
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                alt="Trip Himalaya Professional Travel Team"
                className="rounded-[2rem] shadow-2xl w-full h-[380px] sm:h-[460px] object-cover border-4 sm:border-8 border-white"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <div>
                <span className="text-[#D92671] font-black uppercase tracking-[0.3em] text-xs">
                  Excellence in Motion
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2D1347] mt-3 tracking-tight">
                  Experience Excellence in Travel
                </h2>
              </div>
              <p className="text-slate-600 text-base leading-relaxed font-medium">
                Founded with a passion for sharing the majesty of Nepal with the world, Trip Himalaya Tours & Travels Pvt. Ltd. has grown into a leading travel management company. We specialize in providing comprehensive travel solutions, from domestic and international ticketing to high-altitude trekking and luxury tours.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { count: "10+", label: "Years of Experience", color: "#D92671" },
                  { count: "5000+", label: "Happy Travelers", color: "#5D2A8E" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                    <h4 className="text-3xl sm:text-4xl font-black mb-1" style={{ color: stat.color }}>{stat.count}</h4>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
              <ul className="space-y-3 pt-2">
                {[
                  "Licensed by Nepal Ministry of Tourism",
                  "Certified Mountain Guides",
                  "Customized Itineraries",
                  "Competitive Global Pricing",
                ].map((item) => (
                  <li key={item} className="flex items-center text-slate-700 font-bold text-sm sm:text-base">
                    <CheckCircle2 size={20} className="text-[#D92671] mr-3 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-8 md:py-12 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          {[
            { icon: Target, color: "#D92671", bg: "#D92671", title: "Our Mission", text: "To provide safe, accessible, and high-quality travel experiences that inspire a deeper connection with the nature and culture of Nepal, while maintaining the highest standards of hospitality and professionalism." },
            { icon: Eye, color: "#5D2A8E", bg: "#5D2A8E", title: "Our Vision", text: "To be the most trusted and sought-after travel brand in South Asia, recognized for our commitment to sustainable tourism, exceptional customer service, and innovative travel solutions." },
          ].map(({ icon: Icon, bg, title, text }) => (
            <div key={title} className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-100 group hover:-translate-y-1 transition-all duration-500">
              <div
                className="p-4 sm:p-5 rounded-2xl w-fit mb-6 group-hover:text-white transition-all"
                style={{ backgroundColor: `${bg}20`, color: bg }}
              >
                <Icon size={36} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] mb-4 tracking-tight">{title}</h3>
              <p className="text-slate-500 font-medium text-base leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="py-10 md:py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center space-x-2 bg-[#D92671]/5 px-4 py-2 rounded-full mb-4">
                <Activity size={14} className="text-[#D92671]" />
                <span className="text-[#D92671] font-black uppercase tracking-[0.2em] text-[10px]">Growth & Success</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2D1347] tracking-tight mb-6 leading-tight">
                A Decade of{" "}
                <span className="text-[#5D2A8E]">Legacy in Numbers.</span>
              </h2>
              <p className="text-slate-500 text-base font-medium leading-relaxed mb-8">
                Since our inception in 2014, we've remained steadfast in our commitment to excellence, serving travelers with passion and precision across the Himalayas.
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-3 rounded-2xl shadow-sm">
                    <History size={22} className="text-[#D92671]" />
                  </div>
                  <div>
                    <h4 className="font-black text-[#2D1347] text-sm uppercase tracking-wide">Founded in 2014</h4>
                    <p className="text-xs font-bold text-slate-400">Trust built over 10+ professional years</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { count: "5000+", label: "Travelers Served", icon: Users, color: "text-[#D92671]" },
                { count: "1000+", label: "Tours Completed", icon: Globe, color: "text-[#5D2A8E]" },
                { count: "80+", label: "Trekking Managed", icon: Mountain, color: "text-green-600" },
                { count: "600+", label: "Visas Granted", icon: Shield, color: "text-blue-600" },
                { count: "60+", label: "Corporate Clients", icon: Briefcase, color: "text-indigo-600" },
                { count: "75%", label: "Repeat & Referral", icon: Heart, color: "text-red-500" },
                { count: "25+", label: "Regular Routes", icon: MapPin, color: "text-orange-500" },
                { count: "100%", label: "Safety Record", icon: Zap, color: "text-yellow-600" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 group flex items-center space-x-3 sm:space-x-6 overflow-hidden relative">
                  <div className={`${stat.color} bg-slate-50 p-3 rounded-2xl group-hover:bg-white group-hover:shadow-lg transition-all flex-shrink-0`}>
                    <stat.icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className={`text-2xl sm:text-3xl font-black ${stat.color} block leading-none mb-0.5`}>{stat.count}</span>
                    <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Global Network */}
      <section className="py-10 md:py-14 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[#D92671] font-black uppercase tracking-[0.4em] text-[10px] mb-3 block">Our Industry Ecosystem</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#2D1347] tracking-tight mb-4">Global Network</h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium text-base">Collaborating with trusted travel and mobility partners.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { icon: Plane, count: "57+", label: "Airlines" },
              { icon: Hotel, count: "100+", label: "Hotels" },
              { icon: Car, count: "50+", label: "Fleet" },
              { icon: Mountain, count: "30+", label: "Local" },
              { icon: Briefcase, count: "27+", label: "Corporate" },
              { icon: CreditCard, count: "7+", label: "Payments" },
            ].map((part, idx) => (
              <div key={idx} className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl text-center shadow-md hover:shadow-xl transition-all duration-500 group cursor-pointer">
                <div className="bg-[#D92671]/10 p-4 rounded-2xl text-[#D92671] mb-4 inline-block transition-all duration-500 group-hover:bg-[#D92671] group-hover:text-white">
                  <part.icon size={24} />
                </div>
                <h4 className="text-2xl font-black text-[#2D1347] mb-1">{part.count}</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#D92671]">{part.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Office */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-[#2D1347] mb-4 tracking-tight">Visit Our Office</h2>
            <p className="text-slate-500 font-medium mb-10 text-base">Located in the heart of Kathmandu.</p>
            <a
              href="https://maps.google.com/?q=Kantipath,Kathmandu,Nepal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#5D2A8E] text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-black tracking-widest hover:bg-[#D92671] transition-all shadow-xl active:scale-95"
            >
              <MapPin size={20} />
              <span>VIEW ON GOOGLE MAPS</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-[#D92671] to-[#E91E63] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left max-w-2xl">
            <span className="text-white/60 font-black uppercase tracking-[0.3em] text-[10px] block mb-3">
              Legally Recognized
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
              Fully Licensed & Trusted
            </h2>
            <p className="text-white/80 font-semibold text-base">
              Registered under the Government of Nepal and affiliated with recognized tourism authorities.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href="tel:+9779800000000"
              className="bg-[#2D1347] text-white px-8 sm:px-10 py-4 rounded-full font-black tracking-wider hover:brightness-125 transition-all shadow-2xl text-center text-sm sm:text-base"
            >
              CALL US NOW
            </a>
            <a
              href="https://wa.me/9779800000003?text=Hello%20Trip%20Himalaya!%20I%20would%20like%20to%20get%20a%20free%20quote."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#D92671] px-8 sm:px-10 py-4 rounded-full font-black tracking-wider hover:bg-slate-50 transition-all shadow-2xl text-sm sm:text-base text-center"
            >
              GET FREE QUOTE
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;