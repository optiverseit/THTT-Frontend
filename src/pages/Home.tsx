import Banner from "../components/Home/Banner";
import PremiumTravel from "../components/Home/PremiumTravel";

import HomeHero from "../components/Home/HomeHero";
import CustomerTestimonial from "../components/Home/CustomerTestimonial";
import Packages from "../components/Home/Package";
import PreFooter from "../components/reuseable/PreFooter";

const Home = () => {
  return (
    <div className="relative w-full bg-white ">
      {/* components */}
      <Banner />
      <PremiumTravel />
      <HomeHero />
      <CustomerTestimonial />
      <Packages />
      <PreFooter
        title="Start Your Journey Today"
        description="Get a free consultation from our travel experts"
        btn1="CALL US NOW"
        btn2="GET A FREE QUOTE"
      />
    </div>
  );
};

export default Home;
