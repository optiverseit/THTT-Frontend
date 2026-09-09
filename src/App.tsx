import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
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
import WorkPermit from "./pages/WorkPermit";

// Page-level detail views (moved from deep component paths to pages/)
import VideoDetail from "./pages/VideoDetail";
import WorkPermitDetail from "./pages/WorkPermitDetail";
import PackageDetail, {
  PackageOverview,
  PackagePolicy,
  PackageFaq,
  PackageTestimonial,
} from "./pages/PackageDetail";

// Login sub-views
import LoginForm from "./components/login/LoginForm";
import LoginOtp from "./components/login/LoginOtp";
import LoginDetails from "./components/login/LoginDetails";
import LoginForgotPass from "./components/login/LoginForgotPass";

// Contexts
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GlobalCurrencyProvider } from "./context/CurrencyContext";
import { FaqProvider } from "./context/FaqContext";

const MainLayout = () => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      {/* Auto scroll to top on page change */}
      <ScrollToTop />

      {/* ── 3-TIER HEADER (TopBar, NavBar, ServicesStrip) ──
          Rendered across all pages when user is NOT logged in.
          If logged in, the header is hidden. */}
      {!isLoggedIn && (
        <div className="sticky top-0 z-50">
          <Header />
        </div>
      )}

      <Routes>
        {/* ── HOME ── */}
        <Route path="/" element={<Home />} />

        {/* ── LOGIN (nested subroutes) ── */}
        <Route path="/login" element={<Login />}>
          <Route index path="" element={<LoginForm />} />
          <Route path="otp" element={<LoginOtp />} />
          <Route path="details" element={<LoginDetails />} />
          <Route path="forgot-password" element={<LoginForgotPass />} />
        </Route>

        {/* ── ABOUT ── */}
        <Route path="/about" element={<About />} />

        {/* ── SERVICES ── */}
        <Route path="/service" element={<ServicesPage />} />
        <Route path="/service/:slug" element={<ServiceDetail />} />

        {/* ── BLOG (Read Stories & Video Vlogs dual-mode) ── */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />

        {/* ── TRAVEL GUIDE ── */}
        <Route path="/travel-guide" element={<TravelGuide />} />

        {/* ── GALLERY ── */}
        <Route path="/gallery" element={<Gallery />} />

        {/* ── PACKAGES (with nested subroutes) ── */}
        <Route path="/packages" element={<Packages />} />
        <Route path="/details/:packageId" element={<PackageDetail />}>
          <Route index path="" element={<PackageOverview />} />
          <Route path="policies" element={<PackagePolicy />} />
          <Route path="faqs" element={<PackageFaq />} />
          <Route path="testimonies" element={<PackageTestimonial />} />
        </Route>

        {/* ── VIDEO VLOGS ── */}
        <Route path="/vlogs" element={<VideoVlog />} />
        <Route path="/watch/:videoId" element={<VideoDetail />} />

        {/* ── WORK PERMIT ── */}
        <Route path="/work-permit" element={<WorkPermit />} />
        <Route path="/permit-details/:id" element={<WorkPermitDetail />} />

        {/* ── 404 Catch-All Route ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Global Footer */}
      <Footer />
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
