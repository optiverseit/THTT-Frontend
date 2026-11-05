import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoutes/ProtecteRoutes";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ServicesPage from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import TravelGuide from "./pages/TravelGuide";
import Gallery from "./pages/Gallery";
import VideoVlog from "./pages/VideoVlog";
import NotFound from "./pages/NotFound";
import Packages from "./pages/Packages";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./pages/DashboardLayout";
import WorkPermit from "./pages/WorkPermit";
import DocumentationPage from "./pages/DocumentationPage";
import DocumentationDetailPage from "./pages/DocumentationDetailPage";
import SearchResults from "./pages/SearchResults";

// Page-level detail views (moved from deep component paths to pages/)
import VideoDetail from "./pages/VideoDetail";
import WorkPermitDetail from "./pages/WorkPermitDetail";
import PackageDetail, {
  PackageOverview,
  PackagePolicy,
  PackageFaq,
  PackageTestimonial,
} from "./pages/PackageDetail";
import VisaPackageDetail from "./pages/VisaPackageDetail";
import InsurancePackageDetail from "./pages/InsurancePackageDetail";
import HotelPackageDetail from "./pages/HotelPackageDetail";
import VehiclePackageDetail from "./pages/VehiclePackageDetail";


// Hotel sub-views
import HotelOverview from "./components/HotelPackageDetail/HotelOverview";
import HotelPolicy from "./components/HotelPackageDetail/HotelPolicy";
import HotelFaq from "./components/HotelPackageDetail/HotelFaq";
import HotelTestimonial from "./components/HotelPackageDetail/HotelTestimonial";

// Vehicle sub-views
import VehicleOverview from "./components/VehiclePackageDetail/VehicleOverview";
import VehiclePolicy from "./components/VehiclePackageDetail/VehiclePolicy";
import VehicleFaq from "./components/VehiclePackageDetail/VehicleFaq";
import VehicleTestimonial from "./components/VehiclePackageDetail/VehicleTestimonial";

// Login sub-views
import LoginForm from "./components/login/LoginForm";
import LoginOtp from "./components/login/LoginOtp";
import LoginDetails from "./components/login/LoginDetails";
import LoginForgotPass from "./components/login/LoginForgotPass";
import LoginResetPass from "./components/login/LoginResetPass";

// Register sub-views
import RegisterPage from "./components/register/RegisterPage";
import RegisterOtp from "./components/register/RegisterOtp";
import RegisterSuccess from "./components/register/RegisterSuccess";

// Contexts
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GlobalCurrencyProvider } from "./context/CurrencyContext";
import { FaqProvider } from "./context/FaqContext";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";

const MainLayout = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  /* Pages where the global footer should NOT appear */
  const hideFooter = location.pathname.startsWith("/dashboard");

  return (
    <>
      {/* Auto scroll to top on page change */}
      <ScrollToTop />

      {/* â”€â”€ 3-TIER HEADER (TopBar, NavBar, ServicesStrip) â”€â”€
          Rendered across all pages including the dashboard, exactly matching the home page. */}
      <div className="sticky top-0 z-50 print:hidden">
        <Header />
      </div>

      <Routes>
        {/* â”€â”€ HOME â”€â”€ */}
        <Route path="/" element={<Home />} />

        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />

        {/* â”€â”€ LOGIN (nested subroutes) â”€â”€ */}
        <Route path="/login" element={<Login />}>
          <Route index path="" element={<LoginForm />} />
          <Route path="otp" element={<LoginOtp />} />
          <Route path="details" element={<LoginDetails />} />
          <Route path="forgot-password" element={<LoginForgotPass />} />
          <Route path="reset-password" element={<LoginResetPass />} />
        </Route>

        {/* â”€â”€ REGISTRATION â”€â”€ */}
        <Route path="/register" element={<Register />}>
          <Route index path="" element={<RegisterPage />} />
          <Route path="otp" element={<RegisterOtp />} />
          <Route path="success" element={<RegisterSuccess />} />
        </Route>
        <Route path="/signup" element={<Register />}>
          <Route index path="" element={<RegisterPage />} />
          <Route path="otp" element={<RegisterOtp />} />
          <Route path="success" element={<RegisterSuccess />} />
        </Route>
        <Route path="/register-otp" element={<Register />}>
          <Route index element={<RegisterOtp />} />
        </Route>
        <Route path="/registration-success" element={<Register />}>
          <Route index element={<RegisterSuccess />} />
        </Route>

        {/* â”€â”€ USER DASHBOARD â”€â”€ */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* /dashboard â†’ main cards view */}
          <Route index element={<Dashboard tab="dashboard" />} />
          {/* /dashboard/user-profile */}
          <Route path="user-profile" element={<Dashboard tab="user-details" />} />
          {/* /dashboard/booking â†’ all bookings table */}
          <Route path="booking" element={<Dashboard tab="booking" />} />
          {/* /dashboard/booking/:serviceId â†’ filtered by service */}
          <Route path="booking/:serviceId" element={<Dashboard tab="booking" />} />
          {/* /dashboard/booking/:serviceId/:bookingId â†’ detail view */}
          <Route path="booking/:serviceId/:bookingId" element={<Dashboard tab="booking" />} />
        </Route>

        {/* â”€â”€ ABOUT â”€â”€ */}
        <Route path="/about" element={<About />} />

        {/* â”€â”€ CONTACT â”€â”€ */}
        <Route path="/contact" element={<Contact />} />

        {/* â”€â”€ SERVICES â”€â”€ */}
        <Route path="/service" element={<ServicesPage />} />
        <Route path="/service/:slug" element={<ServiceDetail />} />
        <Route path="/service/:slug/:tourId" element={<ServiceDetail />} />

        {/* â”€â”€ BLOG (Read Stories & Video Vlogs dual-mode) â”€â”€ */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/blog-details/:slug" element={<BlogDetail />} />

        {/* â”€â”€ TRAVEL GUIDE â”€â”€ */}
        <Route path="/travel-guide" element={<TravelGuide />} />

        {/* â”€â”€ GALLERY â”€â”€ */}
        <Route path="/gallery" element={<Gallery />} />

        {/* â”€â”€ PACKAGES (with nested subroutes) â”€â”€ */}
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:packageId" element={<PackageDetail />}>
          <Route index path="" element={<PackageOverview />} />
          <Route path="policies" element={<PackagePolicy />} />
          <Route path="faqs" element={<PackageFaq />} />
          <Route path="testimonies" element={<PackageTestimonial />} />
        </Route>
        {/* Legacy alias for old /details/:packageId */}
        <Route path="/details/:packageId" element={<PackageDetail />}>
          <Route index path="" element={<PackageOverview />} />
          <Route path="policies" element={<PackagePolicy />} />
          <Route path="faqs" element={<PackageFaq />} />
          <Route path="testimonies" element={<PackageTestimonial />} />
        </Route>

        {/* VISA DETAILS */}
        <Route path="/visa/:visaId" element={<VisaPackageDetail />} />
        <Route path="/visa-details/:visaId" element={<VisaPackageDetail />} />

        {/* INSURANCE DETAILS */}
        <Route path="/insurance/:insuranceId" element={<InsurancePackageDetail />} />
        <Route path="/insurance-details/:insuranceId" element={<InsurancePackageDetail />} />

        {/* HOTEL DETAILS */}
        <Route path="/hotels/:hotelId" element={<HotelPackageDetail />}>
          <Route index path="" element={<HotelOverview />} />
          <Route path="policies" element={<HotelPolicy />} />
          <Route path="faqs" element={<HotelFaq />} />
          <Route path="testimonies" element={<HotelTestimonial />} />
        </Route>
        <Route path="/hotel-details/:hotelId" element={<HotelPackageDetail />}>
          <Route index path="" element={<HotelOverview />} />
          <Route path="policies" element={<HotelPolicy />} />
          <Route path="faqs" element={<HotelFaq />} />
          <Route path="testimonies" element={<HotelTestimonial />} />
        </Route>

        {/* VEHICLE DETAILS */}
        <Route path="/vehicles/:vehicleId" element={<VehiclePackageDetail />}>
          <Route index path="" element={<VehicleOverview />} />
          <Route path="policies" element={<VehiclePolicy />} />
          <Route path="faqs" element={<VehicleFaq />} />
          <Route path="testimonies" element={<VehicleTestimonial />} />
        </Route>
        <Route path="/vehicle-details/:vehicleId" element={<VehiclePackageDetail />}>
          <Route index path="" element={<VehicleOverview />} />
          <Route path="policies" element={<VehiclePolicy />} />
          <Route path="faqs" element={<VehicleFaq />} />
          <Route path="testimonies" element={<VehicleTestimonial />} />
        </Route>

        {/* VIDEO VLOGS */}
        <Route path="/vlogs" element={<VideoVlog />} />
        <Route path="/watch/:videoId" element={<VideoDetail />} />

        {/* WORK PERMIT */}
        <Route path="/work-permit" element={<WorkPermit />} />
        <Route path="/work-permit/:id" element={<WorkPermitDetail />} />
        <Route path="/permit-details/:id" element={<WorkPermitDetail />} />

        {/* â”€â”€ DOCUMENTATION â”€â”€ */}
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/documentation/:id" element={<DocumentationDetailPage />} />

        {/* â”€â”€ SEARCH RESULTS â”€â”€ */}
        <Route path="/search" element={<SearchResults />} />

        {/* â”€â”€ 404 Catch-All Route â”€â”€ */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Global Footer â€” hidden on /dashboard */}
      {!hideFooter && (
        <div className="print:hidden">
          <Footer />
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      {/* GlobalCurrencyProvider makes the selected currency (NPR / USD / INR)
          and live exchange rate available to every component in the app. */}
      <GlobalCurrencyProvider>
        <FaqProvider>
          <MainLayout />
        </FaqProvider>
      </GlobalCurrencyProvider>
    </AuthProvider>
  );
}

export default App;
