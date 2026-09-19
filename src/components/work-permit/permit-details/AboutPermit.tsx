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
    "Valid Job Offer Letter/Visa Copy",
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
    "Non-Refundable Govt. & Welfare Fees (Once deposited into FEIMS portal)",
    "FEO & Embassy Document Verification Mandatory",
    "Self-Declaration of Overseas Contract & Job Terms Required",
    "Biometric Verification in DOFE National Database",
  ];

  const terms = [
    "Applicant must be minimum 18 years of age with valid passport",
    "Passport must have at least 6 months validity from departure date",
    "GAMCA / DOFE approved medical fitness report required",
    "Pre-departure orientation certificate required for first-time workers",
  ];



  return (
    <div className="col-span-1 lg:col-span-2">
      <div className="rounded-2xl sm:rounded-3xl bg-white shadow-xl shadow-gray-300">
        <div className="p-5 sm:p-8 md:p-10">
          <div>
            <header className="flex items-center gap-2">
              <FileText size={18} className="text-pink-500" />
              <p className="text-purple-950 text-lg sm:text-xl font-bold mb-2">
                About {country.name} Permit
              </p>
            </header>

            <p className="text-gray-500 font-semibold py-2 sm:py-4 mb-4 sm:mb-6 text-sm sm:text-base">
              Processing a work permit for {country.name} requires a careful
              documentation and adherence to both the destination country's
              labour laws and the Nepal government's Shram rules. Our team
              ensures your file is complete and submitted to the Foreign
              Employment Office {`(FEO)`} correctly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full justify-between gap-6">
            <div className="w-full sm:w-[48%]">
              <h1 className="flex items-center gap-2 text-purple-950 font-bold text-base sm:text-xl">
                <CircleCheck size={16} className="text-green-500 flex-shrink-0" />
                REQUIREMENT DOCUMENTS
              </h1>
              <ul className="list-disc marker:text-pink-500 list-inside mt-2">
                {reqDocs.map((item, index) => (
                  <li key={index} className="text-gray-500 font-semibold mb-1 text-sm sm:text-base">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full sm:w-[48%]">
              <h1 className="flex items-center gap-2 text-purple-950 font-bold text-base sm:text-xl">
                <Zap size={16} className="text-pink-500 flex-shrink-0" />
                WHAT'S INCLUDED
              </h1>
              <ul className="list-disc marker:text-green-500 list-inside mt-2">
                {included.map((item, index) => (
                  <li key={index} className="text-gray-500 font-semibold mb-1 text-sm sm:text-base">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* policy */}
      <div className="flex flex-col sm:flex-row items-stretch w-full justify-between gap-6 mt-6 sm:mt-8">
        <div className="shadow-xl shadow-gray-200 w-full sm:w-[48%] rounded-2xl sm:rounded-3xl bg-purple-950 p-6 sm:p-8 md:p-10">
          <h1 className="flex items-center gap-2 text-white text-lg sm:text-xl font-bold">
            <AlertCircle size={16} className="text-pink-500 flex-shrink-0" />
            Policy
          </h1>
          <ul className="list-disc marker:text-gray-400 list-inside mt-2">
            {policies.map((item, index) => (
              <li
                key={index}
                className="text-gray-400 font-semibold text-xs sm:text-sm mb-1"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="shadow-xl shadow-gray-200 w-full sm:w-[48%] rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-8">
          <h1 className="flex items-center gap-2 text-purple-950 text-lg sm:text-xl font-bold">
            <CircleHelp size={16} className="text-pink-500 flex-shrink-0" />
            Terms &amp; Conditions
          </h1>
          <ul className="list-disc marker:text-gray-400 list-inside mt-2">
            {terms.map((item, index) => (
              <li
                key={index}
                className="text-gray-600 font-semibold text-xs sm:text-sm mb-1.5 leading-relaxed"
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
