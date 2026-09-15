import {
  type LucideIcon,
  Zap,
  Clock,
  ShieldCheck,
  FileText,
  Users,
  MessageCircle,
  Phone,
} from "lucide-react";


interface FeatureItem {
  name: string;
  desc: string;
  icon: LucideIcon;
}


const WorkPermitOverview = () => {
  const items: FeatureItem[] = [
    {
      name: "FAST PROCESSING",
      desc: "Quick approval turnaround.",
      icon: Zap,
    },
    {
      name: "LONG-TERM VALIDITY",
      desc: "Permits valid for up to 2 years.",
      icon: Clock,
    },
    {
      name: "GOVT. APPROVED",
      desc: "100% legal and registered.",
      icon: ShieldCheck,
    },
    {
      name: "COMPLETE DOCS",
      desc: "We handle all paperwork.",
      icon: FileText,
    },
    {
      name: "HUMAN SUPPORT",
      desc: "24/7 expert assistance.",
      icon: Users,
    },
    {
      name: "WHATSAPP HELP",
      desc: "Instant updates on phone.",
      icon: MessageCircle,
    },
  ];


  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row justify-between w-full">
        <div className="w-full lg:w-1/2 p-4 sm:p-6">
          <header>
            <h2 className="text-xs text-pink-500 tracking-widest font-bold mb-2">
              OUR EXPERTISE
            </h2>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-purple-950 font-extrabold mb-4">
              Permit Overview
            </h1>
          </header>

          <div className="text-sm sm:text-base text-gray-700">
            A Work Permit {`(श्रम स्वीकृति)`} is a mandatory legal document
            required to work abroad. We assist applicants with complete
            processing, documentation, government coordination, and status
            updates to ensure a smooth approval process for all countries
            including UAE, Qatar, Saudi Arabia and Malaysia.{" "}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:w-auto">
            <a
              href="https://wa.me/9779800000003?text=Hello%20Trip%20Himalaya!%20I%20need%20help%20with%20a%20Work%20Permit."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-6 py-3 text-xs text-white tracking-wide gap-2 flex items-center justify-center bg-green-500 hover:bg-green-600 transition-colors cursor-pointer"
            >
              <MessageCircle size={14} />
              WHATSAPP INQUIRY
            </a>
            <a
              href="tel:+9779800000000"
              className="rounded-full px-6 py-3 text-xs text-white tracking-wide gap-2 flex items-center justify-center bg-purple-950 hover:bg-purple-900 transition-colors cursor-pointer"
            >
              <Phone size={14} />
              TALK TO EXPERT
            </a>
          </div>
        </div>
        {/* right */}
        <div className="w-full lg:w-1/2 px-4 py-6 sm:py-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="flex justify-between items-center bg-white rounded-3xl p-4 sm:p-6 shadow-md shadow-pink-100 inset-shadow-2xs"
              >
                <div>
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>

                <div className="bg-pink-500 p-3 rounded-xl text-white flex-shrink-0">
                  <Icon size={20} />
                </div>
              </div>
            );
          })}
        </div>
      </div>{" "}
      {/* permit services */}
    </div>
  );
};

export default WorkPermitOverview;
