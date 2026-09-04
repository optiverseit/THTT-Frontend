import { ArrowRight, Key } from "lucide-react";
import React, { useState, useRef } from "react";

const LoginOtp = () => {
  const length = 6;
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move to next input
    if (value && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(otp);
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="p-4 backdrop-blur-md bg-gray-600/40 rounded-xl">
        <div className="flex gap-2">
          <div className="ring ring-pink-600 backdrop-blur-lg bg-pink-800/25 rounded-2xl flex justify-center items-center p-4 ">
            <Key size={18} className="text-pink-500" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg">OTP Vefication</h1>
            <p className="text-[10px] text-gray-300">
              Sent to your email or phone.
            </p>
          </div>
        </div>

        {/* otp input */}
        <div className="text-gray-200 tracking-widest text-[10px] mt-3">
          <p>ENTER 6-DIGIT OTP</p>
          <div className="flex gap-2 w-full mt-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el: HTMLInputElement | null) => {
                  inputs.current[index] = el;
                }}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className="w-16 h-12 text-center text-white rounded-xl 
                       bg-purple-900/20 backdrop-blur-md 
                       border border-purple-700 
                       focus:outline-none focus:border-pink-500 font-bold text-lg"
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between ">
            <p className="cursor-pointer hover:text-pink-500">BACK</p>
            <p
              onClick={() => {
                setOtp(Array(length).fill(""));
              }}
              className="cursor-pointer hover:text-pink-500"
            >
              CLEAR
            </p>
          </div>
        </div>
      </div>
      <button className="mt-4 cursor-pointer bg-white text-purple-950 items-center flex justify-center gap-2 rounded-xl py-3 w-full text-xs font-bold shadow-lg shadow-pink-800/50">
        <p>VERIFY & LOGIN </p>
        <ArrowRight size={14} strokeWidth={3} />
      </button>

      <div className="mt-8 flex justify-between w-full text-[10px] ">
        {["back to login", "create account"].map((i) => (
          <div
            className={`text-gray-300 hover:text-pink-500 font-bold cursor-pointer`}
            key={i}
          >
            {i.toUpperCase()}
          </div>
        ))}
      </div>
    </form>
  );
};

export default LoginOtp;
