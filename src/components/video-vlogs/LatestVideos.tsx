import React from "react";
import type { VideoPost } from "../../assets/data/types";
import { ChevronRight, Film } from "lucide-react";

interface VideoProps {
  vlogs: VideoPost[];
}

const LatestVideos: React.FC<VideoProps> = ({ vlogs }) => {
  const latestVlogs = [...vlogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="shadow-lg rounded-3xl ">
      <div className="bg-gray-100 p-6 rounded-t-3xl">
        <header className="text-xl font-black text-purple-950 flex items-center gap-2 rounded-3xl">
          <Film size={16} className="text-pink-600" />
          Latest Videos
        </header>
      </div>

      <div className="py-4 px-6">
        {latestVlogs.slice(0, 3).map((video) => (
          <div key={video.id} className="">
            <div className="flex items-center hover:bg-gray-100 p-2 rounded-2xl">
              <div>
                <p className="text-pink-500 text-xs font-semibold ">
                  {video.date}
                </p>
                <p className="text-purple-950 font-bold mb-2">{video.title}</p>
                <p className="text-xs text-gray-400 flex items-center gap-2 mb-6">
                  WATCH NOW <ChevronRight size={12} />
                </p>
              </div>
              <div className="w-20 h-20">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="rounded-xl aspect-square object-cover "
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center px-6 ">
        <button className="bg-purple-950 py-4 rounded-2xl text-white hover:bg-pink-600 w-full mb-4">
          VIEW ALL VIDEOS
        </button>
      </div>
    </div>
  );
};

export default LatestVideos;
