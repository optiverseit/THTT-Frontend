import React from "react";
import type { VideoPost } from "../../assets/data/types";
import VideoCard from "./VideoCard";

interface VideoGridProps {
  vlogs: VideoPost[];
}

const VideoGridSection: React.FC<VideoGridProps> = ({ vlogs }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-8">
      {vlogs.map((vlog) => (
        <VideoCard key={vlog.id} vlog={vlog} />
      ))}
    </div>
  );
};

export default VideoGridSection;
