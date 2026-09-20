import React from "react";
import RegisterPage from "../components/register/RegisterPage";

const Register: React.FC = () => {
  return (
    <div className="w-full relative bg-[#0e051b] flex flex-col justify-center items-center overflow-hidden pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 px-2 sm:px-4">
      {/* Ambient background glows matching deep purple Himalayan theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[420px] pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/25 via-purple-950/40 to-transparent blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-purple-900/20 blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-pink-900/15 blur-3xl pointer-events-none" />

      {/* Main Registration Card between 3-tier Header and Footer */}
      <div className="relative z-10 w-full">
        <RegisterPage />
      </div>
    </div>
  );
};

export default Register;
