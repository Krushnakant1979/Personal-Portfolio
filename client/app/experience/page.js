import ExperienceList from '@/components/experience/ExperienceList';

export const metadata = {
  title: 'Experience & Education | Krushnakant Rutele',
  description: 'My professional journey and academic background.',
};

export default async function ExperiencePage() {
  let experiences = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience`, {
      cache: 'no-store'
    });
    if (res.ok) {
      experiences = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch experiences server-side:', error);
  }

  return <ExperienceList initialExperiences={experiences} />;
}
