"use client";
import React from "react";

const BackgroundVideoSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white mb-12">
      {/* Background Video */}
      <div className="relative w-full aspect-video">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/n-feKlN7k58?autoplay=1&mute=1&controls=0&loop=1&playlist=n-feKlN7k58&modestbranding=1&playsinline=1"
          title="Unleash Your Power with Coitonic Compression T-Shirts"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Optional overlay for darkening */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content centered over video */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold">
            Unleash Your Power 💪🔥
          </h1>
          <p className="mt-4 text-lg md:text-xl">
            Share your brand story by adding a video to your store.
          </p>
          <a
            href="#"
            className="mt-6 inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition"
          >
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default BackgroundVideoSection;
