import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Globe,
  RefreshCw,
  FilePlus,
  FileText,
  ShieldCheck,
  ArrowRight,
  Search,
  X,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useNavigate } from "react-router-dom";
import { formatDescription } from "../../utils/formatDescription";

interface Country {
  id: number;
  country_code: string;
  country_name: string;
  iso_2: string;
  flag_code: string;
  short_description: string;
  processing_days: number;
  status: string;
  display_order: number;
}

export interface PermitServiceItem {
  country: Country;
  permit_type: string;
}

interface PermitServicesProps {
  permitServices?: PermitServiceItem[];
  filterCountryId?: string;
  filterPermitType?: string;
  onClearFilter?: () => void;
  isLoading?: boolean;
}

const PERMIT_TYPE_LABELS: Record<string, string> = {
  NEW_LABOUR_PERMIT: "New Work Permit",
  RENEWAL_PERMIT: "Renewal Permit",
  INDIVIDUAL_PERMIT: "Individual Permit",
  LEGALIZATION_ATTESTATION: "Legalization / Attestation",
};

const FILTER_TO_API_TYPE: Record<string, string> = {
  new: "NEW_LABOUR_PERMIT",
  renew: "RENEWAL_PERMIT",
  individual: "INDIVIDUAL_PERMIT",
  legalization: "LEGALIZATION_ATTESTATION",
};

const getPermitTypeConfig = (permitType: string) => {
  switch (permitType) {
    case "NEW_LABOUR_PERMIT":
      return {
        label: "New Work Permit",
        icon: FilePlus,
        badgeStyle:
          "bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-emerald-500/5",
      };
    case "RENEWAL_PERMIT":
      return {
        label: "Renewal Permit",
        icon: RefreshCw,
        badgeStyle:
          "bg-purple-50 text-purple-700 border-purple-200/80 shadow-purple-500/5",
      };
    case "INDIVIDUAL_PERMIT":
      return {
        label: "Individual Permit",
        icon: FileText,
        badgeStyle:
          "bg-amber-50 text-amber-800 border-amber-200/80 shadow-amber-500/5",
      };
    case "LEGALIZATION_ATTESTATION":
      return {
        label: "Legalization / Attestation",
        icon: ShieldCheck,
        badgeStyle:
          "bg-sky-50 text-sky-700 border-sky-200/80 shadow-sky-500/5",
      };
    default:
      return {
        label: PERMIT_TYPE_LABELS[permitType] ?? permitType,
        icon: FileText,
        badgeStyle:
          "bg-purple-50 text-purple-700 border-purple-200/80 shadow-purple-500/5",
      };
  }
};

const ITEMS_PER_PAGE = 12;

const CORE_PERMIT_TABS: Array<{ id: string; label: string }> = [
  { id: "all", label: "All" },
  { id: "NEW_LABOUR_PERMIT", label: "New Work Permit" },
  { id: "RENEWAL_PERMIT", label: "Renewal Permit" },
  { id: "INDIVIDUAL_PERMIT", label: "Individual Permit" },
];

const stripHtmlTags = (html?: string | null): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
};

const matchesCountryAliases = (country: Country, query: string): boolean => {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  const name = (country.country_name || "").toLowerCase();
  const code = (country.country_code || "").toLowerCase();
  const iso2 = (country.iso_2 || "").toLowerCase();
  const flag = (country.flag_code || "").toLowerCase();

  const isUae =
    name.includes("uae") ||
    name.includes("emirates") ||
    name.includes("dubai") ||
    code === "ae" ||
    iso2 === "ae" ||
    flag === "ae";
  if (
    isUae &&
    (q === "uae" ||
      q === "ae" ||
      q.includes("dubai") ||
      q.includes("abu dhabi") ||
      q.includes("emirates"))
  ) {
    return true;
  }

  const isSaudi =
    name.includes("saudi") ||
    name.includes("ksa") ||
    code === "sa" ||
    iso2 === "sa" ||
    flag === "sa";
  if (
    isSaudi &&
    (q === "ksa" ||
      q === "sa" ||
      q.includes("saudi") ||
      q.includes("riyadh") ||
      q.includes("jeddah"))
  ) {
    return true;
  }

  const isQatar =
    name.includes("qatar") || code === "qa" || iso2 === "qa" || flag === "qa";
  if (isQatar && (q === "qa" || q.includes("qatar") || q.includes("doha"))) {
    return true;
  }

  const isUk =
    name.includes("uk") ||
    name.includes("united kingdom") ||
    name.includes("britain") ||
    code === "gb" ||
    iso2 === "gb" ||
    flag === "gb";
  if (
    isUk &&
    (q === "uk" ||
      q === "gb" ||
      q.includes("united kingdom") ||
      q.includes("britain") ||
      q.includes("england") ||
      q.includes("london"))
  ) {
    return true;
  }

  const isUsa =
    name.includes("usa") ||
    name.includes("united states") ||
    name.includes("america") ||
    code === "us" ||
    iso2 === "us" ||
    flag === "us";
  if (
    isUsa &&
    (q === "usa" ||
      q === "us" ||
      q.includes("united states") ||
      q.includes("america"))
  ) {
    return true;
  }

  const isSouthKorea =
    name.includes("korea") || code === "kr" || iso2 === "kr" || flag === "kr";
  if (
    isSouthKorea &&
    (q === "kr" || q.includes("korea") || q.includes("seoul"))
  ) {
    return true;
  }

  return false;
};

const matchesWorkPermitSearch = (
  item: PermitServiceItem,
  query: string
): boolean => {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const { country, permit_type } = item;
  const permitLabel = getPermitTypeConfig(permit_type).label;
  const cleanDescription = stripHtmlTags(country.short_description);
  const processingText = country.processing_days
    ? `${country.processing_days} days working days`
    : "";

  if (matchesCountryAliases(country, q)) return true;

  const searchableText = [
    country.country_name,
    country.country_code,
    country.iso_2,
    country.flag_code,
    permit_type,
    permitLabel,
    cleanDescription,
    processingText,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (searchableText.includes(q)) return true;

  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    return tokens.every(
      (token) =>
        searchableText.includes(token) ||
        matchesCountryAliases(country, token)
    );
  }

  return false;
};

const PermitServices = ({
  permitServices = [],
  filterCountryId = "",
  filterPermitType = "all",
  onClearFilter,
  isLoading = false,
}: PermitServicesProps) => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedPermitTab, setSelectedPermitTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const syncedCountryIdRef = useRef<string>("");

  // Sync incoming Hero country selection into inline search bar
  useEffect(() => {
    if (filterCountryId) {
      if (syncedCountryIdRef.current !== filterCountryId) {
        const matched = permitServices.find(
          (item) => String(item.country.id) === String(filterCountryId)
        );
        if (matched) {
          setSearchQuery(matched.country.country_name);
          syncedCountryIdRef.current = filterCountryId;
        }
      }
    } else if (syncedCountryIdRef.current !== "") {
      setSearchQuery("");
      syncedCountryIdRef.current = "";
    }
  }, [filterCountryId, permitServices]);

  // Sync incoming Hero permit type selection into inline permit type tab
  useEffect(() => {
    if (!filterPermitType || filterPermitType === "all") {
      setSelectedPermitTab("all");
    } else {
      setSelectedPermitTab(
        FILTER_TO_API_TYPE[filterPermitType] ?? filterPermitType
      );
    }
  }, [filterPermitType]);

  // Reset pagination when search or tab filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedPermitTab, searchQuery, filterCountryId, filterPermitType]);

  // Build tabs starting with core work permit types + any extra permit types from API
  const knownTabIds = new Set(CORE_PERMIT_TABS.map((t) => t.id));
  const extraPermitTabs = Array.from(
    new Set(
      permitServices
        .map((item) => item.permit_type)
        .filter((pt) => Boolean(pt) && !knownTabIds.has(pt))
    )
  ).map((pt) => ({
    id: pt,
    label: getPermitTypeConfig(pt).label,
  }));
  const permitTypeTabs = [...CORE_PERMIT_TABS, ...extraPermitTabs];

  const isCountryFiltered = searchQuery.trim() !== "";
  const isPermitTypeFiltered = selectedPermitTab !== "all";
  const hasActiveFilter = isCountryFiltered || isPermitTypeFiltered;

  // Filter using permit type tab and live search query, and sort A-Z
  const filteredPermitServices = permitServices
    .filter((item) => {
      const matchesPermitType =
        !isPermitTypeFiltered || item.permit_type === selectedPermitTab;

      const matchesQuery = matchesWorkPermitSearch(item, searchQuery);

      return matchesPermitType && matchesQuery;
    })
    .sort((a, b) => {
      const countryCompare = a.country.country_name.localeCompare(
        b.country.country_name,
        undefined,
        { sensitivity: "base" }
      );
      if (countryCompare !== 0) {
        return countryCompare;
      }
      return a.permit_type.localeCompare(b.permit_type);
    });

  const displayedPermitServices = filteredPermitServices.slice(
    0,
    visibleCount
  );
  const hasMore = visibleCount < filteredPermitServices.length;

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleClearAllFilters = () => {
    setSelectedPermitTab("all");
    setSearchQuery("");
    syncedCountryIdRef.current = "";
    setVisibleCount(ITEMS_PER_PAGE);
    onClearFilter?.();
  };

  // Every card carries its own permit type.
  // This is important because UAE NEW and UAE RENEWAL
  // must go to the same country detail page but with
  // different permitType query parameters.
  const handleCountryClick = (
    countryId: number,
    permitType: string
  ) => {
    const params = new URLSearchParams();

    params.set("permitType", permitType);

    navigate(
      `/permit-details/${countryId}?${params.toString()}`
    );
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-blue-100/50 via-blue-50/50 to-pink-50">
      <div className="max-w-7xl mx-auto">

        {/* Work Permit Type Filter Tabs & Live Search Bar */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-sm p-4 sm:p-5 md:p-6 space-y-3.5 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-[#2D1347] mr-1">
                ALL PERMITS :
              </span>
              {permitTypeTabs.map((tab) => {
                const isActive = selectedPermitTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedPermitTab(tab.id)}
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[#2D1347] text-white shadow-sm"
                        : "text-[#2D1347]/80 hover:bg-purple-50 hover:text-[#2D1347]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {hasActiveFilter && !isLoading && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs font-semibold text-gray-500">
                  {filteredPermitServices.length}{" "}
                  {filteredPermitServices.length === 1 ? "permit" : "permits"}
                </span>
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-[#E91E63] bg-pink-50 hover:bg-pink-100 transition-colors cursor-pointer"
                >
                  <X size={12} />
                  Reset
                </button>
              </div>
            )}
          </div>

          <div className="relative flex items-center w-full">
            <Search
              size={16}
              className="text-gray-400 absolute left-4 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSearchQuery("");
                } else if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              placeholder="Search country, permit type, or details..."
              aria-label="Search work permit destination or type"
              className="w-full pl-11 pr-10 py-2.5 sm:py-3 rounded-full border border-gray-200 bg-gray-50/40 focus:bg-white focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-[#E91E63]/15 text-sm font-medium text-gray-800 placeholder:text-gray-400 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3.5 p-1 rounded-full text-gray-400 hover:text-[#E91E63] hover:bg-pink-50 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        <header className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-purple-950 font-extrabold">
            Our Work Permit Services
          </h1>
        </header>

        {isLoading ? (
          <div className="py-20 text-center">

            <div className="w-12 h-12 border-4 border-[#2D1347] border-t-[#FF4FA3] rounded-full animate-spin mx-auto mb-4" />

            <p className="text-[#2D1347] font-bold text-base">
              Loading work permits...
            </p>

          </div>
        ) : filteredPermitServices.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">

              {displayedPermitServices.map((item) => {
                const country = item.country;
                const permitType = item.permit_type;
                const permitConfig = getPermitTypeConfig(permitType);
                const PermitIcon = permitConfig.icon;

                return (
                  <div
                    key={`${country.id}-${permitType}`}
                    onClick={() =>
                      handleCountryClick(
                        country.id,
                        permitType
                      )
                    }
                    className={`w-full rounded-2xl sm:rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between text-center border cursor-pointer group hover:-translate-y-1 ${
                      isCountryFiltered
                        ? "border-pink-300 ring-1 ring-pink-200 shadow-md hover:border-pink-400"
                        : "border-gray-100 hover:border-pink-300"
                    }`}
                  >

                    {/* Top Content */}
                    <div className="flex flex-col items-center">
                      {/* FLAG */}
                      <div className="p-2 mb-2 flex items-center justify-center">
                        {country.flag_code ? (
                          <ReactCountryFlag
                            svg
                            countryCode={country.flag_code}
                            className="rounded-lg shadow-sm text-4xl sm:text-5xl"
                            style={{
                              width: "2.5em",
                              height: "2.5em",
                            }}
                          />
                        ) : (
                          <div className="w-[100px] h-[100px] rounded-lg bg-purple-50 flex items-center justify-center text-pink-500">
                            <Globe size={48} />
                          </div>
                        )}
                      </div>

                      {/* COUNTRY NAME */}
                      <h3 className="text-purple-950 font-extrabold text-base sm:text-lg mb-1.5 group-hover:text-pink-600 transition-colors">
                        {country.country_name}
                      </h3>

                      {/* DESCRIPTION */}
                      {country.short_description ? (
                        <div
                          className="text-sm text-gray-600 font-normal my-2 text-left w-full leading-relaxed space-y-1.5"
                          dangerouslySetInnerHTML={{
                            __html: formatDescription(country.short_description),
                          }}
                        />
                      ) : null}
                    </div>

                    {/* Bottom Area */}
                    <div className="w-full flex flex-col items-center pt-2 gap-3 mt-auto">
                      {/* PERMIT TYPE BADGE */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold tracking-wide border shadow-2xs transition-transform group-hover:scale-105 ${permitConfig.badgeStyle}`}
                      >
                        <PermitIcon size={12} className="shrink-0" />
                        <span>{permitConfig.label}</span>
                      </span>

                      {/* ACTION BUTTON */}
                      <span className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-[#2D1347] group-hover:bg-[#E91E63] text-white transition-all shadow-sm">
                        <span>View Details</span>
                        <ArrowRight
                          size={13}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </span>
                    </div>

                  </div>
                );
              })}

            </div>

            {/* SEE MORE BUTTON */}
            {hasMore && (
              <div className="flex justify-center mt-8 sm:mt-10">
                <button
                  onClick={handleSeeMore}
                  className="px-10 py-3.5 bg-[#2D1347] hover:bg-[#3B145C] text-white font-bold text-sm rounded-2xl flex items-center gap-2.5 transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer group"
                >
                  <span>See More</span>
                  <ChevronDown
                    size={18}
                    className="group-hover:translate-y-0.5 transition-transform"
                  />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-gray-200/80 text-center space-y-4 shadow-sm my-4">
            <div className="w-16 h-16 bg-purple-50 text-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Search size={30} />
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-[#2D1347]">
              No Matching Work Permits Found
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              We couldn&apos;t find any work permit services matching your search or filter. Try clearing or adjusting your filters.
            </p>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="px-6 py-2.5 bg-[#2D1347] hover:bg-pink-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
              >
                Show All Work Permits
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default PermitServices;