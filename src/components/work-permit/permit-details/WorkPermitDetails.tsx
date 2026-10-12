import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useLocation, Link } from "react-router-dom";
import PermitBanner from "./PermitBanner";
import AboutPermit from "./AboutPermit";
import CostDetails from "./CostDetails";
import OtherServicesComponent from "../../reusable/OtherServicesComponent";
import { services } from "../../../assets/data/mockData";
import WorkPermitModal from "../WorkPermitModal";
import WorkPermitPrintDossier from "./WorkPermitPrintDossier";
import { Globe } from "lucide-react";
import {
  getWorkPermitDocumentRequirementsByType,
  getPermitFeeTiers,
} from "../../../api/BackendApi";
import { isSessionValid } from "../../../utils/sessionManager";

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

export interface DocumentRequirement {
  id: number;
  country_id: number;
  permit_type: string;
  document_type: string;
  title: string;
  description: string | null;
  is_required: boolean;
  display_order: number;
  status: string;
  country?: Country;
}

export interface PermitFeeTier {
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

const WorkPermitDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const rawPermitType = searchParams.get("permitType") || "NEW_LABOUR_PERMIT";
  const apiPermitType = rawPermitType;
  const defaultPermitType = rawPermitType.toLowerCase();

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [documentRequirements, setDocumentRequirements] = useState<DocumentRequirement[]>([]);
  const [feeTiers, setFeeTiers] = useState<PermitFeeTier[]>([]);
  const [loading, setLoading] = useState(true);
  const hasRestoredPostLoginRef = useRef(false);

  // Restore post-login state to automatically open the modal after successful login
  useEffect(() => {
    if (loading || !selectedCountry || hasRestoredPostLoginRef.current) return;

    let shouldOpen = false;
    const locationState = location.state as { openWorkPermitModal?: boolean } | null;
    if (locationState?.openWorkPermitModal) {
      shouldOpen = true;
    } else {
      try {
        const stored = sessionStorage.getItem("post_login_state");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.openWorkPermitModal) {
            shouldOpen = true;
          }
        }
      } catch (e) {
        console.error("Failed to parse post_login_state", e);
      }
    }

    if (shouldOpen && isSessionValid()) {
      hasRestoredPostLoginRef.current = true;
      try {
        sessionStorage.removeItem("post_login_state");
      } catch (e) {
        console.error("Failed to clear post_login_state", e);
      }

      setTimeout(() => {
        const modal = document.getElementById("work_permit_modal") as HTMLDialogElement;
        modal?.showModal();
      }, 300);
    }
  }, [loading, selectedCountry, location.state]);

  useEffect(() => {
    const fetchPermitDetails = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await getWorkPermitDocumentRequirementsByType(
          id,
          apiPermitType
        );

        console.log("WORK PERMIT DETAILS:", response.data);

        const requirements = response.data?.data ?? [];

        if (!Array.isArray(requirements) || requirements.length === 0) {
          setSelectedCountry(null);
          setDocumentRequirements([]);
          setFeeTiers([]);
          return;
        }

        setDocumentRequirements(requirements);

        const countryData = requirements[0]?.country ?? null;
        setSelectedCountry(countryData);

        if (countryData?.id) {
          try {
            const feeResponse = await getPermitFeeTiers(countryData.id, apiPermitType);
            const tiers = feeResponse.data?.data?.data ?? [];
            setFeeTiers(Array.isArray(tiers) ? tiers : []);
          } catch (err) {
            console.error("Failed to fetch permit fee tiers in WorkPermitDetails:", err);
            setFeeTiers([]);
          }
        } else {
          setFeeTiers([]);
        }
      } catch (error) {
        console.error("Failed to fetch work permit details:", error);
        setSelectedCountry(null);
        setDocumentRequirements([]);
        setFeeTiers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermitDetails();
  }, [id, apiPermitType]);

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
          The requested country destination could not be found or does not have
          active labor permit documentation.
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
      <WorkPermitPrintDossier
        id={id}
        country={selectedCountry}
        permitType={apiPermitType}
        documentRequirements={documentRequirements}
        feeTiers={feeTiers}
      />

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
              documentRequirements={documentRequirements}
            />

            <CostDetails
              country={selectedCountry}
              permitType={apiPermitType}
            />
          </div>

          <OtherServicesComponent service={services} />

          <WorkPermitModal
            country={[selectedCountry]}
            defaultCountry={selectedCountry.country_name}
            defaultPermitType={defaultPermitType}
            documentRequirements={documentRequirements}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkPermitDetails;