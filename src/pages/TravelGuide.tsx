import BannerSection from "../components/reusable/BannerSection";
import PreFooter from "../components/reusable/PreFooter";
import React, { useState, useEffect } from "react";
import { ChevronRight, Plane, Phone } from "lucide-react";
import { getTravelGuides } from "../api/BackendApi";

interface TravelGuideItem {
  id: number;
  title: string;
  description: string | null;
  status?: string;
  display_order?: number;
}

const TravelGuide: React.FC = () => {
  const [travelGuides, setTravelGuides] = useState<TravelGuideItem[]>([]);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGuideContent = async () => {
      try {
        setLoading(true);

        const response = await getTravelGuides();

        if (response?.data?.status && Array.isArray(response?.data?.data)) {
          const guides: TravelGuideItem[] = response.data.data;

          setTravelGuides(guides);

          // Select first travel guide by default
          if (guides.length > 0) {
            setActiveSection(guides[0].id);
          }
        } else {
          setTravelGuides([]);
        }
      } catch (error) {
        console.error("Failed to fetch travel guide:", error);
        setTravelGuides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGuideContent();
  }, []);

  const activeGuide =
    travelGuides.find((guide) => guide.id === activeSection) ||
    travelGuides[0] ||
    null;

  return (
    <div className="w-full bg-white h-full">
      <BannerSection
        background="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
        alt="Himalayan Peaks"
        heading="ESSENTIAL INFORMATION"
        title="Travel Guide"
        description="Your complete handbook for a safe and memorable journey in Nepal."
        contentClassName="-translate-y-1.5 sm:-translate-y-2 md:-translate-y-3"
      />

      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-[#2D1347] border-t-[#FF4FA3] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#2D1347] font-bold text-base">
              Loading travel guide...
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10 lg:gap-14">
            {/* Main Content */}
            <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8 md:p-12 lg:p-16 h-fit">
              {/* Header */}
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Plane className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-purple-950">
                  {activeGuide?.title?.toUpperCase() || "TRAVEL GUIDE"}

                  <div className="h-1 w-16 sm:w-20 bg-pink-500 rounded-full mt-2"></div>
                </h1>
              </div>

              {/* Content */}
              {activeGuide ? (
                <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-base sm:text-lg">
                  <p className="text-base sm:text-lg whitespace-pre-line">
                    {activeGuide.description || "No description available."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-base sm:text-lg">
                  <p className="text-base sm:text-lg">
                    No travel guide information is available.
                  </p>
                </div>
              )}

              {/* Contact Expert Section */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-purple-950 mt-1 sm:mt-2">
                    NEED MORE SPECIFIC HELP?
                  </h3>

                  <p className="text-sm sm:text-base text-gray-500">
                    Our travel experts are ready to assist you 24/7.
                  </p>
                </div>

                <button className="w-full sm:w-auto bg-purple-950 hover:from-purple-800 hover:to-purple-700 text-white px-8 sm:px-10 py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 text-center">
                  CONTACT EXPERT
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Travel Guide Menu */}
              <div className="bg-white rounded-4xl shadow-lg overflow-hidden">
                <div className="bg-blue-600 px-6 py-6 flex items-center justify-center">
                  <h2 className="text-white font-bold text-lg flex items-center justify-between gap-2">
                    TRAVEL GUIDE
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {travelGuides.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150 text-left group ${
                        activeSection === item.id
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : ""
                      }`}
                    >
                      <span
                        className={`font-medium ${
                          activeSection === item.id
                            ? "text-blue-600 "
                            : "text-gray-700"
                        } group-hover:text-blue-600 transition-colors`}
                      >
                        {item.title}
                      </span>

                      <ChevronRight
                        className={`w-5 h-5 ${
                          activeSection === item.id
                            ? "text-blue-600"
                            : "text-gray-400"
                        } group-hover:text-blue-600 transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-pink-500 rounded-3xl shadow-lg p-8 text-white">
                <h2 className="text-2xl font-bold mb-3">
                  Got Questions?
                </h2>

                <p className="text-pink-100 mb-6 leading-relaxed">
                  Planning a trip can be complex. Let us handle the details for
                  you.
                </p>

                <button className="w-full bg-white text-pink-600 px-6 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-pink-50 transition-colors duration-200 shadow-md">
                  <Phone className="w-5 h-5" />
                  CALL SUPPORT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PreFooter CTA */}
      <PreFooter
        title="Ready to Plan Your Nepal Expedition?"
        description="Get in touch with our local Himalayan travel experts for personalized guidance."
        btn1="Call Us Now"
        btn2="Get a Free Quote"
      />
    </div>
  );
};

export default TravelGuide;