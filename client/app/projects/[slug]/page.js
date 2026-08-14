import ProjectDetailClient from '@/components/projects/ProjectDetailClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let project = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${slug}`, { next: { revalidate: 30 } });
    if (res.ok) {
      project = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch project for metadata:', err);
  }

  if (!project) {
    return {
      title: 'Project Not Found | Krushnakant Rutele'
    };
  }

  return {
    title: `${project.title} | Krushnakant Rutele`,
    description: project.shortDescription,
  };
}

export default async function ProjectDetail({ params }) {
  const { slug } = await params;
  let project = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${slug}`, { next: { revalidate: 30 } });
    if (res.ok) {
      project = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch project detail:', err);
  }

  return <ProjectDetailClient project={project} />;
}
