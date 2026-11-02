import React, { useMemo } from "react";

interface YouTubePlayerProps {
  videoUrl: string;
  autoplay?: boolean;
}

/**
 * Converts any standard YouTube URL (watch?v=, youtu.be/, shorts/, or embed)
 * into a valid, secure YouTube-nocookie embed URL with optimal parameters.
 */
export const getYouTubeEmbedUrl = (url?: string, autoplay = false): string => {
  if (!url) return "";

  // Check if it's already an embed URL
  const regExp = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = url.match(regExp);

  if (match && match[1]) {
    const videoId = match[1];
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1${
      autoplay ? "&autoplay=1" : ""
    }`;
  }

  // If already an embed link but without nocookie
  if (url.includes("youtube.com/embed/")) {
    const cleanUrl = url.replace("youtube.com/embed/", "youtube-nocookie.com/embed/");
    return autoplay && !cleanUrl.includes("autoplay=1")
      ? `${cleanUrl}${cleanUrl.includes("?") ? "&" : "?"}autoplay=1`
      : cleanUrl;
  }

  return url;
};

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoUrl, autoplay = false }) => {
  const resolvedUrl = useMemo(
    () => getYouTubeEmbedUrl(videoUrl, autoplay),
    [videoUrl, autoplay]
  );

  if (!resolvedUrl) {
    return (
      <div className="relative w-full aspect-video bg-gray-900 rounded-2xl flex items-center justify-center text-gray-400 text-sm font-semibold">
        Video preview currently unavailable
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
      <iframe
        className="w-full h-full"
        src={resolvedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
};

export default YouTubePlayer;
