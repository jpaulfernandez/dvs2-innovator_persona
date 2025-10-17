// components/persona-story/Screen10_YourSpark.js

"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const tribeColors = {
  Builder: '#3b82f6',
  Thinker: '#8b5cf6',
  Tinkerer: '#14b8a6',
  Empath: '#f97316',
};

export default function Screen10_YourSpark({ userData, onComplete }) {
  const userArchetypeColor = tribeColors[userData.Primary_Archetype] || '#ffffff'; // Fallback to white
  const router = useRouter(); // Initialize the router

  const handleReveal = (e) => {
    // Redirect to the new profile page
    e.stopPropagation();
    router.push(`/profile/${encodeURIComponent(userData.Email)}`);
  };
  useEffect(() => {
    // Auto-advance after 10-12 seconds as per storyboard
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 12000); // 12 seconds total for the scene
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      key="your-spark-constellation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1.5 } }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[#0a0a2a] text-white overflow-hidden"
    >
      {/* Background - Faint constellation effect (particles) */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0.5, scale: 1.2, filter: 'blur(5px)' }}
        animate={{ opacity: 0, scale: 1, filter: 'blur(0px)', transition: { delay: 1, duration: 4, ease: 'easeOut' } }}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${userArchetypeColor}30 0%, transparent 70%)`,
          backgroundSize: '300% 300%',
          animation: 'constellationPulse 20s infinite alternate', // Subtle background animation
        }}
      />
       {/* CSS for background animation */}
       <style jsx global>{`
        @keyframes constellationPulse {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
      `}</style>

      {/* Central Glowing Orb - The User's Spark */}
      <motion.div
        className="relative z-10 w-64 h-64 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: userArchetypeColor,
          boxShadow: `0 0 80px ${userArchetypeColor}, 0 0 120px ${userArchetypeColor}80`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 0.8, 1], // Zoom in and settle
          opacity: [0, 1, 0.7], // Fade in and pulse
          boxShadow: [
            `0 0 80px ${userArchetypeColor}, 0 0 120px ${userArchetypeColor}80`,
            `0 0 100px ${userArchetypeColor}, 0 0 150px ${userArchetypeColor}a0`,
            `0 0 80px ${userArchetypeColor}, 0 0 120px ${userArchetypeColor}80`,
          ],
          transition: {
            scale: { delay: 1, duration: 2, ease: 'easeOut' },
            opacity: { delay: 1, duration: 2, ease: 'easeOut' },
            boxShadow: { delay: 3, duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }
          }
        }}
      >
        <motion.p
          className="text-4xl font-bold"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 3, duration: 1 } }}
        >
          {userData.Primary_Archetype}
        </motion.p>
      </motion.div>

      {/* Narrative Text */}
      <motion.div
        className="absolute bottom-40 text-center z-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 4, duration: 1.5 } }}
      >
        <motion.p
          className="text-4xl md:text-5xl font-serif leading-tight mb-4" // Elegant serif
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 5, duration: 1 } }}
        >
          Every spark tells a story.
          <br />
          This one’s yours.
        </motion.p>
        <motion.p
          className="text-xl md:text-2xl font-sans text-white/80" // Clean sans
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 7, duration: 1 } }}
        >
          Discover your Innovator Profile — your tribe, your energy, your flow.
        </motion.p>
      </motion.div>

      {/* Reveal Button / Call to Action */}
      <motion.button
        className="absolute bottom-16 px-10 py-4 rounded-full text-xl font-bold bg-white text-[#0a0a2a] shadow-lg"
        style={{ boxShadow: `0 0 20px ${userArchetypeColor}80` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1, y: 0,
          boxShadow: [
            `0 0 10px ${userArchetypeColor}80`,
            `0 0 25px ${userArchetypeColor}`,
            `0 0 10px ${userArchetypeColor}80`
          ],
          transition: {
            delay: 9, // Appears after text
            duration: 0.8,
            boxShadow: { repeat: Infinity, duration: 2, ease: 'easeInOut', repeatType: 'reverse' }
          }
        }}
        whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${userArchetypeColor}, 0 0 50px ${userArchetypeColor}a0` }}
        whileTap={{ scale: 0.95 }}
        onClick={handleReveal}
      >
        Click to Reveal Your Innovator Profile
      </motion.button>
    </motion.div>
  );
}