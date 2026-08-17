'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { ArrowRight, Download, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const HeroSection = ({ initialProfile = null }) => {
  const profile = initialProfile;

  const handleDownload = async (e, url) => {
    if (!url) return;
    if (url.includes('cloudinary')) {
      e.preventDefault();
      try {
        // Fetch the file as a blob to force download
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor element and trigger download
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'Krushnakant_Rutele_Resume.pdf';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Download failed, opening in new tab instead:', error);
        window.open(url, '_blank'); // Fallback to opening in new tab
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050505] -mt-16 sm:-mt-20 pt-16 sm:pt-20">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 w-full h-full relative">
        
        {/* Floating Email Below Navbar */}
        <div className="absolute top-4 left-6 sm:left-12 z-20 hidden md:block">
           <motion.a
             href={`mailto:${profile?.email || 'krushnakantrutele1979@gmail.com'}`}
             className="text-gray-400 text-sm hover:text-white transition-colors tracking-wide font-medium"
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 1.2 }}
           >
             {profile?.email || 'krushnakantrutele1979@gmail.com'}
           </motion.a>
        </div>

        {/* Background animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform, opacity, filter', transform: 'translateZ(0)' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ willChange: 'transform, opacity, filter', transform: 'translateZ(0)' }}
        />

        <div className="flex flex-col md:flex-row items-center justify-start md:justify-between h-full w-full min-h-[85vh] relative z-10 pb-10 pt-4 md:pt-0 gap-6 md:gap-0">
          
          {/* Left Column */}
          <div className="flex flex-col justify-center items-center text-center md:items-start md:text-left w-full md:w-1/3 z-20 md:pr-10 h-auto md:h-full mt-2 md:mt-0">
            <div className="mt-4 flex flex-col items-center md:items-start">
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Hi,
              </motion.h2>
              <motion.h1
                className="text-4xl sm:text-5xl md:text-[5.5rem] font-bold text-white tracking-tight mb-3 sm:mb-5 leading-none"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                I'm <span className="text-primary">Krushna</span>
              </motion.h1>
              <motion.h3
                className="text-base sm:text-xl md:text-2xl text-white font-medium mb-8 sm:mb-12 tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Full-Stack & App Developer
              </motion.h3>
              
              <motion.div
                className="mb-6 sm:mb-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Button href="/contact" className="bg-primary text-white hover:bg-primary-dark rounded-xl px-6 py-3 flex items-center gap-4 shadow-lg shadow-primary/20 group transition-all !font-medium w-auto inline-flex">
                  <span>Hire Me</span>
                  <span className="bg-white/20 p-1.5 rounded-lg group-hover:translate-x-1 transition-transform">
                     <ArrowRight size={16} strokeWidth={2.5} />
                  </span>
                </Button>
              </motion.div>
            </div>

            {/* Social Links Vertical */}
            <motion.div
              className="flex flex-row md:flex-col items-center md:items-start justify-center md:justify-end w-full md:w-auto mt-6 md:mt-auto mb-4 md:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
               <div className="flex md:flex-col flex-row space-x-6 md:space-x-0 md:space-y-6">
                 <motion.a href={profile?.github || 'https://github.com/krushnakantrutele'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"
                   whileHover={{ scale: 1.2, y: -2 }} transition={{ type: 'spring', stiffness: 400 }}>
                    <FaGithub size={20} />
                 </motion.a>
                 <motion.a href={profile?.linkedin || 'https://linkedin.com/in/krushnakantrutele'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"
                   whileHover={{ scale: 1.2, y: -2 }} transition={{ type: 'spring', stiffness: 400 }}>
                    <FaLinkedin size={20} />
                 </motion.a>
                 {profile?.instagram ? (
                   <motion.a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"
                     whileHover={{ scale: 1.2, y: -2 }} transition={{ type: 'spring', stiffness: 400 }}>
                      <FaInstagram size={20} />
                   </motion.a>
                 ) : (
                   <motion.a href={`mailto:${profile?.email || 'krushnakantrutele1979@gmail.com'}`} className="text-gray-400 hover:text-white transition-colors"
                     whileHover={{ scale: 1.2, y: -2 }} transition={{ type: 'spring', stiffness: 400 }}>
                      <FaInstagram size={20} />
                   </motion.a>
                 )}
               </div>
            </motion.div>
          </div>

          {/* Center Image Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative flex justify-center items-end w-full md:w-1/3 h-auto md:h-full pointer-events-auto opacity-100 z-10 md:z-20 md:translate-x-16 lg:translate-x-24 -mt-2 md:mt-0"
          >
             {/* Gradient overlays to blend the image perfectly into the black background */}
             <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050505] to-transparent z-10" />
             <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#050505] to-transparent z-10 hidden md:block" />
             <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#050505] to-transparent z-10 hidden md:block" />
             
             {/* Portrait */}
             <div className="relative w-[280px] h-[400px] sm:w-[350px] sm:h-[500px] md:w-[500px] md:h-[750px] mt-auto mx-auto">
               <Image 
                 src="/profile.jpg" 
                 alt="Krushnakant Rutele" 
                 fill 
                 priority={true}
                 className="object-cover object-top drop-shadow-2xl z-0 rounded-3xl" 
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                 }}
               />
             </div>
          </motion.div>
          
          {/* Right Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col justify-between w-full md:w-1/3 z-20 md:mt-0 md:pl-12 h-auto md:h-full min-h-min md:min-h-[500px] relative"
          >
            {/* Decorative Floating Elements */}
            <div className="absolute top-1/3 -right-6 lg:-right-12 hidden md:flex flex-col items-center gap-16 opacity-50 z-0">
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="relative w-6 h-6"
                 style={{ willChange: 'transform', transform: 'translateZ(0)' }}
               >
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary -translate-y-1/2" />
                  <div className="absolute top-0 left-1/2 w-[2px] h-full bg-primary -translate-x-1/2" />
               </motion.div>
               
               <motion.div 
                 animate={{ rotate: -360 }} 
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                 className="w-10 h-10 border-2 border-cyan-400/60 rounded-lg" 
                 style={{ willChange: 'transform', transform: 'translateZ(0)' }}
               />
               
               <motion.div
                 className="w-3 h-3 bg-white/60 rounded-full"
                 animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
               />
            </div>

            <div className="mt-auto md:mb-32 relative pt-0 md:pt-32 z-10">
               {/* Geometric Shapes with animation */}
               <div className="absolute top-0 left-16 hidden md:block">
                  <div className="relative w-[70px] h-[70px]">
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
                    />
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400" />
                    <div className="absolute -top-1 -right-2 w-[22px] h-[22px] rounded-full border-2 border-primary bg-[#050505] z-10" />
                  </div>
                  <motion.div
                    className="absolute top-[80px] left-[110px] w-[22px] h-[22px] rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
                  />
               </div>

               <motion.p
                 className="text-primary font-medium text-sm mb-4"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 0.6, delay: 0.9 }}
               >
                 Specialized in
               </motion.p>
               <motion.h3
                 className="text-xl md:text-[1.75rem] font-bold text-white mb-4 sm:mb-6 leading-tight max-w-[320px]"
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 1.0 }}
               >
                 Full-Stack & Android Developer based in India.
               </motion.h3>
               
               <motion.p
                 className="text-gray-400 text-[15px] leading-relaxed mb-8 max-w-[350px]"
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 1.1 }}
               >
                 I design and develop responsive websites, scalable backend systems, and user-friendly Android applications. I turn ideas into reliable digital products with clean interfaces, secure APIs, and smooth performance.
               </motion.p>
               
               <motion.a
                 href={profile?.resume || "/resume.pdf"}
                 onClick={(e) => handleDownload(e, profile?.resume || "/resume.pdf")}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center text-primary font-medium border-b border-primary/40 pb-1 hover:border-primary transition-colors group text-sm w-max cursor-pointer"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 0.6, delay: 1.2 }}
                 whileHover={{ x: 4 }}
               >
                  Download CV <Download size={14} className="ml-2 group-hover:translate-y-1 transition-transform" />
               </motion.a>
            </div>

            <motion.div
              className="mt-6 md:mt-auto self-end flex items-center group cursor-pointer relative z-30 mb-2 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
               <Link href="/contact" className="flex items-center">
                 <span className="text-white text-sm font-semibold mr-4 hover:text-primary transition-colors">Let's Chat</span>
                   <motion.div
                     className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center relative"
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.95 }}
                     style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                   >
                     <motion.div 
                       className="absolute inset-0 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] pointer-events-none"
                       animate={{ opacity: [0.4, 1, 0.4] }}
                       transition={{ duration: 2, repeat: Infinity }}
                       style={{ willChange: 'opacity' }}
                     />
                     <MessageSquare size={24} className="text-[#050505] relative z-10" />
                     <motion.div
                       className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#22c55e] rounded-full border-2 border-[#050505] z-10"
                       animate={{ scale: [1, 1.3, 1] }}
                       transition={{ duration: 1.5, repeat: Infinity }}
                       style={{ willChange: 'transform' }}
                     />
                  </motion.div>
               </Link>
            </motion.div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
