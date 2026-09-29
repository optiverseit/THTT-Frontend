import React from "react";
import { useOutletContext } from "react-router-dom";
import InsurancePricing from "./InsurancePricing";
import DynamicFaqSection from "../reusable/DynamicFaqSection";

interface FaqContextType {
  allfaqs?: any[];
  pkg: any;
}

const InsuranceFaq: React.FC = () => {
  const { allfaqs = [], pkg } = useOutletContext<FaqContextType>();

  const defaultInsuranceFaqs = [
    {
      question: `Does this policy cover high altitude helicopter rescue?`,
      answer: `Yes, this policy provides emergency helicopter search, rescue, and medical evacuation up to ${pkg.maxAltitude || "the designated altitude ceiling"} across the Everest, Annapurna, Langtang, and Manaslu regions.`,
    },
    {
      question: "Is hospital admission cashless in Kathmandu?",
      answer: "Yes, our insurer has direct cashless billing tie-ups with leading hospitals in Nepal including CIWEC Hospital, ERA International Hospital, and Swacon International Hospital.",
    },
    {
      question: "How quickly is the insurance policy issued?",
      answer: "Once you submit your passport details and trek itinerary, the official digital policy certificate is issued and emailed to you within 30 minutes.",
    },
    {
      question: "What happens if my trek gets delayed by bad weather?",
      answer: "You can easily extend your coverage duration online or via our 24/7 WhatsApp emergency desk before your initial policy period concludes.",
    },
    {
      question: "Does the policy cover lost luggage and flight cancellations?",
      answer: "Yes, our plans include allowances for baggage delay, loss of personal travel documents, and unexpected domestic flight cancellations due to weather.",
    },
  ];

  const faqs = allfaqs.length > 0 ? allfaqs : defaultInsuranceFaqs;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <DynamicFaqSection
            targetType="package"
            targetId={pkg.id || pkg.slug}
            defaultFaqs={faqs}
            title="Frequently Asked Questions"
            subtitle={`Everything you need to know about ${pkg.title}`}
          />
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-[220px] self-start space-y-6">
          <InsurancePricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default InsuranceFaq;
