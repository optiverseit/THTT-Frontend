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
      <div className="flex justify-between w-full ">
        <div className="w-1/2 p-4">
          <header>
            <h2 className="text-xs text-pink-500 tracking-widest font-bold mb-2">
              OUR EXPERTISE
            </h2>
            <h1 className="text-4xl text-purple-950 font-extrabold mb-4">
              Permit Overview
            </h1>
          </header>

          <div>
            A Work Permit {`(श्रम स्वीकृति)`} is a mandatory legal document
            required to work abroad. We assist applicants with complete
            processing, documentation, government coordination, and status
            updates to ensure a smooth approval process for all countries
            including UAE, Qatar, Saudi Arabia and Malaysia.{" "}
          </div>

          <div className="mt-8 flex justify-between w-2/3">
            <button className="rounded-full px-6 py-3 text-xs text-white tracking-wide gap-2 flex items-center bg-green-500">
              <MessageCircle size={14} />
              WHATSAPP INQUIRY
            </button>
            <button className="rounded-full px-6 py-3 text-xs text-white tracking-wide gap-2 flex items-center bg-purple-950">
              <Phone size={14} />
              TALK TO EXPERT
            </button>
          </div>
        </div>
        {/* right */}
        <div className="w-1/2 px-4 py-8 grid grid-cols-2 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="flex justify-between items-center bg-white rounded-3xl p-6 shadow-md shadow-pink-100 inset-shadow-2xs"
              >
                <div>
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>

                <div className="bg-pink-500 p-3 rounded-xl text-white">
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
