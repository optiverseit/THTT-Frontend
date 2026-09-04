import React from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Home/Hero";
import ServicesWheel from "../components/Home/ServicesWheel";
import { packages, testimonials } from "../data/mockData";
import {
  CheckCircle2,
  Star,
  Quote,
  ArrowRight,
  Shield,
  Clock,
  Users,
  Award,
  Check,
} from "lucide-react";

interface HomeProps {
  onInquire: (service?: string) => void;
}

const Home: React.FC<HomeProps> = ({ onInquire }) => {
  const navigate = useNavigate();

  const tourPackages = packages
    .filter((p) => p.type === "tour" && p.isFeatured)
    .slice(0, 3);

  const trekPackages = packages
    .filter((p) => p.type === "trek" && p.isFeatured)
    .slice(0, 3);

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Safe & Legal",
      desc: "Fully licensed and accountable travel service.",
    },
    {
      icon: Clock,
      title: "Zero Hassle",
      desc: "Smooth planning, fast support, easy coordination.",
    },
    {
      icon: Users,
      title: "Local Experts",
      desc: "Authentic insights from experienced local specialists.",
    },
    {
      icon: Award,
      title: "Fair Pricing",
      desc: "Transparent pricing with no hidden surprises.",
    },
    {
      icon: Users,
      title: "24/7 Support",
      desc: "Real human assistance whenever you need it.",
    },
    {
      icon: Shield,
      title: "All-in-One Partner",
      desc: "Tours, treks, stays, transport and more in one place.",
    },
  ];

  return (
    <div className="overflow-hidden bg-white">
      <Hero onInquire={() => onInquire()} />
      <ServicesWheel />

      {/* Why Choose Us */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
          alt="Why Choose Us"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#12081e]/70 backdrop-blur-[2px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-white">
          <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-14">
            <span className="text-[#FF4FA3] font-black uppercase tracking-[0.28em] text-[10px] sm:text-xs">
              The THTT Edge
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              Why Choose Trip Himalaya?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed">
              More than bookings—we take responsibility for your journey from
              start to finish, so you travel with confidence and return with
              unforgettable memories.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 sm:gap-6">
            {whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/15 bg-white/8 p-4 sm:p-5 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/12 hover:-translate-y-1"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                  <item.icon size={22} className="text-white" />
                </div>

                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[11px] sm:text-xs leading-relaxed text-white/70 font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-20">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#D92671]/5 blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#5D2A8E]/5 blur-3xl -ml-32 -mb-32" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#2D1347] tracking-tight">
              What Our Customers Say
            </h2>

            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="h-1 w-8 sm:w-10 rounded-full bg-[#D92671]" />
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                Trusted by real clients
              </p>
              <div className="h-1 w-8 sm:w-10 rounded-full bg-[#D92671]" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white p-5 sm:p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
              >
                <Quote
                  size={82}
                  className="pointer-events-none absolute -top-5 -right-5 text-slate-100 transition-all duration-500 group-hover:text-[#D92671]/10"
                />

                <div className="relative z-10 mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="h-12 w-12 rounded-2xl object-cover border border-slate-100 shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 rounded-full border border-white bg-green-500 p-1 text-white shadow-md">
                        <Check size={8} strokeWidth={4} />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-black leading-tight text-[#2D1347]">
                        {t.name}
                      </h4>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        {t.country}
                      </p>
                    </div>
                  </div>

                  <div className="mt-1 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < t.rating ? "currentColor" : "none"}
                        className={
                          i < t.rating ? "text-yellow-400" : "text-slate-200"
                        }
                      />
                    ))}
                  </div>
                </div>

                <p className="relative z-10 flex-grow text-sm leading-relaxed text-[#2D1347]/80 font-semibold">
                  <span className="mr-1 font-serif text-xl text-[#D92671]">“</span>
                  {t.message}
                  <span className="ml-1 font-serif text-xl text-[#D92671]">”</span>
                </p>

                <div className="relative z-10 mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Verified Client
                  </span>

                  <div className="rounded-xl bg-[#D92671]/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-[#D92671] transition-all group-hover:bg-[#D92671] group-hover:text-white">
                    Testimonial
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <button
              onClick={() => navigate("/testimonials")}
              className="group inline-flex items-center gap-3 rounded-full bg-[#D92671] px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <span>See More Reviews</span>
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Tour Packages */}
      <section className="border-b border-slate-100 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-[#D92671] font-black uppercase tracking-[0.28em] text-[10px] sm:text-xs">
                Hot Deals
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#2D1347]">
                Our Best Tour Packages
              </h2>
            </div>

            <button
              onClick={() => navigate("/tour-packages")}
              className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#D92671]/5 px-5 sm:px-6 py-3 text-[11px] sm:text-sm font-black uppercase tracking-[0.16em] text-[#D92671] transition-all hover:bg-[#D92671] hover:text-white"
            >
              View All Tours <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tourPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="group flex flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute top-4 left-4 rounded-full bg-[#D92671] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                    {pkg.duration}
                  </div>

                  {pkg.price && (
                    <div className="absolute bottom-4 right-4 rounded-2xl bg-white px-4 py-2 text-sm font-black text-[#D92671] shadow-xl">
                      From {pkg.price}
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-7">
                  <h3 className="mb-5 text-xl sm:text-2xl font-black tracking-tight text-[#2D1347] transition-colors group-hover:text-[#D92671]">
                    {pkg.title}
                  </h3>

                  <ul className="mb-8 space-y-3">
                    {pkg.highlights.slice(0, 3).map((h, i) => (
                      <li
                        key={i}
                        className="flex items-start text-sm font-semibold text-slate-600"
                      >
                        <CheckCircle2
                          size={18}
                          className="mr-3 mt-0.5 shrink-0 text-[#D92671]"
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => onInquire(pkg.title)}
                    className="mt-auto w-full rounded-2xl bg-[#D92671] py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:-translate-y-0.5 hover:brightness-110"
                  >
                    Inquire Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trek Packages */}
      <section className="bg-[#5D2A8E]/5 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-[#D92671] font-black uppercase tracking-[0.28em] text-[10px] sm:text-xs">
                Adventure Calls
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#2D1347]">
                Our Best Trek Packages
              </h2>
            </div>

            <button
              onClick={() => navigate("/trek-packages")}
              className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#5D2A8E]/10 px-5 sm:px-6 py-3 text-[11px] sm:text-sm font-black uppercase tracking-[0.16em] text-[#5D2A8E] transition-all hover:bg-[#5D2A8E] hover:text-white"
            >
              View All Treks <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {trekPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="group flex flex-col overflow-hidden rounded-[2rem] border border-[#5D2A8E]/10 bg-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute top-4 left-4 rounded-full bg-[#5D2A8E] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                    {pkg.duration}
                  </div>

                  {pkg.price && (
                    <div className="absolute bottom-4 right-4 rounded-2xl bg-white px-4 py-2 text-sm font-black text-[#5D2A8E] shadow-xl">
                      From {pkg.price}
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-7">
                  <h3 className="mb-5 text-xl sm:text-2xl font-black tracking-tight text-[#2D1347] transition-colors group-hover:text-[#5D2A8E]">
                    {pkg.title}
                  </h3>

                  <ul className="mb-8 space-y-3">
                    {pkg.highlights.slice(0, 3).map((h, i) => (
                      <li
                        key={i}
                        className="flex items-start text-sm font-semibold text-slate-600"
                      >
                        <CheckCircle2
                          size={18}
                          className="mr-3 mt-0.5 shrink-0 text-[#5D2A8E]"
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => onInquire(pkg.title)}
                    className="mt-auto w-full rounded-2xl bg-[#5D2A8E] py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:-translate-y-0.5 hover:brightness-110"
                  >
                    Inquire Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#D92671] to-[#E91E63] py-14 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 text-center sm:px-6 lg:px-8 md:flex-row md:text-left">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Start Your Journey Today
            </h2>
            <p className="mt-3 text-sm sm:text-base md:text-lg font-semibold text-white/90">
              Get a free consultation from our travel experts.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
            <a
              href="tel:+9779800000000"
              className="inline-flex items-center justify-center rounded-full bg-[#2D1347] px-6 sm:px-8 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-xl transition-all hover:brightness-110"
            >
              Call Us Now
            </a>

            <button
              onClick={() => onInquire()}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 sm:px-8 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#D92671] shadow-xl transition-all hover:bg-slate-50"
            >
              Get Free Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;