import Image from "next/image";
import AboutHero from "@/components/about/about-hero";
import MissionVision from "@/components/about/mission";
import OurStory from "@/components/about/our-story";
import WhyKredmart from "@/components/about/why-kredmart";
export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#d0e6f5] bg-opacity-40">
        {/* Background image (from public/bg-about.jpg) with reduced opacity */}
        <Image
          src="/bg-about.jpg"
          alt="About background"
          fill
          className="absolute inset-0 -z-10 object-cover opacity-20"
          priority={false}
        />
        <AboutHero />
      </section>
      <MissionVision />
      <OurStory />
      <WhyKredmart />
    </>
  );
}
