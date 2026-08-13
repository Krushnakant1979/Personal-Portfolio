import HeroSection from '@/components/home/HeroSection';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import SkillsHighlight from '@/components/home/SkillsHighlight';

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <SkillsHighlight />
      <FeaturedProjects />
    </div>
  );
}
