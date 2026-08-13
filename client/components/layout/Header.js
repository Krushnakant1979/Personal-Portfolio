'use client';
import Link from 'next/link';
import { Menu, X, Lock, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Skills', href: '/skills' },
    { name: 'Projects', href: '/projects' },
    { name: 'Experience', href: '/experience' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/10' : 'bg-black/30 backdrop-blur-sm border-b border-white/5'}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex-shrink-0 flex items-center">
            {pathname !== '/' && (
              <button 
                onClick={() => router.back()} 
                className="md:hidden text-gray-300 hover:text-white transition-colors p-1.5 mr-2 rounded-md hover:bg-white/5"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tighter">
              Krushna<span className="text-primary">.</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors relative group ${pathname === link.href ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Admin Login Button (Desktop) */}
            <div className="hidden md:flex items-center">
              <Link
                href="/admin/login"
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                title="Admin Login"
              >
                <Lock size={16} />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-300 hover:text-white focus:outline-none p-1 rounded-md hover:bg-white/5 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen
                  ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={24} /></motion.div>
                  : <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={24} /></motion.div>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-[#050505]/98 backdrop-blur-xl"
          >
            <div className="px-4 pt-3 pb-6 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-3 text-base font-medium rounded-xl transition-colors ${pathname === link.href ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-3 mt-2 border-t border-white/10">
                <Link
                  href="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                >
                  <Lock size={15} className="mr-2" /> Admin Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
