"use client";
import React, { useRef, useState } from "react";

const ShortsListing= () => {
  // Local shorts videos data from public folder
  const videos = [
    {
      id: 1,
      url: "/shorts/video1.mp4",
    },
    {
      id: 2,
      url: "/shorts/video2.mp4",
    },
    // Add more videos as needed
  ];

  const videoRefs = useRef([]);
  const [playingVideo, setPlayingVideo] = useState(null);

  const handlePlay = (index) => {
    setPlayingVideo(index);
    // Pause other videos
    videoRefs.current.forEach((video, i) => {
      if (i !== index && video) {
        video.pause();
      }
    });
  };

  const handlePause = () => {
    setPlayingVideo(null);
  };

  return (
    <section className="w-full bg-white mb-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          Shorts Video{" "}
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
          Explore our  engaging video shorts that deliver
          insights and highlights in just a few seconds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="relative w-full aspect-[9/14] bg-black rounded-lg overflow-hidden"
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                className="w-full h-full object-contain"
                src={video.url}
                title={video.title}
                playsInline
                controls
                onPlay={() => handlePlay(index)}
                onPause={handlePause}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShortsListing;
