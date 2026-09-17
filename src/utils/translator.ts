/**
 * translator.ts
 * -------------------------------------------------------------
 * Utility to automatically translate English sentences into Nepali.
 * Uses Google Translate's public endpoint with fallback to MyMemory API,
 * backed by localStorage caching for instant zero-latency repeat loads.
 * -------------------------------------------------------------
 */

const CACHE_KEY = "thtt_en_ne_cache_v1";

// In-memory runtime cache for instantaneous lookups
const memoryCache = new Map<string, string>();
// In-flight promises to prevent duplicate simultaneous network requests
const inFlightRequests = new Map<string, Promise<string>>();

// Initialize cache from localStorage
try {
  const saved = localStorage.getItem(CACHE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.entries(parsed).forEach(([key, val]) => {
      if (typeof val === "string") {
        memoryCache.set(key, val);
      }
    });
  }
} catch {
  // Ignore localStorage parsing errors
}

// Persist memory cache to localStorage (debounced)
let saveTimeout: any = null;
const persistCache = () => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      const obj: Record<string, string> = {};
      // Keep only recent 500 entries to avoid hitting quota
      const entries = Array.from(memoryCache.entries()).slice(-500);
      entries.forEach(([k, v]) => {
        obj[k] = v;
      });
      localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
    } catch {
      // Ignore quota exceeded
    }
  }, 1000);
};

/**
 * Translate a single text string from English to Nepali
 */
export async function translateToNepali(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  // 1. Check memory / localStorage cache
  if (memoryCache.has(trimmed)) {
    return memoryCache.get(trimmed)!;
  }

  // 2. Return existing in-flight promise if one is already pending
  if (inFlightRequests.has(trimmed)) {
    return inFlightRequests.get(trimmed)!;
  }

  const fetchPromise = (async (): Promise<string> => {
    // Attempt 1: Google Translate endpoint
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ne&dt=t&q=${encodeURIComponent(
        trimmed
      )}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json) && Array.isArray(json[0])) {
          const result = json[0].map((item: any) => item[0] || "").join("");
          if (result && result.trim()) {
            memoryCache.set(trimmed, result.trim());
            persistCache();
            return result.trim();
          }
        }
      }
    } catch {
      // Fall through to fallback
    }

    // Attempt 2: MyMemory API Fallback
    try {
      const fallbackUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        trimmed
      )}&langpair=en|ne`;
      const res = await fetch(fallbackUrl);
      if (res.ok) {
        const json = await res.json();
        const translated = json?.responseData?.translatedText;
        if (translated && typeof translated === "string" && translated.trim()) {
          memoryCache.set(trimmed, translated.trim());
          persistCache();
          return translated.trim();
        }
      }
    } catch {
      // Failed both
    }

    return "";
  })();

  inFlightRequests.set(trimmed, fetchPromise);
  try {
    const result = await fetchPromise;
    return result;
  } finally {
    inFlightRequests.delete(trimmed);
  }
}

/**
 * Automatically translates any FAQ item if questionNp or answerNp are missing
 */
export async function translateFaqItem<
  T extends {
    question: string;
    answer: string;
    questionNp?: string;
    answerNp?: string;
  }
>(item: T): Promise<T> {
  const needsQuestion = !item.questionNp || !item.questionNp.trim();
  const needsAnswer = !item.answerNp || !item.answerNp.trim();

  if (!needsQuestion && !needsAnswer) {
    return item;
  }

  const [questionNp, answerNp] = await Promise.all([
    needsQuestion ? translateToNepali(item.question) : Promise.resolve(item.questionNp || ""),
    needsAnswer ? translateToNepali(item.answer) : Promise.resolve(item.answerNp || ""),
  ]);

  return {
    ...item,
    questionNp: questionNp || item.questionNp || "",
    answerNp: answerNp || item.answerNp || "",
  };
}

/**
 * Batch translates a list of FAQs
 */
export async function translateFaqList<
  T extends {
    question: string;
    answer: string;
    questionNp?: string;
    answerNp?: string;
  }
>(items: T[]): Promise<T[]> {
  return Promise.all(items.map((item) => translateFaqItem(item)));
}
