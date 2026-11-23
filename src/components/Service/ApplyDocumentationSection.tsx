import React from "react";
import { ShieldCheck, ArrowRight, FileCheck, Clock, Award, CheckCircle2 } from "lucide-react";

interface ApplyDocumentationSectionProps {
  onOpenApplyModal: () => void;
}

export const ApplyDocumentationSection: React.FC<ApplyDocumentationSectionProps> = ({
  onOpenApplyModal,
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2e1065] via-[#3b0764] to-[#1e1b4b] text-white p-6 sm:p-10 md:p-12 my-10 shadow-xl border border-purple-900/30">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-pink-300 text-xs font-black uppercase tracking-widest">
          <ShieldCheck size={14} className="text-pink-400" />
          <span>Fast-Track Legal &amp; Embassy Clearance</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
          Apply for Official Document Attestation &amp; Verification
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-purple-200/90 max-w-2xl mx-auto font-medium leading-relaxed">
          Submit police clearance dossiers, MoFA attestations, relationship verifications, or fast-track e-passports online with zero hassle. Supported formats: PDF, JPG, PNG.
        </p>

        {/* 3 Steps Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-left">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center font-black text-sm mb-2.5">
              1
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Select Service &amp; Upload</h4>
            <p className="text-[11px] text-purple-200/80 leading-relaxed">
              Choose your clearance type and attach scans of your ID and documents in PDF or JPG format.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-black text-sm mb-2.5">
              2
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Confirm with Pay Later</h4>
            <p className="text-[11px] text-purple-200/80 leading-relaxed">
              No immediate online payment needed. Settle fees via cash at office or bank transfer after initial review.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black text-sm mb-2.5">
              3
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Fast Processing &amp; Courier</h4>
            <p className="text-[11px] text-purple-200/80 leading-relaxed">
              Receive live WhatsApp progress notifications and door-to-door courier delivery upon clearance.
            </p>
          </div>
        </div>

        {/* Call To Action Button */}
        <div className="pt-3">
          <button
            type="button"
            onClick={onOpenApplyModal}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E91E63] to-pink-600 hover:from-pink-600 hover:to-[#E91E63] text-white font-bold text-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <span>Apply for Documentation Clearance</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ApplyDocumentationSection;
