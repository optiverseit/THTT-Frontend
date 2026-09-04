import React from "react";
import PackageSection from "../reuseable/packages/PackageSection";

const Packages: React.FC = () => {
  return (
    <div>
      <PackageSection
        title="Our Best Tour Packages"
        subtitle="HOT DEALS"
        type="tour"
        buttonText="VIEW ALL TOURS"
      />

      <PackageSection
        title="Our Best Trek Packages"
        subtitle="ADVENTURE CALLS"
        type="trek"
        buttonText="VIEW ALL TREKS"
      />
    </div>
  );
};

export default Packages;
