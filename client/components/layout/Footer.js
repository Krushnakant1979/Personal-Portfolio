'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-2xl font-bold tracking-tighter">
              Krushna<span className="text-primary">.</span>
            </Link>
            <p className="text-gray-400 mt-2 max-w-xs">
              Full-Stack & App Developer building modern, scalable digital experiences.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-6 mb-4">
              <a href={profile?.github || 'https://github.com/krushnakantrutele'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <FaGithub size={20} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href={profile?.linkedin || 'https://linkedin.com/in/krushnakantrutele'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <FaLinkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href={`mailto:${profile?.email || 'krushnakantrutele1979@gmail.com'}`} className="text-gray-400 hover:text-primary transition-colors">
                <Mail size={20} />
                <span className="sr-only">Email</span>
              </a>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Krushnakant Rutele. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
