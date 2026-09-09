import React from "react";
import { BookOpen, Video, Film } from "lucide-react";

export type BlogMode = "read" | "video";

interface BlogModeToggleProps {
  mode: BlogMode;
  onModeChange: (mode: BlogMode) => void;
  readCount?: number;
  videoCount?: number;
}

const BlogModeToggle: React.FC<BlogModeToggleProps> = ({
  mode,
  onModeChange,
  readCount,
  videoCount,
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-purple-100 shadow-lg shadow-purple-900/5">
      {/* Left: Mode Title & Context */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E91E63] to-[#880e4f] flex items-center justify-center text-white shadow-md shadow-pink-500/20">
          {mode === "read" ? <BookOpen size={20} /> : <Film size={20} />}
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E91E63] block">
            {mode === "read" ? "Editorial Journal" : "Visual Experience"}
          </span>
          <h3 className="text-base sm:text-lg font-black text-[#2D1347] tracking-tight">
            {mode === "read" ? "Himalayan Stories & Travel Guides" : "Curated Video Vlogs & Short Films"}
          </h3>
        </div>
      </div>

      {/* Right: Switch Pills */}
      <div className="inline-flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-inner w-full sm:w-auto">
        {/* Read Blog Tab */}
        <button
          type="button"
          onClick={() => onModeChange("read")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            mode === "read"
              ? "bg-white text-[#2D1347] shadow-md shadow-purple-900/10 scale-[1.02]"
              : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
          }`}
          aria-pressed={mode === "read"}
        >
          <BookOpen size={15} className={mode === "read" ? "text-[#E91E63]" : "text-slate-400"} />
          <span>Read Stories</span>
          {typeof readCount === "number" && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                mode === "read" ? "bg-pink-100 text-[#E91E63]" : "bg-slate-200 text-slate-600"
              }`}
            >
              {readCount}
            </span>
          )}
        </button>

        {/* Video Blog Tab */}
        <button
          type="button"
          onClick={() => onModeChange("video")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            mode === "video"
              ? "bg-white text-[#2D1347] shadow-md shadow-purple-900/10 scale-[1.02]"
              : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
          }`}
          aria-pressed={mode === "video"}
        >
          <Video size={15} className={mode === "video" ? "text-[#E91E63]" : "text-slate-400"} />
          <span>Video Vlogs</span>
          {typeof videoCount === "number" && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                mode === "video" ? "bg-pink-100 text-[#E91E63]" : "bg-slate-200 text-slate-600"
              }`}
            >
              {videoCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default BlogModeToggle;
