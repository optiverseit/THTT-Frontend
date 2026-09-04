import React from "react";
import {
  CheckCircle2,
  Star,
  Quote,
  ArrowRight,
  Shield,
  Clock,
  Users,
  Award,
  Target,
  Eye,
  Plane,
  Hotel,
  Car,
  Mountain,
  Briefcase,
  CreditCard,
  MapPin,
  Heart,
  TrendingUp,
  Headphones,
  Check,
  MessageSquare,
  Globe,
  Zap,
  Activity,
  History,
} from "lucide-react";
import ServicesWheel from "@/components/Home/ServicesWheel";
import ServicesStrip from "@/components/Layout/ServicesStrip";

const About: React.FC = () => {
  
  return (
     
    <div>
       <div className={`sticky top-0 z-[60]`}>
          <ServicesStrip />
        </div> 
      {/* Redesigned Hero Header with Image */}
      <section className="relative h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
        
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
          alt="Himalayan Peaks"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/40 to-slate-50"></div>
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl animate-in fade-in zoom-in duration-700">
          <span className="inline-block bg-[#D92671] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.4em] mb-6 shadow-xl border border-white/10">
            Discover Our Legacy
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-7xl font-black text-white mb-8 tracking-tight drop-shadow-2xl">
            About Trip Himalaya
          </h1>
          <div className="h-1.5 w-24 bg-[#D92671] mx-auto rounded-full mb-8 shadow-lg"></div>
          <p className="text-white/90 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg italic">
            "Your dedicated partner for unforgettable travel experiences across
            the Himalayas and beyond."
          </p>
        </div>

        {/* Floating Stats or Element can be added here if needed */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="absolute -top-6 -left-6 w-full h-full bg-[#D92671]/10 rounded-[3rem] -z-10 transition-transform group-hover:scale-105"></div>
              <img
                src="../components/Layout/alt.png"
                alt="About Trip Himalaya Team"
                className="rounded-[3rem] shadow-2xl relative z-10 border-8 border-white"
              />
            </div>
            <div className="space-y-8">
              <div>
                <span className="text-[#D92671] font-black uppercase tracking-[0.3em] text-xs">
                  Excellence in Motion
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-[#2D1347] mt-3 tracking-tight">
                  Experience Excellence in Travel
                </h2>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                Founded with a passion for sharing the majesty of Nepal with the
                world, Trip Himalaya Tours & Travels Pvt. Ltd. has grown into a
                leading travel management company. We specialize in providing
                comprehensive travel solutions, from domestic and international
                ticketing to high-altitude trekking and luxury tours.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                  <h4 className="text-4xl font-black text-[#D92671] mb-1">
                    10+
                  </h4>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                    Years of Experience
                  </p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                  <h4 className="text-4xl font-black text-[#5D2A8E] mb-1">
                    5000+
                  </h4>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                    Happy Travelers
                  </p>
                </div>
              </div>
              <ul className="space-y-4 pt-4">
                {[
                  "Licensed by Nepal Ministry of Tourism",
                  "Certified Mountain Guides",
                  "Customized Itineraries",
                  "Competitive Global Pricing",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center text-slate-700 font-bold"
                  >
                    <CheckCircle2
                      size={22}
                      className="text-[#D92671] mr-4 shrink-0"
                    />{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-5 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-16 rounded-[3rem] shadow-xl border border-slate-100 group hover:-translate-y-2 transition-all duration-500">
              <div className="bg-[#D92671]/10 text-[#D92671] p-6 rounded-[1.5rem] w-fit mb-10 group-hover:bg-[#D92671] group-hover:text-white transition-all">
                <Target size={48} />
              </div>
              <h3 className="text-3xl font-black text-[#2D1347] mb-6 tracking-tight">
                Our Mission
              </h3>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                To provide safe, accessible, and high-quality travel experiences
                that inspire a deeper connection with the nature and culture of
                Nepal, while maintaining the highest standards of hospitality
                and professionalism.
              </p>
            </div>
            <div className="bg-white p-16 rounded-[3rem] shadow-xl border border-slate-100 group hover:-translate-y-2 transition-all duration-500">
              <div className="bg-[#5D2A8E]/10 text-[#5D2A8E] p-6 rounded-[1.5rem] w-fit mb-10 group-hover:bg-[#5D2A8E] group-hover:text-white transition-all">
                <Eye size={48} />
              </div>
              <h3 className="text-3xl font-black text-[#2D1347] mb-6 tracking-tight">
                Our Vision
              </h3>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                To be the most trusted and sought-after travel brand in South
                Asia, recognized for our commitment to sustainable tourism,
                exceptional customer service, and innovative travel solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ACHIEVEMENTS - REDESIGNED */}
      <section className="py-12 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[40%] h-full bg-[#5D2A8E]/[0.02] -skew-x-12 translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Achievement Text Column */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center space-x-2 bg-[#D92671]/5 px-4 py-2 rounded-full mb-6">
                <Activity size={14} className="text-[#D92671]" />
                <span className="text-[#D92671] font-black uppercase tracking-[0.2em] text-[10px]">
                  Growth & Success
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#2D1347] tracking-tight mb-8 leading-[1.1]">
                A Decade of <br />
                <span className="text-[#5D2A8E]">Legacy in Numbers.</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12">
                Since our inception in 2014, we've remained steadfast in our
                commitment to excellence, serving travelers with passion and
                precision across the Himalayas.
              </p>

              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-3 rounded-2xl shadow-sm">
                    <History size={24} className="text-[#D92671]" />
                  </div>
                  <div>
                    <h4 className="font-black text-[#2D1347] text-sm uppercase tracking-wide">
                      Founded in 2014
                    </h4>
                    <p className="text-xs font-bold text-slate-400">
                      Trust built over 10+ professional years
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Stats Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  count: "5000+",
                  label: "Travelers Served",
                  icon: Users,
                  color: "text-[#D92671]",
                },
                {
                  count: "1000+",
                  label: "Tours Completed",
                  icon: Globe,
                  color: "text-[#5D2A8E]",
                },
                {
                  count: "80+",
                  label: "Trekking Managed",
                  icon: Mountain,
                  color: "text-green-600",
                },
                {
                  count: "600+",
                  label: "Visas Granted",
                  icon: Shield,
                  color: "text-blue-600",
                },
                {
                  count: "60+",
                  label: "Corporate Clients",
                  icon: Briefcase,
                  color: "text-indigo-600",
                },
                {
                  count: "75%",
                  label: "Repeat & Referral",
                  icon: Heart,
                  color: "text-red-500",
                },
                {
                  count: "25+",
                  label: "Regular Routes",
                  icon: MapPin,
                  color: "text-orange-500",
                },
                {
                  count: "100%",
                  label: "Safety Record",
                  icon: Zap,
                  color: "text-yellow-600",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group flex items-center space-x-6 overflow-hidden relative"
                >
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                    <stat.icon size={120} />
                  </div>
                  <div
                    className={`${stat.color} bg-slate-50 p-4 rounded-2xl group-hover:bg-white group-hover:shadow-lg transition-all`}
                  >
                    <stat.icon size={24} />
                  </div>
                  <div className="relative z-10">
                    <span
                      className={`text-3xl font-black ${stat.color} block leading-none mb-1`}
                    >
                      {stat.count}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. PARTNERSHIPS - REDESIGNED */}
      <section className="py-12 bg-white relative overflow-hidden">
        {/* subtle pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#2D1347_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-5">
            <span className="text-[#D92671] font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">
              Our Industry Ecosystem
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-[#2D1347] tracking-tight mb-6">
              Global Network
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
              Collaborating with trusted travel and mobility partners to deliver
              seamless logistics and dependable services worldwide.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              {
                icon: Plane,
                count: "57+",
                label: "Airlines",
                sub: "Global Carriers",
              },
              {
                icon: Hotel,
                count: "100+",
                label: "Hotels",
                sub: "Elite Resorts",
              },
              {
                icon: Car,
                count: "50+",
                label: "Fleet",
                sub: "Luxury Vehicles",
              },
              {
                icon: Mountain,
                count: "30+",
                label: "Local",
                sub: "Trek Partners",
              },
              {
                icon: Briefcase,
                count: "27+",
                label: "Corporate",
                sub: "Major Brands",
              },
              {
                icon: CreditCard,
                count: "7+",
                label: "Payments",
                sub: "Secure Portals",
              },
            ].map((part, idx) => (
              <div
                key={idx}
                className="
            bg-white
            border border-slate-100
            p-8
            rounded-[3rem]
            text-center
            shadow-[0_20px_40px_rgba(45,19,71,0.06)]
            hover:shadow-[0_30px_60px_rgba(45,19,71,0.12)]
            transition-all duration-700
            group
            cursor-pointer
          "
              >
                {/* Icon */}
                <div
                  className="
              bg-[#D92671]/10
              p-5
              rounded-[2rem]
              text-[#D92671]
              mb-6
              inline-block
              transition-all duration-500
              transform
              group-hover:bg-[#D92671]
              group-hover:text-white
              group-hover:-translate-y-2
            "
                >
                  <part.icon size={32} />
                </div>

                {/* Text */}
                <div>
                  <h4 className="text-3xl font-black text-[#2D1347] mb-1">
                    {part.count}
                  </h4>
                  <p className="text-[11px] font-black uppercase tracking-widest text-[#D92671] mb-1">
                    {part.label}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    {part.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-5 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm"
                >
                  <img
                    src={`https://i.pravatar.cc/100?u=${i}`}
                    alt="Partner"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-white bg-[#D92671] text-white flex items-center justify-center text-[10px] font-black shadow-sm">
                +200
              </div>
            </div>

            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest text-center md:text-right">
              Empowering journeys through a network{" "}
              <br className="hidden md:block" />
              of 200+ verified service partners.
            </p>
          </div>
        </div>
      </section>

      {/* Office Location CTA */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-black text-[#2D1347] mb-6 tracking-tight">
              Visit Our Office
            </h2>
            <p className="text-slate-500 font-medium mb-12 text-lg">
              We are located in the heart of Kathmandu. Feel free to drop by for
              a cup of tea and a professional travel consultation.
            </p>
            <div className="flex justify-center">
              <a
                href="#/contact"
                className="bg-[#5D2A8E] text-white px-12 py-5 rounded-full font-black tracking-widest flex items-center space-x-3 hover:bg-[#D92671] transition-all shadow-xl active:scale-95"
              >
                <MapPin size={24} />
                <span>VIEW ON GOOGLE MAPS</span>
              </a>
            </div>
          </div>
        </div>
      </section>

 
      {/* Legal Status – compact & CTA-style */}
<section className="bg-gradient-to-r from-[#D92671] to-[#E91E63] py-16">
  <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
    
    {/* Left content */}
    <div className="text-center md:text-left max-w-2xl">
      <span className="text-[#D92671] font-black uppercase tracking-[0.35em] text-[10px] block mb-4">
        Legally Recognized
      </span>

      <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
        Fully Licensed & Trusted
      </h2>

      <p className="text-white/80 font-semibold text-lg">
        Registered under the Government of Nepal and affiliated with
        recognized tourism authorities.
      </p>
    </div>

    {/* Right info pills */}
    <div className="flex flex-wrap justify-center md:justify-end gap-4">
       
            <a href="tel:+9779800000000" className="bg-[#2D1347] text-white px-12 py-5 rounded-full font-black tracking-widest hover:brightness-125 transition-all shadow-2xl">CALL US NOW</a>
            <button    className="bg-white text-[#D92671] px-12 py-5 rounded-full font-black tracking-widest hover:bg-slate-50 transition-all shadow-2xl">GET FREE QUOTE</button>
         
    </div>

  </div>
</section>

    </div>
  );
};

export default About;
