// components/persona-story/Screen1_OpeningPortal.js

"use client";

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Screen1_OpeningPortal({ onComplete }) {

  // Automatically transition after the animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 6000); // Total duration for this screen before moving to the next

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="opening-portal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1.5 } }}
        exit={{ opacity: 0, transition: { duration: 1.5 } }}
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#E9E4F0] to-[#D3C3E0] overflow-hidden"
      >
        {/* Subtle background particles */}
        <div className="absolute inset-0 opacity-50">
          {/* You can add a subtle particle animation here if desired */}
        </div>

        {/* Central Glow */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { duration: 2.5, delay: 0.5, ease: 'easeOut' } }}
          className="absolute w-[400px] h-[400px] bg-white rounded-full blur-3xl opacity-30"
        />

        {/* Animated Lines */}
        <motion.div 
          initial={{ x: '-50%', y: '-100%', rotate: 25, scaleX: 0 }}
          animate={{ scaleX: 1, transition: { duration: 2, delay: 1, ease: 'circOut' } }}
          className="absolute w-[150vw] h-px bg-white/50 origin-left"
        />
        <motion.div 
          initial={{ x: '-50%', y: '200%', rotate: 15, scaleX: 0 }}
          animate={{ scaleX: 1, transition: { duration: 2, delay: 1.2, ease: 'circOut' } }}
          className="absolute w-[150vw] h-px bg-white/50 origin-right"
        />
         <motion.div 
          initial={{ y: '-50%', x: '-100%', rotate: 115, scaleY: 0 }}
          animate={{ scaleY: 1, transition: { duration: 2, delay: 1.4, ease: 'circOut' } }}
          className="absolute h-[150vh] w-px bg-white/50 origin-top"
        />

        {/* Text Content */}
        <div className="z-10 text-center font-light tracking-widest text-black/90">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1.5, delay: 2.5 } }}
            className="text-2xl md:text-3xl"
            style={{ textShadow: '0 2px 15px rgba(0,0,0,0.1)' }}
          >
            Welcome to the <span className="font-bold">MIB2026B</span> Tribe.
          </motion.h1>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}