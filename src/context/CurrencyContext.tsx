/**
 * CurrencyContext.tsx  (Global)
 * ----------------------------------------------------------------
 * A React Context that provides site-wide currency management:
 *   - "nepali"    -> display all prices in NPR (Nepalese Rupee)
 *   - "foreigner" -> display all prices in USD (US Dollar)
 *
 * Persistence:
 *  - Stores selected currency in localStorage (and sessionStorage fallback)
 *    so the user''s selection is remembered across page reloads and when
 *    reopening the browser.
 *  - Listens to cross-tab storage events to keep open tabs in sync.
 *  - Fetches the live USD->NPR exchange rate on startup with fallback.
 * ----------------------------------------------------------------
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// =============================================================================
// Types
// =============================================================================

/** The two supported currency display modes across the site */
export type CurrencyMode = "nepali" | "foreigner";

/** Shape of the context value exposed to all consumer components */
interface GlobalCurrencyContextValue {
  /** Currently active currency: "nepali" (NPR) or "foreigner" (USD) */
  selectedCurrency: CurrencyMode;

  /** Call to switch the currency globally across the site */
  setSelectedCurrency: (mode: CurrencyMode) => void;

  /** Live USD->NPR exchange rate (1 USD = N NPR) */
  nprPerOneDollar: number;

  /** True while the exchange rate is being fetched from the API */
  isRateLoading: boolean;

  /** True if the live rate fetch failed (using fallback rate instead) */
  rateLoadFailed: boolean;
}

// =============================================================================
// Constants
// =============================================================================

/** Fallback exchange rate: 1 USD = 135 NPR */
const FALLBACK_NPR_PER_USD = 135;

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
    if (localValue === "nepali" || localValue === "foreigner") {
      return localValue;
    }
  } catch (error) {
    console.warn("[CurrencyContext] Could not read from localStorage:", error);
  }

  try {
    const sessionValue = sessionStorage.getItem(CACHE_STORAGE_KEY);
    if (sessionValue === "nepali" || sessionValue === "foreigner") {
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
        if (event.newValue === "nepali" || event.newValue === "foreigner") {
          setSelectedCurrencyState(event.newValue);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /**
   * Fetch live exchange rate from API on mount
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

        if (isMounted) {
          if (liveNPRRate && liveNPRRate > 0) {
            setNprPerOneDollar(Math.round(liveNPRRate));
          } else {
            throw new Error("NPR rate is missing or zero.");
          }
        }
      } catch (error) {
        console.warn("[CurrencyContext] Exchange rate fetch failed, using fallback:", error);
        if (isMounted) {
          setNprPerOneDollar(FALLBACK_NPR_PER_USD);
          setRateLoadFailed(true);
        }
      } finally {
        if (isMounted) {
          setIsRateLoading(false);
        }
      }
    };

    fetchLiveExchangeRate();

    return () => {
      isMounted = false;
    };
  }, []);

  const contextValue: GlobalCurrencyContextValue = {
    selectedCurrency,
    setSelectedCurrency,
    nprPerOneDollar,
    isRateLoading,
    rateLoadFailed,
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
 * Given a base NPR price, formats it in the currently active currency.
 */
export function displayPrice(
  priceInNPR: number,
  currency: CurrencyMode,
  nprPerDollar: number
): string {
  if (currency === "nepali") {
    return formatNPR(priceInNPR);
  }
  return formatUSD(priceInNPR / nprPerDollar);
}
