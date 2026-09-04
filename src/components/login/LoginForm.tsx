import { ArrowRight, Facebook, Lock, Mail, Phone } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface LoginFormProps {
  email?: string;
  phone?: string;
  password?: string;
}

const LoginForm = () => {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<LoginFormProps>({
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email: data.email || data.phone || "user@triphimalaya.com.np" });
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="text-gray-300">
      <div className="backdrop-blur-md  bg-gray-600/40 rounded-md p-2  flex justify-between">
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

      <div className="mt-6">
        <div className="flex flex-col">
          <label htmlFor="">
            {loginMethod === "email" ? "EMAIL ADDRESS" : "PHONE"}
          </label>
          <div className="input w-full rounded-xl backdrop-blur-md bg-gray-600/40 focus:outline-none">
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
            {loginMethod === "email" ? <Mail size={14} /> : <Phone size={14} />}
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <label htmlFor="">PASSWORD</label>
          <div className="input w-full rounded-xl backdrop-blur-md bg-gray-600/40 focus:outline-none">
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="********"
              required
            />
            <Lock size={14} />
          </div>
        </div>
      </div>

      <div className="mt-6 ">
        <div className="tracking-widest text-[10px] flex w-full justify-between cursor-pointer ">
          <p className="hover:text-pink-500">FORGOT PASSWORD?</p>
          <p className="hover:text-pink-500">CREATE ACCOUNT</p>
        </div>
        <button
          type="submit"
          className="mt-2 flex items-center justify-center rounded-xl bg-white shadow-lg shadow-pink-800/50 w-full py-2 text-purple-950 tracking-wide font-bold text-sm gap-2"
        >
          ENTER <ArrowRight size={14} strokeWidth={3} />
        </button>

        <div className="mt-8 ">
          <p>OR CONTINUE WITH</p>
          <div className="flex gap-2 w-full justify-between text-center">
            {["google", "facebook"].map((i) => (
              <button
                key={i}
                className={`${i === "google" ? "bg-white text-purple-950" : "bg-blue-500 text-white"} py-2 w-full rounded-xl mt-2 text-xs tracking-widest font-bold `}
              >
                <span className="flex items-center gap-1 justify-center">
                  {i === "facebook" ? <Facebook size={14} /> : ""}
                  {i.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
