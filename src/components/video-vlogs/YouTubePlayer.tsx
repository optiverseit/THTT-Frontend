import React from "react";

interface YouTubePlayerProps {
  videoUrl: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoUrl }) => {
  return (
    <div className="w-full py-6 flex justify-center">
      <iframe
        className="w-7xl h-[720px] rounded-4xl shadow-2xl shadow-gray-950 "
        src={videoUrl}
        title="YouTube video player"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubePlayer;
