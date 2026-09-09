
import React from "react";
import DynamicFaqSection from "../reuseable/DynamicFaqSection";

const defaultWorkPermitFaqs = [
  {
    question: "What documents are required for a Foreign Employment Work Permit (Shram Swikriti)?",
    questionNp: "वैदेशिक रोजगार श्रम स्वीकृतिका लागि कुन-कुन कागजातहरू आवश्यक पर्छन्?",
    answer:
      "You need a valid passport (minimum 6 months validity), verified employment offer letter/contract, entry visa or visa approval from the destination embassy, medical clearance certificate from an accredited clinic, mandatory foreign employment term life insurance policy, and proof of contribution to the Foreign Employment Welfare Fund.",
    answerNp:
      "तपाईंलाई वैध राहदानी (कम्तीमा ६ महिनाको म्याद), प्रमाणीकृत रोजगार सम्झौता पत्र, गन्तव्य दूतावासको प्रवेश भिसा वा भिसा स्वीकृति, मान्यता प्राप्त क्लिनिकको मेडिकल क्लियरेन्स प्रमाणपत्र, अनिवार्य वैदेशिक रोजगार म्यादी जीवन बीमा, र वैदेशिक रोजगार कल्याणकारी कोषमा योगदानको प्रमाण आवश्यक पर्दछ।",
    category: "Requirements",
  },
  {
    question: "How long does it take to receive labor approval through the online FEIMS portal?",
    questionNp: "अनलाइन FEIMS पोर्टल मार्फत श्रम स्वीकृति प्राप्त गर्न कति समय लाग्छ?",
    answer:
      "Standard processing through the Department of Foreign Employment (DoFE) FEIMS portal typically takes 2 to 4 working days once all biometric records, insurance slips, and verified contracts are submitted.",
    answerNp:
      "सबै बायोमेट्रिक रेकर्ड, बीमा रसिद, र प्रमाणीकृत सम्झौता पत्रहरू पेश गरिसकेपछि वैदेशिक रोजगार विभाग (DoFE) को FEIMS पोर्टल मार्फत सामान्यतया २ देखि ४ कार्यदिन लाग्दछ।",
    category: "Processing Time",
  },
  {
    question: "Can I renew my work permit online while staying abroad (Punar Shram)?",
    questionNp: "के विदेशमै रहेर अनलाइनबाट पुन: श्रम स्वीकृति (रिन्यु) गर्न सकिन्छ?",
    answer:
      "Yes! The Government of Nepal allows online renewal of labor approvals (Punar Shram) directly through the FEIMS portal from anywhere in the world, provided your foreign employer contract, insurance, and welfare fund payments are current.",
    answerNp:
      "हो! नेपाल सरकारले तपाईंको विदेशी रोजगारदाताको सम्झौता, बीमा र कल्याणकारी कोषको भुक्तानी अद्यावधिक भएसम्म संसारको जुनसुकै स्थानबाट सिधै FEIMS पोर्टल मार्फत अनलाइन पुन: श्रम स्वीकृतिको अनुमति दिएको छ।",
    category: "Renewal",
  },
  {
    question: "Is pre-departure orientation training mandatory for first-time applicants?",
    questionNp: "पहिलो पटक आवेदन दिनेहरूका लागि पूर्व-प्रस्थान अभिमुखीकरण (PDO) तालिम अनिवार्य छ?",
    answer:
      "Yes, first-time labor migrants must complete a 2-day certified Pre-Departure Orientation (PDO) training session approved by the Foreign Employment Board before final labor approval can be released.",
    answerNp:
      "हो, पहिलो पटक वैदेशिक रोजगारमा जाने श्रमिकहरूले अन्तिम श्रम स्वीकृति प्राप्त गर्नुअघि वैदेशिक रोजगार बोर्डबाट मान्यता प्राप्त २ दिने पूर्व-प्रस्थान अभिमुखीकरण (PDO) तालिम पूरा गर्नुपर्दछ।",
    category: "Training",
  },
  {
    question: "Does Trip Himalaya assist with the entire end-to-end documentation?",
    questionNp: "के ट्रिप हिमालयले सुरुदेखि अन्त्यसम्मका सबै कागजात प्रक्रियामा सहयोग गर्दछ?",
    answer:
      "Yes, our specialized foreign employment desk assists with employer contract authentication, medical appointment booking, term life insurance issuance, welfare fund deposit, FEIMS online application filing, and biometric appointment coordination.",
    answerNp:
      "हो, हाम्रो विशेष वैदेशिक रोजगार डेस्कले रोजगारदाता सम्झौता प्रमाणीकरण, मेडिकल अपोइन्टमेन्ट बुकिङ, म्यादी जीवन बीमा जारी, कल्याणकारी कोष दाखिला, FEIMS अनलाइन फारम भर्ने र बायोमेट्रिक समन्वयमा पूर्ण सहयोग गर्दछ।",
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
