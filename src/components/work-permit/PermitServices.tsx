import { useState, useEffect } from "react";
import {
  ChevronDown,
  Globe,
  RefreshCw,
  FilePlus,
  FileText,
  ShieldCheck,
  ArrowRight,
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

const PermitServices = ({
  permitServices = [],
  filterCountryId = "",
  filterPermitType = "all",
  isLoading = false,
}: PermitServicesProps) => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Reset pagination when search filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [filterCountryId, filterPermitType]);

  const isCountryFiltered = filterCountryId !== "";

  const isPermitTypeFiltered =
    filterPermitType !== "" && filterPermitType !== "all";

  const backendPermitType =
    FILTER_TO_API_TYPE[filterPermitType] ?? filterPermitType;

  // Filter using both country and permit type, and sort A-Z
  const filteredPermitServices = permitServices
    .filter((item) => {
      const matchesCountry =
        !isCountryFiltered ||
        String(item.country.id) === String(filterCountryId);

      const matchesPermitType =
        !isPermitTypeFiltered ||
        item.permit_type === backendPermitType;

      return matchesCountry && matchesPermitType;
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
                      <div
                        className="text-[11px] text-gray-500 font-medium line-clamp-2 min-h-[2rem] mb-2 overflow-hidden"
                        dangerouslySetInnerHTML={{
                          __html: formatDescription(country.short_description),
                        }}
                      />
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
          <div className="text-center py-12 text-gray-400 text-sm font-semibold">
            No results found for the selected filters.
          </div>
        )}

      </div>
    </div>
  );
};

export default PermitServices;