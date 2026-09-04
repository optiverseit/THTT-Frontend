import { useParams } from "react-router-dom";
import PermitBanner from "./PermitBanner";
import { workPermitCountries } from "../../../assets/data/mockData";
import AboutPermit from "./AboutPermit";
import CostDetails from "./CostDetails";
import PermitService from "./PermitService";
import { services } from "../../../assets/data/mockData";
import WorkPermitModal from "../../reuseable/modal/WorkPermitModal";

const WorkPermitDetails = () => {
  const { id } = useParams<{ id: string }>();

  const selectedCountry = workPermitCountries.find((i) => i.id === id);

  if (!id || !selectedCountry) {
    return <div>Country not found</div>;
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
