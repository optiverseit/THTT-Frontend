import {
  AlertCircle,
  CircleCheck,
  CircleHelp,
  FileText,
  Zap,
} from "lucide-react";


interface CountryProps {
  id: string;
  name: string;
  flag: string;
  desc: string;
}

interface PermitBannerProps {
  id?: string;
  country: CountryProps;
}

const AboutPermit = ({ country }: PermitBannerProps) => {
  const reqDocs = [
    "Original Passport (Scan Copy)",
    " Valid Job Offer Letter/Visa Copy",
    "Experience Certificates (if applicable)",
    "MRP Size Photo (Recent)",
    "Police Clearance Report (if required)",
  ];

  const included = [
    "Govt. Application Filling",
    "FEO Coordination",
    "Document Scanning",
    "Insurance Help",
    "Online Status Tracking",
  ];

  const policies = [
    "NON-REFUNDABLE GOVT. FEE",
    "VERIFIATION REQUIRED",
    "SELF-DECLARATION MANDATORY",
  ];



  return (
    <div className="col-span-2">
      <div className="rounded-4xl bg-white shadow-xl shadow-gray-300">
        <div className="p-10">
          <div>
            <header className="flex items-center gap-2">
              <FileText size={18} className="text-pink-500" />
              <p className="text-purple-950 text-xl font-bold mb-2">
                About {country.name} Permit
              </p>
            </header>

            <p className="text-gray-500 font-semibold py-4 mb-6">
              Processing a work permit for {country.name} requires a careful
              documentation and adherence to both the destination country's
              labour laws and the Nepal government's Shram rules. Our team
              ensures your file is complete and submitted to the Foreign
              Employment Office {`(FEO)`} correctly.
            </p>
          </div>

          <div className="flex w-full justify-between">
            <div className="w-2/5">
              <h1 className="flex items-center gap-2 text-purple-950 font-bold text-xl">
                <CircleCheck size={14} className="text-green-500" />
                REQUIREMENT DOCUMENTS
              </h1>
              <ul className="list-disc marker:text-pink-500 list-inside mt-2">
                {reqDocs.map((item, index) => (
                  <li key={index} className="text-gray-500 font-semibold mb-1">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-2/5">
              <h1 className="flex items-center gap-2 text-purple-950 font-bold text-xl">
                <Zap size={14} className="text-pink-500" />
                WHAT'S INCLUDED
              </h1>
              <ul className="list-disc marker:text-green-500 list-inside mt-2">
                {included.map((item, index) => (
                  <li key={index} className="text-gray-500 font-semibold mb-1">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* policy */}
      <div className="flex items-center w-full justify-between mt-8">
        <div className="shadow-xl shadow-gray-200 w-2/5 rounded-3xl bg-purple-950 p-10">
          <h1 className="flex items-center gap-2 text-white text-xl font-bold">
            <AlertCircle size={14} className="text-pink-500" />
            Policy
          </h1>
          <ul className="list-disc marker:text-gray-400 list-inside mt-2">
            {policies.map((item, index) => (
              <li
                key={index}
                className="text-gray-400 font-semibold text-sm mb-1"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="shadow-xl shadow-gray-200 w-2/5 rounded-3xl bg-white p-8">
          <h1 className="flex items-center gap-2 text-purple-950 text-xl font-bold">
            <CircleHelp size={14} className="text-pink-500" />
            Terms & Conditions
          </h1>
          <ul className="list-disc marker:text-gray-400 list-inside mt-2">
            {policies.map((item, index) => (
              <li
                key={index}
                className="text-gray-400 font-semibold text-sm mb-1"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPermit;
