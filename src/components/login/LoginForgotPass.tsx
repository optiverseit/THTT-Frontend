import { ArrowRight, Mail } from "lucide-react";
import React, { useState } from "react";

const LoginForgotPass = () => {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [data, setData] = useState({ email: "", phone: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4 backdrop-blur-md bg-gray-600/40 rounded-xl text-gray-300">
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-lg text-white font-bold">
              Enter email or phone
            </h3>
            <p className="text-xs font-semibold">
              We'll send an OTP to reset your password.
            </p>
          </div>
          <div className="text-sm font-bold">BACK</div>
        </div>

        <div className="backdrop-blur-xl  bg-gray-200/10 rounded-md p-2  flex justify-between mt-4">
          {["email", "phone"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setLoginMethod(m as "email" | "phone");
                setData((prev) => ({
                  ...prev,
                  email: m === "email" ? prev.email : "",
                  phone: m === "phone" ? prev.phone : "",
                }));
              }}
              className={`rounded-lg ${loginMethod === m ? "bg-pink-500 text-white" : ""} cursor-pointer w-full`}
            >
              <p className="py-1 tracking-widest text-sm">{m.toUpperCase()}</p>
            </button>
          ))}
        </div>

        <div className="flex flex-col mt-4">
          <label htmlFor="">
            {loginMethod === "email" ? "EMAIL ADDRESS" : "PHONE"}
          </label>
          <div className="input w-full rounded-xl backdrop-blur-md bg-gray-200/10 focus:outline-none">
            <input
              type={loginMethod === "email" ? "email" : "tel"}
              name={loginMethod === "email" ? "email" : "phone"}
              value={loginMethod === "email" ? data.email : data.phone}
              onChange={handleChange}
              placeholder={
                loginMethod === "email" ? "you@example.com" : "+9779800000000"
              }
              required
            />
            {<Mail size={14} />}
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 flex items-center justify-center rounded-xl bg-white shadow-lg shadow-pink-800/50 w-full py-2 text-purple-950 tracking-wide font-bold text-sm gap-2"
      >
        SEND OTP <ArrowRight size={14} strokeWidth={3} />
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

export default LoginForgotPass;
