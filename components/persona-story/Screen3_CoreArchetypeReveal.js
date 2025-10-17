// components/persona-story/Screen3_CoreArchetypeReveal.js

"use client";

import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to get all details for an archetype
const getArchetypeDetails = (archetype) => {
  switch (archetype) {
    case "Thinker":
      return {
        tagline: "The strategic mind — seeing patterns, defining clarity, and shaping the future.",
        gradientFrom: "#E0E7FF", // light blue
        gradientTo: "#345B9C", // deep blue
        textColor: "text-indigo-900",
        glowColor: "shadow-blue-300"
      };
    case "Empath":
      return {
        tagline: "The heart of collaboration — connecting people, nurturing ideas, and building trust.",
        gradientFrom: "#FBECD7", // soft peach
        gradientTo: "#E97B7B", // coral
        textColor: "text-red-900",
        glowColor: "shadow-red-300"
      };
    case "Tinkerer":
      return {
        tagline: "The hands-on innovator — you thrive on testing, improving, and building what others only imagine.",
        gradientFrom: "#E9D5FF", // soft lilac
        gradientTo: "#7E57C2", // violet
        textColor: "text-purple-900",
        glowColor: "shadow-purple-300"
      };
    case "Builder":
      return {
        tagline: "The engine of creation — turning plans into structure and bringing ideas to life.",
        gradientFrom: "#F2E3C6", // soft sand
        gradientTo: "#E57C23", // terracotta
        textColor: "text-amber-900",
        glowColor: "shadow-amber-300"
      };
    default:
      return {
        tagline: "A unique force within the cohort.",
        gradientFrom: "#f3f4f6",
        gradientTo: "#d1d5db",
        textColor: "text-gray-800",
        glowColor: "shadow-gray-300"
      };
  }
};

// Helper for DiceBear avatar URL (gender-neutral)
const getDiceBearAvatarUrl = (userData) => {
    const seed = encodeURIComponent(userData.Nickname);
    let style = 'bottts-neutral';
    let options = '';
    const archetype = userData.Primary_Archetype;
    const sanitizeHex = (hex) => hex.substring(1);
    switch (archetype) {
        case "Builder": style = 'adventurer-neutral'; options = `backgroundColor=${sanitizeHex('#E57C23')}`; break;
        case "Thinker": style = 'avataaars-neutral'; options = `backgroundColor=${sanitizeHex('#345B9C')}`; break;
        case "Tinkerer": style = 'pixel-art-neutral'; options = `backgroundColor=${sanitizeHex('#7E57C2')}`; break;
        case "Empath": style = 'bottts-neutral'; options = `primaryColor=${sanitizeHex('#E97B7B')}`; break;
    }
    return `https://api.dicebear.com/8.x/${style}/svg?seed=${seed}&${options}&size=128`;
};

export default function Screen3_CoreArchetypeReveal({ userData, onComplete }) {
  const details = useMemo(() => getArchetypeDetails(userData.Primary_Archetype), [userData.Primary_Archetype]);
  const avatarUrl = useMemo(() => getDiceBearAvatarUrl(userData), [userData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 10000); // 8-second duration for the scene
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="archetype-reveal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1 } }}
        exit={{ opacity: 0, transition: { duration: 1.5 } }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
        style={{ background: `radial-gradient(circle at center, ${details.gradientFrom}, ${details.gradientTo})` }}
      >
        {/* Avatar */}
        <motion.div
          className={`relative w-40 h-40 rounded-full mb-6 flex items-center justify-center bg-white/20`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 1, duration: 1.2, ease: 'circOut' } }}
        >
          <motion.div 
            className={`absolute inset-0 rounded-full ${details.glowColor} opacity-70`}
            animate={{ scale: [1, 1.15, 1], transition: { delay: 4, duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
          />
          <Image src={avatarUrl} alt="Your Avatar" width={128} height={128} unoptimized />
        </motion.div>

        {/* Text Sequence */}
        <motion.p
          className="text-xl text-black/80"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 2, duration: 0.8 } }}
        >
          At your core, you are a…
        </motion.p>

        <motion.h1
          className={`text-6xl md:text-7xl font-extrabold uppercase my-2 ${details.textColor}`}
          style={{ textShadow: '0 2px 20px rgba(255,255,255,0.5)' }}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 2.8, duration: 0.8, ease: 'easeOut' } }}
        >
          {userData.Primary_Archetype}
        </motion.h1>

        <motion.p
          className="text-lg text-black/90 max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 3.4, duration: 1.0 } }}
        >
          {details.tagline}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}