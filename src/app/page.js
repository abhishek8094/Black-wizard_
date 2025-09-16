"use client";
import Crousel from "./home/crousel/page";
import LogoCarousel from "./home/logo-crousel/page";
import CollectionsList from "./home/collection-list/page";
import ExploreCollection from "./home/explore-collection/page";
import TrendingProducts from "./home/trending-products/page";
import Slideshow from "./home/slide-show/page";
import ShortsListing from "./home/background-video/page";

export default function Home() {
  return (
    <>
      <Crousel />
      <CollectionsList />
      <ExploreCollection/>
      <ShortsListing/>
      <LogoCarousel/>
      <TrendingProducts/>
      <Slideshow/>
    </>
  );
}
