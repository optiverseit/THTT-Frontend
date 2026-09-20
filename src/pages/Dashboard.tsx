import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Compass,
  Calendar,
  Heart,
  LogOut,
  MapPin,
  Shield,
  ArrowRight,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full min-h-screen bg-[#0d0519] text-white pt-24 sm:pt-28 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#241047] via-[#1f0d3e] to-[#170a30] border border-purple-800/40 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-lg shadow-pink-600/30">
                {user?.name ? user.name.charAt(0).toUpperCase() : "T"}
              </div>
              <div>
                <span className="text-[#ff3880] text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                  TRAVELER DASHBOARD
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Welcome, {user?.name || "Traveler"}!
                </h1>
                <p className="text-purple-200/70 text-xs sm:text-sm mt-1">
                  Ready to plan your next breathtaking Himalayan adventure?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/packages"
                className="bg-white hover:bg-gray-100 text-[#1e0d3d] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <span>Explore Packages</span>
                <ArrowRight size={14} />
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white border border-white/15 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-[#180b33] border border-purple-800/40 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Compass size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">0</div>
              <div className="text-xs text-purple-200/60 uppercase font-semibold tracking-wider">Booked Expeditions</div>
            </div>
          </div>

          <div className="bg-[#180b33] border border-purple-800/40 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">0</div>
              <div className="text-xs text-purple-200/60 uppercase font-semibold tracking-wider">Active Inquiries</div>
            </div>
          </div>

          <div className="bg-[#180b33] border border-purple-800/40 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Heart size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">0</div>
              <div className="text-xs text-purple-200/60 uppercase font-semibold tracking-wider">Saved Trips</div>
            </div>
          </div>
        </div>

        {/* Profile Info & Activity Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Traveler Profile Card */}
          <div className="bg-[#180b33] border border-purple-800/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-800/30">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Shield size={16} className="text-pink-500" />
                <span>Profile Details</span>
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                VERIFIED
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center gap-3">
                <User size={15} className="text-purple-400 shrink-0" />
                <div>
                  <span className="text-purple-300/60 block text-[10px] uppercase font-bold">Full Name</span>
                  <span className="text-white font-medium">{user?.name || "Traveler"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={15} className="text-purple-400 shrink-0" />
                <div>
                  <span className="text-purple-300/60 block text-[10px] uppercase font-bold">Email Address</span>
                  <span className="text-white font-medium">{user?.email || "user@triphimalaya.com.np"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={15} className="text-purple-400 shrink-0" />
                <div>
                  <span className="text-purple-300/60 block text-[10px] uppercase font-bold">Phone</span>
                  <span className="text-white font-medium">{user?.phone || "+977 9801234567"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={15} className="text-purple-400 shrink-0" />
                <div>
                  <span className="text-purple-300/60 block text-[10px] uppercase font-bold">Region</span>
                  <span className="text-white font-medium">Nepal / South Asia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Expeditions */}
          <div className="lg:col-span-2 bg-[#180b33] border border-purple-800/40 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-white pb-3 border-b border-purple-800/30">
                Recent Activity & Bookings
              </h3>
              
              <div className="py-10 text-center space-y-2">
                <Compass size={36} className="mx-auto text-purple-400/40 animate-pulse" />
                <p className="text-white font-semibold text-sm">No Active Expeditions Yet</p>
                <p className="text-purple-200/60 text-xs max-w-sm mx-auto">
                  You haven't requested any trekking or holiday packages yet. Explore our curated Himalayan packages to start your adventure.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-purple-800/30 flex flex-wrap gap-3">
              <Link
                to="/packages"
                className="bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                Browse Trekking & Tours
              </Link>
              <Link
                to="/service"
                className="bg-white/10 hover:bg-white/20 text-purple-200 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                Visa & Permit Services
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
