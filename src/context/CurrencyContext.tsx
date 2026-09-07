/**
 * CurrencyContext.tsx  (Global)
 * ----------------------------------------------------------------
 * A React Context that provides site-wide currency management:
 *   - "nepali"    -> display all prices in NPR (Nepalese Rupee)
 *   - "foreigner" -> display all prices in USD (US Dollar)
 *   - "inr"       -> display all prices in INR (Indian Rupee)
 *
 * Real-Time Rates:
 *  - Automatically fetches live exchange rates from open.er-api.com
 *  - Live 1 USD = ~151.09+ NPR (updated dynamically)
 *  - Live 1 INR = ~1.60 NPR (derived dynamically from USD rates)
 *  - Automatically re-fetches when window gains focus or on periodic intervals
 *  - Remembers user's selection in localStorage and sessionStorage
 *  - Listens to cross-tab storage events to keep open tabs in sync
 * ----------------------------------------------------------------
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// =============================================================================
// Types
// =============================================================================

/** The supported currency display modes across the site */
export type CurrencyMode = "nepali" | "foreigner" | "inr";

/** Shape of the context value exposed to all consumer components */
interface GlobalCurrencyContextValue {
  /** Currently active currency: "nepali" (NPR), "foreigner" (USD), or "inr" (INR) */
  selectedCurrency: CurrencyMode;

  /** Call to switch the currency globally across the site */
  setSelectedCurrency: (mode: CurrencyMode) => void;

  /** Live USD->NPR exchange rate (1 USD = N NPR, e.g. 151.09) */
  nprPerOneDollar: number;

  /** Live INR->NPR exchange rate (1 INR = N NPR, e.g. 1.60) */
  nprPerOneINR: number;

  /** True while the exchange rate is being fetched from the API */
  isRateLoading: boolean;

  /** True if the live rate fetch failed (using fallback rate instead) */
  rateLoadFailed: boolean;

  /** Convenience method: formats a base NPR price into the currently active currency */
  formatPrice: (priceInNPR: number) => string;
}

// =============================================================================
// Constants
// =============================================================================

/** Current fallback exchange rate: 1 USD = 151.09 NPR */
const FALLBACK_NPR_PER_USD = 151.09;

/** Fallback exchange rate: 1 INR = 1.60 NPR */
const FALLBACK_NPR_PER_INR = 1.60;

/** Free public exchange rate API endpoint */
const EXCHANGE_RATE_API_URL = "https://open.er-api.com/v6/latest/USD";

/** Primary storage key used for browser caching */
const CACHE_STORAGE_KEY = "thtt_selected_currency_mode";

// =============================================================================
// Storage Helper Functions (Handles localStorage & sessionStorage with safety)
// =============================================================================

/**
 * Reads the cached currency mode from localStorage, fallback to sessionStorage.
 * Default is "nepali".
 */
function getCachedCurrencyMode(): CurrencyMode {
  if (typeof window === "undefined") return "nepali";

  try {
    const localValue = localStorage.getItem(CACHE_STORAGE_KEY);
    if (localValue === "nepali" || localValue === "foreigner" || localValue === "inr") {
      return localValue;
    }
  } catch (error) {
    console.warn("[CurrencyContext] Could not read from localStorage:", error);
  }

  try {
    const sessionValue = sessionStorage.getItem(CACHE_STORAGE_KEY);
    if (sessionValue === "nepali" || sessionValue === "foreigner" || sessionValue === "inr") {
      return sessionValue;
    }
  } catch (error) {
    console.warn("[CurrencyContext] Could not read from sessionStorage:", error);
  }

  return "nepali";
}

/**
 * Saves the selected currency mode to both localStorage and sessionStorage.
 */
function setCachedCurrencyMode(mode: CurrencyMode): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CACHE_STORAGE_KEY, mode);
  } catch (error) {
    console.warn("[CurrencyContext] Could not write to localStorage:", error);
  }

  try {
    sessionStorage.setItem(CACHE_STORAGE_KEY, mode);
  } catch (error) {
    console.warn("[CurrencyContext] Could not write to sessionStorage:", error);
  }
}

// =============================================================================
// Context Creation
// =============================================================================

const GlobalCurrencyContext = createContext<GlobalCurrencyContextValue | undefined>(undefined);

// =============================================================================
// Provider Component
// =============================================================================

export const GlobalCurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state directly from the cached value
  const [selectedCurrency, setSelectedCurrencyState] = useState<CurrencyMode>(() => getCachedCurrencyMode());
  const [nprPerOneDollar, setNprPerOneDollar] = useState<number>(FALLBACK_NPR_PER_USD);
  const [nprPerOneINR, setNprPerOneINR] = useState<number>(FALLBACK_NPR_PER_INR);
  const [isRateLoading, setIsRateLoading] = useState<boolean>(false);
  const [rateLoadFailed, setRateLoadFailed] = useState<boolean>(false);

  /**
   * Updates state and caches the new value to localStorage & sessionStorage.
   */
  const setSelectedCurrency = useCallback((mode: CurrencyMode) => {
    setSelectedCurrencyState(mode);
    setCachedCurrencyMode(mode);
  }, []);

  /**
   * Cross-tab and window sync: if another tab or component changes the currency,
   * update state here as well.
   */
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === CACHE_STORAGE_KEY && event.newValue) {
        if (event.newValue === "nepali" || event.newValue === "foreigner" || event.newValue === "inr") {
          setSelectedCurrencyState(event.newValue);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /**
   * Fetch live exchange rate from API on mount, on window focus, and periodically
   */
  useEffect(() => {
    let isMounted = true;

    const fetchLiveExchangeRate = async (): Promise<void> => {
      setIsRateLoading(true);
      setRateLoadFailed(false);

      try {
        const response = await fetch(EXCHANGE_RATE_API_URL);

        if (!response.ok) {
          throw new Error(`API responded with HTTP ${response.status}`);
        }

        const data = await response.json();
        const liveNPRRate: number = data?.rates?.NPR;
        const liveINRRate: number = data?.rates?.INR;

        if (isMounted) {
          if (liveNPRRate && liveNPRRate > 0) {
            // Keep precise float rate for exact calculations
            setNprPerOneDollar(Number(liveNPRRate.toFixed(2)));

            if (liveINRRate && liveINRRate > 0) {
              const liveNprPerInr = liveNPRRate / liveINRRate;
              setNprPerOneINR(Number(liveNprPerInr.toFixed(4)));
            }
          } else {
            throw new Error("NPR rate is missing or zero.");
          }
        }
      } catch (error) {
        console.warn("[CurrencyContext] Exchange rate fetch failed, using fallback:", error);
        if (isMounted) {
          setNprPerOneDollar(FALLBACK_NPR_PER_USD);
          setNprPerOneINR(FALLBACK_NPR_PER_INR);
          setRateLoadFailed(true);
        }
      } finally {
        if (isMounted) {
          setIsRateLoading(false);
        }
      }
    };

    fetchLiveExchangeRate();

    // Re-fetch whenever user comes back to the browser tab
    const handleFocus = () => {
      fetchLiveExchangeRate();
    };
    window.addEventListener("focus", handleFocus);

    // Also refresh every 30 minutes for real-time accuracy
    const refreshInterval = setInterval(fetchLiveExchangeRate, 30 * 60 * 1000);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
      clearInterval(refreshInterval);
    };
  }, []);

  /**
   * Convenience formatting function bound to active currency state
   */
  const formatPrice = useCallback(
    (priceInNPR: number): string => {
      return displayPrice(priceInNPR, selectedCurrency, nprPerOneDollar, nprPerOneINR);
    },
    [selectedCurrency, nprPerOneDollar, nprPerOneINR]
  );

  const contextValue: GlobalCurrencyContextValue = {
    selectedCurrency,
    setSelectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
    isRateLoading,
    rateLoadFailed,
    formatPrice,
  };

  return (
    <GlobalCurrencyContext.Provider value={contextValue}>
      {children}
    </GlobalCurrencyContext.Provider>
  );
};

// =============================================================================
// Custom Hook
// =============================================================================

export const useGlobalCurrency = (): GlobalCurrencyContextValue => {
  const contextValue = useContext(GlobalCurrencyContext);

  if (!contextValue) {
    throw new Error(
      "[useGlobalCurrency] Must be used inside <GlobalCurrencyProvider>. " +
        "Wrap your <App> with <GlobalCurrencyProvider>."
    );
  }

  return contextValue;
};

// =============================================================================
// Exported Price Formatting Utilities
// =============================================================================

/**
 * Formats a numeric NPR amount as a display string.
 * @example formatNPR(11475) -> "NPR 11,475"
 */
export function formatNPR(amountInNPR: number): string {
  return `NPR ${Math.round(amountInNPR).toLocaleString("en-IN")}`;
}

/**
 * Formats a numeric USD amount as a display string.
 * @example formatUSD(85) -> "$85"
 */
export function formatUSD(amountInUSD: number): string {
  return `$${Math.round(amountInUSD).toLocaleString()}`;
}

/**
 * Formats a numeric INR amount as a display string.
 * @example formatINR(7172) -> "₹7,172"
 */
export function formatINR(amountInINR: number): string {
  return `₹${Math.round(amountInINR).toLocaleString("en-IN")}`;
}

/**
 * Given a base NPR price, formats it in the currently active currency.
 * - "nepali": NPR
 * - "inr": INR (converted by real-time nprPerINR)
 * - "foreigner": USD (converted by real-time nprPerDollar)
 */
export function displayPrice(
  priceInNPR: number,
  currency: CurrencyMode,
  nprPerDollar: number = FALLBACK_NPR_PER_USD,
  nprPerINR: number = FALLBACK_NPR_PER_INR
): string {
  if (currency === "nepali") {
    return formatNPR(priceInNPR);
  }
  if (currency === "inr") {
    const rate = nprPerINR && nprPerINR > 0 ? nprPerINR : FALLBACK_NPR_PER_INR;
    return formatINR(priceInNPR / rate);
  }
  const dollarRate = nprPerDollar && nprPerDollar > 0 ? nprPerDollar : FALLBACK_NPR_PER_USD;
  return formatUSD(priceInNPR / dollarRate);
}
