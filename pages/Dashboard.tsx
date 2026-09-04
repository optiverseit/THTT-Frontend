import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Camera,
  ShieldCheck,
  Briefcase,
  CreditCard,
  Settings,
  LogOut,
  Edit,
  Mail,
  Phone,
  MapPin,
  Globe2,
  KeyRound,
  BadgeCheck,
  Clock,
  Activity,
  ArrowRight,
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

type Section = "dashboard" | "profile" | "bookings" | "payments" | "settings";

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 mb-2">
    {children}
  </div>
);

function StatCard({
  label,
  val,
  icon: Icon,
  accent,
}: {
  label: string;
  val: string;
  icon: any;
  accent: string;
}) {
  return (
    <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all text-center">
      <div className={cn("mb-4 flex justify-center", accent)}>
        <Icon size={30} />
      </div>
      <div className="text-3xl font-black text-[#2D1347] mb-1">{val}</div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}

function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn" | "brand";
}) {
  const styles =
    tone === "good"
      ? "bg-green-50 text-green-600 border-green-100"
      : tone === "warn"
      ? "bg-amber-50 text-amber-600 border-amber-100"
      : tone === "brand"
      ? "bg-[#D92671]/10 text-[#D92671] border-[#D92671]/15"
      : "bg-slate-50 text-slate-600 border-slate-100";
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest",
        styles
      )}
    >
      {children}
    </span>
  );
}

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* modal box */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-7 flex items-center justify-between border-b border-slate-100">
            <div>
              <div className="text-[#D92671] text-[10px] font-black uppercase tracking-[0.3em]">
                Trip Himalaya
              </div>
              <h3 className="text-xl md:text-2xl font-black text-[#2D1347] mt-1">
                {title}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-all"
              aria-label="Close modal"
            >
              <X size={18} className="text-slate-600" />
            </button>
          </div>

          <div className="p-6 md:p-7">{children}</div>
        </div>
      </div>
    </div>
  );
}


const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  // If user missing -> redirect
  if (!user) {
    navigate("/login");
    return null;
  }

  // ===== Diagram-based assumptions / flags =====
  // Use these from backend later.
  const accountVerified = user?.isVerified ?? true; // demo: true
  const bookingExists = true; // demo
  const paymentExists = true; // demo

  // ===== Navigation state =====
  const [section, setSection] = useState<Section>("dashboard");
  const [editOpen, setEditOpen] = useState(false);

  // ===== Editable profile draft =====
  const [draft, setDraft] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
    countryCode:
      (user.phone?.startsWith("+") && user.phone.split(" ")[0]) || "+977",
    phone:
      (user.phone?.includes(" ") && user.phone.split(" ").slice(1).join(" ")) ||
      user.phone ||
      "",
    password: "",
    gender: user.gender || "Other",
    address: user.address || "",
    nationality: user.nationality || "Nepali",
  });

  // ===== Mock booking status (matches your mindmap) =====
  const bookingStatus = useMemo(() => {
    return {
      requestSent: true,
      requestStatus: "Approved", // Pending | Approved | Rejected
      bookingProgress: 70, // %
      bookingStatus: "Confirmed",
      paymentVerification: "Verified", // Not Verified | Verified
      paymentStatus: "Paid", // Unpaid | Paid | Failed
      remarks: "Bring passport, arrive 30 mins early.",
    };
  }, []);

  // ===== Mock payments (matches mindmap) =====
  const payment = useMemo(() => {
    return {
      paymentDate: "2026-02-05",
      paidBy: user.fullName,
      paymentTime: "13:25",
      paymentStatus: "Paid",
      receiptId: "TH-REC-01928",
    };
  }, [user.fullName]);

  // ===== Stats (top cards) =====
  const stats = [
    { label: "Booking Requests", val: "1", icon: Briefcase, accent: "text-[#5D2A8E]" },
    { label: "Booking Progress", val: `${bookingStatus.bookingProgress}%`, icon: Activity, accent: "text-blue-600" },
    { label: "Payment Status", val: bookingStatus.paymentStatus, icon: CreditCard, accent: "text-green-600" },
    { label: "Verification", val: accountVerified ? "Verified" : "Pending", icon: ShieldCheck, accent: "text-[#D92671]" },
  ];

  // ===== Save profile (front-end demo only) =====
  const saveProfile = () => {
    // Here you would call API and update user in parent/global store.
    // We'll just close modal.
    setEditOpen(false);
  };

  const lockedHint = "Locked after verification";

  return (
    <div className="bg-slate-50 min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ===== Welcome Header (mindmap: Welcome User Name + image + email/phone) ===== */}
        <div className="bg-[#2D1347] rounded-[3rem] p-10 md:p-14 mb-10 relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D92671]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5D2A8E]/15 rounded-full -ml-40 -mb-40 blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-[#D92671] overflow-hidden shadow-2xl bg-white/10 flex items-center justify-center">
                {user.photo ? (
                  <img src={user.photo} className="w-full h-full object-cover" alt="User" />
                ) : (
                  <User size={70} className="text-white/20" />
                )}
              </div>
              <button className="absolute bottom-1.5 right-1.5 bg-[#D92671] p-3 rounded-full shadow-lg hover:scale-110 transition-all">
                <Camera size={18} />
              </button>
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                <Pill tone="brand">Member</Pill>
                {accountVerified ? <Pill tone="good">Account Verified</Pill> : <Pill tone="warn">Verification Pending</Pill>}
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">
                Welcome, {String(user.fullName || "Traveler").split(" ")[0]}!
              </h1>

              <p className="text-white/70 font-medium">
                {user.email || "no-email"} • {user.phone || "no-phone"}
              </p>

              {/* <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <button
                  onClick={() => setSection("profile")}
                  className="bg-white text-[#2D1347] px-7 py-3.5 rounded-2xl font-black tracking-widest uppercase text-[10px] hover:bg-[#D92671] hover:text-white transition-all shadow-xl inline-flex items-center gap-2"
                >
                  View Profile <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => setSection("bookings")}
                  className="bg-white/10 border border-white/15 text-white px-7 py-3.5 rounded-2xl font-black tracking-widest uppercase text-[10px] hover:bg-white/15 transition-all inline-flex items-center gap-2"
                >
                  Booking Status <Briefcase size={16} />
                </button>

                <button
                  onClick={() => setSection("payments")}
                  className="bg-white/10 border border-white/15 text-white px-7 py-3.5 rounded-2xl font-black tracking-widest uppercase text-[10px] hover:bg-white/15 transition-all inline-flex items-center gap-2"
                >
                  Payments <CreditCard size={16} />
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* ===== Layout ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ===== Sidebar (mindmap: Dashboard -> sections) ===== */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-6">
              <nav className="space-y-2">
                {[
                  { key: "dashboard", name: "Dashboard", icon: Activity },
                  { key: "profile", name: "User Details", icon: User },
                  { key: "bookings", name: "Booking Status", icon: Briefcase },
                  { key: "payments", name: "Payments", icon: CreditCard }, 
                ].map((item: any) => {
                  const active = section === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setSection(item.key)}
                      className={cn(
                        "w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                        active
                          ? "bg-[#D92671] text-white shadow-lg"
                          : "text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      <item.icon size={18} />
                      <span>{item.name}</span>
                    </button>
                  );
                })}

                <div className="pt-6 mt-6 border-t border-slate-50">
                  <button
                    onClick={() => {
                      onLogout();
                      navigate("/");
                    }}
                    className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 text-xs font-black uppercase tracking-widest transition-all"
                  >
                    <LogOut size={18} />
                    <span>Logout Account</span>
                  </button>
                </div>
              </nav>
            </div>

            {/* Account Verification Card (mindmap: Account Verification) */}
            <div className="bg-[#5D2A8E] rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 opacity-10">
                <ShieldCheck size={210} />
              </div>

              <h3 className="text-xl font-black mb-4">Account Verification</h3>

              <div className="space-y-5 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                    {accountVerified ? (
                      <BadgeCheck className="text-green-300" size={22} />
                    ) : (
                      <AlertTriangle className="text-amber-300" size={22} />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-black">
                      {accountVerified ? "Verified" : "Pending"}
                    </div>
                    <div className="text-[11px] text-white/70 font-medium">
                      {accountVerified
                        ? "Email/Phone locked as per policy."
                        : "Verify to enable bookings & payments."}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span>Verification Level</span>
                    <span className={accountVerified ? "text-green-300" : "text-amber-300"}>
                      {accountVerified ? "100%" : "60%"}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full",
                        accountVerified ? "bg-green-300 w-full" : "bg-amber-300 w-[60%]"
                      )}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setEditOpen(true)}
                  className="w-full bg-white text-[#5D2A8E] py-3.5 rounded-2xl font-black tracking-widest uppercase text-[10px] hover:bg-[#D92671] hover:text-white transition-all"
                >
                  Update Details
                </button>
              </div>
            </div>
          </div>

          {/* ===== Main content ===== */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats grid (mindmap: Booking Card + quick overview) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, idx) => (
                <StatCard key={idx} label={s.label} val={s.val} icon={s.icon} accent={s.accent} />
              ))}
            </div>

            {/* ===== SECTION: DASHBOARD (Booking Card + quick cards) ===== */}
            {section === "dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Booking Card (mindmap: Booking Card) */}
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-lg font-black text-[#2D1347] flex items-center">
                      <Briefcase size={20} className="mr-3 text-[#D92671]" /> Booking Card
                    </h3>
                    <button
                      onClick={() => setSection("bookings")}
                      className="text-[10px] font-black text-[#D92671] uppercase tracking-widest hover:underline"
                    >
                      View
                    </button>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Current Status
                        </div>
                        <div className="text-2xl font-black text-[#2D1347] mt-1">
                          {bookingStatus.bookingStatus}
                        </div>
                      </div>

                      <Pill tone={bookingStatus.paymentStatus === "Paid" ? "good" : "warn"}>
                        {bookingStatus.paymentStatus}
                      </Pill>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-slate-500">
                        <span>Booking Progress</span>
                        <span>{bookingStatus.bookingProgress}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D92671]"
                          style={{ width: `${bookingStatus.bookingProgress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          Request Status
                        </div>
                        <div className="text-sm font-black text-[#2D1347] mt-1">
                          {bookingStatus.requestStatus}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          Payment Verification
                        </div>
                        <div className="text-sm font-black text-[#2D1347] mt-1">
                          {bookingStatus.paymentVerification}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <FileText size={16} />
                        <div className="text-[10px] font-black uppercase tracking-widest">
                          Remarks
                        </div>
                      </div>
                      <div className="text-sm font-bold text-[#2D1347] mt-2">
                        {bookingStatus.remarks}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity (keep your style, refined) */}
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                    <h3 className="text-lg font-black text-[#2D1347] flex items-center">
                      <Activity size={20} className="mr-3 text-[#5D2A8E]" /> Recent Activity
                    </h3>
                  </div>
                  <div className="p-8">
                    <div className="space-y-8 relative">
                      <div className="absolute top-0 bottom-0 left-[21px] w-px bg-slate-100"></div>

                      <div className="relative flex items-start space-x-6 group">
                        <div className="bg-green-500 w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20 shrink-0 z-10 group-hover:scale-110 transition-all">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#2D1347] mb-1">
                            Profile Verification Completed
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            Verified via OTP and social completion flow.
                          </p>
                          <span className="text-[9px] font-bold text-[#D92671] mt-2 block">
                            12 MIN AGO
                          </span>
                        </div>
                      </div>

                      <div className="relative flex items-start space-x-6 group">
                        <div className="bg-[#5D2A8E] w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg shadow-[#5D2A8E]/20 shrink-0 z-10 group-hover:scale-110 transition-all">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#2D1347] mb-1">
                            Booking Request Sent
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            Your request is now {bookingStatus.requestStatus}.
                          </p>
                          <span className="text-[9px] font-bold text-[#D92671] mt-2 block">
                            25 MIN AGO
                          </span>
                        </div>
                      </div>

                      <div className="relative flex items-start space-x-6 group">
                        <div className="bg-slate-100 w-11 h-11 rounded-full flex items-center justify-center text-slate-400 shrink-0 z-10">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-500 mb-1">
                            Payment {bookingStatus.paymentStatus}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            Payment verification: {bookingStatus.paymentVerification}.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== SECTION: PROFILE (mindmap: User Information Fill Correct Details + Edit) ===== */}
            {section === "profile" && (
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-lg font-black text-[#2D1347] flex items-center">
                    <User size={20} className="mr-3 text-[#D92671]" /> User Details
                  </h3>
                  <button
                    onClick={() => setEditOpen(true)}
                    className="text-[10px] font-black text-[#D92671] uppercase tracking-widest hover:underline flex items-center"
                  >
                    <Edit size={14} className="mr-1" /> Edit
                  </button>
                </div>

                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-slate-100 p-5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <User size={16} />
                        <div className="text-[10px] font-black uppercase tracking-widest">Full Name</div>
                      </div>
                      <div className="mt-2 text-sm font-black text-[#2D1347]">{user.fullName}</div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 p-5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Mail size={16} />
                        <div className="text-[10px] font-black uppercase tracking-widest">
                          Email {accountVerified && <span className="ml-2 text-[#D92671]">({lockedHint})</span>}
                        </div>
                      </div>
                      <div className="mt-2 text-sm font-black text-[#2D1347]">{user.email}</div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 p-5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Phone size={16} />
                        <div className="text-[10px] font-black uppercase tracking-widest">
                          Phone {accountVerified && <span className="ml-2 text-[#D92671]">({lockedHint})</span>}
                        </div>
                      </div>
                      <div className="mt-2 text-sm font-black text-[#2D1347]">{user.phone}</div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 p-5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Globe2 size={16} />
                        <div className="text-[10px] font-black uppercase tracking-widest">Nationality</div>
                      </div>
                      <div className="mt-2 text-sm font-black text-[#2D1347]">{user.nationality || "Nepali"}</div>
                    </div>

                    <div className="md:col-span-2 rounded-2xl border border-slate-100 p-5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin size={16} />
                        <div className="text-[10px] font-black uppercase tracking-widest">Address</div>
                      </div>
                      <div className="mt-2 text-sm font-black text-[#2D1347]">{user.address || "-"}</div>
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl bg-[#D92671]/5 border border-[#D92671]/10 p-5">
                    <div className="text-[#D92671] text-[10px] font-black uppercase tracking-[0.3em]">
                      Policy from your mindmap
                    </div>
                    <div className="mt-2 text-sm font-bold text-[#2D1347]">
                      Email, Country Code and Phone Number cannot be changed after verification.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== SECTION: BOOKINGS (mindmap: Booking status breakdown) ===== */}
            {section === "bookings" && (
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#2D1347] flex items-center">
                    <Briefcase size={20} className="mr-3 text-[#5D2A8E]" /> Booking Status
                  </h3>
                  <Pill tone={bookingStatus.requestStatus === "Approved" ? "good" : "warn"}>
                    {bookingStatus.requestStatus}
                  </Pill>
                </div>

                <div className="p-8 space-y-8">
                  <div className="grid md:grid-cols-3 gap-5">
                    <div className="rounded-2xl border border-slate-100 p-5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Booking Request Sent
                      </div>
                      <div className="mt-2 text-sm font-black text-[#2D1347]">
                        {bookingStatus.requestSent ? "Yes" : "No"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 p-5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Booking Status
                      </div>
                      <div className="mt-2 text-sm font-black text-[#2D1347]">
                        {bookingStatus.bookingStatus}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 p-5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Payment Verification
                      </div>
                      <div className="mt-2 text-sm font-black text-[#2D1347]">
                        {bookingStatus.paymentVerification}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-slate-500">
                      <span>Booking Progress</span>
                      <span>{bookingStatus.bookingProgress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D92671]"
                        style={{ width: `${bookingStatus.bookingProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Payment Status
                      </div>
                      <div className="mt-2 text-lg font-black text-[#2D1347]">
                        {bookingStatus.paymentStatus}
                      </div>
                      <div className="mt-3 text-[11px] font-medium text-slate-500">
                        If unpaid, you will see a “Pay Now” action here.
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white border border-slate-100 p-6">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Remarks
                      </div>
                      <div className="mt-2 text-sm font-bold text-[#2D1347]">
                        {bookingStatus.remarks}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 p-6 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Next action
                      </div>
                      <div className="mt-2 text-sm font-black text-[#2D1347]">
                        {bookingStatus.paymentStatus === "Paid"
                          ? "All set. We will contact you before departure."
                          : "Complete payment to confirm booking."}
                      </div>
                    </div>
                    <button
                      className={cn(
                        "px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all",
                        bookingStatus.paymentStatus === "Paid"
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-[#D92671] text-white hover:brightness-110"
                      )}
                      disabled={bookingStatus.paymentStatus === "Paid"}
                    >
                      {bookingStatus.paymentStatus === "Paid" ? "Paid" : "Pay Now"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ===== SECTION: PAYMENTS (mindmap: date, paid by, time, status, receipt) ===== */}
            {section === "payments" && (
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#2D1347] flex items-center">
                    <CreditCard size={20} className="mr-3 text-[#D92671]" /> Payments
                  </h3>
                  <Pill tone={payment.paymentStatus === "Paid" ? "good" : "warn"}>
                    {payment.paymentStatus}
                  </Pill>
                </div>

                <div className="p-8 grid md:grid-cols-2 gap-8">
                  <div className="rounded-2xl border border-slate-100 p-6 space-y-5">
                    <div className="flex items-center gap-2 text-slate-500">
                      <CheckCircle2 className="text-green-500" size={18} />
                      <div className="text-[10px] font-black uppercase tracking-widest">
                        Payment Details
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Payment Date
                        </div>
                        <div className="text-sm font-black text-[#2D1347] mt-1">
                          {payment.paymentDate}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Payment Time
                        </div>
                        <div className="text-sm font-black text-[#2D1347] mt-1">
                          {payment.paymentTime}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Paid By
                        </div>
                        <div className="text-sm font-black text-[#2D1347] mt-1">
                          {payment.paidBy}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-center justify-between">
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Receipt
                        </div>
                        <div className="text-sm font-black text-[#2D1347] mt-1">
                          {payment.receiptId}
                        </div>
                      </div>
                      <button className="px-5 py-2.5 rounded-2xl bg-[#D92671] text-white font-black uppercase tracking-widest text-[10px] hover:brightness-110 transition-all">
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 p-6 space-y-5">
                    <div className="flex items-center gap-2 text-slate-500">
                      <KeyRound className="text-[#5D2A8E]" size={18} />
                      <div className="text-[10px] font-black uppercase tracking-widest">
                        Payment Verification
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white border border-slate-100 p-5">
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Verification Status
                      </div>
                      <div className="mt-2 text-lg font-black text-[#2D1347]">
                        {bookingStatus.paymentVerification}
                      </div>
                      <div className="mt-2 text-[11px] font-medium text-slate-500">
                        Verified payments unlock booking confirmation.
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Notes
                      </div>
                      <div className="mt-2 text-sm font-bold text-[#2D1347]">
                        If your receipt doesn’t show, contact support with the receipt ID.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== SECTION: SETTINGS (simple placeholder) ===== */}
            {/* {section === "settings" && (
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                  <h3 className="text-lg font-black text-[#2D1347] flex items-center">
                    <Settings size={20} className="mr-3 text-[#5D2A8E]" /> Settings
                  </h3>
                </div>
                <div className="p-8">
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Coming next
                    </div>
                    <div className="mt-2 text-sm font-bold text-[#2D1347]">
                      Notification preferences, security, and login history.
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* ===== Edit Profile Modal (mindmap: User Details Edit + lock rules) ===== */}
        <Modal  open={editOpen} title="Edit User Details" onClose={() => setEditOpen(false)}>
          <div className="rounded-2xl  bg-[#D92671]/5 border border-[#D92671]/10 p-4 mb-6">
            <div className="text-[#D92671] text-[10px] font-black uppercase tracking-[0.3em]">
              Lock policy
            </div>
            <div className="mt-2 text-sm font-bold text-[#2D1347]">
              If account is verified, Email / Country Code / Phone cannot be changed.
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Full Name (editable) */}
            <div>
              <FieldLabel>Full Name</FieldLabel>
              <input
                value={draft.fullName}
                onChange={(e) => setDraft((p) => ({ ...p, fullName: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#D92671]/30"
                placeholder="Full Name"
              />
            </div>

            {/* Email (locked if verified) */}
            <div>
              <FieldLabel>
                Email {accountVerified && <span className="text-[#D92671]">({lockedHint})</span>}
              </FieldLabel>
              <input
                value={draft.email}
                onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
                disabled={accountVerified}
                className={cn(
                  "w-full rounded-2xl border px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2",
                  accountVerified
                    ? "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                    : "border-slate-200 bg-white focus:ring-[#D92671]/30"
                )}
                placeholder="Email"
              />
            </div>

            {/* Country Code (locked if verified) + Phone (locked if verified) */}
            <div className="md:col-span-2">
              <FieldLabel>
                Country Code & Phone {accountVerified && <span className="text-[#D92671]">({lockedHint})</span>}
              </FieldLabel>
              <div className="flex gap-3">
                <input
                  value={draft.countryCode}
                  onChange={(e) => setDraft((p) => ({ ...p, countryCode: e.target.value }))}
                  disabled={accountVerified}
                  className={cn(
                    "w-28 rounded-2xl border px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2",
                    accountVerified
                      ? "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                      : "border-slate-200 bg-white focus:ring-[#D92671]/30"
                  )}
                  placeholder="+977"
                />
                <input
                  value={draft.phone}
                  onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
                  disabled={accountVerified}
                  className={cn(
                    "flex-1 rounded-2xl border px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2",
                    accountVerified
                      ? "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                      : "border-slate-200 bg-white focus:ring-[#D92671]/30"
                  )}
                  placeholder="9801234567"
                />
              </div>
            </div>

            {/* Password (editable) */}
            <div>
              <FieldLabel>Password</FieldLabel>
              <input
                value={draft.password}
                onChange={(e) => setDraft((p) => ({ ...p, password: e.target.value }))}
                type="password"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#D92671]/30"
                placeholder="New Password"
              />
            </div>

            {/* Gender (editable) */}
            <div>
              <FieldLabel>Gender</FieldLabel>
              <select
                value={draft.gender}
                onChange={(e) => setDraft((p) => ({ ...p, gender: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#D92671]/30"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Address (editable) */}
            <div className="md:col-span-2">
              <FieldLabel>Address</FieldLabel>
              <input
                value={draft.address}
                onChange={(e) => setDraft((p) => ({ ...p, address: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#D92671]/30"
                placeholder="Kantipath, Kathmandu"
              />
            </div>

            {/* Nationality (editable) */}
            <div className="md:col-span-2">
              <FieldLabel>Nationality</FieldLabel>
              <select
                value={draft.nationality}
                onChange={(e) => setDraft((p) => ({ ...p, nationality: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#D92671]/30"
              >
                <option value="Nepali">Nepali</option>
                <option value="Indian">Indian</option>
                <option value="International">International</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={() => setEditOpen(false)}
              className="px-6 py-3 rounded-2xl border border-slate-200 bg-white text-slate-600 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={saveProfile}
              className="px-6 py-3 rounded-2xl bg-[#D92671] text-white font-black uppercase tracking-widest text-[10px] hover:brightness-110 transition-all"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
