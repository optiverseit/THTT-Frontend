import React from "react";
import { useOutletContext } from "react-router-dom";
import { Compass, CheckCircle2 } from "lucide-react";

interface ItineraryItem {
  day: string;
  title: string;
  desc: string;
}

interface Props {
  pkg: any;
  allItenary: ItineraryItem[];
}

const PackageTimeline: React.FC = () => {
  const { allItenary = [], pkg } = useOutletContext<Props>();

  const items = allItenary.length > 0 ? allItenary : [
    {
      day: "1",
      title: "Hotel Pickup & Base Station Transfer",
      desc: "Enjoy comfortable private pickup directly from your hotel with scenic transfer to our activity briefing lounge.",
    },
    {
      day: "2",
      title: "Preparation & Safety Briefing",
      desc: "Meet with your certified tandem master, review wind conditions and safety protocols, and strap into safety gear.",
    },
    {
      day: "3",
      title: "Scenic Mountain Ascent to Launch Point",
      desc: "Drive up through scenic winding mountain roads to the launch vantage point with panoramic Himalayan vistas.",
    },
    {
      day: "4",
      title: `Main ${pkg?.title || "Adventure"} Experience`,
      desc: "Experience the exhilarating core adventure with professional guidance and live 4K GoPro video recording.",
    },
    {
      day: "5",
      title: "Gentle Landing & Refreshment",
      desc: "Perform a safe, smooth touchdown at the lakeside landing zone followed by fresh refreshments.",
    },
    {
      day: "6",
      title: "Media Handover & Hotel Drop-off",
      desc: "Receive your high-definition aerial video footage and action photos directly on your device, with return hotel transfer.",
    },
  ];

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-pink-50 p-2.5 text-[#E91E63]">
            <Compass size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
              Trip Roadmap & Schedule
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Detailed step-by-step experience
            </p>
          </div>
        </div>
      </div>

      <div className="relative pl-4 sm:pl-6">
        {/* Vertical Line */}
        <div className="absolute left-[27px] sm:left-[35px] top-4 bottom-4 w-0.5 bg-pink-100"></div>

        {/* Timeline Items */}
        <div className="space-y-4 relative z-10">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-4 sm:gap-5">
              {/* Day Circle Number */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-2xl bg-[#200B3B] text-white font-black text-xs sm:text-sm shadow-md border-2 border-white flex-shrink-0">
                {item.day}
              </div>

              {/* Card */}
              <div className="flex-1 bg-[#FBFBFE] rounded-2xl p-4 sm:p-5 border border-gray-100 space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#E91E63] bg-pink-50 px-2.5 py-0.5 rounded-full">
                    Phase {item.day}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-[#200B3B]">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* End of Journey Badge */}
        <div className="mt-6 ml-10 sm:ml-12 bg-gradient-to-r from-[#200B3B] to-[#3B145C] text-white rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
          <div>
            <h4 className="font-black text-xs uppercase tracking-wider">
              End of Adventure
            </h4>
            <p className="text-[11px] text-gray-300 font-medium">
              Safe departure with unforgettable moments and photo memories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageTimeline;
