import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import PermitBanner from "./PermitBanner";
import AboutPermit from "./AboutPermit";
import CostDetails from "./CostDetails";
import OtherServicesComponent from "../../reusable/OtherServicesComponent";
import { services } from "../../../assets/data/mockData";
import WorkPermitModal from "../WorkPermitModal";
import WorkPermitPrintDossier from "./WorkPermitPrintDossier";
import { Globe } from "lucide-react";
import { getCountryById } from "../../../api/BackendApi";
import { DEFAULT_WORK_PERMIT_TYPES, type WorkPermitType } from "./mockPermitData";

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

const WorkPermitDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  // Map search bar permit type shorthand → modal's internal permitType values
  const PERMIT_TYPE_MAP: Record<string, string> = {
    new: "new_labour_permit",
    renew: "renewal_permit",
    individual: "individual_permit",
  };
  const rawPermitType = searchParams.get("permitType") || "new";
  const defaultPermitType = PERMIT_TYPE_MAP[rawPermitType] ?? "new_labour_permit";

  const [selectedCountry, setSelectedCountry] =
    useState<Country | null>(null);

  const [loading, setLoading] = useState(true);

  /** Shared selected permit type — CostDetails updates it, AboutPermit reads it */
  const [activePermitType, setActivePermitType] =
    useState<WorkPermitType>(DEFAULT_WORK_PERMIT_TYPES[0]);

  /** Shared selected age group tier from CostDetails */
  const [activeAgeGroup, setActiveAgeGroup] =
    useState<string>("18-35 Years");

  const handlePermitTypeChange = useCallback((pt: WorkPermitType) => {
    setActivePermitType(pt);
  }, []);

  const handleAgeTierChange = useCallback((tier: { age_group_label: string }) => {
    setActiveAgeGroup((prev) => {
      if (prev === tier.age_group_label) return prev;
      return tier.age_group_label;
    });
  }, []);

  useEffect(() => {
    const fetchCountry = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await getCountryById(id);

        console.log("COUNTRY DETAILS:", response.data);

        const countryData =
          response.data?.data ?? null;

        setSelectedCountry(countryData);
      } catch (error) {
        console.error(
          "Failed to fetch country details:",
          error
        );

        setSelectedCountry(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-pink-100 border-t-[#E91E63] rounded-full animate-spin" />

        <p className="text-gray-500 text-sm mt-4 font-semibold">
          Loading work permit details...
        </p>
      </div>
    );
  }

  if (!id || !selectedCountry) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 bg-gray-50 text-center font-sans">

        <div className="w-20 h-20 rounded-3xl bg-pink-50 text-[#E91E63] flex items-center justify-center mb-5 shadow-xs border border-pink-100 ring-8 ring-pink-50/50">
          <Globe size={38} />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#2D1347]">
          Country Not Found
        </h2>

        <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-md leading-relaxed">
          The requested country destination could not be found or does
          not have active labor permit documentation.
        </p>

        <Link
          to="/work-permit"
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-[#E91E63] hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all"
        >
          Back to Work Permits
        </Link>

      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FBFBFE] font-sans pt-10 sm:pt-11 md:pt-12 pb-12 sm:pb-16 print:min-h-0 print:bg-white print:p-0 print:m-0">

      {/* PRINT-ONLY OFFICIAL DOSSIER */}
      <WorkPermitPrintDossier
        id={id}
        country={selectedCountry}
      />

      {/* ON-SCREEN UI */}
      <div className="print:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <PermitBanner
          id={id}
          country={selectedCountry}
        />

        <div className="w-full">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mt-8 sm:mt-12 mb-8 sm:mb-10">

            <AboutPermit
              id={id}
              country={selectedCountry}
              selectedPermitType={activePermitType}
              onPermitTypeChange={handlePermitTypeChange}
            />

            <CostDetails
              country={selectedCountry}
              selectedPermitType={activePermitType}
              onPermitTypeChange={handlePermitTypeChange}
              onAgeTierChange={handleAgeTierChange}
            />

          </div>

          <OtherServicesComponent service={services} />

          <WorkPermitModal
            country={[selectedCountry]}
            defaultCountry={selectedCountry.country_name}
            defaultPermitType={activePermitType?.modal_type_value || defaultPermitType}
            defaultAgeGroup={activeAgeGroup}
          />

        </div>
      </div>
    </div>
  );
};

export default WorkPermitDetails;