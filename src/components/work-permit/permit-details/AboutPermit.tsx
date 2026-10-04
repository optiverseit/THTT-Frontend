import {
  AlertCircle,
  CircleCheck,
  CircleHelp,
  FileText,
  Zap,
} from "lucide-react";
import { DEFAULT_WORK_PERMIT_TYPES, type WorkPermitType } from "./mockPermitData";

interface CountryProps {
  id: number;
  country_code: string;
  country_name: string;
  iso_2: string;
  flag_code: string;
  short_description: string;
  processing_days: number;
  status: string;
  display_order: number;
}

interface AboutPermitProps {
  id?: string;
  country: CountryProps;
  /** Driven by CostDetails permit type selector — synced via parent state */
  selectedPermitType?: WorkPermitType;
  /** Notify parent when a permit type row is clicked here */
  onPermitTypeChange?: (permitType: WorkPermitType) => void;
}

const AboutPermit = ({ country, selectedPermitType, onPermitTypeChange }: AboutPermitProps) => {
  // Permit types list: mock data for now; replace with API response later.
  // When API is ready, fetch permit types here and store in state.
  const permitTypes = DEFAULT_WORK_PERMIT_TYPES;

  // Resolve which permit type is currently active
  const activePermitType = selectedPermitType ?? permitTypes[0];

  // Documents for the currently active permit type
  const activeDocs: string[] =
    (activePermitType?.documents ?? []).map((doc) =>
      typeof doc === "string" ? doc : doc.title
    );

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
                About {country.country_name} Permit
              </p>
            </header>

            <p className="text-gray-500 font-semibold py-2 sm:py-4 mb-4 sm:mb-6 text-sm sm:text-base">
              {country.short_description || "No description available."}
            </p>
          </div>

          {/* REQUIREMENT DOCUMENTS + WHAT'S INCLUDED */}
          <div className="space-y-5">

            {/* ── TOP ROW: Labels (left) | Required docs (right) ── */}
            <div>
              <h1 className="flex items-center gap-2 text-purple-950 font-bold text-base sm:text-xl mb-3">
                <CircleCheck size={16} className="text-green-500 flex-shrink-0" />
                REQUIREMENT DOCUMENTS
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                {/* LEFT: permit type selector — shrinks to content */}
                {/* Mock data: swap DEFAULT_WORK_PERMIT_TYPES with API array when ready */}
                <div className="flex-shrink-0 space-y-2">
                  {permitTypes.map((pt) => {
                    const isActive = activePermitType?.id === pt.id;
                    return (
                      <div
                        key={pt.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => onPermitTypeChange?.(pt)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") onPermitTypeChange?.(pt);
                        }}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer select-none w-fit ${
                          isActive
                            ? "border-[#E91E63] bg-pink-50/40 ring-1 ring-[#E91E63]"
                            : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full flex-shrink-0 transition-all ${
                            isActive
                              ? "bg-[#E91E63] shadow shadow-pink-400/40"
                              : "bg-gray-200 border border-gray-300"
                          }`}
                        />
                        <p className="text-xs font-black text-[#200B3B] capitalize whitespace-nowrap">{pt.name}</p>
                      </div>
                    );
                  })}
                </div>

                {/* RIGHT: document list — fills remaining space */}
                <div className="flex-1 min-w-0">
                  <ul className="list-disc marker:text-pink-500 list-inside">
                    {activeDocs.length > 0 ? (
                      activeDocs.map((item, index) => (
                        <li
                          key={index}
                          className="text-gray-500 font-semibold mb-1 text-sm sm:text-base"
                        >
                          {item}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 text-sm italic">
                        No documents listed for this permit type.
                      </li>
                    )}
                  </ul>
                </div>

              </div>
            </div>

            {/* ── BOTTOM ROW: What's Included — full width ── */}
            <div className="pt-2 border-t border-gray-100">
              <h1 className="flex items-center gap-2 text-purple-950 font-bold text-base sm:text-xl mb-2">
                <Zap size={16} className="text-pink-500 flex-shrink-0" />
                WHAT'S INCLUDED
              </h1>
              <ul className="list-disc marker:text-green-500 list-inside">
                {included.map((item, index) => (
                  <li
                    key={index}
                    className="text-gray-500 font-semibold mb-1 text-sm sm:text-base"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </div>

      {/* POLICY */}
      <div className="flex flex-col sm:flex-row items-stretch w-full justify-between gap-6 mt-6 sm:mt-8">
        <div className="shadow-xl shadow-gray-200 w-full sm:w-[48%] rounded-2xl sm:rounded-3xl bg-purple-950 p-6 sm:p-8 md:p-10">
          <h1 className="flex items-center gap-2 text-white text-lg sm:text-xl font-bold">
            <AlertCircle
              size={16}
              className="text-pink-500 flex-shrink-0"
            />
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
            <CircleHelp
              size={16}
              className="text-pink-500 flex-shrink-0"
            />
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