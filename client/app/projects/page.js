import ProjectsList from '@/components/projects/ProjectsList';

export const metadata = {
  title: 'Projects | Krushnakant Rutele',
  description: 'Explore my portfolio of full-stack web applications and mobile apps.',
};

export default async function ProjectsPage() {
  let projects = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
      cache: 'no-store' // We want fresh data, or we can use next: { revalidate: 60 }
    });
    if (res.ok) {
      projects = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch projects server-side:', error);
  }

  return <ProjectsList initialProjects={projects} />;
}
