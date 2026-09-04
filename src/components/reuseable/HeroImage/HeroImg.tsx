import React from "react";

interface SubHeroProps {
  badge?: string;
  title: string;
  description: string;
  backgroundImage: string;
  height?: string;
}

const SubHero: React.FC<SubHeroProps> = ({
  badge,
  title,
  description,
  backgroundImage,
  height = "h-[300px] sm:h-[380px] md:h-[450px]",
}) => {
  return (
    <section className={`relative ${height} flex items-center justify-center overflow-hidden`}>
      {/* Background Image */}
      <img
        src={backgroundImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/40 to-slate-50" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl w-full">
        {badge && (
          <span className="inline-block bg-[#D92671] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.3em] mb-4 shadow-xl border border-white/10">
            {badge}
          </span>
        )}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-5 tracking-tight drop-shadow-2xl">
          {title}
        </h1>
        <div className="h-1 w-16 sm:w-24 bg-[#D92671] mx-auto rounded-full mb-5 shadow-lg" />
        <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg italic">
          "{description}"
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-16 sm:h-24 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  );
};

export default SubHero;