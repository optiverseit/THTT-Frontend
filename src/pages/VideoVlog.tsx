import React from "react";
import BannerSection from "../components/reuseable/BannerSection";
import LatestVlogs from "../components/video-vlogs/LatestVlogs";
import { videoPosts } from "../assets/data/mockData";
import LatestVideos from "./../components/video-vlogs/LatestVideos";
import WeeklyVlogSub from "../components/video-vlogs/WeeklyVlogSub";

const VideoVlog: React.FC = () => {
  return (
    <div>
      <BannerSection
        background="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
        alt="Himalayan Peaks"
        heading="THE VISUAL JOURNAL"
        title="Video Vlogs"
        description="Watch the Himalayas come alive - curated vlogs, trek stories, and travel films."
      />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-14">
          <LatestVlogs vlogs={videoPosts} />
          <div>
            <LatestVideos vlogs={videoPosts} />
            <WeeklyVlogSub />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoVlog;
