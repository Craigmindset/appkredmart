import Image from "next/image";
import AboutHero from "@/components/about/about-hero";
import MissionVision from "@/components/about/mission";
import OurStory from "@/components/about/our-story";
export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#d0e6f5] bg-opacity-40">
        <AboutHero />
      </section>
      <MissionVision />
      <OurStory />
    </>
  );
}
