import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { DynamicFaqItem } from "../assets/data/types";

interface FaqContextType {
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  toggleAdminMode: () => void;
  getFaqs: (
    targetType: "package" | "service" | "work-permit" | "general",
    targetId: string,
    defaultFaqs?: {
      question: string;
      questionNp?: string;
      answer: string;
      answerNp?: string;
      category?: string;
    }[]
  ) => DynamicFaqItem[];
  addFaq: (
    targetType: "package" | "service" | "work-permit" | "general",
    targetId: string,
    question: string,
    answer: string,
    category?: string
  ) => DynamicFaqItem;
  updateFaq: (id: string, question: string, answer: string, category?: string) => void;
  deleteFaq: (id: string) => void;
  resetFaqs: (targetType: string, targetId: string) => void;
}

const FaqContext = createContext<FaqContextType | undefined>(undefined);

const STORAGE_CUSTOM_KEY = "thtt_custom_faqs_v1";
const STORAGE_EDITED_KEY = "thtt_edited_faqs_v1";
const STORAGE_DELETED_KEY = "thtt_deleted_faqs_v1";
const STORAGE_ADMIN_KEY = "thtt_faq_admin_mode";

export const FaqProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Custom user-added FAQs
  const [customFaqs, setCustomFaqs] = useState<DynamicFaqItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Overridden/edited FAQs (mapped by id)
  const [editedFaqs, setEditedFaqs] = useState<Record<string, { question: string; answer: string; category?: string }>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_EDITED_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Set of deleted FAQ IDs (both default IDs and custom IDs)
  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DELETED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin toggle state
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_ADMIN_KEY) === "true";
    } catch {
      return false;
    }
  });

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(customFaqs));
    } catch (e) {
      console.error("Failed to save custom faqs", e);
    }
  }, [customFaqs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EDITED_KEY, JSON.stringify(editedFaqs));
    } catch (e) {
      console.error("Failed to save edited faqs", e);
    }
  }, [editedFaqs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DELETED_KEY, JSON.stringify(deletedIds));
    } catch (e) {
      console.error("Failed to save deleted faqs", e);
    }
  }, [deletedIds]);

  const toggleAdminMode = useCallback(() => {
    setIsAdminMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_ADMIN_KEY, String(next));
      } catch {}
      return next;
    });
  }, []);

  /**
   * Retrieves merged FAQs for a given targetType & targetId
   * (combines default mock FAQs + user-added FAQs - deleted FAQs + edits)
   */
  const getFaqs = useCallback(
    (
      targetType: "package" | "service" | "work-permit" | "general",
      targetId: string,
      defaultFaqs: {
        question: string;
        questionNp?: string;
        answer: string;
        answerNp?: string;
        category?: string;
      }[] = []
    ): DynamicFaqItem[] => {
      // 1. Convert default static FAQs to DynamicFaqItem with predictable deterministic IDs
      const normalizedDefaults: DynamicFaqItem[] = defaultFaqs.map((item, index) => {
        const id = `${targetType}_${targetId}_def_${index}`;
        return {
          id,
          targetType,
          targetId,
          question: item.question,
          questionNp: item.questionNp,
          answer: item.answer,
          answerNp: item.answerNp,
          category: item.category || "General",
        };
      });

      // 2. Filter out custom FAQs for this target
      const targetCustom = customFaqs.filter(
        (f) =>
          f.targetType === targetType &&
          f.targetId?.toLowerCase() === targetId?.toLowerCase()
      );

      // 3. Combine defaults + custom
      const combined = [...normalizedDefaults, ...targetCustom];

      // 4. Filter out deleted IDs and apply edits
      return combined
        .filter((f) => !deletedIds.includes(f.id))
        .map((f) => {
          if (editedFaqs[f.id]) {
            return {
              ...f,
              question: editedFaqs[f.id].question,
              answer: editedFaqs[f.id].answer,
              category: editedFaqs[f.id].category || f.category,
            };
          }
          return f;
        });
    },
    [customFaqs, editedFaqs, deletedIds]
  );

  /**
   * Dynamically add a new FAQ for a target
   */
  const addFaq = useCallback(
    (
      targetType: "package" | "service" | "work-permit" | "general",
      targetId: string,
      question: string,
      answer: string,
      category = "General"
    ): DynamicFaqItem => {
      const newFaq: DynamicFaqItem = {
        id: `dyn_${targetType}_${targetId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        targetType,
        targetId,
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim(),
        createdAt: new Date().toISOString(),
      };

      setCustomFaqs((prev) => [newFaq, ...prev]);
      return newFaq;
    },
    []
  );

  /**
   * Update an existing FAQ
   */
  const updateFaq = useCallback((id: string, question: string, answer: string, category?: string) => {
    // If it is in customFaqs, update directly
    setCustomFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, question, answer, category: category || f.category } : f))
    );

    // Also record in editedFaqs so default mock items can be edited
    setEditedFaqs((prev) => ({
      ...prev,
      [id]: { question, answer, category },
    }));
  }, []);

  /**
   * Delete an FAQ
   */
  const deleteFaq = useCallback((id: string) => {
    // Remove from custom list if it was a custom one
    setCustomFaqs((prev) => prev.filter((f) => f.id !== id));
    // Add to deletedIds set
    setDeletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  /**
   * Reset all FAQs for a specific target back to default
   */
  const resetFaqs = useCallback((targetType: string, targetId: string) => {
    // Remove custom faqs for this target
    setCustomFaqs((prev) =>
      prev.filter(
        (f) =>
          !(f.targetType === targetType && f.targetId.toLowerCase() === targetId.toLowerCase())
      )
    );

    // Clear deleted IDs and edits starting with the target prefix
    const prefix = `${targetType}_${targetId}_`;
    setDeletedIds((prev) => prev.filter((id) => !id.startsWith(prefix)));
    setEditedFaqs((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(prefix)) {
          delete next[key];
        }
      });
      return next;
    });
  }, []);

  return (
    <FaqContext.Provider
      value={{
        isAdminMode,
        setIsAdminMode,
        toggleAdminMode,
        getFaqs,
        addFaq,
        updateFaq,
        deleteFaq,
        resetFaqs,
      }}
    >
      {children}
    </FaqContext.Provider>
  );
};

export const useFaqs = () => {
  const context = useContext(FaqContext);
  if (!context) {
    throw new Error("useFaqs must be used within an FaqProvider");
  }
  return context;
};
