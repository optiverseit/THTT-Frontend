import React from "react";
import { type LucideIcon, MessageCircle, Phone } from "lucide-react";

export interface OverviewFeatureItem {
  name: string;
  desc: string;
  icon: LucideIcon;
}

interface ServiceOverviewSectionProps {
  serviceName: string;
  description: string;
  features: OverviewFeatureItem[];
  whatsappMessage?: string;
  phone?: string;
}

export const ServiceOverviewSection: React.FC<ServiceOverviewSectionProps> = ({
  serviceName,
  description,
  features,
  whatsappMessage = `Hello Trip Himalaya! I am interested in your "${serviceName}" service. Please share details and pricing.`,
  phone = "+9779800000000",
}) => {
  const whatsappUrl = `https://wa.me/9779800000003?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row justify-between w-full gap-8">
        {/* Left Column: Heading, Description & Action Buttons */}
        <div className="w-full lg:w-1/2 p-2 sm:p-4">
          <header>
            <h2 className="text-xs text-pink-500 tracking-widest font-bold mb-2 uppercase">
              OUR EXPERTISE
            </h2>
            <h1 className="text-3xl sm:text-4xl text-purple-950 font-extrabold mb-4">
              {serviceName} Overview
            </h1>
          </header>

          <p className="text-gray-700 leading-relaxed font-normal text-sm sm:text-base">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-6 py-3 text-xs text-white tracking-wide gap-2 flex items-center bg-green-500 hover:bg-green-600 transition-colors cursor-pointer shadow-sm"
            >
              <MessageCircle size={14} />
              WHATSAPP INQUIRY
            </a>
            <a
              href={`tel:${phone}`}
              className="rounded-full px-6 py-3 text-xs text-white tracking-wide gap-2 flex items-center bg-purple-950 hover:bg-purple-900 transition-colors cursor-pointer shadow-sm"
            >
              <Phone size={14} />
              TALK TO EXPERT
            </a>
          </div>
        </div>

        {/* Right Column: 6 Feature Cards with Pink Icon Squares */}
        <div className="w-full lg:w-1/2 px-0 sm:px-4 py-4 sm:py-8 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {features.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="flex justify-between items-center bg-white rounded-3xl p-6 shadow-md shadow-pink-100 inset-shadow-2xs border border-pink-50/50 hover:shadow-lg transition-all"
              >
                <div className="pr-2">
                  <h3 className="font-semibold text-sm text-gray-900">{item.name}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{item.desc}</p>
                </div>

                <div className="bg-pink-500 p-3 rounded-xl text-white flex-shrink-0">
                  <Icon size={20} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServiceOverviewSection;
