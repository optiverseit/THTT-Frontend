import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import type { VideoPost } from "../../assets/data/types";
import VideoGridSection from "./VideoGridSection";

interface FilterProps {
  id: number;
  name: string;
  value: string;
}

interface VideoProps {
  vlogs: VideoPost[];
}

const LatestVlogs: React.FC<VideoProps> = ({ vlogs }) => {
  const [selectedType, setSelectedType] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const type: FilterProps[] = [
    { id: 1, name: "All", value: "ALL" },
    { id: 2, name: "Adventure", value: "ADVENTURE" },
    { id: 3, name: "Destinations", value: "DESTINATIONS" },
    { id: 4, name: "Wildlife", value: "WILDLIFE" },
    { id: 5, name: "Luxury", value: "LUXURY" },
  ];

  const filteredVlogs = useMemo(() => {
    let filtered = vlogs;

    const selectedCategory = type.find((t) => t.id === selectedType);
    if (selectedCategory && selectedCategory.value !== "ALL") {
      filtered = filtered.filter(
        (vlog) => vlog.category.toUpperCase() === selectedCategory.value,
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((vlog) =>
        vlog.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return filtered;
  }, [vlogs, selectedType, searchQuery]);

  return (
    <div className="lg:col-span-2 h-fit">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-3 items-center">
          <div className="h-7 w-1 bg-pink-500 rounded-full" />
          <h2 className="text-xl sm:text-2xl font-black text-purple-950">Latest Vlogs</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-2 border border-gray-200 py-2 px-3 rounded-full text-sm bg-white focus-within:border-pink-500 transition-colors">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              className="bg-transparent focus:outline-none text-xs w-full sm:w-40"
              placeholder="Search Videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="text-xs font-bold text-white bg-purple-950 rounded-full px-4 py-2 hover:bg-purple-900 transition-colors">
            Read Blogs
          </button>
        </div>
      </header>

      {/* Filter Categories */}
      <div className="flex flex-wrap gap-2 mt-6">
        {type.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedType(t.id)}
            className={`px-3 sm:px-4 py-1.5 rounded-full border text-[11px] tracking-wider font-bold transition-all ${
              selectedType === t.id
                ? "bg-purple-950 text-white border-purple-950 shadow-sm"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {t.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Video Cards */}
      <div className="mt-6">
        <VideoGridSection vlogs={filteredVlogs} />
      </div>
    </div>
  );
};

export default LatestVlogs;
