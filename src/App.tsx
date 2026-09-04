import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ServicesPage from "./pages/Services";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";

import TravelGuide from "./pages/TravelGuide";
import Gallery from "./pages/Gallery";
import VideoVlog from "./pages/VideoVlog";
import VideoDetails from "./components/video-vlogs/VideoDetails";
import Packages from "./pages/Packages";
import PackageOverview from "./components/TravelPackage/PackageDetail/PackageOverview";
import PackageDetails from "./components/TravelPackage/PackageDetail/PackageDetails";
import PackagePolicy from "./components/TravelPackage/PackageDetail/PackagePolicy";
import PackageFaq from "./components/TravelPackage/PackageDetail/PackageFaq";
import PackageTestimonial from "./components/TravelPackage/PackageDetail/PackageTestimonial";
import Login from "./pages/Login";
import LoginForm from "./components/login/LoginForm";
import LoginOtp from "./components/login/LoginOtp";
import LoginDetails from "./components/login/LoginDetails";
import LoginForgotPass from "./components/login/LoginForgotPass";
import WorkPermit from "./pages/WorkPermit";
import WorkPermitOverview from "./components/work-permit/WorkPermitOverview";
import WorkPermitDetails from "./components/work-permit/permit-details/WorkPermitDetails";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GlobalCurrencyProvider } from "./context/CurrencyContext";

const MainLayout = () => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      {/* Auto scroll to top on page change */}
      <ScrollToTop />

      {/* ── 3-TIER HEADER (TopBar, NavBar, ServicesStrip) ──
          Rendered across all pages when user is NOT logged in.
          If logged in, these 3 navs are not applied. */}
      {!isLoggedIn && (
        <div className="sticky top-0 z-50">
          <Header />
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />

        {/* login */}
        <Route path="/login" element={<Login />}>
          <Route index path="" element={<LoginForm />} />
          <Route path="otp" element={<LoginOtp />} />
          <Route path="details" element={<LoginDetails />} />
          <Route path="forgot-password" element={<LoginForgotPass />} />
        </Route>

        <Route path="/about" element={<About />} />
        <Route path="/service" element={<ServicesPage/>} />
        <Route path="/blog" element={<Blog/>}/>
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/travel-guide" element={<TravelGuide />} />
        <Route path="/gallery" element={<Gallery />} />

        {/* packages */}
        <Route path="/packages" element={<Packages />} />
        <Route path="/details/:packageId" element={<PackageDetails />}>
          <Route index path="" element={<PackageOverview />} />
          <Route path="policies" element={<PackagePolicy />} />
          <Route path="faqs" element={<PackageFaq />} />
          <Route path="testimonies" element={<PackageTestimonial />} />
        </Route>

        {/* vlogs */}
        <Route path="/vlogs" element={<VideoVlog />} />
        <Route path="/watch/:videoId" element={<VideoDetails />} />

        {/* work permit */}
        <Route path="/work-permit" element={<WorkPermit />}>
          <Route index path="" element={<WorkPermitOverview />} />
        </Route>
        <Route path="/permit-details/:id" element={<WorkPermitDetails />} />
      </Routes>

      {/* Global Footer */}
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      {/* GlobalCurrencyProvider makes the selected currency (NPR or USD)
          and live exchange rate available to every component in the app. */}
      <GlobalCurrencyProvider>
        <MainLayout />
      </GlobalCurrencyProvider>
    </AuthProvider>
  );
}

export default App;
