import { workPermitCountries } from "../../assets/data/mockData";
import { ArrowRight } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useNavigate } from "react-router-dom";

const PermitServices = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-blue-100/50 via-blue-50/50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h2 className="text-xs text-pink-500 tracking-widest font-bold mb-2 uppercase">
            DESTINATIONS
          </h2>
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-purple-950 font-extrabold">
            Our Work Permit Services
          </h1>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {workPermitCountries.map((c, index) => (
            <div
              key={index}
              className="rounded-2xl sm:rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all p-4 sm:p-5 flex flex-col items-center justify-between text-center border border-gray-100"
            >
              <div className="p-2 mb-2">
                {c.id === "other" ? (
                  <p className="text-4xl sm:text-5xl">{c.flag}</p>
                ) : (
                  <ReactCountryFlag
                    svg
                    countryCode={c.flag}
                    className="rounded-lg shadow-sm text-4xl sm:text-5xl"
                    style={{
                      width: "2.5em",
                      height: "2.5em",
                    }}
                  />
                )}
              </div>

              <h3 className="text-purple-950 font-extrabold text-base sm:text-lg mb-1">
                {c.name}
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">
                {c.desc}
              </p>

              <button
                onClick={() => navigate(`/permit-details/${c.id}`)}
                className="rounded-full tracking-wider bg-purple-50 hover:bg-pink-600 hover:text-white transition-colors text-purple-950 text-xs font-bold w-full py-2"
              >
                View Details
              </button>
            </div>
          ))}

          {/* See All Card */}
          <div className="rounded-2xl sm:rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all p-4 sm:p-5 flex flex-col justify-center items-center text-center border border-gray-100 cursor-pointer group">
            <div className="p-3 sm:p-4 bg-pink-600 group-hover:bg-pink-700 transition-colors flex items-center rounded-2xl justify-center text-white mb-3">
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="font-bold text-purple-950 text-sm sm:text-base">See All</p>
            <p className="text-gray-400 text-[10px] sm:text-xs uppercase font-bold tracking-wider">COUNTRIES</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermitServices;
