import React from "react";
import { useParams } from "react-router-dom";
import { videoPosts } from "../../assets/data/mockData";
import YouTubePlayer from "./YouTubePlayer";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Facebook,
  MessageCircle,
  Share2,
  TrendingUp,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";

interface ShareMenu {
  name: string;
  icon: LucideIcon;
}

const VideoDetails: React.FC = () => {
  const { videoId } = useParams();

  const video = videoPosts.find((v) => v.id === videoId);

  if (!video) {
    return <div>Video not found</div>;
  }

  function getInitials(fullName: string) {
    const nameParts = fullName.trim().split(/\s+/);

    const initials = nameParts.map((part) => part.charAt(0)).join("");

    return initials.toUpperCase();
  }
  const nameInitials = getInitials(video.author);

  const shareMenu: ShareMenu[] = [
    {
      name: "FaceBook",
      icon: Facebook,
    },
    { name: "Twitter", icon: Twitter },
    { name: "Copylink", icon: Share2 },
  ];

  return (
    <div className="space-y-4 w-full ">
      <div className="bg-gray-900 flex justify-center">
        <div className="mt-8 mb-16">
          <div className="tracking-widest text-xs font-bold rounded-full backdrop-blur-xl text-white bg-gray-900/60 border border-gray-700 w-fit flex gap-2 items-center py-2 px-4">
            <ChevronLeft size={18} />
            <p>BACK TO VLOGS</p>
          </div>
          <YouTubePlayer videoUrl={video.videoUrl} />
          {/* details */}
          <div className="mt-6">
            <div className="flex gap-6 items-center text-xs font-semibold tracking-widest">
              <p className="text-white py-2 px-6 rounded-full bg-pink-600 ">
                {video.category}
              </p>
              <p className="flex items-center gap-2 text-gray-300">
                <Clock size={14} className="text-pink-500" />
                {video.duration}
              </p>
              <p className="flex items-center gap-2 text-gray-300 ">
                <Eye size={14} className="text-pink-500" />
                {video.views} VIEWS
              </p>
            </div>
            <h1 className="text-6xl font-bold text-white max-w-5xl mt-4">
              {video.title}
            </h1>

            <div className="text-white max-w-sm mt-8">
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <p className="text-white text-2xl bg-purple-950 p-3 rounded-2xl border-2 border-pink-600">
                    {nameInitials}
                  </p>
                  <div>
                    <label className="text-[10px] font-bold text-pink-600 tracking-widest">
                      UPLOADED BY
                    </label>
                    <p className="text-sm font-bold">
                      {video.author.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="h-10 w-0.5 bg-gray-500"></div>
                <div>
                  <label className="text-[10px] font-bold text-pink-600 tracking-widest">
                    RELEASE DATE
                  </label>
                  <p className="text-sm font-bold">
                    {video.date.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="flex justify-center mt-14">
        <div className="w-full max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* LEFT MAIN CONTENT */}
            <div className="md:col-span-2 space-y-6">
              {/* top menu */}
              <div className="flex justify-between items-center border-b border-b-gray-200 pb-4 text-purple-950">
                <div className="flex items-center gap-8 text-sm font-semibold ">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Youtube size={18} className="text-pink-500" />
                    <p>SUBSCRIBE</p>
                  </div>

                  <div className="flex items-center gap-2 cursor-pointer">
                    <MessageCircle size={18} />
                    <p>COMMENTS</p>
                  </div>
                </div>

                {/* Share Icons */}
                <div className="flex gap-4">
                  {shareMenu.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={index}
                        className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                      >
                        <Icon size={16} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ABOUT JOURNEY */}
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold  tracking-wide text-purple-950">
                  ABOUT THIS JOURNEY
                </h2>

                <p className="text-gray-800 font-bold text-lg italic mb-8">
                  {video.description}
                </p>

                <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-8">
                  {video.content}
                </p>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">
              <h3 className="font-bold flex items-center gap-2 text-purple-950">
                <TrendingUp size={16} className="text-pink-500" />
                MORE VISUALS
              </h3>

              {/* Example sidebar items */}
              <div className="space-y-4 ">
                {videoPosts.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="relative flex gap-3 cursor-pointer hover:opacity-80"
                  >
                    <img
                      src={item.thumbnail}
                      className="w-24 h-16 object-cover rounded-lg "
                    />

                    <div className="absolute bottom-1 left-14">
                      <span className="bg-black/70 backdrop-blur-sm px-2 p-1 rounded-full text-[10px]  text-white">
                        {item.duration}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-pink-500 font-semibold">
                        {item.category}
                      </p>
                      <p className="text-sm font-bold text-purple-950">
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="bg-pink-700 rounded-4xl shadow-lg py-12 px-16 text-white flex items-center flex-col ">
                  <h2 className="text-2xl font-bold mb-3">Feel The Vibe?</h2>
                  <p className="text-pink-100 mb-6 leading-relaxed">
                    Stop watching and start living. Book your custom adventure
                    today.
                  </p>
                  <button className="w-full bg-white text-pink-600 px-6 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-pink-50 transition-colors duration-200 shadow-md">
                    GET STARTED
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
