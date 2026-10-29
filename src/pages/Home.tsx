import Banner from "../components/Home/Banner";
import PremiumTravel from "../components/Home/PremiumTravel";

import HomeHero from "../components/Home/HomeHero";
import CustomerTestimonial from "../components/Home/CustomerTestimonial";
import Packages from "../components/Home/Package";
import PreFooter from "../components/reusable/PreFooter";
import { SEO } from "../components/reusable";
import { pagesSEO } from "../config/seoConfig";

const Home = () => {
  return (
    <div className="relative w-full bg-white ">
      <SEO {...pagesSEO.home} />
      {/* components */}
      <Banner />
      <PremiumTravel />
      <HomeHero />
      <CustomerTestimonial />
      <Packages />
      <PreFooter
        title="Start Your Journey Today"
        description="Get a free consultation from our travel experts"
        btn1="Call Us Now"
        btn2="Get a Free Quote"
      />
    </div>
  );
};

export default Home;
