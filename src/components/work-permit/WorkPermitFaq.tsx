
import React from "react";
import DynamicFaqSection from "../reuseable/DynamicFaqSection";

const defaultWorkPermitFaqs = [
  {
    question: "What documents are required for a Foreign Employment Work Permit (Shram Swikriti)?",
    answer:
      "You need a valid passport (minimum 6 months validity), verified employment offer letter/contract, entry visa or visa approval from the destination embassy, medical clearance certificate from an accredited clinic, mandatory foreign employment term life insurance policy, and proof of contribution to the Foreign Employment Welfare Fund.",
    category: "Requirements",
  },
  {
    question: "How long does it take to receive labor approval through the online FEIMS portal?",
    answer:
      "Standard processing through the Department of Foreign Employment (DoFE) FEIMS portal typically takes 2 to 4 working days once all biometric records, insurance slips, and verified contracts are submitted.",
    category: "Processing Time",
  },
  {
    question: "Can I renew my work permit online while staying abroad (Punar Shram)?",
    answer:
      "Yes! The Government of Nepal allows online renewal of labor approvals (Punar Shram) directly through the FEIMS portal from anywhere in the world, provided your foreign employer contract, insurance, and welfare fund payments are current.",
    category: "Renewal",
  },
  {
    question: "Is pre-departure orientation training mandatory for first-time applicants?",
    answer:
      "Yes, first-time labor migrants must complete a 2-day certified Pre-Departure Orientation (PDO) training session approved by the Foreign Employment Board before final labor approval can be released.",
    category: "Training",
  },
  {
    question: "Does Trip Himalaya assist with the entire end-to-end documentation?",
    answer:
      "Yes, our specialized foreign employment desk assists with employer contract authentication, medical appointment booking, term life insurance issuance, welfare fund deposit, FEIMS online application filing, and biometric appointment coordination.",
    category: "Services",
  },
];

const WorkPermitFaq: React.FC = () => {
  return (
    <div className="flex justify-center w-full">
      <section className="mt-8 w-full p-4 sm:p-8 max-w-6xl">
        <DynamicFaqSection
          targetType="work-permit"
          targetId="work-permit-main"
          defaultFaqs={defaultWorkPermitFaqs}
          title="Work Permit & Labor Approval FAQs"
          subtitle="Clear answers on DoFE regulations, FEIMS processing, and required documents"
        />
      </section>
    </div>
  );
};

export default WorkPermitFaq;
