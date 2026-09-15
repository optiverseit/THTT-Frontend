import React from "react";
import { ReactCountryFlag } from "react-country-flag";
import { Clock, Shield, TrendingUp, Users } from "lucide-react";

interface CountryProps {
  id: string;
  name: string;
  flag: string;
  desc: string;
}

interface PermitBannerProps {
  id: string;
  country: CountryProps;
}

const PermitBanner: React.FC<PermitBannerProps> = ({ id, country }) => {
  const serviceDetails = [
    { icon: Clock, label: "4 working days", title: "estimated duration" },
    { icon: Shield, label: "2 years valid", title: "permit duration" },
    { icon: Users, label: "24/7 support", title: "human assistance" },
    { icon: TrendingUp, label: "live tracking", title: "status updates" },
  ];

  return (
    <div className="relative min-h-[22rem] sm:h-80 w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg shadow-gray-400 flex flex-col justify-center">
      <img
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 bg-black/60 px-4 sm:px-8 md:px-12 lg:px-20 py-6 sm:py-8 flex flex-col justify-between h-full">
        <h1 className="text-white text-lg sm:text-2xl md:text-3xl font-bold w-fit rounded-full backdrop-blur-xs bg-gray-200/20 max-w-full">
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 flex-wrap">
            {country && (
              <ReactCountryFlag
                className="text-[18px] sm:text-[20px]"
                countryCode={country.flag}
                svg
              />
            )}
            <span className="truncate">{id.toUpperCase()} - NEW LABOUR PERMIT</span>
          </span>
        </h1>

        {/* details */}
        <div className="grid grid-cols-2 lg:flex text-white mt-6 sm:mt-8 w-full justify-between gap-3 sm:gap-4">
          {serviceDetails.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-2 sm:gap-3">
                <div className="p-2.5 sm:p-3.5 md:p-4 backdrop-blur-xs rounded-xl sm:rounded-2xl bg-gray-200/20 flex-shrink-0">
                  <Icon size={18} className="sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="font-bold text-xs sm:text-sm md:text-base leading-tight truncate">{item.label.toUpperCase()}</h1>
                  <p className="text-[10px] sm:text-xs text-gray-300 tracking-wide truncate">
                    {item.title.toUpperCase()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PermitBanner;
