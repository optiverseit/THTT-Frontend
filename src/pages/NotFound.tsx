import { Link, useNavigate } from "react-router-dom";
import { Compass, Home, ArrowLeft, MapPin, Plane, Briefcase } from "lucide-react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] bg-[#FBFBFE] flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-2xl w-full text-center space-y-8 py-12">
        {/* Animated Badge & Icon */}
        <div className="relative inline-block">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-pink-50 text-[#E91E63] flex items-center justify-center mx-auto shadow-md border border-pink-100 ring-8 ring-pink-50/50">
            <Compass size={56} className="animate-spin" style={{ animationDuration: "16s" }} />
          </div>
          <span className="absolute -bottom-2 -right-2 px-3.5 py-1 bg-[#2D1347] text-white text-xs font-black rounded-full shadow-md">
            404
          </span>
        </div>

        {/* Headings */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-[#2D1347] tracking-tight">
            Lost on the Trail?
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
            The page or route you are looking for doesn't exist, was moved, or the URL might be mistyped. Let's get you back on track.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#E91E63] hover:bg-pink-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            <Home size={16} />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/packages"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D1347] hover:bg-purple-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            <Compass size={16} />
            <span>Explore Packages</span>
          </Link>
        </div>

        {/* Quick Discovery Directory */}
        <div className="pt-8 border-t border-gray-200/60 max-w-lg mx-auto">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
            Popular Destinations &amp; Services
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { to: "/packages", label: "Tours & Treks", icon: MapPin },
              { to: "/service/air-ticket", label: "Air Ticketing", icon: Plane },
              { to: "/service/heli-services", label: "Heli Services", icon: Compass },
              { to: "/work-permit", label: "Work Permits", icon: Briefcase },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.to}
                  className="p-3 bg-white rounded-2xl border border-gray-100 hover:border-pink-200 hover:shadow-sm text-center transition-all group"
                >
                  <Icon size={16} className="mx-auto text-gray-400 group-hover:text-[#E91E63] transition-colors mb-1.5" />
                  <span className="text-[11px] font-bold text-gray-700 group-hover:text-[#2D1347] transition-colors block">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
