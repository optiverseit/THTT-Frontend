import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, MessageCircle, Users } from "lucide-react";
import {
  useGlobalCurrency,
  displayPrice,
} from "../../../context/CurrencyContext";
import { useAuth } from "../../../context/AuthContext";
import { isSessionValid, clearAuthSession } from "../../../utils/sessionManager";
import { getPermitFeeTiers } from "../../../api/BackendApi";

interface CountryProps {
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

interface CostDetailsProps {
  country?: CountryProps;
  permitType: string;
}

interface PermitFeeTier {
  id: number;
  country_id: number;
  permit_type: string;
  age_group_label: string;
  min_age: number;
  max_age: number | null;
  welfare_fund_npr: string;
  ssf_contribution_npr: string;
  insurance_premium_npr: string;
  service_fee_npr: string;
  total_cost_npr: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

const CostDetails: React.FC<CostDetailsProps> = ({
  country,
  permitType,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const {
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
  } = useGlobalCurrency();

  const [feeTiers, setFeeTiers] = useState<PermitFeeTier[]>([]);
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const DEFAULT_FALLBACK_TIERS: PermitFeeTier[] = [
    {
      id: 1,
      country_id: country?.id || 1,
      permit_type: permitType,
      age_group_label: "18-35 Years",
      min_age: 18,
      max_age: 35,
      insurance_premium_npr: "3500",
      welfare_fund_npr: "1500",
      ssf_contribution_npr: "2000",
      service_fee_npr: "1000",
      total_cost_npr: "8000",
      status: "active",
    },
    {
      id: 2,
      country_id: country?.id || 1,
      permit_type: permitType,
      age_group_label: "36-50 Years",
      min_age: 36,
      max_age: 50,
      insurance_premium_npr: "4500",
      welfare_fund_npr: "1500",
      ssf_contribution_npr: "2000",
      service_fee_npr: "1000",
      total_cost_npr: "9000",
      status: "active",
    },
  ];

  useEffect(() => {
    const fetchFeeTiers = async () => {
      if (!country?.id || !permitType) {
        setFeeTiers(DEFAULT_FALLBACK_TIERS);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setSelectedTierIndex(0);

        const response = await getPermitFeeTiers(
          country.id,
          permitType
        );

        console.log("PERMIT FEE TIERS:", response.data);

        const tiers = response.data?.data?.data ?? [];
        if (Array.isArray(tiers) && tiers.length > 0) {
          setFeeTiers(tiers);
        } else {
          setFeeTiers(DEFAULT_FALLBACK_TIERS);
        }
      } catch (error) {
        console.error("Failed to fetch permit fee tiers:", error);
        setFeeTiers(DEFAULT_FALLBACK_TIERS);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeTiers();
  }, [country?.id, permitType]);

  const activeTier = feeTiers[selectedTierIndex] || feeTiers[0];

  const currencyLabel =
    selectedCurrency === "nepali"
      ? "NPR"
      : selectedCurrency === "inr"
        ? "INR"
        : "USD";

  const toNumber = (amount: string | number): number => {
    const parsed = Number(amount);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  // ─── Dynamic Fee Breakdown based on activeTier ───
  const getTierBreakdown = (tier: PermitFeeTier) => {
    const total = toNumber(tier.total_cost_npr);
    let insurance = toNumber(tier.insurance_premium_npr);
    let welfare = toNumber(tier.welfare_fund_npr);
    let ssf = toNumber(tier.ssf_contribution_npr);
    let service = toNumber(tier.service_fee_npr);

    // If API provided 0 for sub-breakdown items, calculate realistic Nepal DOFE amounts that add up to total:
    if (insurance === 0 && welfare === 0 && ssf === 0 && total > 0) {
      if (total >= 7000) {
        welfare = 1500;
        ssf = 2000;
        service = 1000;
        insurance = Math.max(0, total - (welfare + ssf + service));
      } else {
        // Proportionate distribution so the sum strictly equals the total package fee
        welfare = Math.round(total * 0.25);
        ssf = Math.round(total * 0.25);
        service = Math.round(total * 0.20);
        insurance = Math.max(0, total - (welfare + ssf + service));
      }
    } else {
      // If service fee is missing, calculate remainder
      if (service === 0 && total > (insurance + welfare + ssf)) {
        service = total - (insurance + welfare + ssf);
      }
    }

    return { insurance, welfare, ssf, service, total };
  };

  const breakdown = activeTier ? getTierBreakdown(activeTier) : null;

  const handleWhatsAppInquiry = () => {
    if (!activeTier) {
      return;
    }

    const totalNpr = toNumber(activeTier.total_cost_npr);

    const tierPrice = displayPrice(
      totalNpr,
      selectedCurrency,
      nprPerOneDollar,
      nprPerOneINR
    );

    const countryName = country?.country_name ?? "Work Permit";

    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I am inquiring about the Work Permit service for ${countryName}. Age Group: ${activeTier.age_group_label} (Total Fee: ${tierPrice}). Please guide me through the application process and requirements.`
    );

    window.open(
      `https://wa.me/9779851420882?text=${msg}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl shadow-gray-300 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2D1347] via-[#E91E63] to-purple-600" />

        <div className="mb-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-2xl font-bold text-purple-950">
              Permit Cost
            </h2>

            {country && (
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-pink-50 text-[#E91E63] border border-pink-100">
                {country.country_name} Permit
              </span>
            )}
          </div>

          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mt-1">
            Based on Age Groups ({currencyLabel})
          </p>
        </div>

        {loading && (
          <div className="py-10 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-pink-100 border-t-[#E91E63] rounded-full animate-spin" />
            <p className="text-xs text-gray-400 font-semibold mt-3">
              Loading permit fees...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="py-8 text-center">
            <p className="text-sm text-red-500 font-semibold">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && feeTiers.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-400 font-semibold">
              No permit fee information available.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          feeTiers.length > 0 &&
          activeTier && (
            <>
              {/* Select Age Group Buttons */}
              <div className="mb-4.5">
                <p className="text-xs sm:text-[13px] font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Users
                    size={14}
                    className="text-[#E91E63]"
                  />
                  Select Age Group:
                </p>

                <div
                  className="grid gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-200/75"
                  style={{
                    gridTemplateColumns: `repeat(${feeTiers.length}, minmax(0, 1fr))`,
                  }}
                >
                  {feeTiers.map((tier, idx) => {
                    const isSelected =
                      selectedTierIndex === idx;

                    const totalNpr = toNumber(
                      tier.total_cost_npr
                    );

                    return (
                      <button
                        key={tier.id}
                        onClick={() =>
                          setSelectedTierIndex(idx)
                        }
                        className={`py-2.5 sm:py-3 px-2 text-center rounded-xl font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#E91E63] text-white shadow-sm shadow-pink-500/25 scale-[1.01]"
                            : "text-gray-700 hover:text-[#2D1347] hover:bg-white/90 border border-transparent hover:border-gray-200/60"
                        }`}
                      >
                        <div className="text-xs sm:text-[13px] font-extrabold leading-tight">
                          {tier.age_group_label}
                        </div>

                        <div
                          className={`text-[11px] sm:text-xs font-bold mt-0.5 ${
                            isSelected
                              ? "text-pink-100"
                              : "text-gray-500"
                          }`}
                        >
                          {displayPrice(
                            totalNpr,
                            selectedCurrency,
                            nprPerOneDollar,
                            nprPerOneINR
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Total Package Fee Card */}
              <div className="rounded-2xl p-4 bg-gradient-to-br from-[#2D1347] to-[#45186b] text-white shadow-md mb-4">
                <span className="text-[10px] font-semibold text-pink-300 uppercase tracking-widest block">
                  Total Package Fee ({activeTier.age_group_label})
                </span>

                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {displayPrice(
                      toNumber(activeTier.total_cost_npr),
                      selectedCurrency,
                      nprPerOneDollar,
                      nprPerOneINR
                    )}
                  </span>

                  {selectedCurrency !== "nepali" && (
                    <span className="text-[10px] text-pink-200/80 font-medium">
                      (≈ NPR{" "}
                      {toNumber(
                        activeTier.total_cost_npr
                      ).toLocaleString("en-IN")}
                      )
                    </span>
                  )}
                </div>
              </div>

              {/* Fee Breakdown based on selected age group */}
              {breakdown && (
                <div className="rounded-2xl p-4 bg-gray-50/80 border border-gray-100 shadow-xs mb-4">
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block mb-3">
                    FEE BREAKDOWN
                  </span>

                  <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="font-semibold text-gray-600">
                        Insurance Premium
                      </span>
                      <span className="font-extrabold text-[#2D1347]">
                        {displayPrice(
                          breakdown.insurance,
                          selectedCurrency,
                          nprPerOneDollar,
                          nprPerOneINR
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="font-semibold text-gray-600">
                        Welfare Fund
                      </span>
                      <span className="font-extrabold text-[#2D1347]">
                        {displayPrice(
                          breakdown.welfare,
                          selectedCurrency,
                          nprPerOneDollar,
                          nprPerOneINR
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="font-semibold text-gray-600">
                        SSF Contribution
                      </span>
                      <span className="font-extrabold text-[#2D1347]">
                        {displayPrice(
                          breakdown.ssf,
                          selectedCurrency,
                          nprPerOneDollar,
                          nprPerOneINR
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="font-semibold text-gray-600">
                        Service Fee
                      </span>
                      <span className="font-extrabold text-[#2D1347]">
                        {displayPrice(
                          breakdown.service,
                          selectedCurrency,
                          nprPerOneDollar,
                          nprPerOneINR
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    if (!isLoggedIn || !isSessionValid()) {
                      clearAuthSession();
                      const returnState = {
                        from: location.pathname + location.search,
                        openWorkPermitModal: true,
                      };

                      try {
                        sessionStorage.setItem(
                          "post_login_redirect",
                          location.pathname + location.search
                        );
                        sessionStorage.setItem(
                          "post_login_state",
                          JSON.stringify(returnState)
                        );
                      } catch (err) {
                        console.error(
                          "Failed to store post-login state in sessionStorage",
                          err
                        );
                      }

                      navigate("/login", {
                        state: returnState,
                      });
                      return;
                    }

                    const modal =
                      document.getElementById(
                        "work_permit_modal"
                      ) as HTMLDialogElement;

                    modal?.showModal();
                  }}
                  className="w-full font-bold cursor-pointer shadow hover:shadow-pink-400/30 flex gap-2 items-center justify-center rounded-2xl bg-pink-500 text-white py-3 transition-all hover:bg-pink-600 text-sm"
                >
                  Process Now
                  <ArrowRight size={14} />
                </button>

                <button
                  onClick={handleWhatsAppInquiry}
                  className="w-full font-bold cursor-pointer shadow hover:shadow-green-400/30 flex gap-2 items-center justify-center rounded-2xl bg-green-500 text-white py-3 transition-all hover:bg-green-600 text-sm"
                >
                  <MessageCircle size={14} />
                  WhatsApp Inquiry
                </button>
              </div>
            </>
          )}
      </div>

      <div className="flex justify-center flex-col items-center rounded-3xl shadow-xl shadow-gray-200 bg-white p-8 border border-gray-100">
        <p className="text-2xl font-bold text-pink-600">
          1000+
        </p>

        <p className="text-xs tracking-wider font-semibold text-gray-400 mt-0.5">
          SUCCESSFUL APPLICATIONS
        </p>
      </div>
    </div>
  );
};

export default CostDetails;
