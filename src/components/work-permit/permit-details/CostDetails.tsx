import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  MessageCircle,
  Users,
  Briefcase,
} from "lucide-react";

import {
  useGlobalCurrency,
  displayPrice,
} from "../../../context/CurrencyContext";

import { getPermitFeeTiers } from "../../../api/BackendApi";
import { DEFAULT_WORK_PERMIT_TYPES, type WorkPermitType } from "./mockPermitData";

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
  /** Driven by parent state / sibling components */
  selectedPermitType?: WorkPermitType;
  /** Optional: called when the selected permit type changes so sibling components can sync */
  onPermitTypeChange?: (permitType: WorkPermitType) => void;
  /** Optional: called when the selected age tier changes so parent / modal can sync */
  onAgeTierChange?: (tier: PermitFeeTier) => void;
}

export const DEFAULT_FEE_TIERS: PermitFeeTier[] = [
  {
    id: 1,
    country_id: 1,
    age_group_label: "18-35 Years",
    min_age: 18,
    max_age: 35,
    welfare_fund_npr: "1500",
    ssf_contribution_npr: "2000",
    insurance_premium_npr: "3500",
    service_fee_npr: "1000",
    total_cost_npr: "8000",
    status: "active",
  },
  {
    id: 2,
    country_id: 1,
    age_group_label: "36-50 Years",
    min_age: 36,
    max_age: 50,
    welfare_fund_npr: "1500",
    ssf_contribution_npr: "2000",
    insurance_premium_npr: "4500",
    service_fee_npr: "1000",
    total_cost_npr: "9000",
    status: "active",
  },
];

interface PermitFeeTier {
  id: number;
  country_id: number;
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
  selectedPermitType: propSelectedPermitType,
  onPermitTypeChange,
  onAgeTierChange,
}) => {
  const {
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
  } = useGlobalCurrency();

  // Controlled permit type: driven directly by prop from parent (matches AboutPermit pattern)
  const permitTypes = DEFAULT_WORK_PERMIT_TYPES;
  const selectedPermitType =
    propSelectedPermitType ??
    permitTypes[0];

  const [feeTiers, setFeeTiers] = useState<PermitFeeTier[]>([]);
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  /*
   * Fetch permit fee tiers whenever country changes
   */
  useEffect(() => {
    const fetchFeeTiers = async () => {
      if (!country?.id) {
        setFeeTiers([]);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setSelectedTierIndex(0);

        const response = await getPermitFeeTiers(country.id);

        console.log("PERMIT FEE TIERS:", response.data);

        const tiers = response.data?.data?.data ?? [];
        setFeeTiers(Array.isArray(tiers) && tiers.length > 0 ? tiers : []);
      } catch (err) {
        console.error("Failed to fetch permit fee tiers:", err);
        setFeeTiers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeTiers();
  }, [country?.id]);

  /*
   * Fallback to default tiers if API has no tiers configured yet
   */
  const effectiveFeeTiers: PermitFeeTier[] =
    feeTiers.length > 0 ? feeTiers : DEFAULT_FEE_TIERS;

  const activeTier =
    effectiveFeeTiers[selectedTierIndex] || effectiveFeeTiers[0];

  // Stable ref for onAgeTierChange to prevent infinite render loops
  const onAgeTierChangeRef = useRef(onAgeTierChange);
  useEffect(() => {
    onAgeTierChangeRef.current = onAgeTierChange;
  }, [onAgeTierChange]);

  // Notify parent only once on initial mount/data load
  const hasNotifiedInitialTier = useRef(false);
  useEffect(() => {
    if (!hasNotifiedInitialTier.current && activeTier) {
      hasNotifiedInitialTier.current = true;
      onAgeTierChangeRef.current?.(activeTier);
    }
  }, [activeTier]);

  /*
   * Currency label
   */
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

  // Active permit adjustment relative to base tier
  const activePermitAdjustment = selectedPermitType?.fee_adjustment_npr ?? 0;

  // Final total NPR for active age group + active permit type
  const finalTotalNpr = Math.max(
    0,
    toNumber(activeTier?.total_cost_npr ?? 8000) + activePermitAdjustment
  );

  /*
   * WhatsApp Inquiry
   */
  const handleWhatsAppInquiry = () => {
    if (!activeTier) return;

    const tierPrice = displayPrice(
      finalTotalNpr,
      selectedCurrency,
      nprPerOneDollar,
      nprPerOneINR
    );

    const countryName = country?.country_name ?? "Work Permit";

    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I am inquiring about the Work Permit service for ${countryName}. Age Group: ${activeTier.age_group_label}, Permit Type: ${selectedPermitType?.name ?? "Work Permit"} (Total Fee: ${tierPrice}). Please guide me through the application process and requirements.`
    );

    window.open(
      `https://wa.me/9779851420882?text=${msg}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="flex flex-col gap-6">

      {/* MAIN COST CARD */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl shadow-gray-300 border border-gray-100 relative overflow-hidden">

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2D1347] via-[#E91E63] to-purple-600" />

        {/* Header */}
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

        {/* LOADING */}
        {loading && (
          <div className="py-10 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-pink-100 border-t-[#E91E63] rounded-full animate-spin" />
            <p className="text-xs text-gray-400 font-semibold mt-3">
              Loading permit fees...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="py-8 text-center">
            <p className="text-sm text-red-500 font-semibold">
              {error}
            </p>
          </div>
        )}

        {/* FEE INFORMATION */}
        {!loading && activeTier && (
          <>
            {/* AGE GROUP SELECTOR */}
            <div className="mb-4">
              <p className="text-[11px] font-bold text-gray-500 mb-1.5 flex items-center gap-1">
                <Users size={12} className="text-[#E91E63]" />
                Select Age Group:
              </p>

              <div
                className="grid gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-200/70"
                style={{
                  gridTemplateColumns: `repeat(${effectiveFeeTiers.length}, minmax(0, 1fr))`,
                }}
              >
                {effectiveFeeTiers.map((tier, idx) => {
                  const isSelected = selectedTierIndex === idx;
                  // Dynamic price for this age group under currently selected permit type
                  const tierPrice = Math.max(
                    0,
                    toNumber(tier.total_cost_npr) + activePermitAdjustment
                  );

                  return (
                    <button
                      key={tier.id}
                      onClick={() => {
                        setSelectedTierIndex(idx);
                        onAgeTierChangeRef.current?.(tier);
                      }}
                      className={`py-2 px-1 text-center rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#E91E63] text-white shadow-md shadow-pink-500/20 scale-[1.02]"
                          : "text-gray-600 hover:text-[#2D1347] hover:bg-white/80"
                      }`}
                    >
                      <div className="leading-tight truncate">
                        {tier.age_group_label}
                      </div>

                      <div
                        className={`text-[9px] mt-0.5 ${
                          isSelected ? "text-pink-100" : "text-gray-400 font-semibold"
                        }`}
                      >
                        {displayPrice(
                          tierPrice,
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

            {/* ── WORK PERMIT TYPE SELECTOR ── */}
            <div className="mb-5">
              <p className="text-[11px] font-bold text-gray-500 mb-1.5 flex items-center gap-1">
                <Briefcase size={12} className="text-[#E91E63]" />
                Select Permit Type:
              </p>

              <div className="space-y-2">
                {permitTypes.map((pt) => {
                  const isSelected = selectedPermitType.id === pt.id;
                  const ptAdjustment =
                    pt.fee_adjustment_npr ?? (pt.base_fee_npr - 8000);
                  const ptPrice = Math.max(
                    0,
                    toNumber(activeTier.total_cost_npr) + ptAdjustment
                  );

                  return (
                    <div
                      key={pt.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onPermitTypeChange?.(pt)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") onPermitTypeChange?.(pt);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? "border-[#E91E63] bg-pink-50/40 ring-1 ring-[#E91E63]"
                          : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                      }`}
                    >
                      {/* Left: radio dot + name */}
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-3 h-3 rounded-full flex-shrink-0 transition-all ${
                            isSelected
                              ? "bg-[#E91E63] shadow shadow-pink-400/40"
                              : "bg-gray-200 border border-gray-300"
                          }`}
                        />
                        <div>
                          <p className="text-xs font-black text-[#200B3B] capitalize">{pt.name}</p>
                        </div>
                      </div>

                      {/* Right: Dynamic price badge based on selected age group */}
                      <div className="text-right flex-shrink-0">
                        <span
                          className={`text-xs font-black px-2.5 py-1 rounded-xl transition-all ${
                            isSelected
                              ? "bg-[#E91E63] text-white shadow-xs"
                              : "bg-white text-gray-700 border border-gray-200"
                          }`}
                        >
                          {displayPrice(
                            ptPrice,
                            selectedCurrency,
                            nprPerOneDollar,
                            nprPerOneINR
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TOTAL COST */}
            <div className="rounded-2xl p-4 bg-gradient-to-br from-[#2D1347] to-[#45186b] text-white shadow-md mb-4">
              <span className="text-[10px] font-semibold text-pink-300 uppercase tracking-widest block">
                Total Package Fee ({activeTier.age_group_label} • {selectedPermitType?.name})
              </span>

              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {displayPrice(
                    finalTotalNpr,
                    selectedCurrency,
                    nprPerOneDollar,
                    nprPerOneINR
                  )}
                </span>

                {selectedCurrency !== "nepali" && (
                  <span className="text-[10px] text-pink-200/80 font-medium">
                    (≈ NPR {finalTotalNpr.toLocaleString("en-IN")})
                  </span>
                )}
              </div>
            </div>

              {/* FEE BREAKDOWN — hidden for now; remove 'hidden' to show again */}
              <div className="hidden bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4">

                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-3">
                  Fee Breakdown
                </p>

                <div className="flex flex-col gap-2">

                  {/* Insurance */}
                  <div className="flex items-center justify-between">

                    <span className="text-xs text-gray-500 font-semibold">
                      Insurance Premium
                    </span>

                    <span className="text-xs text-purple-950 font-bold">

                      {displayPrice(
                        toNumber(
                          activeTier.insurance_premium_npr
                        ),
                        selectedCurrency,
                        nprPerOneDollar,
                        nprPerOneINR
                      )}

                    </span>

                  </div>

                  {/* Welfare */}
                  <div className="flex items-center justify-between">

                    <span className="text-xs text-gray-500 font-semibold">
                      Welfare Fund
                    </span>

                    <span className="text-xs text-purple-950 font-bold">

                      {displayPrice(
                        toNumber(
                          activeTier.welfare_fund_npr
                        ),
                        selectedCurrency,
                        nprPerOneDollar,
                        nprPerOneINR
                      )}

                    </span>

                  </div>

                  {/* SSF */}
                  <div className="flex items-center justify-between">

                    <span className="text-xs text-gray-500 font-semibold">
                      SSF Contribution
                    </span>

                    <span className="text-xs text-purple-950 font-bold">

                      {displayPrice(
                        toNumber(
                          activeTier.ssf_contribution_npr
                        ),
                        selectedCurrency,
                        nprPerOneDollar,
                        nprPerOneINR
                      )}

                    </span>

                  </div>

                  {/* Service */}
                  <div className="flex items-center justify-between">

                    <span className="text-xs text-gray-500 font-semibold">
                      Service Fee
                    </span>

                    <span className="text-xs text-purple-950 font-bold">

                      {displayPrice(
                        toNumber(
                          activeTier.service_fee_npr
                        ),
                        selectedCurrency,
                        nprPerOneDollar,
                        nprPerOneINR
                      )}

                    </span>

                  </div>

                </div>

              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-3">

                <button
                  onClick={() => {
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
                  onClick={
                    handleWhatsAppInquiry
                  }
                  className="w-full font-bold cursor-pointer shadow hover:shadow-green-400/30 flex gap-2 items-center justify-center rounded-2xl bg-green-500 text-white py-3 transition-all hover:bg-green-600 text-sm"
                >

                  <MessageCircle size={14} />

                  WhatsApp Inquiry

                </button>

              </div>

            </>
          )}

      </div>

      {/* TRUST BADGE */}
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