import React, { useState, useEffect, useRef } from "react";
import { HelpCircle, ChevronDown, Globe } from "lucide-react";
import { useFaqs } from "../../context/FaqContext";
import type { DynamicFaqItem } from "../../assets/data/types";
import { translateFaqList } from "../../utils/translator";

interface DynamicFaqSectionProps {
  targetType: "package" | "service" | "work-permit" | "general";
  targetId: string;
  defaultFaqs?: {
    question?: string;
    q?: string;
    questionNp?: string;
    qNp?: string;
    answer?: string;
    a?: string;
    answerNp?: string;
    aNp?: string;
    category?: string;
  }[];
  title?: string;
  subtitle?: string;
  className?: string;
}

type TranslatedFaq = DynamicFaqItem & {
  questionNp?: string;
  answerNp?: string;
};

const DynamicFaqSection: React.FC<DynamicFaqSectionProps> = ({
  targetType,
  targetId,
  defaultFaqs = [],
  title = "Frequently Asked Questions",
  subtitle = "Common questions answered by our specialists",
  className = "",
}) => {
  const { getFaqs } = useFaqs();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [translatedFaqs, setTranslatedFaqs] = useState<TranslatedFaq[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const prevTargetRef = useRef<string>("");

  // Normalize defaultFaqs if passed with {q, a} or {question, answer} or {qNp, aNp}
  const normalizedDefaults = defaultFaqs.map((f) => ({
    question: f.question || f.q || "",
    questionNp: f.questionNp || f.qNp || "",
    answer: f.answer || f.a || "",
    answerNp: f.answerNp || f.aNp || "",
    category: f.category || "General",
  }));

  // Retrieve current active FAQs for this target
  const allFaqs = getFaqs(targetType, targetId, normalizedDefaults);

  // Auto-translate any FAQ missing Nepali fields
  useEffect(() => {
    const currentKey = `${targetType}_${targetId}_${allFaqs.length}`;
    if (prevTargetRef.current === currentKey && translatedFaqs.length === allFaqs.length) return;
    prevTargetRef.current = currentKey;

    // If all FAQs already have Nepali, skip translation
    const needsTranslation = allFaqs.some(
      (f) => !f.questionNp?.trim() || !f.answerNp?.trim()
    );

    if (!needsTranslation) {
      setTranslatedFaqs(allFaqs as TranslatedFaq[]);
      return;
    }

    // Set initial state with whatever we have so UI is not blank
    setTranslatedFaqs(allFaqs as TranslatedFaq[]);
    setIsTranslating(true);

    translateFaqList(allFaqs).then((results) => {
      setTranslatedFaqs(results as TranslatedFaq[]);
      setIsTranslating(false);
    });
  }, [allFaqs, targetType, targetId]);

  const displayFaqs = translatedFaqs.length > 0 ? translatedFaqs : allFaqs;

  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 ${className}`}>
      {/* ── HEADER ── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-pink-50 text-[#E11D48]">
          <HelpCircle size={22} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {/* Translation indicator */}
        {isTranslating && (
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium animate-pulse">
            <Globe size={12} className="text-[#E11D48]" />
            <span>Translating…</span>
          </div>
        )}
      </div>

      {/* ── ACCORDION LIST ── */}
      <div className="space-y-3">
        {displayFaqs.map((faq, index) => {
          const isOpen = openIdx === index;
          return (
            <div key={faq.id || index} className="border border-gray-100 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : index)}
                className="w-full p-4 sm:p-4.5 text-left flex items-center justify-between gap-3.5 font-bold text-xs sm:text-[13px] text-[#2D1347] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex flex-col gap-0.5">
                  {/* English question */}
                  <span>{faq.question}</span>
                  {/* Nepali question — auto-translated or manual */}
                  {faq.questionNp && (
                    <span className="text-[11px] font-medium text-gray-400">
                      {faq.questionNp}
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? "rotate-180 text-[#E11D48]" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 sm:px-4.5 pb-4 bg-gray-50/50 border-t border-gray-100 pt-2.5 space-y-2">
                  {/* English answer */}
                  <p className="text-xs sm:text-[12.5px] text-gray-600 font-medium leading-relaxed">
                    {faq.answer}
                  </p>
                  {/* Nepali answer — auto-translated or manual */}
                  {faq.answerNp && (
                    <div className="border-t border-gray-100 pt-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Globe size={10} className="text-[#E11D48]" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                          नेपाली
                        </span>
                      </div>
                      <p className="text-xs sm:text-[12px] text-gray-400 font-medium leading-relaxed">
                        {faq.answerNp}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DynamicFaqSection;
