import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  ShieldCheck,
  FileText,
  MessageCircle,
  Phone,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { visaDetails } from "../data/mockData";

const VisaDetailPage: React.FC = () => {
  const { countryId } = useParams();
  const navigate = useNavigate();

  const visa = visaDetails[countryId as keyof typeof visaDetails];

  if (!visa) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-3xl font-black text-[#2D1347] mb-4">
            Visa Not Found
          </h2>
          <button
            onClick={() => navigate("/visa-services")}
            className="bg-[#D92671] text-white px-8 py-3 rounded-full font-black uppercase text-xs"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* HERO */}
      <section className="relative h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={visa.heroImage}
            alt={visa.name}
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/40 to-slate-50" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <span className="inline-block bg-[#D92671] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.4em] mb-6 shadow-xl border border-white/10">
            {visa.flag} Destination Visa
          </span>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
            {visa.name}
          </h1>

          <div className="h-1.5 w-24 bg-[#D92671] mx-auto rounded-full mb-6 shadow-lg" />

          <p className="text-white/80 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg italic">
            Validity: {visa.validity}
          </p>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-16">

          <div>
            <h2 className="text-4xl font-black text-[#2D1347] mb-6">
              Overview
            </h2>

            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              {visa.overview}
            </p>

            <div className="flex items-center gap-6 text-sm font-bold">
              <div className="flex items-center gap-2 text-[#D92671]">
                <Clock size={18} />
                Processing: {visa.processingTime}
              </div>

              <div className="flex items-center gap-2 text-[#2D1347]">
                <ShieldCheck size={18} />
                High Approval Rate
              </div>
            </div>
          </div>

          {/* REQUIREMENTS */}
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
            <h3 className="text-2xl font-black text-[#2D1347] mb-6">
              Required Documents
            </h3>

            <ul className="space-y-4">
              {visa.requirements.map((req, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm font-semibold text-slate-600"
                >
                  <CheckCircle2
                    size={18}
                    className="text-[#D92671] mt-0.5"
                  />
                  {req}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#D92671] to-[#E91E63] py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="text-center md:text-left max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Ready to Apply?
            </h2>
            <p className="text-white/90 font-bold text-lg">
              Talk to our visa experts for guidance.
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-6">
            <a
              href="https://wa.me/9779800000000"
              className="bg-white text-[#D92671] px-12 py-5 rounded-full font-black tracking-widest hover:bg-slate-50 transition-all shadow-2xl uppercase text-[11px] flex items-center gap-3"
            >
              <MessageCircle size={18} />
              WhatsApp Inquiry
            </a>

            <a
              href="tel:+97714240000"
              className="bg-[#2D1347] text-white px-12 py-5 rounded-full font-black tracking-widest hover:brightness-125 transition-all shadow-2xl uppercase text-[11px] flex items-center gap-3"
            >
              <Phone size={18} />
              Call Now
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default VisaDetailPage;
