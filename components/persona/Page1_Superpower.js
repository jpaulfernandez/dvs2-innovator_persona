// components/persona/Page1_Superpower.js

"use client"; // This component needs to be a client component for Framer Motion

import { FaBrain, FaHeart, FaWrench, FaHammer } from 'react-icons/fa';
import { motion } from "framer-motion"; // Import Framer Motion

// Helper function for archetype details (updated with consistent colors and icons)
const getArchetypeDetails = (archetype) => {
  switch (archetype) {
    case "Thinker":
      return {
        Icon: FaBrain,
        tagline: "The strategic mind — seeing patterns, defining clarity, and shaping the future.",
        iconBg: "bg-blue-600",
        iconColor: "text-blue-100",
        archetypeColor: "text-blue-700",
      };
    case "Empath":
      return {
        Icon: FaHeart,
        tagline: "The heart of collaboration — connecting people, nurturing ideas, and building trust.",
        iconBg: "bg-red-600",
        iconColor: "text-red-100",
        archetypeColor: "text-red-700",
      };
    case "Tinkerer":
      return {
        Icon: FaWrench,
        tagline: "The hands-on innovator — you thrive on testing, improving, and building.",
        iconBg: "bg-purple-600",
        iconColor: "text-purple-100",
        archetypeColor: "text-purple-700",
      };
    case "Builder":
      return {
        Icon: FaHammer,
        tagline: "The engine of creation — turning plans into structure and bringing ideas to life.",
        iconBg: "bg-amber-600",
        iconColor: "text-amber-100",
        archetypeColor: "text-amber-700",
      };
    default:
      return {
        Icon: FaBrain,
        tagline: "A unique force within the cohort.",
        iconBg: "bg-gray-600",
        iconColor: "text-gray-100",
        archetypeColor: "text-gray-700",
      };
  }
};

// Animation variants for staggered reveal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Delay between each child animation
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.6, duration: 0.8, ease: "easeOut" } },
};

export default function Page1_Superpower({ userData }) {
  const { Icon, tagline, iconBg, iconColor, archetypeColor } = getArchetypeDetails(userData.Primary_Archetype);

  return (
    <motion.div
      className="text-center text-gray-800 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Strengthened Story Hook */}
      <motion.p variants={itemVariants} className="text-2xl font-light mb-4">
        🌍 In the world of MIB2026B, every innovator carries a unique spark.
      </motion.p>
      <motion.p variants={itemVariants} className="text-3xl font-semibold mb-10">
        What’s yours?
      </motion.p>

      {/* 2. Icon with subtle zoom/glow & 4. Aura/Symbol Background */}
      <motion.div
        variants={iconVariants}
        className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto flex items-center justify-center mb-8 ${iconBg} shadow-xl overflow-hidden`}
      >
        {/* Subtle radial glow effect behind the icon */}
        <div className={`absolute inset-0 rounded-full ${iconBg} opacity-30 blur-2xl`}></div>
        <Icon className={`text-6xl md:text-7xl z-10 ${iconColor}`} />
      </motion.div>

      {/* Subtitle */}
      <motion.p variants={itemVariants} className="text-gray-700 text-md mb-2">
        At your core, you are a...
      </motion.p>

      {/* 3. Hierarchy & Typography: Archetype Title */}
      <motion.h1
        variants={itemVariants}
        className={`text-5xl md:text-6xl font-extrabold uppercase ${archetypeColor} text-gradient-shine`} // Apply shine effect
      >
        {userData.Primary_Archetype}
      </motion.h1>

      {/* Tagline */}
      <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-md mx-auto mt-4">
        {tagline}
      </motion.p>
      
      {/* 5. Cohort Context */}
      <motion.div variants={itemVariants} className="mt-12 text-gray-500 text-sm">
        <p>One of the 4 Innovation Tribes shaping MIB2026B.</p>
      </motion.div>
    </motion.div>
  );
}