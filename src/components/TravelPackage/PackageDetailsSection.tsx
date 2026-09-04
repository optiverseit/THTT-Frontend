import React, { useState } from "react";
import type { Package } from "../../assets/data/types";
import PackageDetailsCard from "./PackageDetailsCard";

interface PackageProps {
  pkgs: Package[];
}

const ITEMS_PER_PAGE = 15;

const PackageDetailsSection: React.FC<PackageProps> = ({ pkgs }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(pkgs.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, pkgs.length);
  const currentPackages = pkgs.slice(startIndex, endIndex);

  return (
    <div className="w-full col-span-3 max-w-7xl">
      <div className="flex flex-col gap-6">
        {currentPackages.map((pkg) => (
          <PackageDetailsCard key={pkg.id} pkg={pkg} />
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="mb-4 text-gray-500 font-semibold text-sm ">
          SHOWING{" "}
          <span className="text-pink-500">
            {startIndex + 1}-{endIndex}
          </span>{" "}
          OF <span className="text-pink-500">{pkgs.length}</span>
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-center gap-2 ">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold
              ${
                currentPage === index + 1
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsSection;
