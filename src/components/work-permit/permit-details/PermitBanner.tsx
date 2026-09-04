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
    <div className="relative h-80 w-full rounded-4xl overflow-hidden shadow-lg shadow-gray-400">
      <img
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600"
        alt=""
        className="w-screen h-full object-cover "
      />

      <div className="absolute inset-0 bg-black/60 px-20">
        <h1 className="text-white text-3xl font-bold mt-20  w-fit rounded-full backdrop-blur-xs bg-gray-200/20">
          <span className="px-4 py-2 flex  items-center gap-2">
            {country && (
              <ReactCountryFlag
                className="text-[20px]"
                countryCode={country.flag}
                svg
              />
            )}
            {id.toUpperCase()} - NEW LABOUR PERMIT
          </span>
        </h1>

        {/* details */}
        <div className="flex text-white mt-8 w-full justify-between">
          {serviceDetails.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-2">
                <div className="p-4 backdrop-blur-xs rounded-2xl bg-gray-200/20">
                  <Icon size={20} />
                </div>
                <div>
                  <h1 className="font-bold">{item.label.toUpperCase()}</h1>
                  <p className="text-xs text-gray-300 tracking-wide">
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
