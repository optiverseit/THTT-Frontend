import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoutes/ProtecteRoutes";

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
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./pages/DashboardLayout";
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
  const location = useLocation();

  /* Pages where the global footer should NOT appear */
  const hideFooter = location.pathname.startsWith("/dashboard");

  return (
    <>
      {/* Auto scroll to top on page change */}
      <ScrollToTop />

      {/* ── 3-TIER HEADER (TopBar, NavBar, ServicesStrip) ──
          Rendered across all pages including the dashboard, exactly matching the home page. */}
      <div className="sticky top-0 z-50 print:hidden">
        <Header />
      </div>

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

        {/* ── REGISTRATION ── */}
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Register />} />

        {/* ── USER DASHBOARD ── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* /dashboard → main cards view */}
          <Route index element={<Dashboard tab="dashboard" />} />
          {/* /dashboard/user-profile */}
          <Route path="user-profile" element={<Dashboard tab="user-details" />} />
          {/* /dashboard/booking → all bookings table */}
          <Route path="booking" element={<Dashboard tab="booking" />} />
          {/* /dashboard/booking/:serviceId → filtered by service */}
          <Route path="booking/:serviceId" element={<Dashboard tab="booking" />} />
          {/* /dashboard/booking/:serviceId/:bookingId → detail view */}
          <Route path="booking/:serviceId/:bookingId" element={<Dashboard tab="booking" />} />
        </Route>

        {/* ── ABOUT ── */}
        <Route path="/about" element={<About />} />

        {/* ── SERVICES ── */}
        <Route path="/service" element={<ServicesPage />} />
        <Route path="/service/:slug" element={<ServiceDetail />} />
        <Route path="/service/:slug/:tourId" element={<ServiceDetail />} />

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

      {/* Global Footer — hidden on /dashboard */}
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
