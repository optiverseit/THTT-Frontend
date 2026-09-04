import React from "react";
import { Shield, Clock, Users, Award } from "lucide-react";
import HeroSection from "../reuseable/HeroSection";

const HomeHero: React.FC = () => {
  return (
    <div className="w-full">
      <HeroSection
        title="The THTT Edge"
        subject="Why Choose Trip Himalaya?"
        description="More than bookings—we take responsibility for your entire journey, so you travel with confidence and return with stories worth keeping."
        backgroundImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
        services={[
          { name: "Safe & Legal", icon: Shield, info: "Fully licensed and accountable." },
          { name: "Zero Hassle", icon: Clock, info: "Smooth bookings, no chasing." },
          { name: "Local Experts", icon: Users, info: "Real insight from real locals." },
          { name: "Fair Pricing", icon: Award, info: "Transparent value, no surprises." },
          { name: "24/7 Human Support", icon: Users, info: "A real person, anytime." },
          { name: "All-in-One Partner", icon: Shield, info: "Everything handled in one place." },
        ]}
      />
    </div>
  );
};

export default HomeHero;
