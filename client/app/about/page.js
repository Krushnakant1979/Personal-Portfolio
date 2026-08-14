import AboutClient from '@/components/about/AboutClient';

export const metadata = {
  title: 'About | Krushnakant Rutele',
  description: 'Learn more about Krushnakant Rutele, a passionate Full-Stack developer.',
};

export default async function About() {
  let profile = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, { cache: 'no-store' });
    if (res.ok) {
      profile = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch profile in About Page:', err);
  }

  return <AboutClient profile={profile} />;
}
