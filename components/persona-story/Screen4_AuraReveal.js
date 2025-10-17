// components/persona-story/Screen4_AuraReveal.js

"use client";

import { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to get all details for an archetype (re-used from Screen3)
const getArchetypeDetails = (archetype) => {
  switch (archetype) {
    case "Thinker": return { avatarStyle: 'avataaars-neutral' };
    case "Empath": return { avatarStyle: 'bottts-neutral' };
    case "Tinkerer": return { avatarStyle: 'pixel-art-neutral' };
    case "Builder": return { avatarStyle: 'adventurer-neutral' };
    default: return { avatarStyle: 'bottts-neutral' };
  }
};

// Helper for DiceBear avatar URL (gender-neutral)
const getDiceBearAvatarUrl = (userData) => {
    const seed = encodeURIComponent(userData.Nickname);
    const archetypeDetails = getArchetypeDetails(userData.Primary_Archetype);
    const style = archetypeDetails.avatarStyle;
    return `https://api.dicebear.com/8.x/${style}/svg?seed=${seed}&size=128`;
};

// Helper to get descriptor-specific details
const getDescriptorDetails = (descriptor) => {
  switch (descriptor) {
    case "Still Current":
      return {
        text: "Still Current",
        symbol: "🌿",
        tagline: "You bring calm clarity in chaos — your quiet confidence steadies any room.",
        bgGradient: "radial-gradient(circle at center, #E3E8EF, #C5D9F4)", // Cool gray-blue
        particleColor: "rgba(255,255,255,0.4)",
        particleMotion: { scale: [1, 1.05, 1], opacity: [0.8, 0.5, 0.8], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } }
      };
    case "Momentum Seeker":
      return {
        text: "Momentum Seeker",
        symbol: "⚡",
        tagline: "You're a driving force—igniting action, pushing boundaries, and making things happen.",
        bgGradient: "radial-gradient(circle at center, #FFD480, #FFB74D)", // Sunny amber
        particleColor: "rgba(255,255,255,0.6)",
        particleMotion: { x: [0, 50, 0], y: [0, -30, 0], transition: { duration: 3, repeat: Infinity, ease: "linear" } }
      };
    case "Flow Hacker":
      return {
        text: "Flow Hacker",
        symbol: "🌀",
        tagline: "You adapt and create—navigating complexity with ease and finding harmony in change.",
        bgGradient: "radial-gradient(circle at center, #A5C7FF, #7DA3EB)", // Light blue gradient
        particleColor: "rgba(255,255,255,0.5)",
        particleMotion: { rotate: 360, transition: { duration: 6, repeat: Infinity, ease: "linear" } }
      };
    case "Empathic Pulse":
      return {
        text: "Empathic Pulse",
        symbol: "💫",
        tagline: "You connect and inspire—sensing the needs of others and fostering powerful bonds.",
        bgGradient: "radial-gradient(circle at center, #FBECD7, #FFAB91)", // Warm peach-cream
        particleColor: "rgba(255,255,255,0.7)",
        particleMotion: { scale: [1, 1.2, 1], opacity: [0.7, 0.9, 0.7], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }
      };
    default:
      return {
        text: "Unique Energy",
        symbol: "✨",
        tagline: "You bring a unique and powerful energy to your work.",
        bgGradient: "radial-gradient(circle at center, #f3f4f6, #d1d5db)",
        particleColor: "rgba(255,255,255,0.3)",
        particleMotion: {}
      };
  }
};

export default function Screen4_AuraReveal({ userData, onComplete }) {
  const avatarUrl = useMemo(() => getDiceBearAvatarUrl(userData), [userData]);
  const descriptor = userData.Primary_Descriptor;
  const descriptorDetails = useMemo(() => getDescriptorDetails(descriptor), [descriptor]);

  // Use a ref for background particles to animate them with unique delays
  const particlesRef = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 7000); // 7-second duration for the scene
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="aura-reveal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1.5 } }} // Fade in from previous screen
        exit={{ opacity: 0, transition: { duration: 1.5 } }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 overflow-hidden"
        style={{ background: descriptorDetails.bgGradient }} // Dynamic background
      >
        {/* Background Particles / Energy Motion */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: descriptorDetails.particleColor,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, ...descriptorDetails.particleMotion, transition: { ...descriptorDetails.particleMotion.transition, delay: Math.random() * 2 } }}
          />
        ))}

        {/* Avatar from Scene 3 (remains visible, but secondary) */}
        <motion.div
          className={`relative w-32 h-32 rounded-full mb-8 flex items-center justify-center bg-white/20`}
          initial={{ opacity: 0.8 }} // Already visible, so less dramatic initial
          animate={{ opacity: 1, scale: [1, 1.05, 1], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
        >
          <Image src={avatarUrl} alt="Your Avatar" width={128} height={128} unoptimized />
        </motion.div>

        {/* Text Sequence */}
        <motion.p
          className="text-xl text-black/80"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 1.0, duration: 0.8 } }}
        >
          Every innovator moves with a rhythm…
        </motion.p>

        <motion.p
          className="text-xl text-black/80 mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 2.0, duration: 0.8 } }}
        >
          Your creative energy is…
        </motion.p>

        <motion.h1
          className="text-5xl md:text-6xl font-bold uppercase my-4 text-black"
          style={{ textShadow: '0 2px 15px rgba(0,0,0,0.2)' }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 3.0, duration: 0.8, ease: 'easeOut' } }}
        >
          {descriptorDetails.symbol} {descriptorDetails.text}
        </motion.h1>

        <motion.p
          className="text-lg text-black/90 max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 4.0, duration: 1.0 } }}
        >
          {descriptorDetails.tagline}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}