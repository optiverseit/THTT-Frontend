import { useState } from "react";
import mountain from "../../assets/images/mountain.jpg";
import { CircleCheck } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

interface LoginPageHeaderProp {
  title: string;
  description?: string;
}

const LoginPage = () => {
  const tabs = [
    { name: "login", path: "" },
    { name: "otp", path: "otp" },
    { name: "details", path: "details" },
    { name: "forgot", path: "forgot-password" },
  ];

  const headers: Record<string, LoginPageHeaderProp> = {
    login: { title: "Login", description: "" },
    otp: { title: "Verify OTP", description: "First-time login requires verification." },
    forgot: { title: "Forgot Password", description: "Enter your email or phone to receive OTP" },
    details: { title: "Complete Details", description: "Please fill the missing information." },
  };

  const [activeTab, setActiveTab] = useState<"login" | "otp" | "details" | "forgot">("login");
  const navigate = useNavigate();
  const currentHeader = headers[activeTab];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      <div className="w-full flex flex-col md:flex-row min-h-[500px] md:h-auto rounded-2xl overflow-hidden shadow-2xl shadow-black">
        {/* Left panel — hidden on small mobile, shown md+ */}
        <div className="relative hidden md:block md:w-1/2">
          <img src={mountain} alt="Mountain" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-purple-900/35" />

          <div className="absolute top-6 left-6 tracking-widest text-xs font-bold flex items-center gap-2 text-white rounded-full backdrop-blur-md px-4 py-2 bg-white/10">
            <CircleCheck size={14} className="text-pink-500" />
            SECURE ACCESS
          </div>

          <div className="absolute px-8 bottom-8 text-white">
            <h1 className="text-2xl font-extrabold">Login that matches your flow.</h1>
            <p className="text-sm mt-3 text-white/80 leading-relaxed">
              Social login first time? We'll collect the missing details. Password login for first time? Verify via OTP. Forgot password? Reset with OTP.
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="bg-gradient-to-br from-purple-950/90 to-purple-950 w-full md:w-1/2">
          <div className="p-6 sm:p-8">
            {/* Mobile secure badge */}
            <div className="md:hidden flex items-center gap-2 text-pink-400 text-xs font-bold tracking-widest mb-4">
              <CircleCheck size={14} />
              SECURE ACCESS
            </div>

            <h3 className="text-pink-500 text-[10px] tracking-widest font-bold">THE HIMALAYA</h3>

            <h1 className="text-white font-extrabold text-2xl sm:text-3xl mt-1">
              {currentHeader.title}
            </h1>

            {currentHeader.description && (
              <p className="text-gray-400 text-sm mt-1">{currentHeader.description}</p>
            )}

            {/* Tabs */}
            <div className="text-gray-100 flex flex-wrap gap-2 mt-6">
              {tabs.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setActiveTab(item.name as "login" | "otp" | "details" | "forgot");
                  }}
                  className={`cursor-pointer backdrop-blur-xl border border-gray-500 rounded-full px-3 py-1 text-[10px] tracking-widest transition-colors ${
                    activeTab === item.name
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-gray-600/40 hover:bg-gray-600/60"
                  }`}
                >
                  {item.name.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
