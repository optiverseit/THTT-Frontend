import type { LucideIcon } from "lucide-react";
import React from "react";

interface ServiceItems {
  name: string;
  icon: LucideIcon;
  info?: string;
}

interface HeroProps {
  title: string;
  subject: string;
  description: string;
  services: ServiceItems[];
  backgroundImage: string;
}

const HeroSection: React.FC<HeroProps> = ({
  title,
  subject,
  description,
  services,
  backgroundImage,
}) => {
  return (
    <section className="relative py-14 md:py-20 overflow-hidden">
      {/* Background image */}
      <img
        src={backgroundImage}
        alt={subject}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 text-white">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
          <span className="text-[#FF4FA3] font-black uppercase tracking-[0.3em] text-[10px]">
            {title}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black mt-4 tracking-[0.15em] uppercase">
            {subject}
          </h2>
          <p className="text-xs md:text-sm text-white/75 max-w-2xl mx-auto mt-4 font-medium leading-relaxed">
            {description}
          </p>
        </div>

        {/* Service icons grid — increased vertical row spacing for mobile */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:flex md:flex-wrap gap-x-3 gap-y-12 sm:gap-y-14 md:gap-6 lg:gap-10 justify-center">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="mb-3 border border-white/30 bg-white/10 p-3 md:p-4 rounded-full group-hover:border-white transition-all duration-300 group-hover:scale-110">
                  <Icon size={18} className="text-white" />
                </div>
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">
                  {item.name}
                </span>
                {item.info && (
                  <span className="mt-1 text-[9px] md:text-[10px] text-white/70 font-semibold leading-snug max-w-[80px] md:max-w-[120px]">
                    {item.info}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
