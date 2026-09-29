import React from "react";
import { useOutletContext } from "react-router-dom";
import VisaPricing from "./VisaPricing";
import DynamicFaqSection from "../reusable/DynamicFaqSection";

interface FaqContextType {
  allfaqs?: any[];
  pkg: any;
}

const VisaFaq: React.FC = () => {
  const { allfaqs = [], pkg } = useOutletContext<FaqContextType>();

  const defaultVisaFaqs = [
    {
      question: `How long does the ${pkg.title || "visa"} processing take?`,
      answer: `Processing usually takes ${pkg.duration || "5 to 7 working days"} from the date of submission at the Embassy or VFS Global center. Urgent or express processing may be requested for eligible destinations.`,
    },
    {
      question: "Can Trip Himalaya guarantee that my visa will be approved?",
      answer: "No agency or agent can guarantee visa approval, as the final decision rests exclusively with the consular officer. However, our 98%+ approval track record ensures your file is verified with zero errors and meets every diplomatic requirement.",
    },
    {
      question: "Do I need to visit the Embassy personally?",
      answer: "Depending on the destination, first-time applicants or countries requiring biometrics (such as Schengen, UK, USA) require personal attendance for fingerprinting. For e-visas and sticker drop-box countries, we handle the entire process without you visiting.",
    },
    {
      question: "What financial balance should I show in my bank statement?",
      answer: "Generally, a minimum running balance sufficient to cover your entire round-trip airfare, accommodation, and daily expenses ($100-$150/day) over the last 3-6 months is required. We provide personalized financial calculation support.",
    },
    {
      question: "Are flight bookings and hotel vouchers included in your service?",
      answer: "Yes, we provide official verifiable flight itinerary reservations and confirmed hotel bookings required for embassy evaluation at no additional cost.",
    },
  ];

  const faqs = allfaqs.length > 0 ? allfaqs : defaultVisaFaqs;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <DynamicFaqSection
            targetType="package"
            targetId={pkg.id || pkg.slug}
            defaultFaqs={faqs}
            title="Frequently Asked Questions"
            subtitle={`Everything you need to know about ${pkg.title} assistance`}
          />
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-[220px] self-start space-y-6">
          <VisaPricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default VisaFaq;
