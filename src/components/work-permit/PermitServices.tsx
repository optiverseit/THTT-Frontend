import { ArrowRight, X, Globe } from "lucide-react";
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

const PermitServices = ({
  permitServices = [],
  filterCountryId = "",
  filterPermitType = "all",
  onClearFilter,
  isLoading = false,
}: PermitServicesProps) => {
  const navigate = useNavigate();

  const isCountryFiltered = filterCountryId !== "";

  const isPermitTypeFiltered =
    filterPermitType !== "" && filterPermitType !== "all";

  const isFiltered =
    isCountryFiltered || isPermitTypeFiltered;

  const backendPermitType =
    FILTER_TO_API_TYPE[filterPermitType] ?? filterPermitType;

  // Filter using both country and permit type
  const visiblePermitServices = permitServices.filter((item) => {
    const matchesCountry =
      !isCountryFiltered ||
      String(item.country.id) === String(filterCountryId);

    const matchesPermitType =
      !isPermitTypeFiltered ||
      item.permit_type === backendPermitType;

    return matchesCountry && matchesPermitType;
  });

  const selectedCountryName =
    permitServices.find(
      (item) =>
        String(item.country.id) === String(filterCountryId)
    )?.country.country_name ?? filterCountryId;

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

          {isFiltered && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">

              {isCountryFiltered && (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold">
                  Country: {selectedCountryName}
                </span>
              )}

              {isPermitTypeFiltered && (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
                  Type:{" "}
                  {PERMIT_TYPE_LABELS[backendPermitType] ??
                    backendPermitType}
                </span>
              )}

              <button
                onClick={onClearFilter}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-pink-50 text-pink-600 hover:text-pink-700 font-bold text-xs rounded-full border border-pink-200 transition-all cursor-pointer shadow-sm active:scale-95"
                title="Clear all filters"
              >
                <X size={13} />
                Clear Filter
              </button>

            </div>
          )}
        </header>

        {isLoading ? (
          <div className="py-20 text-center">

            <div className="w-12 h-12 border-4 border-[#2D1347] border-t-[#FF4FA3] rounded-full animate-spin mx-auto mb-4" />

            <p className="text-[#2D1347] font-bold text-base">
              Loading work permits...
            </p>

          </div>
        ) : visiblePermitServices.length > 0 ? (
          <div
            className={`grid gap-4 sm:gap-6 ${
              isCountryFiltered
                ? "grid-cols-1 place-items-center"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            }`}
          >

            {visiblePermitServices.map((item) => {
              const country = item.country;
              const permitType = item.permit_type;

              return (
                <div
                  key={`${country.id}-${permitType}`}
                  onClick={() =>
                    handleCountryClick(
                      country.id,
                      permitType
                    )
                  }
                  className={`rounded-2xl sm:rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all p-4 sm:p-5 flex flex-col items-center justify-between text-center border cursor-pointer group ${
                    isCountryFiltered
                      ? "border-pink-400 ring-2 ring-pink-300 shadow-lg w-56 sm:w-64"
                      : "border-gray-100 hover:border-pink-300"
                  }`}
                >

                  {/* FLAG */}
                  <div className="p-2 mb-2">
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
                  <h3 className="text-purple-950 font-extrabold text-base sm:text-lg mb-1 group-hover:text-pink-600 transition-colors">
                    {country.country_name}
                  </h3>

                  {/* DESCRIPTION */}
                  <div
                    className="text-[10.5px] text-gray-500 font-medium mb-3 overflow-hidden"
                    style={{ maxHeight: "3rem" }}
                    dangerouslySetInnerHTML={{ __html: formatDescription(country.short_description) }}
                  />

                  {/* PERMIT TYPE BADGE */}
                  <span className="mb-2 inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-purple-50 border border-purple-200 text-purple-700">
                    {PERMIT_TYPE_LABELS[permitType] ??
                      permitType}
                  </span>

                  <span className="rounded-full tracking-wider bg-purple-50 group-hover:bg-pink-600 group-hover:text-white transition-colors text-purple-950 text-xs font-bold w-full py-2 block">
                    View Details
                  </span>

                </div>
              );
            })}

          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm font-semibold">
            No results found for the selected filters.
          </div>
        )}

        {/* SEE ALL */}
        <div className="flex justify-center mt-4 sm:mt-6">

          <div
            onClick={onClearFilter}
            className="rounded-2xl sm:rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all p-4 sm:p-5 flex flex-col justify-center items-center text-center border border-gray-100 cursor-pointer group w-40 sm:w-48"
          >

            <div className="p-3 sm:p-4 bg-pink-600 group-hover:bg-pink-700 transition-colors flex items-center rounded-2xl justify-center text-white mb-3">
              <ArrowRight
                size={24}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>

            <p className="font-bold text-purple-950 text-sm sm:text-base">
              See All
            </p>

            <p className="text-gray-400 text-[10px] sm:text-xs uppercase font-bold tracking-wider">
              COUNTRIES
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PermitServices;