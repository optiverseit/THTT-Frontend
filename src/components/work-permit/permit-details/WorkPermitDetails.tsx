import { useParams, Link } from "react-router-dom";
import PermitBanner from "./PermitBanner";
import { workPermitCountries } from "../../../assets/data/mockData";
import AboutPermit from "./AboutPermit";
import CostDetails from "./CostDetails";
import PermitService from "./PermitService";
import { services } from "../../../assets/data/mockData";
import WorkPermitModal from "../../reuseable/modal/WorkPermitModal";
import { Globe, ArrowLeft } from "lucide-react";

const WorkPermitDetails = () => {
  const { id } = useParams<{ id: string }>();

  const selectedCountry = workPermitCountries.find(
    (i) => i.id.toLowerCase() === id?.toLowerCase() || i.name.toLowerCase() === id?.toLowerCase()
  );

  if (!id || !selectedCountry) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 bg-gray-50 text-center font-sans">
        <div className="w-20 h-20 rounded-3xl bg-pink-50 text-[#E91E63] flex items-center justify-center mb-5 shadow-xs border border-pink-100 ring-8 ring-pink-50/50">
          <Globe size={38} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#2D1347]">Country Not Found</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-md leading-relaxed">
          The requested country destination could not be found or does not have active labor permit documentation.
        </p>
        <Link
          to="/work-permit"
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-[#E91E63] hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all"
        >
          <ArrowLeft size={15} />
          <span>Back to Work Permits</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full mt-10 flex justify-center items-center bg-gray-100">
      <div className="max-w-7xl w-full">
        <PermitBanner id={id} country={selectedCountry} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12 mb-10">
          <AboutPermit id={id} country={selectedCountry} />
          <CostDetails />
        </div>
        <PermitService service={services} />
        <WorkPermitModal country={workPermitCountries} />
      </div>
    </div>
  );
};

export default WorkPermitDetails;
