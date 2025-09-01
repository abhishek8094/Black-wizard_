"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ShippingFeatures from "@/app/components/ShippingFeatures";
import { slides } from "@/app/constant/constant";
import Link from "next/link";

export default function Slideshow() {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <>
    <div className="w-full max-w-screen-2xl mx-auto mb-12">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index}>
            <Link href={slide.link} target="_blank" rel="noopener noreferrer">
              <picture>
                {/* Mobile image */}
                <source media="(max-width: 768px)" srcSet={slide.mobile} />
                {/* Desktop image */}
                <img
                  src={slide.desktop}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-[400px] object-cover"
                  loading="lazy"
                />
              </picture>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
    <ShippingFeatures/>
    </>
  );
}
