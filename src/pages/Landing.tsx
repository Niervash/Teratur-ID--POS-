import { HeroSection } from '@/components/landing/HeroSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { RoadmapSection } from '@/components/landing/RoadmapSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { DemoFormSection } from '@/components/landing/DemoFormSection';
import { CTASection } from '@/components/landing/CTASection';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ChatbotFloating } from '@/components/layout/ChatbotFloating';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <LandingHeader />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <RoadmapSection />
      <TestimonialsSection />
      <DemoFormSection />
      <CTASection />
      <LandingFooter />
      <ChatbotFloating />
    </div>
  );
};

export default Landing;
