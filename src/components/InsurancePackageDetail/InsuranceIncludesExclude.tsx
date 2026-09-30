import React from "react";
import { useOutletContext } from "react-router-dom";
import { Check, CheckCircle2, XCircle } from "lucide-react";

interface Prop {
  allIncludes?: string[];
  allExcludes?: string[];
}

const InsuranceIncludesExclude: React.FC = () => {
  const { allIncludes = [], allExcludes = [] } = useOutletContext<Prop>();

  const defaultIncludes = [
    "Emergency Helicopter Evacuation & High-Altitude Search & Rescue",
    "Cashless Inpatient Hospitalization in Kathmandu & Pokhara clinics",
    "Outpatient clinical consultations, prescription medicine & diagnostics",
    "COVID-19, Acute Mountain Sickness (AMS) & acute illness treatment",
    "Trip cancellation, curtailment & unexpected flight connection delays",
    "Baggage delay, lost passport replacement & personal document theft",
  ];

  const defaultExcludes = [
    "Pre-existing chronic medical conditions not declared during application",
    "Participation in unguided or unauthorized solo mountaineering above permitted zone",
    "Losses resulting from alcohol, drugs, or illegal substance intoxication",
    "Personal electronic gadgets (laptops, cameras) without supplementary riders",
  ];

  const includesList = allIncludes.length > 0 ? allIncludes : defaultIncludes;
  const excludesList = allExcludes.length > 0 ? allExcludes : defaultExcludes;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 sm:p-7 rounded-3xl shadow-sm space-y-4">
          <header className="flex items-center gap-2.5 pb-2 border-b border-white/20">
            <div className="p-1.5 bg-white text-emerald-600 rounded-lg shadow-sm">
              <CheckCircle2 size={18} />
            </div>
            <h3 className="text-xl font-black text-white">Covered Medical &amp; Rescue Benefits</h3>
          </header>
          <div className="space-y-2.5">
            {includesList.map((item, index) => (
              <div key={index} className="flex items-start gap-2 text-xs sm:text-sm font-medium leading-relaxed">
                <Check size={16} className="text-emerald-200 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#E91E63] to-rose-700 text-white p-6 sm:p-7 rounded-3xl shadow-sm space-y-4">
          <header className="flex items-center gap-2.5 pb-2 border-b border-white/20">
            <div className="p-1.5 bg-white text-[#E91E63] rounded-lg shadow-sm">
              <XCircle size={18} />
            </div>
            <h3 className="text-xl font-black text-white">Policy Exclusions &amp; Limitations</h3>
          </header>
          <div className="space-y-2.5">
            {excludesList.map((item, index) => (
              <div key={index} className="flex items-start gap-2 text-xs sm:text-sm font-medium leading-relaxed">
                <span className="text-rose-200 mt-0.5 flex-shrink-0 font-bold">✕</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceIncludesExclude;
