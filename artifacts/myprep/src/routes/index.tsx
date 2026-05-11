import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/landing/HeroSection";
import { PartnersMarquee } from "@/components/landing/PartnersMarquee";
import { ExamCategories } from "@/components/landing/ExamCategories";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TestimonialsCarousel } from "@/components/landing/TestimonialsCarousel";
import { HomeCMSSection } from "@/components/landing/HomeCMSSection";
import { CTASection } from "@/components/landing/CTASection";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <PartnersMarquee />
      <ExamCategories />
      <FeaturesSection />
      <HomeCMSSection />
      <TestimonialsCarousel />
      <CTASection />
    </div>
  );
}
