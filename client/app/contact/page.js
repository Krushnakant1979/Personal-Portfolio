import ContactClient from '@/components/contact/ContactClient';

export const metadata = {
  title: 'Contact | Krushnakant Rutele',
  description: 'Get in touch with Krushnakant Rutele for freelance projects or full-time opportunities.',
};

export default async function Contact() {
  let profile = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, { next: { revalidate: 30 } });
    if (res.ok) {
      profile = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch profile in Contact Page:', err);
  }

  return <ContactClient profile={profile} />;
}
