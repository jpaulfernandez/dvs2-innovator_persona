// components/persona-story/Screen6_WhenInFlow.js

"use client";

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWater, FaBolt, FaInfinity, FaHeartbeat } from 'react-icons/fa';

// Helper to get all descriptor-specific details for this scene
const getFlowDetails = (descriptor) => {
  switch (descriptor) {
    case "Still Current":
      return {
        Icon: FaWater,
        flowTrigger: "…the path is clear and you can think deeply.",
        supportLine: "Your focus thrives in calm, creating space for profound insights.",
        bgGradient: "radial-gradient(circle, #E3E8EF, #C5D9F4)", // Cool gray-blue
        animation: {
          x: ["-5%", "5%", "-5%"],
          transition: { duration: 10, repeat: Infinity, ease: "linear" },
        },
      };
    case "Momentum Seeker":
      return {
        Icon: FaBolt,
        flowTrigger: "…there is a clear target and a challenge to meet.",
        supportLine: "Your energy is amplified by progress and tangible results.",
        bgGradient: "radial-gradient(circle, #FFD480, #FFB74D)", // Sunny amber
        animation: {
          x: ["-100%", "100%"],
          transition: { duration: 4, repeat: Infinity, ease: "linear" },
        },
      };
    case "Flow Hacker":
      return {
        Icon: FaInfinity,
        flowTrigger: "…you’re experimenting freely without a script.",
        supportLine: "Your curiosity thrives when structure bends—not breaks.",
        bgGradient: "radial-gradient(circle, #A5C7FF, #7DA3EB)", // Light blue
        animation: {
          rotate: [0, 360],
          transition: { duration: 12, repeat: Infinity, ease: "linear" },
        },
      };
    case "Empathic Pulse":
      return {
        Icon: FaHeartbeat,
        flowTrigger: "…you feel a genuine connection to the people and the purpose.",
        supportLine: "Your intuition is strongest when you’re part of a shared mission.",
        bgGradient: "radial-gradient(circle, #FBECD7, #FFAB91)", // Warm peach
        animation: {
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7],
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        },
      };
    default:
      return {
        Icon: FaInfinity,
        flowTrigger: "…you find your unique rhythm.",
        supportLine: "Your energy is a powerful asset to the team.",
        bgGradient: "radial-gradient(circle, #f3f4f6, #d1d5db)",
        animation: {},
      };
  }
};

export default function Screen6_WhenInFlow({ userData, onComplete }) {
  const details = useMemo(() => getFlowDetails(userData.Primary_Descriptor), [userData.Primary_Descriptor]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 8000); // 8-second duration for the scene
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="when-in-flow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1.5 } }}
        exit={{ opacity: 0, transition: { duration: 1.5 } }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 overflow-hidden"
        style={{ background: details.bgGradient }}
      >
        {/* Animated Background Elements */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl"
            style={{ top: `${i * 33}%` }}
            animate={details.animation}
          />
        ))}

        {/* Text Sequence */}
        <motion.p
          className="text-xl text-black/80"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 1.0, duration: 1 } }}
        >
          You enter flow when…
        </motion.p>

        <motion.h1
          className="text-4xl md:text-5xl font-bold my-4 text-black"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.1)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 2.0, duration: 1 } }}
        >
          {details.flowTrigger}
        </motion.h1>

        <motion.p
          className="text-lg text-black/90 max-w-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 3.5, duration: 1 } }}
        >
          {details.supportLine}
        </motion.p>
        
        {/* Optional Icon */}
        <motion.div
            className="text-black/30 text-8xl mt-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 4.5, duration: 1.5 } }}
        >
            <details.Icon />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}