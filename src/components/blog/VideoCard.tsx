import React from "react";
import type { VideoPost } from "../../assets/data/types";
import { Play, Eye, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VideoCardProps {
  vlog: VideoPost;
}

const VideoCard: React.FC<VideoCardProps> = ({ vlog }) => {
  const navigate = useNavigate();
  return (
    <div
      className="group cursor-pointer rounded-3xl shadow-lg h-120"
      onClick={() => navigate(`/watch/${vlog.id}`)}
    >
      {/* Thumbnail Container */}
      <div className="relative rounded-t-2xl overflow-hidden aspect-video  mb-4">
        <img
          src={vlog.thumbnail}
          alt={vlog.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-pink-600 uppercase tracking-wider">
            {vlog.category}
          </span>
        </div>

        {/* Duration Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
            {vlog.duration}
          </span>
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-pink-600">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 py-4 px-8">
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-pink-600" />
            <span>{vlog.views} VIEWS</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-pink-600" />
            <span>{vlog.date}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-purple-950 leading-tight group-hover:text-pink-600 transition-colors duration-300">
          {vlog.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">{vlog.description}</p>

        {/* Watch Video Link */}
        <button className="flex items-center gap-2 text-sm font-bold text-pink-500 hover:text-pink-600 transition-colors duration-200 mt-8">
          <span>WATCH VIDEO</span>
          <div className="bg-pink-500 ">
            <Play size={12} className="bg-white " />
          </div>
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
