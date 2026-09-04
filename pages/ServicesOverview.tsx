import React from "react";
import { services } from "../data/mockData";
import { Link } from "react-router-dom";
// Fix: Correct namespace import syntax from lucide-react
import * as Icons from "lucide-react";
import ServicesStrip from "@/components/Layout/ServicesStrip";
 
const ServicesOverview: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className={`sticky top-0 z-[60]`}>
          <ServicesStrip />
        </div>
      {/* Cinematic Hero Header */}
      <section className="relative h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=2000"
          alt="Travel Services"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/40 to-slate-50"></div>
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl animate-in fade-in zoom-in duration-700">
          <span className="inline-block bg-[#D92671] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.4em] mb-6 shadow-xl border border-white/10">
            Comprehensive Solutions
          </span>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight drop-shadow-2xl">
            Our Services
          </h1>
          <div className="h-1.5 w-24 bg-[#D92671] mx-auto rounded-full mb-8 shadow-lg"></div>
          <p className="text-white/90 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg italic">
            "Everything you need for a seamless journey, from domestic ticketing
            to global expeditions."
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-[#2D1347] tracking-tight">
              Tailored Travel Management
            </h2>
            <p className="text-slate-500 font-medium mt-4">
              We provide end-to-end support for individual travelers, corporate
              groups, and mountain adventurers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => { 
              const IconComponent =
                (Icons as any)[service.icon] || Icons.HelpCircle;
              return (
                <Link
                  key={service.id}
                  to={`/services/${service.slug}`}
                  className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 group border border-slate-100 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-[#D92671]/5 transition-colors duration-500"></div>

                  <div className="bg-[#5D2A8E]/10 text-[#5D2A8E] p-5 rounded-2xl w-fit mb-8 group-hover:bg-[#D92671] group-hover:text-white transition-all duration-500">
                    <IconComponent size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-[#2D1347] mb-4 group-hover:text-[#D92671] transition-colors tracking-tight">
                    {service.name}
                  </h3>
                  <p className="text-slate-500 mb-8 leading-relaxed font-medium line-clamp-3">
                    {service.shortDesc}
                  </p>
                  <div className="flex items-center text-[#D92671] font-black text-xs tracking-widest uppercase">
                    Explore Details{" "}
                    <Icons.ArrowRight
                      size={18}
                      className="ml-3 group-hover:translate-x-2 transition-transform"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Strip – CTA-band style (same as 2nd) */}
<section className="bg-gradient-to-r from-[#D92671] to-[#E91E63] py-16">
  <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
    
    {/* Left content */}
    <div className="text-center md:text-left max-w-2xl">
       

      <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
        Need a custom solution?
      </h2>

      <p className="text-white/85 font-semibold text-lg">
        Tell us what you need — we handle special requests and complex travel planning.
      </p>
    </div>

    {/* Right CTA */}
    <div className="flex flex-wrap justify-center md:justify-end gap-6">
      <Link
        to="/contact"
        className="bg-[#2D1347] text-white px-12 py-5 rounded-full font-black tracking-widest hover:brightness-110 transition-all shadow-2xl active:scale-95 inline-flex items-center gap-3"
      >
        TALK TO AN EXPERT 
      </Link>
    </div>

  </div>
</section>

    </div>
  );
};

export default ServicesOverview;
