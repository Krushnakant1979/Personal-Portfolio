import HeroSection from '@/components/home/HeroSection';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import SkillsHighlight from '@/components/home/SkillsHighlight';

export default async function Home() {
  let profile = null;
  let projects = [];
  let skills = [];

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Fetch all required data for the homepage in parallel
    const [profileRes, projectsRes, skillsRes] = await Promise.all([
      fetch(`${baseUrl}/api/profile`, { next: { revalidate: 30 } }),
      fetch(`${baseUrl}/api/projects`, { next: { revalidate: 30 } }),
      fetch(`${baseUrl}/api/skills`, { next: { revalidate: 30 } })
    ]);

    if (profileRes.ok) profile = await profileRes.json();
    
    if (projectsRes.ok) {
      const allProjects = await projectsRes.json();
      // Only pass featured projects to the client
      projects = allProjects.filter(p => p.featured).slice(0, 3);
    }
    
    if (skillsRes.ok) skills = await skillsRes.json();
    
  } catch (error) {
    console.error('Failed to fetch data for homepage server-side:', error);
  }

  return (
    <div className="w-full">
      <HeroSection initialProfile={profile} />
      <SkillsHighlight initialSkills={skills} />
      <FeaturedProjects initialProjects={projects} />
    </div>
  );
}
