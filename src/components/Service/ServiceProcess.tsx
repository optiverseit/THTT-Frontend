import React from "react";

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface ServiceProcessProps {
  steps?: ProcessStep[];
  title?: string;
  subtitle?: string;
}

export const ServiceProcess: React.FC<ServiceProcessProps> = ({
  steps = [
    {
      number: 1,
      title: "CHOOSE OPTION & INQUIRE",
      description: "Select your preferred itinerary, package, or service from our catalog.",
    },
    {
      number: 2,
      title: "CUSTOMIZE & QUOTATION",
      description: "Our dedicated travel specialists tailor dates, routes, and special preferences.",
    },
    {
      number: 3,
      title: "FAST CONFIRMATION",
      description: "Receive instant electronic vouchers, permits, and tickets with transparent pricing.",
    },
    {
      number: 4,
      title: "SEAMLESS EXPERIENCE",
      description: "Enjoy verified premium hospitality, licensed guides, and 24/7 support throughout.",
    },
  ],
  title = "How the Process Works",
  subtitle = "OUR WORKFLOW",
}) => {
  return (
    <div className="flex justify-center w-full bg-white py-12 px-6">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <header className="flex flex-col items-center mb-14">
          <p className="text-pink-500 tracking-widest text-xs font-semibold uppercase text-center mb-2">
            {subtitle}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-purple-950 text-center">
            {title}
          </h1>
          <div className="rounded-full h-1 w-16 bg-pink-600 mt-3"></div>
        </header>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              {/* Circle */}
              <div className="w-14 h-14 rounded-full border-4 border-white shadow-lg shadow-pink-300 bg-pink-600 flex items-center justify-center text-white text-xl font-bold mb-5 z-10 relative">
                {step.number}
              </div>
              {/* Title */}
              <p className="text-sm font-extrabold text-purple-950 uppercase leading-tight mb-2">
                {step.title}
              </p>
              {/* Description */}
              <p className="text-xs text-purple-900/80 leading-relaxed max-w-[240px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceProcess;
