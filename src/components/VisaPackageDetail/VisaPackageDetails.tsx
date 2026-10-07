import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import VisaCountryDetailView, { VisaDetailPlan, CostOption } from "../Service/VisaCountryDetailView";
import { Compass } from "lucide-react";
import { getVisaCategories, getVisaPublicDocumentRequirements, getVisaPublicInformation, getVisaPublicPricingTiers } from "../../api/BackendApi";
interface VisaCategory {
  id: number | string;
  country_id: number | string;
  name: string;
  created_at?: string;
  short_description?: string | null;
  description?: string | null;
  visa_image?: string | null;
  processing_time?: string | null;
  status?: "ACTIVE" | "INACTIVE";
  display_order?: number;
  country?: {
    id: number | string;
    country_name?: string;
    country_code?: string;
    iso_2?: string | null;
    flag_code?: string | null;
  } | null;
}
const getApiArray = (response: any): any[] => {
  const data = response?.data?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};
const getRegionFromCountryCode = (countryCode: string): VisaDetailPlan["region"] => {
  const code = countryCode.toUpperCase();
  if (["TH", "SG", "MY", "JP", "KR", "CN", "VN", "KH", "PH", "LK", "MV", "HK", "ID"].includes(code)) return "asia";
  if (["AE", "QA", "SA", "OM", "BH", "KW"].includes(code)) return "middle-east";
  if (["FR", "DE", "IT", "ES", "CH", "AT", "NL", "BE", "PT", "GR", "TR"].includes(code)) return "europe";
  if (["US", "GB", "CA", "AU", "NZ", "ZA", "BR"].includes(code)) return "west";
  return "all";
};
const mapBasicPlan = (category: VisaCategory): VisaDetailPlan => {
  const countryCode = String(category.country?.iso_2 || category.country?.flag_code || category.country?.country_code || "").toUpperCase();
  return {
    id: String(category.id),
    country: category.country?.country_name || "Visa Destination",
    countryCode,
    region: getRegionFromCountryCode(countryCode),
    visaType: category.name || "Visa",
    duration: "",
    processingTime: category.processing_time || "",
    baseNPRPrice: 0,
    entryType: "",
    inclusions: category.short_description ? [category.short_description] : [],
    aboutText: category.description || category.short_description || "",
    requirementDocuments: [],
    documentRequirements: [],
    termsAndConditions: [],
    costOptions: [],
    countryId: category.country_id,
    visaCategoryId: category.id,
    image: category.visa_image || null,
    created_at: category.created_at,
  };
};
const mapFullPlan = (category: VisaCategory, pricing: any[], documents: any[], information: any[]): VisaDetailPlan => {
  const inclusions = [...information]
    .filter((item) => String(item?.type || "").toUpperCase() === "INCLUDED")
    .sort((a, b) => Number(a?.display_order || 0) - Number(b?.display_order || 0))
    .map((item) => String(item?.content || ""))
    .filter(Boolean);
  const termsAndConditions = [...information]
    .filter((item) => ["TERMS", "TERM", "POLICY", "POLICIES"].includes(String(item?.type || "").toUpperCase()))
    .sort((a, b) => Number(a?.display_order || 0) - Number(b?.display_order || 0))
    .map((item) => String(item?.content || ""))
    .filter(Boolean);
  const documentRequirements = [...documents]
    .filter((item) => item?.status !== "INACTIVE")
    .sort((a, b) => Number(a?.display_order || 0) - Number(b?.display_order || 0));
  const requirementDocuments = documentRequirements
    .map((item) => String(item?.title || item?.document_type || item?.description || ""))
    .filter(Boolean);
  const costOptions: CostOption[] = [...pricing]
    .sort((a, b) => Number(a?.display_order || 0) - Number(b?.display_order || 0))
    .map((item, index) => ({
      name: String(item?.name ?? item?.tier_name ?? item?.service ?? item?.entry_type ?? `Option ${index + 1}`),
      days: String(item?.validity ?? item?.validity_period ?? item?.duration ?? item?.stay_duration ?? item?.days ?? ""),
      nprPrice: Number(item?.price_npr ?? item?.amount_npr ?? item?.price ?? 0),
      entryType: String(item?.entry_type ?? item?.type ?? item?.service ?? item?.name ?? "Visa"),
      description: item?.description ?? undefined,
      visaPricingTierId: item?.id,
      countryId: category.country_id,
      visaCategoryId: category.id
    }));
  const firstOption = costOptions[0];
  const countryCode = String(category.country?.iso_2 || category.country?.flag_code || category.country?.country_code || "").toUpperCase();
  return {
    id: String(category.id),
    country: category.country?.country_name || "Visa Destination",
    countryCode,
    region: getRegionFromCountryCode(countryCode),
    visaType: category.name || "Visa",
    duration: firstOption?.days || "",
    processingTime: category.processing_time || "",
    baseNPRPrice: firstOption?.nprPrice || 0,
    entryType: firstOption?.entryType || "",
    inclusions: inclusions.length > 0 ? inclusions : category.short_description ? [category.short_description] : [],
    aboutText: category.description || category.short_description || "",
    requirementDocuments,
    documentRequirements,
    termsAndConditions,
    costOptions,
    countryId: category.country_id,
    visaCategoryId: category.id,
    image: category.visa_image || null,
    created_at: category.created_at,
  };
};
const VisaPackageDetails: React.FC = () => {
  const { visaId } = useParams();
  const navigate = useNavigate();
  const [matchedVisa, setMatchedVisa] = useState<VisaDetailPlan | null>(null);
  const [allPlans, setAllPlans] = useState<VisaDetailPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pricingLoading, setPricingLoading] = useState(false);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [informationLoading, setInformationLoading] = useState(false);
  useEffect(() => {
    let active = true;
    const loadExtraData = (category: VisaCategory) => {
      setPricingLoading(true);
      setDocumentsLoading(true);
      setInformationLoading(true);
      getVisaPublicPricingTiers(category.id)
        .then((response) => {
          if (!active) return;
          const pricing = getApiArray(response);
          setMatchedVisa((prev) => {
            if (!prev) return prev;
            const costOptions: CostOption[] = pricing
              .filter((item) => item?.status !== "INACTIVE")
              .sort((a, b) => Number(a?.display_order || 0) - Number(b?.display_order || 0))
              .map((item, index) => ({
                name: String(item?.title || `Option ${index + 1}`),
                days: String(item?.validity || ""),
                nprPrice: Number(item?.price_npr || 0),
                entryType: String(item?.title || ""),
                description: item?.description || undefined,
                visaPricingTierId: item?.id,
                countryId: category.country_id,
                visaCategoryId: category.id
              }));
            const firstOption = costOptions[0];
            return {
              ...prev,
              costOptions,
              duration: firstOption?.days || "",
              baseNPRPrice: firstOption?.nprPrice || 0,
              entryType: firstOption?.entryType || ""
            };
          });
        })
        .catch((error) => console.error("Failed to load visa pricing:", error))
        .finally(() => {
          if (active) setPricingLoading(false);
        });
      getVisaPublicDocumentRequirements(category.id)
        .then((response) => {
          if (!active) return;
          const documentRequirements = getApiArray(response)
            .filter((item) => item?.status !== "INACTIVE")
            .sort(
              (a, b) =>
                Number(a?.display_order || 0) -
                Number(b?.display_order || 0)
            );
          const requirementDocuments = documentRequirements
            .map((item) =>
              String(
                item?.title ||
                item?.document_type ||
                item?.description ||
                ""
              )
            )
            .filter(Boolean);
          setMatchedVisa((prev) =>
            prev
              ? {
                ...prev,
                requirementDocuments,
                documentRequirements,
              }
              : prev
          );
        })
        .catch((error) => console.error("Failed to load visa documents:", error))
        .finally(() => {
          if (active) setDocumentsLoading(false);
        });
      getVisaPublicInformation(category.id)
        .then((response) => {
          if (!active) return;
          const information = getApiArray(response);
          const inclusions = information
            .filter((item) => String(item?.type || "").toUpperCase() === "INCLUDED")
            .sort((a, b) => Number(a?.display_order || 0) - Number(b?.display_order || 0))
            .map((item) => String(item?.content || ""))
            .filter(Boolean);
          const termsAndConditions = information
            .filter((item) => ["TERMS", "TERM", "POLICY", "POLICIES"].includes(String(item?.type || "").toUpperCase()))
            .sort((a, b) => Number(a?.display_order || 0) - Number(b?.display_order || 0))
            .map((item) => String(item?.content || ""))
            .filter(Boolean);
          setMatchedVisa((prev) => prev ? {
            ...prev,
            inclusions: inclusions.length > 0 ? inclusions : prev.inclusions,
            termsAndConditions
          } : prev);
        })
        .catch((error) => console.error("Failed to load visa information:", error))
        .finally(() => {
          if (active) setInformationLoading(false);
        });
    };
    const loadVisa = async () => {
      try {
        setLoading(true);
        setError("");
        const categoryResponse = await getVisaCategories();
        const categories = getApiArray(categoryResponse) as VisaCategory[];
        if (!active) return;
        const basicPlans = [...categories.map(mapBasicPlan)].sort((a: any, b: any) => {
          const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;

          if (timeA && timeB && timeA !== timeB) {
            return timeB - timeA;
          }

          const idA = Number(a.visaCategoryId ?? a.id) || 0;
          const idB = Number(b.visaCategoryId ?? b.id) || 0;
          return idB - idA;
        });
        setAllPlans(basicPlans);
        const category = categories.find((item) => String(item.id) === String(visaId));
        if (!category) {
          setMatchedVisa(null);
          setError("Visa category not found.");
          setLoading(false);
          return;
        }
        setMatchedVisa(mapBasicPlan(category));
        setLoading(false);
        void loadExtraData(category);
      } catch (err: any) {
        console.error("Failed to load visa category:", err);
        if (!active) return;
        setMatchedVisa(null);
        setError(err?.response?.data?.message || err?.message || "Unable to load visa details.");
        setLoading(false);
      }
    };
    if (visaId) loadVisa();
    else {
      setMatchedVisa(null);
      setError("Visa category not found.");
      setLoading(false);
    }
    return () => {
      active = false;
    };
  }, [visaId]);
  if (loading) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center bg-gray-50">
        <div className="text-sm font-bold text-[#2D1347]">Loading visa details...</div>
      </div>
    );
  }
  if (!matchedVisa) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center py-24 px-4 bg-gray-50 text-center font-sans">
        <div className="w-20 h-20 rounded-3xl bg-pink-50 text-[#E91E63] flex items-center justify-center mb-6 shadow-sm border border-pink-100 ring-8 ring-pink-50/50">
          <Compass size={40} />
        </div>
        <h2 className="text-3xl font-black text-[#2D1347]">Visa Plan Not Found</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-md">{error || "We couldn't find the requested visa plan. Please browse all available visa services."}</p>
        <div className="flex gap-3 mt-8">
          <Link to="/service/visa-services" className="px-6 py-3 bg-[#E91E63] hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all">
            View All Visa Services
          </Link>
          <Link to="/" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full font-bold text-xs uppercase tracking-wider transition-all">
            Return Home
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen bg-[#FBFBFE] font-sans pt-16 sm:pt-12 md:pt-12 pb-12 sm:pb-16 print:min-h-0 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VisaCountryDetailView
          plan={matchedVisa}
          allPlans={allPlans}
          pricingLoading={pricingLoading}
          documentsLoading={documentsLoading}
          informationLoading={informationLoading}
          onSelectPlan={(newPlan) => navigate(`/visa-details/${newPlan.id}`)}
          onBack={() => navigate("/service/visa-services")}
        />
      </div>
    </div>
  );
};
export default VisaPackageDetails;
